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
const ns = T.XmlNamespace("http://codepipeline.amazonaws.com/doc/2015-07-09/");
const svc = T.AwsApiService({
  sdkId: "CodePipeline",
  serviceShapeName: "CodePipeline_20150709",
});
const auth = T.AwsAuthSigv4({ name: "codepipeline" });
const ver = T.ServiceVersion("2015-07-09");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://codepipeline-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://codepipeline-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://codepipeline.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://codepipeline.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type JobId = string;
export type Nonce = string;
export type ThirdPartyJobId = string;
export type ClientToken = string;
export type ActionProvider = string;
export type Version = string;
export type PipelineName = string;
export type WebhookName = string;
export type StageName = string;
export type DisabledReason = string;
export type ActionTypeOwner = string;
export type PipelineVersion = number;
export type PipelineExecutionId = string;
export type MaxResults = number;
export type NextToken = string;
export type AWSRegionName = string;
export type ActionExecutionId = string;
export type MaxPipelines = number;
export type ResourceArn = string;
export type MaxBatchSize = number;
export type ActionName = string;
export type ApprovalToken = string;
export type ContinuationToken = string;
export type ClientRequestToken = string;
export type StopPipelineExecutionReason = string;
export type TagKey = string;
export type Url = string;
export type UrlTemplate = string;
export type ActionConfigurationKey = string;
export type Description = string;
export type MinimumArtifactCount = number;
export type MaximumArtifactCount = number;
export type TagValue = string;
export type RoleArn = string;
export type TargetFilterValue = string;
export type ActionConfigurationQueryableValue = string;
export type Revision = string;
export type RevisionChangeIdentifier = string;
export type ApprovalSummary = string;
export type Message = string;
export type ExecutionId = string;
export type RevisionSummary = string;
export type ExecutionSummary = string;
export type Percentage = number;
export type OutputVariablesKey = string;
export type OutputVariablesValue = string;
export type PipelineVariableName = string;
export type PipelineVariableValue = string;
export type ActionTypeDescription = string;
export type ArtifactStoreLocation = string;
export type PipelineVariableDescription = string;
export type JsonPath = string;
export type MatchEquals = string;
export type WebhookAuthConfigurationAllowedIPRange = string;
export type WebhookAuthConfigurationSecretToken = string;
export type PolicyStatementsTemplate = string;
export type JobTimeout = number;
export type MinimumActionTypeArtifactCount = number;
export type MaximumActionTypeArtifactCount = number;
export type AllowedAccount = string;
export type PropertyDescription = string;
export type AccountId = string;
export type PipelineArn = string;
export type PipelineExecutionStatusSummary = string;
export type WebhookUrl = string;
export type WebhookErrorMessage = string;
export type WebhookErrorCode = string;
export type WebhookLastTriggered = Date;
export type WebhookArn = string;
export type ClientId = string;
export type EncryptionKeyId = string;
export type BlockerName = string;
export type ActionRunOrder = number;
export type Command = string;
export type OutputVariable = string;
export type ActionNamespace = string;
export type ActionTimeout = number;
export type ArtifactName = string;
export type TriggerDetail = string;
export type Enabled = boolean;
export type LastChangedBy = string;
export type LastChangedAt = Date;
export type RetryAttempt = number;
export type RuleProvider = string;
export type RuleConfigurationKey = string;
export type ActionConfigurationValue = string;
export type FilePath = string;
export type EnvironmentVariableName = string;
export type EnvironmentVariableValue = string;
export type LambdaFunctionArn = string;
export type ServicePrincipal = string;
export type RuleExecutionId = string;
export type RuleName = string;
export type LastUpdatedBy = string;
export type AccessKeyId = string | redacted.Redacted<string>;
export type SecretAccessKey = string | redacted.Redacted<string>;
export type SessionToken = string | redacted.Redacted<string>;
export type ActionExecutionToken = string;
export type LogStreamARN = string;
export type RuleTimeout = number;
export type GitTagNamePattern = string;
export type GitBranchNamePattern = string;
export type GitFilePathPattern = string;
export type Code = string;
export type RuleConfigurationValue = string;
export type ExternalExecutionId = string;
export type ExternalExecutionSummary = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type RuleExecutionToken = string;
export type S3Bucket = string;
export type S3Key = string;

//# Schemas
export type ActionCategory =
  | "Source"
  | "Build"
  | "Deploy"
  | "Test"
  | "Invoke"
  | "Approval"
  | "Compute";
