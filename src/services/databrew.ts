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
  sdkId: "DataBrew",
  serviceShapeName: "AWSGlueDataBrew",
});
const auth = T.AwsAuthSigv4({ name: "databrew" });
const ver = T.ServiceVersion("2017-07-25");
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
              `https://databrew-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (Region === "us-gov-west-1") {
              return e("https://databrew.us-gov-west-1.amazonaws.com");
            }
            return e(
              `https://databrew-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://databrew.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://databrew.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RecipeName = string;
export type RecipeVersion = string;
export type DatasetName = string;
export type EncryptionKeyArn = string;
export type JobName = string;
export type MaxCapacity = number;
export type MaxRetries = number;
export type Arn = string;
export type Timeout = number;
export type ProjectName = string;
export type RecipeDescription = string;
export type RulesetName = string;
export type RulesetDescription = string;
export type CronExpression = string;
export type ScheduleName = string;
export type JobRunId = string;
export type MaxResults100 = number;
export type NextToken = string;
export type Preview = boolean;
export type StepIndex = number;
export type ClientSessionId = string | redacted.Redacted<string>;
export type AssumeControl = boolean;
export type TagKey = string;
export type TagValue = string;
export type Bucket = string;
export type Key = string;
export type BucketOwner = string;
export type JobSize = number;
export type SampleSize = number;
export type ColumnName = string;
export type OverwriteOutput = boolean;
export type MaxOutputFiles = number;
export type CatalogId = string;
export type DatabaseName = string;
export type TableName = string;
export type GlueConnectionName = string;
export type RuleName = string;
export type Disabled = boolean;
export type Expression = string;
export type StartColumnIndex = number;
export type ColumnRange = number;
export type StartRowIndex = number;
export type RowRange = number;
export type CreatedBy = string;
export type LastModifiedBy = string;
export type Attempt = number;
export type JobRunErrorMessage = string;
export type ExecutionTime = number;
export type LogGroupName = string;
export type StartedBy = string;
export type OpenedBy = string;
export type PublishedBy = string;
export type Message = string;
export type MultiLine = boolean;
export type SheetName = string;
export type SheetIndex = number;
export type HeaderRow = boolean;
export type Delimiter = string;
export type DatabaseTableName = string;
export type QueryString = string;
export type MaxFiles = number;
export type PathParameterName = string;
export type Statistic = string;
export type EntityType = string;
export type Operation = string;
export type Condition = string;
export type ConditionValue = string;
export type TargetColumn = string;
export type ValueReference = string;
export type ThresholdValue = number;
export type ErrorCode = string;
export type RecipeErrorMessage = string;
export type AccountId = string;
export type RuleCount = number;
export type CreateColumn = boolean;
export type ParameterName = string;
export type ParameterValue = string;
export type Result = string;
export type ActionId = number;
export type DatetimeFormat = string;
export type TimezoneOffset = string;
export type LocaleCode = string;

//# Schemas
export type RecipeVersionList = string[];
export const RecipeVersionList = S.Array(S.String);
export type InputFormat =
  | "CSV"
  | "JSON"
  | "PARQUET"
  | "EXCEL"
  | "ORC"
  | (string & {});
