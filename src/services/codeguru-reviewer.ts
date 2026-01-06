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

//# Newtypes
export type ClientRequestToken = string;
export type CodeReviewName = string;
export type AssociationArn = string;
export type Arn = string;
export type RecommendationId = string;
export type UserId = string;
export type Name = string;
export type ListCodeReviewsMaxResults = number;
export type NextToken = string;
export type MaxResults = number;
export type ListRecommendationsMaxResults = number;
export type Owner = string;
export type TagKey = string;
export type TagValue = string;
export type KMSKeyId = string;
export type ErrorMessage = string;
export type ConnectionArn = string;
export type S3BucketName = string;
export type StateReason = string;
export type PullRequestId = string;
export type AssociationId = string;
export type FilePath = string;
export type LineNumber = number;
export type Text = string;
export type BranchName = string;
export type LinesOfCodeCount = number;
export type FindingsCount = number;
export type RuleId = string;
export type RuleName = string;
export type ShortDescription = string;
export type LongDescription = string;
export type RuleTag = string;
export type CommitId = string;
export type RequestId = string;
export type Requester = string;
export type SourceCodeArtifactsObjectKey = string;
export type BuildArtifactsObjectKey = string;
export type EventName = string;
export type EventState = string;

//# Schemas
export type ProviderTypes = string[];
export const ProviderTypes = S.Array(S.String);
export type JobStates = string[];
export const JobStates = S.Array(S.String);
export type RepositoryNames = string[];
export const RepositoryNames = S.Array(S.String);
export type UserIds = string[];
export const UserIds = S.Array(S.String);
export type RecommendationIds = string[];
export const RecommendationIds = S.Array(S.String);
export type RepositoryAssociationStates = string[];
export const RepositoryAssociationStates = S.Array(S.String);
export type Names = string[];
export const Names = S.Array(S.String);
export type Owners = string[];
export const Owners = S.Array(S.String);
export type Reactions = string[];
export const Reactions = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DescribeCodeReviewRequest {
  CodeReviewArn: string;
}
export const DescribeCodeReviewRequest = S.suspend(() =>
  S.Struct({ CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/codereviews/{CodeReviewArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCodeReviewRequest",
}) as any as S.Schema<DescribeCodeReviewRequest>;
export interface DescribeRecommendationFeedbackRequest {
  CodeReviewArn: string;
  RecommendationId: string;
  UserId?: string;
}
export const DescribeRecommendationFeedbackRequest = S.suspend(() =>
  S.Struct({
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
    RecommendationId: S.String.pipe(T.HttpQuery("RecommendationId")),
    UserId: S.optional(S.String).pipe(T.HttpQuery("UserId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/feedback/{CodeReviewArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRecommendationFeedbackRequest",
}) as any as S.Schema<DescribeRecommendationFeedbackRequest>;
export interface DescribeRepositoryAssociationRequest {
  AssociationArn: string;
}
export const DescribeRepositoryAssociationRequest = S.suspend(() =>
  S.Struct({
    AssociationArn: S.String.pipe(T.HttpLabel("AssociationArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/associations/{AssociationArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRepositoryAssociationRequest",
}) as any as S.Schema<DescribeRepositoryAssociationRequest>;
export interface DisassociateRepositoryRequest {
  AssociationArn: string;
}
export const DisassociateRepositoryRequest = S.suspend(() =>
  S.Struct({
    AssociationArn: S.String.pipe(T.HttpLabel("AssociationArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/associations/{AssociationArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateRepositoryRequest",
}) as any as S.Schema<DisassociateRepositoryRequest>;
export interface ListCodeReviewsRequest {
  ProviderTypes?: ProviderTypes;
  States?: JobStates;
  RepositoryNames?: RepositoryNames;
  Type: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCodeReviewsRequest = S.suspend(() =>
  S.Struct({
    ProviderTypes: S.optional(ProviderTypes).pipe(T.HttpQuery("ProviderTypes")),
    States: S.optional(JobStates).pipe(T.HttpQuery("States")),
    RepositoryNames: S.optional(RepositoryNames).pipe(
      T.HttpQuery("RepositoryNames"),
    ),
    Type: S.String.pipe(T.HttpQuery("Type")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/codereviews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCodeReviewsRequest",
}) as any as S.Schema<ListCodeReviewsRequest>;
export interface ListRecommendationFeedbackRequest {
  NextToken?: string;
  MaxResults?: number;
  CodeReviewArn: string;
  UserIds?: UserIds;
  RecommendationIds?: RecommendationIds;
}
export const ListRecommendationFeedbackRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
    UserIds: S.optional(UserIds).pipe(T.HttpQuery("UserIds")),
    RecommendationIds: S.optional(RecommendationIds).pipe(
      T.HttpQuery("RecommendationIds"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRecommendationFeedbackRequest",
}) as any as S.Schema<ListRecommendationFeedbackRequest>;
export interface ListRecommendationsRequest {
  NextToken?: string;
  MaxResults?: number;
  CodeReviewArn: string;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    CodeReviewArn: S.String.pipe(T.HttpLabel("CodeReviewArn")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRecommendationsRequest",
}) as any as S.Schema<ListRecommendationsRequest>;
export interface ListRepositoryAssociationsRequest {
  ProviderTypes?: ProviderTypes;
  States?: RepositoryAssociationStates;
  Names?: Names;
  Owners?: Owners;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRepositoryAssociationsRequest = S.suspend(() =>
  S.Struct({
    ProviderTypes: S.optional(ProviderTypes).pipe(T.HttpQuery("ProviderType")),
    States: S.optional(RepositoryAssociationStates).pipe(T.HttpQuery("State")),
    Names: S.optional(Names).pipe(T.HttpQuery("Name")),
    Owners: S.optional(Owners).pipe(T.HttpQuery("Owner")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRepositoryAssociationsRequest",
}) as any as S.Schema<ListRepositoryAssociationsRequest>;
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
export interface PutRecommendationFeedbackRequest {
  CodeReviewArn: string;
  RecommendationId: string;
  Reactions: Reactions;
}
export const PutRecommendationFeedbackRequest = S.suspend(() =>
  S.Struct({
    CodeReviewArn: S.String,
    RecommendationId: S.String,
    Reactions: Reactions,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/feedback" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRecommendationFeedbackRequest",
}) as any as S.Schema<PutRecommendationFeedbackRequest>;
export interface PutRecommendationFeedbackResponse {}
export const PutRecommendationFeedbackResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRecommendationFeedbackResponse",
}) as any as S.Schema<PutRecommendationFeedbackResponse>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    Tags: TagMap,
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
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export type AnalysisTypes = string[];
export const AnalysisTypes = S.Array(S.String);
export interface KMSKeyDetails {
  KMSKeyId?: string;
  EncryptionOption?: string;
}
export const KMSKeyDetails = S.suspend(() =>
  S.Struct({
    KMSKeyId: S.optional(S.String),
    EncryptionOption: S.optional(S.String),
  }),
).annotations({
  identifier: "KMSKeyDetails",
}) as any as S.Schema<KMSKeyDetails>;
export interface CodeArtifacts {
  SourceCodeArtifactsObjectKey: string;
  BuildArtifactsObjectKey?: string;
}
export const CodeArtifacts = S.suspend(() =>
  S.Struct({
    SourceCodeArtifactsObjectKey: S.String,
    BuildArtifactsObjectKey: S.optional(S.String),
  }),
).annotations({
  identifier: "CodeArtifacts",
}) as any as S.Schema<CodeArtifacts>;
export interface S3RepositoryDetails {
  BucketName?: string;
  CodeArtifacts?: CodeArtifacts;
}
export const S3RepositoryDetails = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    CodeArtifacts: S.optional(CodeArtifacts),
  }),
).annotations({
  identifier: "S3RepositoryDetails",
}) as any as S.Schema<S3RepositoryDetails>;
export interface RepositoryAssociation {
  AssociationId?: string;
  AssociationArn?: string;
  ConnectionArn?: string;
  Name?: string;
  Owner?: string;
  ProviderType?: string;
  State?: string;
  StateReason?: string;
  LastUpdatedTimeStamp?: Date;
  CreatedTimeStamp?: Date;
  KMSKeyDetails?: KMSKeyDetails;
  S3RepositoryDetails?: S3RepositoryDetails;
}
export const RepositoryAssociation = S.suspend(() =>
  S.Struct({
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
    CreatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KMSKeyDetails: S.optional(KMSKeyDetails),
    S3RepositoryDetails: S.optional(S3RepositoryDetails),
  }),
).annotations({
  identifier: "RepositoryAssociation",
}) as any as S.Schema<RepositoryAssociation>;
export interface DisassociateRepositoryResponse {
  RepositoryAssociation?: RepositoryAssociation;
  Tags?: TagMap;
}
export const DisassociateRepositoryResponse = S.suspend(() =>
  S.Struct({
    RepositoryAssociation: S.optional(RepositoryAssociation),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DisassociateRepositoryResponse",
}) as any as S.Schema<DisassociateRepositoryResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CodeCommitRepository {
  Name: string;
}
export const CodeCommitRepository = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CodeCommitRepository",
}) as any as S.Schema<CodeCommitRepository>;
export interface ThirdPartySourceRepository {
  Name: string;
  ConnectionArn: string;
  Owner: string;
}
export const ThirdPartySourceRepository = S.suspend(() =>
  S.Struct({ Name: S.String, ConnectionArn: S.String, Owner: S.String }),
).annotations({
  identifier: "ThirdPartySourceRepository",
}) as any as S.Schema<ThirdPartySourceRepository>;
export interface S3Repository {
  Name: string;
  BucketName: string;
}
export const S3Repository = S.suspend(() =>
  S.Struct({ Name: S.String, BucketName: S.String }),
).annotations({ identifier: "S3Repository" }) as any as S.Schema<S3Repository>;
export interface Repository {
  CodeCommit?: CodeCommitRepository;
  Bitbucket?: ThirdPartySourceRepository;
  GitHubEnterpriseServer?: ThirdPartySourceRepository;
  S3Bucket?: S3Repository;
}
export const Repository = S.suspend(() =>
  S.Struct({
    CodeCommit: S.optional(CodeCommitRepository),
    Bitbucket: S.optional(ThirdPartySourceRepository),
    GitHubEnterpriseServer: S.optional(ThirdPartySourceRepository),
    S3Bucket: S.optional(S3Repository),
  }),
).annotations({ identifier: "Repository" }) as any as S.Schema<Repository>;
export interface RecommendationFeedback {
  CodeReviewArn?: string;
  RecommendationId?: string;
  Reactions?: Reactions;
  UserId?: string;
  CreatedTimeStamp?: Date;
  LastUpdatedTimeStamp?: Date;
}
export const RecommendationFeedback = S.suspend(() =>
  S.Struct({
    CodeReviewArn: S.optional(S.String),
    RecommendationId: S.optional(S.String),
    Reactions: S.optional(Reactions),
    UserId: S.optional(S.String),
    CreatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RecommendationFeedback",
}) as any as S.Schema<RecommendationFeedback>;
export interface RecommendationFeedbackSummary {
  RecommendationId?: string;
  Reactions?: Reactions;
  UserId?: string;
}
export const RecommendationFeedbackSummary = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    Reactions: S.optional(Reactions),
    UserId: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationFeedbackSummary",
}) as any as S.Schema<RecommendationFeedbackSummary>;
export type RecommendationFeedbackSummaries = RecommendationFeedbackSummary[];
export const RecommendationFeedbackSummaries = S.Array(
  RecommendationFeedbackSummary,
);
export interface RepositoryAssociationSummary {
  AssociationArn?: string;
  ConnectionArn?: string;
  LastUpdatedTimeStamp?: Date;
  AssociationId?: string;
  Name?: string;
  Owner?: string;
  ProviderType?: string;
  State?: string;
}
export const RepositoryAssociationSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "RepositoryAssociationSummary",
}) as any as S.Schema<RepositoryAssociationSummary>;
export type RepositoryAssociationSummaries = RepositoryAssociationSummary[];
export const RepositoryAssociationSummaries = S.Array(
  RepositoryAssociationSummary,
);
export interface RepositoryHeadSourceCodeType {
  BranchName: string;
}
export const RepositoryHeadSourceCodeType = S.suspend(() =>
  S.Struct({ BranchName: S.String }),
).annotations({
  identifier: "RepositoryHeadSourceCodeType",
}) as any as S.Schema<RepositoryHeadSourceCodeType>;
export type RuleTags = string[];
export const RuleTags = S.Array(S.String);
export interface AssociateRepositoryRequest {
  Repository: Repository;
  ClientRequestToken?: string;
  Tags?: TagMap;
  KMSKeyDetails?: KMSKeyDetails;
}
export const AssociateRepositoryRequest = S.suspend(() =>
  S.Struct({
    Repository: Repository,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagMap),
    KMSKeyDetails: S.optional(KMSKeyDetails),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/associations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateRepositoryRequest",
}) as any as S.Schema<AssociateRepositoryRequest>;
export interface DescribeRecommendationFeedbackResponse {
  RecommendationFeedback?: RecommendationFeedback;
}
export const DescribeRecommendationFeedbackResponse = S.suspend(() =>
  S.Struct({ RecommendationFeedback: S.optional(RecommendationFeedback) }),
).annotations({
  identifier: "DescribeRecommendationFeedbackResponse",
}) as any as S.Schema<DescribeRecommendationFeedbackResponse>;
export interface ListRecommendationFeedbackResponse {
  RecommendationFeedbackSummaries?: RecommendationFeedbackSummaries;
  NextToken?: string;
}
export const ListRecommendationFeedbackResponse = S.suspend(() =>
  S.Struct({
    RecommendationFeedbackSummaries: S.optional(
      RecommendationFeedbackSummaries,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationFeedbackResponse",
}) as any as S.Schema<ListRecommendationFeedbackResponse>;
export interface ListRepositoryAssociationsResponse {
  RepositoryAssociationSummaries?: RepositoryAssociationSummaries;
  NextToken?: string;
}
export const ListRepositoryAssociationsResponse = S.suspend(() =>
  S.Struct({
    RepositoryAssociationSummaries: S.optional(RepositoryAssociationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRepositoryAssociationsResponse",
}) as any as S.Schema<ListRepositoryAssociationsResponse>;
export interface Metrics {
  MeteredLinesOfCodeCount?: number;
  SuppressedLinesOfCodeCount?: number;
  FindingsCount?: number;
}
export const Metrics = S.suspend(() =>
  S.Struct({
    MeteredLinesOfCodeCount: S.optional(S.Number),
    SuppressedLinesOfCodeCount: S.optional(S.Number),
    FindingsCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Metrics" }) as any as S.Schema<Metrics>;
export interface MetricsSummary {
  MeteredLinesOfCodeCount?: number;
  SuppressedLinesOfCodeCount?: number;
  FindingsCount?: number;
}
export const MetricsSummary = S.suspend(() =>
  S.Struct({
    MeteredLinesOfCodeCount: S.optional(S.Number),
    SuppressedLinesOfCodeCount: S.optional(S.Number),
    FindingsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetricsSummary",
}) as any as S.Schema<MetricsSummary>;
export interface RuleMetadata {
  RuleId?: string;
  RuleName?: string;
  ShortDescription?: string;
  LongDescription?: string;
  RuleTags?: RuleTags;
}
export const RuleMetadata = S.suspend(() =>
  S.Struct({
    RuleId: S.optional(S.String),
    RuleName: S.optional(S.String),
    ShortDescription: S.optional(S.String),
    LongDescription: S.optional(S.String),
    RuleTags: S.optional(RuleTags),
  }),
).annotations({ identifier: "RuleMetadata" }) as any as S.Schema<RuleMetadata>;
export interface CommitDiffSourceCodeType {
  SourceCommit?: string;
  DestinationCommit?: string;
  MergeBaseCommit?: string;
}
export const CommitDiffSourceCodeType = S.suspend(() =>
  S.Struct({
    SourceCommit: S.optional(S.String),
    DestinationCommit: S.optional(S.String),
    MergeBaseCommit: S.optional(S.String),
  }),
).annotations({
  identifier: "CommitDiffSourceCodeType",
}) as any as S.Schema<CommitDiffSourceCodeType>;
export interface BranchDiffSourceCodeType {
  SourceBranchName: string;
  DestinationBranchName: string;
}
export const BranchDiffSourceCodeType = S.suspend(() =>
  S.Struct({ SourceBranchName: S.String, DestinationBranchName: S.String }),
).annotations({
  identifier: "BranchDiffSourceCodeType",
}) as any as S.Schema<BranchDiffSourceCodeType>;
export interface S3BucketRepository {
  Name: string;
  Details?: S3RepositoryDetails;
}
export const S3BucketRepository = S.suspend(() =>
  S.Struct({ Name: S.String, Details: S.optional(S3RepositoryDetails) }),
).annotations({
  identifier: "S3BucketRepository",
}) as any as S.Schema<S3BucketRepository>;
export interface EventInfo {
  Name?: string;
  State?: string;
}
export const EventInfo = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), State: S.optional(S.String) }),
).annotations({ identifier: "EventInfo" }) as any as S.Schema<EventInfo>;
export interface RequestMetadata {
  RequestId?: string;
  Requester?: string;
  EventInfo?: EventInfo;
  VendorName?: string;
}
export const RequestMetadata = S.suspend(() =>
  S.Struct({
    RequestId: S.optional(S.String),
    Requester: S.optional(S.String),
    EventInfo: S.optional(EventInfo),
    VendorName: S.optional(S.String),
  }),
).annotations({
  identifier: "RequestMetadata",
}) as any as S.Schema<RequestMetadata>;
export interface SourceCodeType {
  CommitDiff?: CommitDiffSourceCodeType;
  RepositoryHead?: RepositoryHeadSourceCodeType;
  BranchDiff?: BranchDiffSourceCodeType;
  S3BucketRepository?: S3BucketRepository;
  RequestMetadata?: RequestMetadata;
}
export const SourceCodeType = S.suspend(() =>
  S.Struct({
    CommitDiff: S.optional(CommitDiffSourceCodeType),
    RepositoryHead: S.optional(RepositoryHeadSourceCodeType),
    BranchDiff: S.optional(BranchDiffSourceCodeType),
    S3BucketRepository: S.optional(S3BucketRepository),
    RequestMetadata: S.optional(RequestMetadata),
  }),
).annotations({
  identifier: "SourceCodeType",
}) as any as S.Schema<SourceCodeType>;
export interface CodeReview {
  Name?: string;
  CodeReviewArn?: string;
  RepositoryName?: string;
  Owner?: string;
  ProviderType?: string;
  State?: string;
  StateReason?: string;
  CreatedTimeStamp?: Date;
  LastUpdatedTimeStamp?: Date;
  Type?: string;
  PullRequestId?: string;
  SourceCodeType?: SourceCodeType;
  AssociationArn?: string;
  Metrics?: Metrics;
  AnalysisTypes?: AnalysisTypes;
  ConfigFileState?: string;
}
export const CodeReview = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CodeReviewArn: S.optional(S.String),
    RepositoryName: S.optional(S.String),
    Owner: S.optional(S.String),
    ProviderType: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    CreatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  }),
).annotations({ identifier: "CodeReview" }) as any as S.Schema<CodeReview>;
export interface CodeReviewSummary {
  Name?: string;
  CodeReviewArn?: string;
  RepositoryName?: string;
  Owner?: string;
  ProviderType?: string;
  State?: string;
  CreatedTimeStamp?: Date;
  LastUpdatedTimeStamp?: Date;
  Type?: string;
  PullRequestId?: string;
  MetricsSummary?: MetricsSummary;
  SourceCodeType?: SourceCodeType;
}
export const CodeReviewSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CodeReviewArn: S.optional(S.String),
    RepositoryName: S.optional(S.String),
    Owner: S.optional(S.String),
    ProviderType: S.optional(S.String),
    State: S.optional(S.String),
    CreatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Type: S.optional(S.String),
    PullRequestId: S.optional(S.String),
    MetricsSummary: S.optional(MetricsSummary),
    SourceCodeType: S.optional(SourceCodeType),
  }),
).annotations({
  identifier: "CodeReviewSummary",
}) as any as S.Schema<CodeReviewSummary>;
export type CodeReviewSummaries = CodeReviewSummary[];
export const CodeReviewSummaries = S.Array(CodeReviewSummary);
export interface RecommendationSummary {
  FilePath?: string;
  RecommendationId?: string;
  StartLine?: number;
  EndLine?: number;
  Description?: string;
  RecommendationCategory?: string;
  RuleMetadata?: RuleMetadata;
  Severity?: string;
}
export const RecommendationSummary = S.suspend(() =>
  S.Struct({
    FilePath: S.optional(S.String),
    RecommendationId: S.optional(S.String),
    StartLine: S.optional(S.Number),
    EndLine: S.optional(S.Number),
    Description: S.optional(S.String),
    RecommendationCategory: S.optional(S.String),
    RuleMetadata: S.optional(RuleMetadata),
    Severity: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationSummary",
}) as any as S.Schema<RecommendationSummary>;
export type RecommendationSummaries = RecommendationSummary[];
export const RecommendationSummaries = S.Array(RecommendationSummary);
export interface AssociateRepositoryResponse {
  RepositoryAssociation?: RepositoryAssociation;
  Tags?: TagMap;
}
export const AssociateRepositoryResponse = S.suspend(() =>
  S.Struct({
    RepositoryAssociation: S.optional(RepositoryAssociation),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "AssociateRepositoryResponse",
}) as any as S.Schema<AssociateRepositoryResponse>;
export interface DescribeCodeReviewResponse {
  CodeReview?: CodeReview;
}
export const DescribeCodeReviewResponse = S.suspend(() =>
  S.Struct({ CodeReview: S.optional(CodeReview) }),
).annotations({
  identifier: "DescribeCodeReviewResponse",
}) as any as S.Schema<DescribeCodeReviewResponse>;
export interface ListCodeReviewsResponse {
  CodeReviewSummaries?: CodeReviewSummaries;
  NextToken?: string;
}
export const ListCodeReviewsResponse = S.suspend(() =>
  S.Struct({
    CodeReviewSummaries: S.optional(CodeReviewSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCodeReviewsResponse",
}) as any as S.Schema<ListCodeReviewsResponse>;
export interface ListRecommendationsResponse {
  RecommendationSummaries?: RecommendationSummaries;
  NextToken?: string;
}
export const ListRecommendationsResponse = S.suspend(() =>
  S.Struct({
    RecommendationSummaries: S.optional(RecommendationSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationsResponse",
}) as any as S.Schema<ListRecommendationsResponse>;
export interface DescribeRepositoryAssociationResponse {
  RepositoryAssociation?: RepositoryAssociation;
  Tags?: TagMap;
}
export const DescribeRepositoryAssociationResponse = S.suspend(() =>
  S.Struct({
    RepositoryAssociation: S.optional(RepositoryAssociation),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribeRepositoryAssociationResponse",
}) as any as S.Schema<DescribeRepositoryAssociationResponse>;
export interface RepositoryAnalysis {
  RepositoryHead?: RepositoryHeadSourceCodeType;
  SourceCodeType?: SourceCodeType;
}
export const RepositoryAnalysis = S.suspend(() =>
  S.Struct({
    RepositoryHead: S.optional(RepositoryHeadSourceCodeType),
    SourceCodeType: S.optional(SourceCodeType),
  }),
).annotations({
  identifier: "RepositoryAnalysis",
}) as any as S.Schema<RepositoryAnalysis>;
export interface CodeReviewType {
  RepositoryAnalysis: RepositoryAnalysis;
  AnalysisTypes?: AnalysisTypes;
}
export const CodeReviewType = S.suspend(() =>
  S.Struct({
    RepositoryAnalysis: RepositoryAnalysis,
    AnalysisTypes: S.optional(AnalysisTypes),
  }),
).annotations({
  identifier: "CodeReviewType",
}) as any as S.Schema<CodeReviewType>;
export interface CreateCodeReviewRequest {
  Name: string;
  RepositoryAssociationArn: string;
  Type: CodeReviewType;
  ClientRequestToken?: string;
}
export const CreateCodeReviewRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RepositoryAssociationArn: S.String,
    Type: CodeReviewType,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/codereviews" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCodeReviewRequest",
}) as any as S.Schema<CreateCodeReviewRequest>;
export interface CreateCodeReviewResponse {
  CodeReview?: CodeReview;
}
export const CreateCodeReviewResponse = S.suspend(() =>
  S.Struct({ CodeReview: S.optional(CodeReview) }),
).annotations({
  identifier: "CreateCodeReviewResponse",
}) as any as S.Schema<CreateCodeReviewResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Adds one or more tags to an associated repository.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRecommendationFeedback: (
  input: PutRecommendationFeedbackRequest,
) => Effect.Effect<
  PutRecommendationFeedbackResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecommendationFeedbackRequest,
  output: PutRecommendationFeedbackResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Describes the customer feedback for a CodeGuru Reviewer recommendation.
 */
export const describeRecommendationFeedback: (
  input: DescribeRecommendationFeedbackRequest,
) => Effect.Effect<
  DescribeRecommendationFeedbackResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRecommendationFeedback: {
  (
    input: ListRecommendationFeedbackRequest,
  ): Effect.Effect<
    ListRecommendationFeedbackResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationFeedbackRequest,
  ) => Stream.Stream<
    ListRecommendationFeedbackResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationFeedbackRequest,
  ) => Stream.Stream<
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
export const associateRepository: (
  input: AssociateRepositoryRequest,
) => Effect.Effect<
  AssociateRepositoryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCodeReview: (
  input: DescribeCodeReviewRequest,
) => Effect.Effect<
  DescribeCodeReviewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCodeReviews: {
  (
    input: ListCodeReviewsRequest,
  ): Effect.Effect<
    ListCodeReviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCodeReviewsRequest,
  ) => Stream.Stream<
    ListCodeReviewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCodeReviewsRequest,
  ) => Stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the list of all recommendations for a completed code review.
 */
export const listRecommendations: {
  (
    input: ListRecommendationsRequest,
  ): Effect.Effect<
    ListRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
    ListRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
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
export const disassociateRepository: (
  input: DisassociateRepositoryRequest,
) => Effect.Effect<
  DisassociateRepositoryResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Removes a tag from an associated repository.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRepositoryAssociations: {
  (
    input: ListRepositoryAssociationsRequest,
  ): Effect.Effect<
    ListRepositoryAssociationsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoryAssociationsRequest,
  ) => Stream.Stream<
    ListRepositoryAssociationsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoryAssociationsRequest,
  ) => Stream.Stream<
    RepositoryAssociationSummary,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeRepositoryAssociation: (
  input: DescribeRepositoryAssociationRequest,
) => Effect.Effect<
  DescribeRepositoryAssociationResponse,
  | AccessDeniedException
  | InternalServerException
  | NotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCodeReview: (
  input: CreateCodeReviewRequest,
) => Effect.Effect<
  CreateCodeReviewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