export const ActionCategory = S.Literal(
  "Source",
  "Build",
  "Deploy",
  "Test",
  "Invoke",
  "Approval",
  "Compute",
);
export type StageTransitionType = "Inbound" | "Outbound";
export const StageTransitionType = S.Literal("Inbound", "Outbound");
export type ActionOwner = "AWS" | "ThirdParty" | "Custom";
export const ActionOwner = S.Literal("AWS", "ThirdParty", "Custom");
export type RuleOwner = "AWS";
export const RuleOwner = S.Literal("AWS");
export type ConditionType = "BEFORE_ENTRY" | "ON_SUCCESS";
export const ConditionType = S.Literal("BEFORE_ENTRY", "ON_SUCCESS");
export type StageRetryMode = "FAILED_ACTIONS" | "ALL_ACTIONS";
export const StageRetryMode = S.Literal("FAILED_ACTIONS", "ALL_ACTIONS");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface AcknowledgeJobInput {
  jobId: string;
  nonce: string;
}
export const AcknowledgeJobInput = S.suspend(() =>
  S.Struct({ jobId: S.String, nonce: S.String }).pipe(
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
  identifier: "AcknowledgeJobInput",
}) as any as S.Schema<AcknowledgeJobInput>;
export interface AcknowledgeThirdPartyJobInput {
  jobId: string;
  nonce: string;
  clientToken: string;
}
export const AcknowledgeThirdPartyJobInput = S.suspend(() =>
  S.Struct({ jobId: S.String, nonce: S.String, clientToken: S.String }).pipe(
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
  identifier: "AcknowledgeThirdPartyJobInput",
}) as any as S.Schema<AcknowledgeThirdPartyJobInput>;
export interface DeleteCustomActionTypeInput {
  category: ActionCategory;
  provider: string;
  version: string;
}
export const DeleteCustomActionTypeInput = S.suspend(() =>
  S.Struct({
    category: ActionCategory,
    provider: S.String,
    version: S.String,
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
  identifier: "DeleteCustomActionTypeInput",
}) as any as S.Schema<DeleteCustomActionTypeInput>;
export interface DeleteCustomActionTypeResponse {}
export const DeleteCustomActionTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCustomActionTypeResponse",
}) as any as S.Schema<DeleteCustomActionTypeResponse>;
export interface DeletePipelineInput {
  name: string;
}
export const DeletePipelineInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "DeletePipelineInput",
}) as any as S.Schema<DeletePipelineInput>;
export interface DeletePipelineResponse {}
export const DeletePipelineResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePipelineResponse",
}) as any as S.Schema<DeletePipelineResponse>;
export interface DeleteWebhookInput {
  name: string;
}
export const DeleteWebhookInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "DeleteWebhookInput",
}) as any as S.Schema<DeleteWebhookInput>;
export interface DeleteWebhookOutput {}
export const DeleteWebhookOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWebhookOutput",
}) as any as S.Schema<DeleteWebhookOutput>;
export interface DeregisterWebhookWithThirdPartyInput {
  webhookName?: string;
}
export const DeregisterWebhookWithThirdPartyInput = S.suspend(() =>
  S.Struct({ webhookName: S.optional(S.String) }).pipe(
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
  identifier: "DeregisterWebhookWithThirdPartyInput",
}) as any as S.Schema<DeregisterWebhookWithThirdPartyInput>;
export interface DeregisterWebhookWithThirdPartyOutput {}
export const DeregisterWebhookWithThirdPartyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterWebhookWithThirdPartyOutput",
}) as any as S.Schema<DeregisterWebhookWithThirdPartyOutput>;
export interface DisableStageTransitionInput {
  pipelineName: string;
  stageName: string;
  transitionType: StageTransitionType;
  reason: string;
}
export const DisableStageTransitionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    transitionType: StageTransitionType,
    reason: S.String,
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
  identifier: "DisableStageTransitionInput",
}) as any as S.Schema<DisableStageTransitionInput>;
export interface DisableStageTransitionResponse {}
export const DisableStageTransitionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableStageTransitionResponse",
}) as any as S.Schema<DisableStageTransitionResponse>;
export interface EnableStageTransitionInput {
  pipelineName: string;
  stageName: string;
  transitionType: StageTransitionType;
}
export const EnableStageTransitionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    transitionType: StageTransitionType,
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
  identifier: "EnableStageTransitionInput",
}) as any as S.Schema<EnableStageTransitionInput>;
export interface EnableStageTransitionResponse {}
export const EnableStageTransitionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableStageTransitionResponse",
}) as any as S.Schema<EnableStageTransitionResponse>;
export interface GetActionTypeInput {
  category: ActionCategory;
  owner: string;
  provider: string;
  version: string;
}
export const GetActionTypeInput = S.suspend(() =>
  S.Struct({
    category: ActionCategory,
    owner: S.String,
    provider: S.String,
    version: S.String,
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
  identifier: "GetActionTypeInput",
}) as any as S.Schema<GetActionTypeInput>;
export interface GetJobDetailsInput {
  jobId: string;
}
export const GetJobDetailsInput = S.suspend(() =>
  S.Struct({ jobId: S.String }).pipe(
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
  identifier: "GetJobDetailsInput",
}) as any as S.Schema<GetJobDetailsInput>;
export interface GetPipelineInput {
  name: string;
  version?: number;
}
export const GetPipelineInput = S.suspend(() =>
  S.Struct({ name: S.String, version: S.optional(S.Number) }).pipe(
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
  identifier: "GetPipelineInput",
}) as any as S.Schema<GetPipelineInput>;
export interface GetPipelineExecutionInput {
  pipelineName: string;
  pipelineExecutionId: string;
}
export const GetPipelineExecutionInput = S.suspend(() =>
  S.Struct({ pipelineName: S.String, pipelineExecutionId: S.String }).pipe(
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
  identifier: "GetPipelineExecutionInput",
}) as any as S.Schema<GetPipelineExecutionInput>;
export interface GetPipelineStateInput {
  name: string;
}
export const GetPipelineStateInput = S.suspend(() =>
  S.Struct({ name: S.String }).pipe(
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
  identifier: "GetPipelineStateInput",
}) as any as S.Schema<GetPipelineStateInput>;
export interface GetThirdPartyJobDetailsInput {
  jobId: string;
  clientToken: string;
}
export const GetThirdPartyJobDetailsInput = S.suspend(() =>
  S.Struct({ jobId: S.String, clientToken: S.String }).pipe(
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
  identifier: "GetThirdPartyJobDetailsInput",
}) as any as S.Schema<GetThirdPartyJobDetailsInput>;
export interface ListActionTypesInput {
  actionOwnerFilter?: ActionOwner;
  nextToken?: string;
  regionFilter?: string;
}
export const ListActionTypesInput = S.suspend(() =>
  S.Struct({
    actionOwnerFilter: S.optional(ActionOwner),
    nextToken: S.optional(S.String),
    regionFilter: S.optional(S.String),
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
  identifier: "ListActionTypesInput",
}) as any as S.Schema<ListActionTypesInput>;
export interface ListPipelinesInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListPipelinesInput = S.suspend(() =>
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
  identifier: "ListPipelinesInput",
}) as any as S.Schema<ListPipelinesInput>;
export interface ListRuleTypesInput {
  ruleOwnerFilter?: RuleOwner;
  regionFilter?: string;
}
export const ListRuleTypesInput = S.suspend(() =>
  S.Struct({
    ruleOwnerFilter: S.optional(RuleOwner),
    regionFilter: S.optional(S.String),
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
  identifier: "ListRuleTypesInput",
}) as any as S.Schema<ListRuleTypesInput>;
export interface ListTagsForResourceInput {
  resourceArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListWebhooksInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListWebhooksInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
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
  identifier: "ListWebhooksInput",
}) as any as S.Schema<ListWebhooksInput>;
export interface OverrideStageConditionInput {
  pipelineName: string;
  stageName: string;
  pipelineExecutionId: string;
  conditionType: ConditionType;
}
export const OverrideStageConditionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    pipelineExecutionId: S.String,
    conditionType: ConditionType,
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
  identifier: "OverrideStageConditionInput",
}) as any as S.Schema<OverrideStageConditionInput>;
export interface OverrideStageConditionResponse {}
export const OverrideStageConditionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "OverrideStageConditionResponse",
}) as any as S.Schema<OverrideStageConditionResponse>;
export interface ActionTypeId {
  category: ActionCategory;
  owner: ActionOwner;
  provider: string;
  version: string;
}
export const ActionTypeId = S.suspend(() =>
  S.Struct({
    category: ActionCategory,
    owner: ActionOwner,
    provider: S.String,
    version: S.String,
  }),
).annotations({ identifier: "ActionTypeId" }) as any as S.Schema<ActionTypeId>;
export interface PollForThirdPartyJobsInput {
  actionTypeId: ActionTypeId;
  maxBatchSize?: number;
}
export const PollForThirdPartyJobsInput = S.suspend(() =>
  S.Struct({
    actionTypeId: ActionTypeId,
    maxBatchSize: S.optional(S.Number),
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
  identifier: "PollForThirdPartyJobsInput",
}) as any as S.Schema<PollForThirdPartyJobsInput>;
export type FailureType =
  | "JobFailed"
  | "ConfigurationError"
  | "PermissionError"
  | "RevisionOutOfSync"
  | "RevisionUnavailable"
  | "SystemUnavailable";
export const FailureType = S.Literal(
  "JobFailed",
  "ConfigurationError",
  "PermissionError",
  "RevisionOutOfSync",
  "RevisionUnavailable",
  "SystemUnavailable",
);
export interface FailureDetails {
  type: FailureType;
  message: string;
  externalExecutionId?: string;
}
export const FailureDetails = S.suspend(() =>
  S.Struct({
    type: FailureType,
    message: S.String,
    externalExecutionId: S.optional(S.String),
  }),
).annotations({
  identifier: "FailureDetails",
}) as any as S.Schema<FailureDetails>;
export interface PutThirdPartyJobFailureResultInput {
  jobId: string;
  clientToken: string;
  failureDetails: FailureDetails;
}
export const PutThirdPartyJobFailureResultInput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    clientToken: S.String,
    failureDetails: FailureDetails,
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
  identifier: "PutThirdPartyJobFailureResultInput",
}) as any as S.Schema<PutThirdPartyJobFailureResultInput>;
export interface PutThirdPartyJobFailureResultResponse {}
export const PutThirdPartyJobFailureResultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutThirdPartyJobFailureResultResponse",
}) as any as S.Schema<PutThirdPartyJobFailureResultResponse>;
export interface CurrentRevision {
  revision: string;
  changeIdentifier: string;
  created?: Date;
  revisionSummary?: string;
}
export const CurrentRevision = S.suspend(() =>
  S.Struct({
    revision: S.String,
    changeIdentifier: S.String,
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    revisionSummary: S.optional(S.String),
  }),
).annotations({
  identifier: "CurrentRevision",
}) as any as S.Schema<CurrentRevision>;
export interface ExecutionDetails {
  summary?: string;
  externalExecutionId?: string;
  percentComplete?: number;
}
export const ExecutionDetails = S.suspend(() =>
  S.Struct({
    summary: S.optional(S.String),
    externalExecutionId: S.optional(S.String),
    percentComplete: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExecutionDetails",
}) as any as S.Schema<ExecutionDetails>;
export interface PutThirdPartyJobSuccessResultInput {
  jobId: string;
  clientToken: string;
  currentRevision?: CurrentRevision;
  continuationToken?: string;
  executionDetails?: ExecutionDetails;
}
export const PutThirdPartyJobSuccessResultInput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    clientToken: S.String,
    currentRevision: S.optional(CurrentRevision),
    continuationToken: S.optional(S.String),
    executionDetails: S.optional(ExecutionDetails),
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
  identifier: "PutThirdPartyJobSuccessResultInput",
}) as any as S.Schema<PutThirdPartyJobSuccessResultInput>;
export interface PutThirdPartyJobSuccessResultResponse {}
export const PutThirdPartyJobSuccessResultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutThirdPartyJobSuccessResultResponse",
}) as any as S.Schema<PutThirdPartyJobSuccessResultResponse>;
export interface RegisterWebhookWithThirdPartyInput {
  webhookName?: string;
}
export const RegisterWebhookWithThirdPartyInput = S.suspend(() =>
  S.Struct({ webhookName: S.optional(S.String) }).pipe(
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
  identifier: "RegisterWebhookWithThirdPartyInput",
}) as any as S.Schema<RegisterWebhookWithThirdPartyInput>;
export interface RegisterWebhookWithThirdPartyOutput {}
export const RegisterWebhookWithThirdPartyOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterWebhookWithThirdPartyOutput",
}) as any as S.Schema<RegisterWebhookWithThirdPartyOutput>;
export interface RetryStageExecutionInput {
  pipelineName: string;
  stageName: string;
  pipelineExecutionId: string;
  retryMode: StageRetryMode;
}
export const RetryStageExecutionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    pipelineExecutionId: S.String,
    retryMode: StageRetryMode,
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
  identifier: "RetryStageExecutionInput",
}) as any as S.Schema<RetryStageExecutionInput>;
export interface RollbackStageInput {
  pipelineName: string;
  stageName: string;
  targetPipelineExecutionId: string;
}
export const RollbackStageInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    targetPipelineExecutionId: S.String,
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
  identifier: "RollbackStageInput",
}) as any as S.Schema<RollbackStageInput>;
export interface StopPipelineExecutionInput {
  pipelineName: string;
  pipelineExecutionId: string;
  abandon?: boolean;
  reason?: string;
}
export const StopPipelineExecutionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    pipelineExecutionId: S.String,
    abandon: S.optional(S.Boolean),
    reason: S.optional(S.String),
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
  identifier: "StopPipelineExecutionInput",
}) as any as S.Schema<StopPipelineExecutionInput>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceInput {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: TagList }).pipe(
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
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeyList }).pipe(
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
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export type ArtifactStoreType = "S3";
export const ArtifactStoreType = S.Literal("S3");
export type EncryptionKeyType = "KMS";
export const EncryptionKeyType = S.Literal("KMS");
export interface EncryptionKey {
  id: string;
  type: EncryptionKeyType;
}
export const EncryptionKey = S.suspend(() =>
  S.Struct({ id: S.String, type: EncryptionKeyType }),
).annotations({
  identifier: "EncryptionKey",
}) as any as S.Schema<EncryptionKey>;
export interface ArtifactStore {
  type: ArtifactStoreType;
  location: string;
  encryptionKey?: EncryptionKey;
}
export const ArtifactStore = S.suspend(() =>
  S.Struct({
    type: ArtifactStoreType,
    location: S.String,
    encryptionKey: S.optional(EncryptionKey),
  }),
).annotations({
  identifier: "ArtifactStore",
}) as any as S.Schema<ArtifactStore>;
export type ArtifactStoreMap = { [key: string]: ArtifactStore };
export const ArtifactStoreMap = S.Record({
  key: S.String,
  value: ArtifactStore,
});
export type BlockerType = "Schedule";
export const BlockerType = S.Literal("Schedule");
export interface BlockerDeclaration {
  name: string;
  type: BlockerType;
}
export const BlockerDeclaration = S.suspend(() =>
  S.Struct({ name: S.String, type: BlockerType }),
).annotations({
  identifier: "BlockerDeclaration",
}) as any as S.Schema<BlockerDeclaration>;
export type StageBlockerDeclarationList = BlockerDeclaration[];
export const StageBlockerDeclarationList = S.Array(BlockerDeclaration);
export type ActionConfigurationMap = { [key: string]: string };
export const ActionConfigurationMap = S.Record({
  key: S.String,
  value: S.String,
});
export type CommandList = string[];
export const CommandList = S.Array(S.String);
export type FilePathList = string[];
export const FilePathList = S.Array(S.String);
export interface OutputArtifact {
  name: string;
  files?: string[];
}
export const OutputArtifact = S.suspend(() =>
  S.Struct({ name: S.String, files: S.optional(FilePathList) }),
).annotations({
  identifier: "OutputArtifact",
}) as any as S.Schema<OutputArtifact>;
export type OutputArtifactList = OutputArtifact[];
export const OutputArtifactList = S.Array(OutputArtifact);
export interface InputArtifact {
  name: string;
}
export const InputArtifact = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "InputArtifact",
}) as any as S.Schema<InputArtifact>;
export type InputArtifactList = InputArtifact[];
export const InputArtifactList = S.Array(InputArtifact);
export type OutputVariableList = string[];
export const OutputVariableList = S.Array(S.String);
export type EnvironmentVariableType = "PLAINTEXT" | "SECRETS_MANAGER";
export const EnvironmentVariableType = S.Literal(
  "PLAINTEXT",
  "SECRETS_MANAGER",
);
export interface EnvironmentVariable {
  name: string;
  value: string;
  type?: EnvironmentVariableType;
}
export const EnvironmentVariable = S.suspend(() =>
  S.Struct({
    name: S.String,
    value: S.String,
    type: S.optional(EnvironmentVariableType),
  }),
).annotations({
  identifier: "EnvironmentVariable",
}) as any as S.Schema<EnvironmentVariable>;
export type EnvironmentVariableList = EnvironmentVariable[];
export const EnvironmentVariableList = S.Array(EnvironmentVariable);
export interface ActionDeclaration {
  name: string;
  actionTypeId: ActionTypeId;
  runOrder?: number;
  configuration?: { [key: string]: string };
  commands?: string[];
  outputArtifacts?: OutputArtifact[];
  inputArtifacts?: InputArtifact[];
  outputVariables?: string[];
  roleArn?: string;
  region?: string;
  namespace?: string;
  timeoutInMinutes?: number;
  environmentVariables?: EnvironmentVariable[];
}
export const ActionDeclaration = S.suspend(() =>
  S.Struct({
    name: S.String,
    actionTypeId: ActionTypeId,
    runOrder: S.optional(S.Number),
    configuration: S.optional(ActionConfigurationMap),
    commands: S.optional(CommandList),
    outputArtifacts: S.optional(OutputArtifactList),
    inputArtifacts: S.optional(InputArtifactList),
    outputVariables: S.optional(OutputVariableList),
    roleArn: S.optional(S.String),
    region: S.optional(S.String),
    namespace: S.optional(S.String),
    timeoutInMinutes: S.optional(S.Number),
    environmentVariables: S.optional(EnvironmentVariableList),
  }),
).annotations({
  identifier: "ActionDeclaration",
}) as any as S.Schema<ActionDeclaration>;
export type StageActionDeclarationList = ActionDeclaration[];
export const StageActionDeclarationList = S.Array(ActionDeclaration);
export type Result = "ROLLBACK" | "FAIL" | "RETRY" | "SKIP";
export const Result = S.Literal("ROLLBACK", "FAIL", "RETRY", "SKIP");
export interface RetryConfiguration {
  retryMode?: StageRetryMode;
}
export const RetryConfiguration = S.suspend(() =>
  S.Struct({ retryMode: S.optional(StageRetryMode) }),
).annotations({
  identifier: "RetryConfiguration",
}) as any as S.Schema<RetryConfiguration>;
export type RuleCategory = "Rule";
export const RuleCategory = S.Literal("Rule");
export interface RuleTypeId {
  category: RuleCategory;
  owner?: RuleOwner;
  provider: string;
  version?: string;
}
export const RuleTypeId = S.suspend(() =>
  S.Struct({
    category: RuleCategory,
    owner: S.optional(RuleOwner),
    provider: S.String,
    version: S.optional(S.String),
  }),
).annotations({ identifier: "RuleTypeId" }) as any as S.Schema<RuleTypeId>;
export type RuleConfigurationMap = { [key: string]: string };
export const RuleConfigurationMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface RuleDeclaration {
  name: string;
  ruleTypeId: RuleTypeId;
  configuration?: { [key: string]: string };
  commands?: string[];
  inputArtifacts?: InputArtifact[];
  roleArn?: string;
  region?: string;
  timeoutInMinutes?: number;
}
export const RuleDeclaration = S.suspend(() =>
  S.Struct({
    name: S.String,
    ruleTypeId: RuleTypeId,
    configuration: S.optional(RuleConfigurationMap),
    commands: S.optional(CommandList),
    inputArtifacts: S.optional(InputArtifactList),
    roleArn: S.optional(S.String),
    region: S.optional(S.String),
    timeoutInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "RuleDeclaration",
}) as any as S.Schema<RuleDeclaration>;
export type RuleDeclarationList = RuleDeclaration[];
export const RuleDeclarationList = S.Array(RuleDeclaration);
export interface Condition {
  result?: Result;
  rules?: RuleDeclaration[];
}
export const Condition = S.suspend(() =>
  S.Struct({
    result: S.optional(Result),
    rules: S.optional(RuleDeclarationList),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type ConditionList = Condition[];
export const ConditionList = S.Array(Condition);
export interface FailureConditions {
  result?: Result;
  retryConfiguration?: RetryConfiguration;
  conditions?: Condition[];
}
export const FailureConditions = S.suspend(() =>
  S.Struct({
    result: S.optional(Result),
    retryConfiguration: S.optional(RetryConfiguration),
    conditions: S.optional(ConditionList),
  }),
).annotations({
  identifier: "FailureConditions",
}) as any as S.Schema<FailureConditions>;
export interface SuccessConditions {
  conditions: Condition[];
}
export const SuccessConditions = S.suspend(() =>
  S.Struct({ conditions: ConditionList }),
).annotations({
  identifier: "SuccessConditions",
}) as any as S.Schema<SuccessConditions>;
export interface BeforeEntryConditions {
  conditions: Condition[];
}
export const BeforeEntryConditions = S.suspend(() =>
  S.Struct({ conditions: ConditionList }),
).annotations({
  identifier: "BeforeEntryConditions",
}) as any as S.Schema<BeforeEntryConditions>;
export interface StageDeclaration {
  name: string;
  blockers?: BlockerDeclaration[];
  actions: ActionDeclaration[];
  onFailure?: FailureConditions;
  onSuccess?: SuccessConditions;
  beforeEntry?: BeforeEntryConditions;
}
export const StageDeclaration = S.suspend(() =>
  S.Struct({
    name: S.String,
    blockers: S.optional(StageBlockerDeclarationList),
    actions: StageActionDeclarationList,
    onFailure: S.optional(FailureConditions),
    onSuccess: S.optional(SuccessConditions),
    beforeEntry: S.optional(BeforeEntryConditions),
  }),
).annotations({
  identifier: "StageDeclaration",
}) as any as S.Schema<StageDeclaration>;
export type PipelineStageDeclarationList = StageDeclaration[];
export const PipelineStageDeclarationList = S.Array(StageDeclaration);
export type ExecutionMode = "QUEUED" | "SUPERSEDED" | "PARALLEL";
export const ExecutionMode = S.Literal("QUEUED", "SUPERSEDED", "PARALLEL");
export type PipelineType = "V1" | "V2";
export const PipelineType = S.Literal("V1", "V2");
export interface PipelineVariableDeclaration {
  name: string;
  defaultValue?: string;
  description?: string;
}
export const PipelineVariableDeclaration = S.suspend(() =>
  S.Struct({
    name: S.String,
    defaultValue: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineVariableDeclaration",
}) as any as S.Schema<PipelineVariableDeclaration>;
export type PipelineVariableDeclarationList = PipelineVariableDeclaration[];
export const PipelineVariableDeclarationList = S.Array(
  PipelineVariableDeclaration,
);
export type PipelineTriggerProviderType = "CodeStarSourceConnection";
export const PipelineTriggerProviderType = S.Literal(
  "CodeStarSourceConnection",
);
export type GitTagPatternList = string[];
export const GitTagPatternList = S.Array(S.String);
export interface GitTagFilterCriteria {
  includes?: string[];
  excludes?: string[];
}
export const GitTagFilterCriteria = S.suspend(() =>
  S.Struct({
    includes: S.optional(GitTagPatternList),
    excludes: S.optional(GitTagPatternList),
  }),
).annotations({
  identifier: "GitTagFilterCriteria",
}) as any as S.Schema<GitTagFilterCriteria>;
export type GitBranchPatternList = string[];
export const GitBranchPatternList = S.Array(S.String);
export interface GitBranchFilterCriteria {
  includes?: string[];
  excludes?: string[];
}
export const GitBranchFilterCriteria = S.suspend(() =>
  S.Struct({
    includes: S.optional(GitBranchPatternList),
    excludes: S.optional(GitBranchPatternList),
  }),
).annotations({
  identifier: "GitBranchFilterCriteria",
}) as any as S.Schema<GitBranchFilterCriteria>;
export type GitFilePathPatternList = string[];
export const GitFilePathPatternList = S.Array(S.String);
export interface GitFilePathFilterCriteria {
  includes?: string[];
  excludes?: string[];
}
export const GitFilePathFilterCriteria = S.suspend(() =>
  S.Struct({
    includes: S.optional(GitFilePathPatternList),
    excludes: S.optional(GitFilePathPatternList),
  }),
).annotations({
  identifier: "GitFilePathFilterCriteria",
}) as any as S.Schema<GitFilePathFilterCriteria>;
export interface GitPushFilter {
  tags?: GitTagFilterCriteria;
  branches?: GitBranchFilterCriteria;
  filePaths?: GitFilePathFilterCriteria;
}
export const GitPushFilter = S.suspend(() =>
  S.Struct({
    tags: S.optional(GitTagFilterCriteria),
    branches: S.optional(GitBranchFilterCriteria),
    filePaths: S.optional(GitFilePathFilterCriteria),
  }),
).annotations({
  identifier: "GitPushFilter",
}) as any as S.Schema<GitPushFilter>;
export type GitPushFilterList = GitPushFilter[];
export const GitPushFilterList = S.Array(GitPushFilter);
export type GitPullRequestEventType = "OPEN" | "UPDATED" | "CLOSED";
export const GitPullRequestEventType = S.Literal("OPEN", "UPDATED", "CLOSED");
export type GitPullRequestEventTypeList = GitPullRequestEventType[];
export const GitPullRequestEventTypeList = S.Array(GitPullRequestEventType);
export interface GitPullRequestFilter {
  events?: GitPullRequestEventType[];
  branches?: GitBranchFilterCriteria;
  filePaths?: GitFilePathFilterCriteria;
}
export const GitPullRequestFilter = S.suspend(() =>
  S.Struct({
    events: S.optional(GitPullRequestEventTypeList),
    branches: S.optional(GitBranchFilterCriteria),
    filePaths: S.optional(GitFilePathFilterCriteria),
  }),
).annotations({
  identifier: "GitPullRequestFilter",
}) as any as S.Schema<GitPullRequestFilter>;
export type GitPullRequestFilterList = GitPullRequestFilter[];
export const GitPullRequestFilterList = S.Array(GitPullRequestFilter);
export interface GitConfiguration {
  sourceActionName: string;
  push?: GitPushFilter[];
  pullRequest?: GitPullRequestFilter[];
}
export const GitConfiguration = S.suspend(() =>
  S.Struct({
    sourceActionName: S.String,
    push: S.optional(GitPushFilterList),
    pullRequest: S.optional(GitPullRequestFilterList),
  }),
).annotations({
  identifier: "GitConfiguration",
}) as any as S.Schema<GitConfiguration>;
export interface PipelineTriggerDeclaration {
  providerType: PipelineTriggerProviderType;
  gitConfiguration: GitConfiguration;
}
export const PipelineTriggerDeclaration = S.suspend(() =>
  S.Struct({
    providerType: PipelineTriggerProviderType,
    gitConfiguration: GitConfiguration,
  }),
).annotations({
  identifier: "PipelineTriggerDeclaration",
}) as any as S.Schema<PipelineTriggerDeclaration>;
export type PipelineTriggerDeclarationList = PipelineTriggerDeclaration[];
export const PipelineTriggerDeclarationList = S.Array(
  PipelineTriggerDeclaration,
);
export interface PipelineDeclaration {
  name: string;
  roleArn: string;
  artifactStore?: ArtifactStore;
  artifactStores?: { [key: string]: ArtifactStore };
  stages: StageDeclaration[];
  version?: number;
  executionMode?: ExecutionMode;
  pipelineType?: PipelineType;
  variables?: PipelineVariableDeclaration[];
  triggers?: PipelineTriggerDeclaration[];
}
export const PipelineDeclaration = S.suspend(() =>
  S.Struct({
    name: S.String,
    roleArn: S.String,
    artifactStore: S.optional(ArtifactStore),
    artifactStores: S.optional(ArtifactStoreMap),
    stages: PipelineStageDeclarationList,
    version: S.optional(S.Number),
    executionMode: S.optional(ExecutionMode),
    pipelineType: S.optional(PipelineType),
    variables: S.optional(PipelineVariableDeclarationList),
    triggers: S.optional(PipelineTriggerDeclarationList),
  }),
).annotations({
  identifier: "PipelineDeclaration",
}) as any as S.Schema<PipelineDeclaration>;
export interface UpdatePipelineInput {
  pipeline: PipelineDeclaration;
}
export const UpdatePipelineInput = S.suspend(() =>
  S.Struct({ pipeline: PipelineDeclaration }).pipe(
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
  identifier: "UpdatePipelineInput",
}) as any as S.Schema<UpdatePipelineInput>;
export type ActionConfigurationPropertyType = "String" | "Number" | "Boolean";
export const ActionConfigurationPropertyType = S.Literal(
  "String",
  "Number",
  "Boolean",
);
export type TargetFilterName = "TARGET_STATUS";
export const TargetFilterName = S.Literal("TARGET_STATUS");
export type TargetFilterValueList = string[];
export const TargetFilterValueList = S.Array(S.String);
export type ApprovalStatus = "Approved" | "Rejected";
export const ApprovalStatus = S.Literal("Approved", "Rejected");
export type WebhookAuthenticationType =
  | "GITHUB_HMAC"
  | "IP"
  | "UNAUTHENTICATED";
export const WebhookAuthenticationType = S.Literal(
  "GITHUB_HMAC",
  "IP",
  "UNAUTHENTICATED",
);
export type SourceRevisionType =
  | "COMMIT_ID"
  | "IMAGE_DIGEST"
  | "S3_OBJECT_VERSION_ID"
  | "S3_OBJECT_KEY";
export const SourceRevisionType = S.Literal(
  "COMMIT_ID",
  "IMAGE_DIGEST",
  "S3_OBJECT_VERSION_ID",
  "S3_OBJECT_KEY",
);
export type JobStatus =
  | "Created"
  | "Queued"
  | "Dispatched"
  | "InProgress"
  | "TimedOut"
  | "Succeeded"
  | "Failed";
export const JobStatus = S.Literal(
  "Created",
  "Queued",
  "Dispatched",
  "InProgress",
  "TimedOut",
  "Succeeded",
  "Failed",
);
export interface ActionTypeSettings {
  thirdPartyConfigurationUrl?: string;
  entityUrlTemplate?: string;
  executionUrlTemplate?: string;
  revisionUrlTemplate?: string;
}
export const ActionTypeSettings = S.suspend(() =>
  S.Struct({
    thirdPartyConfigurationUrl: S.optional(S.String),
    entityUrlTemplate: S.optional(S.String),
    executionUrlTemplate: S.optional(S.String),
    revisionUrlTemplate: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionTypeSettings",
}) as any as S.Schema<ActionTypeSettings>;
export interface ActionConfigurationProperty {
  name: string;
  required: boolean;
  key: boolean;
  secret: boolean;
  queryable?: boolean;
  description?: string;
  type?: ActionConfigurationPropertyType;
}
export const ActionConfigurationProperty = S.suspend(() =>
  S.Struct({
    name: S.String,
    required: S.Boolean,
    key: S.Boolean,
    secret: S.Boolean,
    queryable: S.optional(S.Boolean),
    description: S.optional(S.String),
    type: S.optional(ActionConfigurationPropertyType),
  }),
).annotations({
  identifier: "ActionConfigurationProperty",
}) as any as S.Schema<ActionConfigurationProperty>;
export type ActionConfigurationPropertyList = ActionConfigurationProperty[];
export const ActionConfigurationPropertyList = S.Array(
  ActionConfigurationProperty,
);
export interface ArtifactDetails {
  minimumCount: number;
  maximumCount: number;
}
export const ArtifactDetails = S.suspend(() =>
  S.Struct({ minimumCount: S.Number, maximumCount: S.Number }),
).annotations({
  identifier: "ArtifactDetails",
}) as any as S.Schema<ArtifactDetails>;
export interface TargetFilter {
  name?: TargetFilterName;
  values?: string[];
}
export const TargetFilter = S.suspend(() =>
  S.Struct({
    name: S.optional(TargetFilterName),
    values: S.optional(TargetFilterValueList),
  }),
).annotations({ identifier: "TargetFilter" }) as any as S.Schema<TargetFilter>;
export type TargetFilterList = TargetFilter[];
export const TargetFilterList = S.Array(TargetFilter);
export type StartTimeRange = "Latest" | "All";
export const StartTimeRange = S.Literal("Latest", "All");
export interface LatestInPipelineExecutionFilter {
  pipelineExecutionId: string;
  startTimeRange: StartTimeRange;
}
export const LatestInPipelineExecutionFilter = S.suspend(() =>
  S.Struct({ pipelineExecutionId: S.String, startTimeRange: StartTimeRange }),
).annotations({
  identifier: "LatestInPipelineExecutionFilter",
}) as any as S.Schema<LatestInPipelineExecutionFilter>;
export interface RuleExecutionFilter {
  pipelineExecutionId?: string;
  latestInPipelineExecution?: LatestInPipelineExecutionFilter;
}
export const RuleExecutionFilter = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.optional(S.String),
    latestInPipelineExecution: S.optional(LatestInPipelineExecutionFilter),
  }),
).annotations({
  identifier: "RuleExecutionFilter",
}) as any as S.Schema<RuleExecutionFilter>;
export type QueryParamMap = { [key: string]: string };
export const QueryParamMap = S.Record({ key: S.String, value: S.String });
export interface ActionRevision {
  revisionId: string;
  revisionChangeId: string;
  created: Date;
}
export const ActionRevision = S.suspend(() =>
  S.Struct({
    revisionId: S.String,
    revisionChangeId: S.String,
    created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ActionRevision",
}) as any as S.Schema<ActionRevision>;
export interface ApprovalResult {
  summary: string;
  status: ApprovalStatus;
}
export const ApprovalResult = S.suspend(() =>
  S.Struct({ summary: S.String, status: ApprovalStatus }),
).annotations({
  identifier: "ApprovalResult",
}) as any as S.Schema<ApprovalResult>;
export type OutputVariablesMap = { [key: string]: string };
export const OutputVariablesMap = S.Record({ key: S.String, value: S.String });
export interface PipelineVariable {
  name: string;
  value: string;
}
export const PipelineVariable = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({
  identifier: "PipelineVariable",
}) as any as S.Schema<PipelineVariable>;
export type PipelineVariableList = PipelineVariable[];
export const PipelineVariableList = S.Array(PipelineVariable);
export interface SourceRevisionOverride {
  actionName: string;
  revisionType: SourceRevisionType;
  revisionValue: string;
}
export const SourceRevisionOverride = S.suspend(() =>
  S.Struct({
    actionName: S.String,
    revisionType: SourceRevisionType,
    revisionValue: S.String,
  }),
).annotations({
  identifier: "SourceRevisionOverride",
}) as any as S.Schema<SourceRevisionOverride>;
export type SourceRevisionOverrideList = SourceRevisionOverride[];
export const SourceRevisionOverrideList = S.Array(SourceRevisionOverride);
export type ExecutorType = "JobWorker" | "Lambda";
export const ExecutorType = S.Literal("JobWorker", "Lambda");
export type AllowedAccounts = string[];
export const AllowedAccounts = S.Array(S.String);
export interface AcknowledgeJobOutput {
  status?: JobStatus;
}
export const AcknowledgeJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(JobStatus) }).pipe(ns),
).annotations({
  identifier: "AcknowledgeJobOutput",
}) as any as S.Schema<AcknowledgeJobOutput>;
export interface AcknowledgeThirdPartyJobOutput {
  status?: JobStatus;
}
export const AcknowledgeThirdPartyJobOutput = S.suspend(() =>
  S.Struct({ status: S.optional(JobStatus) }).pipe(ns),
).annotations({
  identifier: "AcknowledgeThirdPartyJobOutput",
}) as any as S.Schema<AcknowledgeThirdPartyJobOutput>;
export interface CreateCustomActionTypeInput {
  category: ActionCategory;
  provider: string;
  version: string;
  settings?: ActionTypeSettings;
  configurationProperties?: ActionConfigurationProperty[];
  inputArtifactDetails: ArtifactDetails;
  outputArtifactDetails: ArtifactDetails;
  tags?: Tag[];
}
export const CreateCustomActionTypeInput = S.suspend(() =>
  S.Struct({
    category: ActionCategory,
    provider: S.String,
    version: S.String,
    settings: S.optional(ActionTypeSettings),
    configurationProperties: S.optional(ActionConfigurationPropertyList),
    inputArtifactDetails: ArtifactDetails,
    outputArtifactDetails: ArtifactDetails,
    tags: S.optional(TagList),
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
  identifier: "CreateCustomActionTypeInput",
}) as any as S.Schema<CreateCustomActionTypeInput>;
export interface LambdaExecutorConfiguration {
  lambdaFunctionArn: string;
}
export const LambdaExecutorConfiguration = S.suspend(() =>
  S.Struct({ lambdaFunctionArn: S.String }),
).annotations({
  identifier: "LambdaExecutorConfiguration",
}) as any as S.Schema<LambdaExecutorConfiguration>;
export type PollingAccountList = string[];
export const PollingAccountList = S.Array(S.String);
export type PollingServicePrincipalList = string[];
export const PollingServicePrincipalList = S.Array(S.String);
export interface JobWorkerExecutorConfiguration {
  pollingAccounts?: string[];
  pollingServicePrincipals?: string[];
}
export const JobWorkerExecutorConfiguration = S.suspend(() =>
  S.Struct({
    pollingAccounts: S.optional(PollingAccountList),
    pollingServicePrincipals: S.optional(PollingServicePrincipalList),
  }),
).annotations({
  identifier: "JobWorkerExecutorConfiguration",
}) as any as S.Schema<JobWorkerExecutorConfiguration>;
export interface ExecutorConfiguration {
  lambdaExecutorConfiguration?: LambdaExecutorConfiguration;
  jobWorkerExecutorConfiguration?: JobWorkerExecutorConfiguration;
}
export const ExecutorConfiguration = S.suspend(() =>
  S.Struct({
    lambdaExecutorConfiguration: S.optional(LambdaExecutorConfiguration),
    jobWorkerExecutorConfiguration: S.optional(JobWorkerExecutorConfiguration),
  }),
).annotations({
  identifier: "ExecutorConfiguration",
}) as any as S.Schema<ExecutorConfiguration>;
export interface ActionTypeExecutor {
  configuration: ExecutorConfiguration;
  type: ExecutorType;
  policyStatementsTemplate?: string;
  jobTimeout?: number;
}
export const ActionTypeExecutor = S.suspend(() =>
  S.Struct({
    configuration: ExecutorConfiguration,
    type: ExecutorType,
    policyStatementsTemplate: S.optional(S.String),
    jobTimeout: S.optional(S.Number),
  }),
).annotations({
  identifier: "ActionTypeExecutor",
}) as any as S.Schema<ActionTypeExecutor>;
export interface ActionTypeIdentifier {
  category: ActionCategory;
  owner: string;
  provider: string;
  version: string;
}
export const ActionTypeIdentifier = S.suspend(() =>
  S.Struct({
    category: ActionCategory,
    owner: S.String,
    provider: S.String,
    version: S.String,
  }),
).annotations({
  identifier: "ActionTypeIdentifier",
}) as any as S.Schema<ActionTypeIdentifier>;
export interface ActionTypeArtifactDetails {
  minimumCount: number;
  maximumCount: number;
}
export const ActionTypeArtifactDetails = S.suspend(() =>
  S.Struct({ minimumCount: S.Number, maximumCount: S.Number }),
).annotations({
  identifier: "ActionTypeArtifactDetails",
}) as any as S.Schema<ActionTypeArtifactDetails>;
export interface ActionTypePermissions {
  allowedAccounts: string[];
}
export const ActionTypePermissions = S.suspend(() =>
  S.Struct({ allowedAccounts: AllowedAccounts }),
).annotations({
  identifier: "ActionTypePermissions",
}) as any as S.Schema<ActionTypePermissions>;
export interface ActionTypeProperty {
  name: string;
  optional: boolean;
  key: boolean;
  noEcho: boolean;
  queryable?: boolean;
  description?: string;
}
export const ActionTypeProperty = S.suspend(() =>
  S.Struct({
    name: S.String,
    optional: S.Boolean,
    key: S.Boolean,
    noEcho: S.Boolean,
    queryable: S.optional(S.Boolean),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionTypeProperty",
}) as any as S.Schema<ActionTypeProperty>;
export type ActionTypeProperties = ActionTypeProperty[];
export const ActionTypeProperties = S.Array(ActionTypeProperty);
export interface ActionTypeUrls {
  configurationUrl?: string;
  entityUrlTemplate?: string;
  executionUrlTemplate?: string;
  revisionUrlTemplate?: string;
}
export const ActionTypeUrls = S.suspend(() =>
  S.Struct({
    configurationUrl: S.optional(S.String),
    entityUrlTemplate: S.optional(S.String),
    executionUrlTemplate: S.optional(S.String),
    revisionUrlTemplate: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionTypeUrls",
}) as any as S.Schema<ActionTypeUrls>;
export interface ActionTypeDeclaration {
  description?: string;
  executor: ActionTypeExecutor;
  id: ActionTypeIdentifier;
  inputArtifactDetails: ActionTypeArtifactDetails;
  outputArtifactDetails: ActionTypeArtifactDetails;
  permissions?: ActionTypePermissions;
  properties?: ActionTypeProperty[];
  urls?: ActionTypeUrls;
}
export const ActionTypeDeclaration = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    executor: ActionTypeExecutor,
    id: ActionTypeIdentifier,
    inputArtifactDetails: ActionTypeArtifactDetails,
    outputArtifactDetails: ActionTypeArtifactDetails,
    permissions: S.optional(ActionTypePermissions),
    properties: S.optional(ActionTypeProperties),
    urls: S.optional(ActionTypeUrls),
  }),
).annotations({
  identifier: "ActionTypeDeclaration",
}) as any as S.Schema<ActionTypeDeclaration>;
export interface GetActionTypeOutput {
  actionType?: ActionTypeDeclaration;
}
export const GetActionTypeOutput = S.suspend(() =>
  S.Struct({ actionType: S.optional(ActionTypeDeclaration) }).pipe(ns),
).annotations({
  identifier: "GetActionTypeOutput",
}) as any as S.Schema<GetActionTypeOutput>;
export interface ListDeployActionExecutionTargetsInput {
  pipelineName?: string;
  actionExecutionId: string;
  filters?: TargetFilter[];
  maxResults?: number;
  nextToken?: string;
}
export const ListDeployActionExecutionTargetsInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    actionExecutionId: S.String,
    filters: S.optional(TargetFilterList),
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
  identifier: "ListDeployActionExecutionTargetsInput",
}) as any as S.Schema<ListDeployActionExecutionTargetsInput>;
export interface ListRuleExecutionsInput {
  pipelineName: string;
  filter?: RuleExecutionFilter;
  maxResults?: number;
  nextToken?: string;
}
export const ListRuleExecutionsInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    filter: S.optional(RuleExecutionFilter),
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
  identifier: "ListRuleExecutionsInput",
}) as any as S.Schema<ListRuleExecutionsInput>;
export interface ListTagsForResourceOutput {
  tags?: Tag[];
  nextToken?: string;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PollForJobsInput {
  actionTypeId: ActionTypeId;
  maxBatchSize?: number;
  queryParam?: { [key: string]: string };
}
export const PollForJobsInput = S.suspend(() =>
  S.Struct({
    actionTypeId: ActionTypeId,
    maxBatchSize: S.optional(S.Number),
    queryParam: S.optional(QueryParamMap),
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
  identifier: "PollForJobsInput",
}) as any as S.Schema<PollForJobsInput>;
export interface PutActionRevisionInput {
  pipelineName: string;
  stageName: string;
  actionName: string;
  actionRevision: ActionRevision;
}
export const PutActionRevisionInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    actionName: S.String,
    actionRevision: ActionRevision,
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
  identifier: "PutActionRevisionInput",
}) as any as S.Schema<PutActionRevisionInput>;
export interface PutApprovalResultInput {
  pipelineName: string;
  stageName: string;
  actionName: string;
  result: ApprovalResult;
  token: string;
}
export const PutApprovalResultInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    stageName: S.String,
    actionName: S.String,
    result: ApprovalResult,
    token: S.String,
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
  identifier: "PutApprovalResultInput",
}) as any as S.Schema<PutApprovalResultInput>;
export interface PutJobFailureResultInput {
  jobId: string;
  failureDetails: FailureDetails;
}
export const PutJobFailureResultInput = S.suspend(() =>
  S.Struct({ jobId: S.String, failureDetails: FailureDetails }).pipe(
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
  identifier: "PutJobFailureResultInput",
}) as any as S.Schema<PutJobFailureResultInput>;
export interface PutJobFailureResultResponse {}
export const PutJobFailureResultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutJobFailureResultResponse",
}) as any as S.Schema<PutJobFailureResultResponse>;
export interface PutJobSuccessResultInput {
  jobId: string;
  currentRevision?: CurrentRevision;
  continuationToken?: string;
  executionDetails?: ExecutionDetails;
  outputVariables?: { [key: string]: string };
}
export const PutJobSuccessResultInput = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    currentRevision: S.optional(CurrentRevision),
    continuationToken: S.optional(S.String),
    executionDetails: S.optional(ExecutionDetails),
    outputVariables: S.optional(OutputVariablesMap),
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
  identifier: "PutJobSuccessResultInput",
}) as any as S.Schema<PutJobSuccessResultInput>;
export interface PutJobSuccessResultResponse {}
export const PutJobSuccessResultResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutJobSuccessResultResponse",
}) as any as S.Schema<PutJobSuccessResultResponse>;
export interface RetryStageExecutionOutput {
  pipelineExecutionId?: string;
}
export const RetryStageExecutionOutput = S.suspend(() =>
  S.Struct({ pipelineExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RetryStageExecutionOutput",
}) as any as S.Schema<RetryStageExecutionOutput>;
export interface RollbackStageOutput {
  pipelineExecutionId: string;
}
export const RollbackStageOutput = S.suspend(() =>
  S.Struct({ pipelineExecutionId: S.String }).pipe(ns),
).annotations({
  identifier: "RollbackStageOutput",
}) as any as S.Schema<RollbackStageOutput>;
export interface StartPipelineExecutionInput {
  name: string;
  variables?: PipelineVariable[];
  clientRequestToken?: string;
  sourceRevisions?: SourceRevisionOverride[];
}
export const StartPipelineExecutionInput = S.suspend(() =>
  S.Struct({
    name: S.String,
    variables: S.optional(PipelineVariableList),
    clientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    sourceRevisions: S.optional(SourceRevisionOverrideList),
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
  identifier: "StartPipelineExecutionInput",
}) as any as S.Schema<StartPipelineExecutionInput>;
export interface StopPipelineExecutionOutput {
  pipelineExecutionId?: string;
}
export const StopPipelineExecutionOutput = S.suspend(() =>
  S.Struct({ pipelineExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StopPipelineExecutionOutput",
}) as any as S.Schema<StopPipelineExecutionOutput>;
export interface UpdatePipelineOutput {
  pipeline?: PipelineDeclaration;
}
export const UpdatePipelineOutput = S.suspend(() =>
  S.Struct({ pipeline: S.optional(PipelineDeclaration) }).pipe(ns),
).annotations({
  identifier: "UpdatePipelineOutput",
}) as any as S.Schema<UpdatePipelineOutput>;
export type PipelineExecutionStatus =
  | "Cancelled"
  | "InProgress"
  | "Stopped"
  | "Stopping"
  | "Succeeded"
  | "Superseded"
  | "Failed";
export const PipelineExecutionStatus = S.Literal(
  "Cancelled",
  "InProgress",
  "Stopped",
  "Stopping",
  "Succeeded",
  "Superseded",
  "Failed",
);
export type ExecutionType = "STANDARD" | "ROLLBACK";
export const ExecutionType = S.Literal("STANDARD", "ROLLBACK");
export type StageExecutionStatus =
  | "Cancelled"
  | "InProgress"
  | "Failed"
  | "Stopped"
  | "Stopping"
  | "Succeeded"
  | "Skipped";
export const StageExecutionStatus = S.Literal(
  "Cancelled",
  "InProgress",
  "Failed",
  "Stopped",
  "Stopping",
  "Succeeded",
  "Skipped",
);
export interface StageExecution {
  pipelineExecutionId: string;
  status: StageExecutionStatus;
  type?: ExecutionType;
}
export const StageExecution = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.String,
    status: StageExecutionStatus,
    type: S.optional(ExecutionType),
  }),
).annotations({
  identifier: "StageExecution",
}) as any as S.Schema<StageExecution>;
export type StageExecutionList = StageExecution[];
export const StageExecutionList = S.Array(StageExecution);
export interface SucceededInStageFilter {
  stageName?: string;
}
export const SucceededInStageFilter = S.suspend(() =>
  S.Struct({ stageName: S.optional(S.String) }),
).annotations({
  identifier: "SucceededInStageFilter",
}) as any as S.Schema<SucceededInStageFilter>;
export interface WebhookFilterRule {
  jsonPath: string;
  matchEquals?: string;
}
export const WebhookFilterRule = S.suspend(() =>
  S.Struct({ jsonPath: S.String, matchEquals: S.optional(S.String) }),
).annotations({
  identifier: "WebhookFilterRule",
}) as any as S.Schema<WebhookFilterRule>;
export type WebhookFilters = WebhookFilterRule[];
export const WebhookFilters = S.Array(WebhookFilterRule);
export interface WebhookAuthConfiguration {
  AllowedIPRange?: string;
  SecretToken?: string;
}
export const WebhookAuthConfiguration = S.suspend(() =>
  S.Struct({
    AllowedIPRange: S.optional(S.String),
    SecretToken: S.optional(S.String),
  }),
).annotations({
  identifier: "WebhookAuthConfiguration",
}) as any as S.Schema<WebhookAuthConfiguration>;
export interface PipelineMetadata {
  pipelineArn?: string;
  created?: Date;
  updated?: Date;
  pollingDisabledAt?: Date;
}
export const PipelineMetadata = S.suspend(() =>
  S.Struct({
    pipelineArn: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pollingDisabledAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PipelineMetadata",
}) as any as S.Schema<PipelineMetadata>;
export interface ActionExecutionFilter {
  pipelineExecutionId?: string;
  latestInPipelineExecution?: LatestInPipelineExecutionFilter;
}
export const ActionExecutionFilter = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.optional(S.String),
    latestInPipelineExecution: S.optional(LatestInPipelineExecutionFilter),
  }),
).annotations({
  identifier: "ActionExecutionFilter",
}) as any as S.Schema<ActionExecutionFilter>;
export interface ActionType {
  id: ActionTypeId;
  settings?: ActionTypeSettings;
  actionConfigurationProperties?: ActionConfigurationProperty[];
  inputArtifactDetails: ArtifactDetails;
  outputArtifactDetails: ArtifactDetails;
}
export const ActionType = S.suspend(() =>
  S.Struct({
    id: ActionTypeId,
    settings: S.optional(ActionTypeSettings),
    actionConfigurationProperties: S.optional(ActionConfigurationPropertyList),
    inputArtifactDetails: ArtifactDetails,
    outputArtifactDetails: ArtifactDetails,
  }),
).annotations({ identifier: "ActionType" }) as any as S.Schema<ActionType>;
export type ActionTypeList = ActionType[];
export const ActionTypeList = S.Array(ActionType);
export interface PipelineExecutionFilter {
  succeededInStage?: SucceededInStageFilter;
}
export const PipelineExecutionFilter = S.suspend(() =>
  S.Struct({ succeededInStage: S.optional(SucceededInStageFilter) }),
).annotations({
  identifier: "PipelineExecutionFilter",
}) as any as S.Schema<PipelineExecutionFilter>;
export interface PipelineSummary {
  name?: string;
  version?: number;
  pipelineType?: PipelineType;
  executionMode?: ExecutionMode;
  created?: Date;
  updated?: Date;
}
export const PipelineSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    version: S.optional(S.Number),
    pipelineType: S.optional(PipelineType),
    executionMode: S.optional(ExecutionMode),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PipelineSummary",
}) as any as S.Schema<PipelineSummary>;
export type PipelineList = PipelineSummary[];
export const PipelineList = S.Array(PipelineSummary);
export interface WebhookDefinition {
  name: string;
  targetPipeline: string;
  targetAction: string;
  filters: WebhookFilterRule[];
  authentication: WebhookAuthenticationType;
  authenticationConfiguration: WebhookAuthConfiguration;
}
export const WebhookDefinition = S.suspend(() =>
  S.Struct({
    name: S.String,
    targetPipeline: S.String,
    targetAction: S.String,
    filters: WebhookFilters,
    authentication: WebhookAuthenticationType,
    authenticationConfiguration: WebhookAuthConfiguration,
  }),
).annotations({
  identifier: "WebhookDefinition",
}) as any as S.Schema<WebhookDefinition>;
export interface ListWebhookItem {
  definition: WebhookDefinition;
  url: string;
  errorMessage?: string;
  errorCode?: string;
  lastTriggered?: Date;
  arn?: string;
  tags?: Tag[];
}
export const ListWebhookItem = S.suspend(() =>
  S.Struct({
    definition: WebhookDefinition,
    url: S.String,
    errorMessage: S.optional(S.String),
    errorCode: S.optional(S.String),
    lastTriggered: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    arn: S.optional(S.String),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "ListWebhookItem",
}) as any as S.Schema<ListWebhookItem>;
export type WebhookList = ListWebhookItem[];
export const WebhookList = S.Array(ListWebhookItem);
export interface ThirdPartyJob {
  clientId?: string;
  jobId?: string;
}
export const ThirdPartyJob = S.suspend(() =>
  S.Struct({ clientId: S.optional(S.String), jobId: S.optional(S.String) }),
).annotations({
  identifier: "ThirdPartyJob",
}) as any as S.Schema<ThirdPartyJob>;
export type ThirdPartyJobList = ThirdPartyJob[];
export const ThirdPartyJobList = S.Array(ThirdPartyJob);
export type TriggerType =
  | "CreatePipeline"
  | "StartPipelineExecution"
  | "PollForSourceChanges"
  | "Webhook"
  | "CloudWatchEvent"
  | "PutActionRevision"
  | "WebhookV2"
  | "ManualRollback"
  | "AutomatedRollback";
export const TriggerType = S.Literal(
  "CreatePipeline",
  "StartPipelineExecution",
  "PollForSourceChanges",
  "Webhook",
  "CloudWatchEvent",
  "PutActionRevision",
  "WebhookV2",
  "ManualRollback",
  "AutomatedRollback",
);
export type RetryTrigger = "AutomatedStageRetry" | "ManualStageRetry";
export const RetryTrigger = S.Literal(
  "AutomatedStageRetry",
  "ManualStageRetry",
);
export type RuleConfigurationPropertyType = "String" | "Number" | "Boolean";
export const RuleConfigurationPropertyType = S.Literal(
  "String",
  "Number",
  "Boolean",
);
export interface CreateCustomActionTypeOutput {
  actionType: ActionType;
  tags?: Tag[];
}
export const CreateCustomActionTypeOutput = S.suspend(() =>
  S.Struct({ actionType: ActionType, tags: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "CreateCustomActionTypeOutput",
}) as any as S.Schema<CreateCustomActionTypeOutput>;
export interface GetPipelineOutput {
  pipeline?: PipelineDeclaration;
  metadata?: PipelineMetadata;
}
export const GetPipelineOutput = S.suspend(() =>
  S.Struct({
    pipeline: S.optional(PipelineDeclaration),
    metadata: S.optional(PipelineMetadata),
  }).pipe(ns),
).annotations({
  identifier: "GetPipelineOutput",
}) as any as S.Schema<GetPipelineOutput>;
export interface ListActionExecutionsInput {
  pipelineName: string;
  filter?: ActionExecutionFilter;
  maxResults?: number;
  nextToken?: string;
}
export const ListActionExecutionsInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    filter: S.optional(ActionExecutionFilter),
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
  identifier: "ListActionExecutionsInput",
}) as any as S.Schema<ListActionExecutionsInput>;
export interface ListActionTypesOutput {
  actionTypes: ActionType[];
  nextToken?: string;
}
export const ListActionTypesOutput = S.suspend(() =>
  S.Struct({
    actionTypes: ActionTypeList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListActionTypesOutput",
}) as any as S.Schema<ListActionTypesOutput>;
export interface ListPipelineExecutionsInput {
  pipelineName: string;
  maxResults?: number;
  filter?: PipelineExecutionFilter;
  nextToken?: string;
}
export const ListPipelineExecutionsInput = S.suspend(() =>
  S.Struct({
    pipelineName: S.String,
    maxResults: S.optional(S.Number),
    filter: S.optional(PipelineExecutionFilter),
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
  identifier: "ListPipelineExecutionsInput",
}) as any as S.Schema<ListPipelineExecutionsInput>;
export interface ListPipelinesOutput {
  pipelines?: PipelineSummary[];
  nextToken?: string;
}
export const ListPipelinesOutput = S.suspend(() =>
  S.Struct({
    pipelines: S.optional(PipelineList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelinesOutput",
}) as any as S.Schema<ListPipelinesOutput>;
export interface ListWebhooksOutput {
  webhooks?: ListWebhookItem[];
  NextToken?: string;
}
export const ListWebhooksOutput = S.suspend(() =>
  S.Struct({
    webhooks: S.optional(WebhookList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListWebhooksOutput",
}) as any as S.Schema<ListWebhooksOutput>;
export interface PollForThirdPartyJobsOutput {
  jobs?: ThirdPartyJob[];
}
export const PollForThirdPartyJobsOutput = S.suspend(() =>
  S.Struct({ jobs: S.optional(ThirdPartyJobList) }).pipe(ns),
).annotations({
  identifier: "PollForThirdPartyJobsOutput",
}) as any as S.Schema<PollForThirdPartyJobsOutput>;
export interface PutActionRevisionOutput {
  newRevision?: boolean;
  pipelineExecutionId?: string;
}
export const PutActionRevisionOutput = S.suspend(() =>
  S.Struct({
    newRevision: S.optional(S.Boolean),
    pipelineExecutionId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "PutActionRevisionOutput",
}) as any as S.Schema<PutActionRevisionOutput>;
export interface PutApprovalResultOutput {
  approvedAt?: Date;
}
export const PutApprovalResultOutput = S.suspend(() =>
  S.Struct({
    approvedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "PutApprovalResultOutput",
}) as any as S.Schema<PutApprovalResultOutput>;
export interface PutWebhookInput {
  webhook: WebhookDefinition;
  tags?: Tag[];
}
export const PutWebhookInput = S.suspend(() =>
  S.Struct({ webhook: WebhookDefinition, tags: S.optional(TagList) }).pipe(
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
  identifier: "PutWebhookInput",
}) as any as S.Schema<PutWebhookInput>;
export interface StartPipelineExecutionOutput {
  pipelineExecutionId?: string;
}
export const StartPipelineExecutionOutput = S.suspend(() =>
  S.Struct({ pipelineExecutionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartPipelineExecutionOutput",
}) as any as S.Schema<StartPipelineExecutionOutput>;
export interface ArtifactRevision {
  name?: string;
  revisionId?: string;
  revisionChangeIdentifier?: string;
  revisionSummary?: string;
  created?: Date;
  revisionUrl?: string;
}
export const ArtifactRevision = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    revisionId: S.optional(S.String),
    revisionChangeIdentifier: S.optional(S.String),
    revisionSummary: S.optional(S.String),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    revisionUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ArtifactRevision",
}) as any as S.Schema<ArtifactRevision>;
export type ArtifactRevisionList = ArtifactRevision[];
export const ArtifactRevisionList = S.Array(ArtifactRevision);
export interface ResolvedPipelineVariable {
  name?: string;
  resolvedValue?: string;
}
export const ResolvedPipelineVariable = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), resolvedValue: S.optional(S.String) }),
).annotations({
  identifier: "ResolvedPipelineVariable",
}) as any as S.Schema<ResolvedPipelineVariable>;
export type ResolvedPipelineVariableList = ResolvedPipelineVariable[];
export const ResolvedPipelineVariableList = S.Array(ResolvedPipelineVariable);
export interface ExecutionTrigger {
  triggerType?: TriggerType;
  triggerDetail?: string;
}
export const ExecutionTrigger = S.suspend(() =>
  S.Struct({
    triggerType: S.optional(TriggerType),
    triggerDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionTrigger",
}) as any as S.Schema<ExecutionTrigger>;
export interface PipelineRollbackMetadata {
  rollbackTargetPipelineExecutionId?: string;
}
export const PipelineRollbackMetadata = S.suspend(() =>
  S.Struct({ rollbackTargetPipelineExecutionId: S.optional(S.String) }),
).annotations({
  identifier: "PipelineRollbackMetadata",
}) as any as S.Schema<PipelineRollbackMetadata>;
export interface TransitionState {
  enabled?: boolean;
  lastChangedBy?: string;
  lastChangedAt?: Date;
  disabledReason?: string;
}
export const TransitionState = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    lastChangedBy: S.optional(S.String),
    lastChangedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    disabledReason: S.optional(S.String),
  }),
).annotations({
  identifier: "TransitionState",
}) as any as S.Schema<TransitionState>;
export interface RetryStageMetadata {
  autoStageRetryAttempt?: number;
  manualStageRetryAttempt?: number;
  latestRetryTrigger?: RetryTrigger;
}
export const RetryStageMetadata = S.suspend(() =>
  S.Struct({
    autoStageRetryAttempt: S.optional(S.Number),
    manualStageRetryAttempt: S.optional(S.Number),
    latestRetryTrigger: S.optional(RetryTrigger),
  }),
).annotations({
  identifier: "RetryStageMetadata",
}) as any as S.Schema<RetryStageMetadata>;
export interface ActionConfiguration {
  configuration?: { [key: string]: string };
}
export const ActionConfiguration = S.suspend(() =>
  S.Struct({ configuration: S.optional(ActionConfigurationMap) }),
).annotations({
  identifier: "ActionConfiguration",
}) as any as S.Schema<ActionConfiguration>;
export interface StageContext {
  name?: string;
}
export const StageContext = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({ identifier: "StageContext" }) as any as S.Schema<StageContext>;
export interface ActionContext {
  name?: string;
  actionExecutionId?: string;
}
export const ActionContext = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    actionExecutionId: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionContext",
}) as any as S.Schema<ActionContext>;
export interface PipelineContext {
  pipelineName?: string;
  stage?: StageContext;
  action?: ActionContext;
  pipelineArn?: string;
  pipelineExecutionId?: string;
}
export const PipelineContext = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    stage: S.optional(StageContext),
    action: S.optional(ActionContext),
    pipelineArn: S.optional(S.String),
    pipelineExecutionId: S.optional(S.String),
  }),
).annotations({
  identifier: "PipelineContext",
}) as any as S.Schema<PipelineContext>;
export type ArtifactLocationType = "S3";
export const ArtifactLocationType = S.Literal("S3");
export interface S3ArtifactLocation {
  bucketName: string;
  objectKey: string;
}
export const S3ArtifactLocation = S.suspend(() =>
  S.Struct({ bucketName: S.String, objectKey: S.String }),
).annotations({
  identifier: "S3ArtifactLocation",
}) as any as S.Schema<S3ArtifactLocation>;
export interface ArtifactLocation {
  type?: ArtifactLocationType;
  s3Location?: S3ArtifactLocation;
}
export const ArtifactLocation = S.suspend(() =>
  S.Struct({
    type: S.optional(ArtifactLocationType),
    s3Location: S.optional(S3ArtifactLocation),
  }),
).annotations({
  identifier: "ArtifactLocation",
}) as any as S.Schema<ArtifactLocation>;
export interface Artifact {
  name?: string;
  revision?: string;
  location?: ArtifactLocation;
}
export const Artifact = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    revision: S.optional(S.String),
    location: S.optional(ArtifactLocation),
  }),
).annotations({ identifier: "Artifact" }) as any as S.Schema<Artifact>;
export type ArtifactList = Artifact[];
export const ArtifactList = S.Array(Artifact);
export interface AWSSessionCredentials {
  accessKeyId: string | redacted.Redacted<string>;
  secretAccessKey: string | redacted.Redacted<string>;
  sessionToken: string | redacted.Redacted<string>;
}
export const AWSSessionCredentials = S.suspend(() =>
  S.Struct({
    accessKeyId: SensitiveString,
    secretAccessKey: SensitiveString,
    sessionToken: SensitiveString,
  }),
).annotations({
  identifier: "AWSSessionCredentials",
}) as any as S.Schema<AWSSessionCredentials>;
export interface ThirdPartyJobData {
  actionTypeId?: ActionTypeId;
  actionConfiguration?: ActionConfiguration;
  pipelineContext?: PipelineContext;
  inputArtifacts?: Artifact[];
  outputArtifacts?: Artifact[];
  artifactCredentials?: AWSSessionCredentials;
  continuationToken?: string;
  encryptionKey?: EncryptionKey;
}
export const ThirdPartyJobData = S.suspend(() =>
  S.Struct({
    actionTypeId: S.optional(ActionTypeId),
    actionConfiguration: S.optional(ActionConfiguration),
    pipelineContext: S.optional(PipelineContext),
    inputArtifacts: S.optional(ArtifactList),
    outputArtifacts: S.optional(ArtifactList),
    artifactCredentials: S.optional(AWSSessionCredentials),
    continuationToken: S.optional(S.String),
    encryptionKey: S.optional(EncryptionKey),
  }),
).annotations({
  identifier: "ThirdPartyJobData",
}) as any as S.Schema<ThirdPartyJobData>;
export type RuleExecutionStatus =
  | "InProgress"
  | "Abandoned"
  | "Succeeded"
  | "Failed";
