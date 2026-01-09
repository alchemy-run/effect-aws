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
  sdkId: "LookoutEquipment",
  serviceShapeName: "AWSLookoutEquipmentFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "lookoutequipment" });
const ver = T.ServiceVersion("2020-12-15");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://lookoutequipment-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://lookoutequipment-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://lookoutequipment.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://lookoutequipment.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DatasetName = string;
export type NameOrArn = string;
export type IdempotenceToken = string;
export type ModelName = string;
export type InferenceSchedulerName = string;
export type DataDelayOffsetInMinutes = number;
export type IamRoleArn = string;
export type LabelGroupName = string;
export type FaultCode = string;
export type Comments = string;
export type Equipment = string;
export type DatasetIdentifier = string;
export type OffCondition = string;
export type RetrainingFrequency = string;
export type LookbackWindow = string;
export type InferenceSchedulerIdentifier = string;
export type LabelId = string;
export type ResourceArn = string;
export type IngestionJobId = string;
export type ModelVersion = number;
export type DatasetArn = string;
export type ModelVersionArn = string;
export type NextToken = string;
export type MaxResults = number;
export type AmazonResourceArn = string;
export type Policy = string;
export type PolicyRevisionId = string;
export type TagKey = string;
export type SynthesizedJsonInlineDataSchema = string;
export type TagValue = string;
export type TimeZoneOffset = string;
export type LabelGroupArn = string;
export type ModelArn = string;
export type BoundedLengthString = string;
export type DataSizeInBytes = number;
export type KmsKeyArn = string;
export type InferenceSchedulerArn = string;
export type SynthesizedJsonModelMetrics = string;
export type InlineDataSchema = string;
export type ModelMetrics = string;
export type AutoPromotionResultReason = string;
export type S3Bucket = string;
export type S3Prefix = string;
export type FileNameTimestampFormat = string;
export type ComponentTimestampDelimiter = string;
export type KeyPattern = string;
export type S3Key = string;
export type EventDurationInSeconds = number;
export type ComponentName = string;
export type SensorName = string;

//# Schemas
export type DataUploadFrequency =
  | "PT5M"
  | "PT10M"
  | "PT15M"
  | "PT30M"
  | "PT1H"
  | (string & {});
export const DataUploadFrequency = S.String;
export type LabelRating = "ANOMALY" | "NO_ANOMALY" | "NEUTRAL" | (string & {});
export const LabelRating = S.String;
export type FaultCodes = string[];
export const FaultCodes = S.Array(S.String);
export type ModelPromoteMode = "MANAGED" | "MANUAL" | (string & {});
export const ModelPromoteMode = S.String;
export type InferenceDataImportStrategy =
  | "NO_IMPORT"
  | "ADD_WHEN_EMPTY"
  | "OVERWRITE"
  | (string & {});
export const InferenceDataImportStrategy = S.String;
export type IngestionJobStatus =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "IMPORT_IN_PROGRESS"
  | (string & {});
export const IngestionJobStatus = S.String;
export type InferenceExecutionStatus =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | (string & {});
export const InferenceExecutionStatus = S.String;
export type InferenceSchedulerStatus =
  | "PENDING"
  | "RUNNING"
  | "STOPPING"
  | "STOPPED"
  | (string & {});
export const InferenceSchedulerStatus = S.String;
export type ModelStatus =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "IMPORT_IN_PROGRESS"
  | (string & {});
export const ModelStatus = S.String;
export type ModelVersionStatus =
  | "IN_PROGRESS"
  | "SUCCESS"
  | "FAILED"
  | "IMPORT_IN_PROGRESS"
  | "CANCELED"
  | (string & {});
export const ModelVersionStatus = S.String;
export type ModelVersionSourceType =
  | "TRAINING"
  | "RETRAINING"
  | "IMPORT"
  | (string & {});
export const ModelVersionSourceType = S.String;
export type RetrainingSchedulerStatus =
  | "PENDING"
  | "RUNNING"
  | "STOPPING"
  | "STOPPED"
  | (string & {});
