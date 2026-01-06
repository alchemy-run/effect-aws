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
const ns = T.XmlNamespace("http://codecommit.amazonaws.com/doc/2015-04-13");
const svc = T.AwsApiService({
  sdkId: "CodeCommit",
  serviceShapeName: "CodeCommit_20150413",
});
const auth = T.AwsAuthSigv4({ name: "codecommit" });
const ver = T.ServiceVersion("2015-04-13");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://codecommit-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://codecommit-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://codecommit.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://codecommit.{Region}.{PartitionResult#dnsSuffix}",
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
export type ApprovalRuleTemplateName = string;
export type RepositoryName = string;
export type CommitName = string;
export type MaxResults = number;
export type Path = string;
export type NextToken = string;
export type ObjectId = string;
export type ApprovalRuleTemplateContent = string;
export type ApprovalRuleTemplateDescription = string;
export type BranchName = string;
export type CommitId = string;
export type Name = string;
export type Email = string;
export type Message = string;
export type Title = string;
export type Description = string;
export type ClientRequestToken = string;
export type PullRequestId = string;
export type ApprovalRuleName = string;
export type ApprovalRuleContent = string;
export type RepositoryDescription = string;
export type KmsKeyId = string;
export type CommentId = string;
export type Arn = string;
export type RevisionId = string;
export type Limit = number;
export type ResourceArn = string;
export type Content = string;
export type ReactionValue = string;
export type TagKey = string;
export type RuleContentSha256 = string;
export type ReferenceName = string;
export type TagValue = string;
export type Position = number;
export type RepositoryTriggerName = string;
export type RepositoryTriggerCustomData = string;
export type ApprovalRuleTemplateId = string;
export type ApprovalRuleId = string;
export type RepositoryId = string;
export type ObjectSize = number;
export type RepositoryTriggersConfigurationId = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type ExceptionName = string;
export type AdditionalData = string;
export type AccountId = string;
export type CloneUrlHttp = string;
export type CloneUrlSsh = string;
export type NumberOfConflicts = number;
export type Count = number;
export type RepositoryTriggerExecutionFailureMessage = string;
export type FileSize = number;
export type LineNumber = number;
export type HunkContent = string;
export type ReactionEmoji = string;
export type ReactionShortCode = string;
export type ReactionUnicode = string;
export type Mode = string;