export const RuleExecutionStatus = S.Literal(
  "InProgress",
  "Abandoned",
  "Succeeded",
  "Failed",
);
export interface RuleTypeSettings {
  thirdPartyConfigurationUrl?: string;
  entityUrlTemplate?: string;
  executionUrlTemplate?: string;
  revisionUrlTemplate?: string;
}
export const RuleTypeSettings = S.suspend(() =>
  S.Struct({
    thirdPartyConfigurationUrl: S.optional(S.String),
    entityUrlTemplate: S.optional(S.String),
    executionUrlTemplate: S.optional(S.String),
    revisionUrlTemplate: S.optional(S.String),
  }),
).annotations({
  identifier: "RuleTypeSettings",
}) as any as S.Schema<RuleTypeSettings>;
export interface RuleConfigurationProperty {
  name: string;
  required: boolean;
  key: boolean;
  secret: boolean;
  queryable?: boolean;
  description?: string;
  type?: RuleConfigurationPropertyType;
}
export const RuleConfigurationProperty = S.suspend(() =>
  S.Struct({
    name: S.String,
    required: S.Boolean,
    key: S.Boolean,
    secret: S.Boolean,
    queryable: S.optional(S.Boolean),
    description: S.optional(S.String),
    type: S.optional(RuleConfigurationPropertyType),
  }),
).annotations({
  identifier: "RuleConfigurationProperty",
}) as any as S.Schema<RuleConfigurationProperty>;
export type RuleConfigurationPropertyList = RuleConfigurationProperty[];
export const RuleConfigurationPropertyList = S.Array(RuleConfigurationProperty);
export type ActionExecutionStatus =
  | "InProgress"
  | "Abandoned"
  | "Succeeded"
  | "Failed";
