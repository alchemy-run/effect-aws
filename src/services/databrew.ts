import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "DataBrew",
  serviceShapeName: "AWSGlueDataBrew",
});
const auth = T.AwsAuthSigv4({ name: "databrew" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://databrew-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://databrew.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://databrew-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://databrew.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://databrew.{Region}.{PartitionResult#dnsSuffix}",
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
export const RecipeVersionList = S.Array(S.String);
export const JobNameList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchDeleteRecipeVersionRequest extends S.Class<BatchDeleteRecipeVersionRequest>(
  "BatchDeleteRecipeVersionRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()), RecipeVersions: RecipeVersionList },
  T.all(
    T.Http({ method: "POST", uri: "/recipes/{Name}/batchDeleteRecipeVersion" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateScheduleRequest extends S.Class<CreateScheduleRequest>(
  "CreateScheduleRequest",
)(
  {
    JobNames: S.optional(JobNameList),
    CronExpression: S.String,
    Tags: S.optional(TagMap),
    Name: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/schedules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/datasets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/jobs/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteProjectRequest extends S.Class<DeleteProjectRequest>(
  "DeleteProjectRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/projects/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteRecipeVersionRequest extends S.Class<DeleteRecipeVersionRequest>(
  "DeleteRecipeVersionRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    RecipeVersion: S.String.pipe(T.HttpLabel()),
  },
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
) {}
export class DeleteRulesetRequest extends S.Class<DeleteRulesetRequest>(
  "DeleteRulesetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/rulesets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleRequest extends S.Class<DeleteScheduleRequest>(
  "DeleteScheduleRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/datasets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobRequest extends S.Class<DescribeJobRequest>(
  "DescribeJobRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobRunRequest extends S.Class<DescribeJobRunRequest>(
  "DescribeJobRunRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()), RunId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{Name}/jobRun/{RunId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeProjectRequest extends S.Class<DescribeProjectRequest>(
  "DescribeProjectRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/projects/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRecipeRequest extends S.Class<DescribeRecipeRequest>(
  "DescribeRecipeRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    RecipeVersion: S.optional(S.String).pipe(T.HttpQuery("recipeVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeRulesetRequest extends S.Class<DescribeRulesetRequest>(
  "DescribeRulesetRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/rulesets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScheduleRequest extends S.Class<DescribeScheduleRequest>(
  "DescribeScheduleRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/datasets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobRunsRequest extends S.Class<ListJobRunsRequest>(
  "ListJobRunsRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/jobs/{Name}/jobRuns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    DatasetName: S.optional(S.String).pipe(T.HttpQuery("datasetName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    ProjectName: S.optional(S.String).pipe(T.HttpQuery("projectName")),
  },
  T.all(T.Http({ method: "GET", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class ListProjectsRequest extends S.Class<ListProjectsRequest>(
  "ListProjectsRequest",
)(
  {
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecipesRequest extends S.Class<ListRecipesRequest>(
  "ListRecipesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    RecipeVersion: S.optional(S.String).pipe(T.HttpQuery("recipeVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecipeVersionsRequest extends S.Class<ListRecipeVersionsRequest>(
  "ListRecipeVersionsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Name: S.String.pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recipeVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRulesetsRequest extends S.Class<ListRulesetsRequest>(
  "ListRulesetsRequest",
)(
  {
    TargetArn: S.optional(S.String).pipe(T.HttpQuery("targetArn")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/rulesets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchedulesRequest extends S.Class<ListSchedulesRequest>(
  "ListSchedulesRequest",
)(
  {
    JobName: S.optional(S.String).pipe(T.HttpQuery("jobName")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/schedules" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PublishRecipeRequest extends S.Class<PublishRecipeRequest>(
  "PublishRecipeRequest",
)(
  { Description: S.optional(S.String), Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/recipes/{Name}/publishRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartJobRunRequest extends S.Class<StartJobRunRequest>(
  "StartJobRunRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/jobs/{Name}/startJobRun" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartProjectSessionRequest extends S.Class<StartProjectSessionRequest>(
  "StartProjectSessionRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()), AssumeControl: S.optional(S.Boolean) },
  T.all(
    T.Http({ method: "PUT", uri: "/projects/{Name}/startProjectSession" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopJobRunRequest extends S.Class<StopJobRunRequest>(
  "StopJobRunRequest",
)(
  { Name: S.String.pipe(T.HttpLabel()), RunId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "POST", uri: "/jobs/{Name}/jobRun/{RunId}/stopJobRun" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel()), Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel()),
    TagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class JsonOptions extends S.Class<JsonOptions>("JsonOptions")({
  MultiLine: S.optional(S.Boolean),
}) {}
export const SheetNameList = S.Array(S.String);
export const SheetIndexList = S.Array(S.Number);
export class ExcelOptions extends S.Class<ExcelOptions>("ExcelOptions")({
  SheetNames: S.optional(SheetNameList),
  SheetIndexes: S.optional(SheetIndexList),
  HeaderRow: S.optional(S.Boolean),
}) {}
export class CsvOptions extends S.Class<CsvOptions>("CsvOptions")({
  Delimiter: S.optional(S.String),
  HeaderRow: S.optional(S.Boolean),
}) {}
export class FormatOptions extends S.Class<FormatOptions>("FormatOptions")({
  Json: S.optional(JsonOptions),
  Excel: S.optional(ExcelOptions),
  Csv: S.optional(CsvOptions),
}) {}
export class S3Location extends S.Class<S3Location>("S3Location")({
  Bucket: S.String,
  Key: S.optional(S.String),
  BucketOwner: S.optional(S.String),
}) {}
export class DataCatalogInputDefinition extends S.Class<DataCatalogInputDefinition>(
  "DataCatalogInputDefinition",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.String,
  TableName: S.String,
  TempDirectory: S.optional(S3Location),
}) {}
export class DatabaseInputDefinition extends S.Class<DatabaseInputDefinition>(
  "DatabaseInputDefinition",
)({
  GlueConnectionName: S.String,
  DatabaseTableName: S.optional(S.String),
  TempDirectory: S.optional(S3Location),
  QueryString: S.optional(S.String),
}) {}
export class Metadata extends S.Class<Metadata>("Metadata")({
  SourceArn: S.optional(S.String),
}) {}
export class Input extends S.Class<Input>("Input")({
  S3InputDefinition: S.optional(S3Location),
  DataCatalogInputDefinition: S.optional(DataCatalogInputDefinition),
  DatabaseInputDefinition: S.optional(DatabaseInputDefinition),
  Metadata: S.optional(Metadata),
}) {}
export const ValuesMap = S.Record({ key: S.String, value: S.String });
export class FilterExpression extends S.Class<FilterExpression>(
  "FilterExpression",
)({ Expression: S.String, ValuesMap: ValuesMap }) {}
export class FilesLimit extends S.Class<FilesLimit>("FilesLimit")({
  MaxFiles: S.Number,
  OrderedBy: S.optional(S.String),
  Order: S.optional(S.String),
}) {}
export class DatetimeOptions extends S.Class<DatetimeOptions>(
  "DatetimeOptions",
)({
  Format: S.String,
  TimezoneOffset: S.optional(S.String),
  LocaleCode: S.optional(S.String),
}) {}
export class DatasetParameter extends S.Class<DatasetParameter>(
  "DatasetParameter",
)({
  Name: S.String,
  Type: S.String,
  DatetimeOptions: S.optional(DatetimeOptions),
  CreateColumn: S.optional(S.Boolean),
  Filter: S.optional(FilterExpression),
}) {}
export const PathParametersMap = S.Record({
  key: S.String,
  value: DatasetParameter,
});
export class PathOptions extends S.Class<PathOptions>("PathOptions")({
  LastModifiedDateCondition: S.optional(FilterExpression),
  FilesLimit: S.optional(FilesLimit),
  Parameters: S.optional(PathParametersMap),
}) {}
export class UpdateDatasetRequest extends S.Class<UpdateDatasetRequest>(
  "UpdateDatasetRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    Format: S.optional(S.String),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    PathOptions: S.optional(PathOptions),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/datasets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StatisticList = S.Array(S.String);
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export class StatisticOverride extends S.Class<StatisticOverride>(
  "StatisticOverride",
)({ Statistic: S.String, Parameters: ParameterMap }) {}
export const StatisticOverrideList = S.Array(StatisticOverride);
export class StatisticsConfiguration extends S.Class<StatisticsConfiguration>(
  "StatisticsConfiguration",
)({
  IncludedStatistics: S.optional(StatisticList),
  Overrides: S.optional(StatisticOverrideList),
}) {}
export class ColumnSelector extends S.Class<ColumnSelector>("ColumnSelector")({
  Regex: S.optional(S.String),
  Name: S.optional(S.String),
}) {}
export const ColumnSelectorList = S.Array(ColumnSelector);
export class ColumnStatisticsConfiguration extends S.Class<ColumnStatisticsConfiguration>(
  "ColumnStatisticsConfiguration",
)({
  Selectors: S.optional(ColumnSelectorList),
  Statistics: StatisticsConfiguration,
}) {}
export const ColumnStatisticsConfigurationList = S.Array(
  ColumnStatisticsConfiguration,
);
export const EntityTypeList = S.Array(S.String);
export class AllowedStatistics extends S.Class<AllowedStatistics>(
  "AllowedStatistics",
)({ Statistics: StatisticList }) {}
export const AllowedStatisticList = S.Array(AllowedStatistics);
export class EntityDetectorConfiguration extends S.Class<EntityDetectorConfiguration>(
  "EntityDetectorConfiguration",
)({
  EntityTypes: EntityTypeList,
  AllowedStatistics: S.optional(AllowedStatisticList),
}) {}
export class ProfileConfiguration extends S.Class<ProfileConfiguration>(
  "ProfileConfiguration",
)({
  DatasetStatisticsConfiguration: S.optional(StatisticsConfiguration),
  ProfileColumns: S.optional(ColumnSelectorList),
  ColumnStatisticsConfigurations: S.optional(ColumnStatisticsConfigurationList),
  EntityDetectorConfiguration: S.optional(EntityDetectorConfiguration),
}) {}
export class ValidationConfiguration extends S.Class<ValidationConfiguration>(
  "ValidationConfiguration",
)({ RulesetArn: S.String, ValidationMode: S.optional(S.String) }) {}
export const ValidationConfigurationList = S.Array(ValidationConfiguration);
export class JobSample extends S.Class<JobSample>("JobSample")({
  Mode: S.optional(S.String),
  Size: S.optional(S.Number),
}) {}
export class UpdateProfileJobRequest extends S.Class<UpdateProfileJobRequest>(
  "UpdateProfileJobRequest",
)(
  {
    Configuration: S.optional(ProfileConfiguration),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(S.String),
    Name: S.String.pipe(T.HttpLabel()),
    LogSubscription: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    OutputLocation: S3Location,
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RoleArn: S.String,
    Timeout: S.optional(S.Number),
    JobSample: S.optional(JobSample),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/profileJobs/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Sample extends S.Class<Sample>("Sample")({
  Size: S.optional(S.Number),
  Type: S.String,
}) {}
export class UpdateProjectRequest extends S.Class<UpdateProjectRequest>(
  "UpdateProjectRequest",
)(
  {
    Sample: S.optional(Sample),
    RoleArn: S.String,
    Name: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/projects/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RecipeAction extends S.Class<RecipeAction>("RecipeAction")({
  Operation: S.String,
  Parameters: S.optional(ParameterMap),
}) {}
export class ConditionExpression extends S.Class<ConditionExpression>(
  "ConditionExpression",
)({
  Condition: S.String,
  Value: S.optional(S.String),
  TargetColumn: S.String,
}) {}
export const ConditionExpressionList = S.Array(ConditionExpression);
export class RecipeStep extends S.Class<RecipeStep>("RecipeStep")({
  Action: RecipeAction,
  ConditionExpressions: S.optional(ConditionExpressionList),
}) {}
export const RecipeStepList = S.Array(RecipeStep);
export class UpdateRecipeRequest extends S.Class<UpdateRecipeRequest>(
  "UpdateRecipeRequest",
)(
  {
    Description: S.optional(S.String),
    Name: S.String.pipe(T.HttpLabel()),
    Steps: S.optional(RecipeStepList),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/recipes/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ColumnNameList = S.Array(S.String);
export class CsvOutputOptions extends S.Class<CsvOutputOptions>(
  "CsvOutputOptions",
)({ Delimiter: S.optional(S.String) }) {}
export class OutputFormatOptions extends S.Class<OutputFormatOptions>(
  "OutputFormatOptions",
)({ Csv: S.optional(CsvOutputOptions) }) {}
export class Output extends S.Class<Output>("Output")({
  CompressionFormat: S.optional(S.String),
  Format: S.optional(S.String),
  PartitionColumns: S.optional(ColumnNameList),
  Location: S3Location,
  Overwrite: S.optional(S.Boolean),
  FormatOptions: S.optional(OutputFormatOptions),
  MaxOutputFiles: S.optional(S.Number),
}) {}
export const OutputList = S.Array(Output);
export class S3TableOutputOptions extends S.Class<S3TableOutputOptions>(
  "S3TableOutputOptions",
)({ Location: S3Location }) {}
export class DatabaseTableOutputOptions extends S.Class<DatabaseTableOutputOptions>(
  "DatabaseTableOutputOptions",
)({ TempDirectory: S.optional(S3Location), TableName: S.String }) {}
export class DataCatalogOutput extends S.Class<DataCatalogOutput>(
  "DataCatalogOutput",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.String,
  TableName: S.String,
  S3Options: S.optional(S3TableOutputOptions),
  DatabaseOptions: S.optional(DatabaseTableOutputOptions),
  Overwrite: S.optional(S.Boolean),
}) {}
export const DataCatalogOutputList = S.Array(DataCatalogOutput);
export class DatabaseOutput extends S.Class<DatabaseOutput>("DatabaseOutput")({
  GlueConnectionName: S.String,
  DatabaseOptions: DatabaseTableOutputOptions,
  DatabaseOutputMode: S.optional(S.String),
}) {}
export const DatabaseOutputList = S.Array(DatabaseOutput);
export class UpdateRecipeJobRequest extends S.Class<UpdateRecipeJobRequest>(
  "UpdateRecipeJobRequest",
)(
  {
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(S.String),
    Name: S.String.pipe(T.HttpLabel()),
    LogSubscription: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Outputs: S.optional(OutputList),
    DataCatalogOutputs: S.optional(DataCatalogOutputList),
    DatabaseOutputs: S.optional(DatabaseOutputList),
    RoleArn: S.String,
    Timeout: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/recipeJobs/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Threshold extends S.Class<Threshold>("Threshold")({
  Value: S.Number,
  Type: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export class Rule extends S.Class<Rule>("Rule")({
  Name: S.String,
  Disabled: S.optional(S.Boolean),
  CheckExpression: S.String,
  SubstitutionMap: S.optional(ValuesMap),
  Threshold: S.optional(Threshold),
  ColumnSelectors: S.optional(ColumnSelectorList),
}) {}
export const RuleList = S.Array(Rule);
export class UpdateRulesetRequest extends S.Class<UpdateRulesetRequest>(
  "UpdateRulesetRequest",
)(
  {
    Name: S.String.pipe(T.HttpLabel()),
    Description: S.optional(S.String),
    Rules: RuleList,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/rulesets/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateScheduleRequest extends S.Class<UpdateScheduleRequest>(
  "UpdateScheduleRequest",
)(
  {
    JobNames: S.optional(JobNameList),
    CronExpression: S.String,
    Name: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/schedules/{Name}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const HiddenColumnList = S.Array(S.String);
export class RecipeReference extends S.Class<RecipeReference>(
  "RecipeReference",
)({ Name: S.String, RecipeVersion: S.optional(S.String) }) {}
export class ViewFrame extends S.Class<ViewFrame>("ViewFrame")({
  StartColumnIndex: S.Number,
  ColumnRange: S.optional(S.Number),
  HiddenColumns: S.optional(HiddenColumnList),
  StartRowIndex: S.optional(S.Number),
  RowRange: S.optional(S.Number),
  Analytics: S.optional(S.String),
}) {}
export class CreateProjectRequest extends S.Class<CreateProjectRequest>(
  "CreateProjectRequest",
)(
  {
    DatasetName: S.String,
    Name: S.String,
    RecipeName: S.String,
    Sample: S.optional(Sample),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/projects" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateScheduleResponse extends S.Class<CreateScheduleResponse>(
  "CreateScheduleResponse",
)({ Name: S.String }) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({ Name: S.String }) {}
export class DeleteJobResponse extends S.Class<DeleteJobResponse>(
  "DeleteJobResponse",
)({ Name: S.String }) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({ Name: S.String }) {}
export class DeleteRecipeVersionResponse extends S.Class<DeleteRecipeVersionResponse>(
  "DeleteRecipeVersionResponse",
)({ Name: S.String, RecipeVersion: S.String }) {}
export class DeleteRulesetResponse extends S.Class<DeleteRulesetResponse>(
  "DeleteRulesetResponse",
)({ Name: S.String }) {}
export class DeleteScheduleResponse extends S.Class<DeleteScheduleResponse>(
  "DeleteScheduleResponse",
)({ Name: S.String }) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.String,
  Format: S.optional(S.String),
  FormatOptions: S.optional(FormatOptions),
  Input: Input,
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  Source: S.optional(S.String),
  PathOptions: S.optional(PathOptions),
  Tags: S.optional(TagMap),
  ResourceArn: S.optional(S.String),
}) {}
export class DescribeJobResponse extends S.Class<DescribeJobResponse>(
  "DescribeJobResponse",
)({
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  DatasetName: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  EncryptionMode: S.optional(S.String),
  Name: S.String,
  Type: S.optional(S.String),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LogSubscription: S.optional(S.String),
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
}) {}
export class DescribeJobRunResponse extends S.Class<DescribeJobRunResponse>(
  "DescribeJobRunResponse",
)({
  Attempt: S.optional(S.Number),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatasetName: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  ExecutionTime: S.optional(S.Number),
  JobName: S.String,
  ProfileConfiguration: S.optional(ProfileConfiguration),
  ValidationConfigurations: S.optional(ValidationConfigurationList),
  RunId: S.optional(S.String),
  State: S.optional(S.String),
  LogSubscription: S.optional(S.String),
  LogGroupName: S.optional(S.String),
  Outputs: S.optional(OutputList),
  DataCatalogOutputs: S.optional(DataCatalogOutputList),
  DatabaseOutputs: S.optional(DatabaseOutputList),
  RecipeReference: S.optional(RecipeReference),
  StartedBy: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobSample: S.optional(JobSample),
}) {}
export class DescribeProjectResponse extends S.Class<DescribeProjectResponse>(
  "DescribeProjectResponse",
)({
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  DatasetName: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  Name: S.String,
  RecipeName: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Sample: S.optional(Sample),
  RoleArn: S.optional(S.String),
  Tags: S.optional(TagMap),
  SessionStatus: S.optional(S.String),
  OpenedBy: S.optional(S.String),
  OpenDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeRecipeResponse extends S.Class<DescribeRecipeResponse>(
  "DescribeRecipeResponse",
)({
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProjectName: S.optional(S.String),
  PublishedBy: S.optional(S.String),
  PublishedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Name: S.String,
  Steps: S.optional(RecipeStepList),
  Tags: S.optional(TagMap),
  ResourceArn: S.optional(S.String),
  RecipeVersion: S.optional(S.String),
}) {}
export class DescribeRulesetResponse extends S.Class<DescribeRulesetResponse>(
  "DescribeRulesetResponse",
)({
  Name: S.String,
  Description: S.optional(S.String),
  TargetArn: S.optional(S.String),
  Rules: S.optional(RuleList),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceArn: S.optional(S.String),
  Tags: S.optional(TagMap),
}) {}
export class DescribeScheduleResponse extends S.Class<DescribeScheduleResponse>(
  "DescribeScheduleResponse",
)({
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  JobNames: S.optional(JobNameList),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceArn: S.optional(S.String),
  CronExpression: S.optional(S.String),
  Tags: S.optional(TagMap),
  Name: S.String,
}) {}
export class Recipe extends S.Class<Recipe>("Recipe")({
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProjectName: S.optional(S.String),
  PublishedBy: S.optional(S.String),
  PublishedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Name: S.String,
  ResourceArn: S.optional(S.String),
  Steps: S.optional(RecipeStepList),
  Tags: S.optional(TagMap),
  RecipeVersion: S.optional(S.String),
}) {}
export const RecipeList = S.Array(Recipe);
export class ListRecipeVersionsResponse extends S.Class<ListRecipeVersionsResponse>(
  "ListRecipeVersionsResponse",
)({ NextToken: S.optional(S.String), Recipes: RecipeList }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class PublishRecipeResponse extends S.Class<PublishRecipeResponse>(
  "PublishRecipeResponse",
)({ Name: S.String }) {}
export class SendProjectSessionActionRequest extends S.Class<SendProjectSessionActionRequest>(
  "SendProjectSessionActionRequest",
)(
  {
    Preview: S.optional(S.Boolean),
    Name: S.String.pipe(T.HttpLabel()),
    RecipeStep: S.optional(RecipeStep),
    StepIndex: S.optional(S.Number),
    ClientSessionId: S.optional(S.String),
    ViewFrame: S.optional(ViewFrame),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/projects/{Name}/sendProjectSessionAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartJobRunResponse extends S.Class<StartJobRunResponse>(
  "StartJobRunResponse",
)({ RunId: S.String }) {}
export class StartProjectSessionResponse extends S.Class<StartProjectSessionResponse>(
  "StartProjectSessionResponse",
)({ Name: S.String, ClientSessionId: S.optional(S.String) }) {}
export class StopJobRunResponse extends S.Class<StopJobRunResponse>(
  "StopJobRunResponse",
)({ RunId: S.String }) {}
export class UpdateDatasetResponse extends S.Class<UpdateDatasetResponse>(
  "UpdateDatasetResponse",
)({ Name: S.String }) {}
export class UpdateProfileJobResponse extends S.Class<UpdateProfileJobResponse>(
  "UpdateProfileJobResponse",
)({ Name: S.String }) {}
export class UpdateProjectResponse extends S.Class<UpdateProjectResponse>(
  "UpdateProjectResponse",
)({
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.String,
}) {}
export class UpdateRecipeResponse extends S.Class<UpdateRecipeResponse>(
  "UpdateRecipeResponse",
)({ Name: S.String }) {}
export class UpdateRecipeJobResponse extends S.Class<UpdateRecipeJobResponse>(
  "UpdateRecipeJobResponse",
)({ Name: S.String }) {}
export class UpdateRulesetResponse extends S.Class<UpdateRulesetResponse>(
  "UpdateRulesetResponse",
)({ Name: S.String }) {}
export class UpdateScheduleResponse extends S.Class<UpdateScheduleResponse>(
  "UpdateScheduleResponse",
)({ Name: S.String }) {}
export class RecipeVersionErrorDetail extends S.Class<RecipeVersionErrorDetail>(
  "RecipeVersionErrorDetail",
)({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  RecipeVersion: S.optional(S.String),
}) {}
export const RecipeErrorList = S.Array(RecipeVersionErrorDetail);
export class Dataset extends S.Class<Dataset>("Dataset")({
  AccountId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.String,
  Format: S.optional(S.String),
  FormatOptions: S.optional(FormatOptions),
  Input: Input,
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  Source: S.optional(S.String),
  PathOptions: S.optional(PathOptions),
  Tags: S.optional(TagMap),
  ResourceArn: S.optional(S.String),
}) {}
export const DatasetList = S.Array(Dataset);
export class JobRun extends S.Class<JobRun>("JobRun")({
  Attempt: S.optional(S.Number),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatasetName: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  ExecutionTime: S.optional(S.Number),
  JobName: S.optional(S.String),
  RunId: S.optional(S.String),
  State: S.optional(S.String),
  LogSubscription: S.optional(S.String),
  LogGroupName: S.optional(S.String),
  Outputs: S.optional(OutputList),
  DataCatalogOutputs: S.optional(DataCatalogOutputList),
  DatabaseOutputs: S.optional(DatabaseOutputList),
  RecipeReference: S.optional(RecipeReference),
  StartedBy: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobSample: S.optional(JobSample),
  ValidationConfigurations: S.optional(ValidationConfigurationList),
}) {}
export const JobRunList = S.Array(JobRun);
export class Job extends S.Class<Job>("Job")({
  AccountId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DatasetName: S.optional(S.String),
  EncryptionKeyArn: S.optional(S.String),
  EncryptionMode: S.optional(S.String),
  Name: S.String,
  Type: S.optional(S.String),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LogSubscription: S.optional(S.String),
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
}) {}
export const JobList = S.Array(Job);
export class Project extends S.Class<Project>("Project")({
  AccountId: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(S.String),
  DatasetName: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(S.String),
  Name: S.String,
  RecipeName: S.String,
  ResourceArn: S.optional(S.String),
  Sample: S.optional(Sample),
  Tags: S.optional(TagMap),
  RoleArn: S.optional(S.String),
  OpenedBy: S.optional(S.String),
  OpenDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProjectList = S.Array(Project);
export class RulesetItem extends S.Class<RulesetItem>("RulesetItem")({
  AccountId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.String,
  ResourceArn: S.optional(S.String),
  RuleCount: S.optional(S.Number),
  Tags: S.optional(TagMap),
  TargetArn: S.String,
}) {}
export const RulesetItemList = S.Array(RulesetItem);
export class Schedule extends S.Class<Schedule>("Schedule")({
  AccountId: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobNames: S.optional(JobNameList),
  LastModifiedBy: S.optional(S.String),
  LastModifiedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceArn: S.optional(S.String),
  CronExpression: S.optional(S.String),
  Tags: S.optional(TagMap),
  Name: S.String,
}) {}
export const ScheduleList = S.Array(Schedule);
export class BatchDeleteRecipeVersionResponse extends S.Class<BatchDeleteRecipeVersionResponse>(
  "BatchDeleteRecipeVersionResponse",
)({ Name: S.String, Errors: S.optional(RecipeErrorList) }) {}
export class CreateProjectResponse extends S.Class<CreateProjectResponse>(
  "CreateProjectResponse",
)({ Name: S.String }) {}
export class CreateRulesetRequest extends S.Class<CreateRulesetRequest>(
  "CreateRulesetRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    TargetArn: S.String,
    Rules: RuleList,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/rulesets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({ Datasets: DatasetList, NextToken: S.optional(S.String) }) {}
export class ListJobRunsResponse extends S.Class<ListJobRunsResponse>(
  "ListJobRunsResponse",
)({ JobRuns: JobRunList, NextToken: S.optional(S.String) }) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ Jobs: JobList, NextToken: S.optional(S.String) }) {}
export class ListProjectsResponse extends S.Class<ListProjectsResponse>(
  "ListProjectsResponse",
)({ Projects: ProjectList, NextToken: S.optional(S.String) }) {}
export class ListRecipesResponse extends S.Class<ListRecipesResponse>(
  "ListRecipesResponse",
)({ Recipes: RecipeList, NextToken: S.optional(S.String) }) {}
export class ListRulesetsResponse extends S.Class<ListRulesetsResponse>(
  "ListRulesetsResponse",
)({ Rulesets: RulesetItemList, NextToken: S.optional(S.String) }) {}
export class ListSchedulesResponse extends S.Class<ListSchedulesResponse>(
  "ListSchedulesResponse",
)({ Schedules: ScheduleList, NextToken: S.optional(S.String) }) {}
export class SendProjectSessionActionResponse extends S.Class<SendProjectSessionActionResponse>(
  "SendProjectSessionActionResponse",
)({
  Result: S.optional(S.String),
  Name: S.String,
  ActionId: S.optional(S.Number),
}) {}
export class CreateProfileJobRequest extends S.Class<CreateProfileJobRequest>(
  "CreateProfileJobRequest",
)(
  {
    DatasetName: S.String,
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(S.String),
    Name: S.String,
    LogSubscription: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    OutputLocation: S3Location,
    Configuration: S.optional(ProfileConfiguration),
    ValidationConfigurations: S.optional(ValidationConfigurationList),
    RoleArn: S.String,
    Tags: S.optional(TagMap),
    Timeout: S.optional(S.Number),
    JobSample: S.optional(JobSample),
  },
  T.all(
    T.Http({ method: "POST", uri: "/profileJobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRecipeRequest extends S.Class<CreateRecipeRequest>(
  "CreateRecipeRequest",
)(
  {
    Description: S.optional(S.String),
    Name: S.String,
    Steps: RecipeStepList,
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/recipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRecipeJobRequest extends S.Class<CreateRecipeJobRequest>(
  "CreateRecipeJobRequest",
)(
  {
    DatasetName: S.optional(S.String),
    EncryptionKeyArn: S.optional(S.String),
    EncryptionMode: S.optional(S.String),
    Name: S.String,
    LogSubscription: S.optional(S.String),
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/recipeJobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateRulesetResponse extends S.Class<CreateRulesetResponse>(
  "CreateRulesetResponse",
)({ Name: S.String }) {}
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    Name: S.String,
    Format: S.optional(S.String),
    FormatOptions: S.optional(FormatOptions),
    Input: Input,
    PathOptions: S.optional(PathOptions),
    Tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/datasets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateProfileJobResponse extends S.Class<CreateProfileJobResponse>(
  "CreateProfileJobResponse",
)({ Name: S.String }) {}
export class CreateRecipeResponse extends S.Class<CreateRecipeResponse>(
  "CreateRecipeResponse",
)({ Name: S.String }) {}
export class CreateRecipeJobResponse extends S.Class<CreateRecipeJobResponse>(
  "CreateRecipeJobResponse",
)({ Name: S.String }) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ Name: S.String }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}

//# Operations
/**
 * Deletes the specified DataBrew job.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an existing DataBrew project.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a single version of a DataBrew recipe.
 */
export const deleteRecipeVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecipeVersionRequest,
  output: DeleteRecipeVersionResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a ruleset.
 */
export const deleteRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRulesetRequest,
  output: DeleteRulesetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes the specified DataBrew schedule.
 */
export const deleteSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleRequest,
  output: DeleteScheduleResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew dataset.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew job.
 */
export const describeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRequest,
  output: DescribeJobResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Represents one run of a DataBrew job.
 */
export const describeJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRunRequest,
  output: DescribeJobRunResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew project.
 */
export const describeProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProjectRequest,
  output: DescribeProjectResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew recipe corresponding to a particular
 * version.
 */
export const describeRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecipeRequest,
  output: DescribeRecipeResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Retrieves detailed information about the ruleset.
 */
export const describeRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRulesetRequest,
  output: DescribeRulesetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the definition of a specific DataBrew schedule.
 */
export const describeSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScheduleRequest,
  output: DescribeScheduleResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists the versions of a particular DataBrew recipe, except for
 * `LATEST_WORKING`.
 */
export const listRecipeVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecipeVersionsRequest,
  output: ListRecipeVersionsResponse,
  errors: [ValidationException],
}));
/**
 * Lists all the tags for a DataBrew resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Runs a DataBrew job.
 */
export const startJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startProjectSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a particular run of a job.
 */
export const stopJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopJobRunRequest,
  output: StopJobRunResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Adds metadata tags to a DataBrew resource, such as a dataset, project, recipe, job, or
 * schedule.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes metadata tags from a DataBrew resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Modifies the definition of an existing profile job.
 */
export const updateProfileJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileJobRequest,
  output: UpdateProfileJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Modifies the definition of an existing DataBrew project.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Modifies the definition of the `LATEST_WORKING` version of a DataBrew
 * recipe.
 */
export const updateRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecipeRequest,
  output: UpdateRecipeResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Modifies the definition of an existing DataBrew recipe job.
 */
export const updateRecipeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecipeJobRequest,
  output: UpdateRecipeJobResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates specified ruleset.
 */
export const updateRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRulesetRequest,
  output: UpdateRulesetResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Modifies the definition of an existing DataBrew schedule.
 */
export const updateSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateScheduleRequest,
  output: UpdateScheduleResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
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
export const batchDeleteRecipeVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteRecipeVersionRequest,
    output: BatchDeleteRecipeVersionResponse,
    errors: [ConflictException, ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Creates a new DataBrew project.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new schedule for one or more DataBrew jobs. Jobs can be run at a specific
 * date and time, or at regular intervals.
 */
export const createSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScheduleRequest,
  output: CreateScheduleResponse,
  errors: [
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes a dataset from DataBrew.
 */
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all of the DataBrew datasets.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [ValidationException],
}));
/**
 * Lists all of the previous runs of a particular DataBrew job.
 */
export const listJobRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobRunsRequest,
  output: ListJobRunsResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists all of the DataBrew jobs that are defined.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [ValidationException],
}));
/**
 * Lists all of the DataBrew projects that are defined.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [ValidationException],
}));
/**
 * Lists all of the DataBrew recipes that are defined.
 */
export const listRecipes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecipesRequest,
  output: ListRecipesResponse,
  errors: [ValidationException],
}));
/**
 * List all rulesets available in the current account or rulesets associated
 * with a specific resource (dataset).
 */
export const listRulesets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRulesetsRequest,
  output: ListRulesetsResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Lists the DataBrew schedules that are defined.
 */
export const listSchedules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSchedulesRequest,
  output: ListSchedulesResponse,
  errors: [ValidationException],
}));
/**
 * Publishes a new version of a DataBrew recipe.
 */
export const publishRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PublishRecipeRequest,
  output: PublishRecipeResponse,
  errors: [
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Performs a recipe step within an interactive DataBrew session that's currently
 * open.
 */
export const sendProjectSessionAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendProjectSessionActionRequest,
    output: SendProjectSessionActionResponse,
    errors: [ConflictException, ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Modifies the definition of an existing DataBrew dataset.
 */
export const updateDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new ruleset that can be used in a profile job to validate
 * the data quality of a dataset.
 */
export const createRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProfileJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createRecipeJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