export const RetrainingSchedulerStatus = S.String;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateLabelRequest {
  LabelGroupName: string;
  StartTime: Date;
  EndTime: Date;
  Rating: LabelRating;
  FaultCode?: string;
  Notes?: string;
  Equipment?: string;
  ClientToken: string;
}
export const CreateLabelRequest = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Rating: LabelRating,
    FaultCode: S.optional(S.String),
    Notes: S.optional(S.String),
    Equipment: S.optional(S.String),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLabelRequest",
}) as any as S.Schema<CreateLabelRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface CreateLabelGroupRequest {
  LabelGroupName: string;
  FaultCodes?: string[];
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateLabelGroupRequest = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.String,
    FaultCodes: S.optional(FaultCodes),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLabelGroupRequest",
}) as any as S.Schema<CreateLabelGroupRequest>;
export interface CreateRetrainingSchedulerRequest {
  ModelName: string;
  RetrainingStartDate?: Date;
  RetrainingFrequency: string;
  LookbackWindow: string;
  PromoteMode?: ModelPromoteMode;
  ClientToken: string;
}
export const CreateRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    RetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingFrequency: S.String,
    LookbackWindow: S.String,
    PromoteMode: S.optional(ModelPromoteMode),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRetrainingSchedulerRequest",
}) as any as S.Schema<CreateRetrainingSchedulerRequest>;
export interface DeleteDatasetRequest {
  DatasetName: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({ DatasetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteDatasetResponse {}
export const DeleteDatasetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeleteInferenceSchedulerRequest {
  InferenceSchedulerName: string;
}
export const DeleteInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({ InferenceSchedulerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteInferenceSchedulerRequest",
}) as any as S.Schema<DeleteInferenceSchedulerRequest>;
export interface DeleteInferenceSchedulerResponse {}
export const DeleteInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteInferenceSchedulerResponse",
}) as any as S.Schema<DeleteInferenceSchedulerResponse>;
export interface DeleteLabelRequest {
  LabelGroupName: string;
  LabelId: string;
}
export const DeleteLabelRequest = S.suspend(() =>
  S.Struct({ LabelGroupName: S.String, LabelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLabelRequest",
}) as any as S.Schema<DeleteLabelRequest>;
export interface DeleteLabelResponse {}
export const DeleteLabelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLabelResponse",
}) as any as S.Schema<DeleteLabelResponse>;
export interface DeleteLabelGroupRequest {
  LabelGroupName: string;
}
export const DeleteLabelGroupRequest = S.suspend(() =>
  S.Struct({ LabelGroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLabelGroupRequest",
}) as any as S.Schema<DeleteLabelGroupRequest>;
export interface DeleteLabelGroupResponse {}
export const DeleteLabelGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLabelGroupResponse",
}) as any as S.Schema<DeleteLabelGroupResponse>;
export interface DeleteModelRequest {
  ModelName: string;
}
export const DeleteModelRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteModelRequest",
}) as any as S.Schema<DeleteModelRequest>;
export interface DeleteModelResponse {}
export const DeleteModelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteModelResponse",
}) as any as S.Schema<DeleteModelResponse>;
export interface DeleteResourcePolicyRequest {
  ResourceArn: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteRetrainingSchedulerRequest {
  ModelName: string;
}
export const DeleteRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRetrainingSchedulerRequest",
}) as any as S.Schema<DeleteRetrainingSchedulerRequest>;
export interface DeleteRetrainingSchedulerResponse {}
export const DeleteRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRetrainingSchedulerResponse",
}) as any as S.Schema<DeleteRetrainingSchedulerResponse>;
export interface DescribeDataIngestionJobRequest {
  JobId: string;
}
export const DescribeDataIngestionJobRequest = S.suspend(() =>
  S.Struct({ JobId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDataIngestionJobRequest",
}) as any as S.Schema<DescribeDataIngestionJobRequest>;
export interface DescribeDatasetRequest {
  DatasetName: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ DatasetName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeInferenceSchedulerRequest {
  InferenceSchedulerName: string;
}
export const DescribeInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({ InferenceSchedulerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeInferenceSchedulerRequest",
}) as any as S.Schema<DescribeInferenceSchedulerRequest>;
export interface DescribeLabelRequest {
  LabelGroupName: string;
  LabelId: string;
}
export const DescribeLabelRequest = S.suspend(() =>
  S.Struct({ LabelGroupName: S.String, LabelId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLabelRequest",
}) as any as S.Schema<DescribeLabelRequest>;
export interface DescribeLabelGroupRequest {
  LabelGroupName: string;
}
export const DescribeLabelGroupRequest = S.suspend(() =>
  S.Struct({ LabelGroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLabelGroupRequest",
}) as any as S.Schema<DescribeLabelGroupRequest>;
export interface DescribeModelRequest {
  ModelName: string;
}
export const DescribeModelRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeModelRequest",
}) as any as S.Schema<DescribeModelRequest>;
export interface DescribeModelVersionRequest {
  ModelName: string;
  ModelVersion: number;
}
export const DescribeModelVersionRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String, ModelVersion: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeModelVersionRequest",
}) as any as S.Schema<DescribeModelVersionRequest>;
export interface DescribeResourcePolicyRequest {
  ResourceArn: string;
}
export const DescribeResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeResourcePolicyRequest",
}) as any as S.Schema<DescribeResourcePolicyRequest>;
export interface DescribeRetrainingSchedulerRequest {
  ModelName: string;
}
export const DescribeRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRetrainingSchedulerRequest",
}) as any as S.Schema<DescribeRetrainingSchedulerRequest>;
export interface ImportDatasetRequest {
  SourceDatasetArn: string;
  DatasetName?: string;
  ClientToken: string;
  ServerSideKmsKeyId?: string;
  Tags?: Tag[];
}
export const ImportDatasetRequest = S.suspend(() =>
  S.Struct({
    SourceDatasetArn: S.String,
    DatasetName: S.optional(S.String),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    ServerSideKmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportDatasetRequest",
}) as any as S.Schema<ImportDatasetRequest>;
export interface LabelsS3InputConfiguration {
  Bucket: string;
  Prefix?: string;
}
export const LabelsS3InputConfiguration = S.suspend(() =>
  S.Struct({ Bucket: S.String, Prefix: S.optional(S.String) }),
).annotations({
  identifier: "LabelsS3InputConfiguration",
}) as any as S.Schema<LabelsS3InputConfiguration>;
export interface LabelsInputConfiguration {
  S3InputConfiguration?: LabelsS3InputConfiguration;
  LabelGroupName?: string;
}
export const LabelsInputConfiguration = S.suspend(() =>
  S.Struct({
    S3InputConfiguration: S.optional(LabelsS3InputConfiguration),
    LabelGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "LabelsInputConfiguration",
}) as any as S.Schema<LabelsInputConfiguration>;
export interface ImportModelVersionRequest {
  SourceModelVersionArn: string;
  ModelName?: string;
  DatasetName: string;
  LabelsInputConfiguration?: LabelsInputConfiguration;
  ClientToken: string;
  RoleArn?: string;
  ServerSideKmsKeyId?: string;
  Tags?: Tag[];
  InferenceDataImportStrategy?: InferenceDataImportStrategy;
}
export const ImportModelVersionRequest = S.suspend(() =>
  S.Struct({
    SourceModelVersionArn: S.String,
    ModelName: S.optional(S.String),
    DatasetName: S.String,
    LabelsInputConfiguration: S.optional(LabelsInputConfiguration),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    RoleArn: S.optional(S.String),
    ServerSideKmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    InferenceDataImportStrategy: S.optional(InferenceDataImportStrategy),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportModelVersionRequest",
}) as any as S.Schema<ImportModelVersionRequest>;
export interface ListDataIngestionJobsRequest {
  DatasetName?: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: IngestionJobStatus;
}
export const ListDataIngestionJobsRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(IngestionJobStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataIngestionJobsRequest",
}) as any as S.Schema<ListDataIngestionJobsRequest>;
export interface ListDatasetsRequest {
  NextToken?: string;
  MaxResults?: number;
  DatasetNameBeginsWith?: string;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    DatasetNameBeginsWith: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListInferenceEventsRequest {
  NextToken?: string;
  MaxResults?: number;
  InferenceSchedulerName: string;
  IntervalStartTime: Date;
  IntervalEndTime: Date;
}
export const ListInferenceEventsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InferenceSchedulerName: S.String,
    IntervalStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    IntervalEndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInferenceEventsRequest",
}) as any as S.Schema<ListInferenceEventsRequest>;
export interface ListInferenceExecutionsRequest {
  NextToken?: string;
  MaxResults?: number;
  InferenceSchedulerName: string;
  DataStartTimeAfter?: Date;
  DataEndTimeBefore?: Date;
  Status?: InferenceExecutionStatus;
}
export const ListInferenceExecutionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InferenceSchedulerName: S.String,
    DataStartTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DataEndTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(InferenceExecutionStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInferenceExecutionsRequest",
}) as any as S.Schema<ListInferenceExecutionsRequest>;
export interface ListInferenceSchedulersRequest {
  NextToken?: string;
  MaxResults?: number;
  InferenceSchedulerNameBeginsWith?: string;
  ModelName?: string;
  Status?: InferenceSchedulerStatus;
}
export const ListInferenceSchedulersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    InferenceSchedulerNameBeginsWith: S.optional(S.String),
    ModelName: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListInferenceSchedulersRequest",
}) as any as S.Schema<ListInferenceSchedulersRequest>;
export interface ListLabelGroupsRequest {
  LabelGroupNameBeginsWith?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLabelGroupsRequest = S.suspend(() =>
  S.Struct({
    LabelGroupNameBeginsWith: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLabelGroupsRequest",
}) as any as S.Schema<ListLabelGroupsRequest>;
export interface ListLabelsRequest {
  LabelGroupName: string;
  IntervalStartTime?: Date;
  IntervalEndTime?: Date;
  FaultCode?: string;
  Equipment?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListLabelsRequest = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.String,
    IntervalStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    IntervalEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FaultCode: S.optional(S.String),
    Equipment: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLabelsRequest",
}) as any as S.Schema<ListLabelsRequest>;
export interface ListModelsRequest {
  NextToken?: string;
  MaxResults?: number;
  Status?: ModelStatus;
  ModelNameBeginsWith?: string;
  DatasetNameBeginsWith?: string;
}
export const ListModelsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(ModelStatus),
    ModelNameBeginsWith: S.optional(S.String),
    DatasetNameBeginsWith: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListModelsRequest",
}) as any as S.Schema<ListModelsRequest>;
export interface ListModelVersionsRequest {
  ModelName: string;
  NextToken?: string;
  MaxResults?: number;
  Status?: ModelVersionStatus;
  SourceType?: ModelVersionSourceType;
  CreatedAtEndTime?: Date;
  CreatedAtStartTime?: Date;
  MaxModelVersion?: number;
  MinModelVersion?: number;
}
export const ListModelVersionsRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Status: S.optional(ModelVersionStatus),
    SourceType: S.optional(ModelVersionSourceType),
    CreatedAtEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedAtStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxModelVersion: S.optional(S.Number),
    MinModelVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListModelVersionsRequest",
}) as any as S.Schema<ListModelVersionsRequest>;
export interface ListRetrainingSchedulersRequest {
  ModelNameBeginsWith?: string;
  Status?: RetrainingSchedulerStatus;
  NextToken?: string;
  MaxResults?: number;
}
export const ListRetrainingSchedulersRequest = S.suspend(() =>
  S.Struct({
    ModelNameBeginsWith: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRetrainingSchedulersRequest",
}) as any as S.Schema<ListRetrainingSchedulersRequest>;
export interface ListSensorStatisticsRequest {
  DatasetName: string;
  IngestionJobId?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSensorStatisticsRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    IngestionJobId: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSensorStatisticsRequest",
}) as any as S.Schema<ListSensorStatisticsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface PutResourcePolicyRequest {
  ResourceArn: string;
  ResourcePolicy: string;
  PolicyRevisionId?: string;
  ClientToken: string;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    ResourcePolicy: S.String,
    PolicyRevisionId: S.optional(S.String),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export interface StartInferenceSchedulerRequest {
  InferenceSchedulerName: string;
}
export const StartInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({ InferenceSchedulerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartInferenceSchedulerRequest",
}) as any as S.Schema<StartInferenceSchedulerRequest>;
export interface StartRetrainingSchedulerRequest {
  ModelName: string;
}
export const StartRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartRetrainingSchedulerRequest",
}) as any as S.Schema<StartRetrainingSchedulerRequest>;
export interface StopInferenceSchedulerRequest {
  InferenceSchedulerName: string;
}
export const StopInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({ InferenceSchedulerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopInferenceSchedulerRequest",
}) as any as S.Schema<StopInferenceSchedulerRequest>;
export interface StopRetrainingSchedulerRequest {
  ModelName: string;
}
export const StopRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopRetrainingSchedulerRequest",
}) as any as S.Schema<StopRetrainingSchedulerRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateActiveModelVersionRequest {
  ModelName: string;
  ModelVersion: number;
}
export const UpdateActiveModelVersionRequest = S.suspend(() =>
  S.Struct({ ModelName: S.String, ModelVersion: S.Number }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateActiveModelVersionRequest",
}) as any as S.Schema<UpdateActiveModelVersionRequest>;
export interface InferenceS3InputConfiguration {
  Bucket: string;
  Prefix?: string;
}
export const InferenceS3InputConfiguration = S.suspend(() =>
  S.Struct({ Bucket: S.String, Prefix: S.optional(S.String) }),
).annotations({
  identifier: "InferenceS3InputConfiguration",
}) as any as S.Schema<InferenceS3InputConfiguration>;
export interface InferenceInputNameConfiguration {
  TimestampFormat?: string;
  ComponentTimestampDelimiter?: string;
}
export const InferenceInputNameConfiguration = S.suspend(() =>
  S.Struct({
    TimestampFormat: S.optional(S.String),
    ComponentTimestampDelimiter: S.optional(S.String),
  }),
).annotations({
  identifier: "InferenceInputNameConfiguration",
}) as any as S.Schema<InferenceInputNameConfiguration>;
export interface InferenceInputConfiguration {
  S3InputConfiguration?: InferenceS3InputConfiguration;
  InputTimeZoneOffset?: string;
  InferenceInputNameConfiguration?: InferenceInputNameConfiguration;
}
export const InferenceInputConfiguration = S.suspend(() =>
  S.Struct({
    S3InputConfiguration: S.optional(InferenceS3InputConfiguration),
    InputTimeZoneOffset: S.optional(S.String),
    InferenceInputNameConfiguration: S.optional(
      InferenceInputNameConfiguration,
    ),
  }),
).annotations({
  identifier: "InferenceInputConfiguration",
}) as any as S.Schema<InferenceInputConfiguration>;
export interface InferenceS3OutputConfiguration {
  Bucket: string;
  Prefix?: string;
}
export const InferenceS3OutputConfiguration = S.suspend(() =>
  S.Struct({ Bucket: S.String, Prefix: S.optional(S.String) }),
).annotations({
  identifier: "InferenceS3OutputConfiguration",
}) as any as S.Schema<InferenceS3OutputConfiguration>;
export interface InferenceOutputConfiguration {
  S3OutputConfiguration: InferenceS3OutputConfiguration;
  KmsKeyId?: string;
}
export const InferenceOutputConfiguration = S.suspend(() =>
  S.Struct({
    S3OutputConfiguration: InferenceS3OutputConfiguration,
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "InferenceOutputConfiguration",
}) as any as S.Schema<InferenceOutputConfiguration>;
export interface UpdateInferenceSchedulerRequest {
  InferenceSchedulerName: string;
  DataDelayOffsetInMinutes?: number;
  DataUploadFrequency?: DataUploadFrequency;
  DataInputConfiguration?: InferenceInputConfiguration;
  DataOutputConfiguration?: InferenceOutputConfiguration;
  RoleArn?: string;
}
export const UpdateInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({
    InferenceSchedulerName: S.String,
    DataDelayOffsetInMinutes: S.optional(S.Number),
    DataUploadFrequency: S.optional(DataUploadFrequency),
    DataInputConfiguration: S.optional(InferenceInputConfiguration),
    DataOutputConfiguration: S.optional(InferenceOutputConfiguration),
    RoleArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateInferenceSchedulerRequest",
}) as any as S.Schema<UpdateInferenceSchedulerRequest>;
export interface UpdateInferenceSchedulerResponse {}
export const UpdateInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateInferenceSchedulerResponse",
}) as any as S.Schema<UpdateInferenceSchedulerResponse>;
export interface UpdateLabelGroupRequest {
  LabelGroupName: string;
  FaultCodes?: string[];
}
export const UpdateLabelGroupRequest = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.String,
    FaultCodes: S.optional(FaultCodes),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLabelGroupRequest",
}) as any as S.Schema<UpdateLabelGroupRequest>;
export interface UpdateLabelGroupResponse {}
export const UpdateLabelGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLabelGroupResponse",
}) as any as S.Schema<UpdateLabelGroupResponse>;
export interface ModelDiagnosticsS3OutputConfiguration {
  Bucket: string;
  Prefix?: string;
}
export const ModelDiagnosticsS3OutputConfiguration = S.suspend(() =>
  S.Struct({ Bucket: S.String, Prefix: S.optional(S.String) }),
).annotations({
  identifier: "ModelDiagnosticsS3OutputConfiguration",
}) as any as S.Schema<ModelDiagnosticsS3OutputConfiguration>;
export interface ModelDiagnosticsOutputConfiguration {
  S3OutputConfiguration: ModelDiagnosticsS3OutputConfiguration;
  KmsKeyId?: string;
}
export const ModelDiagnosticsOutputConfiguration = S.suspend(() =>
  S.Struct({
    S3OutputConfiguration: ModelDiagnosticsS3OutputConfiguration,
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ModelDiagnosticsOutputConfiguration",
}) as any as S.Schema<ModelDiagnosticsOutputConfiguration>;
export interface UpdateModelRequest {
  ModelName: string;
  LabelsInputConfiguration?: LabelsInputConfiguration;
  RoleArn?: string;
  ModelDiagnosticsOutputConfiguration?: ModelDiagnosticsOutputConfiguration;
}
export const UpdateModelRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    LabelsInputConfiguration: S.optional(LabelsInputConfiguration),
    RoleArn: S.optional(S.String),
    ModelDiagnosticsOutputConfiguration: S.optional(
      ModelDiagnosticsOutputConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateModelRequest",
}) as any as S.Schema<UpdateModelRequest>;
export interface UpdateModelResponse {}
export const UpdateModelResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateModelResponse",
}) as any as S.Schema<UpdateModelResponse>;
export interface UpdateRetrainingSchedulerRequest {
  ModelName: string;
  RetrainingStartDate?: Date;
  RetrainingFrequency?: string;
  LookbackWindow?: string;
  PromoteMode?: ModelPromoteMode;
}
export const UpdateRetrainingSchedulerRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    RetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingFrequency: S.optional(S.String),
    LookbackWindow: S.optional(S.String),
    PromoteMode: S.optional(ModelPromoteMode),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRetrainingSchedulerRequest",
}) as any as S.Schema<UpdateRetrainingSchedulerRequest>;
export interface UpdateRetrainingSchedulerResponse {}
export const UpdateRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRetrainingSchedulerResponse",
}) as any as S.Schema<UpdateRetrainingSchedulerResponse>;
export type TargetSamplingRate =
  | "PT1S"
  | "PT5S"
  | "PT10S"
  | "PT15S"
  | "PT30S"
  | "PT1M"
  | "PT5M"
  | "PT10M"
  | "PT15M"
  | "PT30M"
  | "PT1H"
  | (string & {});
