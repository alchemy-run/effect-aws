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
const ns = T.XmlNamespace("http://hawksnest.amazonaws.com/doc/2019-11-15");
const svc = T.AwsApiService({
  sdkId: "FraudDetector",
  serviceShapeName: "AWSHawksNestServiceFacade",
});
const auth = T.AwsAuthSigv4({ name: "frauddetector" });
const ver = T.ServiceVersion("2019-11-15");
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
              `https://frauddetector-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://frauddetector-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://frauddetector.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://frauddetector.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Identifier = string;
export type S3BucketLocation = string;
export type IamRoleArn = string;
export type WholeNumberVersionString = string;
export type Description = string;
export type NoDashIdentifier = string;
export type Elements = string | redacted.Redacted<string>;
export type VariableType = string;
export type ModelIdentifier = string;
export type RuleExpression = string | redacted.Redacted<string>;
export type DeleteAuditHistory = boolean;
export type SageMakerEndpointIdentifier = string;
export type FloatVersionString = string;
export type DetectorVersionMaxResults = number;
export type ModelsMaxPageSize = number;
export type BatchImportsMaxPageSize = number;
export type BatchPredictionsMaxPageSize = number;
export type DetectorsMaxResults = number;
export type EntityTypesMaxResults = number;
export type UtcTimestampISO8601 = string;
export type EventTypesMaxResults = number;
export type ExternalModelsMaxResults = number;
export type LabelsMaxResults = number;
export type NextToken = string;
export type ListsElementsMaxResults = number;
export type ListsMetadataMaxResults = number;
export type OutcomesMaxResults = number;
export type RulesMaxResults = number;
export type VariablesMaxResults = number;
export type EventPredictionsMaxResults = number;
export type FraudDetectorArn = string;
export type TagsMaxResults = number;
export type KmsEncryptionKeyArn = string;
export type TagKey = string;
export type TagValue = string;
export type EntityRestrictedString = string;
export type VariableName = string;
export type VariableValue = string | redacted.Redacted<string>;
export type FilterString = string;
export type UseEventVariables = boolean;
export type ModelInputTemplate = string;
export type ContentType = string;
export type Integer2 = number;
export type SensitiveString = string | redacted.Redacted<string>;
export type AttributeKey = string;
export type AttributeValue = string | redacted.Redacted<string>;

//# Schemas
export interface GetKMSEncryptionKeyRequest {}
export const GetKMSEncryptionKeyRequest = S.suspend(() =>
  S.Struct({}).pipe(
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
  identifier: "GetKMSEncryptionKeyRequest",
}) as any as S.Schema<GetKMSEncryptionKeyRequest>;
export type NameList = string[];
export const NameList = S.Array(S.String);
export type ListOfStrings = string[];
export const ListOfStrings = S.Array(S.String);
export type RuleExecutionMode = "ALL_MATCHED" | "FIRST_MATCHED";
export const RuleExecutionMode = S.Literal("ALL_MATCHED", "FIRST_MATCHED");
export type ElementsList = string | redacted.Redacted<string>[];
export const ElementsList = S.Array(SensitiveString);
export type ModelTypeEnum =
  | "ONLINE_FRAUD_INSIGHTS"
  | "TRANSACTION_FRAUD_INSIGHTS"
  | "ACCOUNT_TAKEOVER_INSIGHTS";
export const ModelTypeEnum = S.Literal(
  "ONLINE_FRAUD_INSIGHTS",
  "TRANSACTION_FRAUD_INSIGHTS",
  "ACCOUNT_TAKEOVER_INSIGHTS",
);
export type TrainingDataSourceEnum = "EXTERNAL_EVENTS" | "INGESTED_EVENTS";
export const TrainingDataSourceEnum = S.Literal(
  "EXTERNAL_EVENTS",
  "INGESTED_EVENTS",
);
export type Language = "DETECTORPL";
export const Language = S.Literal("DETECTORPL");
export type NonEmptyListOfStrings = string[];
export const NonEmptyListOfStrings = S.Array(S.String);
export type DataType = "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN" | "DATETIME";
export const DataType = S.Literal(
  "STRING",
  "INTEGER",
  "FLOAT",
  "BOOLEAN",
  "DATETIME",
);
export type DataSource = "EVENT" | "MODEL_SCORE" | "EXTERNAL_MODEL_SCORE";
export const DataSource = S.Literal(
  "EVENT",
  "MODEL_SCORE",
  "EXTERNAL_MODEL_SCORE",
);
export type EventIngestion = "ENABLED" | "DISABLED";
export const EventIngestion = S.Literal("ENABLED", "DISABLED");
export type ModelSource = "SAGEMAKER";
export const ModelSource = S.Literal("SAGEMAKER");
export type ModelEndpointStatus = "ASSOCIATED" | "DISSOCIATED";
export const ModelEndpointStatus = S.Literal("ASSOCIATED", "DISSOCIATED");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type DetectorVersionStatus = "DRAFT" | "ACTIVE" | "INACTIVE";
export const DetectorVersionStatus = S.Literal("DRAFT", "ACTIVE", "INACTIVE");
export type ListUpdateMode = "REPLACE" | "APPEND" | "REMOVE";
export const ListUpdateMode = S.Literal("REPLACE", "APPEND", "REMOVE");
export type ModelVersionStatus = "ACTIVE" | "INACTIVE" | "TRAINING_CANCELLED";
export const ModelVersionStatus = S.Literal(
  "ACTIVE",
  "INACTIVE",
  "TRAINING_CANCELLED",
);
export interface BatchGetVariableRequest {
  names: string[];
}
export const BatchGetVariableRequest = S.suspend(() =>
  S.Struct({ names: NameList }).pipe(
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
  identifier: "BatchGetVariableRequest",
}) as any as S.Schema<BatchGetVariableRequest>;
export interface CancelBatchImportJobRequest {
  jobId: string;
}
export const CancelBatchImportJobRequest = S.suspend(() =>
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
  identifier: "CancelBatchImportJobRequest",
}) as any as S.Schema<CancelBatchImportJobRequest>;
export interface CancelBatchImportJobResult {}
export const CancelBatchImportJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelBatchImportJobResult",
}) as any as S.Schema<CancelBatchImportJobResult>;
export interface CancelBatchPredictionJobRequest {
  jobId: string;
}
export const CancelBatchPredictionJobRequest = S.suspend(() =>
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
  identifier: "CancelBatchPredictionJobRequest",
}) as any as S.Schema<CancelBatchPredictionJobRequest>;
export interface CancelBatchPredictionJobResult {}
export const CancelBatchPredictionJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelBatchPredictionJobResult",
}) as any as S.Schema<CancelBatchPredictionJobResult>;
export interface Tag {
  key: string;
  value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateBatchImportJobRequest {
  jobId: string;
  inputPath: string;
  outputPath: string;
  eventTypeName: string;
  iamRoleArn: string;
  tags?: Tag[];
}
export const CreateBatchImportJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    inputPath: S.String,
    outputPath: S.String,
    eventTypeName: S.String,
    iamRoleArn: S.String,
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
  identifier: "CreateBatchImportJobRequest",
}) as any as S.Schema<CreateBatchImportJobRequest>;
export interface CreateBatchImportJobResult {}
export const CreateBatchImportJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateBatchImportJobResult",
}) as any as S.Schema<CreateBatchImportJobResult>;
export interface CreateBatchPredictionJobRequest {
  jobId: string;
  inputPath: string;
  outputPath: string;
  eventTypeName: string;
  detectorName: string;
  detectorVersion?: string;
  iamRoleArn: string;
  tags?: Tag[];
}
export const CreateBatchPredictionJobRequest = S.suspend(() =>
  S.Struct({
    jobId: S.String,
    inputPath: S.String,
    outputPath: S.String,
    eventTypeName: S.String,
    detectorName: S.String,
    detectorVersion: S.optional(S.String),
    iamRoleArn: S.String,
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
  identifier: "CreateBatchPredictionJobRequest",
}) as any as S.Schema<CreateBatchPredictionJobRequest>;
export interface CreateBatchPredictionJobResult {}
export const CreateBatchPredictionJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateBatchPredictionJobResult",
}) as any as S.Schema<CreateBatchPredictionJobResult>;
export interface CreateListRequest {
  name: string;
  elements?: string | redacted.Redacted<string>[];
  variableType?: string;
  description?: string;
  tags?: Tag[];
}
export const CreateListRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    elements: S.optional(ElementsList),
    variableType: S.optional(S.String),
    description: S.optional(S.String),
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
  identifier: "CreateListRequest",
}) as any as S.Schema<CreateListRequest>;
export interface CreateListResult {}
export const CreateListResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateListResult",
}) as any as S.Schema<CreateListResult>;
export interface CreateModelRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  description?: string;
  eventTypeName: string;
  tags?: Tag[];
}
export const CreateModelRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    description: S.optional(S.String),
    eventTypeName: S.String,
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
  identifier: "CreateModelRequest",
}) as any as S.Schema<CreateModelRequest>;
export interface CreateModelResult {}
export const CreateModelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateModelResult",
}) as any as S.Schema<CreateModelResult>;
export interface CreateRuleRequest {
  ruleId: string;
  detectorId: string;
  description?: string;
  expression: string | redacted.Redacted<string>;
  language: Language;
  outcomes: string[];
  tags?: Tag[];
}
export const CreateRuleRequest = S.suspend(() =>
  S.Struct({
    ruleId: S.String,
    detectorId: S.String,
    description: S.optional(S.String),
    expression: SensitiveString,
    language: Language,
    outcomes: NonEmptyListOfStrings,
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
  identifier: "CreateRuleRequest",
}) as any as S.Schema<CreateRuleRequest>;
export interface CreateVariableRequest {
  name: string;
  dataType: DataType;
  dataSource: DataSource;
  defaultValue: string;
  description?: string;
  variableType?: string;
  tags?: Tag[];
}
export const CreateVariableRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    dataType: DataType,
    dataSource: DataSource,
    defaultValue: S.String,
    description: S.optional(S.String),
    variableType: S.optional(S.String),
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
  identifier: "CreateVariableRequest",
}) as any as S.Schema<CreateVariableRequest>;
export interface CreateVariableResult {}
export const CreateVariableResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateVariableResult",
}) as any as S.Schema<CreateVariableResult>;
export interface DeleteBatchImportJobRequest {
  jobId: string;
}
export const DeleteBatchImportJobRequest = S.suspend(() =>
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
  identifier: "DeleteBatchImportJobRequest",
}) as any as S.Schema<DeleteBatchImportJobRequest>;
export interface DeleteBatchImportJobResult {}
export const DeleteBatchImportJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBatchImportJobResult",
}) as any as S.Schema<DeleteBatchImportJobResult>;
export interface DeleteBatchPredictionJobRequest {
  jobId: string;
}
export const DeleteBatchPredictionJobRequest = S.suspend(() =>
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
  identifier: "DeleteBatchPredictionJobRequest",
}) as any as S.Schema<DeleteBatchPredictionJobRequest>;
export interface DeleteBatchPredictionJobResult {}
export const DeleteBatchPredictionJobResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteBatchPredictionJobResult",
}) as any as S.Schema<DeleteBatchPredictionJobResult>;
export interface DeleteDetectorRequest {
  detectorId: string;
}
export const DeleteDetectorRequest = S.suspend(() =>
  S.Struct({ detectorId: S.String }).pipe(
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
  identifier: "DeleteDetectorRequest",
}) as any as S.Schema<DeleteDetectorRequest>;
export interface DeleteDetectorResult {}
export const DeleteDetectorResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDetectorResult",
}) as any as S.Schema<DeleteDetectorResult>;
export interface DeleteDetectorVersionRequest {
  detectorId: string;
  detectorVersionId: string;
}
export const DeleteDetectorVersionRequest = S.suspend(() =>
  S.Struct({ detectorId: S.String, detectorVersionId: S.String }).pipe(
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
  identifier: "DeleteDetectorVersionRequest",
}) as any as S.Schema<DeleteDetectorVersionRequest>;
export interface DeleteDetectorVersionResult {}
export const DeleteDetectorVersionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteDetectorVersionResult",
}) as any as S.Schema<DeleteDetectorVersionResult>;
export interface DeleteEntityTypeRequest {
  name: string;
}
export const DeleteEntityTypeRequest = S.suspend(() =>
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
  identifier: "DeleteEntityTypeRequest",
}) as any as S.Schema<DeleteEntityTypeRequest>;
export interface DeleteEntityTypeResult {}
export const DeleteEntityTypeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEntityTypeResult",
}) as any as S.Schema<DeleteEntityTypeResult>;
export interface DeleteEventRequest {
  eventId: string;
  eventTypeName: string;
  deleteAuditHistory?: boolean;
}
export const DeleteEventRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    eventTypeName: S.String,
    deleteAuditHistory: S.optional(S.Boolean),
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
  identifier: "DeleteEventRequest",
}) as any as S.Schema<DeleteEventRequest>;
export interface DeleteEventResult {}
export const DeleteEventResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEventResult",
}) as any as S.Schema<DeleteEventResult>;
export interface DeleteEventsByEventTypeRequest {
  eventTypeName: string;
}
export const DeleteEventsByEventTypeRequest = S.suspend(() =>
  S.Struct({ eventTypeName: S.String }).pipe(
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
  identifier: "DeleteEventsByEventTypeRequest",
}) as any as S.Schema<DeleteEventsByEventTypeRequest>;
export interface DeleteEventTypeRequest {
  name: string;
}
export const DeleteEventTypeRequest = S.suspend(() =>
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
  identifier: "DeleteEventTypeRequest",
}) as any as S.Schema<DeleteEventTypeRequest>;
export interface DeleteEventTypeResult {}
export const DeleteEventTypeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteEventTypeResult",
}) as any as S.Schema<DeleteEventTypeResult>;
export interface DeleteExternalModelRequest {
  modelEndpoint: string;
}
export const DeleteExternalModelRequest = S.suspend(() =>
  S.Struct({ modelEndpoint: S.String }).pipe(
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
  identifier: "DeleteExternalModelRequest",
}) as any as S.Schema<DeleteExternalModelRequest>;
export interface DeleteExternalModelResult {}
export const DeleteExternalModelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteExternalModelResult",
}) as any as S.Schema<DeleteExternalModelResult>;
export interface DeleteLabelRequest {
  name: string;
}
export const DeleteLabelRequest = S.suspend(() =>
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
  identifier: "DeleteLabelRequest",
}) as any as S.Schema<DeleteLabelRequest>;
export interface DeleteLabelResult {}
export const DeleteLabelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLabelResult",
}) as any as S.Schema<DeleteLabelResult>;
export interface DeleteListRequest {
  name: string;
}
export const DeleteListRequest = S.suspend(() =>
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
  identifier: "DeleteListRequest",
}) as any as S.Schema<DeleteListRequest>;
export interface DeleteListResult {}
export const DeleteListResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteListResult",
}) as any as S.Schema<DeleteListResult>;
export interface DeleteModelRequest {
  modelId: string;
  modelType: ModelTypeEnum;
}
export const DeleteModelRequest = S.suspend(() =>
  S.Struct({ modelId: S.String, modelType: ModelTypeEnum }).pipe(
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
  identifier: "DeleteModelRequest",
}) as any as S.Schema<DeleteModelRequest>;
export interface DeleteModelResult {}
export const DeleteModelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteModelResult",
}) as any as S.Schema<DeleteModelResult>;
export interface DeleteModelVersionRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  modelVersionNumber: string;
}
export const DeleteModelVersionRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    modelVersionNumber: S.String,
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
  identifier: "DeleteModelVersionRequest",
}) as any as S.Schema<DeleteModelVersionRequest>;
export interface DeleteModelVersionResult {}
export const DeleteModelVersionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteModelVersionResult",
}) as any as S.Schema<DeleteModelVersionResult>;
export interface DeleteOutcomeRequest {
  name: string;
}
export const DeleteOutcomeRequest = S.suspend(() =>
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
  identifier: "DeleteOutcomeRequest",
}) as any as S.Schema<DeleteOutcomeRequest>;
export interface DeleteOutcomeResult {}
export const DeleteOutcomeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteOutcomeResult",
}) as any as S.Schema<DeleteOutcomeResult>;
export interface Rule {
  detectorId: string;
  ruleId: string;
  ruleVersion: string;
}
export const Rule = S.suspend(() =>
  S.Struct({ detectorId: S.String, ruleId: S.String, ruleVersion: S.String }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export interface DeleteRuleRequest {
  rule: Rule;
}
export const DeleteRuleRequest = S.suspend(() =>
  S.Struct({ rule: Rule }).pipe(
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
  identifier: "DeleteRuleRequest",
}) as any as S.Schema<DeleteRuleRequest>;
export interface DeleteRuleResult {}
export const DeleteRuleResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteRuleResult",
}) as any as S.Schema<DeleteRuleResult>;
export interface DeleteVariableRequest {
  name: string;
}
export const DeleteVariableRequest = S.suspend(() =>
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
  identifier: "DeleteVariableRequest",
}) as any as S.Schema<DeleteVariableRequest>;
export interface DeleteVariableResult {}
export const DeleteVariableResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteVariableResult",
}) as any as S.Schema<DeleteVariableResult>;
export interface DescribeDetectorRequest {
  detectorId: string;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeDetectorRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
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
  identifier: "DescribeDetectorRequest",
}) as any as S.Schema<DescribeDetectorRequest>;
export interface DescribeModelVersionsRequest {
  modelId?: string;
  modelVersionNumber?: string;
  modelType?: ModelTypeEnum;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeModelVersionsRequest = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelVersionNumber: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
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
  identifier: "DescribeModelVersionsRequest",
}) as any as S.Schema<DescribeModelVersionsRequest>;
export interface GetBatchImportJobsRequest {
  jobId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetBatchImportJobsRequest = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
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
  identifier: "GetBatchImportJobsRequest",
}) as any as S.Schema<GetBatchImportJobsRequest>;
export interface GetBatchPredictionJobsRequest {
  jobId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetBatchPredictionJobsRequest = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
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
  identifier: "GetBatchPredictionJobsRequest",
}) as any as S.Schema<GetBatchPredictionJobsRequest>;
export interface GetDeleteEventsByEventTypeStatusRequest {
  eventTypeName: string;
}
export const GetDeleteEventsByEventTypeStatusRequest = S.suspend(() =>
  S.Struct({ eventTypeName: S.String }).pipe(
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
  identifier: "GetDeleteEventsByEventTypeStatusRequest",
}) as any as S.Schema<GetDeleteEventsByEventTypeStatusRequest>;
export interface GetDetectorsRequest {
  detectorId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetDetectorsRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.optional(S.String),
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
  identifier: "GetDetectorsRequest",
}) as any as S.Schema<GetDetectorsRequest>;
export interface GetDetectorVersionRequest {
  detectorId: string;
  detectorVersionId: string;
}
export const GetDetectorVersionRequest = S.suspend(() =>
  S.Struct({ detectorId: S.String, detectorVersionId: S.String }).pipe(
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
  identifier: "GetDetectorVersionRequest",
}) as any as S.Schema<GetDetectorVersionRequest>;
export interface GetEntityTypesRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetEntityTypesRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetEntityTypesRequest",
}) as any as S.Schema<GetEntityTypesRequest>;
export interface GetEventRequest {
  eventId: string;
  eventTypeName: string;
}
export const GetEventRequest = S.suspend(() =>
  S.Struct({ eventId: S.String, eventTypeName: S.String }).pipe(
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
  identifier: "GetEventRequest",
}) as any as S.Schema<GetEventRequest>;
export interface GetEventPredictionMetadataRequest {
  eventId: string;
  eventTypeName: string;
  detectorId: string;
  detectorVersionId: string;
  predictionTimestamp: string;
}
export const GetEventPredictionMetadataRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    eventTypeName: S.String,
    detectorId: S.String,
    detectorVersionId: S.String,
    predictionTimestamp: S.String,
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
  identifier: "GetEventPredictionMetadataRequest",
}) as any as S.Schema<GetEventPredictionMetadataRequest>;
export interface GetEventTypesRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetEventTypesRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetEventTypesRequest",
}) as any as S.Schema<GetEventTypesRequest>;
export interface GetExternalModelsRequest {
  modelEndpoint?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetExternalModelsRequest = S.suspend(() =>
  S.Struct({
    modelEndpoint: S.optional(S.String),
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
  identifier: "GetExternalModelsRequest",
}) as any as S.Schema<GetExternalModelsRequest>;
export interface GetLabelsRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetLabelsRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetLabelsRequest",
}) as any as S.Schema<GetLabelsRequest>;
export interface GetListElementsRequest {
  name: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetListElementsRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
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
  identifier: "GetListElementsRequest",
}) as any as S.Schema<GetListElementsRequest>;
export interface GetListsMetadataRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetListsMetadataRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetListsMetadataRequest",
}) as any as S.Schema<GetListsMetadataRequest>;
export interface GetModelsRequest {
  modelId?: string;
  modelType?: ModelTypeEnum;
  nextToken?: string;
  maxResults?: number;
}
export const GetModelsRequest = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
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
  identifier: "GetModelsRequest",
}) as any as S.Schema<GetModelsRequest>;
export interface GetModelVersionRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  modelVersionNumber: string;
}
export const GetModelVersionRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    modelVersionNumber: S.String,
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
  identifier: "GetModelVersionRequest",
}) as any as S.Schema<GetModelVersionRequest>;
export interface GetOutcomesRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetOutcomesRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetOutcomesRequest",
}) as any as S.Schema<GetOutcomesRequest>;
export interface GetRulesRequest {
  ruleId?: string;
  detectorId: string;
  ruleVersion?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetRulesRequest = S.suspend(() =>
  S.Struct({
    ruleId: S.optional(S.String),
    detectorId: S.String,
    ruleVersion: S.optional(S.String),
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
  identifier: "GetRulesRequest",
}) as any as S.Schema<GetRulesRequest>;
export interface GetVariablesRequest {
  name?: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetVariablesRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  identifier: "GetVariablesRequest",
}) as any as S.Schema<GetVariablesRequest>;
export interface ListTagsForResourceRequest {
  resourceARN: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    resourceARN: S.String,
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutDetectorRequest {
  detectorId: string;
  description?: string;
  eventTypeName: string;
  tags?: Tag[];
}
export const PutDetectorRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    description: S.optional(S.String),
    eventTypeName: S.String,
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
  identifier: "PutDetectorRequest",
}) as any as S.Schema<PutDetectorRequest>;
export interface PutDetectorResult {}
export const PutDetectorResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutDetectorResult",
}) as any as S.Schema<PutDetectorResult>;
export interface PutEntityTypeRequest {
  name: string;
  description?: string;
  tags?: Tag[];
}
export const PutEntityTypeRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
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
  identifier: "PutEntityTypeRequest",
}) as any as S.Schema<PutEntityTypeRequest>;
export interface PutEntityTypeResult {}
export const PutEntityTypeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutEntityTypeResult",
}) as any as S.Schema<PutEntityTypeResult>;
export interface PutKMSEncryptionKeyRequest {
  kmsEncryptionKeyArn: string;
}
export const PutKMSEncryptionKeyRequest = S.suspend(() =>
  S.Struct({ kmsEncryptionKeyArn: S.String }).pipe(
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
  identifier: "PutKMSEncryptionKeyRequest",
}) as any as S.Schema<PutKMSEncryptionKeyRequest>;
export interface PutKMSEncryptionKeyResult {}
export const PutKMSEncryptionKeyResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutKMSEncryptionKeyResult",
}) as any as S.Schema<PutKMSEncryptionKeyResult>;
export interface PutLabelRequest {
  name: string;
  description?: string;
  tags?: Tag[];
}
export const PutLabelRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
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
  identifier: "PutLabelRequest",
}) as any as S.Schema<PutLabelRequest>;
export interface PutLabelResult {}
export const PutLabelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutLabelResult",
}) as any as S.Schema<PutLabelResult>;
export interface PutOutcomeRequest {
  name: string;
  description?: string;
  tags?: Tag[];
}
export const PutOutcomeRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
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
  identifier: "PutOutcomeRequest",
}) as any as S.Schema<PutOutcomeRequest>;
export interface PutOutcomeResult {}
export const PutOutcomeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutOutcomeResult",
}) as any as S.Schema<PutOutcomeResult>;
export type EventVariableMap = {
  [key: string]: string | redacted.Redacted<string>;
};
export const EventVariableMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export interface Entity {
  entityType: string;
  entityId: string;
}
export const Entity = S.suspend(() =>
  S.Struct({ entityType: S.String, entityId: S.String }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export type ListOfEntities = Entity[];
export const ListOfEntities = S.Array(Entity);
export interface SendEventRequest {
  eventId: string;
  eventTypeName: string;
  eventTimestamp: string;
  eventVariables: { [key: string]: string | redacted.Redacted<string> };
  assignedLabel?: string;
  labelTimestamp?: string;
  entities: Entity[];
}
export const SendEventRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    eventTypeName: S.String,
    eventTimestamp: S.String,
    eventVariables: EventVariableMap,
    assignedLabel: S.optional(S.String),
    labelTimestamp: S.optional(S.String),
    entities: ListOfEntities,
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
  identifier: "SendEventRequest",
}) as any as S.Schema<SendEventRequest>;
export interface SendEventResult {}
export const SendEventResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SendEventResult",
}) as any as S.Schema<SendEventResult>;
export interface TagResourceRequest {
  resourceARN: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tags: TagList }).pipe(
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResult {}
export const TagResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResult",
}) as any as S.Schema<TagResourceResult>;
export interface UntagResourceRequest {
  resourceARN: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceARN: S.String, tagKeys: TagKeyList }).pipe(
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResult {}
export const UntagResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResult",
}) as any as S.Schema<UntagResourceResult>;
export type RuleList = Rule[];
export const RuleList = S.Array(Rule);
export interface ModelVersion {
  modelId: string;
  modelType: ModelTypeEnum;
  modelVersionNumber: string;
  arn?: string;
}
export const ModelVersion = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    modelVersionNumber: S.String,
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "ModelVersion" }) as any as S.Schema<ModelVersion>;
export type ListOfModelVersions = ModelVersion[];
export const ListOfModelVersions = S.Array(ModelVersion);
export interface UpdateDetectorVersionRequest {
  detectorId: string;
  detectorVersionId: string;
  externalModelEndpoints: string[];
  rules: Rule[];
  description?: string;
  modelVersions?: ModelVersion[];
  ruleExecutionMode?: RuleExecutionMode;
}
export const UpdateDetectorVersionRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    detectorVersionId: S.String,
    externalModelEndpoints: ListOfStrings,
    rules: RuleList,
    description: S.optional(S.String),
    modelVersions: S.optional(ListOfModelVersions),
    ruleExecutionMode: S.optional(RuleExecutionMode),
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
  identifier: "UpdateDetectorVersionRequest",
}) as any as S.Schema<UpdateDetectorVersionRequest>;
export interface UpdateDetectorVersionResult {}
export const UpdateDetectorVersionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDetectorVersionResult",
}) as any as S.Schema<UpdateDetectorVersionResult>;
export interface UpdateDetectorVersionMetadataRequest {
  detectorId: string;
  detectorVersionId: string;
  description: string;
}
export const UpdateDetectorVersionMetadataRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    detectorVersionId: S.String,
    description: S.String,
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
  identifier: "UpdateDetectorVersionMetadataRequest",
}) as any as S.Schema<UpdateDetectorVersionMetadataRequest>;
export interface UpdateDetectorVersionMetadataResult {}
export const UpdateDetectorVersionMetadataResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDetectorVersionMetadataResult",
}) as any as S.Schema<UpdateDetectorVersionMetadataResult>;
export interface UpdateDetectorVersionStatusRequest {
  detectorId: string;
  detectorVersionId: string;
  status: DetectorVersionStatus;
}
export const UpdateDetectorVersionStatusRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    detectorVersionId: S.String,
    status: DetectorVersionStatus,
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
  identifier: "UpdateDetectorVersionStatusRequest",
}) as any as S.Schema<UpdateDetectorVersionStatusRequest>;
export interface UpdateDetectorVersionStatusResult {}
export const UpdateDetectorVersionStatusResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDetectorVersionStatusResult",
}) as any as S.Schema<UpdateDetectorVersionStatusResult>;
export interface UpdateEventLabelRequest {
  eventId: string;
  eventTypeName: string;
  assignedLabel: string;
  labelTimestamp: string;
}
export const UpdateEventLabelRequest = S.suspend(() =>
  S.Struct({
    eventId: S.String,
    eventTypeName: S.String,
    assignedLabel: S.String,
    labelTimestamp: S.String,
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
  identifier: "UpdateEventLabelRequest",
}) as any as S.Schema<UpdateEventLabelRequest>;
export interface UpdateEventLabelResult {}
export const UpdateEventLabelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateEventLabelResult",
}) as any as S.Schema<UpdateEventLabelResult>;
export interface UpdateListRequest {
  name: string;
  elements?: string | redacted.Redacted<string>[];
  description?: string;
  updateMode?: ListUpdateMode;
  variableType?: string;
}
export const UpdateListRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    elements: S.optional(ElementsList),
    description: S.optional(S.String),
    updateMode: S.optional(ListUpdateMode),
    variableType: S.optional(S.String),
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
  identifier: "UpdateListRequest",
}) as any as S.Schema<UpdateListRequest>;
export interface UpdateListResult {}
export const UpdateListResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateListResult",
}) as any as S.Schema<UpdateListResult>;
export interface UpdateModelRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  description?: string;
}
export const UpdateModelRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    description: S.optional(S.String),
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
  identifier: "UpdateModelRequest",
}) as any as S.Schema<UpdateModelRequest>;
export interface UpdateModelResult {}
export const UpdateModelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateModelResult",
}) as any as S.Schema<UpdateModelResult>;
export interface ExternalEventsDetail {
  dataLocation: string;
  dataAccessRoleArn: string;
}
export const ExternalEventsDetail = S.suspend(() =>
  S.Struct({ dataLocation: S.String, dataAccessRoleArn: S.String }),
).annotations({
  identifier: "ExternalEventsDetail",
}) as any as S.Schema<ExternalEventsDetail>;
export interface IngestedEventsTimeWindow {
  startTime: string;
  endTime: string;
}
export const IngestedEventsTimeWindow = S.suspend(() =>
  S.Struct({ startTime: S.String, endTime: S.String }),
).annotations({
  identifier: "IngestedEventsTimeWindow",
}) as any as S.Schema<IngestedEventsTimeWindow>;
export interface IngestedEventsDetail {
  ingestedEventsTimeWindow: IngestedEventsTimeWindow;
}
export const IngestedEventsDetail = S.suspend(() =>
  S.Struct({ ingestedEventsTimeWindow: IngestedEventsTimeWindow }),
).annotations({
  identifier: "IngestedEventsDetail",
}) as any as S.Schema<IngestedEventsDetail>;
export interface UpdateModelVersionRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  majorVersionNumber: string;
  externalEventsDetail?: ExternalEventsDetail;
  ingestedEventsDetail?: IngestedEventsDetail;
  tags?: Tag[];
}
export const UpdateModelVersionRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    majorVersionNumber: S.String,
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
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
  identifier: "UpdateModelVersionRequest",
}) as any as S.Schema<UpdateModelVersionRequest>;
export interface UpdateModelVersionStatusRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  modelVersionNumber: string;
  status: ModelVersionStatus;
}
export const UpdateModelVersionStatusRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    modelVersionNumber: S.String,
    status: ModelVersionStatus,
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
  identifier: "UpdateModelVersionStatusRequest",
}) as any as S.Schema<UpdateModelVersionStatusRequest>;
export interface UpdateModelVersionStatusResult {}
export const UpdateModelVersionStatusResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateModelVersionStatusResult",
}) as any as S.Schema<UpdateModelVersionStatusResult>;
export interface UpdateRuleMetadataRequest {
  rule: Rule;
  description: string;
}
export const UpdateRuleMetadataRequest = S.suspend(() =>
  S.Struct({ rule: Rule, description: S.String }).pipe(
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
  identifier: "UpdateRuleMetadataRequest",
}) as any as S.Schema<UpdateRuleMetadataRequest>;
export interface UpdateRuleMetadataResult {}
export const UpdateRuleMetadataResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateRuleMetadataResult",
}) as any as S.Schema<UpdateRuleMetadataResult>;
export interface UpdateRuleVersionRequest {
  rule: Rule;
  description?: string;
  expression: string | redacted.Redacted<string>;
  language: Language;
  outcomes: string[];
  tags?: Tag[];
}
export const UpdateRuleVersionRequest = S.suspend(() =>
  S.Struct({
    rule: Rule,
    description: S.optional(S.String),
    expression: SensitiveString,
    language: Language,
    outcomes: NonEmptyListOfStrings,
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
  identifier: "UpdateRuleVersionRequest",
}) as any as S.Schema<UpdateRuleVersionRequest>;
export interface UpdateVariableRequest {
  name: string;
  defaultValue?: string;
  description?: string;
  variableType?: string;
}
export const UpdateVariableRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    defaultValue: S.optional(S.String),
    description: S.optional(S.String),
    variableType: S.optional(S.String),
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
  identifier: "UpdateVariableRequest",
}) as any as S.Schema<UpdateVariableRequest>;
export interface UpdateVariableResult {}
export const UpdateVariableResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateVariableResult",
}) as any as S.Schema<UpdateVariableResult>;
export type ModelInputDataFormat = "TEXT_CSV" | "APPLICATION_JSON";
export const ModelInputDataFormat = S.Literal("TEXT_CSV", "APPLICATION_JSON");
export type ModelOutputDataFormat = "TEXT_CSV" | "APPLICATION_JSONLINES";
export const ModelOutputDataFormat = S.Literal(
  "TEXT_CSV",
  "APPLICATION_JSONLINES",
);
export interface VariableEntry {
  name?: string;
  dataType?: string;
  dataSource?: string;
  defaultValue?: string;
  description?: string;
  variableType?: string;
}
export const VariableEntry = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    dataType: S.optional(S.String),
    dataSource: S.optional(S.String),
    defaultValue: S.optional(S.String),
    description: S.optional(S.String),
    variableType: S.optional(S.String),
  }),
).annotations({
  identifier: "VariableEntry",
}) as any as S.Schema<VariableEntry>;
export type VariableEntryList = VariableEntry[];
export const VariableEntryList = S.Array(VariableEntry);
export type AsyncJobStatus =
  | "IN_PROGRESS_INITIALIZING"
  | "IN_PROGRESS"
  | "CANCEL_IN_PROGRESS"
  | "CANCELED"
  | "COMPLETE"
  | "FAILED";
export const AsyncJobStatus = S.Literal(
  "IN_PROGRESS_INITIALIZING",
  "IN_PROGRESS",
  "CANCEL_IN_PROGRESS",
  "CANCELED",
  "COMPLETE",
  "FAILED",
);
export interface KMSKey {
  kmsEncryptionKeyArn?: string;
}
export const KMSKey = S.suspend(() =>
  S.Struct({ kmsEncryptionKeyArn: S.optional(S.String) }),
).annotations({ identifier: "KMSKey" }) as any as S.Schema<KMSKey>;
export interface FilterCondition {
  value?: string;
}
export const FilterCondition = S.suspend(() =>
  S.Struct({ value: S.optional(S.String) }),
).annotations({
  identifier: "FilterCondition",
}) as any as S.Schema<FilterCondition>;
export interface PredictionTimeRange {
  startTime: string;
  endTime: string;
}
export const PredictionTimeRange = S.suspend(() =>
  S.Struct({ startTime: S.String, endTime: S.String }),
).annotations({
  identifier: "PredictionTimeRange",
}) as any as S.Schema<PredictionTimeRange>;
export interface EventOrchestration {
  eventBridgeEnabled: boolean;
}
export const EventOrchestration = S.suspend(() =>
  S.Struct({ eventBridgeEnabled: S.Boolean }),
).annotations({
  identifier: "EventOrchestration",
}) as any as S.Schema<EventOrchestration>;
export interface ModelInputConfiguration {
  eventTypeName?: string;
  format?: ModelInputDataFormat;
  useEventVariables: boolean;
  jsonInputTemplate?: string;
  csvInputTemplate?: string;
}
export const ModelInputConfiguration = S.suspend(() =>
  S.Struct({
    eventTypeName: S.optional(S.String),
    format: S.optional(ModelInputDataFormat),
    useEventVariables: S.Boolean,
    jsonInputTemplate: S.optional(S.String),
    csvInputTemplate: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelInputConfiguration",
}) as any as S.Schema<ModelInputConfiguration>;
export type UnlabeledEventsTreatment = "IGNORE" | "FRAUD" | "LEGIT" | "AUTO";
export const UnlabeledEventsTreatment = S.Literal(
  "IGNORE",
  "FRAUD",
  "LEGIT",
  "AUTO",
);
export interface BatchCreateVariableRequest {
  variableEntries: VariableEntry[];
  tags?: Tag[];
}
export const BatchCreateVariableRequest = S.suspend(() =>
  S.Struct({
    variableEntries: VariableEntryList,
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
  identifier: "BatchCreateVariableRequest",
}) as any as S.Schema<BatchCreateVariableRequest>;
export interface CreateDetectorVersionRequest {
  detectorId: string;
  description?: string;
  externalModelEndpoints?: string[];
  rules: Rule[];
  modelVersions?: ModelVersion[];
  ruleExecutionMode?: RuleExecutionMode;
  tags?: Tag[];
}
export const CreateDetectorVersionRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    description: S.optional(S.String),
    externalModelEndpoints: S.optional(ListOfStrings),
    rules: RuleList,
    modelVersions: S.optional(ListOfModelVersions),
    ruleExecutionMode: S.optional(RuleExecutionMode),
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
  identifier: "CreateDetectorVersionRequest",
}) as any as S.Schema<CreateDetectorVersionRequest>;
export interface CreateRuleResult {
  rule?: Rule;
}
export const CreateRuleResult = S.suspend(() =>
  S.Struct({ rule: S.optional(Rule) }).pipe(ns),
).annotations({
  identifier: "CreateRuleResult",
}) as any as S.Schema<CreateRuleResult>;
export interface DeleteEventsByEventTypeResult {
  eventTypeName?: string;
  eventsDeletionStatus?: string;
}
export const DeleteEventsByEventTypeResult = S.suspend(() =>
  S.Struct({
    eventTypeName: S.optional(S.String),
    eventsDeletionStatus: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteEventsByEventTypeResult",
}) as any as S.Schema<DeleteEventsByEventTypeResult>;
export interface GetDeleteEventsByEventTypeStatusResult {
  eventTypeName?: string;
  eventsDeletionStatus?: AsyncJobStatus;
}
export const GetDeleteEventsByEventTypeStatusResult = S.suspend(() =>
  S.Struct({
    eventTypeName: S.optional(S.String),
    eventsDeletionStatus: S.optional(AsyncJobStatus),
  }).pipe(ns),
).annotations({
  identifier: "GetDeleteEventsByEventTypeStatusResult",
}) as any as S.Schema<GetDeleteEventsByEventTypeStatusResult>;
export interface GetDetectorVersionResult {
  detectorId?: string;
  detectorVersionId?: string;
  description?: string;
  externalModelEndpoints?: string[];
  modelVersions?: ModelVersion[];
  rules?: Rule[];
  status?: DetectorVersionStatus;
  lastUpdatedTime?: string;
  createdTime?: string;
  ruleExecutionMode?: RuleExecutionMode;
  arn?: string;
}
export const GetDetectorVersionResult = S.suspend(() =>
  S.Struct({
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    description: S.optional(S.String),
    externalModelEndpoints: S.optional(ListOfStrings),
    modelVersions: S.optional(ListOfModelVersions),
    rules: S.optional(RuleList),
    status: S.optional(DetectorVersionStatus),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    ruleExecutionMode: S.optional(RuleExecutionMode),
    arn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDetectorVersionResult",
}) as any as S.Schema<GetDetectorVersionResult>;
export interface GetKMSEncryptionKeyResult {
  kmsKey?: KMSKey;
}
export const GetKMSEncryptionKeyResult = S.suspend(() =>
  S.Struct({ kmsKey: S.optional(KMSKey) }).pipe(ns),
).annotations({
  identifier: "GetKMSEncryptionKeyResult",
}) as any as S.Schema<GetKMSEncryptionKeyResult>;
export interface GetListElementsResult {
  elements?: string | redacted.Redacted<string>[];
  nextToken?: string;
}
export const GetListElementsResult = S.suspend(() =>
  S.Struct({
    elements: S.optional(ElementsList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetListElementsResult",
}) as any as S.Schema<GetListElementsResult>;
export type LabelMapper = { [key: string]: string[] };
export const LabelMapper = S.Record({ key: S.String, value: ListOfStrings });
export interface LabelSchema {
  labelMapper?: { [key: string]: string[] };
  unlabeledEventsTreatment?: UnlabeledEventsTreatment;
}
export const LabelSchema = S.suspend(() =>
  S.Struct({
    labelMapper: S.optional(LabelMapper),
    unlabeledEventsTreatment: S.optional(UnlabeledEventsTreatment),
  }),
).annotations({ identifier: "LabelSchema" }) as any as S.Schema<LabelSchema>;
export interface TrainingDataSchema {
  modelVariables: string[];
  labelSchema?: LabelSchema;
}
export const TrainingDataSchema = S.suspend(() =>
  S.Struct({
    modelVariables: ListOfStrings,
    labelSchema: S.optional(LabelSchema),
  }),
).annotations({
  identifier: "TrainingDataSchema",
}) as any as S.Schema<TrainingDataSchema>;
export interface GetModelVersionResult {
  modelId?: string;
  modelType?: ModelTypeEnum;
  modelVersionNumber?: string;
  trainingDataSource?: TrainingDataSourceEnum;
  trainingDataSchema?: TrainingDataSchema;
  externalEventsDetail?: ExternalEventsDetail;
  ingestedEventsDetail?: IngestedEventsDetail;
  status?: string;
  arn?: string;
}
export const GetModelVersionResult = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
    modelVersionNumber: S.optional(S.String),
    trainingDataSource: S.optional(TrainingDataSourceEnum),
    trainingDataSchema: S.optional(TrainingDataSchema),
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
    status: S.optional(S.String),
    arn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetModelVersionResult",
}) as any as S.Schema<GetModelVersionResult>;
export interface Variable {
  name?: string;
  dataType?: DataType;
  dataSource?: DataSource;
  defaultValue?: string;
  description?: string;
  variableType?: string;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const Variable = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    dataType: S.optional(DataType),
    dataSource: S.optional(DataSource),
    defaultValue: S.optional(S.String),
    description: S.optional(S.String),
    variableType: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Variable" }) as any as S.Schema<Variable>;
export type VariableList = Variable[];
export const VariableList = S.Array(Variable);
export interface GetVariablesResult {
  variables?: Variable[];
  nextToken?: string;
}
export const GetVariablesResult = S.suspend(() =>
  S.Struct({
    variables: S.optional(VariableList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetVariablesResult",
}) as any as S.Schema<GetVariablesResult>;
export interface ListEventPredictionsRequest {
  eventId?: FilterCondition;
  eventType?: FilterCondition;
  detectorId?: FilterCondition;
  detectorVersionId?: FilterCondition;
  predictionTimeRange?: PredictionTimeRange;
  nextToken?: string;
  maxResults?: number;
}
export const ListEventPredictionsRequest = S.suspend(() =>
  S.Struct({
    eventId: S.optional(FilterCondition),
    eventType: S.optional(FilterCondition),
    detectorId: S.optional(FilterCondition),
    detectorVersionId: S.optional(FilterCondition),
    predictionTimeRange: S.optional(PredictionTimeRange),
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
  identifier: "ListEventPredictionsRequest",
}) as any as S.Schema<ListEventPredictionsRequest>;
export interface ListTagsForResourceResult {
  tags?: Tag[];
  nextToken?: string;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ tags: S.optional(TagList), nextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface PutEventTypeRequest {
  name: string;
  description?: string;
  eventVariables: string[];
  labels?: string[];
  entityTypes: string[];
  eventIngestion?: EventIngestion;
  tags?: Tag[];
  eventOrchestration?: EventOrchestration;
}
export const PutEventTypeRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    eventVariables: NonEmptyListOfStrings,
    labels: S.optional(ListOfStrings),
    entityTypes: NonEmptyListOfStrings,
    eventIngestion: S.optional(EventIngestion),
    tags: S.optional(TagList),
    eventOrchestration: S.optional(EventOrchestration),
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
  identifier: "PutEventTypeRequest",
}) as any as S.Schema<PutEventTypeRequest>;
export interface PutEventTypeResult {}
export const PutEventTypeResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutEventTypeResult",
}) as any as S.Schema<PutEventTypeResult>;
export interface UpdateModelVersionResult {
  modelId?: string;
  modelType?: ModelTypeEnum;
  modelVersionNumber?: string;
  status?: string;
}
export const UpdateModelVersionResult = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
    modelVersionNumber: S.optional(S.String),
    status: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateModelVersionResult",
}) as any as S.Schema<UpdateModelVersionResult>;
export interface UpdateRuleVersionResult {
  rule?: Rule;
}
export const UpdateRuleVersionResult = S.suspend(() =>
  S.Struct({ rule: S.optional(Rule) }).pipe(ns),
).annotations({
  identifier: "UpdateRuleVersionResult",
}) as any as S.Schema<UpdateRuleVersionResult>;
export interface ModelEndpointDataBlob {
  byteBuffer?: Uint8Array;
  contentType?: string;
}
export const ModelEndpointDataBlob = S.suspend(() =>
  S.Struct({
    byteBuffer: S.optional(T.Blob),
    contentType: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelEndpointDataBlob",
}) as any as S.Schema<ModelEndpointDataBlob>;
export type JsonKeyToVariableMap = { [key: string]: string };
export const JsonKeyToVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export type CsvIndexToVariableMap = { [key: string]: string };
export const CsvIndexToVariableMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface BatchGetVariableError {
  name?: string;
  code?: number;
  message?: string;
}
export const BatchGetVariableError = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    code: S.optional(S.Number),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchGetVariableError",
}) as any as S.Schema<BatchGetVariableError>;
export type BatchGetVariableErrorList = BatchGetVariableError[];
export const BatchGetVariableErrorList = S.Array(BatchGetVariableError);
export interface DetectorVersionSummary {
  detectorVersionId?: string;
  status?: DetectorVersionStatus;
  description?: string;
  lastUpdatedTime?: string;
}
export const DetectorVersionSummary = S.suspend(() =>
  S.Struct({
    detectorVersionId: S.optional(S.String),
    status: S.optional(DetectorVersionStatus),
    description: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "DetectorVersionSummary",
}) as any as S.Schema<DetectorVersionSummary>;
export type DetectorVersionSummaryList = DetectorVersionSummary[];
export const DetectorVersionSummaryList = S.Array(DetectorVersionSummary);
export interface BatchImport {
  jobId?: string;
  status?: AsyncJobStatus;
  failureReason?: string;
  startTime?: string;
  completionTime?: string;
  inputPath?: string;
  outputPath?: string;
  eventTypeName?: string;
  iamRoleArn?: string;
  arn?: string;
  processedRecordsCount?: number;
  failedRecordsCount?: number;
  totalRecordsCount?: number;
}
export const BatchImport = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    status: S.optional(AsyncJobStatus),
    failureReason: S.optional(S.String),
    startTime: S.optional(S.String),
    completionTime: S.optional(S.String),
    inputPath: S.optional(S.String),
    outputPath: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    iamRoleArn: S.optional(S.String),
    arn: S.optional(S.String),
    processedRecordsCount: S.optional(S.Number),
    failedRecordsCount: S.optional(S.Number),
    totalRecordsCount: S.optional(S.Number),
  }),
).annotations({ identifier: "BatchImport" }) as any as S.Schema<BatchImport>;
export type BatchImportList = BatchImport[];
export const BatchImportList = S.Array(BatchImport);
export interface BatchPrediction {
  jobId?: string;
  status?: AsyncJobStatus;
  failureReason?: string;
  startTime?: string;
  completionTime?: string;
  lastHeartbeatTime?: string;
  inputPath?: string;
  outputPath?: string;
  eventTypeName?: string;
  detectorName?: string;
  detectorVersion?: string;
  iamRoleArn?: string;
  arn?: string;
  processedRecordsCount?: number;
  totalRecordsCount?: number;
}
export const BatchPrediction = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    status: S.optional(AsyncJobStatus),
    failureReason: S.optional(S.String),
    startTime: S.optional(S.String),
    completionTime: S.optional(S.String),
    lastHeartbeatTime: S.optional(S.String),
    inputPath: S.optional(S.String),
    outputPath: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    detectorName: S.optional(S.String),
    detectorVersion: S.optional(S.String),
    iamRoleArn: S.optional(S.String),
    arn: S.optional(S.String),
    processedRecordsCount: S.optional(S.Number),
    totalRecordsCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchPrediction",
}) as any as S.Schema<BatchPrediction>;
export type BatchPredictionList = BatchPrediction[];
export const BatchPredictionList = S.Array(BatchPrediction);
export interface Detector {
  detectorId?: string;
  description?: string;
  eventTypeName?: string;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const Detector = S.suspend(() =>
  S.Struct({
    detectorId: S.optional(S.String),
    description: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Detector" }) as any as S.Schema<Detector>;
export type DetectorList = Detector[];
export const DetectorList = S.Array(Detector);
export interface EntityType {
  name?: string;
  description?: string;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const EntityType = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "EntityType" }) as any as S.Schema<EntityType>;
export type EntityTypeList = EntityType[];
export const EntityTypeList = S.Array(EntityType);
export type ExternalModelEndpointDataBlobMap = {
  [key: string]: ModelEndpointDataBlob;
};
export const ExternalModelEndpointDataBlobMap = S.Record({
  key: S.String,
  value: ModelEndpointDataBlob,
});
export interface EventVariableSummary {
  name?: string | redacted.Redacted<string>;
  value?: string | redacted.Redacted<string>;
  source?: string | redacted.Redacted<string>;
}
export const EventVariableSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(SensitiveString),
    value: S.optional(SensitiveString),
    source: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "EventVariableSummary",
}) as any as S.Schema<EventVariableSummary>;
export type ListOfEventVariableSummaries = EventVariableSummary[];
export const ListOfEventVariableSummaries = S.Array(EventVariableSummary);
export interface EvaluatedRule {
  ruleId?: string;
  ruleVersion?: string;
  expression?: string | redacted.Redacted<string>;
  expressionWithValues?: string | redacted.Redacted<string>;
  outcomes?: string[];
  evaluated?: boolean;
  matched?: boolean;
}
export const EvaluatedRule = S.suspend(() =>
  S.Struct({
    ruleId: S.optional(S.String),
    ruleVersion: S.optional(S.String),
    expression: S.optional(SensitiveString),
    expressionWithValues: S.optional(SensitiveString),
    outcomes: S.optional(ListOfStrings),
    evaluated: S.optional(S.Boolean),
    matched: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EvaluatedRule",
}) as any as S.Schema<EvaluatedRule>;
export type EvaluatedRuleList = EvaluatedRule[];
export const EvaluatedRuleList = S.Array(EvaluatedRule);
export interface ModelOutputConfiguration {
  format: ModelOutputDataFormat;
  jsonKeyToVariableMap?: { [key: string]: string };
  csvIndexToVariableMap?: { [key: string]: string };
}
export const ModelOutputConfiguration = S.suspend(() =>
  S.Struct({
    format: ModelOutputDataFormat,
    jsonKeyToVariableMap: S.optional(JsonKeyToVariableMap),
    csvIndexToVariableMap: S.optional(CsvIndexToVariableMap),
  }),
).annotations({
  identifier: "ModelOutputConfiguration",
}) as any as S.Schema<ModelOutputConfiguration>;
export interface ExternalModel {
  modelEndpoint?: string;
  modelSource?: ModelSource;
  invokeModelEndpointRoleArn?: string;
  inputConfiguration?: ModelInputConfiguration;
  outputConfiguration?: ModelOutputConfiguration;
  modelEndpointStatus?: ModelEndpointStatus;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const ExternalModel = S.suspend(() =>
  S.Struct({
    modelEndpoint: S.optional(S.String),
    modelSource: S.optional(ModelSource),
    invokeModelEndpointRoleArn: S.optional(S.String),
    inputConfiguration: S.optional(ModelInputConfiguration),
    outputConfiguration: S.optional(ModelOutputConfiguration),
    modelEndpointStatus: S.optional(ModelEndpointStatus),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "ExternalModel",
}) as any as S.Schema<ExternalModel>;
export type ExternalModelList = ExternalModel[];
export const ExternalModelList = S.Array(ExternalModel);
export interface Label {
  name?: string;
  description?: string;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const Label = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Label" }) as any as S.Schema<Label>;
export type LabelList = Label[];
export const LabelList = S.Array(Label);
export interface AllowDenyList {
  name: string;
  description?: string;
  variableType?: string;
  createdTime?: string;
  updatedTime?: string;
  arn?: string;
}
export const AllowDenyList = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    variableType: S.optional(S.String),
    createdTime: S.optional(S.String),
    updatedTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({
  identifier: "AllowDenyList",
}) as any as S.Schema<AllowDenyList>;
export type AllowDenyLists = AllowDenyList[];
export const AllowDenyLists = S.Array(AllowDenyList);
export interface Model {
  modelId?: string;
  modelType?: ModelTypeEnum;
  description?: string;
  eventTypeName?: string;
  createdTime?: string;
  lastUpdatedTime?: string;
  arn?: string;
}
export const Model = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
    description: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    createdTime: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Model" }) as any as S.Schema<Model>;
export type ModelList = Model[];
export const ModelList = S.Array(Model);
export interface Outcome {
  name?: string;
  description?: string;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const Outcome = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Outcome" }) as any as S.Schema<Outcome>;
export type OutcomeList = Outcome[];
export const OutcomeList = S.Array(Outcome);
export interface RuleDetail {
  ruleId?: string;
  description?: string;
  detectorId?: string;
  ruleVersion?: string;
  expression?: string | redacted.Redacted<string>;
  language?: Language;
  outcomes?: string[];
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
}
export const RuleDetail = S.suspend(() =>
  S.Struct({
    ruleId: S.optional(S.String),
    description: S.optional(S.String),
    detectorId: S.optional(S.String),
    ruleVersion: S.optional(S.String),
    expression: S.optional(SensitiveString),
    language: S.optional(Language),
    outcomes: S.optional(NonEmptyListOfStrings),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "RuleDetail" }) as any as S.Schema<RuleDetail>;
export type RuleDetailList = RuleDetail[];
export const RuleDetailList = S.Array(RuleDetail);
export interface BatchGetVariableResult {
  variables?: Variable[];
  errors?: BatchGetVariableError[];
}
export const BatchGetVariableResult = S.suspend(() =>
  S.Struct({
    variables: S.optional(VariableList),
    errors: S.optional(BatchGetVariableErrorList),
  }).pipe(ns),
).annotations({
  identifier: "BatchGetVariableResult",
}) as any as S.Schema<BatchGetVariableResult>;
export interface CreateDetectorVersionResult {
  detectorId?: string;
  detectorVersionId?: string;
  status?: DetectorVersionStatus;
}
export const CreateDetectorVersionResult = S.suspend(() =>
  S.Struct({
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    status: S.optional(DetectorVersionStatus),
  }).pipe(ns),
).annotations({
  identifier: "CreateDetectorVersionResult",
}) as any as S.Schema<CreateDetectorVersionResult>;
export interface DescribeDetectorResult {
  detectorId?: string;
  detectorVersionSummaries?: DetectorVersionSummary[];
  nextToken?: string;
  arn?: string;
}
export const DescribeDetectorResult = S.suspend(() =>
  S.Struct({
    detectorId: S.optional(S.String),
    detectorVersionSummaries: S.optional(DetectorVersionSummaryList),
    nextToken: S.optional(S.String),
    arn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDetectorResult",
}) as any as S.Schema<DescribeDetectorResult>;
export interface GetBatchImportJobsResult {
  batchImports?: BatchImport[];
  nextToken?: string;
}
export const GetBatchImportJobsResult = S.suspend(() =>
  S.Struct({
    batchImports: S.optional(BatchImportList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetBatchImportJobsResult",
}) as any as S.Schema<GetBatchImportJobsResult>;
export interface GetBatchPredictionJobsResult {
  batchPredictions?: BatchPrediction[];
  nextToken?: string;
}
export const GetBatchPredictionJobsResult = S.suspend(() =>
  S.Struct({
    batchPredictions: S.optional(BatchPredictionList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetBatchPredictionJobsResult",
}) as any as S.Schema<GetBatchPredictionJobsResult>;
export interface GetDetectorsResult {
  detectors?: Detector[];
  nextToken?: string;
}
export const GetDetectorsResult = S.suspend(() =>
  S.Struct({
    detectors: S.optional(DetectorList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetDetectorsResult",
}) as any as S.Schema<GetDetectorsResult>;
export interface GetEntityTypesResult {
  entityTypes?: EntityType[];
  nextToken?: string;
}
export const GetEntityTypesResult = S.suspend(() =>
  S.Struct({
    entityTypes: S.optional(EntityTypeList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetEntityTypesResult",
}) as any as S.Schema<GetEntityTypesResult>;
export interface GetEventPredictionRequest {
  detectorId: string;
  detectorVersionId?: string;
  eventId: string;
  eventTypeName: string;
  entities: Entity[];
  eventTimestamp: string;
  eventVariables: { [key: string]: string | redacted.Redacted<string> };
  externalModelEndpointDataBlobs?: { [key: string]: ModelEndpointDataBlob };
}
export const GetEventPredictionRequest = S.suspend(() =>
  S.Struct({
    detectorId: S.String,
    detectorVersionId: S.optional(S.String),
    eventId: S.String,
    eventTypeName: S.String,
    entities: ListOfEntities,
    eventTimestamp: S.String,
    eventVariables: EventVariableMap,
    externalModelEndpointDataBlobs: S.optional(
      ExternalModelEndpointDataBlobMap,
    ),
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
  identifier: "GetEventPredictionRequest",
}) as any as S.Schema<GetEventPredictionRequest>;
export interface GetExternalModelsResult {
  externalModels?: ExternalModel[];
  nextToken?: string;
}
export const GetExternalModelsResult = S.suspend(() =>
  S.Struct({
    externalModels: S.optional(ExternalModelList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetExternalModelsResult",
}) as any as S.Schema<GetExternalModelsResult>;
export interface GetLabelsResult {
  labels?: Label[];
  nextToken?: string;
}
export const GetLabelsResult = S.suspend(() =>
  S.Struct({
    labels: S.optional(LabelList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetLabelsResult",
}) as any as S.Schema<GetLabelsResult>;
export interface GetListsMetadataResult {
  lists?: AllowDenyList[];
  nextToken?: string;
}
export const GetListsMetadataResult = S.suspend(() =>
  S.Struct({
    lists: S.optional(AllowDenyLists),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetListsMetadataResult",
}) as any as S.Schema<GetListsMetadataResult>;
export interface GetModelsResult {
  nextToken?: string;
  models?: Model[];
}
export const GetModelsResult = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    models: S.optional(ModelList),
  }).pipe(ns),
).annotations({
  identifier: "GetModelsResult",
}) as any as S.Schema<GetModelsResult>;
export interface GetOutcomesResult {
  outcomes?: Outcome[];
  nextToken?: string;
}
export const GetOutcomesResult = S.suspend(() =>
  S.Struct({
    outcomes: S.optional(OutcomeList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetOutcomesResult",
}) as any as S.Schema<GetOutcomesResult>;
export interface GetRulesResult {
  ruleDetails?: RuleDetail[];
  nextToken?: string;
}
export const GetRulesResult = S.suspend(() =>
  S.Struct({
    ruleDetails: S.optional(RuleDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetRulesResult",
}) as any as S.Schema<GetRulesResult>;
export interface PutExternalModelRequest {
  modelEndpoint: string;
  modelSource: ModelSource;
  invokeModelEndpointRoleArn: string;
  inputConfiguration: ModelInputConfiguration;
  outputConfiguration: ModelOutputConfiguration;
  modelEndpointStatus: ModelEndpointStatus;
  tags?: Tag[];
}
export const PutExternalModelRequest = S.suspend(() =>
  S.Struct({
    modelEndpoint: S.String,
    modelSource: ModelSource,
    invokeModelEndpointRoleArn: S.String,
    inputConfiguration: ModelInputConfiguration,
    outputConfiguration: ModelOutputConfiguration,
    modelEndpointStatus: ModelEndpointStatus,
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
  identifier: "PutExternalModelRequest",
}) as any as S.Schema<PutExternalModelRequest>;
export interface PutExternalModelResult {}
export const PutExternalModelResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutExternalModelResult",
}) as any as S.Schema<PutExternalModelResult>;
export type EventAttributeMap = {
  [key: string]: string | redacted.Redacted<string>;
};
export const EventAttributeMap = S.Record({
  key: S.String,
  value: SensitiveString,
});
export type MapOfStrings = { [key: string]: string };
export const MapOfStrings = S.Record({ key: S.String, value: S.String });
export interface IngestedEventStatistics {
  numberOfEvents?: number;
  eventDataSizeInBytes?: number;
  leastRecentEvent?: string;
  mostRecentEvent?: string;
  lastUpdatedTime?: string;
}
export const IngestedEventStatistics = S.suspend(() =>
  S.Struct({
    numberOfEvents: S.optional(S.Number),
    eventDataSizeInBytes: S.optional(S.Number),
    leastRecentEvent: S.optional(S.String),
    mostRecentEvent: S.optional(S.String),
    lastUpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "IngestedEventStatistics",
}) as any as S.Schema<IngestedEventStatistics>;
export interface BatchCreateVariableError {
  name?: string;
  code?: number;
  message?: string;
}
export const BatchCreateVariableError = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    code: S.optional(S.Number),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchCreateVariableError",
}) as any as S.Schema<BatchCreateVariableError>;
export type BatchCreateVariableErrorList = BatchCreateVariableError[];
export const BatchCreateVariableErrorList = S.Array(BatchCreateVariableError);
export interface Event {
  eventId?: string;
  eventTypeName?: string;
  eventTimestamp?: string;
  eventVariables?: { [key: string]: string | redacted.Redacted<string> };
  currentLabel?: string;
  labelTimestamp?: string;
  entities?: Entity[];
}
export const Event = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    eventTimestamp: S.optional(S.String),
    eventVariables: S.optional(EventAttributeMap),
    currentLabel: S.optional(S.String),
    labelTimestamp: S.optional(S.String),
    entities: S.optional(ListOfEntities),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export interface EvaluatedExternalModel {
  modelEndpoint?: string;
  useEventVariables?: boolean;
  inputVariables?: { [key: string]: string };
  outputVariables?: { [key: string]: string };
}
export const EvaluatedExternalModel = S.suspend(() =>
  S.Struct({
    modelEndpoint: S.optional(S.String),
    useEventVariables: S.optional(S.Boolean),
    inputVariables: S.optional(MapOfStrings),
    outputVariables: S.optional(MapOfStrings),
  }),
).annotations({
  identifier: "EvaluatedExternalModel",
}) as any as S.Schema<EvaluatedExternalModel>;
export type ListOfEvaluatedExternalModels = EvaluatedExternalModel[];
export const ListOfEvaluatedExternalModels = S.Array(EvaluatedExternalModel);
export interface EventType {
  name?: string;
  description?: string;
  eventVariables?: string[];
  labels?: string[];
  entityTypes?: string[];
  eventIngestion?: EventIngestion;
  ingestedEventStatistics?: IngestedEventStatistics;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
  eventOrchestration?: EventOrchestration;
}
export const EventType = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    eventVariables: S.optional(ListOfStrings),
    labels: S.optional(ListOfStrings),
    entityTypes: S.optional(NonEmptyListOfStrings),
    eventIngestion: S.optional(EventIngestion),
    ingestedEventStatistics: S.optional(IngestedEventStatistics),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
    eventOrchestration: S.optional(EventOrchestration),
  }),
).annotations({ identifier: "EventType" }) as any as S.Schema<EventType>;
export type EventTypeList = EventType[];
export const EventTypeList = S.Array(EventType);
export interface EventPredictionSummary {
  eventId?: string;
  eventTypeName?: string;
  eventTimestamp?: string;
  predictionTimestamp?: string;
  detectorId?: string;
  detectorVersionId?: string;
}
export const EventPredictionSummary = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    eventTimestamp: S.optional(S.String),
    predictionTimestamp: S.optional(S.String),
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "EventPredictionSummary",
}) as any as S.Schema<EventPredictionSummary>;
export type ListOfEventPredictionSummaries = EventPredictionSummary[];
export const ListOfEventPredictionSummaries = S.Array(EventPredictionSummary);
export interface BatchCreateVariableResult {
  errors?: BatchCreateVariableError[];
}
export const BatchCreateVariableResult = S.suspend(() =>
  S.Struct({ errors: S.optional(BatchCreateVariableErrorList) }).pipe(ns),
).annotations({
  identifier: "BatchCreateVariableResult",
}) as any as S.Schema<BatchCreateVariableResult>;
export interface CreateModelVersionRequest {
  modelId: string;
  modelType: ModelTypeEnum;
  trainingDataSource: TrainingDataSourceEnum;
  trainingDataSchema: TrainingDataSchema;
  externalEventsDetail?: ExternalEventsDetail;
  ingestedEventsDetail?: IngestedEventsDetail;
  tags?: Tag[];
}
export const CreateModelVersionRequest = S.suspend(() =>
  S.Struct({
    modelId: S.String,
    modelType: ModelTypeEnum,
    trainingDataSource: TrainingDataSourceEnum,
    trainingDataSchema: TrainingDataSchema,
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
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
  identifier: "CreateModelVersionRequest",
}) as any as S.Schema<CreateModelVersionRequest>;
export interface GetEventResult {
  event?: Event;
}
export const GetEventResult = S.suspend(() =>
  S.Struct({ event: S.optional(Event) }).pipe(ns),
).annotations({
  identifier: "GetEventResult",
}) as any as S.Schema<GetEventResult>;
export interface GetEventTypesResult {
  eventTypes?: EventType[];
  nextToken?: string;
}
export const GetEventTypesResult = S.suspend(() =>
  S.Struct({
    eventTypes: S.optional(EventTypeList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetEventTypesResult",
}) as any as S.Schema<GetEventTypesResult>;
export interface ListEventPredictionsResult {
  eventPredictionSummaries?: EventPredictionSummary[];
  nextToken?: string;
}
export const ListEventPredictionsResult = S.suspend(() =>
  S.Struct({
    eventPredictionSummaries: S.optional(ListOfEventPredictionSummaries),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListEventPredictionsResult",
}) as any as S.Schema<ListEventPredictionsResult>;
export interface FileValidationMessage {
  title?: string;
  content?: string;
  type?: string;
}
export const FileValidationMessage = S.suspend(() =>
  S.Struct({
    title: S.optional(S.String),
    content: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "FileValidationMessage",
}) as any as S.Schema<FileValidationMessage>;
export type FileValidationMessageList = FileValidationMessage[];
export const FileValidationMessageList = S.Array(FileValidationMessage);
export interface FieldValidationMessage {
  fieldName?: string;
  identifier?: string;
  title?: string;
  content?: string;
  type?: string;
}
export const FieldValidationMessage = S.suspend(() =>
  S.Struct({
    fieldName: S.optional(S.String),
    identifier: S.optional(S.String),
    title: S.optional(S.String),
    content: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "FieldValidationMessage",
}) as any as S.Schema<FieldValidationMessage>;
export type FieldValidationMessageList = FieldValidationMessage[];
export const FieldValidationMessageList = S.Array(FieldValidationMessage);
export interface MetricDataPoint {
  fpr?: number;
  precision?: number;
  tpr?: number;
  threshold?: number;
}
export const MetricDataPoint = S.suspend(() =>
  S.Struct({
    fpr: S.optional(S.Number),
    precision: S.optional(S.Number),
    tpr: S.optional(S.Number),
    threshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "MetricDataPoint",
}) as any as S.Schema<MetricDataPoint>;
export type MetricDataPointsList = MetricDataPoint[];
export const MetricDataPointsList = S.Array(MetricDataPoint);
export interface LogOddsMetric {
  variableName: string;
  variableType: string;
  variableImportance: number;
}
export const LogOddsMetric = S.suspend(() =>
  S.Struct({
    variableName: S.String,
    variableType: S.String,
    variableImportance: S.Number,
  }),
).annotations({
  identifier: "LogOddsMetric",
}) as any as S.Schema<LogOddsMetric>;
export type ListOfLogOddsMetrics = LogOddsMetric[];
export const ListOfLogOddsMetrics = S.Array(LogOddsMetric);
export interface AggregatedLogOddsMetric {
  variableNames: string[];
  aggregatedVariablesImportance: number;
}
export const AggregatedLogOddsMetric = S.suspend(() =>
  S.Struct({
    variableNames: ListOfStrings,
    aggregatedVariablesImportance: S.Number,
  }),
).annotations({
  identifier: "AggregatedLogOddsMetric",
}) as any as S.Schema<AggregatedLogOddsMetric>;
export type ListOfAggregatedLogOddsMetrics = AggregatedLogOddsMetric[];
export const ListOfAggregatedLogOddsMetrics = S.Array(AggregatedLogOddsMetric);
export interface VariableImpactExplanation {
  eventVariableName?: string;
  relativeImpact?: string;
  logOddsImpact?: number;
}
export const VariableImpactExplanation = S.suspend(() =>
  S.Struct({
    eventVariableName: S.optional(S.String),
    relativeImpact: S.optional(S.String),
    logOddsImpact: S.optional(S.Number),
  }),
).annotations({
  identifier: "VariableImpactExplanation",
}) as any as S.Schema<VariableImpactExplanation>;
export type ListOfVariableImpactExplanations = VariableImpactExplanation[];
export const ListOfVariableImpactExplanations = S.Array(
  VariableImpactExplanation,
);
export interface AggregatedVariablesImpactExplanation {
  eventVariableNames?: string[];
  relativeImpact?: string;
  logOddsImpact?: number;
}
export const AggregatedVariablesImpactExplanation = S.suspend(() =>
  S.Struct({
    eventVariableNames: S.optional(ListOfStrings),
    relativeImpact: S.optional(S.String),
    logOddsImpact: S.optional(S.Number),
  }),
).annotations({
  identifier: "AggregatedVariablesImpactExplanation",
}) as any as S.Schema<AggregatedVariablesImpactExplanation>;
export type ListOfAggregatedVariablesImpactExplanations =
  AggregatedVariablesImpactExplanation[];
export const ListOfAggregatedVariablesImpactExplanations = S.Array(
  AggregatedVariablesImpactExplanation,
);
export interface RuleResult {
  ruleId?: string;
  outcomes?: string[];
}
export const RuleResult = S.suspend(() =>
  S.Struct({
    ruleId: S.optional(S.String),
    outcomes: S.optional(ListOfStrings),
  }),
).annotations({ identifier: "RuleResult" }) as any as S.Schema<RuleResult>;
export type ListOfRuleResults = RuleResult[];
export const ListOfRuleResults = S.Array(RuleResult);
export interface DataValidationMetrics {
  fileLevelMessages?: FileValidationMessage[];
  fieldLevelMessages?: FieldValidationMessage[];
}
export const DataValidationMetrics = S.suspend(() =>
  S.Struct({
    fileLevelMessages: S.optional(FileValidationMessageList),
    fieldLevelMessages: S.optional(FieldValidationMessageList),
  }),
).annotations({
  identifier: "DataValidationMetrics",
}) as any as S.Schema<DataValidationMetrics>;
export interface TrainingMetrics {
  auc?: number;
  metricDataPoints?: MetricDataPoint[];
}
export const TrainingMetrics = S.suspend(() =>
  S.Struct({
    auc: S.optional(S.Number),
    metricDataPoints: S.optional(MetricDataPointsList),
  }),
).annotations({
  identifier: "TrainingMetrics",
}) as any as S.Schema<TrainingMetrics>;
export interface VariableImportanceMetrics {
  logOddsMetrics?: LogOddsMetric[];
}
export const VariableImportanceMetrics = S.suspend(() =>
  S.Struct({ logOddsMetrics: S.optional(ListOfLogOddsMetrics) }),
).annotations({
  identifier: "VariableImportanceMetrics",
}) as any as S.Schema<VariableImportanceMetrics>;
export interface AggregatedVariablesImportanceMetrics {
  logOddsMetrics?: AggregatedLogOddsMetric[];
}
export const AggregatedVariablesImportanceMetrics = S.suspend(() =>
  S.Struct({ logOddsMetrics: S.optional(ListOfAggregatedLogOddsMetrics) }),
).annotations({
  identifier: "AggregatedVariablesImportanceMetrics",
}) as any as S.Schema<AggregatedVariablesImportanceMetrics>;
export interface PredictionExplanations {
  variableImpactExplanations?: VariableImpactExplanation[];
  aggregatedVariablesImpactExplanations?: AggregatedVariablesImpactExplanation[];
}
export const PredictionExplanations = S.suspend(() =>
  S.Struct({
    variableImpactExplanations: S.optional(ListOfVariableImpactExplanations),
    aggregatedVariablesImpactExplanations: S.optional(
      ListOfAggregatedVariablesImpactExplanations,
    ),
  }),
).annotations({
  identifier: "PredictionExplanations",
}) as any as S.Schema<PredictionExplanations>;
export interface CreateModelVersionResult {
  modelId?: string;
  modelType?: ModelTypeEnum;
  modelVersionNumber?: string;
  status?: string;
}
export const CreateModelVersionResult = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
    modelVersionNumber: S.optional(S.String),
    status: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateModelVersionResult",
}) as any as S.Schema<CreateModelVersionResult>;
export interface OFIMetricDataPoint {
  fpr?: number;
  precision?: number;
  tpr?: number;
  threshold?: number;
}
export const OFIMetricDataPoint = S.suspend(() =>
  S.Struct({
    fpr: S.optional(S.Number),
    precision: S.optional(S.Number),
    tpr: S.optional(S.Number),
    threshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "OFIMetricDataPoint",
}) as any as S.Schema<OFIMetricDataPoint>;
export type OFIMetricDataPointsList = OFIMetricDataPoint[];
export const OFIMetricDataPointsList = S.Array(OFIMetricDataPoint);
export interface TFIMetricDataPoint {
  fpr?: number;
  precision?: number;
  tpr?: number;
  threshold?: number;
}
export const TFIMetricDataPoint = S.suspend(() =>
  S.Struct({
    fpr: S.optional(S.Number),
    precision: S.optional(S.Number),
    tpr: S.optional(S.Number),
    threshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "TFIMetricDataPoint",
}) as any as S.Schema<TFIMetricDataPoint>;
export type TFIMetricDataPointsList = TFIMetricDataPoint[];
export const TFIMetricDataPointsList = S.Array(TFIMetricDataPoint);
export interface UncertaintyRange {
  lowerBoundValue: number;
  upperBoundValue: number;
}
export const UncertaintyRange = S.suspend(() =>
  S.Struct({ lowerBoundValue: S.Number, upperBoundValue: S.Number }),
).annotations({
  identifier: "UncertaintyRange",
}) as any as S.Schema<UncertaintyRange>;
export interface TFIModelPerformance {
  auc?: number;
  uncertaintyRange?: UncertaintyRange;
}
export const TFIModelPerformance = S.suspend(() =>
  S.Struct({
    auc: S.optional(S.Number),
    uncertaintyRange: S.optional(UncertaintyRange),
  }),
).annotations({
  identifier: "TFIModelPerformance",
}) as any as S.Schema<TFIModelPerformance>;
export interface ATIMetricDataPoint {
  cr?: number;
  adr?: number;
  threshold?: number;
  atodr?: number;
}
export const ATIMetricDataPoint = S.suspend(() =>
  S.Struct({
    cr: S.optional(S.Number),
    adr: S.optional(S.Number),
    threshold: S.optional(S.Number),
    atodr: S.optional(S.Number),
  }),
).annotations({
  identifier: "ATIMetricDataPoint",
}) as any as S.Schema<ATIMetricDataPoint>;
export type ATIMetricDataPointsList = ATIMetricDataPoint[];
export const ATIMetricDataPointsList = S.Array(ATIMetricDataPoint);
export interface ATIModelPerformance {
  asi?: number;
}
export const ATIModelPerformance = S.suspend(() =>
  S.Struct({ asi: S.optional(S.Number) }),
).annotations({
  identifier: "ATIModelPerformance",
}) as any as S.Schema<ATIModelPerformance>;
export interface TrainingResult {
  dataValidationMetrics?: DataValidationMetrics;
  trainingMetrics?: TrainingMetrics;
  variableImportanceMetrics?: VariableImportanceMetrics;
}
export const TrainingResult = S.suspend(() =>
  S.Struct({
    dataValidationMetrics: S.optional(DataValidationMetrics),
    trainingMetrics: S.optional(TrainingMetrics),
    variableImportanceMetrics: S.optional(VariableImportanceMetrics),
  }),
).annotations({
  identifier: "TrainingResult",
}) as any as S.Schema<TrainingResult>;
export type ModelPredictionMap = { [key: string]: number };
export const ModelPredictionMap = S.Record({ key: S.String, value: S.Number });
export interface ExternalModelSummary {
  modelEndpoint?: string;
  modelSource?: ModelSource;
}
export const ExternalModelSummary = S.suspend(() =>
  S.Struct({
    modelEndpoint: S.optional(S.String),
    modelSource: S.optional(ModelSource),
  }),
).annotations({
  identifier: "ExternalModelSummary",
}) as any as S.Schema<ExternalModelSummary>;
export type ExternalModelPredictionMap = { [key: string]: string };
export const ExternalModelPredictionMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface ModelVersionEvaluation {
  outputVariableName?: string;
  evaluationScore?: string;
  predictionExplanations?: PredictionExplanations;
}
export const ModelVersionEvaluation = S.suspend(() =>
  S.Struct({
    outputVariableName: S.optional(S.String),
    evaluationScore: S.optional(S.String),
    predictionExplanations: S.optional(PredictionExplanations),
  }),
).annotations({
  identifier: "ModelVersionEvaluation",
}) as any as S.Schema<ModelVersionEvaluation>;
export type ListOfModelVersionEvaluations = ModelVersionEvaluation[];
export const ListOfModelVersionEvaluations = S.Array(ModelVersionEvaluation);
export interface TFITrainingMetricsValue {
  metricDataPoints?: TFIMetricDataPoint[];
  modelPerformance?: TFIModelPerformance;
}
export const TFITrainingMetricsValue = S.suspend(() =>
  S.Struct({
    metricDataPoints: S.optional(TFIMetricDataPointsList),
    modelPerformance: S.optional(TFIModelPerformance),
  }),
).annotations({
  identifier: "TFITrainingMetricsValue",
}) as any as S.Schema<TFITrainingMetricsValue>;
export interface ATITrainingMetricsValue {
  metricDataPoints?: ATIMetricDataPoint[];
  modelPerformance?: ATIModelPerformance;
}
export const ATITrainingMetricsValue = S.suspend(() =>
  S.Struct({
    metricDataPoints: S.optional(ATIMetricDataPointsList),
    modelPerformance: S.optional(ATIModelPerformance),
  }),
).annotations({
  identifier: "ATITrainingMetricsValue",
}) as any as S.Schema<ATITrainingMetricsValue>;
export interface ModelScores {
  modelVersion?: ModelVersion;
  scores?: { [key: string]: number };
}
export const ModelScores = S.suspend(() =>
  S.Struct({
    modelVersion: S.optional(ModelVersion),
    scores: S.optional(ModelPredictionMap),
  }),
).annotations({ identifier: "ModelScores" }) as any as S.Schema<ModelScores>;
export type ListOfModelScores = ModelScores[];
export const ListOfModelScores = S.Array(ModelScores);
export interface ExternalModelOutputs {
  externalModel?: ExternalModelSummary;
  outputs?: { [key: string]: string };
}
export const ExternalModelOutputs = S.suspend(() =>
  S.Struct({
    externalModel: S.optional(ExternalModelSummary),
    outputs: S.optional(ExternalModelPredictionMap),
  }),
).annotations({
  identifier: "ExternalModelOutputs",
}) as any as S.Schema<ExternalModelOutputs>;
export type ListOfExternalModelOutputs = ExternalModelOutputs[];
export const ListOfExternalModelOutputs = S.Array(ExternalModelOutputs);
export interface EvaluatedModelVersion {
  modelId?: string;
  modelVersion?: string;
  modelType?: string;
  evaluations?: ModelVersionEvaluation[];
}
export const EvaluatedModelVersion = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelVersion: S.optional(S.String),
    modelType: S.optional(S.String),
    evaluations: S.optional(ListOfModelVersionEvaluations),
  }),
).annotations({
  identifier: "EvaluatedModelVersion",
}) as any as S.Schema<EvaluatedModelVersion>;
export type ListOfEvaluatedModelVersions = EvaluatedModelVersion[];
export const ListOfEvaluatedModelVersions = S.Array(EvaluatedModelVersion);
export interface OFIModelPerformance {
  auc?: number;
  uncertaintyRange?: UncertaintyRange;
}
export const OFIModelPerformance = S.suspend(() =>
  S.Struct({
    auc: S.optional(S.Number),
    uncertaintyRange: S.optional(UncertaintyRange),
  }),
).annotations({
  identifier: "OFIModelPerformance",
}) as any as S.Schema<OFIModelPerformance>;
export interface GetEventPredictionResult {
  modelScores?: ModelScores[];
  ruleResults?: RuleResult[];
  externalModelOutputs?: ExternalModelOutputs[];
}
export const GetEventPredictionResult = S.suspend(() =>
  S.Struct({
    modelScores: S.optional(ListOfModelScores),
    ruleResults: S.optional(ListOfRuleResults),
    externalModelOutputs: S.optional(ListOfExternalModelOutputs),
  }).pipe(ns),
).annotations({
  identifier: "GetEventPredictionResult",
}) as any as S.Schema<GetEventPredictionResult>;
export interface GetEventPredictionMetadataResult {
  eventId?: string;
  eventTypeName?: string;
  entityId?: string;
  entityType?: string;
  eventTimestamp?: string;
  detectorId?: string;
  detectorVersionId?: string;
  detectorVersionStatus?: string;
  eventVariables?: EventVariableSummary[];
  rules?: EvaluatedRule[];
  ruleExecutionMode?: RuleExecutionMode;
  outcomes?: string[];
  evaluatedModelVersions?: EvaluatedModelVersion[];
  evaluatedExternalModels?: EvaluatedExternalModel[];
  predictionTimestamp?: string;
}
export const GetEventPredictionMetadataResult = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    eventTypeName: S.optional(S.String),
    entityId: S.optional(S.String),
    entityType: S.optional(S.String),
    eventTimestamp: S.optional(S.String),
    detectorId: S.optional(S.String),
    detectorVersionId: S.optional(S.String),
    detectorVersionStatus: S.optional(S.String),
    eventVariables: S.optional(ListOfEventVariableSummaries),
    rules: S.optional(EvaluatedRuleList),
    ruleExecutionMode: S.optional(RuleExecutionMode),
    outcomes: S.optional(ListOfStrings),
    evaluatedModelVersions: S.optional(ListOfEvaluatedModelVersions),
    evaluatedExternalModels: S.optional(ListOfEvaluatedExternalModels),
    predictionTimestamp: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "GetEventPredictionMetadataResult",
}) as any as S.Schema<GetEventPredictionMetadataResult>;
export interface OFITrainingMetricsValue {
  metricDataPoints?: OFIMetricDataPoint[];
  modelPerformance?: OFIModelPerformance;
}
export const OFITrainingMetricsValue = S.suspend(() =>
  S.Struct({
    metricDataPoints: S.optional(OFIMetricDataPointsList),
    modelPerformance: S.optional(OFIModelPerformance),
  }),
).annotations({
  identifier: "OFITrainingMetricsValue",
}) as any as S.Schema<OFITrainingMetricsValue>;
export interface TrainingMetricsV2 {
  ofi?: OFITrainingMetricsValue;
  tfi?: TFITrainingMetricsValue;
  ati?: ATITrainingMetricsValue;
}
export const TrainingMetricsV2 = S.suspend(() =>
  S.Struct({
    ofi: S.optional(OFITrainingMetricsValue),
    tfi: S.optional(TFITrainingMetricsValue),
    ati: S.optional(ATITrainingMetricsValue),
  }),
).annotations({
  identifier: "TrainingMetricsV2",
}) as any as S.Schema<TrainingMetricsV2>;
export interface TrainingResultV2 {
  dataValidationMetrics?: DataValidationMetrics;
  trainingMetricsV2?: TrainingMetricsV2;
  variableImportanceMetrics?: VariableImportanceMetrics;
  aggregatedVariablesImportanceMetrics?: AggregatedVariablesImportanceMetrics;
}
export const TrainingResultV2 = S.suspend(() =>
  S.Struct({
    dataValidationMetrics: S.optional(DataValidationMetrics),
    trainingMetricsV2: S.optional(TrainingMetricsV2),
    variableImportanceMetrics: S.optional(VariableImportanceMetrics),
    aggregatedVariablesImportanceMetrics: S.optional(
      AggregatedVariablesImportanceMetrics,
    ),
  }),
).annotations({
  identifier: "TrainingResultV2",
}) as any as S.Schema<TrainingResultV2>;
export interface ModelVersionDetail {
  modelId?: string;
  modelType?: ModelTypeEnum;
  modelVersionNumber?: string;
  status?: string;
  trainingDataSource?: TrainingDataSourceEnum;
  trainingDataSchema?: TrainingDataSchema;
  externalEventsDetail?: ExternalEventsDetail;
  ingestedEventsDetail?: IngestedEventsDetail;
  trainingResult?: TrainingResult;
  lastUpdatedTime?: string;
  createdTime?: string;
  arn?: string;
  trainingResultV2?: TrainingResultV2;
}
export const ModelVersionDetail = S.suspend(() =>
  S.Struct({
    modelId: S.optional(S.String),
    modelType: S.optional(ModelTypeEnum),
    modelVersionNumber: S.optional(S.String),
    status: S.optional(S.String),
    trainingDataSource: S.optional(TrainingDataSourceEnum),
    trainingDataSchema: S.optional(TrainingDataSchema),
    externalEventsDetail: S.optional(ExternalEventsDetail),
    ingestedEventsDetail: S.optional(IngestedEventsDetail),
    trainingResult: S.optional(TrainingResult),
    lastUpdatedTime: S.optional(S.String),
    createdTime: S.optional(S.String),
    arn: S.optional(S.String),
    trainingResultV2: S.optional(TrainingResultV2),
  }),
).annotations({
  identifier: "ModelVersionDetail",
}) as any as S.Schema<ModelVersionDetail>;
export type ModelVersionDetailList = ModelVersionDetail[];
export const ModelVersionDetailList = S.Array(ModelVersionDetail);
export interface DescribeModelVersionsResult {
  modelVersionDetails?: ModelVersionDetail[];
  nextToken?: string;
}
export const DescribeModelVersionsResult = S.suspend(() =>
  S.Struct({
    modelVersionDetails: S.optional(ModelVersionDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeModelVersionsResult",
}) as any as S.Schema<DescribeModelVersionsResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Gets the encryption key if a KMS key has been specified to be used to encrypt content in Amazon Fraud Detector.
 */
export const getKMSEncryptionKey: (
  input: GetKMSEncryptionKeyRequest,
) => effect.Effect<
  GetKMSEncryptionKeyResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetKMSEncryptionKeyRequest,
  output: GetKMSEncryptionKeyResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Lists all tags associated with the resource. This is a paginated API. To get the next page results, provide the pagination token from the
 * response as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResult,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResult,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates or updates an Amazon SageMaker model endpoint. You can also use this action to update the configuration of the model endpoint, including the IAM role and/or the mapped variables.
 */
export const putExternalModel: (
  input: PutExternalModelRequest,
) => effect.Effect<
  PutExternalModelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutExternalModelRequest,
  output: PutExternalModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rule for use with the specified detector.
 */
export const createRule: (
  input: CreateRuleRequest,
) => effect.Effect<
  CreateRuleResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRuleRequest,
  output: CreateRuleResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a label.
 *
 * You cannot delete labels that are included in an event type in Amazon Fraud Detector.
 *
 * You cannot delete a label assigned to an event ID. You must first delete the relevant event ID.
 *
 * When you delete a label, Amazon Fraud Detector permanently deletes that label and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteLabel: (
  input: DeleteLabelRequest,
) => effect.Effect<
  DeleteLabelResult,
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLabelRequest,
  output: DeleteLabelResult,
  errors: [
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the status of a `DeleteEventsByEventType` action.
 */
export const getDeleteEventsByEventTypeStatus: (
  input: GetDeleteEventsByEventTypeStatusRequest,
) => effect.Effect<
  GetDeleteEventsByEventTypeStatusResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeleteEventsByEventTypeStatusRequest,
  output: GetDeleteEventsByEventTypeStatusResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a particular detector version.
 */
export const getDetectorVersion: (
  input: GetDetectorVersionRequest,
) => effect.Effect<
  GetDetectorVersionResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDetectorVersionRequest,
  output: GetDetectorVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all the elements in the specified list.
 */
export const getListElements: {
  (
    input: GetListElementsRequest,
  ): effect.Effect<
    GetListElementsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetListElementsRequest,
  ) => stream.Stream<
    GetListElementsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetListElementsRequest,
  ) => stream.Stream<
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
  input: GetListElementsRequest,
  output: GetListElementsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the details of the specified model version.
 */
export const getModelVersion: (
  input: GetModelVersionRequest,
) => effect.Effect<
  GetModelVersionResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetModelVersionRequest,
  output: GetModelVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all of the variables or the specific variable. This is a
 * paginated API. Providing null `maxSizePerPage` results in retrieving maximum of
 * 100 records per page. If you provide `maxSizePerPage` the value must be between
 * 50 and 100. To get the next page result, a provide a pagination token from
 * `GetVariablesResult` as part of your request. Null pagination token
 * fetches the records from the beginning.
 */
export const getVariables: {
  (
    input: GetVariablesRequest,
  ): effect.Effect<
    GetVariablesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetVariablesRequest,
  ) => stream.Stream<
    GetVariablesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetVariablesRequest,
  ) => stream.Stream<
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
  input: GetVariablesRequest,
  output: GetVariablesResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates or updates an event type. An event is a business activity that is evaluated for fraud risk. With Amazon Fraud Detector, you generate fraud predictions for events. An event type defines the structure for an event sent to Amazon Fraud Detector. This includes the variables sent as part of the event, the entity performing the event (such as a customer), and the labels that classify the event. Example event types include online payment transactions, account registrations, and authentications.
 */
export const putEventType: (
  input: PutEventTypeRequest,
) => effect.Effect<
  PutEventTypeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventTypeRequest,
  output: PutEventTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a model version. Updating a model version retrains an existing model version using updated training data and produces a new minor version of the model. You can update the training data set location and data access role attributes using this action. This action creates and trains a new minor version of the model, for example version 1.01, 1.02, 1.03.
 */
export const updateModelVersion: (
  input: UpdateModelVersionRequest,
) => effect.Effect<
  UpdateModelVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelVersionRequest,
  output: UpdateModelVersionResult,
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
 * Updates a rule version resulting in a new rule version. Updates a rule version resulting in a new rule version (version 1, 2, 3 ...).
 */
export const updateRuleVersion: (
  input: UpdateRuleVersionRequest,
) => effect.Effect<
  UpdateRuleVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleVersionRequest,
  output: UpdateRuleVersionResult,
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
 * Cancels the specified batch prediction job.
 */
export const cancelBatchPredictionJob: (
  input: CancelBatchPredictionJobRequest,
) => effect.Effect<
  CancelBatchPredictionJobResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelBatchPredictionJobRequest,
  output: CancelBatchPredictionJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a batch import job.
 */
export const createBatchImportJob: (
  input: CreateBatchImportJobRequest,
) => effect.Effect<
  CreateBatchImportJobResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBatchImportJobRequest,
  output: CreateBatchImportJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a batch prediction job.
 */
export const createBatchPredictionJob: (
  input: CreateBatchPredictionJobRequest,
) => effect.Effect<
  CreateBatchPredictionJobResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBatchPredictionJobRequest,
  output: CreateBatchPredictionJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a list.
 *
 * List is a set of input data for a variable in your event dataset. You use the input data in a rule that's associated with your detector.
 * For more information, see Lists.
 */
export const createList: (
  input: CreateListRequest,
) => effect.Effect<
  CreateListResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateListRequest,
  output: CreateListResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a model using the specified model type.
 */
export const createModel: (
  input: CreateModelRequest,
) => effect.Effect<
  CreateModelResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelRequest,
  output: CreateModelResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a variable.
 */
export const createVariable: (
  input: CreateVariableRequest,
) => effect.Effect<
  CreateVariableResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVariableRequest,
  output: CreateVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified batch import job ID record. This action does not delete the data that was batch imported.
 */
export const deleteBatchImportJob: (
  input: DeleteBatchImportJobRequest,
) => effect.Effect<
  DeleteBatchImportJobResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBatchImportJobRequest,
  output: DeleteBatchImportJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a batch prediction job.
 */
export const deleteBatchPredictionJob: (
  input: DeleteBatchPredictionJobRequest,
) => effect.Effect<
  DeleteBatchPredictionJobResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBatchPredictionJobRequest,
  output: DeleteBatchPredictionJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the detector. Before deleting a detector, you must first delete all detector versions and rule versions associated with the detector.
 *
 * When you delete a detector, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteDetector: (
  input: DeleteDetectorRequest,
) => effect.Effect<
  DeleteDetectorResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorRequest,
  output: DeleteDetectorResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the detector version. You cannot delete detector versions that are in `ACTIVE` status.
 *
 * When you delete a detector version, Amazon Fraud Detector permanently deletes the detector and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteDetectorVersion: (
  input: DeleteDetectorVersionRequest,
) => effect.Effect<
  DeleteDetectorVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDetectorVersionRequest,
  output: DeleteDetectorVersionResult,
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
 * Deletes an entity type.
 *
 * You cannot delete an entity type that is included in an event type.
 *
 * When you delete an entity type, Amazon Fraud Detector permanently deletes that entity type and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteEntityType: (
  input: DeleteEntityTypeRequest,
) => effect.Effect<
  DeleteEntityTypeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEntityTypeRequest,
  output: DeleteEntityTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified event.
 *
 * When you delete an event, Amazon Fraud Detector permanently deletes that event and the event data is no longer stored in Amazon Fraud Detector.
 * If `deleteAuditHistory` is `True`, event data is available through search for up to 30 seconds after the delete operation is completed.
 */
export const deleteEvent: (
  input: DeleteEventRequest,
) => effect.Effect<
  DeleteEventResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventRequest,
  output: DeleteEventResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an event type.
 *
 * You cannot delete an event type that is used in a detector or a model.
 *
 * When you delete an event type, Amazon Fraud Detector permanently deletes that event type and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteEventType: (
  input: DeleteEventTypeRequest,
) => effect.Effect<
  DeleteEventTypeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventTypeRequest,
  output: DeleteEventTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a SageMaker model from Amazon Fraud Detector.
 *
 * You can remove an Amazon SageMaker model if it is not associated with a detector version. Removing a SageMaker model disconnects it from Amazon Fraud Detector, but the model remains available in SageMaker.
 */
export const deleteExternalModel: (
  input: DeleteExternalModelRequest,
) => effect.Effect<
  DeleteExternalModelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExternalModelRequest,
  output: DeleteExternalModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the list, provided it is not used in a rule.
 *
 * When you delete a list, Amazon Fraud Detector permanently deletes that list and the elements in the list.
 */
export const deleteList: (
  input: DeleteListRequest,
) => effect.Effect<
  DeleteListResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteListRequest,
  output: DeleteListResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a model.
 *
 * You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.
 *
 * When you delete a model, Amazon Fraud Detector permanently deletes that model and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteModel: (
  input: DeleteModelRequest,
) => effect.Effect<
  DeleteModelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a model version.
 *
 * You can delete models and model versions in Amazon Fraud Detector, provided that they are not associated with a detector version.
 *
 * When you delete a model version, Amazon Fraud Detector permanently deletes that model version and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteModelVersion: (
  input: DeleteModelVersionRequest,
) => effect.Effect<
  DeleteModelVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelVersionRequest,
  output: DeleteModelVersionResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an outcome.
 *
 * You cannot delete an outcome that is used in a rule version.
 *
 * When you delete an outcome, Amazon Fraud Detector permanently deletes that outcome and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteOutcome: (
  input: DeleteOutcomeRequest,
) => effect.Effect<
  DeleteOutcomeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteOutcomeRequest,
  output: DeleteOutcomeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the rule. You cannot delete a rule if it is used by an `ACTIVE` or `INACTIVE` detector version.
 *
 * When you delete a rule, Amazon Fraud Detector permanently deletes that rule and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteRule: (
  input: DeleteRuleRequest,
) => effect.Effect<
  DeleteRuleResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a variable.
 *
 * You can't delete variables that are included in an event type in Amazon Fraud Detector.
 *
 * Amazon Fraud Detector automatically deletes model output variables and SageMaker model output variables when you delete the model. You can't delete these variables manually.
 *
 * When you delete a variable, Amazon Fraud Detector permanently deletes that variable and the data is no longer stored in Amazon Fraud Detector.
 */
export const deleteVariable: (
  input: DeleteVariableRequest,
) => effect.Effect<
  DeleteVariableResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVariableRequest,
  output: DeleteVariableResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates a detector.
 */
export const putDetector: (
  input: PutDetectorRequest,
) => effect.Effect<
  PutDetectorResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDetectorRequest,
  output: PutDetectorResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an entity type. An entity represents who is performing the event. As part of a fraud prediction, you pass the entity ID to indicate the specific entity who performed the event. An entity type classifies the entity. Example classifications include customer, merchant, or account.
 */
export const putEntityType: (
  input: PutEntityTypeRequest,
) => effect.Effect<
  PutEntityTypeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEntityTypeRequest,
  output: PutEntityTypeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Specifies the KMS key to be used to encrypt content in Amazon Fraud Detector.
 */
export const putKMSEncryptionKey: (
  input: PutKMSEncryptionKeyRequest,
) => effect.Effect<
  PutKMSEncryptionKeyResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutKMSEncryptionKeyRequest,
  output: PutKMSEncryptionKeyResult,
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
 * Creates or updates label. A label classifies an event as fraudulent or legitimate. Labels are associated with event types and used to train supervised machine learning models in Amazon Fraud Detector.
 */
export const putLabel: (
  input: PutLabelRequest,
) => effect.Effect<
  PutLabelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLabelRequest,
  output: PutLabelResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates or updates an outcome.
 */
export const putOutcome: (
  input: PutOutcomeRequest,
) => effect.Effect<
  PutOutcomeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutOutcomeRequest,
  output: PutOutcomeResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stores events in Amazon Fraud Detector without generating fraud predictions for those events. For example, you can use `SendEvent` to upload a historical dataset, which you can then later use to train a model.
 */
export const sendEvent: (
  input: SendEventRequest,
) => effect.Effect<
  SendEventResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendEventRequest,
  output: SendEventResult,
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
 * Updates a detector version. The detector version attributes that you can update include models, external model endpoints, rules, rule execution mode, and description. You can only update a `DRAFT` detector version.
 */
export const updateDetectorVersion: (
  input: UpdateDetectorVersionRequest,
) => effect.Effect<
  UpdateDetectorVersionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorVersionRequest,
  output: UpdateDetectorVersionResult,
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
 * Updates the detector version's description. You can update the metadata for any detector version (`DRAFT, ACTIVE,` or
 * `INACTIVE`).
 */
export const updateDetectorVersionMetadata: (
  input: UpdateDetectorVersionMetadataRequest,
) => effect.Effect<
  UpdateDetectorVersionMetadataResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorVersionMetadataRequest,
  output: UpdateDetectorVersionMetadataResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the detector version’s status. You can perform the following promotions or
 * demotions using `UpdateDetectorVersionStatus`: `DRAFT` to `ACTIVE`, `ACTIVE` to `INACTIVE`, and `INACTIVE` to `ACTIVE`.
 */
export const updateDetectorVersionStatus: (
  input: UpdateDetectorVersionStatusRequest,
) => effect.Effect<
  UpdateDetectorVersionStatusResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDetectorVersionStatusRequest,
  output: UpdateDetectorVersionStatusResult,
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
 * Updates the specified event with a new label.
 */
export const updateEventLabel: (
  input: UpdateEventLabelRequest,
) => effect.Effect<
  UpdateEventLabelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventLabelRequest,
  output: UpdateEventLabelResult,
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
 * Updates a list.
 */
export const updateList: (
  input: UpdateListRequest,
) => effect.Effect<
  UpdateListResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateListRequest,
  output: UpdateListResult,
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
 * Updates model description.
 */
export const updateModel: (
  input: UpdateModelRequest,
) => effect.Effect<
  UpdateModelResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelRequest,
  output: UpdateModelResult,
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
 * Updates the status of a model version.
 *
 * You can perform the following status updates:
 *
 * - Change the `TRAINING_IN_PROGRESS` status to `TRAINING_CANCELLED`.
 *
 * - Change the `TRAINING_COMPLETE` status to `ACTIVE`.
 *
 * - Change `ACTIVE` to `INACTIVE`.
 */
export const updateModelVersionStatus: (
  input: UpdateModelVersionStatusRequest,
) => effect.Effect<
  UpdateModelVersionStatusResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelVersionStatusRequest,
  output: UpdateModelVersionStatusResult,
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
 * Updates a rule's metadata. The description attribute can be updated.
 */
export const updateRuleMetadata: (
  input: UpdateRuleMetadataRequest,
) => effect.Effect<
  UpdateRuleMetadataResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRuleMetadataRequest,
  output: UpdateRuleMetadataResult,
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
 * Updates a variable.
 */
export const updateVariable: (
  input: UpdateVariableRequest,
) => effect.Effect<
  UpdateVariableResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVariableRequest,
  output: UpdateVariableResult,
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
 * Deletes all events of a particular event type.
 */
export const deleteEventsByEventType: (
  input: DeleteEventsByEventTypeRequest,
) => effect.Effect<
  DeleteEventsByEventTypeResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventsByEventTypeRequest,
  output: DeleteEventsByEventTypeResult,
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
 * Gets a batch of variables.
 */
export const batchGetVariable: (
  input: BatchGetVariableRequest,
) => effect.Effect<
  BatchGetVariableResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetVariableRequest,
  output: BatchGetVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Assigns tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResult,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResult,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResult,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels an in-progress batch import job.
 */
export const cancelBatchImportJob: (
  input: CancelBatchImportJobRequest,
) => effect.Effect<
  CancelBatchImportJobResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelBatchImportJobRequest,
  output: CancelBatchImportJobResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a detector version. The detector version starts in a `DRAFT` status.
 */
export const createDetectorVersion: (
  input: CreateDetectorVersionRequest,
) => effect.Effect<
  CreateDetectorVersionResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDetectorVersionRequest,
  output: CreateDetectorVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all versions for a specified detector.
 */
export const describeDetector: (
  input: DescribeDetectorRequest,
) => effect.Effect<
  DescribeDetectorResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDetectorRequest,
  output: DescribeDetectorResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all batch import jobs or a specific job of the specified ID. This is a paginated API. If you provide a null `maxResults`,
 * this action retrieves a maximum of 50 records per page. If you provide a `maxResults`, the value must be between 1 and 50.
 * To get the next page results, provide the pagination token from the `GetBatchImportJobsResponse` as part of your request.
 * A null pagination token fetches the records from the beginning.
 */
export const getBatchImportJobs: {
  (
    input: GetBatchImportJobsRequest,
  ): effect.Effect<
    GetBatchImportJobsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBatchImportJobsRequest,
  ) => stream.Stream<
    GetBatchImportJobsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBatchImportJobsRequest,
  ) => stream.Stream<
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
  input: GetBatchImportJobsRequest,
  output: GetBatchImportJobsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all batch prediction jobs or a specific job if you specify a job ID. This is a paginated API. If you provide a null maxResults, this action retrieves a maximum of 50 records per page. If you provide a maxResults, the value must be between 1 and 50. To get the next page results, provide the pagination token from the GetBatchPredictionJobsResponse as part of your request. A null pagination token fetches the records from the beginning.
 */
export const getBatchPredictionJobs: {
  (
    input: GetBatchPredictionJobsRequest,
  ): effect.Effect<
    GetBatchPredictionJobsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBatchPredictionJobsRequest,
  ) => stream.Stream<
    GetBatchPredictionJobsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBatchPredictionJobsRequest,
  ) => stream.Stream<
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
  input: GetBatchPredictionJobsRequest,
  output: GetBatchPredictionJobsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all detectors or a single detector if a `detectorId` is specified. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetDetectorsResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getDetectors: {
  (
    input: GetDetectorsRequest,
  ): effect.Effect<
    GetDetectorsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDetectorsRequest,
  ) => stream.Stream<
    GetDetectorsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDetectorsRequest,
  ) => stream.Stream<
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
  input: GetDetectorsRequest,
  output: GetDetectorsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all entity types or a specific entity type if a name is specified. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetEntityTypesResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getEntityTypes: {
  (
    input: GetEntityTypesRequest,
  ): effect.Effect<
    GetEntityTypesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEntityTypesRequest,
  ) => stream.Stream<
    GetEntityTypesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEntityTypesRequest,
  ) => stream.Stream<
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
  input: GetEntityTypesRequest,
  output: GetEntityTypesResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the details for one or more Amazon SageMaker models that have been imported into the
 * service. This is a paginated API. If you provide a null `maxResults`, this
 * actions retrieves a maximum of 10 records per page. If you provide a
 * `maxResults`, the value must be between 5 and 10. To get the next page
 * results, provide the pagination token from the `GetExternalModelsResult` as part
 * of your request. A null pagination token fetches the records from the beginning.
 */
export const getExternalModels: {
  (
    input: GetExternalModelsRequest,
  ): effect.Effect<
    GetExternalModelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetExternalModelsRequest,
  ) => stream.Stream<
    GetExternalModelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetExternalModelsRequest,
  ) => stream.Stream<
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
  input: GetExternalModelsRequest,
  output: GetExternalModelsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets all labels or a specific label if name is provided. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 50 records
 * per page. If you provide a `maxResults`, the value must be between 10 and 50.
 * To get the next page results, provide the pagination token from the
 * `GetGetLabelsResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getLabels: {
  (
    input: GetLabelsRequest,
  ): effect.Effect<
    GetLabelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetLabelsRequest,
  ) => stream.Stream<
    GetLabelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetLabelsRequest,
  ) => stream.Stream<
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
  input: GetLabelsRequest,
  output: GetLabelsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets the metadata of either all the lists under the account or the specified list.
 */