export const InputFormat = S.String;
export type EncryptionMode = "SSE-KMS" | "SSE-S3" | (string & {});
export const EncryptionMode = S.String;
export type LogSubscription = "ENABLE" | "DISABLE" | (string & {});
export const LogSubscription = S.String;
export type JobNameList = string[];
export const JobNameList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface BatchDeleteRecipeVersionRequest {
  Name: string;
  RecipeVersions: string[];
}
export const BatchDeleteRecipeVersionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    RecipeVersions: RecipeVersionList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/recipes/{Name}/batchDeleteRecipeVersion",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteRecipeVersionRequest",
}) as any as S.Schema<BatchDeleteRecipeVersionRequest>;
export type TagMap = { [key: string]: string | undefined };
export const TagMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateScheduleRequest {
  JobNames?: string[];
  CronExpression: string;
  Tags?: { [key: string]: string | undefined };
  Name: string;
}
export const CreateScheduleRequest = S.suspend(() =>
  S.Struct({
    JobNames: S.optional(JobNameList),
    CronExpression: S.String,
    Tags: S.optional(TagMap),
    Name: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/schedules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateScheduleRequest",
}) as any as S.Schema<CreateScheduleRequest>;
export interface DeleteDatasetRequest {
  Name: string;
}
export const DeleteDatasetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/datasets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDatasetRequest",
}) as any as S.Schema<DeleteDatasetRequest>;
export interface DeleteJobRequest {
  Name: string;
}
export const DeleteJobRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/jobs/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobRequest",
}) as any as S.Schema<DeleteJobRequest>;
export interface DeleteProjectRequest {
  Name: string;
}
export const DeleteProjectRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/projects/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectRequest",
}) as any as S.Schema<DeleteProjectRequest>;
export interface DeleteRecipeVersionRequest {
  Name: string;
  RecipeVersion: string;
}
export const DeleteRecipeVersionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    RecipeVersion: S.String.pipe(T.HttpLabel("RecipeVersion")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/recipes/{Name}/recipeVersion/{RecipeVersion}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecipeVersionRequest",
}) as any as S.Schema<DeleteRecipeVersionRequest>;
export interface DeleteRulesetRequest {
  Name: string;
}
export const DeleteRulesetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/rulesets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRulesetRequest",
}) as any as S.Schema<DeleteRulesetRequest>;
export interface DeleteScheduleRequest {
  Name: string;
}
export const DeleteScheduleRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduleRequest",
}) as any as S.Schema<DeleteScheduleRequest>;
export interface DescribeDatasetRequest {
  Name: string;
}
export const DescribeDatasetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeDatasetRequest",
}) as any as S.Schema<DescribeDatasetRequest>;
export interface DescribeJobRequest {
  Name: string;
}
export const DescribeJobRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobRequest",
}) as any as S.Schema<DescribeJobRequest>;
export interface DescribeJobRunRequest {
  Name: string;
  RunId: string;
}
export const DescribeJobRunRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{Name}/jobRun/{RunId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobRunRequest",
}) as any as S.Schema<DescribeJobRunRequest>;
export interface DescribeProjectRequest {
  Name: string;
}
export const DescribeProjectRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeProjectRequest",
}) as any as S.Schema<DescribeProjectRequest>;
export interface DescribeRecipeRequest {
  Name: string;
  RecipeVersion?: string;
}
export const DescribeRecipeRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    RecipeVersion: S.optional(S.String).pipe(T.HttpQuery("recipeVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRecipeRequest",
}) as any as S.Schema<DescribeRecipeRequest>;
export interface DescribeRulesetRequest {
  Name: string;
}
export const DescribeRulesetRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rulesets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRulesetRequest",
}) as any as S.Schema<DescribeRulesetRequest>;
export interface DescribeScheduleRequest {
  Name: string;
}
export const DescribeScheduleRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScheduleRequest",
}) as any as S.Schema<DescribeScheduleRequest>;
export interface ListDatasetsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListDatasetsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDatasetsRequest",
}) as any as S.Schema<ListDatasetsRequest>;
export interface ListJobRunsRequest {
  Name: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListJobRunsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs/{Name}/jobRuns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobRunsRequest",
}) as any as S.Schema<ListJobRunsRequest>;
export interface ListJobsRequest {
  DatasetName?: string;
  MaxResults?: number;
  NextToken?: string;
  ProjectName?: string;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String).pipe(T.HttpQuery("datasetName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ProjectName: S.optional(S.String).pipe(T.HttpQuery("projectName")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListProjectsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListProjectsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsRequest",
}) as any as S.Schema<ListProjectsRequest>;
export interface ListRecipesRequest {
  MaxResults?: number;
  NextToken?: string;
  RecipeVersion?: string;
}
export const ListRecipesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecipeVersion: S.optional(S.String).pipe(T.HttpQuery("recipeVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recipes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecipesRequest",
}) as any as S.Schema<ListRecipesRequest>;
export interface ListRecipeVersionsRequest {
  MaxResults?: number;
  NextToken?: string;
  Name: string;
}
export const ListRecipeVersionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Name: S.String.pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/recipeVersions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecipeVersionsRequest",
}) as any as S.Schema<ListRecipeVersionsRequest>;
export interface ListRulesetsRequest {
  TargetArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListRulesetsRequest = S.suspend(() =>
  S.Struct({
    TargetArn: S.optional(S.String).pipe(T.HttpQuery("targetArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rulesets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRulesetsRequest",
}) as any as S.Schema<ListRulesetsRequest>;
export interface ListSchedulesRequest {
  JobName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSchedulesRequest = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String).pipe(T.HttpQuery("jobName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/schedules" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchedulesRequest",
}) as any as S.Schema<ListSchedulesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
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
export interface PublishRecipeRequest {
  Description?: string;
  Name: string;
}
export const PublishRecipeRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recipes/{Name}/publishRecipe" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PublishRecipeRequest",
}) as any as S.Schema<PublishRecipeRequest>;
export interface StartJobRunRequest {
  Name: string;
}
export const StartJobRunRequest = S.suspend(() =>
  S.Struct({ Name: S.String.pipe(T.HttpLabel("Name")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs/{Name}/startJobRun" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobRunRequest",
}) as any as S.Schema<StartJobRunRequest>;
export interface StartProjectSessionRequest {
  Name: string;
  AssumeControl?: boolean;
}
export const StartProjectSessionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    AssumeControl: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/projects/{Name}/startProjectSession" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartProjectSessionRequest",
}) as any as S.Schema<StartProjectSessionRequest>;
export interface StopJobRunRequest {
  Name: string;
  RunId: string;
}
export const StopJobRunRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    RunId: S.String.pipe(T.HttpLabel("RunId")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs/{Name}/jobRun/{RunId}/stopJobRun" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopJobRunRequest",
}) as any as S.Schema<StopJobRunRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
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
  ResourceArn: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
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
export interface JsonOptions {
  MultiLine?: boolean;
}
export const JsonOptions = S.suspend(() =>
  S.Struct({ MultiLine: S.optional(S.Boolean) }),
).annotations({ identifier: "JsonOptions" }) as any as S.Schema<JsonOptions>;
export type SheetNameList = string[];
export const SheetNameList = S.Array(S.String);
export type SheetIndexList = number[];
export const SheetIndexList = S.Array(S.Number);
export interface ExcelOptions {
  SheetNames?: string[];
  SheetIndexes?: number[];
  HeaderRow?: boolean;
}
export const ExcelOptions = S.suspend(() =>
  S.Struct({
    SheetNames: S.optional(SheetNameList),
    SheetIndexes: S.optional(SheetIndexList),
    HeaderRow: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ExcelOptions" }) as any as S.Schema<ExcelOptions>;
export interface CsvOptions {
  Delimiter?: string;
  HeaderRow?: boolean;
}
export const CsvOptions = S.suspend(() =>
  S.Struct({
    Delimiter: S.optional(S.String),
    HeaderRow: S.optional(S.Boolean),
  }),
).annotations({ identifier: "CsvOptions" }) as any as S.Schema<CsvOptions>;
export interface FormatOptions {
  Json?: JsonOptions;
  Excel?: ExcelOptions;
  Csv?: CsvOptions;
}
export const FormatOptions = S.suspend(() =>
  S.Struct({
    Json: S.optional(JsonOptions),
    Excel: S.optional(ExcelOptions),
    Csv: S.optional(CsvOptions),
  }),
).annotations({
  identifier: "FormatOptions",
}) as any as S.Schema<FormatOptions>;
export interface S3Location {
  Bucket: string;
  Key?: string;
  BucketOwner?: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({
    Bucket: S.String,
    Key: S.optional(S.String),
    BucketOwner: S.optional(S.String),
  }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface DataCatalogInputDefinition {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  TempDirectory?: S3Location;
}
export const DataCatalogInputDefinition = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    TempDirectory: S.optional(S3Location),
  }),
).annotations({
  identifier: "DataCatalogInputDefinition",
}) as any as S.Schema<DataCatalogInputDefinition>;
export interface DatabaseInputDefinition {
  GlueConnectionName: string;
  DatabaseTableName?: string;
  TempDirectory?: S3Location;
  QueryString?: string;
}
export const DatabaseInputDefinition = S.suspend(() =>
  S.Struct({
    GlueConnectionName: S.String,
    DatabaseTableName: S.optional(S.String),
    TempDirectory: S.optional(S3Location),
    QueryString: S.optional(S.String),
  }),
).annotations({
  identifier: "DatabaseInputDefinition",
}) as any as S.Schema<DatabaseInputDefinition>;
export interface Metadata {
  SourceArn?: string;
}
export const Metadata = S.suspend(() =>
  S.Struct({ SourceArn: S.optional(S.String) }),
).annotations({ identifier: "Metadata" }) as any as S.Schema<Metadata>;
export interface Input {
  S3InputDefinition?: S3Location;
  DataCatalogInputDefinition?: DataCatalogInputDefinition;
  DatabaseInputDefinition?: DatabaseInputDefinition;
  Metadata?: Metadata;
}
export const Input = S.suspend(() =>
  S.Struct({
    S3InputDefinition: S.optional(S3Location),
    DataCatalogInputDefinition: S.optional(DataCatalogInputDefinition),
    DatabaseInputDefinition: S.optional(DatabaseInputDefinition),
    Metadata: S.optional(Metadata),
  }),
).annotations({ identifier: "Input" }) as any as S.Schema<Input>;
export type ValuesMap = { [key: string]: string | undefined };
export const ValuesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface FilterExpression {
  Expression: string;
  ValuesMap: { [key: string]: string | undefined };
}
export const FilterExpression = S.suspend(() =>
  S.Struct({ Expression: S.String, ValuesMap: ValuesMap }),
).annotations({
  identifier: "FilterExpression",
}) as any as S.Schema<FilterExpression>;
export type OrderedBy = "LAST_MODIFIED_DATE" | (string & {});
export const OrderedBy = S.String;
export type Order = "DESCENDING" | "ASCENDING" | (string & {});
export const Order = S.String;
export interface FilesLimit {
  MaxFiles: number;
  OrderedBy?: OrderedBy;
  Order?: Order;
}
export const FilesLimit = S.suspend(() =>
  S.Struct({
    MaxFiles: S.Number,
    OrderedBy: S.optional(OrderedBy),
    Order: S.optional(Order),
  }),
).annotations({ identifier: "FilesLimit" }) as any as S.Schema<FilesLimit>;
export type ParameterType = "Datetime" | "Number" | "String" | (string & {});
export const ParameterType = S.String;
export interface DatetimeOptions {
  Format: string;
  TimezoneOffset?: string;
  LocaleCode?: string;
}
export const DatetimeOptions = S.suspend(() =>
  S.Struct({
    Format: S.String,
    TimezoneOffset: S.optional(S.String),
    LocaleCode: S.optional(S.String),
  }),
).annotations({
  identifier: "DatetimeOptions",
}) as any as S.Schema<DatetimeOptions>;
export interface DatasetParameter {
  Name: string;
  Type: ParameterType;
  DatetimeOptions?: DatetimeOptions;
  CreateColumn?: boolean;
  Filter?: FilterExpression;
}
export const DatasetParameter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: ParameterType,
    DatetimeOptions: S.optional(DatetimeOptions),
    CreateColumn: S.optional(S.Boolean),
    Filter: S.optional(FilterExpression),
  }),
).annotations({
  identifier: "DatasetParameter",
}) as any as S.Schema<DatasetParameter>;
export type PathParametersMap = { [key: string]: DatasetParameter | undefined };
export const PathParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(DatasetParameter),
});
export interface PathOptions {
  LastModifiedDateCondition?: FilterExpression;
  FilesLimit?: FilesLimit;
  Parameters?: { [key: string]: DatasetParameter | undefined };
}
export const PathOptions = S.suspend(() =>
  S.Struct({
    LastModifiedDateCondition: S.optional(FilterExpression),
    FilesLimit: S.optional(FilesLimit),
    Parameters: S.optional(PathParametersMap),
  }),
).annotations({ identifier: "PathOptions" }) as any as S.Schema<PathOptions>;
export interface UpdateDatasetRequest {
  Name: string;
  Format?: InputFormat;
  FormatOptions?: FormatOptions;
  Input: Input;
  PathOptions?: PathOptions;
}
export const UpdateDatasetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Format: S.optional(InputFormat),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    PathOptions: S.optional(PathOptions),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/datasets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDatasetRequest",
}) as any as S.Schema<UpdateDatasetRequest>;
export type StatisticList = string[];
export const StatisticList = S.Array(S.String);
export type ParameterMap = { [key: string]: string | undefined };
export const ParameterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface StatisticOverride {
  Statistic: string;
  Parameters: { [key: string]: string | undefined };
}
export const StatisticOverride = S.suspend(() =>
  S.Struct({ Statistic: S.String, Parameters: ParameterMap }),
).annotations({
  identifier: "StatisticOverride",
}) as any as S.Schema<StatisticOverride>;
export type StatisticOverrideList = StatisticOverride[];
export const StatisticOverrideList = S.Array(StatisticOverride);
export interface StatisticsConfiguration {
  IncludedStatistics?: string[];
  Overrides?: StatisticOverride[];
}
export const StatisticsConfiguration = S.suspend(() =>
  S.Struct({
    IncludedStatistics: S.optional(StatisticList),
    Overrides: S.optional(StatisticOverrideList),
  }),
).annotations({
  identifier: "StatisticsConfiguration",
}) as any as S.Schema<StatisticsConfiguration>;
export interface ColumnSelector {
  Regex?: string;
  Name?: string;
}
export const ColumnSelector = S.suspend(() =>
  S.Struct({ Regex: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "ColumnSelector",
}) as any as S.Schema<ColumnSelector>;
export type ColumnSelectorList = ColumnSelector[];
export const ColumnSelectorList = S.Array(ColumnSelector);
export interface ColumnStatisticsConfiguration {
  Selectors?: ColumnSelector[];
  Statistics: StatisticsConfiguration;
}
export const ColumnStatisticsConfiguration = S.suspend(() =>
  S.Struct({
    Selectors: S.optional(ColumnSelectorList),
    Statistics: StatisticsConfiguration,
  }),
).annotations({
  identifier: "ColumnStatisticsConfiguration",
}) as any as S.Schema<ColumnStatisticsConfiguration>;
export type ColumnStatisticsConfigurationList = ColumnStatisticsConfiguration[];
export const ColumnStatisticsConfigurationList = S.Array(
  ColumnStatisticsConfiguration,
);
export type EntityTypeList = string[];
export const EntityTypeList = S.Array(S.String);
export interface AllowedStatistics {
  Statistics: string[];
}
export const AllowedStatistics = S.suspend(() =>
  S.Struct({ Statistics: StatisticList }),
).annotations({
  identifier: "AllowedStatistics",
}) as any as S.Schema<AllowedStatistics>;
export type AllowedStatisticList = AllowedStatistics[];
export const AllowedStatisticList = S.Array(AllowedStatistics);
export interface EntityDetectorConfiguration {
  EntityTypes: string[];
  AllowedStatistics?: AllowedStatistics[];
}
export const EntityDetectorConfiguration = S.suspend(() =>
  S.Struct({
    EntityTypes: EntityTypeList,
    AllowedStatistics: S.optional(AllowedStatisticList),
  }),
).annotations({
  identifier: "EntityDetectorConfiguration",
}) as any as S.Schema<EntityDetectorConfiguration>;
export interface ProfileConfiguration {
  DatasetStatisticsConfiguration?: StatisticsConfiguration;
  ProfileColumns?: ColumnSelector[];
  ColumnStatisticsConfigurations?: ColumnStatisticsConfiguration[];
  EntityDetectorConfiguration?: EntityDetectorConfiguration;
}
export const ProfileConfiguration = S.suspend(() =>
  S.Struct({
    DatasetStatisticsConfiguration: S.optional(StatisticsConfiguration),
    ProfileColumns: S.optional(ColumnSelectorList),
    ColumnStatisticsConfigurations: S.optional(
      ColumnStatisticsConfigurationList,
    ),
    EntityDetectorConfiguration: S.optional(EntityDetectorConfiguration),
  }),
).annotations({
  identifier: "ProfileConfiguration",
}) as any as S.Schema<ProfileConfiguration>;
export type ValidationMode = "CHECK_ALL" | (string & {});
export const ValidationMode = S.String;
export interface ValidationConfiguration {
  RulesetArn: string;
  ValidationMode?: ValidationMode;
}
export const ValidationConfiguration = S.suspend(() =>
  S.Struct({
    RulesetArn: S.String,
    ValidationMode: S.optional(ValidationMode),
  }),
).annotations({
  identifier: "ValidationConfiguration",
}) as any as S.Schema<ValidationConfiguration>;
export type ValidationConfigurationList = ValidationConfiguration[];
export const ValidationConfigurationList = S.Array(ValidationConfiguration);
export type SampleMode = "FULL_DATASET" | "CUSTOM_ROWS" | (string & {});
export const SampleMode = S.String;
export interface JobSample {
  Mode?: SampleMode;
  Size?: number;
}
export const JobSample = S.suspend(() =>
  S.Struct({ Mode: S.optional(SampleMode), Size: S.optional(S.Number) }),
).annotations({ identifier: "JobSample" }) as any as S.Schema<JobSample>;
export interface UpdateProfileJobRequest {
  Configuration?: ProfileConfiguration;
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  OutputLocation: S3Location;
  ValidationConfigurations?: ValidationConfiguration[];
  RoleArn: string;
  Timeout?: number;
  JobSample?: JobSample;
}
export const UpdateProfileJobRequest = S.suspend(() =>
  S.Struct({
    Configuration: S.optional(ProfileConfiguration),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String.pipe(T.HttpLabel("Name")),
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    OutputLocation: S3Location,
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RoleArn: S.String,
    Timeout: S.optional(S.Number),
    JobSample: S.optional(JobSample),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/profileJobs/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProfileJobRequest",
}) as any as S.Schema<UpdateProfileJobRequest>;
export type SampleType = "FIRST_N" | "LAST_N" | "RANDOM" | (string & {});
export const SampleType = S.String;
export interface Sample {
  Size?: number;
  Type: SampleType;
}
export const Sample = S.suspend(() =>
  S.Struct({ Size: S.optional(S.Number), Type: SampleType }),
).annotations({ identifier: "Sample" }) as any as S.Schema<Sample>;
export interface UpdateProjectRequest {
  Sample?: Sample;
  RoleArn: string;
  Name: string;
}
export const UpdateProjectRequest = S.suspend(() =>
  S.Struct({
    Sample: S.optional(Sample),
    RoleArn: S.String,
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/projects/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectRequest",
}) as any as S.Schema<UpdateProjectRequest>;
export interface RecipeAction {
  Operation: string;
  Parameters?: { [key: string]: string | undefined };
}
export const RecipeAction = S.suspend(() =>
  S.Struct({ Operation: S.String, Parameters: S.optional(ParameterMap) }),
).annotations({ identifier: "RecipeAction" }) as any as S.Schema<RecipeAction>;
export interface ConditionExpression {
  Condition: string;
  Value?: string;
  TargetColumn: string;
}
export const ConditionExpression = S.suspend(() =>
  S.Struct({
    Condition: S.String,
    Value: S.optional(S.String),
    TargetColumn: S.String,
  }),
).annotations({
  identifier: "ConditionExpression",
}) as any as S.Schema<ConditionExpression>;
export type ConditionExpressionList = ConditionExpression[];
export const ConditionExpressionList = S.Array(ConditionExpression);
export interface RecipeStep {
  Action: RecipeAction;
  ConditionExpressions?: ConditionExpression[];
}
export const RecipeStep = S.suspend(() =>
  S.Struct({
    Action: RecipeAction,
    ConditionExpressions: S.optional(ConditionExpressionList),
  }),
).annotations({ identifier: "RecipeStep" }) as any as S.Schema<RecipeStep>;
export type RecipeStepList = RecipeStep[];
export const RecipeStepList = S.Array(RecipeStep);
export interface UpdateRecipeRequest {
  Description?: string;
  Name: string;
  Steps?: RecipeStep[];
}
export const UpdateRecipeRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Name: S.String.pipe(T.HttpLabel("Name")),
    Steps: S.optional(RecipeStepList),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/recipes/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRecipeRequest",
}) as any as S.Schema<UpdateRecipeRequest>;
export type CompressionFormat =
  | "GZIP"
  | "LZ4"
  | "SNAPPY"
  | "BZIP2"
  | "DEFLATE"
  | "LZO"
  | "BROTLI"
  | "ZSTD"
  | "ZLIB"
  | (string & {});
export const CompressionFormat = S.String;
export type OutputFormat =
  | "CSV"
  | "JSON"
  | "PARQUET"
  | "GLUEPARQUET"
  | "AVRO"
  | "ORC"
  | "XML"
  | "TABLEAUHYPER"
  | (string & {});
export const OutputFormat = S.String;
export type ColumnNameList = string[];
export const ColumnNameList = S.Array(S.String);
export interface CsvOutputOptions {
  Delimiter?: string;
}
export const CsvOutputOptions = S.suspend(() =>
  S.Struct({ Delimiter: S.optional(S.String) }),
).annotations({
  identifier: "CsvOutputOptions",
}) as any as S.Schema<CsvOutputOptions>;
export interface OutputFormatOptions {
  Csv?: CsvOutputOptions;
}
export const OutputFormatOptions = S.suspend(() =>
  S.Struct({ Csv: S.optional(CsvOutputOptions) }),
).annotations({
  identifier: "OutputFormatOptions",
}) as any as S.Schema<OutputFormatOptions>;
export interface Output {
  CompressionFormat?: CompressionFormat;
  Format?: OutputFormat;
  PartitionColumns?: string[];
  Location: S3Location;
  Overwrite?: boolean;
  FormatOptions?: OutputFormatOptions;
  MaxOutputFiles?: number;
}
export const Output = S.suspend(() =>
  S.Struct({
    CompressionFormat: S.optional(CompressionFormat),
    Format: S.optional(OutputFormat),
    PartitionColumns: S.optional(ColumnNameList),
    Location: S3Location,
    Overwrite: S.optional(S.Boolean),
    FormatOptions: S.optional(OutputFormatOptions),
    MaxOutputFiles: S.optional(S.Number),
  }),
).annotations({ identifier: "Output" }) as any as S.Schema<Output>;
export type OutputList = Output[];
export const OutputList = S.Array(Output);
export interface S3TableOutputOptions {
  Location: S3Location;
}
export const S3TableOutputOptions = S.suspend(() =>
  S.Struct({ Location: S3Location }),
).annotations({
  identifier: "S3TableOutputOptions",
}) as any as S.Schema<S3TableOutputOptions>;
export interface DatabaseTableOutputOptions {
  TempDirectory?: S3Location;
  TableName: string;
}
export const DatabaseTableOutputOptions = S.suspend(() =>
  S.Struct({ TempDirectory: S.optional(S3Location), TableName: S.String }),
).annotations({
  identifier: "DatabaseTableOutputOptions",
}) as any as S.Schema<DatabaseTableOutputOptions>;
export interface DataCatalogOutput {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  S3Options?: S3TableOutputOptions;
  DatabaseOptions?: DatabaseTableOutputOptions;
  Overwrite?: boolean;
}
export const DataCatalogOutput = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    S3Options: S.optional(S3TableOutputOptions),
    DatabaseOptions: S.optional(DatabaseTableOutputOptions),
    Overwrite: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DataCatalogOutput",
}) as any as S.Schema<DataCatalogOutput>;
export type DataCatalogOutputList = DataCatalogOutput[];
export const DataCatalogOutputList = S.Array(DataCatalogOutput);
export type DatabaseOutputMode = "NEW_TABLE" | (string & {});
export const DatabaseOutputMode = S.String;
export interface DatabaseOutput {
  GlueConnectionName: string;
  DatabaseOptions: DatabaseTableOutputOptions;
  DatabaseOutputMode?: DatabaseOutputMode;
}
export const DatabaseOutput = S.suspend(() =>
  S.Struct({
    GlueConnectionName: S.String,
    DatabaseOptions: DatabaseTableOutputOptions,
    DatabaseOutputMode: S.optional(DatabaseOutputMode),
  }),
).annotations({
  identifier: "DatabaseOutput",
}) as any as S.Schema<DatabaseOutput>;
export type DatabaseOutputList = DatabaseOutput[];
export const DatabaseOutputList = S.Array(DatabaseOutput);
export interface UpdateRecipeJobRequest {
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  RoleArn: string;
  Timeout?: number;
}
export const UpdateRecipeJobRequest = S.suspend(() =>
  S.Struct({
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String.pipe(T.HttpLabel("Name")),
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    RoleArn: S.String,
    Timeout: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/recipeJobs/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRecipeJobRequest",
}) as any as S.Schema<UpdateRecipeJobRequest>;
export type ThresholdType =
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "GREATER_THAN"
  | "LESS_THAN"
  | (string & {});
export const ThresholdType = S.String;
export type ThresholdUnit = "COUNT" | "PERCENTAGE" | (string & {});
export const ThresholdUnit = S.String;
export interface Threshold {
  Value: number;
  Type?: ThresholdType;
  Unit?: ThresholdUnit;
}
export const Threshold = S.suspend(() =>
  S.Struct({
    Value: S.Number,
    Type: S.optional(ThresholdType),
    Unit: S.optional(ThresholdUnit),
  }),
).annotations({ identifier: "Threshold" }) as any as S.Schema<Threshold>;
export interface Rule {
  Name: string;
  Disabled?: boolean;
  CheckExpression: string;
  SubstitutionMap?: { [key: string]: string | undefined };
  Threshold?: Threshold;
  ColumnSelectors?: ColumnSelector[];
}
export const Rule = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Disabled: S.optional(S.Boolean),
    CheckExpression: S.String,
    SubstitutionMap: S.optional(ValuesMap),
    Threshold: S.optional(Threshold),
    ColumnSelectors: S.optional(ColumnSelectorList),
  }),
).annotations({ identifier: "Rule" }) as any as S.Schema<Rule>;
export type RuleList = Rule[];
export const RuleList = S.Array(Rule);
export interface UpdateRulesetRequest {
  Name: string;
  Description?: string;
  Rules: Rule[];
}
export const UpdateRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String.pipe(T.HttpLabel("Name")),
    Description: S.optional(S.String),
    Rules: RuleList,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/rulesets/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRulesetRequest",
}) as any as S.Schema<UpdateRulesetRequest>;
export interface UpdateScheduleRequest {
  JobNames?: string[];
  CronExpression: string;
  Name: string;
}
export const UpdateScheduleRequest = S.suspend(() =>
  S.Struct({
    JobNames: S.optional(JobNameList),
    CronExpression: S.String,
    Name: S.String.pipe(T.HttpLabel("Name")),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/schedules/{Name}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateScheduleRequest",
}) as any as S.Schema<UpdateScheduleRequest>;
export type HiddenColumnList = string[];
export const HiddenColumnList = S.Array(S.String);
export type AnalyticsMode = "ENABLE" | "DISABLE" | (string & {});
export const AnalyticsMode = S.String;
export interface RecipeReference {
  Name: string;
  RecipeVersion?: string;
}
export const RecipeReference = S.suspend(() =>
  S.Struct({ Name: S.String, RecipeVersion: S.optional(S.String) }),
).annotations({
  identifier: "RecipeReference",
}) as any as S.Schema<RecipeReference>;
export type Source = "S3" | "DATA-CATALOG" | "DATABASE" | (string & {});
export const Source = S.String;
export type JobType = "PROFILE" | "RECIPE" | (string & {});
export const JobType = S.String;
export type JobRunState =
  | "STARTING"
  | "RUNNING"
  | "STOPPING"
  | "STOPPED"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMEOUT"
  | (string & {});
export const JobRunState = S.String;
export type SessionStatus =
  | "ASSIGNED"
  | "FAILED"
  | "INITIALIZING"
  | "PROVISIONING"
  | "READY"
  | "RECYCLING"
  | "ROTATING"
  | "TERMINATED"
  | "TERMINATING"
  | "UPDATING"
  | (string & {});
export const SessionStatus = S.String;
export interface ViewFrame {
  StartColumnIndex: number;
  ColumnRange?: number;
  HiddenColumns?: string[];
  StartRowIndex?: number;
  RowRange?: number;
  Analytics?: AnalyticsMode;
}
export const ViewFrame = S.suspend(() =>
  S.Struct({
    StartColumnIndex: S.Number,
    ColumnRange: S.optional(S.Number),
    HiddenColumns: S.optional(HiddenColumnList),
    StartRowIndex: S.optional(S.Number),
    RowRange: S.optional(S.Number),
    Analytics: S.optional(AnalyticsMode),
  }),
).annotations({ identifier: "ViewFrame" }) as any as S.Schema<ViewFrame>;
export interface CreateProjectRequest {
  DatasetName: string;
  Name: string;
  RecipeName: string;
  Sample?: Sample;
  RoleArn: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateProjectRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    Name: S.String,
    RecipeName: S.String,
    Sample: S.optional(Sample),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectRequest",
}) as any as S.Schema<CreateProjectRequest>;
export interface CreateScheduleResponse {
  Name: string;
}
export const CreateScheduleResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateScheduleResponse",
}) as any as S.Schema<CreateScheduleResponse>;
export interface DeleteDatasetResponse {
  Name: string;
}
export const DeleteDatasetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteDatasetResponse",
}) as any as S.Schema<DeleteDatasetResponse>;
export interface DeleteJobResponse {
  Name: string;
}
export const DeleteJobResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteJobResponse",
}) as any as S.Schema<DeleteJobResponse>;
export interface DeleteProjectResponse {
  Name: string;
}
export const DeleteProjectResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteProjectResponse",
}) as any as S.Schema<DeleteProjectResponse>;
export interface DeleteRecipeVersionResponse {
  Name: string;
  RecipeVersion: string;
}
export const DeleteRecipeVersionResponse = S.suspend(() =>
  S.Struct({ Name: S.String, RecipeVersion: S.String }),
).annotations({
  identifier: "DeleteRecipeVersionResponse",
}) as any as S.Schema<DeleteRecipeVersionResponse>;
export interface DeleteRulesetResponse {
  Name: string;
}
export const DeleteRulesetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteRulesetResponse",
}) as any as S.Schema<DeleteRulesetResponse>;
export interface DeleteScheduleResponse {
  Name: string;
}
export const DeleteScheduleResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "DeleteScheduleResponse",
}) as any as S.Schema<DeleteScheduleResponse>;
export interface DescribeDatasetResponse {
  CreatedBy?: string;
  CreateDate?: Date;
  Name: string;
  Format?: InputFormat;
  FormatOptions?: FormatOptions;
  Input: Input;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  Source?: Source;
  PathOptions?: PathOptions;
  Tags?: { [key: string]: string | undefined };
  ResourceArn?: string;
}
export const DescribeDatasetResponse = S.suspend(() =>
  S.Struct({
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.String,
    Format: S.optional(InputFormat),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    Source: S.optional(Source),
    PathOptions: S.optional(PathOptions),
    Tags: S.optional(TagMap),
    ResourceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDatasetResponse",
}) as any as S.Schema<DescribeDatasetResponse>;
export interface DescribeJobResponse {
  CreateDate?: Date;
  CreatedBy?: string;
  DatasetName?: string;
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  Type?: JobType;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  ProjectName?: string;
  ProfileConfiguration?: ProfileConfiguration;
  ValidationConfigurations?: ValidationConfiguration[];
  RecipeReference?: RecipeReference;
  ResourceArn?: string;
  RoleArn?: string;
  Tags?: { [key: string]: string | undefined };
  Timeout?: number;
  JobSample?: JobSample;
}
export const DescribeJobResponse = S.suspend(() =>
  S.Struct({
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(S.String),
    DatasetName: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String,
    Type: S.optional(JobType),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    ProjectName: S.optional(S.String),
    ProfileConfiguration: S.optional(ProfileConfiguration),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RecipeReference: S.optional(RecipeReference),
    ResourceArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagMap),
    Timeout: S.optional(S.Number),
    JobSample: S.optional(JobSample),
  }),
).annotations({
  identifier: "DescribeJobResponse",
}) as any as S.Schema<DescribeJobResponse>;
export interface DescribeJobRunResponse {
  Attempt?: number;
  CompletedOn?: Date;
  DatasetName?: string;
  ErrorMessage?: string;
  ExecutionTime?: number;
  JobName: string;
  ProfileConfiguration?: ProfileConfiguration;
  ValidationConfigurations?: ValidationConfiguration[];
  RunId?: string;
  State?: JobRunState;
  LogSubscription?: LogSubscription;
  LogGroupName?: string;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  RecipeReference?: RecipeReference;
  StartedBy?: string;
  StartedOn?: Date;
  JobSample?: JobSample;
}
export const DescribeJobRunResponse = S.suspend(() =>
  S.Struct({
    Attempt: S.optional(S.Number),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DatasetName: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    ExecutionTime: S.optional(S.Number),
    JobName: S.String,
    ProfileConfiguration: S.optional(ProfileConfiguration),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RunId: S.optional(S.String),
    State: S.optional(JobRunState),
    LogSubscription: S.optional(LogSubscription),
    LogGroupName: S.optional(S.String),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    RecipeReference: S.optional(RecipeReference),
    StartedBy: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobSample: S.optional(JobSample),
  }),
).annotations({
  identifier: "DescribeJobRunResponse",
}) as any as S.Schema<DescribeJobRunResponse>;
export interface DescribeProjectResponse {
  CreateDate?: Date;
  CreatedBy?: string;
  DatasetName?: string;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  Name: string;
  RecipeName?: string;
  ResourceArn?: string;
  Sample?: Sample;
  RoleArn?: string;
  Tags?: { [key: string]: string | undefined };
  SessionStatus?: SessionStatus;
  OpenedBy?: string;
  OpenDate?: Date;
}
export const DescribeProjectResponse = S.suspend(() =>
  S.Struct({
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(S.String),
    DatasetName: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    Name: S.String,
    RecipeName: S.optional(S.String),
    ResourceArn: S.optional(S.String),
    Sample: S.optional(Sample),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagMap),
    SessionStatus: S.optional(SessionStatus),
    OpenedBy: S.optional(S.String),
    OpenDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeProjectResponse",
}) as any as S.Schema<DescribeProjectResponse>;
export interface DescribeRecipeResponse {
  CreatedBy?: string;
  CreateDate?: Date;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  ProjectName?: string;
  PublishedBy?: string;
  PublishedDate?: Date;
  Description?: string;
  Name: string;
  Steps?: RecipeStep[];
  Tags?: { [key: string]: string | undefined };
  ResourceArn?: string;
  RecipeVersion?: string;
}
export const DescribeRecipeResponse = S.suspend(() =>
  S.Struct({
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProjectName: S.optional(S.String),
    PublishedBy: S.optional(S.String),
    PublishedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Name: S.String,
    Steps: S.optional(RecipeStepList),
    Tags: S.optional(TagMap),
    ResourceArn: S.optional(S.String),
    RecipeVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRecipeResponse",
}) as any as S.Schema<DescribeRecipeResponse>;
export interface DescribeRulesetResponse {
  Name: string;
  Description?: string;
  TargetArn?: string;
  Rules?: Rule[];
  CreateDate?: Date;
  CreatedBy?: string;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  ResourceArn?: string;
  Tags?: { [key: string]: string | undefined };
}
export const DescribeRulesetResponse = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    TargetArn: S.optional(S.String),
    Rules: S.optional(RuleList),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(S.String),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceArn: S.optional(S.String),
    Tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribeRulesetResponse",
}) as any as S.Schema<DescribeRulesetResponse>;
export interface DescribeScheduleResponse {
  CreateDate?: Date;
  CreatedBy?: string;
  JobNames?: string[];
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  ResourceArn?: string;
  CronExpression?: string;
  Tags?: { [key: string]: string | undefined };
  Name: string;
}
export const DescribeScheduleResponse = S.suspend(() =>
  S.Struct({
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(S.String),
    JobNames: S.optional(JobNameList),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceArn: S.optional(S.String),
    CronExpression: S.optional(S.String),
    Tags: S.optional(TagMap),
    Name: S.String,
  }),
).annotations({
  identifier: "DescribeScheduleResponse",
}) as any as S.Schema<DescribeScheduleResponse>;
export interface Recipe {
  CreatedBy?: string;
  CreateDate?: Date;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  ProjectName?: string;
  PublishedBy?: string;
  PublishedDate?: Date;
  Description?: string;
  Name: string;
  ResourceArn?: string;
  Steps?: RecipeStep[];
  Tags?: { [key: string]: string | undefined };
  RecipeVersion?: string;
}
export const Recipe = S.suspend(() =>
  S.Struct({
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProjectName: S.optional(S.String),
    PublishedBy: S.optional(S.String),
    PublishedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Name: S.String,
    ResourceArn: S.optional(S.String),
    Steps: S.optional(RecipeStepList),
    Tags: S.optional(TagMap),
    RecipeVersion: S.optional(S.String),
  }),
).annotations({ identifier: "Recipe" }) as any as S.Schema<Recipe>;
export type RecipeList = Recipe[];
export const RecipeList = S.Array(Recipe);
export interface ListRecipeVersionsResponse {
  NextToken?: string;
  Recipes: Recipe[];
}
export const ListRecipeVersionsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Recipes: RecipeList }),
).annotations({
  identifier: "ListRecipeVersionsResponse",
}) as any as S.Schema<ListRecipeVersionsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PublishRecipeResponse {
  Name: string;
}
export const PublishRecipeResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "PublishRecipeResponse",
}) as any as S.Schema<PublishRecipeResponse>;
export interface SendProjectSessionActionRequest {
  Preview?: boolean;
  Name: string;
  RecipeStep?: RecipeStep;
  StepIndex?: number;
  ClientSessionId?: string | redacted.Redacted<string>;
  ViewFrame?: ViewFrame;
}
export const SendProjectSessionActionRequest = S.suspend(() =>
  S.Struct({
    Preview: S.optional(S.Boolean),
    Name: S.String.pipe(T.HttpLabel("Name")),
    RecipeStep: S.optional(RecipeStep),
    StepIndex: S.optional(S.Number),
    ClientSessionId: S.optional(SensitiveString),
    ViewFrame: S.optional(ViewFrame),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/projects/{Name}/sendProjectSessionAction",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SendProjectSessionActionRequest",
}) as any as S.Schema<SendProjectSessionActionRequest>;
export interface StartJobRunResponse {
  RunId: string;
}
export const StartJobRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.String }),
).annotations({
  identifier: "StartJobRunResponse",
}) as any as S.Schema<StartJobRunResponse>;
export interface StartProjectSessionResponse {
  Name: string;
  ClientSessionId?: string | redacted.Redacted<string>;
}
export const StartProjectSessionResponse = S.suspend(() =>
  S.Struct({ Name: S.String, ClientSessionId: S.optional(SensitiveString) }),
).annotations({
  identifier: "StartProjectSessionResponse",
}) as any as S.Schema<StartProjectSessionResponse>;
export interface StopJobRunResponse {
  RunId: string;
}
export const StopJobRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.String }),
).annotations({
  identifier: "StopJobRunResponse",
}) as any as S.Schema<StopJobRunResponse>;
export interface UpdateDatasetResponse {
  Name: string;
}
export const UpdateDatasetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateDatasetResponse",
}) as any as S.Schema<UpdateDatasetResponse>;
export interface UpdateProfileJobResponse {
  Name: string;
}
export const UpdateProfileJobResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateProfileJobResponse",
}) as any as S.Schema<UpdateProfileJobResponse>;
export interface UpdateProjectResponse {
  LastModifiedDate?: Date;
  Name: string;
}
export const UpdateProjectResponse = S.suspend(() =>
  S.Struct({
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Name: S.String,
  }),
).annotations({
  identifier: "UpdateProjectResponse",
}) as any as S.Schema<UpdateProjectResponse>;
export interface UpdateRecipeResponse {
  Name: string;
}
export const UpdateRecipeResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateRecipeResponse",
}) as any as S.Schema<UpdateRecipeResponse>;
export interface UpdateRecipeJobResponse {
  Name: string;
}
export const UpdateRecipeJobResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateRecipeJobResponse",
}) as any as S.Schema<UpdateRecipeJobResponse>;
export interface UpdateRulesetResponse {
  Name: string;
}
export const UpdateRulesetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateRulesetResponse",
}) as any as S.Schema<UpdateRulesetResponse>;
export interface UpdateScheduleResponse {
  Name: string;
}
export const UpdateScheduleResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "UpdateScheduleResponse",
}) as any as S.Schema<UpdateScheduleResponse>;
export interface RecipeVersionErrorDetail {
  ErrorCode?: string;
  ErrorMessage?: string;
  RecipeVersion?: string;
}
export const RecipeVersionErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    RecipeVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "RecipeVersionErrorDetail",
}) as any as S.Schema<RecipeVersionErrorDetail>;
export type RecipeErrorList = RecipeVersionErrorDetail[];
export const RecipeErrorList = S.Array(RecipeVersionErrorDetail);
export interface Dataset {
  AccountId?: string;
  CreatedBy?: string;
  CreateDate?: Date;
  Name: string;
  Format?: InputFormat;
  FormatOptions?: FormatOptions;
  Input: Input;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  Source?: Source;
  PathOptions?: PathOptions;
  Tags?: { [key: string]: string | undefined };
  ResourceArn?: string;
}
export const Dataset = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.String,
    Format: S.optional(InputFormat),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    Source: S.optional(Source),
    PathOptions: S.optional(PathOptions),
    Tags: S.optional(TagMap),
    ResourceArn: S.optional(S.String),
  }),
).annotations({ identifier: "Dataset" }) as any as S.Schema<Dataset>;
export type DatasetList = Dataset[];
export const DatasetList = S.Array(Dataset);
export interface JobRun {
  Attempt?: number;
  CompletedOn?: Date;
  DatasetName?: string;
  ErrorMessage?: string;
  ExecutionTime?: number;
  JobName?: string;
  RunId?: string;
  State?: JobRunState;
  LogSubscription?: LogSubscription;
  LogGroupName?: string;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  RecipeReference?: RecipeReference;
  StartedBy?: string;
  StartedOn?: Date;
  JobSample?: JobSample;
  ValidationConfigurations?: ValidationConfiguration[];
}
export const JobRun = S.suspend(() =>
  S.Struct({
    Attempt: S.optional(S.Number),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DatasetName: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    ExecutionTime: S.optional(S.Number),
    JobName: S.optional(S.String),
    RunId: S.optional(S.String),
    State: S.optional(JobRunState),
    LogSubscription: S.optional(LogSubscription),
    LogGroupName: S.optional(S.String),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    RecipeReference: S.optional(RecipeReference),
    StartedBy: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobSample: S.optional(JobSample),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
  }),
).annotations({ identifier: "JobRun" }) as any as S.Schema<JobRun>;
export type JobRunList = JobRun[];
export const JobRunList = S.Array(JobRun);
export interface Job {
  AccountId?: string;
  CreatedBy?: string;
  CreateDate?: Date;
  DatasetName?: string;
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  Type?: JobType;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  ProjectName?: string;
  RecipeReference?: RecipeReference;
  ResourceArn?: string;
  RoleArn?: string;
  Timeout?: number;
  Tags?: { [key: string]: string | undefined };
  JobSample?: JobSample;
  ValidationConfigurations?: ValidationConfiguration[];
}
export const Job = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DatasetName: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String,
    Type: S.optional(JobType),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    ProjectName: S.optional(S.String),
    RecipeReference: S.optional(RecipeReference),
    ResourceArn: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Timeout: S.optional(S.Number),
    Tags: S.optional(TagMap),
    JobSample: S.optional(JobSample),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export type JobList = Job[];