export const TargetSamplingRate = S.String;
export interface DatasetSchema {
  InlineDataSchema?: string;
}
export const DatasetSchema = S.suspend(() =>
  S.Struct({ InlineDataSchema: S.optional(S.String) }),
).annotations({
  identifier: "DatasetSchema",
}) as any as S.Schema<DatasetSchema>;
export interface DataPreProcessingConfiguration {
  TargetSamplingRate?: TargetSamplingRate;
}
export const DataPreProcessingConfiguration = S.suspend(() =>
  S.Struct({ TargetSamplingRate: S.optional(TargetSamplingRate) }),
).annotations({
  identifier: "DataPreProcessingConfiguration",
}) as any as S.Schema<DataPreProcessingConfiguration>;
export type DatasetStatus =
  | "CREATED"
  | "INGESTION_IN_PROGRESS"
  | "ACTIVE"
  | "IMPORT_IN_PROGRESS"
  | (string & {});
export const DatasetStatus = S.String;
export type LatestInferenceResult = "ANOMALOUS" | "NORMAL" | (string & {});
export const LatestInferenceResult = S.String;
export type ModelQuality =
  | "QUALITY_THRESHOLD_MET"
  | "CANNOT_DETERMINE_QUALITY"
  | "POOR_QUALITY_DETECTED"
  | (string & {});
export const ModelQuality = S.String;
export type AutoPromotionResult =
  | "MODEL_PROMOTED"
  | "MODEL_NOT_PROMOTED"
  | "RETRAINING_INTERNAL_ERROR"
  | "RETRAINING_CUSTOMER_ERROR"
  | "RETRAINING_CANCELLED"
  | (string & {});