//# Schemas
export type RepositoryNameList = string[];
export const RepositoryNameList = S.Array(S.String);
export type FilePaths = string[];
export const FilePaths = S.Array(S.String);
export type CommitIdsInputList = string[];
export const CommitIdsInputList = S.Array(S.String);
export type TagKeysList = string[];
export const TagKeysList = S.Array(S.String);
export interface AssociateApprovalRuleTemplateWithRepositoryInput {
  approvalRuleTemplateName: string;
  repositoryName: string;
}
export const AssociateApprovalRuleTemplateWithRepositoryInput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateName: S.String,
    repositoryName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateApprovalRuleTemplateWithRepositoryInput",
}) as any as S.Schema<AssociateApprovalRuleTemplateWithRepositoryInput>;
export interface AssociateApprovalRuleTemplateWithRepositoryResponse {}
export const AssociateApprovalRuleTemplateWithRepositoryResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "AssociateApprovalRuleTemplateWithRepositoryResponse",
}) as any as S.Schema<AssociateApprovalRuleTemplateWithRepositoryResponse>;
export interface BatchAssociateApprovalRuleTemplateWithRepositoriesInput {
  approvalRuleTemplateName: string;
  repositoryNames: RepositoryNameList;
}
export const BatchAssociateApprovalRuleTemplateWithRepositoriesInput =
  S.suspend(() =>
    S.Struct({
      approvalRuleTemplateName: S.String,
      repositoryNames: RepositoryNameList,
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "BatchAssociateApprovalRuleTemplateWithRepositoriesInput",
  }) as any as S.Schema<BatchAssociateApprovalRuleTemplateWithRepositoriesInput>;
export interface BatchDescribeMergeConflictsInput {
  repositoryName: string;
  destinationCommitSpecifier: string;
  sourceCommitSpecifier: string;
  mergeOption: string;
  maxMergeHunks?: number;
  maxConflictFiles?: number;
  filePaths?: FilePaths;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  nextToken?: string;
}
export const BatchDescribeMergeConflictsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    destinationCommitSpecifier: S.String,
    sourceCommitSpecifier: S.String,
    mergeOption: S.String,
    maxMergeHunks: S.optional(S.Number),
    maxConflictFiles: S.optional(S.Number),
    filePaths: S.optional(FilePaths),
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDescribeMergeConflictsInput",
}) as any as S.Schema<BatchDescribeMergeConflictsInput>;
export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesInput {
  approvalRuleTemplateName: string;
  repositoryNames: RepositoryNameList;
}
export const BatchDisassociateApprovalRuleTemplateFromRepositoriesInput =
  S.suspend(() =>
    S.Struct({
      approvalRuleTemplateName: S.String,
      repositoryNames: RepositoryNameList,
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "BatchDisassociateApprovalRuleTemplateFromRepositoriesInput",
  }) as any as S.Schema<BatchDisassociateApprovalRuleTemplateFromRepositoriesInput>;
export interface BatchGetCommitsInput {
  commitIds: CommitIdsInputList;
  repositoryName: string;
}
export const BatchGetCommitsInput = S.suspend(() =>
  S.Struct({ commitIds: CommitIdsInputList, repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetCommitsInput",
}) as any as S.Schema<BatchGetCommitsInput>;
export interface BatchGetRepositoriesInput {
  repositoryNames: RepositoryNameList;
}
export const BatchGetRepositoriesInput = S.suspend(() =>
  S.Struct({ repositoryNames: RepositoryNameList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchGetRepositoriesInput",
}) as any as S.Schema<BatchGetRepositoriesInput>;
export interface CreateApprovalRuleTemplateInput {
  approvalRuleTemplateName: string;
  approvalRuleTemplateContent: string;
  approvalRuleTemplateDescription?: string;
}
export const CreateApprovalRuleTemplateInput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateName: S.String,
    approvalRuleTemplateContent: S.String,
    approvalRuleTemplateDescription: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApprovalRuleTemplateInput",
}) as any as S.Schema<CreateApprovalRuleTemplateInput>;
export interface CreateBranchInput {
  repositoryName: string;
  branchName: string;
  commitId: string;
}
export const CreateBranchInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    branchName: S.String,
    commitId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBranchInput",
}) as any as S.Schema<CreateBranchInput>;
export interface CreateBranchResponse {}
export const CreateBranchResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateBranchResponse",
}) as any as S.Schema<CreateBranchResponse>;
export interface CreatePullRequestApprovalRuleInput {
  pullRequestId: string;
  approvalRuleName: string;
  approvalRuleContent: string;
}
export const CreatePullRequestApprovalRuleInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    approvalRuleName: S.String,
    approvalRuleContent: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePullRequestApprovalRuleInput",
}) as any as S.Schema<CreatePullRequestApprovalRuleInput>;
export interface DeleteApprovalRuleTemplateInput {
  approvalRuleTemplateName: string;
}
export const DeleteApprovalRuleTemplateInput = S.suspend(() =>
  S.Struct({ approvalRuleTemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApprovalRuleTemplateInput",
}) as any as S.Schema<DeleteApprovalRuleTemplateInput>;
export interface DeleteBranchInput {
  repositoryName: string;
  branchName: string;
}
export const DeleteBranchInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, branchName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBranchInput",
}) as any as S.Schema<DeleteBranchInput>;
export interface DeleteCommentContentInput {
  commentId: string;
}
export const DeleteCommentContentInput = S.suspend(() =>
  S.Struct({ commentId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCommentContentInput",
}) as any as S.Schema<DeleteCommentContentInput>;
export interface DeleteFileInput {
  repositoryName: string;
  branchName: string;
  filePath: string;
  parentCommitId: string;
  keepEmptyFolders?: boolean;
  commitMessage?: string;
  name?: string;
  email?: string;
}
export const DeleteFileInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    branchName: S.String,
    filePath: S.String,
    parentCommitId: S.String,
    keepEmptyFolders: S.optional(S.Boolean),
    commitMessage: S.optional(S.String),
    name: S.optional(S.String),
    email: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFileInput",
}) as any as S.Schema<DeleteFileInput>;
export interface DeletePullRequestApprovalRuleInput {
  pullRequestId: string;
  approvalRuleName: string;
}
export const DeletePullRequestApprovalRuleInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, approvalRuleName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePullRequestApprovalRuleInput",
}) as any as S.Schema<DeletePullRequestApprovalRuleInput>;
export interface DeleteRepositoryInput {
  repositoryName: string;
}
export const DeleteRepositoryInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRepositoryInput",
}) as any as S.Schema<DeleteRepositoryInput>;
export interface DescribeMergeConflictsInput {
  repositoryName: string;
  destinationCommitSpecifier: string;
  sourceCommitSpecifier: string;
  mergeOption: string;
  maxMergeHunks?: number;
  filePath: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  nextToken?: string;
}
export const DescribeMergeConflictsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    destinationCommitSpecifier: S.String,
    sourceCommitSpecifier: S.String,
    mergeOption: S.String,
    maxMergeHunks: S.optional(S.Number),
    filePath: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMergeConflictsInput",
}) as any as S.Schema<DescribeMergeConflictsInput>;
export interface DescribePullRequestEventsInput {
  pullRequestId: string;
  pullRequestEventType?: string;
  actorArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const DescribePullRequestEventsInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    pullRequestEventType: S.optional(S.String),
    actorArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePullRequestEventsInput",
}) as any as S.Schema<DescribePullRequestEventsInput>;
export interface DisassociateApprovalRuleTemplateFromRepositoryInput {
  approvalRuleTemplateName: string;
  repositoryName: string;
}
export const DisassociateApprovalRuleTemplateFromRepositoryInput = S.suspend(
  () =>
    S.Struct({
      approvalRuleTemplateName: S.String,
      repositoryName: S.String,
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DisassociateApprovalRuleTemplateFromRepositoryInput",
}) as any as S.Schema<DisassociateApprovalRuleTemplateFromRepositoryInput>;
export interface DisassociateApprovalRuleTemplateFromRepositoryResponse {}
export const DisassociateApprovalRuleTemplateFromRepositoryResponse = S.suspend(
  () => S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisassociateApprovalRuleTemplateFromRepositoryResponse",
}) as any as S.Schema<DisassociateApprovalRuleTemplateFromRepositoryResponse>;
export interface EvaluatePullRequestApprovalRulesInput {
  pullRequestId: string;
  revisionId: string;
}
export const EvaluatePullRequestApprovalRulesInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, revisionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EvaluatePullRequestApprovalRulesInput",
}) as any as S.Schema<EvaluatePullRequestApprovalRulesInput>;
export interface GetApprovalRuleTemplateInput {
  approvalRuleTemplateName: string;
}
export const GetApprovalRuleTemplateInput = S.suspend(() =>
  S.Struct({ approvalRuleTemplateName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApprovalRuleTemplateInput",
}) as any as S.Schema<GetApprovalRuleTemplateInput>;
export interface GetBlobInput {
  repositoryName: string;
  blobId: string;
}
export const GetBlobInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, blobId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetBlobInput" }) as any as S.Schema<GetBlobInput>;
export interface GetBranchInput {
  repositoryName?: string;
  branchName?: string;
}
export const GetBranchInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    branchName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBranchInput",
}) as any as S.Schema<GetBranchInput>;
export interface GetCommentInput {
  commentId: string;
}
export const GetCommentInput = S.suspend(() =>
  S.Struct({ commentId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommentInput",
}) as any as S.Schema<GetCommentInput>;
export interface GetCommentReactionsInput {
  commentId: string;
  reactionUserArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetCommentReactionsInput = S.suspend(() =>
  S.Struct({
    commentId: S.String,
    reactionUserArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommentReactionsInput",
}) as any as S.Schema<GetCommentReactionsInput>;
export interface GetCommentsForComparedCommitInput {
  repositoryName: string;
  beforeCommitId?: string;
  afterCommitId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetCommentsForComparedCommitInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommentsForComparedCommitInput",
}) as any as S.Schema<GetCommentsForComparedCommitInput>;
export interface GetCommentsForPullRequestInput {
  pullRequestId: string;
  repositoryName?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetCommentsForPullRequestInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommentsForPullRequestInput",
}) as any as S.Schema<GetCommentsForPullRequestInput>;
export interface GetCommitInput {
  repositoryName: string;
  commitId: string;
}
export const GetCommitInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, commitId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCommitInput",
}) as any as S.Schema<GetCommitInput>;
export interface GetDifferencesInput {
  repositoryName: string;
  beforeCommitSpecifier?: string;
  afterCommitSpecifier: string;
  beforePath?: string;
  afterPath?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetDifferencesInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    beforeCommitSpecifier: S.optional(S.String),
    afterCommitSpecifier: S.String,
    beforePath: S.optional(S.String),
    afterPath: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDifferencesInput",
}) as any as S.Schema<GetDifferencesInput>;
export interface GetFileInput {
  repositoryName: string;
  commitSpecifier?: string;
  filePath: string;
}
export const GetFileInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    filePath: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "GetFileInput" }) as any as S.Schema<GetFileInput>;
export interface GetFolderInput {
  repositoryName: string;
  commitSpecifier?: string;
  folderPath: string;
}
export const GetFolderInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    folderPath: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFolderInput",
}) as any as S.Schema<GetFolderInput>;
export interface GetMergeCommitInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
}
export const GetMergeCommitInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMergeCommitInput",
}) as any as S.Schema<GetMergeCommitInput>;
export interface GetMergeConflictsInput {
  repositoryName: string;
  destinationCommitSpecifier: string;
  sourceCommitSpecifier: string;
  mergeOption: string;
  conflictDetailLevel?: string;
  maxConflictFiles?: number;
  conflictResolutionStrategy?: string;
  nextToken?: string;
}
export const GetMergeConflictsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    destinationCommitSpecifier: S.String,
    sourceCommitSpecifier: S.String,
    mergeOption: S.String,
    conflictDetailLevel: S.optional(S.String),
    maxConflictFiles: S.optional(S.Number),
    conflictResolutionStrategy: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMergeConflictsInput",
}) as any as S.Schema<GetMergeConflictsInput>;
export interface GetMergeOptionsInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
}
export const GetMergeOptionsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMergeOptionsInput",
}) as any as S.Schema<GetMergeOptionsInput>;
export interface GetPullRequestInput {
  pullRequestId: string;
}
export const GetPullRequestInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPullRequestInput",
}) as any as S.Schema<GetPullRequestInput>;
export interface GetPullRequestApprovalStatesInput {
  pullRequestId: string;
  revisionId: string;
}
export const GetPullRequestApprovalStatesInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, revisionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPullRequestApprovalStatesInput",
}) as any as S.Schema<GetPullRequestApprovalStatesInput>;
export interface GetPullRequestOverrideStateInput {
  pullRequestId: string;
  revisionId: string;
}
export const GetPullRequestOverrideStateInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, revisionId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPullRequestOverrideStateInput",
}) as any as S.Schema<GetPullRequestOverrideStateInput>;
export interface GetRepositoryInput {
  repositoryName: string;
}
export const GetRepositoryInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRepositoryInput",
}) as any as S.Schema<GetRepositoryInput>;
export interface GetRepositoryTriggersInput {
  repositoryName: string;
}
export const GetRepositoryTriggersInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRepositoryTriggersInput",
}) as any as S.Schema<GetRepositoryTriggersInput>;
export interface ListApprovalRuleTemplatesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListApprovalRuleTemplatesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApprovalRuleTemplatesInput",
}) as any as S.Schema<ListApprovalRuleTemplatesInput>;
export interface ListAssociatedApprovalRuleTemplatesForRepositoryInput {
  repositoryName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAssociatedApprovalRuleTemplatesForRepositoryInput = S.suspend(
  () =>
    S.Struct({
      repositoryName: S.String,
      nextToken: S.optional(S.String),
      maxResults: S.optional(S.Number),
    }).pipe(
      T.all(
        ns,
        T.Http({ method: "POST", uri: "/" }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "ListAssociatedApprovalRuleTemplatesForRepositoryInput",
}) as any as S.Schema<ListAssociatedApprovalRuleTemplatesForRepositoryInput>;
export interface ListBranchesInput {
  repositoryName: string;
  nextToken?: string;
}
export const ListBranchesInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBranchesInput",
}) as any as S.Schema<ListBranchesInput>;
export interface ListFileCommitHistoryRequest {
  repositoryName: string;
  commitSpecifier?: string;
  filePath: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFileCommitHistoryRequest = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    filePath: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFileCommitHistoryRequest",
}) as any as S.Schema<ListFileCommitHistoryRequest>;
export interface ListPullRequestsInput {
  repositoryName: string;
  authorArn?: string;
  pullRequestStatus?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListPullRequestsInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    authorArn: S.optional(S.String),
    pullRequestStatus: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPullRequestsInput",
}) as any as S.Schema<ListPullRequestsInput>;
export interface ListRepositoriesInput {
  nextToken?: string;
  sortBy?: string;
  order?: string;
}
export const ListRepositoriesInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    sortBy: S.optional(S.String),
    order: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRepositoriesInput",
}) as any as S.Schema<ListRepositoriesInput>;
export interface ListRepositoriesForApprovalRuleTemplateInput {
  approvalRuleTemplateName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRepositoriesForApprovalRuleTemplateInput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateName: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRepositoriesForApprovalRuleTemplateInput",
}) as any as S.Schema<ListRepositoriesForApprovalRuleTemplateInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
  nextToken?: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, nextToken: S.optional(S.String) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface MergeBranchesByFastForwardInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  targetBranch?: string;
}
export const MergeBranchesByFastForwardInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    targetBranch: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergeBranchesByFastForwardInput",
}) as any as S.Schema<MergeBranchesByFastForwardInput>;
export interface ReplaceContentEntry {
  filePath: string;
  replacementType: string;
  content?: Uint8Array;
  fileMode?: string;
}
export const ReplaceContentEntry = S.suspend(() =>
  S.Struct({
    filePath: S.String,
    replacementType: S.String,
    content: S.optional(T.Blob),
    fileMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplaceContentEntry",
}) as any as S.Schema<ReplaceContentEntry>;
export type ReplaceContentEntries = ReplaceContentEntry[];
export const ReplaceContentEntries = S.Array(ReplaceContentEntry);
export interface DeleteFileEntry {
  filePath: string;
}
export const DeleteFileEntry = S.suspend(() =>
  S.Struct({ filePath: S.String }),
).annotations({
  identifier: "DeleteFileEntry",
}) as any as S.Schema<DeleteFileEntry>;
export type DeleteFileEntries = DeleteFileEntry[];
export const DeleteFileEntries = S.Array(DeleteFileEntry);
export interface SetFileModeEntry {
  filePath: string;
  fileMode: string;
}
export const SetFileModeEntry = S.suspend(() =>
  S.Struct({ filePath: S.String, fileMode: S.String }),
).annotations({
  identifier: "SetFileModeEntry",
}) as any as S.Schema<SetFileModeEntry>;
export type SetFileModeEntries = SetFileModeEntry[];
export const SetFileModeEntries = S.Array(SetFileModeEntry);
export interface ConflictResolution {
  replaceContents?: ReplaceContentEntries;
  deleteFiles?: DeleteFileEntries;
  setFileModes?: SetFileModeEntries;
}
export const ConflictResolution = S.suspend(() =>
  S.Struct({
    replaceContents: S.optional(ReplaceContentEntries),
    deleteFiles: S.optional(DeleteFileEntries),
    setFileModes: S.optional(SetFileModeEntries),
  }),
).annotations({
  identifier: "ConflictResolution",
}) as any as S.Schema<ConflictResolution>;
export interface MergeBranchesBySquashInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  targetBranch?: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  authorName?: string;
  email?: string;
  commitMessage?: string;
  keepEmptyFolders?: boolean;
  conflictResolution?: ConflictResolution;
}
export const MergeBranchesBySquashInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    targetBranch: S.optional(S.String),
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    commitMessage: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    conflictResolution: S.optional(ConflictResolution),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergeBranchesBySquashInput",
}) as any as S.Schema<MergeBranchesBySquashInput>;
export interface MergeBranchesByThreeWayInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  targetBranch?: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  authorName?: string;
  email?: string;
  commitMessage?: string;
  keepEmptyFolders?: boolean;
  conflictResolution?: ConflictResolution;
}
export const MergeBranchesByThreeWayInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    targetBranch: S.optional(S.String),
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    commitMessage: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    conflictResolution: S.optional(ConflictResolution),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergeBranchesByThreeWayInput",
}) as any as S.Schema<MergeBranchesByThreeWayInput>;
export interface MergePullRequestByFastForwardInput {
  pullRequestId: string;
  repositoryName: string;
  sourceCommitId?: string;
}
export const MergePullRequestByFastForwardInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    repositoryName: S.String,
    sourceCommitId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergePullRequestByFastForwardInput",
}) as any as S.Schema<MergePullRequestByFastForwardInput>;
export interface MergePullRequestBySquashInput {
  pullRequestId: string;
  repositoryName: string;
  sourceCommitId?: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  commitMessage?: string;
  authorName?: string;
  email?: string;
  keepEmptyFolders?: boolean;
  conflictResolution?: ConflictResolution;
}
export const MergePullRequestBySquashInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    repositoryName: S.String,
    sourceCommitId: S.optional(S.String),
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    commitMessage: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    conflictResolution: S.optional(ConflictResolution),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergePullRequestBySquashInput",
}) as any as S.Schema<MergePullRequestBySquashInput>;
export interface MergePullRequestByThreeWayInput {
  pullRequestId: string;
  repositoryName: string;
  sourceCommitId?: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  commitMessage?: string;
  authorName?: string;
  email?: string;
  keepEmptyFolders?: boolean;
  conflictResolution?: ConflictResolution;
}
export const MergePullRequestByThreeWayInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    repositoryName: S.String,
    sourceCommitId: S.optional(S.String),
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    commitMessage: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    conflictResolution: S.optional(ConflictResolution),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "MergePullRequestByThreeWayInput",
}) as any as S.Schema<MergePullRequestByThreeWayInput>;
export interface OverridePullRequestApprovalRulesInput {
  pullRequestId: string;
  revisionId: string;
  overrideStatus: string;
}
export const OverridePullRequestApprovalRulesInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    revisionId: S.String,
    overrideStatus: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "OverridePullRequestApprovalRulesInput",
}) as any as S.Schema<OverridePullRequestApprovalRulesInput>;
export interface OverridePullRequestApprovalRulesResponse {}
export const OverridePullRequestApprovalRulesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "OverridePullRequestApprovalRulesResponse",
}) as any as S.Schema<OverridePullRequestApprovalRulesResponse>;
export interface Location {
  filePath?: string;
  filePosition?: number;
  relativeFileVersion?: string;
}
export const Location = S.suspend(() =>
  S.Struct({
    filePath: S.optional(S.String),
    filePosition: S.optional(S.Number),
    relativeFileVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export interface PostCommentForPullRequestInput {
  pullRequestId: string;
  repositoryName: string;
  beforeCommitId: string;
  afterCommitId: string;
  location?: Location;
  content: string;
  clientRequestToken?: string;
}
export const PostCommentForPullRequestInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    repositoryName: S.String,
    beforeCommitId: S.String,
    afterCommitId: S.String,
    location: S.optional(Location),
    content: S.String,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostCommentForPullRequestInput",
}) as any as S.Schema<PostCommentForPullRequestInput>;
export interface PostCommentReplyInput {
  inReplyTo: string;
  clientRequestToken?: string;
  content: string;
}
export const PostCommentReplyInput = S.suspend(() =>
  S.Struct({
    inReplyTo: S.String,
    clientRequestToken: S.optional(S.String),
    content: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostCommentReplyInput",
}) as any as S.Schema<PostCommentReplyInput>;
export interface PutCommentReactionInput {
  commentId: string;
  reactionValue: string;
}
export const PutCommentReactionInput = S.suspend(() =>
  S.Struct({ commentId: S.String, reactionValue: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutCommentReactionInput",
}) as any as S.Schema<PutCommentReactionInput>;
export interface PutCommentReactionResponse {}
export const PutCommentReactionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutCommentReactionResponse",
}) as any as S.Schema<PutCommentReactionResponse>;
export interface PutFileInput {
  repositoryName: string;
  branchName: string;
  fileContent: Uint8Array;
  filePath: string;
  fileMode?: string;
  parentCommitId?: string;
  commitMessage?: string;
  name?: string;
  email?: string;
}
export const PutFileInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    branchName: S.String,
    fileContent: T.Blob,
    filePath: S.String,
    fileMode: S.optional(S.String),
    parentCommitId: S.optional(S.String),
    commitMessage: S.optional(S.String),
    name: S.optional(S.String),
    email: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({ identifier: "PutFileInput" }) as any as S.Schema<PutFileInput>;
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceInput {
  resourceArn: string;
  tags: TagsMap;
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagsMap }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export type BranchNameList = string[];
export const BranchNameList = S.Array(S.String);
export type RepositoryTriggerEventList = string[];
export const RepositoryTriggerEventList = S.Array(S.String);
export interface RepositoryTrigger {
  name: string;
  destinationArn: string;
  customData?: string;
  branches?: BranchNameList;
  events: RepositoryTriggerEventList;
}
export const RepositoryTrigger = S.suspend(() =>
  S.Struct({
    name: S.String,
    destinationArn: S.String,
    customData: S.optional(S.String),
    branches: S.optional(BranchNameList),
    events: RepositoryTriggerEventList,
  }),
).annotations({
  identifier: "RepositoryTrigger",
}) as any as S.Schema<RepositoryTrigger>;
export type RepositoryTriggersList = RepositoryTrigger[];
export const RepositoryTriggersList = S.Array(RepositoryTrigger);
export interface TestRepositoryTriggersInput {
  repositoryName: string;
  triggers: RepositoryTriggersList;
}
export const TestRepositoryTriggersInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, triggers: RepositoryTriggersList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestRepositoryTriggersInput",
}) as any as S.Schema<TestRepositoryTriggersInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeysList;
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeysList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateApprovalRuleTemplateContentInput {
  approvalRuleTemplateName: string;
  newRuleContent: string;
  existingRuleContentSha256?: string;
}
export const UpdateApprovalRuleTemplateContentInput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateName: S.String,
    newRuleContent: S.String,
    existingRuleContentSha256: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApprovalRuleTemplateContentInput",
}) as any as S.Schema<UpdateApprovalRuleTemplateContentInput>;
export interface UpdateApprovalRuleTemplateDescriptionInput {
  approvalRuleTemplateName: string;
  approvalRuleTemplateDescription: string;
}
export const UpdateApprovalRuleTemplateDescriptionInput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateName: S.String,
    approvalRuleTemplateDescription: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApprovalRuleTemplateDescriptionInput",
}) as any as S.Schema<UpdateApprovalRuleTemplateDescriptionInput>;
export interface UpdateApprovalRuleTemplateNameInput {
  oldApprovalRuleTemplateName: string;
  newApprovalRuleTemplateName: string;
}
export const UpdateApprovalRuleTemplateNameInput = S.suspend(() =>
  S.Struct({
    oldApprovalRuleTemplateName: S.String,
    newApprovalRuleTemplateName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApprovalRuleTemplateNameInput",
}) as any as S.Schema<UpdateApprovalRuleTemplateNameInput>;
export interface UpdateCommentInput {
  commentId: string;
  content: string;
}
export const UpdateCommentInput = S.suspend(() =>
  S.Struct({ commentId: S.String, content: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCommentInput",
}) as any as S.Schema<UpdateCommentInput>;
export interface UpdateDefaultBranchInput {
  repositoryName: string;
  defaultBranchName: string;
}
export const UpdateDefaultBranchInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, defaultBranchName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDefaultBranchInput",
}) as any as S.Schema<UpdateDefaultBranchInput>;
export interface UpdateDefaultBranchResponse {}
export const UpdateDefaultBranchResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDefaultBranchResponse",
}) as any as S.Schema<UpdateDefaultBranchResponse>;
export interface UpdatePullRequestApprovalRuleContentInput {
  pullRequestId: string;
  approvalRuleName: string;
  existingRuleContentSha256?: string;
  newRuleContent: string;
}
export const UpdatePullRequestApprovalRuleContentInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    approvalRuleName: S.String,
    existingRuleContentSha256: S.optional(S.String),
    newRuleContent: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullRequestApprovalRuleContentInput",
}) as any as S.Schema<UpdatePullRequestApprovalRuleContentInput>;
export interface UpdatePullRequestApprovalStateInput {
  pullRequestId: string;
  revisionId: string;
  approvalState: string;
}
export const UpdatePullRequestApprovalStateInput = S.suspend(() =>
  S.Struct({
    pullRequestId: S.String,
    revisionId: S.String,
    approvalState: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullRequestApprovalStateInput",
}) as any as S.Schema<UpdatePullRequestApprovalStateInput>;
export interface UpdatePullRequestApprovalStateResponse {}
export const UpdatePullRequestApprovalStateResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdatePullRequestApprovalStateResponse",
}) as any as S.Schema<UpdatePullRequestApprovalStateResponse>;
export interface UpdatePullRequestDescriptionInput {
  pullRequestId: string;
  description: string;
}
export const UpdatePullRequestDescriptionInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, description: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullRequestDescriptionInput",
}) as any as S.Schema<UpdatePullRequestDescriptionInput>;
export interface UpdatePullRequestStatusInput {
  pullRequestId: string;
  pullRequestStatus: string;
}
export const UpdatePullRequestStatusInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, pullRequestStatus: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullRequestStatusInput",
}) as any as S.Schema<UpdatePullRequestStatusInput>;
export interface UpdatePullRequestTitleInput {
  pullRequestId: string;
  title: string;
}
export const UpdatePullRequestTitleInput = S.suspend(() =>
  S.Struct({ pullRequestId: S.String, title: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdatePullRequestTitleInput",
}) as any as S.Schema<UpdatePullRequestTitleInput>;
export interface UpdateRepositoryDescriptionInput {
  repositoryName: string;
  repositoryDescription?: string;
}
export const UpdateRepositoryDescriptionInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    repositoryDescription: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRepositoryDescriptionInput",
}) as any as S.Schema<UpdateRepositoryDescriptionInput>;
export interface UpdateRepositoryDescriptionResponse {}
export const UpdateRepositoryDescriptionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateRepositoryDescriptionResponse",
}) as any as S.Schema<UpdateRepositoryDescriptionResponse>;
export interface UpdateRepositoryEncryptionKeyInput {
  repositoryName: string;
  kmsKeyId: string;
}
export const UpdateRepositoryEncryptionKeyInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, kmsKeyId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRepositoryEncryptionKeyInput",
}) as any as S.Schema<UpdateRepositoryEncryptionKeyInput>;
export interface UpdateRepositoryNameInput {
  oldName: string;
  newName: string;
}
export const UpdateRepositoryNameInput = S.suspend(() =>
  S.Struct({ oldName: S.String, newName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRepositoryNameInput",
}) as any as S.Schema<UpdateRepositoryNameInput>;
export interface UpdateRepositoryNameResponse {}
export const UpdateRepositoryNameResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateRepositoryNameResponse",
}) as any as S.Schema<UpdateRepositoryNameResponse>;
export type RepositoryNotFoundList = string[];
export const RepositoryNotFoundList = S.Array(S.String);
export interface Target {
  repositoryName: string;
  sourceReference: string;
  destinationReference?: string;
}
export const Target = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceReference: S.String,
    destinationReference: S.optional(S.String),
  }),
).annotations({ identifier: "Target" }) as any as S.Schema<Target>;
export type TargetList = Target[];
export const TargetList = S.Array(Target);
export interface FileSizes {
  source?: number;
  destination?: number;
  base?: number;
}
export const FileSizes = S.suspend(() =>
  S.Struct({
    source: S.optional(S.Number),
    destination: S.optional(S.Number),
    base: S.optional(S.Number),
  }),
).annotations({ identifier: "FileSizes" }) as any as S.Schema<FileSizes>;
export interface FileModes {
  source?: string;
  destination?: string;
  base?: string;
}
export const FileModes = S.suspend(() =>
  S.Struct({
    source: S.optional(S.String),
    destination: S.optional(S.String),
    base: S.optional(S.String),
  }),
).annotations({ identifier: "FileModes" }) as any as S.Schema<FileModes>;
export interface ObjectTypes {
  source?: string;
  destination?: string;
  base?: string;
}
export const ObjectTypes = S.suspend(() =>
  S.Struct({
    source: S.optional(S.String),
    destination: S.optional(S.String),
    base: S.optional(S.String),
  }),
).annotations({ identifier: "ObjectTypes" }) as any as S.Schema<ObjectTypes>;
export interface IsBinaryFile {
  source?: boolean;
  destination?: boolean;
  base?: boolean;
}
export const IsBinaryFile = S.suspend(() =>
  S.Struct({
    source: S.optional(S.Boolean),
    destination: S.optional(S.Boolean),
    base: S.optional(S.Boolean),
  }),
).annotations({ identifier: "IsBinaryFile" }) as any as S.Schema<IsBinaryFile>;
export interface MergeOperations {
  source?: string;
  destination?: string;
}
export const MergeOperations = S.suspend(() =>
  S.Struct({ source: S.optional(S.String), destination: S.optional(S.String) }),
).annotations({
  identifier: "MergeOperations",
}) as any as S.Schema<MergeOperations>;
export interface ConflictMetadata {
  filePath?: string;
  fileSizes?: FileSizes;
  fileModes?: FileModes;
  objectTypes?: ObjectTypes;
  numberOfConflicts?: number;
  isBinaryFile?: IsBinaryFile;
  contentConflict?: boolean;
  fileModeConflict?: boolean;
  objectTypeConflict?: boolean;
  mergeOperations?: MergeOperations;
}
export const ConflictMetadata = S.suspend(() =>
  S.Struct({
    filePath: S.optional(S.String),
    fileSizes: S.optional(FileSizes),
    fileModes: S.optional(FileModes),
    objectTypes: S.optional(ObjectTypes),
    numberOfConflicts: S.optional(S.Number),
    isBinaryFile: S.optional(IsBinaryFile),
    contentConflict: S.optional(S.Boolean),
    fileModeConflict: S.optional(S.Boolean),
    objectTypeConflict: S.optional(S.Boolean),
    mergeOperations: S.optional(MergeOperations),
  }),
).annotations({
  identifier: "ConflictMetadata",
}) as any as S.Schema<ConflictMetadata>;
export type ConflictMetadataList = ConflictMetadata[];
export const ConflictMetadataList = S.Array(ConflictMetadata);
export type MergeOptions = string[];
export const MergeOptions = S.Array(S.String);
export type ApprovalRuleTemplateNameList = string[];
export const ApprovalRuleTemplateNameList = S.Array(S.String);
export type PullRequestIdList = string[];
export const PullRequestIdList = S.Array(S.String);
export type RepositoryTriggerNameList = string[];
export const RepositoryTriggerNameList = S.Array(S.String);
export interface CreatePullRequestInput {
  title: string;
  description?: string;
  targets: TargetList;
  clientRequestToken?: string;
}
export const CreatePullRequestInput = S.suspend(() =>
  S.Struct({
    title: S.String,
    description: S.optional(S.String),
    targets: TargetList,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePullRequestInput",
}) as any as S.Schema<CreatePullRequestInput>;
export interface CreateRepositoryInput {
  repositoryName: string;
  repositoryDescription?: string;
  tags?: TagsMap;
  kmsKeyId?: string;
}
export const CreateRepositoryInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    repositoryDescription: S.optional(S.String),
    tags: S.optional(TagsMap),
    kmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRepositoryInput",
}) as any as S.Schema<CreateRepositoryInput>;
export interface DeleteApprovalRuleTemplateOutput {
  approvalRuleTemplateId: string;
}
export const DeleteApprovalRuleTemplateOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplateId: S.String }).pipe(ns),
).annotations({
  identifier: "DeleteApprovalRuleTemplateOutput",
}) as any as S.Schema<DeleteApprovalRuleTemplateOutput>;
export interface DeleteFileOutput {
  commitId: string;
  blobId: string;
  treeId: string;
  filePath: string;
}
export const DeleteFileOutput = S.suspend(() =>
  S.Struct({
    commitId: S.String,
    blobId: S.String,
    treeId: S.String,
    filePath: S.String,
  }).pipe(ns),
).annotations({
  identifier: "DeleteFileOutput",
}) as any as S.Schema<DeleteFileOutput>;
export interface DeletePullRequestApprovalRuleOutput {
  approvalRuleId: string;
}
export const DeletePullRequestApprovalRuleOutput = S.suspend(() =>
  S.Struct({ approvalRuleId: S.String }).pipe(ns),
).annotations({
  identifier: "DeletePullRequestApprovalRuleOutput",
}) as any as S.Schema<DeletePullRequestApprovalRuleOutput>;
export interface DeleteRepositoryOutput {
  repositoryId?: string;
}
export const DeleteRepositoryOutput = S.suspend(() =>
  S.Struct({ repositoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteRepositoryOutput",
}) as any as S.Schema<DeleteRepositoryOutput>;
export interface ApprovalRuleTemplate {
  approvalRuleTemplateId?: string;
  approvalRuleTemplateName?: string;
  approvalRuleTemplateDescription?: string;
  approvalRuleTemplateContent?: string;
  ruleContentSha256?: string;
  lastModifiedDate?: Date;
  creationDate?: Date;
  lastModifiedUser?: string;
}
export const ApprovalRuleTemplate = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateId: S.optional(S.String),
    approvalRuleTemplateName: S.optional(S.String),
    approvalRuleTemplateDescription: S.optional(S.String),
    approvalRuleTemplateContent: S.optional(S.String),
    ruleContentSha256: S.optional(S.String),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedUser: S.optional(S.String),
  }),
).annotations({
  identifier: "ApprovalRuleTemplate",
}) as any as S.Schema<ApprovalRuleTemplate>;
export interface GetApprovalRuleTemplateOutput {
  approvalRuleTemplate: ApprovalRuleTemplate;
}
export const GetApprovalRuleTemplateOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplate: ApprovalRuleTemplate }).pipe(ns),
).annotations({
  identifier: "GetApprovalRuleTemplateOutput",
}) as any as S.Schema<GetApprovalRuleTemplateOutput>;
export interface GetBlobOutput {
  content: Uint8Array;
}
export const GetBlobOutput = S.suspend(() =>
  S.Struct({ content: T.Blob }).pipe(ns),
).annotations({
  identifier: "GetBlobOutput",
}) as any as S.Schema<GetBlobOutput>;
export interface BranchInfo {
  branchName?: string;
  commitId?: string;
}
export const BranchInfo = S.suspend(() =>
  S.Struct({
    branchName: S.optional(S.String),
    commitId: S.optional(S.String),
  }),
).annotations({ identifier: "BranchInfo" }) as any as S.Schema<BranchInfo>;
export interface GetBranchOutput {
  branch?: BranchInfo;
}
export const GetBranchOutput = S.suspend(() =>
  S.Struct({ branch: S.optional(BranchInfo) }).pipe(ns),
).annotations({
  identifier: "GetBranchOutput",
}) as any as S.Schema<GetBranchOutput>;
export type CallerReactions = string[];
export const CallerReactions = S.Array(S.String);
export type ReactionCountsMap = { [key: string]: number };
export const ReactionCountsMap = S.Record({ key: S.String, value: S.Number });
export interface Comment {
  commentId?: string;
  content?: string;
  inReplyTo?: string;
  creationDate?: Date;
  lastModifiedDate?: Date;
  authorArn?: string;
  deleted?: boolean;
  clientRequestToken?: string;
  callerReactions?: CallerReactions;
  reactionCounts?: ReactionCountsMap;
}
export const Comment = S.suspend(() =>
  S.Struct({
    commentId: S.optional(S.String),
    content: S.optional(S.String),
    inReplyTo: S.optional(S.String),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    authorArn: S.optional(S.String),
    deleted: S.optional(S.Boolean),
    clientRequestToken: S.optional(S.String),
    callerReactions: S.optional(CallerReactions),
    reactionCounts: S.optional(ReactionCountsMap),
  }),
).annotations({ identifier: "Comment" }) as any as S.Schema<Comment>;
export interface GetCommentOutput {
  comment?: Comment;
}
export const GetCommentOutput = S.suspend(() =>
  S.Struct({ comment: S.optional(Comment) }).pipe(ns),
).annotations({
  identifier: "GetCommentOutput",
}) as any as S.Schema<GetCommentOutput>;
export type ParentList = string[];
export const ParentList = S.Array(S.String);
export interface UserInfo {
  name?: string;
  email?: string;
  date?: string;
}
export const UserInfo = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    email: S.optional(S.String),
    date: S.optional(S.String),
  }),
).annotations({ identifier: "UserInfo" }) as any as S.Schema<UserInfo>;
export interface Commit {
  commitId?: string;
  treeId?: string;
  parents?: ParentList;
  message?: string;
  author?: UserInfo;
  committer?: UserInfo;
  additionalData?: string;
}
export const Commit = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
    parents: S.optional(ParentList),
    message: S.optional(S.String),
    author: S.optional(UserInfo),
    committer: S.optional(UserInfo),
    additionalData: S.optional(S.String),
  }),
).annotations({ identifier: "Commit" }) as any as S.Schema<Commit>;
export interface GetCommitOutput {
  commit: Commit;
}
export const GetCommitOutput = S.suspend(() =>
  S.Struct({ commit: Commit }).pipe(ns),
).annotations({
  identifier: "GetCommitOutput",
}) as any as S.Schema<GetCommitOutput>;
export interface GetFileOutput {
  commitId: string;
  blobId: string;
  filePath: string;
  fileMode: string;
  fileSize: number;
  fileContent: Uint8Array;
}
export const GetFileOutput = S.suspend(() =>
  S.Struct({
    commitId: S.String,
    blobId: S.String,
    filePath: S.String,
    fileMode: S.String,
    fileSize: S.Number,
    fileContent: T.Blob,
  }).pipe(ns),
).annotations({
  identifier: "GetFileOutput",
}) as any as S.Schema<GetFileOutput>;
export interface GetMergeCommitOutput {
  sourceCommitId?: string;
  destinationCommitId?: string;
  baseCommitId?: string;
  mergedCommitId?: string;
}
export const GetMergeCommitOutput = S.suspend(() =>
  S.Struct({
    sourceCommitId: S.optional(S.String),
    destinationCommitId: S.optional(S.String),
    baseCommitId: S.optional(S.String),
    mergedCommitId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetMergeCommitOutput",
}) as any as S.Schema<GetMergeCommitOutput>;
export interface GetMergeConflictsOutput {
  mergeable: boolean;
  destinationCommitId: string;
  sourceCommitId: string;
  baseCommitId?: string;
  conflictMetadataList: ConflictMetadataList;
  nextToken?: string;
}
export const GetMergeConflictsOutput = S.suspend(() =>
  S.Struct({
    mergeable: S.Boolean,
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
    conflictMetadataList: ConflictMetadataList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetMergeConflictsOutput",
}) as any as S.Schema<GetMergeConflictsOutput>;
export interface GetMergeOptionsOutput {
  mergeOptions: MergeOptions;
  sourceCommitId: string;
  destinationCommitId: string;
  baseCommitId: string;
}
export const GetMergeOptionsOutput = S.suspend(() =>
  S.Struct({
    mergeOptions: MergeOptions,
    sourceCommitId: S.String,
    destinationCommitId: S.String,
    baseCommitId: S.String,
  }).pipe(ns),
).annotations({
  identifier: "GetMergeOptionsOutput",
}) as any as S.Schema<GetMergeOptionsOutput>;
export interface GetPullRequestOverrideStateOutput {
  overridden?: boolean;
  overrider?: string;
}
export const GetPullRequestOverrideStateOutput = S.suspend(() =>
  S.Struct({
    overridden: S.optional(S.Boolean),
    overrider: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetPullRequestOverrideStateOutput",
}) as any as S.Schema<GetPullRequestOverrideStateOutput>;
export interface RepositoryMetadata {
  accountId?: string;
  repositoryId?: string;
  repositoryName?: string;
  repositoryDescription?: string;
  defaultBranch?: string;
  lastModifiedDate?: Date;
  creationDate?: Date;
  cloneUrlHttp?: string;
  cloneUrlSsh?: string;
  Arn?: string;
  kmsKeyId?: string;
}
export const RepositoryMetadata = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    repositoryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    repositoryDescription: S.optional(S.String),
    defaultBranch: S.optional(S.String),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    cloneUrlHttp: S.optional(S.String),
    cloneUrlSsh: S.optional(S.String),
    Arn: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "RepositoryMetadata",
}) as any as S.Schema<RepositoryMetadata>;
export interface GetRepositoryOutput {
  repositoryMetadata?: RepositoryMetadata;
}
export const GetRepositoryOutput = S.suspend(() =>
  S.Struct({ repositoryMetadata: S.optional(RepositoryMetadata) }).pipe(ns),
).annotations({
  identifier: "GetRepositoryOutput",
}) as any as S.Schema<GetRepositoryOutput>;
export interface GetRepositoryTriggersOutput {
  configurationId?: string;
  triggers?: RepositoryTriggersList;
}
export const GetRepositoryTriggersOutput = S.suspend(() =>
  S.Struct({
    configurationId: S.optional(S.String),
    triggers: S.optional(RepositoryTriggersList),
  }).pipe(ns),
).annotations({
  identifier: "GetRepositoryTriggersOutput",
}) as any as S.Schema<GetRepositoryTriggersOutput>;
export interface ListApprovalRuleTemplatesOutput {
  approvalRuleTemplateNames?: ApprovalRuleTemplateNameList;
  nextToken?: string;
}
export const ListApprovalRuleTemplatesOutput = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateNames: S.optional(ApprovalRuleTemplateNameList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListApprovalRuleTemplatesOutput",
}) as any as S.Schema<ListApprovalRuleTemplatesOutput>;
export interface ListAssociatedApprovalRuleTemplatesForRepositoryOutput {
  approvalRuleTemplateNames?: ApprovalRuleTemplateNameList;
  nextToken?: string;
}
export const ListAssociatedApprovalRuleTemplatesForRepositoryOutput = S.suspend(
  () =>
    S.Struct({
      approvalRuleTemplateNames: S.optional(ApprovalRuleTemplateNameList),
      nextToken: S.optional(S.String),
    }).pipe(ns),
).annotations({
  identifier: "ListAssociatedApprovalRuleTemplatesForRepositoryOutput",
}) as any as S.Schema<ListAssociatedApprovalRuleTemplatesForRepositoryOutput>;
export interface ListBranchesOutput {
  branches?: BranchNameList;
  nextToken?: string;
}
export const ListBranchesOutput = S.suspend(() =>
  S.Struct({
    branches: S.optional(BranchNameList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListBranchesOutput",
}) as any as S.Schema<ListBranchesOutput>;
export interface ListPullRequestsOutput {
  pullRequestIds: PullRequestIdList;
  nextToken?: string;
}
export const ListPullRequestsOutput = S.suspend(() =>
  S.Struct({
    pullRequestIds: PullRequestIdList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPullRequestsOutput",
}) as any as S.Schema<ListPullRequestsOutput>;
export interface ListRepositoriesForApprovalRuleTemplateOutput {
  repositoryNames?: RepositoryNameList;
  nextToken?: string;
}
export const ListRepositoriesForApprovalRuleTemplateOutput = S.suspend(() =>
  S.Struct({
    repositoryNames: S.optional(RepositoryNameList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRepositoriesForApprovalRuleTemplateOutput",
}) as any as S.Schema<ListRepositoriesForApprovalRuleTemplateOutput>;
export interface ListTagsForResourceOutput {
  tags?: TagsMap;
  nextToken?: string;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface MergeBranchesByFastForwardOutput {
  commitId?: string;
  treeId?: string;
}
export const MergeBranchesByFastForwardOutput = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "MergeBranchesByFastForwardOutput",
}) as any as S.Schema<MergeBranchesByFastForwardOutput>;
export interface MergeBranchesBySquashOutput {
  commitId?: string;
  treeId?: string;
}
export const MergeBranchesBySquashOutput = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "MergeBranchesBySquashOutput",
}) as any as S.Schema<MergeBranchesBySquashOutput>;
export interface MergeBranchesByThreeWayOutput {
  commitId?: string;
  treeId?: string;
}
export const MergeBranchesByThreeWayOutput = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "MergeBranchesByThreeWayOutput",
}) as any as S.Schema<MergeBranchesByThreeWayOutput>;
export interface MergeMetadata {
  isMerged?: boolean;
  mergedBy?: string;
  mergeCommitId?: string;
  mergeOption?: string;
}
export const MergeMetadata = S.suspend(() =>
  S.Struct({
    isMerged: S.optional(S.Boolean),
    mergedBy: S.optional(S.String),
    mergeCommitId: S.optional(S.String),
    mergeOption: S.optional(S.String),
  }),
).annotations({
  identifier: "MergeMetadata",
}) as any as S.Schema<MergeMetadata>;
export interface PullRequestTarget {
  repositoryName?: string;
  sourceReference?: string;
  destinationReference?: string;
  destinationCommit?: string;
  sourceCommit?: string;
  mergeBase?: string;
  mergeMetadata?: MergeMetadata;
}
export const PullRequestTarget = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    sourceReference: S.optional(S.String),
    destinationReference: S.optional(S.String),
    destinationCommit: S.optional(S.String),
    sourceCommit: S.optional(S.String),
    mergeBase: S.optional(S.String),
    mergeMetadata: S.optional(MergeMetadata),
  }),
).annotations({
  identifier: "PullRequestTarget",
}) as any as S.Schema<PullRequestTarget>;
export type PullRequestTargetList = PullRequestTarget[];
export const PullRequestTargetList = S.Array(PullRequestTarget);
export interface OriginApprovalRuleTemplate {
  approvalRuleTemplateId?: string;
  approvalRuleTemplateName?: string;
}
export const OriginApprovalRuleTemplate = S.suspend(() =>
  S.Struct({
    approvalRuleTemplateId: S.optional(S.String),
    approvalRuleTemplateName: S.optional(S.String),
  }),
).annotations({
  identifier: "OriginApprovalRuleTemplate",
}) as any as S.Schema<OriginApprovalRuleTemplate>;
export interface ApprovalRule {
  approvalRuleId?: string;
  approvalRuleName?: string;
  approvalRuleContent?: string;
  ruleContentSha256?: string;
  lastModifiedDate?: Date;
  creationDate?: Date;
  lastModifiedUser?: string;
  originApprovalRuleTemplate?: OriginApprovalRuleTemplate;
}
export const ApprovalRule = S.suspend(() =>
  S.Struct({
    approvalRuleId: S.optional(S.String),
    approvalRuleName: S.optional(S.String),
    approvalRuleContent: S.optional(S.String),
    ruleContentSha256: S.optional(S.String),
    lastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedUser: S.optional(S.String),
    originApprovalRuleTemplate: S.optional(OriginApprovalRuleTemplate),
  }),
).annotations({ identifier: "ApprovalRule" }) as any as S.Schema<ApprovalRule>;
export type ApprovalRulesList = ApprovalRule[];
export const ApprovalRulesList = S.Array(ApprovalRule);
export interface PullRequest {
  pullRequestId?: string;
  title?: string;
  description?: string;
  lastActivityDate?: Date;
  creationDate?: Date;
  pullRequestStatus?: string;
  authorArn?: string;
  pullRequestTargets?: PullRequestTargetList;
  clientRequestToken?: string;
  revisionId?: string;
  approvalRules?: ApprovalRulesList;
}
export const PullRequest = S.suspend(() =>
  S.Struct({
    pullRequestId: S.optional(S.String),
    title: S.optional(S.String),
    description: S.optional(S.String),
    lastActivityDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pullRequestStatus: S.optional(S.String),
    authorArn: S.optional(S.String),
    pullRequestTargets: S.optional(PullRequestTargetList),
    clientRequestToken: S.optional(S.String),
    revisionId: S.optional(S.String),
    approvalRules: S.optional(ApprovalRulesList),
  }),
).annotations({ identifier: "PullRequest" }) as any as S.Schema<PullRequest>;
export interface MergePullRequestByFastForwardOutput {
  pullRequest?: PullRequest;
}
export const MergePullRequestByFastForwardOutput = S.suspend(() =>
  S.Struct({ pullRequest: S.optional(PullRequest) }).pipe(ns),
).annotations({
  identifier: "MergePullRequestByFastForwardOutput",
}) as any as S.Schema<MergePullRequestByFastForwardOutput>;
export interface MergePullRequestBySquashOutput {
  pullRequest?: PullRequest;
}
export const MergePullRequestBySquashOutput = S.suspend(() =>
  S.Struct({ pullRequest: S.optional(PullRequest) }).pipe(ns),
).annotations({
  identifier: "MergePullRequestBySquashOutput",
}) as any as S.Schema<MergePullRequestBySquashOutput>;
export interface MergePullRequestByThreeWayOutput {
  pullRequest?: PullRequest;
}
export const MergePullRequestByThreeWayOutput = S.suspend(() =>
  S.Struct({ pullRequest: S.optional(PullRequest) }).pipe(ns),
).annotations({
  identifier: "MergePullRequestByThreeWayOutput",
}) as any as S.Schema<MergePullRequestByThreeWayOutput>;
export interface PostCommentForComparedCommitInput {
  repositoryName: string;
  beforeCommitId?: string;
  afterCommitId: string;
  location?: Location;
  content: string;
  clientRequestToken?: string;
}
export const PostCommentForComparedCommitInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.String,
    location: S.optional(Location),
    content: S.String,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PostCommentForComparedCommitInput",
}) as any as S.Schema<PostCommentForComparedCommitInput>;
export interface PostCommentForPullRequestOutput {
  repositoryName?: string;
  pullRequestId?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  beforeBlobId?: string;
  afterBlobId?: string;
  location?: Location;
  comment?: Comment;
}
export const PostCommentForPullRequestOutput = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    pullRequestId: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comment: S.optional(Comment),
  }).pipe(ns),
).annotations({
  identifier: "PostCommentForPullRequestOutput",
}) as any as S.Schema<PostCommentForPullRequestOutput>;
export interface PostCommentReplyOutput {
  comment?: Comment;
}
export const PostCommentReplyOutput = S.suspend(() =>
  S.Struct({ comment: S.optional(Comment) }).pipe(ns),
).annotations({
  identifier: "PostCommentReplyOutput",
}) as any as S.Schema<PostCommentReplyOutput>;
export interface PutFileOutput {
  commitId: string;
  blobId: string;
  treeId: string;
}
export const PutFileOutput = S.suspend(() =>
  S.Struct({ commitId: S.String, blobId: S.String, treeId: S.String }).pipe(ns),
).annotations({
  identifier: "PutFileOutput",
}) as any as S.Schema<PutFileOutput>;
export interface PutRepositoryTriggersInput {
  repositoryName: string;
  triggers: RepositoryTriggersList;
}
export const PutRepositoryTriggersInput = S.suspend(() =>
  S.Struct({ repositoryName: S.String, triggers: RepositoryTriggersList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutRepositoryTriggersInput",
}) as any as S.Schema<PutRepositoryTriggersInput>;
export interface UpdateApprovalRuleTemplateContentOutput {
  approvalRuleTemplate: ApprovalRuleTemplate;
}
export const UpdateApprovalRuleTemplateContentOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplate: ApprovalRuleTemplate }).pipe(ns),
).annotations({
  identifier: "UpdateApprovalRuleTemplateContentOutput",
}) as any as S.Schema<UpdateApprovalRuleTemplateContentOutput>;
export interface UpdateApprovalRuleTemplateDescriptionOutput {
  approvalRuleTemplate: ApprovalRuleTemplate;
}
export const UpdateApprovalRuleTemplateDescriptionOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplate: ApprovalRuleTemplate }).pipe(ns),
).annotations({
  identifier: "UpdateApprovalRuleTemplateDescriptionOutput",
}) as any as S.Schema<UpdateApprovalRuleTemplateDescriptionOutput>;
export interface UpdateApprovalRuleTemplateNameOutput {
  approvalRuleTemplate: ApprovalRuleTemplate;
}
export const UpdateApprovalRuleTemplateNameOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplate: ApprovalRuleTemplate }).pipe(ns),
).annotations({
  identifier: "UpdateApprovalRuleTemplateNameOutput",
}) as any as S.Schema<UpdateApprovalRuleTemplateNameOutput>;
export interface UpdateCommentOutput {
  comment?: Comment;
}
export const UpdateCommentOutput = S.suspend(() =>
  S.Struct({ comment: S.optional(Comment) }).pipe(ns),
).annotations({
  identifier: "UpdateCommentOutput",
}) as any as S.Schema<UpdateCommentOutput>;
export interface UpdatePullRequestApprovalRuleContentOutput {
  approvalRule: ApprovalRule;
}
export const UpdatePullRequestApprovalRuleContentOutput = S.suspend(() =>
  S.Struct({ approvalRule: ApprovalRule }).pipe(ns),
).annotations({
  identifier: "UpdatePullRequestApprovalRuleContentOutput",
}) as any as S.Schema<UpdatePullRequestApprovalRuleContentOutput>;
export interface UpdatePullRequestDescriptionOutput {
  pullRequest: PullRequest;
}
export const UpdatePullRequestDescriptionOutput = S.suspend(() =>
  S.Struct({ pullRequest: PullRequest }).pipe(ns),
).annotations({
  identifier: "UpdatePullRequestDescriptionOutput",
}) as any as S.Schema<UpdatePullRequestDescriptionOutput>;
export interface UpdatePullRequestStatusOutput {
  pullRequest: PullRequest;
}
export const UpdatePullRequestStatusOutput = S.suspend(() =>
  S.Struct({ pullRequest: PullRequest }).pipe(ns),
).annotations({
  identifier: "UpdatePullRequestStatusOutput",
}) as any as S.Schema<UpdatePullRequestStatusOutput>;
export interface UpdatePullRequestTitleOutput {
  pullRequest: PullRequest;
}
export const UpdatePullRequestTitleOutput = S.suspend(() =>
  S.Struct({ pullRequest: PullRequest }).pipe(ns),
).annotations({
  identifier: "UpdatePullRequestTitleOutput",
}) as any as S.Schema<UpdatePullRequestTitleOutput>;
export interface UpdateRepositoryEncryptionKeyOutput {
  repositoryId?: string;
  kmsKeyId?: string;
  originalKmsKeyId?: string;
}
export const UpdateRepositoryEncryptionKeyOutput = S.suspend(() =>
  S.Struct({
    repositoryId: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    originalKmsKeyId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateRepositoryEncryptionKeyOutput",
}) as any as S.Schema<UpdateRepositoryEncryptionKeyOutput>;
export interface SourceFileSpecifier {
  filePath: string;
  isMove?: boolean;
}
export const SourceFileSpecifier = S.suspend(() =>
  S.Struct({ filePath: S.String, isMove: S.optional(S.Boolean) }),
).annotations({
  identifier: "SourceFileSpecifier",
}) as any as S.Schema<SourceFileSpecifier>;
export type ApprovalRulesSatisfiedList = string[];
export const ApprovalRulesSatisfiedList = S.Array(S.String);
export type ApprovalRulesNotSatisfiedList = string[];
export const ApprovalRulesNotSatisfiedList = S.Array(S.String);
export type ReactionUsersList = string[];
export const ReactionUsersList = S.Array(S.String);
export type Comments = Comment[];
export const Comments = S.Array(Comment);
export type RevisionChildren = string[];
export const RevisionChildren = S.Array(S.String);
export interface BatchAssociateApprovalRuleTemplateWithRepositoriesError {
  repositoryName?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchAssociateApprovalRuleTemplateWithRepositoriesError =
  S.suspend(() =>
    S.Struct({
      repositoryName: S.optional(S.String),
      errorCode: S.optional(S.String),
      errorMessage: S.optional(S.String),
    }),
  ).annotations({
    identifier: "BatchAssociateApprovalRuleTemplateWithRepositoriesError",
  }) as any as S.Schema<BatchAssociateApprovalRuleTemplateWithRepositoriesError>;
export type BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList =
  BatchAssociateApprovalRuleTemplateWithRepositoriesError[];
export const BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList =
  S.Array(BatchAssociateApprovalRuleTemplateWithRepositoriesError);
export interface MergeHunkDetail {
  startLine?: number;
  endLine?: number;
  hunkContent?: string;
}
export const MergeHunkDetail = S.suspend(() =>
  S.Struct({
    startLine: S.optional(S.Number),
    endLine: S.optional(S.Number),
    hunkContent: S.optional(S.String),
  }),
).annotations({
  identifier: "MergeHunkDetail",
}) as any as S.Schema<MergeHunkDetail>;
export interface MergeHunk {
  isConflict?: boolean;
  source?: MergeHunkDetail;
  destination?: MergeHunkDetail;
  base?: MergeHunkDetail;
}
export const MergeHunk = S.suspend(() =>
  S.Struct({
    isConflict: S.optional(S.Boolean),
    source: S.optional(MergeHunkDetail),
    destination: S.optional(MergeHunkDetail),
    base: S.optional(MergeHunkDetail),
  }),
).annotations({ identifier: "MergeHunk" }) as any as S.Schema<MergeHunk>;
export type MergeHunks = MergeHunk[];
export const MergeHunks = S.Array(MergeHunk);
export interface Conflict {
  conflictMetadata?: ConflictMetadata;
  mergeHunks?: MergeHunks;
}
export const Conflict = S.suspend(() =>
  S.Struct({
    conflictMetadata: S.optional(ConflictMetadata),
    mergeHunks: S.optional(MergeHunks),
  }),
).annotations({ identifier: "Conflict" }) as any as S.Schema<Conflict>;
export type Conflicts = Conflict[];
export const Conflicts = S.Array(Conflict);
export interface BatchDescribeMergeConflictsError {
  filePath: string;
  exceptionName: string;
  message: string;
}
export const BatchDescribeMergeConflictsError = S.suspend(() =>
  S.Struct({ filePath: S.String, exceptionName: S.String, message: S.String }),
).annotations({
  identifier: "BatchDescribeMergeConflictsError",
}) as any as S.Schema<BatchDescribeMergeConflictsError>;
export type BatchDescribeMergeConflictsErrors =
  BatchDescribeMergeConflictsError[];
export const BatchDescribeMergeConflictsErrors = S.Array(
  BatchDescribeMergeConflictsError,
);
export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesError {
  repositoryName?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchDisassociateApprovalRuleTemplateFromRepositoriesError =
  S.suspend(() =>
    S.Struct({
      repositoryName: S.optional(S.String),
      errorCode: S.optional(S.String),
      errorMessage: S.optional(S.String),
    }),
  ).annotations({
    identifier: "BatchDisassociateApprovalRuleTemplateFromRepositoriesError",
  }) as any as S.Schema<BatchDisassociateApprovalRuleTemplateFromRepositoriesError>;
export type BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList =
  BatchDisassociateApprovalRuleTemplateFromRepositoriesError[];
export const BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList =
  S.Array(BatchDisassociateApprovalRuleTemplateFromRepositoriesError);
export interface BatchGetCommitsError {
  commitId?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchGetCommitsError = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetCommitsError",
}) as any as S.Schema<BatchGetCommitsError>;
export type BatchGetCommitsErrorsList = BatchGetCommitsError[];
export const BatchGetCommitsErrorsList = S.Array(BatchGetCommitsError);
export type RepositoryMetadataList = RepositoryMetadata[];
export const RepositoryMetadataList = S.Array(RepositoryMetadata);
export interface BatchGetRepositoriesError {
  repositoryId?: string;
  repositoryName?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const BatchGetRepositoriesError = S.suspend(() =>
  S.Struct({
    repositoryId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetRepositoriesError",
}) as any as S.Schema<BatchGetRepositoriesError>;
export type BatchGetRepositoriesErrorsList = BatchGetRepositoriesError[];
export const BatchGetRepositoriesErrorsList = S.Array(
  BatchGetRepositoriesError,
);
export interface PutFileEntry {
  filePath: string;
  fileMode?: string;
  fileContent?: Uint8Array;
  sourceFile?: SourceFileSpecifier;
}
export const PutFileEntry = S.suspend(() =>
  S.Struct({
    filePath: S.String,
    fileMode: S.optional(S.String),
    fileContent: S.optional(T.Blob),
    sourceFile: S.optional(SourceFileSpecifier),
  }),
).annotations({ identifier: "PutFileEntry" }) as any as S.Schema<PutFileEntry>;
export type PutFileEntries = PutFileEntry[];
export const PutFileEntries = S.Array(PutFileEntry);
export interface Evaluation {
  approved?: boolean;
  overridden?: boolean;
  approvalRulesSatisfied?: ApprovalRulesSatisfiedList;
  approvalRulesNotSatisfied?: ApprovalRulesNotSatisfiedList;
}
export const Evaluation = S.suspend(() =>
  S.Struct({
    approved: S.optional(S.Boolean),
    overridden: S.optional(S.Boolean),
    approvalRulesSatisfied: S.optional(ApprovalRulesSatisfiedList),
    approvalRulesNotSatisfied: S.optional(ApprovalRulesNotSatisfiedList),
  }),
).annotations({ identifier: "Evaluation" }) as any as S.Schema<Evaluation>;
export interface CommentsForComparedCommit {
  repositoryName?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  beforeBlobId?: string;
  afterBlobId?: string;
  location?: Location;
  comments?: Comments;
}
export const CommentsForComparedCommit = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comments: S.optional(Comments),
  }),
).annotations({
  identifier: "CommentsForComparedCommit",
}) as any as S.Schema<CommentsForComparedCommit>;
export type CommentsForComparedCommitData = CommentsForComparedCommit[];
export const CommentsForComparedCommitData = S.Array(CommentsForComparedCommit);
export interface CommentsForPullRequest {
  pullRequestId?: string;
  repositoryName?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  beforeBlobId?: string;
  afterBlobId?: string;
  location?: Location;
  comments?: Comments;
}
export const CommentsForPullRequest = S.suspend(() =>
  S.Struct({
    pullRequestId: S.optional(S.String),
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comments: S.optional(Comments),
  }),
).annotations({
  identifier: "CommentsForPullRequest",
}) as any as S.Schema<CommentsForPullRequest>;
export type CommentsForPullRequestData = CommentsForPullRequest[];
export const CommentsForPullRequestData = S.Array(CommentsForPullRequest);
export interface Folder {
  treeId?: string;
  absolutePath?: string;
  relativePath?: string;
}
export const Folder = S.suspend(() =>
  S.Struct({
    treeId: S.optional(S.String),
    absolutePath: S.optional(S.String),
    relativePath: S.optional(S.String),
  }),
).annotations({ identifier: "Folder" }) as any as S.Schema<Folder>;
export type FolderList = Folder[];
export const FolderList = S.Array(Folder);
export interface File {
  blobId?: string;
  absolutePath?: string;
  relativePath?: string;
  fileMode?: string;
}
export const File = S.suspend(() =>
  S.Struct({
    blobId: S.optional(S.String),
    absolutePath: S.optional(S.String),
    relativePath: S.optional(S.String),
    fileMode: S.optional(S.String),
  }),
).annotations({ identifier: "File" }) as any as S.Schema<File>;
export type FileList = File[];
export const FileList = S.Array(File);
export interface SymbolicLink {
  blobId?: string;
  absolutePath?: string;
  relativePath?: string;
  fileMode?: string;
}
export const SymbolicLink = S.suspend(() =>
  S.Struct({
    blobId: S.optional(S.String),
    absolutePath: S.optional(S.String),
    relativePath: S.optional(S.String),
    fileMode: S.optional(S.String),
  }),
).annotations({ identifier: "SymbolicLink" }) as any as S.Schema<SymbolicLink>;
export type SymbolicLinkList = SymbolicLink[];
export const SymbolicLinkList = S.Array(SymbolicLink);
export interface SubModule {
  commitId?: string;
  absolutePath?: string;
  relativePath?: string;
}
export const SubModule = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    absolutePath: S.optional(S.String),
    relativePath: S.optional(S.String),
  }),
).annotations({ identifier: "SubModule" }) as any as S.Schema<SubModule>;
export type SubModuleList = SubModule[];
export const SubModuleList = S.Array(SubModule);
export interface Approval {
  userArn?: string;
  approvalState?: string;
}
export const Approval = S.suspend(() =>
  S.Struct({
    userArn: S.optional(S.String),
    approvalState: S.optional(S.String),
  }),
).annotations({ identifier: "Approval" }) as any as S.Schema<Approval>;
export type ApprovalList = Approval[];
export const ApprovalList = S.Array(Approval);
export interface FileVersion {
  commit?: Commit;
  blobId?: string;
  path?: string;
  revisionChildren?: RevisionChildren;
}
export const FileVersion = S.suspend(() =>
  S.Struct({
    commit: S.optional(Commit),
    blobId: S.optional(S.String),
    path: S.optional(S.String),
    revisionChildren: S.optional(RevisionChildren),
  }),
).annotations({ identifier: "FileVersion" }) as any as S.Schema<FileVersion>;
export type RevisionDag = FileVersion[];
export const RevisionDag = S.Array(FileVersion);
export interface RepositoryNameIdPair {
  repositoryName?: string;
  repositoryId?: string;
}
export const RepositoryNameIdPair = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    repositoryId: S.optional(S.String),
  }),
).annotations({
  identifier: "RepositoryNameIdPair",
}) as any as S.Schema<RepositoryNameIdPair>;
export type RepositoryNameIdPairList = RepositoryNameIdPair[];
export const RepositoryNameIdPairList = S.Array(RepositoryNameIdPair);
export interface RepositoryTriggerExecutionFailure {
  trigger?: string;
  failureMessage?: string;
}
export const RepositoryTriggerExecutionFailure = S.suspend(() =>
  S.Struct({
    trigger: S.optional(S.String),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "RepositoryTriggerExecutionFailure",
}) as any as S.Schema<RepositoryTriggerExecutionFailure>;
export type RepositoryTriggerExecutionFailureList =
  RepositoryTriggerExecutionFailure[];
export const RepositoryTriggerExecutionFailureList = S.Array(
  RepositoryTriggerExecutionFailure,
);
export interface BatchAssociateApprovalRuleTemplateWithRepositoriesOutput {
  associatedRepositoryNames: RepositoryNameList;
  errors: BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList;
}
export const BatchAssociateApprovalRuleTemplateWithRepositoriesOutput =
  S.suspend(() =>
    S.Struct({
      associatedRepositoryNames: RepositoryNameList,
      errors: BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList,
    }).pipe(ns),
  ).annotations({
    identifier: "BatchAssociateApprovalRuleTemplateWithRepositoriesOutput",
  }) as any as S.Schema<BatchAssociateApprovalRuleTemplateWithRepositoriesOutput>;
export interface BatchDescribeMergeConflictsOutput {
  conflicts: Conflicts;
  nextToken?: string;
  errors?: BatchDescribeMergeConflictsErrors;
  destinationCommitId: string;
  sourceCommitId: string;
  baseCommitId?: string;
}
export const BatchDescribeMergeConflictsOutput = S.suspend(() =>
  S.Struct({
    conflicts: Conflicts,
    nextToken: S.optional(S.String),
    errors: S.optional(BatchDescribeMergeConflictsErrors),
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "BatchDescribeMergeConflictsOutput",
}) as any as S.Schema<BatchDescribeMergeConflictsOutput>;
export interface BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput {
  disassociatedRepositoryNames: RepositoryNameList;
  errors: BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList;
}
export const BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput =
  S.suspend(() =>
    S.Struct({
      disassociatedRepositoryNames: RepositoryNameList,
      errors: BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList,
    }).pipe(ns),
  ).annotations({
    identifier: "BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput",
  }) as any as S.Schema<BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput>;
export interface BatchGetRepositoriesOutput {
  repositories?: RepositoryMetadataList;
  repositoriesNotFound?: RepositoryNotFoundList;
  errors?: BatchGetRepositoriesErrorsList;
}
export const BatchGetRepositoriesOutput = S.suspend(() =>
  S.Struct({
    repositories: S.optional(RepositoryMetadataList),
    repositoriesNotFound: S.optional(RepositoryNotFoundList),
    errors: S.optional(BatchGetRepositoriesErrorsList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetRepositoriesOutput",
}) as any as S.Schema<BatchGetRepositoriesOutput>;
export interface CreateApprovalRuleTemplateOutput {
  approvalRuleTemplate: ApprovalRuleTemplate;
}
export const CreateApprovalRuleTemplateOutput = S.suspend(() =>
  S.Struct({ approvalRuleTemplate: ApprovalRuleTemplate }).pipe(ns),
).annotations({
  identifier: "CreateApprovalRuleTemplateOutput",
}) as any as S.Schema<CreateApprovalRuleTemplateOutput>;
export interface CreateCommitInput {
  repositoryName: string;
  branchName: string;
  parentCommitId?: string;
  authorName?: string;
  email?: string;
  commitMessage?: string;
  keepEmptyFolders?: boolean;
  putFiles?: PutFileEntries;
  deleteFiles?: DeleteFileEntries;
  setFileModes?: SetFileModeEntries;
}
export const CreateCommitInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    branchName: S.String,
    parentCommitId: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    commitMessage: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    putFiles: S.optional(PutFileEntries),
    deleteFiles: S.optional(DeleteFileEntries),
    setFileModes: S.optional(SetFileModeEntries),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCommitInput",
}) as any as S.Schema<CreateCommitInput>;
export interface CreatePullRequestOutput {
  pullRequest: PullRequest;
}
export const CreatePullRequestOutput = S.suspend(() =>
  S.Struct({ pullRequest: PullRequest }).pipe(ns),
).annotations({
  identifier: "CreatePullRequestOutput",
}) as any as S.Schema<CreatePullRequestOutput>;
export interface CreateRepositoryOutput {
  repositoryMetadata?: RepositoryMetadata;
}
export const CreateRepositoryOutput = S.suspend(() =>
  S.Struct({ repositoryMetadata: S.optional(RepositoryMetadata) }).pipe(ns),
).annotations({
  identifier: "CreateRepositoryOutput",
}) as any as S.Schema<CreateRepositoryOutput>;
export interface CreateUnreferencedMergeCommitInput {
  repositoryName: string;
  sourceCommitSpecifier: string;
  destinationCommitSpecifier: string;
  mergeOption: string;
  conflictDetailLevel?: string;
  conflictResolutionStrategy?: string;
  authorName?: string;
  email?: string;
  commitMessage?: string;
  keepEmptyFolders?: boolean;
  conflictResolution?: ConflictResolution;
}
export const CreateUnreferencedMergeCommitInput = S.suspend(() =>
  S.Struct({
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    mergeOption: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    authorName: S.optional(S.String),
    email: S.optional(S.String),
    commitMessage: S.optional(S.String),
    keepEmptyFolders: S.optional(S.Boolean),
    conflictResolution: S.optional(ConflictResolution),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUnreferencedMergeCommitInput",
}) as any as S.Schema<CreateUnreferencedMergeCommitInput>;
export interface DeleteBranchOutput {
  deletedBranch?: BranchInfo;
}
export const DeleteBranchOutput = S.suspend(() =>
  S.Struct({ deletedBranch: S.optional(BranchInfo) }).pipe(ns),
).annotations({
  identifier: "DeleteBranchOutput",
}) as any as S.Schema<DeleteBranchOutput>;
export interface EvaluatePullRequestApprovalRulesOutput {
  evaluation: Evaluation;
}
export const EvaluatePullRequestApprovalRulesOutput = S.suspend(() =>
  S.Struct({ evaluation: Evaluation }).pipe(ns),
).annotations({
  identifier: "EvaluatePullRequestApprovalRulesOutput",
}) as any as S.Schema<EvaluatePullRequestApprovalRulesOutput>;
export interface GetCommentsForComparedCommitOutput {
  commentsForComparedCommitData?: CommentsForComparedCommitData;
  nextToken?: string;
}
export const GetCommentsForComparedCommitOutput = S.suspend(() =>
  S.Struct({
    commentsForComparedCommitData: S.optional(CommentsForComparedCommitData),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetCommentsForComparedCommitOutput",
}) as any as S.Schema<GetCommentsForComparedCommitOutput>;
export interface GetCommentsForPullRequestOutput {
  commentsForPullRequestData?: CommentsForPullRequestData;
  nextToken?: string;
}
export const GetCommentsForPullRequestOutput = S.suspend(() =>
  S.Struct({
    commentsForPullRequestData: S.optional(CommentsForPullRequestData),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetCommentsForPullRequestOutput",
}) as any as S.Schema<GetCommentsForPullRequestOutput>;
export interface GetFolderOutput {
  commitId: string;
  folderPath: string;
  treeId?: string;
  subFolders?: FolderList;
  files?: FileList;
  symbolicLinks?: SymbolicLinkList;
  subModules?: SubModuleList;
}
export const GetFolderOutput = S.suspend(() =>
  S.Struct({
    commitId: S.String,
    folderPath: S.String,
    treeId: S.optional(S.String),
    subFolders: S.optional(FolderList),
    files: S.optional(FileList),
    symbolicLinks: S.optional(SymbolicLinkList),
    subModules: S.optional(SubModuleList),
  }).pipe(ns),
).annotations({
  identifier: "GetFolderOutput",
}) as any as S.Schema<GetFolderOutput>;
export interface GetPullRequestApprovalStatesOutput {
  approvals?: ApprovalList;
}
export const GetPullRequestApprovalStatesOutput = S.suspend(() =>
  S.Struct({ approvals: S.optional(ApprovalList) }).pipe(ns),
).annotations({
  identifier: "GetPullRequestApprovalStatesOutput",
}) as any as S.Schema<GetPullRequestApprovalStatesOutput>;
export interface ListFileCommitHistoryResponse {
  revisionDag: RevisionDag;
  nextToken?: string;
}
export const ListFileCommitHistoryResponse = S.suspend(() =>
  S.Struct({ revisionDag: RevisionDag, nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListFileCommitHistoryResponse",
}) as any as S.Schema<ListFileCommitHistoryResponse>;
export interface ListRepositoriesOutput {
  repositories?: RepositoryNameIdPairList;
  nextToken?: string;
}
export const ListRepositoriesOutput = S.suspend(() =>
  S.Struct({
    repositories: S.optional(RepositoryNameIdPairList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRepositoriesOutput",
}) as any as S.Schema<ListRepositoriesOutput>;
export interface PostCommentForComparedCommitOutput {
  repositoryName?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  beforeBlobId?: string;
  afterBlobId?: string;
  location?: Location;
  comment?: Comment;
}
export const PostCommentForComparedCommitOutput = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comment: S.optional(Comment),
  }).pipe(ns),
).annotations({
  identifier: "PostCommentForComparedCommitOutput",
}) as any as S.Schema<PostCommentForComparedCommitOutput>;
export interface PutRepositoryTriggersOutput {
  configurationId?: string;
}
export const PutRepositoryTriggersOutput = S.suspend(() =>
  S.Struct({ configurationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "PutRepositoryTriggersOutput",
}) as any as S.Schema<PutRepositoryTriggersOutput>;
export interface TestRepositoryTriggersOutput {
  successfulExecutions?: RepositoryTriggerNameList;
  failedExecutions?: RepositoryTriggerExecutionFailureList;
}
export const TestRepositoryTriggersOutput = S.suspend(() =>
  S.Struct({
    successfulExecutions: S.optional(RepositoryTriggerNameList),
    failedExecutions: S.optional(RepositoryTriggerExecutionFailureList),
  }).pipe(ns),
).annotations({
  identifier: "TestRepositoryTriggersOutput",
}) as any as S.Schema<TestRepositoryTriggersOutput>;
export interface PullRequestCreatedEventMetadata {
  repositoryName?: string;
  sourceCommitId?: string;
  destinationCommitId?: string;
  mergeBase?: string;
}
export const PullRequestCreatedEventMetadata = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    sourceCommitId: S.optional(S.String),
    destinationCommitId: S.optional(S.String),
    mergeBase: S.optional(S.String),
  }),
).annotations({
  identifier: "PullRequestCreatedEventMetadata",
}) as any as S.Schema<PullRequestCreatedEventMetadata>;
export interface PullRequestStatusChangedEventMetadata {
  pullRequestStatus?: string;
}
export const PullRequestStatusChangedEventMetadata = S.suspend(() =>
  S.Struct({ pullRequestStatus: S.optional(S.String) }),
).annotations({
  identifier: "PullRequestStatusChangedEventMetadata",
}) as any as S.Schema<PullRequestStatusChangedEventMetadata>;
export interface PullRequestSourceReferenceUpdatedEventMetadata {
  repositoryName?: string;
  beforeCommitId?: string;
  afterCommitId?: string;
  mergeBase?: string;
}
export const PullRequestSourceReferenceUpdatedEventMetadata = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    mergeBase: S.optional(S.String),
  }),
).annotations({
  identifier: "PullRequestSourceReferenceUpdatedEventMetadata",
}) as any as S.Schema<PullRequestSourceReferenceUpdatedEventMetadata>;
export interface ApprovalRuleEventMetadata {
  approvalRuleName?: string;
  approvalRuleId?: string;
  approvalRuleContent?: string;
}
export const ApprovalRuleEventMetadata = S.suspend(() =>
  S.Struct({
    approvalRuleName: S.optional(S.String),
    approvalRuleId: S.optional(S.String),
    approvalRuleContent: S.optional(S.String),
  }),
).annotations({
  identifier: "ApprovalRuleEventMetadata",
}) as any as S.Schema<ApprovalRuleEventMetadata>;
export interface ApprovalStateChangedEventMetadata {
  revisionId?: string;
  approvalStatus?: string;
}
export const ApprovalStateChangedEventMetadata = S.suspend(() =>
  S.Struct({
    revisionId: S.optional(S.String),
    approvalStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ApprovalStateChangedEventMetadata",
}) as any as S.Schema<ApprovalStateChangedEventMetadata>;
export interface ApprovalRuleOverriddenEventMetadata {
  revisionId?: string;
  overrideStatus?: string;
}
export const ApprovalRuleOverriddenEventMetadata = S.suspend(() =>
  S.Struct({
    revisionId: S.optional(S.String),
    overrideStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ApprovalRuleOverriddenEventMetadata",
}) as any as S.Schema<ApprovalRuleOverriddenEventMetadata>;
export interface ReactionValueFormats {
  emoji?: string;
  shortCode?: string;
  unicode?: string;
}
export const ReactionValueFormats = S.suspend(() =>
  S.Struct({
    emoji: S.optional(S.String),
    shortCode: S.optional(S.String),
    unicode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReactionValueFormats",
}) as any as S.Schema<ReactionValueFormats>;
export interface BlobMetadata {
  blobId?: string;
  path?: string;
  mode?: string;
}
export const BlobMetadata = S.suspend(() =>
  S.Struct({
    blobId: S.optional(S.String),
    path: S.optional(S.String),
    mode: S.optional(S.String),
  }),
).annotations({ identifier: "BlobMetadata" }) as any as S.Schema<BlobMetadata>;
export type CommitObjectsList = Commit[];
export const CommitObjectsList = S.Array(Commit);
export interface ReactionForComment {
  reaction?: ReactionValueFormats;
  reactionUsers?: ReactionUsersList;
  reactionsFromDeletedUsersCount?: number;
}
export const ReactionForComment = S.suspend(() =>
  S.Struct({
    reaction: S.optional(ReactionValueFormats),
    reactionUsers: S.optional(ReactionUsersList),
    reactionsFromDeletedUsersCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ReactionForComment",
}) as any as S.Schema<ReactionForComment>;
export type ReactionsForCommentList = ReactionForComment[];
export const ReactionsForCommentList = S.Array(ReactionForComment);
export interface Difference {
  beforeBlob?: BlobMetadata;
  afterBlob?: BlobMetadata;
  changeType?: string;
}
export const Difference = S.suspend(() =>
  S.Struct({
    beforeBlob: S.optional(BlobMetadata),
    afterBlob: S.optional(BlobMetadata),
    changeType: S.optional(S.String),
  }),
).annotations({ identifier: "Difference" }) as any as S.Schema<Difference>;
export type DifferenceList = Difference[];
export const DifferenceList = S.Array(Difference);
export interface BatchGetCommitsOutput {
  commits?: CommitObjectsList;
  errors?: BatchGetCommitsErrorsList;
}
export const BatchGetCommitsOutput = S.suspend(() =>
  S.Struct({
    commits: S.optional(CommitObjectsList),
    errors: S.optional(BatchGetCommitsErrorsList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetCommitsOutput",
}) as any as S.Schema<BatchGetCommitsOutput>;
export interface CreatePullRequestApprovalRuleOutput {
  approvalRule: ApprovalRule;
}
export const CreatePullRequestApprovalRuleOutput = S.suspend(() =>
  S.Struct({ approvalRule: ApprovalRule }).pipe(ns),
).annotations({
  identifier: "CreatePullRequestApprovalRuleOutput",
}) as any as S.Schema<CreatePullRequestApprovalRuleOutput>;
export interface CreateUnreferencedMergeCommitOutput {
  commitId?: string;
  treeId?: string;
}
export const CreateUnreferencedMergeCommitOutput = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateUnreferencedMergeCommitOutput",
}) as any as S.Schema<CreateUnreferencedMergeCommitOutput>;
export interface DeleteCommentContentOutput {
  comment?: Comment;
}
export const DeleteCommentContentOutput = S.suspend(() =>
  S.Struct({ comment: S.optional(Comment) }).pipe(ns),
).annotations({
  identifier: "DeleteCommentContentOutput",
}) as any as S.Schema<DeleteCommentContentOutput>;
export interface DescribeMergeConflictsOutput {
  conflictMetadata: ConflictMetadata;
  mergeHunks: MergeHunks;
  nextToken?: string;
  destinationCommitId: string;
  sourceCommitId: string;
  baseCommitId?: string;
}
export const DescribeMergeConflictsOutput = S.suspend(() =>
  S.Struct({
    conflictMetadata: ConflictMetadata,
    mergeHunks: MergeHunks,
    nextToken: S.optional(S.String),
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMergeConflictsOutput",
}) as any as S.Schema<DescribeMergeConflictsOutput>;
export interface GetCommentReactionsOutput {
  reactionsForComment: ReactionsForCommentList;
  nextToken?: string;
}
export const GetCommentReactionsOutput = S.suspend(() =>
  S.Struct({
    reactionsForComment: ReactionsForCommentList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetCommentReactionsOutput",
}) as any as S.Schema<GetCommentReactionsOutput>;
export interface GetDifferencesOutput {
  differences?: DifferenceList;
  NextToken?: string;
}
export const GetDifferencesOutput = S.suspend(() =>
  S.Struct({
    differences: S.optional(DifferenceList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDifferencesOutput",
}) as any as S.Schema<GetDifferencesOutput>;
export interface GetPullRequestOutput {
  pullRequest: PullRequest;
}
export const GetPullRequestOutput = S.suspend(() =>
  S.Struct({ pullRequest: PullRequest }).pipe(ns),
).annotations({
  identifier: "GetPullRequestOutput",
}) as any as S.Schema<GetPullRequestOutput>;
export interface PullRequestMergedStateChangedEventMetadata {
  repositoryName?: string;
  destinationReference?: string;
  mergeMetadata?: MergeMetadata;
}
export const PullRequestMergedStateChangedEventMetadata = S.suspend(() =>
  S.Struct({
    repositoryName: S.optional(S.String),
    destinationReference: S.optional(S.String),
    mergeMetadata: S.optional(MergeMetadata),
  }),
).annotations({
  identifier: "PullRequestMergedStateChangedEventMetadata",
}) as any as S.Schema<PullRequestMergedStateChangedEventMetadata>;
export interface FileMetadata {
  absolutePath?: string;
  blobId?: string;
  fileMode?: string;
}
export const FileMetadata = S.suspend(() =>
  S.Struct({
    absolutePath: S.optional(S.String),
    blobId: S.optional(S.String),
    fileMode: S.optional(S.String),
  }),
).annotations({ identifier: "FileMetadata" }) as any as S.Schema<FileMetadata>;
export type FilesMetadata = FileMetadata[];
export const FilesMetadata = S.Array(FileMetadata);
export interface PullRequestEvent {
  pullRequestId?: string;
  eventDate?: Date;
  pullRequestEventType?: string;
  actorArn?: string;
  pullRequestCreatedEventMetadata?: PullRequestCreatedEventMetadata;
  pullRequestStatusChangedEventMetadata?: PullRequestStatusChangedEventMetadata;
  pullRequestSourceReferenceUpdatedEventMetadata?: PullRequestSourceReferenceUpdatedEventMetadata;
  pullRequestMergedStateChangedEventMetadata?: PullRequestMergedStateChangedEventMetadata;
  approvalRuleEventMetadata?: ApprovalRuleEventMetadata;
  approvalStateChangedEventMetadata?: ApprovalStateChangedEventMetadata;
  approvalRuleOverriddenEventMetadata?: ApprovalRuleOverriddenEventMetadata;
}
export const PullRequestEvent = S.suspend(() =>
  S.Struct({
    pullRequestId: S.optional(S.String),
    eventDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pullRequestEventType: S.optional(S.String),
    actorArn: S.optional(S.String),
    pullRequestCreatedEventMetadata: S.optional(
      PullRequestCreatedEventMetadata,
    ),
    pullRequestStatusChangedEventMetadata: S.optional(
      PullRequestStatusChangedEventMetadata,
    ),
    pullRequestSourceReferenceUpdatedEventMetadata: S.optional(
      PullRequestSourceReferenceUpdatedEventMetadata,
    ),
    pullRequestMergedStateChangedEventMetadata: S.optional(
      PullRequestMergedStateChangedEventMetadata,
    ),
    approvalRuleEventMetadata: S.optional(ApprovalRuleEventMetadata),
    approvalStateChangedEventMetadata: S.optional(
      ApprovalStateChangedEventMetadata,
    ),
    approvalRuleOverriddenEventMetadata: S.optional(
      ApprovalRuleOverriddenEventMetadata,
    ),
  }),
).annotations({
  identifier: "PullRequestEvent",
}) as any as S.Schema<PullRequestEvent>;
export type PullRequestEventList = PullRequestEvent[];
export const PullRequestEventList = S.Array(PullRequestEvent);
export interface CreateCommitOutput {
  commitId?: string;
  treeId?: string;
  filesAdded?: FilesMetadata;
  filesUpdated?: FilesMetadata;
  filesDeleted?: FilesMetadata;
}
export const CreateCommitOutput = S.suspend(() =>
  S.Struct({
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
    filesAdded: S.optional(FilesMetadata),
    filesUpdated: S.optional(FilesMetadata),
    filesDeleted: S.optional(FilesMetadata),
  }).pipe(ns),
).annotations({
  identifier: "CreateCommitOutput",
}) as any as S.Schema<CreateCommitOutput>;
export interface DescribePullRequestEventsOutput {
  pullRequestEvents: PullRequestEventList;
  nextToken?: string;
}
export const DescribePullRequestEventsOutput = S.suspend(() =>
  S.Struct({
    pullRequestEvents: PullRequestEventList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribePullRequestEventsOutput",
}) as any as S.Schema<DescribePullRequestEventsOutput>;

//# Errors
export class ApprovalRuleTemplateDoesNotExistException extends S.TaggedError<ApprovalRuleTemplateDoesNotExistException>()(
  "ApprovalRuleTemplateDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class BranchNameExistsException extends S.TaggedError<BranchNameExistsException>()(
  "BranchNameExistsException",
  { message: S.optional(S.String) },
) {}
export class EncryptionIntegrityChecksFailedException extends S.TaggedError<EncryptionIntegrityChecksFailedException>()(
  "EncryptionIntegrityChecksFailedException",
  { message: S.optional(S.String) },
) {}
export class CommentDeletedException extends S.TaggedError<CommentDeletedException>()(
  "CommentDeletedException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryNameException extends S.TaggedError<InvalidRepositoryNameException>()(
  "InvalidRepositoryNameException",
  { message: S.optional(S.String) },
) {}
export class BranchDoesNotExistException extends S.TaggedError<BranchDoesNotExistException>()(
  "BranchDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class ApprovalStateRequiredException extends S.TaggedError<ApprovalStateRequiredException>()(
  "ApprovalStateRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleTemplateNameRequiredException extends S.TaggedError<ApprovalRuleTemplateNameRequiredException>()(
  "ApprovalRuleTemplateNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class BranchNameRequiredException extends S.TaggedError<BranchNameRequiredException>()(
  "BranchNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleTemplateInUseException extends S.TaggedError<ApprovalRuleTemplateInUseException>()(
  "ApprovalRuleTemplateInUseException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleNameRequiredException extends S.TaggedError<ApprovalRuleNameRequiredException>()(
  "ApprovalRuleNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class BlobIdDoesNotExistException extends S.TaggedError<BlobIdDoesNotExistException>()(
  "BlobIdDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class CommitIdDoesNotExistException extends S.TaggedError<CommitIdDoesNotExistException>()(
  "CommitIdDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class CommitDoesNotExistException extends S.TaggedError<CommitDoesNotExistException>()(
  "CommitDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidContinuationTokenException extends S.TaggedError<InvalidContinuationTokenException>()(
  "InvalidContinuationTokenException",
  { message: S.optional(S.String) },
) {}
export class AuthorDoesNotExistException extends S.TaggedError<AuthorDoesNotExistException>()(
  "AuthorDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class ConcurrentReferenceUpdateException extends S.TaggedError<ConcurrentReferenceUpdateException>()(
  "ConcurrentReferenceUpdateException",
  { message: S.optional(S.String) },
) {}
export class CommitMessageLengthExceededException extends S.TaggedError<CommitMessageLengthExceededException>()(
  "CommitMessageLengthExceededException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyAccessDeniedException extends S.TaggedError<EncryptionKeyAccessDeniedException>()(
  "EncryptionKeyAccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class BeforeCommitIdAndAfterCommitIdAreSameException extends S.TaggedError<BeforeCommitIdAndAfterCommitIdAreSameException>()(
  "BeforeCommitIdAndAfterCommitIdAreSameException",
  { message: S.optional(S.String) },
) {}
export class ClientRequestTokenRequiredException extends S.TaggedError<ClientRequestTokenRequiredException>()(
  "ClientRequestTokenRequiredException",
  { message: S.optional(S.String) },
) {}
export class CommentDoesNotExistException extends S.TaggedError<CommentDoesNotExistException>()(
  "CommentDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidResourceArnException extends S.TaggedError<InvalidResourceArnException>()(
  "InvalidResourceArnException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleTemplateContentRequiredException extends S.TaggedError<ApprovalRuleTemplateContentRequiredException>()(
  "ApprovalRuleTemplateContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleTemplateNameAlreadyExistsException extends S.TaggedError<ApprovalRuleTemplateNameAlreadyExistsException>()(
  "ApprovalRuleTemplateNameAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class CommentContentRequiredException extends S.TaggedError<CommentContentRequiredException>()(
  "CommentContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleContentRequiredException extends S.TaggedError<ApprovalRuleContentRequiredException>()(
  "ApprovalRuleContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidDescriptionException extends S.TaggedError<InvalidDescriptionException>()(
  "InvalidDescriptionException",
  { message: S.optional(S.String) },
) {}
export class InvalidPullRequestIdException extends S.TaggedError<InvalidPullRequestIdException>()(
  "InvalidPullRequestIdException",
  { message: S.optional(S.String) },
) {}
export class RepositoryDoesNotExistException extends S.TaggedError<RepositoryDoesNotExistException>()(
  "RepositoryDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class BranchNameIsTagNameException extends S.TaggedError<BranchNameIsTagNameException>()(
  "BranchNameIsTagNameException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalRuleTemplateNameException extends S.TaggedError<InvalidApprovalRuleTemplateNameException>()(
  "InvalidApprovalRuleTemplateNameException",
  { message: S.optional(S.String) },
) {}
export class DefaultBranchCannotBeDeletedException extends S.TaggedError<DefaultBranchCannotBeDeletedException>()(
  "DefaultBranchCannotBeDeletedException",
  { message: S.optional(S.String) },
) {}
export class CannotDeleteApprovalRuleFromTemplateException extends S.TaggedError<CannotDeleteApprovalRuleFromTemplateException>()(
  "CannotDeleteApprovalRuleFromTemplateException",
  { message: S.optional(S.String) },
) {}
export class BlobIdRequiredException extends S.TaggedError<BlobIdRequiredException>()(
  "BlobIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class CommitIdRequiredException extends S.TaggedError<CommitIdRequiredException>()(
  "CommitIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidMaxResultsException extends S.TaggedError<InvalidMaxResultsException>()(
  "InvalidMaxResultsException",
  { message: S.optional(S.String) },
) {}
export class CommitRequiredException extends S.TaggedError<CommitRequiredException>()(
  "CommitRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidOrderException extends S.TaggedError<InvalidOrderException>()(
  "InvalidOrderException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyDisabledException extends S.TaggedError<EncryptionKeyDisabledException>()(
  "EncryptionKeyDisabledException",
  { message: S.optional(S.String) },
) {}
export class CommentIdRequiredException extends S.TaggedError<CommentIdRequiredException>()(
  "CommentIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidSystemTagUsageException extends S.TaggedError<InvalidSystemTagUsageException>()(
  "InvalidSystemTagUsageException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalRuleTemplateContentException extends S.TaggedError<InvalidApprovalRuleTemplateContentException>()(
  "InvalidApprovalRuleTemplateContentException",
  { message: S.optional(S.String) },
) {}
export class CommentContentSizeLimitExceededException extends S.TaggedError<CommentContentSizeLimitExceededException>()(
  "CommentContentSizeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleDoesNotExistException extends S.TaggedError<ApprovalRuleDoesNotExistException>()(
  "ApprovalRuleDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidTitleException extends S.TaggedError<InvalidTitleException>()(
  "InvalidTitleException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalRuleTemplateDescriptionException extends S.TaggedError<InvalidApprovalRuleTemplateDescriptionException>()(
  "InvalidApprovalRuleTemplateDescriptionException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNameExistsException extends S.TaggedError<RepositoryNameExistsException>()(
  "RepositoryNameExistsException",
  { message: S.optional(S.String) },
) {}
export class ResourceArnRequiredException extends S.TaggedError<ResourceArnRequiredException>()(
  "ResourceArnRequiredException",
  { message: S.optional(S.String) },
) {}
export class PullRequestAlreadyClosedException extends S.TaggedError<PullRequestAlreadyClosedException>()(
  "PullRequestAlreadyClosedException",
  { message: S.optional(S.String) },
) {}
export class DirectoryNameConflictsWithFileNameException extends S.TaggedError<DirectoryNameConflictsWithFileNameException>()(
  "DirectoryNameConflictsWithFileNameException",
  { message: S.optional(S.String) },
) {}
export class CommitIdsLimitExceededException extends S.TaggedError<CommitIdsLimitExceededException>()(
  "CommitIdsLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ApprovalRuleNameAlreadyExistsException extends S.TaggedError<ApprovalRuleNameAlreadyExistsException>()(
  "ApprovalRuleNameAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class InvalidSortByException extends S.TaggedError<InvalidSortByException>()(
  "InvalidSortByException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyNotFoundException extends S.TaggedError<EncryptionKeyNotFoundException>()(
  "EncryptionKeyNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidCommentIdException extends S.TaggedError<InvalidCommentIdException>()(
  "InvalidCommentIdException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagsMapException extends S.TaggedError<InvalidTagsMapException>()(
  "InvalidTagsMapException",
  { message: S.optional(S.String) },
) {}
export class InvalidRuleContentSha256Exception extends S.TaggedError<InvalidRuleContentSha256Exception>()(
  "InvalidRuleContentSha256Exception",
  { message: S.optional(S.String) },
) {}
export class CommentNotCreatedByCallerException extends S.TaggedError<CommentNotCreatedByCallerException>()(
  "CommentNotCreatedByCallerException",
  { message: S.optional(S.String) },
) {}
export class CannotModifyApprovalRuleFromTemplateException extends S.TaggedError<CannotModifyApprovalRuleFromTemplateException>()(
  "CannotModifyApprovalRuleFromTemplateException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyInvalidIdException extends S.TaggedError<EncryptionKeyInvalidIdException>()(
  "EncryptionKeyInvalidIdException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNameRequiredException extends S.TaggedError<RepositoryNameRequiredException>()(
  "RepositoryNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagKeysListException extends S.TaggedError<InvalidTagKeysListException>()(
  "InvalidTagKeysListException",
  { message: S.optional(S.String) },
) {}
export class NumberOfRuleTemplatesExceededException extends S.TaggedError<NumberOfRuleTemplatesExceededException>()(
  "NumberOfRuleTemplatesExceededException",
  { message: S.optional(S.String) },
) {}
export class IdempotencyParameterMismatchException extends S.TaggedError<IdempotencyParameterMismatchException>()(
  "IdempotencyParameterMismatchException",
  { message: S.optional(S.String) },
) {}
export class PullRequestDoesNotExistException extends S.TaggedError<PullRequestDoesNotExistException>()(
  "PullRequestDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class CommitIdsListRequiredException extends S.TaggedError<CommitIdsListRequiredException>()(
  "CommitIdsListRequiredException",
  { message: S.optional(S.String) },
) {}
export class ActorDoesNotExistException extends S.TaggedError<ActorDoesNotExistException>()(
  "ActorDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyUnavailableException extends S.TaggedError<EncryptionKeyUnavailableException>()(
  "EncryptionKeyUnavailableException",
  { message: S.optional(S.String) },
) {}
export class InvalidReactionValueException extends S.TaggedError<InvalidReactionValueException>()(
  "InvalidReactionValueException",
  { message: S.optional(S.String) },
) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyInvalidUsageException extends S.TaggedError<EncryptionKeyInvalidUsageException>()(
  "EncryptionKeyInvalidUsageException",
  { message: S.optional(S.String) },
) {}
export class InvalidReactionUserArnException extends S.TaggedError<InvalidReactionUserArnException>()(
  "InvalidReactionUserArnException",
  { message: S.optional(S.String) },
) {}
export class TagKeysListRequiredException extends S.TaggedError<TagKeysListRequiredException>()(
  "TagKeysListRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidClientRequestTokenException extends S.TaggedError<InvalidClientRequestTokenException>()(
  "InvalidClientRequestTokenException",
  { message: S.optional(S.String) },
) {}
export class PullRequestIdRequiredException extends S.TaggedError<PullRequestIdRequiredException>()(
  "PullRequestIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidOverrideStatusException extends S.TaggedError<InvalidOverrideStatusException>()(
  "InvalidOverrideStatusException",
  { message: S.optional(S.String) },
) {}
export class ReactionLimitExceededException extends S.TaggedError<ReactionLimitExceededException>()(
  "ReactionLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class TagsMapRequiredException extends S.TaggedError<TagsMapRequiredException>()(
  "TagsMapRequiredException",
  { message: S.optional(S.String) },
) {}
export class EncryptionKeyRequiredException extends S.TaggedError<EncryptionKeyRequiredException>()(
  "EncryptionKeyRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalRuleContentException extends S.TaggedError<InvalidApprovalRuleContentException>()(
  "InvalidApprovalRuleContentException",
  { message: S.optional(S.String) },
) {}
export class InvalidBranchNameException extends S.TaggedError<InvalidBranchNameException>()(
  "InvalidBranchNameException",
  { message: S.optional(S.String) },
) {}
export class InvalidCommitIdException extends S.TaggedError<InvalidCommitIdException>()(
  "InvalidCommitIdException",
  { message: S.optional(S.String) },
) {}
export class InvalidCommitException extends S.TaggedError<InvalidCommitException>()(
  "InvalidCommitException",
  { message: S.optional(S.String) },
) {}
export class FileContentSizeLimitExceededException extends S.TaggedError<FileContentSizeLimitExceededException>()(
  "FileContentSizeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class FileDoesNotExistException extends S.TaggedError<FileDoesNotExistException>()(
  "FileDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerBranchNameException extends S.TaggedError<InvalidRepositoryTriggerBranchNameException>()(
  "InvalidRepositoryTriggerBranchNameException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalStateException extends S.TaggedError<InvalidApprovalStateException>()(
  "InvalidApprovalStateException",
  { message: S.optional(S.String) },
) {}
export class InvalidPullRequestStatusException extends S.TaggedError<InvalidPullRequestStatusException>()(
  "InvalidPullRequestStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryDescriptionException extends S.TaggedError<InvalidRepositoryDescriptionException>()(
  "InvalidRepositoryDescriptionException",
  { message: S.optional(S.String) },
) {}
export class InvalidRevisionIdException extends S.TaggedError<InvalidRevisionIdException>()(
  "InvalidRevisionIdException",
  { message: S.optional(S.String) },
) {}
export class MaximumRuleTemplatesAssociatedWithRepositoryException extends S.TaggedError<MaximumRuleTemplatesAssociatedWithRepositoryException>()(
  "MaximumRuleTemplatesAssociatedWithRepositoryException",
  { message: S.optional(S.String) },
) {}
export class MaximumRepositoryNamesExceededException extends S.TaggedError<MaximumRepositoryNamesExceededException>()(
  "MaximumRepositoryNamesExceededException",
  { message: S.optional(S.String) },
) {}
export class FolderDoesNotExistException extends S.TaggedError<FolderDoesNotExistException>()(
  "FolderDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidAuthorArnException extends S.TaggedError<InvalidAuthorArnException>()(
  "InvalidAuthorArnException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalRuleNameException extends S.TaggedError<InvalidApprovalRuleNameException>()(
  "InvalidApprovalRuleNameException",
  { message: S.optional(S.String) },
) {}
export class FileTooLargeException extends S.TaggedError<FileTooLargeException>()(
  "FileTooLargeException",
  { message: S.optional(S.String) },
) {}
export class FileContentRequiredException extends S.TaggedError<FileContentRequiredException>()(
  "FileContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class FileContentAndSourceFileSpecifiedException extends S.TaggedError<FileContentAndSourceFileSpecifiedException>()(
  "FileContentAndSourceFileSpecifiedException",
  { message: S.optional(S.String) },
) {}
export class InvalidActorArnException extends S.TaggedError<InvalidActorArnException>()(
  "InvalidActorArnException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class InvalidReferenceNameException extends S.TaggedError<InvalidReferenceNameException>()(
  "InvalidReferenceNameException",
  { message: S.optional(S.String) },
) {}
export class TitleRequiredException extends S.TaggedError<TitleRequiredException>()(
  "TitleRequiredException",
  { message: S.optional(S.String) },
) {}
export class ReactionValueRequiredException extends S.TaggedError<ReactionValueRequiredException>()(
  "ReactionValueRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidConflictDetailLevelException extends S.TaggedError<InvalidConflictDetailLevelException>()(
  "InvalidConflictDetailLevelException",
  { message: S.optional(S.String) },
) {}
export class FileModeRequiredException extends S.TaggedError<FileModeRequiredException>()(
  "FileModeRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerCustomDataException extends S.TaggedError<InvalidRepositoryTriggerCustomDataException>()(
  "InvalidRepositoryTriggerCustomDataException",
  { message: S.optional(S.String) },
) {}
export class InvalidPullRequestStatusUpdateException extends S.TaggedError<InvalidPullRequestStatusUpdateException>()(
  "InvalidPullRequestStatusUpdateException",
  { message: S.optional(S.String) },
) {}
export class RevisionIdRequiredException extends S.TaggedError<RevisionIdRequiredException>()(
  "RevisionIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNamesRequiredException extends S.TaggedError<RepositoryNamesRequiredException>()(
  "RepositoryNamesRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidPathException extends S.TaggedError<InvalidPathException>()(
  "InvalidPathException",
  { message: S.optional(S.String) },
) {}
export class InvalidBlobIdException extends S.TaggedError<InvalidBlobIdException>()(
  "InvalidBlobIdException",
  { message: S.optional(S.String) },
) {}
export class FileNameConflictsWithDirectoryNameException extends S.TaggedError<FileNameConflictsWithDirectoryNameException>()(
  "FileNameConflictsWithDirectoryNameException",
  { message: S.optional(S.String) },
) {}
export class FileEntryRequiredException extends S.TaggedError<FileEntryRequiredException>()(
  "FileEntryRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidPullRequestEventTypeException extends S.TaggedError<InvalidPullRequestEventTypeException>()(
  "InvalidPullRequestEventTypeException",
  { message: S.optional(S.String) },
) {}
export class NumberOfRulesExceededException extends S.TaggedError<NumberOfRulesExceededException>()(
  "NumberOfRulesExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetBranchException extends S.TaggedError<InvalidTargetBranchException>()(
  "InvalidTargetBranchException",
  { message: S.optional(S.String) },
) {}
export class RepositoryNotAssociatedWithPullRequestException extends S.TaggedError<RepositoryNotAssociatedWithPullRequestException>()(
  "RepositoryNotAssociatedWithPullRequestException",
  { message: S.optional(S.String) },
) {}
export class ManualMergeRequiredException extends S.TaggedError<ManualMergeRequiredException>()(
  "ManualMergeRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidFileLocationException extends S.TaggedError<InvalidFileLocationException>()(
  "InvalidFileLocationException",
  { message: S.optional(S.String) },
) {}
export class TipsDivergenceExceededException extends S.TaggedError<TipsDivergenceExceededException>()(
  "TipsDivergenceExceededException",
  { message: S.optional(S.String) },
) {}
export class FolderContentSizeLimitExceededException extends S.TaggedError<FolderContentSizeLimitExceededException>()(
  "FolderContentSizeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidEmailException extends S.TaggedError<InvalidEmailException>()(
  "InvalidEmailException",
  { message: S.optional(S.String) },
) {}
export class OperationNotAllowedException extends S.TaggedError<OperationNotAllowedException>()(
  "OperationNotAllowedException",
  { message: S.optional(S.String) },
) {}
export class OverrideAlreadySetException extends S.TaggedError<OverrideAlreadySetException>()(
  "OverrideAlreadySetException",
  { message: S.optional(S.String) },
) {}
export class MaximumNumberOfApprovalsExceededException extends S.TaggedError<MaximumNumberOfApprovalsExceededException>()(
  "MaximumNumberOfApprovalsExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetException extends S.TaggedError<InvalidTargetException>()(
  "InvalidTargetException",
  { message: S.optional(S.String) },
) {}
export class InvalidConflictResolutionStrategyException extends S.TaggedError<InvalidConflictResolutionStrategyException>()(
  "InvalidConflictResolutionStrategyException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerDestinationArnException extends S.TaggedError<InvalidRepositoryTriggerDestinationArnException>()(
  "InvalidRepositoryTriggerDestinationArnException",
  { message: S.optional(S.String) },
) {}
export class PullRequestStatusRequiredException extends S.TaggedError<PullRequestStatusRequiredException>()(
  "PullRequestStatusRequiredException",
  { message: S.optional(S.String) },
) {}
export class PathRequiredException extends S.TaggedError<PathRequiredException>()(
  "PathRequiredException",
  { message: S.optional(S.String) },
) {}
export class FilePathConflictsWithSubmodulePathException extends S.TaggedError<FilePathConflictsWithSubmodulePathException>()(
  "FilePathConflictsWithSubmodulePathException",
  { message: S.optional(S.String) },
) {}
export class PullRequestApprovalRulesNotSatisfiedException extends S.TaggedError<PullRequestApprovalRulesNotSatisfiedException>()(
  "PullRequestApprovalRulesNotSatisfiedException",
  { message: S.optional(S.String) },
) {}
export class InvalidFilePositionException extends S.TaggedError<InvalidFilePositionException>()(
  "InvalidFilePositionException",
  { message: S.optional(S.String) },
) {}
export class InvalidConflictResolutionException extends S.TaggedError<InvalidConflictResolutionException>()(
  "InvalidConflictResolutionException",
  { message: S.optional(S.String) },
) {}
export class InvalidParentCommitIdException extends S.TaggedError<InvalidParentCommitIdException>()(
  "InvalidParentCommitIdException",
  { message: S.optional(S.String) },
) {}
export class RepositoryLimitExceededException extends S.TaggedError<RepositoryLimitExceededException>()(
  "RepositoryLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class OverrideStatusRequiredException extends S.TaggedError<OverrideStatusRequiredException>()(
  "OverrideStatusRequiredException",
  { message: S.optional(S.String) },
) {}
export class PullRequestCannotBeApprovedByAuthorException extends S.TaggedError<PullRequestCannotBeApprovedByAuthorException>()(
  "PullRequestCannotBeApprovedByAuthorException",
  { message: S.optional(S.String) },
) {}
export class RevisionNotCurrentException extends S.TaggedError<RevisionNotCurrentException>()(
  "RevisionNotCurrentException",
  { message: S.optional(S.String) },
) {}
export class PathDoesNotExistException extends S.TaggedError<PathDoesNotExistException>()(
  "PathDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidTargetsException extends S.TaggedError<InvalidTargetsException>()(
  "InvalidTargetsException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerEventsException extends S.TaggedError<InvalidRepositoryTriggerEventsException>()(
  "InvalidRepositoryTriggerEventsException",
  { message: S.optional(S.String) },
) {}
export class InvalidDeletionParameterException extends S.TaggedError<InvalidDeletionParameterException>()(
  "InvalidDeletionParameterException",
  { message: S.optional(S.String) },
) {}
export class ReferenceDoesNotExistException extends S.TaggedError<ReferenceDoesNotExistException>()(
  "ReferenceDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class InvalidRelativeFileVersionEnumException extends S.TaggedError<InvalidRelativeFileVersionEnumException>()(
  "InvalidRelativeFileVersionEnumException",
  { message: S.optional(S.String) },
) {}
export class InvalidMaxMergeHunksException extends S.TaggedError<InvalidMaxMergeHunksException>()(
  "InvalidMaxMergeHunksException",
  { message: S.optional(S.String) },
) {}
export class InvalidDestinationCommitSpecifierException extends S.TaggedError<InvalidDestinationCommitSpecifierException>()(
  "InvalidDestinationCommitSpecifierException",
  { message: S.optional(S.String) },
) {}
export class MaximumFileContentToLoadExceededException extends S.TaggedError<MaximumFileContentToLoadExceededException>()(
  "MaximumFileContentToLoadExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidMaxConflictFilesException extends S.TaggedError<InvalidMaxConflictFilesException>()(
  "InvalidMaxConflictFilesException",
  { message: S.optional(S.String) },
) {}
export class InvalidFileModeException extends S.TaggedError<InvalidFileModeException>()(
  "InvalidFileModeException",
  { message: S.optional(S.String) },
) {}
export class NameLengthExceededException extends S.TaggedError<NameLengthExceededException>()(
  "NameLengthExceededException",
  { message: S.optional(S.String) },
) {}
export class MaximumOpenPullRequestsExceededException extends S.TaggedError<MaximumOpenPullRequestsExceededException>()(
  "MaximumOpenPullRequestsExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerNameException extends S.TaggedError<InvalidRepositoryTriggerNameException>()(
  "InvalidRepositoryTriggerNameException",
  { message: S.optional(S.String) },
) {}
export class TipOfSourceReferenceIsDifferentException extends S.TaggedError<TipOfSourceReferenceIsDifferentException>()(
  "TipOfSourceReferenceIsDifferentException",
  { message: S.optional(S.String) },
) {}
export class InvalidMergeOptionException extends S.TaggedError<InvalidMergeOptionException>()(
  "InvalidMergeOptionException",
  { message: S.optional(S.String) },
) {}
export class MaximumItemsToCompareExceededException extends S.TaggedError<MaximumItemsToCompareExceededException>()(
  "MaximumItemsToCompareExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidReplacementContentException extends S.TaggedError<InvalidReplacementContentException>()(
  "InvalidReplacementContentException",
  { message: S.optional(S.String) },
) {}
export class ParentCommitDoesNotExistException extends S.TaggedError<ParentCommitDoesNotExistException>()(
  "ParentCommitDoesNotExistException",
  { message: S.optional(S.String) },
) {}
export class MaximumFileEntriesExceededException extends S.TaggedError<MaximumFileEntriesExceededException>()(
  "MaximumFileEntriesExceededException",
  { message: S.optional(S.String) },
) {}
export class MultipleRepositoriesInPullRequestException extends S.TaggedError<MultipleRepositoriesInPullRequestException>()(
  "MultipleRepositoriesInPullRequestException",
  { message: S.optional(S.String) },
) {}
export class InvalidRepositoryTriggerRegionException extends S.TaggedError<InvalidRepositoryTriggerRegionException>()(
  "InvalidRepositoryTriggerRegionException",
  { message: S.optional(S.String) },
) {}
export class InvalidReplacementTypeException extends S.TaggedError<InvalidReplacementTypeException>()(
  "InvalidReplacementTypeException",
  { message: S.optional(S.String) },
) {}
export class ParentCommitIdOutdatedException extends S.TaggedError<ParentCommitIdOutdatedException>()(
  "ParentCommitIdOutdatedException",
  { message: S.optional(S.String) },
) {}
export class NoChangeException extends S.TaggedError<NoChangeException>()(
  "NoChangeException",
  { message: S.optional(S.String) },
) {}
export class ReferenceNameRequiredException extends S.TaggedError<ReferenceNameRequiredException>()(
  "ReferenceNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class MergeOptionRequiredException extends S.TaggedError<MergeOptionRequiredException>()(
  "MergeOptionRequiredException",
  { message: S.optional(S.String) },
) {}
export class InvalidSourceCommitSpecifierException extends S.TaggedError<InvalidSourceCommitSpecifierException>()(
  "InvalidSourceCommitSpecifierException",
  { message: S.optional(S.String) },
) {}
export class MaximumBranchesExceededException extends S.TaggedError<MaximumBranchesExceededException>()(
  "MaximumBranchesExceededException",
  { message: S.optional(S.String) },
) {}
export class MaximumConflictResolutionEntriesExceededException extends S.TaggedError<MaximumConflictResolutionEntriesExceededException>()(
  "MaximumConflictResolutionEntriesExceededException",
  { message: S.optional(S.String) },
) {}
export class ParentCommitIdRequiredException extends S.TaggedError<ParentCommitIdRequiredException>()(
  "ParentCommitIdRequiredException",
  { message: S.optional(S.String) },
) {}
export class ReferenceTypeNotSupportedException extends S.TaggedError<ReferenceTypeNotSupportedException>()(
  "ReferenceTypeNotSupportedException",
  { message: S.optional(S.String) },
) {}
export class MaximumRepositoryTriggersExceededException extends S.TaggedError<MaximumRepositoryTriggersExceededException>()(
  "MaximumRepositoryTriggersExceededException",
  { message: S.optional(S.String) },
) {}
export class MultipleConflictResolutionEntriesException extends S.TaggedError<MultipleConflictResolutionEntriesException>()(
  "MultipleConflictResolutionEntriesException",
  { message: S.optional(S.String) },
) {}
export class SourceAndDestinationAreSameException extends S.TaggedError<SourceAndDestinationAreSameException>()(
  "SourceAndDestinationAreSameException",
  { message: S.optional(S.String) },
) {}
export class PutFileEntryConflictException extends S.TaggedError<PutFileEntryConflictException>()(
  "PutFileEntryConflictException",
  { message: S.optional(S.String) },
) {}
export class SameFileContentException extends S.TaggedError<SameFileContentException>()(
  "SameFileContentException",
  { message: S.optional(S.String) },
) {}
export class RepositoryTriggerBranchNameListRequiredException extends S.TaggedError<RepositoryTriggerBranchNameListRequiredException>()(
  "RepositoryTriggerBranchNameListRequiredException",
  { message: S.optional(S.String) },
) {}
export class ReplacementContentRequiredException extends S.TaggedError<ReplacementContentRequiredException>()(
  "ReplacementContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class TargetRequiredException extends S.TaggedError<TargetRequiredException>()(
  "TargetRequiredException",
  { message: S.optional(S.String) },
) {}
export class RestrictedSourceFileException extends S.TaggedError<RestrictedSourceFileException>()(
  "RestrictedSourceFileException",
  { message: S.optional(S.String) },
) {}
export class RepositoryTriggerDestinationArnRequiredException extends S.TaggedError<RepositoryTriggerDestinationArnRequiredException>()(
  "RepositoryTriggerDestinationArnRequiredException",
  { message: S.optional(S.String) },
) {}
export class ReplacementTypeRequiredException extends S.TaggedError<ReplacementTypeRequiredException>()(
  "ReplacementTypeRequiredException",
  { message: S.optional(S.String) },
) {}
export class TargetsRequiredException extends S.TaggedError<TargetsRequiredException>()(
  "TargetsRequiredException",
  { message: S.optional(S.String) },
) {}
export class SamePathRequestException extends S.TaggedError<SamePathRequestException>()(
  "SamePathRequestException",
  { message: S.optional(S.String) },
) {}
export class RepositoryTriggerEventsListRequiredException extends S.TaggedError<RepositoryTriggerEventsListRequiredException>()(
  "RepositoryTriggerEventsListRequiredException",
  { message: S.optional(S.String) },
) {}
export class SourceFileOrContentRequiredException extends S.TaggedError<SourceFileOrContentRequiredException>()(
  "SourceFileOrContentRequiredException",
  { message: S.optional(S.String) },
) {}
export class RepositoryTriggerNameRequiredException extends S.TaggedError<RepositoryTriggerNameRequiredException>()(
  "RepositoryTriggerNameRequiredException",
  { message: S.optional(S.String) },
) {}
export class RepositoryTriggersListRequiredException extends S.TaggedError<RepositoryTriggersListRequiredException>()(
  "RepositoryTriggersListRequiredException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a specified approval rule template. Deleting a template does not remove approval rules on pull requests already created with the template.
 */
export const deleteApprovalRuleTemplate: (
  input: DeleteApprovalRuleTemplateInput,
) => Effect.Effect<
  DeleteApprovalRuleTemplateOutput,
  | ApprovalRuleTemplateInUseException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApprovalRuleTemplateInput,
  output: DeleteApprovalRuleTemplateOutput,
  errors: [
    ApprovalRuleTemplateInUseException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateNameException,
  ],
}));
/**
 * Lists all approval rule templates in the specified Amazon Web Services Region in your Amazon Web Services account. If
 * an Amazon Web Services Region is not specified, the Amazon Web Services Region where you are signed in is used.
 */
export const listApprovalRuleTemplates: {
  (
    input: ListApprovalRuleTemplatesInput,
  ): Effect.Effect<
    ListApprovalRuleTemplatesOutput,
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApprovalRuleTemplatesInput,
  ) => Stream.Stream<
    ListApprovalRuleTemplatesOutput,
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApprovalRuleTemplatesInput,
  ) => Stream.Stream<
    unknown,
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApprovalRuleTemplatesInput,
  output: ListApprovalRuleTemplatesOutput,
  errors: [InvalidContinuationTokenException, InvalidMaxResultsException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the description for a specified approval rule template.
 */
export const updateApprovalRuleTemplateDescription: (
  input: UpdateApprovalRuleTemplateDescriptionInput,
) => Effect.Effect<
  UpdateApprovalRuleTemplateDescriptionOutput,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateDescriptionException
  | InvalidApprovalRuleTemplateNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApprovalRuleTemplateDescriptionInput,
  output: UpdateApprovalRuleTemplateDescriptionOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateDescriptionException,
    InvalidApprovalRuleTemplateNameException,
  ],
}));
/**
 * Updates the name of a specified approval rule template.
 */
export const updateApprovalRuleTemplateName: (
  input: UpdateApprovalRuleTemplateNameInput,
) => Effect.Effect<
  UpdateApprovalRuleTemplateNameOutput,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameAlreadyExistsException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApprovalRuleTemplateNameInput,
  output: UpdateApprovalRuleTemplateNameOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameAlreadyExistsException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateNameException,
  ],
}));
/**
 * Returns information about a specified approval rule template.
 */