export const JobList = S.Array(Job);
export interface Project {
  AccountId?: string;
  CreateDate?: Date;
  CreatedBy?: string;
  DatasetName?: string;
  LastModifiedDate?: Date;
  LastModifiedBy?: string;
  Name: string;
  RecipeName: string;
  ResourceArn?: string;
  Sample?: Sample;
  Tags?: { [key: string]: string | undefined };
  RoleArn?: string;
  OpenedBy?: string;
  OpenDate?: Date;
}
export const Project = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(S.String),
    DatasetName: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(S.String),
    Name: S.String,
    RecipeName: S.String,
    ResourceArn: S.optional(S.String),
    Sample: S.optional(Sample),
    Tags: S.optional(TagMap),
    RoleArn: S.optional(S.String),
    OpenedBy: S.optional(S.String),
    OpenDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export type ProjectList = Project[];
export const ProjectList = S.Array(Project);
export interface RulesetItem {
  AccountId?: string;
  CreatedBy?: string;
  CreateDate?: Date;
  Description?: string;
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  Name: string;
  ResourceArn?: string;
  RuleCount?: number;
  Tags?: { [key: string]: string | undefined };
  TargetArn: string;
}
export const RulesetItem = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Name: S.String,
    ResourceArn: S.optional(S.String),
    RuleCount: S.optional(S.Number),
    Tags: S.optional(TagMap),
    TargetArn: S.String,
  }),
).annotations({ identifier: "RulesetItem" }) as any as S.Schema<RulesetItem>;
export type RulesetItemList = RulesetItem[];
export const RulesetItemList = S.Array(RulesetItem);
export interface Schedule {
  AccountId?: string;
  CreatedBy?: string;
  CreateDate?: Date;
  JobNames?: string[];
  LastModifiedBy?: string;
  LastModifiedDate?: Date;
  ResourceArn?: string;
  CronExpression?: string;
  Tags?: { [key: string]: string | undefined };
  Name: string;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobNames: S.optional(JobNameList),
    LastModifiedBy: S.optional(S.String),
    LastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResourceArn: S.optional(S.String),
    CronExpression: S.optional(S.String),
    Tags: S.optional(TagMap),
    Name: S.String,
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export type ScheduleList = Schedule[];
export const ScheduleList = S.Array(Schedule);
export interface BatchDeleteRecipeVersionResponse {
  Name: string;
  Errors?: RecipeVersionErrorDetail[];
}
export const BatchDeleteRecipeVersionResponse = S.suspend(() =>
  S.Struct({ Name: S.String, Errors: S.optional(RecipeErrorList) }),
).annotations({
  identifier: "BatchDeleteRecipeVersionResponse",
}) as any as S.Schema<BatchDeleteRecipeVersionResponse>;
export interface CreateProjectResponse {
  Name: string;
}
export const CreateProjectResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateProjectResponse",
}) as any as S.Schema<CreateProjectResponse>;
export interface CreateRulesetRequest {
  Name: string;
  Description?: string;
  TargetArn: string;
  Rules: Rule[];
  Tags?: { [key: string]: string | undefined };
}
export const CreateRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    TargetArn: S.String,
    Rules: RuleList,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rulesets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRulesetRequest",
}) as any as S.Schema<CreateRulesetRequest>;
export interface ListDatasetsResponse {
  Datasets: Dataset[];
  NextToken?: string;
}
export const ListDatasetsResponse = S.suspend(() =>
  S.Struct({ Datasets: DatasetList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDatasetsResponse",
}) as any as S.Schema<ListDatasetsResponse>;
export interface ListJobRunsResponse {
  JobRuns: JobRun[];
  NextToken?: string;
}
export const ListJobRunsResponse = S.suspend(() =>
  S.Struct({ JobRuns: JobRunList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobRunsResponse",
}) as any as S.Schema<ListJobRunsResponse>;
export interface ListJobsResponse {
  Jobs: Job[];
  NextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({ Jobs: JobList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface ListProjectsResponse {
  Projects: Project[];
  NextToken?: string;
}
export const ListProjectsResponse = S.suspend(() =>
  S.Struct({ Projects: ProjectList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListProjectsResponse",
}) as any as S.Schema<ListProjectsResponse>;
export interface ListRecipesResponse {
  Recipes: Recipe[];
  NextToken?: string;
}
export const ListRecipesResponse = S.suspend(() =>
  S.Struct({ Recipes: RecipeList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRecipesResponse",
}) as any as S.Schema<ListRecipesResponse>;
export interface ListRulesetsResponse {
  Rulesets: RulesetItem[];
  NextToken?: string;
}
export const ListRulesetsResponse = S.suspend(() =>
  S.Struct({ Rulesets: RulesetItemList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListRulesetsResponse",
}) as any as S.Schema<ListRulesetsResponse>;
export interface ListSchedulesResponse {
  Schedules: Schedule[];
  NextToken?: string;
}
export const ListSchedulesResponse = S.suspend(() =>
  S.Struct({ Schedules: ScheduleList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListSchedulesResponse",
}) as any as S.Schema<ListSchedulesResponse>;
export interface SendProjectSessionActionResponse {
  Result?: string;
  Name: string;
  ActionId?: number;
}
export const SendProjectSessionActionResponse = S.suspend(() =>
  S.Struct({
    Result: S.optional(S.String),
    Name: S.String,
    ActionId: S.optional(S.Number),
  }),
).annotations({
  identifier: "SendProjectSessionActionResponse",
}) as any as S.Schema<SendProjectSessionActionResponse>;
export interface CreateProfileJobRequest {
  DatasetName: string;
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  OutputLocation: S3Location;
  Configuration?: ProfileConfiguration;
  ValidationConfigurations?: ValidationConfiguration[];
  RoleArn: string;
  Tags?: { [key: string]: string | undefined };
  Timeout?: number;
  JobSample?: JobSample;
}
export const CreateProfileJobRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.String,
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String,
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    OutputLocation: S3Location,
    Configuration: S.optional(ProfileConfiguration),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
    Timeout: S.optional(S.Number),
    JobSample: S.optional(JobSample),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/profileJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProfileJobRequest",
}) as any as S.Schema<CreateProfileJobRequest>;
export interface CreateRecipeRequest {
  Description?: string;
  Name: string;
  Steps: RecipeStep[];
  Tags?: { [key: string]: string | undefined };
}
export const CreateRecipeRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Name: S.String,
    Steps: RecipeStepList,
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recipes" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecipeRequest",
}) as any as S.Schema<CreateRecipeRequest>;
export interface CreateRecipeJobRequest {
  DatasetName?: string;
  EncryptionKeyArn?: string;
  EncryptionMode?: EncryptionMode;
  Name: string;
  LogSubscription?: LogSubscription;
  MaxCapacity?: number;
  MaxRetries?: number;
  Outputs?: Output[];
  DataCatalogOutputs?: DataCatalogOutput[];
  DatabaseOutputs?: DatabaseOutput[];
  ProjectName?: string;
  RecipeReference?: RecipeReference;
  RoleArn: string;
  Tags?: { [key: string]: string | undefined };
  Timeout?: number;
}
export const CreateRecipeJobRequest = S.suspend(() =>
  S.Struct({
    DatasetName: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(EncryptionMode),
    Name: S.String,
    LogSubscription: S.optional(LogSubscription),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    ProjectName: S.optional(S.String),
    RecipeReference: S.optional(RecipeReference),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
    Timeout: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recipeJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRecipeJobRequest",
}) as any as S.Schema<CreateRecipeJobRequest>;
export interface CreateRulesetResponse {
  Name: string;
}
export const CreateRulesetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateRulesetResponse",
}) as any as S.Schema<CreateRulesetResponse>;
export interface CreateDatasetRequest {
  Name: string;
  Format?: InputFormat;
  FormatOptions?: FormatOptions;
  Input: Input;
  PathOptions?: PathOptions;
  Tags?: { [key: string]: string | undefined };
}
export const CreateDatasetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Format: S.optional(InputFormat),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    PathOptions: S.optional(PathOptions),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDatasetRequest",
}) as any as S.Schema<CreateDatasetRequest>;
export interface CreateProfileJobResponse {
  Name: string;
}
export const CreateProfileJobResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateProfileJobResponse",
}) as any as S.Schema<CreateProfileJobResponse>;
export interface CreateRecipeResponse {
  Name: string;
}
export const CreateRecipeResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateRecipeResponse",
}) as any as S.Schema<CreateRecipeResponse>;
export interface CreateRecipeJobResponse {
  Name: string;
}
export const CreateRecipeJobResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateRecipeJobResponse",
}) as any as S.Schema<CreateRecipeJobResponse>;
export interface CreateDatasetResponse {
  Name: string;
}
export const CreateDatasetResponse = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "CreateDatasetResponse",
}) as any as S.Schema<CreateDatasetResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Lists the versions of a particular DataBrew recipe, except for
 * `LATEST_WORKING`.
 */