export const ActionExecutionStatus = S.Literal(
  "InProgress",
  "Abandoned",
  "Succeeded",
  "Failed",
);
export type ConditionExecutionStatus =
  | "InProgress"
  | "Failed"
  | "Errored"
  | "Succeeded"
  | "Cancelled"
  | "Abandoned"
  | "Overridden";
export const ConditionExecutionStatus = S.Literal(
  "InProgress",
  "Failed",
  "Errored",
  "Succeeded",
  "Cancelled",
  "Abandoned",
  "Overridden",
);
export interface PipelineExecution {
  pipelineName?: string;
  pipelineVersion?: number;
  pipelineExecutionId?: string;
  status?: PipelineExecutionStatus;
  statusSummary?: string;
  artifactRevisions?: ArtifactRevision[];
  variables?: ResolvedPipelineVariable[];
  trigger?: ExecutionTrigger;
  executionMode?: ExecutionMode;
  executionType?: ExecutionType;
  rollbackMetadata?: PipelineRollbackMetadata;
}
export const PipelineExecution = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    pipelineVersion: S.optional(S.Number),
    pipelineExecutionId: S.optional(S.String),
    status: S.optional(PipelineExecutionStatus),
    statusSummary: S.optional(S.String),
    artifactRevisions: S.optional(ArtifactRevisionList),
    variables: S.optional(ResolvedPipelineVariableList),
    trigger: S.optional(ExecutionTrigger),
    executionMode: S.optional(ExecutionMode),
    executionType: S.optional(ExecutionType),
    rollbackMetadata: S.optional(PipelineRollbackMetadata),
  }),
).annotations({
  identifier: "PipelineExecution",
}) as any as S.Schema<PipelineExecution>;
export interface ThirdPartyJobDetails {
  id?: string;
  data?: ThirdPartyJobData;
  nonce?: string;
}
export const ThirdPartyJobDetails = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    data: S.optional(ThirdPartyJobData),
    nonce: S.optional(S.String),
  }),
).annotations({
  identifier: "ThirdPartyJobDetails",
}) as any as S.Schema<ThirdPartyJobDetails>;
export interface RuleType {
  id: RuleTypeId;
  settings?: RuleTypeSettings;
  ruleConfigurationProperties?: RuleConfigurationProperty[];
  inputArtifactDetails: ArtifactDetails;
}
export const RuleType = S.suspend(() =>
  S.Struct({
    id: RuleTypeId,
    settings: S.optional(RuleTypeSettings),
    ruleConfigurationProperties: S.optional(RuleConfigurationPropertyList),
    inputArtifactDetails: ArtifactDetails,
  }),
).annotations({ identifier: "RuleType" }) as any as S.Schema<RuleType>;
export type RuleTypeList = RuleType[];
export const RuleTypeList = S.Array(RuleType);
export interface JobData {
  actionTypeId?: ActionTypeId;
  actionConfiguration?: ActionConfiguration;
  pipelineContext?: PipelineContext;
  inputArtifacts?: Artifact[];
  outputArtifacts?: Artifact[];
  artifactCredentials?: AWSSessionCredentials;
  continuationToken?: string;
  encryptionKey?: EncryptionKey;
}
export const JobData = S.suspend(() =>
  S.Struct({
    actionTypeId: S.optional(ActionTypeId),
    actionConfiguration: S.optional(ActionConfiguration),
    pipelineContext: S.optional(PipelineContext),
    inputArtifacts: S.optional(ArtifactList),
    outputArtifacts: S.optional(ArtifactList),
    artifactCredentials: S.optional(AWSSessionCredentials),
    continuationToken: S.optional(S.String),
    encryptionKey: S.optional(EncryptionKey),
  }),
).annotations({ identifier: "JobData" }) as any as S.Schema<JobData>;
export interface Job {
  id?: string;
  data?: JobData;
  nonce?: string;
  accountId?: string;
}
export const Job = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    data: S.optional(JobData),
    nonce: S.optional(S.String),
    accountId: S.optional(S.String),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export type JobList = Job[];
