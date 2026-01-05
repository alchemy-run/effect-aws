import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "imagebuilder",
  serviceShapeName: "imagebuilder",
});
const auth = T.AwsAuthSigv4({ name: "imagebuilder" });
const ver = T.ServiceVersion("2019-12-02");
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
                        url: "https://imagebuilder-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://imagebuilder.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://imagebuilder-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://imagebuilder.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://imagebuilder.{Region}.{PartitionResult#dnsSuffix}",
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
export const OsVersionList = S.Array(S.String);
export const InstanceTypeList = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CancelImageCreationRequest extends S.Class<CancelImageCreationRequest>(
  "CancelImageCreationRequest",
)(
  { imageBuildVersionArn: S.String, clientToken: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/CancelImageCreation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelLifecycleExecutionRequest extends S.Class<CancelLifecycleExecutionRequest>(
  "CancelLifecycleExecutionRequest",
)(
  { lifecycleExecutionId: S.String, clientToken: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/CancelLifecycleExecution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateWorkflowRequest extends S.Class<CreateWorkflowRequest>(
  "CreateWorkflowRequest",
)(
  {
    name: S.String,
    semanticVersion: S.String,
    description: S.optional(S.String),
    changeDescription: S.optional(S.String),
    data: S.optional(S.String),
    uri: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
    type: S.String,
    dryRun: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateWorkflow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentRequest extends S.Class<DeleteComponentRequest>(
  "DeleteComponentRequest",
)(
  {
    componentBuildVersionArn: S.String.pipe(
      T.HttpQuery("componentBuildVersionArn"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteComponent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteContainerRecipeRequest extends S.Class<DeleteContainerRecipeRequest>(
  "DeleteContainerRecipeRequest",
)(
  { containerRecipeArn: S.String.pipe(T.HttpQuery("containerRecipeArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteContainerRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDistributionConfigurationRequest extends S.Class<DeleteDistributionConfigurationRequest>(
  "DeleteDistributionConfigurationRequest",
)(
  {
    distributionConfigurationArn: S.String.pipe(
      T.HttpQuery("distributionConfigurationArn"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteDistributionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImageRequest extends S.Class<DeleteImageRequest>(
  "DeleteImageRequest",
)(
  { imageBuildVersionArn: S.String.pipe(T.HttpQuery("imageBuildVersionArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImagePipelineRequest extends S.Class<DeleteImagePipelineRequest>(
  "DeleteImagePipelineRequest",
)(
  { imagePipelineArn: S.String.pipe(T.HttpQuery("imagePipelineArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteImagePipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteImageRecipeRequest extends S.Class<DeleteImageRecipeRequest>(
  "DeleteImageRecipeRequest",
)(
  { imageRecipeArn: S.String.pipe(T.HttpQuery("imageRecipeArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteImageRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInfrastructureConfigurationRequest extends S.Class<DeleteInfrastructureConfigurationRequest>(
  "DeleteInfrastructureConfigurationRequest",
)(
  {
    infrastructureConfigurationArn: S.String.pipe(
      T.HttpQuery("infrastructureConfigurationArn"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteInfrastructureConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteLifecyclePolicyRequest extends S.Class<DeleteLifecyclePolicyRequest>(
  "DeleteLifecyclePolicyRequest",
)(
  { lifecyclePolicyArn: S.String.pipe(T.HttpQuery("lifecyclePolicyArn")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteLifecyclePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  {
    workflowBuildVersionArn: S.String.pipe(
      T.HttpQuery("workflowBuildVersionArn"),
    ),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/DeleteWorkflow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImageLoggingConfiguration extends S.Class<ImageLoggingConfiguration>(
  "ImageLoggingConfiguration",
)({ logGroupName: S.optional(S.String) }) {}
export class DistributeImageRequest extends S.Class<DistributeImageRequest>(
  "DistributeImageRequest",
)(
  {
    sourceImage: S.String,
    distributionConfigurationArn: S.String,
    executionRole: S.String,
    tags: S.optional(TagMap),
    clientToken: S.String,
    loggingConfiguration: S.optional(ImageLoggingConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/DistributeImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentRequest extends S.Class<GetComponentRequest>(
  "GetComponentRequest",
)(
  {
    componentBuildVersionArn: S.String.pipe(
      T.HttpQuery("componentBuildVersionArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/GetComponent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentPolicyRequest extends S.Class<GetComponentPolicyRequest>(
  "GetComponentPolicyRequest",
)(
  { componentArn: S.String.pipe(T.HttpQuery("componentArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetComponentPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerRecipeRequest extends S.Class<GetContainerRecipeRequest>(
  "GetContainerRecipeRequest",
)(
  { containerRecipeArn: S.String.pipe(T.HttpQuery("containerRecipeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetContainerRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetContainerRecipePolicyRequest extends S.Class<GetContainerRecipePolicyRequest>(
  "GetContainerRecipePolicyRequest",
)(
  { containerRecipeArn: S.String.pipe(T.HttpQuery("containerRecipeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetContainerRecipePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDistributionConfigurationRequest extends S.Class<GetDistributionConfigurationRequest>(
  "GetDistributionConfigurationRequest",
)(
  {
    distributionConfigurationArn: S.String.pipe(
      T.HttpQuery("distributionConfigurationArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/GetDistributionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImageRequest extends S.Class<GetImageRequest>(
  "GetImageRequest",
)(
  { imageBuildVersionArn: S.String.pipe(T.HttpQuery("imageBuildVersionArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImagePipelineRequest extends S.Class<GetImagePipelineRequest>(
  "GetImagePipelineRequest",
)(
  { imagePipelineArn: S.String.pipe(T.HttpQuery("imagePipelineArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetImagePipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImagePolicyRequest extends S.Class<GetImagePolicyRequest>(
  "GetImagePolicyRequest",
)(
  { imageArn: S.String.pipe(T.HttpQuery("imageArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetImagePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImageRecipeRequest extends S.Class<GetImageRecipeRequest>(
  "GetImageRecipeRequest",
)(
  { imageRecipeArn: S.String.pipe(T.HttpQuery("imageRecipeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetImageRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImageRecipePolicyRequest extends S.Class<GetImageRecipePolicyRequest>(
  "GetImageRecipePolicyRequest",
)(
  { imageRecipeArn: S.String.pipe(T.HttpQuery("imageRecipeArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetImageRecipePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetInfrastructureConfigurationRequest extends S.Class<GetInfrastructureConfigurationRequest>(
  "GetInfrastructureConfigurationRequest",
)(
  {
    infrastructureConfigurationArn: S.String.pipe(
      T.HttpQuery("infrastructureConfigurationArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/GetInfrastructureConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLifecycleExecutionRequest extends S.Class<GetLifecycleExecutionRequest>(
  "GetLifecycleExecutionRequest",
)(
  { lifecycleExecutionId: S.String.pipe(T.HttpQuery("lifecycleExecutionId")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetLifecycleExecution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLifecyclePolicyRequest extends S.Class<GetLifecyclePolicyRequest>(
  "GetLifecyclePolicyRequest",
)(
  { lifecyclePolicyArn: S.String.pipe(T.HttpQuery("lifecyclePolicyArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetLifecyclePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMarketplaceResourceRequest extends S.Class<GetMarketplaceResourceRequest>(
  "GetMarketplaceResourceRequest",
)(
  {
    resourceType: S.String,
    resourceArn: S.String,
    resourceLocation: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetMarketplaceResource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowRequest extends S.Class<GetWorkflowRequest>(
  "GetWorkflowRequest",
)(
  {
    workflowBuildVersionArn: S.String.pipe(
      T.HttpQuery("workflowBuildVersionArn"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/GetWorkflow" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowExecutionRequest extends S.Class<GetWorkflowExecutionRequest>(
  "GetWorkflowExecutionRequest",
)(
  { workflowExecutionId: S.String.pipe(T.HttpQuery("workflowExecutionId")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetWorkflowExecution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowStepExecutionRequest extends S.Class<GetWorkflowStepExecutionRequest>(
  "GetWorkflowStepExecutionRequest",
)(
  { stepExecutionId: S.String.pipe(T.HttpQuery("stepExecutionId")) },
  T.all(
    T.Http({ method: "GET", uri: "/GetWorkflowStepExecution" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportComponentRequest extends S.Class<ImportComponentRequest>(
  "ImportComponentRequest",
)(
  {
    name: S.String,
    semanticVersion: S.String,
    description: S.optional(S.String),
    changeDescription: S.optional(S.String),
    type: S.String,
    format: S.String,
    platform: S.String,
    data: S.optional(S.String),
    uri: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/ImportComponent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportDiskImageRequest extends S.Class<ImportDiskImageRequest>(
  "ImportDiskImageRequest",
)(
  {
    name: S.String,
    semanticVersion: S.String,
    description: S.optional(S.String),
    platform: S.String,
    osVersion: S.String,
    executionRole: S.optional(S.String),
    infrastructureConfigurationArn: S.String,
    uri: S.String,
    loggingConfiguration: S.optional(ImageLoggingConfiguration),
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/ImportDiskImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImportVmImageRequest extends S.Class<ImportVmImageRequest>(
  "ImportVmImageRequest",
)(
  {
    name: S.String,
    semanticVersion: S.String,
    description: S.optional(S.String),
    platform: S.String,
    osVersion: S.optional(S.String),
    vmImportTaskId: S.String,
    loggingConfiguration: S.optional(ImageLoggingConfiguration),
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/ImportVmImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListComponentBuildVersionsRequest extends S.Class<ListComponentBuildVersionsRequest>(
  "ListComponentBuildVersionsRequest",
)(
  {
    componentVersionArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListComponentBuildVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FilterValues = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  name: S.optional(S.String),
  values: S.optional(FilterValues),
}) {}
export const FilterList = S.Array(Filter);
export class ListContainerRecipesRequest extends S.Class<ListContainerRecipesRequest>(
  "ListContainerRecipesRequest",
)(
  {
    owner: S.optional(S.String),
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListContainerRecipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDistributionConfigurationsRequest extends S.Class<ListDistributionConfigurationsRequest>(
  "ListDistributionConfigurationsRequest",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListDistributionConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImageBuildVersionsRequest extends S.Class<ListImageBuildVersionsRequest>(
  "ListImageBuildVersionsRequest",
)(
  {
    imageVersionArn: S.optional(S.String),
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImageBuildVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImagePackagesRequest extends S.Class<ListImagePackagesRequest>(
  "ListImagePackagesRequest",
)(
  {
    imageBuildVersionArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImagePackages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImagePipelineImagesRequest extends S.Class<ListImagePipelineImagesRequest>(
  "ListImagePipelineImagesRequest",
)(
  {
    imagePipelineArn: S.String,
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImagePipelineImages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImagePipelinesRequest extends S.Class<ListImagePipelinesRequest>(
  "ListImagePipelinesRequest",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImagePipelines" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImageRecipesRequest extends S.Class<ListImageRecipesRequest>(
  "ListImageRecipesRequest",
)(
  {
    owner: S.optional(S.String),
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImageRecipes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImagesRequest extends S.Class<ListImagesRequest>(
  "ListImagesRequest",
)(
  {
    owner: S.optional(S.String),
    filters: S.optional(FilterList),
    byName: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    includeDeprecated: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImages" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImageScanFindingAggregationsRequest extends S.Class<ListImageScanFindingAggregationsRequest>(
  "ListImageScanFindingAggregationsRequest",
)(
  { filter: S.optional(Filter), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListImageScanFindingAggregations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInfrastructureConfigurationsRequest extends S.Class<ListInfrastructureConfigurationsRequest>(
  "ListInfrastructureConfigurationsRequest",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListInfrastructureConfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLifecycleExecutionResourcesRequest extends S.Class<ListLifecycleExecutionResourcesRequest>(
  "ListLifecycleExecutionResourcesRequest",
)(
  {
    lifecycleExecutionId: S.String,
    parentResourceId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListLifecycleExecutionResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLifecycleExecutionsRequest extends S.Class<ListLifecycleExecutionsRequest>(
  "ListLifecycleExecutionsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    resourceArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListLifecycleExecutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLifecyclePoliciesRequest extends S.Class<ListLifecyclePoliciesRequest>(
  "ListLifecyclePoliciesRequest",
)(
  {
    filters: S.optional(FilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListLifecyclePolicies" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWaitingWorkflowStepsRequest extends S.Class<ListWaitingWorkflowStepsRequest>(
  "ListWaitingWorkflowStepsRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/ListWaitingWorkflowSteps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowBuildVersionsRequest extends S.Class<ListWorkflowBuildVersionsRequest>(
  "ListWorkflowBuildVersionsRequest",
)(
  {
    workflowVersionArn: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListWorkflowBuildVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowExecutionsRequest extends S.Class<ListWorkflowExecutionsRequest>(
  "ListWorkflowExecutionsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    imageBuildVersionArn: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListWorkflowExecutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  {
    owner: S.optional(S.String),
    filters: S.optional(FilterList),
    byName: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListWorkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowStepExecutionsRequest extends S.Class<ListWorkflowStepExecutionsRequest>(
  "ListWorkflowStepExecutionsRequest",
)(
  {
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    workflowExecutionId: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListWorkflowStepExecutions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutComponentPolicyRequest extends S.Class<PutComponentPolicyRequest>(
  "PutComponentPolicyRequest",
)(
  { componentArn: S.String, policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/PutComponentPolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutContainerRecipePolicyRequest extends S.Class<PutContainerRecipePolicyRequest>(
  "PutContainerRecipePolicyRequest",
)(
  { containerRecipeArn: S.String, policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/PutContainerRecipePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutImagePolicyRequest extends S.Class<PutImagePolicyRequest>(
  "PutImagePolicyRequest",
)(
  { imageArn: S.String, policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/PutImagePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutImageRecipePolicyRequest extends S.Class<PutImageRecipePolicyRequest>(
  "PutImageRecipePolicyRequest",
)(
  { imageRecipeArn: S.String, policy: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/PutImageRecipePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetryImageRequest extends S.Class<RetryImageRequest>(
  "RetryImageRequest",
)(
  { imageBuildVersionArn: S.String, clientToken: S.String },
  T.all(
    T.Http({ method: "PUT", uri: "/RetryImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SendWorkflowStepActionRequest extends S.Class<SendWorkflowStepActionRequest>(
  "SendWorkflowStepActionRequest",
)(
  {
    stepExecutionId: S.String,
    imageBuildVersionArn: S.String,
    action: S.String,
    reason: S.optional(S.String),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/SendWorkflowStepAction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartImagePipelineExecutionRequest extends S.Class<StartImagePipelineExecutionRequest>(
  "StartImagePipelineExecutionRequest",
)(
  {
    imagePipelineArn: S.String,
    clientToken: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/StartImagePipelineExecution" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export const AccountList = S.Array(S.String);
export const StringList = S.Array(S.String);
export const OrganizationArnList = S.Array(S.String);
export const OrganizationalUnitArnList = S.Array(S.String);
export class LaunchPermissionConfiguration extends S.Class<LaunchPermissionConfiguration>(
  "LaunchPermissionConfiguration",
)({
  userIds: S.optional(AccountList),
  userGroups: S.optional(StringList),
  organizationArns: S.optional(OrganizationArnList),
  organizationalUnitArns: S.optional(OrganizationalUnitArnList),
}) {}
export class AmiDistributionConfiguration extends S.Class<AmiDistributionConfiguration>(
  "AmiDistributionConfiguration",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  targetAccountIds: S.optional(AccountList),
  amiTags: S.optional(TagMap),
  kmsKeyId: S.optional(S.String),
  launchPermission: S.optional(LaunchPermissionConfiguration),
}) {}
export class TargetContainerRepository extends S.Class<TargetContainerRepository>(
  "TargetContainerRepository",
)({ service: S.String, repositoryName: S.String }) {}
export class ContainerDistributionConfiguration extends S.Class<ContainerDistributionConfiguration>(
  "ContainerDistributionConfiguration",
)({
  description: S.optional(S.String),
  containerTags: S.optional(StringList),
  targetRepository: TargetContainerRepository,
}) {}
export const LicenseConfigurationArnList = S.Array(S.String);
export class LaunchTemplateConfiguration extends S.Class<LaunchTemplateConfiguration>(
  "LaunchTemplateConfiguration",
)({
  launchTemplateId: S.String,
  accountId: S.optional(S.String),
  setDefaultVersion: S.optional(S.Boolean),
}) {}
export const LaunchTemplateConfigurationList = S.Array(
  LaunchTemplateConfiguration,
);
export class S3ExportConfiguration extends S.Class<S3ExportConfiguration>(
  "S3ExportConfiguration",
)({
  roleName: S.String,
  diskImageFormat: S.String,
  s3Bucket: S.String,
  s3Prefix: S.optional(S.String),
}) {}
export class FastLaunchSnapshotConfiguration extends S.Class<FastLaunchSnapshotConfiguration>(
  "FastLaunchSnapshotConfiguration",
)({ targetResourceCount: S.optional(S.Number) }) {}
export class FastLaunchLaunchTemplateSpecification extends S.Class<FastLaunchLaunchTemplateSpecification>(
  "FastLaunchLaunchTemplateSpecification",
)({
  launchTemplateId: S.optional(S.String),
  launchTemplateName: S.optional(S.String),
  launchTemplateVersion: S.optional(S.String),
}) {}
export class FastLaunchConfiguration extends S.Class<FastLaunchConfiguration>(
  "FastLaunchConfiguration",
)({
  enabled: S.Boolean,
  snapshotConfiguration: S.optional(FastLaunchSnapshotConfiguration),
  maxParallelLaunches: S.optional(S.Number),
  launchTemplate: S.optional(FastLaunchLaunchTemplateSpecification),
  accountId: S.optional(S.String),
}) {}
export const FastLaunchConfigurationList = S.Array(FastLaunchConfiguration);
export class SsmParameterConfiguration extends S.Class<SsmParameterConfiguration>(
  "SsmParameterConfiguration",
)({
  amiAccountId: S.optional(S.String),
  parameterName: S.String,
  dataType: S.optional(S.String),
}) {}
export const SsmParameterConfigurationList = S.Array(SsmParameterConfiguration);
export class Distribution extends S.Class<Distribution>("Distribution")({
  region: S.String,
  amiDistributionConfiguration: S.optional(AmiDistributionConfiguration),
  containerDistributionConfiguration: S.optional(
    ContainerDistributionConfiguration,
  ),
  licenseConfigurationArns: S.optional(LicenseConfigurationArnList),
  launchTemplateConfigurations: S.optional(LaunchTemplateConfigurationList),
  s3ExportConfiguration: S.optional(S3ExportConfiguration),
  fastLaunchConfigurations: S.optional(FastLaunchConfigurationList),
  ssmParameterConfigurations: S.optional(SsmParameterConfigurationList),
}) {}
export const DistributionList = S.Array(Distribution);
export class UpdateDistributionConfigurationRequest extends S.Class<UpdateDistributionConfigurationRequest>(
  "UpdateDistributionConfigurationRequest",
)(
  {
    distributionConfigurationArn: S.String,
    description: S.optional(S.String),
    distributions: DistributionList,
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/UpdateDistributionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImageTestsConfiguration extends S.Class<ImageTestsConfiguration>(
  "ImageTestsConfiguration",
)({
  imageTestsEnabled: S.optional(S.Boolean),
  timeoutMinutes: S.optional(S.Number),
}) {}
export class AutoDisablePolicy extends S.Class<AutoDisablePolicy>(
  "AutoDisablePolicy",
)({ failureCount: S.Number }) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
  scheduleExpression: S.optional(S.String),
  timezone: S.optional(S.String),
  pipelineExecutionStartCondition: S.optional(S.String),
  autoDisablePolicy: S.optional(AutoDisablePolicy),
}) {}
export class EcrConfiguration extends S.Class<EcrConfiguration>(
  "EcrConfiguration",
)({
  repositoryName: S.optional(S.String),
  containerTags: S.optional(StringList),
}) {}
export class ImageScanningConfiguration extends S.Class<ImageScanningConfiguration>(
  "ImageScanningConfiguration",
)({
  imageScanningEnabled: S.optional(S.Boolean),
  ecrConfiguration: S.optional(EcrConfiguration),
}) {}
export const WorkflowParameterValueList = S.Array(S.String);
export class WorkflowParameter extends S.Class<WorkflowParameter>(
  "WorkflowParameter",
)({ name: S.String, value: WorkflowParameterValueList }) {}
export const WorkflowParameterList = S.Array(WorkflowParameter);
export class WorkflowConfiguration extends S.Class<WorkflowConfiguration>(
  "WorkflowConfiguration",
)({
  workflowArn: S.String,
  parameters: S.optional(WorkflowParameterList),
  parallelGroup: S.optional(S.String),
  onFailure: S.optional(S.String),
}) {}
export const WorkflowConfigurationList = S.Array(WorkflowConfiguration);
export class PipelineLoggingConfiguration extends S.Class<PipelineLoggingConfiguration>(
  "PipelineLoggingConfiguration",
)({
  imageLogGroupName: S.optional(S.String),
  pipelineLogGroupName: S.optional(S.String),
}) {}
export class UpdateImagePipelineRequest extends S.Class<UpdateImagePipelineRequest>(
  "UpdateImagePipelineRequest",
)(
  {
    imagePipelineArn: S.String,
    description: S.optional(S.String),
    imageRecipeArn: S.optional(S.String),
    containerRecipeArn: S.optional(S.String),
    infrastructureConfigurationArn: S.String,
    distributionConfigurationArn: S.optional(S.String),
    imageTestsConfiguration: S.optional(ImageTestsConfiguration),
    enhancedImageMetadataEnabled: S.optional(S.Boolean),
    schedule: S.optional(Schedule),
    status: S.optional(S.String),
    clientToken: S.String,
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
    workflows: S.optional(WorkflowConfigurationList),
    loggingConfiguration: S.optional(PipelineLoggingConfiguration),
    executionRole: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/UpdateImagePipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class S3Logs extends S.Class<S3Logs>("S3Logs")({
  s3BucketName: S.optional(S.String),
  s3KeyPrefix: S.optional(S.String),
}) {}
export class Logging extends S.Class<Logging>("Logging")({
  s3Logs: S.optional(S3Logs),
}) {}
export const ResourceTagMap = S.Record({ key: S.String, value: S.String });
export class InstanceMetadataOptions extends S.Class<InstanceMetadataOptions>(
  "InstanceMetadataOptions",
)({
  httpTokens: S.optional(S.String),
  httpPutResponseHopLimit: S.optional(S.Number),
}) {}
export class Placement extends S.Class<Placement>("Placement")({
  availabilityZone: S.optional(S.String),
  tenancy: S.optional(S.String),
  hostId: S.optional(S.String),
  hostResourceGroupArn: S.optional(S.String),
}) {}
export class UpdateInfrastructureConfigurationRequest extends S.Class<UpdateInfrastructureConfigurationRequest>(
  "UpdateInfrastructureConfigurationRequest",
)(
  {
    infrastructureConfigurationArn: S.String,
    description: S.optional(S.String),
    instanceTypes: S.optional(InstanceTypeList),
    instanceProfileName: S.String,
    securityGroupIds: S.optional(SecurityGroupIds),
    subnetId: S.optional(S.String),
    logging: S.optional(Logging),
    keyPair: S.optional(S.String),
    terminateInstanceOnFailure: S.optional(S.Boolean),
    snsTopicArn: S.optional(S.String),
    resourceTags: S.optional(ResourceTagMap),
    instanceMetadataOptions: S.optional(InstanceMetadataOptions),
    placement: S.optional(Placement),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/UpdateInfrastructureConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class LifecyclePolicyDetailActionIncludeResources extends S.Class<LifecyclePolicyDetailActionIncludeResources>(
  "LifecyclePolicyDetailActionIncludeResources",
)({
  amis: S.optional(S.Boolean),
  snapshots: S.optional(S.Boolean),
  containers: S.optional(S.Boolean),
}) {}
export class LifecyclePolicyDetailAction extends S.Class<LifecyclePolicyDetailAction>(
  "LifecyclePolicyDetailAction",
)({
  type: S.String,
  includeResources: S.optional(LifecyclePolicyDetailActionIncludeResources),
}) {}
export class LifecyclePolicyDetailFilter extends S.Class<LifecyclePolicyDetailFilter>(
  "LifecyclePolicyDetailFilter",
)({
  type: S.String,
  value: S.Number,
  unit: S.optional(S.String),
  retainAtLeast: S.optional(S.Number),
}) {}
export class LifecyclePolicyDetailExclusionRulesAmisLastLaunched extends S.Class<LifecyclePolicyDetailExclusionRulesAmisLastLaunched>(
  "LifecyclePolicyDetailExclusionRulesAmisLastLaunched",
)({ value: S.Number, unit: S.String }) {}
export class LifecyclePolicyDetailExclusionRulesAmis extends S.Class<LifecyclePolicyDetailExclusionRulesAmis>(
  "LifecyclePolicyDetailExclusionRulesAmis",
)({
  isPublic: S.optional(S.Boolean),
  regions: S.optional(StringList),
  sharedAccounts: S.optional(AccountList),
  lastLaunched: S.optional(LifecyclePolicyDetailExclusionRulesAmisLastLaunched),
  tagMap: S.optional(TagMap),
}) {}
export class LifecyclePolicyDetailExclusionRules extends S.Class<LifecyclePolicyDetailExclusionRules>(
  "LifecyclePolicyDetailExclusionRules",
)({
  tagMap: S.optional(TagMap),
  amis: S.optional(LifecyclePolicyDetailExclusionRulesAmis),
}) {}
export class LifecyclePolicyDetail extends S.Class<LifecyclePolicyDetail>(
  "LifecyclePolicyDetail",
)({
  action: LifecyclePolicyDetailAction,
  filter: LifecyclePolicyDetailFilter,
  exclusionRules: S.optional(LifecyclePolicyDetailExclusionRules),
}) {}
export const LifecyclePolicyDetails = S.Array(LifecyclePolicyDetail);
export class LifecyclePolicyResourceSelectionRecipe extends S.Class<LifecyclePolicyResourceSelectionRecipe>(
  "LifecyclePolicyResourceSelectionRecipe",
)({ name: S.String, semanticVersion: S.String }) {}
export const LifecyclePolicyResourceSelectionRecipes = S.Array(
  LifecyclePolicyResourceSelectionRecipe,
);
export class LifecyclePolicyResourceSelection extends S.Class<LifecyclePolicyResourceSelection>(
  "LifecyclePolicyResourceSelection",
)({
  recipes: S.optional(LifecyclePolicyResourceSelectionRecipes),
  tagMap: S.optional(TagMap),
}) {}
export class UpdateLifecyclePolicyRequest extends S.Class<UpdateLifecyclePolicyRequest>(
  "UpdateLifecyclePolicyRequest",
)(
  {
    lifecyclePolicyArn: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
    executionRole: S.String,
    resourceType: S.String,
    policyDetails: LifecyclePolicyDetails,
    resourceSelection: LifecyclePolicyResourceSelection,
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/UpdateLifecyclePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ImageScanFindingsFilterValues = S.Array(S.String);
export class EbsInstanceBlockDeviceSpecification extends S.Class<EbsInstanceBlockDeviceSpecification>(
  "EbsInstanceBlockDeviceSpecification",
)({
  encrypted: S.optional(S.Boolean),
  deleteOnTermination: S.optional(S.Boolean),
  iops: S.optional(S.Number),
  kmsKeyId: S.optional(S.String),
  snapshotId: S.optional(S.String),
  volumeSize: S.optional(S.Number),
  volumeType: S.optional(S.String),
  throughput: S.optional(S.Number),
}) {}
export class InstanceBlockDeviceMapping extends S.Class<InstanceBlockDeviceMapping>(
  "InstanceBlockDeviceMapping",
)({
  deviceName: S.optional(S.String),
  ebs: S.optional(EbsInstanceBlockDeviceSpecification),
  virtualName: S.optional(S.String),
  noDevice: S.optional(S.String),
}) {}
export const InstanceBlockDeviceMappings = S.Array(InstanceBlockDeviceMapping);
export class InstanceConfiguration extends S.Class<InstanceConfiguration>(
  "InstanceConfiguration",
)({
  image: S.optional(S.String),
  blockDeviceMappings: S.optional(InstanceBlockDeviceMappings),
}) {}
export class ImagePipeline extends S.Class<ImagePipeline>("ImagePipeline")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  platform: S.optional(S.String),
  enhancedImageMetadataEnabled: S.optional(S.Boolean),
  imageRecipeArn: S.optional(S.String),
  containerRecipeArn: S.optional(S.String),
  infrastructureConfigurationArn: S.optional(S.String),
  distributionConfigurationArn: S.optional(S.String),
  imageTestsConfiguration: S.optional(ImageTestsConfiguration),
  schedule: S.optional(Schedule),
  status: S.optional(S.String),
  dateCreated: S.optional(S.String),
  dateUpdated: S.optional(S.String),
  dateLastRun: S.optional(S.String),
  lastRunStatus: S.optional(S.String),
  dateNextRun: S.optional(S.String),
  tags: S.optional(TagMap),
  imageScanningConfiguration: S.optional(ImageScanningConfiguration),
  executionRole: S.optional(S.String),
  workflows: S.optional(WorkflowConfigurationList),
  loggingConfiguration: S.optional(PipelineLoggingConfiguration),
  consecutiveFailures: S.optional(S.Number),
}) {}
export const ImagePipelineList = S.Array(ImagePipeline);
export class ImageScanFindingsFilter extends S.Class<ImageScanFindingsFilter>(
  "ImageScanFindingsFilter",
)({
  name: S.optional(S.String),
  values: S.optional(ImageScanFindingsFilterValues),
}) {}
export const ImageScanFindingsFilterList = S.Array(ImageScanFindingsFilter);
export class LifecycleExecutionResourcesImpactedSummary extends S.Class<LifecycleExecutionResourcesImpactedSummary>(
  "LifecycleExecutionResourcesImpactedSummary",
)({ hasImpactedResources: S.optional(S.Boolean) }) {}
export class LifecycleExecutionState extends S.Class<LifecycleExecutionState>(
  "LifecycleExecutionState",
)({ status: S.optional(S.String), reason: S.optional(S.String) }) {}
export class LifecycleExecution extends S.Class<LifecycleExecution>(
  "LifecycleExecution",
)({
  lifecycleExecutionId: S.optional(S.String),
  lifecyclePolicyArn: S.optional(S.String),
  resourcesImpactedSummary: S.optional(
    LifecycleExecutionResourcesImpactedSummary,
  ),
  state: S.optional(LifecycleExecutionState),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LifecycleExecutionsList = S.Array(LifecycleExecution);
export class ResourceState extends S.Class<ResourceState>("ResourceState")({
  status: S.optional(S.String),
}) {}
export class ResourceStateUpdateIncludeResources extends S.Class<ResourceStateUpdateIncludeResources>(
  "ResourceStateUpdateIncludeResources",
)({
  amis: S.optional(S.Boolean),
  snapshots: S.optional(S.Boolean),
  containers: S.optional(S.Boolean),
}) {}
export const ComponentParameterValueList = S.Array(S.String);
export class CancelImageCreationResponse extends S.Class<CancelImageCreationResponse>(
  "CancelImageCreationResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class CancelLifecycleExecutionResponse extends S.Class<CancelLifecycleExecutionResponse>(
  "CancelLifecycleExecutionResponse",
)({ lifecycleExecutionId: S.optional(S.String) }) {}
export class CreateComponentRequest extends S.Class<CreateComponentRequest>(
  "CreateComponentRequest",
)(
  {
    name: S.String,
    semanticVersion: S.String,
    description: S.optional(S.String),
    changeDescription: S.optional(S.String),
    platform: S.String,
    supportedOsVersions: S.optional(OsVersionList),
    data: S.optional(S.String),
    uri: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
    dryRun: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateComponent" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComponentResponse extends S.Class<DeleteComponentResponse>(
  "DeleteComponentResponse",
)({
  requestId: S.optional(S.String),
  componentBuildVersionArn: S.optional(S.String),
}) {}
export class DeleteContainerRecipeResponse extends S.Class<DeleteContainerRecipeResponse>(
  "DeleteContainerRecipeResponse",
)({
  requestId: S.optional(S.String),
  containerRecipeArn: S.optional(S.String),
}) {}
export class DeleteDistributionConfigurationResponse extends S.Class<DeleteDistributionConfigurationResponse>(
  "DeleteDistributionConfigurationResponse",
)({
  requestId: S.optional(S.String),
  distributionConfigurationArn: S.optional(S.String),
}) {}
export class DeleteImageResponse extends S.Class<DeleteImageResponse>(
  "DeleteImageResponse",
)({
  requestId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class DeleteImagePipelineResponse extends S.Class<DeleteImagePipelineResponse>(
  "DeleteImagePipelineResponse",
)({
  requestId: S.optional(S.String),
  imagePipelineArn: S.optional(S.String),
}) {}
export class DeleteImageRecipeResponse extends S.Class<DeleteImageRecipeResponse>(
  "DeleteImageRecipeResponse",
)({ requestId: S.optional(S.String), imageRecipeArn: S.optional(S.String) }) {}
export class DeleteInfrastructureConfigurationResponse extends S.Class<DeleteInfrastructureConfigurationResponse>(
  "DeleteInfrastructureConfigurationResponse",
)({
  requestId: S.optional(S.String),
  infrastructureConfigurationArn: S.optional(S.String),
}) {}
export class DeleteLifecyclePolicyResponse extends S.Class<DeleteLifecyclePolicyResponse>(
  "DeleteLifecyclePolicyResponse",
)({ lifecyclePolicyArn: S.optional(S.String) }) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({ workflowBuildVersionArn: S.optional(S.String) }) {}
export class DistributeImageResponse extends S.Class<DistributeImageResponse>(
  "DistributeImageResponse",
)({
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class GetComponentPolicyResponse extends S.Class<GetComponentPolicyResponse>(
  "GetComponentPolicyResponse",
)({ requestId: S.optional(S.String), policy: S.optional(S.String) }) {}
export class GetContainerRecipePolicyResponse extends S.Class<GetContainerRecipePolicyResponse>(
  "GetContainerRecipePolicyResponse",
)({ requestId: S.optional(S.String), policy: S.optional(S.String) }) {}
export class GetImagePolicyResponse extends S.Class<GetImagePolicyResponse>(
  "GetImagePolicyResponse",
)({ requestId: S.optional(S.String), policy: S.optional(S.String) }) {}
export class GetImageRecipePolicyResponse extends S.Class<GetImageRecipePolicyResponse>(
  "GetImageRecipePolicyResponse",
)({ requestId: S.optional(S.String), policy: S.optional(S.String) }) {}
export class GetMarketplaceResourceResponse extends S.Class<GetMarketplaceResourceResponse>(
  "GetMarketplaceResourceResponse",
)({
  resourceArn: S.optional(S.String),
  url: S.optional(S.String),
  data: S.optional(S.String),
}) {}
export class GetWorkflowExecutionResponse extends S.Class<GetWorkflowExecutionResponse>(
  "GetWorkflowExecutionResponse",
)({
  requestId: S.optional(S.String),
  workflowBuildVersionArn: S.optional(S.String),
  workflowExecutionId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  message: S.optional(S.String),
  totalStepCount: S.optional(S.Number),
  totalStepsSucceeded: S.optional(S.Number),
  totalStepsFailed: S.optional(S.Number),
  totalStepsSkipped: S.optional(S.Number),
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
  parallelGroup: S.optional(S.String),
}) {}
export class GetWorkflowStepExecutionResponse extends S.Class<GetWorkflowStepExecutionResponse>(
  "GetWorkflowStepExecutionResponse",
)({
  requestId: S.optional(S.String),
  stepExecutionId: S.optional(S.String),
  workflowBuildVersionArn: S.optional(S.String),
  workflowExecutionId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  action: S.optional(S.String),
  status: S.optional(S.String),
  rollbackStatus: S.optional(S.String),
  message: S.optional(S.String),
  inputs: S.optional(S.String),
  outputs: S.optional(S.String),
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
  onFailure: S.optional(S.String),
  timeoutSeconds: S.optional(S.Number),
}) {}
export class ImportComponentResponse extends S.Class<ImportComponentResponse>(
  "ImportComponentResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  componentBuildVersionArn: S.optional(S.String),
}) {}
export class ImportDiskImageResponse extends S.Class<ImportDiskImageResponse>(
  "ImportDiskImageResponse",
)({
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class ImportVmImageResponse extends S.Class<ImportVmImageResponse>(
  "ImportVmImageResponse",
)({
  requestId: S.optional(S.String),
  imageArn: S.optional(S.String),
  clientToken: S.optional(S.String),
}) {}
export class ListComponentsRequest extends S.Class<ListComponentsRequest>(
  "ListComponentsRequest",
)(
  {
    owner: S.optional(S.String),
    filters: S.optional(FilterList),
    byName: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListComponents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ImageState extends S.Class<ImageState>("ImageState")({
  status: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export class Ami extends S.Class<Ami>("Ami")({
  region: S.optional(S.String),
  image: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  state: S.optional(ImageState),
  accountId: S.optional(S.String),
}) {}
export const AmiList = S.Array(Ami);
export class Container extends S.Class<Container>("Container")({
  region: S.optional(S.String),
  imageUris: S.optional(StringList),
}) {}
export const ContainerList = S.Array(Container);
export class OutputResources extends S.Class<OutputResources>(
  "OutputResources",
)({ amis: S.optional(AmiList), containers: S.optional(ContainerList) }) {}
export class ImageSummary extends S.Class<ImageSummary>("ImageSummary")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  version: S.optional(S.String),
  platform: S.optional(S.String),
  osVersion: S.optional(S.String),
  state: S.optional(ImageState),
  owner: S.optional(S.String),
  dateCreated: S.optional(S.String),
  outputResources: S.optional(OutputResources),
  tags: S.optional(TagMap),
  buildType: S.optional(S.String),
  imageSource: S.optional(S.String),
  deprecationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleExecutionId: S.optional(S.String),
  loggingConfiguration: S.optional(ImageLoggingConfiguration),
}) {}
export const ImageSummaryList = S.Array(ImageSummary);
export class ListImagePipelineImagesResponse extends S.Class<ListImagePipelineImagesResponse>(
  "ListImagePipelineImagesResponse",
)({
  requestId: S.optional(S.String),
  imageSummaryList: S.optional(ImageSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListImagePipelinesResponse extends S.Class<ListImagePipelinesResponse>(
  "ListImagePipelinesResponse",
)({
  requestId: S.optional(S.String),
  imagePipelineList: S.optional(ImagePipelineList),
  nextToken: S.optional(S.String),
}) {}
export class ListImageScanFindingsRequest extends S.Class<ListImageScanFindingsRequest>(
  "ListImageScanFindingsRequest",
)(
  {
    filters: S.optional(ImageScanFindingsFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ListImageScanFindings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListLifecycleExecutionsResponse extends S.Class<ListLifecycleExecutionsResponse>(
  "ListLifecycleExecutionsResponse",
)({
  lifecycleExecutions: S.optional(LifecycleExecutionsList),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class PutComponentPolicyResponse extends S.Class<PutComponentPolicyResponse>(
  "PutComponentPolicyResponse",
)({ requestId: S.optional(S.String), componentArn: S.optional(S.String) }) {}
export class PutContainerRecipePolicyResponse extends S.Class<PutContainerRecipePolicyResponse>(
  "PutContainerRecipePolicyResponse",
)({
  requestId: S.optional(S.String),
  containerRecipeArn: S.optional(S.String),
}) {}
export class PutImagePolicyResponse extends S.Class<PutImagePolicyResponse>(
  "PutImagePolicyResponse",
)({ requestId: S.optional(S.String), imageArn: S.optional(S.String) }) {}
export class PutImageRecipePolicyResponse extends S.Class<PutImageRecipePolicyResponse>(
  "PutImageRecipePolicyResponse",
)({ requestId: S.optional(S.String), imageRecipeArn: S.optional(S.String) }) {}
export class RetryImageResponse extends S.Class<RetryImageResponse>(
  "RetryImageResponse",
)({
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class SendWorkflowStepActionResponse extends S.Class<SendWorkflowStepActionResponse>(
  "SendWorkflowStepActionResponse",
)({
  stepExecutionId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  clientToken: S.optional(S.String),
}) {}
export class StartImagePipelineExecutionResponse extends S.Class<StartImagePipelineExecutionResponse>(
  "StartImagePipelineExecutionResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
}) {}
export class UpdateDistributionConfigurationResponse extends S.Class<UpdateDistributionConfigurationResponse>(
  "UpdateDistributionConfigurationResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  distributionConfigurationArn: S.optional(S.String),
}) {}
export class UpdateImagePipelineResponse extends S.Class<UpdateImagePipelineResponse>(
  "UpdateImagePipelineResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imagePipelineArn: S.optional(S.String),
}) {}
export class UpdateInfrastructureConfigurationResponse extends S.Class<UpdateInfrastructureConfigurationResponse>(
  "UpdateInfrastructureConfigurationResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  infrastructureConfigurationArn: S.optional(S.String),
}) {}
export class UpdateLifecyclePolicyResponse extends S.Class<UpdateLifecyclePolicyResponse>(
  "UpdateLifecyclePolicyResponse",
)({ lifecyclePolicyArn: S.optional(S.String) }) {}
export class ComponentParameter extends S.Class<ComponentParameter>(
  "ComponentParameter",
)({ name: S.String, value: ComponentParameterValueList }) {}
export const ComponentParameterList = S.Array(ComponentParameter);
export class SystemsManagerAgent extends S.Class<SystemsManagerAgent>(
  "SystemsManagerAgent",
)({ uninstallAfterBuild: S.optional(S.Boolean) }) {}
export const RegionList = S.Array(S.String);
export class ComponentConfiguration extends S.Class<ComponentConfiguration>(
  "ComponentConfiguration",
)({ componentArn: S.String, parameters: S.optional(ComponentParameterList) }) {}
export const ComponentConfigurationList = S.Array(ComponentConfiguration);
export class AdditionalInstanceConfiguration extends S.Class<AdditionalInstanceConfiguration>(
  "AdditionalInstanceConfiguration",
)({
  systemsManagerAgent: S.optional(SystemsManagerAgent),
  userDataOverride: S.optional(S.String),
}) {}
export class LatestVersionReferences extends S.Class<LatestVersionReferences>(
  "LatestVersionReferences",
)({
  latestVersionArn: S.optional(S.String),
  latestMajorVersionArn: S.optional(S.String),
  latestMinorVersionArn: S.optional(S.String),
  latestPatchVersionArn: S.optional(S.String),
}) {}
export class ContainerRecipe extends S.Class<ContainerRecipe>(
  "ContainerRecipe",
)({
  arn: S.optional(S.String),
  containerType: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  platform: S.optional(S.String),
  owner: S.optional(S.String),
  version: S.optional(S.String),
  components: S.optional(ComponentConfigurationList),
  instanceConfiguration: S.optional(InstanceConfiguration),
  dockerfileTemplateData: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  encrypted: S.optional(S.Boolean),
  parentImage: S.optional(S.String),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
  workingDirectory: S.optional(S.String),
  targetRepository: S.optional(TargetContainerRepository),
}) {}
export class DistributionConfiguration extends S.Class<DistributionConfiguration>(
  "DistributionConfiguration",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  distributions: S.optional(DistributionList),
  timeoutMinutes: S.Number,
  dateCreated: S.optional(S.String),
  dateUpdated: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class ImageRecipe extends S.Class<ImageRecipe>("ImageRecipe")({
  arn: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  platform: S.optional(S.String),
  owner: S.optional(S.String),
  version: S.optional(S.String),
  components: S.optional(ComponentConfigurationList),
  parentImage: S.optional(S.String),
  blockDeviceMappings: S.optional(InstanceBlockDeviceMappings),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
  workingDirectory: S.optional(S.String),
  additionalInstanceConfiguration: S.optional(AdditionalInstanceConfiguration),
  amiTags: S.optional(TagMap),
}) {}
export class InfrastructureConfiguration extends S.Class<InfrastructureConfiguration>(
  "InfrastructureConfiguration",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  instanceTypes: S.optional(InstanceTypeList),
  instanceProfileName: S.optional(S.String),
  securityGroupIds: S.optional(SecurityGroupIds),
  subnetId: S.optional(S.String),
  logging: S.optional(Logging),
  keyPair: S.optional(S.String),
  terminateInstanceOnFailure: S.optional(S.Boolean),
  snsTopicArn: S.optional(S.String),
  dateCreated: S.optional(S.String),
  dateUpdated: S.optional(S.String),
  resourceTags: S.optional(ResourceTagMap),
  instanceMetadataOptions: S.optional(InstanceMetadataOptions),
  tags: S.optional(TagMap),
  placement: S.optional(Placement),
}) {}
export class LifecyclePolicy extends S.Class<LifecyclePolicy>(
  "LifecyclePolicy",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  executionRole: S.optional(S.String),
  resourceType: S.optional(S.String),
  policyDetails: S.optional(LifecyclePolicyDetails),
  resourceSelection: S.optional(LifecyclePolicyResourceSelection),
  dateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dateLastRun: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export class ComponentState extends S.Class<ComponentState>("ComponentState")({
  status: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export class ComponentSummary extends S.Class<ComponentSummary>(
  "ComponentSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  platform: S.optional(S.String),
  supportedOsVersions: S.optional(OsVersionList),
  state: S.optional(ComponentState),
  type: S.optional(S.String),
  owner: S.optional(S.String),
  description: S.optional(S.String),
  changeDescription: S.optional(S.String),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
  publisher: S.optional(S.String),
  obfuscate: S.optional(S.Boolean),
}) {}
export const ComponentSummaryList = S.Array(ComponentSummary);
export class ContainerRecipeSummary extends S.Class<ContainerRecipeSummary>(
  "ContainerRecipeSummary",
)({
  arn: S.optional(S.String),
  containerType: S.optional(S.String),
  name: S.optional(S.String),
  platform: S.optional(S.String),
  owner: S.optional(S.String),
  parentImage: S.optional(S.String),
  dateCreated: S.optional(S.String),
  instanceImage: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const ContainerRecipeSummaryList = S.Array(ContainerRecipeSummary);
export class DistributionConfigurationSummary extends S.Class<DistributionConfigurationSummary>(
  "DistributionConfigurationSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  dateCreated: S.optional(S.String),
  dateUpdated: S.optional(S.String),
  tags: S.optional(TagMap),
  regions: S.optional(RegionList),
}) {}
export const DistributionConfigurationSummaryList = S.Array(
  DistributionConfigurationSummary,
);
export class ImagePackage extends S.Class<ImagePackage>("ImagePackage")({
  packageName: S.optional(S.String),
  packageVersion: S.optional(S.String),
}) {}
export const ImagePackageList = S.Array(ImagePackage);
export class ImageRecipeSummary extends S.Class<ImageRecipeSummary>(
  "ImageRecipeSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  platform: S.optional(S.String),
  owner: S.optional(S.String),
  parentImage: S.optional(S.String),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const ImageRecipeSummaryList = S.Array(ImageRecipeSummary);
export class ImageVersion extends S.Class<ImageVersion>("ImageVersion")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  type: S.optional(S.String),
  version: S.optional(S.String),
  platform: S.optional(S.String),
  osVersion: S.optional(S.String),
  owner: S.optional(S.String),
  dateCreated: S.optional(S.String),
  buildType: S.optional(S.String),
  imageSource: S.optional(S.String),
}) {}
export const ImageVersionList = S.Array(ImageVersion);
export class InfrastructureConfigurationSummary extends S.Class<InfrastructureConfigurationSummary>(
  "InfrastructureConfigurationSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  dateCreated: S.optional(S.String),
  dateUpdated: S.optional(S.String),
  resourceTags: S.optional(ResourceTagMap),
  tags: S.optional(TagMap),
  instanceTypes: S.optional(InstanceTypeList),
  instanceProfileName: S.optional(S.String),
  placement: S.optional(Placement),
}) {}
export const InfrastructureConfigurationSummaryList = S.Array(
  InfrastructureConfigurationSummary,
);
export class LifecyclePolicySummary extends S.Class<LifecyclePolicySummary>(
  "LifecyclePolicySummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  executionRole: S.optional(S.String),
  resourceType: S.optional(S.String),
  dateCreated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dateUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  dateLastRun: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export const LifecyclePolicySummaryList = S.Array(LifecyclePolicySummary);
export class WorkflowStepExecution extends S.Class<WorkflowStepExecution>(
  "WorkflowStepExecution",
)({
  stepExecutionId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  workflowExecutionId: S.optional(S.String),
  workflowBuildVersionArn: S.optional(S.String),
  name: S.optional(S.String),
  action: S.optional(S.String),
  startTime: S.optional(S.String),
}) {}
export const WorkflowStepExecutionList = S.Array(WorkflowStepExecution);
export class WorkflowState extends S.Class<WorkflowState>("WorkflowState")({
  status: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export class WorkflowSummary extends S.Class<WorkflowSummary>(
  "WorkflowSummary",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  description: S.optional(S.String),
  changeDescription: S.optional(S.String),
  type: S.optional(S.String),
  owner: S.optional(S.String),
  state: S.optional(WorkflowState),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const WorkflowSummaryList = S.Array(WorkflowSummary);
export class WorkflowExecutionMetadata extends S.Class<WorkflowExecutionMetadata>(
  "WorkflowExecutionMetadata",
)({
  workflowBuildVersionArn: S.optional(S.String),
  workflowExecutionId: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  message: S.optional(S.String),
  totalStepCount: S.optional(S.Number),
  totalStepsSucceeded: S.optional(S.Number),
  totalStepsFailed: S.optional(S.Number),
  totalStepsSkipped: S.optional(S.Number),
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
  parallelGroup: S.optional(S.String),
  retried: S.optional(S.Boolean),
}) {}
export const WorkflowExecutionsList = S.Array(WorkflowExecutionMetadata);
export class WorkflowVersion extends S.Class<WorkflowVersion>(
  "WorkflowVersion",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  owner: S.optional(S.String),
  dateCreated: S.optional(S.String),
}) {}
export const WorkflowVersionList = S.Array(WorkflowVersion);
export class WorkflowStepMetadata extends S.Class<WorkflowStepMetadata>(
  "WorkflowStepMetadata",
)({
  stepExecutionId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  action: S.optional(S.String),
  status: S.optional(S.String),
  rollbackStatus: S.optional(S.String),
  message: S.optional(S.String),
  inputs: S.optional(S.String),
  outputs: S.optional(S.String),
  startTime: S.optional(S.String),
  endTime: S.optional(S.String),
}) {}
export const WorkflowStepExecutionsList = S.Array(WorkflowStepMetadata);
export class CreateComponentResponse extends S.Class<CreateComponentResponse>(
  "CreateComponentResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  componentBuildVersionArn: S.optional(S.String),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class CreateContainerRecipeRequest extends S.Class<CreateContainerRecipeRequest>(
  "CreateContainerRecipeRequest",
)(
  {
    containerType: S.String,
    name: S.String,
    description: S.optional(S.String),
    semanticVersion: S.String,
    components: S.optional(ComponentConfigurationList),
    instanceConfiguration: S.optional(InstanceConfiguration),
    dockerfileTemplateData: S.optional(S.String),
    dockerfileTemplateUri: S.optional(S.String),
    platformOverride: S.optional(S.String),
    imageOsVersionOverride: S.optional(S.String),
    parentImage: S.String,
    tags: S.optional(TagMap),
    workingDirectory: S.optional(S.String),
    targetRepository: TargetContainerRepository,
    kmsKeyId: S.optional(S.String),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateContainerRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateImageRequest extends S.Class<CreateImageRequest>(
  "CreateImageRequest",
)(
  {
    imageRecipeArn: S.optional(S.String),
    containerRecipeArn: S.optional(S.String),
    distributionConfigurationArn: S.optional(S.String),
    infrastructureConfigurationArn: S.String,
    imageTestsConfiguration: S.optional(ImageTestsConfiguration),
    enhancedImageMetadataEnabled: S.optional(S.Boolean),
    tags: S.optional(TagMap),
    clientToken: S.String,
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
    workflows: S.optional(WorkflowConfigurationList),
    executionRole: S.optional(S.String),
    loggingConfiguration: S.optional(ImageLoggingConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateImage" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateImagePipelineRequest extends S.Class<CreateImagePipelineRequest>(
  "CreateImagePipelineRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    imageRecipeArn: S.optional(S.String),
    containerRecipeArn: S.optional(S.String),
    infrastructureConfigurationArn: S.String,
    distributionConfigurationArn: S.optional(S.String),
    imageTestsConfiguration: S.optional(ImageTestsConfiguration),
    enhancedImageMetadataEnabled: S.optional(S.Boolean),
    schedule: S.optional(Schedule),
    status: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.String,
    imageScanningConfiguration: S.optional(ImageScanningConfiguration),
    workflows: S.optional(WorkflowConfigurationList),
    executionRole: S.optional(S.String),
    loggingConfiguration: S.optional(PipelineLoggingConfiguration),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateImagePipeline" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateImageRecipeRequest extends S.Class<CreateImageRecipeRequest>(
  "CreateImageRecipeRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    semanticVersion: S.String,
    components: S.optional(ComponentConfigurationList),
    parentImage: S.String,
    blockDeviceMappings: S.optional(InstanceBlockDeviceMappings),
    tags: S.optional(TagMap),
    workingDirectory: S.optional(S.String),
    additionalInstanceConfiguration: S.optional(
      AdditionalInstanceConfiguration,
    ),
    amiTags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateImageRecipe" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateInfrastructureConfigurationRequest extends S.Class<CreateInfrastructureConfigurationRequest>(
  "CreateInfrastructureConfigurationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    instanceTypes: S.optional(InstanceTypeList),
    instanceProfileName: S.String,
    securityGroupIds: S.optional(SecurityGroupIds),
    subnetId: S.optional(S.String),
    logging: S.optional(Logging),
    keyPair: S.optional(S.String),
    terminateInstanceOnFailure: S.optional(S.Boolean),
    snsTopicArn: S.optional(S.String),
    resourceTags: S.optional(ResourceTagMap),
    instanceMetadataOptions: S.optional(InstanceMetadataOptions),
    tags: S.optional(TagMap),
    placement: S.optional(Placement),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateInfrastructureConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkflowResponse extends S.Class<CreateWorkflowResponse>(
  "CreateWorkflowResponse",
)({
  clientToken: S.optional(S.String),
  workflowBuildVersionArn: S.optional(S.String),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class GetContainerRecipeResponse extends S.Class<GetContainerRecipeResponse>(
  "GetContainerRecipeResponse",
)({
  requestId: S.optional(S.String),
  containerRecipe: S.optional(ContainerRecipe),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class GetDistributionConfigurationResponse extends S.Class<GetDistributionConfigurationResponse>(
  "GetDistributionConfigurationResponse",
)({
  requestId: S.optional(S.String),
  distributionConfiguration: S.optional(DistributionConfiguration),
}) {}
export class GetImagePipelineResponse extends S.Class<GetImagePipelineResponse>(
  "GetImagePipelineResponse",
)({
  requestId: S.optional(S.String),
  imagePipeline: S.optional(ImagePipeline),
}) {}
export class GetImageRecipeResponse extends S.Class<GetImageRecipeResponse>(
  "GetImageRecipeResponse",
)({
  requestId: S.optional(S.String),
  imageRecipe: S.optional(ImageRecipe),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class GetInfrastructureConfigurationResponse extends S.Class<GetInfrastructureConfigurationResponse>(
  "GetInfrastructureConfigurationResponse",
)({
  requestId: S.optional(S.String),
  infrastructureConfiguration: S.optional(InfrastructureConfiguration),
}) {}
export class GetLifecyclePolicyResponse extends S.Class<GetLifecyclePolicyResponse>(
  "GetLifecyclePolicyResponse",
)({ lifecyclePolicy: S.optional(LifecyclePolicy) }) {}
export class ListComponentBuildVersionsResponse extends S.Class<ListComponentBuildVersionsResponse>(
  "ListComponentBuildVersionsResponse",
)({
  requestId: S.optional(S.String),
  componentSummaryList: S.optional(ComponentSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListContainerRecipesResponse extends S.Class<ListContainerRecipesResponse>(
  "ListContainerRecipesResponse",
)({
  requestId: S.optional(S.String),
  containerRecipeSummaryList: S.optional(ContainerRecipeSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListDistributionConfigurationsResponse extends S.Class<ListDistributionConfigurationsResponse>(
  "ListDistributionConfigurationsResponse",
)({
  requestId: S.optional(S.String),
  distributionConfigurationSummaryList: S.optional(
    DistributionConfigurationSummaryList,
  ),
  nextToken: S.optional(S.String),
}) {}
export class ListImageBuildVersionsResponse extends S.Class<ListImageBuildVersionsResponse>(
  "ListImageBuildVersionsResponse",
)({
  requestId: S.optional(S.String),
  imageSummaryList: S.optional(ImageSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListImagePackagesResponse extends S.Class<ListImagePackagesResponse>(
  "ListImagePackagesResponse",
)({
  requestId: S.optional(S.String),
  imagePackageList: S.optional(ImagePackageList),
  nextToken: S.optional(S.String),
}) {}
export class ListImageRecipesResponse extends S.Class<ListImageRecipesResponse>(
  "ListImageRecipesResponse",
)({
  requestId: S.optional(S.String),
  imageRecipeSummaryList: S.optional(ImageRecipeSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListImagesResponse extends S.Class<ListImagesResponse>(
  "ListImagesResponse",
)({
  requestId: S.optional(S.String),
  imageVersionList: S.optional(ImageVersionList),
  nextToken: S.optional(S.String),
}) {}
export class ListInfrastructureConfigurationsResponse extends S.Class<ListInfrastructureConfigurationsResponse>(
  "ListInfrastructureConfigurationsResponse",
)({
  requestId: S.optional(S.String),
  infrastructureConfigurationSummaryList: S.optional(
    InfrastructureConfigurationSummaryList,
  ),
  nextToken: S.optional(S.String),
}) {}
export class ListLifecyclePoliciesResponse extends S.Class<ListLifecyclePoliciesResponse>(
  "ListLifecyclePoliciesResponse",
)({
  lifecyclePolicySummaryList: S.optional(LifecyclePolicySummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListWaitingWorkflowStepsResponse extends S.Class<ListWaitingWorkflowStepsResponse>(
  "ListWaitingWorkflowStepsResponse",
)({
  steps: S.optional(WorkflowStepExecutionList),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkflowBuildVersionsResponse extends S.Class<ListWorkflowBuildVersionsResponse>(
  "ListWorkflowBuildVersionsResponse",
)({
  workflowSummaryList: S.optional(WorkflowSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkflowExecutionsResponse extends S.Class<ListWorkflowExecutionsResponse>(
  "ListWorkflowExecutionsResponse",
)({
  requestId: S.optional(S.String),
  workflowExecutions: S.optional(WorkflowExecutionsList),
  imageBuildVersionArn: S.optional(S.String),
  message: S.optional(S.String),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({
  workflowVersionList: S.optional(WorkflowVersionList),
  nextToken: S.optional(S.String),
}) {}
export class ListWorkflowStepExecutionsResponse extends S.Class<ListWorkflowStepExecutionsResponse>(
  "ListWorkflowStepExecutionsResponse",
)({
  requestId: S.optional(S.String),
  steps: S.optional(WorkflowStepExecutionsList),
  workflowBuildVersionArn: S.optional(S.String),
  workflowExecutionId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  message: S.optional(S.String),
  nextToken: S.optional(S.String),
}) {}
export class ComponentParameterDetail extends S.Class<ComponentParameterDetail>(
  "ComponentParameterDetail",
)({
  name: S.String,
  type: S.String,
  defaultValue: S.optional(ComponentParameterValueList),
  description: S.optional(S.String),
}) {}
export const ComponentParameterDetailList = S.Array(ComponentParameterDetail);
export class ProductCodeListItem extends S.Class<ProductCodeListItem>(
  "ProductCodeListItem",
)({ productCodeId: S.String, productCodeType: S.String }) {}
export const ProductCodeList = S.Array(ProductCodeListItem);
export class ImageScanState extends S.Class<ImageScanState>("ImageScanState")({
  status: S.optional(S.String),
  reason: S.optional(S.String),
}) {}
export class WorkflowParameterDetail extends S.Class<WorkflowParameterDetail>(
  "WorkflowParameterDetail",
)({
  name: S.String,
  type: S.String,
  defaultValue: S.optional(WorkflowParameterValueList),
  description: S.optional(S.String),
}) {}
export const WorkflowParameterDetailList = S.Array(WorkflowParameterDetail);
export class SeverityCounts extends S.Class<SeverityCounts>("SeverityCounts")({
  all: S.optional(S.Number),
  critical: S.optional(S.Number),
  high: S.optional(S.Number),
  medium: S.optional(S.Number),
}) {}
export class ImageAggregation extends S.Class<ImageAggregation>(
  "ImageAggregation",
)({
  imageBuildVersionArn: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class ImagePipelineAggregation extends S.Class<ImagePipelineAggregation>(
  "ImagePipelineAggregation",
)({
  imagePipelineArn: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class VulnerabilityIdAggregation extends S.Class<VulnerabilityIdAggregation>(
  "VulnerabilityIdAggregation",
)({
  vulnerabilityId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class LifecycleExecutionResourceState extends S.Class<LifecycleExecutionResourceState>(
  "LifecycleExecutionResourceState",
)({ status: S.optional(S.String), reason: S.optional(S.String) }) {}
export class LifecycleExecutionResourceAction extends S.Class<LifecycleExecutionResourceAction>(
  "LifecycleExecutionResourceAction",
)({ name: S.optional(S.String), reason: S.optional(S.String) }) {}
export class LifecycleExecutionSnapshotResource extends S.Class<LifecycleExecutionSnapshotResource>(
  "LifecycleExecutionSnapshotResource",
)({
  snapshotId: S.optional(S.String),
  state: S.optional(LifecycleExecutionResourceState),
}) {}
export const LifecycleExecutionSnapshotResourceList = S.Array(
  LifecycleExecutionSnapshotResource,
);
export class Component extends S.Class<Component>("Component")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  description: S.optional(S.String),
  changeDescription: S.optional(S.String),
  type: S.optional(S.String),
  platform: S.optional(S.String),
  supportedOsVersions: S.optional(OsVersionList),
  state: S.optional(ComponentState),
  parameters: S.optional(ComponentParameterDetailList),
  owner: S.optional(S.String),
  data: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  encrypted: S.optional(S.Boolean),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
  publisher: S.optional(S.String),
  obfuscate: S.optional(S.Boolean),
  productCodes: S.optional(ProductCodeList),
}) {}
export class Workflow extends S.Class<Workflow>("Workflow")({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  description: S.optional(S.String),
  changeDescription: S.optional(S.String),
  type: S.optional(S.String),
  state: S.optional(WorkflowState),
  owner: S.optional(S.String),
  data: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  dateCreated: S.optional(S.String),
  tags: S.optional(TagMap),
  parameters: S.optional(WorkflowParameterDetailList),
}) {}
export class ComponentVersion extends S.Class<ComponentVersion>(
  "ComponentVersion",
)({
  arn: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  description: S.optional(S.String),
  platform: S.optional(S.String),
  supportedOsVersions: S.optional(OsVersionList),
  type: S.optional(S.String),
  owner: S.optional(S.String),
  dateCreated: S.optional(S.String),
  status: S.optional(S.String),
  productCodes: S.optional(ProductCodeList),
}) {}
export const ComponentVersionList = S.Array(ComponentVersion);
export class LifecycleExecutionResource extends S.Class<LifecycleExecutionResource>(
  "LifecycleExecutionResource",
)({
  accountId: S.optional(S.String),
  resourceId: S.optional(S.String),
  state: S.optional(LifecycleExecutionResourceState),
  action: S.optional(LifecycleExecutionResourceAction),
  region: S.optional(S.String),
  snapshots: S.optional(LifecycleExecutionSnapshotResourceList),
  imageUris: S.optional(StringList),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LifecycleExecutionResourceList = S.Array(
  LifecycleExecutionResource,
);
export class ResourceStateUpdateExclusionRules extends S.Class<ResourceStateUpdateExclusionRules>(
  "ResourceStateUpdateExclusionRules",
)({ amis: S.optional(LifecyclePolicyDetailExclusionRulesAmis) }) {}
export const VulnerabilityIdList = S.Array(S.String);
export const NonEmptyStringList = S.Array(S.String);
export class CreateContainerRecipeResponse extends S.Class<CreateContainerRecipeResponse>(
  "CreateContainerRecipeResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  containerRecipeArn: S.optional(S.String),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class CreateDistributionConfigurationRequest extends S.Class<CreateDistributionConfigurationRequest>(
  "CreateDistributionConfigurationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    distributions: DistributionList,
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateDistributionConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateImageResponse extends S.Class<CreateImageResponse>(
  "CreateImageResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class CreateImagePipelineResponse extends S.Class<CreateImagePipelineResponse>(
  "CreateImagePipelineResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imagePipelineArn: S.optional(S.String),
}) {}
export class CreateImageRecipeResponse extends S.Class<CreateImageRecipeResponse>(
  "CreateImageRecipeResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  imageRecipeArn: S.optional(S.String),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class CreateInfrastructureConfigurationResponse extends S.Class<CreateInfrastructureConfigurationResponse>(
  "CreateInfrastructureConfigurationResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  infrastructureConfigurationArn: S.optional(S.String),
}) {}
export class CreateLifecyclePolicyRequest extends S.Class<CreateLifecyclePolicyRequest>(
  "CreateLifecyclePolicyRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
    executionRole: S.String,
    resourceType: S.String,
    policyDetails: LifecyclePolicyDetails,
    resourceSelection: LifecyclePolicyResourceSelection,
    tags: S.optional(TagMap),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/CreateLifecyclePolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetComponentResponse extends S.Class<GetComponentResponse>(
  "GetComponentResponse",
)({
  requestId: S.optional(S.String),
  component: S.optional(Component),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class GetLifecycleExecutionResponse extends S.Class<GetLifecycleExecutionResponse>(
  "GetLifecycleExecutionResponse",
)({ lifecycleExecution: S.optional(LifecycleExecution) }) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({
  workflow: S.optional(Workflow),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class ListComponentsResponse extends S.Class<ListComponentsResponse>(
  "ListComponentsResponse",
)({
  requestId: S.optional(S.String),
  componentVersionList: S.optional(ComponentVersionList),
  nextToken: S.optional(S.String),
}) {}
export class ListLifecycleExecutionResourcesResponse extends S.Class<ListLifecycleExecutionResourcesResponse>(
  "ListLifecycleExecutionResourcesResponse",
)({
  lifecycleExecutionId: S.optional(S.String),
  lifecycleExecutionState: S.optional(LifecycleExecutionState),
  resources: S.optional(LifecycleExecutionResourceList),
  nextToken: S.optional(S.String),
}) {}
export class StartResourceStateUpdateRequest extends S.Class<StartResourceStateUpdateRequest>(
  "StartResourceStateUpdateRequest",
)(
  {
    resourceArn: S.String,
    state: ResourceState,
    executionRole: S.optional(S.String),
    includeResources: S.optional(ResourceStateUpdateIncludeResources),
    exclusionRules: S.optional(ResourceStateUpdateExclusionRules),
    updateAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/StartResourceStateUpdate" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccountAggregation extends S.Class<AccountAggregation>(
  "AccountAggregation",
)({
  accountId: S.optional(S.String),
  severityCounts: S.optional(SeverityCounts),
}) {}
export class Image extends S.Class<Image>("Image")({
  arn: S.optional(S.String),
  type: S.optional(S.String),
  name: S.optional(S.String),
  version: S.optional(S.String),
  platform: S.optional(S.String),
  enhancedImageMetadataEnabled: S.optional(S.Boolean),
  osVersion: S.optional(S.String),
  state: S.optional(ImageState),
  imageRecipe: S.optional(ImageRecipe),
  containerRecipe: S.optional(ContainerRecipe),
  sourcePipelineName: S.optional(S.String),
  sourcePipelineArn: S.optional(S.String),
  infrastructureConfiguration: S.optional(InfrastructureConfiguration),
  distributionConfiguration: S.optional(DistributionConfiguration),
  imageTestsConfiguration: S.optional(ImageTestsConfiguration),
  dateCreated: S.optional(S.String),
  outputResources: S.optional(OutputResources),
  tags: S.optional(TagMap),
  buildType: S.optional(S.String),
  imageSource: S.optional(S.String),
  scanState: S.optional(ImageScanState),
  imageScanningConfiguration: S.optional(ImageScanningConfiguration),
  deprecationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lifecycleExecutionId: S.optional(S.String),
  executionRole: S.optional(S.String),
  workflows: S.optional(WorkflowConfigurationList),
  loggingConfiguration: S.optional(ImageLoggingConfiguration),
}) {}
export class ImageScanFindingAggregation extends S.Class<ImageScanFindingAggregation>(
  "ImageScanFindingAggregation",
)({
  accountAggregation: S.optional(AccountAggregation),
  imageAggregation: S.optional(ImageAggregation),
  imagePipelineAggregation: S.optional(ImagePipelineAggregation),
  vulnerabilityIdAggregation: S.optional(VulnerabilityIdAggregation),
}) {}
export const ImageScanFindingAggregationsList = S.Array(
  ImageScanFindingAggregation,
);
export class RemediationRecommendation extends S.Class<RemediationRecommendation>(
  "RemediationRecommendation",
)({ text: S.optional(S.String), url: S.optional(S.String) }) {}
export class VulnerablePackage extends S.Class<VulnerablePackage>(
  "VulnerablePackage",
)({
  name: S.optional(S.String),
  version: S.optional(S.String),
  sourceLayerHash: S.optional(S.String),
  epoch: S.optional(S.Number),
  release: S.optional(S.String),
  arch: S.optional(S.String),
  packageManager: S.optional(S.String),
  filePath: S.optional(S.String),
  fixedInVersion: S.optional(S.String),
  remediation: S.optional(S.String),
}) {}
export const VulnerablePackageList = S.Array(VulnerablePackage);
export class CvssScore extends S.Class<CvssScore>("CvssScore")({
  baseScore: S.optional(S.Number),
  scoringVector: S.optional(S.String),
  version: S.optional(S.String),
  source: S.optional(S.String),
}) {}
export const CvssScoreList = S.Array(CvssScore);
export class CreateDistributionConfigurationResponse extends S.Class<CreateDistributionConfigurationResponse>(
  "CreateDistributionConfigurationResponse",
)({
  requestId: S.optional(S.String),
  clientToken: S.optional(S.String),
  distributionConfigurationArn: S.optional(S.String),
}) {}
export class CreateLifecyclePolicyResponse extends S.Class<CreateLifecyclePolicyResponse>(
  "CreateLifecyclePolicyResponse",
)({
  clientToken: S.optional(S.String),
  lifecyclePolicyArn: S.optional(S.String),
}) {}
export class GetImageResponse extends S.Class<GetImageResponse>(
  "GetImageResponse",
)({
  requestId: S.optional(S.String),
  image: S.optional(Image),
  latestVersionReferences: S.optional(LatestVersionReferences),
}) {}
export class ListImageScanFindingAggregationsResponse extends S.Class<ListImageScanFindingAggregationsResponse>(
  "ListImageScanFindingAggregationsResponse",
)({
  requestId: S.optional(S.String),
  aggregationType: S.optional(S.String),
  responses: S.optional(ImageScanFindingAggregationsList),
  nextToken: S.optional(S.String),
}) {}
export class StartResourceStateUpdateResponse extends S.Class<StartResourceStateUpdateResponse>(
  "StartResourceStateUpdateResponse",
)({
  lifecycleExecutionId: S.optional(S.String),
  resourceArn: S.optional(S.String),
}) {}
export class Remediation extends S.Class<Remediation>("Remediation")({
  recommendation: S.optional(RemediationRecommendation),
}) {}
export class PackageVulnerabilityDetails extends S.Class<PackageVulnerabilityDetails>(
  "PackageVulnerabilityDetails",
)({
  vulnerabilityId: S.String,
  vulnerablePackages: S.optional(VulnerablePackageList),
  source: S.optional(S.String),
  cvss: S.optional(CvssScoreList),
  relatedVulnerabilities: S.optional(VulnerabilityIdList),
  sourceUrl: S.optional(S.String),
  vendorSeverity: S.optional(S.String),
  vendorCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vendorUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  referenceUrls: S.optional(NonEmptyStringList),
}) {}
export class CvssScoreAdjustment extends S.Class<CvssScoreAdjustment>(
  "CvssScoreAdjustment",
)({ metric: S.optional(S.String), reason: S.optional(S.String) }) {}
export const CvssScoreAdjustmentList = S.Array(CvssScoreAdjustment);
export class CvssScoreDetails extends S.Class<CvssScoreDetails>(
  "CvssScoreDetails",
)({
  scoreSource: S.optional(S.String),
  cvssSource: S.optional(S.String),
  version: S.optional(S.String),
  score: S.optional(S.Number),
  scoringVector: S.optional(S.String),
  adjustments: S.optional(CvssScoreAdjustmentList),
}) {}
export class InspectorScoreDetails extends S.Class<InspectorScoreDetails>(
  "InspectorScoreDetails",
)({ adjustedCvss: S.optional(CvssScoreDetails) }) {}
export class ImageScanFinding extends S.Class<ImageScanFinding>(
  "ImageScanFinding",
)({
  awsAccountId: S.optional(S.String),
  imageBuildVersionArn: S.optional(S.String),
  imagePipelineArn: S.optional(S.String),
  type: S.optional(S.String),
  description: S.optional(S.String),
  title: S.optional(S.String),
  remediation: S.optional(Remediation),
  severity: S.optional(S.String),
  firstObservedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inspectorScore: S.optional(S.Number),
  inspectorScoreDetails: S.optional(InspectorScoreDetails),
  packageVulnerabilityDetails: S.optional(PackageVulnerabilityDetails),
  fixAvailable: S.optional(S.String),
}) {}
export const ImageScanFindingsList = S.Array(ImageScanFinding);
export class ListImageScanFindingsResponse extends S.Class<ListImageScanFindingsResponse>(
  "ListImageScanFindingsResponse",
)({
  requestId: S.optional(S.String),
  findings: S.optional(ImageScanFindingsList),
  nextToken: S.optional(S.String),
}) {}

//# Errors
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class CallRateLimitExceededException extends S.TaggedError<CallRateLimitExceededException>()(
  "CallRateLimitExceededException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
) {}
export class DryRunOperationException extends S.TaggedError<DryRunOperationException>()(
  "DryRunOperationException",
  { message: S.optional(S.String) },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidPaginationTokenException extends S.TaggedError<InvalidPaginationTokenException>()(
  "InvalidPaginationTokenException",
  { message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { message: S.optional(S.String) },
) {}
export class ResourceDependencyException extends S.TaggedError<ResourceDependencyException>()(
  "ResourceDependencyException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class InvalidVersionNumberException extends S.TaggedError<InvalidVersionNumberException>()(
  "InvalidVersionNumberException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Adds a tag to a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceException,
  ],
}));
/**
 * Removes a tag from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceException,
  ],
}));
/**
 * Returns the list of tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidParameterException,
    ResourceNotFoundException,
    ServiceException,
  ],
}));
/**
 * Import a Windows operating system image from a verified Microsoft ISO disk
 * file. The following disk images are supported:
 *
 * - Windows 11 Enterprise
 */
export const importDiskImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportDiskImageRequest,
  output: ImportDiskImageResponse,
  errors: [ClientException, ServiceException, ServiceUnavailableException],
}));
/**
 * When you export your virtual machine (VM) from its virtualization environment, that
 * process creates a set of one or more disk container files that act as snapshots of your
 * VM’s environment, settings, and data. The Amazon EC2 API ImportImage
 * action uses those files to import your VM and create an AMI. To import using the CLI
 * command, see import-image
 *
 * You can reference the task ID from the VM import to pull in the AMI that the import
 * created as the base image for your Image Builder recipe.
 */
export const importVmImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportVmImageRequest,
  output: ImportVmImageResponse,
  errors: [ClientException, ServiceException, ServiceUnavailableException],
}));
/**
 * Applies a policy to a component. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API
 * `PutComponentPolicy`, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be
 * visible to all principals with whom the resource is shared.
 */
export const putComponentPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutComponentPolicyRequest,
  output: PutComponentPolicyResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidParameterValueException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the list of components that can be filtered by name, or by using the listed
 * `filters` to streamline results. Newly created components can take up to
 * two minutes to appear in the ListComponents API Results.
 *
 * The semantic version has four nodes: ../.
 * You can assign values for the first three, and can filter on all of them.
 *
 * **Filtering:** With semantic versioning, you have the flexibility to use wildcards (x)
 * to specify the most recent versions or nodes when selecting the base image or components for your
 * recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be
 * wildcards.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListComponentsRequest,
    output: ListComponentsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "componentVersionList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List resources that the runtime instance of the image lifecycle identified for lifecycle actions.
 */
export const listLifecycleExecutionResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLifecycleExecutionResourcesRequest,
    output: ListLifecycleExecutionResourcesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "resources",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of container recipes.
 */
export const listContainerRecipes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListContainerRecipesRequest,
    output: ListContainerRecipesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "containerRecipeSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of distribution configurations.
 */
export const listDistributionConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDistributionConfigurationsRequest,
    output: ListDistributionConfigurationsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "distributionConfigurationSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of image build versions.
 */
export const listImageBuildVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListImageBuildVersionsRequest,
    output: ListImageBuildVersionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "imageSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List the Packages that are associated with an Image Build Version, as determined by
 * Amazon Web Services Systems Manager Inventory at build time.
 */
export const listImagePackages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImagePackagesRequest,
    output: ListImagePackagesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "imagePackageList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns a list of image recipes.
 */
export const listImageRecipes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImageRecipesRequest,
    output: ListImageRecipesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "imageRecipeSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns the list of images that you have access to. Newly created images can take up
 * to two minutes to appear in the ListImages API Results.
 */
export const listImages = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImagesRequest,
  output: ListImagesResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidPaginationTokenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "imageVersionList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of infrastructure configurations.
 */
export const listInfrastructureConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListInfrastructureConfigurationsRequest,
    output: ListInfrastructureConfigurationsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "infrastructureConfigurationSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get a list of lifecycle policies in your Amazon Web Services account.
 */
export const listLifecyclePolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLifecyclePoliciesRequest,
    output: ListLifecyclePoliciesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "lifecyclePolicySummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get a list of workflow steps that are waiting for action for workflows
 * in your Amazon Web Services account.
 */
export const listWaitingWorkflowSteps =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWaitingWorkflowStepsRequest,
    output: ListWaitingWorkflowStepsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "steps",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of build versions for a specific workflow resource.
 */
export const listWorkflowBuildVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowBuildVersionsRequest,
    output: ListWorkflowBuildVersionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of workflow runtime instance metadata objects for a specific image build
 * version.
 */
export const listWorkflowExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowExecutionsRequest,
    output: ListWorkflowExecutionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowExecutions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists workflow build versions based on filtering parameters.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowsRequest,
    output: ListWorkflowsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowVersionList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns runtime data for each step in a runtime instance of the workflow
 * that you specify in the request.
 */
export const listWorkflowStepExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowStepExecutionsRequest,
    output: ListWorkflowStepExecutionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "steps",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of images created by the specified pipeline.
 */
export const listImagePipelineImages =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListImagePipelineImagesRequest,
    output: ListImagePipelineImagesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "imageSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of image pipelines.
 */
export const listImagePipelines = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListImagePipelinesRequest,
    output: ListImagePipelinesResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "imagePipelineList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get the lifecycle runtime history for the specified resource.
 */
export const listLifecycleExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListLifecycleExecutionsRequest,
    output: ListLifecycleExecutionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "lifecycleExecutions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Gets a component policy.
 */
export const getComponentPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentPolicyRequest,
  output: GetComponentPolicyResponse,
  errors: [
    CallRateLimitExceededException,
    ForbiddenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Retrieves the policy for a container recipe.
 */
export const getContainerRecipePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetContainerRecipePolicyRequest,
    output: GetContainerRecipePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ForbiddenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Gets an image policy.
 */
export const getImagePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImagePolicyRequest,
  output: GetImagePolicyResponse,
  errors: [
    CallRateLimitExceededException,
    ForbiddenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets an image recipe policy.
 */
export const getImageRecipePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetImageRecipePolicyRequest,
    output: GetImageRecipePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ForbiddenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Verify the subscription and perform resource dependency checks on the requested
 * Amazon Web Services Marketplace resource. For Amazon Web Services Marketplace components, the response contains fields to download the
 * components and their artifacts.
 */
export const getMarketplaceResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetMarketplaceResourceRequest,
    output: GetMarketplaceResourceResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Get the runtime information that was logged for a specific runtime instance
 * of the workflow.
 */
export const getWorkflowExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkflowExecutionRequest,
    output: GetWorkflowExecutionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Get the runtime information that was logged for a specific runtime instance of
 * the workflow step.
 */
export const getWorkflowStepExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkflowStepExecutionRequest,
    output: GetWorkflowStepExecutionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Retrieves a container recipe.
 */
export const getContainerRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetContainerRecipeRequest,
  output: GetContainerRecipeResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets a distribution configuration.
 */
export const getDistributionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDistributionConfigurationRequest,
    output: GetDistributionConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Gets an image pipeline.
 */
export const getImagePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImagePipelineRequest,
  output: GetImagePipelineResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets an image recipe.
 */
export const getImageRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImageRecipeRequest,
  output: GetImageRecipeResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets an infrastructure configuration.
 */
export const getInfrastructureConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetInfrastructureConfigurationRequest,
    output: GetInfrastructureConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Get details for the specified image lifecycle policy.
 */
export const getLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLifecyclePolicyRequest,
  output: GetLifecyclePolicyResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets a component object.
 */
export const getComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentRequest,
  output: GetComponentResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Get the runtime information that was logged for a specific runtime instance of the lifecycle policy.
 */
export const getLifecycleExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLifecycleExecutionRequest,
    output: GetLifecycleExecutionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Get a workflow resource object.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Gets an image.
 */
export const getImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImageRequest,
  output: GetImageResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the list of component build versions for the specified component
 * version Amazon Resource Name (ARN).
 */
export const listComponentBuildVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListComponentBuildVersionsRequest,
    output: ListComponentBuildVersionsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "componentSummaryList",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of image scan aggregations for your account. You can filter by the type
 * of key that Image Builder uses to group results. For example, if you want to get a list of
 * findings by severity level for one of your pipelines, you might specify your pipeline
 * with the `imagePipelineArn` filter. If you don't specify a filter, Image Builder
 * returns an aggregation for your account.
 *
 * To streamline results, you can use the following filters in your request:
 *
 * - `accountId`
 *
 * - `imageBuildVersionArn`
 *
 * - `imagePipelineArn`
 *
 * - `vulnerabilityId`
 */
export const listImageScanFindingAggregations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListImageScanFindingAggregationsRequest,
    output: ListImageScanFindingAggregationsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "responses",
    } as const,
  }));
/**
 * Applies a policy to a container image. We recommend that you call the RAM API
 * CreateResourceShare
 * (https://docs.aws.amazon.com//ram/latest/APIReference/API_CreateResourceShare.html) to share
 * resources. If you call the Image Builder API `PutContainerImagePolicy`, you must also
 * call the RAM API PromoteResourceShareCreatedFromPolicy
 * (https://docs.aws.amazon.com//ram/latest/APIReference/API_PromoteResourceShareCreatedFromPolicy.html)
 * in order for the resource to be visible to all principals with whom the resource is
 * shared.
 */
export const putContainerRecipePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutContainerRecipePolicyRequest,
    output: PutContainerRecipePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidParameterValueException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Applies a policy to an image. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API
 * `PutImagePolicy`, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be
 * visible to all principals with whom the resource is shared.
 */
export const putImagePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutImagePolicyRequest,
  output: PutImagePolicyResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidParameterValueException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Applies a policy to an image recipe. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API
 * `PutImageRecipePolicy`, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be
 * visible to all principals with whom the resource is shared.
 */
export const putImageRecipePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutImageRecipePolicyRequest,
    output: PutImageRecipePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidParameterValueException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes a component build version.
 */
export const deleteComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentRequest,
  output: DeleteComponentResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ResourceDependencyException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Cancel a specific image lifecycle policy runtime instance.
 */
export const cancelLifecycleExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelLifecycleExecutionRequest,
    output: CancelLifecycleExecutionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceInUseException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Imports a component and transforms its data into a component document.
 */
export const importComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportComponentRequest,
  output: ImportComponentResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidParameterCombinationException,
    InvalidRequestException,
    InvalidVersionNumberException,
    ResourceInUseException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates a new distribution configuration. Distribution configurations define and
 * configure the outputs of your pipeline.
 */
export const updateDistributionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateDistributionConfigurationRequest,
    output: UpdateDistributionConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidParameterCombinationException,
      InvalidRequestException,
      ResourceInUseException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Update the specified lifecycle policy.
 */
export const updateLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLifecyclePolicyRequest,
    output: UpdateLifecyclePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidParameterCombinationException,
      InvalidRequestException,
      ResourceInUseException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes a container recipe.
 */
export const deleteContainerRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteContainerRecipeRequest,
    output: DeleteContainerRecipeResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ResourceDependencyException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes a distribution configuration.
 */
export const deleteDistributionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDistributionConfigurationRequest,
    output: DeleteDistributionConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ResourceDependencyException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Deletes an Image Builder image resource. This does not delete any EC2 AMIs or ECR container
 * images that are created during the image build process. You must clean those up
 * separately, using the appropriate Amazon EC2 or Amazon ECR console actions, or API or CLI
 * commands.
 *
 * - To deregister an EC2 Linux AMI, see Deregister your
 * Linux AMI in the
 * *Amazon EC2 User Guide*
 * .
 *
 * - To deregister an EC2 Windows AMI, see Deregister your
 * Windows AMI in the
 * *Amazon EC2 Windows Guide*
 * .
 *
 * - To delete a container image from Amazon ECR, see Deleting
 * an image in the *Amazon ECR User Guide*.
 */
export const deleteImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageRequest,
  output: DeleteImageResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ResourceDependencyException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an image pipeline.
 */
export const deleteImagePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImagePipelineRequest,
  output: DeleteImagePipelineResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ResourceDependencyException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an image recipe.
 */
export const deleteImageRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageRecipeRequest,
  output: DeleteImageRecipeResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ResourceDependencyException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes an infrastructure configuration.
 */
export const deleteInfrastructureConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteInfrastructureConfigurationRequest,
    output: DeleteInfrastructureConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ResourceDependencyException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Delete the specified lifecycle policy resource.
 */
export const deleteLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteLifecyclePolicyRequest,
    output: DeleteLifecyclePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidRequestException,
      ResourceDependencyException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Deletes a specific workflow resource.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    InvalidRequestException,
    ResourceDependencyException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * RetryImage retries an image distribution without rebuilding the image.
 */
export const retryImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryImageRequest,
  output: RetryImageResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceInUseException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Pauses or resumes image creation when the associated workflow runs a
 * `WaitForAction` step.
 */
export const sendWorkflowStepAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendWorkflowStepActionRequest,
    output: SendWorkflowStepActionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidParameterValueException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Manually triggers a pipeline to create an image.
 */
export const startImagePipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartImagePipelineExecutionRequest,
    output: StartImagePipelineExecutionResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Updates an image pipeline. Image pipelines enable you to automate the creation and
 * distribution of images. You must specify exactly one recipe for your image, using either
 * a `containerRecipeArn` or an `imageRecipeArn`.
 *
 * UpdateImagePipeline does not support selective updates for the pipeline. You must
 * specify all of the required properties in the update request, not just the
 * properties that have changed.
 */
export const updateImagePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImagePipelineRequest,
  output: UpdateImagePipelineResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceInUseException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates a new infrastructure configuration. An infrastructure configuration defines
 * the environment in which your image will be built and tested.
 */
export const updateInfrastructureConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateInfrastructureConfigurationRequest,
    output: UpdateInfrastructureConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceInUseException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }));
/**
 * CancelImageCreation cancels the creation of Image. This operation can only be used on
 * images in a non-terminal state.
 */
export const cancelImageCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelImageCreationRequest,
  output: CancelImageCreationResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceInUseException,
    ServiceException,
    ServiceUnavailableException,
  ],
}));
/**
 * Begin asynchronous resource state update for lifecycle changes to the
 * specified image resources.
 */
export const startResourceStateUpdate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartResourceStateUpdateRequest,
    output: StartResourceStateUpdateResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceInUseException,
      ResourceNotFoundException,
      ServiceException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of image scan findings for your account.
 */
export const listImageScanFindings =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListImageScanFindingsRequest,
    output: ListImageScanFindingsResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      InvalidPaginationTokenException,
      InvalidRequestException,
      ServiceException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "findings",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a new image pipeline. Image pipelines enable you to automate the creation and
 * distribution of images.
 */
export const createImagePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImagePipelineRequest,
  output: CreateImagePipelineResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Create a new workflow or a new version of an existing workflow.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRequest,
  output: CreateWorkflowResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    DryRunOperationException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidParameterCombinationException,
    InvalidRequestException,
    InvalidVersionNumberException,
    ResourceInUseException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a new distribution configuration. Distribution configurations define and
 * configure the outputs of your pipeline.
 */
export const createDistributionConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDistributionConfigurationRequest,
    output: CreateDistributionConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidParameterCombinationException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ServiceException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Creates a new image. This request will create a new image along with all of the
 * configured output resources defined in the distribution configuration. You must specify
 * exactly one recipe for your image, using either a ContainerRecipeArn or an
 * ImageRecipeArn.
 */
export const createImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageRequest,
  output: CreateImageResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceInUseException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a new image recipe. Image recipes define how images are configured, tested,
 * and assessed.
 */
export const createImageRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageRecipeRequest,
  output: CreateImageRecipeResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    InvalidVersionNumberException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a new component that can be used to build, validate, test, and assess your
 * image. The component is based on a YAML document that you specify using exactly one of
 * the following methods:
 *
 * - Inline, using the `data` property in the request body.
 *
 * - A URL that points to a YAML document file stored in Amazon S3, using the
 * `uri` property in the request body.
 */
export const createComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentRequest,
  output: CreateComponentResponse,
  errors: [
    CallRateLimitExceededException,
    ClientException,
    DryRunOperationException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidParameterCombinationException,
    InvalidRequestException,
    InvalidVersionNumberException,
    ResourceInUseException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
  ],
}));
/**
 * Creates a new infrastructure configuration. An infrastructure configuration defines
 * the environment in which your image will be built and tested.
 */
export const createInfrastructureConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateInfrastructureConfigurationRequest,
    output: CreateInfrastructureConfigurationResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ServiceException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
    ],
  }));
/**
 * Create a lifecycle policy resource.
 */
export const createLifecyclePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLifecyclePolicyRequest,
    output: CreateLifecyclePolicyResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ServiceException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Creates a new container recipe. Container recipes define how images are configured,
 * tested, and assessed.
 */
export const createContainerRecipe = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateContainerRecipeRequest,
    output: CreateContainerRecipeResponse,
    errors: [
      CallRateLimitExceededException,
      ClientException,
      ForbiddenException,
      IdempotentParameterMismatchException,
      InvalidRequestException,
      InvalidVersionNumberException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ServiceException,
      ServiceQuotaExceededException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * DistributeImage distributes existing AMIs to additional regions and accounts without rebuilding the image.
 */
export const distributeImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DistributeImageRequest,
  output: DistributeImageResponse,
  errors: [
    AccessDeniedException,
    CallRateLimitExceededException,
    ClientException,
    ForbiddenException,
    IdempotentParameterMismatchException,
    InvalidRequestException,
    ResourceInUseException,
    ResourceNotFoundException,
    ServiceException,
    ServiceQuotaExceededException,
    ServiceUnavailableException,
    TooManyRequestsException,
  ],
}));