export const listRecipeVersions: {
  (
    input: ListRecipeVersionsRequest,
  ): effect.Effect<
    ListRecipeVersionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecipeVersionsRequest,
  ) => stream.Stream<
    ListRecipeVersionsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecipeVersionsRequest,
  ) => stream.Stream<
    Recipe,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecipeVersionsRequest,
  output: ListRecipeVersionsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Recipes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all rulesets available in the current account or rulesets associated
 * with a specific resource (dataset).
 */
export const listRulesets: {
  (
    input: ListRulesetsRequest,
  ): effect.Effect<
    ListRulesetsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRulesetsRequest,
  ) => stream.Stream<
    ListRulesetsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRulesetsRequest,
  ) => stream.Stream<
    RulesetItem,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRulesetsRequest,
  output: ListRulesetsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Rulesets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the DataBrew schedules that are defined.
 */
export const listSchedules: {
  (
    input: ListSchedulesRequest,
  ): effect.Effect<
    ListSchedulesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchedulesRequest,
  ) => stream.Stream<
    ListSchedulesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchedulesRequest,
  ) => stream.Stream<
    Schedule,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchedulesRequest,
  output: ListSchedulesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schedules",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Performs a recipe step within an interactive DataBrew session that's currently
 * open.
 */
export const sendProjectSessionAction: (
  input: SendProjectSessionActionRequest,
) => effect.Effect<
  SendProjectSessionActionResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SendProjectSessionActionRequest,
  output: SendProjectSessionActionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Modifies the definition of an existing DataBrew dataset.
 */