export const getApprovalRuleTemplate: (
  input: GetApprovalRuleTemplateInput,
) => Effect.Effect<
  GetApprovalRuleTemplateOutput,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateNameException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApprovalRuleTemplateInput,
  output: GetApprovalRuleTemplateOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateNameException,
  ],
}));
/**
 * Gets information about Amazon Web Servicestags for a specified Amazon Resource Name (ARN) in CodeCommit. For a list of valid resources in CodeCommit, see CodeCommit Resources and Operations in the CodeCommit User
 * Guide.
 */
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InvalidRepositoryNameException
  | InvalidResourceArnException
  | RepositoryDoesNotExistException
  | ResourceArnRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InvalidRepositoryNameException,
    InvalidResourceArnException,
    RepositoryDoesNotExistException,
    ResourceArnRequiredException,
  ],
}));
/**
 * Gets information about one or more repositories.
 */
export const listRepositories: {
  (
    input: ListRepositoriesInput,
  ): Effect.Effect<
    ListRepositoriesOutput,
    | InvalidContinuationTokenException
    | InvalidOrderException
    | InvalidSortByException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoriesInput,
  ) => Stream.Stream<
    ListRepositoriesOutput,
    | InvalidContinuationTokenException
    | InvalidOrderException
    | InvalidSortByException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoriesInput,
  ) => Stream.Stream<
    RepositoryNameIdPair,
    | InvalidContinuationTokenException
    | InvalidOrderException
    | InvalidSortByException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRepositoriesInput,
  output: ListRepositoriesOutput,
  errors: [
    InvalidContinuationTokenException,
    InvalidOrderException,
    InvalidSortByException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "repositories",
  } as const,
}));
/**
 * Updates the content of an approval rule template. You can change the number of
 * required approvals, the membership of the approval rule, and whether an approval pool is
 * defined.
 */
