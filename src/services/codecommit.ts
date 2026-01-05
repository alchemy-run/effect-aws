import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const RepositoryNameList = S.Array(S.String);
export const FilePaths = S.Array(S.String);
export const CommitIdsInputList = S.Array(S.String);
export const TagKeysList = S.Array(S.String);
export class AssociateApprovalRuleTemplateWithRepositoryInput extends S.Class<AssociateApprovalRuleTemplateWithRepositoryInput>(
  "AssociateApprovalRuleTemplateWithRepositoryInput",
)(
  { approvalRuleTemplateName: S.String, repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateApprovalRuleTemplateWithRepositoryResponse extends S.Class<AssociateApprovalRuleTemplateWithRepositoryResponse>(
  "AssociateApprovalRuleTemplateWithRepositoryResponse",
)({}, ns) {}
export class BatchAssociateApprovalRuleTemplateWithRepositoriesInput extends S.Class<BatchAssociateApprovalRuleTemplateWithRepositoriesInput>(
  "BatchAssociateApprovalRuleTemplateWithRepositoriesInput",
)(
  { approvalRuleTemplateName: S.String, repositoryNames: RepositoryNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDescribeMergeConflictsInput extends S.Class<BatchDescribeMergeConflictsInput>(
  "BatchDescribeMergeConflictsInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDisassociateApprovalRuleTemplateFromRepositoriesInput extends S.Class<BatchDisassociateApprovalRuleTemplateFromRepositoriesInput>(
  "BatchDisassociateApprovalRuleTemplateFromRepositoriesInput",
)(
  { approvalRuleTemplateName: S.String, repositoryNames: RepositoryNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetCommitsInput extends S.Class<BatchGetCommitsInput>(
  "BatchGetCommitsInput",
)(
  { commitIds: CommitIdsInputList, repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetRepositoriesInput extends S.Class<BatchGetRepositoriesInput>(
  "BatchGetRepositoriesInput",
)(
  { repositoryNames: RepositoryNameList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApprovalRuleTemplateInput extends S.Class<CreateApprovalRuleTemplateInput>(
  "CreateApprovalRuleTemplateInput",
)(
  {
    approvalRuleTemplateName: S.String,
    approvalRuleTemplateContent: S.String,
    approvalRuleTemplateDescription: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBranchInput extends S.Class<CreateBranchInput>(
  "CreateBranchInput",
)(
  { repositoryName: S.String, branchName: S.String, commitId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBranchResponse extends S.Class<CreateBranchResponse>(
  "CreateBranchResponse",
)({}, ns) {}
export class CreatePullRequestApprovalRuleInput extends S.Class<CreatePullRequestApprovalRuleInput>(
  "CreatePullRequestApprovalRuleInput",
)(
  {
    pullRequestId: S.String,
    approvalRuleName: S.String,
    approvalRuleContent: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApprovalRuleTemplateInput extends S.Class<DeleteApprovalRuleTemplateInput>(
  "DeleteApprovalRuleTemplateInput",
)(
  { approvalRuleTemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBranchInput extends S.Class<DeleteBranchInput>(
  "DeleteBranchInput",
)(
  { repositoryName: S.String, branchName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCommentContentInput extends S.Class<DeleteCommentContentInput>(
  "DeleteCommentContentInput",
)(
  { commentId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFileInput extends S.Class<DeleteFileInput>(
  "DeleteFileInput",
)(
  {
    repositoryName: S.String,
    branchName: S.String,
    filePath: S.String,
    parentCommitId: S.String,
    keepEmptyFolders: S.optional(S.Boolean),
    commitMessage: S.optional(S.String),
    name: S.optional(S.String),
    email: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePullRequestApprovalRuleInput extends S.Class<DeletePullRequestApprovalRuleInput>(
  "DeletePullRequestApprovalRuleInput",
)(
  { pullRequestId: S.String, approvalRuleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryInput extends S.Class<DeleteRepositoryInput>(
  "DeleteRepositoryInput",
)(
  { repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMergeConflictsInput extends S.Class<DescribeMergeConflictsInput>(
  "DescribeMergeConflictsInput",
)(
  {
    repositoryName: S.String,
    destinationCommitSpecifier: S.String,
    sourceCommitSpecifier: S.String,
    mergeOption: S.String,
    maxMergeHunks: S.optional(S.Number),
    filePath: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePullRequestEventsInput extends S.Class<DescribePullRequestEventsInput>(
  "DescribePullRequestEventsInput",
)(
  {
    pullRequestId: S.String,
    pullRequestEventType: S.optional(S.String),
    actorArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateApprovalRuleTemplateFromRepositoryInput extends S.Class<DisassociateApprovalRuleTemplateFromRepositoryInput>(
  "DisassociateApprovalRuleTemplateFromRepositoryInput",
)(
  { approvalRuleTemplateName: S.String, repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateApprovalRuleTemplateFromRepositoryResponse extends S.Class<DisassociateApprovalRuleTemplateFromRepositoryResponse>(
  "DisassociateApprovalRuleTemplateFromRepositoryResponse",
)({}, ns) {}
export class EvaluatePullRequestApprovalRulesInput extends S.Class<EvaluatePullRequestApprovalRulesInput>(
  "EvaluatePullRequestApprovalRulesInput",
)(
  { pullRequestId: S.String, revisionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetApprovalRuleTemplateInput extends S.Class<GetApprovalRuleTemplateInput>(
  "GetApprovalRuleTemplateInput",
)(
  { approvalRuleTemplateName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBlobInput extends S.Class<GetBlobInput>("GetBlobInput")(
  { repositoryName: S.String, blobId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBranchInput extends S.Class<GetBranchInput>("GetBranchInput")(
  { repositoryName: S.optional(S.String), branchName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommentInput extends S.Class<GetCommentInput>(
  "GetCommentInput",
)(
  { commentId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommentReactionsInput extends S.Class<GetCommentReactionsInput>(
  "GetCommentReactionsInput",
)(
  {
    commentId: S.String,
    reactionUserArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommentsForComparedCommitInput extends S.Class<GetCommentsForComparedCommitInput>(
  "GetCommentsForComparedCommitInput",
)(
  {
    repositoryName: S.String,
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommentsForPullRequestInput extends S.Class<GetCommentsForPullRequestInput>(
  "GetCommentsForPullRequestInput",
)(
  {
    pullRequestId: S.String,
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCommitInput extends S.Class<GetCommitInput>("GetCommitInput")(
  { repositoryName: S.String, commitId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDifferencesInput extends S.Class<GetDifferencesInput>(
  "GetDifferencesInput",
)(
  {
    repositoryName: S.String,
    beforeCommitSpecifier: S.optional(S.String),
    afterCommitSpecifier: S.String,
    beforePath: S.optional(S.String),
    afterPath: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFileInput extends S.Class<GetFileInput>("GetFileInput")(
  {
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    filePath: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetFolderInput extends S.Class<GetFolderInput>("GetFolderInput")(
  {
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    folderPath: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMergeCommitInput extends S.Class<GetMergeCommitInput>(
  "GetMergeCommitInput",
)(
  {
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMergeConflictsInput extends S.Class<GetMergeConflictsInput>(
  "GetMergeConflictsInput",
)(
  {
    repositoryName: S.String,
    destinationCommitSpecifier: S.String,
    sourceCommitSpecifier: S.String,
    mergeOption: S.String,
    conflictDetailLevel: S.optional(S.String),
    maxConflictFiles: S.optional(S.Number),
    conflictResolutionStrategy: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMergeOptionsInput extends S.Class<GetMergeOptionsInput>(
  "GetMergeOptionsInput",
)(
  {
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    conflictDetailLevel: S.optional(S.String),
    conflictResolutionStrategy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPullRequestInput extends S.Class<GetPullRequestInput>(
  "GetPullRequestInput",
)(
  { pullRequestId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPullRequestApprovalStatesInput extends S.Class<GetPullRequestApprovalStatesInput>(
  "GetPullRequestApprovalStatesInput",
)(
  { pullRequestId: S.String, revisionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPullRequestOverrideStateInput extends S.Class<GetPullRequestOverrideStateInput>(
  "GetPullRequestOverrideStateInput",
)(
  { pullRequestId: S.String, revisionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryInput extends S.Class<GetRepositoryInput>(
  "GetRepositoryInput",
)(
  { repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryTriggersInput extends S.Class<GetRepositoryTriggersInput>(
  "GetRepositoryTriggersInput",
)(
  { repositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApprovalRuleTemplatesInput extends S.Class<ListApprovalRuleTemplatesInput>(
  "ListApprovalRuleTemplatesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAssociatedApprovalRuleTemplatesForRepositoryInput extends S.Class<ListAssociatedApprovalRuleTemplatesForRepositoryInput>(
  "ListAssociatedApprovalRuleTemplatesForRepositoryInput",
)(
  {
    repositoryName: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBranchesInput extends S.Class<ListBranchesInput>(
  "ListBranchesInput",
)(
  { repositoryName: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFileCommitHistoryRequest extends S.Class<ListFileCommitHistoryRequest>(
  "ListFileCommitHistoryRequest",
)(
  {
    repositoryName: S.String,
    commitSpecifier: S.optional(S.String),
    filePath: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPullRequestsInput extends S.Class<ListPullRequestsInput>(
  "ListPullRequestsInput",
)(
  {
    repositoryName: S.String,
    authorArn: S.optional(S.String),
    pullRequestStatus: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositoriesInput extends S.Class<ListRepositoriesInput>(
  "ListRepositoriesInput",
)(
  {
    nextToken: S.optional(S.String),
    sortBy: S.optional(S.String),
    order: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositoriesForApprovalRuleTemplateInput extends S.Class<ListRepositoriesForApprovalRuleTemplateInput>(
  "ListRepositoriesForApprovalRuleTemplateInput",
)(
  {
    approvalRuleTemplateName: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  { resourceArn: S.String, nextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergeBranchesByFastForwardInput extends S.Class<MergeBranchesByFastForwardInput>(
  "MergeBranchesByFastForwardInput",
)(
  {
    repositoryName: S.String,
    sourceCommitSpecifier: S.String,
    destinationCommitSpecifier: S.String,
    targetBranch: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReplaceContentEntry extends S.Class<ReplaceContentEntry>(
  "ReplaceContentEntry",
)({
  filePath: S.String,
  replacementType: S.String,
  content: S.optional(T.Blob),
  fileMode: S.optional(S.String),
}) {}
export const ReplaceContentEntries = S.Array(ReplaceContentEntry);
export class DeleteFileEntry extends S.Class<DeleteFileEntry>(
  "DeleteFileEntry",
)({ filePath: S.String }) {}
export const DeleteFileEntries = S.Array(DeleteFileEntry);
export class SetFileModeEntry extends S.Class<SetFileModeEntry>(
  "SetFileModeEntry",
)({ filePath: S.String, fileMode: S.String }) {}
export const SetFileModeEntries = S.Array(SetFileModeEntry);
export class ConflictResolution extends S.Class<ConflictResolution>(
  "ConflictResolution",
)({
  replaceContents: S.optional(ReplaceContentEntries),
  deleteFiles: S.optional(DeleteFileEntries),
  setFileModes: S.optional(SetFileModeEntries),
}) {}
export class MergeBranchesBySquashInput extends S.Class<MergeBranchesBySquashInput>(
  "MergeBranchesBySquashInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergeBranchesByThreeWayInput extends S.Class<MergeBranchesByThreeWayInput>(
  "MergeBranchesByThreeWayInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergePullRequestByFastForwardInput extends S.Class<MergePullRequestByFastForwardInput>(
  "MergePullRequestByFastForwardInput",
)(
  {
    pullRequestId: S.String,
    repositoryName: S.String,
    sourceCommitId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergePullRequestBySquashInput extends S.Class<MergePullRequestBySquashInput>(
  "MergePullRequestBySquashInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MergePullRequestByThreeWayInput extends S.Class<MergePullRequestByThreeWayInput>(
  "MergePullRequestByThreeWayInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OverridePullRequestApprovalRulesInput extends S.Class<OverridePullRequestApprovalRulesInput>(
  "OverridePullRequestApprovalRulesInput",
)(
  { pullRequestId: S.String, revisionId: S.String, overrideStatus: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class OverridePullRequestApprovalRulesResponse extends S.Class<OverridePullRequestApprovalRulesResponse>(
  "OverridePullRequestApprovalRulesResponse",
)({}, ns) {}
export class Location extends S.Class<Location>("Location")({
  filePath: S.optional(S.String),
  filePosition: S.optional(S.Number),
  relativeFileVersion: S.optional(S.String),
}) {}
export class PostCommentForPullRequestInput extends S.Class<PostCommentForPullRequestInput>(
  "PostCommentForPullRequestInput",
)(
  {
    pullRequestId: S.String,
    repositoryName: S.String,
    beforeCommitId: S.String,
    afterCommitId: S.String,
    location: S.optional(Location),
    content: S.String,
    clientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PostCommentReplyInput extends S.Class<PostCommentReplyInput>(
  "PostCommentReplyInput",
)(
  {
    inReplyTo: S.String,
    clientRequestToken: S.optional(S.String),
    content: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutCommentReactionInput extends S.Class<PutCommentReactionInput>(
  "PutCommentReactionInput",
)(
  { commentId: S.String, reactionValue: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutCommentReactionResponse extends S.Class<PutCommentReactionResponse>(
  "PutCommentReactionResponse",
)({}, ns) {}
export class PutFileInput extends S.Class<PutFileInput>("PutFileInput")(
  {
    repositoryName: S.String,
    branchName: S.String,
    fileContent: T.Blob,
    filePath: S.String,
    fileMode: S.optional(S.String),
    parentCommitId: S.optional(S.String),
    commitMessage: S.optional(S.String),
    name: S.optional(S.String),
    email: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String, tags: TagsMap },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export const BranchNameList = S.Array(S.String);
export const RepositoryTriggerEventList = S.Array(S.String);
export class RepositoryTrigger extends S.Class<RepositoryTrigger>(
  "RepositoryTrigger",
)({
  name: S.String,
  destinationArn: S.String,
  customData: S.optional(S.String),
  branches: S.optional(BranchNameList),
  events: RepositoryTriggerEventList,
}) {}
export const RepositoryTriggersList = S.Array(RepositoryTrigger);
export class TestRepositoryTriggersInput extends S.Class<TestRepositoryTriggersInput>(
  "TestRepositoryTriggersInput",
)(
  { repositoryName: S.String, triggers: RepositoryTriggersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { resourceArn: S.String, tagKeys: TagKeysList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateApprovalRuleTemplateContentInput extends S.Class<UpdateApprovalRuleTemplateContentInput>(
  "UpdateApprovalRuleTemplateContentInput",
)(
  {
    approvalRuleTemplateName: S.String,
    newRuleContent: S.String,
    existingRuleContentSha256: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApprovalRuleTemplateDescriptionInput extends S.Class<UpdateApprovalRuleTemplateDescriptionInput>(
  "UpdateApprovalRuleTemplateDescriptionInput",
)(
  {
    approvalRuleTemplateName: S.String,
    approvalRuleTemplateDescription: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApprovalRuleTemplateNameInput extends S.Class<UpdateApprovalRuleTemplateNameInput>(
  "UpdateApprovalRuleTemplateNameInput",
)(
  {
    oldApprovalRuleTemplateName: S.String,
    newApprovalRuleTemplateName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCommentInput extends S.Class<UpdateCommentInput>(
  "UpdateCommentInput",
)(
  { commentId: S.String, content: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDefaultBranchInput extends S.Class<UpdateDefaultBranchInput>(
  "UpdateDefaultBranchInput",
)(
  { repositoryName: S.String, defaultBranchName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDefaultBranchResponse extends S.Class<UpdateDefaultBranchResponse>(
  "UpdateDefaultBranchResponse",
)({}, ns) {}
export class UpdatePullRequestApprovalRuleContentInput extends S.Class<UpdatePullRequestApprovalRuleContentInput>(
  "UpdatePullRequestApprovalRuleContentInput",
)(
  {
    pullRequestId: S.String,
    approvalRuleName: S.String,
    existingRuleContentSha256: S.optional(S.String),
    newRuleContent: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePullRequestApprovalStateInput extends S.Class<UpdatePullRequestApprovalStateInput>(
  "UpdatePullRequestApprovalStateInput",
)(
  { pullRequestId: S.String, revisionId: S.String, approvalState: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePullRequestApprovalStateResponse extends S.Class<UpdatePullRequestApprovalStateResponse>(
  "UpdatePullRequestApprovalStateResponse",
)({}, ns) {}
export class UpdatePullRequestDescriptionInput extends S.Class<UpdatePullRequestDescriptionInput>(
  "UpdatePullRequestDescriptionInput",
)(
  { pullRequestId: S.String, description: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePullRequestStatusInput extends S.Class<UpdatePullRequestStatusInput>(
  "UpdatePullRequestStatusInput",
)(
  { pullRequestId: S.String, pullRequestStatus: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePullRequestTitleInput extends S.Class<UpdatePullRequestTitleInput>(
  "UpdatePullRequestTitleInput",
)(
  { pullRequestId: S.String, title: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRepositoryDescriptionInput extends S.Class<UpdateRepositoryDescriptionInput>(
  "UpdateRepositoryDescriptionInput",
)(
  { repositoryName: S.String, repositoryDescription: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRepositoryDescriptionResponse extends S.Class<UpdateRepositoryDescriptionResponse>(
  "UpdateRepositoryDescriptionResponse",
)({}, ns) {}
export class UpdateRepositoryEncryptionKeyInput extends S.Class<UpdateRepositoryEncryptionKeyInput>(
  "UpdateRepositoryEncryptionKeyInput",
)(
  { repositoryName: S.String, kmsKeyId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRepositoryNameInput extends S.Class<UpdateRepositoryNameInput>(
  "UpdateRepositoryNameInput",
)(
  { oldName: S.String, newName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateRepositoryNameResponse extends S.Class<UpdateRepositoryNameResponse>(
  "UpdateRepositoryNameResponse",
)({}, ns) {}
export const RepositoryNotFoundList = S.Array(S.String);
export class Target extends S.Class<Target>("Target")({
  repositoryName: S.String,
  sourceReference: S.String,
  destinationReference: S.optional(S.String),
}) {}
export const TargetList = S.Array(Target);
export class FileSizes extends S.Class<FileSizes>("FileSizes")({
  source: S.optional(S.Number),
  destination: S.optional(S.Number),
  base: S.optional(S.Number),
}) {}
export class FileModes extends S.Class<FileModes>("FileModes")({
  source: S.optional(S.String),
  destination: S.optional(S.String),
  base: S.optional(S.String),
}) {}
export class ObjectTypes extends S.Class<ObjectTypes>("ObjectTypes")({
  source: S.optional(S.String),
  destination: S.optional(S.String),
  base: S.optional(S.String),
}) {}
export class IsBinaryFile extends S.Class<IsBinaryFile>("IsBinaryFile")({
  source: S.optional(S.Boolean),
  destination: S.optional(S.Boolean),
  base: S.optional(S.Boolean),
}) {}
export class MergeOperations extends S.Class<MergeOperations>(
  "MergeOperations",
)({ source: S.optional(S.String), destination: S.optional(S.String) }) {}
export class ConflictMetadata extends S.Class<ConflictMetadata>(
  "ConflictMetadata",
)({
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
}) {}
export const ConflictMetadataList = S.Array(ConflictMetadata);
export const MergeOptions = S.Array(S.String);
export const ApprovalRuleTemplateNameList = S.Array(S.String);
export const PullRequestIdList = S.Array(S.String);
export const RepositoryTriggerNameList = S.Array(S.String);
export class CreatePullRequestInput extends S.Class<CreatePullRequestInput>(
  "CreatePullRequestInput",
)(
  {
    title: S.String,
    description: S.optional(S.String),
    targets: TargetList,
    clientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRepositoryInput extends S.Class<CreateRepositoryInput>(
  "CreateRepositoryInput",
)(
  {
    repositoryName: S.String,
    repositoryDescription: S.optional(S.String),
    tags: S.optional(TagsMap),
    kmsKeyId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApprovalRuleTemplateOutput extends S.Class<DeleteApprovalRuleTemplateOutput>(
  "DeleteApprovalRuleTemplateOutput",
)({ approvalRuleTemplateId: S.String }, ns) {}
export class DeleteFileOutput extends S.Class<DeleteFileOutput>(
  "DeleteFileOutput",
)(
  {
    commitId: S.String,
    blobId: S.String,
    treeId: S.String,
    filePath: S.String,
  },
  ns,
) {}
export class DeletePullRequestApprovalRuleOutput extends S.Class<DeletePullRequestApprovalRuleOutput>(
  "DeletePullRequestApprovalRuleOutput",
)({ approvalRuleId: S.String }, ns) {}
export class DeleteRepositoryOutput extends S.Class<DeleteRepositoryOutput>(
  "DeleteRepositoryOutput",
)({ repositoryId: S.optional(S.String) }, ns) {}
export class ApprovalRuleTemplate extends S.Class<ApprovalRuleTemplate>(
  "ApprovalRuleTemplate",
)({
  approvalRuleTemplateId: S.optional(S.String),
  approvalRuleTemplateName: S.optional(S.String),
  approvalRuleTemplateDescription: S.optional(S.String),
  approvalRuleTemplateContent: S.optional(S.String),
  ruleContentSha256: S.optional(S.String),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedUser: S.optional(S.String),
}) {}
export class GetApprovalRuleTemplateOutput extends S.Class<GetApprovalRuleTemplateOutput>(
  "GetApprovalRuleTemplateOutput",
)({ approvalRuleTemplate: ApprovalRuleTemplate }, ns) {}
export class GetBlobOutput extends S.Class<GetBlobOutput>("GetBlobOutput")(
  { content: T.Blob },
  ns,
) {}
export class BranchInfo extends S.Class<BranchInfo>("BranchInfo")({
  branchName: S.optional(S.String),
  commitId: S.optional(S.String),
}) {}
export class GetBranchOutput extends S.Class<GetBranchOutput>(
  "GetBranchOutput",
)({ branch: S.optional(BranchInfo) }, ns) {}
export const CallerReactions = S.Array(S.String);
export const ReactionCountsMap = S.Record({ key: S.String, value: S.Number });
export class Comment extends S.Class<Comment>("Comment")({
  commentId: S.optional(S.String),
  content: S.optional(S.String),
  inReplyTo: S.optional(S.String),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  authorArn: S.optional(S.String),
  deleted: S.optional(S.Boolean),
  clientRequestToken: S.optional(S.String),
  callerReactions: S.optional(CallerReactions),
  reactionCounts: S.optional(ReactionCountsMap),
}) {}
export class GetCommentOutput extends S.Class<GetCommentOutput>(
  "GetCommentOutput",
)({ comment: S.optional(Comment) }, ns) {}
export const ParentList = S.Array(S.String);
export class UserInfo extends S.Class<UserInfo>("UserInfo")({
  name: S.optional(S.String),
  email: S.optional(S.String),
  date: S.optional(S.String),
}) {}
export class Commit extends S.Class<Commit>("Commit")({
  commitId: S.optional(S.String),
  treeId: S.optional(S.String),
  parents: S.optional(ParentList),
  message: S.optional(S.String),
  author: S.optional(UserInfo),
  committer: S.optional(UserInfo),
  additionalData: S.optional(S.String),
}) {}
export class GetCommitOutput extends S.Class<GetCommitOutput>(
  "GetCommitOutput",
)({ commit: Commit }, ns) {}
export class GetFileOutput extends S.Class<GetFileOutput>("GetFileOutput")(
  {
    commitId: S.String,
    blobId: S.String,
    filePath: S.String,
    fileMode: S.String,
    fileSize: S.Number,
    fileContent: T.Blob,
  },
  ns,
) {}
export class GetMergeCommitOutput extends S.Class<GetMergeCommitOutput>(
  "GetMergeCommitOutput",
)(
  {
    sourceCommitId: S.optional(S.String),
    destinationCommitId: S.optional(S.String),
    baseCommitId: S.optional(S.String),
    mergedCommitId: S.optional(S.String),
  },
  ns,
) {}
export class GetMergeConflictsOutput extends S.Class<GetMergeConflictsOutput>(
  "GetMergeConflictsOutput",
)(
  {
    mergeable: S.Boolean,
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
    conflictMetadataList: ConflictMetadataList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetMergeOptionsOutput extends S.Class<GetMergeOptionsOutput>(
  "GetMergeOptionsOutput",
)(
  {
    mergeOptions: MergeOptions,
    sourceCommitId: S.String,
    destinationCommitId: S.String,
    baseCommitId: S.String,
  },
  ns,
) {}
export class GetPullRequestOverrideStateOutput extends S.Class<GetPullRequestOverrideStateOutput>(
  "GetPullRequestOverrideStateOutput",
)({ overridden: S.optional(S.Boolean), overrider: S.optional(S.String) }, ns) {}
export class RepositoryMetadata extends S.Class<RepositoryMetadata>(
  "RepositoryMetadata",
)({
  accountId: S.optional(S.String),
  repositoryId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  repositoryDescription: S.optional(S.String),
  defaultBranch: S.optional(S.String),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  cloneUrlHttp: S.optional(S.String),
  cloneUrlSsh: S.optional(S.String),
  Arn: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
}) {}
export class GetRepositoryOutput extends S.Class<GetRepositoryOutput>(
  "GetRepositoryOutput",
)({ repositoryMetadata: S.optional(RepositoryMetadata) }, ns) {}
export class GetRepositoryTriggersOutput extends S.Class<GetRepositoryTriggersOutput>(
  "GetRepositoryTriggersOutput",
)(
  {
    configurationId: S.optional(S.String),
    triggers: S.optional(RepositoryTriggersList),
  },
  ns,
) {}
export class ListApprovalRuleTemplatesOutput extends S.Class<ListApprovalRuleTemplatesOutput>(
  "ListApprovalRuleTemplatesOutput",
)(
  {
    approvalRuleTemplateNames: S.optional(ApprovalRuleTemplateNameList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAssociatedApprovalRuleTemplatesForRepositoryOutput extends S.Class<ListAssociatedApprovalRuleTemplatesForRepositoryOutput>(
  "ListAssociatedApprovalRuleTemplatesForRepositoryOutput",
)(
  {
    approvalRuleTemplateNames: S.optional(ApprovalRuleTemplateNameList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListBranchesOutput extends S.Class<ListBranchesOutput>(
  "ListBranchesOutput",
)(
  { branches: S.optional(BranchNameList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListPullRequestsOutput extends S.Class<ListPullRequestsOutput>(
  "ListPullRequestsOutput",
)({ pullRequestIds: PullRequestIdList, nextToken: S.optional(S.String) }, ns) {}
export class ListRepositoriesForApprovalRuleTemplateOutput extends S.Class<ListRepositoriesForApprovalRuleTemplateOutput>(
  "ListRepositoriesForApprovalRuleTemplateOutput",
)(
  {
    repositoryNames: S.optional(RepositoryNameList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagsMap), nextToken: S.optional(S.String) }, ns) {}
export class MergeBranchesByFastForwardOutput extends S.Class<MergeBranchesByFastForwardOutput>(
  "MergeBranchesByFastForwardOutput",
)({ commitId: S.optional(S.String), treeId: S.optional(S.String) }, ns) {}
export class MergeBranchesBySquashOutput extends S.Class<MergeBranchesBySquashOutput>(
  "MergeBranchesBySquashOutput",
)({ commitId: S.optional(S.String), treeId: S.optional(S.String) }, ns) {}
export class MergeBranchesByThreeWayOutput extends S.Class<MergeBranchesByThreeWayOutput>(
  "MergeBranchesByThreeWayOutput",
)({ commitId: S.optional(S.String), treeId: S.optional(S.String) }, ns) {}
export class MergeMetadata extends S.Class<MergeMetadata>("MergeMetadata")({
  isMerged: S.optional(S.Boolean),
  mergedBy: S.optional(S.String),
  mergeCommitId: S.optional(S.String),
  mergeOption: S.optional(S.String),
}) {}
export class PullRequestTarget extends S.Class<PullRequestTarget>(
  "PullRequestTarget",
)({
  repositoryName: S.optional(S.String),
  sourceReference: S.optional(S.String),
  destinationReference: S.optional(S.String),
  destinationCommit: S.optional(S.String),
  sourceCommit: S.optional(S.String),
  mergeBase: S.optional(S.String),
  mergeMetadata: S.optional(MergeMetadata),
}) {}
export const PullRequestTargetList = S.Array(PullRequestTarget);
export class OriginApprovalRuleTemplate extends S.Class<OriginApprovalRuleTemplate>(
  "OriginApprovalRuleTemplate",
)({
  approvalRuleTemplateId: S.optional(S.String),
  approvalRuleTemplateName: S.optional(S.String),
}) {}
export class ApprovalRule extends S.Class<ApprovalRule>("ApprovalRule")({
  approvalRuleId: S.optional(S.String),
  approvalRuleName: S.optional(S.String),
  approvalRuleContent: S.optional(S.String),
  ruleContentSha256: S.optional(S.String),
  lastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedUser: S.optional(S.String),
  originApprovalRuleTemplate: S.optional(OriginApprovalRuleTemplate),
}) {}
export const ApprovalRulesList = S.Array(ApprovalRule);
export class PullRequest extends S.Class<PullRequest>("PullRequest")({
  pullRequestId: S.optional(S.String),
  title: S.optional(S.String),
  description: S.optional(S.String),
  lastActivityDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  creationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  pullRequestStatus: S.optional(S.String),
  authorArn: S.optional(S.String),
  pullRequestTargets: S.optional(PullRequestTargetList),
  clientRequestToken: S.optional(S.String),
  revisionId: S.optional(S.String),
  approvalRules: S.optional(ApprovalRulesList),
}) {}
export class MergePullRequestByFastForwardOutput extends S.Class<MergePullRequestByFastForwardOutput>(
  "MergePullRequestByFastForwardOutput",
)({ pullRequest: S.optional(PullRequest) }, ns) {}
export class MergePullRequestBySquashOutput extends S.Class<MergePullRequestBySquashOutput>(
  "MergePullRequestBySquashOutput",
)({ pullRequest: S.optional(PullRequest) }, ns) {}
export class MergePullRequestByThreeWayOutput extends S.Class<MergePullRequestByThreeWayOutput>(
  "MergePullRequestByThreeWayOutput",
)({ pullRequest: S.optional(PullRequest) }, ns) {}
export class PostCommentForComparedCommitInput extends S.Class<PostCommentForComparedCommitInput>(
  "PostCommentForComparedCommitInput",
)(
  {
    repositoryName: S.String,
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.String,
    location: S.optional(Location),
    content: S.String,
    clientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PostCommentForPullRequestOutput extends S.Class<PostCommentForPullRequestOutput>(
  "PostCommentForPullRequestOutput",
)(
  {
    repositoryName: S.optional(S.String),
    pullRequestId: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comment: S.optional(Comment),
  },
  ns,
) {}
export class PostCommentReplyOutput extends S.Class<PostCommentReplyOutput>(
  "PostCommentReplyOutput",
)({ comment: S.optional(Comment) }, ns) {}
export class PutFileOutput extends S.Class<PutFileOutput>("PutFileOutput")(
  { commitId: S.String, blobId: S.String, treeId: S.String },
  ns,
) {}
export class PutRepositoryTriggersInput extends S.Class<PutRepositoryTriggersInput>(
  "PutRepositoryTriggersInput",
)(
  { repositoryName: S.String, triggers: RepositoryTriggersList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateApprovalRuleTemplateContentOutput extends S.Class<UpdateApprovalRuleTemplateContentOutput>(
  "UpdateApprovalRuleTemplateContentOutput",
)({ approvalRuleTemplate: ApprovalRuleTemplate }, ns) {}
export class UpdateApprovalRuleTemplateDescriptionOutput extends S.Class<UpdateApprovalRuleTemplateDescriptionOutput>(
  "UpdateApprovalRuleTemplateDescriptionOutput",
)({ approvalRuleTemplate: ApprovalRuleTemplate }, ns) {}
export class UpdateApprovalRuleTemplateNameOutput extends S.Class<UpdateApprovalRuleTemplateNameOutput>(
  "UpdateApprovalRuleTemplateNameOutput",
)({ approvalRuleTemplate: ApprovalRuleTemplate }, ns) {}
export class UpdateCommentOutput extends S.Class<UpdateCommentOutput>(
  "UpdateCommentOutput",
)({ comment: S.optional(Comment) }, ns) {}
export class UpdatePullRequestApprovalRuleContentOutput extends S.Class<UpdatePullRequestApprovalRuleContentOutput>(
  "UpdatePullRequestApprovalRuleContentOutput",
)({ approvalRule: ApprovalRule }, ns) {}
export class UpdatePullRequestDescriptionOutput extends S.Class<UpdatePullRequestDescriptionOutput>(
  "UpdatePullRequestDescriptionOutput",
)({ pullRequest: PullRequest }, ns) {}
export class UpdatePullRequestStatusOutput extends S.Class<UpdatePullRequestStatusOutput>(
  "UpdatePullRequestStatusOutput",
)({ pullRequest: PullRequest }, ns) {}
export class UpdatePullRequestTitleOutput extends S.Class<UpdatePullRequestTitleOutput>(
  "UpdatePullRequestTitleOutput",
)({ pullRequest: PullRequest }, ns) {}
export class UpdateRepositoryEncryptionKeyOutput extends S.Class<UpdateRepositoryEncryptionKeyOutput>(
  "UpdateRepositoryEncryptionKeyOutput",
)(
  {
    repositoryId: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    originalKmsKeyId: S.optional(S.String),
  },
  ns,
) {}
export class SourceFileSpecifier extends S.Class<SourceFileSpecifier>(
  "SourceFileSpecifier",
)({ filePath: S.String, isMove: S.optional(S.Boolean) }) {}
export const ApprovalRulesSatisfiedList = S.Array(S.String);
export const ApprovalRulesNotSatisfiedList = S.Array(S.String);
export const ReactionUsersList = S.Array(S.String);
export const Comments = S.Array(Comment);
export const RevisionChildren = S.Array(S.String);
export class BatchAssociateApprovalRuleTemplateWithRepositoriesError extends S.Class<BatchAssociateApprovalRuleTemplateWithRepositoriesError>(
  "BatchAssociateApprovalRuleTemplateWithRepositoriesError",
)({
  repositoryName: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList =
  S.Array(BatchAssociateApprovalRuleTemplateWithRepositoriesError);
export class MergeHunkDetail extends S.Class<MergeHunkDetail>(
  "MergeHunkDetail",
)({
  startLine: S.optional(S.Number),
  endLine: S.optional(S.Number),
  hunkContent: S.optional(S.String),
}) {}
export class MergeHunk extends S.Class<MergeHunk>("MergeHunk")({
  isConflict: S.optional(S.Boolean),
  source: S.optional(MergeHunkDetail),
  destination: S.optional(MergeHunkDetail),
  base: S.optional(MergeHunkDetail),
}) {}
export const MergeHunks = S.Array(MergeHunk);
export class Conflict extends S.Class<Conflict>("Conflict")({
  conflictMetadata: S.optional(ConflictMetadata),
  mergeHunks: S.optional(MergeHunks),
}) {}
export const Conflicts = S.Array(Conflict);
export class BatchDescribeMergeConflictsError extends S.Class<BatchDescribeMergeConflictsError>(
  "BatchDescribeMergeConflictsError",
)({ filePath: S.String, exceptionName: S.String, message: S.String }) {}
export const BatchDescribeMergeConflictsErrors = S.Array(
  BatchDescribeMergeConflictsError,
);
export class BatchDisassociateApprovalRuleTemplateFromRepositoriesError extends S.Class<BatchDisassociateApprovalRuleTemplateFromRepositoriesError>(
  "BatchDisassociateApprovalRuleTemplateFromRepositoriesError",
)({
  repositoryName: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList =
  S.Array(BatchDisassociateApprovalRuleTemplateFromRepositoriesError);
export class BatchGetCommitsError extends S.Class<BatchGetCommitsError>(
  "BatchGetCommitsError",
)({
  commitId: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchGetCommitsErrorsList = S.Array(BatchGetCommitsError);
export const RepositoryMetadataList = S.Array(RepositoryMetadata);
export class BatchGetRepositoriesError extends S.Class<BatchGetRepositoriesError>(
  "BatchGetRepositoriesError",
)({
  repositoryId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const BatchGetRepositoriesErrorsList = S.Array(
  BatchGetRepositoriesError,
);
export class PutFileEntry extends S.Class<PutFileEntry>("PutFileEntry")({
  filePath: S.String,
  fileMode: S.optional(S.String),
  fileContent: S.optional(T.Blob),
  sourceFile: S.optional(SourceFileSpecifier),
}) {}
export const PutFileEntries = S.Array(PutFileEntry);
export class Evaluation extends S.Class<Evaluation>("Evaluation")({
  approved: S.optional(S.Boolean),
  overridden: S.optional(S.Boolean),
  approvalRulesSatisfied: S.optional(ApprovalRulesSatisfiedList),
  approvalRulesNotSatisfied: S.optional(ApprovalRulesNotSatisfiedList),
}) {}
export class CommentsForComparedCommit extends S.Class<CommentsForComparedCommit>(
  "CommentsForComparedCommit",
)({
  repositoryName: S.optional(S.String),
  beforeCommitId: S.optional(S.String),
  afterCommitId: S.optional(S.String),
  beforeBlobId: S.optional(S.String),
  afterBlobId: S.optional(S.String),
  location: S.optional(Location),
  comments: S.optional(Comments),
}) {}
export const CommentsForComparedCommitData = S.Array(CommentsForComparedCommit);
export class CommentsForPullRequest extends S.Class<CommentsForPullRequest>(
  "CommentsForPullRequest",
)({
  pullRequestId: S.optional(S.String),
  repositoryName: S.optional(S.String),
  beforeCommitId: S.optional(S.String),
  afterCommitId: S.optional(S.String),
  beforeBlobId: S.optional(S.String),
  afterBlobId: S.optional(S.String),
  location: S.optional(Location),
  comments: S.optional(Comments),
}) {}
export const CommentsForPullRequestData = S.Array(CommentsForPullRequest);
export class Folder extends S.Class<Folder>("Folder")({
  treeId: S.optional(S.String),
  absolutePath: S.optional(S.String),
  relativePath: S.optional(S.String),
}) {}
export const FolderList = S.Array(Folder);
export class File extends S.Class<File>("File")({
  blobId: S.optional(S.String),
  absolutePath: S.optional(S.String),
  relativePath: S.optional(S.String),
  fileMode: S.optional(S.String),
}) {}
export const FileList = S.Array(File);
export class SymbolicLink extends S.Class<SymbolicLink>("SymbolicLink")({
  blobId: S.optional(S.String),
  absolutePath: S.optional(S.String),
  relativePath: S.optional(S.String),
  fileMode: S.optional(S.String),
}) {}
export const SymbolicLinkList = S.Array(SymbolicLink);
export class SubModule extends S.Class<SubModule>("SubModule")({
  commitId: S.optional(S.String),
  absolutePath: S.optional(S.String),
  relativePath: S.optional(S.String),
}) {}
export const SubModuleList = S.Array(SubModule);
export class Approval extends S.Class<Approval>("Approval")({
  userArn: S.optional(S.String),
  approvalState: S.optional(S.String),
}) {}
export const ApprovalList = S.Array(Approval);
export class FileVersion extends S.Class<FileVersion>("FileVersion")({
  commit: S.optional(Commit),
  blobId: S.optional(S.String),
  path: S.optional(S.String),
  revisionChildren: S.optional(RevisionChildren),
}) {}
export const RevisionDag = S.Array(FileVersion);
export class RepositoryNameIdPair extends S.Class<RepositoryNameIdPair>(
  "RepositoryNameIdPair",
)({
  repositoryName: S.optional(S.String),
  repositoryId: S.optional(S.String),
}) {}
export const RepositoryNameIdPairList = S.Array(RepositoryNameIdPair);
export class RepositoryTriggerExecutionFailure extends S.Class<RepositoryTriggerExecutionFailure>(
  "RepositoryTriggerExecutionFailure",
)({ trigger: S.optional(S.String), failureMessage: S.optional(S.String) }) {}
export const RepositoryTriggerExecutionFailureList = S.Array(
  RepositoryTriggerExecutionFailure,
);
export class BatchAssociateApprovalRuleTemplateWithRepositoriesOutput extends S.Class<BatchAssociateApprovalRuleTemplateWithRepositoriesOutput>(
  "BatchAssociateApprovalRuleTemplateWithRepositoriesOutput",
)(
  {
    associatedRepositoryNames: RepositoryNameList,
    errors: BatchAssociateApprovalRuleTemplateWithRepositoriesErrorsList,
  },
  ns,
) {}
export class BatchDescribeMergeConflictsOutput extends S.Class<BatchDescribeMergeConflictsOutput>(
  "BatchDescribeMergeConflictsOutput",
)(
  {
    conflicts: Conflicts,
    nextToken: S.optional(S.String),
    errors: S.optional(BatchDescribeMergeConflictsErrors),
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
  },
  ns,
) {}
export class BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput extends S.Class<BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput>(
  "BatchDisassociateApprovalRuleTemplateFromRepositoriesOutput",
)(
  {
    disassociatedRepositoryNames: RepositoryNameList,
    errors: BatchDisassociateApprovalRuleTemplateFromRepositoriesErrorsList,
  },
  ns,
) {}
export class BatchGetRepositoriesOutput extends S.Class<BatchGetRepositoriesOutput>(
  "BatchGetRepositoriesOutput",
)(
  {
    repositories: S.optional(RepositoryMetadataList),
    repositoriesNotFound: S.optional(RepositoryNotFoundList),
    errors: S.optional(BatchGetRepositoriesErrorsList),
  },
  ns,
) {}
export class CreateApprovalRuleTemplateOutput extends S.Class<CreateApprovalRuleTemplateOutput>(
  "CreateApprovalRuleTemplateOutput",
)({ approvalRuleTemplate: ApprovalRuleTemplate }, ns) {}
export class CreateCommitInput extends S.Class<CreateCommitInput>(
  "CreateCommitInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePullRequestOutput extends S.Class<CreatePullRequestOutput>(
  "CreatePullRequestOutput",
)({ pullRequest: PullRequest }, ns) {}
export class CreateRepositoryOutput extends S.Class<CreateRepositoryOutput>(
  "CreateRepositoryOutput",
)({ repositoryMetadata: S.optional(RepositoryMetadata) }, ns) {}
export class CreateUnreferencedMergeCommitInput extends S.Class<CreateUnreferencedMergeCommitInput>(
  "CreateUnreferencedMergeCommitInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBranchOutput extends S.Class<DeleteBranchOutput>(
  "DeleteBranchOutput",
)({ deletedBranch: S.optional(BranchInfo) }, ns) {}
export class EvaluatePullRequestApprovalRulesOutput extends S.Class<EvaluatePullRequestApprovalRulesOutput>(
  "EvaluatePullRequestApprovalRulesOutput",
)({ evaluation: Evaluation }, ns) {}
export class GetCommentsForComparedCommitOutput extends S.Class<GetCommentsForComparedCommitOutput>(
  "GetCommentsForComparedCommitOutput",
)(
  {
    commentsForComparedCommitData: S.optional(CommentsForComparedCommitData),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetCommentsForPullRequestOutput extends S.Class<GetCommentsForPullRequestOutput>(
  "GetCommentsForPullRequestOutput",
)(
  {
    commentsForPullRequestData: S.optional(CommentsForPullRequestData),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetFolderOutput extends S.Class<GetFolderOutput>(
  "GetFolderOutput",
)(
  {
    commitId: S.String,
    folderPath: S.String,
    treeId: S.optional(S.String),
    subFolders: S.optional(FolderList),
    files: S.optional(FileList),
    symbolicLinks: S.optional(SymbolicLinkList),
    subModules: S.optional(SubModuleList),
  },
  ns,
) {}
export class GetPullRequestApprovalStatesOutput extends S.Class<GetPullRequestApprovalStatesOutput>(
  "GetPullRequestApprovalStatesOutput",
)({ approvals: S.optional(ApprovalList) }, ns) {}
export class ListFileCommitHistoryResponse extends S.Class<ListFileCommitHistoryResponse>(
  "ListFileCommitHistoryResponse",
)({ revisionDag: RevisionDag, nextToken: S.optional(S.String) }, ns) {}
export class ListRepositoriesOutput extends S.Class<ListRepositoriesOutput>(
  "ListRepositoriesOutput",
)(
  {
    repositories: S.optional(RepositoryNameIdPairList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class PostCommentForComparedCommitOutput extends S.Class<PostCommentForComparedCommitOutput>(
  "PostCommentForComparedCommitOutput",
)(
  {
    repositoryName: S.optional(S.String),
    beforeCommitId: S.optional(S.String),
    afterCommitId: S.optional(S.String),
    beforeBlobId: S.optional(S.String),
    afterBlobId: S.optional(S.String),
    location: S.optional(Location),
    comment: S.optional(Comment),
  },
  ns,
) {}
export class PutRepositoryTriggersOutput extends S.Class<PutRepositoryTriggersOutput>(
  "PutRepositoryTriggersOutput",
)({ configurationId: S.optional(S.String) }, ns) {}
export class TestRepositoryTriggersOutput extends S.Class<TestRepositoryTriggersOutput>(
  "TestRepositoryTriggersOutput",
)(
  {
    successfulExecutions: S.optional(RepositoryTriggerNameList),
    failedExecutions: S.optional(RepositoryTriggerExecutionFailureList),
  },
  ns,
) {}
export class PullRequestCreatedEventMetadata extends S.Class<PullRequestCreatedEventMetadata>(
  "PullRequestCreatedEventMetadata",
)({
  repositoryName: S.optional(S.String),
  sourceCommitId: S.optional(S.String),
  destinationCommitId: S.optional(S.String),
  mergeBase: S.optional(S.String),
}) {}
export class PullRequestStatusChangedEventMetadata extends S.Class<PullRequestStatusChangedEventMetadata>(
  "PullRequestStatusChangedEventMetadata",
)({ pullRequestStatus: S.optional(S.String) }) {}
export class PullRequestSourceReferenceUpdatedEventMetadata extends S.Class<PullRequestSourceReferenceUpdatedEventMetadata>(
  "PullRequestSourceReferenceUpdatedEventMetadata",
)({
  repositoryName: S.optional(S.String),
  beforeCommitId: S.optional(S.String),
  afterCommitId: S.optional(S.String),
  mergeBase: S.optional(S.String),
}) {}
export class ApprovalRuleEventMetadata extends S.Class<ApprovalRuleEventMetadata>(
  "ApprovalRuleEventMetadata",
)({
  approvalRuleName: S.optional(S.String),
  approvalRuleId: S.optional(S.String),
  approvalRuleContent: S.optional(S.String),
}) {}
export class ApprovalStateChangedEventMetadata extends S.Class<ApprovalStateChangedEventMetadata>(
  "ApprovalStateChangedEventMetadata",
)({ revisionId: S.optional(S.String), approvalStatus: S.optional(S.String) }) {}
export class ApprovalRuleOverriddenEventMetadata extends S.Class<ApprovalRuleOverriddenEventMetadata>(
  "ApprovalRuleOverriddenEventMetadata",
)({ revisionId: S.optional(S.String), overrideStatus: S.optional(S.String) }) {}
export class ReactionValueFormats extends S.Class<ReactionValueFormats>(
  "ReactionValueFormats",
)({
  emoji: S.optional(S.String),
  shortCode: S.optional(S.String),
  unicode: S.optional(S.String),
}) {}
export class BlobMetadata extends S.Class<BlobMetadata>("BlobMetadata")({
  blobId: S.optional(S.String),
  path: S.optional(S.String),
  mode: S.optional(S.String),
}) {}
export const CommitObjectsList = S.Array(Commit);
export class ReactionForComment extends S.Class<ReactionForComment>(
  "ReactionForComment",
)({
  reaction: S.optional(ReactionValueFormats),
  reactionUsers: S.optional(ReactionUsersList),
  reactionsFromDeletedUsersCount: S.optional(S.Number),
}) {}
export const ReactionsForCommentList = S.Array(ReactionForComment);
export class Difference extends S.Class<Difference>("Difference")({
  beforeBlob: S.optional(BlobMetadata),
  afterBlob: S.optional(BlobMetadata),
  changeType: S.optional(S.String),
}) {}
export const DifferenceList = S.Array(Difference);
export class BatchGetCommitsOutput extends S.Class<BatchGetCommitsOutput>(
  "BatchGetCommitsOutput",
)(
  {
    commits: S.optional(CommitObjectsList),
    errors: S.optional(BatchGetCommitsErrorsList),
  },
  ns,
) {}
export class CreatePullRequestApprovalRuleOutput extends S.Class<CreatePullRequestApprovalRuleOutput>(
  "CreatePullRequestApprovalRuleOutput",
)({ approvalRule: ApprovalRule }, ns) {}
export class CreateUnreferencedMergeCommitOutput extends S.Class<CreateUnreferencedMergeCommitOutput>(
  "CreateUnreferencedMergeCommitOutput",
)({ commitId: S.optional(S.String), treeId: S.optional(S.String) }, ns) {}
export class DeleteCommentContentOutput extends S.Class<DeleteCommentContentOutput>(
  "DeleteCommentContentOutput",
)({ comment: S.optional(Comment) }, ns) {}
export class DescribeMergeConflictsOutput extends S.Class<DescribeMergeConflictsOutput>(
  "DescribeMergeConflictsOutput",
)(
  {
    conflictMetadata: ConflictMetadata,
    mergeHunks: MergeHunks,
    nextToken: S.optional(S.String),
    destinationCommitId: S.String,
    sourceCommitId: S.String,
    baseCommitId: S.optional(S.String),
  },
  ns,
) {}
export class GetCommentReactionsOutput extends S.Class<GetCommentReactionsOutput>(
  "GetCommentReactionsOutput",
)(
  {
    reactionsForComment: ReactionsForCommentList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetDifferencesOutput extends S.Class<GetDifferencesOutput>(
  "GetDifferencesOutput",
)(
  { differences: S.optional(DifferenceList), NextToken: S.optional(S.String) },
  ns,
) {}
export class GetPullRequestOutput extends S.Class<GetPullRequestOutput>(
  "GetPullRequestOutput",
)({ pullRequest: PullRequest }, ns) {}
export class PullRequestMergedStateChangedEventMetadata extends S.Class<PullRequestMergedStateChangedEventMetadata>(
  "PullRequestMergedStateChangedEventMetadata",
)({
  repositoryName: S.optional(S.String),
  destinationReference: S.optional(S.String),
  mergeMetadata: S.optional(MergeMetadata),
}) {}
export class FileMetadata extends S.Class<FileMetadata>("FileMetadata")({
  absolutePath: S.optional(S.String),
  blobId: S.optional(S.String),
  fileMode: S.optional(S.String),
}) {}
export const FilesMetadata = S.Array(FileMetadata);
export class PullRequestEvent extends S.Class<PullRequestEvent>(
  "PullRequestEvent",
)({
  pullRequestId: S.optional(S.String),
  eventDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  pullRequestEventType: S.optional(S.String),
  actorArn: S.optional(S.String),
  pullRequestCreatedEventMetadata: S.optional(PullRequestCreatedEventMetadata),
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
}) {}
export const PullRequestEventList = S.Array(PullRequestEvent);
export class CreateCommitOutput extends S.Class<CreateCommitOutput>(
  "CreateCommitOutput",
)(
  {
    commitId: S.optional(S.String),
    treeId: S.optional(S.String),
    filesAdded: S.optional(FilesMetadata),
    filesUpdated: S.optional(FilesMetadata),
    filesDeleted: S.optional(FilesMetadata),
  },
  ns,
) {}
export class DescribePullRequestEventsOutput extends S.Class<DescribePullRequestEventsOutput>(
  "DescribePullRequestEventsOutput",
)(
  { pullRequestEvents: PullRequestEventList, nextToken: S.optional(S.String) },
  ns,
) {}

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
export const deleteApprovalRuleTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApprovalRuleTemplateInput,
    output: DeleteApprovalRuleTemplateOutput,
    errors: [
      ApprovalRuleTemplateInUseException,
      ApprovalRuleTemplateNameRequiredException,
      InvalidApprovalRuleTemplateNameException,
    ],
  }),
);
/**
 * Lists all approval rule templates in the specified Amazon Web Services Region in your Amazon Web Services account. If
 * an Amazon Web Services Region is not specified, the Amazon Web Services Region where you are signed in is used.
 */
export const listApprovalRuleTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateApprovalRuleTemplateDescription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApprovalRuleTemplateName =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApprovalRuleTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApprovalRuleTemplateInput,
    output: GetApprovalRuleTemplateOutput,
    errors: [
      ApprovalRuleTemplateDoesNotExistException,
      ApprovalRuleTemplateNameRequiredException,
      InvalidApprovalRuleTemplateNameException,
    ],
  }),
);
/**
 * Gets information about Amazon Web Servicestags for a specified Amazon Resource Name (ARN) in CodeCommit. For a list of valid resources in CodeCommit, see CodeCommit Resources and Operations in the CodeCommit User
 * Guide.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listRepositories = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Updates the content of an approval rule template. You can change the number of
 * required approvals, the membership of the approval rule, and whether an approval pool is
 * defined.
 */
export const updateApprovalRuleTemplateContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCommentContent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCommentContentInput,
    output: DeleteCommentContentOutput,
    errors: [
      CommentDeletedException,
      CommentDoesNotExistException,
      CommentIdRequiredException,
      InvalidCommentIdException,
    ],
  }),
);
/**
 * Renames a repository. The repository name must be unique across the calling Amazon Web Services account.
 * Repository names are limited to 100 alphanumeric, dash, and underscore
 * characters, and cannot include certain characters. The suffix .git is prohibited. For
 * more information about the limits on repository names, see Quotas in the CodeCommit
 * User Guide.
 */
export const updateRepositoryName = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateRepositoryNameInput,
    output: UpdateRepositoryNameResponse,
    errors: [
      InvalidRepositoryNameException,
      RepositoryDoesNotExistException,
      RepositoryNameExistsException,
      RepositoryNameRequiredException,
    ],
  }),
);
/**
 * Creates a template for approval rules that can then be associated with one or more
 * repositories in your Amazon Web Services account. When you associate a template with a repository,
 * CodeCommit creates an approval rule that matches the conditions of the template for all
 * pull requests that meet the conditions of the template. For more information, see
 * AssociateApprovalRuleTemplateWithRepository.
 */
export const createApprovalRuleTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all repositories associated with the specified approval rule template.
 */
export const listRepositoriesForApprovalRuleTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const disassociateApprovalRuleTemplateFromRepository =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRepositoryTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Lists all approval rule templates that are associated with a specified repository.
 */
export const listAssociatedApprovalRuleTemplatesForRepository =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBranches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns the content of a comment made on a change, file, or commit in a repository.
 *
 * Reaction counts might include numbers from user identities who were deleted after the reaction was made. For a count of
 * reactions from active identities, use GetCommentReactions.
 */
export const getComment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetCommits = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCommentReactions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const postCommentReply = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePullRequestDescription =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPullRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRepositoryEncryptionKey =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCommentsForComparedCommit =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateRepositoryDescription = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an association between an approval rule template and a specified repository.
 * Then, the next time a pull request is created in the repository where the destination
 * reference (if specified) matches the destination reference (branch) for the pull
 * request, an approval rule that matches the template conditions is automatically created
 * for that pull request. If no destination references are specified in the template, an
 * approval rule that matches the template contents is created for all pull requests in
 * that repository.
 */
export const associateApprovalRuleTemplateWithRepository =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listPullRequests = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Deletes an approval rule from a specified pull request. Approval rules can be deleted from a pull request only if the pull request is open, and if the
 * approval rule was created specifically for a pull request and not generated from an approval rule template associated with the repository where the
 * pull request was created. You cannot delete an approval rule from a merged or closed pull request.
 */
export const deletePullRequestApprovalRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDefaultBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCommit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePullRequestApprovalRuleContent =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePullRequestTitle = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Adds or updates a reaction to a specified comment for the user whose identity is used to make the request. You can only add or
 * update a reaction for yourself. You cannot add, modify, or delete a reaction for another user.
 */
export const putCommentReaction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPullRequestOverrideState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an association between an approval rule template and one or more specified repositories.
 */
export const batchAssociateApprovalRuleTemplateWithRepositories =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBlob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describePullRequestEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createPullRequestApprovalRule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCommentsForPullRequest =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listFileCommitHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getPullRequestApprovalStates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDisassociateApprovalRuleTemplateFromRepositories =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetRepositories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Merges two branches using the fast-forward merge strategy.
 */
export const mergeBranchesByFastForward = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns information about a specified merge commit.
 */
export const getMergeCommit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePullRequestStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns the contents of a specified folder in a repository.
 */
export const getFolder = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const evaluatePullRequestApprovalRules =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDifferences = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns the base-64 encoded contents of a specified file and its metadata.
 */
export const getFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const overridePullRequestApprovalRules =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePullRequestApprovalState =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const postCommentForComparedCommit =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const postCommentForPullRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Attempts to merge the source commit of a pull request into the specified destination
 * branch for that pull request at the specified commit using the fast-forward merge strategy. If the merge is successful, it closes the pull request.
 */
export const mergePullRequestByFastForward =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMergeOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDescribeMergeConflicts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns information about merge conflicts between the before and after commit IDs for a pull request in a repository.
 */
export const getMergeConflicts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns information about one or more merge conflicts in the attempted merge of two
 * commit specifiers using the squash or three-way merge strategy. If the merge option for
 * the attempted merge is specified as FAST_FORWARD_MERGE, an exception is thrown.
 */
export const describeMergeConflicts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putFile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const mergePullRequestByThreeWay = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a pull request in the specified repository.
 */
export const createPullRequest = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUnreferencedMergeCommit =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const mergeBranchesByThreeWay = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Attempts to merge the source commit of a pull request into the specified destination
 * branch for that pull request at the specified commit using the squash merge strategy. If the merge is successful, it closes the pull request.
 */
export const mergePullRequestBySquash = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Merges two branches using the squash merge strategy.
 */
export const mergeBranchesBySquash = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a commit for a repository on the tip of a specified branch.
 */
export const createCommit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putRepositoryTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Tests the functionality of repository triggers by sending information to the trigger
 * target. If real data is available in the repository, the test sends data from the last
 * commit. If no data is available, sample data is generated.
 */
export const testRepositoryTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