export const getListsMetadata: {
  (
    input: GetListsMetadataRequest,
  ): effect.Effect<
    GetListsMetadataResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetListsMetadataRequest,
  ) => stream.Stream<
    GetListsMetadataResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetListsMetadataRequest,
  ) => stream.Stream<
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
  input: GetListsMetadataRequest,
  output: GetListsMetadataResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets one or more models. Gets all models for the Amazon Web Services account if no model type and no model id provided. Gets all models for the Amazon Web Services account and model type, if the model type is specified but model id is not provided. Gets a specific model if (model type, model id) tuple is specified.
 *
 * This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 1 and 10.
 * To get the next page results, provide the pagination token from the
 * response as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getModels: {
  (
    input: GetModelsRequest,
  ): effect.Effect<
    GetModelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetModelsRequest,
  ) => stream.Stream<
    GetModelsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetModelsRequest,
  ) => stream.Stream<
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
  input: GetModelsRequest,
  output: GetModelsResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets one or more outcomes. This is a paginated
 * API. If you provide a null `maxResults`, this actions retrieves a maximum of
 * 100 records per page. If you provide a `maxResults`, the value must be
 * between 50 and 100. To get the next page results, provide the pagination token from the
 * `GetOutcomesResult` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getOutcomes: {
  (
    input: GetOutcomesRequest,
  ): effect.Effect<
    GetOutcomesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetOutcomesRequest,
  ) => stream.Stream<
    GetOutcomesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetOutcomesRequest,
  ) => stream.Stream<
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
  input: GetOutcomesRequest,
  output: GetOutcomesResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get all rules for a detector (paginated) if `ruleId` and `ruleVersion` are not specified. Gets all rules for the detector and the `ruleId` if present (paginated). Gets a specific rule if both the `ruleId` and the `ruleVersion` are specified.
 *
 * This is a paginated API. Providing null maxResults results in retrieving maximum of 100 records per page. If you provide maxResults the value must be between 50 and 100. To get the next page result, a provide a pagination token from GetRulesResult as part of your request. Null pagination token fetches the records from the beginning.
 */