export const AutoPromotionResult = S.String;
export interface CreateDatasetRequest {
  DatasetName: string;
  DatasetSchema?: DatasetSchema;
  ServerSideKmsKeyId?: string;
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    DatasetSchema: S.optional(DatasetSchema),
    ServerSideKmsKeyId: S.optional(S.String),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateLabelResponse {
  LabelId?: string;
}
export const CreateLabelResponse = S.suspend(() =>
  S.Struct({ LabelId: S.optional(S.String) }),
).annotations({
  identifier: "CreateLabelResponse",
}) as any as S.Schema<CreateLabelResponse>;
export interface CreateLabelGroupResponse {
  LabelGroupName?: string;
  LabelGroupArn?: string;
}
export const CreateLabelGroupResponse = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.optional(S.String),
    LabelGroupArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLabelGroupResponse",
}) as any as S.Schema<CreateLabelGroupResponse>;
export interface CreateRetrainingSchedulerResponse {
  ModelName?: string;
  ModelArn?: string;
  Status?: RetrainingSchedulerStatus;
}
export const CreateRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
  }),
).annotations({
  identifier: "CreateRetrainingSchedulerResponse",
}) as any as S.Schema<CreateRetrainingSchedulerResponse>;
export interface IngestionS3InputConfiguration {
  Bucket: string;
  Prefix?: string;
  KeyPattern?: string;
}
export const IngestionS3InputConfiguration = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    Prefix: S.optional(S.String),
    KeyPattern: S.optional(S.String),
  }),
).annotations({
  identifier: "IngestionS3InputConfiguration",
}) as any as S.Schema<IngestionS3InputConfiguration>;
export interface IngestionInputConfiguration {
  S3InputConfiguration: IngestionS3InputConfiguration;
}
export const IngestionInputConfiguration = S.suspend(() =>
  S.Struct({ S3InputConfiguration: IngestionS3InputConfiguration }),
).annotations({
  identifier: "IngestionInputConfiguration",
}) as any as S.Schema<IngestionInputConfiguration>;
export interface MissingCompleteSensorData {
  AffectedSensorCount: number;
}
export const MissingCompleteSensorData = S.suspend(() =>
  S.Struct({ AffectedSensorCount: S.Number }),
).annotations({
  identifier: "MissingCompleteSensorData",
}) as any as S.Schema<MissingCompleteSensorData>;
export interface SensorsWithShortDateRange {
  AffectedSensorCount: number;
}
export const SensorsWithShortDateRange = S.suspend(() =>
  S.Struct({ AffectedSensorCount: S.Number }),
).annotations({
  identifier: "SensorsWithShortDateRange",
}) as any as S.Schema<SensorsWithShortDateRange>;
export interface InsufficientSensorData {
  MissingCompleteSensorData: MissingCompleteSensorData;
  SensorsWithShortDateRange: SensorsWithShortDateRange;
}
export const InsufficientSensorData = S.suspend(() =>
  S.Struct({
    MissingCompleteSensorData: MissingCompleteSensorData,
    SensorsWithShortDateRange: SensorsWithShortDateRange,
  }),
).annotations({
  identifier: "InsufficientSensorData",
}) as any as S.Schema<InsufficientSensorData>;
export interface MissingSensorData {
  AffectedSensorCount: number;
  TotalNumberOfMissingValues: number;
}
export const MissingSensorData = S.suspend(() =>
  S.Struct({
    AffectedSensorCount: S.Number,
    TotalNumberOfMissingValues: S.Number,
  }),
).annotations({
  identifier: "MissingSensorData",
}) as any as S.Schema<MissingSensorData>;
export interface InvalidSensorData {
  AffectedSensorCount: number;
  TotalNumberOfInvalidValues: number;
}
export const InvalidSensorData = S.suspend(() =>
  S.Struct({
    AffectedSensorCount: S.Number,
    TotalNumberOfInvalidValues: S.Number,
  }),
).annotations({
  identifier: "InvalidSensorData",
}) as any as S.Schema<InvalidSensorData>;
export interface UnsupportedTimestamps {
  TotalNumberOfUnsupportedTimestamps: number;
}
export const UnsupportedTimestamps = S.suspend(() =>
  S.Struct({ TotalNumberOfUnsupportedTimestamps: S.Number }),
).annotations({
  identifier: "UnsupportedTimestamps",
}) as any as S.Schema<UnsupportedTimestamps>;
export interface DuplicateTimestamps {
  TotalNumberOfDuplicateTimestamps: number;
}
export const DuplicateTimestamps = S.suspend(() =>
  S.Struct({ TotalNumberOfDuplicateTimestamps: S.Number }),
).annotations({
  identifier: "DuplicateTimestamps",
}) as any as S.Schema<DuplicateTimestamps>;
export interface DataQualitySummary {
  InsufficientSensorData: InsufficientSensorData;
  MissingSensorData: MissingSensorData;
  InvalidSensorData: InvalidSensorData;
  UnsupportedTimestamps: UnsupportedTimestamps;
  DuplicateTimestamps: DuplicateTimestamps;
}
export const DataQualitySummary = S.suspend(() =>
  S.Struct({
    InsufficientSensorData: InsufficientSensorData,
    MissingSensorData: MissingSensorData,
    InvalidSensorData: InvalidSensorData,
    UnsupportedTimestamps: UnsupportedTimestamps,
    DuplicateTimestamps: DuplicateTimestamps,
  }),
).annotations({
  identifier: "DataQualitySummary",
}) as any as S.Schema<DataQualitySummary>;
export interface S3Object {
  Bucket: string;
  Key: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({ Bucket: S.String, Key: S.String }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export type ListOfDiscardedFiles = S3Object[];
export const ListOfDiscardedFiles = S.Array(S3Object);
export interface IngestedFilesSummary {
  TotalNumberOfFiles: number;
  IngestedNumberOfFiles: number;
  DiscardedFiles?: S3Object[];
}
export const IngestedFilesSummary = S.suspend(() =>
  S.Struct({
    TotalNumberOfFiles: S.Number,
    IngestedNumberOfFiles: S.Number,
    DiscardedFiles: S.optional(ListOfDiscardedFiles),
  }),
).annotations({
  identifier: "IngestedFilesSummary",
}) as any as S.Schema<IngestedFilesSummary>;
export interface DescribeDatasetResponse {
  DatasetName?: string;
  DatasetArn?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  Status?: DatasetStatus;
  Schema?: string;
  ServerSideKmsKeyId?: string;
  IngestionInputConfiguration?: IngestionInputConfiguration;
  DataQualitySummary?: DataQualitySummary;
  IngestedFilesSummary?: IngestedFilesSummary;
  RoleArn?: string;
  DataStartTime?: Date;
  DataEndTime?: Date;
  SourceDatasetArn?: string;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(DatasetStatus),
    Schema: S.optional(S.String),
    ServerSideKmsKeyId: S.optional(S.String),
    IngestionInputConfiguration: S.optional(IngestionInputConfiguration),
    DataQualitySummary: S.optional(DataQualitySummary),
    IngestedFilesSummary: S.optional(IngestedFilesSummary),
    RoleArn: S.optional(S.String),
    DataStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceDatasetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeInferenceSchedulerResponse {
  ModelArn?: string;
  ModelName?: string;
  InferenceSchedulerName?: string;
  InferenceSchedulerArn?: string;
  Status?: InferenceSchedulerStatus;
  DataDelayOffsetInMinutes?: number;
  DataUploadFrequency?: DataUploadFrequency;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  DataInputConfiguration?: InferenceInputConfiguration;
  DataOutputConfiguration?: InferenceOutputConfiguration;
  RoleArn?: string;
  ServerSideKmsKeyId?: string;
  LatestInferenceResult?: LatestInferenceResult;
}
export const DescribeInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelArn: S.optional(S.String),
    ModelName: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    InferenceSchedulerArn: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
    DataDelayOffsetInMinutes: S.optional(S.Number),
    DataUploadFrequency: S.optional(DataUploadFrequency),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataInputConfiguration: S.optional(InferenceInputConfiguration),
    DataOutputConfiguration: S.optional(InferenceOutputConfiguration),
    RoleArn: S.optional(S.String),
    ServerSideKmsKeyId: S.optional(S.String),
    LatestInferenceResult: S.optional(LatestInferenceResult),
  }),
).annotations({
  identifier: "DescribeInferenceSchedulerResponse",
}) as any as S.Schema<DescribeInferenceSchedulerResponse>;
export interface DescribeLabelResponse {
  LabelGroupName?: string;
  LabelGroupArn?: string;
  LabelId?: string;
  StartTime?: Date;
  EndTime?: Date;
  Rating?: LabelRating;
  FaultCode?: string;
  Notes?: string;
  Equipment?: string;
  CreatedAt?: Date;
}
export const DescribeLabelResponse = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.optional(S.String),
    LabelGroupArn: S.optional(S.String),
    LabelId: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Rating: S.optional(LabelRating),
    FaultCode: S.optional(S.String),
    Notes: S.optional(S.String),
    Equipment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLabelResponse",
}) as any as S.Schema<DescribeLabelResponse>;
export interface DescribeLabelGroupResponse {
  LabelGroupName?: string;
  LabelGroupArn?: string;
  FaultCodes?: string[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const DescribeLabelGroupResponse = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.optional(S.String),
    LabelGroupArn: S.optional(S.String),
    FaultCodes: S.optional(FaultCodes),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLabelGroupResponse",
}) as any as S.Schema<DescribeLabelGroupResponse>;
export interface DescribeModelResponse {
  ModelName?: string;
  ModelArn?: string;
  DatasetName?: string;
  DatasetArn?: string;
  Schema?: string;
  LabelsInputConfiguration?: LabelsInputConfiguration;
  TrainingDataStartTime?: Date;
  TrainingDataEndTime?: Date;
  EvaluationDataStartTime?: Date;
  EvaluationDataEndTime?: Date;
  RoleArn?: string;
  DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
  Status?: ModelStatus;
  TrainingExecutionStartTime?: Date;
  TrainingExecutionEndTime?: Date;
  FailedReason?: string;
  ModelMetrics?: string;
  LastUpdatedTime?: Date;
  CreatedAt?: Date;
  ServerSideKmsKeyId?: string;
  OffCondition?: string;
  SourceModelVersionArn?: string;
  ImportJobStartTime?: Date;
  ImportJobEndTime?: Date;
  ActiveModelVersion?: number;
  ActiveModelVersionArn?: string;
  ModelVersionActivatedAt?: Date;
  PreviousActiveModelVersion?: number;
  PreviousActiveModelVersionArn?: string;
  PreviousModelVersionActivatedAt?: Date;
  PriorModelMetrics?: string;
  LatestScheduledRetrainingFailedReason?: string;
  LatestScheduledRetrainingStatus?: ModelVersionStatus;
  LatestScheduledRetrainingModelVersion?: number;
  LatestScheduledRetrainingStartTime?: Date;
  LatestScheduledRetrainingAvailableDataInDays?: number;
  NextScheduledRetrainingStartDate?: Date;
  AccumulatedInferenceDataStartTime?: Date;
  AccumulatedInferenceDataEndTime?: Date;
  RetrainingSchedulerStatus?: RetrainingSchedulerStatus;
  ModelDiagnosticsOutputConfiguration?: ModelDiagnosticsOutputConfiguration;
  ModelQuality?: ModelQuality;
}
export const DescribeModelResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Schema: S.optional(S.String),
    LabelsInputConfiguration: S.optional(LabelsInputConfiguration),
    TrainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RoleArn: S.optional(S.String),
    DataPreProcessingConfiguration: S.optional(DataPreProcessingConfiguration),
    Status: S.optional(ModelStatus),
    TrainingExecutionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingExecutionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailedReason: S.optional(S.String),
    ModelMetrics: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ServerSideKmsKeyId: S.optional(S.String),
    OffCondition: S.optional(S.String),
    SourceModelVersionArn: S.optional(S.String),
    ImportJobStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportJobEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ActiveModelVersion: S.optional(S.Number),
    ActiveModelVersionArn: S.optional(S.String),
    ModelVersionActivatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PreviousActiveModelVersion: S.optional(S.Number),
    PreviousActiveModelVersionArn: S.optional(S.String),
    PreviousModelVersionActivatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PriorModelMetrics: S.optional(S.String),
    LatestScheduledRetrainingFailedReason: S.optional(S.String),
    LatestScheduledRetrainingStatus: S.optional(ModelVersionStatus),
    LatestScheduledRetrainingModelVersion: S.optional(S.Number),
    LatestScheduledRetrainingStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LatestScheduledRetrainingAvailableDataInDays: S.optional(S.Number),
    NextScheduledRetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AccumulatedInferenceDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AccumulatedInferenceDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingSchedulerStatus: S.optional(RetrainingSchedulerStatus),
    ModelDiagnosticsOutputConfiguration: S.optional(
      ModelDiagnosticsOutputConfiguration,
    ),
    ModelQuality: S.optional(ModelQuality),
  }),
).annotations({
  identifier: "DescribeModelResponse",
}) as any as S.Schema<DescribeModelResponse>;
export interface DescribeResourcePolicyResponse {
  PolicyRevisionId?: string;
  ResourcePolicy?: string;
  CreationTime?: Date;
  LastModifiedTime?: Date;
}
export const DescribeResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyRevisionId: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DescribeResourcePolicyResponse",
}) as any as S.Schema<DescribeResourcePolicyResponse>;
export interface DescribeRetrainingSchedulerResponse {
  ModelName?: string;
  ModelArn?: string;
  RetrainingStartDate?: Date;
  RetrainingFrequency?: string;
  LookbackWindow?: string;
  Status?: RetrainingSchedulerStatus;
  PromoteMode?: ModelPromoteMode;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const DescribeRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    RetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingFrequency: S.optional(S.String),
    LookbackWindow: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
    PromoteMode: S.optional(ModelPromoteMode),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeRetrainingSchedulerResponse",
}) as any as S.Schema<DescribeRetrainingSchedulerResponse>;
export interface ImportDatasetResponse {
  DatasetName?: string;
  DatasetArn?: string;
  Status?: DatasetStatus;
  JobId?: string;
}
export const ImportDatasetResponse = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Status: S.optional(DatasetStatus),
    JobId: S.optional(S.String),
  }),
).annotations({
  identifier: "ImportDatasetResponse",
}) as any as S.Schema<ImportDatasetResponse>;
export interface ImportModelVersionResponse {
  ModelName?: string;
  ModelArn?: string;
  ModelVersionArn?: string;
  ModelVersion?: number;
  Status?: ModelVersionStatus;
}
export const ImportModelVersionResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    ModelVersionArn: S.optional(S.String),
    ModelVersion: S.optional(S.Number),
    Status: S.optional(ModelVersionStatus),
  }),
).annotations({
  identifier: "ImportModelVersionResponse",
}) as any as S.Schema<ImportModelVersionResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutResourcePolicyResponse {
  ResourceArn?: string;
  PolicyRevisionId?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    PolicyRevisionId: S.optional(S.String),
  }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface StartInferenceSchedulerResponse {
  ModelArn?: string;
  ModelName?: string;
  InferenceSchedulerName?: string;
  InferenceSchedulerArn?: string;
  Status?: InferenceSchedulerStatus;
}
export const StartInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelArn: S.optional(S.String),
    ModelName: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    InferenceSchedulerArn: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
  }),
).annotations({
  identifier: "StartInferenceSchedulerResponse",
}) as any as S.Schema<StartInferenceSchedulerResponse>;
export interface StartRetrainingSchedulerResponse {
  ModelName?: string;
  ModelArn?: string;
  Status?: RetrainingSchedulerStatus;
}
export const StartRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
  }),
).annotations({
  identifier: "StartRetrainingSchedulerResponse",
}) as any as S.Schema<StartRetrainingSchedulerResponse>;
export interface StopInferenceSchedulerResponse {
  ModelArn?: string;
  ModelName?: string;
  InferenceSchedulerName?: string;
  InferenceSchedulerArn?: string;
  Status?: InferenceSchedulerStatus;
}
export const StopInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelArn: S.optional(S.String),
    ModelName: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    InferenceSchedulerArn: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
  }),
).annotations({
  identifier: "StopInferenceSchedulerResponse",
}) as any as S.Schema<StopInferenceSchedulerResponse>;
export interface StopRetrainingSchedulerResponse {
  ModelName?: string;
  ModelArn?: string;
  Status?: RetrainingSchedulerStatus;
}
export const StopRetrainingSchedulerResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
  }),
).annotations({
  identifier: "StopRetrainingSchedulerResponse",
}) as any as S.Schema<StopRetrainingSchedulerResponse>;
export interface UpdateActiveModelVersionResponse {
  ModelName?: string;
  ModelArn?: string;
  CurrentActiveVersion?: number;
  PreviousActiveVersion?: number;
  CurrentActiveVersionArn?: string;
  PreviousActiveVersionArn?: string;
}
export const UpdateActiveModelVersionResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    CurrentActiveVersion: S.optional(S.Number),
    PreviousActiveVersion: S.optional(S.Number),
    CurrentActiveVersionArn: S.optional(S.String),
    PreviousActiveVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateActiveModelVersionResponse",
}) as any as S.Schema<UpdateActiveModelVersionResponse>;
export interface DataIngestionJobSummary {
  JobId?: string;
  DatasetName?: string;
  DatasetArn?: string;
  IngestionInputConfiguration?: IngestionInputConfiguration;
  Status?: IngestionJobStatus;
}
export const DataIngestionJobSummary = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    IngestionInputConfiguration: S.optional(IngestionInputConfiguration),
    Status: S.optional(IngestionJobStatus),
  }),
).annotations({
  identifier: "DataIngestionJobSummary",
}) as any as S.Schema<DataIngestionJobSummary>;
export type DataIngestionJobSummaries = DataIngestionJobSummary[];
export const DataIngestionJobSummaries = S.Array(DataIngestionJobSummary);
export interface DatasetSummary {
  DatasetName?: string;
  DatasetArn?: string;
  Status?: DatasetStatus;
  CreatedAt?: Date;
}
export const DatasetSummary = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Status: S.optional(DatasetStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DatasetSummary",
}) as any as S.Schema<DatasetSummary>;
export type DatasetSummaries = DatasetSummary[];
export const DatasetSummaries = S.Array(DatasetSummary);
export interface InferenceEventSummary {
  InferenceSchedulerArn?: string;
  InferenceSchedulerName?: string;
  EventStartTime?: Date;
  EventEndTime?: Date;
  Diagnostics?: string;
  EventDurationInSeconds?: number;
}
export const InferenceEventSummary = S.suspend(() =>
  S.Struct({
    InferenceSchedulerArn: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    EventStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Diagnostics: S.optional(S.String),
    EventDurationInSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "InferenceEventSummary",
}) as any as S.Schema<InferenceEventSummary>;
export type InferenceEventSummaries = InferenceEventSummary[];
export const InferenceEventSummaries = S.Array(InferenceEventSummary);
export interface InferenceExecutionSummary {
  ModelName?: string;
  ModelArn?: string;
  InferenceSchedulerName?: string;
  InferenceSchedulerArn?: string;
  ScheduledStartTime?: Date;
  DataStartTime?: Date;
  DataEndTime?: Date;
  DataInputConfiguration?: InferenceInputConfiguration;
  DataOutputConfiguration?: InferenceOutputConfiguration;
  CustomerResultObject?: S3Object;
  Status?: InferenceExecutionStatus;
  FailedReason?: string;
  ModelVersion?: number;
  ModelVersionArn?: string;
}
export const InferenceExecutionSummary = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    InferenceSchedulerArn: S.optional(S.String),
    ScheduledStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DataStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataInputConfiguration: S.optional(InferenceInputConfiguration),
    DataOutputConfiguration: S.optional(InferenceOutputConfiguration),
    CustomerResultObject: S.optional(S3Object),
    Status: S.optional(InferenceExecutionStatus),
    FailedReason: S.optional(S.String),
    ModelVersion: S.optional(S.Number),
    ModelVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "InferenceExecutionSummary",
}) as any as S.Schema<InferenceExecutionSummary>;
export type InferenceExecutionSummaries = InferenceExecutionSummary[];
export const InferenceExecutionSummaries = S.Array(InferenceExecutionSummary);
export interface InferenceSchedulerSummary {
  ModelName?: string;
  ModelArn?: string;
  InferenceSchedulerName?: string;
  InferenceSchedulerArn?: string;
  Status?: InferenceSchedulerStatus;
  DataDelayOffsetInMinutes?: number;
  DataUploadFrequency?: DataUploadFrequency;
  LatestInferenceResult?: LatestInferenceResult;
}
export const InferenceSchedulerSummary = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    InferenceSchedulerArn: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
    DataDelayOffsetInMinutes: S.optional(S.Number),
    DataUploadFrequency: S.optional(DataUploadFrequency),
    LatestInferenceResult: S.optional(LatestInferenceResult),
  }),
).annotations({
  identifier: "InferenceSchedulerSummary",
}) as any as S.Schema<InferenceSchedulerSummary>;
export type InferenceSchedulerSummaries = InferenceSchedulerSummary[];
export const InferenceSchedulerSummaries = S.Array(InferenceSchedulerSummary);
export interface LabelGroupSummary {
  LabelGroupName?: string;
  LabelGroupArn?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}