export const updateDataset: (
  input: UpdateDatasetRequest,
) => effect.Effect<
  UpdateDatasetResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes a dataset from DataBrew.
 */
export const deleteDataset: (
  input: DeleteDatasetRequest,
) => effect.Effect<
  DeleteDatasetResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes the specified DataBrew job.
 */
export const deleteJob: (
  input: DeleteJobRequest,
) => effect.Effect<
  DeleteJobResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an existing DataBrew project.
 */
export const deleteProject: (
  input: DeleteProjectRequest,
) => effect.Effect<
  DeleteProjectResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a single version of a DataBrew recipe.
 */
export const deleteRecipeVersion: (
  input: DeleteRecipeVersionRequest,
) => effect.Effect<
  DeleteRecipeVersionResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecipeVersionRequest,
  output: DeleteRecipeVersionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a ruleset.
 */
export const deleteRuleset: (
  input: DeleteRulesetRequest,
) => effect.Effect<
  DeleteRulesetResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRulesetRequest,
  output: DeleteRulesetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes one or more versions of a recipe at a time.
 *
 * The entire request will be rejected if:
 *
 * - The recipe does not exist.
 *
 * - There is an invalid version identifier in the list of versions.
 *
 * - The version list is empty.
 *
 * - The version list size exceeds 50.
 *
 * - The version list contains duplicate entries.
 *
 * The request will complete successfully, but with partial failures, if:
 *
 * - A version does not exist.
 *
 * - A version is being used by a job.
 *
 * - You specify `LATEST_WORKING`, but it's being used by a
 * project.
 *
 * - The version fails to be deleted.
 *
 * The `LATEST_WORKING` version will only be deleted if the recipe has no
 * other versions. If you try to delete `LATEST_WORKING` while other versions
 * exist (or if they can't be deleted), then `LATEST_WORKING` will be listed as
 * partial failure in the response.
 */
export const batchDeleteRecipeVersion: (
  input: BatchDeleteRecipeVersionRequest,
) => effect.Effect<
  BatchDeleteRecipeVersionResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteRecipeVersionRequest,
  output: BatchDeleteRecipeVersionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew dataset.
 */
export const describeDataset: (
  input: DescribeDatasetRequest,
) => effect.Effect<
  DescribeDatasetResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew job.
 */
export const describeJob: (
  input: DescribeJobRequest,
) => effect.Effect<
  DescribeJobResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Represents one run of a DataBrew job.
 */
export const describeJobRun: (
  input: DescribeJobRunRequest,
) => effect.Effect<
  DescribeJobRunResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRunRequest,
  output: DescribeJobRunResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew project.
 */
export const describeProject: (
  input: DescribeProjectRequest,
) => effect.Effect<
  DescribeProjectResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProjectRequest,
  output: DescribeProjectResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew recipe corresponding to a particular
 * version.
 */
export const describeRecipe: (
  input: DescribeRecipeRequest,
) => effect.Effect<
  DescribeRecipeResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecipeRequest,
  output: DescribeRecipeResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves detailed information about the ruleset.
 */
export const describeRuleset: (
  input: DescribeRulesetRequest,
) => effect.Effect<
  DescribeRulesetResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRulesetRequest,
  output: DescribeRulesetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew schedule.
 */
export const describeSchedule: (
  input: DescribeScheduleRequest,
) => effect.Effect<
  DescribeScheduleResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScheduleRequest,
  output: DescribeScheduleResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Stops a particular run of a job.
 */
export const stopJobRun: (
  input: StopJobRunRequest,
) => effect.Effect<
  StopJobRunResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopJobRunRequest,
  output: StopJobRunResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds metadata tags to a DataBrew resource, such as a dataset, project, recipe, job, or
 * schedule.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
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
 * Modifies the definition of an existing DataBrew project.
 */
export const updateProject: (
  input: UpdateProjectRequest,
) => effect.Effect<
  UpdateProjectResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Modifies the definition of the `LATEST_WORKING` version of a DataBrew
 * recipe.
 */
export const updateRecipe: (
  input: UpdateRecipeRequest,
) => effect.Effect<
  UpdateRecipeResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecipeRequest,
  output: UpdateRecipeResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Updates specified ruleset.
 */
export const updateRuleset: (
  input: UpdateRulesetRequest,
) => effect.Effect<
  UpdateRulesetResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRulesetRequest,
  output: UpdateRulesetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes metadata tags from a DataBrew resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
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
 * Lists all the tags for a DataBrew resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
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
 * Deletes the specified DataBrew schedule.
 */
export const deleteSchedule: (
  input: DeleteScheduleRequest,
) => effect.Effect<
  DeleteScheduleResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleRequest,
  output: DeleteScheduleResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all of the DataBrew datasets.
 */
export const listDatasets: {
  (
    input: ListDatasetsRequest,
  ): effect.Effect<
    ListDatasetsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    ListDatasetsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatasetsRequest,
  ) => stream.Stream<
    Dataset,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Datasets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the previous runs of a particular DataBrew job.
 */
export const listJobRuns: {
  (
    input: ListJobRunsRequest,
  ): effect.Effect<
    ListJobRunsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobRunsRequest,
  ) => stream.Stream<
    ListJobRunsResponse,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobRunsRequest,
  ) => stream.Stream<
    JobRun,
    ResourceNotFoundException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobRunsRequest,
  output: ListJobRunsResponse,
  errors: [ResourceNotFoundException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobRuns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the DataBrew jobs that are defined.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    Job,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Jobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the DataBrew projects that are defined.
 */
export const listProjects: {
  (
    input: ListProjectsRequest,
  ): effect.Effect<
    ListProjectsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsRequest,
  ) => stream.Stream<
    ListProjectsResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsRequest,
  ) => stream.Stream<
    Project,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Projects",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all of the DataBrew recipes that are defined.
 */