export const updateApprovalRuleTemplateContent: (
  input: UpdateApprovalRuleTemplateContentInput,
) => Effect.Effect<
  UpdateApprovalRuleTemplateContentOutput,
  | ApprovalRuleTemplateContentRequiredException
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateContentException
  | InvalidApprovalRuleTemplateNameException
  | InvalidRuleContentSha256Exception
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApprovalRuleTemplateContentInput,
  output: UpdateApprovalRuleTemplateContentOutput,
  errors: [
    ApprovalRuleTemplateContentRequiredException,
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateContentException,
    InvalidApprovalRuleTemplateNameException,
    InvalidRuleContentSha256Exception,
  ],
}));
/**
 * Replaces the contents of a comment.
 */
export const updateComment: (
  input: UpdateCommentInput,
) => Effect.Effect<
  UpdateCommentOutput,
  | CommentContentRequiredException
  | CommentContentSizeLimitExceededException
  | CommentDeletedException
  | CommentDoesNotExistException
  | CommentIdRequiredException
  | CommentNotCreatedByCallerException
  | InvalidCommentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCommentInput,
  output: UpdateCommentOutput,
  errors: [
    CommentContentRequiredException,
    CommentContentSizeLimitExceededException,
    CommentDeletedException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    CommentNotCreatedByCallerException,
    InvalidCommentIdException,
  ],
}));
/**
 * Deletes the content of a comment made on a change, file, or commit in a repository.
 */