export const JobList = S.Array(Job);
export interface StageConditionsExecution {
  status?: ConditionExecutionStatus;
  summary?: string;
}
export const StageConditionsExecution = S.suspend(() =>
  S.Struct({
    status: S.optional(ConditionExecutionStatus),
    summary: S.optional(S.String),
  }),
).annotations({
  identifier: "StageConditionsExecution",
}) as any as S.Schema<StageConditionsExecution>;
export interface GetPipelineExecutionOutput {
  pipelineExecution?: PipelineExecution;
}
export const GetPipelineExecutionOutput = S.suspend(() =>
  S.Struct({ pipelineExecution: S.optional(PipelineExecution) }).pipe(ns),
).annotations({
  identifier: "GetPipelineExecutionOutput",
}) as any as S.Schema<GetPipelineExecutionOutput>;
export interface GetThirdPartyJobDetailsOutput {
  jobDetails?: ThirdPartyJobDetails;
}
export const GetThirdPartyJobDetailsOutput = S.suspend(() =>
  S.Struct({ jobDetails: S.optional(ThirdPartyJobDetails) }).pipe(ns),
).annotations({
  identifier: "GetThirdPartyJobDetailsOutput",
}) as any as S.Schema<GetThirdPartyJobDetailsOutput>;
export interface ListRuleTypesOutput {
  ruleTypes: RuleType[];
}
export const ListRuleTypesOutput = S.suspend(() =>
  S.Struct({ ruleTypes: RuleTypeList }).pipe(ns),
).annotations({
  identifier: "ListRuleTypesOutput",
}) as any as S.Schema<ListRuleTypesOutput>;
export interface PollForJobsOutput {
  jobs?: Job[];
}
export const PollForJobsOutput = S.suspend(() =>
  S.Struct({ jobs: S.optional(JobList) }).pipe(ns),
).annotations({
  identifier: "PollForJobsOutput",
}) as any as S.Schema<PollForJobsOutput>;
export interface PutWebhookOutput {
  webhook?: ListWebhookItem;
}
export const PutWebhookOutput = S.suspend(() =>
  S.Struct({ webhook: S.optional(ListWebhookItem) }).pipe(ns),
).annotations({
  identifier: "PutWebhookOutput",
}) as any as S.Schema<PutWebhookOutput>;
export interface ErrorDetails {
  code?: string;
  message?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface ConditionExecution {
  status?: ConditionExecutionStatus;
  summary?: string;
  lastStatusChange?: Date;
}
export const ConditionExecution = S.suspend(() =>
  S.Struct({
    status: S.optional(ConditionExecutionStatus),
    summary: S.optional(S.String),
    lastStatusChange: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ConditionExecution",
}) as any as S.Schema<ConditionExecution>;
export interface ActionExecution {
  actionExecutionId?: string;
  status?: ActionExecutionStatus;
  summary?: string;
  lastStatusChange?: Date;
  token?: string;
  lastUpdatedBy?: string;
  externalExecutionId?: string;
  externalExecutionUrl?: string;
  percentComplete?: number;
  errorDetails?: ErrorDetails;
  logStreamARN?: string;
}
export const ActionExecution = S.suspend(() =>
  S.Struct({
    actionExecutionId: S.optional(S.String),
    status: S.optional(ActionExecutionStatus),
    summary: S.optional(S.String),
    lastStatusChange: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    token: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
    externalExecutionId: S.optional(S.String),
    externalExecutionUrl: S.optional(S.String),
    percentComplete: S.optional(S.Number),
    errorDetails: S.optional(ErrorDetails),
    logStreamARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionExecution",
}) as any as S.Schema<ActionExecution>;
export interface DeployTargetEventContext {
  ssmCommandId?: string;
  message?: string;
}
export const DeployTargetEventContext = S.suspend(() =>
  S.Struct({
    ssmCommandId: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "DeployTargetEventContext",
}) as any as S.Schema<DeployTargetEventContext>;
export type ResolvedRuleConfigurationMap = { [key: string]: string };
export const ResolvedRuleConfigurationMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface RuleExecutionResult {
  externalExecutionId?: string;
  externalExecutionSummary?: string;
  externalExecutionUrl?: string;
  errorDetails?: ErrorDetails;
}
export const RuleExecutionResult = S.suspend(() =>
  S.Struct({
    externalExecutionId: S.optional(S.String),
    externalExecutionSummary: S.optional(S.String),
    externalExecutionUrl: S.optional(S.String),
    errorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "RuleExecutionResult",
}) as any as S.Schema<RuleExecutionResult>;
export interface RuleRevision {
  revisionId: string;
  revisionChangeId: string;
  created: Date;
}
export const RuleRevision = S.suspend(() =>
  S.Struct({
    revisionId: S.String,
    revisionChangeId: S.String,
    created: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "RuleRevision" }) as any as S.Schema<RuleRevision>;
export interface RuleExecution {
  ruleExecutionId?: string;
  status?: RuleExecutionStatus;
  summary?: string;
  lastStatusChange?: Date;
  token?: string;
  lastUpdatedBy?: string;
  externalExecutionId?: string;
  externalExecutionUrl?: string;
  errorDetails?: ErrorDetails;
}
export const RuleExecution = S.suspend(() =>
  S.Struct({
    ruleExecutionId: S.optional(S.String),
    status: S.optional(RuleExecutionStatus),
    summary: S.optional(S.String),
    lastStatusChange: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    token: S.optional(S.String),
    lastUpdatedBy: S.optional(S.String),
    externalExecutionId: S.optional(S.String),
    externalExecutionUrl: S.optional(S.String),
    errorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "RuleExecution",
}) as any as S.Schema<RuleExecution>;
export interface UpdateActionTypeInput {
  actionType: ActionTypeDeclaration;
}
export const UpdateActionTypeInput = S.suspend(() =>
  S.Struct({ actionType: ActionTypeDeclaration }).pipe(
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
  identifier: "UpdateActionTypeInput",
}) as any as S.Schema<UpdateActionTypeInput>;
export interface UpdateActionTypeResponse {}
export const UpdateActionTypeResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateActionTypeResponse",
}) as any as S.Schema<UpdateActionTypeResponse>;
export interface ActionState {
  actionName?: string;
  currentRevision?: ActionRevision;
  latestExecution?: ActionExecution;
  entityUrl?: string;
  revisionUrl?: string;
}
export const ActionState = S.suspend(() =>
  S.Struct({
    actionName: S.optional(S.String),
    currentRevision: S.optional(ActionRevision),
    latestExecution: S.optional(ActionExecution),
    entityUrl: S.optional(S.String),
    revisionUrl: S.optional(S.String),
  }),
).annotations({ identifier: "ActionState" }) as any as S.Schema<ActionState>;
export type ActionStateList = ActionState[];
export const ActionStateList = S.Array(ActionState);
export interface DeployTargetEvent {
  name?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  context?: DeployTargetEventContext;
}
export const DeployTargetEvent = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    context: S.optional(DeployTargetEventContext),
  }),
).annotations({
  identifier: "DeployTargetEvent",
}) as any as S.Schema<DeployTargetEvent>;
export type DeployTargetEventList = DeployTargetEvent[];
export const DeployTargetEventList = S.Array(DeployTargetEvent);
export interface SourceRevision {
  actionName: string;
  revisionId?: string;
  revisionSummary?: string;
  revisionUrl?: string;
}
export const SourceRevision = S.suspend(() =>
  S.Struct({
    actionName: S.String,
    revisionId: S.optional(S.String),
    revisionSummary: S.optional(S.String),
    revisionUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceRevision",
}) as any as S.Schema<SourceRevision>;
export type SourceRevisionList = SourceRevision[];
export const SourceRevisionList = S.Array(SourceRevision);
export interface StopExecutionTrigger {
  reason?: string;
}
export const StopExecutionTrigger = S.suspend(() =>
  S.Struct({ reason: S.optional(S.String) }),
).annotations({
  identifier: "StopExecutionTrigger",
}) as any as S.Schema<StopExecutionTrigger>;
export interface RuleExecutionOutput {
  executionResult?: RuleExecutionResult;
}
export const RuleExecutionOutput = S.suspend(() =>
  S.Struct({ executionResult: S.optional(RuleExecutionResult) }),
).annotations({
  identifier: "RuleExecutionOutput",
}) as any as S.Schema<RuleExecutionOutput>;
export interface RuleState {
  ruleName?: string;
  currentRevision?: RuleRevision;
  latestExecution?: RuleExecution;
  entityUrl?: string;
  revisionUrl?: string;
}
export const RuleState = S.suspend(() =>
  S.Struct({
    ruleName: S.optional(S.String),
    currentRevision: S.optional(RuleRevision),
    latestExecution: S.optional(RuleExecution),
    entityUrl: S.optional(S.String),
    revisionUrl: S.optional(S.String),
  }),
).annotations({ identifier: "RuleState" }) as any as S.Schema<RuleState>;
export type RuleStateList = RuleState[];
export const RuleStateList = S.Array(RuleState);
export interface S3Location {
  bucket?: string;
  key?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), key: S.optional(S.String) }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface DeployActionExecutionTarget {
  targetId?: string;
  targetType?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  events?: DeployTargetEvent[];
}
export const DeployActionExecutionTarget = S.suspend(() =>
  S.Struct({
    targetId: S.optional(S.String),
    targetType: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    events: S.optional(DeployTargetEventList),
  }),
).annotations({
  identifier: "DeployActionExecutionTarget",
}) as any as S.Schema<DeployActionExecutionTarget>;
export type DeployActionExecutionTargetList = DeployActionExecutionTarget[];
export const DeployActionExecutionTargetList = S.Array(
  DeployActionExecutionTarget,
);
export interface PipelineExecutionSummary {
  pipelineExecutionId?: string;
  status?: PipelineExecutionStatus;
  statusSummary?: string;
  startTime?: Date;
  lastUpdateTime?: Date;
  sourceRevisions?: SourceRevision[];
  trigger?: ExecutionTrigger;
  stopTrigger?: StopExecutionTrigger;
  executionMode?: ExecutionMode;
  executionType?: ExecutionType;
  rollbackMetadata?: PipelineRollbackMetadata;
}
export const PipelineExecutionSummary = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.optional(S.String),
    status: S.optional(PipelineExecutionStatus),
    statusSummary: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    sourceRevisions: S.optional(SourceRevisionList),
    trigger: S.optional(ExecutionTrigger),
    stopTrigger: S.optional(StopExecutionTrigger),
    executionMode: S.optional(ExecutionMode),
    executionType: S.optional(ExecutionType),
    rollbackMetadata: S.optional(PipelineRollbackMetadata),
  }),
).annotations({
  identifier: "PipelineExecutionSummary",
}) as any as S.Schema<PipelineExecutionSummary>;
export type PipelineExecutionSummaryList = PipelineExecutionSummary[];
export const PipelineExecutionSummaryList = S.Array(PipelineExecutionSummary);
export interface ConditionState {
  latestExecution?: ConditionExecution;
  ruleStates?: RuleState[];
}
export const ConditionState = S.suspend(() =>
  S.Struct({
    latestExecution: S.optional(ConditionExecution),
    ruleStates: S.optional(RuleStateList),
  }),
).annotations({
  identifier: "ConditionState",
}) as any as S.Schema<ConditionState>;
export type ConditionStateList = ConditionState[];
export const ConditionStateList = S.Array(ConditionState);
export type ResolvedActionConfigurationMap = { [key: string]: string };
export const ResolvedActionConfigurationMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ActionExecutionResult {
  externalExecutionId?: string;
  externalExecutionSummary?: string;
  externalExecutionUrl?: string;
  errorDetails?: ErrorDetails;
  logStreamARN?: string;
}
export const ActionExecutionResult = S.suspend(() =>
  S.Struct({
    externalExecutionId: S.optional(S.String),
    externalExecutionSummary: S.optional(S.String),
    externalExecutionUrl: S.optional(S.String),
    errorDetails: S.optional(ErrorDetails),
    logStreamARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionExecutionResult",
}) as any as S.Schema<ActionExecutionResult>;
export interface ArtifactDetail {
  name?: string;
  s3location?: S3Location;
}
export const ArtifactDetail = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), s3location: S.optional(S3Location) }),
).annotations({
  identifier: "ArtifactDetail",
}) as any as S.Schema<ArtifactDetail>;
export type ArtifactDetailList = ArtifactDetail[];
export const ArtifactDetailList = S.Array(ArtifactDetail);
export interface ListDeployActionExecutionTargetsOutput {
  targets?: DeployActionExecutionTarget[];
  nextToken?: string;
}
export const ListDeployActionExecutionTargetsOutput = S.suspend(() =>
  S.Struct({
    targets: S.optional(DeployActionExecutionTargetList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDeployActionExecutionTargetsOutput",
}) as any as S.Schema<ListDeployActionExecutionTargetsOutput>;
export interface ListPipelineExecutionsOutput {
  pipelineExecutionSummaries?: PipelineExecutionSummary[];
  nextToken?: string;
}
export const ListPipelineExecutionsOutput = S.suspend(() =>
  S.Struct({
    pipelineExecutionSummaries: S.optional(PipelineExecutionSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListPipelineExecutionsOutput",
}) as any as S.Schema<ListPipelineExecutionsOutput>;
export interface StageConditionState {
  latestExecution?: StageConditionsExecution;
  conditionStates?: ConditionState[];
}
export const StageConditionState = S.suspend(() =>
  S.Struct({
    latestExecution: S.optional(StageConditionsExecution),
    conditionStates: S.optional(ConditionStateList),
  }),
).annotations({
  identifier: "StageConditionState",
}) as any as S.Schema<StageConditionState>;
export interface ActionExecutionInput {
  actionTypeId?: ActionTypeId;
  configuration?: { [key: string]: string };
  resolvedConfiguration?: { [key: string]: string };
  roleArn?: string;
  region?: string;
  inputArtifacts?: ArtifactDetail[];
  namespace?: string;
}
export const ActionExecutionInput = S.suspend(() =>
  S.Struct({
    actionTypeId: S.optional(ActionTypeId),
    configuration: S.optional(ActionConfigurationMap),
    resolvedConfiguration: S.optional(ResolvedActionConfigurationMap),
    roleArn: S.optional(S.String),
    region: S.optional(S.String),
    inputArtifacts: S.optional(ArtifactDetailList),
    namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "ActionExecutionInput",
}) as any as S.Schema<ActionExecutionInput>;
export interface ActionExecutionOutput {
  outputArtifacts?: ArtifactDetail[];
  executionResult?: ActionExecutionResult;
  outputVariables?: { [key: string]: string };
}
export const ActionExecutionOutput = S.suspend(() =>
  S.Struct({
    outputArtifacts: S.optional(ArtifactDetailList),
    executionResult: S.optional(ActionExecutionResult),
    outputVariables: S.optional(OutputVariablesMap),
  }),
).annotations({
  identifier: "ActionExecutionOutput",
}) as any as S.Schema<ActionExecutionOutput>;
export interface RuleExecutionInput {
  ruleTypeId?: RuleTypeId;
  configuration?: { [key: string]: string };
  resolvedConfiguration?: { [key: string]: string };
  roleArn?: string;
  region?: string;
  inputArtifacts?: ArtifactDetail[];
}
export const RuleExecutionInput = S.suspend(() =>
  S.Struct({
    ruleTypeId: S.optional(RuleTypeId),
    configuration: S.optional(RuleConfigurationMap),
    resolvedConfiguration: S.optional(ResolvedRuleConfigurationMap),
    roleArn: S.optional(S.String),
    region: S.optional(S.String),
    inputArtifacts: S.optional(ArtifactDetailList),
  }),
).annotations({
  identifier: "RuleExecutionInput",
}) as any as S.Schema<RuleExecutionInput>;
export interface JobDetails {
  id?: string;
  data?: JobData;
  accountId?: string;
}
export const JobDetails = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    data: S.optional(JobData),
    accountId: S.optional(S.String),
  }),
).annotations({ identifier: "JobDetails" }) as any as S.Schema<JobDetails>;
export interface StageState {
  stageName?: string;
  inboundExecution?: StageExecution;
  inboundExecutions?: StageExecution[];
  inboundTransitionState?: TransitionState;
  actionStates?: ActionState[];
  latestExecution?: StageExecution;
  beforeEntryConditionState?: StageConditionState;
  onSuccessConditionState?: StageConditionState;
  onFailureConditionState?: StageConditionState;
  retryStageMetadata?: RetryStageMetadata;
}
export const StageState = S.suspend(() =>
  S.Struct({
    stageName: S.optional(S.String),
    inboundExecution: S.optional(StageExecution),
    inboundExecutions: S.optional(StageExecutionList),
    inboundTransitionState: S.optional(TransitionState),
    actionStates: S.optional(ActionStateList),
    latestExecution: S.optional(StageExecution),
    beforeEntryConditionState: S.optional(StageConditionState),
    onSuccessConditionState: S.optional(StageConditionState),
    onFailureConditionState: S.optional(StageConditionState),
    retryStageMetadata: S.optional(RetryStageMetadata),
  }),
).annotations({ identifier: "StageState" }) as any as S.Schema<StageState>;
export type StageStateList = StageState[];
export const StageStateList = S.Array(StageState);
export interface ActionExecutionDetail {
  pipelineExecutionId?: string;
  actionExecutionId?: string;
  pipelineVersion?: number;
  stageName?: string;
  actionName?: string;
  startTime?: Date;
  lastUpdateTime?: Date;
  updatedBy?: string;
  status?: ActionExecutionStatus;
  input?: ActionExecutionInput;
  output?: ActionExecutionOutput;
}
export const ActionExecutionDetail = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.optional(S.String),
    actionExecutionId: S.optional(S.String),
    pipelineVersion: S.optional(S.Number),
    stageName: S.optional(S.String),
    actionName: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    status: S.optional(ActionExecutionStatus),
    input: S.optional(ActionExecutionInput),
    output: S.optional(ActionExecutionOutput),
  }),
).annotations({
  identifier: "ActionExecutionDetail",
}) as any as S.Schema<ActionExecutionDetail>;
export type ActionExecutionDetailList = ActionExecutionDetail[];
export const ActionExecutionDetailList = S.Array(ActionExecutionDetail);
export interface RuleExecutionDetail {
  pipelineExecutionId?: string;
  ruleExecutionId?: string;
  pipelineVersion?: number;
  stageName?: string;
  ruleName?: string;
  startTime?: Date;
  lastUpdateTime?: Date;
  updatedBy?: string;
  status?: RuleExecutionStatus;
  input?: RuleExecutionInput;
  output?: RuleExecutionOutput;
}
export const RuleExecutionDetail = S.suspend(() =>
  S.Struct({
    pipelineExecutionId: S.optional(S.String),
    ruleExecutionId: S.optional(S.String),
    pipelineVersion: S.optional(S.Number),
    stageName: S.optional(S.String),
    ruleName: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedBy: S.optional(S.String),
    status: S.optional(RuleExecutionStatus),
    input: S.optional(RuleExecutionInput),
    output: S.optional(RuleExecutionOutput),
  }),
).annotations({
  identifier: "RuleExecutionDetail",
}) as any as S.Schema<RuleExecutionDetail>;
export type RuleExecutionDetailList = RuleExecutionDetail[];
export const RuleExecutionDetailList = S.Array(RuleExecutionDetail);
export interface CreatePipelineInput {
  pipeline: PipelineDeclaration;
  tags?: Tag[];
}
export const CreatePipelineInput = S.suspend(() =>
  S.Struct({ pipeline: PipelineDeclaration, tags: S.optional(TagList) }).pipe(
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
  identifier: "CreatePipelineInput",
}) as any as S.Schema<CreatePipelineInput>;
export interface GetJobDetailsOutput {
  jobDetails?: JobDetails;
}
export const GetJobDetailsOutput = S.suspend(() =>
  S.Struct({ jobDetails: S.optional(JobDetails) }).pipe(ns),
).annotations({
  identifier: "GetJobDetailsOutput",
}) as any as S.Schema<GetJobDetailsOutput>;
export interface GetPipelineStateOutput {
  pipelineName?: string;
  pipelineVersion?: number;
  stageStates?: StageState[];
  created?: Date;
  updated?: Date;
}
export const GetPipelineStateOutput = S.suspend(() =>
  S.Struct({
    pipelineName: S.optional(S.String),
    pipelineVersion: S.optional(S.Number),
    stageStates: S.optional(StageStateList),
    created: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "GetPipelineStateOutput",
}) as any as S.Schema<GetPipelineStateOutput>;
export interface ListActionExecutionsOutput {
  actionExecutionDetails?: ActionExecutionDetail[];
  nextToken?: string;
}
export const ListActionExecutionsOutput = S.suspend(() =>
  S.Struct({
    actionExecutionDetails: S.optional(ActionExecutionDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListActionExecutionsOutput",
}) as any as S.Schema<ListActionExecutionsOutput>;
export interface ListRuleExecutionsOutput {
  ruleExecutionDetails?: RuleExecutionDetail[];
  nextToken?: string;
}
export const ListRuleExecutionsOutput = S.suspend(() =>
  S.Struct({
    ruleExecutionDetails: S.optional(RuleExecutionDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListRuleExecutionsOutput",
}) as any as S.Schema<ListRuleExecutionsOutput>;
export interface CreatePipelineOutput {
  pipeline?: PipelineDeclaration;
  tags?: Tag[];
}
export const CreatePipelineOutput = S.suspend(() =>
  S.Struct({
    pipeline: S.optional(PipelineDeclaration),
    tags: S.optional(TagList),
  }).pipe(ns),
).annotations({
  identifier: "CreatePipelineOutput",
}) as any as S.Schema<CreatePipelineOutput>;

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
) {}
export class WebhookNotFoundException extends S.TaggedError<WebhookNotFoundException>()(
  "WebhookNotFoundException",
  {},
) {}
export class PipelineNotFoundException extends S.TaggedError<PipelineNotFoundException>()(
  "PipelineNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConcurrentPipelineExecutionsLimitExceededException extends S.TaggedError<ConcurrentPipelineExecutionsLimitExceededException>()(
  "ConcurrentPipelineExecutionsLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidClientTokenException extends S.TaggedError<InvalidClientTokenException>()(
  "InvalidClientTokenException",
  { message: S.optional(S.String) },
) {}
export class InvalidNonceException extends S.TaggedError<InvalidNonceException>()(
  "InvalidNonceException",
  { message: S.optional(S.String) },
) {}
export class StageNotFoundException extends S.TaggedError<StageNotFoundException>()(
  "StageNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ActionTypeNotFoundException extends S.TaggedError<ActionTypeNotFoundException>()(
  "ActionTypeNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { message: S.optional(S.String) },
) {}
export class ConditionNotOverridableException extends S.TaggedError<ConditionNotOverridableException>()(
  "ConditionNotOverridableException",
  { message: S.optional(S.String) },
) {}
export class InvalidJobStateException extends S.TaggedError<InvalidJobStateException>()(
  "InvalidJobStateException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidActionDeclarationException extends S.TaggedError<InvalidActionDeclarationException>()(
  "InvalidActionDeclarationException",
  { message: S.optional(S.String) },
) {}
export class JobNotFoundException extends S.TaggedError<JobNotFoundException>()(
  "JobNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagsException extends S.TaggedError<InvalidTagsException>()(
  "InvalidTagsException",
  { message: S.optional(S.String) },
) {}
export class PipelineVersionNotFoundException extends S.TaggedError<PipelineVersionNotFoundException>()(
  "PipelineVersionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
) {}
export class ActionNotFoundException extends S.TaggedError<ActionNotFoundException>()(
  "ActionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class NotLatestPipelineExecutionException extends S.TaggedError<NotLatestPipelineExecutionException>()(
  "NotLatestPipelineExecutionException",
  { message: S.optional(S.String) },
) {}
export class InvalidBlockerDeclarationException extends S.TaggedError<InvalidBlockerDeclarationException>()(
  "InvalidBlockerDeclarationException",
  { message: S.optional(S.String) },
) {}
export class PipelineExecutionNotFoundException extends S.TaggedError<PipelineExecutionNotFoundException>()(
  "PipelineExecutionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class DuplicatedStopRequestException extends S.TaggedError<DuplicatedStopRequestException>()(
  "DuplicatedStopRequestException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidJobException extends S.TaggedError<InvalidJobException>()(
  "InvalidJobException",
  { message: S.optional(S.String) },
) {}
export class InvalidWebhookAuthenticationParametersException extends S.TaggedError<InvalidWebhookAuthenticationParametersException>()(
  "InvalidWebhookAuthenticationParametersException",
  { message: S.optional(S.String) },
) {}
export class StageNotRetryableException extends S.TaggedError<StageNotRetryableException>()(
  "StageNotRetryableException",
  { message: S.optional(S.String) },
) {}
export class InvalidStageDeclarationException extends S.TaggedError<InvalidStageDeclarationException>()(
  "InvalidStageDeclarationException",
  { message: S.optional(S.String) },
) {}
export class OutputVariablesSizeExceededException extends S.TaggedError<OutputVariablesSizeExceededException>()(
  "OutputVariablesSizeExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ApprovalAlreadyCompletedException extends S.TaggedError<ApprovalAlreadyCompletedException>()(
  "ApprovalAlreadyCompletedException",
  { message: S.optional(S.String) },
) {}
export class PipelineExecutionOutdatedException extends S.TaggedError<PipelineExecutionOutdatedException>()(
  "PipelineExecutionOutdatedException",
  { message: S.optional(S.String) },
) {}
export class PipelineExecutionNotStoppableException extends S.TaggedError<PipelineExecutionNotStoppableException>()(
  "PipelineExecutionNotStoppableException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class InvalidWebhookFilterPatternException extends S.TaggedError<InvalidWebhookFilterPatternException>()(
  "InvalidWebhookFilterPatternException",
  { message: S.optional(S.String) },
) {}
export class RequestFailedException extends S.TaggedError<RequestFailedException>()(
  "RequestFailedException",
  { message: S.optional(S.String) },
) {}
export class InvalidStructureException extends S.TaggedError<InvalidStructureException>()(
  "InvalidStructureException",
  { message: S.optional(S.String) },
) {}
export class InvalidApprovalTokenException extends S.TaggedError<InvalidApprovalTokenException>()(
  "InvalidApprovalTokenException",
  { message: S.optional(S.String) },
) {}
export class UnableToRollbackStageException extends S.TaggedError<UnableToRollbackStageException>()(
  "UnableToRollbackStageException",
  { message: S.optional(S.String) },
) {}
export class ActionExecutionNotFoundException extends S.TaggedError<ActionExecutionNotFoundException>()(
  "ActionExecutionNotFoundException",
  { message: S.optional(S.String) },
) {}
export class PipelineNameInUseException extends S.TaggedError<PipelineNameInUseException>()(
  "PipelineNameInUseException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Removes the connection between the webhook that was created by CodePipeline
 * and the external tool with events to be detected. Currently supported only for webhooks
 * that target an action type of GitHub.
 */
export const deregisterWebhookWithThirdParty: (
  input: DeregisterWebhookWithThirdPartyInput,
) => effect.Effect<
  DeregisterWebhookWithThirdPartyOutput,
  ValidationException | WebhookNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterWebhookWithThirdPartyInput,
  output: DeregisterWebhookWithThirdPartyOutput,
  errors: [ValidationException, WebhookNotFoundException],
}));
/**
 * Deletes the specified pipeline.
 */
export const deletePipeline: (
  input: DeletePipelineInput,
) => effect.Effect<
  DeletePipelineResponse,
  ConcurrentModificationException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineInput,
  output: DeletePipelineResponse,
  errors: [ConcurrentModificationException, ValidationException],
}));
/**
 * Deletes a previously created webhook by name. Deleting the webhook stops CodePipeline from starting a pipeline every time an external event occurs. The API
 * returns successfully when trying to delete a webhook that is already deleted. If a
 * deleted webhook is re-created by calling PutWebhook with the same name, it will have a
 * different URL.
 */