export const listRecipes: {
  (
    input: ListRecipesRequest,
  ): effect.Effect<
    ListRecipesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecipesRequest,
  ) => stream.Stream<
    ListRecipesResponse,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecipesRequest,
  ) => stream.Stream<
    Recipe,
    ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRecipesRequest,
  output: ListRecipesResponse,
  errors: [ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Recipes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Modifies the definition of an existing profile job.
 */
export const updateProfileJob: (
  input: UpdateProfileJobRequest,
) => effect.Effect<
  UpdateProfileJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileJobRequest,
  output: UpdateProfileJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Modifies the definition of an existing DataBrew recipe job.
 */
export const updateRecipeJob: (
  input: UpdateRecipeJobRequest,
) => effect.Effect<
  UpdateRecipeJobResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecipeJobRequest,
  output: UpdateRecipeJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new schedule for one or more DataBrew jobs. Jobs can be run at a specific
 * date and time, or at regular intervals.
 */
export const createSchedule: (
  input: CreateScheduleRequest,
) => effect.Effect<
  CreateScheduleResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduleRequest,
  output: CreateScheduleResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Runs a DataBrew job.
 */
export const startJobRun: (
  input: StartJobRunRequest,
) => effect.Effect<
  StartJobRunResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRunRequest,
  output: StartJobRunResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an interactive session, enabling you to manipulate data in a DataBrew
 * project.
 */
export const startProjectSession: (
  input: StartProjectSessionRequest,
) => effect.Effect<
  StartProjectSessionResponse,
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartProjectSessionRequest,
  output: StartProjectSessionResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new DataBrew project.
 */
export const createProject: (
  input: CreateProjectRequest,
) => effect.Effect<
  CreateProjectResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Publishes a new version of a DataBrew recipe.
 */
export const publishRecipe: (
  input: PublishRecipeRequest,
) => effect.Effect<
  PublishRecipeResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishRecipeRequest,
  output: PublishRecipeResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Modifies the definition of an existing DataBrew schedule.
 */
export const updateSchedule: (
  input: UpdateScheduleRequest,
) => effect.Effect<
  UpdateScheduleResponse,
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduleRequest,
  output: UpdateScheduleResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new ruleset that can be used in a profile job to validate
 * the data quality of a dataset.
 */
export const createRuleset: (
  input: CreateRulesetRequest,
) => effect.Effect<
  CreateRulesetResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRulesetRequest,
  output: CreateRulesetResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new job to analyze a dataset and create its data profile.
 */
export const createProfileJob: (
  input: CreateProfileJobRequest,
) => effect.Effect<
  CreateProfileJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileJobRequest,
  output: CreateProfileJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new DataBrew recipe.
 */
export const createRecipe: (
  input: CreateRecipeRequest,
) => effect.Effect<
  CreateRecipeResponse,
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRecipeRequest,
  output: CreateRecipeResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new job to transform input data, using steps defined in an existing Glue DataBrew recipe
 */
export const createRecipeJob: (
  input: CreateRecipeJobRequest,
) => effect.Effect<
  CreateRecipeJobResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRecipeJobRequest,
  output: CreateRecipeJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new DataBrew dataset.
 */
export const createDataset: (
  input: CreateDatasetRequest,
) => effect.Effect<
  CreateDatasetResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