export const deleteCommentContent: (
  input: DeleteCommentContentInput,
) => Effect.Effect<
  DeleteCommentContentOutput,
  | CommentDeletedException
  | CommentDoesNotExistException
  | CommentIdRequiredException
  | InvalidCommentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCommentContentInput,
  output: DeleteCommentContentOutput,
  errors: [
    CommentDeletedException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    InvalidCommentIdException,
  ],
}));
/**
 * Renames a repository. The repository name must be unique across the calling Amazon Web Services account.
 * Repository names are limited to 100 alphanumeric, dash, and underscore
 * characters, and cannot include certain characters. The suffix .git is prohibited. For
 * more information about the limits on repository names, see Quotas in the CodeCommit
 * User Guide.
 */
export const updateRepositoryName: (
  input: UpdateRepositoryNameInput,
) => Effect.Effect<
  UpdateRepositoryNameResponse,
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameExistsException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryNameInput,
  output: UpdateRepositoryNameResponse,
  errors: [
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameExistsException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Creates a template for approval rules that can then be associated with one or more
 * repositories in your Amazon Web Services account. When you associate a template with a repository,
 * CodeCommit creates an approval rule that matches the conditions of the template for all
 * pull requests that meet the conditions of the template. For more information, see
 * AssociateApprovalRuleTemplateWithRepository.
 */
export const createApprovalRuleTemplate: (
  input: CreateApprovalRuleTemplateInput,
) => Effect.Effect<
  CreateApprovalRuleTemplateOutput,
  | ApprovalRuleTemplateContentRequiredException
  | ApprovalRuleTemplateNameAlreadyExistsException
  | ApprovalRuleTemplateNameRequiredException
  | InvalidApprovalRuleTemplateContentException
  | InvalidApprovalRuleTemplateDescriptionException
  | InvalidApprovalRuleTemplateNameException
  | NumberOfRuleTemplatesExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApprovalRuleTemplateInput,
  output: CreateApprovalRuleTemplateOutput,
  errors: [
    ApprovalRuleTemplateContentRequiredException,
    ApprovalRuleTemplateNameAlreadyExistsException,
    ApprovalRuleTemplateNameRequiredException,
    InvalidApprovalRuleTemplateContentException,
    InvalidApprovalRuleTemplateDescriptionException,
    InvalidApprovalRuleTemplateNameException,
    NumberOfRuleTemplatesExceededException,
  ],
}));
/**
 * Lists all repositories associated with the specified approval rule template.
 */
