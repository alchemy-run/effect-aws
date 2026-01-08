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
  sdkId: "Personalize",
  serviceShapeName: "AmazonPersonalize",
});
const auth = T.AwsAuthSigv4({ name: "personalize" });
const ver = T.ServiceVersion("2018-05-22");
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
              `https://personalize-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://personalize-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://personalize.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://personalize.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Name = string;
export type Arn = string;
export type NumBatchResults = number;
export type RoleArn = string;
export type TransactionsPerSecond = number;
export type DatasetType = string;
export type KmsKeyArn = string;
export type FilterExpression = string | redacted.Redacted<string>;
export type AvroSchema = string;
export type PerformAutoML = boolean;
export type PerformAutoTraining = boolean;
export type PerformIncrementalUpdate = boolean;
export type EventType = string;
export type NextToken = string;
export type MaxResults = number;
export type TagKey = string | redacted.Redacted<string>;
export type MetricName = string;
export type TagValue = string | redacted.Redacted<string>;
export type S3Location = string;
export type MetricExpression = string;
export type EventValueThreshold = string;
export type TrackingId = string;
export type ErrorMessage = string;
export type ParameterName = string;
export type ParameterValue = string;
export type RankingInfluenceWeight = number;
export type ColumnName = string;
export type ItemAttribute = string;
export type SchedulingExpression = string;
export type TrainingInputMode = string;
export type FailureReason = string;
export type Status = string;
export type AccountId = string;
export type Description = string;
export type RecipeType = string;
export type PerformHPO = boolean;
export type TrainingHours = number;
export type MetricValue = number;
export type HPOObjectiveType = string;
export type MetricRegex = string;
export type HPOResource = string;
export type EventTypeThresholdValue = number;
export type EventTypeWeight = number;
export type DockerURI = string;
export type IntegerMinValue = number;
export type IntegerMaxValue = number;
export type ContinuousMinValue = number;
export type ContinuousMaxValue = number;
export type CategoricalValue = string;
export type Tunable = boolean;

//# Schemas
export type BatchInferenceJobMode = "BATCH_INFERENCE" | "THEME_GENERATION";
export const BatchInferenceJobMode = S.Literal(
  "BATCH_INFERENCE",
  "THEME_GENERATION",
);
export type IngestionMode = "BULK" | "PUT" | "ALL";
export const IngestionMode = S.Literal("BULK", "PUT", "ALL");
export type Domain = "ECOMMERCE" | "VIDEO_ON_DEMAND";
export const Domain = S.Literal("ECOMMERCE", "VIDEO_ON_DEMAND");
export type ImportMode = "FULL" | "INCREMENTAL";
export const ImportMode = S.Literal("FULL", "INCREMENTAL");
export type TrainingMode = "FULL" | "UPDATE" | "AUTOTRAIN";
export const TrainingMode = S.Literal("FULL", "UPDATE", "AUTOTRAIN");
export type RecipeProvider = "SERVICE";
export const RecipeProvider = S.Literal("SERVICE");
export type TagKeys = string | redacted.Redacted<string>[];
export const TagKeys = S.Array(SensitiveString);
export type MetricAttributesNamesList = string[];
export const MetricAttributesNamesList = S.Array(S.String);
export interface Tag {
  tagKey: string | redacted.Redacted<string>;
  tagValue: string | redacted.Redacted<string>;
}
export const Tag = S.suspend(() =>
  S.Struct({ tagKey: SensitiveString, tagValue: SensitiveString }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateDatasetRequest {
  name: string;
  schemaArn: string;
  datasetGroupArn: string;
  datasetType: string;
  tags?: Tag[];
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    schemaArn: S.String,
    datasetGroupArn: S.String,
    datasetType: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateDatasetGroupRequest {
  name: string;
  roleArn?: string;
  kmsKeyArn?: string;
  domain?: Domain;
  tags?: Tag[];
}
export const CreateDatasetGroupRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    roleArn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    domain: S.optional(Domain),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetGroupRequest",
}) as any as S.Schema<CreateDatasetGroupRequest>;
export interface DataSource {
  dataLocation?: string;
}
export const DataSource = S.suspend(() =>
  S.Struct({ dataLocation: S.optional(S.String) }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface CreateDatasetImportJobRequest {
  jobName: string;
  datasetArn: string;
  dataSource: DataSource;
  roleArn?: string;
  tags?: Tag[];
  importMode?: ImportMode;
  publishAttributionMetricsToS3?: boolean;
}
export const CreateDatasetImportJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    datasetArn: S.String,
    dataSource: DataSource,
    roleArn: S.optional(S.String),
    tags: S.optional(Tags),
    importMode: S.optional(ImportMode),
    publishAttributionMetricsToS3: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetImportJobRequest",
}) as any as S.Schema<CreateDatasetImportJobRequest>;
export interface CreateEventTrackerRequest {
  name: string;
  datasetGroupArn: string;
  tags?: Tag[];
}
export const CreateEventTrackerRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    datasetGroupArn: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateEventTrackerRequest",
}) as any as S.Schema<CreateEventTrackerRequest>;
export interface CreateFilterRequest {
  name: string;
  datasetGroupArn: string;
  filterExpression: string | redacted.Redacted<string>;
  tags?: Tag[];
}
export const CreateFilterRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    datasetGroupArn: S.String,
    filterExpression: SensitiveString,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFilterRequest",
}) as any as S.Schema<CreateFilterRequest>;
export interface CreateSchemaRequest {
  name: string;
  schema: string;
  domain?: Domain;
}
export const CreateSchemaRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    schema: S.String,
    domain: S.optional(Domain),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSchemaRequest",
}) as any as S.Schema<CreateSchemaRequest>;
export interface CreateSolutionVersionRequest {
  name?: string;
  solutionArn: string;
  trainingMode?: TrainingMode;
  tags?: Tag[];
}
export const CreateSolutionVersionRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    solutionArn: S.String,
    trainingMode: S.optional(TrainingMode),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSolutionVersionRequest",
}) as any as S.Schema<CreateSolutionVersionRequest>;
export interface DeleteCampaignRequest {
  campaignArn: string;
}
export const DeleteCampaignRequest = S.suspend(() =>
  S.Struct({ campaignArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCampaignRequest",
}) as any as S.Schema<DeleteCampaignRequest>;
export interface DeleteCampaignResponse {}
export const DeleteCampaignResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteCampaignResponse" },
) as any as S.Schema<DeleteCampaignResponse>;
export interface DeleteDatasetRequest {
  datasetArn: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteDatasetResponse {}
export const DeleteDatasetResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeleteDatasetGroupRequest {
  datasetGroupArn: string;
}
export const DeleteDatasetGroupRequest = S.suspend(() =>
  S.Struct({ datasetGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatasetGroupRequest",
}) as any as S.Schema<DeleteDatasetGroupRequest>;
export interface DeleteDatasetGroupResponse {}
export const DeleteDatasetGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDatasetGroupResponse",
}) as any as S.Schema<DeleteDatasetGroupResponse>;
export interface DeleteEventTrackerRequest {
  eventTrackerArn: string;
}
export const DeleteEventTrackerRequest = S.suspend(() =>
  S.Struct({ eventTrackerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteEventTrackerRequest",
}) as any as S.Schema<DeleteEventTrackerRequest>;
export interface DeleteEventTrackerResponse {}
export const DeleteEventTrackerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEventTrackerResponse",
}) as any as S.Schema<DeleteEventTrackerResponse>;
export interface DeleteFilterRequest {
  filterArn: string;
}
export const DeleteFilterRequest = S.suspend(() =>
  S.Struct({ filterArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFilterRequest",
}) as any as S.Schema<DeleteFilterRequest>;
export interface DeleteFilterResponse {}
export const DeleteFilterResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFilterResponse",
}) as any as S.Schema<DeleteFilterResponse>;
export interface DeleteMetricAttributionRequest {
  metricAttributionArn: string;
}
export const DeleteMetricAttributionRequest = S.suspend(() =>
  S.Struct({ metricAttributionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMetricAttributionRequest",
}) as any as S.Schema<DeleteMetricAttributionRequest>;
export interface DeleteMetricAttributionResponse {}
export const DeleteMetricAttributionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMetricAttributionResponse",
}) as any as S.Schema<DeleteMetricAttributionResponse>;
export interface DeleteRecommenderRequest {
  recommenderArn: string;
}
export const DeleteRecommenderRequest = S.suspend(() =>
  S.Struct({ recommenderArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRecommenderRequest",
}) as any as S.Schema<DeleteRecommenderRequest>;
export interface DeleteRecommenderResponse {}
export const DeleteRecommenderResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecommenderResponse",
}) as any as S.Schema<DeleteRecommenderResponse>;
export interface DeleteSchemaRequest {
  schemaArn: string;
}
export const DeleteSchemaRequest = S.suspend(() =>
  S.Struct({ schemaArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSchemaRequest",
}) as any as S.Schema<DeleteSchemaRequest>;
export interface DeleteSchemaResponse {}
export const DeleteSchemaResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSchemaResponse",
}) as any as S.Schema<DeleteSchemaResponse>;
export interface DeleteSolutionRequest {
  solutionArn: string;
}
export const DeleteSolutionRequest = S.suspend(() =>
  S.Struct({ solutionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSolutionRequest",
}) as any as S.Schema<DeleteSolutionRequest>;
export interface DeleteSolutionResponse {}
export const DeleteSolutionResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteSolutionResponse" },
) as any as S.Schema<DeleteSolutionResponse>;
export interface DescribeAlgorithmRequest {
  algorithmArn: string;
}
export const DescribeAlgorithmRequest = S.suspend(() =>
  S.Struct({ algorithmArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAlgorithmRequest",
}) as any as S.Schema<DescribeAlgorithmRequest>;
export interface DescribeBatchInferenceJobRequest {
  batchInferenceJobArn: string;
}
export const DescribeBatchInferenceJobRequest = S.suspend(() =>
  S.Struct({ batchInferenceJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBatchInferenceJobRequest",
}) as any as S.Schema<DescribeBatchInferenceJobRequest>;
export interface DescribeBatchSegmentJobRequest {
  batchSegmentJobArn: string;
}
export const DescribeBatchSegmentJobRequest = S.suspend(() =>
  S.Struct({ batchSegmentJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBatchSegmentJobRequest",
}) as any as S.Schema<DescribeBatchSegmentJobRequest>;
export interface DescribeCampaignRequest {
  campaignArn: string;
}
export const DescribeCampaignRequest = S.suspend(() =>
  S.Struct({ campaignArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCampaignRequest",
}) as any as S.Schema<DescribeCampaignRequest>;
export interface DescribeDataDeletionJobRequest {
  dataDeletionJobArn: string;
}
export const DescribeDataDeletionJobRequest = S.suspend(() =>
  S.Struct({ dataDeletionJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDataDeletionJobRequest",
}) as any as S.Schema<DescribeDataDeletionJobRequest>;
export interface DescribeDatasetRequest {
  datasetArn: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeDatasetExportJobRequest {
  datasetExportJobArn: string;
}
export const DescribeDatasetExportJobRequest = S.suspend(() =>
  S.Struct({ datasetExportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetExportJobRequest",
}) as any as S.Schema<DescribeDatasetExportJobRequest>;
export interface DescribeDatasetGroupRequest {
  datasetGroupArn: string;
}
export const DescribeDatasetGroupRequest = S.suspend(() =>
  S.Struct({ datasetGroupArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetGroupRequest",
}) as any as S.Schema<DescribeDatasetGroupRequest>;
export interface DescribeDatasetImportJobRequest {
  datasetImportJobArn: string;
}
export const DescribeDatasetImportJobRequest = S.suspend(() =>
  S.Struct({ datasetImportJobArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatasetImportJobRequest",
}) as any as S.Schema<DescribeDatasetImportJobRequest>;
export interface DescribeEventTrackerRequest {
  eventTrackerArn: string;
}
export const DescribeEventTrackerRequest = S.suspend(() =>
  S.Struct({ eventTrackerArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEventTrackerRequest",
}) as any as S.Schema<DescribeEventTrackerRequest>;
export interface DescribeFeatureTransformationRequest {
  featureTransformationArn: string;
}
export const DescribeFeatureTransformationRequest = S.suspend(() =>
  S.Struct({ featureTransformationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFeatureTransformationRequest",
}) as any as S.Schema<DescribeFeatureTransformationRequest>;
export interface DescribeFilterRequest {
  filterArn: string;
}
export const DescribeFilterRequest = S.suspend(() =>
  S.Struct({ filterArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFilterRequest",
}) as any as S.Schema<DescribeFilterRequest>;
export interface DescribeMetricAttributionRequest {
  metricAttributionArn: string;
}
export const DescribeMetricAttributionRequest = S.suspend(() =>
  S.Struct({ metricAttributionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeMetricAttributionRequest",
}) as any as S.Schema<DescribeMetricAttributionRequest>;
export interface DescribeRecipeRequest {
  recipeArn: string;
}
export const DescribeRecipeRequest = S.suspend(() =>
  S.Struct({ recipeArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRecipeRequest",
}) as any as S.Schema<DescribeRecipeRequest>;
export interface DescribeRecommenderRequest {
  recommenderArn: string;
}
export const DescribeRecommenderRequest = S.suspend(() =>
  S.Struct({ recommenderArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRecommenderRequest",
}) as any as S.Schema<DescribeRecommenderRequest>;
export interface DescribeSchemaRequest {
  schemaArn: string;
}
export const DescribeSchemaRequest = S.suspend(() =>
  S.Struct({ schemaArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSchemaRequest",
}) as any as S.Schema<DescribeSchemaRequest>;
export interface DescribeSolutionRequest {
  solutionArn: string;
}
export const DescribeSolutionRequest = S.suspend(() =>
  S.Struct({ solutionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSolutionRequest",
}) as any as S.Schema<DescribeSolutionRequest>;
export interface DescribeSolutionVersionRequest {
  solutionVersionArn: string;
}
export const DescribeSolutionVersionRequest = S.suspend(() =>
  S.Struct({ solutionVersionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSolutionVersionRequest",
}) as any as S.Schema<DescribeSolutionVersionRequest>;
export interface GetSolutionMetricsRequest {
  solutionVersionArn: string;
}
export const GetSolutionMetricsRequest = S.suspend(() =>
  S.Struct({ solutionVersionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSolutionMetricsRequest",
}) as any as S.Schema<GetSolutionMetricsRequest>;
export interface ListBatchInferenceJobsRequest {
  solutionVersionArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBatchInferenceJobsRequest = S.suspend(() =>
  S.Struct({
    solutionVersionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBatchInferenceJobsRequest",
}) as any as S.Schema<ListBatchInferenceJobsRequest>;
export interface ListBatchSegmentJobsRequest {
  solutionVersionArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBatchSegmentJobsRequest = S.suspend(() =>
  S.Struct({
    solutionVersionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBatchSegmentJobsRequest",
}) as any as S.Schema<ListBatchSegmentJobsRequest>;
export interface ListCampaignsRequest {
  solutionArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListCampaignsRequest = S.suspend(() =>
  S.Struct({
    solutionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCampaignsRequest",
}) as any as S.Schema<ListCampaignsRequest>;
export interface ListDataDeletionJobsRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDataDeletionJobsRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataDeletionJobsRequest",
}) as any as S.Schema<ListDataDeletionJobsRequest>;
export interface ListDatasetExportJobsRequest {
  datasetArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetExportJobsRequest = S.suspend(() =>
  S.Struct({
    datasetArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetExportJobsRequest",
}) as any as S.Schema<ListDatasetExportJobsRequest>;
export interface ListDatasetGroupsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetGroupsRequest",
}) as any as S.Schema<ListDatasetGroupsRequest>;
export interface ListDatasetImportJobsRequest {
  datasetArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetImportJobsRequest = S.suspend(() =>
  S.Struct({
    datasetArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetImportJobsRequest",
}) as any as S.Schema<ListDatasetImportJobsRequest>;
export interface ListDatasetsRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListEventTrackersRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEventTrackersRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEventTrackersRequest",
}) as any as S.Schema<ListEventTrackersRequest>;
export interface ListFiltersRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListFiltersRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListFiltersRequest",
}) as any as S.Schema<ListFiltersRequest>;
export interface ListMetricAttributionMetricsRequest {
  metricAttributionArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMetricAttributionMetricsRequest = S.suspend(() =>
  S.Struct({
    metricAttributionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMetricAttributionMetricsRequest",
}) as any as S.Schema<ListMetricAttributionMetricsRequest>;
export interface ListMetricAttributionsRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListMetricAttributionsRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMetricAttributionsRequest",
}) as any as S.Schema<ListMetricAttributionsRequest>;
export interface ListRecipesRequest {
  recipeProvider?: RecipeProvider;
  nextToken?: string;
  maxResults?: number;
  domain?: Domain;
}
export const ListRecipesRequest = S.suspend(() =>
  S.Struct({
    recipeProvider: S.optional(RecipeProvider),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    domain: S.optional(Domain),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecipesRequest",
}) as any as S.Schema<ListRecipesRequest>;
export interface ListRecommendersRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListRecommendersRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendersRequest",
}) as any as S.Schema<ListRecommendersRequest>;
export interface ListSchemasRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListSchemasRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSchemasRequest",
}) as any as S.Schema<ListSchemasRequest>;
export interface ListSolutionsRequest {
  datasetGroupArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSolutionsRequest = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSolutionsRequest",
}) as any as S.Schema<ListSolutionsRequest>;
export interface ListSolutionVersionsRequest {
  solutionArn?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListSolutionVersionsRequest = S.suspend(() =>
  S.Struct({
    solutionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSolutionVersionsRequest",
}) as any as S.Schema<ListSolutionVersionsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface StartRecommenderRequest {
  recommenderArn: string;
}
export const StartRecommenderRequest = S.suspend(() =>
  S.Struct({ recommenderArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartRecommenderRequest",
}) as any as S.Schema<StartRecommenderRequest>;
export interface StopRecommenderRequest {
  recommenderArn: string;
}
export const StopRecommenderRequest = S.suspend(() =>
  S.Struct({ recommenderArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopRecommenderRequest",
}) as any as S.Schema<StopRecommenderRequest>;
export interface StopSolutionVersionCreationRequest {
  solutionVersionArn: string;
}
export const StopSolutionVersionCreationRequest = S.suspend(() =>
  S.Struct({ solutionVersionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopSolutionVersionCreationRequest",
}) as any as S.Schema<StopSolutionVersionCreationRequest>;
export interface StopSolutionVersionCreationResponse {}
export const StopSolutionVersionCreationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopSolutionVersionCreationResponse",
}) as any as S.Schema<StopSolutionVersionCreationResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
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
  resourceArn: string;
  tagKeys: string | redacted.Redacted<string>[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type HyperParameters = { [key: string]: string };
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export type RankingInfluenceType = "POPULARITY" | "FRESHNESS";
export const RankingInfluenceType = S.Literal("POPULARITY", "FRESHNESS");
export type RankingInfluence = { [key in RankingInfluenceType]?: number };
export const RankingInfluence = S.partial(
  S.Record({ key: RankingInfluenceType, value: S.Number }),
);
export interface CampaignConfig {
  itemExplorationConfig?: { [key: string]: string };
  enableMetadataWithRecommendations?: boolean;
  syncWithLatestSolutionVersion?: boolean;
  rankingInfluence?: { [key: string]: number };
}
export const CampaignConfig = S.suspend(() =>
  S.Struct({
    itemExplorationConfig: S.optional(HyperParameters),
    enableMetadataWithRecommendations: S.optional(S.Boolean),
    syncWithLatestSolutionVersion: S.optional(S.Boolean),
    rankingInfluence: S.optional(RankingInfluence),
  }),
).annotations({
  identifier: "CampaignConfig",
}) as any as S.Schema<CampaignConfig>;
export interface UpdateCampaignRequest {
  campaignArn: string;
  solutionVersionArn?: string;
  minProvisionedTPS?: number;
  campaignConfig?: CampaignConfig;
}
export const UpdateCampaignRequest = S.suspend(() =>
  S.Struct({
    campaignArn: S.String,
    solutionVersionArn: S.optional(S.String),
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCampaignRequest",
}) as any as S.Schema<UpdateCampaignRequest>;
export interface UpdateDatasetRequest {
  datasetArn: string;
  schemaArn: string;
}
export const UpdateDatasetRequest = S.suspend(() =>
  S.Struct({ datasetArn: S.String, schemaArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDatasetRequest",
}) as any as S.Schema<UpdateDatasetRequest>;
export interface MetricAttribute {
  eventType: string;
  metricName: string;
  expression: string;
}
export const MetricAttribute = S.suspend(() =>
  S.Struct({ eventType: S.String, metricName: S.String, expression: S.String }),
).annotations({
  identifier: "MetricAttribute",
}) as any as S.Schema<MetricAttribute>;
export type MetricAttributes = MetricAttribute[];
export const MetricAttributes = S.Array(MetricAttribute);
export interface S3DataConfig {
  path: string;
  kmsKeyArn?: string;
}
export const S3DataConfig = S.suspend(() =>
  S.Struct({ path: S.String, kmsKeyArn: S.optional(S.String) }),
).annotations({ identifier: "S3DataConfig" }) as any as S.Schema<S3DataConfig>;
export interface MetricAttributionOutput {
  s3DataDestination?: S3DataConfig;
  roleArn: string;
}
export const MetricAttributionOutput = S.suspend(() =>
  S.Struct({ s3DataDestination: S.optional(S3DataConfig), roleArn: S.String }),
).annotations({
  identifier: "MetricAttributionOutput",
}) as any as S.Schema<MetricAttributionOutput>;
export interface UpdateMetricAttributionRequest {
  addMetrics?: MetricAttribute[];
  removeMetrics?: string[];
  metricsOutputConfig?: MetricAttributionOutput;
  metricAttributionArn?: string;
}
export const UpdateMetricAttributionRequest = S.suspend(() =>
  S.Struct({
    addMetrics: S.optional(MetricAttributes),
    removeMetrics: S.optional(MetricAttributesNamesList),
    metricsOutputConfig: S.optional(MetricAttributionOutput),
    metricAttributionArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateMetricAttributionRequest",
}) as any as S.Schema<UpdateMetricAttributionRequest>;
export type ColumnNamesList = string[];
export const ColumnNamesList = S.Array(S.String);
export type ExcludedDatasetColumns = { [key: string]: string[] };
export const ExcludedDatasetColumns = S.Record({
  key: S.String,
  value: ColumnNamesList,
});
export type IncludedDatasetColumns = { [key: string]: string[] };
export const IncludedDatasetColumns = S.Record({
  key: S.String,
  value: ColumnNamesList,
});
export interface TrainingDataConfig {
  excludedDatasetColumns?: { [key: string]: string[] };
  includedDatasetColumns?: { [key: string]: string[] };
}
export const TrainingDataConfig = S.suspend(() =>
  S.Struct({
    excludedDatasetColumns: S.optional(ExcludedDatasetColumns),
    includedDatasetColumns: S.optional(IncludedDatasetColumns),
  }),
).annotations({
  identifier: "TrainingDataConfig",
}) as any as S.Schema<TrainingDataConfig>;
export interface RecommenderConfig {
  itemExplorationConfig?: { [key: string]: string };
  minRecommendationRequestsPerSecond?: number;
  trainingDataConfig?: TrainingDataConfig;
  enableMetadataWithRecommendations?: boolean;
}
export const RecommenderConfig = S.suspend(() =>
  S.Struct({
    itemExplorationConfig: S.optional(HyperParameters),
    minRecommendationRequestsPerSecond: S.optional(S.Number),
    trainingDataConfig: S.optional(TrainingDataConfig),
    enableMetadataWithRecommendations: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RecommenderConfig",
}) as any as S.Schema<RecommenderConfig>;
export interface UpdateRecommenderRequest {
  recommenderArn: string;
  recommenderConfig: RecommenderConfig;
}
export const UpdateRecommenderRequest = S.suspend(() =>
  S.Struct({
    recommenderArn: S.String,
    recommenderConfig: RecommenderConfig,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRecommenderRequest",
}) as any as S.Schema<UpdateRecommenderRequest>;
export interface BatchInferenceJobOutput {
  s3DataDestination: S3DataConfig;
}
export const BatchInferenceJobOutput = S.suspend(() =>
  S.Struct({ s3DataDestination: S3DataConfig }),
).annotations({
  identifier: "BatchInferenceJobOutput",
}) as any as S.Schema<BatchInferenceJobOutput>;
export interface BatchSegmentJobInput {
  s3DataSource: S3DataConfig;
}
export const BatchSegmentJobInput = S.suspend(() =>
  S.Struct({ s3DataSource: S3DataConfig }),
).annotations({
  identifier: "BatchSegmentJobInput",
}) as any as S.Schema<BatchSegmentJobInput>;
export interface BatchSegmentJobOutput {
  s3DataDestination: S3DataConfig;
}
export const BatchSegmentJobOutput = S.suspend(() =>
  S.Struct({ s3DataDestination: S3DataConfig }),
).annotations({
  identifier: "BatchSegmentJobOutput",
}) as any as S.Schema<BatchSegmentJobOutput>;
export interface DatasetExportJobOutput {
  s3DataDestination: S3DataConfig;
}
export const DatasetExportJobOutput = S.suspend(() =>
  S.Struct({ s3DataDestination: S3DataConfig }),
).annotations({
  identifier: "DatasetExportJobOutput",
}) as any as S.Schema<DatasetExportJobOutput>;
export interface AutoTrainingConfig {
  schedulingExpression?: string;
}
export const AutoTrainingConfig = S.suspend(() =>
  S.Struct({ schedulingExpression: S.optional(S.String) }),
).annotations({
  identifier: "AutoTrainingConfig",
}) as any as S.Schema<AutoTrainingConfig>;
export interface EventParameters {
  eventType?: string;
  eventValueThreshold?: number;
  weight?: number;
}
export const EventParameters = S.suspend(() =>
  S.Struct({
    eventType: S.optional(S.String),
    eventValueThreshold: S.optional(S.Number),
    weight: S.optional(S.Number),
  }),
).annotations({
  identifier: "EventParameters",
}) as any as S.Schema<EventParameters>;
export type EventParametersList = EventParameters[];
export const EventParametersList = S.Array(EventParameters);
export interface EventsConfig {
  eventParametersList?: EventParameters[];
}
export const EventsConfig = S.suspend(() =>
  S.Struct({ eventParametersList: S.optional(EventParametersList) }),
).annotations({ identifier: "EventsConfig" }) as any as S.Schema<EventsConfig>;
export interface SolutionUpdateConfig {
  autoTrainingConfig?: AutoTrainingConfig;
  eventsConfig?: EventsConfig;
}
export const SolutionUpdateConfig = S.suspend(() =>
  S.Struct({
    autoTrainingConfig: S.optional(AutoTrainingConfig),
    eventsConfig: S.optional(EventsConfig),
  }),
).annotations({
  identifier: "SolutionUpdateConfig",
}) as any as S.Schema<SolutionUpdateConfig>;
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type ObjectiveSensitivity = "LOW" | "MEDIUM" | "HIGH" | "OFF";
export const ObjectiveSensitivity = S.Literal("LOW", "MEDIUM", "HIGH", "OFF");
export interface CreateBatchSegmentJobRequest {
  jobName: string;
  solutionVersionArn: string;
  filterArn?: string;
  numResults?: number;
  jobInput: BatchSegmentJobInput;
  jobOutput: BatchSegmentJobOutput;
  roleArn: string;
  tags?: Tag[];
}
export const CreateBatchSegmentJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    solutionVersionArn: S.String,
    filterArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: BatchSegmentJobInput,
    jobOutput: BatchSegmentJobOutput,
    roleArn: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBatchSegmentJobRequest",
}) as any as S.Schema<CreateBatchSegmentJobRequest>;
export interface CreateCampaignRequest {
  name: string;
  solutionVersionArn: string;
  minProvisionedTPS?: number;
  campaignConfig?: CampaignConfig;
  tags?: Tag[];
}
export const CreateCampaignRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    solutionVersionArn: S.String,
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCampaignRequest",
}) as any as S.Schema<CreateCampaignRequest>;
export interface CreateDataDeletionJobRequest {
  jobName: string;
  datasetGroupArn: string;
  dataSource: DataSource;
  roleArn: string;
  tags?: Tag[];
}
export const CreateDataDeletionJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    datasetGroupArn: S.String,
    dataSource: DataSource,
    roleArn: S.String,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataDeletionJobRequest",
}) as any as S.Schema<CreateDataDeletionJobRequest>;
export interface CreateDatasetResponse {
  datasetArn?: string;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({ datasetArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;
export interface CreateDatasetExportJobRequest {
  jobName: string;
  datasetArn: string;
  ingestionMode?: IngestionMode;
  roleArn: string;
  jobOutput: DatasetExportJobOutput;
  tags?: Tag[];
}
export const CreateDatasetExportJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    datasetArn: S.String,
    ingestionMode: S.optional(IngestionMode),
    roleArn: S.String,
    jobOutput: DatasetExportJobOutput,
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatasetExportJobRequest",
}) as any as S.Schema<CreateDatasetExportJobRequest>;
export interface CreateDatasetGroupResponse {
  datasetGroupArn?: string;
  domain?: Domain;
}
export const CreateDatasetGroupResponse = S.suspend(() =>
  S.Struct({
    datasetGroupArn: S.optional(S.String),
    domain: S.optional(Domain),
  }),
).annotations({
  identifier: "CreateDatasetGroupResponse",
}) as any as S.Schema<CreateDatasetGroupResponse>;
export interface CreateDatasetImportJobResponse {
  datasetImportJobArn?: string;
}
export const CreateDatasetImportJobResponse = S.suspend(() =>
  S.Struct({ datasetImportJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetImportJobResponse",
}) as any as S.Schema<CreateDatasetImportJobResponse>;
export interface CreateEventTrackerResponse {
  eventTrackerArn?: string;
  trackingId?: string;
}
export const CreateEventTrackerResponse = S.suspend(() =>
  S.Struct({
    eventTrackerArn: S.optional(S.String),
    trackingId: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateEventTrackerResponse",
}) as any as S.Schema<CreateEventTrackerResponse>;
export interface CreateFilterResponse {
  filterArn?: string;
}
export const CreateFilterResponse = S.suspend(() =>
  S.Struct({ filterArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateFilterResponse",
}) as any as S.Schema<CreateFilterResponse>;
export interface CreateMetricAttributionRequest {
  name: string;
  datasetGroupArn: string;
  metrics: MetricAttribute[];
  metricsOutputConfig: MetricAttributionOutput;
}
export const CreateMetricAttributionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    datasetGroupArn: S.String,
    metrics: MetricAttributes,
    metricsOutputConfig: MetricAttributionOutput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateMetricAttributionRequest",
}) as any as S.Schema<CreateMetricAttributionRequest>;
export interface CreateSchemaResponse {
  schemaArn?: string;
}
export const CreateSchemaResponse = S.suspend(() =>
  S.Struct({ schemaArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateSchemaResponse",
}) as any as S.Schema<CreateSchemaResponse>;
export interface CreateSolutionVersionResponse {
  solutionVersionArn?: string;
}
export const CreateSolutionVersionResponse = S.suspend(() =>
  S.Struct({ solutionVersionArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateSolutionVersionResponse",
}) as any as S.Schema<CreateSolutionVersionResponse>;
export interface ListMetricAttributionMetricsResponse {
  metrics?: MetricAttribute[];
  nextToken?: string;
}
export const ListMetricAttributionMetricsResponse = S.suspend(() =>
  S.Struct({
    metrics: S.optional(MetricAttributes),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMetricAttributionMetricsResponse",
}) as any as S.Schema<ListMetricAttributionMetricsResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartRecommenderResponse {
  recommenderArn?: string;
}
export const StartRecommenderResponse = S.suspend(() =>
  S.Struct({ recommenderArn: S.optional(S.String) }),
).annotations({
  identifier: "StartRecommenderResponse",
}) as any as S.Schema<StartRecommenderResponse>;
export interface StopRecommenderResponse {
  recommenderArn?: string;
}
export const StopRecommenderResponse = S.suspend(() =>
  S.Struct({ recommenderArn: S.optional(S.String) }),
).annotations({
  identifier: "StopRecommenderResponse",
}) as any as S.Schema<StopRecommenderResponse>;
export interface UpdateCampaignResponse {
  campaignArn?: string;
}
export const UpdateCampaignResponse = S.suspend(() =>
  S.Struct({ campaignArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateCampaignResponse",
}) as any as S.Schema<UpdateCampaignResponse>;
export interface UpdateDatasetResponse {
  datasetArn?: string;
}
export const UpdateDatasetResponse = S.suspend(() =>
  S.Struct({ datasetArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateDatasetResponse",
}) as any as S.Schema<UpdateDatasetResponse>;
export interface UpdateMetricAttributionResponse {
  metricAttributionArn?: string;
}
export const UpdateMetricAttributionResponse = S.suspend(() =>
  S.Struct({ metricAttributionArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateMetricAttributionResponse",
}) as any as S.Schema<UpdateMetricAttributionResponse>;
export interface UpdateRecommenderResponse {
  recommenderArn?: string;
}
export const UpdateRecommenderResponse = S.suspend(() =>
  S.Struct({ recommenderArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateRecommenderResponse",
}) as any as S.Schema<UpdateRecommenderResponse>;
export interface UpdateSolutionRequest {
  solutionArn: string;
  performAutoTraining?: boolean;
  performIncrementalUpdate?: boolean;
  solutionUpdateConfig?: SolutionUpdateConfig;
}
export const UpdateSolutionRequest = S.suspend(() =>
  S.Struct({
    solutionArn: S.String,
    performAutoTraining: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    solutionUpdateConfig: S.optional(SolutionUpdateConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSolutionRequest",
}) as any as S.Schema<UpdateSolutionRequest>;
export interface FieldsForThemeGeneration {
  itemName: string;
}
export const FieldsForThemeGeneration = S.suspend(() =>
  S.Struct({ itemName: S.String }),
).annotations({
  identifier: "FieldsForThemeGeneration",
}) as any as S.Schema<FieldsForThemeGeneration>;
export type FeatureTransformationParameters = { [key: string]: string };
export const FeatureTransformationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export interface AutoMLConfig {
  metricName?: string;
  recipeList?: string[];
}
export const AutoMLConfig = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    recipeList: S.optional(ArnList),
  }),
).annotations({ identifier: "AutoMLConfig" }) as any as S.Schema<AutoMLConfig>;
export interface OptimizationObjective {
  itemAttribute?: string;
  objectiveSensitivity?: ObjectiveSensitivity;
}
export const OptimizationObjective = S.suspend(() =>
  S.Struct({
    itemAttribute: S.optional(S.String),
    objectiveSensitivity: S.optional(ObjectiveSensitivity),
  }),
).annotations({
  identifier: "OptimizationObjective",
}) as any as S.Schema<OptimizationObjective>;
export type TrainingType = "AUTOMATIC" | "MANUAL";
export const TrainingType = S.Literal("AUTOMATIC", "MANUAL");
export interface BatchInferenceJobInput {
  s3DataSource: S3DataConfig;
}
export const BatchInferenceJobInput = S.suspend(() =>
  S.Struct({ s3DataSource: S3DataConfig }),
).annotations({
  identifier: "BatchInferenceJobInput",
}) as any as S.Schema<BatchInferenceJobInput>;
export interface BatchInferenceJobConfig {
  itemExplorationConfig?: { [key: string]: string };
  rankingInfluence?: { [key: string]: number };
}
export const BatchInferenceJobConfig = S.suspend(() =>
  S.Struct({
    itemExplorationConfig: S.optional(HyperParameters),
    rankingInfluence: S.optional(RankingInfluence),
  }),
).annotations({
  identifier: "BatchInferenceJobConfig",
}) as any as S.Schema<BatchInferenceJobConfig>;
export interface ThemeGenerationConfig {
  fieldsForThemeGeneration: FieldsForThemeGeneration;
}
export const ThemeGenerationConfig = S.suspend(() =>
  S.Struct({ fieldsForThemeGeneration: FieldsForThemeGeneration }),
).annotations({
  identifier: "ThemeGenerationConfig",
}) as any as S.Schema<ThemeGenerationConfig>;
export interface BatchInferenceJob {
  jobName?: string;
  batchInferenceJobArn?: string;
  filterArn?: string;
  failureReason?: string;
  solutionVersionArn?: string;
  numResults?: number;
  jobInput?: BatchInferenceJobInput;
  jobOutput?: BatchInferenceJobOutput;
  batchInferenceJobConfig?: BatchInferenceJobConfig;
  roleArn?: string;
  batchInferenceJobMode?: BatchInferenceJobMode;
  themeGenerationConfig?: ThemeGenerationConfig;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const BatchInferenceJob = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    batchInferenceJobArn: S.optional(S.String),
    filterArn: S.optional(S.String),
    failureReason: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: S.optional(BatchInferenceJobInput),
    jobOutput: S.optional(BatchInferenceJobOutput),
    batchInferenceJobConfig: S.optional(BatchInferenceJobConfig),
    roleArn: S.optional(S.String),
    batchInferenceJobMode: S.optional(BatchInferenceJobMode),
    themeGenerationConfig: S.optional(ThemeGenerationConfig),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BatchInferenceJob",
}) as any as S.Schema<BatchInferenceJob>;
export interface BatchSegmentJob {
  jobName?: string;
  batchSegmentJobArn?: string;
  filterArn?: string;
  failureReason?: string;
  solutionVersionArn?: string;
  numResults?: number;
  jobInput?: BatchSegmentJobInput;
  jobOutput?: BatchSegmentJobOutput;
  roleArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const BatchSegmentJob = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    batchSegmentJobArn: S.optional(S.String),
    filterArn: S.optional(S.String),
    failureReason: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: S.optional(BatchSegmentJobInput),
    jobOutput: S.optional(BatchSegmentJobOutput),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "BatchSegmentJob",
}) as any as S.Schema<BatchSegmentJob>;
export interface DataDeletionJob {
  jobName?: string;
  dataDeletionJobArn?: string;
  datasetGroupArn?: string;
  dataSource?: DataSource;
  roleArn?: string;
  status?: string;
  numDeleted?: number;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const DataDeletionJob = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    dataDeletionJobArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    dataSource: S.optional(DataSource),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    numDeleted: S.optional(S.Number),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DataDeletionJob",
}) as any as S.Schema<DataDeletionJob>;
export interface DatasetExportJob {
  jobName?: string;
  datasetExportJobArn?: string;
  datasetArn?: string;
  ingestionMode?: IngestionMode;
  roleArn?: string;
  status?: string;
  jobOutput?: DatasetExportJobOutput;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const DatasetExportJob = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    datasetExportJobArn: S.optional(S.String),
    datasetArn: S.optional(S.String),
    ingestionMode: S.optional(IngestionMode),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    jobOutput: S.optional(DatasetExportJobOutput),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DatasetExportJob",
}) as any as S.Schema<DatasetExportJob>;
export interface DatasetGroup {
  name?: string;
  datasetGroupArn?: string;
  status?: string;
  roleArn?: string;
  kmsKeyArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  domain?: Domain;
}
export const DatasetGroup = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    status: S.optional(S.String),
    roleArn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    domain: S.optional(Domain),
  }),
).annotations({ identifier: "DatasetGroup" }) as any as S.Schema<DatasetGroup>;
export interface DatasetImportJob {
  jobName?: string;
  datasetImportJobArn?: string;
  datasetArn?: string;
  dataSource?: DataSource;
  roleArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  importMode?: ImportMode;
  publishAttributionMetricsToS3?: boolean;
}
export const DatasetImportJob = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    datasetImportJobArn: S.optional(S.String),
    datasetArn: S.optional(S.String),
    dataSource: S.optional(DataSource),
    roleArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    importMode: S.optional(ImportMode),
    publishAttributionMetricsToS3: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DatasetImportJob",
}) as any as S.Schema<DatasetImportJob>;
export interface EventTracker {
  name?: string;
  eventTrackerArn?: string;
  accountId?: string;
  trackingId?: string;
  datasetGroupArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const EventTracker = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    eventTrackerArn: S.optional(S.String),
    accountId: S.optional(S.String),
    trackingId: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "EventTracker" }) as any as S.Schema<EventTracker>;
export interface Filter {
  name?: string;
  filterArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  datasetGroupArn?: string;
  failureReason?: string;
  filterExpression?: string | redacted.Redacted<string>;
  status?: string;
}
export const Filter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    filterArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    datasetGroupArn: S.optional(S.String),
    failureReason: S.optional(S.String),
    filterExpression: S.optional(SensitiveString),
    status: S.optional(S.String),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export interface MetricAttribution {
  name?: string;
  metricAttributionArn?: string;
  datasetGroupArn?: string;
  metricsOutputConfig?: MetricAttributionOutput;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const MetricAttribution = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    metricAttributionArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    metricsOutputConfig: S.optional(MetricAttributionOutput),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricAttribution",
}) as any as S.Schema<MetricAttribution>;
export interface Recipe {
  name?: string;
  recipeArn?: string;
  algorithmArn?: string;
  featureTransformationArn?: string;
  status?: string;
  description?: string;
  creationDateTime?: Date;
  recipeType?: string;
  lastUpdatedDateTime?: Date;
}
export const Recipe = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    recipeArn: S.optional(S.String),
    algorithmArn: S.optional(S.String),
    featureTransformationArn: S.optional(S.String),
    status: S.optional(S.String),
    description: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    recipeType: S.optional(S.String),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Recipe" }) as any as S.Schema<Recipe>;
export interface DatasetSchema {
  name?: string;
  schemaArn?: string;
  schema?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  domain?: Domain;
}
export const DatasetSchema = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    schemaArn: S.optional(S.String),
    schema: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    domain: S.optional(Domain),
  }),
).annotations({
  identifier: "DatasetSchema",
}) as any as S.Schema<DatasetSchema>;
export type Metrics = { [key: string]: number };
export const Metrics = S.Record({ key: S.String, value: S.Number });
export interface BatchInferenceJobSummary {
  batchInferenceJobArn?: string;
  jobName?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  solutionVersionArn?: string;
  batchInferenceJobMode?: BatchInferenceJobMode;
}
export const BatchInferenceJobSummary = S.suspend(() =>
  S.Struct({
    batchInferenceJobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
    batchInferenceJobMode: S.optional(BatchInferenceJobMode),
  }),
).annotations({
  identifier: "BatchInferenceJobSummary",
}) as any as S.Schema<BatchInferenceJobSummary>;
export type BatchInferenceJobs = BatchInferenceJobSummary[];
export const BatchInferenceJobs = S.Array(BatchInferenceJobSummary);
export interface BatchSegmentJobSummary {
  batchSegmentJobArn?: string;
  jobName?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  solutionVersionArn?: string;
}
export const BatchSegmentJobSummary = S.suspend(() =>
  S.Struct({
    batchSegmentJobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchSegmentJobSummary",
}) as any as S.Schema<BatchSegmentJobSummary>;
export type BatchSegmentJobs = BatchSegmentJobSummary[];
export const BatchSegmentJobs = S.Array(BatchSegmentJobSummary);
export interface CampaignSummary {
  name?: string;
  campaignArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const CampaignSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    campaignArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CampaignSummary",
}) as any as S.Schema<CampaignSummary>;
export type Campaigns = CampaignSummary[];
export const Campaigns = S.Array(CampaignSummary);
export interface DataDeletionJobSummary {
  dataDeletionJobArn?: string;
  datasetGroupArn?: string;
  jobName?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const DataDeletionJobSummary = S.suspend(() =>
  S.Struct({
    dataDeletionJobArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    jobName: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DataDeletionJobSummary",
}) as any as S.Schema<DataDeletionJobSummary>;
export type DataDeletionJobs = DataDeletionJobSummary[];
export const DataDeletionJobs = S.Array(DataDeletionJobSummary);
export interface DatasetExportJobSummary {
  datasetExportJobArn?: string;
  jobName?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const DatasetExportJobSummary = S.suspend(() =>
  S.Struct({
    datasetExportJobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DatasetExportJobSummary",
}) as any as S.Schema<DatasetExportJobSummary>;
export type DatasetExportJobs = DatasetExportJobSummary[];
export const DatasetExportJobs = S.Array(DatasetExportJobSummary);
export interface DatasetGroupSummary {
  name?: string;
  datasetGroupArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  domain?: Domain;
}
export const DatasetGroupSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    domain: S.optional(Domain),
  }),
).annotations({
  identifier: "DatasetGroupSummary",
}) as any as S.Schema<DatasetGroupSummary>;
export type DatasetGroups = DatasetGroupSummary[];
export const DatasetGroups = S.Array(DatasetGroupSummary);
export interface DatasetImportJobSummary {
  datasetImportJobArn?: string;
  jobName?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
  importMode?: ImportMode;
}
export const DatasetImportJobSummary = S.suspend(() =>
  S.Struct({
    datasetImportJobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
    importMode: S.optional(ImportMode),
  }),
).annotations({
  identifier: "DatasetImportJobSummary",
}) as any as S.Schema<DatasetImportJobSummary>;
export type DatasetImportJobs = DatasetImportJobSummary[];
export const DatasetImportJobs = S.Array(DatasetImportJobSummary);
export interface DatasetSummary {
  name?: string;
  datasetArn?: string;
  datasetType?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DatasetSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    datasetArn: S.optional(S.String),
    datasetType: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DatasetSummary",
}) as any as S.Schema<DatasetSummary>;
export type Datasets = DatasetSummary[];
export const Datasets = S.Array(DatasetSummary);
export interface EventTrackerSummary {
  name?: string;
  eventTrackerArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const EventTrackerSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    eventTrackerArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "EventTrackerSummary",
}) as any as S.Schema<EventTrackerSummary>;
export type EventTrackers = EventTrackerSummary[];
export const EventTrackers = S.Array(EventTrackerSummary);
export interface FilterSummary {
  name?: string;
  filterArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  datasetGroupArn?: string;
  failureReason?: string;
  status?: string;
}
export const FilterSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    filterArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    datasetGroupArn: S.optional(S.String),
    failureReason: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "FilterSummary",
}) as any as S.Schema<FilterSummary>;
export type Filters = FilterSummary[];
export const Filters = S.Array(FilterSummary);
export interface MetricAttributionSummary {
  name?: string;
  metricAttributionArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const MetricAttributionSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    metricAttributionArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricAttributionSummary",
}) as any as S.Schema<MetricAttributionSummary>;
export type MetricAttributions = MetricAttributionSummary[];
export const MetricAttributions = S.Array(MetricAttributionSummary);
export interface RecipeSummary {
  name?: string;
  recipeArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  domain?: Domain;
}
export const RecipeSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    recipeArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    domain: S.optional(Domain),
  }),
).annotations({
  identifier: "RecipeSummary",
}) as any as S.Schema<RecipeSummary>;
export type Recipes = RecipeSummary[];
export const Recipes = S.Array(RecipeSummary);
export interface RecommenderSummary {
  name?: string;
  recommenderArn?: string;
  datasetGroupArn?: string;
  recipeArn?: string;
  recommenderConfig?: RecommenderConfig;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const RecommenderSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    recommenderArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    recipeArn: S.optional(S.String),
    recommenderConfig: S.optional(RecommenderConfig),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RecommenderSummary",
}) as any as S.Schema<RecommenderSummary>;
export type Recommenders = RecommenderSummary[];
export const Recommenders = S.Array(RecommenderSummary);
export interface DatasetSchemaSummary {
  name?: string;
  schemaArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  domain?: Domain;
}
export const DatasetSchemaSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    schemaArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    domain: S.optional(Domain),
  }),
).annotations({
  identifier: "DatasetSchemaSummary",
}) as any as S.Schema<DatasetSchemaSummary>;
export type Schemas = DatasetSchemaSummary[];
export const Schemas = S.Array(DatasetSchemaSummary);
export interface SolutionSummary {
  name?: string;
  solutionArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  recipeArn?: string;
}
export const SolutionSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    solutionArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    recipeArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SolutionSummary",
}) as any as S.Schema<SolutionSummary>;
export type Solutions = SolutionSummary[];
export const Solutions = S.Array(SolutionSummary);
export interface SolutionVersionSummary {
  solutionVersionArn?: string;
  status?: string;
  trainingMode?: TrainingMode;
  trainingType?: TrainingType;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const SolutionVersionSummary = S.suspend(() =>
  S.Struct({
    solutionVersionArn: S.optional(S.String),
    status: S.optional(S.String),
    trainingMode: S.optional(TrainingMode),
    trainingType: S.optional(TrainingType),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SolutionVersionSummary",
}) as any as S.Schema<SolutionVersionSummary>;
export type SolutionVersions = SolutionVersionSummary[];
export const SolutionVersions = S.Array(SolutionVersionSummary);
export interface HPOObjective {
  type?: string;
  metricName?: string;
  metricRegex?: string;
}
export const HPOObjective = S.suspend(() =>
  S.Struct({
    type: S.optional(S.String),
    metricName: S.optional(S.String),
    metricRegex: S.optional(S.String),
  }),
).annotations({ identifier: "HPOObjective" }) as any as S.Schema<HPOObjective>;
export interface HPOResourceConfig {
  maxNumberOfTrainingJobs?: string;
  maxParallelTrainingJobs?: string;
}
export const HPOResourceConfig = S.suspend(() =>
  S.Struct({
    maxNumberOfTrainingJobs: S.optional(S.String),
    maxParallelTrainingJobs: S.optional(S.String),
  }),
).annotations({
  identifier: "HPOResourceConfig",
}) as any as S.Schema<HPOResourceConfig>;
export interface CreateBatchInferenceJobRequest {
  jobName: string;
  solutionVersionArn: string;
  filterArn?: string;
  numResults?: number;
  jobInput: BatchInferenceJobInput;
  jobOutput: BatchInferenceJobOutput;
  roleArn: string;
  batchInferenceJobConfig?: BatchInferenceJobConfig;
  tags?: Tag[];
  batchInferenceJobMode?: BatchInferenceJobMode;
  themeGenerationConfig?: ThemeGenerationConfig;
}
export const CreateBatchInferenceJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.String,
    solutionVersionArn: S.String,
    filterArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: BatchInferenceJobInput,
    jobOutput: BatchInferenceJobOutput,
    roleArn: S.String,
    batchInferenceJobConfig: S.optional(BatchInferenceJobConfig),
    tags: S.optional(Tags),
    batchInferenceJobMode: S.optional(BatchInferenceJobMode),
    themeGenerationConfig: S.optional(ThemeGenerationConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBatchInferenceJobRequest",
}) as any as S.Schema<CreateBatchInferenceJobRequest>;
export interface CreateBatchSegmentJobResponse {
  batchSegmentJobArn?: string;
}
export const CreateBatchSegmentJobResponse = S.suspend(() =>
  S.Struct({ batchSegmentJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateBatchSegmentJobResponse",
}) as any as S.Schema<CreateBatchSegmentJobResponse>;
export interface CreateCampaignResponse {
  campaignArn?: string;
}
export const CreateCampaignResponse = S.suspend(() =>
  S.Struct({ campaignArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateCampaignResponse",
}) as any as S.Schema<CreateCampaignResponse>;
export interface CreateDataDeletionJobResponse {
  dataDeletionJobArn?: string;
}
export const CreateDataDeletionJobResponse = S.suspend(() =>
  S.Struct({ dataDeletionJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDataDeletionJobResponse",
}) as any as S.Schema<CreateDataDeletionJobResponse>;
export interface CreateDatasetExportJobResponse {
  datasetExportJobArn?: string;
}
export const CreateDatasetExportJobResponse = S.suspend(() =>
  S.Struct({ datasetExportJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateDatasetExportJobResponse",
}) as any as S.Schema<CreateDatasetExportJobResponse>;
export interface CreateMetricAttributionResponse {
  metricAttributionArn?: string;
}
export const CreateMetricAttributionResponse = S.suspend(() =>
  S.Struct({ metricAttributionArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateMetricAttributionResponse",
}) as any as S.Schema<CreateMetricAttributionResponse>;
export type CategoricalValues = string[];
export const CategoricalValues = S.Array(S.String);
export interface DescribeBatchInferenceJobResponse {
  batchInferenceJob?: BatchInferenceJob;
}
export const DescribeBatchInferenceJobResponse = S.suspend(() =>
  S.Struct({ batchInferenceJob: S.optional(BatchInferenceJob) }),
).annotations({
  identifier: "DescribeBatchInferenceJobResponse",
}) as any as S.Schema<DescribeBatchInferenceJobResponse>;
export interface DescribeBatchSegmentJobResponse {
  batchSegmentJob?: BatchSegmentJob;
}
export const DescribeBatchSegmentJobResponse = S.suspend(() =>
  S.Struct({ batchSegmentJob: S.optional(BatchSegmentJob) }),
).annotations({
  identifier: "DescribeBatchSegmentJobResponse",
}) as any as S.Schema<DescribeBatchSegmentJobResponse>;
export interface DescribeDataDeletionJobResponse {
  dataDeletionJob?: DataDeletionJob;
}
export const DescribeDataDeletionJobResponse = S.suspend(() =>
  S.Struct({ dataDeletionJob: S.optional(DataDeletionJob) }),
).annotations({
  identifier: "DescribeDataDeletionJobResponse",
}) as any as S.Schema<DescribeDataDeletionJobResponse>;
export interface DescribeDatasetExportJobResponse {
  datasetExportJob?: DatasetExportJob;
}
export const DescribeDatasetExportJobResponse = S.suspend(() =>
  S.Struct({ datasetExportJob: S.optional(DatasetExportJob) }),
).annotations({
  identifier: "DescribeDatasetExportJobResponse",
}) as any as S.Schema<DescribeDatasetExportJobResponse>;
export interface DescribeDatasetGroupResponse {
  datasetGroup?: DatasetGroup;
}
export const DescribeDatasetGroupResponse = S.suspend(() =>
  S.Struct({ datasetGroup: S.optional(DatasetGroup) }),
).annotations({
  identifier: "DescribeDatasetGroupResponse",
}) as any as S.Schema<DescribeDatasetGroupResponse>;
export interface DescribeDatasetImportJobResponse {
  datasetImportJob?: DatasetImportJob;
}
export const DescribeDatasetImportJobResponse = S.suspend(() =>
  S.Struct({ datasetImportJob: S.optional(DatasetImportJob) }),
).annotations({
  identifier: "DescribeDatasetImportJobResponse",
}) as any as S.Schema<DescribeDatasetImportJobResponse>;
export interface DescribeEventTrackerResponse {
  eventTracker?: EventTracker;
}
export const DescribeEventTrackerResponse = S.suspend(() =>
  S.Struct({ eventTracker: S.optional(EventTracker) }),
).annotations({
  identifier: "DescribeEventTrackerResponse",
}) as any as S.Schema<DescribeEventTrackerResponse>;
export interface DescribeFilterResponse {
  filter?: Filter;
}
export const DescribeFilterResponse = S.suspend(() =>
  S.Struct({ filter: S.optional(Filter) }),
).annotations({
  identifier: "DescribeFilterResponse",
}) as any as S.Schema<DescribeFilterResponse>;
export interface DescribeMetricAttributionResponse {
  metricAttribution?: MetricAttribution;
}
export const DescribeMetricAttributionResponse = S.suspend(() =>
  S.Struct({ metricAttribution: S.optional(MetricAttribution) }),
).annotations({
  identifier: "DescribeMetricAttributionResponse",
}) as any as S.Schema<DescribeMetricAttributionResponse>;
export interface DescribeRecipeResponse {
  recipe?: Recipe;
}
export const DescribeRecipeResponse = S.suspend(() =>
  S.Struct({ recipe: S.optional(Recipe) }),
).annotations({
  identifier: "DescribeRecipeResponse",
}) as any as S.Schema<DescribeRecipeResponse>;
export interface DescribeSchemaResponse {
  schema?: DatasetSchema;
}
export const DescribeSchemaResponse = S.suspend(() =>
  S.Struct({ schema: S.optional(DatasetSchema) }),
).annotations({
  identifier: "DescribeSchemaResponse",
}) as any as S.Schema<DescribeSchemaResponse>;
export interface GetSolutionMetricsResponse {
  solutionVersionArn?: string;
  metrics?: { [key: string]: number };
}
export const GetSolutionMetricsResponse = S.suspend(() =>
  S.Struct({
    solutionVersionArn: S.optional(S.String),
    metrics: S.optional(Metrics),
  }),
).annotations({
  identifier: "GetSolutionMetricsResponse",
}) as any as S.Schema<GetSolutionMetricsResponse>;
export interface ListBatchInferenceJobsResponse {
  batchInferenceJobs?: BatchInferenceJobSummary[];
  nextToken?: string;
}
export const ListBatchInferenceJobsResponse = S.suspend(() =>
  S.Struct({
    batchInferenceJobs: S.optional(BatchInferenceJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBatchInferenceJobsResponse",
}) as any as S.Schema<ListBatchInferenceJobsResponse>;
export interface ListBatchSegmentJobsResponse {
  batchSegmentJobs?: BatchSegmentJobSummary[];
  nextToken?: string;
}
export const ListBatchSegmentJobsResponse = S.suspend(() =>
  S.Struct({
    batchSegmentJobs: S.optional(BatchSegmentJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBatchSegmentJobsResponse",
}) as any as S.Schema<ListBatchSegmentJobsResponse>;
export interface ListCampaignsResponse {
  campaigns?: CampaignSummary[];
  nextToken?: string;
}
export const ListCampaignsResponse = S.suspend(() =>
  S.Struct({
    campaigns: S.optional(Campaigns),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCampaignsResponse",
}) as any as S.Schema<ListCampaignsResponse>;
export interface ListDataDeletionJobsResponse {
  dataDeletionJobs?: DataDeletionJobSummary[];
  nextToken?: string;
}
export const ListDataDeletionJobsResponse = S.suspend(() =>
  S.Struct({
    dataDeletionJobs: S.optional(DataDeletionJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataDeletionJobsResponse",
}) as any as S.Schema<ListDataDeletionJobsResponse>;
export interface ListDatasetExportJobsResponse {
  datasetExportJobs?: DatasetExportJobSummary[];
  nextToken?: string;
}
export const ListDatasetExportJobsResponse = S.suspend(() =>
  S.Struct({
    datasetExportJobs: S.optional(DatasetExportJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetExportJobsResponse",
}) as any as S.Schema<ListDatasetExportJobsResponse>;
export interface ListDatasetGroupsResponse {
  datasetGroups?: DatasetGroupSummary[];
  nextToken?: string;
}
export const ListDatasetGroupsResponse = S.suspend(() =>
  S.Struct({
    datasetGroups: S.optional(DatasetGroups),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetGroupsResponse",
}) as any as S.Schema<ListDatasetGroupsResponse>;
export interface ListDatasetImportJobsResponse {
  datasetImportJobs?: DatasetImportJobSummary[];
  nextToken?: string;
}
export const ListDatasetImportJobsResponse = S.suspend(() =>
  S.Struct({
    datasetImportJobs: S.optional(DatasetImportJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatasetImportJobsResponse",
}) as any as S.Schema<ListDatasetImportJobsResponse>;
export interface ListDatasetsResponse {
  datasets?: DatasetSummary[];
  nextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({ datasets: S.optional(Datasets), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListEventTrackersResponse {
  eventTrackers?: EventTrackerSummary[];
  nextToken?: string;
}
export const ListEventTrackersResponse = S.suspend(() =>
  S.Struct({
    eventTrackers: S.optional(EventTrackers),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEventTrackersResponse",
}) as any as S.Schema<ListEventTrackersResponse>;
export interface ListFiltersResponse {
  Filters?: FilterSummary[];
  nextToken?: string;
}
export const ListFiltersResponse = S.suspend(() =>
  S.Struct({ Filters: S.optional(Filters), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListFiltersResponse",
}) as any as S.Schema<ListFiltersResponse>;
export interface ListMetricAttributionsResponse {
  metricAttributions?: MetricAttributionSummary[];
  nextToken?: string;
}
export const ListMetricAttributionsResponse = S.suspend(() =>
  S.Struct({
    metricAttributions: S.optional(MetricAttributions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMetricAttributionsResponse",
}) as any as S.Schema<ListMetricAttributionsResponse>;
export interface ListRecipesResponse {
  recipes?: RecipeSummary[];
  nextToken?: string;
}
export const ListRecipesResponse = S.suspend(() =>
  S.Struct({ recipes: S.optional(Recipes), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRecipesResponse",
}) as any as S.Schema<ListRecipesResponse>;
export interface ListRecommendersResponse {
  recommenders?: RecommenderSummary[];
  nextToken?: string;
}
export const ListRecommendersResponse = S.suspend(() =>
  S.Struct({
    recommenders: S.optional(Recommenders),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendersResponse",
}) as any as S.Schema<ListRecommendersResponse>;
export interface ListSchemasResponse {
  schemas?: DatasetSchemaSummary[];
  nextToken?: string;
}
export const ListSchemasResponse = S.suspend(() =>
  S.Struct({ schemas: S.optional(Schemas), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSchemasResponse",
}) as any as S.Schema<ListSchemasResponse>;
export interface ListSolutionsResponse {
  solutions?: SolutionSummary[];
  nextToken?: string;
}
export const ListSolutionsResponse = S.suspend(() =>
  S.Struct({
    solutions: S.optional(Solutions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSolutionsResponse",
}) as any as S.Schema<ListSolutionsResponse>;
export interface ListSolutionVersionsResponse {
  solutionVersions?: SolutionVersionSummary[];
  nextToken?: string;
}
export const ListSolutionVersionsResponse = S.suspend(() =>
  S.Struct({
    solutionVersions: S.optional(SolutionVersions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSolutionVersionsResponse",
}) as any as S.Schema<ListSolutionVersionsResponse>;
export interface UpdateSolutionResponse {
  solutionArn?: string;
}
export const UpdateSolutionResponse = S.suspend(() =>
  S.Struct({ solutionArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSolutionResponse",
}) as any as S.Schema<UpdateSolutionResponse>;
export interface AlgorithmImage {
  name?: string;
  dockerURI: string;
}
export const AlgorithmImage = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), dockerURI: S.String }),
).annotations({
  identifier: "AlgorithmImage",
}) as any as S.Schema<AlgorithmImage>;
export type ResourceConfig = { [key: string]: string };
export const ResourceConfig = S.Record({ key: S.String, value: S.String });
export interface CampaignUpdateSummary {
  solutionVersionArn?: string;
  minProvisionedTPS?: number;
  campaignConfig?: CampaignConfig;
  status?: string;
  failureReason?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const CampaignUpdateSummary = S.suspend(() =>
  S.Struct({
    solutionVersionArn: S.optional(S.String),
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CampaignUpdateSummary",
}) as any as S.Schema<CampaignUpdateSummary>;
export interface DatasetUpdateSummary {
  schemaArn?: string;
  status?: string;
  failureReason?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const DatasetUpdateSummary = S.suspend(() =>
  S.Struct({
    schemaArn: S.optional(S.String),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DatasetUpdateSummary",
}) as any as S.Schema<DatasetUpdateSummary>;
export type FeaturizationParameters = { [key: string]: string };
export const FeaturizationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export interface RecommenderUpdateSummary {
  recommenderConfig?: RecommenderConfig;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  status?: string;
  failureReason?: string;
}
export const RecommenderUpdateSummary = S.suspend(() =>
  S.Struct({
    recommenderConfig: S.optional(RecommenderConfig),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommenderUpdateSummary",
}) as any as S.Schema<RecommenderUpdateSummary>;
export interface AutoMLResult {
  bestRecipeArn?: string;
}
export const AutoMLResult = S.suspend(() =>
  S.Struct({ bestRecipeArn: S.optional(S.String) }),
).annotations({ identifier: "AutoMLResult" }) as any as S.Schema<AutoMLResult>;
export interface SolutionUpdateSummary {
  solutionUpdateConfig?: SolutionUpdateConfig;
  status?: string;
  performAutoTraining?: boolean;
  performIncrementalUpdate?: boolean;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  failureReason?: string;
}
export const SolutionUpdateSummary = S.suspend(() =>
  S.Struct({
    solutionUpdateConfig: S.optional(SolutionUpdateConfig),
    status: S.optional(S.String),
    performAutoTraining: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SolutionUpdateSummary",
}) as any as S.Schema<SolutionUpdateSummary>;
export interface TunedHPOParams {
  algorithmHyperParameters?: { [key: string]: string };
}
export const TunedHPOParams = S.suspend(() =>
  S.Struct({ algorithmHyperParameters: S.optional(HyperParameters) }),
).annotations({
  identifier: "TunedHPOParams",
}) as any as S.Schema<TunedHPOParams>;
export interface IntegerHyperParameterRange {
  name?: string;
  minValue?: number;
  maxValue?: number;
}
export const IntegerHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    minValue: S.optional(S.Number),
    maxValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "IntegerHyperParameterRange",
}) as any as S.Schema<IntegerHyperParameterRange>;
export type IntegerHyperParameterRanges = IntegerHyperParameterRange[];
export const IntegerHyperParameterRanges = S.Array(IntegerHyperParameterRange);
export interface ContinuousHyperParameterRange {
  name?: string;
  minValue?: number;
  maxValue?: number;
}
export const ContinuousHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    minValue: S.optional(S.Number),
    maxValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "ContinuousHyperParameterRange",
}) as any as S.Schema<ContinuousHyperParameterRange>;
export type ContinuousHyperParameterRanges = ContinuousHyperParameterRange[];
export const ContinuousHyperParameterRanges = S.Array(
  ContinuousHyperParameterRange,
);
export interface CategoricalHyperParameterRange {
  name?: string;
  values?: string[];
}
export const CategoricalHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    values: S.optional(CategoricalValues),
  }),
).annotations({
  identifier: "CategoricalHyperParameterRange",
}) as any as S.Schema<CategoricalHyperParameterRange>;
export type CategoricalHyperParameterRanges = CategoricalHyperParameterRange[];
export const CategoricalHyperParameterRanges = S.Array(
  CategoricalHyperParameterRange,
);
export interface Campaign {
  name?: string;
  campaignArn?: string;
  solutionVersionArn?: string;
  minProvisionedTPS?: number;
  campaignConfig?: CampaignConfig;
  status?: string;
  failureReason?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  latestCampaignUpdate?: CampaignUpdateSummary;
}
export const Campaign = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    campaignArn: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    latestCampaignUpdate: S.optional(CampaignUpdateSummary),
  }),
).annotations({ identifier: "Campaign" }) as any as S.Schema<Campaign>;
export interface Dataset {
  name?: string;
  datasetArn?: string;
  datasetGroupArn?: string;
  datasetType?: string;
  schemaArn?: string;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  latestDatasetUpdate?: DatasetUpdateSummary;
  trackingId?: string;
}
export const Dataset = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    datasetArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    datasetType: S.optional(S.String),
    schemaArn: S.optional(S.String),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    latestDatasetUpdate: S.optional(DatasetUpdateSummary),
    trackingId: S.optional(S.String),
  }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export interface FeatureTransformation {
  name?: string;
  featureTransformationArn?: string;
  defaultParameters?: { [key: string]: string };
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  status?: string;
}
export const FeatureTransformation = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    featureTransformationArn: S.optional(S.String),
    defaultParameters: S.optional(FeaturizationParameters),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "FeatureTransformation",
}) as any as S.Schema<FeatureTransformation>;
export interface Recommender {
  recommenderArn?: string;
  datasetGroupArn?: string;
  name?: string;
  recipeArn?: string;
  recommenderConfig?: RecommenderConfig;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  status?: string;
  failureReason?: string;
  latestRecommenderUpdate?: RecommenderUpdateSummary;
  modelMetrics?: { [key: string]: number };
}
export const Recommender = S.suspend(() =>
  S.Struct({
    recommenderArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    name: S.optional(S.String),
    recipeArn: S.optional(S.String),
    recommenderConfig: S.optional(RecommenderConfig),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    latestRecommenderUpdate: S.optional(RecommenderUpdateSummary),
    modelMetrics: S.optional(Metrics),
  }),
).annotations({ identifier: "Recommender" }) as any as S.Schema<Recommender>;
export interface HyperParameterRanges {
  integerHyperParameterRanges?: IntegerHyperParameterRange[];
  continuousHyperParameterRanges?: ContinuousHyperParameterRange[];
  categoricalHyperParameterRanges?: CategoricalHyperParameterRange[];
}
export const HyperParameterRanges = S.suspend(() =>
  S.Struct({
    integerHyperParameterRanges: S.optional(IntegerHyperParameterRanges),
    continuousHyperParameterRanges: S.optional(ContinuousHyperParameterRanges),
    categoricalHyperParameterRanges: S.optional(
      CategoricalHyperParameterRanges,
    ),
  }),
).annotations({
  identifier: "HyperParameterRanges",
}) as any as S.Schema<HyperParameterRanges>;
export interface HPOConfig {
  hpoObjective?: HPOObjective;
  hpoResourceConfig?: HPOResourceConfig;
  algorithmHyperParameterRanges?: HyperParameterRanges;
}
export const HPOConfig = S.suspend(() =>
  S.Struct({
    hpoObjective: S.optional(HPOObjective),
    hpoResourceConfig: S.optional(HPOResourceConfig),
    algorithmHyperParameterRanges: S.optional(HyperParameterRanges),
  }),
).annotations({ identifier: "HPOConfig" }) as any as S.Schema<HPOConfig>;
export interface SolutionConfig {
  eventValueThreshold?: string;
  hpoConfig?: HPOConfig;
  algorithmHyperParameters?: { [key: string]: string };
  featureTransformationParameters?: { [key: string]: string };
  autoMLConfig?: AutoMLConfig;
  eventsConfig?: EventsConfig;
  optimizationObjective?: OptimizationObjective;
  trainingDataConfig?: TrainingDataConfig;
  autoTrainingConfig?: AutoTrainingConfig;
}
export const SolutionConfig = S.suspend(() =>
  S.Struct({
    eventValueThreshold: S.optional(S.String),
    hpoConfig: S.optional(HPOConfig),
    algorithmHyperParameters: S.optional(HyperParameters),
    featureTransformationParameters: S.optional(
      FeatureTransformationParameters,
    ),
    autoMLConfig: S.optional(AutoMLConfig),
    eventsConfig: S.optional(EventsConfig),
    optimizationObjective: S.optional(OptimizationObjective),
    trainingDataConfig: S.optional(TrainingDataConfig),
    autoTrainingConfig: S.optional(AutoTrainingConfig),
  }),
).annotations({
  identifier: "SolutionConfig",
}) as any as S.Schema<SolutionConfig>;
export interface Solution {
  name?: string;
  solutionArn?: string;
  performHPO?: boolean;
  performAutoML?: boolean;
  performAutoTraining?: boolean;
  performIncrementalUpdate?: boolean;
  recipeArn?: string;
  datasetGroupArn?: string;
  eventType?: string;
  solutionConfig?: SolutionConfig;
  autoMLResult?: AutoMLResult;
  status?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  latestSolutionVersion?: SolutionVersionSummary;
  latestSolutionUpdate?: SolutionUpdateSummary;
}
export const Solution = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    solutionArn: S.optional(S.String),
    performHPO: S.optional(S.Boolean),
    performAutoML: S.optional(S.Boolean),
    performAutoTraining: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    recipeArn: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    eventType: S.optional(S.String),
    solutionConfig: S.optional(SolutionConfig),
    autoMLResult: S.optional(AutoMLResult),
    status: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    latestSolutionVersion: S.optional(SolutionVersionSummary),
    latestSolutionUpdate: S.optional(SolutionUpdateSummary),
  }),
).annotations({ identifier: "Solution" }) as any as S.Schema<Solution>;
export interface SolutionVersion {
  name?: string;
  solutionVersionArn?: string;
  solutionArn?: string;
  performHPO?: boolean;
  performAutoML?: boolean;
  performIncrementalUpdate?: boolean;
  recipeArn?: string;
  eventType?: string;
  datasetGroupArn?: string;
  solutionConfig?: SolutionConfig;
  trainingHours?: number;
  trainingMode?: TrainingMode;
  tunedHPOParams?: TunedHPOParams;
  status?: string;
  failureReason?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
  trainingType?: TrainingType;
}
export const SolutionVersion = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    solutionVersionArn: S.optional(S.String),
    solutionArn: S.optional(S.String),
    performHPO: S.optional(S.Boolean),
    performAutoML: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    recipeArn: S.optional(S.String),
    eventType: S.optional(S.String),
    datasetGroupArn: S.optional(S.String),
    solutionConfig: S.optional(SolutionConfig),
    trainingHours: S.optional(S.Number),
    trainingMode: S.optional(TrainingMode),
    tunedHPOParams: S.optional(TunedHPOParams),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    trainingType: S.optional(TrainingType),
  }),
).annotations({
  identifier: "SolutionVersion",
}) as any as S.Schema<SolutionVersion>;
export interface DefaultIntegerHyperParameterRange {
  name?: string;
  minValue?: number;
  maxValue?: number;
  isTunable?: boolean;
}
export const DefaultIntegerHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    minValue: S.optional(S.Number),
    maxValue: S.optional(S.Number),
    isTunable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DefaultIntegerHyperParameterRange",
}) as any as S.Schema<DefaultIntegerHyperParameterRange>;
export type DefaultIntegerHyperParameterRanges =
  DefaultIntegerHyperParameterRange[];
export const DefaultIntegerHyperParameterRanges = S.Array(
  DefaultIntegerHyperParameterRange,
);
export interface DefaultContinuousHyperParameterRange {
  name?: string;
  minValue?: number;
  maxValue?: number;
  isTunable?: boolean;
}
export const DefaultContinuousHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    minValue: S.optional(S.Number),
    maxValue: S.optional(S.Number),
    isTunable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DefaultContinuousHyperParameterRange",
}) as any as S.Schema<DefaultContinuousHyperParameterRange>;
export type DefaultContinuousHyperParameterRanges =
  DefaultContinuousHyperParameterRange[];
export const DefaultContinuousHyperParameterRanges = S.Array(
  DefaultContinuousHyperParameterRange,
);
export interface DefaultCategoricalHyperParameterRange {
  name?: string;
  values?: string[];
  isTunable?: boolean;
}
export const DefaultCategoricalHyperParameterRange = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    values: S.optional(CategoricalValues),
    isTunable: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DefaultCategoricalHyperParameterRange",
}) as any as S.Schema<DefaultCategoricalHyperParameterRange>;
export type DefaultCategoricalHyperParameterRanges =
  DefaultCategoricalHyperParameterRange[];
export const DefaultCategoricalHyperParameterRanges = S.Array(
  DefaultCategoricalHyperParameterRange,
);
export interface CreateBatchInferenceJobResponse {
  batchInferenceJobArn?: string;
}
export const CreateBatchInferenceJobResponse = S.suspend(() =>
  S.Struct({ batchInferenceJobArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateBatchInferenceJobResponse",
}) as any as S.Schema<CreateBatchInferenceJobResponse>;
export interface CreateRecommenderRequest {
  name: string;
  datasetGroupArn: string;
  recipeArn: string;
  recommenderConfig?: RecommenderConfig;
  tags?: Tag[];
}
export const CreateRecommenderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    datasetGroupArn: S.String,
    recipeArn: S.String,
    recommenderConfig: S.optional(RecommenderConfig),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRecommenderRequest",
}) as any as S.Schema<CreateRecommenderRequest>;
export interface DescribeCampaignResponse {
  campaign?: Campaign;
}
export const DescribeCampaignResponse = S.suspend(() =>
  S.Struct({ campaign: S.optional(Campaign) }),
).annotations({
  identifier: "DescribeCampaignResponse",
}) as any as S.Schema<DescribeCampaignResponse>;
export interface DescribeDatasetResponse {
  dataset?: Dataset;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({ dataset: S.optional(Dataset) }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeFeatureTransformationResponse {
  featureTransformation?: FeatureTransformation;
}
export const DescribeFeatureTransformationResponse = S.suspend(() =>
  S.Struct({ featureTransformation: S.optional(FeatureTransformation) }),
).annotations({
  identifier: "DescribeFeatureTransformationResponse",
}) as any as S.Schema<DescribeFeatureTransformationResponse>;
export interface DescribeRecommenderResponse {
  recommender?: Recommender;
}
export const DescribeRecommenderResponse = S.suspend(() =>
  S.Struct({ recommender: S.optional(Recommender) }),
).annotations({
  identifier: "DescribeRecommenderResponse",
}) as any as S.Schema<DescribeRecommenderResponse>;
export interface DescribeSolutionResponse {
  solution?: Solution;
}
export const DescribeSolutionResponse = S.suspend(() =>
  S.Struct({ solution: S.optional(Solution) }),
).annotations({
  identifier: "DescribeSolutionResponse",
}) as any as S.Schema<DescribeSolutionResponse>;
export interface DescribeSolutionVersionResponse {
  solutionVersion?: SolutionVersion;
}
export const DescribeSolutionVersionResponse = S.suspend(() =>
  S.Struct({ solutionVersion: S.optional(SolutionVersion) }),
).annotations({
  identifier: "DescribeSolutionVersionResponse",
}) as any as S.Schema<DescribeSolutionVersionResponse>;
export interface DefaultHyperParameterRanges {
  integerHyperParameterRanges?: DefaultIntegerHyperParameterRange[];
  continuousHyperParameterRanges?: DefaultContinuousHyperParameterRange[];
  categoricalHyperParameterRanges?: DefaultCategoricalHyperParameterRange[];
}
export const DefaultHyperParameterRanges = S.suspend(() =>
  S.Struct({
    integerHyperParameterRanges: S.optional(DefaultIntegerHyperParameterRanges),
    continuousHyperParameterRanges: S.optional(
      DefaultContinuousHyperParameterRanges,
    ),
    categoricalHyperParameterRanges: S.optional(
      DefaultCategoricalHyperParameterRanges,
    ),
  }),
).annotations({
  identifier: "DefaultHyperParameterRanges",
}) as any as S.Schema<DefaultHyperParameterRanges>;
export interface Algorithm {
  name?: string;
  algorithmArn?: string;
  algorithmImage?: AlgorithmImage;
  defaultHyperParameters?: { [key: string]: string };
  defaultHyperParameterRanges?: DefaultHyperParameterRanges;
  defaultResourceConfig?: { [key: string]: string };
  trainingInputMode?: string;
  roleArn?: string;
  creationDateTime?: Date;
  lastUpdatedDateTime?: Date;
}
export const Algorithm = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    algorithmArn: S.optional(S.String),
    algorithmImage: S.optional(AlgorithmImage),
    defaultHyperParameters: S.optional(HyperParameters),
    defaultHyperParameterRanges: S.optional(DefaultHyperParameterRanges),
    defaultResourceConfig: S.optional(ResourceConfig),
    trainingInputMode: S.optional(S.String),
    roleArn: S.optional(S.String),
    creationDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Algorithm" }) as any as S.Schema<Algorithm>;
export interface CreateRecommenderResponse {
  recommenderArn?: string;
}
export const CreateRecommenderResponse = S.suspend(() =>
  S.Struct({ recommenderArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateRecommenderResponse",
}) as any as S.Schema<CreateRecommenderResponse>;
export interface CreateSolutionRequest {
  name: string;
  performHPO?: boolean;
  performAutoML?: boolean;
  performAutoTraining?: boolean;
  performIncrementalUpdate?: boolean;
  recipeArn?: string;
  datasetGroupArn: string;
  eventType?: string;
  solutionConfig?: SolutionConfig;
  tags?: Tag[];
}
export const CreateSolutionRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    performHPO: S.optional(S.Boolean),
    performAutoML: S.optional(S.Boolean),
    performAutoTraining: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    recipeArn: S.optional(S.String),
    datasetGroupArn: S.String,
    eventType: S.optional(S.String),
    solutionConfig: S.optional(SolutionConfig),
    tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSolutionRequest",
}) as any as S.Schema<CreateSolutionRequest>;
export interface DescribeAlgorithmResponse {
  algorithm?: Algorithm;
}
export const DescribeAlgorithmResponse = S.suspend(() =>
  S.Struct({ algorithm: S.optional(Algorithm) }),
).annotations({
  identifier: "DescribeAlgorithmResponse",
}) as any as S.Schema<DescribeAlgorithmResponse>;
export interface CreateSolutionResponse {
  solutionArn?: string;
}
export const CreateSolutionResponse = S.suspend(() =>
  S.Struct({ solutionArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateSolutionResponse",
}) as any as S.Schema<CreateSolutionResponse>;

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class TooManyTagKeysException extends S.TaggedError<TooManyTagKeysException>()(
  "TooManyTagKeysException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the metrics for the metric attribution.
 */
export const listMetricAttributionMetrics: {
  (
    input: ListMetricAttributionMetricsRequest,
  ): effect.Effect<
    ListMetricAttributionMetricsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetricAttributionMetricsRequest,
  ) => stream.Stream<
    ListMetricAttributionMetricsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMetricAttributionMetricsRequest,
  ) => stream.Stream<
    MetricAttribute,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetricAttributionMetricsRequest,
  output: ListMetricAttributionMetricsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metrics",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists metric attributions.
 */
export const listMetricAttributions: {
  (
    input: ListMetricAttributionsRequest,
  ): effect.Effect<
    ListMetricAttributionsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMetricAttributionsRequest,
  ) => stream.Stream<
    ListMetricAttributionsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMetricAttributionsRequest,
  ) => stream.Stream<
    MetricAttributionSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMetricAttributionsRequest,
  output: ListMetricAttributionsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "metricAttributions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of available recipes. The response provides the properties
 * for each recipe, including the recipe's Amazon Resource Name (ARN).
 */
export const listRecipes: {
  (
    input: ListRecipesRequest,
  ): effect.Effect<
    ListRecipesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecipesRequest,
  ) => stream.Stream<
    ListRecipesResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecipesRequest,
  ) => stream.Stream<
    RecipeSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecipesRequest,
  output: ListRecipesResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recipes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of recommenders in a given Domain dataset group.
 * When a Domain dataset group is not specified, all the recommenders associated with the account are listed.
 * The response provides the properties for each recommender, including the Amazon Resource Name (ARN).
 * For more information on recommenders, see CreateRecommender.
 */
export const listRecommenders: {
  (
    input: ListRecommendersRequest,
  ): effect.Effect<
    ListRecommendersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendersRequest,
  ) => stream.Stream<
    ListRecommendersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendersRequest,
  ) => stream.Stream<
    RecommenderSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecommendersRequest,
  output: ListRecommendersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommenders",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the list of schemas associated with the account. The response provides the
 * properties for each schema, including the Amazon Resource Name (ARN).
 * For more information on schemas, see CreateSchema.
 */
export const listSchemas: {
  (
    input: ListSchemasRequest,
  ): effect.Effect<
    ListSchemasResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemasRequest,
  ) => stream.Stream<
    ListSchemasResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemasRequest,
  ) => stream.Stream<
    DatasetSchemaSummary,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "schemas",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of solutions in a given dataset group.
 * When a dataset group is not specified, all the solutions associated with the account are listed.
 * The response provides the properties for each solution, including the Amazon Resource Name (ARN).
 * For more information on solutions, see CreateSolution.
 */
export const listSolutions: {
  (
    input: ListSolutionsRequest,
  ): effect.Effect<
    ListSolutionsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolutionsRequest,
  ) => stream.Stream<
    ListSolutionsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolutionsRequest,
  ) => stream.Stream<
    SolutionSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolutionsRequest,
  output: ListSolutionsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "solutions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of the batch inference jobs that have been performed off of a solution
 * version.
 */
export const listBatchInferenceJobs: {
  (
    input: ListBatchInferenceJobsRequest,
  ): effect.Effect<
    ListBatchInferenceJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBatchInferenceJobsRequest,
  ) => stream.Stream<
    ListBatchInferenceJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBatchInferenceJobsRequest,
  ) => stream.Stream<
    BatchInferenceJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBatchInferenceJobsRequest,
  output: ListBatchInferenceJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "batchInferenceJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Gets a list of the batch segment jobs that have been performed off of a solution
 * version that you specify.
 */
export const listBatchSegmentJobs: {
  (
    input: ListBatchSegmentJobsRequest,
  ): effect.Effect<
    ListBatchSegmentJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBatchSegmentJobsRequest,
  ) => stream.Stream<
    ListBatchSegmentJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBatchSegmentJobsRequest,
  ) => stream.Stream<
    BatchSegmentJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBatchSegmentJobsRequest,
  output: ListBatchSegmentJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "batchSegmentJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of campaigns that use the given solution.
 * When a solution is not specified, all the campaigns associated with the account are listed.
 * The response provides the properties for each campaign, including the Amazon Resource Name (ARN).
 * For more information on campaigns, see CreateCampaign.
 */
export const listCampaigns: {
  (
    input: ListCampaignsRequest,
  ): effect.Effect<
    ListCampaignsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    ListCampaignsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCampaignsRequest,
  ) => stream.Stream<
    CampaignSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCampaignsRequest,
  output: ListCampaignsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "campaigns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of data deletion jobs for a dataset group ordered by creation time,
 * with the most recent first.
 * When
 * a dataset group is not specified, all the data deletion jobs associated with
 * the account are listed. The response provides the properties for each
 * job, including the Amazon Resource Name (ARN). For more
 * information on data deletion jobs, see Deleting users.
 */
export const listDataDeletionJobs: (
  input: ListDataDeletionJobsRequest,
) => effect.Effect<
  ListDataDeletionJobsResponse,
  InvalidInputException | InvalidNextTokenException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataDeletionJobsRequest,
  output: ListDataDeletionJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of dataset export jobs that use the given dataset. When
 * a dataset is not specified, all the dataset export jobs associated with
 * the account are listed. The response provides the properties for each
 * dataset export job, including the Amazon Resource Name (ARN). For more
 * information on dataset export jobs, see CreateDatasetExportJob. For more information on datasets, see
 * CreateDataset.
 */
export const listDatasetExportJobs: {
  (
    input: ListDatasetExportJobsRequest,
  ): effect.Effect<
    ListDatasetExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetExportJobsRequest,
  ) => stream.Stream<
    ListDatasetExportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetExportJobsRequest,
  ) => stream.Stream<
    DatasetExportJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetExportJobsRequest,
  output: ListDatasetExportJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasetExportJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of dataset groups. The response provides the properties
 * for each dataset group, including the Amazon Resource Name (ARN). For more
 * information on dataset groups, see CreateDatasetGroup.
 */
export const listDatasetGroups: {
  (
    input: ListDatasetGroupsRequest,
  ): effect.Effect<
    ListDatasetGroupsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetGroupsRequest,
  ) => stream.Stream<
    ListDatasetGroupsResponse,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetGroupsRequest,
  ) => stream.Stream<
    DatasetGroupSummary,
    InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetGroupsRequest,
  output: ListDatasetGroupsResponse,
  errors: [InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasetGroups",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of dataset import jobs that use the given dataset. When
 * a dataset is not specified, all the dataset import jobs associated with
 * the account are listed. The response provides the properties for each
 * dataset import job, including the Amazon Resource Name (ARN). For more
 * information on dataset import jobs, see CreateDatasetImportJob. For more information on datasets, see
 * CreateDataset.
 */
export const listDatasetImportJobs: {
  (
    input: ListDatasetImportJobsRequest,
  ): effect.Effect<
    ListDatasetImportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetImportJobsRequest,
  ) => stream.Stream<
    ListDatasetImportJobsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetImportJobsRequest,
  ) => stream.Stream<
    DatasetImportJobSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetImportJobsRequest,
  output: ListDatasetImportJobsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasetImportJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the list of datasets contained in the given dataset group. The
 * response provides the properties for each dataset, including the Amazon
 * Resource Name (ARN). For more information on datasets, see CreateDataset.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    DatasetSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "datasets",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the list of event trackers associated with the account.
 * The response provides the properties for each event tracker, including the Amazon Resource
 * Name (ARN) and tracking ID. For more
 * information on event trackers, see CreateEventTracker.
 */
export const listEventTrackers: {
  (
    input: ListEventTrackersRequest,
  ): effect.Effect<
    ListEventTrackersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventTrackersRequest,
  ) => stream.Stream<
    ListEventTrackersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventTrackersRequest,
  ) => stream.Stream<
    EventTrackerSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventTrackersRequest,
  output: ListEventTrackersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "eventTrackers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all filters that belong to a given dataset group.
 */
export const listFilters: {
  (
    input: ListFiltersRequest,
  ): effect.Effect<
    ListFiltersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFiltersRequest,
  ) => stream.Stream<
    ListFiltersResponse,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFiltersRequest,
  ) => stream.Stream<
    FilterSummary,
    InvalidInputException | InvalidNextTokenException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFiltersRequest,
  output: ListFiltersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "Filters",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates an Amazon Personalize schema from the specified schema string. The schema you create
 * must be in Avro JSON format.
 *
 * Amazon Personalize recognizes three schema variants. Each schema is associated with a dataset
 * type and has a set of required field and keywords. If you are creating a schema for a dataset in a Domain dataset group, you
 * provide the domain of the Domain dataset group.
 * You specify a schema when you call CreateDataset.
 *
 * **Related APIs**
 *
 * - ListSchemas
 *
 * - DescribeSchema
 *
 * - DeleteSchema
 */
export const createSchema: (
  input: CreateSchemaRequest,
) => effect.Effect<
  CreateSchemaResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaRequest,
  output: CreateSchemaResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Removes a campaign by deleting the solution deployment. The solution that
 * the campaign is based on is not deleted and can be redeployed when needed. A deleted campaign can no
 * longer be specified in a
 * GetRecommendations
 * request.
 * For information on creating campaigns, see CreateCampaign.
 */
export const deleteCampaign: (
  input: DeleteCampaignRequest,
) => effect.Effect<
  DeleteCampaignResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes the given campaign, including its status.
 *
 * A campaign can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * When the `status` is `CREATE FAILED`, the response includes the
 * `failureReason` key, which describes why.
 *
 * For more information on campaigns, see CreateCampaign.
 */
export const describeCampaign: (
  input: DescribeCampaignRequest,
) => effect.Effect<
  DescribeCampaignResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCampaignRequest,
  output: DescribeCampaignResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given dataset. For more information on datasets, see
 * CreateDataset.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => effect.Effect<
  DescribeDatasetResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given feature transformation.
 */
export const describeFeatureTransformation: (
  input: DescribeFeatureTransformationRequest,
) => effect.Effect<
  DescribeFeatureTransformationResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFeatureTransformationRequest,
  output: DescribeFeatureTransformationResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given recommender, including its status.
 *
 * A recommender can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - STOP PENDING > STOP IN_PROGRESS > INACTIVE > START PENDING > START IN_PROGRESS > ACTIVE
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * When the `status` is `CREATE FAILED`, the response includes the
 * `failureReason` key, which describes why.
 *
 * The `modelMetrics` key is null when
 * the recommender is being created or deleted.
 *
 * For more information on recommenders, see CreateRecommender.
 */
export const describeRecommender: (
  input: DescribeRecommenderRequest,
) => effect.Effect<
  DescribeRecommenderResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecommenderRequest,
  output: DescribeRecommenderResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a solution.
 * For more information on solutions, see CreateSolution.
 */
export const describeSolution: (
  input: DescribeSolutionRequest,
) => effect.Effect<
  DescribeSolutionResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSolutionRequest,
  output: DescribeSolutionResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a specific version of a solution. For more information on solutions, see CreateSolution
 */
export const describeSolutionVersion: (
  input: DescribeSolutionVersionRequest,
) => effect.Effect<
  DescribeSolutionVersionResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSolutionVersionRequest,
  output: DescribeSolutionVersionResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Gets the properties of a batch inference job including name, Amazon Resource Name (ARN),
 * status, input and output configurations, and the ARN of the solution version used to generate
 * the recommendations.
 */
export const describeBatchInferenceJob: (
  input: DescribeBatchInferenceJobRequest,
) => effect.Effect<
  DescribeBatchInferenceJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBatchInferenceJobRequest,
  output: DescribeBatchInferenceJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Gets the properties of a batch segment job including name, Amazon Resource Name (ARN),
 * status, input and output configurations, and the ARN of the solution version used to generate
 * segments.
 */
export const describeBatchSegmentJob: (
  input: DescribeBatchSegmentJobRequest,
) => effect.Effect<
  DescribeBatchSegmentJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBatchSegmentJobRequest,
  output: DescribeBatchSegmentJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the data deletion job created by CreateDataDeletionJob, including the job status.
 */
export const describeDataDeletionJob: (
  input: DescribeDataDeletionJobRequest,
) => effect.Effect<
  DescribeDataDeletionJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDataDeletionJobRequest,
  output: DescribeDataDeletionJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the dataset export job created by CreateDatasetExportJob, including the export job status.
 */
export const describeDatasetExportJob: (
  input: DescribeDatasetExportJobRequest,
) => effect.Effect<
  DescribeDatasetExportJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetExportJobRequest,
  output: DescribeDatasetExportJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given dataset group. For more information on dataset
 * groups, see CreateDatasetGroup.
 */
export const describeDatasetGroup: (
  input: DescribeDatasetGroupRequest,
) => effect.Effect<
  DescribeDatasetGroupResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetGroupRequest,
  output: DescribeDatasetGroupResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the dataset import job created by CreateDatasetImportJob, including the import job status.
 */
export const describeDatasetImportJob: (
  input: DescribeDatasetImportJobRequest,
) => effect.Effect<
  DescribeDatasetImportJobResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetImportJobRequest,
  output: DescribeDatasetImportJobResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes an event tracker. The response includes the `trackingId` and
 * `status` of the event tracker.
 * For more information on event trackers, see CreateEventTracker.
 */
export const describeEventTracker: (
  input: DescribeEventTrackerRequest,
) => effect.Effect<
  DescribeEventTrackerResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventTrackerRequest,
  output: DescribeEventTrackerResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a filter's properties.
 */
export const describeFilter: (
  input: DescribeFilterRequest,
) => effect.Effect<
  DescribeFilterResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFilterRequest,
  output: DescribeFilterResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a metric attribution.
 */
export const describeMetricAttribution: (
  input: DescribeMetricAttributionRequest,
) => effect.Effect<
  DescribeMetricAttributionResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMetricAttributionRequest,
  output: DescribeMetricAttributionResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a recipe.
 *
 * A recipe contains three items:
 *
 * - An algorithm that trains a model.
 *
 * - Hyperparameters that govern the training.
 *
 * - Feature transformation information for modifying the input data before training.
 *
 * Amazon Personalize provides a set of predefined recipes. You specify a recipe when you create a
 * solution with the CreateSolution API.
 * `CreateSolution` trains a model by using the algorithm
 * in the specified recipe and a training dataset. The solution, when deployed as a campaign,
 * can provide recommendations using the
 * GetRecommendations API.
 */
export const describeRecipe: (
  input: DescribeRecipeRequest,
) => effect.Effect<
  DescribeRecipeResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecipeRequest,
  output: DescribeRecipeResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a schema. For more information on schemas, see
 * CreateSchema.
 */
export const describeSchema: (
  input: DescribeSchemaRequest,
) => effect.Effect<
  DescribeSchemaResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSchemaRequest,
  output: DescribeSchemaResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Gets the metrics for the specified solution version.
 */
export const getSolutionMetrics: (
  input: GetSolutionMetricsRequest,
) => effect.Effect<
  GetSolutionMetricsResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolutionMetricsRequest,
  output: GetSolutionMetricsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of solution versions for the given solution. When a solution is not
 * specified, all the solution versions associated with the account are listed. The response
 * provides the properties for each solution version, including the Amazon Resource Name (ARN).
 */
export const listSolutionVersions: {
  (
    input: ListSolutionVersionsRequest,
  ): effect.Effect<
    ListSolutionVersionsResponse,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSolutionVersionsRequest,
  ) => stream.Stream<
    ListSolutionVersionsResponse,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSolutionVersionsRequest,
  ) => stream.Stream<
    SolutionVersionSummary,
    | InvalidInputException
    | InvalidNextTokenException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSolutionVersionsRequest,
  output: ListSolutionVersionsResponse,
  errors: [
    InvalidInputException,
    InvalidNextTokenException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "solutionVersions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a metric attribution.
 */
export const updateMetricAttribution: (
  input: UpdateMetricAttributionRequest,
) => effect.Effect<
  UpdateMetricAttributionResponse,
  | InvalidInputException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMetricAttributionRequest,
  output: UpdateMetricAttributionResponse,
  errors: [
    InvalidInputException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Get a list of tags attached to a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Starts a recommender that is INACTIVE. Starting a recommender does not
 * create any new models, but resumes billing and automatic retraining for the recommender.
 */
export const startRecommender: (
  input: StartRecommenderRequest,
) => effect.Effect<
  StartRecommenderResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRecommenderRequest,
  output: StartRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops a recommender that is ACTIVE. Stopping a recommender halts billing and automatic retraining for the recommender.
 */
export const stopRecommender: (
  input: StopRecommenderRequest,
) => effect.Effect<
  StopRecommenderResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRecommenderRequest,
  output: StopRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a campaign to deploy a retrained solution version with an existing campaign, change your campaign's `minProvisionedTPS`,
 * or modify your campaign's configuration. For example, you can set `enableMetadataWithRecommendations` to true for an existing campaign.
 *
 * To update a campaign to start automatically using the latest solution version, specify the following:
 *
 * - For the `SolutionVersionArn` parameter, specify the Amazon Resource Name (ARN) of your solution in
 * `SolutionArn/$LATEST` format.
 *
 * - In the `campaignConfig`, set `syncWithLatestSolutionVersion` to `true`.
 *
 * To update a campaign, the campaign status must be ACTIVE or CREATE FAILED.
 * Check the campaign status using the DescribeCampaign operation.
 *
 * You can still get recommendations from a campaign while an update is in progress.
 * The campaign will use the previous solution version and campaign configuration to generate recommendations until the latest campaign update status is `Active`.
 *
 * For more information about updating a campaign, including code samples, see Updating a campaign.
 * For more information about campaigns, see Creating a campaign.
 */
export const updateCampaign: (
  input: UpdateCampaignRequest,
) => effect.Effect<
  UpdateCampaignResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCampaignRequest,
  output: UpdateCampaignResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Update a dataset to replace its schema with a new or existing one. For more information, see Replacing a dataset's schema.
 */
export const updateDataset: (
  input: UpdateDatasetRequest,
) => effect.Effect<
  UpdateDatasetResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the recommender to modify the recommender configuration.
 * If you update the recommender to modify the columns used in training, Amazon Personalize automatically starts a full retraining of
 * the models backing your recommender. While the update completes, you can still get recommendations from the recommender. The recommender
 * uses the previous configuration until the update completes.
 * To track the status of this update,
 * use the `latestRecommenderUpdate` returned in the DescribeRecommender
 * operation.
 */
export const updateRecommender: (
  input: UpdateRecommenderRequest,
) => effect.Effect<
  UpdateRecommenderResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecommenderRequest,
  output: UpdateRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset. You can't delete a dataset if an associated
 * `DatasetImportJob` or `SolutionVersion` is in the
 * CREATE PENDING or IN PROGRESS state. For more information about deleting datasets,
 * see Deleting a dataset.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset group. Before you delete a dataset group, you must
 * delete the following:
 *
 * - All associated event trackers.
 *
 * - All associated solutions.
 *
 * - All datasets in the dataset group.
 */
export const deleteDatasetGroup: (
  input: DeleteDatasetGroupRequest,
) => effect.Effect<
  DeleteDatasetGroupResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetGroupRequest,
  output: DeleteDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the event tracker. Does not delete the dataset from
 * the dataset group. For more
 * information on event trackers, see CreateEventTracker.
 */
export const deleteEventTracker: (
  input: DeleteEventTrackerRequest,
) => effect.Effect<
  DeleteEventTrackerResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventTrackerRequest,
  output: DeleteEventTrackerResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a filter.
 */
export const deleteFilter: (
  input: DeleteFilterRequest,
) => effect.Effect<
  DeleteFilterResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFilterRequest,
  output: DeleteFilterResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a metric attribution.
 */
export const deleteMetricAttribution: (
  input: DeleteMetricAttributionRequest,
) => effect.Effect<
  DeleteMetricAttributionResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMetricAttributionRequest,
  output: DeleteMetricAttributionResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deactivates and removes a recommender. A deleted recommender can no longer be specified in a GetRecommendations
 * request.
 */
export const deleteRecommender: (
  input: DeleteRecommenderRequest,
) => effect.Effect<
  DeleteRecommenderResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecommenderRequest,
  output: DeleteRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a schema. Before deleting a schema, you must delete all
 * datasets referencing the schema. For more information on schemas, see
 * CreateSchema.
 */
export const deleteSchema: (
  input: DeleteSchemaRequest,
) => effect.Effect<
  DeleteSchemaResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaRequest,
  output: DeleteSchemaResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes all versions of a solution and the `Solution` object itself.
 * Before deleting a solution, you must delete all campaigns based on
 * the solution. To determine what campaigns are using the solution, call
 * ListCampaigns and supply the Amazon Resource Name (ARN) of the solution.
 * You can't delete a solution if an associated `SolutionVersion` is in the
 * CREATE PENDING or IN PROGRESS state.
 * For more information on solutions, see CreateSolution.
 */
export const deleteSolution: (
  input: DeleteSolutionRequest,
) => effect.Effect<
  DeleteSolutionResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSolutionRequest,
  output: DeleteSolutionResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Stops creating a solution version that is in a state of CREATE_PENDING or CREATE IN_PROGRESS.
 *
 * Depending on the current state of the solution version, the solution version state changes as follows:
 *
 * - CREATE_PENDING > CREATE_STOPPED
 *
 * or
 *
 * - CREATE_IN_PROGRESS > CREATE_STOPPING > CREATE_STOPPED
 *
 * You are billed for all of the training completed up
 * until you stop the solution version creation. You cannot resume creating a solution version once it has been stopped.
 */
export const stopSolutionVersionCreation: (
  input: StopSolutionVersionCreationRequest,
) => effect.Effect<
  StopSolutionVersionCreationResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSolutionVersionCreationRequest,
  output: StopSolutionVersionCreationResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a metric attribution.
 * A metric attribution creates reports on the data that you import into Amazon Personalize. Depending on how you imported the data, you can view reports in Amazon CloudWatch or Amazon S3.
 * For more information, see Measuring impact of recommendations.
 */
export const createMetricAttribution: (
  input: CreateMetricAttributionRequest,
) => effect.Effect<
  CreateMetricAttributionResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMetricAttributionRequest,
  output: CreateMetricAttributionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an Amazon Personalize solution to use a different automatic training configuration. When you update a solution,
 * you can change whether the solution uses
 * automatic training, and you can change the training frequency. For more information about updating a solution, see
 * Updating a solution.
 *
 * A solution update can be in one of the
 * following states:
 *
 * CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * To get the status of a solution update, call the
 * DescribeSolution API operation and find the status
 * in the `latestSolutionUpdate`.
 */
export const updateSolution: (
  input: UpdateSolutionRequest,
) => effect.Effect<
  UpdateSolutionResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSolutionRequest,
  output: UpdateSolutionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an empty dataset group. A dataset group is a container for
 * Amazon Personalize resources. A dataset group can contain at most three datasets, one
 * for each type of dataset:
 *
 * - Item interactions
 *
 * - Items
 *
 * - Users
 *
 * - Actions
 *
 * - Action interactions
 *
 * A dataset group can be a Domain dataset group, where you specify a
 * domain and use pre-configured resources like recommenders, or a
 * Custom dataset group, where you use custom resources, such as a solution
 * with a solution version, that you deploy with a campaign. If you start
 * with a Domain dataset group, you can still add custom resources such as
 * solutions and solution versions trained with recipes for custom use cases
 * and deployed with campaigns.
 *
 * A dataset group can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE
 * FAILED
 *
 * - DELETE PENDING
 *
 * To get the status of the dataset group, call DescribeDatasetGroup. If the status shows as CREATE FAILED, the
 * response includes a `failureReason` key, which describes why
 * the creation failed.
 *
 * You must wait until the `status` of the dataset group is
 * `ACTIVE` before adding a dataset to the group.
 *
 * You can specify an Key Management Service (KMS) key to encrypt the datasets in
 * the group. If you specify a KMS key, you must also include an Identity and Access Management
 * (IAM) role that has permission to access the key.
 *
 * **APIs that require a dataset group ARN in the request**
 *
 * - CreateDataset
 *
 * - CreateEventTracker
 *
 * - CreateSolution
 *
 * **Related APIs**
 *
 * - ListDatasetGroups
 *
 * - DescribeDatasetGroup
 *
 * - DeleteDatasetGroup
 */
export const createDatasetGroup: (
  input: CreateDatasetGroupRequest,
) => effect.Effect<
  CreateDatasetGroupResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetGroupRequest,
  output: CreateDatasetGroupResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    TooManyTagsException,
  ],
}));
/**
 * Add a list of tags to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates an empty dataset and adds it to the specified dataset group.
 * Use CreateDatasetImportJob to import your training data to a
 * dataset.
 *
 * There are 5 types of datasets:
 *
 * - Item interactions
 *
 * - Items
 *
 * - Users
 *
 * - Action interactions
 *
 * - Actions
 *
 * Each dataset type has an associated schema with required field types.
 * Only the `Item interactions` dataset is required in order to train a
 * model (also referred to as creating a solution).
 *
 * A dataset can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE
 * FAILED
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the status of the dataset, call DescribeDataset.
 *
 * **Related APIs**
 *
 * - CreateDatasetGroup
 *
 * - ListDatasets
 *
 * - DescribeDataset
 *
 * - DeleteDataset
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a job that imports training data from your data source (an
 * Amazon S3 bucket) to an Amazon Personalize dataset. To allow Amazon Personalize to import the
 * training data, you must specify an IAM service role that has permission to
 * read from the data source, as Amazon Personalize makes a copy of your data and
 * processes it internally. For information on granting access to your Amazon S3
 * bucket, see Giving
 * Amazon Personalize Access to Amazon S3 Resources.
 *
 * If you already created a recommender or deployed a custom solution version with a campaign, how new bulk records
 * influence recommendations depends on the domain use case or recipe that you use. For more information, see How new data influences
 * real-time recommendations.
 *
 * By default, a dataset import job replaces any existing data in the
 * dataset that you imported in bulk. To add new records without replacing
 * existing data, specify INCREMENTAL for the import mode in the
 * CreateDatasetImportJob operation.
 *
 * **Status**
 *
 * A dataset import job can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE
 * FAILED
 *
 * To get the status of the import job, call DescribeDatasetImportJob, providing the Amazon Resource Name
 * (ARN) of the dataset import job. The dataset import is complete when the
 * status shows as ACTIVE. If the status shows as CREATE FAILED, the response
 * includes a `failureReason` key, which describes why the job
 * failed.
 *
 * Importing takes time. You must wait until the status shows as ACTIVE
 * before training a model using the dataset.
 *
 * **Related APIs**
 *
 * - ListDatasetImportJobs
 *
 * - DescribeDatasetImportJob
 */
export const createDatasetImportJob: (
  input: CreateDatasetImportJobRequest,
) => effect.Effect<
  CreateDatasetImportJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetImportJobRequest,
  output: CreateDatasetImportJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates an event tracker that you use when adding event data to a specified dataset
 * group using the
 * PutEvents API.
 *
 * Only one event tracker can be associated with a dataset group. You will get
 * an error if you call `CreateEventTracker` using the same dataset group as an
 * existing event tracker.
 *
 * When you create an event tracker, the response includes a tracking ID, which you pass as a parameter when you use the
 * PutEvents operation.
 * Amazon Personalize then appends the event data to the Item interactions dataset of the dataset group you specify
 * in your event tracker.
 *
 * The event tracker can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the status of the event tracker, call DescribeEventTracker.
 *
 * The event tracker must be in the ACTIVE state before using the tracking ID.
 *
 * **Related APIs**
 *
 * - ListEventTrackers
 *
 * - DescribeEventTracker
 *
 * - DeleteEventTracker
 */
export const createEventTracker: (
  input: CreateEventTrackerRequest,
) => effect.Effect<
  CreateEventTrackerResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventTrackerRequest,
  output: CreateEventTrackerResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a recommendation filter. For more information, see Filtering recommendations and user segments.
 */
export const createFilter: (
  input: CreateFilterRequest,
) => effect.Effect<
  CreateFilterResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFilterRequest,
  output: CreateFilterResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Trains or retrains an active solution in a Custom dataset group. A solution is created using the CreateSolution
 * operation and must be in the ACTIVE state before calling
 * `CreateSolutionVersion`. A new version of the solution is created every time you
 * call this operation.
 *
 * **Status**
 *
 * A solution version can be in one of the following states:
 *
 * - CREATE PENDING
 *
 * - CREATE IN_PROGRESS
 *
 * - ACTIVE
 *
 * - CREATE FAILED
 *
 * - CREATE STOPPING
 *
 * - CREATE STOPPED
 *
 * To get the status of the version, call DescribeSolutionVersion. Wait
 * until the status shows as ACTIVE before calling `CreateCampaign`.
 *
 * If the status shows as CREATE FAILED, the response includes a `failureReason`
 * key, which describes why the job failed.
 *
 * **Related APIs**
 *
 * - ListSolutionVersions
 *
 * - DescribeSolutionVersion
 *
 * - ListSolutions
 *
 * - CreateSolution
 *
 * - DescribeSolution
 *
 * - DeleteSolution
 */
export const createSolutionVersion: (
  input: CreateSolutionVersionRequest,
) => effect.Effect<
  CreateSolutionVersionResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSolutionVersionRequest,
  output: CreateSolutionVersionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a batch segment job. The operation can handle up to 50 million records and the
 * input file must be in JSON format. For more information, see
 * Getting batch recommendations and user segments.
 */
export const createBatchSegmentJob: (
  input: CreateBatchSegmentJobRequest,
) => effect.Effect<
  CreateBatchSegmentJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBatchSegmentJobRequest,
  output: CreateBatchSegmentJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * You incur campaign costs while it is active. To avoid unnecessary costs, make sure to delete the campaign when you are finished. For information about campaign
 * costs, see Amazon Personalize pricing.
 *
 * Creates a campaign that deploys a solution version. When a client calls the
 * GetRecommendations
 * and
 * GetPersonalizedRanking
 * APIs, a campaign is specified in the request.
 *
 * **Minimum Provisioned TPS and Auto-Scaling**
 *
 * A high `minProvisionedTPS` will increase your cost. We recommend starting with 1 for `minProvisionedTPS` (the default). Track
 * your usage using Amazon CloudWatch metrics, and increase the `minProvisionedTPS`
 * as necessary.
 *
 * When you create an Amazon Personalize campaign, you can specify the minimum provisioned transactions per second
 * (`minProvisionedTPS`) for the campaign. This is the baseline transaction throughput for the campaign provisioned by
 * Amazon Personalize. It sets the minimum billing charge for the campaign while it is active. A transaction is a single `GetRecommendations` or
 * `GetPersonalizedRanking` request. The default `minProvisionedTPS` is 1.
 *
 * If your TPS increases beyond the `minProvisionedTPS`, Amazon Personalize auto-scales the provisioned capacity up
 * and down, but never below `minProvisionedTPS`.
 * There's a short time delay while the capacity is increased
 * that might cause loss of transactions. When your traffic reduces, capacity returns to the `minProvisionedTPS`.
 *
 * You are charged for the
 * the minimum provisioned TPS or, if your requests exceed the `minProvisionedTPS`, the actual TPS.
 * The actual TPS is the total number of recommendation requests you make.
 * We recommend starting with a low `minProvisionedTPS`, track
 * your usage using Amazon CloudWatch metrics, and then increase the `minProvisionedTPS` as necessary.
 *
 * For more information about campaign costs, see Amazon Personalize pricing.
 *
 * **Status**
 *
 * A campaign can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the campaign status, call DescribeCampaign.
 *
 * Wait until the `status` of the campaign
 * is `ACTIVE` before asking the campaign for recommendations.
 *
 * **Related APIs**
 *
 * - ListCampaigns
 *
 * - DescribeCampaign
 *
 * - UpdateCampaign
 *
 * - DeleteCampaign
 */
export const createCampaign: (
  input: CreateCampaignRequest,
) => effect.Effect<
  CreateCampaignResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCampaignRequest,
  output: CreateCampaignResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a batch job that deletes all
 * references to specific users from an Amazon Personalize dataset group in batches. You specify the users to delete in a CSV file of userIds in
 * an Amazon S3 bucket. After a job completes, Amazon Personalize no longer trains
 * on the users’ data and no longer considers the users when generating user segments.
 * For more information about creating a data deletion job, see Deleting users.
 *
 * - Your input file must be a CSV file with a single USER_ID column that lists the users IDs. For more information
 * about preparing the CSV file, see Preparing your data deletion file and uploading it to Amazon S3.
 *
 * - To give Amazon Personalize permission to access your input CSV file of userIds, you must specify an IAM service role that has permission to
 * read from the data source. This role
 * needs `GetObject` and `ListBucket` permissions for the bucket and its content.
 * These permissions are the same as importing data. For information on granting access to your Amazon S3
 * bucket, see Giving
 * Amazon Personalize Access to Amazon S3 Resources.
 *
 * After you create a job, it can take up to a day to delete all references to the users from datasets and models. Until the job completes,
 * Amazon Personalize continues to use the data when training. And if you use a User Segmentation recipe, the users might appear in user segments.
 *
 * **Status**
 *
 * A data deletion job can have one of the following statuses:
 *
 * - PENDING > IN_PROGRESS > COMPLETED -or- FAILED
 *
 * To get the status of the data deletion job, call DescribeDataDeletionJob API operation and specify the Amazon Resource Name
 * (ARN) of the job. If the status is FAILED, the response
 * includes a `failureReason` key, which describes why the job
 * failed.
 *
 * **Related APIs**
 *
 * - ListDataDeletionJobs
 *
 * - DescribeDataDeletionJob
 */
export const createDataDeletionJob: (
  input: CreateDataDeletionJobRequest,
) => effect.Effect<
  CreateDataDeletionJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataDeletionJobRequest,
  output: CreateDataDeletionJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a job that exports data from your dataset to an Amazon S3 bucket.
 * To allow Amazon Personalize to export the training data, you must specify an
 * service-linked IAM role that gives Amazon Personalize `PutObject`
 * permissions for your Amazon S3 bucket. For information, see Exporting a dataset in the Amazon Personalize developer guide.
 *
 * **Status**
 *
 * A dataset export job can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE
 * FAILED
 *
 * To get the status of the export job, call DescribeDatasetExportJob, and specify the Amazon Resource Name
 * (ARN) of the dataset export job. The dataset export is complete when the
 * status shows as ACTIVE. If the status shows as CREATE FAILED, the response
 * includes a `failureReason` key, which describes why the job
 * failed.
 */
export const createDatasetExportJob: (
  input: CreateDatasetExportJobRequest,
) => effect.Effect<
  CreateDatasetExportJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetExportJobRequest,
  output: CreateDatasetExportJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Generates batch recommendations based on a list of items or users stored in Amazon S3
 * and exports the recommendations to an Amazon S3 bucket.
 *
 * To generate batch recommendations, specify the ARN of a solution version and an Amazon S3 URI for the input and output data.
 * For user personalization, popular items, and personalized ranking solutions, the batch inference job generates a list of
 * recommended items for each user ID in the input file. For related items solutions, the job generates a list of recommended
 * items for each item ID in the input file.
 *
 * For more information, see Creating a batch inference job
 * .
 *
 * If you use the Similar-Items recipe, Amazon Personalize can add descriptive themes to batch recommendations.
 * To generate themes, set the job's mode to
 * `THEME_GENERATION` and specify the name of the field that contains item names in the
 * input data.
 *
 * For more information about generating themes, see Batch recommendations with themes from Content Generator
 * .
 *
 * You can't get batch recommendations with the Trending-Now or Next-Best-Action recipes.
 */
export const createBatchInferenceJob: (
  input: CreateBatchInferenceJobRequest,
) => effect.Effect<
  CreateBatchInferenceJobResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBatchInferenceJobRequest,
  output: CreateBatchInferenceJobResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Creates a recommender with the recipe (a Domain dataset group use case) you specify.
 * You create recommenders for a Domain dataset group and specify the recommender's Amazon Resource Name (ARN) when you make a
 * GetRecommendations
 * request.
 *
 * **Minimum recommendation requests per second**
 *
 * A high `minRecommendationRequestsPerSecond` will increase your bill. We recommend starting with 1 for `minRecommendationRequestsPerSecond` (the default). Track
 * your usage using Amazon CloudWatch metrics, and increase the `minRecommendationRequestsPerSecond`
 * as necessary.
 *
 * When you create a recommender, you can configure the recommender's minimum recommendation requests per second. The minimum recommendation requests per second
 * (`minRecommendationRequestsPerSecond`) specifies the baseline recommendation request throughput provisioned by
 * Amazon Personalize. The default minRecommendationRequestsPerSecond is `1`. A recommendation request is a single `GetRecommendations` operation.
 * Request throughput is measured in requests per second and Amazon Personalize uses your requests per second to derive
 * your requests per hour and the price of your recommender usage.
 *
 * If your requests per second increases beyond
 * `minRecommendationRequestsPerSecond`, Amazon Personalize auto-scales the provisioned capacity up and down,
 * but never below `minRecommendationRequestsPerSecond`.
 * There's a short time delay while the capacity is increased that might cause loss of
 * requests.
 *
 * Your bill is the greater of either the minimum requests per hour (based on minRecommendationRequestsPerSecond)
 * or the actual number of requests. The actual request throughput used is calculated as the average requests/second within a one-hour window.
 *
 * We recommend starting with the default `minRecommendationRequestsPerSecond`, track
 * your usage using Amazon CloudWatch metrics, and then increase the `minRecommendationRequestsPerSecond`
 * as necessary.
 *
 * **Status**
 *
 * A recommender can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - STOP PENDING > STOP IN_PROGRESS > INACTIVE > START PENDING > START IN_PROGRESS > ACTIVE
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the recommender status, call DescribeRecommender.
 *
 * Wait until the `status` of the recommender
 * is `ACTIVE` before asking the recommender for recommendations.
 *
 * **Related APIs**
 *
 * - ListRecommenders
 *
 * - DescribeRecommender
 *
 * - UpdateRecommender
 *
 * - DeleteRecommender
 */
export const createRecommender: (
  input: CreateRecommenderRequest,
) => effect.Effect<
  CreateRecommenderResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRecommenderRequest,
  output: CreateRecommenderResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Describes the given algorithm.
 */
export const describeAlgorithm: (
  input: DescribeAlgorithmRequest,
) => effect.Effect<
  DescribeAlgorithmResponse,
  InvalidInputException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlgorithmRequest,
  output: DescribeAlgorithmResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Removes the specified tags that are attached to a resource. For more information, see Removing tags from Amazon Personalize resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InvalidInputException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagKeysException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagKeysException,
  ],
}));
/**
 * By default, all new solutions use automatic training. With automatic training, you incur training costs while
 * your solution is active. To avoid unnecessary costs, when you are finished you can
 * update the solution to turn off automatic training.
 * For information about training
 * costs, see Amazon Personalize pricing.
 *
 * Creates the configuration for training a model (creating a solution version). This configuration
 * includes the recipe to use for model training and optional training configuration, such as columns to use
 * in training and feature transformation parameters. For more information about configuring a solution, see Creating and configuring a solution.
 *
 * By default, new solutions use automatic training to create solution versions every 7 days. You can change the training frequency.
 * Automatic solution version creation starts within one hour after the solution is ACTIVE. If you manually create a solution version within
 * the hour, the solution skips the first automatic training. For more information,
 * see Configuring automatic training.
 *
 * To turn off automatic training, set `performAutoTraining` to false. If you turn off automatic training, you must manually create a solution version
 * by calling the CreateSolutionVersion operation.
 *
 * After training starts, you can
 * get the solution version's Amazon Resource Name (ARN) with the ListSolutionVersions API operation.
 * To get its status, use the DescribeSolutionVersion.
 *
 * After training completes you can evaluate model accuracy by calling
 * GetSolutionMetrics. When you are satisfied with the solution version, you
 * deploy it using CreateCampaign. The campaign provides recommendations
 * to a client through the
 * GetRecommendations API.
 *
 * Amazon Personalize doesn't support configuring the `hpoObjective`
 * for solution hyperparameter optimization at this time.
 *
 * **Status**
 *
 * A solution can be in one of the following states:
 *
 * - CREATE PENDING > CREATE IN_PROGRESS > ACTIVE -or- CREATE FAILED
 *
 * - DELETE PENDING > DELETE IN_PROGRESS
 *
 * To get the status of the solution, call DescribeSolution. If you use
 * manual training, the status must be ACTIVE before you call `CreateSolutionVersion`.
 *
 * **Related APIs**
 *
 * - UpdateSolution
 *
 * - ListSolutions
 *
 * - CreateSolutionVersion
 *
 * - DescribeSolution
 *
 * - DeleteSolution
 *
 * - ListSolutionVersions
 *
 * - DescribeSolutionVersion
 */
export const createSolution: (
  input: CreateSolutionRequest,
) => effect.Effect<
  CreateSolutionResponse,
  | InvalidInputException
  | LimitExceededException
  | ResourceAlreadyExistsException
  | ResourceInUseException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSolutionRequest,
  output: CreateSolutionResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