export const LabelGroupSummary = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.optional(S.String),
    LabelGroupArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LabelGroupSummary",
}) as any as S.Schema<LabelGroupSummary>;
export type LabelGroupSummaries = LabelGroupSummary[];
export const LabelGroupSummaries = S.Array(LabelGroupSummary);
export interface LabelSummary {
  LabelGroupName?: string;
  LabelId?: string;
  LabelGroupArn?: string;
  StartTime?: Date;
  EndTime?: Date;
  Rating?: LabelRating;
  FaultCode?: string;
  Equipment?: string;
  CreatedAt?: Date;
}
export const LabelSummary = S.suspend(() =>
  S.Struct({
    LabelGroupName: S.optional(S.String),
    LabelId: S.optional(S.String),
    LabelGroupArn: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Rating: S.optional(LabelRating),
    FaultCode: S.optional(S.String),
    Equipment: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "LabelSummary" }) as any as S.Schema<LabelSummary>;
export type LabelSummaries = LabelSummary[];
export const LabelSummaries = S.Array(LabelSummary);
export interface ModelSummary {
  ModelName?: string;
  ModelArn?: string;
  DatasetName?: string;
  DatasetArn?: string;
  Status?: ModelStatus;
  CreatedAt?: Date;
  ActiveModelVersion?: number;
  ActiveModelVersionArn?: string;
  LatestScheduledRetrainingStatus?: ModelVersionStatus;
  LatestScheduledRetrainingModelVersion?: number;
  LatestScheduledRetrainingStartTime?: Date;
  NextScheduledRetrainingStartDate?: Date;
  RetrainingSchedulerStatus?: RetrainingSchedulerStatus;
  ModelDiagnosticsOutputConfiguration?: ModelDiagnosticsOutputConfiguration;
  ModelQuality?: ModelQuality;
}
export const ModelSummary = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Status: S.optional(ModelStatus),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ActiveModelVersion: S.optional(S.Number),
    ActiveModelVersionArn: S.optional(S.String),
    LatestScheduledRetrainingStatus: S.optional(ModelVersionStatus),
    LatestScheduledRetrainingModelVersion: S.optional(S.Number),
    LatestScheduledRetrainingStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NextScheduledRetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingSchedulerStatus: S.optional(RetrainingSchedulerStatus),
    ModelDiagnosticsOutputConfiguration: S.optional(
      ModelDiagnosticsOutputConfiguration,
    ),
    ModelQuality: S.optional(ModelQuality),
  }),
).annotations({ identifier: "ModelSummary" }) as any as S.Schema<ModelSummary>;
export type ModelSummaries = ModelSummary[];
export const ModelSummaries = S.Array(ModelSummary);
export interface ModelVersionSummary {
  ModelName?: string;
  ModelArn?: string;
  ModelVersion?: number;
  ModelVersionArn?: string;
  CreatedAt?: Date;
  Status?: ModelVersionStatus;
  SourceType?: ModelVersionSourceType;
  ModelQuality?: ModelQuality;
}
export const ModelVersionSummary = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    ModelVersion: S.optional(S.Number),
    ModelVersionArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(ModelVersionStatus),
    SourceType: S.optional(ModelVersionSourceType),
    ModelQuality: S.optional(ModelQuality),
  }),
).annotations({
  identifier: "ModelVersionSummary",
}) as any as S.Schema<ModelVersionSummary>;
export type ModelVersionSummaries = ModelVersionSummary[];
export const ModelVersionSummaries = S.Array(ModelVersionSummary);
export interface RetrainingSchedulerSummary {
  ModelName?: string;
  ModelArn?: string;
  Status?: RetrainingSchedulerStatus;
  RetrainingStartDate?: Date;
  RetrainingFrequency?: string;
  LookbackWindow?: string;
}
export const RetrainingSchedulerSummary = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    Status: S.optional(RetrainingSchedulerStatus),
    RetrainingStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RetrainingFrequency: S.optional(S.String),
    LookbackWindow: S.optional(S.String),
  }),
).annotations({
  identifier: "RetrainingSchedulerSummary",
}) as any as S.Schema<RetrainingSchedulerSummary>;
export type RetrainingSchedulerSummaries = RetrainingSchedulerSummary[];
export const RetrainingSchedulerSummaries = S.Array(RetrainingSchedulerSummary);
export type StatisticalIssueStatus =
  | "POTENTIAL_ISSUE_DETECTED"
  | "NO_ISSUE_DETECTED"
  | (string & {});