export const listRepositoriesForApprovalRuleTemplate: {
  (
    input: ListRepositoriesForApprovalRuleTemplateInput,
  ): Effect.Effect<
    ListRepositoriesForApprovalRuleTemplateOutput,
    | ApprovalRuleTemplateDoesNotExistException
    | ApprovalRuleTemplateNameRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidApprovalRuleTemplateNameException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRepositoriesForApprovalRuleTemplateInput,
  ) => Stream.Stream<
    ListRepositoriesForApprovalRuleTemplateOutput,
    | ApprovalRuleTemplateDoesNotExistException
    | ApprovalRuleTemplateNameRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidApprovalRuleTemplateNameException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRepositoriesForApprovalRuleTemplateInput,
  ) => Stream.Stream<
    unknown,
    | ApprovalRuleTemplateDoesNotExistException
    | ApprovalRuleTemplateNameRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidApprovalRuleTemplateNameException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRepositoriesForApprovalRuleTemplateInput,
  output: ListRepositoriesForApprovalRuleTemplateOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleTemplateNameException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Removes the association between a template and a repository so that approval rules
 * based on the template are not automatically created when pull requests are created in
 * the specified repository. This does not delete any approval rules previously created for
 * pull requests through the template association.
 */
export const disassociateApprovalRuleTemplateFromRepository: (
  input: DisassociateApprovalRuleTemplateFromRepositoryInput,
) => Effect.Effect<
  DisassociateApprovalRuleTemplateFromRepositoryResponse,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleTemplateNameException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateApprovalRuleTemplateFromRepositoryInput,
  output: DisassociateApprovalRuleTemplateFromRepositoryResponse,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleTemplateNameException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Deletes a repository. If a specified repository was already deleted, a null repository
 * ID is returned.
 *
 * Deleting a repository also deletes all associated objects and metadata. After a repository is
 * deleted, all future push calls to the deleted repository fail.
 */
export const deleteRepository: (
  input: DeleteRepositoryInput,
) => Effect.Effect<
  DeleteRepositoryOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryInput,
  output: DeleteRepositoryOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about a repository.
 *
 * The description field for a repository accepts all HTML characters and all valid
 * Unicode characters. Applications that do not HTML-encode the description and display
 * it in a webpage can expose users to potentially malicious code. Make sure that you
 * HTML-encode the description field in any application that uses this API to display
 * the repository description on a webpage.
 */
export const getRepository: (
  input: GetRepositoryInput,
) => Effect.Effect<
  GetRepositoryOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryInput,
  output: GetRepositoryOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Gets information about triggers configured for a repository.
 */
export const getRepositoryTriggers: (
  input: GetRepositoryTriggersInput,
) => Effect.Effect<
  GetRepositoryTriggersOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryTriggersInput,
  output: GetRepositoryTriggersOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Lists all approval rule templates that are associated with a specified repository.
 */
export const listAssociatedApprovalRuleTemplatesForRepository: {
  (
    input: ListAssociatedApprovalRuleTemplatesForRepositoryInput,
  ): Effect.Effect<
    ListAssociatedApprovalRuleTemplatesForRepositoryOutput,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAssociatedApprovalRuleTemplatesForRepositoryInput,
  ) => Stream.Stream<
    ListAssociatedApprovalRuleTemplatesForRepositoryOutput,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAssociatedApprovalRuleTemplatesForRepositoryInput,
  ) => Stream.Stream<
    unknown,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAssociatedApprovalRuleTemplatesForRepositoryInput,
  output: ListAssociatedApprovalRuleTemplatesForRepositoryOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about one or more branches in a repository.
 */
export const listBranches: {
  (
    input: ListBranchesInput,
  ): Effect.Effect<
    ListBranchesOutput,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBranchesInput,
  ) => Stream.Stream<
    ListBranchesOutput,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBranchesInput,
  ) => Stream.Stream<
    BranchName,
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidContinuationTokenException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBranchesInput,
  output: ListBranchesOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidContinuationTokenException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "branches",
  } as const,
}));
/**
 * Returns the content of a comment made on a change, file, or commit in a repository.
 *
 * Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of
 * reactions from active identities, use GetCommentReactions.
 */
export const getComment: (
  input: GetCommentInput,
) => Effect.Effect<
  GetCommentOutput,
  | CommentDeletedException
  | CommentDoesNotExistException
  | CommentIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommentInput,
  output: GetCommentOutput,
  errors: [
    CommentDeletedException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommentIdException,
  ],
}));
/**
 * Returns information about the contents of one or more commits in a repository.
 */
export const batchGetCommits: (
  input: BatchGetCommitsInput,
) => Effect.Effect<
  BatchGetCommitsOutput,
  | CommitIdsLimitExceededException
  | CommitIdsListRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCommitsInput,
  output: BatchGetCommitsOutput,
  errors: [
    CommitIdsLimitExceededException,
    CommitIdsListRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about reactions to a specified comment ID. Reactions from users who have been deleted will not be included in the count.
 */
export const getCommentReactions: {
  (
    input: GetCommentReactionsInput,
  ): Effect.Effect<
    GetCommentReactionsOutput,
    | CommentDeletedException
    | CommentDoesNotExistException
    | CommentIdRequiredException
    | InvalidCommentIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidReactionUserArnException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCommentReactionsInput,
  ) => Stream.Stream<
    GetCommentReactionsOutput,
    | CommentDeletedException
    | CommentDoesNotExistException
    | CommentIdRequiredException
    | InvalidCommentIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidReactionUserArnException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCommentReactionsInput,
  ) => Stream.Stream<
    unknown,
    | CommentDeletedException
    | CommentDoesNotExistException
    | CommentIdRequiredException
    | InvalidCommentIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidReactionUserArnException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCommentReactionsInput,
  output: GetCommentReactionsOutput,
  errors: [
    CommentDeletedException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    InvalidCommentIdException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidReactionUserArnException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Posts a comment in reply to an existing comment on a comparison between commits or a pull request.
 */
export const postCommentReply: (
  input: PostCommentReplyInput,
) => Effect.Effect<
  PostCommentReplyOutput,
  | ClientRequestTokenRequiredException
  | CommentContentRequiredException
  | CommentContentSizeLimitExceededException
  | CommentDoesNotExistException
  | CommentIdRequiredException
  | IdempotencyParameterMismatchException
  | InvalidClientRequestTokenException
  | InvalidCommentIdException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostCommentReplyInput,
  output: PostCommentReplyOutput,
  errors: [
    ClientRequestTokenRequiredException,
    CommentContentRequiredException,
    CommentContentSizeLimitExceededException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    IdempotencyParameterMismatchException,
    InvalidClientRequestTokenException,
    InvalidCommentIdException,
  ],
}));
/**
 * Replaces the contents of the description of a pull request.
 */
export const updatePullRequestDescription: (
  input: UpdatePullRequestDescriptionInput,
) => Effect.Effect<
  UpdatePullRequestDescriptionOutput,
  | InvalidDescriptionException
  | InvalidPullRequestIdException
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullRequestDescriptionInput,
  output: UpdatePullRequestDescriptionOutput,
  errors: [
    InvalidDescriptionException,
    InvalidPullRequestIdException,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
}));
/**
 * Gets information about a pull request in a specified repository.
 */
export const getPullRequest: (
  input: GetPullRequestInput,
) => Effect.Effect<
  GetPullRequestOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidPullRequestIdException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPullRequestInput,
  output: GetPullRequestOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidPullRequestIdException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
}));
/**
 * Updates the Key Management Service encryption key used to encrypt and decrypt a CodeCommit repository.
 */
export const updateRepositoryEncryptionKey: (
  input: UpdateRepositoryEncryptionKeyInput,
) => Effect.Effect<
  UpdateRepositoryEncryptionKeyOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyInvalidIdException
  | EncryptionKeyInvalidUsageException
  | EncryptionKeyNotFoundException
  | EncryptionKeyRequiredException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryEncryptionKeyInput,
  output: UpdateRepositoryEncryptionKeyOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyInvalidIdException,
    EncryptionKeyInvalidUsageException,
    EncryptionKeyNotFoundException,
    EncryptionKeyRequiredException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about comments made on the comparison between two commits.
 *
 * Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of
 * reactions from active identities, use GetCommentReactions.
 */
export const getCommentsForComparedCommit: {
  (
    input: GetCommentsForComparedCommitInput,
  ): Effect.Effect<
    GetCommentsForComparedCommitOutput,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCommentsForComparedCommitInput,
  ) => Stream.Stream<
    GetCommentsForComparedCommitOutput,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCommentsForComparedCommitInput,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCommentsForComparedCommitInput,
  output: GetCommentsForComparedCommitOutput,
  errors: [
    CommitDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitIdException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Sets or changes the comment or description for a repository.
 *
 * The description field for a repository accepts all HTML characters and all valid
 * Unicode characters. Applications that do not HTML-encode the description and display
 * it in a webpage can expose users to potentially malicious code. Make sure that you
 * HTML-encode the description field in any application that uses this API to display
 * the repository description on a webpage.
 */
export const updateRepositoryDescription: (
  input: UpdateRepositoryDescriptionInput,
) => Effect.Effect<
  UpdateRepositoryDescriptionResponse,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryDescriptionException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRepositoryDescriptionInput,
  output: UpdateRepositoryDescriptionResponse,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryDescriptionException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Creates an association between an approval rule template and a specified repository.
 * Then, the next time a pull request is created in the repository where the destination
 * reference (if specified) matches the destination reference (branch) for the pull
 * request, an approval rule that matches the template conditions is automatically created
 * for that pull request. If no destination references are specified in the template, an
 * approval rule that matches the template contents is created for all pull requests in
 * that repository.
 */
export const associateApprovalRuleTemplateWithRepository: (
  input: AssociateApprovalRuleTemplateWithRepositoryInput,
) => Effect.Effect<
  AssociateApprovalRuleTemplateWithRepositoryResponse,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleTemplateNameException
  | InvalidRepositoryNameException
  | MaximumRuleTemplatesAssociatedWithRepositoryException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateApprovalRuleTemplateWithRepositoryInput,
  output: AssociateApprovalRuleTemplateWithRepositoryResponse,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleTemplateNameException,
    InvalidRepositoryNameException,
    MaximumRuleTemplatesAssociatedWithRepositoryException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns a list of pull requests for a specified repository. The return list can be refined by pull request
 * status or pull request author ARN.
 */
export const listPullRequests: {
  (
    input: ListPullRequestsInput,
  ): Effect.Effect<
    ListPullRequestsOutput,
    | AuthorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidAuthorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestStatusException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPullRequestsInput,
  ) => Stream.Stream<
    ListPullRequestsOutput,
    | AuthorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidAuthorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestStatusException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPullRequestsInput,
  ) => Stream.Stream<
    unknown,
    | AuthorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidAuthorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestStatusException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPullRequestsInput,
  output: ListPullRequestsOutput,
  errors: [
    AuthorDoesNotExistException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidAuthorArnException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidPullRequestStatusException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an approval rule from a specified pull request. Approval rules can be deleted from a pull request only if the pull request is open, and if the
 * approval rule was created specifically for a pull request and not generated from an approval rule template associated with the repository where the
 * pull request was created. You cannot delete an approval rule from a merged or closed pull request.
 */
export const deletePullRequestApprovalRule: (
  input: DeletePullRequestApprovalRuleInput,
) => Effect.Effect<
  DeletePullRequestApprovalRuleOutput,
  | ApprovalRuleNameRequiredException
  | CannotDeleteApprovalRuleFromTemplateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleNameException
  | InvalidPullRequestIdException
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePullRequestApprovalRuleInput,
  output: DeletePullRequestApprovalRuleOutput,
  errors: [
    ApprovalRuleNameRequiredException,
    CannotDeleteApprovalRuleFromTemplateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleNameException,
    InvalidPullRequestIdException,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
}));
/**
 * Removes tags for a resource in CodeCommit. For a list of valid resources in CodeCommit, see CodeCommit Resources and Operations in the CodeCommit User
 * Guide.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceResponse,
  | InvalidRepositoryNameException
  | InvalidResourceArnException
  | InvalidSystemTagUsageException
  | InvalidTagKeysListException
  | RepositoryDoesNotExistException
  | ResourceArnRequiredException
  | TagKeysListRequiredException
  | TagPolicyException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    InvalidRepositoryNameException,
    InvalidResourceArnException,
    InvalidSystemTagUsageException,
    InvalidTagKeysListException,
    RepositoryDoesNotExistException,
    ResourceArnRequiredException,
    TagKeysListRequiredException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Sets or changes the default branch name for the specified repository.
 *
 * If you use this operation to change the default branch name to the current default branch name, a success message is returned even though the default branch did not change.
 */