export const getRules: {
  (
    input: GetRulesRequest,
  ): effect.Effect<
    GetRulesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRulesRequest,
  ) => stream.Stream<
    GetRulesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRulesRequest,
  ) => stream.Stream<
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
  input: GetRulesRequest,
  output: GetRulesResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a batch of variables.
 */
export const batchCreateVariable: (
  input: BatchCreateVariableRequest,
) => effect.Effect<
  BatchCreateVariableResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchCreateVariableRequest,
  output: BatchCreateVariableResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details of events stored with Amazon Fraud Detector. This action does not retrieve prediction results.
 */
export const getEvent: (
  input: GetEventRequest,
) => effect.Effect<
  GetEventResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventRequest,
  output: GetEventResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all event types or a specific event type if name is provided. This is a paginated API. If you
 * provide a null `maxResults`, this action retrieves a maximum of 10 records
 * per page. If you provide a `maxResults`, the value must be between 5 and 10.
 * To get the next page results, provide the pagination token from the
 * `GetEventTypesResponse` as part of your request. A null pagination token
 * fetches the records from the beginning.
 */
export const getEventTypes: {
  (
    input: GetEventTypesRequest,
  ): effect.Effect<
    GetEventTypesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEventTypesRequest,
  ) => stream.Stream<
    GetEventTypesResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEventTypesRequest,
  ) => stream.Stream<
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
  input: GetEventTypesRequest,
  output: GetEventTypesResult,
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
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of past predictions. The list can be filtered by detector ID, detector version ID, event ID, event type, or by specifying a time period.
 * If filter is not specified, the most recent prediction is returned.
 *
 * For example, the following filter lists all past predictions for `xyz` event type -
 * {
 * "eventType":{
 * "value": "xyz" }”
 * }
 *
 * This is a paginated API. If you provide a null `maxResults`, this action will retrieve a maximum of 10 records per page.
 * If you provide a `maxResults`, the value must be between 50 and 100. To get the next page results, provide
 * the `nextToken` from the response as part of your request. A null `nextToken` fetches the records from the beginning.
 */