export const StatisticalIssueStatus = S.String;
export type Monotonicity =
  | "DECREASING"
  | "INCREASING"
  | "STATIC"
  | (string & {});
export const Monotonicity = S.String;
export interface CreateDatasetResponse {
  DatasetName?: string;
  DatasetArn?: string;
  Status?: DatasetStatus;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Status: S.optional(DatasetStatus),
  }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;
export interface CreateInferenceSchedulerRequest {
  ModelName: string;
  InferenceSchedulerName: string;
  DataDelayOffsetInMinutes?: number;
  DataUploadFrequency: DataUploadFrequency;
  DataInputConfiguration: InferenceInputConfiguration;
  DataOutputConfiguration: InferenceOutputConfiguration;
  RoleArn: string;
  ServerSideKmsKeyId?: string;
  ClientToken: string;
  Tags?: Tag[];
}
export const CreateInferenceSchedulerRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    InferenceSchedulerName: S.String,
    DataDelayOffsetInMinutes: S.optional(S.Number),
    DataUploadFrequency: DataUploadFrequency,
    DataInputConfiguration: InferenceInputConfiguration,
    DataOutputConfiguration: InferenceOutputConfiguration,
    RoleArn: S.String,
    ServerSideKmsKeyId: S.optional(S.String),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateInferenceSchedulerRequest",
}) as any as S.Schema<CreateInferenceSchedulerRequest>;
export interface CreateModelRequest {
  ModelName: string;
  DatasetName: string;
  DatasetSchema?: DatasetSchema;
  LabelsInputConfiguration?: LabelsInputConfiguration;
  ClientToken: string;
  TrainingDataStartTime?: Date;
  TrainingDataEndTime?: Date;
  EvaluationDataStartTime?: Date;
  EvaluationDataEndTime?: Date;
  RoleArn?: string;
  DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
  ServerSideKmsKeyId?: string;
  Tags?: Tag[];
  OffCondition?: string;
  ModelDiagnosticsOutputConfiguration?: ModelDiagnosticsOutputConfiguration;
}
export const CreateModelRequest = S.suspend(() =>
  S.Struct({
    ModelName: S.String,
    DatasetName: S.String,
    DatasetSchema: S.optional(DatasetSchema),
    LabelsInputConfiguration: S.optional(LabelsInputConfiguration),
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    TrainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RoleArn: S.optional(S.String),
    DataPreProcessingConfiguration: S.optional(DataPreProcessingConfiguration),
    ServerSideKmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    OffCondition: S.optional(S.String),
    ModelDiagnosticsOutputConfiguration: S.optional(
      ModelDiagnosticsOutputConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateModelRequest",
}) as any as S.Schema<CreateModelRequest>;
export interface DescribeModelVersionResponse {
  ModelName?: string;
  ModelArn?: string;
  ModelVersion?: number;
  ModelVersionArn?: string;
  Status?: ModelVersionStatus;
  SourceType?: ModelVersionSourceType;
  DatasetName?: string;
  DatasetArn?: string;
  Schema?: string;
  LabelsInputConfiguration?: LabelsInputConfiguration;
  TrainingDataStartTime?: Date;
  TrainingDataEndTime?: Date;
  EvaluationDataStartTime?: Date;
  EvaluationDataEndTime?: Date;
  RoleArn?: string;
  DataPreProcessingConfiguration?: DataPreProcessingConfiguration;
  TrainingExecutionStartTime?: Date;
  TrainingExecutionEndTime?: Date;
  FailedReason?: string;
  ModelMetrics?: string;
  LastUpdatedTime?: Date;
  CreatedAt?: Date;
  ServerSideKmsKeyId?: string;
  OffCondition?: string;
  SourceModelVersionArn?: string;
  ImportJobStartTime?: Date;
  ImportJobEndTime?: Date;
  ImportedDataSizeInBytes?: number;
  PriorModelMetrics?: string;
  RetrainingAvailableDataInDays?: number;
  AutoPromotionResult?: AutoPromotionResult;
  AutoPromotionResultReason?: string;
  ModelDiagnosticsOutputConfiguration?: ModelDiagnosticsOutputConfiguration;
  ModelDiagnosticsResultsObject?: S3Object;
  ModelQuality?: ModelQuality;
}
export const DescribeModelVersionResponse = S.suspend(() =>
  S.Struct({
    ModelName: S.optional(S.String),
    ModelArn: S.optional(S.String),
    ModelVersion: S.optional(S.Number),
    ModelVersionArn: S.optional(S.String),
    Status: S.optional(ModelVersionStatus),
    SourceType: S.optional(ModelVersionSourceType),
    DatasetName: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    Schema: S.optional(S.String),
    LabelsInputConfiguration: S.optional(LabelsInputConfiguration),
    TrainingDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EvaluationDataEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RoleArn: S.optional(S.String),
    DataPreProcessingConfiguration: S.optional(DataPreProcessingConfiguration),
    TrainingExecutionStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingExecutionEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailedReason: S.optional(S.String),
    ModelMetrics: S.optional(S.String),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ServerSideKmsKeyId: S.optional(S.String),
    OffCondition: S.optional(S.String),
    SourceModelVersionArn: S.optional(S.String),
    ImportJobStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportJobEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImportedDataSizeInBytes: S.optional(S.Number),
    PriorModelMetrics: S.optional(S.String),
    RetrainingAvailableDataInDays: S.optional(S.Number),
    AutoPromotionResult: S.optional(AutoPromotionResult),
    AutoPromotionResultReason: S.optional(S.String),
    ModelDiagnosticsOutputConfiguration: S.optional(
      ModelDiagnosticsOutputConfiguration,
    ),
    ModelDiagnosticsResultsObject: S.optional(S3Object),
    ModelQuality: S.optional(ModelQuality),
  }),
).annotations({
  identifier: "DescribeModelVersionResponse",
}) as any as S.Schema<DescribeModelVersionResponse>;
export interface ListDataIngestionJobsResponse {
  NextToken?: string;
  DataIngestionJobSummaries?: DataIngestionJobSummary[];
}
export const ListDataIngestionJobsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DataIngestionJobSummaries: S.optional(DataIngestionJobSummaries),
  }),
).annotations({
  identifier: "ListDataIngestionJobsResponse",
}) as any as S.Schema<ListDataIngestionJobsResponse>;
export interface ListDatasetsResponse {
  NextToken?: string;
  DatasetSummaries?: DatasetSummary[];
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DatasetSummaries: S.optional(DatasetSummaries),
  }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListInferenceEventsResponse {
  NextToken?: string;
  InferenceEventSummaries?: InferenceEventSummary[];
}
export const ListInferenceEventsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    InferenceEventSummaries: S.optional(InferenceEventSummaries),
  }),
).annotations({
  identifier: "ListInferenceEventsResponse",
}) as any as S.Schema<ListInferenceEventsResponse>;
export interface ListInferenceExecutionsResponse {
  NextToken?: string;
  InferenceExecutionSummaries?: InferenceExecutionSummary[];
}
export const ListInferenceExecutionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    InferenceExecutionSummaries: S.optional(InferenceExecutionSummaries),
  }),
).annotations({
  identifier: "ListInferenceExecutionsResponse",
}) as any as S.Schema<ListInferenceExecutionsResponse>;
export interface ListInferenceSchedulersResponse {
  NextToken?: string;
  InferenceSchedulerSummaries?: InferenceSchedulerSummary[];
}
export const ListInferenceSchedulersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    InferenceSchedulerSummaries: S.optional(InferenceSchedulerSummaries),
  }),
).annotations({
  identifier: "ListInferenceSchedulersResponse",
}) as any as S.Schema<ListInferenceSchedulersResponse>;
export interface ListLabelGroupsResponse {
  NextToken?: string;
  LabelGroupSummaries?: LabelGroupSummary[];
}
export const ListLabelGroupsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    LabelGroupSummaries: S.optional(LabelGroupSummaries),
  }),
).annotations({
  identifier: "ListLabelGroupsResponse",
}) as any as S.Schema<ListLabelGroupsResponse>;
export interface ListLabelsResponse {
  NextToken?: string;
  LabelSummaries?: LabelSummary[];
}
export const ListLabelsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    LabelSummaries: S.optional(LabelSummaries),
  }),
).annotations({
  identifier: "ListLabelsResponse",
}) as any as S.Schema<ListLabelsResponse>;
export interface ListModelsResponse {
  NextToken?: string;
  ModelSummaries?: ModelSummary[];
}
export const ListModelsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ModelSummaries: S.optional(ModelSummaries),
  }),
).annotations({
  identifier: "ListModelsResponse",
}) as any as S.Schema<ListModelsResponse>;
export interface ListModelVersionsResponse {
  NextToken?: string;
  ModelVersionSummaries?: ModelVersionSummary[];
}
export const ListModelVersionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ModelVersionSummaries: S.optional(ModelVersionSummaries),
  }),
).annotations({
  identifier: "ListModelVersionsResponse",
}) as any as S.Schema<ListModelVersionsResponse>;
export interface ListRetrainingSchedulersResponse {
  RetrainingSchedulerSummaries?: RetrainingSchedulerSummary[];
  NextToken?: string;
}
export const ListRetrainingSchedulersResponse = S.suspend(() =>
  S.Struct({
    RetrainingSchedulerSummaries: S.optional(RetrainingSchedulerSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRetrainingSchedulersResponse",
}) as any as S.Schema<ListRetrainingSchedulersResponse>;
export interface StartDataIngestionJobRequest {
  DatasetName: string;
  IngestionInputConfiguration: IngestionInputConfiguration;
  RoleArn: string;
  ClientToken: string;
}
export const StartDataIngestionJobRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    IngestionInputConfiguration: IngestionInputConfiguration,
    RoleArn: S.String,
    ClientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDataIngestionJobRequest",
}) as any as S.Schema<StartDataIngestionJobRequest>;
export interface CountPercent {
  Count: number;
  Percentage: number;
}
export const CountPercent = S.suspend(() =>
  S.Struct({ Count: S.Number, Percentage: S.Number }),
).annotations({ identifier: "CountPercent" }) as any as S.Schema<CountPercent>;
export interface CategoricalValues {
  Status: StatisticalIssueStatus;
  NumberOfCategory?: number;
}
export const CategoricalValues = S.suspend(() =>
  S.Struct({
    Status: StatisticalIssueStatus,
    NumberOfCategory: S.optional(S.Number),
  }),
).annotations({
  identifier: "CategoricalValues",
}) as any as S.Schema<CategoricalValues>;
export interface MultipleOperatingModes {
  Status: StatisticalIssueStatus;
}
export const MultipleOperatingModes = S.suspend(() =>
  S.Struct({ Status: StatisticalIssueStatus }),
).annotations({
  identifier: "MultipleOperatingModes",
}) as any as S.Schema<MultipleOperatingModes>;
export interface LargeTimestampGaps {
  Status: StatisticalIssueStatus;
  NumberOfLargeTimestampGaps?: number;
  MaxTimestampGapInDays?: number;
}
export const LargeTimestampGaps = S.suspend(() =>
  S.Struct({
    Status: StatisticalIssueStatus,
    NumberOfLargeTimestampGaps: S.optional(S.Number),
    MaxTimestampGapInDays: S.optional(S.Number),
  }),
).annotations({
  identifier: "LargeTimestampGaps",
}) as any as S.Schema<LargeTimestampGaps>;
export interface MonotonicValues {
  Status: StatisticalIssueStatus;
  Monotonicity?: Monotonicity;
}
export const MonotonicValues = S.suspend(() =>
  S.Struct({
    Status: StatisticalIssueStatus,
    Monotonicity: S.optional(Monotonicity),
  }),
).annotations({
  identifier: "MonotonicValues",
}) as any as S.Schema<MonotonicValues>;
export interface SensorStatisticsSummary {
  ComponentName?: string;
  SensorName?: string;
  DataExists?: boolean;
  MissingValues?: CountPercent;
  InvalidValues?: CountPercent;
  InvalidDateEntries?: CountPercent;
  DuplicateTimestamps?: CountPercent;
  CategoricalValues?: CategoricalValues;
  MultipleOperatingModes?: MultipleOperatingModes;
  LargeTimestampGaps?: LargeTimestampGaps;
  MonotonicValues?: MonotonicValues;
  DataStartTime?: Date;
  DataEndTime?: Date;
}
export const SensorStatisticsSummary = S.suspend(() =>
  S.Struct({
    ComponentName: S.optional(S.String),
    SensorName: S.optional(S.String),
    DataExists: S.optional(S.Boolean),
    MissingValues: S.optional(CountPercent),
    InvalidValues: S.optional(CountPercent),
    InvalidDateEntries: S.optional(CountPercent),
    DuplicateTimestamps: S.optional(CountPercent),
    CategoricalValues: S.optional(CategoricalValues),
    MultipleOperatingModes: S.optional(MultipleOperatingModes),
    LargeTimestampGaps: S.optional(LargeTimestampGaps),
    MonotonicValues: S.optional(MonotonicValues),
    DataStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SensorStatisticsSummary",
}) as any as S.Schema<SensorStatisticsSummary>;
export type SensorStatisticsSummaries = SensorStatisticsSummary[];
export const SensorStatisticsSummaries = S.Array(SensorStatisticsSummary);
export interface CreateInferenceSchedulerResponse {
  InferenceSchedulerArn?: string;
  InferenceSchedulerName?: string;
  Status?: InferenceSchedulerStatus;
  ModelQuality?: ModelQuality;
}
export const CreateInferenceSchedulerResponse = S.suspend(() =>
  S.Struct({
    InferenceSchedulerArn: S.optional(S.String),
    InferenceSchedulerName: S.optional(S.String),
    Status: S.optional(InferenceSchedulerStatus),
    ModelQuality: S.optional(ModelQuality),
  }),
).annotations({
  identifier: "CreateInferenceSchedulerResponse",
}) as any as S.Schema<CreateInferenceSchedulerResponse>;
export interface CreateModelResponse {
  ModelArn?: string;
  Status?: ModelStatus;
}
export const CreateModelResponse = S.suspend(() =>
  S.Struct({ ModelArn: S.optional(S.String), Status: S.optional(ModelStatus) }),
).annotations({
  identifier: "CreateModelResponse",
}) as any as S.Schema<CreateModelResponse>;
export interface ListSensorStatisticsResponse {
  SensorStatisticsSummaries?: SensorStatisticsSummary[];
  NextToken?: string;
}
export const ListSensorStatisticsResponse = S.suspend(() =>
  S.Struct({
    SensorStatisticsSummaries: S.optional(SensorStatisticsSummaries),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSensorStatisticsResponse",
}) as any as S.Schema<ListSensorStatisticsResponse>;
export interface StartDataIngestionJobResponse {
  JobId?: string;
  Status?: IngestionJobStatus;
}
export const StartDataIngestionJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    Status: S.optional(IngestionJobStatus),
  }),
).annotations({
  identifier: "StartDataIngestionJobResponse",
}) as any as S.Schema<StartDataIngestionJobResponse>;
export interface DescribeDataIngestionJobResponse {
  JobId?: string;
  DatasetArn?: string;
  IngestionInputConfiguration?: IngestionInputConfiguration;
  RoleArn?: string;
  CreatedAt?: Date;
  Status?: IngestionJobStatus;
  FailedReason?: string;
  DataQualitySummary?: DataQualitySummary;
  IngestedFilesSummary?: IngestedFilesSummary;
  StatusDetail?: string;
  IngestedDataSize?: number;
  DataStartTime?: Date;
  DataEndTime?: Date;
  SourceDatasetArn?: string;
}
export const DescribeDataIngestionJobResponse = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    DatasetArn: S.optional(S.String),
    IngestionInputConfiguration: S.optional(IngestionInputConfiguration),
    RoleArn: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(IngestionJobStatus),
    FailedReason: S.optional(S.String),
    DataQualitySummary: S.optional(DataQualitySummary),
    IngestedFilesSummary: S.optional(IngestedFilesSummary),
    StatusDetail: S.optional(S.String),
    IngestedDataSize: S.optional(S.Number),
    DataStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceDatasetArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDataIngestionJobResponse",
}) as any as S.Schema<DescribeDataIngestionJobResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Provides a list of all data ingestion jobs, including dataset name and ARN, S3 location
 * of the input data, status, and so on.
 */
