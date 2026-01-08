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
  sdkId: "Bedrock",
  serviceShapeName: "AmazonBedrockControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "bedrock" });
const ver = T.ServiceVersion("2023-04-20");
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
              `https://bedrock-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bedrock-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://bedrock.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://bedrock.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type AutomatedReasoningPolicyName = string | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDescription =
  | string
  | Redacted.Redacted<string>;
export type IdempotencyToken = string;
export type KmsKeyId = string;
export type AutomatedReasoningPolicyArn = string;
export type PaginationToken = string;
export type MaxResults = number;
export type AutomatedReasoningPolicyBuildWorkflowId = string;
export type AutomatedReasoningPolicyTestGuardContent =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyTestQueryContent =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningCheckTranslationConfidence = number;
export type AutomatedReasoningPolicyHash = string;
export type AutomatedReasoningPolicyTestCaseId = string;
export type ModelSourceIdentifier = string;
export type EndpointName = string;
export type Arn = string;
export type ModelDeploymentName = string;
export type CustomModelArn = string;
export type CustomModelDeploymentDescription = string;
export type CustomModelDeploymentIdentifier = string;
export type CustomModelName = string;
export type KmsKeyArn = string;
export type RoleArn = string;
export type ModelIdentifier = string;
export type ModelArn = string;
export type FoundationModelArn = string;
export type AccountEnforcedGuardrailConfigurationId = string;
export type EvaluationJobIdentifier = string | Redacted.Redacted<string>;
export type EvaluationJobName = string;
export type EvaluationJobDescription = string | Redacted.Redacted<string>;
export type GuardrailName = string | Redacted.Redacted<string>;
export type GuardrailDescription = string | Redacted.Redacted<string>;
export type GuardrailBlockedMessaging = string | Redacted.Redacted<string>;
export type GuardrailIdentifier = string;
export type GuardrailVersion = string;
export type GuardrailNumericalVersion = string;
export type InferenceProfileName = string;
export type InferenceProfileDescription = string | Redacted.Redacted<string>;
export type InferenceProfileIdentifier = string;
export type NonBlankString = string;
export type ModelCopyJobArn = string;
export type AccountId = string;
export type JobName = string;
export type ImportedModelName = string;
export type ImportedModelIdentifier = string;
export type ModelImportJobIdentifier = string;
export type ModelInvocationJobName = string;
export type ModelInvocationIdempotencyToken = string;
export type ModelId = string;
export type ModelInvocationJobTimeoutDurationInHours = number;
export type ModelInvocationJobIdentifier = string;
export type GetFoundationModelIdentifier = string;
export type Provider = string;
export type PromptRouterName = string;
export type PromptRouterDescription = string | Redacted.Redacted<string>;
export type PromptRouterArn = string;
export type PositiveInteger = number;
export type ProvisionedModelName = string;
export type ProvisionedModelId = string;
export type OfferToken = string;
export type BedrockModelId = string;
export type TaggableResourcesArn = string;
export type TagKey = string;
export type BaseModelIdentifier = string;
export type ModelCustomizationJobIdentifier = string;
export type AutomatedReasoningPolicyFormatVersion = string;
export type TagValue = string;
export type S3Uri = string;
export type AutomatedReasoningConfidenceFilterThreshold = number;
export type GuardrailCrossRegionGuardrailProfileIdentifier = string;
export type InferenceProfileModelSourceArn = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type PromptRouterTargetModelArn = string;
export type AutomatedReasoningPolicyVersion = string;
export type AutomatedReasoningPolicyId = string;
export type AutomatedReasoningPolicyBuildDocumentName =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyBuildDocumentDescription =
  | string
  | Redacted.Redacted<string>;
export type CustomModelDeploymentArn = string;
export type ErrorMessage = string;
export type ModelCustomizationJobArn = string;
export type EvaluationJobArn = string;
export type GuardrailId = string;
export type GuardrailArn = string;
export type GuardrailStatusReason = string | Redacted.Redacted<string>;
export type GuardrailFailureRecommendation = string | Redacted.Redacted<string>;
export type GuardrailDraftVersion = string;
export type InferenceProfileArn = string;
export type InferenceProfileId = string;
export type ImportedModelArn = string;
export type ModelImportJobArn = string;
export type ModelInvocationJobArn = string;
export type Message = string | Redacted.Redacted<string>;
export type ProvisionedModelArn = string;
export type AutomatedReasoningPolicyDefinitionTypeName =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDefinitionTypeDescription =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDefinitionRuleId = string;
export type AutomatedReasoningPolicyDefinitionRuleExpression =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDefinitionRuleAlternateExpression =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDefinitionVariableName =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyDefinitionVariableDescription =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyAnnotationRuleNaturalLanguage =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyAnnotationFeedbackNaturalLanguage =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyScenarioExpression =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningPolicyAnnotationIngestContent =
  | string
  | Redacted.Redacted<string>;
export type InstanceCount = number;
export type InstanceType = string;
export type GuardrailTopicName = string | Redacted.Redacted<string>;
export type GuardrailTopicDefinition = string | Redacted.Redacted<string>;
export type GuardrailTopicExample = string | Redacted.Redacted<string>;
export type LogGroupName = string;
export type BucketName = string;
export type KeyPrefix = string;
export type AutomatedReasoningPolicyScenarioAlternateExpression =
  | string
  | Redacted.Redacted<string>;
export type MetricFloat = number;
export type ModelName = string;
export type ConfigurationOwner = string;
export type EvaluationBedrockModelIdentifier = string;
export type KnowledgeBaseId = string;
export type EvaluatorModelIdentifier = string;
export type GuardrailCrossRegionGuardrailProfileId = string;
export type GuardrailCrossRegionGuardrailProfileArn = string;
export type CustomModelUnitsVersion = string;
export type ModelArchitecture = string;
export type BrandedName = string;
export type OfferId = string;
export type AutomatedReasoningPolicyDefinitionTypeValueName = string;
export type AutomatedReasoningPolicyDefinitionTypeValueDescription =
  | string
  | Redacted.Redacted<string>;
export type EvaluationMetricName = string | Redacted.Redacted<string>;
export type SageMakerFlowDefinitionArn = string;
export type HumanTaskInstructions = string | Redacted.Redacted<string>;
export type EvaluationMetricDescription = string | Redacted.Redacted<string>;
export type EvaluationRatingMethod = string;
export type EvaluationModelInferenceParams = string | Redacted.Redacted<string>;
export type EvaluationPrecomputedInferenceSourceIdentifier = string;
export type TeacherModelIdentifier = string;
export type EpochCount = number;
export type RFTBatchSize = number;
export type RFTLearningRate = number;
export type RFTMaxPromptLength = number;
export type RFTTrainingSamplePerPrompt = number;
export type RFTInferenceMaxTokens = number;
export type RFTEvalInterval = number;
export type EvaluationDatasetName = string | Redacted.Redacted<string>;
export type EvaluationPrecomputedRagSourceIdentifier = string;
export type LambdaArn = string;
export type MetricName = string | Redacted.Redacted<string>;
export type CustomMetricInstructions = string;
export type BedrockModelArn = string;
export type RatingScaleItemDefinition = string;
export type AutomatedReasoningLogicStatementContent =
  | string
  | Redacted.Redacted<string>;
export type AutomatedReasoningNaturalLanguageStatementContent =
  | string
  | Redacted.Redacted<string>;
export type TextPromptTemplate = string | Redacted.Redacted<string>;
export type AdditionalModelRequestFieldsKey = string;
export type kBS3Uri = string;
export type Identifier = string | Redacted.Redacted<string>;
export type ContentType = string;
export type FilterKey = string;
export type Temperature = number;
export type TopP = number;
export type MaxTokens = number;
export type BedrockRerankingModelArn = string;

//# Schemas
export interface GetUseCaseForModelAccessRequest {}
export const GetUseCaseForModelAccessRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/use-case-for-model-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetUseCaseForModelAccessRequest",
}) as any as S.Schema<GetUseCaseForModelAccessRequest>;
export interface DeleteModelInvocationLoggingConfigurationRequest {}
export const DeleteModelInvocationLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/logging/modelinvocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteModelInvocationLoggingConfigurationRequest",
}) as any as S.Schema<DeleteModelInvocationLoggingConfigurationRequest>;
export interface DeleteModelInvocationLoggingConfigurationResponse {}
export const DeleteModelInvocationLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteModelInvocationLoggingConfigurationResponse",
}) as any as S.Schema<DeleteModelInvocationLoggingConfigurationResponse>;
export interface GetModelInvocationLoggingConfigurationRequest {}
export const GetModelInvocationLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/logging/modelinvocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelInvocationLoggingConfigurationRequest",
}) as any as S.Schema<GetModelInvocationLoggingConfigurationRequest>;
export type AutomatedReasoningPolicyTestCaseIdList = string[];
export const AutomatedReasoningPolicyTestCaseIdList = S.Array(S.String);
export type EvaluationJobIdentifiers = string | Redacted.Redacted<string>[];
export const EvaluationJobIdentifiers = S.Array(SensitiveString);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface GetUseCaseForModelAccessResponse {
  formData: Uint8Array;
}
export const GetUseCaseForModelAccessResponse = S.suspend(() =>
  S.Struct({ formData: T.Blob }),
).annotations({
  identifier: "GetUseCaseForModelAccessResponse",
}) as any as S.Schema<GetUseCaseForModelAccessResponse>;
export interface PutUseCaseForModelAccessRequest {
  formData: Uint8Array;
}
export const PutUseCaseForModelAccessRequest = S.suspend(() =>
  S.Struct({ formData: T.Blob }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/use-case-for-model-access" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutUseCaseForModelAccessRequest",
}) as any as S.Schema<PutUseCaseForModelAccessRequest>;
export interface PutUseCaseForModelAccessResponse {}
export const PutUseCaseForModelAccessResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutUseCaseForModelAccessResponse",
}) as any as S.Schema<PutUseCaseForModelAccessResponse>;
export interface GetAutomatedReasoningPolicyRequest {
  policyArn: string;
}
export const GetAutomatedReasoningPolicyRequest = S.suspend(() =>
  S.Struct({ policyArn: S.String.pipe(T.HttpLabel("policyArn")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyRequest>;
export interface AutomatedReasoningPolicyDefinitionTypeValue {
  value: string;
  description?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDefinitionTypeValue = S.suspend(() =>
  S.Struct({ value: S.String, description: S.optional(SensitiveString) }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionTypeValue",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionTypeValue>;
export type AutomatedReasoningPolicyDefinitionTypeValueList =
  AutomatedReasoningPolicyDefinitionTypeValue[];
export const AutomatedReasoningPolicyDefinitionTypeValueList = S.Array(
  AutomatedReasoningPolicyDefinitionTypeValue,
);
export interface AutomatedReasoningPolicyDefinitionType {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  values: AutomatedReasoningPolicyDefinitionTypeValueList;
}
export const AutomatedReasoningPolicyDefinitionType = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    values: AutomatedReasoningPolicyDefinitionTypeValueList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionType",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionType>;
export type AutomatedReasoningPolicyDefinitionTypeList =
  AutomatedReasoningPolicyDefinitionType[];
export const AutomatedReasoningPolicyDefinitionTypeList = S.Array(
  AutomatedReasoningPolicyDefinitionType,
);
export interface AutomatedReasoningPolicyDefinitionRule {
  id: string;
  expression: string | Redacted.Redacted<string>;
  alternateExpression?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDefinitionRule = S.suspend(() =>
  S.Struct({
    id: S.String,
    expression: SensitiveString,
    alternateExpression: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionRule",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionRule>;
export type AutomatedReasoningPolicyDefinitionRuleList =
  AutomatedReasoningPolicyDefinitionRule[];
export const AutomatedReasoningPolicyDefinitionRuleList = S.Array(
  AutomatedReasoningPolicyDefinitionRule,
);
export interface AutomatedReasoningPolicyDefinitionVariable {
  name: string | Redacted.Redacted<string>;
  type: string | Redacted.Redacted<string>;
  description: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDefinitionVariable = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    type: SensitiveString,
    description: SensitiveString,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionVariable",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionVariable>;
export type AutomatedReasoningPolicyDefinitionVariableList =
  AutomatedReasoningPolicyDefinitionVariable[];
export const AutomatedReasoningPolicyDefinitionVariableList = S.Array(
  AutomatedReasoningPolicyDefinitionVariable,
);
export interface AutomatedReasoningPolicyDefinition {
  version?: string;
  types?: AutomatedReasoningPolicyDefinitionTypeList;
  rules?: AutomatedReasoningPolicyDefinitionRuleList;
  variables?: AutomatedReasoningPolicyDefinitionVariableList;
}
export const AutomatedReasoningPolicyDefinition = S.suspend(() =>
  S.Struct({
    version: S.optional(S.String),
    types: S.optional(AutomatedReasoningPolicyDefinitionTypeList),
    rules: S.optional(AutomatedReasoningPolicyDefinitionRuleList),
    variables: S.optional(AutomatedReasoningPolicyDefinitionVariableList),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinition",
}) as any as S.Schema<AutomatedReasoningPolicyDefinition>;
export interface UpdateAutomatedReasoningPolicyRequest {
  policyArn: string;
  policyDefinition: AutomatedReasoningPolicyDefinition;
  name?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
}
export const UpdateAutomatedReasoningPolicyRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    policyDefinition: AutomatedReasoningPolicyDefinition,
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/automated-reasoning-policies/{policyArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyRequest",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyRequest>;
export interface DeleteAutomatedReasoningPolicyRequest {
  policyArn: string;
  force?: boolean;
}
export const DeleteAutomatedReasoningPolicyRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    force: S.optional(S.Boolean).pipe(T.HttpQuery("force")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/automated-reasoning-policies/{policyArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyRequest",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyRequest>;
export interface DeleteAutomatedReasoningPolicyResponse {}
export const DeleteAutomatedReasoningPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyResponse",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyResponse>;
export interface ListAutomatedReasoningPoliciesRequest {
  policyArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAutomatedReasoningPoliciesRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.optional(S.String).pipe(T.HttpQuery("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/automated-reasoning-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomatedReasoningPoliciesRequest",
}) as any as S.Schema<ListAutomatedReasoningPoliciesRequest>;
export interface CancelAutomatedReasoningPolicyBuildWorkflowRequest {
  policyArn: string;
  buildWorkflowId: string;
}
export const CancelAutomatedReasoningPolicyBuildWorkflowRequest = S.suspend(
  () =>
    S.Struct({
      policyArn: S.String.pipe(T.HttpLabel("policyArn")),
      buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/cancel",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "CancelAutomatedReasoningPolicyBuildWorkflowRequest",
}) as any as S.Schema<CancelAutomatedReasoningPolicyBuildWorkflowRequest>;
export interface CancelAutomatedReasoningPolicyBuildWorkflowResponse {}
export const CancelAutomatedReasoningPolicyBuildWorkflowResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "CancelAutomatedReasoningPolicyBuildWorkflowResponse",
}) as any as S.Schema<CancelAutomatedReasoningPolicyBuildWorkflowResponse>;
export interface CreateAutomatedReasoningPolicyTestCaseRequest {
  policyArn: string;
  guardContent: string | Redacted.Redacted<string>;
  queryContent?: string | Redacted.Redacted<string>;
  expectedAggregatedFindingsResult: string;
  clientRequestToken?: string;
  confidenceThreshold?: number;
}
export const CreateAutomatedReasoningPolicyTestCaseRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    guardContent: SensitiveString,
    queryContent: S.optional(SensitiveString),
    expectedAggregatedFindingsResult: S.String,
    clientRequestToken: S.optional(S.String),
    confidenceThreshold: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/automated-reasoning-policies/{policyArn}/test-cases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyTestCaseRequest",
}) as any as S.Schema<CreateAutomatedReasoningPolicyTestCaseRequest>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateAutomatedReasoningPolicyVersionRequest {
  policyArn: string;
  clientRequestToken?: string;
  lastUpdatedDefinitionHash: string;
  tags?: TagList;
}
export const CreateAutomatedReasoningPolicyVersionRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    clientRequestToken: S.optional(S.String),
    lastUpdatedDefinitionHash: S.String,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/automated-reasoning-policies/{policyArn}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyVersionRequest",
}) as any as S.Schema<CreateAutomatedReasoningPolicyVersionRequest>;
export interface DeleteAutomatedReasoningPolicyBuildWorkflowRequest {
  policyArn: string;
  buildWorkflowId: string;
  lastUpdatedAt: Date;
}
export const DeleteAutomatedReasoningPolicyBuildWorkflowRequest = S.suspend(
  () =>
    S.Struct({
      policyArn: S.String.pipe(T.HttpLabel("policyArn")),
      buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
      lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
        T.HttpQuery("updatedAt"),
      ),
    }).pipe(
      T.all(
        T.Http({
          method: "DELETE",
          uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyBuildWorkflowRequest",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyBuildWorkflowRequest>;
export interface DeleteAutomatedReasoningPolicyBuildWorkflowResponse {}
export const DeleteAutomatedReasoningPolicyBuildWorkflowResponse = S.suspend(
  () => S.Struct({}),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyBuildWorkflowResponse",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyBuildWorkflowResponse>;
export interface DeleteAutomatedReasoningPolicyTestCaseRequest {
  policyArn: string;
  testCaseId: string;
  lastUpdatedAt: Date;
}
export const DeleteAutomatedReasoningPolicyTestCaseRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
      T.HttpQuery("updatedAt"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyTestCaseRequest",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyTestCaseRequest>;
export interface DeleteAutomatedReasoningPolicyTestCaseResponse {}
export const DeleteAutomatedReasoningPolicyTestCaseResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAutomatedReasoningPolicyTestCaseResponse",
}) as any as S.Schema<DeleteAutomatedReasoningPolicyTestCaseResponse>;
export interface ExportAutomatedReasoningPolicyVersionRequest {
  policyArn: string;
}
export const ExportAutomatedReasoningPolicyVersionRequest = S.suspend(() =>
  S.Struct({ policyArn: S.String.pipe(T.HttpLabel("policyArn")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/export",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportAutomatedReasoningPolicyVersionRequest",
}) as any as S.Schema<ExportAutomatedReasoningPolicyVersionRequest>;
export interface GetAutomatedReasoningPolicyAnnotationsRequest {
  policyArn: string;
  buildWorkflowId: string;
}
export const GetAutomatedReasoningPolicyAnnotationsRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyAnnotationsRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyAnnotationsRequest>;
export interface GetAutomatedReasoningPolicyBuildWorkflowRequest {
  policyArn: string;
  buildWorkflowId: string;
}
export const GetAutomatedReasoningPolicyBuildWorkflowRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyBuildWorkflowRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyBuildWorkflowRequest>;
export interface GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest {
  policyArn: string;
  buildWorkflowId: string;
  assetType: string;
}
export const GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest =
  S.suspend(() =>
    S.Struct({
      policyArn: S.String.pipe(T.HttpLabel("policyArn")),
      buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
      assetType: S.String.pipe(T.HttpQuery("assetType")),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/result-assets",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest",
  }) as any as S.Schema<GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest>;
export interface GetAutomatedReasoningPolicyNextScenarioRequest {
  policyArn: string;
  buildWorkflowId: string;
}
export const GetAutomatedReasoningPolicyNextScenarioRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/scenarios",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyNextScenarioRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyNextScenarioRequest>;
export interface GetAutomatedReasoningPolicyTestCaseRequest {
  policyArn: string;
  testCaseId: string;
}
export const GetAutomatedReasoningPolicyTestCaseRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyTestCaseRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyTestCaseRequest>;
export interface GetAutomatedReasoningPolicyTestResultRequest {
  policyArn: string;
  buildWorkflowId: string;
  testCaseId: string;
}
export const GetAutomatedReasoningPolicyTestResultRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-cases/{testCaseId}/test-results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAutomatedReasoningPolicyTestResultRequest",
}) as any as S.Schema<GetAutomatedReasoningPolicyTestResultRequest>;
export interface ListAutomatedReasoningPolicyBuildWorkflowsRequest {
  policyArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAutomatedReasoningPolicyBuildWorkflowsRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomatedReasoningPolicyBuildWorkflowsRequest",
}) as any as S.Schema<ListAutomatedReasoningPolicyBuildWorkflowsRequest>;
export interface ListAutomatedReasoningPolicyTestCasesRequest {
  policyArn: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAutomatedReasoningPolicyTestCasesRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/test-cases",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomatedReasoningPolicyTestCasesRequest",
}) as any as S.Schema<ListAutomatedReasoningPolicyTestCasesRequest>;
export interface ListAutomatedReasoningPolicyTestResultsRequest {
  policyArn: string;
  buildWorkflowId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAutomatedReasoningPolicyTestResultsRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAutomatedReasoningPolicyTestResultsRequest",
}) as any as S.Schema<ListAutomatedReasoningPolicyTestResultsRequest>;
export interface StartAutomatedReasoningPolicyTestWorkflowRequest {
  policyArn: string;
  buildWorkflowId: string;
  testCaseIds?: AutomatedReasoningPolicyTestCaseIdList;
  clientRequestToken?: string;
}
export const StartAutomatedReasoningPolicyTestWorkflowRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    testCaseIds: S.optional(AutomatedReasoningPolicyTestCaseIdList),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/test-workflows",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAutomatedReasoningPolicyTestWorkflowRequest",
}) as any as S.Schema<StartAutomatedReasoningPolicyTestWorkflowRequest>;
export interface UpdateAutomatedReasoningPolicyTestCaseRequest {
  policyArn: string;
  testCaseId: string;
  guardContent: string | Redacted.Redacted<string>;
  queryContent?: string | Redacted.Redacted<string>;
  lastUpdatedAt: Date;
  expectedAggregatedFindingsResult: string;
  confidenceThreshold?: number;
  clientRequestToken?: string;
}
export const UpdateAutomatedReasoningPolicyTestCaseRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    testCaseId: S.String.pipe(T.HttpLabel("testCaseId")),
    guardContent: SensitiveString,
    queryContent: S.optional(SensitiveString),
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    expectedAggregatedFindingsResult: S.String,
    confidenceThreshold: S.optional(S.Number),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/automated-reasoning-policies/{policyArn}/test-cases/{testCaseId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyTestCaseRequest",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyTestCaseRequest>;
export interface DeleteMarketplaceModelEndpointRequest {
  endpointArn: string;
}
export const DeleteMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({ endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/marketplace-model/endpoints/{endpointArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMarketplaceModelEndpointRequest",
}) as any as S.Schema<DeleteMarketplaceModelEndpointRequest>;
export interface DeleteMarketplaceModelEndpointResponse {}
export const DeleteMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMarketplaceModelEndpointResponse",
}) as any as S.Schema<DeleteMarketplaceModelEndpointResponse>;
export interface DeregisterMarketplaceModelEndpointRequest {
  endpointArn: string;
}
export const DeregisterMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({ endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/marketplace-model/endpoints/{endpointArn}/registration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterMarketplaceModelEndpointRequest",
}) as any as S.Schema<DeregisterMarketplaceModelEndpointRequest>;
export interface DeregisterMarketplaceModelEndpointResponse {}
export const DeregisterMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterMarketplaceModelEndpointResponse",
}) as any as S.Schema<DeregisterMarketplaceModelEndpointResponse>;
export interface GetMarketplaceModelEndpointRequest {
  endpointArn: string;
}
export const GetMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({ endpointArn: S.String.pipe(T.HttpLabel("endpointArn")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/marketplace-model/endpoints/{endpointArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMarketplaceModelEndpointRequest",
}) as any as S.Schema<GetMarketplaceModelEndpointRequest>;
export interface ListMarketplaceModelEndpointsRequest {
  maxResults?: number;
  nextToken?: string;
  modelSourceEquals?: string;
}
export const ListMarketplaceModelEndpointsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    modelSourceEquals: S.optional(S.String).pipe(
      T.HttpQuery("modelSourceIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/marketplace-model/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMarketplaceModelEndpointsRequest",
}) as any as S.Schema<ListMarketplaceModelEndpointsRequest>;
export interface RegisterMarketplaceModelEndpointRequest {
  endpointIdentifier: string;
  modelSourceIdentifier: string;
}
export const RegisterMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({
    endpointIdentifier: S.String.pipe(T.HttpLabel("endpointIdentifier")),
    modelSourceIdentifier: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/marketplace-model/endpoints/{endpointIdentifier}/registration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterMarketplaceModelEndpointRequest",
}) as any as S.Schema<RegisterMarketplaceModelEndpointRequest>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface VpcConfig {
  subnetIds: SubnetIds;
  securityGroupIds: SecurityGroupIds;
}
export const VpcConfig = S.suspend(() =>
  S.Struct({ subnetIds: SubnetIds, securityGroupIds: SecurityGroupIds }),
).annotations({ identifier: "VpcConfig" }) as any as S.Schema<VpcConfig>;
export interface SageMakerEndpoint {
  initialInstanceCount: number;
  instanceType: string;
  executionRole: string;
  kmsEncryptionKey?: string;
  vpc?: VpcConfig;
}
export const SageMakerEndpoint = S.suspend(() =>
  S.Struct({
    initialInstanceCount: S.Number,
    instanceType: S.String,
    executionRole: S.String,
    kmsEncryptionKey: S.optional(S.String),
    vpc: S.optional(VpcConfig),
  }),
).annotations({
  identifier: "SageMakerEndpoint",
}) as any as S.Schema<SageMakerEndpoint>;
export type EndpointConfig = { sageMaker: SageMakerEndpoint };
export const EndpointConfig = S.Union(
  S.Struct({ sageMaker: SageMakerEndpoint }),
);
export interface UpdateMarketplaceModelEndpointRequest {
  endpointArn: string;
  endpointConfig: (typeof EndpointConfig)["Type"];
  clientRequestToken?: string;
}
export const UpdateMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({
    endpointArn: S.String.pipe(T.HttpLabel("endpointArn")),
    endpointConfig: EndpointConfig,
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/marketplace-model/endpoints/{endpointArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMarketplaceModelEndpointRequest",
}) as any as S.Schema<UpdateMarketplaceModelEndpointRequest>;
export interface CreateCustomModelDeploymentRequest {
  modelDeploymentName: string;
  modelArn: string;
  description?: string;
  tags?: TagList;
  clientRequestToken?: string;
}
export const CreateCustomModelDeploymentRequest = S.suspend(() =>
  S.Struct({
    modelDeploymentName: S.String,
    modelArn: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/model-customization/custom-model-deployments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomModelDeploymentRequest",
}) as any as S.Schema<CreateCustomModelDeploymentRequest>;
export interface DeleteCustomModelDeploymentRequest {
  customModelDeploymentIdentifier: string;
}
export const DeleteCustomModelDeploymentRequest = S.suspend(() =>
  S.Struct({
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomModelDeploymentRequest",
}) as any as S.Schema<DeleteCustomModelDeploymentRequest>;
export interface DeleteCustomModelDeploymentResponse {}
export const DeleteCustomModelDeploymentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomModelDeploymentResponse",
}) as any as S.Schema<DeleteCustomModelDeploymentResponse>;
export interface GetCustomModelDeploymentRequest {
  customModelDeploymentIdentifier: string;
}
export const GetCustomModelDeploymentRequest = S.suspend(() =>
  S.Struct({
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomModelDeploymentRequest",
}) as any as S.Schema<GetCustomModelDeploymentRequest>;
export interface ListCustomModelDeploymentsRequest {
  createdBefore?: Date;
  createdAfter?: Date;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
  statusEquals?: string;
  modelArnEquals?: string;
}
export const ListCustomModelDeploymentsRequest = S.suspend(() =>
  S.Struct({
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    modelArnEquals: S.optional(S.String).pipe(T.HttpQuery("modelArnEquals")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/model-customization/custom-model-deployments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomModelDeploymentsRequest",
}) as any as S.Schema<ListCustomModelDeploymentsRequest>;
export interface UpdateCustomModelDeploymentRequest {
  modelArn: string;
  customModelDeploymentIdentifier: string;
}
export const UpdateCustomModelDeploymentRequest = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    customModelDeploymentIdentifier: S.String.pipe(
      T.HttpLabel("customModelDeploymentIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/model-customization/custom-model-deployments/{customModelDeploymentIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateCustomModelDeploymentRequest",
}) as any as S.Schema<UpdateCustomModelDeploymentRequest>;
export interface DeleteCustomModelRequest {
  modelIdentifier: string;
}
export const DeleteCustomModelRequest = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/custom-models/{modelIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCustomModelRequest",
}) as any as S.Schema<DeleteCustomModelRequest>;
export interface DeleteCustomModelResponse {}
export const DeleteCustomModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCustomModelResponse",
}) as any as S.Schema<DeleteCustomModelResponse>;
export interface GetCustomModelRequest {
  modelIdentifier: string;
}
export const GetCustomModelRequest = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-models/{modelIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCustomModelRequest",
}) as any as S.Schema<GetCustomModelRequest>;
export interface ListCustomModelsRequest {
  creationTimeBefore?: Date;
  creationTimeAfter?: Date;
  nameContains?: string;
  baseModelArnEquals?: string;
  foundationModelArnEquals?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
  isOwned?: boolean;
  modelStatus?: string;
}
export const ListCustomModelsRequest = S.suspend(() =>
  S.Struct({
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    baseModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("baseModelArnEquals"),
    ),
    foundationModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("foundationModelArnEquals"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
    isOwned: S.optional(S.Boolean).pipe(T.HttpQuery("isOwned")),
    modelStatus: S.optional(S.String).pipe(T.HttpQuery("modelStatus")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/custom-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomModelsRequest",
}) as any as S.Schema<ListCustomModelsRequest>;
export interface DeleteEnforcedGuardrailConfigurationRequest {
  configId: string;
}
export const DeleteEnforcedGuardrailConfigurationRequest = S.suspend(() =>
  S.Struct({ configId: S.String.pipe(T.HttpLabel("configId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/enforcedGuardrailsConfiguration/{configId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnforcedGuardrailConfigurationRequest",
}) as any as S.Schema<DeleteEnforcedGuardrailConfigurationRequest>;
export interface DeleteEnforcedGuardrailConfigurationResponse {}
export const DeleteEnforcedGuardrailConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnforcedGuardrailConfigurationResponse",
}) as any as S.Schema<DeleteEnforcedGuardrailConfigurationResponse>;
export interface ListEnforcedGuardrailsConfigurationRequest {
  nextToken?: string;
}
export const ListEnforcedGuardrailsConfigurationRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/enforcedGuardrailsConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnforcedGuardrailsConfigurationRequest",
}) as any as S.Schema<ListEnforcedGuardrailsConfigurationRequest>;
export interface BatchDeleteEvaluationJobRequest {
  jobIdentifiers: EvaluationJobIdentifiers;
}
export const BatchDeleteEvaluationJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifiers: EvaluationJobIdentifiers }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluation-jobs/batch-delete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteEvaluationJobRequest",
}) as any as S.Schema<BatchDeleteEvaluationJobRequest>;
export interface GetEvaluationJobRequest {
  jobIdentifier: string | Redacted.Redacted<string>;
}
export const GetEvaluationJobRequest = S.suspend(() =>
  S.Struct({
    jobIdentifier: SensitiveString.pipe(T.HttpLabel("jobIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/evaluation-jobs/{jobIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEvaluationJobRequest",
}) as any as S.Schema<GetEvaluationJobRequest>;
export interface ListEvaluationJobsRequest {
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  statusEquals?: string;
  applicationTypeEquals?: string;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListEvaluationJobsRequest = S.suspend(() =>
  S.Struct({
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    applicationTypeEquals: S.optional(S.String).pipe(
      T.HttpQuery("applicationTypeEquals"),
    ),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/evaluation-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEvaluationJobsRequest",
}) as any as S.Schema<ListEvaluationJobsRequest>;
export interface StopEvaluationJobRequest {
  jobIdentifier: string | Redacted.Redacted<string>;
}
export const StopEvaluationJobRequest = S.suspend(() =>
  S.Struct({
    jobIdentifier: SensitiveString.pipe(T.HttpLabel("jobIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluation-job/{jobIdentifier}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopEvaluationJobRequest",
}) as any as S.Schema<StopEvaluationJobRequest>;
export interface StopEvaluationJobResponse {}
export const StopEvaluationJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopEvaluationJobResponse",
}) as any as S.Schema<StopEvaluationJobResponse>;
export interface GetGuardrailRequest {
  guardrailIdentifier: string;
  guardrailVersion?: string;
}
export const GetGuardrailRequest = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpQuery("guardrailVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/guardrails/{guardrailIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetGuardrailRequest",
}) as any as S.Schema<GetGuardrailRequest>;
export type GuardrailTopicExamples = string | Redacted.Redacted<string>[];
export const GuardrailTopicExamples = S.Array(SensitiveString);
export interface GuardrailTopicConfig {
  name: string | Redacted.Redacted<string>;
  definition: string | Redacted.Redacted<string>;
  examples?: GuardrailTopicExamples;
  type: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailTopicConfig = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    definition: SensitiveString,
    examples: S.optional(GuardrailTopicExamples),
    type: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailTopicConfig",
}) as any as S.Schema<GuardrailTopicConfig>;
export type GuardrailTopicsConfig = GuardrailTopicConfig[];
export const GuardrailTopicsConfig = S.Array(GuardrailTopicConfig);
export interface GuardrailTopicsTierConfig {
  tierName: string;
}
export const GuardrailTopicsTierConfig = S.suspend(() =>
  S.Struct({ tierName: S.String }),
).annotations({
  identifier: "GuardrailTopicsTierConfig",
}) as any as S.Schema<GuardrailTopicsTierConfig>;
export interface GuardrailTopicPolicyConfig {
  topicsConfig: GuardrailTopicsConfig;
  tierConfig?: GuardrailTopicsTierConfig;
}
export const GuardrailTopicPolicyConfig = S.suspend(() =>
  S.Struct({
    topicsConfig: GuardrailTopicsConfig,
    tierConfig: S.optional(GuardrailTopicsTierConfig),
  }),
).annotations({
  identifier: "GuardrailTopicPolicyConfig",
}) as any as S.Schema<GuardrailTopicPolicyConfig>;
export type GuardrailModalities = string[];
export const GuardrailModalities = S.Array(S.String);
export interface GuardrailContentFilterConfig {
  type: string;
  inputStrength: string;
  outputStrength: string;
  inputModalities?: GuardrailModalities;
  outputModalities?: GuardrailModalities;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailContentFilterConfig = S.suspend(() =>
  S.Struct({
    type: S.String,
    inputStrength: S.String,
    outputStrength: S.String,
    inputModalities: S.optional(GuardrailModalities),
    outputModalities: S.optional(GuardrailModalities),
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailContentFilterConfig",
}) as any as S.Schema<GuardrailContentFilterConfig>;
export type GuardrailContentFiltersConfig = GuardrailContentFilterConfig[];
export const GuardrailContentFiltersConfig = S.Array(
  GuardrailContentFilterConfig,
);
export interface GuardrailContentFiltersTierConfig {
  tierName: string;
}
export const GuardrailContentFiltersTierConfig = S.suspend(() =>
  S.Struct({ tierName: S.String }),
).annotations({
  identifier: "GuardrailContentFiltersTierConfig",
}) as any as S.Schema<GuardrailContentFiltersTierConfig>;
export interface GuardrailContentPolicyConfig {
  filtersConfig: GuardrailContentFiltersConfig;
  tierConfig?: GuardrailContentFiltersTierConfig;
}
export const GuardrailContentPolicyConfig = S.suspend(() =>
  S.Struct({
    filtersConfig: GuardrailContentFiltersConfig,
    tierConfig: S.optional(GuardrailContentFiltersTierConfig),
  }),
).annotations({
  identifier: "GuardrailContentPolicyConfig",
}) as any as S.Schema<GuardrailContentPolicyConfig>;
export interface GuardrailWordConfig {
  text: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailWordConfig = S.suspend(() =>
  S.Struct({
    text: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailWordConfig",
}) as any as S.Schema<GuardrailWordConfig>;
export type GuardrailWordsConfig = GuardrailWordConfig[];
export const GuardrailWordsConfig = S.Array(GuardrailWordConfig);
export interface GuardrailManagedWordsConfig {
  type: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailManagedWordsConfig = S.suspend(() =>
  S.Struct({
    type: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailManagedWordsConfig",
}) as any as S.Schema<GuardrailManagedWordsConfig>;
export type GuardrailManagedWordListsConfig = GuardrailManagedWordsConfig[];
export const GuardrailManagedWordListsConfig = S.Array(
  GuardrailManagedWordsConfig,
);
export interface GuardrailWordPolicyConfig {
  wordsConfig?: GuardrailWordsConfig;
  managedWordListsConfig?: GuardrailManagedWordListsConfig;
}
export const GuardrailWordPolicyConfig = S.suspend(() =>
  S.Struct({
    wordsConfig: S.optional(GuardrailWordsConfig),
    managedWordListsConfig: S.optional(GuardrailManagedWordListsConfig),
  }),
).annotations({
  identifier: "GuardrailWordPolicyConfig",
}) as any as S.Schema<GuardrailWordPolicyConfig>;
export interface GuardrailPiiEntityConfig {
  type: string;
  action: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailPiiEntityConfig = S.suspend(() =>
  S.Struct({
    type: S.String,
    action: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailPiiEntityConfig",
}) as any as S.Schema<GuardrailPiiEntityConfig>;
export type GuardrailPiiEntitiesConfig = GuardrailPiiEntityConfig[];
export const GuardrailPiiEntitiesConfig = S.Array(GuardrailPiiEntityConfig);
export interface GuardrailRegexConfig {
  name: string;
  description?: string;
  pattern: string;
  action: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailRegexConfig = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    pattern: S.String,
    action: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailRegexConfig",
}) as any as S.Schema<GuardrailRegexConfig>;
export type GuardrailRegexesConfig = GuardrailRegexConfig[];
export const GuardrailRegexesConfig = S.Array(GuardrailRegexConfig);
export interface GuardrailSensitiveInformationPolicyConfig {
  piiEntitiesConfig?: GuardrailPiiEntitiesConfig;
  regexesConfig?: GuardrailRegexesConfig;
}
export const GuardrailSensitiveInformationPolicyConfig = S.suspend(() =>
  S.Struct({
    piiEntitiesConfig: S.optional(GuardrailPiiEntitiesConfig),
    regexesConfig: S.optional(GuardrailRegexesConfig),
  }),
).annotations({
  identifier: "GuardrailSensitiveInformationPolicyConfig",
}) as any as S.Schema<GuardrailSensitiveInformationPolicyConfig>;
export interface GuardrailContextualGroundingFilterConfig {
  type: string;
  threshold: number;
  action?: string;
  enabled?: boolean;
}
export const GuardrailContextualGroundingFilterConfig = S.suspend(() =>
  S.Struct({
    type: S.String,
    threshold: S.Number,
    action: S.optional(S.String),
    enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailContextualGroundingFilterConfig",
}) as any as S.Schema<GuardrailContextualGroundingFilterConfig>;
export type GuardrailContextualGroundingFiltersConfig =
  GuardrailContextualGroundingFilterConfig[];
export const GuardrailContextualGroundingFiltersConfig = S.Array(
  GuardrailContextualGroundingFilterConfig,
);
export interface GuardrailContextualGroundingPolicyConfig {
  filtersConfig: GuardrailContextualGroundingFiltersConfig;
}
export const GuardrailContextualGroundingPolicyConfig = S.suspend(() =>
  S.Struct({ filtersConfig: GuardrailContextualGroundingFiltersConfig }),
).annotations({
  identifier: "GuardrailContextualGroundingPolicyConfig",
}) as any as S.Schema<GuardrailContextualGroundingPolicyConfig>;
export type AutomatedReasoningPolicyArnList = string[];
export const AutomatedReasoningPolicyArnList = S.Array(S.String);
export interface GuardrailAutomatedReasoningPolicyConfig {
  policies: AutomatedReasoningPolicyArnList;
  confidenceThreshold?: number;
}
export const GuardrailAutomatedReasoningPolicyConfig = S.suspend(() =>
  S.Struct({
    policies: AutomatedReasoningPolicyArnList,
    confidenceThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "GuardrailAutomatedReasoningPolicyConfig",
}) as any as S.Schema<GuardrailAutomatedReasoningPolicyConfig>;
export interface GuardrailCrossRegionConfig {
  guardrailProfileIdentifier: string;
}
export const GuardrailCrossRegionConfig = S.suspend(() =>
  S.Struct({ guardrailProfileIdentifier: S.String }),
).annotations({
  identifier: "GuardrailCrossRegionConfig",
}) as any as S.Schema<GuardrailCrossRegionConfig>;
export interface UpdateGuardrailRequest {
  guardrailIdentifier: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  topicPolicyConfig?: GuardrailTopicPolicyConfig;
  contentPolicyConfig?: GuardrailContentPolicyConfig;
  wordPolicyConfig?: GuardrailWordPolicyConfig;
  sensitiveInformationPolicyConfig?: GuardrailSensitiveInformationPolicyConfig;
  contextualGroundingPolicyConfig?: GuardrailContextualGroundingPolicyConfig;
  automatedReasoningPolicyConfig?: GuardrailAutomatedReasoningPolicyConfig;
  crossRegionConfig?: GuardrailCrossRegionConfig;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  kmsKeyId?: string;
}
export const UpdateGuardrailRequest = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    name: SensitiveString,
    description: S.optional(SensitiveString),
    topicPolicyConfig: S.optional(GuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(GuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(GuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      GuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      GuardrailContextualGroundingPolicyConfig,
    ),
    automatedReasoningPolicyConfig: S.optional(
      GuardrailAutomatedReasoningPolicyConfig,
    ),
    crossRegionConfig: S.optional(GuardrailCrossRegionConfig),
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    kmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/guardrails/{guardrailIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateGuardrailRequest",
}) as any as S.Schema<UpdateGuardrailRequest>;
export interface DeleteGuardrailRequest {
  guardrailIdentifier: string;
  guardrailVersion?: string;
}
export const DeleteGuardrailRequest = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    guardrailVersion: S.optional(S.String).pipe(
      T.HttpQuery("guardrailVersion"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/guardrails/{guardrailIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGuardrailRequest",
}) as any as S.Schema<DeleteGuardrailRequest>;
export interface DeleteGuardrailResponse {}
export const DeleteGuardrailResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteGuardrailResponse",
}) as any as S.Schema<DeleteGuardrailResponse>;
export interface ListGuardrailsRequest {
  guardrailIdentifier?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListGuardrailsRequest = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("guardrailIdentifier"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/guardrails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListGuardrailsRequest",
}) as any as S.Schema<ListGuardrailsRequest>;
export interface CreateGuardrailVersionRequest {
  guardrailIdentifier: string;
  description?: string | Redacted.Redacted<string>;
  clientRequestToken?: string;
}
export const CreateGuardrailVersionRequest = S.suspend(() =>
  S.Struct({
    guardrailIdentifier: S.String.pipe(T.HttpLabel("guardrailIdentifier")),
    description: S.optional(SensitiveString),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/guardrails/{guardrailIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGuardrailVersionRequest",
}) as any as S.Schema<CreateGuardrailVersionRequest>;
export interface GetInferenceProfileRequest {
  inferenceProfileIdentifier: string;
}
export const GetInferenceProfileRequest = S.suspend(() =>
  S.Struct({
    inferenceProfileIdentifier: S.String.pipe(
      T.HttpLabel("inferenceProfileIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/inference-profiles/{inferenceProfileIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetInferenceProfileRequest",
}) as any as S.Schema<GetInferenceProfileRequest>;
export interface DeleteInferenceProfileRequest {
  inferenceProfileIdentifier: string;
}
export const DeleteInferenceProfileRequest = S.suspend(() =>
  S.Struct({
    inferenceProfileIdentifier: S.String.pipe(
      T.HttpLabel("inferenceProfileIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/inference-profiles/{inferenceProfileIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInferenceProfileRequest",
}) as any as S.Schema<DeleteInferenceProfileRequest>;
export interface DeleteInferenceProfileResponse {}
export const DeleteInferenceProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInferenceProfileResponse",
}) as any as S.Schema<DeleteInferenceProfileResponse>;
export interface ListInferenceProfilesRequest {
  maxResults?: number;
  nextToken?: string;
  typeEquals?: string;
}
export const ListInferenceProfilesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    typeEquals: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/inference-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInferenceProfilesRequest",
}) as any as S.Schema<ListInferenceProfilesRequest>;
export interface S3Config {
  bucketName: string;
  keyPrefix?: string;
}
export const S3Config = S.suspend(() =>
  S.Struct({ bucketName: S.String, keyPrefix: S.optional(S.String) }),
).annotations({ identifier: "S3Config" }) as any as S.Schema<S3Config>;
export interface CloudWatchConfig {
  logGroupName: string;
  roleArn: string;
  largeDataDeliveryS3Config?: S3Config;
}
export const CloudWatchConfig = S.suspend(() =>
  S.Struct({
    logGroupName: S.String,
    roleArn: S.String,
    largeDataDeliveryS3Config: S.optional(S3Config),
  }),
).annotations({
  identifier: "CloudWatchConfig",
}) as any as S.Schema<CloudWatchConfig>;
export interface LoggingConfig {
  cloudWatchConfig?: CloudWatchConfig;
  s3Config?: S3Config;
  textDataDeliveryEnabled?: boolean;
  imageDataDeliveryEnabled?: boolean;
  embeddingDataDeliveryEnabled?: boolean;
  videoDataDeliveryEnabled?: boolean;
  audioDataDeliveryEnabled?: boolean;
}
export const LoggingConfig = S.suspend(() =>
  S.Struct({
    cloudWatchConfig: S.optional(CloudWatchConfig),
    s3Config: S.optional(S3Config),
    textDataDeliveryEnabled: S.optional(S.Boolean),
    imageDataDeliveryEnabled: S.optional(S.Boolean),
    embeddingDataDeliveryEnabled: S.optional(S.Boolean),
    videoDataDeliveryEnabled: S.optional(S.Boolean),
    audioDataDeliveryEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LoggingConfig",
}) as any as S.Schema<LoggingConfig>;
export interface PutModelInvocationLoggingConfigurationRequest {
  loggingConfig: LoggingConfig;
}
export const PutModelInvocationLoggingConfigurationRequest = S.suspend(() =>
  S.Struct({ loggingConfig: LoggingConfig }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/logging/modelinvocations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutModelInvocationLoggingConfigurationRequest",
}) as any as S.Schema<PutModelInvocationLoggingConfigurationRequest>;
export interface PutModelInvocationLoggingConfigurationResponse {}
export const PutModelInvocationLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutModelInvocationLoggingConfigurationResponse",
}) as any as S.Schema<PutModelInvocationLoggingConfigurationResponse>;
export interface CreateModelCopyJobRequest {
  sourceModelArn: string;
  targetModelName: string;
  modelKmsKeyId?: string;
  targetModelTags?: TagList;
  clientRequestToken?: string;
}
export const CreateModelCopyJobRequest = S.suspend(() =>
  S.Struct({
    sourceModelArn: S.String,
    targetModelName: S.String,
    modelKmsKeyId: S.optional(S.String),
    targetModelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/model-copy-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelCopyJobRequest",
}) as any as S.Schema<CreateModelCopyJobRequest>;
export interface GetModelCopyJobRequest {
  jobArn: string;
}
export const GetModelCopyJobRequest = S.suspend(() =>
  S.Struct({ jobArn: S.String.pipe(T.HttpLabel("jobArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-copy-jobs/{jobArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelCopyJobRequest",
}) as any as S.Schema<GetModelCopyJobRequest>;
export interface ListModelCopyJobsRequest {
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  statusEquals?: string;
  sourceAccountEquals?: string;
  sourceModelArnEquals?: string;
  targetModelNameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListModelCopyJobsRequest = S.suspend(() =>
  S.Struct({
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    sourceAccountEquals: S.optional(S.String).pipe(
      T.HttpQuery("sourceAccountEquals"),
    ),
    sourceModelArnEquals: S.optional(S.String).pipe(
      T.HttpQuery("sourceModelArnEquals"),
    ),
    targetModelNameContains: S.optional(S.String).pipe(
      T.HttpQuery("outputModelNameContains"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-copy-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelCopyJobsRequest",
}) as any as S.Schema<ListModelCopyJobsRequest>;
export interface DeleteImportedModelRequest {
  modelIdentifier: string;
}
export const DeleteImportedModelRequest = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/imported-models/{modelIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteImportedModelRequest",
}) as any as S.Schema<DeleteImportedModelRequest>;
export interface DeleteImportedModelResponse {}
export const DeleteImportedModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteImportedModelResponse",
}) as any as S.Schema<DeleteImportedModelResponse>;
export interface GetImportedModelRequest {
  modelIdentifier: string;
}
export const GetImportedModelRequest = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/imported-models/{modelIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportedModelRequest",
}) as any as S.Schema<GetImportedModelRequest>;
export interface GetModelImportJobRequest {
  jobIdentifier: string;
}
export const GetModelImportJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-import-jobs/{jobIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelImportJobRequest",
}) as any as S.Schema<GetModelImportJobRequest>;
export interface ListImportedModelsRequest {
  creationTimeBefore?: Date;
  creationTimeAfter?: Date;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListImportedModelsRequest = S.suspend(() =>
  S.Struct({
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/imported-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportedModelsRequest",
}) as any as S.Schema<ListImportedModelsRequest>;
export interface ListModelImportJobsRequest {
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  statusEquals?: string;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListModelImportJobsRequest = S.suspend(() =>
  S.Struct({
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-import-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelImportJobsRequest",
}) as any as S.Schema<ListModelImportJobsRequest>;
export interface GetModelInvocationJobRequest {
  jobIdentifier: string;
}
export const GetModelInvocationJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-invocation-job/{jobIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelInvocationJobRequest",
}) as any as S.Schema<GetModelInvocationJobRequest>;
export interface ListModelInvocationJobsRequest {
  submitTimeAfter?: Date;
  submitTimeBefore?: Date;
  statusEquals?: string;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListModelInvocationJobsRequest = S.suspend(() =>
  S.Struct({
    submitTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeAfter")),
    submitTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("submitTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-invocation-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelInvocationJobsRequest",
}) as any as S.Schema<ListModelInvocationJobsRequest>;
export interface StopModelInvocationJobRequest {
  jobIdentifier: string;
}
export const StopModelInvocationJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/model-invocation-job/{jobIdentifier}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopModelInvocationJobRequest",
}) as any as S.Schema<StopModelInvocationJobRequest>;
export interface StopModelInvocationJobResponse {}
export const StopModelInvocationJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopModelInvocationJobResponse",
}) as any as S.Schema<StopModelInvocationJobResponse>;
export interface GetFoundationModelRequest {
  modelIdentifier: string;
}
export const GetFoundationModelRequest = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String.pipe(T.HttpLabel("modelIdentifier")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/foundation-models/{modelIdentifier}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFoundationModelRequest",
}) as any as S.Schema<GetFoundationModelRequest>;
export interface ListFoundationModelsRequest {
  byProvider?: string;
  byCustomizationType?: string;
  byOutputModality?: string;
  byInferenceType?: string;
}
export const ListFoundationModelsRequest = S.suspend(() =>
  S.Struct({
    byProvider: S.optional(S.String).pipe(T.HttpQuery("byProvider")),
    byCustomizationType: S.optional(S.String).pipe(
      T.HttpQuery("byCustomizationType"),
    ),
    byOutputModality: S.optional(S.String).pipe(
      T.HttpQuery("byOutputModality"),
    ),
    byInferenceType: S.optional(S.String).pipe(T.HttpQuery("byInferenceType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/foundation-models" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFoundationModelsRequest",
}) as any as S.Schema<ListFoundationModelsRequest>;
export interface GetPromptRouterRequest {
  promptRouterArn: string;
}
export const GetPromptRouterRequest = S.suspend(() =>
  S.Struct({
    promptRouterArn: S.String.pipe(T.HttpLabel("promptRouterArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prompt-routers/{promptRouterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPromptRouterRequest",
}) as any as S.Schema<GetPromptRouterRequest>;
export interface DeletePromptRouterRequest {
  promptRouterArn: string;
}
export const DeletePromptRouterRequest = S.suspend(() =>
  S.Struct({
    promptRouterArn: S.String.pipe(T.HttpLabel("promptRouterArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/prompt-routers/{promptRouterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePromptRouterRequest",
}) as any as S.Schema<DeletePromptRouterRequest>;
export interface DeletePromptRouterResponse {}
export const DeletePromptRouterResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePromptRouterResponse",
}) as any as S.Schema<DeletePromptRouterResponse>;
export interface ListPromptRoutersRequest {
  maxResults?: number;
  nextToken?: string;
  type?: string;
}
export const ListPromptRoutersRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/prompt-routers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPromptRoutersRequest",
}) as any as S.Schema<ListPromptRoutersRequest>;
export interface CreateProvisionedModelThroughputRequest {
  clientRequestToken?: string;
  modelUnits: number;
  provisionedModelName: string;
  modelId: string;
  commitmentDuration?: string;
  tags?: TagList;
}
export const CreateProvisionedModelThroughputRequest = S.suspend(() =>
  S.Struct({
    clientRequestToken: S.optional(S.String),
    modelUnits: S.Number,
    provisionedModelName: S.String,
    modelId: S.String,
    commitmentDuration: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/provisioned-model-throughput" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProvisionedModelThroughputRequest",
}) as any as S.Schema<CreateProvisionedModelThroughputRequest>;
export interface DeleteProvisionedModelThroughputRequest {
  provisionedModelId: string;
}
export const DeleteProvisionedModelThroughputRequest = S.suspend(() =>
  S.Struct({
    provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/provisioned-model-throughput/{provisionedModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProvisionedModelThroughputRequest",
}) as any as S.Schema<DeleteProvisionedModelThroughputRequest>;
export interface DeleteProvisionedModelThroughputResponse {}
export const DeleteProvisionedModelThroughputResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteProvisionedModelThroughputResponse",
}) as any as S.Schema<DeleteProvisionedModelThroughputResponse>;
export interface GetProvisionedModelThroughputRequest {
  provisionedModelId: string;
}
export const GetProvisionedModelThroughputRequest = S.suspend(() =>
  S.Struct({
    provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/provisioned-model-throughput/{provisionedModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProvisionedModelThroughputRequest",
}) as any as S.Schema<GetProvisionedModelThroughputRequest>;
export interface ListProvisionedModelThroughputsRequest {
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  statusEquals?: string;
  modelArnEquals?: string;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListProvisionedModelThroughputsRequest = S.suspend(() =>
  S.Struct({
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    modelArnEquals: S.optional(S.String).pipe(T.HttpQuery("modelArnEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/provisioned-model-throughputs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProvisionedModelThroughputsRequest",
}) as any as S.Schema<ListProvisionedModelThroughputsRequest>;
export interface UpdateProvisionedModelThroughputRequest {
  provisionedModelId: string;
  desiredProvisionedModelName?: string;
  desiredModelId?: string;
}
export const UpdateProvisionedModelThroughputRequest = S.suspend(() =>
  S.Struct({
    provisionedModelId: S.String.pipe(T.HttpLabel("provisionedModelId")),
    desiredProvisionedModelName: S.optional(S.String),
    desiredModelId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/provisioned-model-throughput/{provisionedModelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProvisionedModelThroughputRequest",
}) as any as S.Schema<UpdateProvisionedModelThroughputRequest>;
export interface UpdateProvisionedModelThroughputResponse {}
export const UpdateProvisionedModelThroughputResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateProvisionedModelThroughputResponse",
}) as any as S.Schema<UpdateProvisionedModelThroughputResponse>;
export interface CreateFoundationModelAgreementRequest {
  offerToken: string;
  modelId: string;
}
export const CreateFoundationModelAgreementRequest = S.suspend(() =>
  S.Struct({ offerToken: S.String, modelId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/create-foundation-model-agreement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFoundationModelAgreementRequest",
}) as any as S.Schema<CreateFoundationModelAgreementRequest>;
export interface DeleteFoundationModelAgreementRequest {
  modelId: string;
}
export const DeleteFoundationModelAgreementRequest = S.suspend(() =>
  S.Struct({ modelId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/delete-foundation-model-agreement" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFoundationModelAgreementRequest",
}) as any as S.Schema<DeleteFoundationModelAgreementRequest>;
export interface DeleteFoundationModelAgreementResponse {}
export const DeleteFoundationModelAgreementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFoundationModelAgreementResponse",
}) as any as S.Schema<DeleteFoundationModelAgreementResponse>;
export interface GetFoundationModelAvailabilityRequest {
  modelId: string;
}
export const GetFoundationModelAvailabilityRequest = S.suspend(() =>
  S.Struct({ modelId: S.String.pipe(T.HttpLabel("modelId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/foundation-model-availability/{modelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFoundationModelAvailabilityRequest",
}) as any as S.Schema<GetFoundationModelAvailabilityRequest>;
export interface ListFoundationModelAgreementOffersRequest {
  modelId: string;
  offerType?: string;
}
export const ListFoundationModelAgreementOffersRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String.pipe(T.HttpLabel("modelId")),
    offerType: S.optional(S.String).pipe(T.HttpQuery("offerType")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/list-foundation-model-agreement-offers/{modelId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFoundationModelAgreementOffersRequest",
}) as any as S.Schema<ListFoundationModelAgreementOffersRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listTagsForResource" }),
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
export interface TagResourceRequest {
  resourceARN: string;
  tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tags: TagList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tagResource" }),
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
  resourceARN: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tagKeys: TagKeyList }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/untagResource" }),
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
export interface GetModelCustomizationJobRequest {
  jobIdentifier: string;
}
export const GetModelCustomizationJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/model-customization-jobs/{jobIdentifier}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetModelCustomizationJobRequest",
}) as any as S.Schema<GetModelCustomizationJobRequest>;
export interface ListModelCustomizationJobsRequest {
  creationTimeAfter?: Date;
  creationTimeBefore?: Date;
  statusEquals?: string;
  nameContains?: string;
  maxResults?: number;
  nextToken?: string;
  sortBy?: string;
  sortOrder?: string;
}
export const ListModelCustomizationJobsRequest = S.suspend(() =>
  S.Struct({
    creationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeAfter")),
    creationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ).pipe(T.HttpQuery("creationTimeBefore")),
    statusEquals: S.optional(S.String).pipe(T.HttpQuery("statusEquals")),
    nameContains: S.optional(S.String).pipe(T.HttpQuery("nameContains")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    sortBy: S.optional(S.String).pipe(T.HttpQuery("sortBy")),
    sortOrder: S.optional(S.String).pipe(T.HttpQuery("sortOrder")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/model-customization-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListModelCustomizationJobsRequest",
}) as any as S.Schema<ListModelCustomizationJobsRequest>;
export interface StopModelCustomizationJobRequest {
  jobIdentifier: string;
}
export const StopModelCustomizationJobRequest = S.suspend(() =>
  S.Struct({ jobIdentifier: S.String.pipe(T.HttpLabel("jobIdentifier")) }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/model-customization-jobs/{jobIdentifier}/stop",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopModelCustomizationJobRequest",
}) as any as S.Schema<StopModelCustomizationJobRequest>;
export interface StopModelCustomizationJobResponse {}
export const StopModelCustomizationJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopModelCustomizationJobResponse",
}) as any as S.Schema<StopModelCustomizationJobResponse>;
export interface AutomatedReasoningPolicyTestCase {
  testCaseId: string;
  guardContent: string | Redacted.Redacted<string>;
  queryContent?: string | Redacted.Redacted<string>;
  expectedAggregatedFindingsResult?: string;
  createdAt: Date;
  updatedAt: Date;
  confidenceThreshold?: number;
}
export const AutomatedReasoningPolicyTestCase = S.suspend(() =>
  S.Struct({
    testCaseId: S.String,
    guardContent: SensitiveString,
    queryContent: S.optional(SensitiveString),
    expectedAggregatedFindingsResult: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    confidenceThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyTestCase",
}) as any as S.Schema<AutomatedReasoningPolicyTestCase>;
export type AutomatedReasoningPolicyTestCaseList =
  AutomatedReasoningPolicyTestCase[];
export const AutomatedReasoningPolicyTestCaseList = S.Array(
  AutomatedReasoningPolicyTestCase,
);
export interface AutomatedReasoningLogicStatement {
  logic: string | Redacted.Redacted<string>;
  naturalLanguage?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningLogicStatement = S.suspend(() =>
  S.Struct({
    logic: SensitiveString,
    naturalLanguage: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AutomatedReasoningLogicStatement",
}) as any as S.Schema<AutomatedReasoningLogicStatement>;
export type AutomatedReasoningLogicStatementList =
  AutomatedReasoningLogicStatement[];
export const AutomatedReasoningLogicStatementList = S.Array(
  AutomatedReasoningLogicStatement,
);
export interface AutomatedReasoningCheckInputTextReference {
  text?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningCheckInputTextReference = S.suspend(() =>
  S.Struct({ text: S.optional(SensitiveString) }),
).annotations({
  identifier: "AutomatedReasoningCheckInputTextReference",
}) as any as S.Schema<AutomatedReasoningCheckInputTextReference>;
export type AutomatedReasoningCheckInputTextReferenceList =
  AutomatedReasoningCheckInputTextReference[];
export const AutomatedReasoningCheckInputTextReferenceList = S.Array(
  AutomatedReasoningCheckInputTextReference,
);
export interface AutomatedReasoningCheckTranslation {
  premises?: AutomatedReasoningLogicStatementList;
  claims: AutomatedReasoningLogicStatementList;
  untranslatedPremises?: AutomatedReasoningCheckInputTextReferenceList;
  untranslatedClaims?: AutomatedReasoningCheckInputTextReferenceList;
  confidence: number;
}
export const AutomatedReasoningCheckTranslation = S.suspend(() =>
  S.Struct({
    premises: S.optional(AutomatedReasoningLogicStatementList),
    claims: AutomatedReasoningLogicStatementList,
    untranslatedPremises: S.optional(
      AutomatedReasoningCheckInputTextReferenceList,
    ),
    untranslatedClaims: S.optional(
      AutomatedReasoningCheckInputTextReferenceList,
    ),
    confidence: S.Number,
  }),
).annotations({
  identifier: "AutomatedReasoningCheckTranslation",
}) as any as S.Schema<AutomatedReasoningCheckTranslation>;
export interface AutomatedReasoningCheckScenario {
  statements?: AutomatedReasoningLogicStatementList;
}
export const AutomatedReasoningCheckScenario = S.suspend(() =>
  S.Struct({ statements: S.optional(AutomatedReasoningLogicStatementList) }),
).annotations({
  identifier: "AutomatedReasoningCheckScenario",
}) as any as S.Schema<AutomatedReasoningCheckScenario>;
export interface AutomatedReasoningCheckRule {
  id?: string;
  policyVersionArn?: string;
}
export const AutomatedReasoningCheckRule = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    policyVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckRule",
}) as any as S.Schema<AutomatedReasoningCheckRule>;
export type AutomatedReasoningCheckRuleList = AutomatedReasoningCheckRule[];
export const AutomatedReasoningCheckRuleList = S.Array(
  AutomatedReasoningCheckRule,
);
export interface AutomatedReasoningCheckLogicWarning {
  type?: string;
  premises?: AutomatedReasoningLogicStatementList;
  claims?: AutomatedReasoningLogicStatementList;
}
export const AutomatedReasoningCheckLogicWarning = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    premises: S.optional(AutomatedReasoningLogicStatementList),
    claims: S.optional(AutomatedReasoningLogicStatementList),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckLogicWarning",
}) as any as S.Schema<AutomatedReasoningCheckLogicWarning>;
export interface AutomatedReasoningCheckValidFinding {
  translation?: AutomatedReasoningCheckTranslation;
  claimsTrueScenario?: AutomatedReasoningCheckScenario;
  supportingRules?: AutomatedReasoningCheckRuleList;
  logicWarning?: AutomatedReasoningCheckLogicWarning;
}
export const AutomatedReasoningCheckValidFinding = S.suspend(() =>
  S.Struct({
    translation: S.optional(AutomatedReasoningCheckTranslation),
    claimsTrueScenario: S.optional(AutomatedReasoningCheckScenario),
    supportingRules: S.optional(AutomatedReasoningCheckRuleList),
    logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckValidFinding",
}) as any as S.Schema<AutomatedReasoningCheckValidFinding>;
export interface AutomatedReasoningCheckInvalidFinding {
  translation?: AutomatedReasoningCheckTranslation;
  contradictingRules?: AutomatedReasoningCheckRuleList;
  logicWarning?: AutomatedReasoningCheckLogicWarning;
}
export const AutomatedReasoningCheckInvalidFinding = S.suspend(() =>
  S.Struct({
    translation: S.optional(AutomatedReasoningCheckTranslation),
    contradictingRules: S.optional(AutomatedReasoningCheckRuleList),
    logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckInvalidFinding",
}) as any as S.Schema<AutomatedReasoningCheckInvalidFinding>;
export interface AutomatedReasoningCheckSatisfiableFinding {
  translation?: AutomatedReasoningCheckTranslation;
  claimsTrueScenario?: AutomatedReasoningCheckScenario;
  claimsFalseScenario?: AutomatedReasoningCheckScenario;
  logicWarning?: AutomatedReasoningCheckLogicWarning;
}
export const AutomatedReasoningCheckSatisfiableFinding = S.suspend(() =>
  S.Struct({
    translation: S.optional(AutomatedReasoningCheckTranslation),
    claimsTrueScenario: S.optional(AutomatedReasoningCheckScenario),
    claimsFalseScenario: S.optional(AutomatedReasoningCheckScenario),
    logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckSatisfiableFinding",
}) as any as S.Schema<AutomatedReasoningCheckSatisfiableFinding>;
export interface AutomatedReasoningCheckImpossibleFinding {
  translation?: AutomatedReasoningCheckTranslation;
  contradictingRules?: AutomatedReasoningCheckRuleList;
  logicWarning?: AutomatedReasoningCheckLogicWarning;
}
export const AutomatedReasoningCheckImpossibleFinding = S.suspend(() =>
  S.Struct({
    translation: S.optional(AutomatedReasoningCheckTranslation),
    contradictingRules: S.optional(AutomatedReasoningCheckRuleList),
    logicWarning: S.optional(AutomatedReasoningCheckLogicWarning),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckImpossibleFinding",
}) as any as S.Schema<AutomatedReasoningCheckImpossibleFinding>;
export type AutomatedReasoningCheckTranslationList =
  AutomatedReasoningCheckTranslation[];
export const AutomatedReasoningCheckTranslationList = S.Array(
  AutomatedReasoningCheckTranslation,
);
export interface AutomatedReasoningCheckTranslationOption {
  translations?: AutomatedReasoningCheckTranslationList;
}
export const AutomatedReasoningCheckTranslationOption = S.suspend(() =>
  S.Struct({
    translations: S.optional(AutomatedReasoningCheckTranslationList),
  }),
).annotations({
  identifier: "AutomatedReasoningCheckTranslationOption",
}) as any as S.Schema<AutomatedReasoningCheckTranslationOption>;
export type AutomatedReasoningCheckTranslationOptionList =
  AutomatedReasoningCheckTranslationOption[];
export const AutomatedReasoningCheckTranslationOptionList = S.Array(
  AutomatedReasoningCheckTranslationOption,
);
export type AutomatedReasoningCheckDifferenceScenarioList =
  AutomatedReasoningCheckScenario[];
export const AutomatedReasoningCheckDifferenceScenarioList = S.Array(
  AutomatedReasoningCheckScenario,
);
export interface AutomatedReasoningCheckTranslationAmbiguousFinding {
  options?: AutomatedReasoningCheckTranslationOptionList;
  differenceScenarios?: AutomatedReasoningCheckDifferenceScenarioList;
}
export const AutomatedReasoningCheckTranslationAmbiguousFinding = S.suspend(
  () =>
    S.Struct({
      options: S.optional(AutomatedReasoningCheckTranslationOptionList),
      differenceScenarios: S.optional(
        AutomatedReasoningCheckDifferenceScenarioList,
      ),
    }),
).annotations({
  identifier: "AutomatedReasoningCheckTranslationAmbiguousFinding",
}) as any as S.Schema<AutomatedReasoningCheckTranslationAmbiguousFinding>;
export interface AutomatedReasoningCheckTooComplexFinding {}
export const AutomatedReasoningCheckTooComplexFinding = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AutomatedReasoningCheckTooComplexFinding",
}) as any as S.Schema<AutomatedReasoningCheckTooComplexFinding>;
export interface AutomatedReasoningCheckNoTranslationsFinding {}
export const AutomatedReasoningCheckNoTranslationsFinding = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AutomatedReasoningCheckNoTranslationsFinding",
}) as any as S.Schema<AutomatedReasoningCheckNoTranslationsFinding>;
export type AutomatedReasoningCheckFinding =
  | { valid: AutomatedReasoningCheckValidFinding }
  | { invalid: AutomatedReasoningCheckInvalidFinding }
  | { satisfiable: AutomatedReasoningCheckSatisfiableFinding }
  | { impossible: AutomatedReasoningCheckImpossibleFinding }
  | { translationAmbiguous: AutomatedReasoningCheckTranslationAmbiguousFinding }
  | { tooComplex: AutomatedReasoningCheckTooComplexFinding }
  | { noTranslations: AutomatedReasoningCheckNoTranslationsFinding };
export const AutomatedReasoningCheckFinding = S.Union(
  S.Struct({ valid: AutomatedReasoningCheckValidFinding }),
  S.Struct({ invalid: AutomatedReasoningCheckInvalidFinding }),
  S.Struct({ satisfiable: AutomatedReasoningCheckSatisfiableFinding }),
  S.Struct({ impossible: AutomatedReasoningCheckImpossibleFinding }),
  S.Struct({
    translationAmbiguous: AutomatedReasoningCheckTranslationAmbiguousFinding,
  }),
  S.Struct({ tooComplex: AutomatedReasoningCheckTooComplexFinding }),
  S.Struct({ noTranslations: AutomatedReasoningCheckNoTranslationsFinding }),
);
export type AutomatedReasoningCheckFindingList =
  (typeof AutomatedReasoningCheckFinding)["Type"][];
export const AutomatedReasoningCheckFindingList = S.Array(
  AutomatedReasoningCheckFinding,
);
export interface AutomatedReasoningPolicyTestResult {
  testCase: AutomatedReasoningPolicyTestCase;
  policyArn: string;
  testRunStatus: string;
  testFindings?: AutomatedReasoningCheckFindingList;
  testRunResult?: string;
  aggregatedTestFindingsResult?: string;
  updatedAt: Date;
}
export const AutomatedReasoningPolicyTestResult = S.suspend(() =>
  S.Struct({
    testCase: AutomatedReasoningPolicyTestCase,
    policyArn: S.String,
    testRunStatus: S.String,
    testFindings: S.optional(AutomatedReasoningCheckFindingList),
    testRunResult: S.optional(S.String),
    aggregatedTestFindingsResult: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyTestResult",
}) as any as S.Schema<AutomatedReasoningPolicyTestResult>;
export type AutomatedReasoningPolicyTestList =
  AutomatedReasoningPolicyTestResult[];
export const AutomatedReasoningPolicyTestList = S.Array(
  AutomatedReasoningPolicyTestResult,
);
export interface AccountEnforcedGuardrailInferenceInputConfiguration {
  guardrailIdentifier: string;
  guardrailVersion: string;
  inputTags: string;
}
export const AccountEnforcedGuardrailInferenceInputConfiguration = S.suspend(
  () =>
    S.Struct({
      guardrailIdentifier: S.String,
      guardrailVersion: S.String,
      inputTags: S.String,
    }),
).annotations({
  identifier: "AccountEnforcedGuardrailInferenceInputConfiguration",
}) as any as S.Schema<AccountEnforcedGuardrailInferenceInputConfiguration>;
export interface EvaluationOutputDataConfig {
  s3Uri: string;
}
export const EvaluationOutputDataConfig = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({
  identifier: "EvaluationOutputDataConfig",
}) as any as S.Schema<EvaluationOutputDataConfig>;
export type ErrorMessages = string[];
export const ErrorMessages = S.Array(S.String);
export type GuardrailStatusReasons = string | Redacted.Redacted<string>[];
export const GuardrailStatusReasons = S.Array(SensitiveString);
export type GuardrailFailureRecommendations =
  | string
  | Redacted.Redacted<string>[];
export const GuardrailFailureRecommendations = S.Array(SensitiveString);
export type InferenceProfileModelSource = { copyFrom: string };
export const InferenceProfileModelSource = S.Union(
  S.Struct({ copyFrom: S.String }),
);
export interface PromptRouterTargetModel {
  modelArn: string;
}
export const PromptRouterTargetModel = S.suspend(() =>
  S.Struct({ modelArn: S.String }),
).annotations({
  identifier: "PromptRouterTargetModel",
}) as any as S.Schema<PromptRouterTargetModel>;
export type PromptRouterTargetModels = PromptRouterTargetModel[];
export const PromptRouterTargetModels = S.Array(PromptRouterTargetModel);
export interface RoutingCriteria {
  responseQualityDifference: number;
}
export const RoutingCriteria = S.suspend(() =>
  S.Struct({ responseQualityDifference: S.Number }),
).annotations({
  identifier: "RoutingCriteria",
}) as any as S.Schema<RoutingCriteria>;
export interface OutputDataConfig {
  s3Uri: string;
}
export const OutputDataConfig = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({
  identifier: "OutputDataConfig",
}) as any as S.Schema<OutputDataConfig>;
export type ModelCustomizationHyperParameters = { [key: string]: string };
export const ModelCustomizationHyperParameters = S.Record({
  key: S.String,
  value: S.String,
});
export type AutomatedReasoningPolicyDefinitionRuleIdList = string[];
export const AutomatedReasoningPolicyDefinitionRuleIdList = S.Array(S.String);
export interface GetAutomatedReasoningPolicyResponse {
  policyArn: string;
  name: string | Redacted.Redacted<string>;
  version: string;
  policyId: string;
  description?: string | Redacted.Redacted<string>;
  definitionHash: string;
  kmsKeyArn?: string;
  createdAt?: Date;
  updatedAt: Date;
}
export const GetAutomatedReasoningPolicyResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    name: SensitiveString,
    version: S.String,
    policyId: S.String,
    description: S.optional(SensitiveString),
    definitionHash: S.String,
    kmsKeyArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyResponse>;
export interface UpdateAutomatedReasoningPolicyResponse {
  policyArn: string;
  name: string | Redacted.Redacted<string>;
  definitionHash: string;
  updatedAt: Date;
}
export const UpdateAutomatedReasoningPolicyResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    name: SensitiveString,
    definitionHash: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyResponse",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyResponse>;
export interface CreateAutomatedReasoningPolicyTestCaseResponse {
  policyArn: string;
  testCaseId: string;
}
export const CreateAutomatedReasoningPolicyTestCaseResponse = S.suspend(() =>
  S.Struct({ policyArn: S.String, testCaseId: S.String }),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyTestCaseResponse",
}) as any as S.Schema<CreateAutomatedReasoningPolicyTestCaseResponse>;
export interface CreateAutomatedReasoningPolicyVersionResponse {
  policyArn: string;
  version: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  definitionHash: string;
  createdAt: Date;
}
export const CreateAutomatedReasoningPolicyVersionResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    version: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    definitionHash: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyVersionResponse",
}) as any as S.Schema<CreateAutomatedReasoningPolicyVersionResponse>;
export interface ExportAutomatedReasoningPolicyVersionResponse {
  policyDefinition: AutomatedReasoningPolicyDefinition;
}
export const ExportAutomatedReasoningPolicyVersionResponse = S.suspend(() =>
  S.Struct({
    policyDefinition: AutomatedReasoningPolicyDefinition.pipe(
      T.HttpPayload(),
    ).annotations({ identifier: "AutomatedReasoningPolicyDefinition" }),
  }),
).annotations({
  identifier: "ExportAutomatedReasoningPolicyVersionResponse",
}) as any as S.Schema<ExportAutomatedReasoningPolicyVersionResponse>;
export interface AutomatedReasoningPolicyAddTypeAnnotation {
  name: string | Redacted.Redacted<string>;
  description: string | Redacted.Redacted<string>;
  values: AutomatedReasoningPolicyDefinitionTypeValueList;
}
export const AutomatedReasoningPolicyAddTypeAnnotation = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: SensitiveString,
    values: AutomatedReasoningPolicyDefinitionTypeValueList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddTypeAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyAddTypeAnnotation>;
export interface AutomatedReasoningPolicyAddTypeValue {
  value: string;
  description?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyAddTypeValue = S.suspend(() =>
  S.Struct({ value: S.String, description: S.optional(SensitiveString) }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddTypeValue",
}) as any as S.Schema<AutomatedReasoningPolicyAddTypeValue>;
export interface AutomatedReasoningPolicyUpdateTypeValue {
  value: string;
  newValue?: string;
  description?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyUpdateTypeValue = S.suspend(() =>
  S.Struct({
    value: S.String,
    newValue: S.optional(S.String),
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateTypeValue",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateTypeValue>;
export interface AutomatedReasoningPolicyDeleteTypeValue {
  value: string;
}
export const AutomatedReasoningPolicyDeleteTypeValue = S.suspend(() =>
  S.Struct({ value: S.String }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteTypeValue",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteTypeValue>;
export type AutomatedReasoningPolicyTypeValueAnnotation =
  | { addTypeValue: AutomatedReasoningPolicyAddTypeValue }
  | { updateTypeValue: AutomatedReasoningPolicyUpdateTypeValue }
  | { deleteTypeValue: AutomatedReasoningPolicyDeleteTypeValue };
export const AutomatedReasoningPolicyTypeValueAnnotation = S.Union(
  S.Struct({ addTypeValue: AutomatedReasoningPolicyAddTypeValue }),
  S.Struct({ updateTypeValue: AutomatedReasoningPolicyUpdateTypeValue }),
  S.Struct({ deleteTypeValue: AutomatedReasoningPolicyDeleteTypeValue }),
);
export type AutomatedReasoningPolicyTypeValueAnnotationList =
  (typeof AutomatedReasoningPolicyTypeValueAnnotation)["Type"][];
export const AutomatedReasoningPolicyTypeValueAnnotationList = S.Array(
  AutomatedReasoningPolicyTypeValueAnnotation,
);
export interface AutomatedReasoningPolicyUpdateTypeAnnotation {
  name: string | Redacted.Redacted<string>;
  newName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  values: AutomatedReasoningPolicyTypeValueAnnotationList;
}
export const AutomatedReasoningPolicyUpdateTypeAnnotation = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    newName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    values: AutomatedReasoningPolicyTypeValueAnnotationList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateTypeAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateTypeAnnotation>;
export interface AutomatedReasoningPolicyDeleteTypeAnnotation {
  name: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDeleteTypeAnnotation = S.suspend(() =>
  S.Struct({ name: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteTypeAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteTypeAnnotation>;
export interface AutomatedReasoningPolicyAddVariableAnnotation {
  name: string | Redacted.Redacted<string>;
  type: string | Redacted.Redacted<string>;
  description: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyAddVariableAnnotation = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    type: SensitiveString,
    description: SensitiveString,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddVariableAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyAddVariableAnnotation>;
export interface AutomatedReasoningPolicyUpdateVariableAnnotation {
  name: string | Redacted.Redacted<string>;
  newName?: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyUpdateVariableAnnotation = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    newName: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateVariableAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateVariableAnnotation>;
export interface AutomatedReasoningPolicyDeleteVariableAnnotation {
  name: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDeleteVariableAnnotation = S.suspend(() =>
  S.Struct({ name: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteVariableAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteVariableAnnotation>;
export interface AutomatedReasoningPolicyAddRuleAnnotation {
  expression: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyAddRuleAnnotation = S.suspend(() =>
  S.Struct({ expression: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddRuleAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyAddRuleAnnotation>;
export interface AutomatedReasoningPolicyUpdateRuleAnnotation {
  ruleId: string;
  expression: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyUpdateRuleAnnotation = S.suspend(() =>
  S.Struct({ ruleId: S.String, expression: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateRuleAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateRuleAnnotation>;
export interface AutomatedReasoningPolicyDeleteRuleAnnotation {
  ruleId: string;
}
export const AutomatedReasoningPolicyDeleteRuleAnnotation = S.suspend(() =>
  S.Struct({ ruleId: S.String }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteRuleAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteRuleAnnotation>;
export interface AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation {
  naturalLanguage: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation =
  S.suspend(() => S.Struct({ naturalLanguage: SensitiveString })).annotations({
    identifier: "AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation",
  }) as any as S.Schema<AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation>;
export interface AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation {
  ruleIds?: AutomatedReasoningPolicyDefinitionRuleIdList;
  feedback: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation =
  S.suspend(() =>
    S.Struct({
      ruleIds: S.optional(AutomatedReasoningPolicyDefinitionRuleIdList),
      feedback: SensitiveString,
    }),
  ).annotations({
    identifier: "AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation",
  }) as any as S.Schema<AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation>;
export interface AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation {
  ruleIds?: AutomatedReasoningPolicyDefinitionRuleIdList;
  scenarioExpression: string | Redacted.Redacted<string>;
  feedback?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation =
  S.suspend(() =>
    S.Struct({
      ruleIds: S.optional(AutomatedReasoningPolicyDefinitionRuleIdList),
      scenarioExpression: SensitiveString,
      feedback: S.optional(SensitiveString),
    }),
  ).annotations({
    identifier: "AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation",
  }) as any as S.Schema<AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation>;
export interface AutomatedReasoningPolicyIngestContentAnnotation {
  content: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyIngestContentAnnotation = S.suspend(() =>
  S.Struct({ content: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyIngestContentAnnotation",
}) as any as S.Schema<AutomatedReasoningPolicyIngestContentAnnotation>;
export type AutomatedReasoningPolicyAnnotation =
  | { addType: AutomatedReasoningPolicyAddTypeAnnotation }
  | { updateType: AutomatedReasoningPolicyUpdateTypeAnnotation }
  | { deleteType: AutomatedReasoningPolicyDeleteTypeAnnotation }
  | { addVariable: AutomatedReasoningPolicyAddVariableAnnotation }
  | { updateVariable: AutomatedReasoningPolicyUpdateVariableAnnotation }
  | { deleteVariable: AutomatedReasoningPolicyDeleteVariableAnnotation }
  | { addRule: AutomatedReasoningPolicyAddRuleAnnotation }
  | { updateRule: AutomatedReasoningPolicyUpdateRuleAnnotation }
  | { deleteRule: AutomatedReasoningPolicyDeleteRuleAnnotation }
  | {
      addRuleFromNaturalLanguage: AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation;
    }
  | {
      updateFromRulesFeedback: AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation;
    }
  | {
      updateFromScenarioFeedback: AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation;
    }
  | { ingestContent: AutomatedReasoningPolicyIngestContentAnnotation };
export const AutomatedReasoningPolicyAnnotation = S.Union(
  S.Struct({ addType: AutomatedReasoningPolicyAddTypeAnnotation }),
  S.Struct({ updateType: AutomatedReasoningPolicyUpdateTypeAnnotation }),
  S.Struct({ deleteType: AutomatedReasoningPolicyDeleteTypeAnnotation }),
  S.Struct({ addVariable: AutomatedReasoningPolicyAddVariableAnnotation }),
  S.Struct({
    updateVariable: AutomatedReasoningPolicyUpdateVariableAnnotation,
  }),
  S.Struct({
    deleteVariable: AutomatedReasoningPolicyDeleteVariableAnnotation,
  }),
  S.Struct({ addRule: AutomatedReasoningPolicyAddRuleAnnotation }),
  S.Struct({ updateRule: AutomatedReasoningPolicyUpdateRuleAnnotation }),
  S.Struct({ deleteRule: AutomatedReasoningPolicyDeleteRuleAnnotation }),
  S.Struct({
    addRuleFromNaturalLanguage:
      AutomatedReasoningPolicyAddRuleFromNaturalLanguageAnnotation,
  }),
  S.Struct({
    updateFromRulesFeedback:
      AutomatedReasoningPolicyUpdateFromRuleFeedbackAnnotation,
  }),
  S.Struct({
    updateFromScenarioFeedback:
      AutomatedReasoningPolicyUpdateFromScenarioFeedbackAnnotation,
  }),
  S.Struct({ ingestContent: AutomatedReasoningPolicyIngestContentAnnotation }),
);
export type AutomatedReasoningPolicyAnnotationList =
  (typeof AutomatedReasoningPolicyAnnotation)["Type"][];
export const AutomatedReasoningPolicyAnnotationList = S.Array(
  AutomatedReasoningPolicyAnnotation,
);
export interface GetAutomatedReasoningPolicyAnnotationsResponse {
  policyArn: string;
  name: string | Redacted.Redacted<string>;
  buildWorkflowId: string;
  annotations: AutomatedReasoningPolicyAnnotationList;
  annotationSetHash: string;
  updatedAt: Date;
}
export const GetAutomatedReasoningPolicyAnnotationsResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    name: SensitiveString,
    buildWorkflowId: S.String,
    annotations: AutomatedReasoningPolicyAnnotationList,
    annotationSetHash: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyAnnotationsResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyAnnotationsResponse>;
export interface GetAutomatedReasoningPolicyBuildWorkflowResponse {
  policyArn: string;
  buildWorkflowId: string;
  status: string;
  buildWorkflowType: string;
  documentName?: string | Redacted.Redacted<string>;
  documentContentType?: string;
  documentDescription?: string | Redacted.Redacted<string>;
  createdAt: Date;
  updatedAt: Date;
}
export const GetAutomatedReasoningPolicyBuildWorkflowResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    buildWorkflowId: S.String,
    status: S.String,
    buildWorkflowType: S.String,
    documentName: S.optional(SensitiveString),
    documentContentType: S.optional(S.String),
    documentDescription: S.optional(SensitiveString),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyBuildWorkflowResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyBuildWorkflowResponse>;
export interface ListAutomatedReasoningPolicyTestCasesResponse {
  testCases: AutomatedReasoningPolicyTestCaseList;
  nextToken?: string;
}
export const ListAutomatedReasoningPolicyTestCasesResponse = S.suspend(() =>
  S.Struct({
    testCases: AutomatedReasoningPolicyTestCaseList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomatedReasoningPolicyTestCasesResponse",
}) as any as S.Schema<ListAutomatedReasoningPolicyTestCasesResponse>;
export interface ListAutomatedReasoningPolicyTestResultsResponse {
  testResults: AutomatedReasoningPolicyTestList;
  nextToken?: string;
}
export const ListAutomatedReasoningPolicyTestResultsResponse = S.suspend(() =>
  S.Struct({
    testResults: AutomatedReasoningPolicyTestList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomatedReasoningPolicyTestResultsResponse",
}) as any as S.Schema<ListAutomatedReasoningPolicyTestResultsResponse>;
export interface StartAutomatedReasoningPolicyTestWorkflowResponse {
  policyArn: string;
}
export const StartAutomatedReasoningPolicyTestWorkflowResponse = S.suspend(() =>
  S.Struct({ policyArn: S.String }),
).annotations({
  identifier: "StartAutomatedReasoningPolicyTestWorkflowResponse",
}) as any as S.Schema<StartAutomatedReasoningPolicyTestWorkflowResponse>;
export interface UpdateAutomatedReasoningPolicyTestCaseResponse {
  policyArn: string;
  testCaseId: string;
}
export const UpdateAutomatedReasoningPolicyTestCaseResponse = S.suspend(() =>
  S.Struct({ policyArn: S.String, testCaseId: S.String }),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyTestCaseResponse",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyTestCaseResponse>;
export interface MarketplaceModelEndpoint {
  endpointArn: string;
  modelSourceIdentifier: string;
  status?: string;
  statusMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  endpointConfig: (typeof EndpointConfig)["Type"];
  endpointStatus: string;
  endpointStatusMessage?: string;
}
export const MarketplaceModelEndpoint = S.suspend(() =>
  S.Struct({
    endpointArn: S.String,
    modelSourceIdentifier: S.String,
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endpointConfig: EndpointConfig,
    endpointStatus: S.String,
    endpointStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "MarketplaceModelEndpoint",
}) as any as S.Schema<MarketplaceModelEndpoint>;
export interface RegisterMarketplaceModelEndpointResponse {
  marketplaceModelEndpoint: MarketplaceModelEndpoint;
}
export const RegisterMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({ marketplaceModelEndpoint: MarketplaceModelEndpoint }),
).annotations({
  identifier: "RegisterMarketplaceModelEndpointResponse",
}) as any as S.Schema<RegisterMarketplaceModelEndpointResponse>;
export interface UpdateMarketplaceModelEndpointResponse {
  marketplaceModelEndpoint: MarketplaceModelEndpoint;
}
export const UpdateMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({ marketplaceModelEndpoint: MarketplaceModelEndpoint }),
).annotations({
  identifier: "UpdateMarketplaceModelEndpointResponse",
}) as any as S.Schema<UpdateMarketplaceModelEndpointResponse>;
export interface CreateCustomModelDeploymentResponse {
  customModelDeploymentArn: string;
}
export const CreateCustomModelDeploymentResponse = S.suspend(() =>
  S.Struct({ customModelDeploymentArn: S.String }),
).annotations({
  identifier: "CreateCustomModelDeploymentResponse",
}) as any as S.Schema<CreateCustomModelDeploymentResponse>;
export interface UpdateCustomModelDeploymentResponse {
  customModelDeploymentArn: string;
}
export const UpdateCustomModelDeploymentResponse = S.suspend(() =>
  S.Struct({ customModelDeploymentArn: S.String }),
).annotations({
  identifier: "UpdateCustomModelDeploymentResponse",
}) as any as S.Schema<UpdateCustomModelDeploymentResponse>;
export interface PutEnforcedGuardrailConfigurationRequest {
  configId?: string;
  guardrailInferenceConfig: AccountEnforcedGuardrailInferenceInputConfiguration;
}
export const PutEnforcedGuardrailConfigurationRequest = S.suspend(() =>
  S.Struct({
    configId: S.optional(S.String),
    guardrailInferenceConfig:
      AccountEnforcedGuardrailInferenceInputConfiguration,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/enforcedGuardrailsConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutEnforcedGuardrailConfigurationRequest",
}) as any as S.Schema<PutEnforcedGuardrailConfigurationRequest>;
export type EvaluationDatasetLocation = { s3Uri: string };
export const EvaluationDatasetLocation = S.Union(S.Struct({ s3Uri: S.String }));
export interface EvaluationDataset {
  name: string | Redacted.Redacted<string>;
  datasetLocation?: (typeof EvaluationDatasetLocation)["Type"];
}
export const EvaluationDataset = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    datasetLocation: S.optional(EvaluationDatasetLocation),
  }),
).annotations({
  identifier: "EvaluationDataset",
}) as any as S.Schema<EvaluationDataset>;
export type EvaluationMetricNames = string | Redacted.Redacted<string>[];
export const EvaluationMetricNames = S.Array(SensitiveString);
export interface EvaluationDatasetMetricConfig {
  taskType: string;
  dataset: EvaluationDataset;
  metricNames: EvaluationMetricNames;
}
export const EvaluationDatasetMetricConfig = S.suspend(() =>
  S.Struct({
    taskType: S.String,
    dataset: EvaluationDataset,
    metricNames: EvaluationMetricNames,
  }),
).annotations({
  identifier: "EvaluationDatasetMetricConfig",
}) as any as S.Schema<EvaluationDatasetMetricConfig>;
export type EvaluationDatasetMetricConfigs = EvaluationDatasetMetricConfig[];
export const EvaluationDatasetMetricConfigs = S.Array(
  EvaluationDatasetMetricConfig,
);
export interface BedrockEvaluatorModel {
  modelIdentifier: string;
}
export const BedrockEvaluatorModel = S.suspend(() =>
  S.Struct({ modelIdentifier: S.String }),
).annotations({
  identifier: "BedrockEvaluatorModel",
}) as any as S.Schema<BedrockEvaluatorModel>;
export type BedrockEvaluatorModels = BedrockEvaluatorModel[];
export const BedrockEvaluatorModels = S.Array(BedrockEvaluatorModel);
export type EvaluatorModelConfig = {
  bedrockEvaluatorModels: BedrockEvaluatorModels;
};
export const EvaluatorModelConfig = S.Union(
  S.Struct({ bedrockEvaluatorModels: BedrockEvaluatorModels }),
);
export type RatingScaleItemValue =
  | { stringValue: string }
  | { floatValue: number };
export const RatingScaleItemValue = S.Union(
  S.Struct({ stringValue: S.String }),
  S.Struct({ floatValue: S.Number }),
);
export interface RatingScaleItem {
  definition: string;
  value: (typeof RatingScaleItemValue)["Type"];
}
export const RatingScaleItem = S.suspend(() =>
  S.Struct({ definition: S.String, value: RatingScaleItemValue }),
).annotations({
  identifier: "RatingScaleItem",
}) as any as S.Schema<RatingScaleItem>;
export type RatingScale = RatingScaleItem[];
export const RatingScale = S.Array(RatingScaleItem);
export interface CustomMetricDefinition {
  name: string | Redacted.Redacted<string>;
  instructions: string;
  ratingScale?: RatingScale;
}
export const CustomMetricDefinition = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    instructions: S.String,
    ratingScale: S.optional(RatingScale),
  }),
).annotations({
  identifier: "CustomMetricDefinition",
}) as any as S.Schema<CustomMetricDefinition>;
export type AutomatedEvaluationCustomMetricSource = {
  customMetricDefinition: CustomMetricDefinition;
};
export const AutomatedEvaluationCustomMetricSource = S.Union(
  S.Struct({ customMetricDefinition: CustomMetricDefinition }),
);
export type AutomatedEvaluationCustomMetrics =
  (typeof AutomatedEvaluationCustomMetricSource)["Type"][];
export const AutomatedEvaluationCustomMetrics = S.Array(
  AutomatedEvaluationCustomMetricSource,
);
export interface CustomMetricBedrockEvaluatorModel {
  modelIdentifier: string;
}
export const CustomMetricBedrockEvaluatorModel = S.suspend(() =>
  S.Struct({ modelIdentifier: S.String }),
).annotations({
  identifier: "CustomMetricBedrockEvaluatorModel",
}) as any as S.Schema<CustomMetricBedrockEvaluatorModel>;
export type CustomMetricBedrockEvaluatorModels =
  CustomMetricBedrockEvaluatorModel[];
export const CustomMetricBedrockEvaluatorModels = S.Array(
  CustomMetricBedrockEvaluatorModel,
);
export interface CustomMetricEvaluatorModelConfig {
  bedrockEvaluatorModels: CustomMetricBedrockEvaluatorModels;
}
export const CustomMetricEvaluatorModelConfig = S.suspend(() =>
  S.Struct({ bedrockEvaluatorModels: CustomMetricBedrockEvaluatorModels }),
).annotations({
  identifier: "CustomMetricEvaluatorModelConfig",
}) as any as S.Schema<CustomMetricEvaluatorModelConfig>;
export interface AutomatedEvaluationCustomMetricConfig {
  customMetrics: AutomatedEvaluationCustomMetrics;
  evaluatorModelConfig: CustomMetricEvaluatorModelConfig;
}
export const AutomatedEvaluationCustomMetricConfig = S.suspend(() =>
  S.Struct({
    customMetrics: AutomatedEvaluationCustomMetrics,
    evaluatorModelConfig: CustomMetricEvaluatorModelConfig,
  }),
).annotations({
  identifier: "AutomatedEvaluationCustomMetricConfig",
}) as any as S.Schema<AutomatedEvaluationCustomMetricConfig>;
export interface AutomatedEvaluationConfig {
  datasetMetricConfigs: EvaluationDatasetMetricConfigs;
  evaluatorModelConfig?: (typeof EvaluatorModelConfig)["Type"];
  customMetricConfig?: AutomatedEvaluationCustomMetricConfig;
}
export const AutomatedEvaluationConfig = S.suspend(() =>
  S.Struct({
    datasetMetricConfigs: EvaluationDatasetMetricConfigs,
    evaluatorModelConfig: S.optional(EvaluatorModelConfig),
    customMetricConfig: S.optional(AutomatedEvaluationCustomMetricConfig),
  }),
).annotations({
  identifier: "AutomatedEvaluationConfig",
}) as any as S.Schema<AutomatedEvaluationConfig>;
export interface HumanWorkflowConfig {
  flowDefinitionArn: string;
  instructions?: string | Redacted.Redacted<string>;
}
export const HumanWorkflowConfig = S.suspend(() =>
  S.Struct({
    flowDefinitionArn: S.String,
    instructions: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "HumanWorkflowConfig",
}) as any as S.Schema<HumanWorkflowConfig>;
export interface HumanEvaluationCustomMetric {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  ratingMethod: string;
}
export const HumanEvaluationCustomMetric = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    ratingMethod: S.String,
  }),
).annotations({
  identifier: "HumanEvaluationCustomMetric",
}) as any as S.Schema<HumanEvaluationCustomMetric>;
export type HumanEvaluationCustomMetrics = HumanEvaluationCustomMetric[];
export const HumanEvaluationCustomMetrics = S.Array(
  HumanEvaluationCustomMetric,
);
export interface HumanEvaluationConfig {
  humanWorkflowConfig?: HumanWorkflowConfig;
  customMetrics?: HumanEvaluationCustomMetrics;
  datasetMetricConfigs: EvaluationDatasetMetricConfigs;
}
export const HumanEvaluationConfig = S.suspend(() =>
  S.Struct({
    humanWorkflowConfig: S.optional(HumanWorkflowConfig),
    customMetrics: S.optional(HumanEvaluationCustomMetrics),
    datasetMetricConfigs: EvaluationDatasetMetricConfigs,
  }),
).annotations({
  identifier: "HumanEvaluationConfig",
}) as any as S.Schema<HumanEvaluationConfig>;
export type EvaluationConfig =
  | { automated: AutomatedEvaluationConfig }
  | { human: HumanEvaluationConfig };
export const EvaluationConfig = S.Union(
  S.Struct({ automated: AutomatedEvaluationConfig }),
  S.Struct({ human: HumanEvaluationConfig }),
);
export interface PerformanceConfiguration {
  latency?: string;
}
export const PerformanceConfiguration = S.suspend(() =>
  S.Struct({ latency: S.optional(S.String) }),
).annotations({
  identifier: "PerformanceConfiguration",
}) as any as S.Schema<PerformanceConfiguration>;
export interface EvaluationBedrockModel {
  modelIdentifier: string;
  inferenceParams?: string | Redacted.Redacted<string>;
  performanceConfig?: PerformanceConfiguration;
}
export const EvaluationBedrockModel = S.suspend(() =>
  S.Struct({
    modelIdentifier: S.String,
    inferenceParams: S.optional(SensitiveString),
    performanceConfig: S.optional(PerformanceConfiguration),
  }),
).annotations({
  identifier: "EvaluationBedrockModel",
}) as any as S.Schema<EvaluationBedrockModel>;
export interface EvaluationPrecomputedInferenceSource {
  inferenceSourceIdentifier: string;
}
export const EvaluationPrecomputedInferenceSource = S.suspend(() =>
  S.Struct({ inferenceSourceIdentifier: S.String }),
).annotations({
  identifier: "EvaluationPrecomputedInferenceSource",
}) as any as S.Schema<EvaluationPrecomputedInferenceSource>;
export type EvaluationModelConfig =
  | { bedrockModel: EvaluationBedrockModel }
  | { precomputedInferenceSource: EvaluationPrecomputedInferenceSource };
export const EvaluationModelConfig = S.Union(
  S.Struct({ bedrockModel: EvaluationBedrockModel }),
  S.Struct({
    precomputedInferenceSource: EvaluationPrecomputedInferenceSource,
  }),
);
export type EvaluationModelConfigs = (typeof EvaluationModelConfig)["Type"][];
export const EvaluationModelConfigs = S.Array(EvaluationModelConfig);
export interface FilterAttribute {
  key: string;
  value: any;
}
export const FilterAttribute = S.suspend(() =>
  S.Struct({ key: S.String, value: S.Any }),
).annotations({
  identifier: "FilterAttribute",
}) as any as S.Schema<FilterAttribute>;
export type RetrievalFilter =
  | { equals: FilterAttribute }
  | { notEquals: FilterAttribute }
  | { greaterThan: FilterAttribute }
  | { greaterThanOrEquals: FilterAttribute }
  | { lessThan: FilterAttribute }
  | { lessThanOrEquals: FilterAttribute }
  | { in: FilterAttribute }
  | { notIn: FilterAttribute }
  | { startsWith: FilterAttribute }
  | { listContains: FilterAttribute }
  | { stringContains: FilterAttribute }
  | { andAll: RetrievalFilterList }
  | { orAll: RetrievalFilterList };
export const RetrievalFilter = S.Union(
  S.Struct({ equals: FilterAttribute }),
  S.Struct({ notEquals: FilterAttribute }),
  S.Struct({ greaterThan: FilterAttribute }),
  S.Struct({ greaterThanOrEquals: FilterAttribute }),
  S.Struct({ lessThan: FilterAttribute }),
  S.Struct({ lessThanOrEquals: FilterAttribute }),
  S.Struct({ in: FilterAttribute }),
  S.Struct({ notIn: FilterAttribute }),
  S.Struct({ startsWith: FilterAttribute }),
  S.Struct({ listContains: FilterAttribute }),
  S.Struct({ stringContains: FilterAttribute }),
  S.Struct({
    andAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
  S.Struct({
    orAll: S.suspend(() => RetrievalFilterList).annotations({
      identifier: "RetrievalFilterList",
    }),
  }),
) as any as S.Schema<RetrievalFilter>;
export interface MetadataAttributeSchema {
  key: string;
  type: string;
  description: string;
}
export const MetadataAttributeSchema = S.suspend(() =>
  S.Struct({ key: S.String, type: S.String, description: S.String }),
).annotations({
  identifier: "MetadataAttributeSchema",
}) as any as S.Schema<MetadataAttributeSchema>;
export type MetadataAttributeSchemaList = MetadataAttributeSchema[];
export const MetadataAttributeSchemaList = S.Array(MetadataAttributeSchema);
export interface ImplicitFilterConfiguration {
  metadataAttributes: MetadataAttributeSchemaList;
  modelArn: string;
}
export const ImplicitFilterConfiguration = S.suspend(() =>
  S.Struct({
    metadataAttributes: MetadataAttributeSchemaList,
    modelArn: S.String,
  }),
).annotations({
  identifier: "ImplicitFilterConfiguration",
}) as any as S.Schema<ImplicitFilterConfiguration>;
export type AdditionalModelRequestFields = { [key: string]: any };
export const AdditionalModelRequestFields = S.Record({
  key: S.String,
  value: S.Any,
});
export interface VectorSearchBedrockRerankingModelConfiguration {
  modelArn: string;
  additionalModelRequestFields?: AdditionalModelRequestFields;
}
export const VectorSearchBedrockRerankingModelConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "VectorSearchBedrockRerankingModelConfiguration",
}) as any as S.Schema<VectorSearchBedrockRerankingModelConfiguration>;
export interface FieldForReranking {
  fieldName: string;
}
export const FieldForReranking = S.suspend(() =>
  S.Struct({ fieldName: S.String }),
).annotations({
  identifier: "FieldForReranking",
}) as any as S.Schema<FieldForReranking>;
export type FieldsForReranking = FieldForReranking[];
export const FieldsForReranking = S.Array(FieldForReranking);
export type RerankingMetadataSelectiveModeConfiguration =
  | { fieldsToInclude: FieldsForReranking }
  | { fieldsToExclude: FieldsForReranking };
export const RerankingMetadataSelectiveModeConfiguration = S.Union(
  S.Struct({ fieldsToInclude: FieldsForReranking }),
  S.Struct({ fieldsToExclude: FieldsForReranking }),
);
export interface MetadataConfigurationForReranking {
  selectionMode: string;
  selectiveModeConfiguration?: (typeof RerankingMetadataSelectiveModeConfiguration)["Type"];
}
export const MetadataConfigurationForReranking = S.suspend(() =>
  S.Struct({
    selectionMode: S.String,
    selectiveModeConfiguration: S.optional(
      RerankingMetadataSelectiveModeConfiguration,
    ),
  }),
).annotations({
  identifier: "MetadataConfigurationForReranking",
}) as any as S.Schema<MetadataConfigurationForReranking>;
export interface VectorSearchBedrockRerankingConfiguration {
  modelConfiguration: VectorSearchBedrockRerankingModelConfiguration;
  numberOfRerankedResults?: number;
  metadataConfiguration?: MetadataConfigurationForReranking;
}
export const VectorSearchBedrockRerankingConfiguration = S.suspend(() =>
  S.Struct({
    modelConfiguration: VectorSearchBedrockRerankingModelConfiguration,
    numberOfRerankedResults: S.optional(S.Number),
    metadataConfiguration: S.optional(MetadataConfigurationForReranking),
  }),
).annotations({
  identifier: "VectorSearchBedrockRerankingConfiguration",
}) as any as S.Schema<VectorSearchBedrockRerankingConfiguration>;
export interface VectorSearchRerankingConfiguration {
  type: string;
  bedrockRerankingConfiguration?: VectorSearchBedrockRerankingConfiguration;
}
export const VectorSearchRerankingConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    bedrockRerankingConfiguration: S.optional(
      VectorSearchBedrockRerankingConfiguration,
    ),
  }),
).annotations({
  identifier: "VectorSearchRerankingConfiguration",
}) as any as S.Schema<VectorSearchRerankingConfiguration>;
export interface KnowledgeBaseVectorSearchConfiguration {
  numberOfResults?: number;
  overrideSearchType?: string;
  filter?: RetrievalFilter;
  implicitFilterConfiguration?: ImplicitFilterConfiguration;
  rerankingConfiguration?: VectorSearchRerankingConfiguration;
}
export const KnowledgeBaseVectorSearchConfiguration = S.suspend(() =>
  S.Struct({
    numberOfResults: S.optional(S.Number),
    overrideSearchType: S.optional(S.String),
    filter: S.optional(RetrievalFilter),
    implicitFilterConfiguration: S.optional(ImplicitFilterConfiguration),
    rerankingConfiguration: S.optional(VectorSearchRerankingConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseVectorSearchConfiguration",
}) as any as S.Schema<KnowledgeBaseVectorSearchConfiguration>;
export interface KnowledgeBaseRetrievalConfiguration {
  vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration;
}
export const KnowledgeBaseRetrievalConfiguration = S.suspend(() =>
  S.Struct({
    vectorSearchConfiguration: KnowledgeBaseVectorSearchConfiguration,
  }),
).annotations({
  identifier: "KnowledgeBaseRetrievalConfiguration",
}) as any as S.Schema<KnowledgeBaseRetrievalConfiguration>;
export interface RetrieveConfig {
  knowledgeBaseId: string;
  knowledgeBaseRetrievalConfiguration: KnowledgeBaseRetrievalConfiguration;
}
export const RetrieveConfig = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    knowledgeBaseRetrievalConfiguration: KnowledgeBaseRetrievalConfiguration,
  }),
).annotations({
  identifier: "RetrieveConfig",
}) as any as S.Schema<RetrieveConfig>;
export interface PromptTemplate {
  textPromptTemplate?: string | Redacted.Redacted<string>;
}
export const PromptTemplate = S.suspend(() =>
  S.Struct({ textPromptTemplate: S.optional(SensitiveString) }),
).annotations({
  identifier: "PromptTemplate",
}) as any as S.Schema<PromptTemplate>;
export interface GuardrailConfiguration {
  guardrailId: string;
  guardrailVersion: string;
}
export const GuardrailConfiguration = S.suspend(() =>
  S.Struct({ guardrailId: S.String, guardrailVersion: S.String }),
).annotations({
  identifier: "GuardrailConfiguration",
}) as any as S.Schema<GuardrailConfiguration>;
export type RAGStopSequences = string[];
export const RAGStopSequences = S.Array(S.String);
export interface TextInferenceConfig {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stopSequences?: RAGStopSequences;
}
export const TextInferenceConfig = S.suspend(() =>
  S.Struct({
    temperature: S.optional(S.Number),
    topP: S.optional(S.Number),
    maxTokens: S.optional(S.Number),
    stopSequences: S.optional(RAGStopSequences),
  }),
).annotations({
  identifier: "TextInferenceConfig",
}) as any as S.Schema<TextInferenceConfig>;
export interface KbInferenceConfig {
  textInferenceConfig?: TextInferenceConfig;
}
export const KbInferenceConfig = S.suspend(() =>
  S.Struct({ textInferenceConfig: S.optional(TextInferenceConfig) }),
).annotations({
  identifier: "KbInferenceConfig",
}) as any as S.Schema<KbInferenceConfig>;
export interface GenerationConfiguration {
  promptTemplate?: PromptTemplate;
  guardrailConfiguration?: GuardrailConfiguration;
  kbInferenceConfig?: KbInferenceConfig;
  additionalModelRequestFields?: AdditionalModelRequestFields;
}
export const GenerationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(PromptTemplate),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    kbInferenceConfig: S.optional(KbInferenceConfig),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "GenerationConfiguration",
}) as any as S.Schema<GenerationConfiguration>;
export interface QueryTransformationConfiguration {
  type: string;
}
export const QueryTransformationConfiguration = S.suspend(() =>
  S.Struct({ type: S.String }),
).annotations({
  identifier: "QueryTransformationConfiguration",
}) as any as S.Schema<QueryTransformationConfiguration>;
export interface OrchestrationConfiguration {
  queryTransformationConfiguration: QueryTransformationConfiguration;
}
export const OrchestrationConfiguration = S.suspend(() =>
  S.Struct({
    queryTransformationConfiguration: QueryTransformationConfiguration,
  }),
).annotations({
  identifier: "OrchestrationConfiguration",
}) as any as S.Schema<OrchestrationConfiguration>;
export interface KnowledgeBaseRetrieveAndGenerateConfiguration {
  knowledgeBaseId: string;
  modelArn: string;
  retrievalConfiguration?: KnowledgeBaseRetrievalConfiguration;
  generationConfiguration?: GenerationConfiguration;
  orchestrationConfiguration?: OrchestrationConfiguration;
}
export const KnowledgeBaseRetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    knowledgeBaseId: S.String,
    modelArn: S.String,
    retrievalConfiguration: S.optional(KnowledgeBaseRetrievalConfiguration),
    generationConfiguration: S.optional(GenerationConfiguration),
    orchestrationConfiguration: S.optional(OrchestrationConfiguration),
  }),
).annotations({
  identifier: "KnowledgeBaseRetrieveAndGenerateConfiguration",
}) as any as S.Schema<KnowledgeBaseRetrieveAndGenerateConfiguration>;
export interface S3ObjectDoc {
  uri: string;
}
export const S3ObjectDoc = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({ identifier: "S3ObjectDoc" }) as any as S.Schema<S3ObjectDoc>;
export interface ByteContentDoc {
  identifier: string | Redacted.Redacted<string>;
  contentType: string;
  data: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const ByteContentDoc = S.suspend(() =>
  S.Struct({
    identifier: SensitiveString,
    contentType: S.String,
    data: SensitiveBlob,
  }),
).annotations({
  identifier: "ByteContentDoc",
}) as any as S.Schema<ByteContentDoc>;
export interface ExternalSource {
  sourceType: string;
  s3Location?: S3ObjectDoc;
  byteContent?: ByteContentDoc;
}
export const ExternalSource = S.suspend(() =>
  S.Struct({
    sourceType: S.String,
    s3Location: S.optional(S3ObjectDoc),
    byteContent: S.optional(ByteContentDoc),
  }),
).annotations({
  identifier: "ExternalSource",
}) as any as S.Schema<ExternalSource>;
export type ExternalSources = ExternalSource[];
export const ExternalSources = S.Array(ExternalSource);
export interface ExternalSourcesGenerationConfiguration {
  promptTemplate?: PromptTemplate;
  guardrailConfiguration?: GuardrailConfiguration;
  kbInferenceConfig?: KbInferenceConfig;
  additionalModelRequestFields?: AdditionalModelRequestFields;
}
export const ExternalSourcesGenerationConfiguration = S.suspend(() =>
  S.Struct({
    promptTemplate: S.optional(PromptTemplate),
    guardrailConfiguration: S.optional(GuardrailConfiguration),
    kbInferenceConfig: S.optional(KbInferenceConfig),
    additionalModelRequestFields: S.optional(AdditionalModelRequestFields),
  }),
).annotations({
  identifier: "ExternalSourcesGenerationConfiguration",
}) as any as S.Schema<ExternalSourcesGenerationConfiguration>;
export interface ExternalSourcesRetrieveAndGenerateConfiguration {
  modelArn: string;
  sources: ExternalSources;
  generationConfiguration?: ExternalSourcesGenerationConfiguration;
}
export const ExternalSourcesRetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    sources: ExternalSources,
    generationConfiguration: S.optional(ExternalSourcesGenerationConfiguration),
  }),
).annotations({
  identifier: "ExternalSourcesRetrieveAndGenerateConfiguration",
}) as any as S.Schema<ExternalSourcesRetrieveAndGenerateConfiguration>;
export interface RetrieveAndGenerateConfiguration {
  type: string;
  knowledgeBaseConfiguration?: KnowledgeBaseRetrieveAndGenerateConfiguration;
  externalSourcesConfiguration?: ExternalSourcesRetrieveAndGenerateConfiguration;
}
export const RetrieveAndGenerateConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    knowledgeBaseConfiguration: S.optional(
      KnowledgeBaseRetrieveAndGenerateConfiguration,
    ),
    externalSourcesConfiguration: S.optional(
      ExternalSourcesRetrieveAndGenerateConfiguration,
    ),
  }),
).annotations({
  identifier: "RetrieveAndGenerateConfiguration",
}) as any as S.Schema<RetrieveAndGenerateConfiguration>;
export type KnowledgeBaseConfig =
  | { retrieveConfig: RetrieveConfig }
  | { retrieveAndGenerateConfig: RetrieveAndGenerateConfiguration };
export const KnowledgeBaseConfig = S.Union(
  S.Struct({ retrieveConfig: RetrieveConfig }),
  S.Struct({ retrieveAndGenerateConfig: RetrieveAndGenerateConfiguration }),
);
export interface EvaluationPrecomputedRetrieveSourceConfig {
  ragSourceIdentifier: string;
}
export const EvaluationPrecomputedRetrieveSourceConfig = S.suspend(() =>
  S.Struct({ ragSourceIdentifier: S.String }),
).annotations({
  identifier: "EvaluationPrecomputedRetrieveSourceConfig",
}) as any as S.Schema<EvaluationPrecomputedRetrieveSourceConfig>;
export interface EvaluationPrecomputedRetrieveAndGenerateSourceConfig {
  ragSourceIdentifier: string;
}
export const EvaluationPrecomputedRetrieveAndGenerateSourceConfig = S.suspend(
  () => S.Struct({ ragSourceIdentifier: S.String }),
).annotations({
  identifier: "EvaluationPrecomputedRetrieveAndGenerateSourceConfig",
}) as any as S.Schema<EvaluationPrecomputedRetrieveAndGenerateSourceConfig>;
export type EvaluationPrecomputedRagSourceConfig =
  | { retrieveSourceConfig: EvaluationPrecomputedRetrieveSourceConfig }
  | {
      retrieveAndGenerateSourceConfig: EvaluationPrecomputedRetrieveAndGenerateSourceConfig;
    };
export const EvaluationPrecomputedRagSourceConfig = S.Union(
  S.Struct({ retrieveSourceConfig: EvaluationPrecomputedRetrieveSourceConfig }),
  S.Struct({
    retrieveAndGenerateSourceConfig:
      EvaluationPrecomputedRetrieveAndGenerateSourceConfig,
  }),
);
export type RAGConfig =
  | { knowledgeBaseConfig: (typeof KnowledgeBaseConfig)["Type"] }
  | {
      precomputedRagSourceConfig: (typeof EvaluationPrecomputedRagSourceConfig)["Type"];
    };
export const RAGConfig = S.Union(
  S.Struct({ knowledgeBaseConfig: KnowledgeBaseConfig }),
  S.Struct({
    precomputedRagSourceConfig: EvaluationPrecomputedRagSourceConfig,
  }),
);
export type RagConfigs = (typeof RAGConfig)["Type"][];
export const RagConfigs = S.Array(RAGConfig);
export type EvaluationInferenceConfig =
  | { models: EvaluationModelConfigs }
  | { ragConfigs: RagConfigs };
export const EvaluationInferenceConfig = S.Union(
  S.Struct({ models: EvaluationModelConfigs }),
  S.Struct({ ragConfigs: RagConfigs }),
);
export interface GetEvaluationJobResponse {
  jobName: string;
  status: string;
  jobArn: string;
  jobDescription?: string | Redacted.Redacted<string>;
  roleArn: string;
  customerEncryptionKeyId?: string;
  jobType: string;
  applicationType?: string;
  evaluationConfig: (typeof EvaluationConfig)["Type"];
  inferenceConfig: (typeof EvaluationInferenceConfig)["Type"];
  outputDataConfig: EvaluationOutputDataConfig;
  creationTime: Date;
  lastModifiedTime?: Date;
  failureMessages?: ErrorMessages;
}
export const GetEvaluationJobResponse = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    status: S.String,
    jobArn: S.String,
    jobDescription: S.optional(SensitiveString),
    roleArn: S.String,
    customerEncryptionKeyId: S.optional(S.String),
    jobType: S.String,
    applicationType: S.optional(S.String),
    evaluationConfig: EvaluationConfig,
    inferenceConfig: EvaluationInferenceConfig,
    outputDataConfig: EvaluationOutputDataConfig,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    failureMessages: S.optional(ErrorMessages),
  }),
).annotations({
  identifier: "GetEvaluationJobResponse",
}) as any as S.Schema<GetEvaluationJobResponse>;
export interface UpdateGuardrailResponse {
  guardrailId: string;
  guardrailArn: string;
  version: string;
  updatedAt: Date;
}
export const UpdateGuardrailResponse = S.suspend(() =>
  S.Struct({
    guardrailId: S.String,
    guardrailArn: S.String,
    version: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateGuardrailResponse",
}) as any as S.Schema<UpdateGuardrailResponse>;
export interface CreateGuardrailVersionResponse {
  guardrailId: string;
  version: string;
}
export const CreateGuardrailVersionResponse = S.suspend(() =>
  S.Struct({ guardrailId: S.String, version: S.String }),
).annotations({
  identifier: "CreateGuardrailVersionResponse",
}) as any as S.Schema<CreateGuardrailVersionResponse>;
export interface CreateInferenceProfileRequest {
  inferenceProfileName: string;
  description?: string | Redacted.Redacted<string>;
  clientRequestToken?: string;
  modelSource: (typeof InferenceProfileModelSource)["Type"];
  tags?: TagList;
}
export const CreateInferenceProfileRequest = S.suspend(() =>
  S.Struct({
    inferenceProfileName: S.String,
    description: S.optional(SensitiveString),
    clientRequestToken: S.optional(S.String),
    modelSource: InferenceProfileModelSource,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/inference-profiles" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateInferenceProfileRequest",
}) as any as S.Schema<CreateInferenceProfileRequest>;
export interface CreateModelCopyJobResponse {
  jobArn: string;
}
export const CreateModelCopyJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateModelCopyJobResponse",
}) as any as S.Schema<CreateModelCopyJobResponse>;
export interface GetModelCopyJobResponse {
  jobArn: string;
  status: string;
  creationTime: Date;
  targetModelArn: string;
  targetModelName?: string;
  sourceAccountId: string;
  sourceModelArn: string;
  targetModelKmsKeyArn?: string;
  targetModelTags?: TagList;
  failureMessage?: string;
  sourceModelName?: string;
}
export const GetModelCopyJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    targetModelArn: S.String,
    targetModelName: S.optional(S.String),
    sourceAccountId: S.String,
    sourceModelArn: S.String,
    targetModelKmsKeyArn: S.optional(S.String),
    targetModelTags: S.optional(TagList),
    failureMessage: S.optional(S.String),
    sourceModelName: S.optional(S.String),
  }),
).annotations({
  identifier: "GetModelCopyJobResponse",
}) as any as S.Schema<GetModelCopyJobResponse>;
export interface S3DataSource {
  s3Uri: string;
}
export const S3DataSource = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({ identifier: "S3DataSource" }) as any as S.Schema<S3DataSource>;
export type ModelDataSource = { s3DataSource: S3DataSource };
export const ModelDataSource = S.Union(
  S.Struct({ s3DataSource: S3DataSource }),
);
export interface CreateModelImportJobRequest {
  jobName: string;
  importedModelName: string;
  roleArn: string;
  modelDataSource: (typeof ModelDataSource)["Type"];
  jobTags?: TagList;
  importedModelTags?: TagList;
  clientRequestToken?: string;
  vpcConfig?: VpcConfig;
  importedModelKmsKeyId?: string;
}
export const CreateModelImportJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    importedModelName: S.String,
    roleArn: S.String,
    modelDataSource: ModelDataSource,
    jobTags: S.optional(TagList),
    importedModelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
    vpcConfig: S.optional(VpcConfig),
    importedModelKmsKeyId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/model-import-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelImportJobRequest",
}) as any as S.Schema<CreateModelImportJobRequest>;
export interface GetModelImportJobResponse {
  jobArn?: string;
  jobName?: string;
  importedModelName?: string;
  importedModelArn?: string;
  roleArn?: string;
  modelDataSource?: (typeof ModelDataSource)["Type"];
  status?: string;
  failureMessage?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  vpcConfig?: VpcConfig;
  importedModelKmsKeyArn?: string;
}
export const GetModelImportJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    importedModelName: S.optional(S.String),
    importedModelArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    modelDataSource: S.optional(ModelDataSource),
    status: S.optional(S.String),
    failureMessage: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    vpcConfig: S.optional(VpcConfig),
    importedModelKmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetModelImportJobResponse",
}) as any as S.Schema<GetModelImportJobResponse>;
export interface ModelInvocationJobS3InputDataConfig {
  s3InputFormat?: string;
  s3Uri: string;
  s3BucketOwner?: string;
}
export const ModelInvocationJobS3InputDataConfig = S.suspend(() =>
  S.Struct({
    s3InputFormat: S.optional(S.String),
    s3Uri: S.String,
    s3BucketOwner: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelInvocationJobS3InputDataConfig",
}) as any as S.Schema<ModelInvocationJobS3InputDataConfig>;
export type ModelInvocationJobInputDataConfig = {
  s3InputDataConfig: ModelInvocationJobS3InputDataConfig;
};
export const ModelInvocationJobInputDataConfig = S.Union(
  S.Struct({ s3InputDataConfig: ModelInvocationJobS3InputDataConfig }),
);
export interface ModelInvocationJobS3OutputDataConfig {
  s3Uri: string;
  s3EncryptionKeyId?: string;
  s3BucketOwner?: string;
}
export const ModelInvocationJobS3OutputDataConfig = S.suspend(() =>
  S.Struct({
    s3Uri: S.String,
    s3EncryptionKeyId: S.optional(S.String),
    s3BucketOwner: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelInvocationJobS3OutputDataConfig",
}) as any as S.Schema<ModelInvocationJobS3OutputDataConfig>;
export type ModelInvocationJobOutputDataConfig = {
  s3OutputDataConfig: ModelInvocationJobS3OutputDataConfig;
};
export const ModelInvocationJobOutputDataConfig = S.Union(
  S.Struct({ s3OutputDataConfig: ModelInvocationJobS3OutputDataConfig }),
);
export interface GetModelInvocationJobResponse {
  jobArn: string;
  jobName?: string;
  modelId: string;
  clientRequestToken?: string;
  roleArn: string;
  status?: string;
  message?: string | Redacted.Redacted<string>;
  submitTime: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  inputDataConfig: (typeof ModelInvocationJobInputDataConfig)["Type"];
  outputDataConfig: (typeof ModelInvocationJobOutputDataConfig)["Type"];
  vpcConfig?: VpcConfig;
  timeoutDurationInHours?: number;
  jobExpirationTime?: Date;
}
export const GetModelInvocationJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobName: S.optional(S.String),
    modelId: S.String,
    clientRequestToken: S.optional(S.String),
    roleArn: S.String,
    status: S.optional(S.String),
    message: S.optional(SensitiveString),
    submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    inputDataConfig: ModelInvocationJobInputDataConfig,
    outputDataConfig: ModelInvocationJobOutputDataConfig,
    vpcConfig: S.optional(VpcConfig),
    timeoutDurationInHours: S.optional(S.Number),
    jobExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetModelInvocationJobResponse",
}) as any as S.Schema<GetModelInvocationJobResponse>;
export interface CreatePromptRouterRequest {
  clientRequestToken?: string;
  promptRouterName: string;
  models: PromptRouterTargetModels;
  description?: string | Redacted.Redacted<string>;
  routingCriteria: RoutingCriteria;
  fallbackModel: PromptRouterTargetModel;
  tags?: TagList;
}
export const CreatePromptRouterRequest = S.suspend(() =>
  S.Struct({
    clientRequestToken: S.optional(S.String),
    promptRouterName: S.String,
    models: PromptRouterTargetModels,
    description: S.optional(SensitiveString),
    routingCriteria: RoutingCriteria,
    fallbackModel: PromptRouterTargetModel,
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/prompt-routers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreatePromptRouterRequest",
}) as any as S.Schema<CreatePromptRouterRequest>;
export interface GetPromptRouterResponse {
  promptRouterName: string;
  routingCriteria: RoutingCriteria;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  updatedAt?: Date;
  promptRouterArn: string;
  models: PromptRouterTargetModels;
  fallbackModel: PromptRouterTargetModel;
  status: string;
  type: string;
}
export const GetPromptRouterResponse = S.suspend(() =>
  S.Struct({
    promptRouterName: S.String,
    routingCriteria: RoutingCriteria,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    promptRouterArn: S.String,
    models: PromptRouterTargetModels,
    fallbackModel: PromptRouterTargetModel,
    status: S.String,
    type: S.String,
  }),
).annotations({
  identifier: "GetPromptRouterResponse",
}) as any as S.Schema<GetPromptRouterResponse>;
export interface CreateProvisionedModelThroughputResponse {
  provisionedModelArn: string;
}
export const CreateProvisionedModelThroughputResponse = S.suspend(() =>
  S.Struct({ provisionedModelArn: S.String }),
).annotations({
  identifier: "CreateProvisionedModelThroughputResponse",
}) as any as S.Schema<CreateProvisionedModelThroughputResponse>;
export interface GetProvisionedModelThroughputResponse {
  modelUnits: number;
  desiredModelUnits: number;
  provisionedModelName: string;
  provisionedModelArn: string;
  modelArn: string;
  desiredModelArn: string;
  foundationModelArn: string;
  status: string;
  creationTime: Date;
  lastModifiedTime: Date;
  failureMessage?: string;
  commitmentDuration?: string;
  commitmentExpirationTime?: Date;
}
export const GetProvisionedModelThroughputResponse = S.suspend(() =>
  S.Struct({
    modelUnits: S.Number,
    desiredModelUnits: S.Number,
    provisionedModelName: S.String,
    provisionedModelArn: S.String,
    modelArn: S.String,
    desiredModelArn: S.String,
    foundationModelArn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
    failureMessage: S.optional(S.String),
    commitmentDuration: S.optional(S.String),
    commitmentExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "GetProvisionedModelThroughputResponse",
}) as any as S.Schema<GetProvisionedModelThroughputResponse>;
export interface CreateFoundationModelAgreementResponse {
  modelId: string;
}
export const CreateFoundationModelAgreementResponse = S.suspend(() =>
  S.Struct({ modelId: S.String }),
).annotations({
  identifier: "CreateFoundationModelAgreementResponse",
}) as any as S.Schema<CreateFoundationModelAgreementResponse>;
export interface ListTagsForResourceResponse {
  tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type EvaluationTaskTypes = string[];
export const EvaluationTaskTypes = S.Array(S.String);
export type EvaluationBedrockModelIdentifiers = string[];
export const EvaluationBedrockModelIdentifiers = S.Array(S.String);
export type EvaluationBedrockKnowledgeBaseIdentifiers = string[];
export const EvaluationBedrockKnowledgeBaseIdentifiers = S.Array(S.String);
export type EvaluatorModelIdentifiers = string[];
export const EvaluatorModelIdentifiers = S.Array(S.String);
export type ModelModalityList = string[];
export const ModelModalityList = S.Array(S.String);
export type ModelCustomizationList = string[];
export const ModelCustomizationList = S.Array(S.String);
export type InferenceTypeList = string[];
export const InferenceTypeList = S.Array(S.String);
export interface Validator {
  s3Uri: string;
}
export const Validator = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({ identifier: "Validator" }) as any as S.Schema<Validator>;
export type Validators = Validator[];
export const Validators = S.Array(Validator);
export interface AutomatedReasoningPolicySummary {
  policyArn: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  version: string;
  policyId: string;
  createdAt: Date;
  updatedAt: Date;
}
export const AutomatedReasoningPolicySummary = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    version: S.String,
    policyId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicySummary",
}) as any as S.Schema<AutomatedReasoningPolicySummary>;
export type AutomatedReasoningPolicySummaries =
  AutomatedReasoningPolicySummary[];
export const AutomatedReasoningPolicySummaries = S.Array(
  AutomatedReasoningPolicySummary,
);
export interface AutomatedReasoningPolicyScenario {
  expression: string | Redacted.Redacted<string>;
  alternateExpression: string | Redacted.Redacted<string>;
  expectedResult: string;
  ruleIds: AutomatedReasoningPolicyDefinitionRuleIdList;
}
export const AutomatedReasoningPolicyScenario = S.suspend(() =>
  S.Struct({
    expression: SensitiveString,
    alternateExpression: SensitiveString,
    expectedResult: S.String,
    ruleIds: AutomatedReasoningPolicyDefinitionRuleIdList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyScenario",
}) as any as S.Schema<AutomatedReasoningPolicyScenario>;
export interface AutomatedReasoningPolicyBuildWorkflowSummary {
  policyArn: string;
  buildWorkflowId: string;
  status: string;
  buildWorkflowType: string;
  createdAt: Date;
  updatedAt: Date;
}
export const AutomatedReasoningPolicyBuildWorkflowSummary = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    buildWorkflowId: S.String,
    status: S.String,
    buildWorkflowType: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildWorkflowSummary",
}) as any as S.Schema<AutomatedReasoningPolicyBuildWorkflowSummary>;
export type AutomatedReasoningPolicyBuildWorkflowSummaries =
  AutomatedReasoningPolicyBuildWorkflowSummary[];
export const AutomatedReasoningPolicyBuildWorkflowSummaries = S.Array(
  AutomatedReasoningPolicyBuildWorkflowSummary,
);
export interface MarketplaceModelEndpointSummary {
  endpointArn: string;
  modelSourceIdentifier: string;
  status?: string;
  statusMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
export const MarketplaceModelEndpointSummary = S.suspend(() =>
  S.Struct({
    endpointArn: S.String,
    modelSourceIdentifier: S.String,
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "MarketplaceModelEndpointSummary",
}) as any as S.Schema<MarketplaceModelEndpointSummary>;
export type MarketplaceModelEndpointSummaries =
  MarketplaceModelEndpointSummary[];
export const MarketplaceModelEndpointSummaries = S.Array(
  MarketplaceModelEndpointSummary,
);
export interface CustomModelDeploymentUpdateDetails {
  modelArn: string;
  updateStatus: string;
}
export const CustomModelDeploymentUpdateDetails = S.suspend(() =>
  S.Struct({ modelArn: S.String, updateStatus: S.String }),
).annotations({
  identifier: "CustomModelDeploymentUpdateDetails",
}) as any as S.Schema<CustomModelDeploymentUpdateDetails>;
export interface CustomModelDeploymentSummary {
  customModelDeploymentArn: string;
  customModelDeploymentName: string;
  modelArn: string;
  createdAt: Date;
  status: string;
  lastUpdatedAt?: Date;
  failureMessage?: string;
}
export const CustomModelDeploymentSummary = S.suspend(() =>
  S.Struct({
    customModelDeploymentArn: S.String,
    customModelDeploymentName: S.String,
    modelArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomModelDeploymentSummary",
}) as any as S.Schema<CustomModelDeploymentSummary>;
export type CustomModelDeploymentSummaryList = CustomModelDeploymentSummary[];
export const CustomModelDeploymentSummaryList = S.Array(
  CustomModelDeploymentSummary,
);
export interface TrainingMetrics {
  trainingLoss?: number;
}
export const TrainingMetrics = S.suspend(() =>
  S.Struct({ trainingLoss: S.optional(S.Number) }),
).annotations({
  identifier: "TrainingMetrics",
}) as any as S.Schema<TrainingMetrics>;
export interface ValidatorMetric {
  validationLoss?: number;
}
export const ValidatorMetric = S.suspend(() =>
  S.Struct({ validationLoss: S.optional(S.Number) }),
).annotations({
  identifier: "ValidatorMetric",
}) as any as S.Schema<ValidatorMetric>;
export type ValidationMetrics = ValidatorMetric[];
export const ValidationMetrics = S.Array(ValidatorMetric);
export interface CustomModelSummary {
  modelArn: string;
  modelName: string;
  creationTime: Date;
  baseModelArn: string;
  baseModelName: string;
  customizationType?: string;
  ownerAccountId?: string;
  modelStatus?: string;
}
export const CustomModelSummary = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    modelName: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    baseModelArn: S.String,
    baseModelName: S.String,
    customizationType: S.optional(S.String),
    ownerAccountId: S.optional(S.String),
    modelStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomModelSummary",
}) as any as S.Schema<CustomModelSummary>;
export type CustomModelSummaryList = CustomModelSummary[];
export const CustomModelSummaryList = S.Array(CustomModelSummary);
export interface AccountEnforcedGuardrailOutputConfiguration {
  configId?: string;
  guardrailArn?: string;
  guardrailId?: string;
  inputTags?: string;
  guardrailVersion?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  owner?: string;
}
export const AccountEnforcedGuardrailOutputConfiguration = S.suspend(() =>
  S.Struct({
    configId: S.optional(S.String),
    guardrailArn: S.optional(S.String),
    guardrailId: S.optional(S.String),
    inputTags: S.optional(S.String),
    guardrailVersion: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdBy: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
    owner: S.optional(S.String),
  }),
).annotations({
  identifier: "AccountEnforcedGuardrailOutputConfiguration",
}) as any as S.Schema<AccountEnforcedGuardrailOutputConfiguration>;
export type AccountEnforcedGuardrailsOutputConfiguration =
  AccountEnforcedGuardrailOutputConfiguration[];
export const AccountEnforcedGuardrailsOutputConfiguration = S.Array(
  AccountEnforcedGuardrailOutputConfiguration,
);
export interface BatchDeleteEvaluationJobError {
  jobIdentifier: string | Redacted.Redacted<string>;
  code: string;
  message?: string;
}
export const BatchDeleteEvaluationJobError = S.suspend(() =>
  S.Struct({
    jobIdentifier: SensitiveString,
    code: S.String,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchDeleteEvaluationJobError",
}) as any as S.Schema<BatchDeleteEvaluationJobError>;
export type BatchDeleteEvaluationJobErrors = BatchDeleteEvaluationJobError[];
export const BatchDeleteEvaluationJobErrors = S.Array(
  BatchDeleteEvaluationJobError,
);
export interface BatchDeleteEvaluationJobItem {
  jobIdentifier: string | Redacted.Redacted<string>;
  jobStatus: string;
}
export const BatchDeleteEvaluationJobItem = S.suspend(() =>
  S.Struct({ jobIdentifier: SensitiveString, jobStatus: S.String }),
).annotations({
  identifier: "BatchDeleteEvaluationJobItem",
}) as any as S.Schema<BatchDeleteEvaluationJobItem>;
export type BatchDeleteEvaluationJobItems = BatchDeleteEvaluationJobItem[];
export const BatchDeleteEvaluationJobItems = S.Array(
  BatchDeleteEvaluationJobItem,
);
export interface GuardrailAutomatedReasoningPolicy {
  policies: AutomatedReasoningPolicyArnList;
  confidenceThreshold?: number;
}
export const GuardrailAutomatedReasoningPolicy = S.suspend(() =>
  S.Struct({
    policies: AutomatedReasoningPolicyArnList,
    confidenceThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "GuardrailAutomatedReasoningPolicy",
}) as any as S.Schema<GuardrailAutomatedReasoningPolicy>;
export interface GuardrailCrossRegionDetails {
  guardrailProfileId?: string;
  guardrailProfileArn?: string;
}
export const GuardrailCrossRegionDetails = S.suspend(() =>
  S.Struct({
    guardrailProfileId: S.optional(S.String),
    guardrailProfileArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GuardrailCrossRegionDetails",
}) as any as S.Schema<GuardrailCrossRegionDetails>;
export interface GuardrailSummary {
  id: string;
  arn: string;
  status: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  crossRegionDetails?: GuardrailCrossRegionDetails;
}
export const GuardrailSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    status: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    crossRegionDetails: S.optional(GuardrailCrossRegionDetails),
  }),
).annotations({
  identifier: "GuardrailSummary",
}) as any as S.Schema<GuardrailSummary>;
export type GuardrailSummaries = GuardrailSummary[];
export const GuardrailSummaries = S.Array(GuardrailSummary);
export interface InferenceProfileModel {
  modelArn?: string;
}
export const InferenceProfileModel = S.suspend(() =>
  S.Struct({ modelArn: S.optional(S.String) }),
).annotations({
  identifier: "InferenceProfileModel",
}) as any as S.Schema<InferenceProfileModel>;
export type InferenceProfileModels = InferenceProfileModel[];
export const InferenceProfileModels = S.Array(InferenceProfileModel);
export interface InferenceProfileSummary {
  inferenceProfileName: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  updatedAt?: Date;
  inferenceProfileArn: string;
  models: InferenceProfileModels;
  inferenceProfileId: string;
  status: string;
  type: string;
}
export const InferenceProfileSummary = S.suspend(() =>
  S.Struct({
    inferenceProfileName: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    inferenceProfileArn: S.String,
    models: InferenceProfileModels,
    inferenceProfileId: S.String,
    status: S.String,
    type: S.String,
  }),
).annotations({
  identifier: "InferenceProfileSummary",
}) as any as S.Schema<InferenceProfileSummary>;
export type InferenceProfileSummaries = InferenceProfileSummary[];
export const InferenceProfileSummaries = S.Array(InferenceProfileSummary);
export interface ModelCopyJobSummary {
  jobArn: string;
  status: string;
  creationTime: Date;
  targetModelArn: string;
  targetModelName?: string;
  sourceAccountId: string;
  sourceModelArn: string;
  targetModelKmsKeyArn?: string;
  targetModelTags?: TagList;
  failureMessage?: string;
  sourceModelName?: string;
}
export const ModelCopyJobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    targetModelArn: S.String,
    targetModelName: S.optional(S.String),
    sourceAccountId: S.String,
    sourceModelArn: S.String,
    targetModelKmsKeyArn: S.optional(S.String),
    targetModelTags: S.optional(TagList),
    failureMessage: S.optional(S.String),
    sourceModelName: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelCopyJobSummary",
}) as any as S.Schema<ModelCopyJobSummary>;
export type ModelCopyJobSummaries = ModelCopyJobSummary[];
export const ModelCopyJobSummaries = S.Array(ModelCopyJobSummary);
export interface CustomModelUnits {
  customModelUnitsPerModelCopy?: number;
  customModelUnitsVersion?: string;
}
export const CustomModelUnits = S.suspend(() =>
  S.Struct({
    customModelUnitsPerModelCopy: S.optional(S.Number),
    customModelUnitsVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomModelUnits",
}) as any as S.Schema<CustomModelUnits>;
export interface ImportedModelSummary {
  modelArn: string;
  modelName: string;
  creationTime: Date;
  instructSupported?: boolean;
  modelArchitecture?: string;
}
export const ImportedModelSummary = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    modelName: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    instructSupported: S.optional(S.Boolean),
    modelArchitecture: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportedModelSummary",
}) as any as S.Schema<ImportedModelSummary>;
export type ImportedModelSummaryList = ImportedModelSummary[];
export const ImportedModelSummaryList = S.Array(ImportedModelSummary);
export interface ModelImportJobSummary {
  jobArn: string;
  jobName: string;
  status: string;
  lastModifiedTime?: Date;
  creationTime: Date;
  endTime?: Date;
  importedModelArn?: string;
  importedModelName?: string;
}
export const ModelImportJobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobName: S.String,
    status: S.String,
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    importedModelArn: S.optional(S.String),
    importedModelName: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelImportJobSummary",
}) as any as S.Schema<ModelImportJobSummary>;
export type ModelImportJobSummaries = ModelImportJobSummary[];
export const ModelImportJobSummaries = S.Array(ModelImportJobSummary);
export interface ModelInvocationJobSummary {
  jobArn: string;
  jobName: string;
  modelId: string;
  clientRequestToken?: string;
  roleArn: string;
  status?: string;
  message?: string | Redacted.Redacted<string>;
  submitTime: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  inputDataConfig: (typeof ModelInvocationJobInputDataConfig)["Type"];
  outputDataConfig: (typeof ModelInvocationJobOutputDataConfig)["Type"];
  vpcConfig?: VpcConfig;
  timeoutDurationInHours?: number;
  jobExpirationTime?: Date;
}
export const ModelInvocationJobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobName: S.String,
    modelId: S.String,
    clientRequestToken: S.optional(S.String),
    roleArn: S.String,
    status: S.optional(S.String),
    message: S.optional(SensitiveString),
    submitTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    inputDataConfig: ModelInvocationJobInputDataConfig,
    outputDataConfig: ModelInvocationJobOutputDataConfig,
    vpcConfig: S.optional(VpcConfig),
    timeoutDurationInHours: S.optional(S.Number),
    jobExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ModelInvocationJobSummary",
}) as any as S.Schema<ModelInvocationJobSummary>;
export type ModelInvocationJobSummaries = ModelInvocationJobSummary[];
export const ModelInvocationJobSummaries = S.Array(ModelInvocationJobSummary);
export interface FoundationModelLifecycle {
  status: string;
}
export const FoundationModelLifecycle = S.suspend(() =>
  S.Struct({ status: S.String }),
).annotations({
  identifier: "FoundationModelLifecycle",
}) as any as S.Schema<FoundationModelLifecycle>;
export interface FoundationModelSummary {
  modelArn: string;
  modelId: string;
  modelName?: string;
  providerName?: string;
  inputModalities?: ModelModalityList;
  outputModalities?: ModelModalityList;
  responseStreamingSupported?: boolean;
  customizationsSupported?: ModelCustomizationList;
  inferenceTypesSupported?: InferenceTypeList;
  modelLifecycle?: FoundationModelLifecycle;
}
export const FoundationModelSummary = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    modelId: S.String,
    modelName: S.optional(S.String),
    providerName: S.optional(S.String),
    inputModalities: S.optional(ModelModalityList),
    outputModalities: S.optional(ModelModalityList),
    responseStreamingSupported: S.optional(S.Boolean),
    customizationsSupported: S.optional(ModelCustomizationList),
    inferenceTypesSupported: S.optional(InferenceTypeList),
    modelLifecycle: S.optional(FoundationModelLifecycle),
  }),
).annotations({
  identifier: "FoundationModelSummary",
}) as any as S.Schema<FoundationModelSummary>;
export type FoundationModelSummaryList = FoundationModelSummary[];
export const FoundationModelSummaryList = S.Array(FoundationModelSummary);
export interface PromptRouterSummary {
  promptRouterName: string;
  routingCriteria: RoutingCriteria;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  updatedAt?: Date;
  promptRouterArn: string;
  models: PromptRouterTargetModels;
  fallbackModel: PromptRouterTargetModel;
  status: string;
  type: string;
}
export const PromptRouterSummary = S.suspend(() =>
  S.Struct({
    promptRouterName: S.String,
    routingCriteria: RoutingCriteria,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    promptRouterArn: S.String,
    models: PromptRouterTargetModels,
    fallbackModel: PromptRouterTargetModel,
    status: S.String,
    type: S.String,
  }),
).annotations({
  identifier: "PromptRouterSummary",
}) as any as S.Schema<PromptRouterSummary>;
export type PromptRouterSummaries = PromptRouterSummary[];
export const PromptRouterSummaries = S.Array(PromptRouterSummary);
export interface ProvisionedModelSummary {
  provisionedModelName: string;
  provisionedModelArn: string;
  modelArn: string;
  desiredModelArn: string;
  foundationModelArn: string;
  modelUnits: number;
  desiredModelUnits: number;
  status: string;
  commitmentDuration?: string;
  commitmentExpirationTime?: Date;
  creationTime: Date;
  lastModifiedTime: Date;
}
export const ProvisionedModelSummary = S.suspend(() =>
  S.Struct({
    provisionedModelName: S.String,
    provisionedModelArn: S.String,
    modelArn: S.String,
    desiredModelArn: S.String,
    foundationModelArn: S.String,
    modelUnits: S.Number,
    desiredModelUnits: S.Number,
    status: S.String,
    commitmentDuration: S.optional(S.String),
    commitmentExpirationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "ProvisionedModelSummary",
}) as any as S.Schema<ProvisionedModelSummary>;
export type ProvisionedModelSummaries = ProvisionedModelSummary[];
export const ProvisionedModelSummaries = S.Array(ProvisionedModelSummary);
export interface AgreementAvailability {
  status: string;
  errorMessage?: string;
}
export const AgreementAvailability = S.suspend(() =>
  S.Struct({ status: S.String, errorMessage: S.optional(S.String) }),
).annotations({
  identifier: "AgreementAvailability",
}) as any as S.Schema<AgreementAvailability>;
export interface ValidationDataConfig {
  validators: Validators;
}
export const ValidationDataConfig = S.suspend(() =>
  S.Struct({ validators: Validators }),
).annotations({
  identifier: "ValidationDataConfig",
}) as any as S.Schema<ValidationDataConfig>;
export interface ValidationDetails {
  status?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
}
export const ValidationDetails = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ValidationDetails",
}) as any as S.Schema<ValidationDetails>;
export interface DataProcessingDetails {
  status?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
}
export const DataProcessingDetails = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "DataProcessingDetails",
}) as any as S.Schema<DataProcessingDetails>;
export interface TrainingDetails {
  status?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
}
export const TrainingDetails = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "TrainingDetails",
}) as any as S.Schema<TrainingDetails>;
export interface StatusDetails {
  validationDetails?: ValidationDetails;
  dataProcessingDetails?: DataProcessingDetails;
  trainingDetails?: TrainingDetails;
}
export const StatusDetails = S.suspend(() =>
  S.Struct({
    validationDetails: S.optional(ValidationDetails),
    dataProcessingDetails: S.optional(DataProcessingDetails),
    trainingDetails: S.optional(TrainingDetails),
  }),
).annotations({
  identifier: "StatusDetails",
}) as any as S.Schema<StatusDetails>;
export interface ModelCustomizationJobSummary {
  jobArn: string;
  baseModelArn: string;
  jobName: string;
  status: string;
  statusDetails?: StatusDetails;
  lastModifiedTime?: Date;
  creationTime: Date;
  endTime?: Date;
  customModelArn?: string;
  customModelName?: string;
  customizationType?: string;
}
export const ModelCustomizationJobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    baseModelArn: S.String,
    jobName: S.String,
    status: S.String,
    statusDetails: S.optional(StatusDetails),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    customModelArn: S.optional(S.String),
    customModelName: S.optional(S.String),
    customizationType: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelCustomizationJobSummary",
}) as any as S.Schema<ModelCustomizationJobSummary>;
export type ModelCustomizationJobSummaries = ModelCustomizationJobSummary[];
export const ModelCustomizationJobSummaries = S.Array(
  ModelCustomizationJobSummary,
);
export type AutomatedReasoningPolicyDefinitionTypeNameList =
  | string
  | Redacted.Redacted<string>[];
export const AutomatedReasoningPolicyDefinitionTypeNameList =
  S.Array(SensitiveString);
export type AutomatedReasoningPolicyDefinitionVariableNameList =
  | string
  | Redacted.Redacted<string>[];
export const AutomatedReasoningPolicyDefinitionVariableNameList =
  S.Array(SensitiveString);
export type AutomatedReasoningPolicyConflictedRuleIdList = string[];
export const AutomatedReasoningPolicyConflictedRuleIdList = S.Array(S.String);
export type AutomatedReasoningPolicyScenarioList =
  AutomatedReasoningPolicyScenario[];
export const AutomatedReasoningPolicyScenarioList = S.Array(
  AutomatedReasoningPolicyScenario,
);
export interface AutomatedReasoningPolicyBuildWorkflowDocument {
  document: Uint8Array | Redacted.Redacted<Uint8Array>;
  documentContentType: string;
  documentName: string | Redacted.Redacted<string>;
  documentDescription?: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyBuildWorkflowDocument = S.suspend(() =>
  S.Struct({
    document: SensitiveBlob,
    documentContentType: S.String,
    documentName: SensitiveString,
    documentDescription: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildWorkflowDocument",
}) as any as S.Schema<AutomatedReasoningPolicyBuildWorkflowDocument>;
export type AutomatedReasoningPolicyBuildWorkflowDocumentList =
  AutomatedReasoningPolicyBuildWorkflowDocument[];
export const AutomatedReasoningPolicyBuildWorkflowDocumentList = S.Array(
  AutomatedReasoningPolicyBuildWorkflowDocument,
);
export interface AutomatedReasoningPolicyBuildWorkflowRepairContent {
  annotations: AutomatedReasoningPolicyAnnotationList;
}
export const AutomatedReasoningPolicyBuildWorkflowRepairContent = S.suspend(
  () => S.Struct({ annotations: AutomatedReasoningPolicyAnnotationList }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildWorkflowRepairContent",
}) as any as S.Schema<AutomatedReasoningPolicyBuildWorkflowRepairContent>;
export type InvocationLogSource = { s3Uri: string };
export const InvocationLogSource = S.Union(S.Struct({ s3Uri: S.String }));
export interface TeacherModelConfig {
  teacherModelIdentifier: string;
  maxResponseLengthForInference?: number;
}
export const TeacherModelConfig = S.suspend(() =>
  S.Struct({
    teacherModelIdentifier: S.String,
    maxResponseLengthForInference: S.optional(S.Number),
  }),
).annotations({
  identifier: "TeacherModelConfig",
}) as any as S.Schema<TeacherModelConfig>;
export interface RFTHyperParameters {
  epochCount?: number;
  batchSize?: number;
  learningRate?: number;
  maxPromptLength?: number;
  trainingSamplePerPrompt?: number;
  inferenceMaxTokens?: number;
  reasoningEffort?: string;
  evalInterval?: number;
}
export const RFTHyperParameters = S.suspend(() =>
  S.Struct({
    epochCount: S.optional(S.Number),
    batchSize: S.optional(S.Number),
    learningRate: S.optional(S.Number),
    maxPromptLength: S.optional(S.Number),
    trainingSamplePerPrompt: S.optional(S.Number),
    inferenceMaxTokens: S.optional(S.Number),
    reasoningEffort: S.optional(S.String),
    evalInterval: S.optional(S.Number),
  }),
).annotations({
  identifier: "RFTHyperParameters",
}) as any as S.Schema<RFTHyperParameters>;
export interface ListAutomatedReasoningPoliciesResponse {
  automatedReasoningPolicySummaries: AutomatedReasoningPolicySummaries;
  nextToken?: string;
}
export const ListAutomatedReasoningPoliciesResponse = S.suspend(() =>
  S.Struct({
    automatedReasoningPolicySummaries: AutomatedReasoningPolicySummaries,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAutomatedReasoningPoliciesResponse",
}) as any as S.Schema<ListAutomatedReasoningPoliciesResponse>;
export interface GetAutomatedReasoningPolicyNextScenarioResponse {
  policyArn: string;
  scenario?: AutomatedReasoningPolicyScenario;
}
export const GetAutomatedReasoningPolicyNextScenarioResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    scenario: S.optional(AutomatedReasoningPolicyScenario),
  }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyNextScenarioResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyNextScenarioResponse>;
export interface GetAutomatedReasoningPolicyTestCaseResponse {
  policyArn: string;
  testCase: AutomatedReasoningPolicyTestCase;
}
export const GetAutomatedReasoningPolicyTestCaseResponse = S.suspend(() =>
  S.Struct({ policyArn: S.String, testCase: AutomatedReasoningPolicyTestCase }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyTestCaseResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyTestCaseResponse>;
export interface ListAutomatedReasoningPolicyBuildWorkflowsResponse {
  automatedReasoningPolicyBuildWorkflowSummaries: AutomatedReasoningPolicyBuildWorkflowSummaries;
  nextToken?: string;
}
export const ListAutomatedReasoningPolicyBuildWorkflowsResponse = S.suspend(
  () =>
    S.Struct({
      automatedReasoningPolicyBuildWorkflowSummaries:
        AutomatedReasoningPolicyBuildWorkflowSummaries,
      nextToken: S.optional(S.String),
    }),
).annotations({
  identifier: "ListAutomatedReasoningPolicyBuildWorkflowsResponse",
}) as any as S.Schema<ListAutomatedReasoningPolicyBuildWorkflowsResponse>;
export interface CreateMarketplaceModelEndpointRequest {
  modelSourceIdentifier: string;
  endpointConfig: (typeof EndpointConfig)["Type"];
  acceptEula?: boolean;
  endpointName: string;
  clientRequestToken?: string;
  tags?: TagList;
}
export const CreateMarketplaceModelEndpointRequest = S.suspend(() =>
  S.Struct({
    modelSourceIdentifier: S.String,
    endpointConfig: EndpointConfig,
    acceptEula: S.optional(S.Boolean),
    endpointName: S.String,
    clientRequestToken: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/marketplace-model/endpoints" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMarketplaceModelEndpointRequest",
}) as any as S.Schema<CreateMarketplaceModelEndpointRequest>;
export interface GetMarketplaceModelEndpointResponse {
  marketplaceModelEndpoint?: MarketplaceModelEndpoint;
}
export const GetMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({ marketplaceModelEndpoint: S.optional(MarketplaceModelEndpoint) }),
).annotations({
  identifier: "GetMarketplaceModelEndpointResponse",
}) as any as S.Schema<GetMarketplaceModelEndpointResponse>;
export interface ListMarketplaceModelEndpointsResponse {
  marketplaceModelEndpoints?: MarketplaceModelEndpointSummaries;
  nextToken?: string;
}
export const ListMarketplaceModelEndpointsResponse = S.suspend(() =>
  S.Struct({
    marketplaceModelEndpoints: S.optional(MarketplaceModelEndpointSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMarketplaceModelEndpointsResponse",
}) as any as S.Schema<ListMarketplaceModelEndpointsResponse>;
export interface GetCustomModelDeploymentResponse {
  customModelDeploymentArn: string;
  modelDeploymentName: string;
  modelArn: string;
  createdAt: Date;
  status: string;
  description?: string;
  updateDetails?: CustomModelDeploymentUpdateDetails;
  failureMessage?: string;
  lastUpdatedAt?: Date;
}
export const GetCustomModelDeploymentResponse = S.suspend(() =>
  S.Struct({
    customModelDeploymentArn: S.String,
    modelDeploymentName: S.String,
    modelArn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
    description: S.optional(S.String),
    updateDetails: S.optional(CustomModelDeploymentUpdateDetails),
    failureMessage: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "GetCustomModelDeploymentResponse",
}) as any as S.Schema<GetCustomModelDeploymentResponse>;
export interface ListCustomModelDeploymentsResponse {
  nextToken?: string;
  modelDeploymentSummaries?: CustomModelDeploymentSummaryList;
}
export const ListCustomModelDeploymentsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelDeploymentSummaries: S.optional(CustomModelDeploymentSummaryList),
  }),
).annotations({
  identifier: "ListCustomModelDeploymentsResponse",
}) as any as S.Schema<ListCustomModelDeploymentsResponse>;
export interface CreateCustomModelRequest {
  modelName: string;
  modelSourceConfig: (typeof ModelDataSource)["Type"];
  modelKmsKeyArn?: string;
  roleArn?: string;
  modelTags?: TagList;
  clientRequestToken?: string;
}
export const CreateCustomModelRequest = S.suspend(() =>
  S.Struct({
    modelName: S.String,
    modelSourceConfig: ModelDataSource,
    modelKmsKeyArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    modelTags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/custom-models/create-custom-model" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCustomModelRequest",
}) as any as S.Schema<CreateCustomModelRequest>;
export type RequestMetadataMap = { [key: string]: string };
export const RequestMetadataMap = S.Record({ key: S.String, value: S.String });
export interface RequestMetadataBaseFilters {
  equals?: RequestMetadataMap;
  notEquals?: RequestMetadataMap;
}
export const RequestMetadataBaseFilters = S.suspend(() =>
  S.Struct({
    equals: S.optional(RequestMetadataMap),
    notEquals: S.optional(RequestMetadataMap),
  }),
).annotations({
  identifier: "RequestMetadataBaseFilters",
}) as any as S.Schema<RequestMetadataBaseFilters>;
export type RequestMetadataFiltersList = RequestMetadataBaseFilters[];
export const RequestMetadataFiltersList = S.Array(RequestMetadataBaseFilters);
export type RequestMetadataFilters =
  | { equals: RequestMetadataMap }
  | { notEquals: RequestMetadataMap }
  | { andAll: RequestMetadataFiltersList }
  | { orAll: RequestMetadataFiltersList };
export const RequestMetadataFilters = S.Union(
  S.Struct({ equals: RequestMetadataMap }),
  S.Struct({ notEquals: RequestMetadataMap }),
  S.Struct({ andAll: RequestMetadataFiltersList }),
  S.Struct({ orAll: RequestMetadataFiltersList }),
);
export interface InvocationLogsConfig {
  usePromptResponse?: boolean;
  invocationLogSource: (typeof InvocationLogSource)["Type"];
  requestMetadataFilters?: (typeof RequestMetadataFilters)["Type"];
}
export const InvocationLogsConfig = S.suspend(() =>
  S.Struct({
    usePromptResponse: S.optional(S.Boolean),
    invocationLogSource: InvocationLogSource,
    requestMetadataFilters: S.optional(RequestMetadataFilters),
  }),
).annotations({
  identifier: "InvocationLogsConfig",
}) as any as S.Schema<InvocationLogsConfig>;
export interface TrainingDataConfig {
  s3Uri?: string;
  invocationLogsConfig?: InvocationLogsConfig;
}
export const TrainingDataConfig = S.suspend(() =>
  S.Struct({
    s3Uri: S.optional(S.String),
    invocationLogsConfig: S.optional(InvocationLogsConfig),
  }),
).annotations({
  identifier: "TrainingDataConfig",
}) as any as S.Schema<TrainingDataConfig>;
export interface DistillationConfig {
  teacherModelConfig: TeacherModelConfig;
}
export const DistillationConfig = S.suspend(() =>
  S.Struct({ teacherModelConfig: TeacherModelConfig }),
).annotations({
  identifier: "DistillationConfig",
}) as any as S.Schema<DistillationConfig>;
export interface LambdaGraderConfig {
  lambdaArn: string;
}
export const LambdaGraderConfig = S.suspend(() =>
  S.Struct({ lambdaArn: S.String }),
).annotations({
  identifier: "LambdaGraderConfig",
}) as any as S.Schema<LambdaGraderConfig>;
export type GraderConfig = { lambdaGrader: LambdaGraderConfig };
export const GraderConfig = S.Union(
  S.Struct({ lambdaGrader: LambdaGraderConfig }),
);
export interface RFTConfig {
  graderConfig?: (typeof GraderConfig)["Type"];
  hyperParameters?: RFTHyperParameters;
}
export const RFTConfig = S.suspend(() =>
  S.Struct({
    graderConfig: S.optional(GraderConfig),
    hyperParameters: S.optional(RFTHyperParameters),
  }),
).annotations({ identifier: "RFTConfig" }) as any as S.Schema<RFTConfig>;
export type CustomizationConfig =
  | { distillationConfig: DistillationConfig }
  | { rftConfig: RFTConfig };
export const CustomizationConfig = S.Union(
  S.Struct({ distillationConfig: DistillationConfig }),
  S.Struct({ rftConfig: RFTConfig }),
);
export interface GetCustomModelResponse {
  modelArn: string;
  modelName: string;
  jobName?: string;
  jobArn?: string;
  baseModelArn?: string;
  customizationType?: string;
  modelKmsKeyArn?: string;
  hyperParameters?: ModelCustomizationHyperParameters;
  trainingDataConfig?: TrainingDataConfig;
  validationDataConfig?: ValidationDataConfig;
  outputDataConfig?: OutputDataConfig;
  trainingMetrics?: TrainingMetrics;
  validationMetrics?: ValidationMetrics;
  creationTime: Date;
  customizationConfig?: (typeof CustomizationConfig)["Type"];
  modelStatus?: string;
  failureMessage?: string;
}
export const GetCustomModelResponse = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    modelName: S.String,
    jobName: S.optional(S.String),
    jobArn: S.optional(S.String),
    baseModelArn: S.optional(S.String),
    customizationType: S.optional(S.String),
    modelKmsKeyArn: S.optional(S.String),
    hyperParameters: S.optional(ModelCustomizationHyperParameters),
    trainingDataConfig: S.optional(TrainingDataConfig),
    validationDataConfig: S.optional(ValidationDataConfig),
    outputDataConfig: S.optional(OutputDataConfig),
    trainingMetrics: S.optional(TrainingMetrics),
    validationMetrics: S.optional(ValidationMetrics),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    customizationConfig: S.optional(CustomizationConfig),
    modelStatus: S.optional(S.String),
    failureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCustomModelResponse",
}) as any as S.Schema<GetCustomModelResponse>;
export interface ListCustomModelsResponse {
  nextToken?: string;
  modelSummaries?: CustomModelSummaryList;
}
export const ListCustomModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelSummaries: S.optional(CustomModelSummaryList),
  }),
).annotations({
  identifier: "ListCustomModelsResponse",
}) as any as S.Schema<ListCustomModelsResponse>;
export interface ListEnforcedGuardrailsConfigurationResponse {
  guardrailsConfig: AccountEnforcedGuardrailsOutputConfiguration;
  nextToken?: string;
}
export const ListEnforcedGuardrailsConfigurationResponse = S.suspend(() =>
  S.Struct({
    guardrailsConfig: AccountEnforcedGuardrailsOutputConfiguration,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnforcedGuardrailsConfigurationResponse",
}) as any as S.Schema<ListEnforcedGuardrailsConfigurationResponse>;
export interface PutEnforcedGuardrailConfigurationResponse {
  configId?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export const PutEnforcedGuardrailConfigurationResponse = S.suspend(() =>
  S.Struct({
    configId: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "PutEnforcedGuardrailConfigurationResponse",
}) as any as S.Schema<PutEnforcedGuardrailConfigurationResponse>;
export interface BatchDeleteEvaluationJobResponse {
  errors: BatchDeleteEvaluationJobErrors;
  evaluationJobs: BatchDeleteEvaluationJobItems;
}
export const BatchDeleteEvaluationJobResponse = S.suspend(() =>
  S.Struct({
    errors: BatchDeleteEvaluationJobErrors,
    evaluationJobs: BatchDeleteEvaluationJobItems,
  }),
).annotations({
  identifier: "BatchDeleteEvaluationJobResponse",
}) as any as S.Schema<BatchDeleteEvaluationJobResponse>;
export interface CreateGuardrailRequest {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  topicPolicyConfig?: GuardrailTopicPolicyConfig;
  contentPolicyConfig?: GuardrailContentPolicyConfig;
  wordPolicyConfig?: GuardrailWordPolicyConfig;
  sensitiveInformationPolicyConfig?: GuardrailSensitiveInformationPolicyConfig;
  contextualGroundingPolicyConfig?: GuardrailContextualGroundingPolicyConfig;
  automatedReasoningPolicyConfig?: GuardrailAutomatedReasoningPolicyConfig;
  crossRegionConfig?: GuardrailCrossRegionConfig;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  kmsKeyId?: string;
  tags?: TagList;
  clientRequestToken?: string;
}
export const CreateGuardrailRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    topicPolicyConfig: S.optional(GuardrailTopicPolicyConfig),
    contentPolicyConfig: S.optional(GuardrailContentPolicyConfig),
    wordPolicyConfig: S.optional(GuardrailWordPolicyConfig),
    sensitiveInformationPolicyConfig: S.optional(
      GuardrailSensitiveInformationPolicyConfig,
    ),
    contextualGroundingPolicyConfig: S.optional(
      GuardrailContextualGroundingPolicyConfig,
    ),
    automatedReasoningPolicyConfig: S.optional(
      GuardrailAutomatedReasoningPolicyConfig,
    ),
    crossRegionConfig: S.optional(GuardrailCrossRegionConfig),
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagList),
    clientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/guardrails" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGuardrailRequest",
}) as any as S.Schema<CreateGuardrailRequest>;
export interface ListGuardrailsResponse {
  guardrails: GuardrailSummaries;
  nextToken?: string;
}
export const ListGuardrailsResponse = S.suspend(() =>
  S.Struct({ guardrails: GuardrailSummaries, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListGuardrailsResponse",
}) as any as S.Schema<ListGuardrailsResponse>;
export interface CreateInferenceProfileResponse {
  inferenceProfileArn: string;
  status?: string;
}
export const CreateInferenceProfileResponse = S.suspend(() =>
  S.Struct({ inferenceProfileArn: S.String, status: S.optional(S.String) }),
).annotations({
  identifier: "CreateInferenceProfileResponse",
}) as any as S.Schema<CreateInferenceProfileResponse>;
export interface GetInferenceProfileResponse {
  inferenceProfileName: string;
  description?: string | Redacted.Redacted<string>;
  createdAt?: Date;
  updatedAt?: Date;
  inferenceProfileArn: string;
  models: InferenceProfileModels;
  inferenceProfileId: string;
  status: string;
  type: string;
}
export const GetInferenceProfileResponse = S.suspend(() =>
  S.Struct({
    inferenceProfileName: S.String,
    description: S.optional(SensitiveString),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    inferenceProfileArn: S.String,
    models: InferenceProfileModels,
    inferenceProfileId: S.String,
    status: S.String,
    type: S.String,
  }),
).annotations({
  identifier: "GetInferenceProfileResponse",
}) as any as S.Schema<GetInferenceProfileResponse>;
export interface ListInferenceProfilesResponse {
  inferenceProfileSummaries?: InferenceProfileSummaries;
  nextToken?: string;
}
export const ListInferenceProfilesResponse = S.suspend(() =>
  S.Struct({
    inferenceProfileSummaries: S.optional(InferenceProfileSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInferenceProfilesResponse",
}) as any as S.Schema<ListInferenceProfilesResponse>;
export interface GetModelInvocationLoggingConfigurationResponse {
  loggingConfig?: LoggingConfig;
}
export const GetModelInvocationLoggingConfigurationResponse = S.suspend(() =>
  S.Struct({ loggingConfig: S.optional(LoggingConfig) }),
).annotations({
  identifier: "GetModelInvocationLoggingConfigurationResponse",
}) as any as S.Schema<GetModelInvocationLoggingConfigurationResponse>;
export interface ListModelCopyJobsResponse {
  nextToken?: string;
  modelCopyJobSummaries?: ModelCopyJobSummaries;
}
export const ListModelCopyJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelCopyJobSummaries: S.optional(ModelCopyJobSummaries),
  }),
).annotations({
  identifier: "ListModelCopyJobsResponse",
}) as any as S.Schema<ListModelCopyJobsResponse>;
export interface CreateModelImportJobResponse {
  jobArn: string;
}
export const CreateModelImportJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateModelImportJobResponse",
}) as any as S.Schema<CreateModelImportJobResponse>;
export interface GetImportedModelResponse {
  modelArn?: string;
  modelName?: string;
  jobName?: string;
  jobArn?: string;
  modelDataSource?: (typeof ModelDataSource)["Type"];
  creationTime?: Date;
  modelArchitecture?: string;
  modelKmsKeyArn?: string;
  instructSupported?: boolean;
  customModelUnits?: CustomModelUnits;
}
export const GetImportedModelResponse = S.suspend(() =>
  S.Struct({
    modelArn: S.optional(S.String),
    modelName: S.optional(S.String),
    jobName: S.optional(S.String),
    jobArn: S.optional(S.String),
    modelDataSource: S.optional(ModelDataSource),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    modelArchitecture: S.optional(S.String),
    modelKmsKeyArn: S.optional(S.String),
    instructSupported: S.optional(S.Boolean),
    customModelUnits: S.optional(CustomModelUnits),
  }),
).annotations({
  identifier: "GetImportedModelResponse",
}) as any as S.Schema<GetImportedModelResponse>;
export interface ListImportedModelsResponse {
  nextToken?: string;
  modelSummaries?: ImportedModelSummaryList;
}
export const ListImportedModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelSummaries: S.optional(ImportedModelSummaryList),
  }),
).annotations({
  identifier: "ListImportedModelsResponse",
}) as any as S.Schema<ListImportedModelsResponse>;
export interface ListModelImportJobsResponse {
  nextToken?: string;
  modelImportJobSummaries?: ModelImportJobSummaries;
}
export const ListModelImportJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelImportJobSummaries: S.optional(ModelImportJobSummaries),
  }),
).annotations({
  identifier: "ListModelImportJobsResponse",
}) as any as S.Schema<ListModelImportJobsResponse>;
export interface CreateModelInvocationJobRequest {
  jobName: string;
  roleArn: string;
  clientRequestToken?: string;
  modelId: string;
  inputDataConfig: (typeof ModelInvocationJobInputDataConfig)["Type"];
  outputDataConfig: (typeof ModelInvocationJobOutputDataConfig)["Type"];
  vpcConfig?: VpcConfig;
  timeoutDurationInHours?: number;
  tags?: TagList;
}
export const CreateModelInvocationJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    modelId: S.String,
    inputDataConfig: ModelInvocationJobInputDataConfig,
    outputDataConfig: ModelInvocationJobOutputDataConfig,
    vpcConfig: S.optional(VpcConfig),
    timeoutDurationInHours: S.optional(S.Number),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/model-invocation-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelInvocationJobRequest",
}) as any as S.Schema<CreateModelInvocationJobRequest>;
export interface ListModelInvocationJobsResponse {
  nextToken?: string;
  invocationJobSummaries?: ModelInvocationJobSummaries;
}
export const ListModelInvocationJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    invocationJobSummaries: S.optional(ModelInvocationJobSummaries),
  }),
).annotations({
  identifier: "ListModelInvocationJobsResponse",
}) as any as S.Schema<ListModelInvocationJobsResponse>;
export interface ListFoundationModelsResponse {
  modelSummaries?: FoundationModelSummaryList;
}
export const ListFoundationModelsResponse = S.suspend(() =>
  S.Struct({ modelSummaries: S.optional(FoundationModelSummaryList) }),
).annotations({
  identifier: "ListFoundationModelsResponse",
}) as any as S.Schema<ListFoundationModelsResponse>;
export interface CreatePromptRouterResponse {
  promptRouterArn?: string;
}
export const CreatePromptRouterResponse = S.suspend(() =>
  S.Struct({ promptRouterArn: S.optional(S.String) }),
).annotations({
  identifier: "CreatePromptRouterResponse",
}) as any as S.Schema<CreatePromptRouterResponse>;
export interface ListPromptRoutersResponse {
  promptRouterSummaries?: PromptRouterSummaries;
  nextToken?: string;
}
export const ListPromptRoutersResponse = S.suspend(() =>
  S.Struct({
    promptRouterSummaries: S.optional(PromptRouterSummaries),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPromptRoutersResponse",
}) as any as S.Schema<ListPromptRoutersResponse>;
export interface ListProvisionedModelThroughputsResponse {
  nextToken?: string;
  provisionedModelSummaries?: ProvisionedModelSummaries;
}
export const ListProvisionedModelThroughputsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    provisionedModelSummaries: S.optional(ProvisionedModelSummaries),
  }),
).annotations({
  identifier: "ListProvisionedModelThroughputsResponse",
}) as any as S.Schema<ListProvisionedModelThroughputsResponse>;
export interface GetFoundationModelAvailabilityResponse {
  modelId: string;
  agreementAvailability: AgreementAvailability;
  authorizationStatus: string;
  entitlementAvailability: string;
  regionAvailability: string;
}
export const GetFoundationModelAvailabilityResponse = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    agreementAvailability: AgreementAvailability,
    authorizationStatus: S.String,
    entitlementAvailability: S.String,
    regionAvailability: S.String,
  }),
).annotations({
  identifier: "GetFoundationModelAvailabilityResponse",
}) as any as S.Schema<GetFoundationModelAvailabilityResponse>;
export interface ListModelCustomizationJobsResponse {
  nextToken?: string;
  modelCustomizationJobSummaries?: ModelCustomizationJobSummaries;
}
export const ListModelCustomizationJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    modelCustomizationJobSummaries: S.optional(ModelCustomizationJobSummaries),
  }),
).annotations({
  identifier: "ListModelCustomizationJobsResponse",
}) as any as S.Schema<ListModelCustomizationJobsResponse>;
export interface AutomatedReasoningPolicyScenarios {
  policyScenarios: AutomatedReasoningPolicyScenarioList;
}
export const AutomatedReasoningPolicyScenarios = S.suspend(() =>
  S.Struct({ policyScenarios: AutomatedReasoningPolicyScenarioList }),
).annotations({
  identifier: "AutomatedReasoningPolicyScenarios",
}) as any as S.Schema<AutomatedReasoningPolicyScenarios>;
export type AutomatedReasoningPolicyWorkflowTypeContent =
  | { documents: AutomatedReasoningPolicyBuildWorkflowDocumentList }
  | { policyRepairAssets: AutomatedReasoningPolicyBuildWorkflowRepairContent };
export const AutomatedReasoningPolicyWorkflowTypeContent = S.Union(
  S.Struct({ documents: AutomatedReasoningPolicyBuildWorkflowDocumentList }),
  S.Struct({
    policyRepairAssets: AutomatedReasoningPolicyBuildWorkflowRepairContent,
  }),
);
export interface GuardrailTopic {
  name: string | Redacted.Redacted<string>;
  definition: string | Redacted.Redacted<string>;
  examples?: GuardrailTopicExamples;
  type?: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailTopic = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    definition: SensitiveString,
    examples: S.optional(GuardrailTopicExamples),
    type: S.optional(S.String),
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailTopic",
}) as any as S.Schema<GuardrailTopic>;
export type GuardrailTopics = GuardrailTopic[];
export const GuardrailTopics = S.Array(GuardrailTopic);
export interface GuardrailTopicsTier {
  tierName: string;
}
export const GuardrailTopicsTier = S.suspend(() =>
  S.Struct({ tierName: S.String }),
).annotations({
  identifier: "GuardrailTopicsTier",
}) as any as S.Schema<GuardrailTopicsTier>;
export interface GuardrailContentFilter {
  type: string;
  inputStrength: string;
  outputStrength: string;
  inputModalities?: GuardrailModalities;
  outputModalities?: GuardrailModalities;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailContentFilter = S.suspend(() =>
  S.Struct({
    type: S.String,
    inputStrength: S.String,
    outputStrength: S.String,
    inputModalities: S.optional(GuardrailModalities),
    outputModalities: S.optional(GuardrailModalities),
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailContentFilter",
}) as any as S.Schema<GuardrailContentFilter>;
export type GuardrailContentFilters = GuardrailContentFilter[];
export const GuardrailContentFilters = S.Array(GuardrailContentFilter);
export interface GuardrailContentFiltersTier {
  tierName: string;
}
export const GuardrailContentFiltersTier = S.suspend(() =>
  S.Struct({ tierName: S.String }),
).annotations({
  identifier: "GuardrailContentFiltersTier",
}) as any as S.Schema<GuardrailContentFiltersTier>;
export interface GuardrailWord {
  text: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailWord = S.suspend(() =>
  S.Struct({
    text: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailWord",
}) as any as S.Schema<GuardrailWord>;
export type GuardrailWords = GuardrailWord[];
export const GuardrailWords = S.Array(GuardrailWord);
export interface GuardrailManagedWords {
  type: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailManagedWords = S.suspend(() =>
  S.Struct({
    type: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailManagedWords",
}) as any as S.Schema<GuardrailManagedWords>;
export type GuardrailManagedWordLists = GuardrailManagedWords[];
export const GuardrailManagedWordLists = S.Array(GuardrailManagedWords);
export interface GuardrailPiiEntity {
  type: string;
  action: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailPiiEntity = S.suspend(() =>
  S.Struct({
    type: S.String,
    action: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailPiiEntity",
}) as any as S.Schema<GuardrailPiiEntity>;
export type GuardrailPiiEntities = GuardrailPiiEntity[];
export const GuardrailPiiEntities = S.Array(GuardrailPiiEntity);
export interface GuardrailRegex {
  name: string;
  description?: string;
  pattern: string;
  action: string;
  inputAction?: string;
  outputAction?: string;
  inputEnabled?: boolean;
  outputEnabled?: boolean;
}
export const GuardrailRegex = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    pattern: S.String,
    action: S.String,
    inputAction: S.optional(S.String),
    outputAction: S.optional(S.String),
    inputEnabled: S.optional(S.Boolean),
    outputEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailRegex",
}) as any as S.Schema<GuardrailRegex>;
export type GuardrailRegexes = GuardrailRegex[];
export const GuardrailRegexes = S.Array(GuardrailRegex);
export interface GuardrailContextualGroundingFilter {
  type: string;
  threshold: number;
  action?: string;
  enabled?: boolean;
}
export const GuardrailContextualGroundingFilter = S.suspend(() =>
  S.Struct({
    type: S.String,
    threshold: S.Number,
    action: S.optional(S.String),
    enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GuardrailContextualGroundingFilter",
}) as any as S.Schema<GuardrailContextualGroundingFilter>;
export type GuardrailContextualGroundingFilters =
  GuardrailContextualGroundingFilter[];
export const GuardrailContextualGroundingFilters = S.Array(
  GuardrailContextualGroundingFilter,
);
export type AutomatedReasoningPolicyDisjointedRuleIdList = string[];
export const AutomatedReasoningPolicyDisjointedRuleIdList = S.Array(S.String);
export type EvaluationPrecomputedInferenceSourceIdentifiers = string[];
export const EvaluationPrecomputedInferenceSourceIdentifiers = S.Array(
  S.String,
);
export type EvaluationPrecomputedRagSourceIdentifiers = string[];
export const EvaluationPrecomputedRagSourceIdentifiers = S.Array(S.String);
export interface AutomatedReasoningPolicyBuildWorkflowSource {
  policyDefinition?: AutomatedReasoningPolicyDefinition;
  workflowContent?: (typeof AutomatedReasoningPolicyWorkflowTypeContent)["Type"];
}
export const AutomatedReasoningPolicyBuildWorkflowSource = S.suspend(() =>
  S.Struct({
    policyDefinition: S.optional(AutomatedReasoningPolicyDefinition),
    workflowContent: S.optional(AutomatedReasoningPolicyWorkflowTypeContent),
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildWorkflowSource",
}) as any as S.Schema<AutomatedReasoningPolicyBuildWorkflowSource>;
export interface GuardrailTopicPolicy {
  topics: GuardrailTopics;
  tier?: GuardrailTopicsTier;
}
export const GuardrailTopicPolicy = S.suspend(() =>
  S.Struct({ topics: GuardrailTopics, tier: S.optional(GuardrailTopicsTier) }),
).annotations({
  identifier: "GuardrailTopicPolicy",
}) as any as S.Schema<GuardrailTopicPolicy>;
export interface GuardrailContentPolicy {
  filters?: GuardrailContentFilters;
  tier?: GuardrailContentFiltersTier;
}
export const GuardrailContentPolicy = S.suspend(() =>
  S.Struct({
    filters: S.optional(GuardrailContentFilters),
    tier: S.optional(GuardrailContentFiltersTier),
  }),
).annotations({
  identifier: "GuardrailContentPolicy",
}) as any as S.Schema<GuardrailContentPolicy>;
export interface GuardrailWordPolicy {
  words?: GuardrailWords;
  managedWordLists?: GuardrailManagedWordLists;
}
export const GuardrailWordPolicy = S.suspend(() =>
  S.Struct({
    words: S.optional(GuardrailWords),
    managedWordLists: S.optional(GuardrailManagedWordLists),
  }),
).annotations({
  identifier: "GuardrailWordPolicy",
}) as any as S.Schema<GuardrailWordPolicy>;
export interface GuardrailSensitiveInformationPolicy {
  piiEntities?: GuardrailPiiEntities;
  regexes?: GuardrailRegexes;
}
export const GuardrailSensitiveInformationPolicy = S.suspend(() =>
  S.Struct({
    piiEntities: S.optional(GuardrailPiiEntities),
    regexes: S.optional(GuardrailRegexes),
  }),
).annotations({
  identifier: "GuardrailSensitiveInformationPolicy",
}) as any as S.Schema<GuardrailSensitiveInformationPolicy>;
export interface GuardrailContextualGroundingPolicy {
  filters: GuardrailContextualGroundingFilters;
}
export const GuardrailContextualGroundingPolicy = S.suspend(() =>
  S.Struct({ filters: GuardrailContextualGroundingFilters }),
).annotations({
  identifier: "GuardrailContextualGroundingPolicy",
}) as any as S.Schema<GuardrailContextualGroundingPolicy>;
export interface FoundationModelDetails {
  modelArn: string;
  modelId: string;
  modelName?: string;
  providerName?: string;
  inputModalities?: ModelModalityList;
  outputModalities?: ModelModalityList;
  responseStreamingSupported?: boolean;
  customizationsSupported?: ModelCustomizationList;
  inferenceTypesSupported?: InferenceTypeList;
  modelLifecycle?: FoundationModelLifecycle;
}
export const FoundationModelDetails = S.suspend(() =>
  S.Struct({
    modelArn: S.String,
    modelId: S.String,
    modelName: S.optional(S.String),
    providerName: S.optional(S.String),
    inputModalities: S.optional(ModelModalityList),
    outputModalities: S.optional(ModelModalityList),
    responseStreamingSupported: S.optional(S.Boolean),
    customizationsSupported: S.optional(ModelCustomizationList),
    inferenceTypesSupported: S.optional(InferenceTypeList),
    modelLifecycle: S.optional(FoundationModelLifecycle),
  }),
).annotations({
  identifier: "FoundationModelDetails",
}) as any as S.Schema<FoundationModelDetails>;
export interface AutomatedReasoningPolicyDefinitionTypeValuePair {
  typeName: string | Redacted.Redacted<string>;
  valueName: string;
}
export const AutomatedReasoningPolicyDefinitionTypeValuePair = S.suspend(() =>
  S.Struct({ typeName: SensitiveString, valueName: S.String }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionTypeValuePair",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionTypeValuePair>;
export type AutomatedReasoningPolicyDefinitionTypeValuePairList =
  AutomatedReasoningPolicyDefinitionTypeValuePair[];
export const AutomatedReasoningPolicyDefinitionTypeValuePairList = S.Array(
  AutomatedReasoningPolicyDefinitionTypeValuePair,
);
export interface AutomatedReasoningPolicyDisjointRuleSet {
  variables: AutomatedReasoningPolicyDefinitionVariableNameList;
  rules: AutomatedReasoningPolicyDisjointedRuleIdList;
}
export const AutomatedReasoningPolicyDisjointRuleSet = S.suspend(() =>
  S.Struct({
    variables: AutomatedReasoningPolicyDefinitionVariableNameList,
    rules: AutomatedReasoningPolicyDisjointedRuleIdList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDisjointRuleSet",
}) as any as S.Schema<AutomatedReasoningPolicyDisjointRuleSet>;
export type AutomatedReasoningPolicyDisjointRuleSetList =
  AutomatedReasoningPolicyDisjointRuleSet[];
export const AutomatedReasoningPolicyDisjointRuleSetList = S.Array(
  AutomatedReasoningPolicyDisjointRuleSet,
);
export interface AutomatedReasoningPolicyGeneratedTestCase {
  queryContent: string | Redacted.Redacted<string>;
  guardContent: string | Redacted.Redacted<string>;
  expectedAggregatedFindingsResult: string;
}
export const AutomatedReasoningPolicyGeneratedTestCase = S.suspend(() =>
  S.Struct({
    queryContent: SensitiveString,
    guardContent: SensitiveString,
    expectedAggregatedFindingsResult: S.String,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyGeneratedTestCase",
}) as any as S.Schema<AutomatedReasoningPolicyGeneratedTestCase>;
export type AutomatedReasoningPolicyGeneratedTestCaseList =
  AutomatedReasoningPolicyGeneratedTestCase[];
export const AutomatedReasoningPolicyGeneratedTestCaseList = S.Array(
  AutomatedReasoningPolicyGeneratedTestCase,
);
export interface EvaluationModelConfigSummary {
  bedrockModelIdentifiers?: EvaluationBedrockModelIdentifiers;
  precomputedInferenceSourceIdentifiers?: EvaluationPrecomputedInferenceSourceIdentifiers;
}
export const EvaluationModelConfigSummary = S.suspend(() =>
  S.Struct({
    bedrockModelIdentifiers: S.optional(EvaluationBedrockModelIdentifiers),
    precomputedInferenceSourceIdentifiers: S.optional(
      EvaluationPrecomputedInferenceSourceIdentifiers,
    ),
  }),
).annotations({
  identifier: "EvaluationModelConfigSummary",
}) as any as S.Schema<EvaluationModelConfigSummary>;
export interface EvaluationRagConfigSummary {
  bedrockKnowledgeBaseIdentifiers?: EvaluationBedrockKnowledgeBaseIdentifiers;
  precomputedRagSourceIdentifiers?: EvaluationPrecomputedRagSourceIdentifiers;
}
export const EvaluationRagConfigSummary = S.suspend(() =>
  S.Struct({
    bedrockKnowledgeBaseIdentifiers: S.optional(
      EvaluationBedrockKnowledgeBaseIdentifiers,
    ),
    precomputedRagSourceIdentifiers: S.optional(
      EvaluationPrecomputedRagSourceIdentifiers,
    ),
  }),
).annotations({
  identifier: "EvaluationRagConfigSummary",
}) as any as S.Schema<EvaluationRagConfigSummary>;
export interface LegalTerm {
  url?: string;
}
export const LegalTerm = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({ identifier: "LegalTerm" }) as any as S.Schema<LegalTerm>;
export interface SupportTerm {
  refundPolicyDescription?: string;
}
export const SupportTerm = S.suspend(() =>
  S.Struct({ refundPolicyDescription: S.optional(S.String) }),
).annotations({ identifier: "SupportTerm" }) as any as S.Schema<SupportTerm>;
export interface ValidityTerm {
  agreementDuration?: string;
}
export const ValidityTerm = S.suspend(() =>
  S.Struct({ agreementDuration: S.optional(S.String) }),
).annotations({ identifier: "ValidityTerm" }) as any as S.Schema<ValidityTerm>;
export interface CreateAutomatedReasoningPolicyRequest {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  clientRequestToken?: string;
  policyDefinition?: AutomatedReasoningPolicyDefinition;
  kmsKeyId?: string;
  tags?: TagList;
}
export const CreateAutomatedReasoningPolicyRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    clientRequestToken: S.optional(S.String),
    policyDefinition: S.optional(AutomatedReasoningPolicyDefinition),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/automated-reasoning-policies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyRequest",
}) as any as S.Schema<CreateAutomatedReasoningPolicyRequest>;
export interface StartAutomatedReasoningPolicyBuildWorkflowRequest {
  policyArn: string;
  buildWorkflowType: string;
  clientRequestToken?: string;
  sourceContent: AutomatedReasoningPolicyBuildWorkflowSource;
}
export const StartAutomatedReasoningPolicyBuildWorkflowRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowType: S.String.pipe(T.HttpLabel("buildWorkflowType")),
    clientRequestToken: S.optional(S.String).pipe(
      T.HttpHeader("x-amz-client-token"),
    ),
    sourceContent: AutomatedReasoningPolicyBuildWorkflowSource.pipe(
      T.HttpPayload(),
    ).annotations({
      identifier: "AutomatedReasoningPolicyBuildWorkflowSource",
    }),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowType}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAutomatedReasoningPolicyBuildWorkflowRequest",
}) as any as S.Schema<StartAutomatedReasoningPolicyBuildWorkflowRequest>;
export interface CreateMarketplaceModelEndpointResponse {
  marketplaceModelEndpoint: MarketplaceModelEndpoint;
}
export const CreateMarketplaceModelEndpointResponse = S.suspend(() =>
  S.Struct({ marketplaceModelEndpoint: MarketplaceModelEndpoint }),
).annotations({
  identifier: "CreateMarketplaceModelEndpointResponse",
}) as any as S.Schema<CreateMarketplaceModelEndpointResponse>;
export interface CreateCustomModelResponse {
  modelArn: string;
}
export const CreateCustomModelResponse = S.suspend(() =>
  S.Struct({ modelArn: S.String }),
).annotations({
  identifier: "CreateCustomModelResponse",
}) as any as S.Schema<CreateCustomModelResponse>;
export interface CreateGuardrailResponse {
  guardrailId: string;
  guardrailArn: string;
  version: string;
  createdAt: Date;
}
export const CreateGuardrailResponse = S.suspend(() =>
  S.Struct({
    guardrailId: S.String,
    guardrailArn: S.String,
    version: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateGuardrailResponse",
}) as any as S.Schema<CreateGuardrailResponse>;
export interface GetGuardrailResponse {
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  guardrailId: string;
  guardrailArn: string;
  version: string;
  status: string;
  topicPolicy?: GuardrailTopicPolicy;
  contentPolicy?: GuardrailContentPolicy;
  wordPolicy?: GuardrailWordPolicy;
  sensitiveInformationPolicy?: GuardrailSensitiveInformationPolicy;
  contextualGroundingPolicy?: GuardrailContextualGroundingPolicy;
  automatedReasoningPolicy?: GuardrailAutomatedReasoningPolicy;
  crossRegionDetails?: GuardrailCrossRegionDetails;
  createdAt: Date;
  updatedAt: Date;
  statusReasons?: GuardrailStatusReasons;
  failureRecommendations?: GuardrailFailureRecommendations;
  blockedInputMessaging: string | Redacted.Redacted<string>;
  blockedOutputsMessaging: string | Redacted.Redacted<string>;
  kmsKeyArn?: string;
}
export const GetGuardrailResponse = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    guardrailId: S.String,
    guardrailArn: S.String,
    version: S.String,
    status: S.String,
    topicPolicy: S.optional(GuardrailTopicPolicy),
    contentPolicy: S.optional(GuardrailContentPolicy),
    wordPolicy: S.optional(GuardrailWordPolicy),
    sensitiveInformationPolicy: S.optional(GuardrailSensitiveInformationPolicy),
    contextualGroundingPolicy: S.optional(GuardrailContextualGroundingPolicy),
    automatedReasoningPolicy: S.optional(GuardrailAutomatedReasoningPolicy),
    crossRegionDetails: S.optional(GuardrailCrossRegionDetails),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    statusReasons: S.optional(GuardrailStatusReasons),
    failureRecommendations: S.optional(GuardrailFailureRecommendations),
    blockedInputMessaging: SensitiveString,
    blockedOutputsMessaging: SensitiveString,
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetGuardrailResponse",
}) as any as S.Schema<GetGuardrailResponse>;
export interface CreateModelInvocationJobResponse {
  jobArn: string;
}
export const CreateModelInvocationJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateModelInvocationJobResponse",
}) as any as S.Schema<CreateModelInvocationJobResponse>;
export interface GetFoundationModelResponse {
  modelDetails?: FoundationModelDetails;
}
export const GetFoundationModelResponse = S.suspend(() =>
  S.Struct({ modelDetails: S.optional(FoundationModelDetails) }),
).annotations({
  identifier: "GetFoundationModelResponse",
}) as any as S.Schema<GetFoundationModelResponse>;
export interface GetModelCustomizationJobResponse {
  jobArn: string;
  jobName: string;
  outputModelName: string;
  outputModelArn?: string;
  clientRequestToken?: string;
  roleArn: string;
  status?: string;
  statusDetails?: StatusDetails;
  failureMessage?: string;
  creationTime: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  baseModelArn: string;
  hyperParameters?: ModelCustomizationHyperParameters;
  trainingDataConfig: TrainingDataConfig;
  validationDataConfig: ValidationDataConfig;
  outputDataConfig: OutputDataConfig;
  customizationType?: string;
  outputModelKmsKeyArn?: string;
  trainingMetrics?: TrainingMetrics;
  validationMetrics?: ValidationMetrics;
  vpcConfig?: VpcConfig;
  customizationConfig?: (typeof CustomizationConfig)["Type"];
}
export const GetModelCustomizationJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobName: S.String,
    outputModelName: S.String,
    outputModelArn: S.optional(S.String),
    clientRequestToken: S.optional(S.String),
    roleArn: S.String,
    status: S.optional(S.String),
    statusDetails: S.optional(StatusDetails),
    failureMessage: S.optional(S.String),
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    baseModelArn: S.String,
    hyperParameters: S.optional(ModelCustomizationHyperParameters),
    trainingDataConfig: TrainingDataConfig,
    validationDataConfig: ValidationDataConfig,
    outputDataConfig: OutputDataConfig,
    customizationType: S.optional(S.String),
    outputModelKmsKeyArn: S.optional(S.String),
    trainingMetrics: S.optional(TrainingMetrics),
    validationMetrics: S.optional(ValidationMetrics),
    vpcConfig: S.optional(VpcConfig),
    customizationConfig: S.optional(CustomizationConfig),
  }),
).annotations({
  identifier: "GetModelCustomizationJobResponse",
}) as any as S.Schema<GetModelCustomizationJobResponse>;
export interface AutomatedReasoningPolicyDefinitionQualityReport {
  typeCount: number;
  variableCount: number;
  ruleCount: number;
  unusedTypes: AutomatedReasoningPolicyDefinitionTypeNameList;
  unusedTypeValues: AutomatedReasoningPolicyDefinitionTypeValuePairList;
  unusedVariables: AutomatedReasoningPolicyDefinitionVariableNameList;
  conflictingRules: AutomatedReasoningPolicyConflictedRuleIdList;
  disjointRuleSets: AutomatedReasoningPolicyDisjointRuleSetList;
}
export const AutomatedReasoningPolicyDefinitionQualityReport = S.suspend(() =>
  S.Struct({
    typeCount: S.Number,
    variableCount: S.Number,
    ruleCount: S.Number,
    unusedTypes: AutomatedReasoningPolicyDefinitionTypeNameList,
    unusedTypeValues: AutomatedReasoningPolicyDefinitionTypeValuePairList,
    unusedVariables: AutomatedReasoningPolicyDefinitionVariableNameList,
    conflictingRules: AutomatedReasoningPolicyConflictedRuleIdList,
    disjointRuleSets: AutomatedReasoningPolicyDisjointRuleSetList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyDefinitionQualityReport",
}) as any as S.Schema<AutomatedReasoningPolicyDefinitionQualityReport>;
export interface AutomatedReasoningPolicyGeneratedTestCases {
  generatedTestCases: AutomatedReasoningPolicyGeneratedTestCaseList;
}
export const AutomatedReasoningPolicyGeneratedTestCases = S.suspend(() =>
  S.Struct({
    generatedTestCases: AutomatedReasoningPolicyGeneratedTestCaseList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyGeneratedTestCases",
}) as any as S.Schema<AutomatedReasoningPolicyGeneratedTestCases>;
export interface EvaluationInferenceConfigSummary {
  modelConfigSummary?: EvaluationModelConfigSummary;
  ragConfigSummary?: EvaluationRagConfigSummary;
}
export const EvaluationInferenceConfigSummary = S.suspend(() =>
  S.Struct({
    modelConfigSummary: S.optional(EvaluationModelConfigSummary),
    ragConfigSummary: S.optional(EvaluationRagConfigSummary),
  }),
).annotations({
  identifier: "EvaluationInferenceConfigSummary",
}) as any as S.Schema<EvaluationInferenceConfigSummary>;
export interface DimensionalPriceRate {
  dimension?: string;
  price?: string;
  description?: string;
  unit?: string;
}
export const DimensionalPriceRate = S.suspend(() =>
  S.Struct({
    dimension: S.optional(S.String),
    price: S.optional(S.String),
    description: S.optional(S.String),
    unit: S.optional(S.String),
  }),
).annotations({
  identifier: "DimensionalPriceRate",
}) as any as S.Schema<DimensionalPriceRate>;
export type RateCard = DimensionalPriceRate[];
export const RateCard = S.Array(DimensionalPriceRate);
export interface AutomatedReasoningPolicyPlanning {}
export const AutomatedReasoningPolicyPlanning = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "AutomatedReasoningPolicyPlanning",
}) as any as S.Schema<AutomatedReasoningPolicyPlanning>;
export interface EvaluationSummary {
  jobArn: string;
  jobName: string;
  status: string;
  creationTime: Date;
  jobType: string;
  evaluationTaskTypes: EvaluationTaskTypes;
  modelIdentifiers?: EvaluationBedrockModelIdentifiers;
  ragIdentifiers?: EvaluationBedrockKnowledgeBaseIdentifiers;
  evaluatorModelIdentifiers?: EvaluatorModelIdentifiers;
  customMetricsEvaluatorModelIdentifiers?: EvaluatorModelIdentifiers;
  inferenceConfigSummary?: EvaluationInferenceConfigSummary;
  applicationType?: string;
}
export const EvaluationSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobName: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("date-time")),
    jobType: S.String,
    evaluationTaskTypes: EvaluationTaskTypes,
    modelIdentifiers: S.optional(EvaluationBedrockModelIdentifiers),
    ragIdentifiers: S.optional(EvaluationBedrockKnowledgeBaseIdentifiers),
    evaluatorModelIdentifiers: S.optional(EvaluatorModelIdentifiers),
    customMetricsEvaluatorModelIdentifiers: S.optional(
      EvaluatorModelIdentifiers,
    ),
    inferenceConfigSummary: S.optional(EvaluationInferenceConfigSummary),
    applicationType: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationSummary",
}) as any as S.Schema<EvaluationSummary>;
export type EvaluationSummaries = EvaluationSummary[];
export const EvaluationSummaries = S.Array(EvaluationSummary);
export type RetrievalFilterList = RetrievalFilter[];
export const RetrievalFilterList = S.Array(
  S.suspend(() => RetrievalFilter).annotations({
    identifier: "RetrievalFilter",
  }),
) as any as S.Schema<RetrievalFilterList>;
export interface PricingTerm {
  rateCard: RateCard;
}
export const PricingTerm = S.suspend(() =>
  S.Struct({ rateCard: RateCard }),
).annotations({ identifier: "PricingTerm" }) as any as S.Schema<PricingTerm>;
export interface CreateAutomatedReasoningPolicyResponse {
  policyArn: string;
  version: string;
  name: string | Redacted.Redacted<string>;
  description?: string | Redacted.Redacted<string>;
  definitionHash?: string;
  createdAt: Date;
  updatedAt: Date;
}
export const CreateAutomatedReasoningPolicyResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    version: S.String,
    name: SensitiveString,
    description: S.optional(SensitiveString),
    definitionHash: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "CreateAutomatedReasoningPolicyResponse",
}) as any as S.Schema<CreateAutomatedReasoningPolicyResponse>;
export type AutomatedReasoningPolicyDefinitionElement =
  | { policyDefinitionVariable: AutomatedReasoningPolicyDefinitionVariable }
  | { policyDefinitionType: AutomatedReasoningPolicyDefinitionType }
  | { policyDefinitionRule: AutomatedReasoningPolicyDefinitionRule };
export const AutomatedReasoningPolicyDefinitionElement = S.Union(
  S.Struct({
    policyDefinitionVariable: AutomatedReasoningPolicyDefinitionVariable,
  }),
  S.Struct({ policyDefinitionType: AutomatedReasoningPolicyDefinitionType }),
  S.Struct({ policyDefinitionRule: AutomatedReasoningPolicyDefinitionRule }),
);
export interface AutomatedReasoningPolicyBuildStepMessage {
  message: string;
  messageType: string;
}
export const AutomatedReasoningPolicyBuildStepMessage = S.suspend(() =>
  S.Struct({ message: S.String, messageType: S.String }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildStepMessage",
}) as any as S.Schema<AutomatedReasoningPolicyBuildStepMessage>;
export type AutomatedReasoningPolicyBuildStepMessageList =
  AutomatedReasoningPolicyBuildStepMessage[];
export const AutomatedReasoningPolicyBuildStepMessageList = S.Array(
  AutomatedReasoningPolicyBuildStepMessage,
);
export interface StartAutomatedReasoningPolicyBuildWorkflowResponse {
  policyArn: string;
  buildWorkflowId: string;
}
export const StartAutomatedReasoningPolicyBuildWorkflowResponse = S.suspend(
  () => S.Struct({ policyArn: S.String, buildWorkflowId: S.String }),
).annotations({
  identifier: "StartAutomatedReasoningPolicyBuildWorkflowResponse",
}) as any as S.Schema<StartAutomatedReasoningPolicyBuildWorkflowResponse>;
export interface UpdateAutomatedReasoningPolicyAnnotationsRequest {
  policyArn: string;
  buildWorkflowId: string;
  annotations: AutomatedReasoningPolicyAnnotationList;
  lastUpdatedAnnotationSetHash: string;
}
export const UpdateAutomatedReasoningPolicyAnnotationsRequest = S.suspend(() =>
  S.Struct({
    policyArn: S.String.pipe(T.HttpLabel("policyArn")),
    buildWorkflowId: S.String.pipe(T.HttpLabel("buildWorkflowId")),
    annotations: AutomatedReasoningPolicyAnnotationList,
    lastUpdatedAnnotationSetHash: S.String,
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/automated-reasoning-policies/{policyArn}/build-workflows/{buildWorkflowId}/annotations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyAnnotationsRequest",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyAnnotationsRequest>;
export interface ListEvaluationJobsResponse {
  nextToken?: string;
  jobSummaries?: EvaluationSummaries;
}
export const ListEvaluationJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    jobSummaries: S.optional(EvaluationSummaries),
  }),
).annotations({
  identifier: "ListEvaluationJobsResponse",
}) as any as S.Schema<ListEvaluationJobsResponse>;
export interface CreateModelCustomizationJobRequest {
  jobName: string;
  customModelName: string;
  roleArn: string;
  clientRequestToken?: string;
  baseModelIdentifier: string;
  customizationType?: string;
  customModelKmsKeyId?: string;
  jobTags?: TagList;
  customModelTags?: TagList;
  trainingDataConfig: TrainingDataConfig;
  validationDataConfig?: ValidationDataConfig;
  outputDataConfig: OutputDataConfig;
  hyperParameters?: ModelCustomizationHyperParameters;
  vpcConfig?: VpcConfig;
  customizationConfig?: (typeof CustomizationConfig)["Type"];
}
export const CreateModelCustomizationJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    customModelName: S.String,
    roleArn: S.String,
    clientRequestToken: S.optional(S.String),
    baseModelIdentifier: S.String,
    customizationType: S.optional(S.String),
    customModelKmsKeyId: S.optional(S.String),
    jobTags: S.optional(TagList),
    customModelTags: S.optional(TagList),
    trainingDataConfig: TrainingDataConfig,
    validationDataConfig: S.optional(ValidationDataConfig),
    outputDataConfig: OutputDataConfig,
    hyperParameters: S.optional(ModelCustomizationHyperParameters),
    vpcConfig: S.optional(VpcConfig),
    customizationConfig: S.optional(CustomizationConfig),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/model-customization-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateModelCustomizationJobRequest",
}) as any as S.Schema<CreateModelCustomizationJobRequest>;
export interface TermDetails {
  usageBasedPricingTerm: PricingTerm;
  legalTerm: LegalTerm;
  supportTerm: SupportTerm;
  validityTerm?: ValidityTerm;
}
export const TermDetails = S.suspend(() =>
  S.Struct({
    usageBasedPricingTerm: PricingTerm,
    legalTerm: LegalTerm,
    supportTerm: SupportTerm,
    validityTerm: S.optional(ValidityTerm),
  }),
).annotations({ identifier: "TermDetails" }) as any as S.Schema<TermDetails>;
export interface Offer {
  offerId?: string;
  offerToken: string;
  termDetails: TermDetails;
}
export const Offer = S.suspend(() =>
  S.Struct({
    offerId: S.optional(S.String),
    offerToken: S.String,
    termDetails: TermDetails,
  }),
).annotations({ identifier: "Offer" }) as any as S.Schema<Offer>;
export type Offers = Offer[];
export const Offers = S.Array(Offer);
export interface UpdateAutomatedReasoningPolicyAnnotationsResponse {
  policyArn: string;
  buildWorkflowId: string;
  annotationSetHash: string;
  updatedAt: Date;
}
export const UpdateAutomatedReasoningPolicyAnnotationsResponse = S.suspend(() =>
  S.Struct({
    policyArn: S.String,
    buildWorkflowId: S.String,
    annotationSetHash: S.String,
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "UpdateAutomatedReasoningPolicyAnnotationsResponse",
}) as any as S.Schema<UpdateAutomatedReasoningPolicyAnnotationsResponse>;
export interface ListFoundationModelAgreementOffersResponse {
  modelId: string;
  offers: Offers;
}
export const ListFoundationModelAgreementOffersResponse = S.suspend(() =>
  S.Struct({ modelId: S.String, offers: Offers }),
).annotations({
  identifier: "ListFoundationModelAgreementOffersResponse",
}) as any as S.Schema<ListFoundationModelAgreementOffersResponse>;
export interface CreateModelCustomizationJobResponse {
  jobArn: string;
}
export const CreateModelCustomizationJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateModelCustomizationJobResponse",
}) as any as S.Schema<CreateModelCustomizationJobResponse>;
export interface AutomatedReasoningPolicyAddTypeMutation {
  type: AutomatedReasoningPolicyDefinitionType;
}
export const AutomatedReasoningPolicyAddTypeMutation = S.suspend(() =>
  S.Struct({ type: AutomatedReasoningPolicyDefinitionType }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddTypeMutation",
}) as any as S.Schema<AutomatedReasoningPolicyAddTypeMutation>;
export interface AutomatedReasoningPolicyUpdateTypeMutation {
  type: AutomatedReasoningPolicyDefinitionType;
}
export const AutomatedReasoningPolicyUpdateTypeMutation = S.suspend(() =>
  S.Struct({ type: AutomatedReasoningPolicyDefinitionType }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateTypeMutation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateTypeMutation>;
export interface AutomatedReasoningPolicyDeleteTypeMutation {
  name: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDeleteTypeMutation = S.suspend(() =>
  S.Struct({ name: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteTypeMutation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteTypeMutation>;
export interface AutomatedReasoningPolicyAddVariableMutation {
  variable: AutomatedReasoningPolicyDefinitionVariable;
}
export const AutomatedReasoningPolicyAddVariableMutation = S.suspend(() =>
  S.Struct({ variable: AutomatedReasoningPolicyDefinitionVariable }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddVariableMutation",
}) as any as S.Schema<AutomatedReasoningPolicyAddVariableMutation>;
export interface AutomatedReasoningPolicyUpdateVariableMutation {
  variable: AutomatedReasoningPolicyDefinitionVariable;
}
export const AutomatedReasoningPolicyUpdateVariableMutation = S.suspend(() =>
  S.Struct({ variable: AutomatedReasoningPolicyDefinitionVariable }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateVariableMutation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateVariableMutation>;
export interface AutomatedReasoningPolicyDeleteVariableMutation {
  name: string | Redacted.Redacted<string>;
}
export const AutomatedReasoningPolicyDeleteVariableMutation = S.suspend(() =>
  S.Struct({ name: SensitiveString }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteVariableMutation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteVariableMutation>;
export interface AutomatedReasoningPolicyAddRuleMutation {
  rule: AutomatedReasoningPolicyDefinitionRule;
}
export const AutomatedReasoningPolicyAddRuleMutation = S.suspend(() =>
  S.Struct({ rule: AutomatedReasoningPolicyDefinitionRule }),
).annotations({
  identifier: "AutomatedReasoningPolicyAddRuleMutation",
}) as any as S.Schema<AutomatedReasoningPolicyAddRuleMutation>;
export interface AutomatedReasoningPolicyUpdateRuleMutation {
  rule: AutomatedReasoningPolicyDefinitionRule;
}
export const AutomatedReasoningPolicyUpdateRuleMutation = S.suspend(() =>
  S.Struct({ rule: AutomatedReasoningPolicyDefinitionRule }),
).annotations({
  identifier: "AutomatedReasoningPolicyUpdateRuleMutation",
}) as any as S.Schema<AutomatedReasoningPolicyUpdateRuleMutation>;
export interface AutomatedReasoningPolicyDeleteRuleMutation {
  id: string;
}
export const AutomatedReasoningPolicyDeleteRuleMutation = S.suspend(() =>
  S.Struct({ id: S.String }),
).annotations({
  identifier: "AutomatedReasoningPolicyDeleteRuleMutation",
}) as any as S.Schema<AutomatedReasoningPolicyDeleteRuleMutation>;
export type AutomatedReasoningPolicyMutation =
  | { addType: AutomatedReasoningPolicyAddTypeMutation }
  | { updateType: AutomatedReasoningPolicyUpdateTypeMutation }
  | { deleteType: AutomatedReasoningPolicyDeleteTypeMutation }
  | { addVariable: AutomatedReasoningPolicyAddVariableMutation }
  | { updateVariable: AutomatedReasoningPolicyUpdateVariableMutation }
  | { deleteVariable: AutomatedReasoningPolicyDeleteVariableMutation }
  | { addRule: AutomatedReasoningPolicyAddRuleMutation }
  | { updateRule: AutomatedReasoningPolicyUpdateRuleMutation }
  | { deleteRule: AutomatedReasoningPolicyDeleteRuleMutation };
export const AutomatedReasoningPolicyMutation = S.Union(
  S.Struct({ addType: AutomatedReasoningPolicyAddTypeMutation }),
  S.Struct({ updateType: AutomatedReasoningPolicyUpdateTypeMutation }),
  S.Struct({ deleteType: AutomatedReasoningPolicyDeleteTypeMutation }),
  S.Struct({ addVariable: AutomatedReasoningPolicyAddVariableMutation }),
  S.Struct({ updateVariable: AutomatedReasoningPolicyUpdateVariableMutation }),
  S.Struct({ deleteVariable: AutomatedReasoningPolicyDeleteVariableMutation }),
  S.Struct({ addRule: AutomatedReasoningPolicyAddRuleMutation }),
  S.Struct({ updateRule: AutomatedReasoningPolicyUpdateRuleMutation }),
  S.Struct({ deleteRule: AutomatedReasoningPolicyDeleteRuleMutation }),
);
export type AutomatedReasoningPolicyBuildStepContext =
  | { planning: AutomatedReasoningPolicyPlanning }
  | { mutation: (typeof AutomatedReasoningPolicyMutation)["Type"] };
export const AutomatedReasoningPolicyBuildStepContext = S.Union(
  S.Struct({ planning: AutomatedReasoningPolicyPlanning }),
  S.Struct({ mutation: AutomatedReasoningPolicyMutation }),
);
export interface GetAutomatedReasoningPolicyTestResultResponse {
  testResult: AutomatedReasoningPolicyTestResult;
}
export const GetAutomatedReasoningPolicyTestResultResponse = S.suspend(() =>
  S.Struct({ testResult: AutomatedReasoningPolicyTestResult }),
).annotations({
  identifier: "GetAutomatedReasoningPolicyTestResultResponse",
}) as any as S.Schema<GetAutomatedReasoningPolicyTestResultResponse>;
export interface AutomatedReasoningPolicyBuildStep {
  context: (typeof AutomatedReasoningPolicyBuildStepContext)["Type"];
  priorElement?: (typeof AutomatedReasoningPolicyDefinitionElement)["Type"];
  messages: AutomatedReasoningPolicyBuildStepMessageList;
}
export const AutomatedReasoningPolicyBuildStep = S.suspend(() =>
  S.Struct({
    context: AutomatedReasoningPolicyBuildStepContext,
    priorElement: S.optional(AutomatedReasoningPolicyDefinitionElement),
    messages: AutomatedReasoningPolicyBuildStepMessageList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildStep",
}) as any as S.Schema<AutomatedReasoningPolicyBuildStep>;
export type AutomatedReasoningPolicyBuildStepList =
  AutomatedReasoningPolicyBuildStep[];
export const AutomatedReasoningPolicyBuildStepList = S.Array(
  AutomatedReasoningPolicyBuildStep,
);
export interface AutomatedReasoningPolicyBuildLogEntry {
  annotation: (typeof AutomatedReasoningPolicyAnnotation)["Type"];
  status: string;
  buildSteps: AutomatedReasoningPolicyBuildStepList;
}
export const AutomatedReasoningPolicyBuildLogEntry = S.suspend(() =>
  S.Struct({
    annotation: AutomatedReasoningPolicyAnnotation,
    status: S.String,
    buildSteps: AutomatedReasoningPolicyBuildStepList,
  }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildLogEntry",
}) as any as S.Schema<AutomatedReasoningPolicyBuildLogEntry>;
export type AutomatedReasoningPolicyBuildLogEntryList =
  AutomatedReasoningPolicyBuildLogEntry[];
export const AutomatedReasoningPolicyBuildLogEntryList = S.Array(
  AutomatedReasoningPolicyBuildLogEntry,
);
export interface AutomatedReasoningPolicyBuildLog {
  entries: AutomatedReasoningPolicyBuildLogEntryList;
}
export const AutomatedReasoningPolicyBuildLog = S.suspend(() =>
  S.Struct({ entries: AutomatedReasoningPolicyBuildLogEntryList }),
).annotations({
  identifier: "AutomatedReasoningPolicyBuildLog",
}) as any as S.Schema<AutomatedReasoningPolicyBuildLog>;
export type AutomatedReasoningPolicyBuildResultAssets =
  | { policyDefinition: AutomatedReasoningPolicyDefinition }
  | { qualityReport: AutomatedReasoningPolicyDefinitionQualityReport }
  | { buildLog: AutomatedReasoningPolicyBuildLog }
  | { generatedTestCases: AutomatedReasoningPolicyGeneratedTestCases }
  | { policyScenarios: AutomatedReasoningPolicyScenarios };
export const AutomatedReasoningPolicyBuildResultAssets = S.Union(
  S.Struct({ policyDefinition: AutomatedReasoningPolicyDefinition }),
  S.Struct({ qualityReport: AutomatedReasoningPolicyDefinitionQualityReport }),
  S.Struct({ buildLog: AutomatedReasoningPolicyBuildLog }),
  S.Struct({ generatedTestCases: AutomatedReasoningPolicyGeneratedTestCases }),
  S.Struct({ policyScenarios: AutomatedReasoningPolicyScenarios }),
);
export interface GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse {
  policyArn: string;
  buildWorkflowId: string;
  buildWorkflowAssets?: (typeof AutomatedReasoningPolicyBuildResultAssets)["Type"];
}
export const GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse =
  S.suspend(() =>
    S.Struct({
      policyArn: S.String,
      buildWorkflowId: S.String,
      buildWorkflowAssets: S.optional(
        AutomatedReasoningPolicyBuildResultAssets,
      ),
    }),
  ).annotations({
    identifier: "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse",
  }) as any as S.Schema<GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse>;
export interface CreateEvaluationJobRequest {
  jobName: string;
  jobDescription?: string | Redacted.Redacted<string>;
  clientRequestToken?: string;
  roleArn: string;
  customerEncryptionKeyId?: string;
  jobTags?: TagList;
  applicationType?: string;
  evaluationConfig: (typeof EvaluationConfig)["Type"];
  inferenceConfig: (typeof EvaluationInferenceConfig)["Type"];
  outputDataConfig: EvaluationOutputDataConfig;
}
export const CreateEvaluationJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    jobDescription: S.optional(SensitiveString),
    clientRequestToken: S.optional(S.String),
    roleArn: S.String,
    customerEncryptionKeyId: S.optional(S.String),
    jobTags: S.optional(TagList),
    applicationType: S.optional(S.String),
    evaluationConfig: EvaluationConfig,
    inferenceConfig: EvaluationInferenceConfig,
    outputDataConfig: EvaluationOutputDataConfig,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/evaluation-jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEvaluationJobRequest",
}) as any as S.Schema<CreateEvaluationJobRequest>;
export interface CreateEvaluationJobResponse {
  jobArn: string;
}
export const CreateEvaluationJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateEvaluationJobResponse",
}) as any as S.Schema<CreateEvaluationJobResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String), resourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Delete the invocation logging.
 */
export const deleteModelInvocationLoggingConfiguration: (
  input: DeleteModelInvocationLoggingConfigurationRequest,
) => Effect.Effect<
  DeleteModelInvocationLoggingConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelInvocationLoggingConfigurationRequest,
  output: DeleteModelInvocationLoggingConfigurationResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Get the current configuration values for model invocation logging.
 */
export const getModelInvocationLoggingConfiguration: (
  input: GetModelInvocationLoggingConfigurationRequest,
) => Effect.Effect<
  GetModelInvocationLoggingConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelInvocationLoggingConfigurationRequest,
  output: GetModelInvocationLoggingConfigurationResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Retrieves details about an Automated Reasoning policy or policy version. Returns information including the policy definition, metadata, and timestamps.
 */
export const getAutomatedReasoningPolicy: (
  input: GetAutomatedReasoningPolicyRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyRequest,
  output: GetAutomatedReasoningPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Registers an existing Amazon SageMaker endpoint with Amazon Bedrock Marketplace, allowing it to be used with Amazon Bedrock APIs.
 */
export const registerMarketplaceModelEndpoint: (
  input: RegisterMarketplaceModelEndpointRequest,
) => Effect.Effect<
  RegisterMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterMarketplaceModelEndpointRequest,
  output: RegisterMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Copies a model to another region so that it can be used there. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const createModelCopyJob: (
  input: CreateModelCopyJobRequest,
) => Effect.Effect<
  CreateModelCopyJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelCopyJobRequest,
  output: CreateModelCopyJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a model import job to import model that you have customized in other environments, such as Amazon SageMaker. For more information, see Import a customized model
 */
export const createModelImportJob: (
  input: CreateModelImportJobRequest,
) => Effect.Effect<
  CreateModelImportJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelImportJobRequest,
  output: CreateModelImportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a prompt router that manages the routing of requests between multiple foundation models based on the routing criteria.
 */
export const createPromptRouter: (
  input: CreatePromptRouterRequest,
) => Effect.Effect<
  CreatePromptRouterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePromptRouterRequest,
  output: CreatePromptRouterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Lists test results for an Automated Reasoning policy, showing how the policy performed against various test scenarios and validation checks.
 */
export const listAutomatedReasoningPolicyTestResults: {
  (
    input: ListAutomatedReasoningPolicyTestResultsRequest,
  ): Effect.Effect<
    ListAutomatedReasoningPolicyTestResultsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomatedReasoningPolicyTestResultsRequest,
  ) => Stream.Stream<
    ListAutomatedReasoningPolicyTestResultsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomatedReasoningPolicyTestResultsRequest,
  ) => Stream.Stream<
    AutomatedReasoningPolicyTestResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomatedReasoningPolicyTestResultsRequest,
  output: ListAutomatedReasoningPolicyTestResultsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "testResults",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deploys a custom model for on-demand inference in Amazon Bedrock. After you deploy your custom model, you use the deployment's Amazon Resource Name (ARN) as the `modelId` parameter when you submit prompts and generate responses with model inference.
 *
 * For more information about setting up on-demand inference for custom models, see Set up inference for a custom model.
 *
 * The following actions are related to the `CreateCustomModelDeployment` operation:
 *
 * - GetCustomModelDeployment
 *
 * - ListCustomModelDeployments
 *
 * - DeleteCustomModelDeployment
 */
export const createCustomModelDeployment: (
  input: CreateCustomModelDeploymentRequest,
) => Effect.Effect<
  CreateCustomModelDeploymentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomModelDeploymentRequest,
  output: CreateCustomModelDeploymentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates dedicated throughput for a base or custom model with the model units and for the duration that you specify. For pricing details, see Amazon Bedrock Pricing. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const createProvisionedModelThroughput: (
  input: CreateProvisionedModelThroughputRequest,
) => Effect.Effect<
  CreateProvisionedModelThroughputResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProvisionedModelThroughputRequest,
  output: CreateProvisionedModelThroughputResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a test for an Automated Reasoning policy. Tests validate that your policy works as expected by providing sample inputs and expected outcomes. Use tests to verify policy behavior before deploying to production.
 */
export const createAutomatedReasoningPolicyTestCase: (
  input: CreateAutomatedReasoningPolicyTestCaseRequest,
) => Effect.Effect<
  CreateAutomatedReasoningPolicyTestCaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomatedReasoningPolicyTestCaseRequest,
  output: CreateAutomatedReasoningPolicyTestCaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new version of an existing Automated Reasoning policy. This allows you to iterate on your policy rules while maintaining previous versions for rollback or comparison purposes.
 */
export const createAutomatedReasoningPolicyVersion: (
  input: CreateAutomatedReasoningPolicyVersionRequest,
) => Effect.Effect<
  CreateAutomatedReasoningPolicyVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomatedReasoningPolicyVersionRequest,
  output: CreateAutomatedReasoningPolicyVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an existing endpoint for a model from Amazon Bedrock Marketplace.
 */
export const updateMarketplaceModelEndpoint: (
  input: UpdateMarketplaceModelEndpointRequest,
) => Effect.Effect<
  UpdateMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMarketplaceModelEndpointRequest,
  output: UpdateMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a guardrail with the values you specify.
 *
 * - Specify a `name` and optional `description`.
 *
 * - Specify messages for when the guardrail successfully blocks a prompt or a model response in the `blockedInputMessaging` and `blockedOutputsMessaging` fields.
 *
 * - Specify topics for the guardrail to deny in the `topicPolicyConfig` object. Each GuardrailTopicConfig object in the `topicsConfig` list pertains to one topic.
 *
 * - Give a `name` and `description` so that the guardrail can properly identify the topic.
 *
 * - Specify `DENY` in the `type` field.
 *
 * - (Optional) Provide up to five prompts that you would categorize as belonging to the topic in the `examples` list.
 *
 * - Specify filter strengths for the harmful categories defined in Amazon Bedrock in the `contentPolicyConfig` object. Each GuardrailContentFilterConfig object in the `filtersConfig` list pertains to a harmful category. For more information, see Content filters. For more information about the fields in a content filter, see GuardrailContentFilterConfig.
 *
 * - Specify the category in the `type` field.
 *
 * - Specify the strength of the filter for prompts in the `inputStrength` field and for model responses in the `strength` field of the GuardrailContentFilterConfig.
 *
 * - (Optional) For security, include the ARN of a KMS key in the `kmsKeyId` field.
 */
export const updateGuardrail: (
  input: UpdateGuardrailRequest,
) => Effect.Effect<
  UpdateGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGuardrailRequest,
  output: UpdateGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a version of the guardrail. Use this API to create a snapshot of the guardrail when you are satisfied with a configuration, or to compare the configuration with another version.
 */
export const createGuardrailVersion: (
  input: CreateGuardrailVersionRequest,
) => Effect.Effect<
  CreateGuardrailVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGuardrailVersionRequest,
  output: CreateGuardrailVersionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an endpoint for a model from Amazon Bedrock Marketplace. The endpoint is hosted by Amazon SageMaker.
 */
export const createMarketplaceModelEndpoint: (
  input: CreateMarketplaceModelEndpointRequest,
) => Effect.Effect<
  CreateMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMarketplaceModelEndpointRequest,
  output: CreateMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new custom model in Amazon Bedrock. After the model is active, you can use it for inference.
 *
 * To use the model for inference, you must purchase Provisioned Throughput for it. You can't use On-demand inference with these custom models. For more information about Provisioned Throughput, see Provisioned Throughput.
 *
 * The model appears in `ListCustomModels` with a `customizationType` of `imported`. To track the status of the new model, you use the `GetCustomModel` API operation. The model can be in the following states:
 *
 * - `Creating` - Initial state during validation and registration
 *
 * - `Active` - Model is ready for use in inference
 *
 * - `Failed` - Creation process encountered an error
 *
 * **Related APIs**
 *
 * - GetCustomModel
 *
 * - ListCustomModels
 *
 * - DeleteCustomModel
 */
export const createCustomModel: (
  input: CreateCustomModelRequest,
) => Effect.Effect<
  CreateCustomModelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCustomModelRequest,
  output: CreateCustomModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates a guardrail to block topics and to implement safeguards for your generative AI applications.
 *
 * You can configure the following policies in a guardrail to avoid undesirable and harmful content, filter out denied topics and words, and remove sensitive information for privacy protection.
 *
 * - **Content filters** - Adjust filter strengths to block input prompts or model responses containing harmful content.
 *
 * - **Denied topics** - Define a set of topics that are undesirable in the context of your application. These topics will be blocked if detected in user queries or model responses.
 *
 * - **Word filters** - Configure filters to block undesirable words, phrases, and profanity. Such words can include offensive terms, competitor names etc.
 *
 * - **Sensitive information filters** - Block or mask sensitive information such as personally identifiable information (PII) or custom regex in user inputs and model responses.
 *
 * In addition to the above policies, you can also configure the messages to be returned to the user if a user input or model response is in violation of the policies defined in the guardrail.
 *
 * For more information, see Amazon Bedrock Guardrails in the *Amazon Bedrock User Guide*.
 */
export const createGuardrail: (
  input: CreateGuardrailRequest,
) => Effect.Effect<
  CreateGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGuardrailRequest,
  output: CreateGuardrailResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Exports the policy definition for an Automated Reasoning policy version. Returns the complete policy definition including rules, variables, and custom variable types in a structured format.
 */
export const exportAutomatedReasoningPolicyVersion: (
  input: ExportAutomatedReasoningPolicyVersionRequest,
) => Effect.Effect<
  ExportAutomatedReasoningPolicyVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportAutomatedReasoningPolicyVersionRequest,
  output: ExportAutomatedReasoningPolicyVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the current annotations for an Automated Reasoning policy build workflow. Annotations contain corrections to the rules, variables and types to be applied to the policy.
 */
export const getAutomatedReasoningPolicyAnnotations: (
  input: GetAutomatedReasoningPolicyAnnotationsRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyAnnotationsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyAnnotationsRequest,
  output: GetAutomatedReasoningPolicyAnnotationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves detailed information about an Automated Reasoning policy build workflow, including its status, configuration, and metadata.
 */
export const getAutomatedReasoningPolicyBuildWorkflow: (
  input: GetAutomatedReasoningPolicyBuildWorkflowRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyBuildWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyBuildWorkflowRequest,
  output: GetAutomatedReasoningPolicyBuildWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists tests for an Automated Reasoning policy. We recommend using pagination to ensure that the operation returns quickly and successfully.
 */
export const listAutomatedReasoningPolicyTestCases: {
  (
    input: ListAutomatedReasoningPolicyTestCasesRequest,
  ): Effect.Effect<
    ListAutomatedReasoningPolicyTestCasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomatedReasoningPolicyTestCasesRequest,
  ) => Stream.Stream<
    ListAutomatedReasoningPolicyTestCasesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomatedReasoningPolicyTestCasesRequest,
  ) => Stream.Stream<
    AutomatedReasoningPolicyTestCase,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomatedReasoningPolicyTestCasesRequest,
  output: ListAutomatedReasoningPolicyTestCasesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "testCases",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a custom model deployment with a new custom model. This allows you to deploy updated models without creating new deployment endpoints.
 */
export const updateCustomModelDeployment: (
  input: UpdateCustomModelDeploymentRequest,
) => Effect.Effect<
  UpdateCustomModelDeploymentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCustomModelDeploymentRequest,
  output: UpdateCustomModelDeploymentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about an evaluation job, such as the status of the job.
 */
export const getEvaluationJob: (
  input: GetEvaluationJobRequest,
) => Effect.Effect<
  GetEvaluationJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvaluationJobRequest,
  output: GetEvaluationJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a model copy job. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const getModelCopyJob: (
  input: GetModelCopyJobRequest,
) => Effect.Effect<
  GetModelCopyJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelCopyJobRequest,
  output: GetModelCopyJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a custom model that you imported earlier. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const deleteImportedModel: (
  input: DeleteImportedModelRequest,
) => Effect.Effect<
  DeleteImportedModelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImportedModelRequest,
  output: DeleteImportedModelResponse,
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
 * Retrieves the properties associated with import model job, including the status of the job. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const getModelImportJob: (
  input: GetModelImportJobRequest,
) => Effect.Effect<
  GetModelImportJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelImportJobRequest,
  output: GetModelImportJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details about a batch inference job. For more information, see Monitor batch inference jobs
 */
export const getModelInvocationJob: (
  input: GetModelInvocationJobRequest,
) => Effect.Effect<
  GetModelInvocationJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelInvocationJobRequest,
  output: GetModelInvocationJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a prompt router.
 */
export const getPromptRouter: (
  input: GetPromptRouterRequest,
) => Effect.Effect<
  GetPromptRouterResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPromptRouterRequest,
  output: GetPromptRouterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details for a Provisioned Throughput. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const getProvisionedModelThroughput: (
  input: GetProvisionedModelThroughputRequest,
) => Effect.Effect<
  GetProvisionedModelThroughputResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProvisionedModelThroughputRequest,
  output: GetProvisionedModelThroughputResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Request a model access agreement for the specified model.
 */
export const createFoundationModelAgreement: (
  input: CreateFoundationModelAgreementRequest,
) => Effect.Effect<
  CreateFoundationModelAgreementResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFoundationModelAgreementRequest,
  output: CreateFoundationModelAgreementResponse,
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
 * List the tags associated with the specified resource.
 *
 * For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specified prompt router. This action cannot be undone.
 */
export const deletePromptRouter: (
  input: DeletePromptRouterRequest,
) => Effect.Effect<
  DeletePromptRouterResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePromptRouterRequest,
  output: DeletePromptRouterResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the name or associated model for a Provisioned Throughput. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const updateProvisionedModelThroughput: (
  input: UpdateProvisionedModelThroughputRequest,
) => Effect.Effect<
  UpdateProvisionedModelThroughputResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProvisionedModelThroughputRequest,
  output: UpdateProvisionedModelThroughputResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Remove one or more tags from a resource. For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels a running Automated Reasoning policy build workflow. This stops the policy generation process and prevents further processing of the source documents.
 */
export const cancelAutomatedReasoningPolicyBuildWorkflow: (
  input: CancelAutomatedReasoningPolicyBuildWorkflowRequest,
) => Effect.Effect<
  CancelAutomatedReasoningPolicyBuildWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelAutomatedReasoningPolicyBuildWorkflowRequest,
  output: CancelAutomatedReasoningPolicyBuildWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an endpoint for a model from Amazon Bedrock Marketplace.
 */
export const deleteMarketplaceModelEndpoint: (
  input: DeleteMarketplaceModelEndpointRequest,
) => Effect.Effect<
  DeleteMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMarketplaceModelEndpointRequest,
  output: DeleteMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the account-level enforced guardrail configuration.
 */
export const deleteEnforcedGuardrailConfiguration: (
  input: DeleteEnforcedGuardrailConfigurationRequest,
) => Effect.Effect<
  DeleteEnforcedGuardrailConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnforcedGuardrailConfigurationRequest,
  output: DeleteEnforcedGuardrailConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a batch inference job. You're only charged for tokens that were already processed. For more information, see Stop a batch inference job.
 */
export const stopModelInvocationJob: (
  input: StopModelInvocationJobRequest,
) => Effect.Effect<
  StopModelInvocationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopModelInvocationJobRequest,
  output: StopModelInvocationJobResponse,
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
 * Deletes a Provisioned Throughput. You can't delete a Provisioned Throughput before the commitment term is over. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const deleteProvisionedModelThroughput: (
  input: DeleteProvisionedModelThroughputRequest,
) => Effect.Effect<
  DeleteProvisionedModelThroughputResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProvisionedModelThroughputRequest,
  output: DeleteProvisionedModelThroughputResponse,
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
 * Delete the model access agreement for the specified model.
 */
export const deleteFoundationModelAgreement: (
  input: DeleteFoundationModelAgreementRequest,
) => Effect.Effect<
  DeleteFoundationModelAgreementResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFoundationModelAgreementRequest,
  output: DeleteFoundationModelAgreementResponse,
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
 * Stops an active model customization job. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const stopModelCustomizationJob: (
  input: StopModelCustomizationJobRequest,
) => Effect.Effect<
  StopModelCustomizationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopModelCustomizationJobRequest,
  output: StopModelCustomizationJobResponse,
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
 * Deletes a custom model deployment. This operation stops the deployment and removes it from your account. After deletion, the deployment ARN can no longer be used for inference requests.
 *
 * The following actions are related to the `DeleteCustomModelDeployment` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - GetCustomModelDeployment
 *
 * - ListCustomModelDeployments
 */
export const deleteCustomModelDeployment: (
  input: DeleteCustomModelDeploymentRequest,
) => Effect.Effect<
  DeleteCustomModelDeploymentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomModelDeploymentRequest,
  output: DeleteCustomModelDeploymentResponse,
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
 * Deletes a custom model that you created earlier. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const deleteCustomModel: (
  input: DeleteCustomModelRequest,
) => Effect.Effect<
  DeleteCustomModelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomModelRequest,
  output: DeleteCustomModelResponse,
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
 * Stops an evaluation job that is current being created or running.
 */
export const stopEvaluationJob: (
  input: StopEvaluationJobRequest,
) => Effect.Effect<
  StopEvaluationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopEvaluationJobRequest,
  output: StopEvaluationJobResponse,
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
 * Deletes a guardrail.
 *
 * - To delete a guardrail, only specify the ARN of the guardrail in the `guardrailIdentifier` field. If you delete a guardrail, all of its versions will be deleted.
 *
 * - To delete a version of a guardrail, specify the ARN of the guardrail in the `guardrailIdentifier` field and the version in the `guardrailVersion` field.
 */
export const deleteGuardrail: (
  input: DeleteGuardrailRequest,
) => Effect.Effect<
  DeleteGuardrailResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGuardrailRequest,
  output: DeleteGuardrailResponse,
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
 * Deletes an application inference profile. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const deleteInferenceProfile: (
  input: DeleteInferenceProfileRequest,
) => Effect.Effect<
  DeleteInferenceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInferenceProfileRequest,
  output: DeleteInferenceProfileResponse,
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
 * Deletes an Automated Reasoning policy or policy version. This operation is idempotent. If you delete a policy more than once, each call succeeds. Deleting a policy removes it permanently and cannot be undone.
 */
export const deleteAutomatedReasoningPolicy: (
  input: DeleteAutomatedReasoningPolicyRequest,
) => Effect.Effect<
  DeleteAutomatedReasoningPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomatedReasoningPolicyRequest,
  output: DeleteAutomatedReasoningPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Automated Reasoning policy build workflow and its associated artifacts. This permanently removes the workflow history and any generated assets.
 */
export const deleteAutomatedReasoningPolicyBuildWorkflow: (
  input: DeleteAutomatedReasoningPolicyBuildWorkflowRequest,
) => Effect.Effect<
  DeleteAutomatedReasoningPolicyBuildWorkflowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomatedReasoningPolicyBuildWorkflowRequest,
  output: DeleteAutomatedReasoningPolicyBuildWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Automated Reasoning policy test. This operation is idempotent; if you delete a test more than once, each call succeeds.
 */
export const deleteAutomatedReasoningPolicyTestCase: (
  input: DeleteAutomatedReasoningPolicyTestCaseRequest,
) => Effect.Effect<
  DeleteAutomatedReasoningPolicyTestCaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomatedReasoningPolicyTestCaseRequest,
  output: DeleteAutomatedReasoningPolicyTestCaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Automated Reasoning policy test. You can modify the content, query, expected result, and confidence threshold.
 */
export const updateAutomatedReasoningPolicyTestCase: (
  input: UpdateAutomatedReasoningPolicyTestCaseRequest,
) => Effect.Effect<
  UpdateAutomatedReasoningPolicyTestCaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomatedReasoningPolicyTestCaseRequest,
  output: UpdateAutomatedReasoningPolicyTestCaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Set the configuration values for model invocation logging.
 */
export const putModelInvocationLoggingConfiguration: (
  input: PutModelInvocationLoggingConfigurationRequest,
) => Effect.Effect<
  PutModelInvocationLoggingConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutModelInvocationLoggingConfigurationRequest,
  output: PutModelInvocationLoggingConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Put usecase for model access.
 */
export const putUseCaseForModelAccess: (
  input: PutUseCaseForModelAccessRequest,
) => Effect.Effect<
  PutUseCaseForModelAccessResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutUseCaseForModelAccessRequest,
  output: PutUseCaseForModelAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get usecase for model access.
 */
export const getUseCaseForModelAccess: (
  input: GetUseCaseForModelAccessRequest,
) => Effect.Effect<
  GetUseCaseForModelAccessResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUseCaseForModelAccessRequest,
  output: GetUseCaseForModelAccessResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Automated Reasoning policies in your account, with optional filtering by policy ARN. This helps you manage and discover existing policies.
 */
export const listAutomatedReasoningPolicies: {
  (
    input: ListAutomatedReasoningPoliciesRequest,
  ): Effect.Effect<
    ListAutomatedReasoningPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomatedReasoningPoliciesRequest,
  ) => Stream.Stream<
    ListAutomatedReasoningPoliciesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomatedReasoningPoliciesRequest,
  ) => Stream.Stream<
    AutomatedReasoningPolicySummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomatedReasoningPoliciesRequest,
  output: ListAutomatedReasoningPoliciesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automatedReasoningPolicySummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the next test scenario for validating an Automated Reasoning policy. This is used during the interactive policy refinement process to test policy behavior.
 */
export const getAutomatedReasoningPolicyNextScenario: (
  input: GetAutomatedReasoningPolicyNextScenarioRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyNextScenarioResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyNextScenarioRequest,
  output: GetAutomatedReasoningPolicyNextScenarioResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific Automated Reasoning policy test.
 */
export const getAutomatedReasoningPolicyTestCase: (
  input: GetAutomatedReasoningPolicyTestCaseRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyTestCaseResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyTestCaseRequest,
  output: GetAutomatedReasoningPolicyTestCaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all build workflows for an Automated Reasoning policy, showing the history of policy creation and modification attempts.
 */
export const listAutomatedReasoningPolicyBuildWorkflows: {
  (
    input: ListAutomatedReasoningPolicyBuildWorkflowsRequest,
  ): Effect.Effect<
    ListAutomatedReasoningPolicyBuildWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAutomatedReasoningPolicyBuildWorkflowsRequest,
  ) => Stream.Stream<
    ListAutomatedReasoningPolicyBuildWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAutomatedReasoningPolicyBuildWorkflowsRequest,
  ) => Stream.Stream<
    AutomatedReasoningPolicyBuildWorkflowSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAutomatedReasoningPolicyBuildWorkflowsRequest,
  output: ListAutomatedReasoningPolicyBuildWorkflowsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "automatedReasoningPolicyBuildWorkflowSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Initiates a test workflow to validate Automated Reasoning policy tests. The workflow executes the specified tests against the policy and generates validation results.
 */
export const startAutomatedReasoningPolicyTestWorkflow: (
  input: StartAutomatedReasoningPolicyTestWorkflowRequest,
) => Effect.Effect<
  StartAutomatedReasoningPolicyTestWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAutomatedReasoningPolicyTestWorkflowRequest,
  output: StartAutomatedReasoningPolicyTestWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about a specific endpoint for a model from Amazon Bedrock Marketplace.
 */
export const getMarketplaceModelEndpoint: (
  input: GetMarketplaceModelEndpointRequest,
) => Effect.Effect<
  GetMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMarketplaceModelEndpointRequest,
  output: GetMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the endpoints for models from Amazon Bedrock Marketplace in your Amazon Web Services account.
 */
export const listMarketplaceModelEndpoints: {
  (
    input: ListMarketplaceModelEndpointsRequest,
  ): Effect.Effect<
    ListMarketplaceModelEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMarketplaceModelEndpointsRequest,
  ) => Stream.Stream<
    ListMarketplaceModelEndpointsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMarketplaceModelEndpointsRequest,
  ) => Stream.Stream<
    MarketplaceModelEndpointSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMarketplaceModelEndpointsRequest,
  output: ListMarketplaceModelEndpointsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "marketplaceModelEndpoints",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a custom model deployment, including its status, configuration, and metadata. Use this operation to monitor the deployment status and retrieve details needed for inference requests.
 *
 * The following actions are related to the `GetCustomModelDeployment` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - ListCustomModelDeployments
 *
 * - DeleteCustomModelDeployment
 */
export const getCustomModelDeployment: (
  input: GetCustomModelDeploymentRequest,
) => Effect.Effect<
  GetCustomModelDeploymentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomModelDeploymentRequest,
  output: GetCustomModelDeploymentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists custom model deployments in your account. You can filter the results by creation time, name, status, and associated model. Use this operation to manage and monitor your custom model deployments.
 *
 * We recommend using pagination to ensure that the operation returns quickly and successfully.
 *
 * The following actions are related to the `ListCustomModelDeployments` operation:
 *
 * - CreateCustomModelDeployment
 *
 * - GetCustomModelDeployment
 *
 * - DeleteCustomModelDeployment
 */
export const listCustomModelDeployments: {
  (
    input: ListCustomModelDeploymentsRequest,
  ): Effect.Effect<
    ListCustomModelDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomModelDeploymentsRequest,
  ) => Stream.Stream<
    ListCustomModelDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomModelDeploymentsRequest,
  ) => Stream.Stream<
    CustomModelDeploymentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomModelDeploymentsRequest,
  output: ListCustomModelDeploymentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelDeploymentSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get the properties associated with a Amazon Bedrock custom model that you have created. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const getCustomModel: (
  input: GetCustomModelRequest,
) => Effect.Effect<
  GetCustomModelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomModelRequest,
  output: GetCustomModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the custom models that you have created with the `CreateModelCustomizationJob` operation.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const listCustomModels: {
  (
    input: ListCustomModelsRequest,
  ): Effect.Effect<
    ListCustomModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomModelsRequest,
  ) => Stream.Stream<
    ListCustomModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomModelsRequest,
  ) => Stream.Stream<
    CustomModelSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomModelsRequest,
  output: ListCustomModelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the account-level enforced guardrail configurations.
 */
export const listEnforcedGuardrailsConfiguration: {
  (
    input: ListEnforcedGuardrailsConfigurationRequest,
  ): Effect.Effect<
    ListEnforcedGuardrailsConfigurationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnforcedGuardrailsConfigurationRequest,
  ) => Stream.Stream<
    ListEnforcedGuardrailsConfigurationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnforcedGuardrailsConfigurationRequest,
  ) => Stream.Stream<
    AccountEnforcedGuardrailOutputConfiguration,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnforcedGuardrailsConfigurationRequest,
  output: ListEnforcedGuardrailsConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "guardrailsConfig",
  } as const,
}));
/**
 * Sets the account-level enforced guardrail configuration.
 */
export const putEnforcedGuardrailConfiguration: (
  input: PutEnforcedGuardrailConfigurationRequest,
) => Effect.Effect<
  PutEnforcedGuardrailConfigurationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEnforcedGuardrailConfigurationRequest,
  output: PutEnforcedGuardrailConfigurationResponse,
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
 * Deletes a batch of evaluation jobs. An evaluation job can only be deleted if it has following status `FAILED`, `COMPLETED`, and `STOPPED`. You can request up to 25 model evaluation jobs be deleted in a single request.
 */
export const batchDeleteEvaluationJob: (
  input: BatchDeleteEvaluationJobRequest,
) => Effect.Effect<
  BatchDeleteEvaluationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteEvaluationJobRequest,
  output: BatchDeleteEvaluationJobResponse,
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
 * Lists details about all the guardrails in an account. To list the `DRAFT` version of all your guardrails, don't specify the `guardrailIdentifier` field. To list all versions of a guardrail, specify the ARN of the guardrail in the `guardrailIdentifier` field.
 *
 * You can set the maximum number of results to return in a response in the `maxResults` field. If there are more results than the number you set, the response returns a `nextToken` that you can send in another `ListGuardrails` request to see the next batch of results.
 */
export const listGuardrails: {
  (
    input: ListGuardrailsRequest,
  ): Effect.Effect<
    ListGuardrailsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGuardrailsRequest,
  ) => Stream.Stream<
    ListGuardrailsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGuardrailsRequest,
  ) => Stream.Stream<
    GuardrailSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGuardrailsRequest,
  output: ListGuardrailsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "guardrails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets information about an inference profile. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const getInferenceProfile: (
  input: GetInferenceProfileRequest,
) => Effect.Effect<
  GetInferenceProfileResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetInferenceProfileRequest,
  output: GetInferenceProfileResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of inference profiles that you can use. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const listInferenceProfiles: {
  (
    input: ListInferenceProfilesRequest,
  ): Effect.Effect<
    ListInferenceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInferenceProfilesRequest,
  ) => Stream.Stream<
    ListInferenceProfilesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInferenceProfilesRequest,
  ) => Stream.Stream<
    InferenceProfileSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInferenceProfilesRequest,
  output: ListInferenceProfilesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "inferenceProfileSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of model copy jobs that you have submitted. You can filter the jobs to return based on one or more criteria. For more information, see Copy models to be used in other regions in the Amazon Bedrock User Guide.
 */
export const listModelCopyJobs: {
  (
    input: ListModelCopyJobsRequest,
  ): Effect.Effect<
    ListModelCopyJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelCopyJobsRequest,
  ) => Stream.Stream<
    ListModelCopyJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelCopyJobsRequest,
  ) => Stream.Stream<
    ModelCopyJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelCopyJobsRequest,
  output: ListModelCopyJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelCopyJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets properties associated with a customized model you imported.
 */
export const getImportedModel: (
  input: GetImportedModelRequest,
) => Effect.Effect<
  GetImportedModelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportedModelRequest,
  output: GetImportedModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of models you've imported. You can filter the results to return based on one or more criteria. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const listImportedModels: {
  (
    input: ListImportedModelsRequest,
  ): Effect.Effect<
    ListImportedModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportedModelsRequest,
  ) => Stream.Stream<
    ListImportedModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportedModelsRequest,
  ) => Stream.Stream<
    ImportedModelSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportedModelsRequest,
  output: ListImportedModelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of import jobs you've submitted. You can filter the results to return based on one or more criteria. For more information, see Import a customized model in the Amazon Bedrock User Guide.
 */
export const listModelImportJobs: {
  (
    input: ListModelImportJobsRequest,
  ): Effect.Effect<
    ListModelImportJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelImportJobsRequest,
  ) => Stream.Stream<
    ListModelImportJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelImportJobsRequest,
  ) => Stream.Stream<
    ModelImportJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelImportJobsRequest,
  output: ListModelImportJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelImportJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all batch inference jobs in the account. For more information, see View details about a batch inference job.
 */
export const listModelInvocationJobs: {
  (
    input: ListModelInvocationJobsRequest,
  ): Effect.Effect<
    ListModelInvocationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelInvocationJobsRequest,
  ) => Stream.Stream<
    ListModelInvocationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelInvocationJobsRequest,
  ) => Stream.Stream<
    ModelInvocationJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelInvocationJobsRequest,
  output: ListModelInvocationJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "invocationJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists Amazon Bedrock foundation models that you can use. You can filter the results with the request parameters. For more information, see Foundation models in the Amazon Bedrock User Guide.
 */
export const listFoundationModels: (
  input: ListFoundationModelsRequest,
) => Effect.Effect<
  ListFoundationModelsResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFoundationModelsRequest,
  output: ListFoundationModelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of prompt routers.
 */
export const listPromptRouters: {
  (
    input: ListPromptRoutersRequest,
  ): Effect.Effect<
    ListPromptRoutersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPromptRoutersRequest,
  ) => Stream.Stream<
    ListPromptRoutersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPromptRoutersRequest,
  ) => Stream.Stream<
    PromptRouterSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPromptRoutersRequest,
  output: ListPromptRoutersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "promptRouterSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the Provisioned Throughputs in the account. For more information, see Provisioned Throughput in the Amazon Bedrock User Guide.
 */
export const listProvisionedModelThroughputs: {
  (
    input: ListProvisionedModelThroughputsRequest,
  ): Effect.Effect<
    ListProvisionedModelThroughputsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProvisionedModelThroughputsRequest,
  ) => Stream.Stream<
    ListProvisionedModelThroughputsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProvisionedModelThroughputsRequest,
  ) => Stream.Stream<
    ProvisionedModelSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProvisionedModelThroughputsRequest,
  output: ListProvisionedModelThroughputsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "provisionedModelSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get information about the Foundation model availability.
 */
export const getFoundationModelAvailability: (
  input: GetFoundationModelAvailabilityRequest,
) => Effect.Effect<
  GetFoundationModelAvailabilityResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFoundationModelAvailabilityRequest,
  output: GetFoundationModelAvailabilityResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of model customization jobs that you have submitted. You can filter the jobs to return based on one or more criteria.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const listModelCustomizationJobs: {
  (
    input: ListModelCustomizationJobsRequest,
  ): Effect.Effect<
    ListModelCustomizationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelCustomizationJobsRequest,
  ) => Stream.Stream<
    ListModelCustomizationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelCustomizationJobsRequest,
  ) => Stream.Stream<
    ModelCustomizationJobSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListModelCustomizationJobsRequest,
  output: ListModelCustomizationJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "modelCustomizationJobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets details about a guardrail. If you don't specify a version, the response returns details for the `DRAFT` version.
 */
export const getGuardrail: (
  input: GetGuardrailRequest,
) => Effect.Effect<
  GetGuardrailResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGuardrailRequest,
  output: GetGuardrailResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a batch inference job to invoke a model on multiple prompts. Format your data according to Format your inference data and upload it to an Amazon S3 bucket. For more information, see Process multiple prompts with batch inference.
 *
 * The response returns a `jobArn` that you can use to stop or get details about the job.
 */
export const createModelInvocationJob: (
  input: CreateModelInvocationJobRequest,
) => Effect.Effect<
  CreateModelInvocationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelInvocationJobRequest,
  output: CreateModelInvocationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get details about a Amazon Bedrock foundation model.
 */
export const getFoundationModel: (
  input: GetFoundationModelRequest,
) => Effect.Effect<
  GetFoundationModelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFoundationModelRequest,
  output: GetFoundationModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the properties associated with a model-customization job, including the status of the job. For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const getModelCustomizationJob: (
  input: GetModelCustomizationJobRequest,
) => Effect.Effect<
  GetModelCustomizationJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelCustomizationJobRequest,
  output: GetModelCustomizationJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deregisters an endpoint for a model from Amazon Bedrock Marketplace. This operation removes the endpoint's association with Amazon Bedrock but does not delete the underlying Amazon SageMaker endpoint.
 */
export const deregisterMarketplaceModelEndpoint: (
  input: DeregisterMarketplaceModelEndpointRequest,
) => Effect.Effect<
  DeregisterMarketplaceModelEndpointResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterMarketplaceModelEndpointRequest,
  output: DeregisterMarketplaceModelEndpointResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associate tags with a resource. For more information, see Tagging resources in the Amazon Bedrock User Guide.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Updates an existing Automated Reasoning policy with new rules, variables, or configuration. This creates a new version of the policy while preserving the previous version.
 */
export const updateAutomatedReasoningPolicy: (
  input: UpdateAutomatedReasoningPolicyRequest,
) => Effect.Effect<
  UpdateAutomatedReasoningPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomatedReasoningPolicyRequest,
  output: UpdateAutomatedReasoningPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates an application inference profile to track metrics and costs when invoking a model. To create an application inference profile for a foundation model in one region, specify the ARN of the model in that region. To create an application inference profile for a foundation model across multiple regions, specify the ARN of the system-defined inference profile that contains the regions that you want to route requests to. For more information, see Increase throughput and resilience with cross-region inference in Amazon Bedrock. in the Amazon Bedrock User Guide.
 */
export const createInferenceProfile: (
  input: CreateInferenceProfileRequest,
) => Effect.Effect<
  CreateInferenceProfileResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInferenceProfileRequest,
  output: CreateInferenceProfileResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Creates an Automated Reasoning policy for Amazon Bedrock Guardrails. Automated Reasoning policies use mathematical techniques to detect hallucinations, suggest corrections, and highlight unstated assumptions in the responses of your GenAI application.
 *
 * To create a policy, you upload a source document that describes the rules that you're encoding. Automated Reasoning extracts important concepts from the source document that will become variables in the policy and infers policy rules.
 */
export const createAutomatedReasoningPolicy: (
  input: CreateAutomatedReasoningPolicyRequest,
) => Effect.Effect<
  CreateAutomatedReasoningPolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutomatedReasoningPolicyRequest,
  output: CreateAutomatedReasoningPolicyResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Starts a new build workflow for an Automated Reasoning policy. This initiates the process of analyzing source documents and generating policy rules, variables, and types.
 */
export const startAutomatedReasoningPolicyBuildWorkflow: (
  input: StartAutomatedReasoningPolicyBuildWorkflowRequest,
) => Effect.Effect<
  StartAutomatedReasoningPolicyBuildWorkflowResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAutomatedReasoningPolicyBuildWorkflowRequest,
  output: StartAutomatedReasoningPolicyBuildWorkflowResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all existing evaluation jobs.
 */
export const listEvaluationJobs: {
  (
    input: ListEvaluationJobsRequest,
  ): Effect.Effect<
    ListEvaluationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEvaluationJobsRequest,
  ) => Stream.Stream<
    ListEvaluationJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEvaluationJobsRequest,
  ) => Stream.Stream<
    EvaluationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEvaluationJobsRequest,
  output: ListEvaluationJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the annotations for an Automated Reasoning policy build workflow. This allows you to modify extracted rules, variables, and types before finalizing the policy.
 */
export const updateAutomatedReasoningPolicyAnnotations: (
  input: UpdateAutomatedReasoningPolicyAnnotationsRequest,
) => Effect.Effect<
  UpdateAutomatedReasoningPolicyAnnotationsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomatedReasoningPolicyAnnotationsRequest,
  output: UpdateAutomatedReasoningPolicyAnnotationsResponse,
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
 * Get the offers associated with the specified model.
 */
export const listFoundationModelAgreementOffers: (
  input: ListFoundationModelAgreementOffersRequest,
) => Effect.Effect<
  ListFoundationModelAgreementOffersResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFoundationModelAgreementOffersRequest,
  output: ListFoundationModelAgreementOffersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a fine-tuning job to customize a base model.
 *
 * You specify the base foundation model and the location of the training data. After the model-customization job completes successfully, your custom model resource will be ready to use. Amazon Bedrock returns validation loss metrics and output generations after the job completes.
 *
 * For information on the format of training and validation data, see Prepare the datasets.
 *
 * Model-customization jobs are asynchronous and the completion time depends on the base model and the training/validation data size. To monitor a job, use the `GetModelCustomizationJob` operation to retrieve the job status.
 *
 * For more information, see Custom models in the Amazon Bedrock User Guide.
 */
export const createModelCustomizationJob: (
  input: CreateModelCustomizationJobRequest,
) => Effect.Effect<
  CreateModelCustomizationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelCustomizationJobRequest,
  output: CreateModelCustomizationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Retrieves the test result for a specific Automated Reasoning policy test. Returns detailed validation findings and execution status.
 */
export const getAutomatedReasoningPolicyTestResult: (
  input: GetAutomatedReasoningPolicyTestResultRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyTestResultResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyTestResultRequest,
  output: GetAutomatedReasoningPolicyTestResultResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the resulting assets from a completed Automated Reasoning policy build workflow, including build logs, quality reports, and generated policy artifacts.
 */
export const getAutomatedReasoningPolicyBuildWorkflowResultAssets: (
  input: GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest,
) => Effect.Effect<
  GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutomatedReasoningPolicyBuildWorkflowResultAssetsRequest,
  output: GetAutomatedReasoningPolicyBuildWorkflowResultAssetsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an evaluation job.
 */
export const createEvaluationJob: (
  input: CreateEvaluationJobRequest,
) => Effect.Effect<
  CreateEvaluationJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEvaluationJobRequest,
  output: CreateEvaluationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