export const updateDefaultBranch: (
  input: UpdateDefaultBranchInput,
) => Effect.Effect<
  UpdateDefaultBranchResponse,
  | BranchDoesNotExistException
  | BranchNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidBranchNameException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDefaultBranchInput,
  output: UpdateDefaultBranchResponse,
  errors: [
    BranchDoesNotExistException,
    BranchNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidBranchNameException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about a repository branch, including its name and the last commit ID.
 */
export const getBranch: (
  input: GetBranchInput,
) => Effect.Effect<
  GetBranchOutput,
  | BranchDoesNotExistException
  | BranchNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidBranchNameException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBranchInput,
  output: GetBranchOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidBranchNameException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Deletes a branch from a repository, unless that branch is the default branch for the repository.
 */
export const deleteBranch: (
  input: DeleteBranchInput,
) => Effect.Effect<
  DeleteBranchOutput,
  | BranchNameRequiredException
  | DefaultBranchCannotBeDeletedException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidBranchNameException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBranchInput,
  output: DeleteBranchOutput,
  errors: [
    BranchNameRequiredException,
    DefaultBranchCannotBeDeletedException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidBranchNameException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about a commit, including commit message and committer information.
 */
export const getCommit: (
  input: GetCommitInput,
) => Effect.Effect<
  GetCommitOutput,
  | CommitIdDoesNotExistException
  | CommitIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommitIdException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommitInput,
  output: GetCommitOutput,
  errors: [
    CommitIdDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitIdException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Creates a branch in a repository and points the branch to a commit.
 *
 * Calling the create branch operation does not set a repository's default branch. To do this, call the update default branch operation.
 */
export const createBranch: (
  input: CreateBranchInput,
) => Effect.Effect<
  CreateBranchResponse,
  | BranchNameExistsException
  | BranchNameRequiredException
  | CommitDoesNotExistException
  | CommitIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidBranchNameException
  | InvalidCommitIdException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBranchInput,
  output: CreateBranchResponse,
  errors: [
    BranchNameExistsException,
    BranchNameRequiredException,
    CommitDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidBranchNameException,
    InvalidCommitIdException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Updates the structure of an approval rule created specifically for a pull request. For example, you can change the number of required approvers and
 * the approval pool for approvers.
 */
export const updatePullRequestApprovalRuleContent: (
  input: UpdatePullRequestApprovalRuleContentInput,
) => Effect.Effect<
  UpdatePullRequestApprovalRuleContentOutput,
  | ApprovalRuleContentRequiredException
  | ApprovalRuleDoesNotExistException
  | ApprovalRuleNameRequiredException
  | CannotModifyApprovalRuleFromTemplateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleContentException
  | InvalidApprovalRuleNameException
  | InvalidPullRequestIdException
  | InvalidRuleContentSha256Exception
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullRequestApprovalRuleContentInput,
  output: UpdatePullRequestApprovalRuleContentOutput,
  errors: [
    ApprovalRuleContentRequiredException,
    ApprovalRuleDoesNotExistException,
    ApprovalRuleNameRequiredException,
    CannotModifyApprovalRuleFromTemplateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleContentException,
    InvalidApprovalRuleNameException,
    InvalidPullRequestIdException,
    InvalidRuleContentSha256Exception,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
}));
/**
 * Adds or updates tags for a resource in CodeCommit. For a list of valid resources
 * in CodeCommit, see CodeCommit Resources and Operations in the CodeCommit User
 * Guide.
 */
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceResponse,
  | InvalidRepositoryNameException
  | InvalidResourceArnException
  | InvalidSystemTagUsageException
  | InvalidTagsMapException
  | RepositoryDoesNotExistException
  | ResourceArnRequiredException
  | TagPolicyException
  | TagsMapRequiredException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    InvalidRepositoryNameException,
    InvalidResourceArnException,
    InvalidSystemTagUsageException,
    InvalidTagsMapException,
    RepositoryDoesNotExistException,
    ResourceArnRequiredException,
    TagPolicyException,
    TagsMapRequiredException,
    TooManyTagsException,
  ],
}));
/**
 * Replaces the title of a pull request.
 */
export const updatePullRequestTitle: (
  input: UpdatePullRequestTitleInput,
) => Effect.Effect<
  UpdatePullRequestTitleOutput,
  | InvalidPullRequestIdException
  | InvalidTitleException
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | TitleRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullRequestTitleInput,
  output: UpdatePullRequestTitleOutput,
  errors: [
    InvalidPullRequestIdException,
    InvalidTitleException,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    TitleRequiredException,
  ],
}));
/**
 * Adds or updates a reaction to a specified comment for the user whose identity is used to make the request. You can only add or
 * update a reaction for yourself. You cannot add, modify, or delete a reaction for another user.
 */
export const putCommentReaction: (
  input: PutCommentReactionInput,
) => Effect.Effect<
  PutCommentReactionResponse,
  | CommentDeletedException
  | CommentDoesNotExistException
  | CommentIdRequiredException
  | InvalidCommentIdException
  | InvalidReactionValueException
  | ReactionLimitExceededException
  | ReactionValueRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCommentReactionInput,
  output: PutCommentReactionResponse,
  errors: [
    CommentDeletedException,
    CommentDoesNotExistException,
    CommentIdRequiredException,
    InvalidCommentIdException,
    InvalidReactionValueException,
    ReactionLimitExceededException,
    ReactionValueRequiredException,
  ],
}));
/**
 * Returns information about whether approval rules have been set aside (overridden) for a
 * pull request, and if so, the Amazon Resource Name (ARN) of the user or identity that overrode the rules and their requirements for the pull request.
 */
export const getPullRequestOverrideState: (
  input: GetPullRequestOverrideStateInput,
) => Effect.Effect<
  GetPullRequestOverrideStateOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidPullRequestIdException
  | InvalidRevisionIdException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RevisionIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPullRequestOverrideStateInput,
  output: GetPullRequestOverrideStateOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidPullRequestIdException,
    InvalidRevisionIdException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RevisionIdRequiredException,
  ],
}));
/**
 * Creates an association between an approval rule template and one or more specified repositories.
 */
export const batchAssociateApprovalRuleTemplateWithRepositories: (
  input: BatchAssociateApprovalRuleTemplateWithRepositoriesInput,
) => Effect.Effect<
  BatchAssociateApprovalRuleTemplateWithRepositoriesOutput,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleTemplateNameException
  | MaximumRepositoryNamesExceededException
  | RepositoryNamesRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchAssociateApprovalRuleTemplateWithRepositoriesInput,
  output: BatchAssociateApprovalRuleTemplateWithRepositoriesOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleTemplateNameException,
    MaximumRepositoryNamesExceededException,
    RepositoryNamesRequiredException,
  ],
}));
/**
 * Returns the base-64 encoded content of an individual blob in a repository.
 */
export const getBlob: (
  input: GetBlobInput,
) => Effect.Effect<
  GetBlobOutput,
  | BlobIdDoesNotExistException
  | BlobIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileTooLargeException
  | InvalidBlobIdException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlobInput,
  output: GetBlobOutput,
  errors: [
    BlobIdDoesNotExistException,
    BlobIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileTooLargeException,
    InvalidBlobIdException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Returns information about one or more pull request events.
 */
export const describePullRequestEvents: {
  (
    input: DescribePullRequestEventsInput,
  ): Effect.Effect<
    DescribePullRequestEventsOutput,
    | ActorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidActorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestEventTypeException
    | InvalidPullRequestIdException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePullRequestEventsInput,
  ) => Stream.Stream<
    DescribePullRequestEventsOutput,
    | ActorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidActorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestEventTypeException
    | InvalidPullRequestIdException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePullRequestEventsInput,
  ) => Stream.Stream<
    unknown,
    | ActorDoesNotExistException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidActorArnException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestEventTypeException
    | InvalidPullRequestIdException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePullRequestEventsInput,
  output: DescribePullRequestEventsOutput,
  errors: [
    ActorDoesNotExistException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidActorArnException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidPullRequestEventTypeException,
    InvalidPullRequestIdException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an approval rule for a pull request.
 */
export const createPullRequestApprovalRule: (
  input: CreatePullRequestApprovalRuleInput,
) => Effect.Effect<
  CreatePullRequestApprovalRuleOutput,
  | ApprovalRuleContentRequiredException
  | ApprovalRuleNameAlreadyExistsException
  | ApprovalRuleNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleContentException
  | InvalidApprovalRuleNameException
  | InvalidPullRequestIdException
  | NumberOfRulesExceededException
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePullRequestApprovalRuleInput,
  output: CreatePullRequestApprovalRuleOutput,
  errors: [
    ApprovalRuleContentRequiredException,
    ApprovalRuleNameAlreadyExistsException,
    ApprovalRuleNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleContentException,
    InvalidApprovalRuleNameException,
    InvalidPullRequestIdException,
    NumberOfRulesExceededException,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
  ],
}));
/**
 * Returns comments made on a pull request.
 *
 * Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of
 * reactions from active identities, use GetCommentReactions.
 */
export const getCommentsForPullRequest: {
  (
    input: GetCommentsForPullRequestInput,
  ): Effect.Effect<
    GetCommentsForPullRequestOutput,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestIdException
    | InvalidRepositoryNameException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | RepositoryNotAssociatedWithPullRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCommentsForPullRequestInput,
  ) => Stream.Stream<
    GetCommentsForPullRequestOutput,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestIdException
    | InvalidRepositoryNameException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | RepositoryNotAssociatedWithPullRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCommentsForPullRequestInput,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitIdRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPullRequestIdException
    | InvalidRepositoryNameException
    | PullRequestDoesNotExistException
    | PullRequestIdRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | RepositoryNotAssociatedWithPullRequestException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCommentsForPullRequestInput,
  output: GetCommentsForPullRequestOutput,
  errors: [
    CommitDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitIdException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidPullRequestIdException,
    InvalidRepositoryNameException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryNotAssociatedWithPullRequestException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of commits and changes to a specified file.
 */
export const listFileCommitHistory: {
  (
    input: ListFileCommitHistoryRequest,
  ): Effect.Effect<
    ListFileCommitHistoryResponse,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFileCommitHistoryRequest,
  ) => Stream.Stream<
    ListFileCommitHistoryResponse,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFileCommitHistoryRequest,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidRepositoryNameException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFileCommitHistoryRequest,
  output: ListFileCommitHistoryResponse,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about the approval states for a specified pull request. Approval states only apply to pull requests that have one or more
 * approval rules applied to them.
 */
export const getPullRequestApprovalStates: (
  input: GetPullRequestApprovalStatesInput,
) => Effect.Effect<
  GetPullRequestApprovalStatesOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidPullRequestIdException
  | InvalidRevisionIdException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RevisionIdRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPullRequestApprovalStatesInput,
  output: GetPullRequestApprovalStatesOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidPullRequestIdException,
    InvalidRevisionIdException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RevisionIdRequiredException,
  ],
}));
/**
 * Removes the association between an approval rule template and one or more specified repositories.
 */
export const batchDisassociateApprovalRuleTemplateFromRepositories: (
  input: BatchDisassociateApprovalRuleTemplateFromRepositoriesInput,
) => Effect.Effect<
  BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput,
  | ApprovalRuleTemplateDoesNotExistException
  | ApprovalRuleTemplateNameRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalRuleTemplateNameException
  | MaximumRepositoryNamesExceededException
  | RepositoryNamesRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDisassociateApprovalRuleTemplateFromRepositoriesInput,
  output: BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput,
  errors: [
    ApprovalRuleTemplateDoesNotExistException,
    ApprovalRuleTemplateNameRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalRuleTemplateNameException,
    MaximumRepositoryNamesExceededException,
    RepositoryNamesRequiredException,
  ],
}));
/**
 * Returns information about one or more repositories.
 *
 * The description field for a repository accepts all HTML characters and all valid
 * Unicode characters. Applications that do not HTML-encode the description and display
 * it in a webpage can expose users to potentially malicious code. Make sure that you
 * HTML-encode the description field in any application that uses this API to display
 * the repository description on a webpage.
 */
export const batchGetRepositories: (
  input: BatchGetRepositoriesInput,
) => Effect.Effect<
  BatchGetRepositoriesOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | MaximumRepositoryNamesExceededException
  | RepositoryNamesRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetRepositoriesInput,
  output: BatchGetRepositoriesOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    MaximumRepositoryNamesExceededException,
    RepositoryNamesRequiredException,
  ],
}));
/**
 * Merges two branches using the fast-forward merge strategy.
 */
export const mergeBranchesByFastForward: (
  input: MergeBranchesByFastForwardInput,
) => Effect.Effect<
  MergeBranchesByFastForwardOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitDoesNotExistException
  | CommitRequiredException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidBranchNameException
  | InvalidCommitException
  | InvalidRepositoryNameException
  | InvalidTargetBranchException
  | ManualMergeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeBranchesByFastForwardInput,
  output: MergeBranchesByFastForwardOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitDoesNotExistException,
    CommitRequiredException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidBranchNameException,
    InvalidCommitException,
    InvalidRepositoryNameException,
    InvalidTargetBranchException,
    ManualMergeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Returns information about a specified merge commit.
 */
export const getMergeCommit: (
  input: GetMergeCommitInput,
) => Effect.Effect<
  GetMergeCommitOutput,
  | CommitDoesNotExistException
  | CommitRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionStrategyException
  | InvalidRepositoryNameException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMergeCommitInput,
  output: GetMergeCommitOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionStrategyException,
    InvalidRepositoryNameException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Updates the status of a pull request.
 */
export const updatePullRequestStatus: (
  input: UpdatePullRequestStatusInput,
) => Effect.Effect<
  UpdatePullRequestStatusOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidPullRequestIdException
  | InvalidPullRequestStatusException
  | InvalidPullRequestStatusUpdateException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | PullRequestStatusRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullRequestStatusInput,
  output: UpdatePullRequestStatusOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidPullRequestIdException,
    InvalidPullRequestStatusException,
    InvalidPullRequestStatusUpdateException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    PullRequestStatusRequiredException,
  ],
}));
/**
 * Returns the contents of a specified folder in a repository.
 */
export const getFolder: (
  input: GetFolderInput,
) => Effect.Effect<
  GetFolderOutput,
  | CommitDoesNotExistException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FolderDoesNotExistException
  | InvalidCommitException
  | InvalidPathException
  | InvalidRepositoryNameException
  | PathRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFolderInput,
  output: GetFolderOutput,
  errors: [
    CommitDoesNotExistException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FolderDoesNotExistException,
    InvalidCommitException,
    InvalidPathException,
    InvalidRepositoryNameException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Creates a new, empty repository.
 */
export const createRepository: (
  input: CreateRepositoryInput,
) => Effect.Effect<
  CreateRepositoryOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyInvalidIdException
  | EncryptionKeyInvalidUsageException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryDescriptionException
  | InvalidRepositoryNameException
  | InvalidSystemTagUsageException
  | InvalidTagsMapException
  | OperationNotAllowedException
  | RepositoryLimitExceededException
  | RepositoryNameExistsException
  | RepositoryNameRequiredException
  | TagPolicyException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryInput,
  output: CreateRepositoryOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyInvalidIdException,
    EncryptionKeyInvalidUsageException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryDescriptionException,
    InvalidRepositoryNameException,
    InvalidSystemTagUsageException,
    InvalidTagsMapException,
    OperationNotAllowedException,
    RepositoryLimitExceededException,
    RepositoryNameExistsException,
    RepositoryNameRequiredException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Evaluates whether a pull request has met all the conditions specified in its associated approval rules.
 */
export const evaluatePullRequestApprovalRules: (
  input: EvaluatePullRequestApprovalRulesInput,
) => Effect.Effect<
  EvaluatePullRequestApprovalRulesOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidPullRequestIdException
  | InvalidRevisionIdException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RevisionIdRequiredException
  | RevisionNotCurrentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluatePullRequestApprovalRulesInput,
  output: EvaluatePullRequestApprovalRulesOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidPullRequestIdException,
    InvalidRevisionIdException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RevisionIdRequiredException,
    RevisionNotCurrentException,
  ],
}));
/**
 * Returns information about the differences in a valid commit specifier (such as a
 * branch, tag, HEAD, commit ID, or other fully qualified reference). Results can be
 * limited to a specified path.
 */
export const getDifferences: {
  (
    input: GetDifferencesInput,
  ): Effect.Effect<
    GetDifferencesOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPathException
    | InvalidRepositoryNameException
    | PathDoesNotExistException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDifferencesInput,
  ) => Stream.Stream<
    GetDifferencesOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPathException
    | InvalidRepositoryNameException
    | PathDoesNotExistException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDifferencesInput,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidCommitIdException
    | InvalidContinuationTokenException
    | InvalidMaxResultsException
    | InvalidPathException
    | InvalidRepositoryNameException
    | PathDoesNotExistException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDifferencesInput,
  output: GetDifferencesOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidCommitIdException,
    InvalidContinuationTokenException,
    InvalidMaxResultsException,
    InvalidPathException,
    InvalidRepositoryNameException,
    PathDoesNotExistException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the base-64 encoded contents of a specified file and its metadata.
 */
export const getFile: (
  input: GetFileInput,
) => Effect.Effect<
  GetFileOutput,
  | CommitDoesNotExistException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileDoesNotExistException
  | FileTooLargeException
  | InvalidCommitException
  | InvalidPathException
  | InvalidRepositoryNameException
  | PathRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFileInput,
  output: GetFileOutput,
  errors: [
    CommitDoesNotExistException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileDoesNotExistException,
    FileTooLargeException,
    InvalidCommitException,
    InvalidPathException,
    InvalidRepositoryNameException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Sets aside (overrides) all approval rule requirements for a specified pull request.
 */
export const overridePullRequestApprovalRules: (
  input: OverridePullRequestApprovalRulesInput,
) => Effect.Effect<
  OverridePullRequestApprovalRulesResponse,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidOverrideStatusException
  | InvalidPullRequestIdException
  | InvalidRevisionIdException
  | OverrideAlreadySetException
  | OverrideStatusRequiredException
  | PullRequestAlreadyClosedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RevisionIdRequiredException
  | RevisionNotCurrentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OverridePullRequestApprovalRulesInput,
  output: OverridePullRequestApprovalRulesResponse,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidOverrideStatusException,
    InvalidPullRequestIdException,
    InvalidRevisionIdException,
    OverrideAlreadySetException,
    OverrideStatusRequiredException,
    PullRequestAlreadyClosedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RevisionIdRequiredException,
    RevisionNotCurrentException,
  ],
}));
/**
 * Updates the state of a user's approval on a pull request. The user is derived from the signed-in account when the request is made.
 */
export const updatePullRequestApprovalState: (
  input: UpdatePullRequestApprovalStateInput,
) => Effect.Effect<
  UpdatePullRequestApprovalStateResponse,
  | ApprovalStateRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidApprovalStateException
  | InvalidPullRequestIdException
  | InvalidRevisionIdException
  | MaximumNumberOfApprovalsExceededException
  | PullRequestAlreadyClosedException
  | PullRequestCannotBeApprovedByAuthorException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RevisionIdRequiredException
  | RevisionNotCurrentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePullRequestApprovalStateInput,
  output: UpdatePullRequestApprovalStateResponse,
  errors: [
    ApprovalStateRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidApprovalStateException,
    InvalidPullRequestIdException,
    InvalidRevisionIdException,
    MaximumNumberOfApprovalsExceededException,
    PullRequestAlreadyClosedException,
    PullRequestCannotBeApprovedByAuthorException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RevisionIdRequiredException,
    RevisionNotCurrentException,
  ],
}));
/**
 * Posts a comment on the comparison between two commits.
 */
export const postCommentForComparedCommit: (
  input: PostCommentForComparedCommitInput,
) => Effect.Effect<
  PostCommentForComparedCommitOutput,
  | BeforeCommitIdAndAfterCommitIdAreSameException
  | ClientRequestTokenRequiredException
  | CommentContentRequiredException
  | CommentContentSizeLimitExceededException
  | CommitDoesNotExistException
  | CommitIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | IdempotencyParameterMismatchException
  | InvalidClientRequestTokenException
  | InvalidCommitIdException
  | InvalidFileLocationException
  | InvalidFilePositionException
  | InvalidPathException
  | InvalidRelativeFileVersionEnumException
  | InvalidRepositoryNameException
  | PathDoesNotExistException
  | PathRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostCommentForComparedCommitInput,
  output: PostCommentForComparedCommitOutput,
  errors: [
    BeforeCommitIdAndAfterCommitIdAreSameException,
    ClientRequestTokenRequiredException,
    CommentContentRequiredException,
    CommentContentSizeLimitExceededException,
    CommitDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    IdempotencyParameterMismatchException,
    InvalidClientRequestTokenException,
    InvalidCommitIdException,
    InvalidFileLocationException,
    InvalidFilePositionException,
    InvalidPathException,
    InvalidRelativeFileVersionEnumException,
    InvalidRepositoryNameException,
    PathDoesNotExistException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Posts a comment on a pull request.
 */
export const postCommentForPullRequest: (
  input: PostCommentForPullRequestInput,
) => Effect.Effect<
  PostCommentForPullRequestOutput,
  | BeforeCommitIdAndAfterCommitIdAreSameException
  | ClientRequestTokenRequiredException
  | CommentContentRequiredException
  | CommentContentSizeLimitExceededException
  | CommitDoesNotExistException
  | CommitIdRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | IdempotencyParameterMismatchException
  | InvalidClientRequestTokenException
  | InvalidCommitIdException
  | InvalidFileLocationException
  | InvalidFilePositionException
  | InvalidPathException
  | InvalidPullRequestIdException
  | InvalidRelativeFileVersionEnumException
  | InvalidRepositoryNameException
  | PathDoesNotExistException
  | PathRequiredException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryNotAssociatedWithPullRequestException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PostCommentForPullRequestInput,
  output: PostCommentForPullRequestOutput,
  errors: [
    BeforeCommitIdAndAfterCommitIdAreSameException,
    ClientRequestTokenRequiredException,
    CommentContentRequiredException,
    CommentContentSizeLimitExceededException,
    CommitDoesNotExistException,
    CommitIdRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    IdempotencyParameterMismatchException,
    InvalidClientRequestTokenException,
    InvalidCommitIdException,
    InvalidFileLocationException,
    InvalidFilePositionException,
    InvalidPathException,
    InvalidPullRequestIdException,
    InvalidRelativeFileVersionEnumException,
    InvalidRepositoryNameException,
    PathDoesNotExistException,
    PathRequiredException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryNotAssociatedWithPullRequestException,
  ],
}));
/**
 * Attempts to merge the source commit of a pull request into the specified destination
 * branch for that pull request at the specified commit using the fast-forward merge strategy. If the merge is successful, it closes the pull request.
 */
export const mergePullRequestByFastForward: (
  input: MergePullRequestByFastForwardInput,
) => Effect.Effect<
  MergePullRequestByFastForwardOutput,
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommitIdException
  | InvalidPullRequestIdException
  | InvalidRepositoryNameException
  | ManualMergeRequiredException
  | PullRequestAlreadyClosedException
  | PullRequestApprovalRulesNotSatisfiedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | ReferenceDoesNotExistException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryNotAssociatedWithPullRequestException
  | TipOfSourceReferenceIsDifferentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergePullRequestByFastForwardInput,
  output: MergePullRequestByFastForwardOutput,
  errors: [
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitIdException,
    InvalidPullRequestIdException,
    InvalidRepositoryNameException,
    ManualMergeRequiredException,
    PullRequestAlreadyClosedException,
    PullRequestApprovalRulesNotSatisfiedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    ReferenceDoesNotExistException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryNotAssociatedWithPullRequestException,
    TipOfSourceReferenceIsDifferentException,
  ],
}));
/**
 * Returns information about the merge options available for merging two specified
 * branches. For details about why a merge option is not available, use GetMergeConflicts
 * or DescribeMergeConflicts.
 */
export const getMergeOptions: (
  input: GetMergeOptionsInput,
) => Effect.Effect<
  GetMergeOptionsOutput,
  | CommitDoesNotExistException
  | CommitRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionStrategyException
  | InvalidRepositoryNameException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMergeOptionsInput,
  output: GetMergeOptionsOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionStrategyException,
    InvalidRepositoryNameException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Returns information about one or more merge conflicts in the attempted merge of two commit specifiers using the squash or three-way merge strategy.
 */
export const batchDescribeMergeConflicts: (
  input: BatchDescribeMergeConflictsInput,
) => Effect.Effect<
  BatchDescribeMergeConflictsOutput,
  | CommitDoesNotExistException
  | CommitRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionStrategyException
  | InvalidContinuationTokenException
  | InvalidMaxConflictFilesException
  | InvalidMaxMergeHunksException
  | InvalidMergeOptionException
  | InvalidRepositoryNameException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MergeOptionRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDescribeMergeConflictsInput,
  output: BatchDescribeMergeConflictsOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionStrategyException,
    InvalidContinuationTokenException,
    InvalidMaxConflictFilesException,
    InvalidMaxMergeHunksException,
    InvalidMergeOptionException,
    InvalidRepositoryNameException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MergeOptionRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Returns information about merge conflicts between the before and after commit IDs for a pull request in a repository.
 */
