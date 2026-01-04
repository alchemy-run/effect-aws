import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Personalize",
  serviceShapeName: "AmazonPersonalize",
});
const auth = T.AwsAuthSigv4({ name: "personalize" });
const ver = T.ServiceVersion("2018-05-22");
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
                        url: "https://personalize-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://personalize-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://personalize.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://personalize.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const MetricAttributesNamesList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  tagKey: S.String,
  tagValue: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    name: S.String,
    schemaArn: S.String,
    datasetGroupArn: S.String,
    datasetType: S.String,
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatasetGroupRequest extends S.Class<CreateDatasetGroupRequest>(
  "CreateDatasetGroupRequest",
)(
  {
    name: S.String,
    roleArn: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
    domain: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  dataLocation: S.optional(S.String),
}) {}
export class CreateDatasetImportJobRequest extends S.Class<CreateDatasetImportJobRequest>(
  "CreateDatasetImportJobRequest",
)(
  {
    jobName: S.String,
    datasetArn: S.String,
    dataSource: DataSource,
    roleArn: S.optional(S.String),
    tags: S.optional(Tags),
    importMode: S.optional(S.String),
    publishAttributionMetricsToS3: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEventTrackerRequest extends S.Class<CreateEventTrackerRequest>(
  "CreateEventTrackerRequest",
)(
  { name: S.String, datasetGroupArn: S.String, tags: S.optional(Tags) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFilterRequest extends S.Class<CreateFilterRequest>(
  "CreateFilterRequest",
)(
  {
    name: S.String,
    datasetGroupArn: S.String,
    filterExpression: S.String,
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSchemaRequest extends S.Class<CreateSchemaRequest>(
  "CreateSchemaRequest",
)(
  { name: S.String, schema: S.String, domain: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSolutionVersionRequest extends S.Class<CreateSolutionVersionRequest>(
  "CreateSolutionVersionRequest",
)(
  {
    name: S.optional(S.String),
    solutionArn: S.String,
    trainingMode: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCampaignRequest extends S.Class<DeleteCampaignRequest>(
  "DeleteCampaignRequest",
)(
  { campaignArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCampaignResponse extends S.Class<DeleteCampaignResponse>(
  "DeleteCampaignResponse",
)({}) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  { datasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({}) {}
export class DeleteDatasetGroupRequest extends S.Class<DeleteDatasetGroupRequest>(
  "DeleteDatasetGroupRequest",
)(
  { datasetGroupArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetGroupResponse extends S.Class<DeleteDatasetGroupResponse>(
  "DeleteDatasetGroupResponse",
)({}) {}
export class DeleteEventTrackerRequest extends S.Class<DeleteEventTrackerRequest>(
  "DeleteEventTrackerRequest",
)(
  { eventTrackerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventTrackerResponse extends S.Class<DeleteEventTrackerResponse>(
  "DeleteEventTrackerResponse",
)({}) {}
export class DeleteFilterRequest extends S.Class<DeleteFilterRequest>(
  "DeleteFilterRequest",
)(
  { filterArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFilterResponse extends S.Class<DeleteFilterResponse>(
  "DeleteFilterResponse",
)({}) {}
export class DeleteMetricAttributionRequest extends S.Class<DeleteMetricAttributionRequest>(
  "DeleteMetricAttributionRequest",
)(
  { metricAttributionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMetricAttributionResponse extends S.Class<DeleteMetricAttributionResponse>(
  "DeleteMetricAttributionResponse",
)({}) {}
export class DeleteRecommenderRequest extends S.Class<DeleteRecommenderRequest>(
  "DeleteRecommenderRequest",
)(
  { recommenderArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRecommenderResponse extends S.Class<DeleteRecommenderResponse>(
  "DeleteRecommenderResponse",
)({}) {}
export class DeleteSchemaRequest extends S.Class<DeleteSchemaRequest>(
  "DeleteSchemaRequest",
)(
  { schemaArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSchemaResponse extends S.Class<DeleteSchemaResponse>(
  "DeleteSchemaResponse",
)({}) {}
export class DeleteSolutionRequest extends S.Class<DeleteSolutionRequest>(
  "DeleteSolutionRequest",
)(
  { solutionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSolutionResponse extends S.Class<DeleteSolutionResponse>(
  "DeleteSolutionResponse",
)({}) {}
export class DescribeAlgorithmRequest extends S.Class<DescribeAlgorithmRequest>(
  "DescribeAlgorithmRequest",
)(
  { algorithmArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBatchInferenceJobRequest extends S.Class<DescribeBatchInferenceJobRequest>(
  "DescribeBatchInferenceJobRequest",
)(
  { batchInferenceJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBatchSegmentJobRequest extends S.Class<DescribeBatchSegmentJobRequest>(
  "DescribeBatchSegmentJobRequest",
)(
  { batchSegmentJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCampaignRequest extends S.Class<DescribeCampaignRequest>(
  "DescribeCampaignRequest",
)(
  { campaignArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataDeletionJobRequest extends S.Class<DescribeDataDeletionJobRequest>(
  "DescribeDataDeletionJobRequest",
)(
  { dataDeletionJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { datasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetExportJobRequest extends S.Class<DescribeDatasetExportJobRequest>(
  "DescribeDatasetExportJobRequest",
)(
  { datasetExportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetGroupRequest extends S.Class<DescribeDatasetGroupRequest>(
  "DescribeDatasetGroupRequest",
)(
  { datasetGroupArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetImportJobRequest extends S.Class<DescribeDatasetImportJobRequest>(
  "DescribeDatasetImportJobRequest",
)(
  { datasetImportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventTrackerRequest extends S.Class<DescribeEventTrackerRequest>(
  "DescribeEventTrackerRequest",
)(
  { eventTrackerArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFeatureTransformationRequest extends S.Class<DescribeFeatureTransformationRequest>(
  "DescribeFeatureTransformationRequest",
)(
  { featureTransformationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFilterRequest extends S.Class<DescribeFilterRequest>(
  "DescribeFilterRequest",
)(
  { filterArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetricAttributionRequest extends S.Class<DescribeMetricAttributionRequest>(
  "DescribeMetricAttributionRequest",
)(
  { metricAttributionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRecipeRequest extends S.Class<DescribeRecipeRequest>(
  "DescribeRecipeRequest",
)(
  { recipeArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRecommenderRequest extends S.Class<DescribeRecommenderRequest>(
  "DescribeRecommenderRequest",
)(
  { recommenderArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSchemaRequest extends S.Class<DescribeSchemaRequest>(
  "DescribeSchemaRequest",
)(
  { schemaArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSolutionRequest extends S.Class<DescribeSolutionRequest>(
  "DescribeSolutionRequest",
)(
  { solutionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSolutionVersionRequest extends S.Class<DescribeSolutionVersionRequest>(
  "DescribeSolutionVersionRequest",
)(
  { solutionVersionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSolutionMetricsRequest extends S.Class<GetSolutionMetricsRequest>(
  "GetSolutionMetricsRequest",
)(
  { solutionVersionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBatchInferenceJobsRequest extends S.Class<ListBatchInferenceJobsRequest>(
  "ListBatchInferenceJobsRequest",
)(
  {
    solutionVersionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBatchSegmentJobsRequest extends S.Class<ListBatchSegmentJobsRequest>(
  "ListBatchSegmentJobsRequest",
)(
  {
    solutionVersionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCampaignsRequest extends S.Class<ListCampaignsRequest>(
  "ListCampaignsRequest",
)(
  {
    solutionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataDeletionJobsRequest extends S.Class<ListDataDeletionJobsRequest>(
  "ListDataDeletionJobsRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetExportJobsRequest extends S.Class<ListDatasetExportJobsRequest>(
  "ListDatasetExportJobsRequest",
)(
  {
    datasetArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetGroupsRequest extends S.Class<ListDatasetGroupsRequest>(
  "ListDatasetGroupsRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetImportJobsRequest extends S.Class<ListDatasetImportJobsRequest>(
  "ListDatasetImportJobsRequest",
)(
  {
    datasetArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEventTrackersRequest extends S.Class<ListEventTrackersRequest>(
  "ListEventTrackersRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFiltersRequest extends S.Class<ListFiltersRequest>(
  "ListFiltersRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMetricAttributionMetricsRequest extends S.Class<ListMetricAttributionMetricsRequest>(
  "ListMetricAttributionMetricsRequest",
)(
  {
    metricAttributionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMetricAttributionsRequest extends S.Class<ListMetricAttributionsRequest>(
  "ListMetricAttributionsRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecipesRequest extends S.Class<ListRecipesRequest>(
  "ListRecipesRequest",
)(
  {
    recipeProvider: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    domain: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecommendersRequest extends S.Class<ListRecommendersRequest>(
  "ListRecommendersRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSchemasRequest extends S.Class<ListSchemasRequest>(
  "ListSchemasRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSolutionsRequest extends S.Class<ListSolutionsRequest>(
  "ListSolutionsRequest",
)(
  {
    datasetGroupArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSolutionVersionsRequest extends S.Class<ListSolutionVersionsRequest>(
  "ListSolutionVersionsRequest",
)(
  {
    solutionArn: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartRecommenderRequest extends S.Class<StartRecommenderRequest>(
  "StartRecommenderRequest",
)(
  { recommenderArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopRecommenderRequest extends S.Class<StopRecommenderRequest>(
  "StopRecommenderRequest",
)(
  { recommenderArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopSolutionVersionCreationRequest extends S.Class<StopSolutionVersionCreationRequest>(
  "StopSolutionVersionCreationRequest",
)(
  { solutionVersionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopSolutionVersionCreationResponse extends S.Class<StopSolutionVersionCreationResponse>(
  "StopSolutionVersionCreationResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export const RankingInfluence = S.Record({ key: S.String, value: S.Number });
export class CampaignConfig extends S.Class<CampaignConfig>("CampaignConfig")({
  itemExplorationConfig: S.optional(HyperParameters),
  enableMetadataWithRecommendations: S.optional(S.Boolean),
  syncWithLatestSolutionVersion: S.optional(S.Boolean),
  rankingInfluence: S.optional(RankingInfluence),
}) {}
export class UpdateCampaignRequest extends S.Class<UpdateCampaignRequest>(
  "UpdateCampaignRequest",
)(
  {
    campaignArn: S.String,
    solutionVersionArn: S.optional(S.String),
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDatasetRequest extends S.Class<UpdateDatasetRequest>(
  "UpdateDatasetRequest",
)(
  { datasetArn: S.String, schemaArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MetricAttribute extends S.Class<MetricAttribute>(
  "MetricAttribute",
)({ eventType: S.String, metricName: S.String, expression: S.String }) {}
export const MetricAttributes = S.Array(MetricAttribute);
export class S3DataConfig extends S.Class<S3DataConfig>("S3DataConfig")({
  path: S.String,
  kmsKeyArn: S.optional(S.String),
}) {}
export class MetricAttributionOutput extends S.Class<MetricAttributionOutput>(
  "MetricAttributionOutput",
)({ s3DataDestination: S.optional(S3DataConfig), roleArn: S.String }) {}
export class UpdateMetricAttributionRequest extends S.Class<UpdateMetricAttributionRequest>(
  "UpdateMetricAttributionRequest",
)(
  {
    addMetrics: S.optional(MetricAttributes),
    removeMetrics: S.optional(MetricAttributesNamesList),
    metricsOutputConfig: S.optional(MetricAttributionOutput),
    metricAttributionArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ColumnNamesList = S.Array(S.String);
export const ExcludedDatasetColumns = S.Record({
  key: S.String,
  value: ColumnNamesList,
});
export const IncludedDatasetColumns = S.Record({
  key: S.String,
  value: ColumnNamesList,
});
export class TrainingDataConfig extends S.Class<TrainingDataConfig>(
  "TrainingDataConfig",
)({
  excludedDatasetColumns: S.optional(ExcludedDatasetColumns),
  includedDatasetColumns: S.optional(IncludedDatasetColumns),
}) {}
export class RecommenderConfig extends S.Class<RecommenderConfig>(
  "RecommenderConfig",
)({
  itemExplorationConfig: S.optional(HyperParameters),
  minRecommendationRequestsPerSecond: S.optional(S.Number),
  trainingDataConfig: S.optional(TrainingDataConfig),
  enableMetadataWithRecommendations: S.optional(S.Boolean),
}) {}
export class UpdateRecommenderRequest extends S.Class<UpdateRecommenderRequest>(
  "UpdateRecommenderRequest",
)(
  { recommenderArn: S.String, recommenderConfig: RecommenderConfig },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchInferenceJobOutput extends S.Class<BatchInferenceJobOutput>(
  "BatchInferenceJobOutput",
)({ s3DataDestination: S3DataConfig }) {}
export class BatchSegmentJobInput extends S.Class<BatchSegmentJobInput>(
  "BatchSegmentJobInput",
)({ s3DataSource: S3DataConfig }) {}
export class BatchSegmentJobOutput extends S.Class<BatchSegmentJobOutput>(
  "BatchSegmentJobOutput",
)({ s3DataDestination: S3DataConfig }) {}
export class DatasetExportJobOutput extends S.Class<DatasetExportJobOutput>(
  "DatasetExportJobOutput",
)({ s3DataDestination: S3DataConfig }) {}
export class AutoTrainingConfig extends S.Class<AutoTrainingConfig>(
  "AutoTrainingConfig",
)({ schedulingExpression: S.optional(S.String) }) {}
export class EventParameters extends S.Class<EventParameters>(
  "EventParameters",
)({
  eventType: S.optional(S.String),
  eventValueThreshold: S.optional(S.Number),
  weight: S.optional(S.Number),
}) {}
export const EventParametersList = S.Array(EventParameters);
export class EventsConfig extends S.Class<EventsConfig>("EventsConfig")({
  eventParametersList: S.optional(EventParametersList),
}) {}
export class SolutionUpdateConfig extends S.Class<SolutionUpdateConfig>(
  "SolutionUpdateConfig",
)({
  autoTrainingConfig: S.optional(AutoTrainingConfig),
  eventsConfig: S.optional(EventsConfig),
}) {}
export const ArnList = S.Array(S.String);
export class CreateBatchSegmentJobRequest extends S.Class<CreateBatchSegmentJobRequest>(
  "CreateBatchSegmentJobRequest",
)(
  {
    jobName: S.String,
    solutionVersionArn: S.String,
    filterArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: BatchSegmentJobInput,
    jobOutput: BatchSegmentJobOutput,
    roleArn: S.String,
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCampaignRequest extends S.Class<CreateCampaignRequest>(
  "CreateCampaignRequest",
)(
  {
    name: S.String,
    solutionVersionArn: S.String,
    minProvisionedTPS: S.optional(S.Number),
    campaignConfig: S.optional(CampaignConfig),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDataDeletionJobRequest extends S.Class<CreateDataDeletionJobRequest>(
  "CreateDataDeletionJobRequest",
)(
  {
    jobName: S.String,
    datasetGroupArn: S.String,
    dataSource: DataSource,
    roleArn: S.String,
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ datasetArn: S.optional(S.String) }) {}
export class CreateDatasetExportJobRequest extends S.Class<CreateDatasetExportJobRequest>(
  "CreateDatasetExportJobRequest",
)(
  {
    jobName: S.String,
    datasetArn: S.String,
    ingestionMode: S.optional(S.String),
    roleArn: S.String,
    jobOutput: DatasetExportJobOutput,
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatasetGroupResponse extends S.Class<CreateDatasetGroupResponse>(
  "CreateDatasetGroupResponse",
)({ datasetGroupArn: S.optional(S.String), domain: S.optional(S.String) }) {}
export class CreateDatasetImportJobResponse extends S.Class<CreateDatasetImportJobResponse>(
  "CreateDatasetImportJobResponse",
)({ datasetImportJobArn: S.optional(S.String) }) {}
export class CreateEventTrackerResponse extends S.Class<CreateEventTrackerResponse>(
  "CreateEventTrackerResponse",
)({
  eventTrackerArn: S.optional(S.String),
  trackingId: S.optional(S.String),
}) {}
export class CreateFilterResponse extends S.Class<CreateFilterResponse>(
  "CreateFilterResponse",
)({ filterArn: S.optional(S.String) }) {}
export class CreateMetricAttributionRequest extends S.Class<CreateMetricAttributionRequest>(
  "CreateMetricAttributionRequest",
)(
  {
    name: S.String,
    datasetGroupArn: S.String,
    metrics: MetricAttributes,
    metricsOutputConfig: MetricAttributionOutput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSchemaResponse extends S.Class<CreateSchemaResponse>(
  "CreateSchemaResponse",
)({ schemaArn: S.optional(S.String) }) {}
export class CreateSolutionVersionResponse extends S.Class<CreateSolutionVersionResponse>(
  "CreateSolutionVersionResponse",
)({ solutionVersionArn: S.optional(S.String) }) {}
export class ListMetricAttributionMetricsResponse extends S.Class<ListMetricAttributionMetricsResponse>(
  "ListMetricAttributionMetricsResponse",
)({ metrics: S.optional(MetricAttributes), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class StartRecommenderResponse extends S.Class<StartRecommenderResponse>(
  "StartRecommenderResponse",
)({ recommenderArn: S.optional(S.String) }) {}
export class StopRecommenderResponse extends S.Class<StopRecommenderResponse>(
  "StopRecommenderResponse",
)({ recommenderArn: S.optional(S.String) }) {}
export class UpdateCampaignResponse extends S.Class<UpdateCampaignResponse>(
  "UpdateCampaignResponse",
)({ campaignArn: S.optional(S.String) }) {}
export class UpdateDatasetResponse extends S.Class<UpdateDatasetResponse>(
  "UpdateDatasetResponse",
)({ datasetArn: S.optional(S.String) }) {}
export class UpdateMetricAttributionResponse extends S.Class<UpdateMetricAttributionResponse>(
  "UpdateMetricAttributionResponse",
)({ metricAttributionArn: S.optional(S.String) }) {}
export class UpdateRecommenderResponse extends S.Class<UpdateRecommenderResponse>(
  "UpdateRecommenderResponse",
)({ recommenderArn: S.optional(S.String) }) {}
export class UpdateSolutionRequest extends S.Class<UpdateSolutionRequest>(
  "UpdateSolutionRequest",
)(
  {
    solutionArn: S.String,
    performAutoTraining: S.optional(S.Boolean),
    performIncrementalUpdate: S.optional(S.Boolean),
    solutionUpdateConfig: S.optional(SolutionUpdateConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FieldsForThemeGeneration extends S.Class<FieldsForThemeGeneration>(
  "FieldsForThemeGeneration",
)({ itemName: S.String }) {}
export const FeatureTransformationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class AutoMLConfig extends S.Class<AutoMLConfig>("AutoMLConfig")({
  metricName: S.optional(S.String),
  recipeList: S.optional(ArnList),
}) {}
export class OptimizationObjective extends S.Class<OptimizationObjective>(
  "OptimizationObjective",
)({
  itemAttribute: S.optional(S.String),
  objectiveSensitivity: S.optional(S.String),
}) {}
export class BatchInferenceJobInput extends S.Class<BatchInferenceJobInput>(
  "BatchInferenceJobInput",
)({ s3DataSource: S3DataConfig }) {}
export class BatchInferenceJobConfig extends S.Class<BatchInferenceJobConfig>(
  "BatchInferenceJobConfig",
)({
  itemExplorationConfig: S.optional(HyperParameters),
  rankingInfluence: S.optional(RankingInfluence),
}) {}
export class ThemeGenerationConfig extends S.Class<ThemeGenerationConfig>(
  "ThemeGenerationConfig",
)({ fieldsForThemeGeneration: FieldsForThemeGeneration }) {}
export class BatchInferenceJob extends S.Class<BatchInferenceJob>(
  "BatchInferenceJob",
)({
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
  batchInferenceJobMode: S.optional(S.String),
  themeGenerationConfig: S.optional(ThemeGenerationConfig),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class BatchSegmentJob extends S.Class<BatchSegmentJob>(
  "BatchSegmentJob",
)({
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
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DataDeletionJob extends S.Class<DataDeletionJob>(
  "DataDeletionJob",
)({
  jobName: S.optional(S.String),
  dataDeletionJobArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  dataSource: S.optional(DataSource),
  roleArn: S.optional(S.String),
  status: S.optional(S.String),
  numDeleted: S.optional(S.Number),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export class DatasetExportJob extends S.Class<DatasetExportJob>(
  "DatasetExportJob",
)({
  jobName: S.optional(S.String),
  datasetExportJobArn: S.optional(S.String),
  datasetArn: S.optional(S.String),
  ingestionMode: S.optional(S.String),
  roleArn: S.optional(S.String),
  status: S.optional(S.String),
  jobOutput: S.optional(DatasetExportJobOutput),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export class DatasetGroup extends S.Class<DatasetGroup>("DatasetGroup")({
  name: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  status: S.optional(S.String),
  roleArn: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  domain: S.optional(S.String),
}) {}
export class DatasetImportJob extends S.Class<DatasetImportJob>(
  "DatasetImportJob",
)({
  jobName: S.optional(S.String),
  datasetImportJobArn: S.optional(S.String),
  datasetArn: S.optional(S.String),
  dataSource: S.optional(DataSource),
  roleArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  importMode: S.optional(S.String),
  publishAttributionMetricsToS3: S.optional(S.Boolean),
}) {}
export class EventTracker extends S.Class<EventTracker>("EventTracker")({
  name: S.optional(S.String),
  eventTrackerArn: S.optional(S.String),
  accountId: S.optional(S.String),
  trackingId: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class Filter extends S.Class<Filter>("Filter")({
  name: S.optional(S.String),
  filterArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  datasetGroupArn: S.optional(S.String),
  failureReason: S.optional(S.String),
  filterExpression: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class MetricAttribution extends S.Class<MetricAttribution>(
  "MetricAttribution",
)({
  name: S.optional(S.String),
  metricAttributionArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  metricsOutputConfig: S.optional(MetricAttributionOutput),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export class Recipe extends S.Class<Recipe>("Recipe")({
  name: S.optional(S.String),
  recipeArn: S.optional(S.String),
  algorithmArn: S.optional(S.String),
  featureTransformationArn: S.optional(S.String),
  status: S.optional(S.String),
  description: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  recipeType: S.optional(S.String),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DatasetSchema extends S.Class<DatasetSchema>("DatasetSchema")({
  name: S.optional(S.String),
  schemaArn: S.optional(S.String),
  schema: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  domain: S.optional(S.String),
}) {}
export const Metrics = S.Record({ key: S.String, value: S.Number });
export class BatchInferenceJobSummary extends S.Class<BatchInferenceJobSummary>(
  "BatchInferenceJobSummary",
)({
  batchInferenceJobArn: S.optional(S.String),
  jobName: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  solutionVersionArn: S.optional(S.String),
  batchInferenceJobMode: S.optional(S.String),
}) {}
export const BatchInferenceJobs = S.Array(BatchInferenceJobSummary);
export class BatchSegmentJobSummary extends S.Class<BatchSegmentJobSummary>(
  "BatchSegmentJobSummary",
)({
  batchSegmentJobArn: S.optional(S.String),
  jobName: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  solutionVersionArn: S.optional(S.String),
}) {}
export const BatchSegmentJobs = S.Array(BatchSegmentJobSummary);
export class CampaignSummary extends S.Class<CampaignSummary>(
  "CampaignSummary",
)({
  name: S.optional(S.String),
  campaignArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const Campaigns = S.Array(CampaignSummary);
export class DataDeletionJobSummary extends S.Class<DataDeletionJobSummary>(
  "DataDeletionJobSummary",
)({
  dataDeletionJobArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  jobName: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const DataDeletionJobs = S.Array(DataDeletionJobSummary);
export class DatasetExportJobSummary extends S.Class<DatasetExportJobSummary>(
  "DatasetExportJobSummary",
)({
  datasetExportJobArn: S.optional(S.String),
  jobName: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const DatasetExportJobs = S.Array(DatasetExportJobSummary);
export class DatasetGroupSummary extends S.Class<DatasetGroupSummary>(
  "DatasetGroupSummary",
)({
  name: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  domain: S.optional(S.String),
}) {}
export const DatasetGroups = S.Array(DatasetGroupSummary);
export class DatasetImportJobSummary extends S.Class<DatasetImportJobSummary>(
  "DatasetImportJobSummary",
)({
  datasetImportJobArn: S.optional(S.String),
  jobName: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
  importMode: S.optional(S.String),
}) {}
export const DatasetImportJobs = S.Array(DatasetImportJobSummary);
export class DatasetSummary extends S.Class<DatasetSummary>("DatasetSummary")({
  name: S.optional(S.String),
  datasetArn: S.optional(S.String),
  datasetType: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Datasets = S.Array(DatasetSummary);
export class EventTrackerSummary extends S.Class<EventTrackerSummary>(
  "EventTrackerSummary",
)({
  name: S.optional(S.String),
  eventTrackerArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const EventTrackers = S.Array(EventTrackerSummary);
export class FilterSummary extends S.Class<FilterSummary>("FilterSummary")({
  name: S.optional(S.String),
  filterArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  datasetGroupArn: S.optional(S.String),
  failureReason: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const Filters = S.Array(FilterSummary);
export class MetricAttributionSummary extends S.Class<MetricAttributionSummary>(
  "MetricAttributionSummary",
)({
  name: S.optional(S.String),
  metricAttributionArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const MetricAttributions = S.Array(MetricAttributionSummary);
export class RecipeSummary extends S.Class<RecipeSummary>("RecipeSummary")({
  name: S.optional(S.String),
  recipeArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  domain: S.optional(S.String),
}) {}
export const Recipes = S.Array(RecipeSummary);
export class RecommenderSummary extends S.Class<RecommenderSummary>(
  "RecommenderSummary",
)({
  name: S.optional(S.String),
  recommenderArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  recipeArn: S.optional(S.String),
  recommenderConfig: S.optional(RecommenderConfig),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Recommenders = S.Array(RecommenderSummary);
export class DatasetSchemaSummary extends S.Class<DatasetSchemaSummary>(
  "DatasetSchemaSummary",
)({
  name: S.optional(S.String),
  schemaArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  domain: S.optional(S.String),
}) {}
export const Schemas = S.Array(DatasetSchemaSummary);
export class SolutionSummary extends S.Class<SolutionSummary>(
  "SolutionSummary",
)({
  name: S.optional(S.String),
  solutionArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  recipeArn: S.optional(S.String),
}) {}
export const Solutions = S.Array(SolutionSummary);
export class SolutionVersionSummary extends S.Class<SolutionVersionSummary>(
  "SolutionVersionSummary",
)({
  solutionVersionArn: S.optional(S.String),
  status: S.optional(S.String),
  trainingMode: S.optional(S.String),
  trainingType: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export const SolutionVersions = S.Array(SolutionVersionSummary);
export class HPOObjective extends S.Class<HPOObjective>("HPOObjective")({
  type: S.optional(S.String),
  metricName: S.optional(S.String),
  metricRegex: S.optional(S.String),
}) {}
export class HPOResourceConfig extends S.Class<HPOResourceConfig>(
  "HPOResourceConfig",
)({
  maxNumberOfTrainingJobs: S.optional(S.String),
  maxParallelTrainingJobs: S.optional(S.String),
}) {}
export class CreateBatchInferenceJobRequest extends S.Class<CreateBatchInferenceJobRequest>(
  "CreateBatchInferenceJobRequest",
)(
  {
    jobName: S.String,
    solutionVersionArn: S.String,
    filterArn: S.optional(S.String),
    numResults: S.optional(S.Number),
    jobInput: BatchInferenceJobInput,
    jobOutput: BatchInferenceJobOutput,
    roleArn: S.String,
    batchInferenceJobConfig: S.optional(BatchInferenceJobConfig),
    tags: S.optional(Tags),
    batchInferenceJobMode: S.optional(S.String),
    themeGenerationConfig: S.optional(ThemeGenerationConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBatchSegmentJobResponse extends S.Class<CreateBatchSegmentJobResponse>(
  "CreateBatchSegmentJobResponse",
)({ batchSegmentJobArn: S.optional(S.String) }) {}
export class CreateCampaignResponse extends S.Class<CreateCampaignResponse>(
  "CreateCampaignResponse",
)({ campaignArn: S.optional(S.String) }) {}
export class CreateDataDeletionJobResponse extends S.Class<CreateDataDeletionJobResponse>(
  "CreateDataDeletionJobResponse",
)({ dataDeletionJobArn: S.optional(S.String) }) {}
export class CreateDatasetExportJobResponse extends S.Class<CreateDatasetExportJobResponse>(
  "CreateDatasetExportJobResponse",
)({ datasetExportJobArn: S.optional(S.String) }) {}
export class CreateMetricAttributionResponse extends S.Class<CreateMetricAttributionResponse>(
  "CreateMetricAttributionResponse",
)({ metricAttributionArn: S.optional(S.String) }) {}
export const CategoricalValues = S.Array(S.String);
export class DescribeBatchInferenceJobResponse extends S.Class<DescribeBatchInferenceJobResponse>(
  "DescribeBatchInferenceJobResponse",
)({ batchInferenceJob: S.optional(BatchInferenceJob) }) {}
export class DescribeBatchSegmentJobResponse extends S.Class<DescribeBatchSegmentJobResponse>(
  "DescribeBatchSegmentJobResponse",
)({ batchSegmentJob: S.optional(BatchSegmentJob) }) {}
export class DescribeDataDeletionJobResponse extends S.Class<DescribeDataDeletionJobResponse>(
  "DescribeDataDeletionJobResponse",
)({ dataDeletionJob: S.optional(DataDeletionJob) }) {}
export class DescribeDatasetExportJobResponse extends S.Class<DescribeDatasetExportJobResponse>(
  "DescribeDatasetExportJobResponse",
)({ datasetExportJob: S.optional(DatasetExportJob) }) {}
export class DescribeDatasetGroupResponse extends S.Class<DescribeDatasetGroupResponse>(
  "DescribeDatasetGroupResponse",
)({ datasetGroup: S.optional(DatasetGroup) }) {}
export class DescribeDatasetImportJobResponse extends S.Class<DescribeDatasetImportJobResponse>(
  "DescribeDatasetImportJobResponse",
)({ datasetImportJob: S.optional(DatasetImportJob) }) {}
export class DescribeEventTrackerResponse extends S.Class<DescribeEventTrackerResponse>(
  "DescribeEventTrackerResponse",
)({ eventTracker: S.optional(EventTracker) }) {}
export class DescribeFilterResponse extends S.Class<DescribeFilterResponse>(
  "DescribeFilterResponse",
)({ filter: S.optional(Filter) }) {}
export class DescribeMetricAttributionResponse extends S.Class<DescribeMetricAttributionResponse>(
  "DescribeMetricAttributionResponse",
)({ metricAttribution: S.optional(MetricAttribution) }) {}
export class DescribeRecipeResponse extends S.Class<DescribeRecipeResponse>(
  "DescribeRecipeResponse",
)({ recipe: S.optional(Recipe) }) {}
export class DescribeSchemaResponse extends S.Class<DescribeSchemaResponse>(
  "DescribeSchemaResponse",
)({ schema: S.optional(DatasetSchema) }) {}
export class GetSolutionMetricsResponse extends S.Class<GetSolutionMetricsResponse>(
  "GetSolutionMetricsResponse",
)({ solutionVersionArn: S.optional(S.String), metrics: S.optional(Metrics) }) {}
export class ListBatchInferenceJobsResponse extends S.Class<ListBatchInferenceJobsResponse>(
  "ListBatchInferenceJobsResponse",
)({
  batchInferenceJobs: S.optional(BatchInferenceJobs),
  nextToken: S.optional(S.String),
}) {}
export class ListBatchSegmentJobsResponse extends S.Class<ListBatchSegmentJobsResponse>(
  "ListBatchSegmentJobsResponse",
)({
  batchSegmentJobs: S.optional(BatchSegmentJobs),
  nextToken: S.optional(S.String),
}) {}
export class ListCampaignsResponse extends S.Class<ListCampaignsResponse>(
  "ListCampaignsResponse",
)({ campaigns: S.optional(Campaigns), nextToken: S.optional(S.String) }) {}
export class ListDataDeletionJobsResponse extends S.Class<ListDataDeletionJobsResponse>(
  "ListDataDeletionJobsResponse",
)({
  dataDeletionJobs: S.optional(DataDeletionJobs),
  nextToken: S.optional(S.String),
}) {}
export class ListDatasetExportJobsResponse extends S.Class<ListDatasetExportJobsResponse>(
  "ListDatasetExportJobsResponse",
)({
  datasetExportJobs: S.optional(DatasetExportJobs),
  nextToken: S.optional(S.String),
}) {}
export class ListDatasetGroupsResponse extends S.Class<ListDatasetGroupsResponse>(
  "ListDatasetGroupsResponse",
)({
  datasetGroups: S.optional(DatasetGroups),
  nextToken: S.optional(S.String),
}) {}
export class ListDatasetImportJobsResponse extends S.Class<ListDatasetImportJobsResponse>(
  "ListDatasetImportJobsResponse",
)({
  datasetImportJobs: S.optional(DatasetImportJobs),
  nextToken: S.optional(S.String),
}) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({ datasets: S.optional(Datasets), nextToken: S.optional(S.String) }) {}
export class ListEventTrackersResponse extends S.Class<ListEventTrackersResponse>(
  "ListEventTrackersResponse",
)({
  eventTrackers: S.optional(EventTrackers),
  nextToken: S.optional(S.String),
}) {}
export class ListFiltersResponse extends S.Class<ListFiltersResponse>(
  "ListFiltersResponse",
)({ Filters: S.optional(Filters), nextToken: S.optional(S.String) }) {}
export class ListMetricAttributionsResponse extends S.Class<ListMetricAttributionsResponse>(
  "ListMetricAttributionsResponse",
)({
  metricAttributions: S.optional(MetricAttributions),
  nextToken: S.optional(S.String),
}) {}
export class ListRecipesResponse extends S.Class<ListRecipesResponse>(
  "ListRecipesResponse",
)({ recipes: S.optional(Recipes), nextToken: S.optional(S.String) }) {}
export class ListRecommendersResponse extends S.Class<ListRecommendersResponse>(
  "ListRecommendersResponse",
)({
  recommenders: S.optional(Recommenders),
  nextToken: S.optional(S.String),
}) {}
export class ListSchemasResponse extends S.Class<ListSchemasResponse>(
  "ListSchemasResponse",
)({ schemas: S.optional(Schemas), nextToken: S.optional(S.String) }) {}
export class ListSolutionsResponse extends S.Class<ListSolutionsResponse>(
  "ListSolutionsResponse",
)({ solutions: S.optional(Solutions), nextToken: S.optional(S.String) }) {}
export class ListSolutionVersionsResponse extends S.Class<ListSolutionVersionsResponse>(
  "ListSolutionVersionsResponse",
)({
  solutionVersions: S.optional(SolutionVersions),
  nextToken: S.optional(S.String),
}) {}
export class UpdateSolutionResponse extends S.Class<UpdateSolutionResponse>(
  "UpdateSolutionResponse",
)({ solutionArn: S.optional(S.String) }) {}
export class AlgorithmImage extends S.Class<AlgorithmImage>("AlgorithmImage")({
  name: S.optional(S.String),
  dockerURI: S.String,
}) {}
export const ResourceConfig = S.Record({ key: S.String, value: S.String });
export class CampaignUpdateSummary extends S.Class<CampaignUpdateSummary>(
  "CampaignUpdateSummary",
)({
  solutionVersionArn: S.optional(S.String),
  minProvisionedTPS: S.optional(S.Number),
  campaignConfig: S.optional(CampaignConfig),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DatasetUpdateSummary extends S.Class<DatasetUpdateSummary>(
  "DatasetUpdateSummary",
)({
  schemaArn: S.optional(S.String),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const FeaturizationParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class RecommenderUpdateSummary extends S.Class<RecommenderUpdateSummary>(
  "RecommenderUpdateSummary",
)({
  recommenderConfig: S.optional(RecommenderConfig),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
}) {}
export class AutoMLResult extends S.Class<AutoMLResult>("AutoMLResult")({
  bestRecipeArn: S.optional(S.String),
}) {}
export class SolutionUpdateSummary extends S.Class<SolutionUpdateSummary>(
  "SolutionUpdateSummary",
)({
  solutionUpdateConfig: S.optional(SolutionUpdateConfig),
  status: S.optional(S.String),
  performAutoTraining: S.optional(S.Boolean),
  performIncrementalUpdate: S.optional(S.Boolean),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  failureReason: S.optional(S.String),
}) {}
export class TunedHPOParams extends S.Class<TunedHPOParams>("TunedHPOParams")({
  algorithmHyperParameters: S.optional(HyperParameters),
}) {}
export class IntegerHyperParameterRange extends S.Class<IntegerHyperParameterRange>(
  "IntegerHyperParameterRange",
)({
  name: S.optional(S.String),
  minValue: S.optional(S.Number),
  maxValue: S.optional(S.Number),
}) {}
export const IntegerHyperParameterRanges = S.Array(IntegerHyperParameterRange);
export class ContinuousHyperParameterRange extends S.Class<ContinuousHyperParameterRange>(
  "ContinuousHyperParameterRange",
)({
  name: S.optional(S.String),
  minValue: S.optional(S.Number),
  maxValue: S.optional(S.Number),
}) {}
export const ContinuousHyperParameterRanges = S.Array(
  ContinuousHyperParameterRange,
);
export class CategoricalHyperParameterRange extends S.Class<CategoricalHyperParameterRange>(
  "CategoricalHyperParameterRange",
)({ name: S.optional(S.String), values: S.optional(CategoricalValues) }) {}
export const CategoricalHyperParameterRanges = S.Array(
  CategoricalHyperParameterRange,
);
export class Campaign extends S.Class<Campaign>("Campaign")({
  name: S.optional(S.String),
  campaignArn: S.optional(S.String),
  solutionVersionArn: S.optional(S.String),
  minProvisionedTPS: S.optional(S.Number),
  campaignConfig: S.optional(CampaignConfig),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  latestCampaignUpdate: S.optional(CampaignUpdateSummary),
}) {}
export class Dataset extends S.Class<Dataset>("Dataset")({
  name: S.optional(S.String),
  datasetArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  datasetType: S.optional(S.String),
  schemaArn: S.optional(S.String),
  status: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  latestDatasetUpdate: S.optional(DatasetUpdateSummary),
  trackingId: S.optional(S.String),
}) {}
export class FeatureTransformation extends S.Class<FeatureTransformation>(
  "FeatureTransformation",
)({
  name: S.optional(S.String),
  featureTransformationArn: S.optional(S.String),
  defaultParameters: S.optional(FeaturizationParameters),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
}) {}
export class Recommender extends S.Class<Recommender>("Recommender")({
  recommenderArn: S.optional(S.String),
  datasetGroupArn: S.optional(S.String),
  name: S.optional(S.String),
  recipeArn: S.optional(S.String),
  recommenderConfig: S.optional(RecommenderConfig),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  latestRecommenderUpdate: S.optional(RecommenderUpdateSummary),
  modelMetrics: S.optional(Metrics),
}) {}
export class HyperParameterRanges extends S.Class<HyperParameterRanges>(
  "HyperParameterRanges",
)({
  integerHyperParameterRanges: S.optional(IntegerHyperParameterRanges),
  continuousHyperParameterRanges: S.optional(ContinuousHyperParameterRanges),
  categoricalHyperParameterRanges: S.optional(CategoricalHyperParameterRanges),
}) {}
export class HPOConfig extends S.Class<HPOConfig>("HPOConfig")({
  hpoObjective: S.optional(HPOObjective),
  hpoResourceConfig: S.optional(HPOResourceConfig),
  algorithmHyperParameterRanges: S.optional(HyperParameterRanges),
}) {}
export class SolutionConfig extends S.Class<SolutionConfig>("SolutionConfig")({
  eventValueThreshold: S.optional(S.String),
  hpoConfig: S.optional(HPOConfig),
  algorithmHyperParameters: S.optional(HyperParameters),
  featureTransformationParameters: S.optional(FeatureTransformationParameters),
  autoMLConfig: S.optional(AutoMLConfig),
  eventsConfig: S.optional(EventsConfig),
  optimizationObjective: S.optional(OptimizationObjective),
  trainingDataConfig: S.optional(TrainingDataConfig),
  autoTrainingConfig: S.optional(AutoTrainingConfig),
}) {}
export class Solution extends S.Class<Solution>("Solution")({
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
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  latestSolutionVersion: S.optional(SolutionVersionSummary),
  latestSolutionUpdate: S.optional(SolutionUpdateSummary),
}) {}
export class SolutionVersion extends S.Class<SolutionVersion>(
  "SolutionVersion",
)({
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
  trainingMode: S.optional(S.String),
  tunedHPOParams: S.optional(TunedHPOParams),
  status: S.optional(S.String),
  failureReason: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  trainingType: S.optional(S.String),
}) {}
export class DefaultIntegerHyperParameterRange extends S.Class<DefaultIntegerHyperParameterRange>(
  "DefaultIntegerHyperParameterRange",
)({
  name: S.optional(S.String),
  minValue: S.optional(S.Number),
  maxValue: S.optional(S.Number),
  isTunable: S.optional(S.Boolean),
}) {}
export const DefaultIntegerHyperParameterRanges = S.Array(
  DefaultIntegerHyperParameterRange,
);
export class DefaultContinuousHyperParameterRange extends S.Class<DefaultContinuousHyperParameterRange>(
  "DefaultContinuousHyperParameterRange",
)({
  name: S.optional(S.String),
  minValue: S.optional(S.Number),
  maxValue: S.optional(S.Number),
  isTunable: S.optional(S.Boolean),
}) {}
export const DefaultContinuousHyperParameterRanges = S.Array(
  DefaultContinuousHyperParameterRange,
);
export class DefaultCategoricalHyperParameterRange extends S.Class<DefaultCategoricalHyperParameterRange>(
  "DefaultCategoricalHyperParameterRange",
)({
  name: S.optional(S.String),
  values: S.optional(CategoricalValues),
  isTunable: S.optional(S.Boolean),
}) {}
export const DefaultCategoricalHyperParameterRanges = S.Array(
  DefaultCategoricalHyperParameterRange,
);
export class CreateBatchInferenceJobResponse extends S.Class<CreateBatchInferenceJobResponse>(
  "CreateBatchInferenceJobResponse",
)({ batchInferenceJobArn: S.optional(S.String) }) {}
export class CreateRecommenderRequest extends S.Class<CreateRecommenderRequest>(
  "CreateRecommenderRequest",
)(
  {
    name: S.String,
    datasetGroupArn: S.String,
    recipeArn: S.String,
    recommenderConfig: S.optional(RecommenderConfig),
    tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCampaignResponse extends S.Class<DescribeCampaignResponse>(
  "DescribeCampaignResponse",
)({ campaign: S.optional(Campaign) }) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({ dataset: S.optional(Dataset) }) {}
export class DescribeFeatureTransformationResponse extends S.Class<DescribeFeatureTransformationResponse>(
  "DescribeFeatureTransformationResponse",
)({ featureTransformation: S.optional(FeatureTransformation) }) {}
export class DescribeRecommenderResponse extends S.Class<DescribeRecommenderResponse>(
  "DescribeRecommenderResponse",
)({ recommender: S.optional(Recommender) }) {}
export class DescribeSolutionResponse extends S.Class<DescribeSolutionResponse>(
  "DescribeSolutionResponse",
)({ solution: S.optional(Solution) }) {}
export class DescribeSolutionVersionResponse extends S.Class<DescribeSolutionVersionResponse>(
  "DescribeSolutionVersionResponse",
)({ solutionVersion: S.optional(SolutionVersion) }) {}
export class DefaultHyperParameterRanges extends S.Class<DefaultHyperParameterRanges>(
  "DefaultHyperParameterRanges",
)({
  integerHyperParameterRanges: S.optional(DefaultIntegerHyperParameterRanges),
  continuousHyperParameterRanges: S.optional(
    DefaultContinuousHyperParameterRanges,
  ),
  categoricalHyperParameterRanges: S.optional(
    DefaultCategoricalHyperParameterRanges,
  ),
}) {}
export class Algorithm extends S.Class<Algorithm>("Algorithm")({
  name: S.optional(S.String),
  algorithmArn: S.optional(S.String),
  algorithmImage: S.optional(AlgorithmImage),
  defaultHyperParameters: S.optional(HyperParameters),
  defaultHyperParameterRanges: S.optional(DefaultHyperParameterRanges),
  defaultResourceConfig: S.optional(ResourceConfig),
  trainingInputMode: S.optional(S.String),
  roleArn: S.optional(S.String),
  creationDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CreateRecommenderResponse extends S.Class<CreateRecommenderResponse>(
  "CreateRecommenderResponse",
)({ recommenderArn: S.optional(S.String) }) {}
export class CreateSolutionRequest extends S.Class<CreateSolutionRequest>(
  "CreateSolutionRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAlgorithmResponse extends S.Class<DescribeAlgorithmResponse>(
  "DescribeAlgorithmResponse",
)({ algorithm: S.optional(Algorithm) }) {}
export class CreateSolutionResponse extends S.Class<CreateSolutionResponse>(
  "CreateSolutionResponse",
)({ solutionArn: S.optional(S.String) }) {}

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}
export class TooManyTagKeysException extends S.TaggedError<TooManyTagKeysException>()(
  "TooManyTagKeysException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  {},
) {}

//# Operations
/**
 * Deletes the event tracker. Does not delete the dataset from
 * the dataset group. For more
 * information on event trackers, see CreateEventTracker.
 */
export const deleteEventTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMetricAttribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMetricAttributionRequest,
    output: DeleteMetricAttributionResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deactivates and removes a recommender. A deleted recommender can no longer be specified in a GetRecommendations
 * request.
 */
export const deleteRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSolution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopSolutionVersionCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopSolutionVersionCreationRequest,
    output: StopSolutionVersionCreationResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const createDatasetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createEventTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaRequest,
  output: CreateSchemaResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
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
export const createSolutionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Removes a campaign by deleting the solution deployment. The solution that
 * the campaign is based on is not deleted and can be redeployed when needed. A deleted campaign can no
 * longer be specified in a
 * GetRecommendations
 * request.
 * For information on creating campaigns, see CreateCampaign.
 */
export const deleteCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCampaignRequest,
  output: DeleteCampaignResponse,
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
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetGroupRequest,
  output: DeleteDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Get a list of tags attached to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopRecommenderRequest,
  output: StopRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Add a list of tags to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the specified tags that are attached to a resource. For more information, see Removing tags from Amazon Personalize resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetRequest,
  output: UpdateDatasetResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a metric attribution.
 */
export const updateMetricAttribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMetricAttributionRequest,
    output: UpdateMetricAttributionResponse,
    errors: [
      InvalidInputException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the recommender to modify the recommender configuration.
 * If you update the recommender to modify the columns used in training, Amazon Personalize automatically starts a full retraining of
 * the models backing your recommender. While the update completes, you can still get recommendations from the recommender. The recommender
 * uses the previous configuration until the update completes.
 * To track the status of this update,
 * use the `latestRecommenderUpdate` returned in the DescribeRecommender
 * operation.
 */
export const updateRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRecommenderRequest,
  output: UpdateRecommenderResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a batch segment job. The operation can handle up to 50 million records and the
 * input file must be in JSON format. For more information, see
 * Getting batch recommendations and user segments.
 */
export const createBatchSegmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataDeletionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDatasetExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a metric attribution.
 * A metric attribution creates reports on the data that you import into Amazon Personalize. Depending on how you imported the data, you can view reports in Amazon CloudWatch or Amazon S3.
 * For more information, see Measuring impact of recommendations.
 */
export const createMetricAttribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMetricAttributionRequest,
    output: CreateMetricAttributionResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the properties of a batch inference job including name, Amazon Resource Name (ARN),
 * status, input and output configurations, and the ARN of the solution version used to generate
 * the recommendations.
 */
export const describeBatchInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBatchInferenceJobRequest,
    output: DescribeBatchInferenceJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Gets the properties of a batch segment job including name, Amazon Resource Name (ARN),
 * status, input and output configurations, and the ARN of the solution version used to generate
 * segments.
 */
export const describeBatchSegmentJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBatchSegmentJobRequest,
    output: DescribeBatchSegmentJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the data deletion job created by CreateDataDeletionJob, including the job status.
 */
export const describeDataDeletionJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDataDeletionJobRequest,
    output: DescribeDataDeletionJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the dataset export job created by CreateDatasetExportJob, including the export job status.
 */
export const describeDatasetExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDatasetExportJobRequest,
    output: DescribeDatasetExportJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the given dataset group. For more information on dataset
 * groups, see CreateDatasetGroup.
 */
export const describeDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDatasetGroupRequest,
    output: DescribeDatasetGroupResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the dataset import job created by CreateDatasetImportJob, including the import job status.
 */
export const describeDatasetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDatasetImportJobRequest,
    output: DescribeDatasetImportJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes an event tracker. The response includes the `trackingId` and
 * `status` of the event tracker.
 * For more information on event trackers, see CreateEventTracker.
 */
export const describeEventTracker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventTrackerRequest,
    output: DescribeEventTrackerResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes a filter's properties.
 */
export const describeFilter = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFilterRequest,
  output: DescribeFilterResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a metric attribution.
 */
export const describeMetricAttribution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMetricAttributionRequest,
    output: DescribeMetricAttributionResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
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
export const describeRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecipeRequest,
  output: DescribeRecipeResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a schema. For more information on schemas, see
 * CreateSchema.
 */
export const describeSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSchemaRequest,
  output: DescribeSchemaResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Gets the metrics for the specified solution version.
 */
export const getSolutionMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSolutionMetricsRequest,
  output: GetSolutionMetricsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets a list of the batch inference jobs that have been performed off of a solution
 * version.
 */
export const listBatchInferenceJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBatchInferenceJobsRequest,
    output: ListBatchInferenceJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Gets a list of the batch segment jobs that have been performed off of a solution
 * version that you specify.
 */
export const listBatchSegmentJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBatchSegmentJobsRequest,
    output: ListBatchSegmentJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of campaigns that use the given solution.
 * When a solution is not specified, all the campaigns associated with the account are listed.
 * The response provides the properties for each campaign, including the Amazon Resource Name (ARN).
 * For more information on campaigns, see CreateCampaign.
 */
export const listCampaigns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCampaignsRequest,
  output: ListCampaignsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
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
export const listDataDeletionJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataDeletionJobsRequest,
    output: ListDataDeletionJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of dataset export jobs that use the given dataset. When
 * a dataset is not specified, all the dataset export jobs associated with
 * the account are listed. The response provides the properties for each
 * dataset export job, including the Amazon Resource Name (ARN). For more
 * information on dataset export jobs, see CreateDatasetExportJob. For more information on datasets, see
 * CreateDataset.
 */
export const listDatasetExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDatasetExportJobsRequest,
    output: ListDatasetExportJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of dataset groups. The response provides the properties
 * for each dataset group, including the Amazon Resource Name (ARN). For more
 * information on dataset groups, see CreateDatasetGroup.
 */
export const listDatasetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetGroupsRequest,
  output: ListDatasetGroupsResponse,
  errors: [InvalidNextTokenException],
}));
/**
 * Returns a list of dataset import jobs that use the given dataset. When
 * a dataset is not specified, all the dataset import jobs associated with
 * the account are listed. The response provides the properties for each
 * dataset import job, including the Amazon Resource Name (ARN). For more
 * information on dataset import jobs, see CreateDatasetImportJob. For more information on datasets, see
 * CreateDataset.
 */
export const listDatasetImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDatasetImportJobsRequest,
    output: ListDatasetImportJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns the list of datasets contained in the given dataset group. The
 * response provides the properties for each dataset, including the Amazon
 * Resource Name (ARN). For more information on datasets, see CreateDataset.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns the list of event trackers associated with the account.
 * The response provides the properties for each event tracker, including the Amazon Resource
 * Name (ARN) and tracking ID. For more
 * information on event trackers, see CreateEventTracker.
 */
export const listEventTrackers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventTrackersRequest,
  output: ListEventTrackersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Lists all filters that belong to a given dataset group.
 */
export const listFilters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFiltersRequest,
  output: ListFiltersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Lists the metrics for the metric attribution.
 */
export const listMetricAttributionMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListMetricAttributionMetricsRequest,
    output: ListMetricAttributionMetricsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }));
/**
 * Lists metric attributions.
 */
export const listMetricAttributions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMetricAttributionsRequest,
    output: ListMetricAttributionsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of available recipes. The response provides the properties
 * for each recipe, including the recipe's Amazon Resource Name (ARN).
 */
export const listRecipes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecipesRequest,
  output: ListRecipesResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of recommenders in a given Domain dataset group.
 * When a Domain dataset group is not specified, all the recommenders associated with the account are listed.
 * The response provides the properties for each recommender, including the Amazon Resource Name (ARN).
 * For more information on recommenders, see CreateRecommender.
 */
export const listRecommenders = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecommendersRequest,
  output: ListRecommendersResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns the list of schemas associated with the account. The response provides the
 * properties for each schema, including the Amazon Resource Name (ARN).
 * For more information on schemas, see CreateSchema.
 */
export const listSchemas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [InvalidNextTokenException],
}));
/**
 * Returns a list of solutions in a given dataset group.
 * When a dataset group is not specified, all the solutions associated with the account are listed.
 * The response provides the properties for each solution, including the Amazon Resource Name (ARN).
 * For more information on solutions, see CreateSolution.
 */
export const listSolutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSolutionsRequest,
  output: ListSolutionsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of solution versions for the given solution. When a solution is not
 * specified, all the solution versions associated with the account are listed. The response
 * provides the properties for each solution version, including the Amazon Resource Name (ARN).
 */
export const listSolutionVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSolutionVersionsRequest,
    output: ListSolutionVersionsResponse,
    errors: [
      InvalidInputException,
      InvalidNextTokenException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const updateSolution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBatchInferenceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const describeCampaign = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCampaignRequest,
  output: DescribeCampaignResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given dataset. For more information on datasets, see
 * CreateDataset.
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes the given feature transformation.
 */
export const describeFeatureTransformation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRecommenderRequest,
  output: DescribeRecommenderResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a solution.
 * For more information on solutions, see CreateSolution.
 */
export const describeSolution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSolutionRequest,
  output: DescribeSolutionResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a specific version of a solution. For more information on solutions, see CreateSolution
 */
export const describeSolutionVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSolutionVersionRequest,
    output: DescribeSolutionVersionResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
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
export const createRecommender = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAlgorithm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlgorithmRequest,
  output: DescribeAlgorithmResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
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
export const createSolution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