export const deleteWebhook: (
  input: DeleteWebhookInput,
) => effect.Effect<
  DeleteWebhookOutput,
  ConcurrentModificationException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebhookInput,
  output: DeleteWebhookOutput,
  errors: [ConcurrentModificationException, ValidationException],
}));
/**
 * Configures a connection between the webhook that was created and the external tool
 * with events to be detected.
 */
export const registerWebhookWithThirdParty: (
  input: RegisterWebhookWithThirdPartyInput,
) => effect.Effect<
  RegisterWebhookWithThirdPartyOutput,
  ValidationException | WebhookNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterWebhookWithThirdPartyInput,
  output: RegisterWebhookWithThirdPartyOutput,
  errors: [ValidationException, WebhookNotFoundException],
}));
/**
 * Marks a custom action as deleted. `PollForJobs` for the custom action
 * fails after the action is marked for deletion. Used for custom actions only.
 *
 * To re-create a custom action after it has been deleted you must use a string in
 * the version field that has never been used before. This string can be an incremented
 * version number, for example. To restore a deleted custom action, use a JSON file
 * that is identical to the deleted action, including the original string in the
 * version field.
 */
export const deleteCustomActionType: (
  input: DeleteCustomActionTypeInput,
) => effect.Effect<
  DeleteCustomActionTypeResponse,
  ConcurrentModificationException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomActionTypeInput,
  output: DeleteCustomActionTypeResponse,
  errors: [ConcurrentModificationException, ValidationException],
}));
/**
 * Prevents artifacts in a pipeline from transitioning to the next stage in the
 * pipeline.
 */