export const getMergeConflicts: {
  (
    input: GetMergeConflictsInput,
  ): Effect.Effect<
    GetMergeConflictsOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidDestinationCommitSpecifierException
    | InvalidMaxConflictFilesException
    | InvalidMergeOptionException
    | InvalidRepositoryNameException
    | InvalidSourceCommitSpecifierException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetMergeConflictsInput,
  ) => Stream.Stream<
    GetMergeConflictsOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidDestinationCommitSpecifierException
    | InvalidMaxConflictFilesException
    | InvalidMergeOptionException
    | InvalidRepositoryNameException
    | InvalidSourceCommitSpecifierException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetMergeConflictsInput,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidDestinationCommitSpecifierException
    | InvalidMaxConflictFilesException
    | InvalidMergeOptionException
    | InvalidRepositoryNameException
    | InvalidSourceCommitSpecifierException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetMergeConflictsInput,
  output: GetMergeConflictsOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionStrategyException,
    InvalidContinuationTokenException,
    InvalidDestinationCommitSpecifierException,
    InvalidMaxConflictFilesException,
    InvalidMergeOptionException,
    InvalidRepositoryNameException,
    InvalidSourceCommitSpecifierException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MergeOptionRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxConflictFiles",
  } as const,
}));
/**
 * Returns information about one or more merge conflicts in the attempted merge of two
 * commit specifiers using the squash or three-way merge strategy. If the merge option for
 * the attempted merge is specified as FAST_FORWARD_MERGE, an exception is thrown.
 */
export const describeMergeConflicts: {
  (
    input: DescribeMergeConflictsInput,
  ): Effect.Effect<
    DescribeMergeConflictsOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | FileDoesNotExistException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidMaxMergeHunksException
    | InvalidMergeOptionException
    | InvalidPathException
    | InvalidRepositoryNameException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | PathRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMergeConflictsInput,
  ) => Stream.Stream<
    DescribeMergeConflictsOutput,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | FileDoesNotExistException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidMaxMergeHunksException
    | InvalidMergeOptionException
    | InvalidPathException
    | InvalidRepositoryNameException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | PathRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMergeConflictsInput,
  ) => Stream.Stream<
    unknown,
    | CommitDoesNotExistException
    | CommitRequiredException
    | EncryptionIntegrityChecksFailedException
    | EncryptionKeyAccessDeniedException
    | EncryptionKeyDisabledException
    | EncryptionKeyNotFoundException
    | EncryptionKeyUnavailableException
    | FileDoesNotExistException
    | InvalidCommitException
    | InvalidConflictDetailLevelException
    | InvalidConflictResolutionStrategyException
    | InvalidContinuationTokenException
    | InvalidMaxMergeHunksException
    | InvalidMergeOptionException
    | InvalidPathException
    | InvalidRepositoryNameException
    | MaximumFileContentToLoadExceededException
    | MaximumItemsToCompareExceededException
    | MergeOptionRequiredException
    | PathRequiredException
    | RepositoryDoesNotExistException
    | RepositoryNameRequiredException
    | TipsDivergenceExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMergeConflictsInput,
  output: DescribeMergeConflictsOutput,
  errors: [
    CommitDoesNotExistException,
    CommitRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileDoesNotExistException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionStrategyException,
    InvalidContinuationTokenException,
    InvalidMaxMergeHunksException,
    InvalidMergeOptionException,
    InvalidPathException,
    InvalidRepositoryNameException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MergeOptionRequiredException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxMergeHunks",
  } as const,
}));
/**
 * Deletes a specified file from a specified branch. A commit is created on the branch
 * that contains the revision. The file still exists in the commits earlier to the commit
 * that contains the deletion.
 */
export const deleteFile: (
  input: DeleteFileInput,
) => Effect.Effect<
  DeleteFileOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitMessageLengthExceededException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileDoesNotExistException
  | InvalidBranchNameException
  | InvalidEmailException
  | InvalidParentCommitIdException
  | InvalidPathException
  | InvalidRepositoryNameException
  | NameLengthExceededException
  | ParentCommitDoesNotExistException
  | ParentCommitIdOutdatedException
  | ParentCommitIdRequiredException
  | PathRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileInput,
  output: DeleteFileOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitMessageLengthExceededException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileDoesNotExistException,
    InvalidBranchNameException,
    InvalidEmailException,
    InvalidParentCommitIdException,
    InvalidPathException,
    InvalidRepositoryNameException,
    NameLengthExceededException,
    ParentCommitDoesNotExistException,
    ParentCommitIdOutdatedException,
    ParentCommitIdRequiredException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
  ],
}));
/**
 * Adds or updates a file in a branch in an CodeCommit repository, and generates a commit for the addition in the specified branch.
 */
export const putFile: (
  input: PutFileInput,
) => Effect.Effect<
  PutFileOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitMessageLengthExceededException
  | DirectoryNameConflictsWithFileNameException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentRequiredException
  | FileContentSizeLimitExceededException
  | FileNameConflictsWithDirectoryNameException
  | FilePathConflictsWithSubmodulePathException
  | FolderContentSizeLimitExceededException
  | InvalidBranchNameException
  | InvalidDeletionParameterException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidParentCommitIdException
  | InvalidPathException
  | InvalidRepositoryNameException
  | NameLengthExceededException
  | ParentCommitDoesNotExistException
  | ParentCommitIdOutdatedException
  | ParentCommitIdRequiredException
  | PathRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | SameFileContentException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFileInput,
  output: PutFileOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitMessageLengthExceededException,
    DirectoryNameConflictsWithFileNameException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentRequiredException,
    FileContentSizeLimitExceededException,
    FileNameConflictsWithDirectoryNameException,
    FilePathConflictsWithSubmodulePathException,
    FolderContentSizeLimitExceededException,
    InvalidBranchNameException,
    InvalidDeletionParameterException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidParentCommitIdException,
    InvalidPathException,
    InvalidRepositoryNameException,
    NameLengthExceededException,
    ParentCommitDoesNotExistException,
    ParentCommitIdOutdatedException,
    ParentCommitIdRequiredException,
    PathRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    SameFileContentException,
  ],
}));
/**
 * Attempts to merge the source commit of a pull request into the specified destination
 * branch for that pull request at the specified commit using the three-way merge strategy. If the merge is successful, it closes the pull request.
 */
export const mergePullRequestByThreeWay: (
  input: MergePullRequestByThreeWayInput,
) => Effect.Effect<
  MergePullRequestByThreeWayOutput,
  | CommitMessageLengthExceededException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentSizeLimitExceededException
  | FolderContentSizeLimitExceededException
  | InvalidCommitIdException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionException
  | InvalidConflictResolutionStrategyException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidPathException
  | InvalidPullRequestIdException
  | InvalidReplacementContentException
  | InvalidReplacementTypeException
  | InvalidRepositoryNameException
  | ManualMergeRequiredException
  | MaximumConflictResolutionEntriesExceededException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MultipleConflictResolutionEntriesException
  | NameLengthExceededException
  | PathRequiredException
  | PullRequestAlreadyClosedException
  | PullRequestApprovalRulesNotSatisfiedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | ReplacementContentRequiredException
  | ReplacementTypeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryNotAssociatedWithPullRequestException
  | TipOfSourceReferenceIsDifferentException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergePullRequestByThreeWayInput,
  output: MergePullRequestByThreeWayOutput,
  errors: [
    CommitMessageLengthExceededException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentSizeLimitExceededException,
    FolderContentSizeLimitExceededException,
    InvalidCommitIdException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionException,
    InvalidConflictResolutionStrategyException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidPathException,
    InvalidPullRequestIdException,
    InvalidReplacementContentException,
    InvalidReplacementTypeException,
    InvalidRepositoryNameException,
    ManualMergeRequiredException,
    MaximumConflictResolutionEntriesExceededException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MultipleConflictResolutionEntriesException,
    NameLengthExceededException,
    PathRequiredException,
    PullRequestAlreadyClosedException,
    PullRequestApprovalRulesNotSatisfiedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    ReplacementContentRequiredException,
    ReplacementTypeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryNotAssociatedWithPullRequestException,
    TipOfSourceReferenceIsDifferentException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Creates a pull request in the specified repository.
 */
export const createPullRequest: (
  input: CreatePullRequestInput,
) => Effect.Effect<
  CreatePullRequestOutput,
  | ClientRequestTokenRequiredException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | IdempotencyParameterMismatchException
  | InvalidClientRequestTokenException
  | InvalidDescriptionException
  | InvalidReferenceNameException
  | InvalidRepositoryNameException
  | InvalidTargetException
  | InvalidTargetsException
  | InvalidTitleException
  | MaximumOpenPullRequestsExceededException
  | MultipleRepositoriesInPullRequestException
  | ReferenceDoesNotExistException
  | ReferenceNameRequiredException
  | ReferenceTypeNotSupportedException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | SourceAndDestinationAreSameException
  | TargetRequiredException
  | TargetsRequiredException
  | TitleRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePullRequestInput,
  output: CreatePullRequestOutput,
  errors: [
    ClientRequestTokenRequiredException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    IdempotencyParameterMismatchException,
    InvalidClientRequestTokenException,
    InvalidDescriptionException,
    InvalidReferenceNameException,
    InvalidRepositoryNameException,
    InvalidTargetException,
    InvalidTargetsException,
    InvalidTitleException,
    MaximumOpenPullRequestsExceededException,
    MultipleRepositoriesInPullRequestException,
    ReferenceDoesNotExistException,
    ReferenceNameRequiredException,
    ReferenceTypeNotSupportedException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    SourceAndDestinationAreSameException,
    TargetRequiredException,
    TargetsRequiredException,
    TitleRequiredException,
  ],
}));
/**
 * Creates an unreferenced commit that represents the result of merging two branches
 * using a specified merge strategy. This can help you determine the outcome of a potential
 * merge. This API cannot be used with the fast-forward merge strategy because that
 * strategy does not create a merge commit.
 *
 * This unreferenced merge commit
 * can only be accessed using the GetCommit API or through git commands such as git fetch. To retrieve this commit, you must specify its commit ID or otherwise reference it.
 */
export const createUnreferencedMergeCommit: (
  input: CreateUnreferencedMergeCommitInput,
) => Effect.Effect<
  CreateUnreferencedMergeCommitOutput,
  | CommitDoesNotExistException
  | CommitMessageLengthExceededException
  | CommitRequiredException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentSizeLimitExceededException
  | FileModeRequiredException
  | FolderContentSizeLimitExceededException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionException
  | InvalidConflictResolutionStrategyException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidMergeOptionException
  | InvalidPathException
  | InvalidReplacementContentException
  | InvalidReplacementTypeException
  | InvalidRepositoryNameException
  | ManualMergeRequiredException
  | MaximumConflictResolutionEntriesExceededException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MergeOptionRequiredException
  | MultipleConflictResolutionEntriesException
  | NameLengthExceededException
  | PathRequiredException
  | ReplacementContentRequiredException
  | ReplacementTypeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUnreferencedMergeCommitInput,
  output: CreateUnreferencedMergeCommitOutput,
  errors: [
    CommitDoesNotExistException,
    CommitMessageLengthExceededException,
    CommitRequiredException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentSizeLimitExceededException,
    FileModeRequiredException,
    FolderContentSizeLimitExceededException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionException,
    InvalidConflictResolutionStrategyException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidMergeOptionException,
    InvalidPathException,
    InvalidReplacementContentException,
    InvalidReplacementTypeException,
    InvalidRepositoryNameException,
    ManualMergeRequiredException,
    MaximumConflictResolutionEntriesExceededException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MergeOptionRequiredException,
    MultipleConflictResolutionEntriesException,
    NameLengthExceededException,
    PathRequiredException,
    ReplacementContentRequiredException,
    ReplacementTypeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Merges two specified branches using the three-way merge strategy.
 */
export const mergeBranchesByThreeWay: (
  input: MergeBranchesByThreeWayInput,
) => Effect.Effect<
  MergeBranchesByThreeWayOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitDoesNotExistException
  | CommitMessageLengthExceededException
  | CommitRequiredException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentSizeLimitExceededException
  | FileModeRequiredException
  | FolderContentSizeLimitExceededException
  | InvalidBranchNameException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionException
  | InvalidConflictResolutionStrategyException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidPathException
  | InvalidReplacementContentException
  | InvalidReplacementTypeException
  | InvalidRepositoryNameException
  | InvalidTargetBranchException
  | ManualMergeRequiredException
  | MaximumConflictResolutionEntriesExceededException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MultipleConflictResolutionEntriesException
  | NameLengthExceededException
  | PathRequiredException
  | ReplacementContentRequiredException
  | ReplacementTypeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeBranchesByThreeWayInput,
  output: MergeBranchesByThreeWayOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitDoesNotExistException,
    CommitMessageLengthExceededException,
    CommitRequiredException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentSizeLimitExceededException,
    FileModeRequiredException,
    FolderContentSizeLimitExceededException,
    InvalidBranchNameException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionException,
    InvalidConflictResolutionStrategyException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidPathException,
    InvalidReplacementContentException,
    InvalidReplacementTypeException,
    InvalidRepositoryNameException,
    InvalidTargetBranchException,
    ManualMergeRequiredException,
    MaximumConflictResolutionEntriesExceededException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MultipleConflictResolutionEntriesException,
    NameLengthExceededException,
    PathRequiredException,
    ReplacementContentRequiredException,
    ReplacementTypeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Attempts to merge the source commit of a pull request into the specified destination
 * branch for that pull request at the specified commit using the squash merge strategy. If the merge is successful, it closes the pull request.
 */
export const mergePullRequestBySquash: (
  input: MergePullRequestBySquashInput,
) => Effect.Effect<
  MergePullRequestBySquashOutput,
  | CommitMessageLengthExceededException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentSizeLimitExceededException
  | FolderContentSizeLimitExceededException
  | InvalidCommitIdException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionException
  | InvalidConflictResolutionStrategyException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidPathException
  | InvalidPullRequestIdException
  | InvalidReplacementContentException
  | InvalidReplacementTypeException
  | InvalidRepositoryNameException
  | ManualMergeRequiredException
  | MaximumConflictResolutionEntriesExceededException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MultipleConflictResolutionEntriesException
  | NameLengthExceededException
  | PathRequiredException
  | PullRequestAlreadyClosedException
  | PullRequestApprovalRulesNotSatisfiedException
  | PullRequestDoesNotExistException
  | PullRequestIdRequiredException
  | ReplacementContentRequiredException
  | ReplacementTypeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryNotAssociatedWithPullRequestException
  | TipOfSourceReferenceIsDifferentException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergePullRequestBySquashInput,
  output: MergePullRequestBySquashOutput,
  errors: [
    CommitMessageLengthExceededException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentSizeLimitExceededException,
    FolderContentSizeLimitExceededException,
    InvalidCommitIdException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionException,
    InvalidConflictResolutionStrategyException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidPathException,
    InvalidPullRequestIdException,
    InvalidReplacementContentException,
    InvalidReplacementTypeException,
    InvalidRepositoryNameException,
    ManualMergeRequiredException,
    MaximumConflictResolutionEntriesExceededException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MultipleConflictResolutionEntriesException,
    NameLengthExceededException,
    PathRequiredException,
    PullRequestAlreadyClosedException,
    PullRequestApprovalRulesNotSatisfiedException,
    PullRequestDoesNotExistException,
    PullRequestIdRequiredException,
    ReplacementContentRequiredException,
    ReplacementTypeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryNotAssociatedWithPullRequestException,
    TipOfSourceReferenceIsDifferentException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Merges two branches using the squash merge strategy.
 */
export const mergeBranchesBySquash: (
  input: MergeBranchesBySquashInput,
) => Effect.Effect<
  MergeBranchesBySquashOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitDoesNotExistException
  | CommitMessageLengthExceededException
  | CommitRequiredException
  | ConcurrentReferenceUpdateException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentSizeLimitExceededException
  | FileModeRequiredException
  | FolderContentSizeLimitExceededException
  | InvalidBranchNameException
  | InvalidCommitException
  | InvalidConflictDetailLevelException
  | InvalidConflictResolutionException
  | InvalidConflictResolutionStrategyException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidPathException
  | InvalidReplacementContentException
  | InvalidReplacementTypeException
  | InvalidRepositoryNameException
  | InvalidTargetBranchException
  | ManualMergeRequiredException
  | MaximumConflictResolutionEntriesExceededException
  | MaximumFileContentToLoadExceededException
  | MaximumItemsToCompareExceededException
  | MultipleConflictResolutionEntriesException
  | NameLengthExceededException
  | PathRequiredException
  | ReplacementContentRequiredException
  | ReplacementTypeRequiredException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | TipsDivergenceExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: MergeBranchesBySquashInput,
  output: MergeBranchesBySquashOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitDoesNotExistException,
    CommitMessageLengthExceededException,
    CommitRequiredException,
    ConcurrentReferenceUpdateException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentSizeLimitExceededException,
    FileModeRequiredException,
    FolderContentSizeLimitExceededException,
    InvalidBranchNameException,
    InvalidCommitException,
    InvalidConflictDetailLevelException,
    InvalidConflictResolutionException,
    InvalidConflictResolutionStrategyException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidPathException,
    InvalidReplacementContentException,
    InvalidReplacementTypeException,
    InvalidRepositoryNameException,
    InvalidTargetBranchException,
    ManualMergeRequiredException,
    MaximumConflictResolutionEntriesExceededException,
    MaximumFileContentToLoadExceededException,
    MaximumItemsToCompareExceededException,
    MultipleConflictResolutionEntriesException,
    NameLengthExceededException,
    PathRequiredException,
    ReplacementContentRequiredException,
    ReplacementTypeRequiredException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    TipsDivergenceExceededException,
  ],
}));
/**
 * Creates a commit for a repository on the tip of a specified branch.
 */
export const createCommit: (
  input: CreateCommitInput,
) => Effect.Effect<
  CreateCommitOutput,
  | BranchDoesNotExistException
  | BranchNameIsTagNameException
  | BranchNameRequiredException
  | CommitMessageLengthExceededException
  | DirectoryNameConflictsWithFileNameException
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | FileContentAndSourceFileSpecifiedException
  | FileContentSizeLimitExceededException
  | FileDoesNotExistException
  | FileEntryRequiredException
  | FileModeRequiredException
  | FileNameConflictsWithDirectoryNameException
  | FilePathConflictsWithSubmodulePathException
  | FolderContentSizeLimitExceededException
  | InvalidBranchNameException
  | InvalidDeletionParameterException
  | InvalidEmailException
  | InvalidFileModeException
  | InvalidParentCommitIdException
  | InvalidPathException
  | InvalidRepositoryNameException
  | MaximumFileEntriesExceededException
  | NameLengthExceededException
  | NoChangeException
  | ParentCommitDoesNotExistException
  | ParentCommitIdOutdatedException
  | ParentCommitIdRequiredException
  | PathRequiredException
  | PutFileEntryConflictException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RestrictedSourceFileException
  | SamePathRequestException
  | SourceFileOrContentRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCommitInput,
  output: CreateCommitOutput,
  errors: [
    BranchDoesNotExistException,
    BranchNameIsTagNameException,
    BranchNameRequiredException,
    CommitMessageLengthExceededException,
    DirectoryNameConflictsWithFileNameException,
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    FileContentAndSourceFileSpecifiedException,
    FileContentSizeLimitExceededException,
    FileDoesNotExistException,
    FileEntryRequiredException,
    FileModeRequiredException,
    FileNameConflictsWithDirectoryNameException,
    FilePathConflictsWithSubmodulePathException,
    FolderContentSizeLimitExceededException,
    InvalidBranchNameException,
    InvalidDeletionParameterException,
    InvalidEmailException,
    InvalidFileModeException,
    InvalidParentCommitIdException,
    InvalidPathException,
    InvalidRepositoryNameException,
    MaximumFileEntriesExceededException,
    NameLengthExceededException,
    NoChangeException,
    ParentCommitDoesNotExistException,
    ParentCommitIdOutdatedException,
    ParentCommitIdRequiredException,
    PathRequiredException,
    PutFileEntryConflictException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RestrictedSourceFileException,
    SamePathRequestException,
    SourceFileOrContentRequiredException,
  ],
}));
/**
 * Replaces all triggers for a repository. Used to create or delete triggers.
 */
export const putRepositoryTriggers: (
  input: PutRepositoryTriggersInput,
) => Effect.Effect<
  PutRepositoryTriggersOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | InvalidRepositoryTriggerBranchNameException
  | InvalidRepositoryTriggerCustomDataException
  | InvalidRepositoryTriggerDestinationArnException
  | InvalidRepositoryTriggerEventsException
  | InvalidRepositoryTriggerNameException
  | InvalidRepositoryTriggerRegionException
  | MaximumBranchesExceededException
  | MaximumRepositoryTriggersExceededException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryTriggerBranchNameListRequiredException
  | RepositoryTriggerDestinationArnRequiredException
  | RepositoryTriggerEventsListRequiredException
  | RepositoryTriggerNameRequiredException
  | RepositoryTriggersListRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRepositoryTriggersInput,
  output: PutRepositoryTriggersOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    InvalidRepositoryTriggerBranchNameException,
    InvalidRepositoryTriggerCustomDataException,
    InvalidRepositoryTriggerDestinationArnException,
    InvalidRepositoryTriggerEventsException,
    InvalidRepositoryTriggerNameException,
    InvalidRepositoryTriggerRegionException,
    MaximumBranchesExceededException,
    MaximumRepositoryTriggersExceededException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryTriggerBranchNameListRequiredException,
    RepositoryTriggerDestinationArnRequiredException,
    RepositoryTriggerEventsListRequiredException,
    RepositoryTriggerNameRequiredException,
    RepositoryTriggersListRequiredException,
  ],
}));
/**
 * Tests the functionality of repository triggers by sending information to the trigger
 * target. If real data is available in the repository, the test sends data from the last
 * commit. If no data is available, sample data is generated.
 */
export const testRepositoryTriggers: (
  input: TestRepositoryTriggersInput,
) => Effect.Effect<
  TestRepositoryTriggersOutput,
  | EncryptionIntegrityChecksFailedException
  | EncryptionKeyAccessDeniedException
  | EncryptionKeyDisabledException
  | EncryptionKeyNotFoundException
  | EncryptionKeyUnavailableException
  | InvalidRepositoryNameException
  | InvalidRepositoryTriggerBranchNameException
  | InvalidRepositoryTriggerCustomDataException
  | InvalidRepositoryTriggerDestinationArnException
  | InvalidRepositoryTriggerEventsException
  | InvalidRepositoryTriggerNameException
  | InvalidRepositoryTriggerRegionException
  | MaximumBranchesExceededException
  | MaximumRepositoryTriggersExceededException
  | RepositoryDoesNotExistException
  | RepositoryNameRequiredException
  | RepositoryTriggerBranchNameListRequiredException
  | RepositoryTriggerDestinationArnRequiredException
  | RepositoryTriggerEventsListRequiredException
  | RepositoryTriggerNameRequiredException
  | RepositoryTriggersListRequiredException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestRepositoryTriggersInput,
  output: TestRepositoryTriggersOutput,
  errors: [
    EncryptionIntegrityChecksFailedException,
    EncryptionKeyAccessDeniedException,
    EncryptionKeyDisabledException,
    EncryptionKeyNotFoundException,
    EncryptionKeyUnavailableException,
    InvalidRepositoryNameException,
    InvalidRepositoryTriggerBranchNameException,
    InvalidRepositoryTriggerCustomDataException,
    InvalidRepositoryTriggerDestinationArnException,
    InvalidRepositoryTriggerEventsException,
    InvalidRepositoryTriggerNameException,
    InvalidRepositoryTriggerRegionException,
    MaximumBranchesExceededException,
    MaximumRepositoryTriggersExceededException,
    RepositoryDoesNotExistException,
    RepositoryNameRequiredException,
    RepositoryTriggerBranchNameListRequiredException,
    RepositoryTriggerDestinationArnRequiredException,
    RepositoryTriggerEventsListRequiredException,
    RepositoryTriggerNameRequiredException,
    RepositoryTriggersListRequiredException,
  ],
}));