export const listDataIngestionJobs: {
  (
    input: ListDataIngestionJobsRequest,
  ): effect.Effect<
    ListDataIngestionJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataIngestionJobsRequest,
  ) => stream.Stream<
    ListDataIngestionJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataIngestionJobsRequest,
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
  input: ListDataIngestionJobsRequest,
  output: ListDataIngestionJobsResponse,
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
 * Lists statistics about the data collected for each of the sensors that have been
 * successfully ingested in the particular dataset. Can also be used to retreive Sensor
 * Statistics for a previous ingestion job.
 */
export const listSensorStatistics: {
  (
    input: ListSensorStatisticsRequest,
  ): effect.Effect<
    ListSensorStatisticsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSensorStatisticsRequest,
  ) => stream.Stream<
    ListSensorStatisticsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSensorStatisticsRequest,
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
  input: ListSensorStatisticsRequest,
  output: ListSensorStatisticsResponse,
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
 * Creates a group of labels.
 */
export const createLabelGroup: (
  input: CreateLabelGroupRequest,
) => effect.Effect<
  CreateLabelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLabelGroupRequest,
  output: CreateLabelGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a specific machine learning model version.
 */
export const describeModelVersion: (
  input: DescribeModelVersionRequest,
) => effect.Effect<
  DescribeModelVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeModelVersionRequest,
  output: DescribeModelVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all inference events that have been found for the specified inference scheduler.
 */
export const listInferenceEvents: {
  (
    input: ListInferenceEventsRequest,
  ): effect.Effect<
    ListInferenceEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInferenceEventsRequest,
  ) => stream.Stream<
    ListInferenceEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInferenceEventsRequest,
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
  input: ListInferenceEventsRequest,
  output: ListInferenceEventsResponse,
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
 * Lists all inference executions that have been performed by the specified inference
 * scheduler.
 */
export const listInferenceExecutions: {
  (
    input: ListInferenceExecutionsRequest,
  ): effect.Effect<
    ListInferenceExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInferenceExecutionsRequest,
  ) => stream.Stream<
    ListInferenceExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInferenceExecutionsRequest,
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
  input: ListInferenceExecutionsRequest,
  output: ListInferenceExecutionsResponse,
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
 * Generates a list of all model versions for a given model, including the model version,
 * model version ARN, and status. To list a subset of versions, use the
 * `MaxModelVersion` and `MinModelVersion` fields.
 */
export const listModelVersions: {
  (
    input: ListModelVersionsRequest,
  ): effect.Effect<
    ListModelVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelVersionsRequest,
  ) => stream.Stream<
    ListModelVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelVersionsRequest,
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
  input: ListModelVersionsRequest,
  output: ListModelVersionsResponse,
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
 * Imports a dataset.
 */
export const importDataset: (
  input: ImportDatasetRequest,
) => effect.Effect<
  ImportDatasetResponse,
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
  input: ImportDatasetRequest,
  output: ImportDatasetResponse,
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
 * Imports a model that has been trained successfully.
 */
export const importModelVersion: (
  input: ImportModelVersionRequest,
) => effect.Effect<
  ImportModelVersionResponse,
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
  input: ImportModelVersionRequest,
  output: ImportModelVersionResponse,
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
 * Creates a resource control policy for a given resource.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
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
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
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
 * Starts an inference scheduler.
 */
export const startInferenceScheduler: (
  input: StartInferenceSchedulerRequest,
) => effect.Effect<
  StartInferenceSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInferenceSchedulerRequest,
  output: StartInferenceSchedulerResponse,
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
 * Starts a retraining scheduler.
 */
export const startRetrainingScheduler: (
  input: StartRetrainingSchedulerRequest,
) => effect.Effect<
  StartRetrainingSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRetrainingSchedulerRequest,
  output: StartRetrainingSchedulerResponse,
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
 * Stops an inference scheduler.
 */
export const stopInferenceScheduler: (
  input: StopInferenceSchedulerRequest,
) => effect.Effect<
  StopInferenceSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopInferenceSchedulerRequest,
  output: StopInferenceSchedulerResponse,
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
 * Stops a retraining scheduler.
 */