export const disableStageTransition: (
  input: DisableStageTransitionInput,
) => effect.Effect<
  DisableStageTransitionResponse,
  | PipelineNotFoundException
  | StageNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableStageTransitionInput,
  output: DisableStageTransitionResponse,
  errors: [
    PipelineNotFoundException,
    StageNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about an action type created for an external provider, where the
 * action is to be used by customers of the external provider. The action can be created
 * with any supported integration model.
 */
export const getActionType: (
  input: GetActionTypeInput,
) => effect.Effect<
  GetActionTypeOutput,
  ActionTypeNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActionTypeInput,
  output: GetActionTypeOutput,
  errors: [ActionTypeNotFoundException, ValidationException],
}));
/**
 * Determines whether there are any third party jobs for a job worker to act on. Used
 * for partner actions only.
 *
 * When this API is called, CodePipeline returns temporary credentials for
 * the S3 bucket used to store artifacts for the pipeline, if the action requires
 * access to that S3 bucket for input or output artifacts.
 */
export const pollForThirdPartyJobs: (
  input: PollForThirdPartyJobsInput,
) => effect.Effect<
  PollForThirdPartyJobsOutput,
  ActionTypeNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PollForThirdPartyJobsInput,
  output: PollForThirdPartyJobsOutput,
  errors: [ActionTypeNotFoundException, ValidationException],
}));
/**
 * Starts the specified pipeline. Specifically, it begins processing the latest commit
 * to the source location specified as part of the pipeline.
 */
export const startPipelineExecution: (
  input: StartPipelineExecutionInput,
) => effect.Effect<
  StartPipelineExecutionOutput,
  | ConcurrentPipelineExecutionsLimitExceededException
  | ConflictException
  | PipelineNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPipelineExecutionInput,
  output: StartPipelineExecutionOutput,
  errors: [
    ConcurrentPipelineExecutionsLimitExceededException,
    ConflictException,
    PipelineNotFoundException,
    ValidationException,
  ],
}));
/**
 * Enables artifacts in a pipeline to transition to a stage in a pipeline.
 */
export const enableStageTransition: (
  input: EnableStageTransitionInput,
) => effect.Effect<
  EnableStageTransitionResponse,
  | PipelineNotFoundException
  | StageNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableStageTransitionInput,
  output: EnableStageTransitionResponse,
  errors: [
    PipelineNotFoundException,
    StageNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specified job and whether that job has been received by
 * the job worker. Used for custom actions only.
 */
export const acknowledgeJob: (
  input: AcknowledgeJobInput,
) => effect.Effect<
  AcknowledgeJobOutput,
  | InvalidNonceException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcknowledgeJobInput,
  output: AcknowledgeJobOutput,
  errors: [InvalidNonceException, JobNotFoundException, ValidationException],
}));
/**
 * Returns the metadata, structure, stages, and actions of a pipeline. Can be used to
 * return the entire structure of a pipeline in JSON format, which can then be modified and
 * used to update the pipeline structure with UpdatePipeline.
 */
export const getPipeline: (
  input: GetPipelineInput,
) => effect.Effect<
  GetPipelineOutput,
  | PipelineNotFoundException
  | PipelineVersionNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineInput,
  output: GetPipelineOutput,
  errors: [
    PipelineNotFoundException,
    PipelineVersionNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a summary of all CodePipeline action types associated with your
 * account.
 */
export const listActionTypes: {
  (
    input: ListActionTypesInput,
  ): effect.Effect<
    ListActionTypesOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActionTypesInput,
  ) => stream.Stream<
    ListActionTypesOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActionTypesInput,
  ) => stream.Stream<
    ActionType,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListActionTypesInput,
  output: ListActionTypesOutput,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actionTypes",
  } as const,
}));
/**
 * Lists the rules for the condition. For more information about conditions, see Stage
 * conditions and How do
 * stage conditions work?.For more information about rules, see the CodePipeline rule reference.
 */
export const listRuleTypes: (
  input: ListRuleTypesInput,
) => effect.Effect<
  ListRuleTypesOutput,
  InvalidNextTokenException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRuleTypesInput,
  output: ListRuleTypesOutput,
  errors: [InvalidNextTokenException, ValidationException],
}));
/**
 * Returns information about any jobs for CodePipeline to act on.
 * `PollForJobs` is valid only for action types with "Custom" in the owner
 * field. If the action type contains `AWS` or `ThirdParty` in the
 * owner field, the `PollForJobs` action returns an error.
 *
 * When this API is called, CodePipeline returns temporary credentials for
 * the S3 bucket used to store artifacts for the pipeline, if the action requires
 * access to that S3 bucket for input or output artifacts. This API also returns any
 * secret values defined for the action.
 */
export const pollForJobs: (
  input: PollForJobsInput,
) => effect.Effect<
  PollForJobsOutput,
  ActionTypeNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PollForJobsInput,
  output: PollForJobsOutput,
  errors: [ActionTypeNotFoundException, ValidationException],
}));
/**
 * Provides information to CodePipeline about new revisions to a
 * source.
 */
export const putActionRevision: (
  input: PutActionRevisionInput,
) => effect.Effect<
  PutActionRevisionOutput,
  | ActionNotFoundException
  | ConcurrentPipelineExecutionsLimitExceededException
  | PipelineNotFoundException
  | StageNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutActionRevisionInput,
  output: PutActionRevisionOutput,
  errors: [
    ActionNotFoundException,
    ConcurrentPipelineExecutionsLimitExceededException,
    PipelineNotFoundException,
    StageNotFoundException,
    ValidationException,
  ],
}));
/**
 * Represents the failure of a job as returned to the pipeline by a job worker. Used
 * for custom actions only.
 */
export const putJobFailureResult: (
  input: PutJobFailureResultInput,
) => effect.Effect<
  PutJobFailureResultResponse,
  | InvalidJobStateException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutJobFailureResultInput,
  output: PutJobFailureResultResponse,
  errors: [InvalidJobStateException, JobNotFoundException, ValidationException],
}));
/**
 * Confirms a job worker has received the specified job. Used for partner actions
 * only.
 */
export const acknowledgeThirdPartyJob: (
  input: AcknowledgeThirdPartyJobInput,
) => effect.Effect<
  AcknowledgeThirdPartyJobOutput,
  | InvalidClientTokenException
  | InvalidNonceException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcknowledgeThirdPartyJobInput,
  output: AcknowledgeThirdPartyJobOutput,
  errors: [
    InvalidClientTokenException,
    InvalidNonceException,
    JobNotFoundException,
    ValidationException,
  ],
}));
/**
 * Represents the failure of a third party job as returned to the pipeline by a job
 * worker. Used for partner actions only.
 */
export const putThirdPartyJobFailureResult: (
  input: PutThirdPartyJobFailureResultInput,
) => effect.Effect<
  PutThirdPartyJobFailureResultResponse,
  | InvalidClientTokenException
  | InvalidJobStateException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutThirdPartyJobFailureResultInput,
  output: PutThirdPartyJobFailureResultResponse,
  errors: [
    InvalidClientTokenException,
    InvalidJobStateException,
    JobNotFoundException,
    ValidationException,
  ],
}));
/**
 * Represents the success of a third party job as returned to the pipeline by a job
 * worker. Used for partner actions only.
 */