export const listEventPredictions: {
  (
    input: ListEventPredictionsRequest,
  ): effect.Effect<
    ListEventPredictionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventPredictionsRequest,
  ) => stream.Stream<
    ListEventPredictionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventPredictionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventPredictionsRequest,
  output: ListEventPredictionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a version of the model using the specified model type and model id.
 */
export const createModelVersion: (
  input: CreateModelVersionRequest,
) => effect.Effect<
  CreateModelVersionResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelVersionRequest,
  output: CreateModelVersionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details of the past fraud predictions for the specified event ID, event type, detector ID, and detector version ID that was generated in the specified time period.
 */
export const getEventPredictionMetadata: (
  input: GetEventPredictionMetadataRequest,
) => effect.Effect<
  GetEventPredictionMetadataResult,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventPredictionMetadataRequest,
  output: GetEventPredictionMetadataResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Evaluates an event against a detector version. If a version ID is not provided, the detector’s (`ACTIVE`) version is used.
 */
export const getEventPrediction: (
  input: GetEventPredictionRequest,
) => effect.Effect<
  GetEventPredictionResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEventPredictionRequest,
  output: GetEventPredictionResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets all of the model versions for the specified model type or for the specified model type and model ID. You can also get details for a single, specified model version.
 */
export const describeModelVersions: {
  (
    input: DescribeModelVersionsRequest,
  ): effect.Effect<
    DescribeModelVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeModelVersionsRequest,
  ) => stream.Stream<
    DescribeModelVersionsResult,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeModelVersionsRequest,
  ) => stream.Stream<
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
  input: DescribeModelVersionsRequest,
  output: DescribeModelVersionsResult,
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
    pageSize: "maxResults",
  } as const,
}));