export const stopRetrainingScheduler: (
  input: StopRetrainingSchedulerRequest,
) => effect.Effect<
  StopRetrainingSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRetrainingSchedulerRequest,
  output: StopRetrainingSchedulerResponse,
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
 * Sets the active model version for a given machine learning model.
 */
export const updateActiveModelVersion: (
  input: UpdateActiveModelVersionRequest,
) => effect.Effect<
  UpdateActiveModelVersionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActiveModelVersionRequest,
  output: UpdateActiveModelVersionResponse,
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
 * Deletes an inference scheduler that has been set up. Prior inference results will not be
 * deleted.
 */
export const deleteInferenceScheduler: (
  input: DeleteInferenceSchedulerRequest,
) => effect.Effect<
  DeleteInferenceSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInferenceSchedulerRequest,
  output: DeleteInferenceSchedulerResponse,
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
 * Deletes a label.
 */
export const deleteLabel: (
  input: DeleteLabelRequest,
) => effect.Effect<
  DeleteLabelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLabelRequest,
  output: DeleteLabelResponse,
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
 * Deletes a group of labels.
 */
export const deleteLabelGroup: (
  input: DeleteLabelGroupRequest,
) => effect.Effect<
  DeleteLabelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLabelGroupRequest,
  output: DeleteLabelGroupResponse,
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
 * Deletes a machine learning model currently available for Amazon Lookout for Equipment. This will prevent it
 * from being used with an inference scheduler, even one that is already set up.
 */
export const deleteModel: (
  input: DeleteModelRequest,
) => effect.Effect<
  DeleteModelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelRequest,
  output: DeleteModelResponse,
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
 * Deletes the resource policy attached to the resource.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
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
 * Deletes a retraining scheduler from a model. The retraining scheduler must be in the
 * `STOPPED` status.
 */
export const deleteRetrainingScheduler: (
  input: DeleteRetrainingSchedulerRequest,
) => effect.Effect<
  DeleteRetrainingSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRetrainingSchedulerRequest,
  output: DeleteRetrainingSchedulerResponse,
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
 * Updates an inference scheduler.
 */
export const updateInferenceScheduler: (
  input: UpdateInferenceSchedulerRequest,
) => effect.Effect<
  UpdateInferenceSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInferenceSchedulerRequest,
  output: UpdateInferenceSchedulerResponse,
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
 * Updates the label group.
 */
export const updateLabelGroup: (
  input: UpdateLabelGroupRequest,
) => effect.Effect<
  UpdateLabelGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLabelGroupRequest,
  output: UpdateLabelGroupResponse,
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
 * Updates a model in the account.
 */
export const updateModel: (
  input: UpdateModelRequest,
) => effect.Effect<
  UpdateModelResponse,
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
  output: UpdateModelResponse,
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
 * Updates a retraining scheduler.
 */
export const updateRetrainingScheduler: (
  input: UpdateRetrainingSchedulerRequest,
) => effect.Effect<
  UpdateRetrainingSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRetrainingSchedulerRequest,
  output: UpdateRetrainingSchedulerResponse,
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
 * Creates a label for an event.
 */
export const createLabel: (
  input: CreateLabelRequest,
) => effect.Effect<
  CreateLabelResponse,
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
  input: CreateLabelRequest,
  output: CreateLabelResponse,
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
 * Creates a retraining scheduler on the specified model.
 */
export const createRetrainingScheduler: (
  input: CreateRetrainingSchedulerRequest,
) => effect.Effect<
  CreateRetrainingSchedulerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRetrainingSchedulerRequest,
  output: CreateRetrainingSchedulerResponse,
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
 * Specifies information about the inference scheduler being used, including name, model,
 * status, and associated metadata
 */
export const describeInferenceScheduler: (
  input: DescribeInferenceSchedulerRequest,
) => effect.Effect<
  DescribeInferenceSchedulerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInferenceSchedulerRequest,
  output: DescribeInferenceSchedulerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the name of the label.
 */
export const describeLabel: (
  input: DescribeLabelRequest,
) => effect.Effect<
  DescribeLabelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLabelRequest,
  output: DescribeLabelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the label group.
 */
export const describeLabelGroup: (
  input: DescribeLabelGroupRequest,
) => effect.Effect<
  DescribeLabelGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLabelGroupRequest,
  output: DescribeLabelGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a JSON containing the overall information about a specific machine learning
 * model, including model name and ARN, dataset, training and evaluation information, status,
 * and so on.
 */
export const describeModel: (
  input: DescribeModelRequest,
) => effect.Effect<
  DescribeModelResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeModelRequest,
  output: DescribeModelResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides the details of a resource policy attached to a resource.
 */
export const describeResourcePolicy: (
  input: DescribeResourcePolicyRequest,
) => effect.Effect<
  DescribeResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeResourcePolicyRequest,
  output: DescribeResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Provides a description of the retraining scheduler, including information such as the
 * model name and retraining parameters.
 */
export const describeRetrainingScheduler: (
  input: DescribeRetrainingSchedulerRequest,
) => effect.Effect<
  DescribeRetrainingSchedulerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRetrainingSchedulerRequest,
  output: DescribeRetrainingSchedulerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the tags for a specified resource, including key and value.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
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
 * Associates a given tag to a resource in your account. A tag is a key-value pair which
 * can be added to an Amazon Lookout for Equipment resource as metadata. Tags can be used for organizing your
 * resources as well as helping you to search and filter by tag. Multiple tags can be added to
 * a resource, either when you create it, or later. Up to 50 tags can be associated with each
 * resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
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
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a specific tag from a given resource. The tag is specified by its key.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
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
 * Deletes a dataset and associated artifacts. The operation will check to see if any
 * inference scheduler or data ingestion job is currently using the dataset, and if there
 * isn't, the dataset, its metadata, and any associated data stored in S3 will be deleted.
 * This does not affect any models that used this dataset for training and evaluation, but
 * does prevent it from being used in the future.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
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
 * Creates a scheduled inference. Scheduling an inference is setting up a continuous
 * real-time inference plan to analyze new measurement data. When setting up the schedule, you
 * provide an S3 bucket location for the input data, assign it a delimiter between separate
 * entries in the data, set an offset delay if desired, and set the frequency of inferencing.
 * You must also provide an S3 bucket location for the output data.
 */
export const createInferenceScheduler: (
  input: CreateInferenceSchedulerRequest,
) => effect.Effect<
  CreateInferenceSchedulerResponse,
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
  input: CreateInferenceSchedulerRequest,
  output: CreateInferenceSchedulerResponse,
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
 * Creates a machine learning model for data inference.
 *
 * A machine-learning (ML) model is a mathematical model that finds patterns in your data.
 * In Amazon Lookout for Equipment, the model learns the patterns of normal behavior and detects abnormal
 * behavior that could be potential equipment failure (or maintenance events). The models are
 * made by analyzing normal data and abnormalities in machine behavior that have already
 * occurred.
 *
 * Your model is trained using a portion of the data from your dataset and uses that data
 * to learn patterns of normal behavior and abnormal patterns that lead to equipment failure.
 * Another portion of the data is used to evaluate the model's accuracy.
 */
export const createModel: (
  input: CreateModelRequest,
) => effect.Effect<
  CreateModelResponse,
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
  input: CreateModelRequest,
  output: CreateModelResponse,
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
 * Lists all datasets currently available in your account, filtering on the dataset name.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
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
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
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
 * Retrieves a list of all inference schedulers currently available for your account.
 */
export const listInferenceSchedulers: {
  (
    input: ListInferenceSchedulersRequest,
  ): effect.Effect<
    ListInferenceSchedulersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInferenceSchedulersRequest,
  ) => stream.Stream<
    ListInferenceSchedulersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInferenceSchedulersRequest,
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
  input: ListInferenceSchedulersRequest,
  output: ListInferenceSchedulersResponse,
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
 * Returns a list of the label groups.
 */
export const listLabelGroups: {
  (
    input: ListLabelGroupsRequest,
  ): effect.Effect<
    ListLabelGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLabelGroupsRequest,
  ) => stream.Stream<
    ListLabelGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLabelGroupsRequest,
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
  input: ListLabelGroupsRequest,
  output: ListLabelGroupsResponse,
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
 * Provides a list of labels.
 */
export const listLabels: {
  (
    input: ListLabelsRequest,
  ): effect.Effect<
    ListLabelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLabelsRequest,
  ) => stream.Stream<
    ListLabelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLabelsRequest,
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
  input: ListLabelsRequest,
  output: ListLabelsResponse,
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
 * Generates a list of all models in the account, including model name and ARN, dataset,
 * and status.
 */
export const listModels: {
  (
    input: ListModelsRequest,
  ): effect.Effect<
    ListModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListModelsRequest,
  ) => stream.Stream<
    ListModelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListModelsRequest,
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
  input: ListModelsRequest,
  output: ListModelsResponse,
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
 * Lists all retraining schedulers in your account, filtering by model name prefix and
 * status.
 */
export const listRetrainingSchedulers: {
  (
    input: ListRetrainingSchedulersRequest,
  ): effect.Effect<
    ListRetrainingSchedulersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRetrainingSchedulersRequest,
  ) => stream.Stream<
    ListRetrainingSchedulersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRetrainingSchedulersRequest,
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
  input: ListRetrainingSchedulersRequest,
  output: ListRetrainingSchedulersResponse,
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
 * Provides a JSON description of the data in each time series dataset, including names,
 * column names, and data types.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => effect.Effect<
  DescribeDatasetResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a container for a collection of data being ingested for analysis. The dataset
 * contains the metadata describing where the data is and what the data actually looks like.
 * For example, it contains the location of the data source, the data schema, and other
 * information. A dataset also contains any tags associated with the ingested data.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a data ingestion job. Amazon Lookout for Equipment returns the job status.
 */
export const startDataIngestionJob: (
  input: StartDataIngestionJobRequest,
) => effect.Effect<
  StartDataIngestionJobResponse,
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
  input: StartDataIngestionJobRequest,
  output: StartDataIngestionJobResponse,
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
 * Provides information on a specific data ingestion job such as creation time, dataset
 * ARN, and status.
 */
export const describeDataIngestionJob: (
  input: DescribeDataIngestionJobRequest,
) => effect.Effect<
  DescribeDataIngestionJobResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataIngestionJobRequest,
  output: DescribeDataIngestionJobResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