export const putThirdPartyJobSuccessResult: (
  input: PutThirdPartyJobSuccessResultInput,
) => effect.Effect<
  PutThirdPartyJobSuccessResultResponse,
  | InvalidClientTokenException
  | InvalidJobStateException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutThirdPartyJobSuccessResultInput,
  output: PutThirdPartyJobSuccessResultResponse,
  errors: [
    InvalidClientTokenException,
    InvalidJobStateException,
    JobNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets a summary of all of the pipelines associated with your account.
 */
export const listPipelines: {
  (
    input: ListPipelinesInput,
  ): effect.Effect<
    ListPipelinesOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelinesInput,
  ) => stream.Stream<
    ListPipelinesOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelinesInput,
  ) => stream.Stream<
    PipelineSummary,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelinesInput,
  output: ListPipelinesOutput,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "pipelines",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a listing of all the webhooks in this Amazon Web Services Region for this
 * account. The output lists all webhooks and includes the webhook URL and ARN and the
 * configuration for each webhook.
 *
 * If a secret token was provided, it will be redacted in the response.
 */
export const listWebhooks: {
  (
    input: ListWebhooksInput,
  ): effect.Effect<
    ListWebhooksOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWebhooksInput,
  ) => stream.Stream<
    ListWebhooksOutput,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWebhooksInput,
  ) => stream.Stream<
    ListWebhookItem,
    InvalidNextTokenException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWebhooksInput,
  output: ListWebhooksOutput,
  errors: [InvalidNextTokenException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "webhooks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Used to override a stage condition. For more information about conditions, see Stage
 * conditions and How do
 * stage conditions work?.
 */
export const overrideStageCondition: (
  input: OverrideStageConditionInput,
) => effect.Effect<
  OverrideStageConditionResponse,
  | ConcurrentPipelineExecutionsLimitExceededException
  | ConditionNotOverridableException
  | ConflictException
  | NotLatestPipelineExecutionException
  | PipelineNotFoundException
  | StageNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: OverrideStageConditionInput,
  output: OverrideStageConditionResponse,
  errors: [
    ConcurrentPipelineExecutionsLimitExceededException,
    ConditionNotOverridableException,
    ConflictException,
    NotLatestPipelineExecutionException,
    PipelineNotFoundException,
    StageNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about an execution of a pipeline, including details about
 * artifacts, the pipeline execution ID, and the name, version, and status of the
 * pipeline.
 */
export const getPipelineExecution: (
  input: GetPipelineExecutionInput,
) => effect.Effect<
  GetPipelineExecutionOutput,
  | PipelineExecutionNotFoundException
  | PipelineNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineExecutionInput,
  output: GetPipelineExecutionOutput,
  errors: [
    PipelineExecutionNotFoundException,
    PipelineNotFoundException,
    ValidationException,
  ],
}));
/**
 * Requests the details of a job for a third party action. Used for partner actions
 * only.
 *
 * When this API is called, CodePipeline returns temporary credentials for
 * the S3 bucket used to store artifacts for the pipeline, if the action requires
 * access to that S3 bucket for input or output artifacts. This API also returns any
 * secret values defined for the action.
 */
export const getThirdPartyJobDetails: (
  input: GetThirdPartyJobDetailsInput,
) => effect.Effect<
  GetThirdPartyJobDetailsOutput,
  | InvalidClientTokenException
  | InvalidJobException
  | JobNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetThirdPartyJobDetailsInput,
  output: GetThirdPartyJobDetailsOutput,
  errors: [
    InvalidClientTokenException,
    InvalidJobException,
    JobNotFoundException,
    ValidationException,
  ],
}));
/**
 * You can retry a stage that has failed without having to run a pipeline again from
 * the beginning. You do this by either retrying the failed actions in a stage or by
 * retrying all actions in the stage starting from the first action in the stage. When you
 * retry the failed actions in a stage, all actions that are still in progress continue
 * working, and failed actions are triggered again. When you retry a failed stage from the
 * first action in the stage, the stage cannot have any actions in progress. Before a stage
 * can be retried, it must either have all actions failed or some actions failed and some
 * succeeded.
 */
export const retryStageExecution: (
  input: RetryStageExecutionInput,
) => effect.Effect<
  RetryStageExecutionOutput,
  | ConcurrentPipelineExecutionsLimitExceededException
  | ConflictException
  | NotLatestPipelineExecutionException
  | PipelineNotFoundException
  | StageNotFoundException
  | StageNotRetryableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryStageExecutionInput,
  output: RetryStageExecutionOutput,
  errors: [
    ConcurrentPipelineExecutionsLimitExceededException,
    ConflictException,
    NotLatestPipelineExecutionException,
    PipelineNotFoundException,
    StageNotFoundException,
    StageNotRetryableException,
    ValidationException,
  ],
}));
/**
 * Represents the success of a job as returned to the pipeline by a job worker. Used
 * for custom actions only.
 */
export const putJobSuccessResult: (
  input: PutJobSuccessResultInput,
) => effect.Effect<
  PutJobSuccessResultResponse,
  | InvalidJobStateException
  | JobNotFoundException
  | OutputVariablesSizeExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutJobSuccessResultInput,
  output: PutJobSuccessResultResponse,
  errors: [
    InvalidJobStateException,
    JobNotFoundException,
    OutputVariablesSizeExceededException,
    ValidationException,
  ],
}));
/**
 * Stops the specified pipeline execution. You choose to either stop the pipeline
 * execution by completing in-progress actions without starting subsequent actions, or by
 * abandoning in-progress actions. While completing or abandoning in-progress actions, the
 * pipeline execution is in a `Stopping` state. After all in-progress actions
 * are completed or abandoned, the pipeline execution is in a `Stopped`
 * state.
 */
export const stopPipelineExecution: (
  input: StopPipelineExecutionInput,
) => effect.Effect<
  StopPipelineExecutionOutput,
  | ConflictException
  | DuplicatedStopRequestException
  | PipelineExecutionNotStoppableException
  | PipelineNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopPipelineExecutionInput,
  output: StopPipelineExecutionOutput,
  errors: [
    ConflictException,
    DuplicatedStopRequestException,
    PipelineExecutionNotStoppableException,
    PipelineNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes tags from an Amazon Web Services resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidTagsException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidTagsException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets the set of key-value pairs (metadata) that are used to manage the
 * resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceInput,
  ): effect.Effect<
    ListTagsForResourceOutput,
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    ListTagsForResourceOutput,
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    Tag,
    | InvalidArnException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InvalidArnException,
    InvalidNextTokenException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tags",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new custom action that can be used in all pipelines associated with the
 * Amazon Web Services account. Only used for custom actions.
 */
export const createCustomActionType: (
  input: CreateCustomActionTypeInput,
) => effect.Effect<
  CreateCustomActionTypeOutput,
  | ConcurrentModificationException
  | InvalidTagsException
  | LimitExceededException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomActionTypeInput,
  output: CreateCustomActionTypeOutput,
  errors: [
    ConcurrentModificationException,
    InvalidTagsException,
    LimitExceededException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Gets a summary of the most recent executions for a pipeline.
 *
 * When applying the filter for pipeline executions that have succeeded in the stage,
 * the operation returns all executions in the current pipeline version beginning on
 * February 1, 2024.
 */
export const listPipelineExecutions: {
  (
    input: ListPipelineExecutionsInput,
  ): effect.Effect<
    ListPipelineExecutionsOutput,
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPipelineExecutionsInput,
  ) => stream.Stream<
    ListPipelineExecutionsOutput,
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPipelineExecutionsInput,
  ) => stream.Stream<
    PipelineExecutionSummary,
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPipelineExecutionsInput,
  output: ListPipelineExecutionsOutput,
  errors: [
    InvalidNextTokenException,
    PipelineNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "pipelineExecutionSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Defines a webhook and returns a unique webhook URL generated by CodePipeline.
 * This URL can be supplied to third party source hosting providers to call every time
 * there's a code change. When CodePipeline receives a POST request on this URL, the
 * pipeline defined in the webhook is started as long as the POST request satisfied the
 * authentication and filtering requirements supplied when defining the webhook.
 * RegisterWebhookWithThirdParty and DeregisterWebhookWithThirdParty APIs can be used to
 * automatically configure supported third parties to call the generated webhook
 * URL.
 *
 * When creating CodePipeline webhooks, do not use your own credentials or
 * reuse the same secret token across multiple webhooks. For optimal security, generate
 * a unique secret token for each webhook you create. The secret token is an arbitrary
 * string that you provide, which GitHub uses to compute and sign the webhook payloads
 * sent to CodePipeline, for protecting the integrity and authenticity of the
 * webhook payloads. Using your own credentials or reusing the same token across
 * multiple webhooks can lead to security vulnerabilities.
 *
 * If a secret token was provided, it will be redacted in the response.
 */
export const putWebhook: (
  input: PutWebhookInput,
) => effect.Effect<
  PutWebhookOutput,
  | ConcurrentModificationException
  | InvalidTagsException
  | InvalidWebhookAuthenticationParametersException
  | InvalidWebhookFilterPatternException
  | LimitExceededException
  | PipelineNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutWebhookInput,
  output: PutWebhookOutput,
  errors: [
    ConcurrentModificationException,
    InvalidTagsException,
    InvalidWebhookAuthenticationParametersException,
    InvalidWebhookFilterPatternException,
    LimitExceededException,
    PipelineNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates an action type that was created with any supported integration model, where
 * the action type is to be used by customers of the action type provider. Use a JSON file
 * with the action definition and `UpdateActionType` to provide the full
 * structure.
 */
export const updateActionType: (
  input: UpdateActionTypeInput,
) => effect.Effect<
  UpdateActionTypeResponse,
  | ActionTypeNotFoundException
  | RequestFailedException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActionTypeInput,
  output: UpdateActionTypeResponse,
  errors: [
    ActionTypeNotFoundException,
    RequestFailedException,
    ValidationException,
  ],
}));
/**
 * Updates a specified pipeline with edits or changes to its structure. Use a JSON
 * file with the pipeline structure and `UpdatePipeline` to provide the full
 * structure of the pipeline. Updating the pipeline increases the version number of the
 * pipeline by 1.
 */
export const updatePipeline: (
  input: UpdatePipelineInput,
) => effect.Effect<
  UpdatePipelineOutput,
  | InvalidActionDeclarationException
  | InvalidBlockerDeclarationException
  | InvalidStageDeclarationException
  | InvalidStructureException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePipelineInput,
  output: UpdatePipelineOutput,
  errors: [
    InvalidActionDeclarationException,
    InvalidBlockerDeclarationException,
    InvalidStageDeclarationException,
    InvalidStructureException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Adds to or modifies the tags of the given resource. Tags are metadata that can be used
 * to manage a resource.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | ConcurrentModificationException
  | InvalidArnException
  | InvalidTagsException
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidTagsException,
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Provides the response to a manual approval request to CodePipeline. Valid
 * responses include Approved and Rejected.
 */
export const putApprovalResult: (
  input: PutApprovalResultInput,
) => effect.Effect<
  PutApprovalResultOutput,
  | ActionNotFoundException
  | ApprovalAlreadyCompletedException
  | InvalidApprovalTokenException
  | PipelineNotFoundException
  | StageNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutApprovalResultInput,
  output: PutApprovalResultOutput,
  errors: [
    ActionNotFoundException,
    ApprovalAlreadyCompletedException,
    InvalidApprovalTokenException,
    PipelineNotFoundException,
    StageNotFoundException,
    ValidationException,
  ],
}));
/**
 * Rolls back a stage execution.
 */
export const rollbackStage: (
  input: RollbackStageInput,
) => effect.Effect<
  RollbackStageOutput,
  | ConflictException
  | PipelineExecutionNotFoundException
  | PipelineExecutionOutdatedException
  | PipelineNotFoundException
  | StageNotFoundException
  | UnableToRollbackStageException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackStageInput,
  output: RollbackStageOutput,
  errors: [
    ConflictException,
    PipelineExecutionNotFoundException,
    PipelineExecutionOutdatedException,
    PipelineNotFoundException,
    StageNotFoundException,
    UnableToRollbackStageException,
    ValidationException,
  ],
}));
/**
 * Returns information about a job. Used for custom actions only.
 *
 * When this API is called, CodePipeline returns temporary credentials for
 * the S3 bucket used to store artifacts for the pipeline, if the action requires
 * access to that S3 bucket for input or output artifacts. This API also returns any
 * secret values defined for the action.
 */
export const getJobDetails: (
  input: GetJobDetailsInput,
) => effect.Effect<
  GetJobDetailsOutput,
  JobNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobDetailsInput,
  output: GetJobDetailsOutput,
  errors: [JobNotFoundException, ValidationException],
}));
/**
 * Returns information about the state of a pipeline, including the stages and
 * actions.
 *
 * Values returned in the `revisionId` and `revisionUrl`
 * fields indicate the source revision information, such as the commit ID, for the
 * current state.
 */
export const getPipelineState: (
  input: GetPipelineStateInput,
) => effect.Effect<
  GetPipelineStateOutput,
  PipelineNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPipelineStateInput,
  output: GetPipelineStateOutput,
  errors: [PipelineNotFoundException, ValidationException],
}));
/**
 * Lists the action executions that have occurred in a pipeline.
 */
export const listActionExecutions: {
  (
    input: ListActionExecutionsInput,
  ): effect.Effect<
    ListActionExecutionsOutput,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListActionExecutionsInput,
  ) => stream.Stream<
    ListActionExecutionsOutput,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListActionExecutionsInput,
  ) => stream.Stream<
    ActionExecutionDetail,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListActionExecutionsInput,
  output: ListActionExecutionsOutput,
  errors: [
    InvalidNextTokenException,
    PipelineExecutionNotFoundException,
    PipelineNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "actionExecutionDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the targets for the deploy action.
 */
export const listDeployActionExecutionTargets: {
  (
    input: ListDeployActionExecutionTargetsInput,
  ): effect.Effect<
    ListDeployActionExecutionTargetsOutput,
    | ActionExecutionNotFoundException
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeployActionExecutionTargetsInput,
  ) => stream.Stream<
    ListDeployActionExecutionTargetsOutput,
    | ActionExecutionNotFoundException
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeployActionExecutionTargetsInput,
  ) => stream.Stream<
    DeployActionExecutionTarget,
    | ActionExecutionNotFoundException
    | InvalidNextTokenException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDeployActionExecutionTargetsInput,
  output: ListDeployActionExecutionTargetsOutput,
  errors: [
    ActionExecutionNotFoundException,
    InvalidNextTokenException,
    PipelineNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "targets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the rule executions that have occurred in a pipeline configured for conditions
 * with rules.
 */
export const listRuleExecutions: {
  (
    input: ListRuleExecutionsInput,
  ): effect.Effect<
    ListRuleExecutionsOutput,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRuleExecutionsInput,
  ) => stream.Stream<
    ListRuleExecutionsOutput,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRuleExecutionsInput,
  ) => stream.Stream<
    RuleExecutionDetail,
    | InvalidNextTokenException
    | PipelineExecutionNotFoundException
    | PipelineNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRuleExecutionsInput,
  output: ListRuleExecutionsOutput,
  errors: [
    InvalidNextTokenException,
    PipelineExecutionNotFoundException,
    PipelineNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "ruleExecutionDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a pipeline.
 *
 * In the pipeline structure, you must include either `artifactStore`
 * or `artifactStores` in your pipeline, but you cannot use both. If you
 * create a cross-region action in your pipeline, you must use
 * `artifactStores`.
 */
export const createPipeline: (
  input: CreatePipelineInput,
) => effect.Effect<
  CreatePipelineOutput,
  | ConcurrentModificationException
  | InvalidActionDeclarationException
  | InvalidBlockerDeclarationException
  | InvalidStageDeclarationException
  | InvalidStructureException
  | InvalidTagsException
  | LimitExceededException
  | PipelineNameInUseException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipelineInput,
  output: CreatePipelineOutput,
  errors: [
    ConcurrentModificationException,
    InvalidActionDeclarationException,
    InvalidBlockerDeclarationException,
    InvalidStageDeclarationException,
    InvalidStructureException,
    InvalidTagsException,
    LimitExceededException,
    PipelineNameInUseException,
    TooManyTagsException,
    ValidationException,
  ],
}));
