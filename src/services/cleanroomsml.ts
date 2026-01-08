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
  sdkId: "CleanRoomsML",
  serviceShapeName: "AWSStarkControlService",
});
const auth = T.AwsAuthSigv4({ name: "cleanrooms-ml" });
const ver = T.ServiceVersion("2023-09-06");
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
              `https://cleanrooms-ml-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cleanrooms-ml-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cleanrooms-ml.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cleanrooms-ml.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NextToken = string;
export type MaxResults = number;
export type UUID = string;
export type TrainedModelArn = string;
export type TaggableArn = string;
export type TagKey = string;
export type NameString = string;
export type AudienceGenerationJobArn = string;
export type ResourceDescription = string;
export type ConfiguredAudienceModelArn = string;
export type TrainingDatasetArn = string;
export type KmsKeyArn = string;
export type AudienceModelArn = string;
export type MinMatchingSeedSize = number;
export type ResourcePolicy = string;
export type Hash = string;
export type IamRoleArn = string;
export type ConfiguredModelAlgorithmArn = string;
export type ConfiguredModelAlgorithmAssociationArn = string;
export type MLInputChannelArn = string;
export type TrainedModelInferenceJobArn = string;
export type TagValue = string;
export type AudienceSizeValue = number;
export type AlgorithmImage = string;
export type ContainerEntrypointString = string;
export type ContainerArgument = string;
export type ModelTrainingDataChannelName = string;
export type AccountId = string;
export type S3Path = string;
export type AnalysisTemplateArn = string;
export type MetricName = string;
export type MetricRegex = string;
export type ParameterName = string;
export type ParameterValue = string;
export type ColumnName = string;
export type BudgetedResourceArn = string;
export type Budget = number;
export type TrainedModelArtifactMaxSizeValue = number;
export type TrainedModelExportsMaxSizeValue = number;
export type TrainedModelInferenceMaxOutputSizeValue = number;
export type GlueTableName = string;
export type GlueDatabaseName = string;
export type SparkPropertyKey = string;
export type SparkPropertyValue = string;
export type SyntheticDataColumnName = string;
export type CustomDataIdentifier = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type SharedAudienceMetrics = "ALL" | "NONE";
export const SharedAudienceMetrics = S.Literal("ALL", "NONE");
export type MetricsList = SharedAudienceMetrics[];
export const MetricsList = S.Array(SharedAudienceMetrics);
export type TagOnCreatePolicy = "FROM_PARENT_RESOURCE" | "NONE";
export const TagOnCreatePolicy = S.Literal("FROM_PARENT_RESOURCE", "NONE");
export type PolicyExistenceCondition =
  | "POLICY_MUST_EXIST"
  | "POLICY_MUST_NOT_EXIST";
export const PolicyExistenceCondition = S.Literal(
  "POLICY_MUST_EXIST",
  "POLICY_MUST_NOT_EXIST",
);
export type ConfiguredModelAlgorithmAssociationArnList = string[];
export const ConfiguredModelAlgorithmAssociationArnList = S.Array(S.String);
export type TrainingInputMode = "File" | "FastFile" | "Pipe";
export const TrainingInputMode = S.Literal("File", "FastFile", "Pipe");
export type TrainedModelStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETE_PENDING"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED"
  | "INACTIVE"
  | "CANCEL_PENDING"
  | "CANCEL_IN_PROGRESS"
  | "CANCEL_FAILED";
export const TrainedModelStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETE_PENDING",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
  "INACTIVE",
  "CANCEL_PENDING",
  "CANCEL_IN_PROGRESS",
  "CANCEL_FAILED",
);
export interface ListCollaborationConfiguredModelAlgorithmAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  collaborationIdentifier: string;
}
export const ListCollaborationConfiguredModelAlgorithmAssociationsRequest =
  S.suspend(() =>
    S.Struct({
      nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
      maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
      collaborationIdentifier: S.String.pipe(
        T.HttpLabel("collaborationIdentifier"),
      ),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/collaborations/{collaborationIdentifier}/configured-model-algorithm-associations",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "ListCollaborationConfiguredModelAlgorithmAssociationsRequest",
  }) as any as S.Schema<ListCollaborationConfiguredModelAlgorithmAssociationsRequest>;
export interface ListCollaborationMLInputChannelsRequest {
  nextToken?: string;
  maxResults?: number;
  collaborationIdentifier: string;
}
export const ListCollaborationMLInputChannelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/ml-input-channels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationMLInputChannelsRequest",
}) as any as S.Schema<ListCollaborationMLInputChannelsRequest>;
export interface ListCollaborationTrainedModelExportJobsRequest {
  nextToken?: string;
  maxResults?: number;
  collaborationIdentifier: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
}
export const ListCollaborationTrainedModelExportJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/trained-models/{trainedModelArn}/export-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationTrainedModelExportJobsRequest",
}) as any as S.Schema<ListCollaborationTrainedModelExportJobsRequest>;
export interface ListCollaborationTrainedModelInferenceJobsRequest {
  nextToken?: string;
  maxResults?: number;
  collaborationIdentifier: string;
  trainedModelArn?: string;
  trainedModelVersionIdentifier?: string;
}
export const ListCollaborationTrainedModelInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    trainedModelArn: S.optional(S.String).pipe(T.HttpQuery("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/trained-model-inference-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationTrainedModelInferenceJobsRequest",
}) as any as S.Schema<ListCollaborationTrainedModelInferenceJobsRequest>;
export interface ListCollaborationTrainedModelsRequest {
  nextToken?: string;
  maxResults?: number;
  collaborationIdentifier: string;
}
export const ListCollaborationTrainedModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/trained-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollaborationTrainedModelsRequest",
}) as any as S.Schema<ListCollaborationTrainedModelsRequest>;
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
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export interface ListAudienceExportJobsRequest {
  nextToken?: string;
  maxResults?: number;
  audienceGenerationJobArn?: string;
}
export const ListAudienceExportJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    audienceGenerationJobArn: S.optional(S.String).pipe(
      T.HttpQuery("audienceGenerationJobArn"),
    ),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audience-export-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAudienceExportJobsRequest",
}) as any as S.Schema<ListAudienceExportJobsRequest>;
export interface GetAudienceGenerationJobRequest {
  audienceGenerationJobArn: string;
}
export const GetAudienceGenerationJobRequest = S.suspend(() =>
  S.Struct({
    audienceGenerationJobArn: S.String.pipe(
      T.HttpLabel("audienceGenerationJobArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/audience-generation-job/{audienceGenerationJobArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAudienceGenerationJobRequest",
}) as any as S.Schema<GetAudienceGenerationJobRequest>;
export interface DeleteAudienceGenerationJobRequest {
  audienceGenerationJobArn: string;
}
export const DeleteAudienceGenerationJobRequest = S.suspend(() =>
  S.Struct({
    audienceGenerationJobArn: S.String.pipe(
      T.HttpLabel("audienceGenerationJobArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/audience-generation-job/{audienceGenerationJobArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAudienceGenerationJobRequest",
}) as any as S.Schema<DeleteAudienceGenerationJobRequest>;
export interface DeleteAudienceGenerationJobResponse {}
export const DeleteAudienceGenerationJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAudienceGenerationJobResponse",
}) as any as S.Schema<DeleteAudienceGenerationJobResponse>;
export interface ListAudienceGenerationJobsRequest {
  nextToken?: string;
  maxResults?: number;
  configuredAudienceModelArn?: string;
  collaborationId?: string;
}
export const ListAudienceGenerationJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    configuredAudienceModelArn: S.optional(S.String).pipe(
      T.HttpQuery("configuredAudienceModelArn"),
    ),
    collaborationId: S.optional(S.String).pipe(T.HttpQuery("collaborationId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audience-generation-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAudienceGenerationJobsRequest",
}) as any as S.Schema<ListAudienceGenerationJobsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateAudienceModelRequest {
  trainingDataStartTime?: Date;
  trainingDataEndTime?: Date;
  name: string;
  trainingDatasetArn: string;
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
  description?: string;
}
export const CreateAudienceModelRequest = S.suspend(() =>
  S.Struct({
    trainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    trainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    name: S.String,
    trainingDatasetArn: S.String,
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audience-model" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAudienceModelRequest",
}) as any as S.Schema<CreateAudienceModelRequest>;
export interface GetAudienceModelRequest {
  audienceModelArn: string;
}
export const GetAudienceModelRequest = S.suspend(() =>
  S.Struct({
    audienceModelArn: S.String.pipe(T.HttpLabel("audienceModelArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audience-model/{audienceModelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAudienceModelRequest",
}) as any as S.Schema<GetAudienceModelRequest>;
export interface DeleteAudienceModelRequest {
  audienceModelArn: string;
}
export const DeleteAudienceModelRequest = S.suspend(() =>
  S.Struct({
    audienceModelArn: S.String.pipe(T.HttpLabel("audienceModelArn")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/audience-model/{audienceModelArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAudienceModelRequest",
}) as any as S.Schema<DeleteAudienceModelRequest>;
export interface DeleteAudienceModelResponse {}
export const DeleteAudienceModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAudienceModelResponse",
}) as any as S.Schema<DeleteAudienceModelResponse>;
export interface ListAudienceModelsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAudienceModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/audience-model" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAudienceModelsRequest",
}) as any as S.Schema<ListAudienceModelsRequest>;
export interface GetConfiguredAudienceModelRequest {
  configuredAudienceModelArn: string;
}
export const GetConfiguredAudienceModelRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/configured-audience-model/{configuredAudienceModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredAudienceModelRequest",
}) as any as S.Schema<GetConfiguredAudienceModelRequest>;
export interface S3ConfigMap {
  s3Uri: string;
}
export const S3ConfigMap = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({ identifier: "S3ConfigMap" }) as any as S.Schema<S3ConfigMap>;
export interface AudienceDestination {
  s3Destination: S3ConfigMap;
}
export const AudienceDestination = S.suspend(() =>
  S.Struct({ s3Destination: S3ConfigMap }),
).annotations({
  identifier: "AudienceDestination",
}) as any as S.Schema<AudienceDestination>;
export interface ConfiguredAudienceModelOutputConfig {
  destination: AudienceDestination;
  roleArn: string;
}
export const ConfiguredAudienceModelOutputConfig = S.suspend(() =>
  S.Struct({ destination: AudienceDestination, roleArn: S.String }),
).annotations({
  identifier: "ConfiguredAudienceModelOutputConfig",
}) as any as S.Schema<ConfiguredAudienceModelOutputConfig>;
export type AudienceSizeType = "ABSOLUTE" | "PERCENTAGE";
export const AudienceSizeType = S.Literal("ABSOLUTE", "PERCENTAGE");
export type AudienceSizeBins = number[];
export const AudienceSizeBins = S.Array(S.Number);
export interface AudienceSizeConfig {
  audienceSizeType: AudienceSizeType;
  audienceSizeBins: number[];
}
export const AudienceSizeConfig = S.suspend(() =>
  S.Struct({
    audienceSizeType: AudienceSizeType,
    audienceSizeBins: AudienceSizeBins,
  }),
).annotations({
  identifier: "AudienceSizeConfig",
}) as any as S.Schema<AudienceSizeConfig>;
export interface UpdateConfiguredAudienceModelRequest {
  configuredAudienceModelArn: string;
  outputConfig?: ConfiguredAudienceModelOutputConfig;
  audienceModelArn?: string;
  sharedAudienceMetrics?: SharedAudienceMetrics[];
  minMatchingSeedSize?: number;
  audienceSizeConfig?: AudienceSizeConfig;
  description?: string;
}
export const UpdateConfiguredAudienceModelRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
    outputConfig: S.optional(ConfiguredAudienceModelOutputConfig),
    audienceModelArn: S.optional(S.String),
    sharedAudienceMetrics: S.optional(MetricsList),
    minMatchingSeedSize: S.optional(S.Number),
    audienceSizeConfig: S.optional(AudienceSizeConfig),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/configured-audience-model/{configuredAudienceModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConfiguredAudienceModelRequest",
}) as any as S.Schema<UpdateConfiguredAudienceModelRequest>;
export interface DeleteConfiguredAudienceModelRequest {
  configuredAudienceModelArn: string;
}
export const DeleteConfiguredAudienceModelRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/configured-audience-model/{configuredAudienceModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredAudienceModelRequest",
}) as any as S.Schema<DeleteConfiguredAudienceModelRequest>;
export interface DeleteConfiguredAudienceModelResponse {}
export const DeleteConfiguredAudienceModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredAudienceModelResponse",
}) as any as S.Schema<DeleteConfiguredAudienceModelResponse>;
export interface ListConfiguredAudienceModelsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListConfiguredAudienceModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configured-audience-model" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredAudienceModelsRequest",
}) as any as S.Schema<ListConfiguredAudienceModelsRequest>;
export interface PutConfiguredAudienceModelPolicyRequest {
  configuredAudienceModelArn: string;
  configuredAudienceModelPolicy: string;
  previousPolicyHash?: string;
  policyExistenceCondition?: PolicyExistenceCondition;
}
export const PutConfiguredAudienceModelPolicyRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
    configuredAudienceModelPolicy: S.String,
    previousPolicyHash: S.optional(S.String),
    policyExistenceCondition: S.optional(PolicyExistenceCondition),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutConfiguredAudienceModelPolicyRequest",
}) as any as S.Schema<PutConfiguredAudienceModelPolicyRequest>;
export interface GetConfiguredAudienceModelPolicyRequest {
  configuredAudienceModelArn: string;
}
export const GetConfiguredAudienceModelPolicyRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredAudienceModelPolicyRequest",
}) as any as S.Schema<GetConfiguredAudienceModelPolicyRequest>;
export interface DeleteConfiguredAudienceModelPolicyRequest {
  configuredAudienceModelArn: string;
}
export const DeleteConfiguredAudienceModelPolicyRequest = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String.pipe(
      T.HttpLabel("configuredAudienceModelArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/configured-audience-model/{configuredAudienceModelArn}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredAudienceModelPolicyRequest",
}) as any as S.Schema<DeleteConfiguredAudienceModelPolicyRequest>;
export interface DeleteConfiguredAudienceModelPolicyResponse {}
export const DeleteConfiguredAudienceModelPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredAudienceModelPolicyResponse",
}) as any as S.Schema<DeleteConfiguredAudienceModelPolicyResponse>;
export interface GetConfiguredModelAlgorithmRequest {
  configuredModelAlgorithmArn: string;
}
export const GetConfiguredModelAlgorithmRequest = S.suspend(() =>
  S.Struct({
    configuredModelAlgorithmArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/configured-model-algorithms/{configuredModelAlgorithmArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredModelAlgorithmRequest",
}) as any as S.Schema<GetConfiguredModelAlgorithmRequest>;
export interface DeleteConfiguredModelAlgorithmRequest {
  configuredModelAlgorithmArn: string;
}
export const DeleteConfiguredModelAlgorithmRequest = S.suspend(() =>
  S.Struct({
    configuredModelAlgorithmArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/configured-model-algorithms/{configuredModelAlgorithmArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredModelAlgorithmRequest",
}) as any as S.Schema<DeleteConfiguredModelAlgorithmRequest>;
export interface DeleteConfiguredModelAlgorithmResponse {}
export const DeleteConfiguredModelAlgorithmResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredModelAlgorithmResponse",
}) as any as S.Schema<DeleteConfiguredModelAlgorithmResponse>;
export interface ListConfiguredModelAlgorithmsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListConfiguredModelAlgorithmsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/configured-model-algorithms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredModelAlgorithmsRequest",
}) as any as S.Schema<ListConfiguredModelAlgorithmsRequest>;
export interface GetConfiguredModelAlgorithmAssociationRequest {
  configuredModelAlgorithmAssociationArn: string;
  membershipIdentifier: string;
}
export const GetConfiguredModelAlgorithmAssociationRequest = S.suspend(() =>
  S.Struct({
    configuredModelAlgorithmAssociationArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmAssociationArn"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetConfiguredModelAlgorithmAssociationRequest",
}) as any as S.Schema<GetConfiguredModelAlgorithmAssociationRequest>;
export interface DeleteConfiguredModelAlgorithmAssociationRequest {
  configuredModelAlgorithmAssociationArn: string;
  membershipIdentifier: string;
}
export const DeleteConfiguredModelAlgorithmAssociationRequest = S.suspend(() =>
  S.Struct({
    configuredModelAlgorithmAssociationArn: S.String.pipe(
      T.HttpLabel("configuredModelAlgorithmAssociationArn"),
    ),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConfiguredModelAlgorithmAssociationRequest",
}) as any as S.Schema<DeleteConfiguredModelAlgorithmAssociationRequest>;
export interface DeleteConfiguredModelAlgorithmAssociationResponse {}
export const DeleteConfiguredModelAlgorithmAssociationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConfiguredModelAlgorithmAssociationResponse",
}) as any as S.Schema<DeleteConfiguredModelAlgorithmAssociationResponse>;
export interface ListConfiguredModelAlgorithmAssociationsRequest {
  nextToken?: string;
  maxResults?: number;
  membershipIdentifier: string;
}
export const ListConfiguredModelAlgorithmAssociationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConfiguredModelAlgorithmAssociationsRequest",
}) as any as S.Schema<ListConfiguredModelAlgorithmAssociationsRequest>;
export interface GetCollaborationConfiguredModelAlgorithmAssociationRequest {
  configuredModelAlgorithmAssociationArn: string;
  collaborationIdentifier: string;
}
export const GetCollaborationConfiguredModelAlgorithmAssociationRequest =
  S.suspend(() =>
    S.Struct({
      configuredModelAlgorithmAssociationArn: S.String.pipe(
        T.HttpLabel("configuredModelAlgorithmAssociationArn"),
      ),
      collaborationIdentifier: S.String.pipe(
        T.HttpLabel("collaborationIdentifier"),
      ),
    }).pipe(
      T.all(
        T.Http({
          method: "GET",
          uri: "/collaborations/{collaborationIdentifier}/configured-model-algorithm-associations/{configuredModelAlgorithmAssociationArn}",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
  ).annotations({
    identifier: "GetCollaborationConfiguredModelAlgorithmAssociationRequest",
  }) as any as S.Schema<GetCollaborationConfiguredModelAlgorithmAssociationRequest>;
export interface GetMLConfigurationRequest {
  membershipIdentifier: string;
}
export const GetMLConfigurationRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/ml-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLConfigurationRequest",
}) as any as S.Schema<GetMLConfigurationRequest>;
export interface DeleteMLConfigurationRequest {
  membershipIdentifier: string;
}
export const DeleteMLConfigurationRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/ml-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMLConfigurationRequest",
}) as any as S.Schema<DeleteMLConfigurationRequest>;
export interface DeleteMLConfigurationResponse {}
export const DeleteMLConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMLConfigurationResponse",
}) as any as S.Schema<DeleteMLConfigurationResponse>;
export interface GetMLInputChannelRequest {
  mlInputChannelArn: string;
  membershipIdentifier: string;
}
export const GetMLInputChannelRequest = S.suspend(() =>
  S.Struct({
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/ml-input-channels/{mlInputChannelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMLInputChannelRequest",
}) as any as S.Schema<GetMLInputChannelRequest>;
export interface DeleteMLInputChannelDataRequest {
  mlInputChannelArn: string;
  membershipIdentifier: string;
}
export const DeleteMLInputChannelDataRequest = S.suspend(() =>
  S.Struct({
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/ml-input-channels/{mlInputChannelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMLInputChannelDataRequest",
}) as any as S.Schema<DeleteMLInputChannelDataRequest>;
export interface DeleteMLInputChannelDataResponse {}
export const DeleteMLInputChannelDataResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMLInputChannelDataResponse",
}) as any as S.Schema<DeleteMLInputChannelDataResponse>;
export interface ListMLInputChannelsRequest {
  nextToken?: string;
  maxResults?: number;
  membershipIdentifier: string;
}
export const ListMLInputChannelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/ml-input-channels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMLInputChannelsRequest",
}) as any as S.Schema<ListMLInputChannelsRequest>;
export interface GetCollaborationMLInputChannelRequest {
  mlInputChannelArn: string;
  collaborationIdentifier: string;
}
export const GetCollaborationMLInputChannelRequest = S.suspend(() =>
  S.Struct({
    mlInputChannelArn: S.String.pipe(T.HttpLabel("mlInputChannelArn")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/ml-input-channels/{mlInputChannelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationMLInputChannelRequest",
}) as any as S.Schema<GetCollaborationMLInputChannelRequest>;
export interface GetTrainedModelRequest {
  trainedModelArn: string;
  membershipIdentifier: string;
  versionIdentifier?: string;
}
export const GetTrainedModelRequest = S.suspend(() =>
  S.Struct({
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrainedModelRequest",
}) as any as S.Schema<GetTrainedModelRequest>;
export interface DeleteTrainedModelOutputRequest {
  trainedModelArn: string;
  membershipIdentifier: string;
  versionIdentifier?: string;
}
export const DeleteTrainedModelOutputRequest = S.suspend(() =>
  S.Struct({
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrainedModelOutputRequest",
}) as any as S.Schema<DeleteTrainedModelOutputRequest>;
export interface DeleteTrainedModelOutputResponse {}
export const DeleteTrainedModelOutputResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTrainedModelOutputResponse",
}) as any as S.Schema<DeleteTrainedModelOutputResponse>;
export interface ListTrainedModelsRequest {
  nextToken?: string;
  maxResults?: number;
  membershipIdentifier: string;
}
export const ListTrainedModelsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/trained-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrainedModelsRequest",
}) as any as S.Schema<ListTrainedModelsRequest>;
export interface CancelTrainedModelRequest {
  membershipIdentifier: string;
  trainedModelArn: string;
  versionIdentifier?: string;
}
export const CancelTrainedModelRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTrainedModelRequest",
}) as any as S.Schema<CancelTrainedModelRequest>;
export interface CancelTrainedModelResponse {}
export const CancelTrainedModelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTrainedModelResponse",
}) as any as S.Schema<CancelTrainedModelResponse>;
export interface GetCollaborationTrainedModelRequest {
  trainedModelArn: string;
  collaborationIdentifier: string;
  versionIdentifier?: string;
}
export const GetCollaborationTrainedModelRequest = S.suspend(() =>
  S.Struct({
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    collaborationIdentifier: S.String.pipe(
      T.HttpLabel("collaborationIdentifier"),
    ),
    versionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("versionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/collaborations/{collaborationIdentifier}/trained-models/{trainedModelArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCollaborationTrainedModelRequest",
}) as any as S.Schema<GetCollaborationTrainedModelRequest>;
export interface ListTrainedModelVersionsRequest {
  nextToken?: string;
  maxResults?: number;
  membershipIdentifier: string;
  trainedModelArn: string;
  status?: TrainedModelStatus;
}
export const ListTrainedModelVersionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    status: S.optional(TrainedModelStatus).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}/versions",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrainedModelVersionsRequest",
}) as any as S.Schema<ListTrainedModelVersionsRequest>;
export interface GetTrainedModelInferenceJobRequest {
  membershipIdentifier: string;
  trainedModelInferenceJobArn: string;
}
export const GetTrainedModelInferenceJobRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelInferenceJobArn: S.String.pipe(
      T.HttpLabel("trainedModelInferenceJobArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs/{trainedModelInferenceJobArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrainedModelInferenceJobRequest",
}) as any as S.Schema<GetTrainedModelInferenceJobRequest>;
export interface ListTrainedModelInferenceJobsRequest {
  nextToken?: string;
  maxResults?: number;
  membershipIdentifier: string;
  trainedModelArn?: string;
  trainedModelVersionIdentifier?: string;
}
export const ListTrainedModelInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelArn: S.optional(S.String).pipe(T.HttpQuery("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("trainedModelVersionIdentifier"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrainedModelInferenceJobsRequest",
}) as any as S.Schema<ListTrainedModelInferenceJobsRequest>;
export interface CancelTrainedModelInferenceJobRequest {
  membershipIdentifier: string;
  trainedModelInferenceJobArn: string;
}
export const CancelTrainedModelInferenceJobRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    trainedModelInferenceJobArn: S.String.pipe(
      T.HttpLabel("trainedModelInferenceJobArn"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs/{trainedModelInferenceJobArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTrainedModelInferenceJobRequest",
}) as any as S.Schema<CancelTrainedModelInferenceJobRequest>;
export interface CancelTrainedModelInferenceJobResponse {}
export const CancelTrainedModelInferenceJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTrainedModelInferenceJobResponse",
}) as any as S.Schema<CancelTrainedModelInferenceJobResponse>;
export interface GetTrainingDatasetRequest {
  trainingDatasetArn: string;
}
export const GetTrainingDatasetRequest = S.suspend(() =>
  S.Struct({
    trainingDatasetArn: S.String.pipe(T.HttpLabel("trainingDatasetArn")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/training-dataset/{trainingDatasetArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTrainingDatasetRequest",
}) as any as S.Schema<GetTrainingDatasetRequest>;
export interface DeleteTrainingDatasetRequest {
  trainingDatasetArn: string;
}
export const DeleteTrainingDatasetRequest = S.suspend(() =>
  S.Struct({
    trainingDatasetArn: S.String.pipe(T.HttpLabel("trainingDatasetArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/training-dataset/{trainingDatasetArn}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTrainingDatasetRequest",
}) as any as S.Schema<DeleteTrainingDatasetRequest>;
export interface DeleteTrainingDatasetResponse {}
export const DeleteTrainingDatasetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTrainingDatasetResponse",
}) as any as S.Schema<DeleteTrainingDatasetResponse>;
export interface ListTrainingDatasetsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListTrainingDatasetsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/training-dataset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTrainingDatasetsRequest",
}) as any as S.Schema<ListTrainingDatasetsRequest>;
export type ContainerEntrypoint = string[];
export const ContainerEntrypoint = S.Array(S.String);
export type ContainerArguments = string[];
export const ContainerArguments = S.Array(S.String);
export type InstanceType =
  | "ml.m4.xlarge"
  | "ml.m4.2xlarge"
  | "ml.m4.4xlarge"
  | "ml.m4.10xlarge"
  | "ml.m4.16xlarge"
  | "ml.g4dn.xlarge"
  | "ml.g4dn.2xlarge"
  | "ml.g4dn.4xlarge"
  | "ml.g4dn.8xlarge"
  | "ml.g4dn.12xlarge"
  | "ml.g4dn.16xlarge"
  | "ml.m5.large"
  | "ml.m5.xlarge"
  | "ml.m5.2xlarge"
  | "ml.m5.4xlarge"
  | "ml.m5.12xlarge"
  | "ml.m5.24xlarge"
  | "ml.c4.xlarge"
  | "ml.c4.2xlarge"
  | "ml.c4.4xlarge"
  | "ml.c4.8xlarge"
  | "ml.p2.xlarge"
  | "ml.p2.8xlarge"
  | "ml.p2.16xlarge"
  | "ml.p4d.24xlarge"
  | "ml.p4de.24xlarge"
  | "ml.p5.48xlarge"
  | "ml.c5.xlarge"
  | "ml.c5.2xlarge"
  | "ml.c5.4xlarge"
  | "ml.c5.9xlarge"
  | "ml.c5.18xlarge"
  | "ml.c5n.xlarge"
  | "ml.c5n.2xlarge"
  | "ml.c5n.4xlarge"
  | "ml.c5n.9xlarge"
  | "ml.c5n.18xlarge"
  | "ml.g5.xlarge"
  | "ml.g5.2xlarge"
  | "ml.g5.4xlarge"
  | "ml.g5.8xlarge"
  | "ml.g5.16xlarge"
  | "ml.g5.12xlarge"
  | "ml.g5.24xlarge"
  | "ml.g5.48xlarge"
  | "ml.trn1.2xlarge"
  | "ml.trn1.32xlarge"
  | "ml.trn1n.32xlarge"
  | "ml.m6i.large"
  | "ml.m6i.xlarge"
  | "ml.m6i.2xlarge"
  | "ml.m6i.4xlarge"
  | "ml.m6i.8xlarge"
  | "ml.m6i.12xlarge"
  | "ml.m6i.16xlarge"
  | "ml.m6i.24xlarge"
  | "ml.m6i.32xlarge"
  | "ml.c6i.xlarge"
  | "ml.c6i.2xlarge"
  | "ml.c6i.8xlarge"
  | "ml.c6i.4xlarge"
  | "ml.c6i.12xlarge"
  | "ml.c6i.16xlarge"
  | "ml.c6i.24xlarge"
  | "ml.c6i.32xlarge"
  | "ml.r5d.large"
  | "ml.r5d.xlarge"
  | "ml.r5d.2xlarge"
  | "ml.r5d.4xlarge"
  | "ml.r5d.8xlarge"
  | "ml.r5d.12xlarge"
  | "ml.r5d.16xlarge"
  | "ml.r5d.24xlarge"
  | "ml.t3.medium"
  | "ml.t3.large"
  | "ml.t3.xlarge"
  | "ml.t3.2xlarge"
  | "ml.r5.large"
  | "ml.r5.xlarge"
  | "ml.r5.2xlarge"
  | "ml.r5.4xlarge"
  | "ml.r5.8xlarge"
  | "ml.r5.12xlarge"
  | "ml.r5.16xlarge"
  | "ml.r5.24xlarge"
  | "ml.c7i.large"
  | "ml.c7i.xlarge"
  | "ml.c7i.2xlarge"
  | "ml.c7i.4xlarge"
  | "ml.c7i.8xlarge"
  | "ml.c7i.12xlarge"
  | "ml.c7i.16xlarge"
  | "ml.c7i.24xlarge"
  | "ml.c7i.48xlarge"
  | "ml.m7i.large"
  | "ml.m7i.xlarge"
  | "ml.m7i.2xlarge"
  | "ml.m7i.4xlarge"
  | "ml.m7i.8xlarge"
  | "ml.m7i.12xlarge"
  | "ml.m7i.16xlarge"
  | "ml.m7i.24xlarge"
  | "ml.m7i.48xlarge"
  | "ml.r7i.large"
  | "ml.r7i.xlarge"
  | "ml.r7i.2xlarge"
  | "ml.r7i.4xlarge"
  | "ml.r7i.8xlarge"
  | "ml.r7i.12xlarge"
  | "ml.r7i.16xlarge"
  | "ml.r7i.24xlarge"
  | "ml.r7i.48xlarge"
  | "ml.g6.xlarge"
  | "ml.g6.2xlarge"
  | "ml.g6.4xlarge"
  | "ml.g6.8xlarge"
  | "ml.g6.12xlarge"
  | "ml.g6.16xlarge"
  | "ml.g6.24xlarge"
  | "ml.g6.48xlarge"
  | "ml.g6e.xlarge"
  | "ml.g6e.2xlarge"
  | "ml.g6e.4xlarge"
  | "ml.g6e.8xlarge"
  | "ml.g6e.12xlarge"
  | "ml.g6e.16xlarge"
  | "ml.g6e.24xlarge"
  | "ml.g6e.48xlarge"
  | "ml.p5en.48xlarge"
  | "ml.p3.2xlarge"
  | "ml.p3.8xlarge"
  | "ml.p3.16xlarge"
  | "ml.p3dn.24xlarge";
export const InstanceType = S.Literal(
  "ml.m4.xlarge",
  "ml.m4.2xlarge",
  "ml.m4.4xlarge",
  "ml.m4.10xlarge",
  "ml.m4.16xlarge",
  "ml.g4dn.xlarge",
  "ml.g4dn.2xlarge",
  "ml.g4dn.4xlarge",
  "ml.g4dn.8xlarge",
  "ml.g4dn.12xlarge",
  "ml.g4dn.16xlarge",
  "ml.m5.large",
  "ml.m5.xlarge",
  "ml.m5.2xlarge",
  "ml.m5.4xlarge",
  "ml.m5.12xlarge",
  "ml.m5.24xlarge",
  "ml.c4.xlarge",
  "ml.c4.2xlarge",
  "ml.c4.4xlarge",
  "ml.c4.8xlarge",
  "ml.p2.xlarge",
  "ml.p2.8xlarge",
  "ml.p2.16xlarge",
  "ml.p4d.24xlarge",
  "ml.p4de.24xlarge",
  "ml.p5.48xlarge",
  "ml.c5.xlarge",
  "ml.c5.2xlarge",
  "ml.c5.4xlarge",
  "ml.c5.9xlarge",
  "ml.c5.18xlarge",
  "ml.c5n.xlarge",
  "ml.c5n.2xlarge",
  "ml.c5n.4xlarge",
  "ml.c5n.9xlarge",
  "ml.c5n.18xlarge",
  "ml.g5.xlarge",
  "ml.g5.2xlarge",
  "ml.g5.4xlarge",
  "ml.g5.8xlarge",
  "ml.g5.16xlarge",
  "ml.g5.12xlarge",
  "ml.g5.24xlarge",
  "ml.g5.48xlarge",
  "ml.trn1.2xlarge",
  "ml.trn1.32xlarge",
  "ml.trn1n.32xlarge",
  "ml.m6i.large",
  "ml.m6i.xlarge",
  "ml.m6i.2xlarge",
  "ml.m6i.4xlarge",
  "ml.m6i.8xlarge",
  "ml.m6i.12xlarge",
  "ml.m6i.16xlarge",
  "ml.m6i.24xlarge",
  "ml.m6i.32xlarge",
  "ml.c6i.xlarge",
  "ml.c6i.2xlarge",
  "ml.c6i.8xlarge",
  "ml.c6i.4xlarge",
  "ml.c6i.12xlarge",
  "ml.c6i.16xlarge",
  "ml.c6i.24xlarge",
  "ml.c6i.32xlarge",
  "ml.r5d.large",
  "ml.r5d.xlarge",
  "ml.r5d.2xlarge",
  "ml.r5d.4xlarge",
  "ml.r5d.8xlarge",
  "ml.r5d.12xlarge",
  "ml.r5d.16xlarge",
  "ml.r5d.24xlarge",
  "ml.t3.medium",
  "ml.t3.large",
  "ml.t3.xlarge",
  "ml.t3.2xlarge",
  "ml.r5.large",
  "ml.r5.xlarge",
  "ml.r5.2xlarge",
  "ml.r5.4xlarge",
  "ml.r5.8xlarge",
  "ml.r5.12xlarge",
  "ml.r5.16xlarge",
  "ml.r5.24xlarge",
  "ml.c7i.large",
  "ml.c7i.xlarge",
  "ml.c7i.2xlarge",
  "ml.c7i.4xlarge",
  "ml.c7i.8xlarge",
  "ml.c7i.12xlarge",
  "ml.c7i.16xlarge",
  "ml.c7i.24xlarge",
  "ml.c7i.48xlarge",
  "ml.m7i.large",
  "ml.m7i.xlarge",
  "ml.m7i.2xlarge",
  "ml.m7i.4xlarge",
  "ml.m7i.8xlarge",
  "ml.m7i.12xlarge",
  "ml.m7i.16xlarge",
  "ml.m7i.24xlarge",
  "ml.m7i.48xlarge",
  "ml.r7i.large",
  "ml.r7i.xlarge",
  "ml.r7i.2xlarge",
  "ml.r7i.4xlarge",
  "ml.r7i.8xlarge",
  "ml.r7i.12xlarge",
  "ml.r7i.16xlarge",
  "ml.r7i.24xlarge",
  "ml.r7i.48xlarge",
  "ml.g6.xlarge",
  "ml.g6.2xlarge",
  "ml.g6.4xlarge",
  "ml.g6.8xlarge",
  "ml.g6.12xlarge",
  "ml.g6.16xlarge",
  "ml.g6.24xlarge",
  "ml.g6.48xlarge",
  "ml.g6e.xlarge",
  "ml.g6e.2xlarge",
  "ml.g6e.4xlarge",
  "ml.g6e.8xlarge",
  "ml.g6e.12xlarge",
  "ml.g6e.16xlarge",
  "ml.g6e.24xlarge",
  "ml.g6e.48xlarge",
  "ml.p5en.48xlarge",
  "ml.p3.2xlarge",
  "ml.p3.8xlarge",
  "ml.p3.16xlarge",
  "ml.p3dn.24xlarge",
);
export type S3DataDistributionType = "FullyReplicated" | "ShardedByS3Key";
export const S3DataDistributionType = S.Literal(
  "FullyReplicated",
  "ShardedByS3Key",
);
export type InferenceInstanceType =
  | "ml.r7i.48xlarge"
  | "ml.r6i.16xlarge"
  | "ml.m6i.xlarge"
  | "ml.m5.4xlarge"
  | "ml.p2.xlarge"
  | "ml.m4.16xlarge"
  | "ml.r7i.16xlarge"
  | "ml.m7i.xlarge"
  | "ml.m6i.12xlarge"
  | "ml.r7i.8xlarge"
  | "ml.r7i.large"
  | "ml.m7i.12xlarge"
  | "ml.m6i.24xlarge"
  | "ml.m7i.24xlarge"
  | "ml.r6i.8xlarge"
  | "ml.r6i.large"
  | "ml.g5.2xlarge"
  | "ml.m5.large"
  | "ml.m7i.48xlarge"
  | "ml.m6i.16xlarge"
  | "ml.p2.16xlarge"
  | "ml.g5.4xlarge"
  | "ml.m7i.16xlarge"
  | "ml.c4.2xlarge"
  | "ml.c5.2xlarge"
  | "ml.c6i.32xlarge"
  | "ml.c4.4xlarge"
  | "ml.g5.8xlarge"
  | "ml.c6i.xlarge"
  | "ml.c5.4xlarge"
  | "ml.g4dn.xlarge"
  | "ml.c7i.xlarge"
  | "ml.c6i.12xlarge"
  | "ml.g4dn.12xlarge"
  | "ml.c7i.12xlarge"
  | "ml.c6i.24xlarge"
  | "ml.g4dn.2xlarge"
  | "ml.c7i.24xlarge"
  | "ml.c7i.2xlarge"
  | "ml.c4.8xlarge"
  | "ml.c6i.2xlarge"
  | "ml.g4dn.4xlarge"
  | "ml.c7i.48xlarge"
  | "ml.c7i.4xlarge"
  | "ml.c6i.16xlarge"
  | "ml.c5.9xlarge"
  | "ml.g4dn.16xlarge"
  | "ml.c7i.16xlarge"
  | "ml.c6i.4xlarge"
  | "ml.c5.xlarge"
  | "ml.c4.xlarge"
  | "ml.g4dn.8xlarge"
  | "ml.c7i.8xlarge"
  | "ml.c7i.large"
  | "ml.g5.xlarge"
  | "ml.c6i.8xlarge"
  | "ml.c6i.large"
  | "ml.g5.12xlarge"
  | "ml.g5.24xlarge"
  | "ml.m7i.2xlarge"
  | "ml.c5.18xlarge"
  | "ml.g5.48xlarge"
  | "ml.m6i.2xlarge"
  | "ml.g5.16xlarge"
  | "ml.m7i.4xlarge"
  | "ml.r6i.32xlarge"
  | "ml.m6i.4xlarge"
  | "ml.m5.xlarge"
  | "ml.m4.10xlarge"
  | "ml.r6i.xlarge"
  | "ml.m5.12xlarge"
  | "ml.m4.xlarge"
  | "ml.r7i.2xlarge"
  | "ml.r7i.xlarge"
  | "ml.r6i.12xlarge"
  | "ml.m5.24xlarge"
  | "ml.r7i.12xlarge"
  | "ml.m7i.8xlarge"
  | "ml.m7i.large"
  | "ml.r6i.24xlarge"
  | "ml.r6i.2xlarge"
  | "ml.m4.2xlarge"
  | "ml.r7i.24xlarge"
  | "ml.r7i.4xlarge"
  | "ml.m6i.8xlarge"
  | "ml.m6i.large"
  | "ml.m5.2xlarge"
  | "ml.p2.8xlarge"
  | "ml.r6i.4xlarge"
  | "ml.m6i.32xlarge"
  | "ml.m4.4xlarge"
  | "ml.p3.16xlarge"
  | "ml.p3.2xlarge"
  | "ml.p3.8xlarge";
export const InferenceInstanceType = S.Literal(
  "ml.r7i.48xlarge",
  "ml.r6i.16xlarge",
  "ml.m6i.xlarge",
  "ml.m5.4xlarge",
  "ml.p2.xlarge",
  "ml.m4.16xlarge",
  "ml.r7i.16xlarge",
  "ml.m7i.xlarge",
  "ml.m6i.12xlarge",
  "ml.r7i.8xlarge",
  "ml.r7i.large",
  "ml.m7i.12xlarge",
  "ml.m6i.24xlarge",
  "ml.m7i.24xlarge",
  "ml.r6i.8xlarge",
  "ml.r6i.large",
  "ml.g5.2xlarge",
  "ml.m5.large",
  "ml.m7i.48xlarge",
  "ml.m6i.16xlarge",
  "ml.p2.16xlarge",
  "ml.g5.4xlarge",
  "ml.m7i.16xlarge",
  "ml.c4.2xlarge",
  "ml.c5.2xlarge",
  "ml.c6i.32xlarge",
  "ml.c4.4xlarge",
  "ml.g5.8xlarge",
  "ml.c6i.xlarge",
  "ml.c5.4xlarge",
  "ml.g4dn.xlarge",
  "ml.c7i.xlarge",
  "ml.c6i.12xlarge",
  "ml.g4dn.12xlarge",
  "ml.c7i.12xlarge",
  "ml.c6i.24xlarge",
  "ml.g4dn.2xlarge",
  "ml.c7i.24xlarge",
  "ml.c7i.2xlarge",
  "ml.c4.8xlarge",
  "ml.c6i.2xlarge",
  "ml.g4dn.4xlarge",
  "ml.c7i.48xlarge",
  "ml.c7i.4xlarge",
  "ml.c6i.16xlarge",
  "ml.c5.9xlarge",
  "ml.g4dn.16xlarge",
  "ml.c7i.16xlarge",
  "ml.c6i.4xlarge",
  "ml.c5.xlarge",
  "ml.c4.xlarge",
  "ml.g4dn.8xlarge",
  "ml.c7i.8xlarge",
  "ml.c7i.large",
  "ml.g5.xlarge",
  "ml.c6i.8xlarge",
  "ml.c6i.large",
  "ml.g5.12xlarge",
  "ml.g5.24xlarge",
  "ml.m7i.2xlarge",
  "ml.c5.18xlarge",
  "ml.g5.48xlarge",
  "ml.m6i.2xlarge",
  "ml.g5.16xlarge",
  "ml.m7i.4xlarge",
  "ml.r6i.32xlarge",
  "ml.m6i.4xlarge",
  "ml.m5.xlarge",
  "ml.m4.10xlarge",
  "ml.r6i.xlarge",
  "ml.m5.12xlarge",
  "ml.m4.xlarge",
  "ml.r7i.2xlarge",
  "ml.r7i.xlarge",
  "ml.r6i.12xlarge",
  "ml.m5.24xlarge",
  "ml.r7i.12xlarge",
  "ml.m7i.8xlarge",
  "ml.m7i.large",
  "ml.r6i.24xlarge",
  "ml.r6i.2xlarge",
  "ml.m4.2xlarge",
  "ml.r7i.24xlarge",
  "ml.r7i.4xlarge",
  "ml.m6i.8xlarge",
  "ml.m6i.large",
  "ml.m5.2xlarge",
  "ml.p2.8xlarge",
  "ml.r6i.4xlarge",
  "ml.m6i.32xlarge",
  "ml.m4.4xlarge",
  "ml.p3.16xlarge",
  "ml.p3.2xlarge",
  "ml.p3.8xlarge",
);
export type DatasetType = "INTERACTIONS";
export const DatasetType = S.Literal("INTERACTIONS");
export interface AudienceSize {
  type: AudienceSizeType;
  value: number;
}
export const AudienceSize = S.suspend(() =>
  S.Struct({ type: AudienceSizeType, value: S.Number }),
).annotations({ identifier: "AudienceSize" }) as any as S.Schema<AudienceSize>;
export type AudienceGenerationJobStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETE_PENDING"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED";
export const AudienceGenerationJobStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETE_PENDING",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
);
export type AudienceModelStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETE_PENDING"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED";
export const AudienceModelStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETE_PENDING",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
);
export type ConfiguredAudienceModelStatus = "ACTIVE";
export const ConfiguredAudienceModelStatus = S.Literal("ACTIVE");
export interface InferenceContainerConfig {
  imageUri: string;
}
export const InferenceContainerConfig = S.suspend(() =>
  S.Struct({ imageUri: S.String }),
).annotations({
  identifier: "InferenceContainerConfig",
}) as any as S.Schema<InferenceContainerConfig>;
export type MLInputChannelStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "DELETE_PENDING"
  | "DELETE_IN_PROGRESS"
  | "DELETE_FAILED"
  | "INACTIVE";
export const MLInputChannelStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
  "DELETE_PENDING",
  "DELETE_IN_PROGRESS",
  "DELETE_FAILED",
  "INACTIVE",
);
export type HyperParameters = { [key: string]: string };
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export type Environment = { [key: string]: string };
export const Environment = S.Record({ key: S.String, value: S.String });
export interface ResourceConfig {
  instanceCount?: number;
  instanceType: InstanceType;
  volumeSizeInGB: number;
}
export const ResourceConfig = S.suspend(() =>
  S.Struct({
    instanceCount: S.optional(S.Number),
    instanceType: InstanceType,
    volumeSizeInGB: S.Number,
  }),
).annotations({
  identifier: "ResourceConfig",
}) as any as S.Schema<ResourceConfig>;
export interface StoppingCondition {
  maxRuntimeInSeconds?: number;
}
export const StoppingCondition = S.suspend(() =>
  S.Struct({ maxRuntimeInSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "StoppingCondition",
}) as any as S.Schema<StoppingCondition>;
export interface IncrementalTrainingDataChannel {
  trainedModelArn: string;
  versionIdentifier?: string;
  channelName: string;
}
export const IncrementalTrainingDataChannel = S.suspend(() =>
  S.Struct({
    trainedModelArn: S.String,
    versionIdentifier: S.optional(S.String),
    channelName: S.String,
  }),
).annotations({
  identifier: "IncrementalTrainingDataChannel",
}) as any as S.Schema<IncrementalTrainingDataChannel>;
export type IncrementalTrainingDataChannels = IncrementalTrainingDataChannel[];
export const IncrementalTrainingDataChannels = S.Array(
  IncrementalTrainingDataChannel,
);
export interface ModelTrainingDataChannel {
  mlInputChannelArn: string;
  channelName: string;
  s3DataDistributionType?: S3DataDistributionType;
}
export const ModelTrainingDataChannel = S.suspend(() =>
  S.Struct({
    mlInputChannelArn: S.String,
    channelName: S.String,
    s3DataDistributionType: S.optional(S3DataDistributionType),
  }),
).annotations({
  identifier: "ModelTrainingDataChannel",
}) as any as S.Schema<ModelTrainingDataChannel>;
export type ModelTrainingDataChannels = ModelTrainingDataChannel[];
export const ModelTrainingDataChannels = S.Array(ModelTrainingDataChannel);
export type MetricsStatus = "PUBLISH_SUCCEEDED" | "PUBLISH_FAILED";
export const MetricsStatus = S.Literal("PUBLISH_SUCCEEDED", "PUBLISH_FAILED");
export type LogsStatus = "PUBLISH_SUCCEEDED" | "PUBLISH_FAILED";
export const LogsStatus = S.Literal("PUBLISH_SUCCEEDED", "PUBLISH_FAILED");
export interface InferenceResourceConfig {
  instanceType: InferenceInstanceType;
  instanceCount?: number;
}
export const InferenceResourceConfig = S.suspend(() =>
  S.Struct({
    instanceType: InferenceInstanceType,
    instanceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "InferenceResourceConfig",
}) as any as S.Schema<InferenceResourceConfig>;
export interface ModelInferenceDataSource {
  mlInputChannelArn: string;
}
export const ModelInferenceDataSource = S.suspend(() =>
  S.Struct({ mlInputChannelArn: S.String }),
).annotations({
  identifier: "ModelInferenceDataSource",
}) as any as S.Schema<ModelInferenceDataSource>;
export interface InferenceContainerExecutionParameters {
  maxPayloadInMB?: number;
}
export const InferenceContainerExecutionParameters = S.suspend(() =>
  S.Struct({ maxPayloadInMB: S.optional(S.Number) }),
).annotations({
  identifier: "InferenceContainerExecutionParameters",
}) as any as S.Schema<InferenceContainerExecutionParameters>;
export type InferenceEnvironmentMap = { [key: string]: string };
export const InferenceEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export type TrainedModelInferenceJobStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE"
  | "CANCEL_PENDING"
  | "CANCEL_IN_PROGRESS"
  | "CANCEL_FAILED"
  | "INACTIVE";
export const TrainedModelInferenceJobStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
  "CANCEL_PENDING",
  "CANCEL_IN_PROGRESS",
  "CANCEL_FAILED",
  "INACTIVE",
);
export type TrainingDatasetStatus = "ACTIVE";
export const TrainingDatasetStatus = S.Literal("ACTIVE");
export interface ListTagsForResourceResponse {
  tags: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagMap }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
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
export interface StartAudienceExportJobRequest {
  name: string;
  audienceGenerationJobArn: string;
  audienceSize: AudienceSize;
  description?: string;
}
export const StartAudienceExportJobRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    audienceGenerationJobArn: S.String,
    audienceSize: AudienceSize,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audience-export-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAudienceExportJobRequest",
}) as any as S.Schema<StartAudienceExportJobRequest>;
export interface StartAudienceExportJobResponse {}
export const StartAudienceExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartAudienceExportJobResponse",
}) as any as S.Schema<StartAudienceExportJobResponse>;
export interface CreateAudienceModelResponse {
  audienceModelArn: string;
}
export const CreateAudienceModelResponse = S.suspend(() =>
  S.Struct({ audienceModelArn: S.String }),
).annotations({
  identifier: "CreateAudienceModelResponse",
}) as any as S.Schema<CreateAudienceModelResponse>;
export interface StatusDetails {
  statusCode?: string;
  message?: string;
}
export const StatusDetails = S.suspend(() =>
  S.Struct({ statusCode: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "StatusDetails",
}) as any as S.Schema<StatusDetails>;
export interface GetAudienceModelResponse {
  createTime: Date;
  updateTime: Date;
  trainingDataStartTime?: Date;
  trainingDataEndTime?: Date;
  audienceModelArn: string;
  name: string;
  trainingDatasetArn: string;
  status: AudienceModelStatus;
  statusDetails?: StatusDetails;
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
  description?: string;
}
export const GetAudienceModelResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    trainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    audienceModelArn: S.String,
    name: S.String,
    trainingDatasetArn: S.String,
    status: AudienceModelStatus,
    statusDetails: S.optional(StatusDetails),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAudienceModelResponse",
}) as any as S.Schema<GetAudienceModelResponse>;
export interface GetConfiguredAudienceModelResponse {
  createTime: Date;
  updateTime: Date;
  configuredAudienceModelArn: string;
  name: string;
  audienceModelArn: string;
  outputConfig: ConfiguredAudienceModelOutputConfig;
  description?: string;
  status: ConfiguredAudienceModelStatus;
  sharedAudienceMetrics: SharedAudienceMetrics[];
  minMatchingSeedSize?: number;
  audienceSizeConfig?: AudienceSizeConfig;
  tags?: { [key: string]: string };
  childResourceTagOnCreatePolicy?: TagOnCreatePolicy;
}
export const GetConfiguredAudienceModelResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    configuredAudienceModelArn: S.String,
    name: S.String,
    audienceModelArn: S.String,
    outputConfig: ConfiguredAudienceModelOutputConfig,
    description: S.optional(S.String),
    status: ConfiguredAudienceModelStatus,
    sharedAudienceMetrics: MetricsList,
    minMatchingSeedSize: S.optional(S.Number),
    audienceSizeConfig: S.optional(AudienceSizeConfig),
    tags: S.optional(TagMap),
    childResourceTagOnCreatePolicy: S.optional(TagOnCreatePolicy),
  }),
).annotations({
  identifier: "GetConfiguredAudienceModelResponse",
}) as any as S.Schema<GetConfiguredAudienceModelResponse>;
export interface UpdateConfiguredAudienceModelResponse {
  configuredAudienceModelArn: string;
}
export const UpdateConfiguredAudienceModelResponse = S.suspend(() =>
  S.Struct({ configuredAudienceModelArn: S.String }),
).annotations({
  identifier: "UpdateConfiguredAudienceModelResponse",
}) as any as S.Schema<UpdateConfiguredAudienceModelResponse>;
export interface PutConfiguredAudienceModelPolicyResponse {
  configuredAudienceModelPolicy: string;
  policyHash: string;
}
export const PutConfiguredAudienceModelPolicyResponse = S.suspend(() =>
  S.Struct({ configuredAudienceModelPolicy: S.String, policyHash: S.String }),
).annotations({
  identifier: "PutConfiguredAudienceModelPolicyResponse",
}) as any as S.Schema<PutConfiguredAudienceModelPolicyResponse>;
export interface GetConfiguredAudienceModelPolicyResponse {
  configuredAudienceModelArn: string;
  configuredAudienceModelPolicy: string;
  policyHash: string;
}
export const GetConfiguredAudienceModelPolicyResponse = S.suspend(() =>
  S.Struct({
    configuredAudienceModelArn: S.String,
    configuredAudienceModelPolicy: S.String,
    policyHash: S.String,
  }),
).annotations({
  identifier: "GetConfiguredAudienceModelPolicyResponse",
}) as any as S.Schema<GetConfiguredAudienceModelPolicyResponse>;
export interface MetricDefinition {
  name: string;
  regex: string;
}
export const MetricDefinition = S.suspend(() =>
  S.Struct({ name: S.String, regex: S.String }),
).annotations({
  identifier: "MetricDefinition",
}) as any as S.Schema<MetricDefinition>;
export type MetricDefinitionList = MetricDefinition[];
export const MetricDefinitionList = S.Array(MetricDefinition);
export interface ContainerConfig {
  imageUri: string;
  entrypoint?: string[];
  arguments?: string[];
  metricDefinitions?: MetricDefinition[];
}
export const ContainerConfig = S.suspend(() =>
  S.Struct({
    imageUri: S.String,
    entrypoint: S.optional(ContainerEntrypoint),
    arguments: S.optional(ContainerArguments),
    metricDefinitions: S.optional(MetricDefinitionList),
  }),
).annotations({
  identifier: "ContainerConfig",
}) as any as S.Schema<ContainerConfig>;
export interface GetConfiguredModelAlgorithmResponse {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmArn: string;
  name: string;
  trainingContainerConfig?: ContainerConfig;
  inferenceContainerConfig?: InferenceContainerConfig;
  roleArn: string;
  description?: string;
  tags?: { [key: string]: string };
  kmsKeyArn?: string;
}
export const GetConfiguredModelAlgorithmResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    trainingContainerConfig: S.optional(ContainerConfig),
    inferenceContainerConfig: S.optional(InferenceContainerConfig),
    roleArn: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConfiguredModelAlgorithmResponse",
}) as any as S.Schema<GetConfiguredModelAlgorithmResponse>;
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type LogType = "ALL" | "ERROR_SUMMARY";
export const LogType = S.Literal("ALL", "ERROR_SUMMARY");
export type EntityType =
  | "ALL_PERSONALLY_IDENTIFIABLE_INFORMATION"
  | "NUMBERS"
  | "CUSTOM";
export const EntityType = S.Literal(
  "ALL_PERSONALLY_IDENTIFIABLE_INFORMATION",
  "NUMBERS",
  "CUSTOM",
);
export type EntityTypeList = EntityType[];
export const EntityTypeList = S.Array(EntityType);
export type CustomDataIdentifierList = string[];
export const CustomDataIdentifierList = S.Array(S.String);
export interface CustomEntityConfig {
  customDataIdentifiers: string[];
}
export const CustomEntityConfig = S.suspend(() =>
  S.Struct({ customDataIdentifiers: CustomDataIdentifierList }),
).annotations({
  identifier: "CustomEntityConfig",
}) as any as S.Schema<CustomEntityConfig>;
export interface LogRedactionConfiguration {
  entitiesToRedact: EntityType[];
  customEntityConfig?: CustomEntityConfig;
}
export const LogRedactionConfiguration = S.suspend(() =>
  S.Struct({
    entitiesToRedact: EntityTypeList,
    customEntityConfig: S.optional(CustomEntityConfig),
  }),
).annotations({
  identifier: "LogRedactionConfiguration",
}) as any as S.Schema<LogRedactionConfiguration>;
export interface LogsConfigurationPolicy {
  allowedAccountIds: string[];
  filterPattern?: string;
  logType?: LogType;
  logRedactionConfiguration?: LogRedactionConfiguration;
}
export const LogsConfigurationPolicy = S.suspend(() =>
  S.Struct({
    allowedAccountIds: AccountIdList,
    filterPattern: S.optional(S.String),
    logType: S.optional(LogType),
    logRedactionConfiguration: S.optional(LogRedactionConfiguration),
  }),
).annotations({
  identifier: "LogsConfigurationPolicy",
}) as any as S.Schema<LogsConfigurationPolicy>;
export type LogsConfigurationPolicyList = LogsConfigurationPolicy[];
export const LogsConfigurationPolicyList = S.Array(LogsConfigurationPolicy);
export type NoiseLevelType = "HIGH" | "MEDIUM" | "LOW" | "NONE";
export const NoiseLevelType = S.Literal("HIGH", "MEDIUM", "LOW", "NONE");
export interface MetricsConfigurationPolicy {
  noiseLevel: NoiseLevelType;
}
export const MetricsConfigurationPolicy = S.suspend(() =>
  S.Struct({ noiseLevel: NoiseLevelType }),
).annotations({
  identifier: "MetricsConfigurationPolicy",
}) as any as S.Schema<MetricsConfigurationPolicy>;
export type TrainedModelArtifactMaxSizeUnitType = "GB";
export const TrainedModelArtifactMaxSizeUnitType = S.Literal("GB");
export interface TrainedModelArtifactMaxSize {
  unit: TrainedModelArtifactMaxSizeUnitType;
  value: number;
}
export const TrainedModelArtifactMaxSize = S.suspend(() =>
  S.Struct({ unit: TrainedModelArtifactMaxSizeUnitType, value: S.Number }),
).annotations({
  identifier: "TrainedModelArtifactMaxSize",
}) as any as S.Schema<TrainedModelArtifactMaxSize>;
export interface TrainedModelsConfigurationPolicy {
  containerLogs?: LogsConfigurationPolicy[];
  containerMetrics?: MetricsConfigurationPolicy;
  maxArtifactSize?: TrainedModelArtifactMaxSize;
}
export const TrainedModelsConfigurationPolicy = S.suspend(() =>
  S.Struct({
    containerLogs: S.optional(LogsConfigurationPolicyList),
    containerMetrics: S.optional(MetricsConfigurationPolicy),
    maxArtifactSize: S.optional(TrainedModelArtifactMaxSize),
  }),
).annotations({
  identifier: "TrainedModelsConfigurationPolicy",
}) as any as S.Schema<TrainedModelsConfigurationPolicy>;
export type TrainedModelExportsMaxSizeUnitType = "GB";
export const TrainedModelExportsMaxSizeUnitType = S.Literal("GB");
export interface TrainedModelExportsMaxSize {
  unit: TrainedModelExportsMaxSizeUnitType;
  value: number;
}
export const TrainedModelExportsMaxSize = S.suspend(() =>
  S.Struct({ unit: TrainedModelExportsMaxSizeUnitType, value: S.Number }),
).annotations({
  identifier: "TrainedModelExportsMaxSize",
}) as any as S.Schema<TrainedModelExportsMaxSize>;
export type TrainedModelExportFileType = "MODEL" | "OUTPUT";
export const TrainedModelExportFileType = S.Literal("MODEL", "OUTPUT");
export type TrainedModelExportFileTypeList = TrainedModelExportFileType[];
export const TrainedModelExportFileTypeList = S.Array(
  TrainedModelExportFileType,
);
export interface TrainedModelExportsConfigurationPolicy {
  maxSize: TrainedModelExportsMaxSize;
  filesToExport: TrainedModelExportFileType[];
}
export const TrainedModelExportsConfigurationPolicy = S.suspend(() =>
  S.Struct({
    maxSize: TrainedModelExportsMaxSize,
    filesToExport: TrainedModelExportFileTypeList,
  }),
).annotations({
  identifier: "TrainedModelExportsConfigurationPolicy",
}) as any as S.Schema<TrainedModelExportsConfigurationPolicy>;
export type TrainedModelInferenceMaxOutputSizeUnitType = "GB";
export const TrainedModelInferenceMaxOutputSizeUnitType = S.Literal("GB");
export interface TrainedModelInferenceMaxOutputSize {
  unit: TrainedModelInferenceMaxOutputSizeUnitType;
  value: number;
}
export const TrainedModelInferenceMaxOutputSize = S.suspend(() =>
  S.Struct({
    unit: TrainedModelInferenceMaxOutputSizeUnitType,
    value: S.Number,
  }),
).annotations({
  identifier: "TrainedModelInferenceMaxOutputSize",
}) as any as S.Schema<TrainedModelInferenceMaxOutputSize>;
export interface TrainedModelInferenceJobsConfigurationPolicy {
  containerLogs?: LogsConfigurationPolicy[];
  maxOutputSize?: TrainedModelInferenceMaxOutputSize;
}
export const TrainedModelInferenceJobsConfigurationPolicy = S.suspend(() =>
  S.Struct({
    containerLogs: S.optional(LogsConfigurationPolicyList),
    maxOutputSize: S.optional(TrainedModelInferenceMaxOutputSize),
  }),
).annotations({
  identifier: "TrainedModelInferenceJobsConfigurationPolicy",
}) as any as S.Schema<TrainedModelInferenceJobsConfigurationPolicy>;
export interface PrivacyConfigurationPolicies {
  trainedModels?: TrainedModelsConfigurationPolicy;
  trainedModelExports?: TrainedModelExportsConfigurationPolicy;
  trainedModelInferenceJobs?: TrainedModelInferenceJobsConfigurationPolicy;
}
export const PrivacyConfigurationPolicies = S.suspend(() =>
  S.Struct({
    trainedModels: S.optional(TrainedModelsConfigurationPolicy),
    trainedModelExports: S.optional(TrainedModelExportsConfigurationPolicy),
    trainedModelInferenceJobs: S.optional(
      TrainedModelInferenceJobsConfigurationPolicy,
    ),
  }),
).annotations({
  identifier: "PrivacyConfigurationPolicies",
}) as any as S.Schema<PrivacyConfigurationPolicies>;
export interface PrivacyConfiguration {
  policies: PrivacyConfigurationPolicies;
}
export const PrivacyConfiguration = S.suspend(() =>
  S.Struct({ policies: PrivacyConfigurationPolicies }),
).annotations({
  identifier: "PrivacyConfiguration",
}) as any as S.Schema<PrivacyConfiguration>;
export interface GetConfiguredModelAlgorithmAssociationResponse {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmAssociationArn: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  configuredModelAlgorithmArn: string;
  name: string;
  privacyConfiguration?: PrivacyConfiguration;
  description?: string;
  tags?: { [key: string]: string };
}
export const GetConfiguredModelAlgorithmAssociationResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    configuredModelAlgorithmAssociationArn: S.String,
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    privacyConfiguration: S.optional(PrivacyConfiguration),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetConfiguredModelAlgorithmAssociationResponse",
}) as any as S.Schema<GetConfiguredModelAlgorithmAssociationResponse>;
export interface GetCollaborationConfiguredModelAlgorithmAssociationResponse {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmAssociationArn: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  configuredModelAlgorithmArn: string;
  name: string;
  description?: string;
  creatorAccountId: string;
  privacyConfiguration?: PrivacyConfiguration;
}
export const GetCollaborationConfiguredModelAlgorithmAssociationResponse =
  S.suspend(() =>
    S.Struct({
      createTime: S.Date.pipe(T.TimestampFormat("date-time")),
      updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
      configuredModelAlgorithmAssociationArn: S.String,
      membershipIdentifier: S.String,
      collaborationIdentifier: S.String,
      configuredModelAlgorithmArn: S.String,
      name: S.String,
      description: S.optional(S.String),
      creatorAccountId: S.String,
      privacyConfiguration: S.optional(PrivacyConfiguration),
    }),
  ).annotations({
    identifier: "GetCollaborationConfiguredModelAlgorithmAssociationResponse",
  }) as any as S.Schema<GetCollaborationConfiguredModelAlgorithmAssociationResponse>;
export interface Destination {
  s3Destination: S3ConfigMap;
}
export const Destination = S.suspend(() =>
  S.Struct({ s3Destination: S3ConfigMap }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export interface MLOutputConfiguration {
  destination?: Destination;
  roleArn: string;
}
export const MLOutputConfiguration = S.suspend(() =>
  S.Struct({ destination: S.optional(Destination), roleArn: S.String }),
).annotations({
  identifier: "MLOutputConfiguration",
}) as any as S.Schema<MLOutputConfiguration>;
export interface GetMLConfigurationResponse {
  membershipIdentifier: string;
  defaultOutputLocation: MLOutputConfiguration;
  createTime: Date;
  updateTime: Date;
}
export const GetMLConfigurationResponse = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    defaultOutputLocation: MLOutputConfiguration,
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "GetMLConfigurationResponse",
}) as any as S.Schema<GetMLConfigurationResponse>;
export type AccessBudgetType =
  | "CALENDAR_DAY"
  | "CALENDAR_MONTH"
  | "CALENDAR_WEEK"
  | "LIFETIME";
export const AccessBudgetType = S.Literal(
  "CALENDAR_DAY",
  "CALENDAR_MONTH",
  "CALENDAR_WEEK",
  "LIFETIME",
);
export type AutoRefreshMode = "ENABLED" | "DISABLED";
export const AutoRefreshMode = S.Literal("ENABLED", "DISABLED");
export interface AccessBudgetDetails {
  startTime: Date;
  endTime?: Date;
  remainingBudget: number;
  budget: number;
  budgetType: AccessBudgetType;
  autoRefresh?: AutoRefreshMode;
}
export const AccessBudgetDetails = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    remainingBudget: S.Number,
    budget: S.Number,
    budgetType: AccessBudgetType,
    autoRefresh: S.optional(AutoRefreshMode),
  }),
).annotations({
  identifier: "AccessBudgetDetails",
}) as any as S.Schema<AccessBudgetDetails>;
export type AccessBudgetDetailsList = AccessBudgetDetails[];
export const AccessBudgetDetailsList = S.Array(AccessBudgetDetails);
export interface AccessBudget {
  resourceArn: string;
  details: AccessBudgetDetails[];
  aggregateRemainingBudget: number;
}
export const AccessBudget = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    details: AccessBudgetDetailsList,
    aggregateRemainingBudget: S.Number,
  }),
).annotations({ identifier: "AccessBudget" }) as any as S.Schema<AccessBudget>;
export type AccessBudgets = AccessBudget[];
export const AccessBudgets = S.Array(AccessBudget);
export type PrivacyBudgets = { accessBudgets: AccessBudget[] };
export const PrivacyBudgets = S.Union(
  S.Struct({ accessBudgets: AccessBudgets }),
);
export type SyntheticDataColumnType = "CATEGORICAL" | "NUMERICAL";
export const SyntheticDataColumnType = S.Literal("CATEGORICAL", "NUMERICAL");
export interface SyntheticDataColumnProperties {
  columnName: string;
  columnType: SyntheticDataColumnType;
  isPredictiveValue: boolean;
}
export const SyntheticDataColumnProperties = S.suspend(() =>
  S.Struct({
    columnName: S.String,
    columnType: SyntheticDataColumnType,
    isPredictiveValue: S.Boolean,
  }),
).annotations({
  identifier: "SyntheticDataColumnProperties",
}) as any as S.Schema<SyntheticDataColumnProperties>;
export type ColumnMappingList = SyntheticDataColumnProperties[];
export const ColumnMappingList = S.Array(SyntheticDataColumnProperties);
export interface ColumnClassificationDetails {
  columnMapping: SyntheticDataColumnProperties[];
}
export const ColumnClassificationDetails = S.suspend(() =>
  S.Struct({ columnMapping: ColumnMappingList }),
).annotations({
  identifier: "ColumnClassificationDetails",
}) as any as S.Schema<ColumnClassificationDetails>;
export interface MLSyntheticDataParameters {
  epsilon: number;
  maxMembershipInferenceAttackScore: number;
  columnClassification?: ColumnClassificationDetails;
}
export const MLSyntheticDataParameters = S.suspend(() =>
  S.Struct({
    epsilon: S.Number,
    maxMembershipInferenceAttackScore: S.Number,
    columnClassification: S.optional(ColumnClassificationDetails),
  }),
).annotations({
  identifier: "MLSyntheticDataParameters",
}) as any as S.Schema<MLSyntheticDataParameters>;
export type MembershipInferenceAttackVersion = "DISTANCE_TO_CLOSEST_RECORD_V1";
export const MembershipInferenceAttackVersion = S.Literal(
  "DISTANCE_TO_CLOSEST_RECORD_V1",
);
export interface MembershipInferenceAttackScore {
  attackVersion: MembershipInferenceAttackVersion;
  score: number;
}
export const MembershipInferenceAttackScore = S.suspend(() =>
  S.Struct({
    attackVersion: MembershipInferenceAttackVersion,
    score: S.Number,
  }),
).annotations({
  identifier: "MembershipInferenceAttackScore",
}) as any as S.Schema<MembershipInferenceAttackScore>;
export type MembershipInferenceAttackScoreList =
  MembershipInferenceAttackScore[];
export const MembershipInferenceAttackScoreList = S.Array(
  MembershipInferenceAttackScore,
);
export interface DataPrivacyScores {
  membershipInferenceAttackScores: MembershipInferenceAttackScore[];
}
export const DataPrivacyScores = S.suspend(() =>
  S.Struct({
    membershipInferenceAttackScores: MembershipInferenceAttackScoreList,
  }),
).annotations({
  identifier: "DataPrivacyScores",
}) as any as S.Schema<DataPrivacyScores>;
export interface SyntheticDataEvaluationScores {
  dataPrivacyScores: DataPrivacyScores;
}
export const SyntheticDataEvaluationScores = S.suspend(() =>
  S.Struct({ dataPrivacyScores: DataPrivacyScores }),
).annotations({
  identifier: "SyntheticDataEvaluationScores",
}) as any as S.Schema<SyntheticDataEvaluationScores>;
export interface SyntheticDataConfiguration {
  syntheticDataParameters: MLSyntheticDataParameters;
  syntheticDataEvaluationScores?: SyntheticDataEvaluationScores;
}
export const SyntheticDataConfiguration = S.suspend(() =>
  S.Struct({
    syntheticDataParameters: MLSyntheticDataParameters,
    syntheticDataEvaluationScores: S.optional(SyntheticDataEvaluationScores),
  }),
).annotations({
  identifier: "SyntheticDataConfiguration",
}) as any as S.Schema<SyntheticDataConfiguration>;
export interface GetCollaborationMLInputChannelResponse {
  membershipIdentifier: string;
  collaborationIdentifier: string;
  mlInputChannelArn: string;
  name: string;
  configuredModelAlgorithmAssociations: string[];
  status: MLInputChannelStatus;
  statusDetails?: StatusDetails;
  retentionInDays: number;
  numberOfRecords?: number;
  privacyBudgets?: PrivacyBudgets;
  description?: string;
  syntheticDataConfiguration?: SyntheticDataConfiguration;
  createTime: Date;
  updateTime: Date;
  creatorAccountId: string;
}
export const GetCollaborationMLInputChannelResponse = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    mlInputChannelArn: S.String,
    name: S.String,
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    status: MLInputChannelStatus,
    statusDetails: S.optional(StatusDetails),
    retentionInDays: S.Number,
    numberOfRecords: S.optional(S.Number),
    privacyBudgets: S.optional(PrivacyBudgets),
    description: S.optional(S.String),
    syntheticDataConfiguration: S.optional(SyntheticDataConfiguration),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    creatorAccountId: S.String,
  }),
).annotations({
  identifier: "GetCollaborationMLInputChannelResponse",
}) as any as S.Schema<GetCollaborationMLInputChannelResponse>;
export interface CreateTrainedModelRequest {
  membershipIdentifier: string;
  name: string;
  configuredModelAlgorithmAssociationArn: string;
  hyperparameters?: { [key: string]: string };
  environment?: { [key: string]: string };
  resourceConfig: ResourceConfig;
  stoppingCondition?: StoppingCondition;
  incrementalTrainingDataChannels?: IncrementalTrainingDataChannel[];
  dataChannels: ModelTrainingDataChannel[];
  trainingInputMode?: TrainingInputMode;
  description?: string;
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
}
export const CreateTrainedModelRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    configuredModelAlgorithmAssociationArn: S.String,
    hyperparameters: S.optional(HyperParameters),
    environment: S.optional(Environment),
    resourceConfig: ResourceConfig,
    stoppingCondition: S.optional(StoppingCondition),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannels,
    ),
    dataChannels: ModelTrainingDataChannels,
    trainingInputMode: S.optional(TrainingInputMode),
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/trained-models",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrainedModelRequest",
}) as any as S.Schema<CreateTrainedModelRequest>;
export interface IncrementalTrainingDataChannelOutput {
  channelName: string;
  versionIdentifier?: string;
  modelName: string;
}
export const IncrementalTrainingDataChannelOutput = S.suspend(() =>
  S.Struct({
    channelName: S.String,
    versionIdentifier: S.optional(S.String),
    modelName: S.String,
  }),
).annotations({
  identifier: "IncrementalTrainingDataChannelOutput",
}) as any as S.Schema<IncrementalTrainingDataChannelOutput>;
export type IncrementalTrainingDataChannelsOutput =
  IncrementalTrainingDataChannelOutput[];
export const IncrementalTrainingDataChannelsOutput = S.Array(
  IncrementalTrainingDataChannelOutput,
);
export interface GetCollaborationTrainedModelResponse {
  membershipIdentifier: string;
  collaborationIdentifier: string;
  trainedModelArn: string;
  versionIdentifier?: string;
  incrementalTrainingDataChannels?: IncrementalTrainingDataChannelOutput[];
  name: string;
  description?: string;
  status: TrainedModelStatus;
  statusDetails?: StatusDetails;
  configuredModelAlgorithmAssociationArn: string;
  resourceConfig?: ResourceConfig;
  trainingInputMode?: TrainingInputMode;
  stoppingCondition?: StoppingCondition;
  metricsStatus?: MetricsStatus;
  metricsStatusDetails?: string;
  logsStatus?: LogsStatus;
  logsStatusDetails?: string;
  trainingContainerImageDigest?: string;
  createTime: Date;
  updateTime: Date;
  creatorAccountId: string;
}
export const GetCollaborationTrainedModelResponse = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    trainedModelArn: S.String,
    versionIdentifier: S.optional(S.String),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannelsOutput,
    ),
    name: S.String,
    description: S.optional(S.String),
    status: TrainedModelStatus,
    statusDetails: S.optional(StatusDetails),
    configuredModelAlgorithmAssociationArn: S.String,
    resourceConfig: S.optional(ResourceConfig),
    trainingInputMode: S.optional(TrainingInputMode),
    stoppingCondition: S.optional(StoppingCondition),
    metricsStatus: S.optional(MetricsStatus),
    metricsStatusDetails: S.optional(S.String),
    logsStatus: S.optional(LogsStatus),
    logsStatusDetails: S.optional(S.String),
    trainingContainerImageDigest: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    creatorAccountId: S.String,
  }),
).annotations({
  identifier: "GetCollaborationTrainedModelResponse",
}) as any as S.Schema<GetCollaborationTrainedModelResponse>;
export interface TrainedModelSummary {
  createTime: Date;
  updateTime: Date;
  trainedModelArn: string;
  versionIdentifier?: string;
  incrementalTrainingDataChannels?: IncrementalTrainingDataChannelOutput[];
  name: string;
  description?: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  status: TrainedModelStatus;
  configuredModelAlgorithmAssociationArn: string;
}
export const TrainedModelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainedModelArn: S.String,
    versionIdentifier: S.optional(S.String),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannelsOutput,
    ),
    name: S.String,
    description: S.optional(S.String),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    status: TrainedModelStatus,
    configuredModelAlgorithmAssociationArn: S.String,
  }),
).annotations({
  identifier: "TrainedModelSummary",
}) as any as S.Schema<TrainedModelSummary>;
export type TrainedModelList = TrainedModelSummary[];
export const TrainedModelList = S.Array(TrainedModelSummary);
export interface ListTrainedModelVersionsResponse {
  nextToken?: string;
  trainedModels: TrainedModelSummary[];
}
export const ListTrainedModelVersionsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    trainedModels: TrainedModelList,
  }),
).annotations({
  identifier: "ListTrainedModelVersionsResponse",
}) as any as S.Schema<ListTrainedModelVersionsResponse>;
export interface InferenceReceiverMember {
  accountId: string;
}
export const InferenceReceiverMember = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "InferenceReceiverMember",
}) as any as S.Schema<InferenceReceiverMember>;
export type InferenceReceiverMembers = InferenceReceiverMember[];
export const InferenceReceiverMembers = S.Array(InferenceReceiverMember);
export interface InferenceOutputConfiguration {
  accept?: string;
  members: InferenceReceiverMember[];
}
export const InferenceOutputConfiguration = S.suspend(() =>
  S.Struct({ accept: S.optional(S.String), members: InferenceReceiverMembers }),
).annotations({
  identifier: "InferenceOutputConfiguration",
}) as any as S.Schema<InferenceOutputConfiguration>;
export interface GetTrainedModelInferenceJobResponse {
  createTime: Date;
  updateTime: Date;
  trainedModelInferenceJobArn: string;
  configuredModelAlgorithmAssociationArn?: string;
  name: string;
  status: TrainedModelInferenceJobStatus;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  resourceConfig: InferenceResourceConfig;
  outputConfiguration: InferenceOutputConfiguration;
  membershipIdentifier: string;
  dataSource: ModelInferenceDataSource;
  containerExecutionParameters?: InferenceContainerExecutionParameters;
  statusDetails?: StatusDetails;
  description?: string;
  inferenceContainerImageDigest?: string;
  environment?: { [key: string]: string };
  kmsKeyArn?: string;
  metricsStatus?: MetricsStatus;
  metricsStatusDetails?: string;
  logsStatus?: LogsStatus;
  logsStatusDetails?: string;
  tags?: { [key: string]: string };
}
export const GetTrainedModelInferenceJobResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainedModelInferenceJobArn: S.String,
    configuredModelAlgorithmAssociationArn: S.optional(S.String),
    name: S.String,
    status: TrainedModelInferenceJobStatus,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    resourceConfig: InferenceResourceConfig,
    outputConfiguration: InferenceOutputConfiguration,
    membershipIdentifier: S.String,
    dataSource: ModelInferenceDataSource,
    containerExecutionParameters: S.optional(
      InferenceContainerExecutionParameters,
    ),
    statusDetails: S.optional(StatusDetails),
    description: S.optional(S.String),
    inferenceContainerImageDigest: S.optional(S.String),
    environment: S.optional(InferenceEnvironmentMap),
    kmsKeyArn: S.optional(S.String),
    metricsStatus: S.optional(MetricsStatus),
    metricsStatusDetails: S.optional(S.String),
    logsStatus: S.optional(LogsStatus),
    logsStatusDetails: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetTrainedModelInferenceJobResponse",
}) as any as S.Schema<GetTrainedModelInferenceJobResponse>;
export type ColumnType =
  | "USER_ID"
  | "ITEM_ID"
  | "TIMESTAMP"
  | "CATEGORICAL_FEATURE"
  | "NUMERICAL_FEATURE";
export const ColumnType = S.Literal(
  "USER_ID",
  "ITEM_ID",
  "TIMESTAMP",
  "CATEGORICAL_FEATURE",
  "NUMERICAL_FEATURE",
);
export type ColumnTypeList = ColumnType[];
export const ColumnTypeList = S.Array(ColumnType);
export interface ColumnSchema {
  columnName: string;
  columnTypes: ColumnType[];
}
export const ColumnSchema = S.suspend(() =>
  S.Struct({ columnName: S.String, columnTypes: ColumnTypeList }),
).annotations({ identifier: "ColumnSchema" }) as any as S.Schema<ColumnSchema>;
export type DatasetSchemaList = ColumnSchema[];
export const DatasetSchemaList = S.Array(ColumnSchema);
export interface GlueDataSource {
  tableName: string;
  databaseName: string;
  catalogId?: string;
}
export const GlueDataSource = S.suspend(() =>
  S.Struct({
    tableName: S.String,
    databaseName: S.String,
    catalogId: S.optional(S.String),
  }),
).annotations({
  identifier: "GlueDataSource",
}) as any as S.Schema<GlueDataSource>;
export interface DataSource {
  glueDataSource: GlueDataSource;
}
export const DataSource = S.suspend(() =>
  S.Struct({ glueDataSource: GlueDataSource }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface DatasetInputConfig {
  schema: ColumnSchema[];
  dataSource: DataSource;
}
export const DatasetInputConfig = S.suspend(() =>
  S.Struct({ schema: DatasetSchemaList, dataSource: DataSource }),
).annotations({
  identifier: "DatasetInputConfig",
}) as any as S.Schema<DatasetInputConfig>;
export interface Dataset {
  type: DatasetType;
  inputConfig: DatasetInputConfig;
}
export const Dataset = S.suspend(() =>
  S.Struct({ type: DatasetType, inputConfig: DatasetInputConfig }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export type DatasetList = Dataset[];
export const DatasetList = S.Array(Dataset);
export interface GetTrainingDatasetResponse {
  createTime: Date;
  updateTime: Date;
  trainingDatasetArn: string;
  name: string;
  trainingData: Dataset[];
  status: TrainingDatasetStatus;
  roleArn: string;
  tags?: { [key: string]: string };
  description?: string;
}
export const GetTrainingDatasetResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainingDatasetArn: S.String,
    name: S.String,
    trainingData: DatasetList,
    status: TrainingDatasetStatus,
    roleArn: S.String,
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTrainingDatasetResponse",
}) as any as S.Schema<GetTrainingDatasetResponse>;
export type TrainedModelExportJobStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE";
export const TrainedModelExportJobStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
);
export type AudienceExportJobStatus =
  | "CREATE_PENDING"
  | "CREATE_IN_PROGRESS"
  | "CREATE_FAILED"
  | "ACTIVE";
export const AudienceExportJobStatus = S.Literal(
  "CREATE_PENDING",
  "CREATE_IN_PROGRESS",
  "CREATE_FAILED",
  "ACTIVE",
);
export interface TrainedModelExportReceiverMember {
  accountId: string;
}
export const TrainedModelExportReceiverMember = S.suspend(() =>
  S.Struct({ accountId: S.String }),
).annotations({
  identifier: "TrainedModelExportReceiverMember",
}) as any as S.Schema<TrainedModelExportReceiverMember>;
export type TrainedModelExportReceiverMembers =
  TrainedModelExportReceiverMember[];
export const TrainedModelExportReceiverMembers = S.Array(
  TrainedModelExportReceiverMember,
);
export type WorkerComputeType = "CR.1X" | "CR.4X";
export const WorkerComputeType = S.Literal("CR.1X", "CR.4X");
export type ResultFormat = "CSV" | "PARQUET";
export const ResultFormat = S.Literal("CSV", "PARQUET");
export interface CollaborationConfiguredModelAlgorithmAssociationSummary {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmAssociationArn: string;
  name: string;
  description?: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  configuredModelAlgorithmArn: string;
  creatorAccountId: string;
}
export const CollaborationConfiguredModelAlgorithmAssociationSummary =
  S.suspend(() =>
    S.Struct({
      createTime: S.Date.pipe(T.TimestampFormat("date-time")),
      updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
      configuredModelAlgorithmAssociationArn: S.String,
      name: S.String,
      description: S.optional(S.String),
      membershipIdentifier: S.String,
      collaborationIdentifier: S.String,
      configuredModelAlgorithmArn: S.String,
      creatorAccountId: S.String,
    }),
  ).annotations({
    identifier: "CollaborationConfiguredModelAlgorithmAssociationSummary",
  }) as any as S.Schema<CollaborationConfiguredModelAlgorithmAssociationSummary>;
export type CollaborationConfiguredModelAlgorithmAssociationList =
  CollaborationConfiguredModelAlgorithmAssociationSummary[];
export const CollaborationConfiguredModelAlgorithmAssociationList = S.Array(
  CollaborationConfiguredModelAlgorithmAssociationSummary,
);
export interface CollaborationMLInputChannelSummary {
  createTime: Date;
  updateTime: Date;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  name: string;
  configuredModelAlgorithmAssociations: string[];
  mlInputChannelArn: string;
  status: MLInputChannelStatus;
  creatorAccountId: string;
  description?: string;
}
export const CollaborationMLInputChannelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    name: S.String,
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    mlInputChannelArn: S.String,
    status: MLInputChannelStatus,
    creatorAccountId: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "CollaborationMLInputChannelSummary",
}) as any as S.Schema<CollaborationMLInputChannelSummary>;
export type CollaborationMLInputChannelsList =
  CollaborationMLInputChannelSummary[];
export const CollaborationMLInputChannelsList = S.Array(
  CollaborationMLInputChannelSummary,
);
export interface TrainedModelExportOutputConfiguration {
  members: TrainedModelExportReceiverMember[];
}
export const TrainedModelExportOutputConfiguration = S.suspend(() =>
  S.Struct({ members: TrainedModelExportReceiverMembers }),
).annotations({
  identifier: "TrainedModelExportOutputConfiguration",
}) as any as S.Schema<TrainedModelExportOutputConfiguration>;
export interface CollaborationTrainedModelExportJobSummary {
  createTime: Date;
  updateTime: Date;
  name: string;
  outputConfiguration: TrainedModelExportOutputConfiguration;
  status: TrainedModelExportJobStatus;
  statusDetails?: StatusDetails;
  description?: string;
  creatorAccountId: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
}
export const CollaborationTrainedModelExportJobSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    name: S.String,
    outputConfiguration: TrainedModelExportOutputConfiguration,
    status: TrainedModelExportJobStatus,
    statusDetails: S.optional(StatusDetails),
    description: S.optional(S.String),
    creatorAccountId: S.String,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
  }),
).annotations({
  identifier: "CollaborationTrainedModelExportJobSummary",
}) as any as S.Schema<CollaborationTrainedModelExportJobSummary>;
export type CollaborationTrainedModelExportJobList =
  CollaborationTrainedModelExportJobSummary[];
export const CollaborationTrainedModelExportJobList = S.Array(
  CollaborationTrainedModelExportJobSummary,
);
export interface CollaborationTrainedModelInferenceJobSummary {
  trainedModelInferenceJobArn: string;
  configuredModelAlgorithmAssociationArn?: string;
  membershipIdentifier: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  collaborationIdentifier: string;
  status: TrainedModelInferenceJobStatus;
  outputConfiguration: InferenceOutputConfiguration;
  name: string;
  description?: string;
  metricsStatus?: MetricsStatus;
  metricsStatusDetails?: string;
  logsStatus?: LogsStatus;
  logsStatusDetails?: string;
  createTime: Date;
  updateTime: Date;
  creatorAccountId: string;
}
export const CollaborationTrainedModelInferenceJobSummary = S.suspend(() =>
  S.Struct({
    trainedModelInferenceJobArn: S.String,
    configuredModelAlgorithmAssociationArn: S.optional(S.String),
    membershipIdentifier: S.String,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    collaborationIdentifier: S.String,
    status: TrainedModelInferenceJobStatus,
    outputConfiguration: InferenceOutputConfiguration,
    name: S.String,
    description: S.optional(S.String),
    metricsStatus: S.optional(MetricsStatus),
    metricsStatusDetails: S.optional(S.String),
    logsStatus: S.optional(LogsStatus),
    logsStatusDetails: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    creatorAccountId: S.String,
  }),
).annotations({
  identifier: "CollaborationTrainedModelInferenceJobSummary",
}) as any as S.Schema<CollaborationTrainedModelInferenceJobSummary>;
export type CollaborationTrainedModelInferenceJobList =
  CollaborationTrainedModelInferenceJobSummary[];
export const CollaborationTrainedModelInferenceJobList = S.Array(
  CollaborationTrainedModelInferenceJobSummary,
);
export interface CollaborationTrainedModelSummary {
  createTime: Date;
  updateTime: Date;
  trainedModelArn: string;
  name: string;
  versionIdentifier?: string;
  incrementalTrainingDataChannels?: IncrementalTrainingDataChannelOutput[];
  description?: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  status: TrainedModelStatus;
  configuredModelAlgorithmAssociationArn: string;
  creatorAccountId: string;
}
export const CollaborationTrainedModelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainedModelArn: S.String,
    name: S.String,
    versionIdentifier: S.optional(S.String),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannelsOutput,
    ),
    description: S.optional(S.String),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    status: TrainedModelStatus,
    configuredModelAlgorithmAssociationArn: S.String,
    creatorAccountId: S.String,
  }),
).annotations({
  identifier: "CollaborationTrainedModelSummary",
}) as any as S.Schema<CollaborationTrainedModelSummary>;
export type CollaborationTrainedModelList = CollaborationTrainedModelSummary[];
export const CollaborationTrainedModelList = S.Array(
  CollaborationTrainedModelSummary,
);
export interface AudienceExportJobSummary {
  createTime: Date;
  updateTime: Date;
  name: string;
  audienceGenerationJobArn: string;
  audienceSize: AudienceSize;
  description?: string;
  status: AudienceExportJobStatus;
  statusDetails?: StatusDetails;
  outputLocation?: string;
}
export const AudienceExportJobSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    name: S.String,
    audienceGenerationJobArn: S.String,
    audienceSize: AudienceSize,
    description: S.optional(S.String),
    status: AudienceExportJobStatus,
    statusDetails: S.optional(StatusDetails),
    outputLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "AudienceExportJobSummary",
}) as any as S.Schema<AudienceExportJobSummary>;
export type AudienceExportJobList = AudienceExportJobSummary[];
export const AudienceExportJobList = S.Array(AudienceExportJobSummary);
export interface AudienceGenerationJobSummary {
  createTime: Date;
  updateTime: Date;
  audienceGenerationJobArn: string;
  name: string;
  description?: string;
  status: AudienceGenerationJobStatus;
  configuredAudienceModelArn: string;
  collaborationId?: string;
  startedBy?: string;
}
export const AudienceGenerationJobSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    audienceGenerationJobArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    status: AudienceGenerationJobStatus,
    configuredAudienceModelArn: S.String,
    collaborationId: S.optional(S.String),
    startedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "AudienceGenerationJobSummary",
}) as any as S.Schema<AudienceGenerationJobSummary>;
export type AudienceGenerationJobList = AudienceGenerationJobSummary[];
export const AudienceGenerationJobList = S.Array(AudienceGenerationJobSummary);
export interface AudienceModelSummary {
  createTime: Date;
  updateTime: Date;
  audienceModelArn: string;
  name: string;
  trainingDatasetArn: string;
  status: AudienceModelStatus;
  description?: string;
}
export const AudienceModelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    audienceModelArn: S.String,
    name: S.String,
    trainingDatasetArn: S.String,
    status: AudienceModelStatus,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "AudienceModelSummary",
}) as any as S.Schema<AudienceModelSummary>;
export type AudienceModelList = AudienceModelSummary[];
export const AudienceModelList = S.Array(AudienceModelSummary);
export interface ConfiguredAudienceModelSummary {
  createTime: Date;
  updateTime: Date;
  name: string;
  audienceModelArn: string;
  outputConfig: ConfiguredAudienceModelOutputConfig;
  description?: string;
  configuredAudienceModelArn: string;
  status: ConfiguredAudienceModelStatus;
}
export const ConfiguredAudienceModelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    name: S.String,
    audienceModelArn: S.String,
    outputConfig: ConfiguredAudienceModelOutputConfig,
    description: S.optional(S.String),
    configuredAudienceModelArn: S.String,
    status: ConfiguredAudienceModelStatus,
  }),
).annotations({
  identifier: "ConfiguredAudienceModelSummary",
}) as any as S.Schema<ConfiguredAudienceModelSummary>;
export type ConfiguredAudienceModelList = ConfiguredAudienceModelSummary[];
export const ConfiguredAudienceModelList = S.Array(
  ConfiguredAudienceModelSummary,
);
export interface ConfiguredModelAlgorithmSummary {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmArn: string;
  name: string;
  description?: string;
}
export const ConfiguredModelAlgorithmSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfiguredModelAlgorithmSummary",
}) as any as S.Schema<ConfiguredModelAlgorithmSummary>;
export type ConfiguredModelAlgorithmList = ConfiguredModelAlgorithmSummary[];
export const ConfiguredModelAlgorithmList = S.Array(
  ConfiguredModelAlgorithmSummary,
);
export interface ConfiguredModelAlgorithmAssociationSummary {
  createTime: Date;
  updateTime: Date;
  configuredModelAlgorithmAssociationArn: string;
  configuredModelAlgorithmArn: string;
  name: string;
  description?: string;
  membershipIdentifier: string;
  collaborationIdentifier: string;
}
export const ConfiguredModelAlgorithmAssociationSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    configuredModelAlgorithmAssociationArn: S.String,
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
  }),
).annotations({
  identifier: "ConfiguredModelAlgorithmAssociationSummary",
}) as any as S.Schema<ConfiguredModelAlgorithmAssociationSummary>;
export type ConfiguredModelAlgorithmAssociationList =
  ConfiguredModelAlgorithmAssociationSummary[];
export const ConfiguredModelAlgorithmAssociationList = S.Array(
  ConfiguredModelAlgorithmAssociationSummary,
);
export interface MLInputChannelSummary {
  createTime: Date;
  updateTime: Date;
  membershipIdentifier: string;
  collaborationIdentifier: string;
  name: string;
  configuredModelAlgorithmAssociations: string[];
  protectedQueryIdentifier?: string;
  mlInputChannelArn: string;
  status: MLInputChannelStatus;
  description?: string;
}
export const MLInputChannelSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    name: S.String,
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    protectedQueryIdentifier: S.optional(S.String),
    mlInputChannelArn: S.String,
    status: MLInputChannelStatus,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "MLInputChannelSummary",
}) as any as S.Schema<MLInputChannelSummary>;
export type MLInputChannelsList = MLInputChannelSummary[];
export const MLInputChannelsList = S.Array(MLInputChannelSummary);
export interface TrainedModelInferenceJobSummary {
  trainedModelInferenceJobArn: string;
  configuredModelAlgorithmAssociationArn?: string;
  membershipIdentifier: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  collaborationIdentifier: string;
  status: TrainedModelInferenceJobStatus;
  outputConfiguration: InferenceOutputConfiguration;
  name: string;
  description?: string;
  metricsStatus?: MetricsStatus;
  metricsStatusDetails?: string;
  logsStatus?: LogsStatus;
  logsStatusDetails?: string;
  createTime: Date;
  updateTime: Date;
}
export const TrainedModelInferenceJobSummary = S.suspend(() =>
  S.Struct({
    trainedModelInferenceJobArn: S.String,
    configuredModelAlgorithmAssociationArn: S.optional(S.String),
    membershipIdentifier: S.String,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    collaborationIdentifier: S.String,
    status: TrainedModelInferenceJobStatus,
    outputConfiguration: InferenceOutputConfiguration,
    name: S.String,
    description: S.optional(S.String),
    metricsStatus: S.optional(MetricsStatus),
    metricsStatusDetails: S.optional(S.String),
    logsStatus: S.optional(LogsStatus),
    logsStatusDetails: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }),
).annotations({
  identifier: "TrainedModelInferenceJobSummary",
}) as any as S.Schema<TrainedModelInferenceJobSummary>;
export type TrainedModelInferenceJobList = TrainedModelInferenceJobSummary[];
export const TrainedModelInferenceJobList = S.Array(
  TrainedModelInferenceJobSummary,
);
export interface TrainingDatasetSummary {
  createTime: Date;
  updateTime: Date;
  trainingDatasetArn: string;
  name: string;
  status: TrainingDatasetStatus;
  description?: string;
}
export const TrainingDatasetSummary = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    trainingDatasetArn: S.String,
    name: S.String,
    status: TrainingDatasetStatus,
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "TrainingDatasetSummary",
}) as any as S.Schema<TrainingDatasetSummary>;
export type TrainingDatasetList = TrainingDatasetSummary[];
export const TrainingDatasetList = S.Array(TrainingDatasetSummary);
export type ParameterMap = { [key: string]: string };
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export interface ProtectedQuerySQLParameters {
  queryString?: string;
  analysisTemplateArn?: string;
  parameters?: { [key: string]: string };
}
export const ProtectedQuerySQLParameters = S.suspend(() =>
  S.Struct({
    queryString: S.optional(S.String),
    analysisTemplateArn: S.optional(S.String),
    parameters: S.optional(ParameterMap),
  }),
).annotations({
  identifier: "ProtectedQuerySQLParameters",
}) as any as S.Schema<ProtectedQuerySQLParameters>;
export type SparkProperties = { [key: string]: string };
export const SparkProperties = S.Record({ key: S.String, value: S.String });
export type WorkerComputeConfigurationProperties = {
  spark: { [key: string]: string };
};
export const WorkerComputeConfigurationProperties = S.Union(
  S.Struct({ spark: SparkProperties }),
);
export interface WorkerComputeConfiguration {
  type?: WorkerComputeType;
  number?: number;
  properties?: WorkerComputeConfigurationProperties;
}
export const WorkerComputeConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(WorkerComputeType),
    number: S.optional(S.Number),
    properties: S.optional(WorkerComputeConfigurationProperties),
  }),
).annotations({
  identifier: "WorkerComputeConfiguration",
}) as any as S.Schema<WorkerComputeConfiguration>;
export type ComputeConfiguration = { worker: WorkerComputeConfiguration };
export const ComputeConfiguration = S.Union(
  S.Struct({ worker: WorkerComputeConfiguration }),
);
export interface ProtectedQueryInputParameters {
  sqlParameters: ProtectedQuerySQLParameters;
  computeConfiguration?: ComputeConfiguration;
  resultFormat?: ResultFormat;
}
export const ProtectedQueryInputParameters = S.suspend(() =>
  S.Struct({
    sqlParameters: ProtectedQuerySQLParameters,
    computeConfiguration: S.optional(ComputeConfiguration),
    resultFormat: S.optional(ResultFormat),
  }),
).annotations({
  identifier: "ProtectedQueryInputParameters",
}) as any as S.Schema<ProtectedQueryInputParameters>;
export interface ListCollaborationConfiguredModelAlgorithmAssociationsResponse {
  nextToken?: string;
  collaborationConfiguredModelAlgorithmAssociations: CollaborationConfiguredModelAlgorithmAssociationSummary[];
}
export const ListCollaborationConfiguredModelAlgorithmAssociationsResponse =
  S.suspend(() =>
    S.Struct({
      nextToken: S.optional(S.String),
      collaborationConfiguredModelAlgorithmAssociations:
        CollaborationConfiguredModelAlgorithmAssociationList,
    }),
  ).annotations({
    identifier: "ListCollaborationConfiguredModelAlgorithmAssociationsResponse",
  }) as any as S.Schema<ListCollaborationConfiguredModelAlgorithmAssociationsResponse>;
export interface ListCollaborationMLInputChannelsResponse {
  nextToken?: string;
  collaborationMLInputChannelsList: CollaborationMLInputChannelSummary[];
}
export const ListCollaborationMLInputChannelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationMLInputChannelsList: CollaborationMLInputChannelsList,
  }),
).annotations({
  identifier: "ListCollaborationMLInputChannelsResponse",
}) as any as S.Schema<ListCollaborationMLInputChannelsResponse>;
export interface ListCollaborationTrainedModelExportJobsResponse {
  nextToken?: string;
  collaborationTrainedModelExportJobs: CollaborationTrainedModelExportJobSummary[];
}
export const ListCollaborationTrainedModelExportJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationTrainedModelExportJobs: CollaborationTrainedModelExportJobList,
  }),
).annotations({
  identifier: "ListCollaborationTrainedModelExportJobsResponse",
}) as any as S.Schema<ListCollaborationTrainedModelExportJobsResponse>;
export interface ListCollaborationTrainedModelInferenceJobsResponse {
  nextToken?: string;
  collaborationTrainedModelInferenceJobs: CollaborationTrainedModelInferenceJobSummary[];
}
export const ListCollaborationTrainedModelInferenceJobsResponse = S.suspend(
  () =>
    S.Struct({
      nextToken: S.optional(S.String),
      collaborationTrainedModelInferenceJobs:
        CollaborationTrainedModelInferenceJobList,
    }),
).annotations({
  identifier: "ListCollaborationTrainedModelInferenceJobsResponse",
}) as any as S.Schema<ListCollaborationTrainedModelInferenceJobsResponse>;
export interface ListCollaborationTrainedModelsResponse {
  nextToken?: string;
  collaborationTrainedModels: CollaborationTrainedModelSummary[];
}
export const ListCollaborationTrainedModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    collaborationTrainedModels: CollaborationTrainedModelList,
  }),
).annotations({
  identifier: "ListCollaborationTrainedModelsResponse",
}) as any as S.Schema<ListCollaborationTrainedModelsResponse>;
export interface ListAudienceExportJobsResponse {
  nextToken?: string;
  audienceExportJobs: AudienceExportJobSummary[];
}
export const ListAudienceExportJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    audienceExportJobs: AudienceExportJobList,
  }),
).annotations({
  identifier: "ListAudienceExportJobsResponse",
}) as any as S.Schema<ListAudienceExportJobsResponse>;
export interface ListAudienceGenerationJobsResponse {
  nextToken?: string;
  audienceGenerationJobs: AudienceGenerationJobSummary[];
}
export const ListAudienceGenerationJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    audienceGenerationJobs: AudienceGenerationJobList,
  }),
).annotations({
  identifier: "ListAudienceGenerationJobsResponse",
}) as any as S.Schema<ListAudienceGenerationJobsResponse>;
export interface ListAudienceModelsResponse {
  nextToken?: string;
  audienceModels: AudienceModelSummary[];
}
export const ListAudienceModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    audienceModels: AudienceModelList,
  }),
).annotations({
  identifier: "ListAudienceModelsResponse",
}) as any as S.Schema<ListAudienceModelsResponse>;
export interface CreateConfiguredAudienceModelRequest {
  name: string;
  audienceModelArn: string;
  outputConfig: ConfiguredAudienceModelOutputConfig;
  description?: string;
  sharedAudienceMetrics: SharedAudienceMetrics[];
  minMatchingSeedSize?: number;
  audienceSizeConfig?: AudienceSizeConfig;
  tags?: { [key: string]: string };
  childResourceTagOnCreatePolicy?: TagOnCreatePolicy;
}
export const CreateConfiguredAudienceModelRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    audienceModelArn: S.String,
    outputConfig: ConfiguredAudienceModelOutputConfig,
    description: S.optional(S.String),
    sharedAudienceMetrics: MetricsList,
    minMatchingSeedSize: S.optional(S.Number),
    audienceSizeConfig: S.optional(AudienceSizeConfig),
    tags: S.optional(TagMap),
    childResourceTagOnCreatePolicy: S.optional(TagOnCreatePolicy),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configured-audience-model" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredAudienceModelRequest",
}) as any as S.Schema<CreateConfiguredAudienceModelRequest>;
export interface ListConfiguredAudienceModelsResponse {
  nextToken?: string;
  configuredAudienceModels: ConfiguredAudienceModelSummary[];
}
export const ListConfiguredAudienceModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    configuredAudienceModels: ConfiguredAudienceModelList,
  }),
).annotations({
  identifier: "ListConfiguredAudienceModelsResponse",
}) as any as S.Schema<ListConfiguredAudienceModelsResponse>;
export interface CreateConfiguredModelAlgorithmRequest {
  name: string;
  description?: string;
  roleArn: string;
  trainingContainerConfig?: ContainerConfig;
  inferenceContainerConfig?: InferenceContainerConfig;
  tags?: { [key: string]: string };
  kmsKeyArn?: string;
}
export const CreateConfiguredModelAlgorithmRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    roleArn: S.String,
    trainingContainerConfig: S.optional(ContainerConfig),
    inferenceContainerConfig: S.optional(InferenceContainerConfig),
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/configured-model-algorithms" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredModelAlgorithmRequest",
}) as any as S.Schema<CreateConfiguredModelAlgorithmRequest>;
export interface ListConfiguredModelAlgorithmsResponse {
  nextToken?: string;
  configuredModelAlgorithms: ConfiguredModelAlgorithmSummary[];
}
export const ListConfiguredModelAlgorithmsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    configuredModelAlgorithms: ConfiguredModelAlgorithmList,
  }),
).annotations({
  identifier: "ListConfiguredModelAlgorithmsResponse",
}) as any as S.Schema<ListConfiguredModelAlgorithmsResponse>;
export interface ListConfiguredModelAlgorithmAssociationsResponse {
  nextToken?: string;
  configuredModelAlgorithmAssociations: ConfiguredModelAlgorithmAssociationSummary[];
}
export const ListConfiguredModelAlgorithmAssociationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationList,
  }),
).annotations({
  identifier: "ListConfiguredModelAlgorithmAssociationsResponse",
}) as any as S.Schema<ListConfiguredModelAlgorithmAssociationsResponse>;
export interface PutMLConfigurationRequest {
  membershipIdentifier: string;
  defaultOutputLocation: MLOutputConfiguration;
}
export const PutMLConfigurationRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    defaultOutputLocation: MLOutputConfiguration,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/memberships/{membershipIdentifier}/ml-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutMLConfigurationRequest",
}) as any as S.Schema<PutMLConfigurationRequest>;
export interface PutMLConfigurationResponse {}
export const PutMLConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutMLConfigurationResponse",
}) as any as S.Schema<PutMLConfigurationResponse>;
export interface ListMLInputChannelsResponse {
  nextToken?: string;
  mlInputChannelsList: MLInputChannelSummary[];
}
export const ListMLInputChannelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    mlInputChannelsList: MLInputChannelsList,
  }),
).annotations({
  identifier: "ListMLInputChannelsResponse",
}) as any as S.Schema<ListMLInputChannelsResponse>;
export interface CreateTrainedModelResponse {
  trainedModelArn: string;
  versionIdentifier?: string;
}
export const CreateTrainedModelResponse = S.suspend(() =>
  S.Struct({
    trainedModelArn: S.String,
    versionIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateTrainedModelResponse",
}) as any as S.Schema<CreateTrainedModelResponse>;
export interface GetTrainedModelResponse {
  membershipIdentifier: string;
  collaborationIdentifier: string;
  trainedModelArn: string;
  versionIdentifier?: string;
  incrementalTrainingDataChannels?: IncrementalTrainingDataChannelOutput[];
  name: string;
  description?: string;
  status: TrainedModelStatus;
  statusDetails?: StatusDetails;
  configuredModelAlgorithmAssociationArn: string;
  resourceConfig?: ResourceConfig;
  trainingInputMode?: TrainingInputMode;
  stoppingCondition?: StoppingCondition;
  metricsStatus?: MetricsStatus;
  metricsStatusDetails?: string;
  logsStatus?: LogsStatus;
  logsStatusDetails?: string;
  trainingContainerImageDigest?: string;
  createTime: Date;
  updateTime: Date;
  hyperparameters?: { [key: string]: string };
  environment?: { [key: string]: string };
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
  dataChannels: ModelTrainingDataChannel[];
}
export const GetTrainedModelResponse = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    trainedModelArn: S.String,
    versionIdentifier: S.optional(S.String),
    incrementalTrainingDataChannels: S.optional(
      IncrementalTrainingDataChannelsOutput,
    ),
    name: S.String,
    description: S.optional(S.String),
    status: TrainedModelStatus,
    statusDetails: S.optional(StatusDetails),
    configuredModelAlgorithmAssociationArn: S.String,
    resourceConfig: S.optional(ResourceConfig),
    trainingInputMode: S.optional(TrainingInputMode),
    stoppingCondition: S.optional(StoppingCondition),
    metricsStatus: S.optional(MetricsStatus),
    metricsStatusDetails: S.optional(S.String),
    logsStatus: S.optional(LogsStatus),
    logsStatusDetails: S.optional(S.String),
    trainingContainerImageDigest: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    hyperparameters: S.optional(HyperParameters),
    environment: S.optional(Environment),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
    dataChannels: ModelTrainingDataChannels,
  }),
).annotations({
  identifier: "GetTrainedModelResponse",
}) as any as S.Schema<GetTrainedModelResponse>;
export interface ListTrainedModelsResponse {
  nextToken?: string;
  trainedModels: TrainedModelSummary[];
}
export const ListTrainedModelsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    trainedModels: TrainedModelList,
  }),
).annotations({
  identifier: "ListTrainedModelsResponse",
}) as any as S.Schema<ListTrainedModelsResponse>;
export interface StartTrainedModelExportJobRequest {
  name: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  membershipIdentifier: string;
  outputConfiguration: TrainedModelExportOutputConfiguration;
  description?: string;
}
export const StartTrainedModelExportJobRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    trainedModelArn: S.String.pipe(T.HttpLabel("trainedModelArn")),
    trainedModelVersionIdentifier: S.optional(S.String),
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    outputConfiguration: TrainedModelExportOutputConfiguration,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/trained-models/{trainedModelArn}/export-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTrainedModelExportJobRequest",
}) as any as S.Schema<StartTrainedModelExportJobRequest>;
export interface StartTrainedModelExportJobResponse {}
export const StartTrainedModelExportJobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartTrainedModelExportJobResponse",
}) as any as S.Schema<StartTrainedModelExportJobResponse>;
export interface StartTrainedModelInferenceJobRequest {
  membershipIdentifier: string;
  name: string;
  trainedModelArn: string;
  trainedModelVersionIdentifier?: string;
  configuredModelAlgorithmAssociationArn?: string;
  resourceConfig: InferenceResourceConfig;
  outputConfiguration: InferenceOutputConfiguration;
  dataSource: ModelInferenceDataSource;
  description?: string;
  containerExecutionParameters?: InferenceContainerExecutionParameters;
  environment?: { [key: string]: string };
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
}
export const StartTrainedModelInferenceJobRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    name: S.String,
    trainedModelArn: S.String,
    trainedModelVersionIdentifier: S.optional(S.String),
    configuredModelAlgorithmAssociationArn: S.optional(S.String),
    resourceConfig: InferenceResourceConfig,
    outputConfiguration: InferenceOutputConfiguration,
    dataSource: ModelInferenceDataSource,
    description: S.optional(S.String),
    containerExecutionParameters: S.optional(
      InferenceContainerExecutionParameters,
    ),
    environment: S.optional(InferenceEnvironmentMap),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/trained-model-inference-jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartTrainedModelInferenceJobRequest",
}) as any as S.Schema<StartTrainedModelInferenceJobRequest>;
export interface ListTrainedModelInferenceJobsResponse {
  nextToken?: string;
  trainedModelInferenceJobs: TrainedModelInferenceJobSummary[];
}
export const ListTrainedModelInferenceJobsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    trainedModelInferenceJobs: TrainedModelInferenceJobList,
  }),
).annotations({
  identifier: "ListTrainedModelInferenceJobsResponse",
}) as any as S.Schema<ListTrainedModelInferenceJobsResponse>;
export interface ListTrainingDatasetsResponse {
  nextToken?: string;
  trainingDatasets: TrainingDatasetSummary[];
}
export const ListTrainingDatasetsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    trainingDatasets: TrainingDatasetList,
  }),
).annotations({
  identifier: "ListTrainingDatasetsResponse",
}) as any as S.Schema<ListTrainingDatasetsResponse>;
export interface RelevanceMetric {
  audienceSize: AudienceSize;
  score?: number;
}
export const RelevanceMetric = S.suspend(() =>
  S.Struct({ audienceSize: AudienceSize, score: S.optional(S.Number) }),
).annotations({
  identifier: "RelevanceMetric",
}) as any as S.Schema<RelevanceMetric>;
export type RelevanceMetrics = RelevanceMetric[];
export const RelevanceMetrics = S.Array(RelevanceMetric);
export type InputChannelDataSource = {
  protectedQueryInputParameters: ProtectedQueryInputParameters;
};
export const InputChannelDataSource = S.Union(
  S.Struct({ protectedQueryInputParameters: ProtectedQueryInputParameters }),
);
export interface AudienceQualityMetrics {
  relevanceMetrics: RelevanceMetric[];
  recallMetric?: number;
}
export const AudienceQualityMetrics = S.suspend(() =>
  S.Struct({
    relevanceMetrics: RelevanceMetrics,
    recallMetric: S.optional(S.Number),
  }),
).annotations({
  identifier: "AudienceQualityMetrics",
}) as any as S.Schema<AudienceQualityMetrics>;
export interface InputChannel {
  dataSource: InputChannelDataSource;
  roleArn: string;
}
export const InputChannel = S.suspend(() =>
  S.Struct({ dataSource: InputChannelDataSource, roleArn: S.String }),
).annotations({ identifier: "InputChannel" }) as any as S.Schema<InputChannel>;
export interface AudienceGenerationJobDataSource {
  dataSource?: S3ConfigMap;
  roleArn: string;
  sqlParameters?: ProtectedQuerySQLParameters;
  sqlComputeConfiguration?: ComputeConfiguration;
}
export const AudienceGenerationJobDataSource = S.suspend(() =>
  S.Struct({
    dataSource: S.optional(S3ConfigMap),
    roleArn: S.String,
    sqlParameters: S.optional(ProtectedQuerySQLParameters),
    sqlComputeConfiguration: S.optional(ComputeConfiguration),
  }),
).annotations({
  identifier: "AudienceGenerationJobDataSource",
}) as any as S.Schema<AudienceGenerationJobDataSource>;
export interface GetAudienceGenerationJobResponse {
  createTime: Date;
  updateTime: Date;
  audienceGenerationJobArn: string;
  name: string;
  description?: string;
  status: AudienceGenerationJobStatus;
  statusDetails?: StatusDetails;
  configuredAudienceModelArn: string;
  seedAudience?: AudienceGenerationJobDataSource;
  includeSeedInOutput?: boolean;
  collaborationId?: string;
  metrics?: AudienceQualityMetrics;
  startedBy?: string;
  tags?: { [key: string]: string };
  protectedQueryIdentifier?: string;
}
export const GetAudienceGenerationJobResponse = S.suspend(() =>
  S.Struct({
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    audienceGenerationJobArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    status: AudienceGenerationJobStatus,
    statusDetails: S.optional(StatusDetails),
    configuredAudienceModelArn: S.String,
    seedAudience: S.optional(AudienceGenerationJobDataSource),
    includeSeedInOutput: S.optional(S.Boolean),
    collaborationId: S.optional(S.String),
    metrics: S.optional(AudienceQualityMetrics),
    startedBy: S.optional(S.String),
    tags: S.optional(TagMap),
    protectedQueryIdentifier: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAudienceGenerationJobResponse",
}) as any as S.Schema<GetAudienceGenerationJobResponse>;
export interface CreateConfiguredAudienceModelResponse {
  configuredAudienceModelArn: string;
}
export const CreateConfiguredAudienceModelResponse = S.suspend(() =>
  S.Struct({ configuredAudienceModelArn: S.String }),
).annotations({
  identifier: "CreateConfiguredAudienceModelResponse",
}) as any as S.Schema<CreateConfiguredAudienceModelResponse>;
export interface CreateConfiguredModelAlgorithmResponse {
  configuredModelAlgorithmArn: string;
}
export const CreateConfiguredModelAlgorithmResponse = S.suspend(() =>
  S.Struct({ configuredModelAlgorithmArn: S.String }),
).annotations({
  identifier: "CreateConfiguredModelAlgorithmResponse",
}) as any as S.Schema<CreateConfiguredModelAlgorithmResponse>;
export interface CreateMLInputChannelRequest {
  membershipIdentifier: string;
  configuredModelAlgorithmAssociations: string[];
  inputChannel: InputChannel;
  name: string;
  retentionInDays: number;
  description?: string;
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
}
export const CreateMLInputChannelRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    inputChannel: InputChannel,
    name: S.String,
    retentionInDays: S.Number,
    description: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/ml-input-channels",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMLInputChannelRequest",
}) as any as S.Schema<CreateMLInputChannelRequest>;
export interface StartTrainedModelInferenceJobResponse {
  trainedModelInferenceJobArn: string;
}
export const StartTrainedModelInferenceJobResponse = S.suspend(() =>
  S.Struct({ trainedModelInferenceJobArn: S.String }),
).annotations({
  identifier: "StartTrainedModelInferenceJobResponse",
}) as any as S.Schema<StartTrainedModelInferenceJobResponse>;
export interface CreateMLInputChannelResponse {
  mlInputChannelArn: string;
}
export const CreateMLInputChannelResponse = S.suspend(() =>
  S.Struct({ mlInputChannelArn: S.String }),
).annotations({
  identifier: "CreateMLInputChannelResponse",
}) as any as S.Schema<CreateMLInputChannelResponse>;
export interface CreateTrainingDatasetRequest {
  name: string;
  roleArn: string;
  trainingData: Dataset[];
  tags?: { [key: string]: string };
  description?: string;
}
export const CreateTrainingDatasetRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    roleArn: S.String,
    trainingData: DatasetList,
    tags: S.optional(TagMap),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/training-dataset" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTrainingDatasetRequest",
}) as any as S.Schema<CreateTrainingDatasetRequest>;
export interface StartAudienceGenerationJobRequest {
  name: string;
  configuredAudienceModelArn: string;
  seedAudience: AudienceGenerationJobDataSource;
  includeSeedInOutput?: boolean;
  collaborationId?: string;
  description?: string;
  tags?: { [key: string]: string };
}
export const StartAudienceGenerationJobRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    configuredAudienceModelArn: S.String,
    seedAudience: AudienceGenerationJobDataSource,
    includeSeedInOutput: S.optional(S.Boolean),
    collaborationId: S.optional(S.String),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/audience-generation-job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAudienceGenerationJobRequest",
}) as any as S.Schema<StartAudienceGenerationJobRequest>;
export interface GetMLInputChannelResponse {
  membershipIdentifier: string;
  collaborationIdentifier: string;
  mlInputChannelArn: string;
  name: string;
  configuredModelAlgorithmAssociations: string[];
  status: MLInputChannelStatus;
  statusDetails?: StatusDetails;
  retentionInDays: number;
  numberOfRecords?: number;
  privacyBudgets?: PrivacyBudgets;
  description?: string;
  syntheticDataConfiguration?: SyntheticDataConfiguration;
  createTime: Date;
  updateTime: Date;
  inputChannel: InputChannel;
  protectedQueryIdentifier?: string;
  numberOfFiles?: number;
  sizeInGb?: number;
  kmsKeyArn?: string;
  tags?: { [key: string]: string };
}
export const GetMLInputChannelResponse = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String,
    collaborationIdentifier: S.String,
    mlInputChannelArn: S.String,
    name: S.String,
    configuredModelAlgorithmAssociations:
      ConfiguredModelAlgorithmAssociationArnList,
    status: MLInputChannelStatus,
    statusDetails: S.optional(StatusDetails),
    retentionInDays: S.Number,
    numberOfRecords: S.optional(S.Number),
    privacyBudgets: S.optional(PrivacyBudgets),
    description: S.optional(S.String),
    syntheticDataConfiguration: S.optional(SyntheticDataConfiguration),
    createTime: S.Date.pipe(T.TimestampFormat("date-time")),
    updateTime: S.Date.pipe(T.TimestampFormat("date-time")),
    inputChannel: InputChannel,
    protectedQueryIdentifier: S.optional(S.String),
    numberOfFiles: S.optional(S.Number),
    sizeInGb: S.optional(S.Number),
    kmsKeyArn: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "GetMLInputChannelResponse",
}) as any as S.Schema<GetMLInputChannelResponse>;
export interface CreateTrainingDatasetResponse {
  trainingDatasetArn: string;
}
export const CreateTrainingDatasetResponse = S.suspend(() =>
  S.Struct({ trainingDatasetArn: S.String }),
).annotations({
  identifier: "CreateTrainingDatasetResponse",
}) as any as S.Schema<CreateTrainingDatasetResponse>;
export interface StartAudienceGenerationJobResponse {
  audienceGenerationJobArn: string;
}
export const StartAudienceGenerationJobResponse = S.suspend(() =>
  S.Struct({ audienceGenerationJobArn: S.String }),
).annotations({
  identifier: "StartAudienceGenerationJobResponse",
}) as any as S.Schema<StartAudienceGenerationJobResponse>;
export interface CreateConfiguredModelAlgorithmAssociationRequest {
  membershipIdentifier: string;
  configuredModelAlgorithmArn: string;
  name: string;
  description?: string;
  privacyConfiguration?: PrivacyConfiguration;
  tags?: { [key: string]: string };
}
export const CreateConfiguredModelAlgorithmAssociationRequest = S.suspend(() =>
  S.Struct({
    membershipIdentifier: S.String.pipe(T.HttpLabel("membershipIdentifier")),
    configuredModelAlgorithmArn: S.String,
    name: S.String,
    description: S.optional(S.String),
    privacyConfiguration: S.optional(PrivacyConfiguration),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/memberships/{membershipIdentifier}/configured-model-algorithm-associations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConfiguredModelAlgorithmAssociationRequest",
}) as any as S.Schema<CreateConfiguredModelAlgorithmAssociationRequest>;
export interface CreateConfiguredModelAlgorithmAssociationResponse {
  configuredModelAlgorithmAssociationArn: string;
}
export const CreateConfiguredModelAlgorithmAssociationResponse = S.suspend(() =>
  S.Struct({ configuredModelAlgorithmAssociationArn: S.String }),
).annotations({
  identifier: "CreateConfiguredModelAlgorithmAssociationResponse",
}) as any as S.Schema<CreateConfiguredModelAlgorithmAssociationResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    quotaName: S.optional(S.String),
    quotaValue: S.optional(S.Number),
  },
).pipe(C.withQuotaError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.String },
).pipe(C.withServerError) {}

//# Operations
/**
 * Removes metadata tags from a specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Export an audience of a specified size after you have generated an audience.
 */
export const startAudienceExportJob: (
  input: StartAudienceExportJobRequest,
) => effect.Effect<
  StartAudienceExportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAudienceExportJobRequest,
  output: StartAudienceExportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns information about an audience generation job.
 */
export const getAudienceGenerationJob: (
  input: GetAudienceGenerationJobRequest,
) => effect.Effect<
  GetAudienceGenerationJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAudienceGenerationJobRequest,
  output: GetAudienceGenerationJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Defines the information necessary to create a configured audience model.
 */
export const createConfiguredAudienceModel: (
  input: CreateConfiguredAudienceModelRequest,
) => effect.Effect<
  CreateConfiguredAudienceModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfiguredAudienceModelRequest,
  output: CreateConfiguredAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a configured model algorithm using a container image stored in an ECR repository.
 */
export const createConfiguredModelAlgorithm: (
  input: CreateConfiguredModelAlgorithmRequest,
) => effect.Effect<
  CreateConfiguredModelAlgorithmResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfiguredModelAlgorithmRequest,
  output: CreateConfiguredModelAlgorithmResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a trained model from an associated configured model algorithm using data from any member of the collaboration.
 */
export const createTrainedModel: (
  input: CreateTrainedModelRequest,
) => effect.Effect<
  CreateTrainedModelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrainedModelRequest,
  output: CreateTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Defines the information necessary to begin a trained model inference job.
 */
export const startTrainedModelInferenceJob: (
  input: StartTrainedModelInferenceJobRequest,
) => effect.Effect<
  StartTrainedModelInferenceJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTrainedModelInferenceJobRequest,
  output: StartTrainedModelInferenceJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the ML input channels in a collaboration.
 */
export const listCollaborationMLInputChannels: {
  (
    input: ListCollaborationMLInputChannelsRequest,
  ): effect.Effect<
    ListCollaborationMLInputChannelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationMLInputChannelsRequest,
  ) => stream.Stream<
    ListCollaborationMLInputChannelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationMLInputChannelsRequest,
  ) => stream.Stream<
    CollaborationMLInputChannelSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationMLInputChannelsRequest,
  output: ListCollaborationMLInputChannelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationMLInputChannelsList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of the export jobs for a trained model in a collaboration.
 */
export const listCollaborationTrainedModelExportJobs: {
  (
    input: ListCollaborationTrainedModelExportJobsRequest,
  ): effect.Effect<
    ListCollaborationTrainedModelExportJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationTrainedModelExportJobsRequest,
  ) => stream.Stream<
    ListCollaborationTrainedModelExportJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationTrainedModelExportJobsRequest,
  ) => stream.Stream<
    CollaborationTrainedModelExportJobSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationTrainedModelExportJobsRequest,
  output: ListCollaborationTrainedModelExportJobsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationTrainedModelExportJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of trained model inference jobs in a specified collaboration.
 */
export const listCollaborationTrainedModelInferenceJobs: {
  (
    input: ListCollaborationTrainedModelInferenceJobsRequest,
  ): effect.Effect<
    ListCollaborationTrainedModelInferenceJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationTrainedModelInferenceJobsRequest,
  ) => stream.Stream<
    ListCollaborationTrainedModelInferenceJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationTrainedModelInferenceJobsRequest,
  ) => stream.Stream<
    CollaborationTrainedModelInferenceJobSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationTrainedModelInferenceJobsRequest,
  output: ListCollaborationTrainedModelInferenceJobsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationTrainedModelInferenceJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of the trained models in a collaboration.
 */
export const listCollaborationTrainedModels: {
  (
    input: ListCollaborationTrainedModelsRequest,
  ): effect.Effect<
    ListCollaborationTrainedModelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationTrainedModelsRequest,
  ) => stream.Stream<
    ListCollaborationTrainedModelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationTrainedModelsRequest,
  ) => stream.Stream<
    CollaborationTrainedModelSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationTrainedModelsRequest,
  output: ListCollaborationTrainedModelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationTrainedModels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of configured model algorithm associations.
 */
export const listConfiguredModelAlgorithmAssociations: {
  (
    input: ListConfiguredModelAlgorithmAssociationsRequest,
  ): effect.Effect<
    ListConfiguredModelAlgorithmAssociationsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredModelAlgorithmAssociationsRequest,
  ) => stream.Stream<
    ListConfiguredModelAlgorithmAssociationsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredModelAlgorithmAssociationsRequest,
  ) => stream.Stream<
    ConfiguredModelAlgorithmAssociationSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredModelAlgorithmAssociationsRequest,
  output: ListConfiguredModelAlgorithmAssociationsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configuredModelAlgorithmAssociations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Assigns information about an ML configuration.
 */
export const putMLConfiguration: (
  input: PutMLConfigurationRequest,
) => effect.Effect<
  PutMLConfigurationResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutMLConfigurationRequest,
  output: PutMLConfigurationResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns a list of ML input channels.
 */
export const listMLInputChannels: {
  (
    input: ListMLInputChannelsRequest,
  ): effect.Effect<
    ListMLInputChannelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMLInputChannelsRequest,
  ) => stream.Stream<
    ListMLInputChannelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMLInputChannelsRequest,
  ) => stream.Stream<
    MLInputChannelSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMLInputChannelsRequest,
  output: ListMLInputChannelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "mlInputChannelsList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a trained model.
 */
export const getTrainedModel: (
  input: GetTrainedModelRequest,
) => effect.Effect<
  GetTrainedModelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrainedModelRequest,
  output: GetTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of trained models.
 */
export const listTrainedModels: {
  (
    input: ListTrainedModelsRequest,
  ): effect.Effect<
    ListTrainedModelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrainedModelsRequest,
  ) => stream.Stream<
    ListTrainedModelsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrainedModelsRequest,
  ) => stream.Stream<
    TrainedModelSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrainedModelsRequest,
  output: ListTrainedModelsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "trainedModels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Provides the information necessary to start a trained model export job.
 */
export const startTrainedModelExportJob: (
  input: StartTrainedModelExportJobRequest,
) => effect.Effect<
  StartTrainedModelExportJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTrainedModelExportJobRequest,
  output: StartTrainedModelExportJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of trained model inference jobs that match the request parameters.
 */
export const listTrainedModelInferenceJobs: {
  (
    input: ListTrainedModelInferenceJobsRequest,
  ): effect.Effect<
    ListTrainedModelInferenceJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrainedModelInferenceJobsRequest,
  ) => stream.Stream<
    ListTrainedModelInferenceJobsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrainedModelInferenceJobsRequest,
  ) => stream.Stream<
    TrainedModelInferenceJobSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrainedModelInferenceJobsRequest,
  output: ListTrainedModelInferenceJobsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "trainedModelInferenceJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a configured model algorithm association.
 */
export const getConfiguredModelAlgorithmAssociation: (
  input: GetConfiguredModelAlgorithmAssociationRequest,
) => effect.Effect<
  GetConfiguredModelAlgorithmAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredModelAlgorithmAssociationRequest,
  output: GetConfiguredModelAlgorithmAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the configured model algorithm association in a collaboration.
 */
export const getCollaborationConfiguredModelAlgorithmAssociation: (
  input: GetCollaborationConfiguredModelAlgorithmAssociationRequest,
) => effect.Effect<
  GetCollaborationConfiguredModelAlgorithmAssociationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationConfiguredModelAlgorithmAssociationRequest,
  output: GetCollaborationConfiguredModelAlgorithmAssociationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific ML configuration.
 */
export const getMLConfiguration: (
  input: GetMLConfigurationRequest,
) => effect.Effect<
  GetMLConfigurationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLConfigurationRequest,
  output: GetMLConfigurationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific ML input channel in a collaboration.
 */
export const getCollaborationMLInputChannel: (
  input: GetCollaborationMLInputChannelRequest,
) => effect.Effect<
  GetCollaborationMLInputChannelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationMLInputChannelRequest,
  output: GetCollaborationMLInputChannelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a trained model in a collaboration.
 */
export const getCollaborationTrainedModel: (
  input: GetCollaborationTrainedModelRequest,
) => effect.Effect<
  GetCollaborationTrainedModelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCollaborationTrainedModelRequest,
  output: GetCollaborationTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of trained model versions for a specified trained model. This operation allows you to view all versions of a trained model, including information about their status and creation details. You can use this to track the evolution of your trained models and select specific versions for inference or further training.
 */
export const listTrainedModelVersions: {
  (
    input: ListTrainedModelVersionsRequest,
  ): effect.Effect<
    ListTrainedModelVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrainedModelVersionsRequest,
  ) => stream.Stream<
    ListTrainedModelVersionsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrainedModelVersionsRequest,
  ) => stream.Stream<
    TrainedModelSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrainedModelVersionsRequest,
  output: ListTrainedModelVersionsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "trainedModels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about a trained model inference job.
 */
export const getTrainedModelInferenceJob: (
  input: GetTrainedModelInferenceJobRequest,
) => effect.Effect<
  GetTrainedModelInferenceJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrainedModelInferenceJobRequest,
  output: GetTrainedModelInferenceJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a ML modeling configuration.
 */
export const deleteMLConfiguration: (
  input: DeleteMLConfigurationRequest,
) => effect.Effect<
  DeleteMLConfigurationResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMLConfigurationRequest,
  output: DeleteMLConfigurationResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a configured model algorithm association.
 */
export const deleteConfiguredModelAlgorithmAssociation: (
  input: DeleteConfiguredModelAlgorithmAssociationRequest,
) => effect.Effect<
  DeleteConfiguredModelAlgorithmAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredModelAlgorithmAssociationRequest,
  output: DeleteConfiguredModelAlgorithmAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the information necessary to delete an ML input channel.
 */
export const deleteMLInputChannelData: (
  input: DeleteMLInputChannelDataRequest,
) => effect.Effect<
  DeleteMLInputChannelDataResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMLInputChannelDataRequest,
  output: DeleteMLInputChannelDataResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the model artifacts stored by the service.
 */
export const deleteTrainedModelOutput: (
  input: DeleteTrainedModelOutputRequest,
) => effect.Effect<
  DeleteTrainedModelOutputResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrainedModelOutputRequest,
  output: DeleteTrainedModelOutputResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Submits a request to cancel the trained model job.
 */
export const cancelTrainedModel: (
  input: CancelTrainedModelRequest,
) => effect.Effect<
  CancelTrainedModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTrainedModelRequest,
  output: CancelTrainedModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Submits a request to cancel a trained model inference job.
 */
export const cancelTrainedModelInferenceJob: (
  input: CancelTrainedModelInferenceJobRequest,
) => effect.Effect<
  CancelTrainedModelInferenceJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTrainedModelInferenceJobRequest,
  output: CancelTrainedModelInferenceJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the audience export jobs.
 */
export const listAudienceExportJobs: {
  (
    input: ListAudienceExportJobsRequest,
  ): effect.Effect<
    ListAudienceExportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAudienceExportJobsRequest,
  ) => stream.Stream<
    ListAudienceExportJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAudienceExportJobsRequest,
  ) => stream.Stream<
    AudienceExportJobSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAudienceExportJobsRequest,
  output: ListAudienceExportJobsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "audienceExportJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of audience generation jobs.
 */
export const listAudienceGenerationJobs: {
  (
    input: ListAudienceGenerationJobsRequest,
  ): effect.Effect<
    ListAudienceGenerationJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAudienceGenerationJobsRequest,
  ) => stream.Stream<
    ListAudienceGenerationJobsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAudienceGenerationJobsRequest,
  ) => stream.Stream<
    AudienceGenerationJobSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAudienceGenerationJobsRequest,
  output: ListAudienceGenerationJobsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "audienceGenerationJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of audience models.
 */
export const listAudienceModels: {
  (
    input: ListAudienceModelsRequest,
  ): effect.Effect<
    ListAudienceModelsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAudienceModelsRequest,
  ) => stream.Stream<
    ListAudienceModelsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAudienceModelsRequest,
  ) => stream.Stream<
    AudienceModelSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAudienceModelsRequest,
  output: ListAudienceModelsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "audienceModels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of the configured audience models.
 */
export const listConfiguredAudienceModels: {
  (
    input: ListConfiguredAudienceModelsRequest,
  ): effect.Effect<
    ListConfiguredAudienceModelsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredAudienceModelsRequest,
  ) => stream.Stream<
    ListConfiguredAudienceModelsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredAudienceModelsRequest,
  ) => stream.Stream<
    ConfiguredAudienceModelSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredAudienceModelsRequest,
  output: ListConfiguredAudienceModelsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configuredAudienceModels",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of configured model algorithms.
 */
export const listConfiguredModelAlgorithms: {
  (
    input: ListConfiguredModelAlgorithmsRequest,
  ): effect.Effect<
    ListConfiguredModelAlgorithmsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfiguredModelAlgorithmsRequest,
  ) => stream.Stream<
    ListConfiguredModelAlgorithmsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfiguredModelAlgorithmsRequest,
  ) => stream.Stream<
    ConfiguredModelAlgorithmSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfiguredModelAlgorithmsRequest,
  output: ListConfiguredModelAlgorithmsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "configuredModelAlgorithms",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of training datasets.
 */
export const listTrainingDatasets: {
  (
    input: ListTrainingDatasetsRequest,
  ): effect.Effect<
    ListTrainingDatasetsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTrainingDatasetsRequest,
  ) => stream.Stream<
    ListTrainingDatasetsResponse,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTrainingDatasetsRequest,
  ) => stream.Stream<
    TrainingDatasetSummary,
    AccessDeniedException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTrainingDatasetsRequest,
  output: ListTrainingDatasetsResponse,
  errors: [AccessDeniedException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "trainingDatasets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns information about an audience model
 */
export const getAudienceModel: (
  input: GetAudienceModelRequest,
) => effect.Effect<
  GetAudienceModelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAudienceModelRequest,
  output: GetAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specified configured audience model.
 */
export const getConfiguredAudienceModel: (
  input: GetConfiguredAudienceModelRequest,
) => effect.Effect<
  GetConfiguredAudienceModelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredAudienceModelRequest,
  output: GetConfiguredAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Create or update the resource policy for a configured audience model.
 */
export const putConfiguredAudienceModelPolicy: (
  input: PutConfiguredAudienceModelPolicyRequest,
) => effect.Effect<
  PutConfiguredAudienceModelPolicyResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutConfiguredAudienceModelPolicyRequest,
  output: PutConfiguredAudienceModelPolicyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a configured audience model policy.
 */
export const getConfiguredAudienceModelPolicy: (
  input: GetConfiguredAudienceModelPolicyRequest,
) => effect.Effect<
  GetConfiguredAudienceModelPolicyResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredAudienceModelPolicyRequest,
  output: GetConfiguredAudienceModelPolicyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a configured model algorithm.
 */
export const getConfiguredModelAlgorithm: (
  input: GetConfiguredModelAlgorithmRequest,
) => effect.Effect<
  GetConfiguredModelAlgorithmResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConfiguredModelAlgorithmRequest,
  output: GetConfiguredModelAlgorithmResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns information about a training dataset.
 */
export const getTrainingDataset: (
  input: GetTrainingDatasetRequest,
) => effect.Effect<
  GetTrainingDatasetResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTrainingDatasetRequest,
  output: GetTrainingDatasetResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified configured audience model policy.
 */
export const deleteConfiguredAudienceModelPolicy: (
  input: DeleteConfiguredAudienceModelPolicyRequest,
) => effect.Effect<
  DeleteConfiguredAudienceModelPolicyResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredAudienceModelPolicyRequest,
  output: DeleteConfiguredAudienceModelPolicyResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a provided resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds metadata tags to a specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Provides the information necessary to update a configured audience model. Updates that impact audience generation jobs take effect when a new job starts, but do not impact currently running jobs.
 */
export const updateConfiguredAudienceModel: (
  input: UpdateConfiguredAudienceModelRequest,
) => effect.Effect<
  UpdateConfiguredAudienceModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConfiguredAudienceModelRequest,
  output: UpdateConfiguredAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified audience generation job, and removes all data associated with the job.
 */
export const deleteAudienceGenerationJob: (
  input: DeleteAudienceGenerationJobRequest,
) => effect.Effect<
  DeleteAudienceGenerationJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAudienceGenerationJobRequest,
  output: DeleteAudienceGenerationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Specifies an audience model that you want to delete. You can't delete an audience model if there are any configured audience models that depend on the audience model.
 */
export const deleteAudienceModel: (
  input: DeleteAudienceModelRequest,
) => effect.Effect<
  DeleteAudienceModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAudienceModelRequest,
  output: DeleteAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified configured audience model. You can't delete a configured audience model if there are any lookalike models that use the configured audience model. If you delete a configured audience model, it will be removed from any collaborations that it is associated to.
 */
export const deleteConfiguredAudienceModel: (
  input: DeleteConfiguredAudienceModelRequest,
) => effect.Effect<
  DeleteConfiguredAudienceModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredAudienceModelRequest,
  output: DeleteConfiguredAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a configured model algorithm.
 */
export const deleteConfiguredModelAlgorithm: (
  input: DeleteConfiguredModelAlgorithmRequest,
) => effect.Effect<
  DeleteConfiguredModelAlgorithmResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConfiguredModelAlgorithmRequest,
  output: DeleteConfiguredModelAlgorithmResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Specifies a training dataset that you want to delete. You can't delete a training dataset if there are any audience models that depend on the training dataset. In Clean Rooms ML, the `TrainingDataset` is metadata that points to a Glue table, which is read only during `AudienceModel` creation. This action deletes the metadata.
 */
export const deleteTrainingDataset: (
  input: DeleteTrainingDatasetRequest,
) => effect.Effect<
  DeleteTrainingDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrainingDatasetRequest,
  output: DeleteTrainingDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the configured model algorithm associations in a collaboration.
 */
export const listCollaborationConfiguredModelAlgorithmAssociations: {
  (
    input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
  ): effect.Effect<
    ListCollaborationConfiguredModelAlgorithmAssociationsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
  ) => stream.Stream<
    ListCollaborationConfiguredModelAlgorithmAssociationsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
  ) => stream.Stream<
    CollaborationConfiguredModelAlgorithmAssociationSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollaborationConfiguredModelAlgorithmAssociationsRequest,
  output: ListCollaborationConfiguredModelAlgorithmAssociationsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "collaborationConfiguredModelAlgorithmAssociations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Defines the information necessary to create an audience model. An audience model is a machine learning model that Clean Rooms ML trains to measure similarity between users. Clean Rooms ML manages training and storing the audience model. The audience model can be used in multiple calls to the StartAudienceGenerationJob API.
 */
export const createAudienceModel: (
  input: CreateAudienceModelRequest,
) => effect.Effect<
  CreateAudienceModelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAudienceModelRequest,
  output: CreateAudienceModelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Provides the information to create an ML input channel. An ML input channel is the result of a query that can be used for ML modeling.
 */
export const createMLInputChannel: (
  input: CreateMLInputChannelRequest,
) => effect.Effect<
  CreateMLInputChannelResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMLInputChannelRequest,
  output: CreateMLInputChannelResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about an ML input channel.
 */
export const getMLInputChannel: (
  input: GetMLInputChannelRequest,
) => effect.Effect<
  GetMLInputChannelResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLInputChannelRequest,
  output: GetMLInputChannelResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Defines the information necessary to create a training dataset. In Clean Rooms ML, the `TrainingDataset` is metadata that points to a Glue table, which is read only during `AudienceModel` creation.
 */
export const createTrainingDataset: (
  input: CreateTrainingDatasetRequest,
) => effect.Effect<
  CreateTrainingDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrainingDatasetRequest,
  output: CreateTrainingDatasetResponse,
  errors: [AccessDeniedException, ConflictException, ValidationException],
}));
/**
 * Information necessary to start the audience generation job.
 */
export const startAudienceGenerationJob: (
  input: StartAudienceGenerationJobRequest,
) => effect.Effect<
  StartAudienceGenerationJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAudienceGenerationJobRequest,
  output: StartAudienceGenerationJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates a configured model algorithm to a collaboration for use by any member of the collaboration.
 */
export const createConfiguredModelAlgorithmAssociation: (
  input: CreateConfiguredModelAlgorithmAssociationRequest,
) => effect.Effect<
  CreateConfiguredModelAlgorithmAssociationResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConfiguredModelAlgorithmAssociationRequest,
  output: CreateConfiguredModelAlgorithmAssociationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
