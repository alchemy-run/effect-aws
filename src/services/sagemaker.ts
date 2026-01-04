import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://sagemaker.amazonaws.com/doc/2017-05-13/");
const svc = T.AwsApiService({
  sdkId: "SageMaker",
  serviceShapeName: "SageMaker",
});
const auth = T.AwsAuthSigv4({ name: "sagemaker" });
const ver = T.ServiceVersion("2017-07-24");
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
                        url: "https://api.sagemaker-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                            "aws",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://api-fips.sagemaker.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
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
                        url: "https://api-fips.sagemaker.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://api.sagemaker-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://api.sagemaker.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://api.sagemaker.{Region}.{PartitionResult#dnsSuffix}",
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
export class DisableSagemakerServicecatalogPortfolioInput extends S.Class<DisableSagemakerServicecatalogPortfolioInput>(
  "DisableSagemakerServicecatalogPortfolioInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableSagemakerServicecatalogPortfolioOutput extends S.Class<DisableSagemakerServicecatalogPortfolioOutput>(
  "DisableSagemakerServicecatalogPortfolioOutput",
)({}, ns) {}
export class EnableSagemakerServicecatalogPortfolioInput extends S.Class<EnableSagemakerServicecatalogPortfolioInput>(
  "EnableSagemakerServicecatalogPortfolioInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableSagemakerServicecatalogPortfolioOutput extends S.Class<EnableSagemakerServicecatalogPortfolioOutput>(
  "EnableSagemakerServicecatalogPortfolioOutput",
)({}, ns) {}
export class GetSagemakerServicecatalogPortfolioStatusInput extends S.Class<GetSagemakerServicecatalogPortfolioStatusInput>(
  "GetSagemakerServicecatalogPortfolioStatusInput",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ClusterNodeIds = S.Array(S.String);
export const ClusterNodeLogicalIdList = S.Array(S.String);
export const ModelPackageArnList = S.Array(S.String);
export const Subnets = S.Array(S.String);
export const HubSearchKeywordList = S.Array(S.String);
export class HyperParameterTuningJobObjective extends S.Class<HyperParameterTuningJobObjective>(
  "HyperParameterTuningJobObjective",
)({ Type: S.String, MetricName: S.String }) {}
export class IntegerParameterRange extends S.Class<IntegerParameterRange>(
  "IntegerParameterRange",
)({
  Name: S.String,
  MinValue: S.String,
  MaxValue: S.String,
  ScalingType: S.optional(S.String),
}) {}
export const IntegerParameterRanges = S.Array(IntegerParameterRange);
export class ContinuousParameterRange extends S.Class<ContinuousParameterRange>(
  "ContinuousParameterRange",
)({
  Name: S.String,
  MinValue: S.String,
  MaxValue: S.String,
  ScalingType: S.optional(S.String),
}) {}
export const ContinuousParameterRanges = S.Array(ContinuousParameterRange);
export const ParameterValues = S.Array(S.String);
export class CategoricalParameterRange extends S.Class<CategoricalParameterRange>(
  "CategoricalParameterRange",
)({ Name: S.String, Values: ParameterValues }) {}
export const CategoricalParameterRanges = S.Array(CategoricalParameterRange);
export class AutoParameter extends S.Class<AutoParameter>("AutoParameter")({
  Name: S.String,
  ValueHint: S.String,
}) {}
export const AutoParameters = S.Array(AutoParameter);
export class ParameterRanges extends S.Class<ParameterRanges>(
  "ParameterRanges",
)({
  IntegerParameterRanges: S.optional(IntegerParameterRanges),
  ContinuousParameterRanges: S.optional(ContinuousParameterRanges),
  CategoricalParameterRanges: S.optional(CategoricalParameterRanges),
  AutoParameters: S.optional(AutoParameters),
}) {}
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export class MetricDefinition extends S.Class<MetricDefinition>(
  "MetricDefinition",
)({ Name: S.String, Regex: S.String }) {}
export const MetricDefinitionList = S.Array(MetricDefinition);
export class HyperParameterAlgorithmSpecification extends S.Class<HyperParameterAlgorithmSpecification>(
  "HyperParameterAlgorithmSpecification",
)({
  TrainingImage: S.optional(S.String),
  TrainingInputMode: S.String,
  AlgorithmName: S.optional(S.String),
  MetricDefinitions: S.optional(MetricDefinitionList),
}) {}
export const AttributeNames = S.Array(S.String);
export const InstanceGroupNames = S.Array(S.String);
export class ModelAccessConfig extends S.Class<ModelAccessConfig>(
  "ModelAccessConfig",
)({ AcceptEula: S.Boolean }) {}
export class HubAccessConfig extends S.Class<HubAccessConfig>(
  "HubAccessConfig",
)({ HubContentArn: S.String }) {}
export class S3DataSource extends S.Class<S3DataSource>("S3DataSource")({
  S3DataType: S.String,
  S3Uri: S.String,
  S3DataDistributionType: S.optional(S.String),
  AttributeNames: S.optional(AttributeNames),
  InstanceGroupNames: S.optional(InstanceGroupNames),
  ModelAccessConfig: S.optional(ModelAccessConfig),
  HubAccessConfig: S.optional(HubAccessConfig),
}) {}
export class FileSystemDataSource extends S.Class<FileSystemDataSource>(
  "FileSystemDataSource",
)({
  FileSystemId: S.String,
  FileSystemAccessMode: S.String,
  FileSystemType: S.String,
  DirectoryPath: S.String,
}) {}
export class DatasetSource extends S.Class<DatasetSource>("DatasetSource")({
  DatasetArn: S.String,
}) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  S3DataSource: S.optional(S3DataSource),
  FileSystemDataSource: S.optional(FileSystemDataSource),
  DatasetSource: S.optional(DatasetSource),
}) {}
export class ShuffleConfig extends S.Class<ShuffleConfig>("ShuffleConfig")({
  Seed: S.Number,
}) {}
export class Channel extends S.Class<Channel>("Channel")({
  ChannelName: S.String,
  DataSource: DataSource,
  ContentType: S.optional(S.String),
  CompressionType: S.optional(S.String),
  RecordWrapperType: S.optional(S.String),
  InputMode: S.optional(S.String),
  ShuffleConfig: S.optional(ShuffleConfig),
}) {}
export const InputDataConfig = S.Array(Channel);
export const VpcSecurityGroupIds = S.Array(S.String);
export class VpcConfig extends S.Class<VpcConfig>("VpcConfig")({
  SecurityGroupIds: VpcSecurityGroupIds,
  Subnets: Subnets,
}) {}
export class OutputDataConfig extends S.Class<OutputDataConfig>(
  "OutputDataConfig",
)({
  KmsKeyId: S.optional(S.String),
  S3OutputPath: S.String,
  CompressionType: S.optional(S.String),
}) {}
export class InstanceGroup extends S.Class<InstanceGroup>("InstanceGroup")({
  InstanceType: S.String,
  InstanceCount: S.Number,
  InstanceGroupName: S.String,
}) {}
export const InstanceGroups = S.Array(InstanceGroup);
export class PlacementSpecification extends S.Class<PlacementSpecification>(
  "PlacementSpecification",
)({ UltraServerId: S.optional(S.String), InstanceCount: S.Number }) {}
export const PlacementSpecifications = S.Array(PlacementSpecification);
export class InstancePlacementConfig extends S.Class<InstancePlacementConfig>(
  "InstancePlacementConfig",
)({
  EnableMultipleJobs: S.optional(S.Boolean),
  PlacementSpecifications: S.optional(PlacementSpecifications),
}) {}
export class ResourceConfig extends S.Class<ResourceConfig>("ResourceConfig")({
  InstanceType: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  VolumeSizeInGB: S.optional(S.Number),
  VolumeKmsKeyId: S.optional(S.String),
  KeepAlivePeriodInSeconds: S.optional(S.Number),
  InstanceGroups: S.optional(InstanceGroups),
  TrainingPlanArn: S.optional(S.String),
  InstancePlacementConfig: S.optional(InstancePlacementConfig),
}) {}
export class HyperParameterTuningInstanceConfig extends S.Class<HyperParameterTuningInstanceConfig>(
  "HyperParameterTuningInstanceConfig",
)({
  InstanceType: S.String,
  InstanceCount: S.Number,
  VolumeSizeInGB: S.Number,
}) {}
export const HyperParameterTuningInstanceConfigs = S.Array(
  HyperParameterTuningInstanceConfig,
);
export class HyperParameterTuningResourceConfig extends S.Class<HyperParameterTuningResourceConfig>(
  "HyperParameterTuningResourceConfig",
)({
  InstanceType: S.optional(S.String),
  InstanceCount: S.optional(S.Number),
  VolumeSizeInGB: S.optional(S.Number),
  VolumeKmsKeyId: S.optional(S.String),
  AllocationStrategy: S.optional(S.String),
  InstanceConfigs: S.optional(HyperParameterTuningInstanceConfigs),
}) {}
export class StoppingCondition extends S.Class<StoppingCondition>(
  "StoppingCondition",
)({
  MaxRuntimeInSeconds: S.optional(S.Number),
  MaxWaitTimeInSeconds: S.optional(S.Number),
  MaxPendingTimeInSeconds: S.optional(S.Number),
}) {}
export class CheckpointConfig extends S.Class<CheckpointConfig>(
  "CheckpointConfig",
)({ S3Uri: S.String, LocalPath: S.optional(S.String) }) {}
export class RetryStrategy extends S.Class<RetryStrategy>("RetryStrategy")({
  MaximumRetryAttempts: S.Number,
}) {}
export const HyperParameterTrainingJobEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class HyperParameterTrainingJobDefinition extends S.Class<HyperParameterTrainingJobDefinition>(
  "HyperParameterTrainingJobDefinition",
)({
  DefinitionName: S.optional(S.String),
  TuningObjective: S.optional(HyperParameterTuningJobObjective),
  HyperParameterRanges: S.optional(ParameterRanges),
  StaticHyperParameters: S.optional(HyperParameters),
  AlgorithmSpecification: HyperParameterAlgorithmSpecification,
  RoleArn: S.String,
  InputDataConfig: S.optional(InputDataConfig),
  VpcConfig: S.optional(VpcConfig),
  OutputDataConfig: OutputDataConfig,
  ResourceConfig: S.optional(ResourceConfig),
  HyperParameterTuningResourceConfig: S.optional(
    HyperParameterTuningResourceConfig,
  ),
  StoppingCondition: StoppingCondition,
  EnableNetworkIsolation: S.optional(S.Boolean),
  EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
  EnableManagedSpotTraining: S.optional(S.Boolean),
  CheckpointConfig: S.optional(CheckpointConfig),
  RetryStrategy: S.optional(RetryStrategy),
  Environment: S.optional(HyperParameterTrainingJobEnvironmentMap),
}) {}
export const HyperParameterTrainingJobDefinitions = S.Array(
  HyperParameterTrainingJobDefinition,
);
export const SageMakerImageVersionAliases = S.Array(S.String);
export const DefaultDomainIdList = S.Array(S.String);
export class RepositoryAuthConfig extends S.Class<RepositoryAuthConfig>(
  "RepositoryAuthConfig",
)({ RepositoryCredentialsProviderArn: S.String }) {}
export class ImageConfig extends S.Class<ImageConfig>("ImageConfig")({
  RepositoryAccessMode: S.String,
  RepositoryAuthConfig: S.optional(RepositoryAuthConfig),
}) {}
export class InferenceHubAccessConfig extends S.Class<InferenceHubAccessConfig>(
  "InferenceHubAccessConfig",
)({ HubContentArn: S.String }) {}
export class S3ModelDataSource extends S.Class<S3ModelDataSource>(
  "S3ModelDataSource",
)({
  S3Uri: S.String,
  S3DataType: S.String,
  CompressionType: S.String,
  ModelAccessConfig: S.optional(ModelAccessConfig),
  HubAccessConfig: S.optional(InferenceHubAccessConfig),
  ManifestS3Uri: S.optional(S.String),
  ETag: S.optional(S.String),
  ManifestEtag: S.optional(S.String),
}) {}
export class ModelDataSource extends S.Class<ModelDataSource>(
  "ModelDataSource",
)({ S3DataSource: S.optional(S3ModelDataSource) }) {}
export class AdditionalModelDataSource extends S.Class<AdditionalModelDataSource>(
  "AdditionalModelDataSource",
)({ ChannelName: S.String, S3DataSource: S3ModelDataSource }) {}
export const AdditionalModelDataSources = S.Array(AdditionalModelDataSource);
export const EnvironmentMap = S.Record({ key: S.String, value: S.String });
export class MultiModelConfig extends S.Class<MultiModelConfig>(
  "MultiModelConfig",
)({ ModelCacheSetting: S.optional(S.String) }) {}
export class ContainerDefinition extends S.Class<ContainerDefinition>(
  "ContainerDefinition",
)({
  ContainerHostname: S.optional(S.String),
  Image: S.optional(S.String),
  ImageConfig: S.optional(ImageConfig),
  Mode: S.optional(S.String),
  ModelDataUrl: S.optional(S.String),
  ModelDataSource: S.optional(ModelDataSource),
  AdditionalModelDataSources: S.optional(AdditionalModelDataSources),
  Environment: S.optional(EnvironmentMap),
  ModelPackageName: S.optional(S.String),
  InferenceSpecificationName: S.optional(S.String),
  MultiModelConfig: S.optional(MultiModelConfig),
}) {}
export const ContainerDefinitionList = S.Array(ContainerDefinition);
export const SecurityGroupIds = S.Array(S.String);
export const NotebookInstanceAcceleratorTypes = S.Array(S.String);
export const AdditionalCodeRepositoryNamesOrUrls = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export const DeviceNames = S.Array(S.String);
export const HubContentSearchKeywordList = S.Array(S.String);
export const QueryLineageStartArns = S.Array(S.String);
export const SageMakerResourceNames = S.Array(S.String);
export const ListLineageEntityParameterKey = S.Array(S.String);
export const ClusterInstanceGroupsToDelete = S.Array(S.String);
export class VectorConfig extends S.Class<VectorConfig>("VectorConfig")({
  Dimension: S.Number,
}) {}
export const CollectionConfig = S.Union(
  S.Struct({ VectorConfig: VectorConfig }),
);
export class FeatureDefinition extends S.Class<FeatureDefinition>(
  "FeatureDefinition",
)({
  FeatureName: S.String,
  FeatureType: S.String,
  CollectionType: S.optional(S.String),
  CollectionConfig: S.optional(CollectionConfig),
}) {}
export const FeatureAdditions = S.Array(FeatureDefinition);
export const FeatureParameterRemovals = S.Array(S.String);
export const ImageDeletePropertyList = S.Array(S.String);
export const CustomerMetadataKeyList = S.Array(S.String);
export const ListTrialComponentKey256 = S.Array(S.String);
export class AddAssociationRequest extends S.Class<AddAssociationRequest>(
  "AddAssociationRequest",
)(
  {
    SourceArn: S.String,
    DestinationArn: S.String,
    AssociationType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateTrialComponentRequest extends S.Class<AssociateTrialComponentRequest>(
  "AssociateTrialComponentRequest",
)(
  { TrialComponentName: S.String, TrialName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachClusterNodeVolumeRequest extends S.Class<AttachClusterNodeVolumeRequest>(
  "AttachClusterNodeVolumeRequest",
)(
  { ClusterArn: S.String, NodeId: S.String, VolumeId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteClusterNodesRequest extends S.Class<BatchDeleteClusterNodesRequest>(
  "BatchDeleteClusterNodesRequest",
)(
  {
    ClusterName: S.String,
    NodeIds: S.optional(ClusterNodeIds),
    NodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDescribeModelPackageInput extends S.Class<BatchDescribeModelPackageInput>(
  "BatchDescribeModelPackageInput",
)(
  { ModelPackageArnList: ModelPackageArnList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchRebootClusterNodesRequest extends S.Class<BatchRebootClusterNodesRequest>(
  "BatchRebootClusterNodesRequest",
)(
  {
    ClusterName: S.String,
    NodeIds: S.optional(ClusterNodeIds),
    NodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchReplaceClusterNodesRequest extends S.Class<BatchReplaceClusterNodesRequest>(
  "BatchReplaceClusterNodesRequest",
)(
  {
    ClusterName: S.String,
    NodeIds: S.optional(ClusterNodeIds),
    NodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeviceSelectionConfig extends S.Class<DeviceSelectionConfig>(
  "DeviceSelectionConfig",
)({
  DeviceSubsetType: S.String,
  Percentage: S.optional(S.Number),
  DeviceNames: S.optional(DeviceNames),
  DeviceNameContains: S.optional(S.String),
}) {}
export class EdgeDeploymentConfig extends S.Class<EdgeDeploymentConfig>(
  "EdgeDeploymentConfig",
)({ FailureHandlingPolicy: S.String }) {}
export class DeploymentStage extends S.Class<DeploymentStage>(
  "DeploymentStage",
)({
  StageName: S.String,
  DeviceSelectionConfig: DeviceSelectionConfig,
  DeploymentConfig: S.optional(EdgeDeploymentConfig),
}) {}
export const DeploymentStages = S.Array(DeploymentStage);
export class CreateEdgeDeploymentStageRequest extends S.Class<CreateEdgeDeploymentStageRequest>(
  "CreateEdgeDeploymentStageRequest",
)(
  { EdgeDeploymentPlanName: S.String, Stages: DeploymentStages },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEdgeDeploymentStageResponse extends S.Class<CreateEdgeDeploymentStageResponse>(
  "CreateEdgeDeploymentStageResponse",
)({}, ns) {}
export class EdgeOutputConfig extends S.Class<EdgeOutputConfig>(
  "EdgeOutputConfig",
)({
  S3OutputLocation: S.String,
  KmsKeyId: S.optional(S.String),
  PresetDeploymentType: S.optional(S.String),
  PresetDeploymentConfig: S.optional(S.String),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateEdgePackagingJobRequest extends S.Class<CreateEdgePackagingJobRequest>(
  "CreateEdgePackagingJobRequest",
)(
  {
    EdgePackagingJobName: S.String,
    CompilationJobName: S.String,
    ModelName: S.String,
    ModelVersion: S.String,
    RoleArn: S.String,
    OutputConfig: EdgeOutputConfig,
    ResourceKey: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEdgePackagingJobResponse extends S.Class<CreateEdgePackagingJobResponse>(
  "CreateEdgePackagingJobResponse",
)({}, ns) {}
export class CreateExperimentRequest extends S.Class<CreateExperimentRequest>(
  "CreateExperimentRequest",
)(
  {
    ExperimentName: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHubContentReferenceRequest extends S.Class<CreateHubContentReferenceRequest>(
  "CreateHubContentReferenceRequest",
)(
  {
    HubName: S.String,
    SageMakerPublicHubContentArn: S.String,
    HubContentName: S.optional(S.String),
    MinVersion: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateImageRequest extends S.Class<CreateImageRequest>(
  "CreateImageRequest",
)(
  {
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ImageName: S.String,
    RoleArn: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateImageVersionRequest extends S.Class<CreateImageVersionRequest>(
  "CreateImageVersionRequest",
)(
  {
    BaseImage: S.String,
    ClientToken: S.String,
    ImageName: S.String,
    Aliases: S.optional(SageMakerImageVersionAliases),
    VendorGuidance: S.optional(S.String),
    JobType: S.optional(S.String),
    MLFramework: S.optional(S.String),
    ProgrammingLang: S.optional(S.String),
    Processor: S.optional(S.String),
    Horovod: S.optional(S.Boolean),
    ReleaseNotes: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMlflowAppRequest extends S.Class<CreateMlflowAppRequest>(
  "CreateMlflowAppRequest",
)(
  {
    Name: S.String,
    ArtifactStoreUri: S.String,
    RoleArn: S.String,
    ModelRegistrationMode: S.optional(S.String),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    AccountDefaultStatus: S.optional(S.String),
    DefaultDomainIdList: S.optional(DefaultDomainIdList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMlflowTrackingServerRequest extends S.Class<CreateMlflowTrackingServerRequest>(
  "CreateMlflowTrackingServerRequest",
)(
  {
    TrackingServerName: S.String,
    ArtifactStoreUri: S.String,
    TrackingServerSize: S.optional(S.String),
    MlflowVersion: S.optional(S.String),
    RoleArn: S.String,
    AutomaticModelRegistration: S.optional(S.Boolean),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelPackageGroupInput extends S.Class<CreateModelPackageGroupInput>(
  "CreateModelPackageGroupInput",
)(
  {
    ModelPackageGroupName: S.String,
    ModelPackageGroupDescription: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartnerAppPresignedUrlRequest extends S.Class<CreatePartnerAppPresignedUrlRequest>(
  "CreatePartnerAppPresignedUrlRequest",
)(
  {
    Arn: S.String,
    ExpiresInSeconds: S.optional(S.Number),
    SessionExpirationDurationInSeconds: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePresignedDomainUrlRequest extends S.Class<CreatePresignedDomainUrlRequest>(
  "CreatePresignedDomainUrlRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.String,
    SessionExpirationDurationInSeconds: S.optional(S.Number),
    ExpiresInSeconds: S.optional(S.Number),
    SpaceName: S.optional(S.String),
    LandingUri: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePresignedMlflowAppUrlRequest extends S.Class<CreatePresignedMlflowAppUrlRequest>(
  "CreatePresignedMlflowAppUrlRequest",
)(
  {
    Arn: S.String,
    ExpiresInSeconds: S.optional(S.Number),
    SessionExpirationDurationInSeconds: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePresignedMlflowTrackingServerUrlRequest extends S.Class<CreatePresignedMlflowTrackingServerUrlRequest>(
  "CreatePresignedMlflowTrackingServerUrlRequest",
)(
  {
    TrackingServerName: S.String,
    ExpiresInSeconds: S.optional(S.Number),
    SessionExpirationDurationInSeconds: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePresignedNotebookInstanceUrlInput extends S.Class<CreatePresignedNotebookInstanceUrlInput>(
  "CreatePresignedNotebookInstanceUrlInput",
)(
  {
    NotebookInstanceName: S.String,
    SessionExpirationDurationInSeconds: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStudioLifecycleConfigRequest extends S.Class<CreateStudioLifecycleConfigRequest>(
  "CreateStudioLifecycleConfigRequest",
)(
  {
    StudioLifecycleConfigName: S.String,
    StudioLifecycleConfigContent: S.String,
    StudioLifecycleConfigAppType: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTrainingPlanRequest extends S.Class<CreateTrainingPlanRequest>(
  "CreateTrainingPlanRequest",
)(
  {
    TrainingPlanName: S.String,
    TrainingPlanOfferingId: S.String,
    SpareInstanceCountPerUltraServer: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class MetadataProperties extends S.Class<MetadataProperties>(
  "MetadataProperties",
)({
  CommitId: S.optional(S.String),
  Repository: S.optional(S.String),
  GeneratedBy: S.optional(S.String),
  ProjectId: S.optional(S.String),
}) {}
export class CreateTrialRequest extends S.Class<CreateTrialRequest>(
  "CreateTrialRequest",
)(
  {
    TrialName: S.String,
    DisplayName: S.optional(S.String),
    ExperimentName: S.String,
    MetadataProperties: S.optional(MetadataProperties),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SharingSettings extends S.Class<SharingSettings>(
  "SharingSettings",
)({
  NotebookOutputOption: S.optional(S.String),
  S3OutputPath: S.optional(S.String),
  S3KmsKeyId: S.optional(S.String),
}) {}
export class ResourceSpec extends S.Class<ResourceSpec>("ResourceSpec")({
  SageMakerImageArn: S.optional(S.String),
  SageMakerImageVersionArn: S.optional(S.String),
  SageMakerImageVersionAlias: S.optional(S.String),
  InstanceType: S.optional(S.String),
  LifecycleConfigArn: S.optional(S.String),
}) {}
export const LifecycleConfigArns = S.Array(S.String);
export class CodeRepository extends S.Class<CodeRepository>("CodeRepository")({
  RepositoryUrl: S.String,
}) {}
export const CodeRepositories = S.Array(CodeRepository);
export class JupyterServerAppSettings extends S.Class<JupyterServerAppSettings>(
  "JupyterServerAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  LifecycleConfigArns: S.optional(LifecycleConfigArns),
  CodeRepositories: S.optional(CodeRepositories),
}) {}
export class CustomImage extends S.Class<CustomImage>("CustomImage")({
  ImageName: S.String,
  ImageVersionNumber: S.optional(S.Number),
  AppImageConfigName: S.String,
}) {}
export const CustomImages = S.Array(CustomImage);
export class KernelGatewayAppSettings extends S.Class<KernelGatewayAppSettings>(
  "KernelGatewayAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  CustomImages: S.optional(CustomImages),
  LifecycleConfigArns: S.optional(LifecycleConfigArns),
}) {}
export class TensorBoardAppSettings extends S.Class<TensorBoardAppSettings>(
  "TensorBoardAppSettings",
)({ DefaultResourceSpec: S.optional(ResourceSpec) }) {}
export class RStudioServerProAppSettings extends S.Class<RStudioServerProAppSettings>(
  "RStudioServerProAppSettings",
)({ AccessStatus: S.optional(S.String), UserGroup: S.optional(S.String) }) {}
export class RSessionAppSettings extends S.Class<RSessionAppSettings>(
  "RSessionAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  CustomImages: S.optional(CustomImages),
}) {}
export class TimeSeriesForecastingSettings extends S.Class<TimeSeriesForecastingSettings>(
  "TimeSeriesForecastingSettings",
)({
  Status: S.optional(S.String),
  AmazonForecastRoleArn: S.optional(S.String),
}) {}
export class ModelRegisterSettings extends S.Class<ModelRegisterSettings>(
  "ModelRegisterSettings",
)({
  Status: S.optional(S.String),
  CrossAccountModelRegisterRoleArn: S.optional(S.String),
}) {}
export class WorkspaceSettings extends S.Class<WorkspaceSettings>(
  "WorkspaceSettings",
)({ S3ArtifactPath: S.optional(S.String), S3KmsKeyId: S.optional(S.String) }) {}
export class IdentityProviderOAuthSetting extends S.Class<IdentityProviderOAuthSetting>(
  "IdentityProviderOAuthSetting",
)({
  DataSourceName: S.optional(S.String),
  Status: S.optional(S.String),
  SecretArn: S.optional(S.String),
}) {}
export const IdentityProviderOAuthSettings = S.Array(
  IdentityProviderOAuthSetting,
);
export class DirectDeploySettings extends S.Class<DirectDeploySettings>(
  "DirectDeploySettings",
)({ Status: S.optional(S.String) }) {}
export class KendraSettings extends S.Class<KendraSettings>("KendraSettings")({
  Status: S.optional(S.String),
}) {}
export class GenerativeAiSettings extends S.Class<GenerativeAiSettings>(
  "GenerativeAiSettings",
)({ AmazonBedrockRoleArn: S.optional(S.String) }) {}
export class EmrServerlessSettings extends S.Class<EmrServerlessSettings>(
  "EmrServerlessSettings",
)({ ExecutionRoleArn: S.optional(S.String), Status: S.optional(S.String) }) {}
export class CanvasAppSettings extends S.Class<CanvasAppSettings>(
  "CanvasAppSettings",
)({
  TimeSeriesForecastingSettings: S.optional(TimeSeriesForecastingSettings),
  ModelRegisterSettings: S.optional(ModelRegisterSettings),
  WorkspaceSettings: S.optional(WorkspaceSettings),
  IdentityProviderOAuthSettings: S.optional(IdentityProviderOAuthSettings),
  DirectDeploySettings: S.optional(DirectDeploySettings),
  KendraSettings: S.optional(KendraSettings),
  GenerativeAiSettings: S.optional(GenerativeAiSettings),
  EmrServerlessSettings: S.optional(EmrServerlessSettings),
}) {}
export class IdleSettings extends S.Class<IdleSettings>("IdleSettings")({
  LifecycleManagement: S.optional(S.String),
  IdleTimeoutInMinutes: S.optional(S.Number),
  MinIdleTimeoutInMinutes: S.optional(S.Number),
  MaxIdleTimeoutInMinutes: S.optional(S.Number),
}) {}
export class AppLifecycleManagement extends S.Class<AppLifecycleManagement>(
  "AppLifecycleManagement",
)({ IdleSettings: S.optional(IdleSettings) }) {}
export class CodeEditorAppSettings extends S.Class<CodeEditorAppSettings>(
  "CodeEditorAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  CustomImages: S.optional(CustomImages),
  LifecycleConfigArns: S.optional(LifecycleConfigArns),
  AppLifecycleManagement: S.optional(AppLifecycleManagement),
  BuiltInLifecycleConfigArn: S.optional(S.String),
}) {}
export const AssumableRoleArns = S.Array(S.String);
export const ExecutionRoleArns = S.Array(S.String);
export class EmrSettings extends S.Class<EmrSettings>("EmrSettings")({
  AssumableRoleArns: S.optional(AssumableRoleArns),
  ExecutionRoleArns: S.optional(ExecutionRoleArns),
}) {}
export class JupyterLabAppSettings extends S.Class<JupyterLabAppSettings>(
  "JupyterLabAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  CustomImages: S.optional(CustomImages),
  LifecycleConfigArns: S.optional(LifecycleConfigArns),
  CodeRepositories: S.optional(CodeRepositories),
  AppLifecycleManagement: S.optional(AppLifecycleManagement),
  EmrSettings: S.optional(EmrSettings),
  BuiltInLifecycleConfigArn: S.optional(S.String),
}) {}
export class DefaultEbsStorageSettings extends S.Class<DefaultEbsStorageSettings>(
  "DefaultEbsStorageSettings",
)({ DefaultEbsVolumeSizeInGb: S.Number, MaximumEbsVolumeSizeInGb: S.Number }) {}
export class DefaultSpaceStorageSettings extends S.Class<DefaultSpaceStorageSettings>(
  "DefaultSpaceStorageSettings",
)({ DefaultEbsStorageSettings: S.optional(DefaultEbsStorageSettings) }) {}
export class CustomPosixUserConfig extends S.Class<CustomPosixUserConfig>(
  "CustomPosixUserConfig",
)({ Uid: S.Number, Gid: S.Number }) {}
export class EFSFileSystemConfig extends S.Class<EFSFileSystemConfig>(
  "EFSFileSystemConfig",
)({ FileSystemId: S.String, FileSystemPath: S.optional(S.String) }) {}
export class FSxLustreFileSystemConfig extends S.Class<FSxLustreFileSystemConfig>(
  "FSxLustreFileSystemConfig",
)({ FileSystemId: S.String, FileSystemPath: S.optional(S.String) }) {}
export class S3FileSystemConfig extends S.Class<S3FileSystemConfig>(
  "S3FileSystemConfig",
)({ MountPath: S.optional(S.String), S3Uri: S.String }) {}
export const CustomFileSystemConfig = S.Union(
  S.Struct({ EFSFileSystemConfig: EFSFileSystemConfig }),
  S.Struct({ FSxLustreFileSystemConfig: FSxLustreFileSystemConfig }),
  S.Struct({ S3FileSystemConfig: S3FileSystemConfig }),
);
export const CustomFileSystemConfigs = S.Array(CustomFileSystemConfig);
export const HiddenMlToolsList = S.Array(S.String);
export const HiddenAppTypesList = S.Array(S.String);
export const HiddenInstanceTypesList = S.Array(S.String);
export const VersionAliasesList = S.Array(S.String);
export class HiddenSageMakerImage extends S.Class<HiddenSageMakerImage>(
  "HiddenSageMakerImage",
)({
  SageMakerImageName: S.optional(S.String),
  VersionAliases: S.optional(VersionAliasesList),
}) {}
export const HiddenSageMakerImageVersionAliasesList =
  S.Array(HiddenSageMakerImage);
export class StudioWebPortalSettings extends S.Class<StudioWebPortalSettings>(
  "StudioWebPortalSettings",
)({
  HiddenMlTools: S.optional(HiddenMlToolsList),
  HiddenAppTypes: S.optional(HiddenAppTypesList),
  HiddenInstanceTypes: S.optional(HiddenInstanceTypesList),
  HiddenSageMakerImageVersionAliases: S.optional(
    HiddenSageMakerImageVersionAliasesList,
  ),
}) {}
export class UserSettings extends S.Class<UserSettings>("UserSettings")({
  ExecutionRole: S.optional(S.String),
  SecurityGroups: S.optional(SecurityGroupIds),
  SharingSettings: S.optional(SharingSettings),
  JupyterServerAppSettings: S.optional(JupyterServerAppSettings),
  KernelGatewayAppSettings: S.optional(KernelGatewayAppSettings),
  TensorBoardAppSettings: S.optional(TensorBoardAppSettings),
  RStudioServerProAppSettings: S.optional(RStudioServerProAppSettings),
  RSessionAppSettings: S.optional(RSessionAppSettings),
  CanvasAppSettings: S.optional(CanvasAppSettings),
  CodeEditorAppSettings: S.optional(CodeEditorAppSettings),
  JupyterLabAppSettings: S.optional(JupyterLabAppSettings),
  SpaceStorageSettings: S.optional(DefaultSpaceStorageSettings),
  DefaultLandingUri: S.optional(S.String),
  StudioWebPortal: S.optional(S.String),
  CustomPosixUserConfig: S.optional(CustomPosixUserConfig),
  CustomFileSystemConfigs: S.optional(CustomFileSystemConfigs),
  StudioWebPortalSettings: S.optional(StudioWebPortalSettings),
  AutoMountHomeEFS: S.optional(S.String),
}) {}
export class CreateUserProfileRequest extends S.Class<CreateUserProfileRequest>(
  "CreateUserProfileRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.String,
    SingleSignOnUserIdentifier: S.optional(S.String),
    SingleSignOnUserValue: S.optional(S.String),
    Tags: S.optional(TagList),
    UserSettings: S.optional(UserSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteActionRequest extends S.Class<DeleteActionRequest>(
  "DeleteActionRequest",
)(
  { ActionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAlgorithmInput extends S.Class<DeleteAlgorithmInput>(
  "DeleteAlgorithmInput",
)(
  { AlgorithmName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAlgorithmResponse extends S.Class<DeleteAlgorithmResponse>(
  "DeleteAlgorithmResponse",
)({}, ns) {}
export class DeleteAppRequest extends S.Class<DeleteAppRequest>(
  "DeleteAppRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.optional(S.String),
    SpaceName: S.optional(S.String),
    AppType: S.String,
    AppName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAppResponse extends S.Class<DeleteAppResponse>(
  "DeleteAppResponse",
)({}, ns) {}
export class DeleteAppImageConfigRequest extends S.Class<DeleteAppImageConfigRequest>(
  "DeleteAppImageConfigRequest",
)(
  { AppImageConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAppImageConfigResponse extends S.Class<DeleteAppImageConfigResponse>(
  "DeleteAppImageConfigResponse",
)({}, ns) {}
export class ArtifactSourceType extends S.Class<ArtifactSourceType>(
  "ArtifactSourceType",
)({ SourceIdType: S.String, Value: S.String }) {}
export const ArtifactSourceTypes = S.Array(ArtifactSourceType);
export class ArtifactSource extends S.Class<ArtifactSource>("ArtifactSource")({
  SourceUri: S.String,
  SourceTypes: S.optional(ArtifactSourceTypes),
}) {}
export class DeleteArtifactRequest extends S.Class<DeleteArtifactRequest>(
  "DeleteArtifactRequest",
)(
  { ArtifactArn: S.optional(S.String), Source: S.optional(ArtifactSource) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAssociationRequest extends S.Class<DeleteAssociationRequest>(
  "DeleteAssociationRequest",
)(
  { SourceArn: S.String, DestinationArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { ClusterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterSchedulerConfigRequest extends S.Class<DeleteClusterSchedulerConfigRequest>(
  "DeleteClusterSchedulerConfigRequest",
)(
  { ClusterSchedulerConfigId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterSchedulerConfigResponse extends S.Class<DeleteClusterSchedulerConfigResponse>(
  "DeleteClusterSchedulerConfigResponse",
)({}, ns) {}
export class DeleteCodeRepositoryInput extends S.Class<DeleteCodeRepositoryInput>(
  "DeleteCodeRepositoryInput",
)(
  { CodeRepositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCodeRepositoryResponse extends S.Class<DeleteCodeRepositoryResponse>(
  "DeleteCodeRepositoryResponse",
)({}, ns) {}
export class DeleteCompilationJobRequest extends S.Class<DeleteCompilationJobRequest>(
  "DeleteCompilationJobRequest",
)(
  { CompilationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCompilationJobResponse extends S.Class<DeleteCompilationJobResponse>(
  "DeleteCompilationJobResponse",
)({}, ns) {}
export class DeleteComputeQuotaRequest extends S.Class<DeleteComputeQuotaRequest>(
  "DeleteComputeQuotaRequest",
)(
  { ComputeQuotaId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteComputeQuotaResponse extends S.Class<DeleteComputeQuotaResponse>(
  "DeleteComputeQuotaResponse",
)({}, ns) {}
export class DeleteContextRequest extends S.Class<DeleteContextRequest>(
  "DeleteContextRequest",
)(
  { ContextName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataQualityJobDefinitionRequest extends S.Class<DeleteDataQualityJobDefinitionRequest>(
  "DeleteDataQualityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataQualityJobDefinitionResponse extends S.Class<DeleteDataQualityJobDefinitionResponse>(
  "DeleteDataQualityJobDefinitionResponse",
)({}, ns) {}
export class DeleteDeviceFleetRequest extends S.Class<DeleteDeviceFleetRequest>(
  "DeleteDeviceFleetRequest",
)(
  { DeviceFleetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeviceFleetResponse extends S.Class<DeleteDeviceFleetResponse>(
  "DeleteDeviceFleetResponse",
)({}, ns) {}
export class DeleteEdgeDeploymentPlanRequest extends S.Class<DeleteEdgeDeploymentPlanRequest>(
  "DeleteEdgeDeploymentPlanRequest",
)(
  { EdgeDeploymentPlanName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEdgeDeploymentPlanResponse extends S.Class<DeleteEdgeDeploymentPlanResponse>(
  "DeleteEdgeDeploymentPlanResponse",
)({}, ns) {}
export class DeleteEdgeDeploymentStageRequest extends S.Class<DeleteEdgeDeploymentStageRequest>(
  "DeleteEdgeDeploymentStageRequest",
)(
  { EdgeDeploymentPlanName: S.String, StageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEdgeDeploymentStageResponse extends S.Class<DeleteEdgeDeploymentStageResponse>(
  "DeleteEdgeDeploymentStageResponse",
)({}, ns) {}
export class DeleteEndpointInput extends S.Class<DeleteEndpointInput>(
  "DeleteEndpointInput",
)(
  { EndpointName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({}, ns) {}
export class DeleteEndpointConfigInput extends S.Class<DeleteEndpointConfigInput>(
  "DeleteEndpointConfigInput",
)(
  { EndpointConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointConfigResponse extends S.Class<DeleteEndpointConfigResponse>(
  "DeleteEndpointConfigResponse",
)({}, ns) {}
export class DeleteExperimentRequest extends S.Class<DeleteExperimentRequest>(
  "DeleteExperimentRequest",
)(
  { ExperimentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFeatureGroupRequest extends S.Class<DeleteFeatureGroupRequest>(
  "DeleteFeatureGroupRequest",
)(
  { FeatureGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFeatureGroupResponse extends S.Class<DeleteFeatureGroupResponse>(
  "DeleteFeatureGroupResponse",
)({}, ns) {}
export class DeleteFlowDefinitionRequest extends S.Class<DeleteFlowDefinitionRequest>(
  "DeleteFlowDefinitionRequest",
)(
  { FlowDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFlowDefinitionResponse extends S.Class<DeleteFlowDefinitionResponse>(
  "DeleteFlowDefinitionResponse",
)({}, ns) {}
export class DeleteHubRequest extends S.Class<DeleteHubRequest>(
  "DeleteHubRequest",
)(
  { HubName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHubResponse extends S.Class<DeleteHubResponse>(
  "DeleteHubResponse",
)({}, ns) {}
export class DeleteHubContentRequest extends S.Class<DeleteHubContentRequest>(
  "DeleteHubContentRequest",
)(
  {
    HubName: S.String,
    HubContentType: S.String,
    HubContentName: S.String,
    HubContentVersion: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHubContentResponse extends S.Class<DeleteHubContentResponse>(
  "DeleteHubContentResponse",
)({}, ns) {}
export class DeleteHubContentReferenceRequest extends S.Class<DeleteHubContentReferenceRequest>(
  "DeleteHubContentReferenceRequest",
)(
  { HubName: S.String, HubContentType: S.String, HubContentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHubContentReferenceResponse extends S.Class<DeleteHubContentReferenceResponse>(
  "DeleteHubContentReferenceResponse",
)({}, ns) {}
export class DeleteHumanTaskUiRequest extends S.Class<DeleteHumanTaskUiRequest>(
  "DeleteHumanTaskUiRequest",
)(
  { HumanTaskUiName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHumanTaskUiResponse extends S.Class<DeleteHumanTaskUiResponse>(
  "DeleteHumanTaskUiResponse",
)({}, ns) {}
export class DeleteHyperParameterTuningJobRequest extends S.Class<DeleteHyperParameterTuningJobRequest>(
  "DeleteHyperParameterTuningJobRequest",
)(
  { HyperParameterTuningJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHyperParameterTuningJobResponse extends S.Class<DeleteHyperParameterTuningJobResponse>(
  "DeleteHyperParameterTuningJobResponse",
)({}, ns) {}
export class DeleteImageRequest extends S.Class<DeleteImageRequest>(
  "DeleteImageRequest",
)(
  { ImageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteImageResponse extends S.Class<DeleteImageResponse>(
  "DeleteImageResponse",
)({}, ns) {}
export class DeleteImageVersionRequest extends S.Class<DeleteImageVersionRequest>(
  "DeleteImageVersionRequest",
)(
  {
    ImageName: S.String,
    Version: S.optional(S.Number),
    Alias: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteImageVersionResponse extends S.Class<DeleteImageVersionResponse>(
  "DeleteImageVersionResponse",
)({}, ns) {}
export class DeleteInferenceComponentInput extends S.Class<DeleteInferenceComponentInput>(
  "DeleteInferenceComponentInput",
)(
  { InferenceComponentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteInferenceComponentResponse extends S.Class<DeleteInferenceComponentResponse>(
  "DeleteInferenceComponentResponse",
)({}, ns) {}
export class DeleteInferenceExperimentRequest extends S.Class<DeleteInferenceExperimentRequest>(
  "DeleteInferenceExperimentRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMlflowAppRequest extends S.Class<DeleteMlflowAppRequest>(
  "DeleteMlflowAppRequest",
)(
  { Arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMlflowTrackingServerRequest extends S.Class<DeleteMlflowTrackingServerRequest>(
  "DeleteMlflowTrackingServerRequest",
)(
  { TrackingServerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelInput extends S.Class<DeleteModelInput>(
  "DeleteModelInput",
)(
  { ModelName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelResponse extends S.Class<DeleteModelResponse>(
  "DeleteModelResponse",
)({}, ns) {}
export class DeleteModelBiasJobDefinitionRequest extends S.Class<DeleteModelBiasJobDefinitionRequest>(
  "DeleteModelBiasJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelBiasJobDefinitionResponse extends S.Class<DeleteModelBiasJobDefinitionResponse>(
  "DeleteModelBiasJobDefinitionResponse",
)({}, ns) {}
export class DeleteModelCardRequest extends S.Class<DeleteModelCardRequest>(
  "DeleteModelCardRequest",
)(
  { ModelCardName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelCardResponse extends S.Class<DeleteModelCardResponse>(
  "DeleteModelCardResponse",
)({}, ns) {}
export class DeleteModelExplainabilityJobDefinitionRequest extends S.Class<DeleteModelExplainabilityJobDefinitionRequest>(
  "DeleteModelExplainabilityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelExplainabilityJobDefinitionResponse extends S.Class<DeleteModelExplainabilityJobDefinitionResponse>(
  "DeleteModelExplainabilityJobDefinitionResponse",
)({}, ns) {}
export class DeleteModelPackageInput extends S.Class<DeleteModelPackageInput>(
  "DeleteModelPackageInput",
)(
  { ModelPackageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelPackageResponse extends S.Class<DeleteModelPackageResponse>(
  "DeleteModelPackageResponse",
)({}, ns) {}
export class DeleteModelPackageGroupInput extends S.Class<DeleteModelPackageGroupInput>(
  "DeleteModelPackageGroupInput",
)(
  { ModelPackageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelPackageGroupResponse extends S.Class<DeleteModelPackageGroupResponse>(
  "DeleteModelPackageGroupResponse",
)({}, ns) {}
export class DeleteModelPackageGroupPolicyInput extends S.Class<DeleteModelPackageGroupPolicyInput>(
  "DeleteModelPackageGroupPolicyInput",
)(
  { ModelPackageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelPackageGroupPolicyResponse extends S.Class<DeleteModelPackageGroupPolicyResponse>(
  "DeleteModelPackageGroupPolicyResponse",
)({}, ns) {}
export class DeleteModelQualityJobDefinitionRequest extends S.Class<DeleteModelQualityJobDefinitionRequest>(
  "DeleteModelQualityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteModelQualityJobDefinitionResponse extends S.Class<DeleteModelQualityJobDefinitionResponse>(
  "DeleteModelQualityJobDefinitionResponse",
)({}, ns) {}
export class DeleteMonitoringScheduleRequest extends S.Class<DeleteMonitoringScheduleRequest>(
  "DeleteMonitoringScheduleRequest",
)(
  { MonitoringScheduleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMonitoringScheduleResponse extends S.Class<DeleteMonitoringScheduleResponse>(
  "DeleteMonitoringScheduleResponse",
)({}, ns) {}
export class DeleteNotebookInstanceInput extends S.Class<DeleteNotebookInstanceInput>(
  "DeleteNotebookInstanceInput",
)(
  { NotebookInstanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotebookInstanceResponse extends S.Class<DeleteNotebookInstanceResponse>(
  "DeleteNotebookInstanceResponse",
)({}, ns) {}
export class DeleteNotebookInstanceLifecycleConfigInput extends S.Class<DeleteNotebookInstanceLifecycleConfigInput>(
  "DeleteNotebookInstanceLifecycleConfigInput",
)(
  { NotebookInstanceLifecycleConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotebookInstanceLifecycleConfigResponse extends S.Class<DeleteNotebookInstanceLifecycleConfigResponse>(
  "DeleteNotebookInstanceLifecycleConfigResponse",
)({}, ns) {}
export class DeleteOptimizationJobRequest extends S.Class<DeleteOptimizationJobRequest>(
  "DeleteOptimizationJobRequest",
)(
  { OptimizationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteOptimizationJobResponse extends S.Class<DeleteOptimizationJobResponse>(
  "DeleteOptimizationJobResponse",
)({}, ns) {}
export class DeletePartnerAppRequest extends S.Class<DeletePartnerAppRequest>(
  "DeletePartnerAppRequest",
)(
  { Arn: S.String, ClientToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePipelineRequest extends S.Class<DeletePipelineRequest>(
  "DeletePipelineRequest",
)(
  { PipelineName: S.String, ClientRequestToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProcessingJobRequest extends S.Class<DeleteProcessingJobRequest>(
  "DeleteProcessingJobRequest",
)(
  { ProcessingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProcessingJobResponse extends S.Class<DeleteProcessingJobResponse>(
  "DeleteProcessingJobResponse",
)({}, ns) {}
export class DeleteProjectInput extends S.Class<DeleteProjectInput>(
  "DeleteProjectInput",
)(
  { ProjectName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProjectResponse extends S.Class<DeleteProjectResponse>(
  "DeleteProjectResponse",
)({}, ns) {}
export class DeleteSpaceRequest extends S.Class<DeleteSpaceRequest>(
  "DeleteSpaceRequest",
)(
  { DomainId: S.String, SpaceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSpaceResponse extends S.Class<DeleteSpaceResponse>(
  "DeleteSpaceResponse",
)({}, ns) {}
export class DeleteStudioLifecycleConfigRequest extends S.Class<DeleteStudioLifecycleConfigRequest>(
  "DeleteStudioLifecycleConfigRequest",
)(
  { StudioLifecycleConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStudioLifecycleConfigResponse extends S.Class<DeleteStudioLifecycleConfigResponse>(
  "DeleteStudioLifecycleConfigResponse",
)({}, ns) {}
export class DeleteTagsInput extends S.Class<DeleteTagsInput>(
  "DeleteTagsInput",
)(
  { ResourceArn: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsOutput extends S.Class<DeleteTagsOutput>(
  "DeleteTagsOutput",
)({}, ns) {}
export class DeleteTrainingJobRequest extends S.Class<DeleteTrainingJobRequest>(
  "DeleteTrainingJobRequest",
)(
  { TrainingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrainingJobResponse extends S.Class<DeleteTrainingJobResponse>(
  "DeleteTrainingJobResponse",
)({}, ns) {}
export class DeleteTrialRequest extends S.Class<DeleteTrialRequest>(
  "DeleteTrialRequest",
)(
  { TrialName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTrialComponentRequest extends S.Class<DeleteTrialComponentRequest>(
  "DeleteTrialComponentRequest",
)(
  { TrialComponentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserProfileRequest extends S.Class<DeleteUserProfileRequest>(
  "DeleteUserProfileRequest",
)(
  { DomainId: S.String, UserProfileName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserProfileResponse extends S.Class<DeleteUserProfileResponse>(
  "DeleteUserProfileResponse",
)({}, ns) {}
export class DeleteWorkforceRequest extends S.Class<DeleteWorkforceRequest>(
  "DeleteWorkforceRequest",
)(
  { WorkforceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkforceResponse extends S.Class<DeleteWorkforceResponse>(
  "DeleteWorkforceResponse",
)({}, ns) {}
export class DeleteWorkteamRequest extends S.Class<DeleteWorkteamRequest>(
  "DeleteWorkteamRequest",
)(
  { WorkteamName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterDevicesRequest extends S.Class<DeregisterDevicesRequest>(
  "DeregisterDevicesRequest",
)(
  { DeviceFleetName: S.String, DeviceNames: DeviceNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterDevicesResponse extends S.Class<DeregisterDevicesResponse>(
  "DeregisterDevicesResponse",
)({}, ns) {}
export class DescribeActionRequest extends S.Class<DescribeActionRequest>(
  "DescribeActionRequest",
)(
  { ActionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAlgorithmInput extends S.Class<DescribeAlgorithmInput>(
  "DescribeAlgorithmInput",
)(
  { AlgorithmName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAppRequest extends S.Class<DescribeAppRequest>(
  "DescribeAppRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.optional(S.String),
    SpaceName: S.optional(S.String),
    AppType: S.String,
    AppName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAppImageConfigRequest extends S.Class<DescribeAppImageConfigRequest>(
  "DescribeAppImageConfigRequest",
)(
  { AppImageConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeArtifactRequest extends S.Class<DescribeArtifactRequest>(
  "DescribeArtifactRequest",
)(
  { ArtifactArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAutoMLJobRequest extends S.Class<DescribeAutoMLJobRequest>(
  "DescribeAutoMLJobRequest",
)(
  { AutoMLJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAutoMLJobV2Request extends S.Class<DescribeAutoMLJobV2Request>(
  "DescribeAutoMLJobV2Request",
)(
  { AutoMLJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterRequest extends S.Class<DescribeClusterRequest>(
  "DescribeClusterRequest",
)(
  { ClusterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterEventRequest extends S.Class<DescribeClusterEventRequest>(
  "DescribeClusterEventRequest",
)(
  { EventId: S.String, ClusterName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterNodeRequest extends S.Class<DescribeClusterNodeRequest>(
  "DescribeClusterNodeRequest",
)(
  {
    ClusterName: S.String,
    NodeId: S.optional(S.String),
    NodeLogicalId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClusterSchedulerConfigRequest extends S.Class<DescribeClusterSchedulerConfigRequest>(
  "DescribeClusterSchedulerConfigRequest",
)(
  {
    ClusterSchedulerConfigId: S.String,
    ClusterSchedulerConfigVersion: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCodeRepositoryInput extends S.Class<DescribeCodeRepositoryInput>(
  "DescribeCodeRepositoryInput",
)(
  { CodeRepositoryName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCompilationJobRequest extends S.Class<DescribeCompilationJobRequest>(
  "DescribeCompilationJobRequest",
)(
  { CompilationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeComputeQuotaRequest extends S.Class<DescribeComputeQuotaRequest>(
  "DescribeComputeQuotaRequest",
)(
  { ComputeQuotaId: S.String, ComputeQuotaVersion: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeContextRequest extends S.Class<DescribeContextRequest>(
  "DescribeContextRequest",
)(
  { ContextName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataQualityJobDefinitionRequest extends S.Class<DescribeDataQualityJobDefinitionRequest>(
  "DescribeDataQualityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeviceRequest extends S.Class<DescribeDeviceRequest>(
  "DescribeDeviceRequest",
)(
  {
    NextToken: S.optional(S.String),
    DeviceName: S.String,
    DeviceFleetName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDeviceFleetRequest extends S.Class<DescribeDeviceFleetRequest>(
  "DescribeDeviceFleetRequest",
)(
  { DeviceFleetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDomainRequest extends S.Class<DescribeDomainRequest>(
  "DescribeDomainRequest",
)(
  { DomainId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEdgeDeploymentPlanRequest extends S.Class<DescribeEdgeDeploymentPlanRequest>(
  "DescribeEdgeDeploymentPlanRequest",
)(
  {
    EdgeDeploymentPlanName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEdgePackagingJobRequest extends S.Class<DescribeEdgePackagingJobRequest>(
  "DescribeEdgePackagingJobRequest",
)(
  { EdgePackagingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointInput extends S.Class<DescribeEndpointInput>(
  "DescribeEndpointInput",
)(
  { EndpointName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointConfigInput extends S.Class<DescribeEndpointConfigInput>(
  "DescribeEndpointConfigInput",
)(
  { EndpointConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExperimentRequest extends S.Class<DescribeExperimentRequest>(
  "DescribeExperimentRequest",
)(
  { ExperimentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFeatureGroupRequest extends S.Class<DescribeFeatureGroupRequest>(
  "DescribeFeatureGroupRequest",
)(
  { FeatureGroupName: S.String, NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFeatureMetadataRequest extends S.Class<DescribeFeatureMetadataRequest>(
  "DescribeFeatureMetadataRequest",
)(
  { FeatureGroupName: S.String, FeatureName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFlowDefinitionRequest extends S.Class<DescribeFlowDefinitionRequest>(
  "DescribeFlowDefinitionRequest",
)(
  { FlowDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHubRequest extends S.Class<DescribeHubRequest>(
  "DescribeHubRequest",
)(
  { HubName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHubContentRequest extends S.Class<DescribeHubContentRequest>(
  "DescribeHubContentRequest",
)(
  {
    HubName: S.String,
    HubContentType: S.String,
    HubContentName: S.String,
    HubContentVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHumanTaskUiRequest extends S.Class<DescribeHumanTaskUiRequest>(
  "DescribeHumanTaskUiRequest",
)(
  { HumanTaskUiName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHyperParameterTuningJobRequest extends S.Class<DescribeHyperParameterTuningJobRequest>(
  "DescribeHyperParameterTuningJobRequest",
)(
  { HyperParameterTuningJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImageRequest extends S.Class<DescribeImageRequest>(
  "DescribeImageRequest",
)(
  { ImageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeImageVersionRequest extends S.Class<DescribeImageVersionRequest>(
  "DescribeImageVersionRequest",
)(
  {
    ImageName: S.String,
    Version: S.optional(S.Number),
    Alias: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInferenceComponentInput extends S.Class<DescribeInferenceComponentInput>(
  "DescribeInferenceComponentInput",
)(
  { InferenceComponentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInferenceExperimentRequest extends S.Class<DescribeInferenceExperimentRequest>(
  "DescribeInferenceExperimentRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInferenceRecommendationsJobRequest extends S.Class<DescribeInferenceRecommendationsJobRequest>(
  "DescribeInferenceRecommendationsJobRequest",
)(
  { JobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLabelingJobRequest extends S.Class<DescribeLabelingJobRequest>(
  "DescribeLabelingJobRequest",
)(
  { LabelingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLineageGroupRequest extends S.Class<DescribeLineageGroupRequest>(
  "DescribeLineageGroupRequest",
)(
  { LineageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMlflowAppRequest extends S.Class<DescribeMlflowAppRequest>(
  "DescribeMlflowAppRequest",
)(
  { Arn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMlflowTrackingServerRequest extends S.Class<DescribeMlflowTrackingServerRequest>(
  "DescribeMlflowTrackingServerRequest",
)(
  { TrackingServerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelInput extends S.Class<DescribeModelInput>(
  "DescribeModelInput",
)(
  { ModelName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelBiasJobDefinitionRequest extends S.Class<DescribeModelBiasJobDefinitionRequest>(
  "DescribeModelBiasJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelCardRequest extends S.Class<DescribeModelCardRequest>(
  "DescribeModelCardRequest",
)(
  { ModelCardName: S.String, ModelCardVersion: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelCardExportJobRequest extends S.Class<DescribeModelCardExportJobRequest>(
  "DescribeModelCardExportJobRequest",
)(
  { ModelCardExportJobArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelExplainabilityJobDefinitionRequest extends S.Class<DescribeModelExplainabilityJobDefinitionRequest>(
  "DescribeModelExplainabilityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelPackageInput extends S.Class<DescribeModelPackageInput>(
  "DescribeModelPackageInput",
)(
  { ModelPackageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelPackageGroupInput extends S.Class<DescribeModelPackageGroupInput>(
  "DescribeModelPackageGroupInput",
)(
  { ModelPackageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeModelQualityJobDefinitionRequest extends S.Class<DescribeModelQualityJobDefinitionRequest>(
  "DescribeModelQualityJobDefinitionRequest",
)(
  { JobDefinitionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMonitoringScheduleRequest extends S.Class<DescribeMonitoringScheduleRequest>(
  "DescribeMonitoringScheduleRequest",
)(
  { MonitoringScheduleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotebookInstanceInput extends S.Class<DescribeNotebookInstanceInput>(
  "DescribeNotebookInstanceInput",
)(
  { NotebookInstanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotebookInstanceLifecycleConfigInput extends S.Class<DescribeNotebookInstanceLifecycleConfigInput>(
  "DescribeNotebookInstanceLifecycleConfigInput",
)(
  { NotebookInstanceLifecycleConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeOptimizationJobRequest extends S.Class<DescribeOptimizationJobRequest>(
  "DescribeOptimizationJobRequest",
)(
  { OptimizationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePartnerAppRequest extends S.Class<DescribePartnerAppRequest>(
  "DescribePartnerAppRequest",
)(
  { Arn: S.String, IncludeAvailableUpgrade: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePipelineRequest extends S.Class<DescribePipelineRequest>(
  "DescribePipelineRequest",
)(
  { PipelineName: S.String, PipelineVersionId: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePipelineDefinitionForExecutionRequest extends S.Class<DescribePipelineDefinitionForExecutionRequest>(
  "DescribePipelineDefinitionForExecutionRequest",
)(
  { PipelineExecutionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePipelineExecutionRequest extends S.Class<DescribePipelineExecutionRequest>(
  "DescribePipelineExecutionRequest",
)(
  { PipelineExecutionArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProcessingJobRequest extends S.Class<DescribeProcessingJobRequest>(
  "DescribeProcessingJobRequest",
)(
  { ProcessingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProjectInput extends S.Class<DescribeProjectInput>(
  "DescribeProjectInput",
)(
  { ProjectName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedCapacityRequest extends S.Class<DescribeReservedCapacityRequest>(
  "DescribeReservedCapacityRequest",
)(
  { ReservedCapacityArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSpaceRequest extends S.Class<DescribeSpaceRequest>(
  "DescribeSpaceRequest",
)(
  { DomainId: S.String, SpaceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStudioLifecycleConfigRequest extends S.Class<DescribeStudioLifecycleConfigRequest>(
  "DescribeStudioLifecycleConfigRequest",
)(
  { StudioLifecycleConfigName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSubscribedWorkteamRequest extends S.Class<DescribeSubscribedWorkteamRequest>(
  "DescribeSubscribedWorkteamRequest",
)(
  { WorkteamArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrainingJobRequest extends S.Class<DescribeTrainingJobRequest>(
  "DescribeTrainingJobRequest",
)(
  { TrainingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrainingPlanRequest extends S.Class<DescribeTrainingPlanRequest>(
  "DescribeTrainingPlanRequest",
)(
  { TrainingPlanName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTransformJobRequest extends S.Class<DescribeTransformJobRequest>(
  "DescribeTransformJobRequest",
)(
  { TransformJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrialRequest extends S.Class<DescribeTrialRequest>(
  "DescribeTrialRequest",
)(
  { TrialName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTrialComponentRequest extends S.Class<DescribeTrialComponentRequest>(
  "DescribeTrialComponentRequest",
)(
  { TrialComponentName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserProfileRequest extends S.Class<DescribeUserProfileRequest>(
  "DescribeUserProfileRequest",
)(
  { DomainId: S.String, UserProfileName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWorkforceRequest extends S.Class<DescribeWorkforceRequest>(
  "DescribeWorkforceRequest",
)(
  { WorkforceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWorkteamRequest extends S.Class<DescribeWorkteamRequest>(
  "DescribeWorkteamRequest",
)(
  { WorkteamName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachClusterNodeVolumeRequest extends S.Class<DetachClusterNodeVolumeRequest>(
  "DetachClusterNodeVolumeRequest",
)(
  { ClusterArn: S.String, NodeId: S.String, VolumeId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateTrialComponentRequest extends S.Class<DisassociateTrialComponentRequest>(
  "DisassociateTrialComponentRequest",
)(
  { TrialComponentName: S.String, TrialName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeviceFleetReportRequest extends S.Class<GetDeviceFleetReportRequest>(
  "GetDeviceFleetReportRequest",
)(
  { DeviceFleetName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetLineageGroupPolicyRequest extends S.Class<GetLineageGroupPolicyRequest>(
  "GetLineageGroupPolicyRequest",
)(
  { LineageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetModelPackageGroupPolicyInput extends S.Class<GetModelPackageGroupPolicyInput>(
  "GetModelPackageGroupPolicyInput",
)(
  { ModelPackageGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSagemakerServicecatalogPortfolioStatusOutput extends S.Class<GetSagemakerServicecatalogPortfolioStatusOutput>(
  "GetSagemakerServicecatalogPortfolioStatusOutput",
)({ Status: S.optional(S.String) }, ns) {}
export class ImportHubContentRequest extends S.Class<ImportHubContentRequest>(
  "ImportHubContentRequest",
)(
  {
    HubContentName: S.String,
    HubContentVersion: S.optional(S.String),
    HubContentType: S.String,
    DocumentSchemaVersion: S.String,
    HubName: S.String,
    HubContentDisplayName: S.optional(S.String),
    HubContentDescription: S.optional(S.String),
    HubContentMarkdown: S.optional(S.String),
    HubContentDocument: S.String,
    SupportStatus: S.optional(S.String),
    HubContentSearchKeywords: S.optional(HubContentSearchKeywordList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListActionsRequest extends S.Class<ListActionsRequest>(
  "ListActionsRequest",
)(
  {
    SourceUri: S.optional(S.String),
    ActionType: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAlgorithmsInput extends S.Class<ListAlgorithmsInput>(
  "ListAlgorithmsInput",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAliasesRequest extends S.Class<ListAliasesRequest>(
  "ListAliasesRequest",
)(
  {
    ImageName: S.String,
    Alias: S.optional(S.String),
    Version: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAppImageConfigsRequest extends S.Class<ListAppImageConfigsRequest>(
  "ListAppImageConfigsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAppsRequest extends S.Class<ListAppsRequest>(
  "ListAppsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    DomainIdEquals: S.optional(S.String),
    UserProfileNameEquals: S.optional(S.String),
    SpaceNameEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListArtifactsRequest extends S.Class<ListArtifactsRequest>(
  "ListArtifactsRequest",
)(
  {
    SourceUri: S.optional(S.String),
    ArtifactType: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAssociationsRequest extends S.Class<ListAssociationsRequest>(
  "ListAssociationsRequest",
)(
  {
    SourceArn: S.optional(S.String),
    DestinationArn: S.optional(S.String),
    SourceType: S.optional(S.String),
    DestinationType: S.optional(S.String),
    AssociationType: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutoMLJobsRequest extends S.Class<ListAutoMLJobsRequest>(
  "ListAutoMLJobsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCandidatesForAutoMLJobRequest extends S.Class<ListCandidatesForAutoMLJobRequest>(
  "ListCandidatesForAutoMLJobRequest",
)(
  {
    AutoMLJobName: S.String,
    StatusEquals: S.optional(S.String),
    CandidateNameEquals: S.optional(S.String),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClusterEventsRequest extends S.Class<ListClusterEventsRequest>(
  "ListClusterEventsRequest",
)(
  {
    ClusterName: S.String,
    InstanceGroupName: S.optional(S.String),
    NodeId: S.optional(S.String),
    EventTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    ResourceType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClusterNodesRequest extends S.Class<ListClusterNodesRequest>(
  "ListClusterNodesRequest",
)(
  {
    ClusterName: S.String,
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InstanceGroupNameContains: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    IncludeNodeLogicalIds: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    TrainingPlanArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClusterSchedulerConfigsRequest extends S.Class<ListClusterSchedulerConfigsRequest>(
  "ListClusterSchedulerConfigsRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NameContains: S.optional(S.String),
    ClusterArn: S.optional(S.String),
    Status: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCodeRepositoriesInput extends S.Class<ListCodeRepositoriesInput>(
  "ListCodeRepositoriesInput",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCompilationJobsRequest extends S.Class<ListCompilationJobsRequest>(
  "ListCompilationJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComputeQuotasRequest extends S.Class<ListComputeQuotasRequest>(
  "ListComputeQuotasRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NameContains: S.optional(S.String),
    Status: S.optional(S.String),
    ClusterArn: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContextsRequest extends S.Class<ListContextsRequest>(
  "ListContextsRequest",
)(
  {
    SourceUri: S.optional(S.String),
    ContextType: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataQualityJobDefinitionsRequest extends S.Class<ListDataQualityJobDefinitionsRequest>(
  "ListDataQualityJobDefinitionsRequest",
)(
  {
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeviceFleetsRequest extends S.Class<ListDeviceFleetsRequest>(
  "ListDeviceFleetsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDevicesRequest extends S.Class<ListDevicesRequest>(
  "ListDevicesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    LatestHeartbeatAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModelName: S.optional(S.String),
    DeviceFleetName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDomainsRequest extends S.Class<ListDomainsRequest>(
  "ListDomainsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEdgeDeploymentPlansRequest extends S.Class<ListEdgeDeploymentPlansRequest>(
  "ListEdgeDeploymentPlansRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    DeviceFleetNameContains: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEdgePackagingJobsRequest extends S.Class<ListEdgePackagingJobsRequest>(
  "ListEdgePackagingJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    ModelNameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointConfigsInput extends S.Class<ListEndpointConfigsInput>(
  "ListEndpointConfigsInput",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointsInput extends S.Class<ListEndpointsInput>(
  "ListEndpointsInput",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExperimentsRequest extends S.Class<ListExperimentsRequest>(
  "ListExperimentsRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFeatureGroupsRequest extends S.Class<ListFeatureGroupsRequest>(
  "ListFeatureGroupsRequest",
)(
  {
    NameContains: S.optional(S.String),
    FeatureGroupStatusEquals: S.optional(S.String),
    OfflineStoreStatusEquals: S.optional(S.String),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFlowDefinitionsRequest extends S.Class<ListFlowDefinitionsRequest>(
  "ListFlowDefinitionsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHubContentsRequest extends S.Class<ListHubContentsRequest>(
  "ListHubContentsRequest",
)(
  {
    HubName: S.String,
    HubContentType: S.String,
    NameContains: S.optional(S.String),
    MaxSchemaVersion: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHubContentVersionsRequest extends S.Class<ListHubContentVersionsRequest>(
  "ListHubContentVersionsRequest",
)(
  {
    HubName: S.String,
    HubContentType: S.String,
    HubContentName: S.String,
    MinVersion: S.optional(S.String),
    MaxSchemaVersion: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHubsRequest extends S.Class<ListHubsRequest>(
  "ListHubsRequest",
)(
  {
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHumanTaskUisRequest extends S.Class<ListHumanTaskUisRequest>(
  "ListHumanTaskUisRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListHyperParameterTuningJobsRequest extends S.Class<ListHyperParameterTuningJobsRequest>(
  "ListHyperParameterTuningJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NameContains: S.optional(S.String),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImagesRequest extends S.Class<ListImagesRequest>(
  "ListImagesRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListImageVersionsRequest extends S.Class<ListImageVersionsRequest>(
  "ListImageVersionsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImageName: S.String,
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInferenceComponentsInput extends S.Class<ListInferenceComponentsInput>(
  "ListInferenceComponentsInput",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
    EndpointNameEquals: S.optional(S.String),
    VariantNameEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInferenceExperimentsRequest extends S.Class<ListInferenceExperimentsRequest>(
  "ListInferenceExperimentsRequest",
)(
  {
    NameContains: S.optional(S.String),
    Type: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInferenceRecommendationsJobsRequest extends S.Class<ListInferenceRecommendationsJobsRequest>(
  "ListInferenceRecommendationsJobsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ModelNameEquals: S.optional(S.String),
    ModelPackageVersionArnEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListInferenceRecommendationsJobStepsRequest extends S.Class<ListInferenceRecommendationsJobStepsRequest>(
  "ListInferenceRecommendationsJobStepsRequest",
)(
  {
    JobName: S.String,
    Status: S.optional(S.String),
    StepType: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLabelingJobsRequest extends S.Class<ListLabelingJobsRequest>(
  "ListLabelingJobsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    NameContains: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    StatusEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLabelingJobsForWorkteamRequest extends S.Class<ListLabelingJobsForWorkteamRequest>(
  "ListLabelingJobsForWorkteamRequest",
)(
  {
    WorkteamArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    JobReferenceCodeContains: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLineageGroupsRequest extends S.Class<ListLineageGroupsRequest>(
  "ListLineageGroupsRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMlflowAppsRequest extends S.Class<ListMlflowAppsRequest>(
  "ListMlflowAppsRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    MlflowVersion: S.optional(S.String),
    DefaultForDomainId: S.optional(S.String),
    AccountDefaultStatus: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMlflowTrackingServersRequest extends S.Class<ListMlflowTrackingServersRequest>(
  "ListMlflowTrackingServersRequest",
)(
  {
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TrackingServerStatus: S.optional(S.String),
    MlflowVersion: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelBiasJobDefinitionsRequest extends S.Class<ListModelBiasJobDefinitionsRequest>(
  "ListModelBiasJobDefinitionsRequest",
)(
  {
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelCardExportJobsRequest extends S.Class<ListModelCardExportJobsRequest>(
  "ListModelCardExportJobsRequest",
)(
  {
    ModelCardName: S.String,
    ModelCardVersion: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModelCardExportJobNameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelCardsRequest extends S.Class<ListModelCardsRequest>(
  "ListModelCardsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    ModelCardStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelCardVersionsRequest extends S.Class<ListModelCardVersionsRequest>(
  "ListModelCardVersionsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    ModelCardName: S.String,
    ModelCardStatus: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelExplainabilityJobDefinitionsRequest extends S.Class<ListModelExplainabilityJobDefinitionsRequest>(
  "ListModelExplainabilityJobDefinitionsRequest",
)(
  {
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelPackageGroupsInput extends S.Class<ListModelPackageGroupsInput>(
  "ListModelPackageGroupsInput",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    CrossAccountFilterOption: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelPackagesInput extends S.Class<ListModelPackagesInput>(
  "ListModelPackagesInput",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    ModelApprovalStatus: S.optional(S.String),
    ModelPackageGroupName: S.optional(S.String),
    ModelPackageType: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelQualityJobDefinitionsRequest extends S.Class<ListModelQualityJobDefinitionsRequest>(
  "ListModelQualityJobDefinitionsRequest",
)(
  {
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelsInput extends S.Class<ListModelsInput>(
  "ListModelsInput",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitoringAlertHistoryRequest extends S.Class<ListMonitoringAlertHistoryRequest>(
  "ListMonitoringAlertHistoryRequest",
)(
  {
    MonitoringScheduleName: S.optional(S.String),
    MonitoringAlertName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitoringAlertsRequest extends S.Class<ListMonitoringAlertsRequest>(
  "ListMonitoringAlertsRequest",
)(
  {
    MonitoringScheduleName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitoringExecutionsRequest extends S.Class<ListMonitoringExecutionsRequest>(
  "ListMonitoringExecutionsRequest",
)(
  {
    MonitoringScheduleName: S.optional(S.String),
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ScheduledTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ScheduledTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
    MonitoringJobDefinitionName: S.optional(S.String),
    MonitoringTypeEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitoringSchedulesRequest extends S.Class<ListMonitoringSchedulesRequest>(
  "ListMonitoringSchedulesRequest",
)(
  {
    EndpointName: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
    MonitoringJobDefinitionName: S.optional(S.String),
    MonitoringTypeEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNotebookInstanceLifecycleConfigsInput extends S.Class<ListNotebookInstanceLifecycleConfigsInput>(
  "ListNotebookInstanceLifecycleConfigsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNotebookInstancesInput extends S.Class<ListNotebookInstancesInput>(
  "ListNotebookInstancesInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NameContains: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StatusEquals: S.optional(S.String),
    NotebookInstanceLifecycleConfigNameContains: S.optional(S.String),
    DefaultCodeRepositoryContains: S.optional(S.String),
    AdditionalCodeRepositoryEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListOptimizationJobsRequest extends S.Class<ListOptimizationJobsRequest>(
  "ListOptimizationJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OptimizationContains: S.optional(S.String),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPartnerAppsRequest extends S.Class<ListPartnerAppsRequest>(
  "ListPartnerAppsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPipelineExecutionsRequest extends S.Class<ListPipelineExecutionsRequest>(
  "ListPipelineExecutionsRequest",
)(
  {
    PipelineName: S.String,
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPipelineExecutionStepsRequest extends S.Class<ListPipelineExecutionStepsRequest>(
  "ListPipelineExecutionStepsRequest",
)(
  {
    PipelineExecutionArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPipelineParametersForExecutionRequest extends S.Class<ListPipelineParametersForExecutionRequest>(
  "ListPipelineParametersForExecutionRequest",
)(
  {
    PipelineExecutionArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPipelinesRequest extends S.Class<ListPipelinesRequest>(
  "ListPipelinesRequest",
)(
  {
    PipelineNamePrefix: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPipelineVersionsRequest extends S.Class<ListPipelineVersionsRequest>(
  "ListPipelineVersionsRequest",
)(
  {
    PipelineName: S.String,
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProcessingJobsRequest extends S.Class<ListProcessingJobsRequest>(
  "ListProcessingJobsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListProjectsInput extends S.Class<ListProjectsInput>(
  "ListProjectsInput",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MaxResults: S.optional(S.Number),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListResourceCatalogsRequest extends S.Class<ListResourceCatalogsRequest>(
  "ListResourceCatalogsRequest",
)(
  {
    NameContains: S.optional(S.String),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSpacesRequest extends S.Class<ListSpacesRequest>(
  "ListSpacesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    DomainIdEquals: S.optional(S.String),
    SpaceNameContains: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStageDevicesRequest extends S.Class<ListStageDevicesRequest>(
  "ListStageDevicesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    EdgeDeploymentPlanName: S.String,
    ExcludeDevicesDeployedInOtherStage: S.optional(S.Boolean),
    StageName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStudioLifecycleConfigsRequest extends S.Class<ListStudioLifecycleConfigsRequest>(
  "ListStudioLifecycleConfigsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    NameContains: S.optional(S.String),
    AppTypeEquals: S.optional(S.String),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSubscribedWorkteamsRequest extends S.Class<ListSubscribedWorkteamsRequest>(
  "ListSubscribedWorkteamsRequest",
)(
  {
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsInput extends S.Class<ListTagsInput>("ListTagsInput")(
  {
    ResourceArn: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrainingJobsRequest extends S.Class<ListTrainingJobsRequest>(
  "ListTrainingJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    WarmPoolStatusEquals: S.optional(S.String),
    TrainingPlanArnEquals: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrainingJobsForHyperParameterTuningJobRequest extends S.Class<ListTrainingJobsForHyperParameterTuningJobRequest>(
  "ListTrainingJobsForHyperParameterTuningJobRequest",
)(
  {
    HyperParameterTuningJobName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTransformJobsRequest extends S.Class<ListTransformJobsRequest>(
  "ListTransformJobsRequest",
)(
  {
    CreationTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    NameContains: S.optional(S.String),
    StatusEquals: S.optional(S.String),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrialComponentsRequest extends S.Class<ListTrialComponentsRequest>(
  "ListTrialComponentsRequest",
)(
  {
    ExperimentName: S.optional(S.String),
    TrialName: S.optional(S.String),
    SourceArn: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTrialsRequest extends S.Class<ListTrialsRequest>(
  "ListTrialsRequest",
)(
  {
    ExperimentName: S.optional(S.String),
    TrialComponentName: S.optional(S.String),
    CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUltraServersByReservedCapacityRequest extends S.Class<ListUltraServersByReservedCapacityRequest>(
  "ListUltraServersByReservedCapacityRequest",
)(
  {
    ReservedCapacityArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUserProfilesRequest extends S.Class<ListUserProfilesRequest>(
  "ListUserProfilesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortOrder: S.optional(S.String),
    SortBy: S.optional(S.String),
    DomainIdEquals: S.optional(S.String),
    UserProfileNameContains: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkforcesRequest extends S.Class<ListWorkforcesRequest>(
  "ListWorkforcesRequest",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkteamsRequest extends S.Class<ListWorkteamsRequest>(
  "ListWorkteamsRequest",
)(
  {
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NameContains: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutModelPackageGroupPolicyInput extends S.Class<PutModelPackageGroupPolicyInput>(
  "PutModelPackageGroupPolicyInput",
)(
  { ModelPackageGroupName: S.String, ResourcePolicy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ParallelismConfiguration extends S.Class<ParallelismConfiguration>(
  "ParallelismConfiguration",
)({ MaxParallelExecutionSteps: S.Number }) {}
export class RetryPipelineExecutionRequest extends S.Class<RetryPipelineExecutionRequest>(
  "RetryPipelineExecutionRequest",
)(
  {
    PipelineExecutionArn: S.String,
    ClientRequestToken: S.String,
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchTrainingPlanOfferingsRequest extends S.Class<SearchTrainingPlanOfferingsRequest>(
  "SearchTrainingPlanOfferingsRequest",
)(
  {
    InstanceType: S.optional(S.String),
    InstanceCount: S.optional(S.Number),
    UltraServerType: S.optional(S.String),
    UltraServerCount: S.optional(S.Number),
    StartTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTimeBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DurationHours: S.Number,
    TargetResources: SageMakerResourceNames,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendPipelineExecutionStepFailureRequest extends S.Class<SendPipelineExecutionStepFailureRequest>(
  "SendPipelineExecutionStepFailureRequest",
)(
  {
    CallbackToken: S.String,
    FailureReason: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEdgeDeploymentStageRequest extends S.Class<StartEdgeDeploymentStageRequest>(
  "StartEdgeDeploymentStageRequest",
)(
  { EdgeDeploymentPlanName: S.String, StageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartEdgeDeploymentStageResponse extends S.Class<StartEdgeDeploymentStageResponse>(
  "StartEdgeDeploymentStageResponse",
)({}, ns) {}
export class StartInferenceExperimentRequest extends S.Class<StartInferenceExperimentRequest>(
  "StartInferenceExperimentRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMlflowTrackingServerRequest extends S.Class<StartMlflowTrackingServerRequest>(
  "StartMlflowTrackingServerRequest",
)(
  { TrackingServerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMonitoringScheduleRequest extends S.Class<StartMonitoringScheduleRequest>(
  "StartMonitoringScheduleRequest",
)(
  { MonitoringScheduleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMonitoringScheduleResponse extends S.Class<StartMonitoringScheduleResponse>(
  "StartMonitoringScheduleResponse",
)({}, ns) {}
export class StartNotebookInstanceInput extends S.Class<StartNotebookInstanceInput>(
  "StartNotebookInstanceInput",
)(
  { NotebookInstanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartNotebookInstanceResponse extends S.Class<StartNotebookInstanceResponse>(
  "StartNotebookInstanceResponse",
)({}, ns) {}
export class StartSessionRequest extends S.Class<StartSessionRequest>(
  "StartSessionRequest",
)(
  { ResourceIdentifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAutoMLJobRequest extends S.Class<StopAutoMLJobRequest>(
  "StopAutoMLJobRequest",
)(
  { AutoMLJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopAutoMLJobResponse extends S.Class<StopAutoMLJobResponse>(
  "StopAutoMLJobResponse",
)({}, ns) {}
export class StopCompilationJobRequest extends S.Class<StopCompilationJobRequest>(
  "StopCompilationJobRequest",
)(
  { CompilationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopCompilationJobResponse extends S.Class<StopCompilationJobResponse>(
  "StopCompilationJobResponse",
)({}, ns) {}
export class StopEdgeDeploymentStageRequest extends S.Class<StopEdgeDeploymentStageRequest>(
  "StopEdgeDeploymentStageRequest",
)(
  { EdgeDeploymentPlanName: S.String, StageName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEdgeDeploymentStageResponse extends S.Class<StopEdgeDeploymentStageResponse>(
  "StopEdgeDeploymentStageResponse",
)({}, ns) {}
export class StopEdgePackagingJobRequest extends S.Class<StopEdgePackagingJobRequest>(
  "StopEdgePackagingJobRequest",
)(
  { EdgePackagingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopEdgePackagingJobResponse extends S.Class<StopEdgePackagingJobResponse>(
  "StopEdgePackagingJobResponse",
)({}, ns) {}
export class StopHyperParameterTuningJobRequest extends S.Class<StopHyperParameterTuningJobRequest>(
  "StopHyperParameterTuningJobRequest",
)(
  { HyperParameterTuningJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopHyperParameterTuningJobResponse extends S.Class<StopHyperParameterTuningJobResponse>(
  "StopHyperParameterTuningJobResponse",
)({}, ns) {}
export class StopInferenceRecommendationsJobRequest extends S.Class<StopInferenceRecommendationsJobRequest>(
  "StopInferenceRecommendationsJobRequest",
)(
  { JobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopInferenceRecommendationsJobResponse extends S.Class<StopInferenceRecommendationsJobResponse>(
  "StopInferenceRecommendationsJobResponse",
)({}, ns) {}
export class StopLabelingJobRequest extends S.Class<StopLabelingJobRequest>(
  "StopLabelingJobRequest",
)(
  { LabelingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopLabelingJobResponse extends S.Class<StopLabelingJobResponse>(
  "StopLabelingJobResponse",
)({}, ns) {}
export class StopMlflowTrackingServerRequest extends S.Class<StopMlflowTrackingServerRequest>(
  "StopMlflowTrackingServerRequest",
)(
  { TrackingServerName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMonitoringScheduleRequest extends S.Class<StopMonitoringScheduleRequest>(
  "StopMonitoringScheduleRequest",
)(
  { MonitoringScheduleName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMonitoringScheduleResponse extends S.Class<StopMonitoringScheduleResponse>(
  "StopMonitoringScheduleResponse",
)({}, ns) {}
export class StopNotebookInstanceInput extends S.Class<StopNotebookInstanceInput>(
  "StopNotebookInstanceInput",
)(
  { NotebookInstanceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopNotebookInstanceResponse extends S.Class<StopNotebookInstanceResponse>(
  "StopNotebookInstanceResponse",
)({}, ns) {}
export class StopOptimizationJobRequest extends S.Class<StopOptimizationJobRequest>(
  "StopOptimizationJobRequest",
)(
  { OptimizationJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopOptimizationJobResponse extends S.Class<StopOptimizationJobResponse>(
  "StopOptimizationJobResponse",
)({}, ns) {}
export class StopPipelineExecutionRequest extends S.Class<StopPipelineExecutionRequest>(
  "StopPipelineExecutionRequest",
)(
  { PipelineExecutionArn: S.String, ClientRequestToken: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopProcessingJobRequest extends S.Class<StopProcessingJobRequest>(
  "StopProcessingJobRequest",
)(
  { ProcessingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopProcessingJobResponse extends S.Class<StopProcessingJobResponse>(
  "StopProcessingJobResponse",
)({}, ns) {}
export class StopTrainingJobRequest extends S.Class<StopTrainingJobRequest>(
  "StopTrainingJobRequest",
)(
  { TrainingJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTrainingJobResponse extends S.Class<StopTrainingJobResponse>(
  "StopTrainingJobResponse",
)({}, ns) {}
export class StopTransformJobRequest extends S.Class<StopTransformJobRequest>(
  "StopTransformJobRequest",
)(
  { TransformJobName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTransformJobResponse extends S.Class<StopTransformJobResponse>(
  "StopTransformJobResponse",
)({}, ns) {}
export const LineageEntityParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateActionRequest extends S.Class<UpdateActionRequest>(
  "UpdateActionRequest",
)(
  {
    ActionName: S.String,
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    PropertiesToRemove: S.optional(ListLineageEntityParameterKey),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class KernelSpec extends S.Class<KernelSpec>("KernelSpec")({
  Name: S.String,
  DisplayName: S.optional(S.String),
}) {}
export const KernelSpecs = S.Array(KernelSpec);
export class FileSystemConfig extends S.Class<FileSystemConfig>(
  "FileSystemConfig",
)({
  MountPath: S.optional(S.String),
  DefaultUid: S.optional(S.Number),
  DefaultGid: S.optional(S.Number),
}) {}
export class KernelGatewayImageConfig extends S.Class<KernelGatewayImageConfig>(
  "KernelGatewayImageConfig",
)({
  KernelSpecs: KernelSpecs,
  FileSystemConfig: S.optional(FileSystemConfig),
}) {}
export const CustomImageContainerArguments = S.Array(S.String);
export const CustomImageContainerEntrypoint = S.Array(S.String);
export const CustomImageContainerEnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class ContainerConfig extends S.Class<ContainerConfig>(
  "ContainerConfig",
)({
  ContainerArguments: S.optional(CustomImageContainerArguments),
  ContainerEntrypoint: S.optional(CustomImageContainerEntrypoint),
  ContainerEnvironmentVariables: S.optional(
    CustomImageContainerEnvironmentVariables,
  ),
}) {}
export class JupyterLabAppImageConfig extends S.Class<JupyterLabAppImageConfig>(
  "JupyterLabAppImageConfig",
)({
  FileSystemConfig: S.optional(FileSystemConfig),
  ContainerConfig: S.optional(ContainerConfig),
}) {}
export class CodeEditorAppImageConfig extends S.Class<CodeEditorAppImageConfig>(
  "CodeEditorAppImageConfig",
)({
  FileSystemConfig: S.optional(FileSystemConfig),
  ContainerConfig: S.optional(ContainerConfig),
}) {}
export class UpdateAppImageConfigRequest extends S.Class<UpdateAppImageConfigRequest>(
  "UpdateAppImageConfigRequest",
)(
  {
    AppImageConfigName: S.String,
    KernelGatewayImageConfig: S.optional(KernelGatewayImageConfig),
    JupyterLabAppImageConfig: S.optional(JupyterLabAppImageConfig),
    CodeEditorAppImageConfig: S.optional(CodeEditorAppImageConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ArtifactProperties = S.Record({ key: S.String, value: S.String });
export class UpdateArtifactRequest extends S.Class<UpdateArtifactRequest>(
  "UpdateArtifactRequest",
)(
  {
    ArtifactArn: S.String,
    ArtifactName: S.optional(S.String),
    Properties: S.optional(ArtifactProperties),
    PropertiesToRemove: S.optional(ListLineageEntityParameterKey),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ClusterLifeCycleConfig extends S.Class<ClusterLifeCycleConfig>(
  "ClusterLifeCycleConfig",
)({ SourceS3Uri: S.String, OnCreate: S.String }) {}
export class ClusterEbsVolumeConfig extends S.Class<ClusterEbsVolumeConfig>(
  "ClusterEbsVolumeConfig",
)({
  VolumeSizeInGB: S.optional(S.Number),
  VolumeKmsKeyId: S.optional(S.String),
  RootVolume: S.optional(S.Boolean),
}) {}
export const ClusterInstanceStorageConfig = S.Union(
  S.Struct({ EbsVolumeConfig: ClusterEbsVolumeConfig }),
);
export const ClusterInstanceStorageConfigs = S.Array(
  ClusterInstanceStorageConfig,
);
export const OnStartDeepHealthChecks = S.Array(S.String);
export class CapacitySizeConfig extends S.Class<CapacitySizeConfig>(
  "CapacitySizeConfig",
)({ Type: S.String, Value: S.Number }) {}
export class RollingDeploymentPolicy extends S.Class<RollingDeploymentPolicy>(
  "RollingDeploymentPolicy",
)({
  MaximumBatchSize: CapacitySizeConfig,
  RollbackMaximumBatchSize: S.optional(CapacitySizeConfig),
}) {}
export class AlarmDetails extends S.Class<AlarmDetails>("AlarmDetails")({
  AlarmName: S.String,
}) {}
export const AutoRollbackAlarms = S.Array(AlarmDetails);
export class DeploymentConfiguration extends S.Class<DeploymentConfiguration>(
  "DeploymentConfiguration",
)({
  RollingUpdatePolicy: S.optional(RollingDeploymentPolicy),
  WaitIntervalInSeconds: S.optional(S.Number),
  AutoRollbackConfiguration: S.optional(AutoRollbackAlarms),
}) {}
export class ScheduledUpdateConfig extends S.Class<ScheduledUpdateConfig>(
  "ScheduledUpdateConfig",
)({
  ScheduleExpression: S.String,
  DeploymentConfig: S.optional(DeploymentConfiguration),
}) {}
export const ClusterKubernetesLabels = S.Record({
  key: S.String,
  value: S.String,
});
export class ClusterKubernetesTaint extends S.Class<ClusterKubernetesTaint>(
  "ClusterKubernetesTaint",
)({ Key: S.String, Value: S.optional(S.String), Effect: S.String }) {}
export const ClusterKubernetesTaints = S.Array(ClusterKubernetesTaint);
export class ClusterKubernetesConfig extends S.Class<ClusterKubernetesConfig>(
  "ClusterKubernetesConfig",
)({
  Labels: S.optional(ClusterKubernetesLabels),
  Taints: S.optional(ClusterKubernetesTaints),
}) {}
export class ClusterSpotOptions extends S.Class<ClusterSpotOptions>(
  "ClusterSpotOptions",
)({}) {}
export class ClusterOnDemandOptions extends S.Class<ClusterOnDemandOptions>(
  "ClusterOnDemandOptions",
)({}) {}
export class ClusterCapacityRequirements extends S.Class<ClusterCapacityRequirements>(
  "ClusterCapacityRequirements",
)({
  Spot: S.optional(ClusterSpotOptions),
  OnDemand: S.optional(ClusterOnDemandOptions),
}) {}
export class ClusterInstanceGroupSpecification extends S.Class<ClusterInstanceGroupSpecification>(
  "ClusterInstanceGroupSpecification",
)({
  InstanceCount: S.Number,
  MinInstanceCount: S.optional(S.Number),
  InstanceGroupName: S.String,
  InstanceType: S.String,
  LifeCycleConfig: ClusterLifeCycleConfig,
  ExecutionRole: S.String,
  ThreadsPerCore: S.optional(S.Number),
  InstanceStorageConfigs: S.optional(ClusterInstanceStorageConfigs),
  OnStartDeepHealthChecks: S.optional(OnStartDeepHealthChecks),
  TrainingPlanArn: S.optional(S.String),
  OverrideVpcConfig: S.optional(VpcConfig),
  ScheduledUpdateConfig: S.optional(ScheduledUpdateConfig),
  ImageId: S.optional(S.String),
  KubernetesConfig: S.optional(ClusterKubernetesConfig),
  CapacityRequirements: S.optional(ClusterCapacityRequirements),
}) {}
export const ClusterInstanceGroupSpecifications = S.Array(
  ClusterInstanceGroupSpecification,
);
export class FSxLustreConfig extends S.Class<FSxLustreConfig>(
  "FSxLustreConfig",
)({ SizeInGiB: S.Number, PerUnitStorageThroughput: S.Number }) {}
export class EnvironmentConfig extends S.Class<EnvironmentConfig>(
  "EnvironmentConfig",
)({ FSxLustreConfig: S.optional(FSxLustreConfig) }) {}
export class ClusterRestrictedInstanceGroupSpecification extends S.Class<ClusterRestrictedInstanceGroupSpecification>(
  "ClusterRestrictedInstanceGroupSpecification",
)({
  InstanceCount: S.Number,
  InstanceGroupName: S.String,
  InstanceType: S.String,
  ExecutionRole: S.String,
  ThreadsPerCore: S.optional(S.Number),
  InstanceStorageConfigs: S.optional(ClusterInstanceStorageConfigs),
  OnStartDeepHealthChecks: S.optional(OnStartDeepHealthChecks),
  TrainingPlanArn: S.optional(S.String),
  OverrideVpcConfig: S.optional(VpcConfig),
  ScheduledUpdateConfig: S.optional(ScheduledUpdateConfig),
  EnvironmentConfig: EnvironmentConfig,
}) {}
export const ClusterRestrictedInstanceGroupSpecifications = S.Array(
  ClusterRestrictedInstanceGroupSpecification,
);
export class ClusterTieredStorageConfig extends S.Class<ClusterTieredStorageConfig>(
  "ClusterTieredStorageConfig",
)({
  Mode: S.String,
  InstanceMemoryAllocationPercentage: S.optional(S.Number),
}) {}
export class ClusterAutoScalingConfig extends S.Class<ClusterAutoScalingConfig>(
  "ClusterAutoScalingConfig",
)({ Mode: S.String, AutoScalerType: S.optional(S.String) }) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    ClusterName: S.String,
    InstanceGroups: S.optional(ClusterInstanceGroupSpecifications),
    RestrictedInstanceGroups: S.optional(
      ClusterRestrictedInstanceGroupSpecifications,
    ),
    TieredStorageConfig: S.optional(ClusterTieredStorageConfig),
    NodeRecovery: S.optional(S.String),
    InstanceGroupsToDelete: S.optional(ClusterInstanceGroupsToDelete),
    NodeProvisioningMode: S.optional(S.String),
    ClusterRole: S.optional(S.String),
    AutoScaling: S.optional(ClusterAutoScalingConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PriorityClass extends S.Class<PriorityClass>("PriorityClass")({
  Name: S.String,
  Weight: S.Number,
}) {}
export const PriorityClassList = S.Array(PriorityClass);
export class SchedulerConfig extends S.Class<SchedulerConfig>(
  "SchedulerConfig",
)({
  PriorityClasses: S.optional(PriorityClassList),
  FairShare: S.optional(S.String),
}) {}
export class UpdateClusterSchedulerConfigRequest extends S.Class<UpdateClusterSchedulerConfigRequest>(
  "UpdateClusterSchedulerConfigRequest",
)(
  {
    ClusterSchedulerConfigId: S.String,
    TargetVersion: S.Number,
    SchedulerConfig: S.optional(SchedulerConfig),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceleratorPartitionConfig extends S.Class<AcceleratorPartitionConfig>(
  "AcceleratorPartitionConfig",
)({ Type: S.String, Count: S.Number }) {}
export class ComputeQuotaResourceConfig extends S.Class<ComputeQuotaResourceConfig>(
  "ComputeQuotaResourceConfig",
)({
  InstanceType: S.String,
  Count: S.optional(S.Number),
  Accelerators: S.optional(S.Number),
  VCpu: S.optional(S.Number),
  MemoryInGiB: S.optional(S.Number),
  AcceleratorPartition: S.optional(AcceleratorPartitionConfig),
}) {}
export const ComputeQuotaResourceConfigList = S.Array(
  ComputeQuotaResourceConfig,
);
export class ResourceSharingConfig extends S.Class<ResourceSharingConfig>(
  "ResourceSharingConfig",
)({ Strategy: S.String, BorrowLimit: S.optional(S.Number) }) {}
export class ComputeQuotaConfig extends S.Class<ComputeQuotaConfig>(
  "ComputeQuotaConfig",
)({
  ComputeQuotaResources: S.optional(ComputeQuotaResourceConfigList),
  ResourceSharingConfig: S.optional(ResourceSharingConfig),
  PreemptTeamTasks: S.optional(S.String),
}) {}
export class ComputeQuotaTarget extends S.Class<ComputeQuotaTarget>(
  "ComputeQuotaTarget",
)({ TeamName: S.String, FairShareWeight: S.optional(S.Number) }) {}
export class UpdateComputeQuotaRequest extends S.Class<UpdateComputeQuotaRequest>(
  "UpdateComputeQuotaRequest",
)(
  {
    ComputeQuotaId: S.String,
    TargetVersion: S.Number,
    ComputeQuotaConfig: S.optional(ComputeQuotaConfig),
    ComputeQuotaTarget: S.optional(ComputeQuotaTarget),
    ActivationState: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContextRequest extends S.Class<UpdateContextRequest>(
  "UpdateContextRequest",
)(
  {
    ContextName: S.String,
    Description: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    PropertiesToRemove: S.optional(ListLineageEntityParameterKey),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDeviceFleetRequest extends S.Class<UpdateDeviceFleetRequest>(
  "UpdateDeviceFleetRequest",
)(
  {
    DeviceFleetName: S.String,
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    OutputConfig: EdgeOutputConfig,
    EnableIotRoleAlias: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDeviceFleetResponse extends S.Class<UpdateDeviceFleetResponse>(
  "UpdateDeviceFleetResponse",
)({}, ns) {}
export class Device extends S.Class<Device>("Device")({
  DeviceName: S.String,
  Description: S.optional(S.String),
  IotThingName: S.optional(S.String),
}) {}
export const Devices = S.Array(Device);
export class UpdateDevicesRequest extends S.Class<UpdateDevicesRequest>(
  "UpdateDevicesRequest",
)(
  { DeviceFleetName: S.String, Devices: Devices },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDevicesResponse extends S.Class<UpdateDevicesResponse>(
  "UpdateDevicesResponse",
)({}, ns) {}
export class UpdateExperimentRequest extends S.Class<UpdateExperimentRequest>(
  "UpdateExperimentRequest",
)(
  {
    ExperimentName: S.String,
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHubRequest extends S.Class<UpdateHubRequest>(
  "UpdateHubRequest",
)(
  {
    HubName: S.String,
    HubDescription: S.optional(S.String),
    HubDisplayName: S.optional(S.String),
    HubSearchKeywords: S.optional(HubSearchKeywordList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHubContentRequest extends S.Class<UpdateHubContentRequest>(
  "UpdateHubContentRequest",
)(
  {
    HubName: S.String,
    HubContentName: S.String,
    HubContentType: S.String,
    HubContentVersion: S.String,
    HubContentDisplayName: S.optional(S.String),
    HubContentDescription: S.optional(S.String),
    HubContentMarkdown: S.optional(S.String),
    HubContentSearchKeywords: S.optional(HubContentSearchKeywordList),
    SupportStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHubContentReferenceRequest extends S.Class<UpdateHubContentReferenceRequest>(
  "UpdateHubContentReferenceRequest",
)(
  {
    HubName: S.String,
    HubContentName: S.String,
    HubContentType: S.String,
    MinVersion: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateImageRequest extends S.Class<UpdateImageRequest>(
  "UpdateImageRequest",
)(
  {
    DeleteProperties: S.optional(ImageDeletePropertyList),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ImageName: S.String,
    RoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateImageVersionRequest extends S.Class<UpdateImageVersionRequest>(
  "UpdateImageVersionRequest",
)(
  {
    ImageName: S.String,
    Alias: S.optional(S.String),
    Version: S.optional(S.Number),
    AliasesToAdd: S.optional(SageMakerImageVersionAliases),
    AliasesToDelete: S.optional(SageMakerImageVersionAliases),
    VendorGuidance: S.optional(S.String),
    JobType: S.optional(S.String),
    MLFramework: S.optional(S.String),
    ProgrammingLang: S.optional(S.String),
    Processor: S.optional(S.String),
    Horovod: S.optional(S.Boolean),
    ReleaseNotes: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InferenceComponentRuntimeConfig extends S.Class<InferenceComponentRuntimeConfig>(
  "InferenceComponentRuntimeConfig",
)({ CopyCount: S.Number }) {}
export class UpdateInferenceComponentRuntimeConfigInput extends S.Class<UpdateInferenceComponentRuntimeConfigInput>(
  "UpdateInferenceComponentRuntimeConfigInput",
)(
  {
    InferenceComponentName: S.String,
    DesiredRuntimeConfig: InferenceComponentRuntimeConfig,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InferenceExperimentSchedule extends S.Class<InferenceExperimentSchedule>(
  "InferenceExperimentSchedule",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RealTimeInferenceConfig extends S.Class<RealTimeInferenceConfig>(
  "RealTimeInferenceConfig",
)({ InstanceType: S.String, InstanceCount: S.Number }) {}
export class ModelInfrastructureConfig extends S.Class<ModelInfrastructureConfig>(
  "ModelInfrastructureConfig",
)({
  InfrastructureType: S.String,
  RealTimeInferenceConfig: RealTimeInferenceConfig,
}) {}
export class ModelVariantConfig extends S.Class<ModelVariantConfig>(
  "ModelVariantConfig",
)({
  ModelName: S.String,
  VariantName: S.String,
  InfrastructureConfig: ModelInfrastructureConfig,
}) {}
export const ModelVariantConfigList = S.Array(ModelVariantConfig);
export const CsvContentTypes = S.Array(S.String);
export const JsonContentTypes = S.Array(S.String);
export class CaptureContentTypeHeader extends S.Class<CaptureContentTypeHeader>(
  "CaptureContentTypeHeader",
)({
  CsvContentTypes: S.optional(CsvContentTypes),
  JsonContentTypes: S.optional(JsonContentTypes),
}) {}
export class InferenceExperimentDataStorageConfig extends S.Class<InferenceExperimentDataStorageConfig>(
  "InferenceExperimentDataStorageConfig",
)({
  Destination: S.String,
  KmsKey: S.optional(S.String),
  ContentType: S.optional(CaptureContentTypeHeader),
}) {}
export class ShadowModelVariantConfig extends S.Class<ShadowModelVariantConfig>(
  "ShadowModelVariantConfig",
)({ ShadowModelVariantName: S.String, SamplingPercentage: S.Number }) {}
export const ShadowModelVariantConfigList = S.Array(ShadowModelVariantConfig);
export class ShadowModeConfig extends S.Class<ShadowModeConfig>(
  "ShadowModeConfig",
)({
  SourceModelVariantName: S.String,
  ShadowModelVariants: ShadowModelVariantConfigList,
}) {}
export class UpdateInferenceExperimentRequest extends S.Class<UpdateInferenceExperimentRequest>(
  "UpdateInferenceExperimentRequest",
)(
  {
    Name: S.String,
    Schedule: S.optional(InferenceExperimentSchedule),
    Description: S.optional(S.String),
    ModelVariants: S.optional(ModelVariantConfigList),
    DataStorageConfig: S.optional(InferenceExperimentDataStorageConfig),
    ShadowModeConfig: S.optional(ShadowModeConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMlflowAppRequest extends S.Class<UpdateMlflowAppRequest>(
  "UpdateMlflowAppRequest",
)(
  {
    Arn: S.String,
    Name: S.optional(S.String),
    ArtifactStoreUri: S.optional(S.String),
    ModelRegistrationMode: S.optional(S.String),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    DefaultDomainIdList: S.optional(DefaultDomainIdList),
    AccountDefaultStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMlflowTrackingServerRequest extends S.Class<UpdateMlflowTrackingServerRequest>(
  "UpdateMlflowTrackingServerRequest",
)(
  {
    TrackingServerName: S.String,
    ArtifactStoreUri: S.optional(S.String),
    TrackingServerSize: S.optional(S.String),
    AutomaticModelRegistration: S.optional(S.Boolean),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateModelCardRequest extends S.Class<UpdateModelCardRequest>(
  "UpdateModelCardRequest",
)(
  {
    ModelCardName: S.String,
    Content: S.optional(S.String),
    ModelCardStatus: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CustomerMetadataMap = S.Record({ key: S.String, value: S.String });
export class ModelInput extends S.Class<ModelInput>("ModelInput")({
  DataInputConfig: S.String,
}) {}
export class AdditionalS3DataSource extends S.Class<AdditionalS3DataSource>(
  "AdditionalS3DataSource",
)({
  S3DataType: S.String,
  S3Uri: S.String,
  CompressionType: S.optional(S.String),
  ETag: S.optional(S.String),
}) {}
export class BaseModel extends S.Class<BaseModel>("BaseModel")({
  HubContentName: S.optional(S.String),
  HubContentVersion: S.optional(S.String),
  RecipeName: S.optional(S.String),
}) {}
export class ModelPackageContainerDefinition extends S.Class<ModelPackageContainerDefinition>(
  "ModelPackageContainerDefinition",
)({
  ContainerHostname: S.optional(S.String),
  Image: S.optional(S.String),
  ImageDigest: S.optional(S.String),
  ModelDataUrl: S.optional(S.String),
  ModelDataSource: S.optional(ModelDataSource),
  ProductId: S.optional(S.String),
  Environment: S.optional(EnvironmentMap),
  ModelInput: S.optional(ModelInput),
  Framework: S.optional(S.String),
  FrameworkVersion: S.optional(S.String),
  NearestModelName: S.optional(S.String),
  AdditionalS3DataSource: S.optional(AdditionalS3DataSource),
  ModelDataETag: S.optional(S.String),
  IsCheckpoint: S.optional(S.Boolean),
  BaseModel: S.optional(BaseModel),
}) {}
export const ModelPackageContainerDefinitionList = S.Array(
  ModelPackageContainerDefinition,
);
export const TransformInstanceTypes = S.Array(S.String);
export const RealtimeInferenceInstanceTypes = S.Array(S.String);
export const ContentTypes = S.Array(S.String);
export const ResponseMIMETypes = S.Array(S.String);
export class AdditionalInferenceSpecificationDefinition extends S.Class<AdditionalInferenceSpecificationDefinition>(
  "AdditionalInferenceSpecificationDefinition",
)({
  Name: S.String,
  Description: S.optional(S.String),
  Containers: ModelPackageContainerDefinitionList,
  SupportedTransformInstanceTypes: S.optional(TransformInstanceTypes),
  SupportedRealtimeInferenceInstanceTypes: S.optional(
    RealtimeInferenceInstanceTypes,
  ),
  SupportedContentTypes: S.optional(ContentTypes),
  SupportedResponseMIMETypes: S.optional(ResponseMIMETypes),
}) {}
export const AdditionalInferenceSpecifications = S.Array(
  AdditionalInferenceSpecificationDefinition,
);
export class InferenceSpecification extends S.Class<InferenceSpecification>(
  "InferenceSpecification",
)({
  Containers: ModelPackageContainerDefinitionList,
  SupportedTransformInstanceTypes: S.optional(TransformInstanceTypes),
  SupportedRealtimeInferenceInstanceTypes: S.optional(
    RealtimeInferenceInstanceTypes,
  ),
  SupportedContentTypes: S.optional(ContentTypes),
  SupportedResponseMIMETypes: S.optional(ResponseMIMETypes),
}) {}
export class ModelPackageModelCard extends S.Class<ModelPackageModelCard>(
  "ModelPackageModelCard",
)({
  ModelCardContent: S.optional(S.String),
  ModelCardStatus: S.optional(S.String),
}) {}
export class ModelLifeCycle extends S.Class<ModelLifeCycle>("ModelLifeCycle")({
  Stage: S.String,
  StageStatus: S.String,
  StageDescription: S.optional(S.String),
}) {}
export class UpdateModelPackageInput extends S.Class<UpdateModelPackageInput>(
  "UpdateModelPackageInput",
)(
  {
    ModelPackageArn: S.String,
    ModelApprovalStatus: S.optional(S.String),
    ModelPackageRegistrationType: S.optional(S.String),
    ApprovalDescription: S.optional(S.String),
    CustomerMetadataProperties: S.optional(CustomerMetadataMap),
    CustomerMetadataPropertiesToRemove: S.optional(CustomerMetadataKeyList),
    AdditionalInferenceSpecificationsToAdd: S.optional(
      AdditionalInferenceSpecifications,
    ),
    InferenceSpecification: S.optional(InferenceSpecification),
    SourceUri: S.optional(S.String),
    ModelCard: S.optional(ModelPackageModelCard),
    ModelLifeCycle: S.optional(ModelLifeCycle),
    ClientToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMonitoringAlertRequest extends S.Class<UpdateMonitoringAlertRequest>(
  "UpdateMonitoringAlertRequest",
)(
  {
    MonitoringScheduleName: S.String,
    MonitoringAlertName: S.String,
    DatapointsToAlert: S.Number,
    EvaluationPeriod: S.Number,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ScheduleConfig extends S.Class<ScheduleConfig>("ScheduleConfig")({
  ScheduleExpression: S.String,
  DataAnalysisStartTime: S.optional(S.String),
  DataAnalysisEndTime: S.optional(S.String),
}) {}
export class MonitoringConstraintsResource extends S.Class<MonitoringConstraintsResource>(
  "MonitoringConstraintsResource",
)({ S3Uri: S.optional(S.String) }) {}
export class MonitoringStatisticsResource extends S.Class<MonitoringStatisticsResource>(
  "MonitoringStatisticsResource",
)({ S3Uri: S.optional(S.String) }) {}
export class MonitoringBaselineConfig extends S.Class<MonitoringBaselineConfig>(
  "MonitoringBaselineConfig",
)({
  BaseliningJobName: S.optional(S.String),
  ConstraintsResource: S.optional(MonitoringConstraintsResource),
  StatisticsResource: S.optional(MonitoringStatisticsResource),
}) {}
export class EndpointInput extends S.Class<EndpointInput>("EndpointInput")({
  EndpointName: S.String,
  LocalPath: S.String,
  S3InputMode: S.optional(S.String),
  S3DataDistributionType: S.optional(S.String),
  FeaturesAttribute: S.optional(S.String),
  InferenceAttribute: S.optional(S.String),
  ProbabilityAttribute: S.optional(S.String),
  ProbabilityThresholdAttribute: S.optional(S.Number),
  StartTimeOffset: S.optional(S.String),
  EndTimeOffset: S.optional(S.String),
  ExcludeFeaturesAttribute: S.optional(S.String),
}) {}
export class MonitoringCsvDatasetFormat extends S.Class<MonitoringCsvDatasetFormat>(
  "MonitoringCsvDatasetFormat",
)({ Header: S.optional(S.Boolean) }) {}
export class MonitoringJsonDatasetFormat extends S.Class<MonitoringJsonDatasetFormat>(
  "MonitoringJsonDatasetFormat",
)({ Line: S.optional(S.Boolean) }) {}
export class MonitoringParquetDatasetFormat extends S.Class<MonitoringParquetDatasetFormat>(
  "MonitoringParquetDatasetFormat",
)({}) {}
export class MonitoringDatasetFormat extends S.Class<MonitoringDatasetFormat>(
  "MonitoringDatasetFormat",
)({
  Csv: S.optional(MonitoringCsvDatasetFormat),
  Json: S.optional(MonitoringJsonDatasetFormat),
  Parquet: S.optional(MonitoringParquetDatasetFormat),
}) {}
export class BatchTransformInput extends S.Class<BatchTransformInput>(
  "BatchTransformInput",
)({
  DataCapturedDestinationS3Uri: S.String,
  DatasetFormat: MonitoringDatasetFormat,
  LocalPath: S.String,
  S3InputMode: S.optional(S.String),
  S3DataDistributionType: S.optional(S.String),
  FeaturesAttribute: S.optional(S.String),
  InferenceAttribute: S.optional(S.String),
  ProbabilityAttribute: S.optional(S.String),
  ProbabilityThresholdAttribute: S.optional(S.Number),
  StartTimeOffset: S.optional(S.String),
  EndTimeOffset: S.optional(S.String),
  ExcludeFeaturesAttribute: S.optional(S.String),
}) {}
export class MonitoringInput extends S.Class<MonitoringInput>(
  "MonitoringInput",
)({
  EndpointInput: S.optional(EndpointInput),
  BatchTransformInput: S.optional(BatchTransformInput),
}) {}
export const MonitoringInputs = S.Array(MonitoringInput);
export class MonitoringS3Output extends S.Class<MonitoringS3Output>(
  "MonitoringS3Output",
)({
  S3Uri: S.String,
  LocalPath: S.String,
  S3UploadMode: S.optional(S.String),
}) {}
export class MonitoringOutput extends S.Class<MonitoringOutput>(
  "MonitoringOutput",
)({ S3Output: MonitoringS3Output }) {}
export const MonitoringOutputs = S.Array(MonitoringOutput);
export class MonitoringOutputConfig extends S.Class<MonitoringOutputConfig>(
  "MonitoringOutputConfig",
)({ MonitoringOutputs: MonitoringOutputs, KmsKeyId: S.optional(S.String) }) {}
export class MonitoringClusterConfig extends S.Class<MonitoringClusterConfig>(
  "MonitoringClusterConfig",
)({
  InstanceCount: S.Number,
  InstanceType: S.String,
  VolumeSizeInGB: S.Number,
  VolumeKmsKeyId: S.optional(S.String),
}) {}
export class MonitoringResources extends S.Class<MonitoringResources>(
  "MonitoringResources",
)({ ClusterConfig: MonitoringClusterConfig }) {}
export const ContainerEntrypoint = S.Array(S.String);
export const MonitoringContainerArguments = S.Array(S.String);
export class MonitoringAppSpecification extends S.Class<MonitoringAppSpecification>(
  "MonitoringAppSpecification",
)({
  ImageUri: S.String,
  ContainerEntrypoint: S.optional(ContainerEntrypoint),
  ContainerArguments: S.optional(MonitoringContainerArguments),
  RecordPreprocessorSourceUri: S.optional(S.String),
  PostAnalyticsProcessorSourceUri: S.optional(S.String),
}) {}
export class MonitoringStoppingCondition extends S.Class<MonitoringStoppingCondition>(
  "MonitoringStoppingCondition",
)({ MaxRuntimeInSeconds: S.Number }) {}
export const MonitoringEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class NetworkConfig extends S.Class<NetworkConfig>("NetworkConfig")({
  EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
  EnableNetworkIsolation: S.optional(S.Boolean),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class MonitoringJobDefinition extends S.Class<MonitoringJobDefinition>(
  "MonitoringJobDefinition",
)({
  BaselineConfig: S.optional(MonitoringBaselineConfig),
  MonitoringInputs: MonitoringInputs,
  MonitoringOutputConfig: MonitoringOutputConfig,
  MonitoringResources: MonitoringResources,
  MonitoringAppSpecification: MonitoringAppSpecification,
  StoppingCondition: S.optional(MonitoringStoppingCondition),
  Environment: S.optional(MonitoringEnvironmentMap),
  NetworkConfig: S.optional(NetworkConfig),
  RoleArn: S.String,
}) {}
export class MonitoringScheduleConfig extends S.Class<MonitoringScheduleConfig>(
  "MonitoringScheduleConfig",
)({
  ScheduleConfig: S.optional(ScheduleConfig),
  MonitoringJobDefinition: S.optional(MonitoringJobDefinition),
  MonitoringJobDefinitionName: S.optional(S.String),
  MonitoringType: S.optional(S.String),
}) {}
export class UpdateMonitoringScheduleRequest extends S.Class<UpdateMonitoringScheduleRequest>(
  "UpdateMonitoringScheduleRequest",
)(
  {
    MonitoringScheduleName: S.String,
    MonitoringScheduleConfig: MonitoringScheduleConfig,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InstanceMetadataServiceConfiguration extends S.Class<InstanceMetadataServiceConfiguration>(
  "InstanceMetadataServiceConfiguration",
)({ MinimumInstanceMetadataServiceVersion: S.String }) {}
export class UpdateNotebookInstanceInput extends S.Class<UpdateNotebookInstanceInput>(
  "UpdateNotebookInstanceInput",
)(
  {
    NotebookInstanceName: S.String,
    InstanceType: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    PlatformIdentifier: S.optional(S.String),
    RoleArn: S.optional(S.String),
    LifecycleConfigName: S.optional(S.String),
    DisassociateLifecycleConfig: S.optional(S.Boolean),
    VolumeSizeInGB: S.optional(S.Number),
    DefaultCodeRepository: S.optional(S.String),
    AdditionalCodeRepositories: S.optional(AdditionalCodeRepositoryNamesOrUrls),
    AcceleratorTypes: S.optional(NotebookInstanceAcceleratorTypes),
    DisassociateAcceleratorTypes: S.optional(S.Boolean),
    DisassociateDefaultCodeRepository: S.optional(S.Boolean),
    DisassociateAdditionalCodeRepositories: S.optional(S.Boolean),
    RootAccess: S.optional(S.String),
    InstanceMetadataServiceConfiguration: S.optional(
      InstanceMetadataServiceConfiguration,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotebookInstanceOutput extends S.Class<UpdateNotebookInstanceOutput>(
  "UpdateNotebookInstanceOutput",
)({}, ns) {}
export class NotebookInstanceLifecycleHook extends S.Class<NotebookInstanceLifecycleHook>(
  "NotebookInstanceLifecycleHook",
)({ Content: S.optional(S.String) }) {}
export const NotebookInstanceLifecycleConfigList = S.Array(
  NotebookInstanceLifecycleHook,
);
export class UpdateNotebookInstanceLifecycleConfigInput extends S.Class<UpdateNotebookInstanceLifecycleConfigInput>(
  "UpdateNotebookInstanceLifecycleConfigInput",
)(
  {
    NotebookInstanceLifecycleConfigName: S.String,
    OnCreate: S.optional(NotebookInstanceLifecycleConfigList),
    OnStart: S.optional(NotebookInstanceLifecycleConfigList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotebookInstanceLifecycleConfigOutput extends S.Class<UpdateNotebookInstanceLifecycleConfigOutput>(
  "UpdateNotebookInstanceLifecycleConfigOutput",
)({}, ns) {}
export class PartnerAppMaintenanceConfig extends S.Class<PartnerAppMaintenanceConfig>(
  "PartnerAppMaintenanceConfig",
)({ MaintenanceWindowStart: S.optional(S.String) }) {}
export const PartnerAppAdminUserList = S.Array(S.String);
export const PartnerAppArguments = S.Record({ key: S.String, value: S.String });
export const AssignedGroupPatternsList = S.Array(S.String);
export const GroupPatternsList = S.Array(S.String);
export class RoleGroupAssignment extends S.Class<RoleGroupAssignment>(
  "RoleGroupAssignment",
)({ RoleName: S.String, GroupPatterns: GroupPatternsList }) {}
export const RoleGroupAssignmentsList = S.Array(RoleGroupAssignment);
export class PartnerAppConfig extends S.Class<PartnerAppConfig>(
  "PartnerAppConfig",
)({
  AdminUsers: S.optional(PartnerAppAdminUserList),
  Arguments: S.optional(PartnerAppArguments),
  AssignedGroupPatterns: S.optional(AssignedGroupPatternsList),
  RoleGroupAssignments: S.optional(RoleGroupAssignmentsList),
}) {}
export class UpdatePartnerAppRequest extends S.Class<UpdatePartnerAppRequest>(
  "UpdatePartnerAppRequest",
)(
  {
    Arn: S.String,
    MaintenanceConfig: S.optional(PartnerAppMaintenanceConfig),
    Tier: S.optional(S.String),
    ApplicationConfig: S.optional(PartnerAppConfig),
    EnableIamSessionBasedIdentity: S.optional(S.Boolean),
    EnableAutoMinorVersionUpgrade: S.optional(S.Boolean),
    AppVersion: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PipelineDefinitionS3Location extends S.Class<PipelineDefinitionS3Location>(
  "PipelineDefinitionS3Location",
)({ Bucket: S.String, ObjectKey: S.String, VersionId: S.optional(S.String) }) {}
export class UpdatePipelineRequest extends S.Class<UpdatePipelineRequest>(
  "UpdatePipelineRequest",
)(
  {
    PipelineName: S.String,
    PipelineDisplayName: S.optional(S.String),
    PipelineDefinition: S.optional(S.String),
    PipelineDefinitionS3Location: S.optional(PipelineDefinitionS3Location),
    PipelineDescription: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePipelineExecutionRequest extends S.Class<UpdatePipelineExecutionRequest>(
  "UpdatePipelineExecutionRequest",
)(
  {
    PipelineExecutionArn: S.String,
    PipelineExecutionDescription: S.optional(S.String),
    PipelineExecutionDisplayName: S.optional(S.String),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePipelineVersionRequest extends S.Class<UpdatePipelineVersionRequest>(
  "UpdatePipelineVersionRequest",
)(
  {
    PipelineArn: S.String,
    PipelineVersionId: S.Number,
    PipelineVersionDisplayName: S.optional(S.String),
    PipelineVersionDescription: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SpaceIdleSettings extends S.Class<SpaceIdleSettings>(
  "SpaceIdleSettings",
)({ IdleTimeoutInMinutes: S.optional(S.Number) }) {}
export class SpaceAppLifecycleManagement extends S.Class<SpaceAppLifecycleManagement>(
  "SpaceAppLifecycleManagement",
)({ IdleSettings: S.optional(SpaceIdleSettings) }) {}
export class SpaceCodeEditorAppSettings extends S.Class<SpaceCodeEditorAppSettings>(
  "SpaceCodeEditorAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  AppLifecycleManagement: S.optional(SpaceAppLifecycleManagement),
}) {}
export class SpaceJupyterLabAppSettings extends S.Class<SpaceJupyterLabAppSettings>(
  "SpaceJupyterLabAppSettings",
)({
  DefaultResourceSpec: S.optional(ResourceSpec),
  CodeRepositories: S.optional(CodeRepositories),
  AppLifecycleManagement: S.optional(SpaceAppLifecycleManagement),
}) {}
export class EbsStorageSettings extends S.Class<EbsStorageSettings>(
  "EbsStorageSettings",
)({ EbsVolumeSizeInGb: S.Number }) {}
export class SpaceStorageSettings extends S.Class<SpaceStorageSettings>(
  "SpaceStorageSettings",
)({ EbsStorageSettings: S.optional(EbsStorageSettings) }) {}
export class EFSFileSystem extends S.Class<EFSFileSystem>("EFSFileSystem")({
  FileSystemId: S.String,
}) {}
export class FSxLustreFileSystem extends S.Class<FSxLustreFileSystem>(
  "FSxLustreFileSystem",
)({ FileSystemId: S.String }) {}
export class S3FileSystem extends S.Class<S3FileSystem>("S3FileSystem")({
  S3Uri: S.String,
}) {}
export const CustomFileSystem = S.Union(
  S.Struct({ EFSFileSystem: EFSFileSystem }),
  S.Struct({ FSxLustreFileSystem: FSxLustreFileSystem }),
  S.Struct({ S3FileSystem: S3FileSystem }),
);
export const CustomFileSystems = S.Array(CustomFileSystem);
export class SpaceSettings extends S.Class<SpaceSettings>("SpaceSettings")({
  JupyterServerAppSettings: S.optional(JupyterServerAppSettings),
  KernelGatewayAppSettings: S.optional(KernelGatewayAppSettings),
  CodeEditorAppSettings: S.optional(SpaceCodeEditorAppSettings),
  JupyterLabAppSettings: S.optional(SpaceJupyterLabAppSettings),
  AppType: S.optional(S.String),
  SpaceStorageSettings: S.optional(SpaceStorageSettings),
  SpaceManagedResources: S.optional(S.String),
  CustomFileSystems: S.optional(CustomFileSystems),
  RemoteAccess: S.optional(S.String),
}) {}
export class UpdateSpaceRequest extends S.Class<UpdateSpaceRequest>(
  "UpdateSpaceRequest",
)(
  {
    DomainId: S.String,
    SpaceName: S.String,
    SpaceSettings: S.optional(SpaceSettings),
    SpaceDisplayName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTrialRequest extends S.Class<UpdateTrialRequest>(
  "UpdateTrialRequest",
)(
  { TrialName: S.String, DisplayName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TrialComponentStatus extends S.Class<TrialComponentStatus>(
  "TrialComponentStatus",
)({ PrimaryStatus: S.optional(S.String), Message: S.optional(S.String) }) {}
export const TrialComponentParameterValue = S.Union(
  S.Struct({ StringValue: S.String }),
  S.Struct({ NumberValue: S.Number }),
);
export const TrialComponentParameters = S.Record({
  key: S.String,
  value: TrialComponentParameterValue,
});
export class TrialComponentArtifact extends S.Class<TrialComponentArtifact>(
  "TrialComponentArtifact",
)({ MediaType: S.optional(S.String), Value: S.String }) {}
export const TrialComponentArtifacts = S.Record({
  key: S.String,
  value: TrialComponentArtifact,
});
export class UpdateTrialComponentRequest extends S.Class<UpdateTrialComponentRequest>(
  "UpdateTrialComponentRequest",
)(
  {
    TrialComponentName: S.String,
    DisplayName: S.optional(S.String),
    Status: S.optional(TrialComponentStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Parameters: S.optional(TrialComponentParameters),
    ParametersToRemove: S.optional(ListTrialComponentKey256),
    InputArtifacts: S.optional(TrialComponentArtifacts),
    InputArtifactsToRemove: S.optional(ListTrialComponentKey256),
    OutputArtifacts: S.optional(TrialComponentArtifacts),
    OutputArtifactsToRemove: S.optional(ListTrialComponentKey256),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserProfileRequest extends S.Class<UpdateUserProfileRequest>(
  "UpdateUserProfileRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.String,
    UserSettings: S.optional(UserSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Cidrs = S.Array(S.String);
export class SourceIpConfig extends S.Class<SourceIpConfig>("SourceIpConfig")({
  Cidrs: Cidrs,
}) {}
export const AuthenticationRequestExtraParams = S.Record({
  key: S.String,
  value: S.String,
});
export class OidcConfig extends S.Class<OidcConfig>("OidcConfig")({
  ClientId: S.String,
  ClientSecret: S.String,
  Issuer: S.String,
  AuthorizationEndpoint: S.String,
  TokenEndpoint: S.String,
  UserInfoEndpoint: S.String,
  LogoutEndpoint: S.String,
  JwksUri: S.String,
  Scope: S.optional(S.String),
  AuthenticationRequestExtraParams: S.optional(
    AuthenticationRequestExtraParams,
  ),
}) {}
export const WorkforceSecurityGroupIds = S.Array(S.String);
export const WorkforceSubnets = S.Array(S.String);
export class WorkforceVpcConfigRequest extends S.Class<WorkforceVpcConfigRequest>(
  "WorkforceVpcConfigRequest",
)({
  VpcId: S.optional(S.String),
  SecurityGroupIds: S.optional(WorkforceSecurityGroupIds),
  Subnets: S.optional(WorkforceSubnets),
}) {}
export class UpdateWorkforceRequest extends S.Class<UpdateWorkforceRequest>(
  "UpdateWorkforceRequest",
)(
  {
    WorkforceName: S.String,
    SourceIpConfig: S.optional(SourceIpConfig),
    OidcConfig: S.optional(OidcConfig),
    WorkforceVpcConfig: S.optional(WorkforceVpcConfigRequest),
    IpAddressType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CognitoMemberDefinition extends S.Class<CognitoMemberDefinition>(
  "CognitoMemberDefinition",
)({ UserPool: S.String, UserGroup: S.String, ClientId: S.String }) {}
export const Groups = S.Array(S.String);
export class OidcMemberDefinition extends S.Class<OidcMemberDefinition>(
  "OidcMemberDefinition",
)({ Groups: S.optional(Groups) }) {}
export class MemberDefinition extends S.Class<MemberDefinition>(
  "MemberDefinition",
)({
  CognitoMemberDefinition: S.optional(CognitoMemberDefinition),
  OidcMemberDefinition: S.optional(OidcMemberDefinition),
}) {}
export const MemberDefinitions = S.Array(MemberDefinition);
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ NotificationTopicArn: S.optional(S.String) }) {}
export class IamPolicyConstraints extends S.Class<IamPolicyConstraints>(
  "IamPolicyConstraints",
)({ SourceIp: S.optional(S.String), VpcSourceIp: S.optional(S.String) }) {}
export class S3Presign extends S.Class<S3Presign>("S3Presign")({
  IamPolicyConstraints: S.optional(IamPolicyConstraints),
}) {}
export class WorkerAccessConfiguration extends S.Class<WorkerAccessConfiguration>(
  "WorkerAccessConfiguration",
)({ S3Presign: S.optional(S3Presign) }) {}
export class UpdateWorkteamRequest extends S.Class<UpdateWorkteamRequest>(
  "UpdateWorkteamRequest",
)(
  {
    WorkteamName: S.String,
    MemberDefinitions: S.optional(MemberDefinitions),
    Description: S.optional(S.String),
    NotificationConfiguration: S.optional(NotificationConfiguration),
    WorkerAccessConfiguration: S.optional(WorkerAccessConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TrainingInstanceTypes = S.Array(S.String);
export const NeoVpcSecurityGroupIds = S.Array(S.String);
export const NeoVpcSubnets = S.Array(S.String);
export const DomainSecurityGroupIds = S.Array(S.String);
export const FlowDefinitionTaskKeywords = S.Array(S.String);
export const TaskKeywords = S.Array(S.String);
export const OptimizationVpcSecurityGroupIds = S.Array(S.String);
export const OptimizationVpcSubnets = S.Array(S.String);
export const ContainerArguments = S.Array(S.String);
export const TrainingContainerEntrypoint = S.Array(S.String);
export const TrainingContainerArguments = S.Array(S.String);
export const QueryTypes = S.Array(S.String);
export const QueryLineageTypes = S.Array(S.String);
export type SearchExpressionList = SearchExpression[];
export const SearchExpressionList = S.Array(
  S.suspend((): S.Schema<SearchExpression, any> => SearchExpression),
) as any as S.Schema<SearchExpressionList>;
export class AddClusterNodeSpecification extends S.Class<AddClusterNodeSpecification>(
  "AddClusterNodeSpecification",
)({ InstanceGroupName: S.String, IncrementTargetCountBy: S.Number }) {}
export const AddClusterNodeSpecificationList = S.Array(
  AddClusterNodeSpecification,
);
export class ActionSource extends S.Class<ActionSource>("ActionSource")({
  SourceUri: S.String,
  SourceType: S.optional(S.String),
  SourceId: S.optional(S.String),
}) {}
export class AutoMLOutputDataConfig extends S.Class<AutoMLOutputDataConfig>(
  "AutoMLOutputDataConfig",
)({ KmsKeyId: S.optional(S.String), S3OutputPath: S.String }) {}
export class AutoMLJobObjective extends S.Class<AutoMLJobObjective>(
  "AutoMLJobObjective",
)({ MetricName: S.String }) {}
export class ModelDeployConfig extends S.Class<ModelDeployConfig>(
  "ModelDeployConfig",
)({
  AutoGenerateEndpointName: S.optional(S.Boolean),
  EndpointName: S.optional(S.String),
}) {}
export class AutoMLS3DataSource extends S.Class<AutoMLS3DataSource>(
  "AutoMLS3DataSource",
)({ S3DataType: S.String, S3Uri: S.String }) {}
export class AutoMLDataSource extends S.Class<AutoMLDataSource>(
  "AutoMLDataSource",
)({ S3DataSource: AutoMLS3DataSource }) {}
export class AutoMLJobChannel extends S.Class<AutoMLJobChannel>(
  "AutoMLJobChannel",
)({
  ChannelType: S.optional(S.String),
  ContentType: S.optional(S.String),
  CompressionType: S.optional(S.String),
  DataSource: S.optional(AutoMLDataSource),
}) {}
export const AutoMLJobInputDataConfig = S.Array(AutoMLJobChannel);
export class AutoMLSecurityConfig extends S.Class<AutoMLSecurityConfig>(
  "AutoMLSecurityConfig",
)({
  VolumeKmsKeyId: S.optional(S.String),
  EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class AutoMLDataSplitConfig extends S.Class<AutoMLDataSplitConfig>(
  "AutoMLDataSplitConfig",
)({ ValidationFraction: S.optional(S.Number) }) {}
export class GitConfig extends S.Class<GitConfig>("GitConfig")({
  RepositoryUrl: S.String,
  Branch: S.optional(S.String),
  SecretArn: S.optional(S.String),
}) {}
export class InputConfig extends S.Class<InputConfig>("InputConfig")({
  S3Uri: S.String,
  DataInputConfig: S.optional(S.String),
  Framework: S.String,
  FrameworkVersion: S.optional(S.String),
}) {}
export class NeoVpcConfig extends S.Class<NeoVpcConfig>("NeoVpcConfig")({
  SecurityGroupIds: NeoVpcSecurityGroupIds,
  Subnets: NeoVpcSubnets,
}) {}
export class ContextSource extends S.Class<ContextSource>("ContextSource")({
  SourceUri: S.String,
  SourceType: S.optional(S.String),
  SourceId: S.optional(S.String),
}) {}
export class MonitoringNetworkConfig extends S.Class<MonitoringNetworkConfig>(
  "MonitoringNetworkConfig",
)({
  EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
  EnableNetworkIsolation: S.optional(S.Boolean),
  VpcConfig: S.optional(VpcConfig),
}) {}
export class DefaultSpaceSettings extends S.Class<DefaultSpaceSettings>(
  "DefaultSpaceSettings",
)({
  ExecutionRole: S.optional(S.String),
  SecurityGroups: S.optional(SecurityGroupIds),
  JupyterServerAppSettings: S.optional(JupyterServerAppSettings),
  KernelGatewayAppSettings: S.optional(KernelGatewayAppSettings),
  JupyterLabAppSettings: S.optional(JupyterLabAppSettings),
  SpaceStorageSettings: S.optional(DefaultSpaceStorageSettings),
  CustomPosixUserConfig: S.optional(CustomPosixUserConfig),
  CustomFileSystemConfigs: S.optional(CustomFileSystemConfigs),
}) {}
export class EdgeDeploymentModelConfig extends S.Class<EdgeDeploymentModelConfig>(
  "EdgeDeploymentModelConfig",
)({ ModelHandle: S.String, EdgePackagingJobName: S.String }) {}
export const EdgeDeploymentModelConfigs = S.Array(EdgeDeploymentModelConfig);
export class MetricsConfig extends S.Class<MetricsConfig>("MetricsConfig")({
  EnableEnhancedMetrics: S.optional(S.Boolean),
  MetricPublishFrequencyInSeconds: S.optional(S.Number),
}) {}
export class ThroughputConfig extends S.Class<ThroughputConfig>(
  "ThroughputConfig",
)({
  ThroughputMode: S.String,
  ProvisionedReadCapacityUnits: S.optional(S.Number),
  ProvisionedWriteCapacityUnits: S.optional(S.Number),
}) {}
export class HumanLoopRequestSource extends S.Class<HumanLoopRequestSource>(
  "HumanLoopRequestSource",
)({ AwsManagedHumanLoopRequestSource: S.String }) {}
export class FlowDefinitionOutputConfig extends S.Class<FlowDefinitionOutputConfig>(
  "FlowDefinitionOutputConfig",
)({ S3OutputPath: S.String, KmsKeyId: S.optional(S.String) }) {}
export class HubS3StorageConfig extends S.Class<HubS3StorageConfig>(
  "HubS3StorageConfig",
)({ S3OutputPath: S.optional(S.String) }) {}
export class PresignedUrlAccessConfig extends S.Class<PresignedUrlAccessConfig>(
  "PresignedUrlAccessConfig",
)({ AcceptEula: S.optional(S.Boolean), ExpectedS3Url: S.optional(S.String) }) {}
export class UiTemplate extends S.Class<UiTemplate>("UiTemplate")({
  Content: S.String,
}) {}
export class Autotune extends S.Class<Autotune>("Autotune")({
  Mode: S.String,
}) {}
export class LabelingJobOutputConfig extends S.Class<LabelingJobOutputConfig>(
  "LabelingJobOutputConfig",
)({
  S3OutputPath: S.String,
  KmsKeyId: S.optional(S.String),
  SnsTopicArn: S.optional(S.String),
}) {}
export class LabelingJobStoppingConditions extends S.Class<LabelingJobStoppingConditions>(
  "LabelingJobStoppingConditions",
)({
  MaxHumanLabeledObjectCount: S.optional(S.Number),
  MaxPercentageOfInputDatasetLabeled: S.optional(S.Number),
}) {}
export class InferenceExecutionConfig extends S.Class<InferenceExecutionConfig>(
  "InferenceExecutionConfig",
)({ Mode: S.String }) {}
export class ModelBiasBaselineConfig extends S.Class<ModelBiasBaselineConfig>(
  "ModelBiasBaselineConfig",
)({
  BaseliningJobName: S.optional(S.String),
  ConstraintsResource: S.optional(MonitoringConstraintsResource),
}) {}
export class ModelBiasAppSpecification extends S.Class<ModelBiasAppSpecification>(
  "ModelBiasAppSpecification",
)({
  ImageUri: S.String,
  ConfigUri: S.String,
  Environment: S.optional(MonitoringEnvironmentMap),
}) {}
export class ModelCardSecurityConfig extends S.Class<ModelCardSecurityConfig>(
  "ModelCardSecurityConfig",
)({ KmsKeyId: S.optional(S.String) }) {}
export class ModelCardExportOutputConfig extends S.Class<ModelCardExportOutputConfig>(
  "ModelCardExportOutputConfig",
)({ S3OutputPath: S.String }) {}
export class ModelExplainabilityBaselineConfig extends S.Class<ModelExplainabilityBaselineConfig>(
  "ModelExplainabilityBaselineConfig",
)({
  BaseliningJobName: S.optional(S.String),
  ConstraintsResource: S.optional(MonitoringConstraintsResource),
}) {}
export class ModelExplainabilityAppSpecification extends S.Class<ModelExplainabilityAppSpecification>(
  "ModelExplainabilityAppSpecification",
)({
  ImageUri: S.String,
  ConfigUri: S.String,
  Environment: S.optional(MonitoringEnvironmentMap),
}) {}
export class ModelExplainabilityJobInput extends S.Class<ModelExplainabilityJobInput>(
  "ModelExplainabilityJobInput",
)({
  EndpointInput: S.optional(EndpointInput),
  BatchTransformInput: S.optional(BatchTransformInput),
}) {}
export class ModelPackageSecurityConfig extends S.Class<ModelPackageSecurityConfig>(
  "ModelPackageSecurityConfig",
)({ KmsKeyId: S.String }) {}
export class ModelQualityBaselineConfig extends S.Class<ModelQualityBaselineConfig>(
  "ModelQualityBaselineConfig",
)({
  BaseliningJobName: S.optional(S.String),
  ConstraintsResource: S.optional(MonitoringConstraintsResource),
}) {}
export class ModelQualityAppSpecification extends S.Class<ModelQualityAppSpecification>(
  "ModelQualityAppSpecification",
)({
  ImageUri: S.String,
  ContainerEntrypoint: S.optional(ContainerEntrypoint),
  ContainerArguments: S.optional(MonitoringContainerArguments),
  RecordPreprocessorSourceUri: S.optional(S.String),
  PostAnalyticsProcessorSourceUri: S.optional(S.String),
  ProblemType: S.optional(S.String),
  Environment: S.optional(MonitoringEnvironmentMap),
}) {}
export class MonitoringGroundTruthS3Input extends S.Class<MonitoringGroundTruthS3Input>(
  "MonitoringGroundTruthS3Input",
)({ S3Uri: S.optional(S.String) }) {}
export class ModelQualityJobInput extends S.Class<ModelQualityJobInput>(
  "ModelQualityJobInput",
)({
  EndpointInput: S.optional(EndpointInput),
  BatchTransformInput: S.optional(BatchTransformInput),
  GroundTruthS3Input: MonitoringGroundTruthS3Input,
}) {}
export const OptimizationJobEnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class OptimizationSageMakerModel extends S.Class<OptimizationSageMakerModel>(
  "OptimizationSageMakerModel",
)({ ModelName: S.optional(S.String) }) {}
export class OptimizationJobOutputConfig extends S.Class<OptimizationJobOutputConfig>(
  "OptimizationJobOutputConfig",
)({
  KmsKeyId: S.optional(S.String),
  S3OutputLocation: S.String,
  SageMakerModel: S.optional(OptimizationSageMakerModel),
}) {}
export class OptimizationVpcConfig extends S.Class<OptimizationVpcConfig>(
  "OptimizationVpcConfig",
)({
  SecurityGroupIds: OptimizationVpcSecurityGroupIds,
  Subnets: OptimizationVpcSubnets,
}) {}
export class ProcessingStoppingCondition extends S.Class<ProcessingStoppingCondition>(
  "ProcessingStoppingCondition",
)({ MaxRuntimeInSeconds: S.Number }) {}
export class AppSpecification extends S.Class<AppSpecification>(
  "AppSpecification",
)({
  ImageUri: S.String,
  ContainerEntrypoint: S.optional(ContainerEntrypoint),
  ContainerArguments: S.optional(ContainerArguments),
}) {}
export const ProcessingEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ExperimentConfig extends S.Class<ExperimentConfig>(
  "ExperimentConfig",
)({
  ExperimentName: S.optional(S.String),
  TrialName: S.optional(S.String),
  TrialComponentDisplayName: S.optional(S.String),
  RunName: S.optional(S.String),
}) {}
export class OwnershipSettings extends S.Class<OwnershipSettings>(
  "OwnershipSettings",
)({ OwnerUserProfileName: S.String }) {}
export class SpaceSharingSettings extends S.Class<SpaceSharingSettings>(
  "SpaceSharingSettings",
)({ SharingType: S.String }) {}
export class TensorBoardOutputConfig extends S.Class<TensorBoardOutputConfig>(
  "TensorBoardOutputConfig",
)({ LocalPath: S.optional(S.String), S3OutputPath: S.String }) {}
export const RuleParameters = S.Record({ key: S.String, value: S.String });
export class ProfilerRuleConfiguration extends S.Class<ProfilerRuleConfiguration>(
  "ProfilerRuleConfiguration",
)({
  RuleConfigurationName: S.String,
  LocalPath: S.optional(S.String),
  S3OutputPath: S.optional(S.String),
  RuleEvaluatorImage: S.String,
  InstanceType: S.optional(S.String),
  VolumeSizeInGB: S.optional(S.Number),
  RuleParameters: S.optional(RuleParameters),
}) {}
export const ProfilerRuleConfigurations = S.Array(ProfilerRuleConfiguration);
export const TrainingEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class RemoteDebugConfig extends S.Class<RemoteDebugConfig>(
  "RemoteDebugConfig",
)({ EnableRemoteDebug: S.optional(S.Boolean) }) {}
export class InfraCheckConfig extends S.Class<InfraCheckConfig>(
  "InfraCheckConfig",
)({ EnableInfraCheck: S.optional(S.Boolean) }) {}
export class SessionChainingConfig extends S.Class<SessionChainingConfig>(
  "SessionChainingConfig",
)({ EnableSessionTagChaining: S.optional(S.Boolean) }) {}
export class ServerlessJobConfig extends S.Class<ServerlessJobConfig>(
  "ServerlessJobConfig",
)({
  BaseModelArn: S.String,
  AcceptEula: S.optional(S.Boolean),
  JobType: S.String,
  CustomizationTechnique: S.optional(S.String),
  Peft: S.optional(S.String),
  EvaluationType: S.optional(S.String),
  EvaluatorArn: S.optional(S.String),
}) {}
export class MlflowConfig extends S.Class<MlflowConfig>("MlflowConfig")({
  MlflowResourceArn: S.String,
  MlflowExperimentName: S.optional(S.String),
  MlflowRunName: S.optional(S.String),
}) {}
export class ModelPackageConfig extends S.Class<ModelPackageConfig>(
  "ModelPackageConfig",
)({
  ModelPackageGroupArn: S.String,
  SourceModelPackageArn: S.optional(S.String),
}) {}
export class ModelClientConfig extends S.Class<ModelClientConfig>(
  "ModelClientConfig",
)({
  InvocationsTimeoutInSeconds: S.optional(S.Number),
  InvocationsMaxRetries: S.optional(S.Number),
}) {}
export const TransformEnvironmentMap = S.Record({
  key: S.String,
  value: S.String,
});
export class TransformOutput extends S.Class<TransformOutput>(
  "TransformOutput",
)({
  S3OutputPath: S.String,
  Accept: S.optional(S.String),
  AssembleWith: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class BatchDataCaptureConfig extends S.Class<BatchDataCaptureConfig>(
  "BatchDataCaptureConfig",
)({
  DestinationS3Uri: S.String,
  KmsKeyId: S.optional(S.String),
  GenerateInferenceId: S.optional(S.Boolean),
}) {}
export class TransformResources extends S.Class<TransformResources>(
  "TransformResources",
)({
  InstanceType: S.String,
  InstanceCount: S.Number,
  VolumeKmsKeyId: S.optional(S.String),
  TransformAmiVersion: S.optional(S.String),
}) {}
export class DataProcessing extends S.Class<DataProcessing>("DataProcessing")({
  InputFilter: S.optional(S.String),
  OutputFilter: S.optional(S.String),
  JoinSource: S.optional(S.String),
}) {}
export class CognitoConfig extends S.Class<CognitoConfig>("CognitoConfig")({
  UserPool: S.String,
  ClientId: S.String,
}) {}
export class RetentionPolicy extends S.Class<RetentionPolicy>(
  "RetentionPolicy",
)({ HomeEfsFileSystem: S.optional(S.String) }) {}
export class FeatureParameter extends S.Class<FeatureParameter>(
  "FeatureParameter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const FeatureParameters = S.Array(FeatureParameter);
export class TrialComponentSource extends S.Class<TrialComponentSource>(
  "TrialComponentSource",
)({ SourceArn: S.String, SourceType: S.optional(S.String) }) {}
export const TrialComponentSources = S.Array(TrialComponentSource);
export class ScalingPolicyObjective extends S.Class<ScalingPolicyObjective>(
  "ScalingPolicyObjective",
)({
  MinInvocationsPerMinute: S.optional(S.Number),
  MaxInvocationsPerMinute: S.optional(S.Number),
}) {}
export class FinalAutoMLJobObjectiveMetric extends S.Class<FinalAutoMLJobObjectiveMetric>(
  "FinalAutoMLJobObjectiveMetric",
)({
  Type: S.optional(S.String),
  MetricName: S.String,
  Value: S.Number,
  StandardMetricName: S.optional(S.String),
}) {}
export class AutoMLCandidateStep extends S.Class<AutoMLCandidateStep>(
  "AutoMLCandidateStep",
)({
  CandidateStepType: S.String,
  CandidateStepArn: S.String,
  CandidateStepName: S.String,
}) {}
export const CandidateSteps = S.Array(AutoMLCandidateStep);
export class AutoMLContainerDefinition extends S.Class<AutoMLContainerDefinition>(
  "AutoMLContainerDefinition",
)({
  Image: S.String,
  ModelDataUrl: S.String,
  Environment: S.optional(EnvironmentMap),
}) {}
export const AutoMLContainerDefinitions = S.Array(AutoMLContainerDefinition);
export class CandidateArtifactLocations extends S.Class<CandidateArtifactLocations>(
  "CandidateArtifactLocations",
)({
  Explainability: S.String,
  ModelInsights: S.optional(S.String),
  BacktestResults: S.optional(S.String),
}) {}
export class MetricDatum extends S.Class<MetricDatum>("MetricDatum")({
  MetricName: S.optional(S.String),
  StandardMetricName: S.optional(S.String),
  Value: S.optional(S.Number),
  Set: S.optional(S.String),
}) {}
export const MetricDataList = S.Array(MetricDatum);
export class CandidateProperties extends S.Class<CandidateProperties>(
  "CandidateProperties",
)({
  CandidateArtifactLocations: S.optional(CandidateArtifactLocations),
  CandidateMetrics: S.optional(MetricDataList),
}) {}
export const AutoMLInferenceContainerDefinitions = S.Record({
  key: S.String,
  value: AutoMLContainerDefinitions,
});
export class AutoMLCandidate extends S.Class<AutoMLCandidate>(
  "AutoMLCandidate",
)({
  CandidateName: S.String,
  FinalAutoMLJobObjectiveMetric: S.optional(FinalAutoMLJobObjectiveMetric),
  ObjectiveStatus: S.String,
  CandidateSteps: CandidateSteps,
  CandidateStatus: S.String,
  InferenceContainers: S.optional(AutoMLContainerDefinitions),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
  CandidateProperties: S.optional(CandidateProperties),
  InferenceContainerDefinitions: S.optional(
    AutoMLInferenceContainerDefinitions,
  ),
}) {}
export const AutoMLCandidates = S.Array(AutoMLCandidate);
export class MonitoringExecutionSummary extends S.Class<MonitoringExecutionSummary>(
  "MonitoringExecutionSummary",
)({
  MonitoringScheduleName: S.String,
  ScheduledTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  MonitoringExecutionStatus: S.String,
  ProcessingJobArn: S.optional(S.String),
  EndpointName: S.optional(S.String),
  FailureReason: S.optional(S.String),
  MonitoringJobDefinitionName: S.optional(S.String),
  MonitoringType: S.optional(S.String),
}) {}
export const MonitoringExecutionSummaryList = S.Array(
  MonitoringExecutionSummary,
);
export class SubscribedWorkteam extends S.Class<SubscribedWorkteam>(
  "SubscribedWorkteam",
)({
  WorkteamArn: S.String,
  MarketplaceTitle: S.optional(S.String),
  SellerName: S.optional(S.String),
  MarketplaceDescription: S.optional(S.String),
  ListingId: S.optional(S.String),
}) {}
export const SubscribedWorkteams = S.Array(SubscribedWorkteam);
export class FinalHyperParameterTuningJobObjectiveMetric extends S.Class<FinalHyperParameterTuningJobObjectiveMetric>(
  "FinalHyperParameterTuningJobObjectiveMetric",
)({ Type: S.optional(S.String), MetricName: S.String, Value: S.Number }) {}
export class HyperParameterTrainingJobSummary extends S.Class<HyperParameterTrainingJobSummary>(
  "HyperParameterTrainingJobSummary",
)({
  TrainingJobDefinitionName: S.optional(S.String),
  TrainingJobName: S.String,
  TrainingJobArn: S.String,
  TuningJobName: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  TrainingStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TrainingEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingJobStatus: S.String,
  TunedHyperParameters: HyperParameters,
  FailureReason: S.optional(S.String),
  FinalHyperParameterTuningJobObjectiveMetric: S.optional(
    FinalHyperParameterTuningJobObjectiveMetric,
  ),
  ObjectiveStatus: S.optional(S.String),
}) {}
export const HyperParameterTrainingJobSummaries = S.Array(
  HyperParameterTrainingJobSummary,
);
export class TrainingPlanFilter extends S.Class<TrainingPlanFilter>(
  "TrainingPlanFilter",
)({ Name: S.String, Value: S.String }) {}
export const TrainingPlanFilters = S.Array(TrainingPlanFilter);
export class OidcConfigForResponse extends S.Class<OidcConfigForResponse>(
  "OidcConfigForResponse",
)({
  ClientId: S.optional(S.String),
  Issuer: S.optional(S.String),
  AuthorizationEndpoint: S.optional(S.String),
  TokenEndpoint: S.optional(S.String),
  UserInfoEndpoint: S.optional(S.String),
  LogoutEndpoint: S.optional(S.String),
  JwksUri: S.optional(S.String),
  Scope: S.optional(S.String),
  AuthenticationRequestExtraParams: S.optional(
    AuthenticationRequestExtraParams,
  ),
}) {}
export class WorkforceVpcConfigResponse extends S.Class<WorkforceVpcConfigResponse>(
  "WorkforceVpcConfigResponse",
)({
  VpcId: S.String,
  SecurityGroupIds: WorkforceSecurityGroupIds,
  Subnets: WorkforceSubnets,
  VpcEndpointId: S.optional(S.String),
}) {}
export class Workforce extends S.Class<Workforce>("Workforce")({
  WorkforceName: S.String,
  WorkforceArn: S.String,
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SourceIpConfig: S.optional(SourceIpConfig),
  SubDomain: S.optional(S.String),
  CognitoConfig: S.optional(CognitoConfig),
  OidcConfig: S.optional(OidcConfigForResponse),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  WorkforceVpcConfig: S.optional(WorkforceVpcConfigResponse),
  Status: S.optional(S.String),
  FailureReason: S.optional(S.String),
  IpAddressType: S.optional(S.String),
}) {}
export const Workforces = S.Array(Workforce);
export const ProductListings = S.Array(S.String);
export class Workteam extends S.Class<Workteam>("Workteam")({
  WorkteamName: S.String,
  MemberDefinitions: MemberDefinitions,
  WorkteamArn: S.String,
  WorkforceArn: S.optional(S.String),
  ProductListingIds: S.optional(ProductListings),
  Description: S.String,
  SubDomain: S.optional(S.String),
  CreateDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotificationConfiguration: S.optional(NotificationConfiguration),
  WorkerAccessConfiguration: S.optional(WorkerAccessConfiguration),
}) {}
export const Workteams = S.Array(Workteam);
export class RenderableTask extends S.Class<RenderableTask>("RenderableTask")({
  Input: S.String,
}) {}
export class VisibilityConditions extends S.Class<VisibilityConditions>(
  "VisibilityConditions",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const VisibilityConditionsList = S.Array(VisibilityConditions);
export class OutputParameter extends S.Class<OutputParameter>(
  "OutputParameter",
)({ Name: S.String, Value: S.String }) {}
export const OutputParameterList = S.Array(OutputParameter);
export class Parameter extends S.Class<Parameter>("Parameter")({
  Name: S.String,
  Value: S.String,
}) {}
export const ParameterList = S.Array(Parameter);
export const ModelVariantActionMap = S.Record({
  key: S.String,
  value: S.String,
});
export class UpdateClusterSoftwareInstanceGroupSpecification extends S.Class<UpdateClusterSoftwareInstanceGroupSpecification>(
  "UpdateClusterSoftwareInstanceGroupSpecification",
)({ InstanceGroupName: S.String }) {}
export const UpdateClusterSoftwareInstanceGroups = S.Array(
  UpdateClusterSoftwareInstanceGroupSpecification,
);
export class GitConfigForUpdate extends S.Class<GitConfigForUpdate>(
  "GitConfigForUpdate",
)({ SecretArn: S.optional(S.String) }) {}
export class VariantProperty extends S.Class<VariantProperty>(
  "VariantProperty",
)({ VariantPropertyType: S.String }) {}
export const VariantPropertyList = S.Array(VariantProperty);
export class TtlDuration extends S.Class<TtlDuration>("TtlDuration")({
  Unit: S.optional(S.String),
  Value: S.optional(S.Number),
}) {}
export class OnlineStoreConfigUpdate extends S.Class<OnlineStoreConfigUpdate>(
  "OnlineStoreConfigUpdate",
)({ TtlDuration: S.optional(TtlDuration) }) {}
export class ThroughputConfigUpdate extends S.Class<ThroughputConfigUpdate>(
  "ThroughputConfigUpdate",
)({
  ThroughputMode: S.optional(S.String),
  ProvisionedReadCapacityUnits: S.optional(S.Number),
  ProvisionedWriteCapacityUnits: S.optional(S.Number),
}) {}
export const FeatureParameterAdditions = S.Array(FeatureParameter);
export class ProvisioningParameter extends S.Class<ProvisioningParameter>(
  "ProvisioningParameter",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const ProvisioningParameters = S.Array(ProvisioningParameter);
export class ServiceCatalogProvisioningUpdateDetails extends S.Class<ServiceCatalogProvisioningUpdateDetails>(
  "ServiceCatalogProvisioningUpdateDetails",
)({
  ProvisioningArtifactId: S.optional(S.String),
  ProvisioningParameters: S.optional(ProvisioningParameters),
}) {}
export const ProfilingParameters = S.Record({ key: S.String, value: S.String });
export class ProfilerConfigForUpdate extends S.Class<ProfilerConfigForUpdate>(
  "ProfilerConfigForUpdate",
)({
  S3OutputPath: S.optional(S.String),
  ProfilingIntervalInMilliseconds: S.optional(S.Number),
  ProfilingParameters: S.optional(ProfilingParameters),
  DisableProfiler: S.optional(S.Boolean),
}) {}
export class ResourceConfigForUpdate extends S.Class<ResourceConfigForUpdate>(
  "ResourceConfigForUpdate",
)({ KeepAlivePeriodInSeconds: S.Number }) {}
export class RemoteDebugConfigForUpdate extends S.Class<RemoteDebugConfigForUpdate>(
  "RemoteDebugConfigForUpdate",
)({ EnableRemoteDebug: S.optional(S.Boolean) }) {}
export const CompressionTypes = S.Array(S.String);
export const InputModes = S.Array(S.String);
export const ForecastQuantiles = S.Array(S.String);
export const VpcOnlyTrustedAccounts = S.Array(S.String);
export const RecommendationJobSupportedInstanceTypes = S.Array(S.String);
export const RecommendationJobSupportedResponseMIMETypes = S.Array(S.String);
export const RecommendationJobVpcSecurityGroupIds = S.Array(S.String);
export const RecommendationJobVpcSubnets = S.Array(S.String);
export const ContentClassifiers = S.Array(S.String);
export class AddAssociationResponse extends S.Class<AddAssociationResponse>(
  "AddAssociationResponse",
)(
  { SourceArn: S.optional(S.String), DestinationArn: S.optional(S.String) },
  ns,
) {}
export class AddTagsInput extends S.Class<AddTagsInput>("AddTagsInput")(
  { ResourceArn: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssociateTrialComponentResponse extends S.Class<AssociateTrialComponentResponse>(
  "AssociateTrialComponentResponse",
)(
  { TrialComponentArn: S.optional(S.String), TrialArn: S.optional(S.String) },
  ns,
) {}
export class AttachClusterNodeVolumeResponse extends S.Class<AttachClusterNodeVolumeResponse>(
  "AttachClusterNodeVolumeResponse",
)(
  {
    ClusterArn: S.String,
    NodeId: S.String,
    VolumeId: S.String,
    AttachTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    DeviceName: S.String,
  },
  ns,
) {}
export class BatchAddClusterNodesRequest extends S.Class<BatchAddClusterNodesRequest>(
  "BatchAddClusterNodesRequest",
)(
  {
    ClusterName: S.String,
    ClientToken: S.optional(S.String),
    NodesToAdd: AddClusterNodeSpecificationList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateActionRequest extends S.Class<CreateActionRequest>(
  "CreateActionRequest",
)(
  {
    ActionName: S.String,
    Source: ActionSource,
    ActionType: S.String,
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    MetadataProperties: S.optional(MetadataProperties),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAppRequest extends S.Class<CreateAppRequest>(
  "CreateAppRequest",
)(
  {
    DomainId: S.String,
    UserProfileName: S.optional(S.String),
    SpaceName: S.optional(S.String),
    AppType: S.String,
    AppName: S.String,
    Tags: S.optional(TagList),
    ResourceSpec: S.optional(ResourceSpec),
    RecoveryMode: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCodeRepositoryInput extends S.Class<CreateCodeRepositoryInput>(
  "CreateCodeRepositoryInput",
)(
  {
    CodeRepositoryName: S.String,
    GitConfig: GitConfig,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateContextRequest extends S.Class<CreateContextRequest>(
  "CreateContextRequest",
)(
  {
    ContextName: S.String,
    Source: ContextSource,
    ContextType: S.String,
    Description: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDeviceFleetRequest extends S.Class<CreateDeviceFleetRequest>(
  "CreateDeviceFleetRequest",
)(
  {
    DeviceFleetName: S.String,
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    OutputConfig: EdgeOutputConfig,
    Tags: S.optional(TagList),
    EnableIotRoleAlias: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDeviceFleetResponse extends S.Class<CreateDeviceFleetResponse>(
  "CreateDeviceFleetResponse",
)({}, ns) {}
export class CreateExperimentResponse extends S.Class<CreateExperimentResponse>(
  "CreateExperimentResponse",
)({ ExperimentArn: S.optional(S.String) }, ns) {}
export class CreateHubRequest extends S.Class<CreateHubRequest>(
  "CreateHubRequest",
)(
  {
    HubName: S.String,
    HubDescription: S.String,
    HubDisplayName: S.optional(S.String),
    HubSearchKeywords: S.optional(HubSearchKeywordList),
    S3StorageConfig: S.optional(HubS3StorageConfig),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHubContentPresignedUrlsRequest extends S.Class<CreateHubContentPresignedUrlsRequest>(
  "CreateHubContentPresignedUrlsRequest",
)(
  {
    HubName: S.String,
    HubContentType: S.String,
    HubContentName: S.String,
    HubContentVersion: S.optional(S.String),
    AccessConfig: S.optional(PresignedUrlAccessConfig),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHubContentReferenceResponse extends S.Class<CreateHubContentReferenceResponse>(
  "CreateHubContentReferenceResponse",
)({ HubArn: S.String, HubContentArn: S.String }, ns) {}
export class CreateHumanTaskUiRequest extends S.Class<CreateHumanTaskUiRequest>(
  "CreateHumanTaskUiRequest",
)(
  {
    HumanTaskUiName: S.String,
    UiTemplate: UiTemplate,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateImageResponse extends S.Class<CreateImageResponse>(
  "CreateImageResponse",
)({ ImageArn: S.optional(S.String) }, ns) {}
export class CreateImageVersionResponse extends S.Class<CreateImageVersionResponse>(
  "CreateImageVersionResponse",
)({ ImageVersionArn: S.optional(S.String) }, ns) {}
export class CreateMlflowAppResponse extends S.Class<CreateMlflowAppResponse>(
  "CreateMlflowAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class CreateMlflowTrackingServerResponse extends S.Class<CreateMlflowTrackingServerResponse>(
  "CreateMlflowTrackingServerResponse",
)({ TrackingServerArn: S.optional(S.String) }, ns) {}
export class CreateModelCardRequest extends S.Class<CreateModelCardRequest>(
  "CreateModelCardRequest",
)(
  {
    ModelCardName: S.String,
    SecurityConfig: S.optional(ModelCardSecurityConfig),
    Content: S.String,
    ModelCardStatus: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelCardExportJobRequest extends S.Class<CreateModelCardExportJobRequest>(
  "CreateModelCardExportJobRequest",
)(
  {
    ModelCardName: S.String,
    ModelCardVersion: S.optional(S.Number),
    ModelCardExportJobName: S.String,
    OutputConfig: ModelCardExportOutputConfig,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelExplainabilityJobDefinitionRequest extends S.Class<CreateModelExplainabilityJobDefinitionRequest>(
  "CreateModelExplainabilityJobDefinitionRequest",
)(
  {
    JobDefinitionName: S.String,
    ModelExplainabilityBaselineConfig: S.optional(
      ModelExplainabilityBaselineConfig,
    ),
    ModelExplainabilityAppSpecification: ModelExplainabilityAppSpecification,
    ModelExplainabilityJobInput: ModelExplainabilityJobInput,
    ModelExplainabilityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelPackageGroupOutput extends S.Class<CreateModelPackageGroupOutput>(
  "CreateModelPackageGroupOutput",
)({ ModelPackageGroupArn: S.String }, ns) {}
export class CreateModelQualityJobDefinitionRequest extends S.Class<CreateModelQualityJobDefinitionRequest>(
  "CreateModelQualityJobDefinitionRequest",
)(
  {
    JobDefinitionName: S.String,
    ModelQualityBaselineConfig: S.optional(ModelQualityBaselineConfig),
    ModelQualityAppSpecification: ModelQualityAppSpecification,
    ModelQualityJobInput: ModelQualityJobInput,
    ModelQualityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNotebookInstanceInput extends S.Class<CreateNotebookInstanceInput>(
  "CreateNotebookInstanceInput",
)(
  {
    NotebookInstanceName: S.String,
    InstanceType: S.String,
    SubnetId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    IpAddressType: S.optional(S.String),
    RoleArn: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
    LifecycleConfigName: S.optional(S.String),
    DirectInternetAccess: S.optional(S.String),
    VolumeSizeInGB: S.optional(S.Number),
    AcceleratorTypes: S.optional(NotebookInstanceAcceleratorTypes),
    DefaultCodeRepository: S.optional(S.String),
    AdditionalCodeRepositories: S.optional(AdditionalCodeRepositoryNamesOrUrls),
    RootAccess: S.optional(S.String),
    PlatformIdentifier: S.optional(S.String),
    InstanceMetadataServiceConfiguration: S.optional(
      InstanceMetadataServiceConfiguration,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNotebookInstanceLifecycleConfigInput extends S.Class<CreateNotebookInstanceLifecycleConfigInput>(
  "CreateNotebookInstanceLifecycleConfigInput",
)(
  {
    NotebookInstanceLifecycleConfigName: S.String,
    OnCreate: S.optional(NotebookInstanceLifecycleConfigList),
    OnStart: S.optional(NotebookInstanceLifecycleConfigList),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartnerAppPresignedUrlResponse extends S.Class<CreatePartnerAppPresignedUrlResponse>(
  "CreatePartnerAppPresignedUrlResponse",
)({ Url: S.optional(S.String) }, ns) {}
export class CreatePipelineRequest extends S.Class<CreatePipelineRequest>(
  "CreatePipelineRequest",
)(
  {
    PipelineName: S.String,
    PipelineDisplayName: S.optional(S.String),
    PipelineDefinition: S.optional(S.String),
    PipelineDefinitionS3Location: S.optional(PipelineDefinitionS3Location),
    PipelineDescription: S.optional(S.String),
    ClientRequestToken: S.String,
    RoleArn: S.String,
    Tags: S.optional(TagList),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePresignedDomainUrlResponse extends S.Class<CreatePresignedDomainUrlResponse>(
  "CreatePresignedDomainUrlResponse",
)({ AuthorizedUrl: S.optional(S.String) }, ns) {}
export class CreatePresignedMlflowAppUrlResponse extends S.Class<CreatePresignedMlflowAppUrlResponse>(
  "CreatePresignedMlflowAppUrlResponse",
)({ AuthorizedUrl: S.optional(S.String) }, ns) {}
export class CreatePresignedMlflowTrackingServerUrlResponse extends S.Class<CreatePresignedMlflowTrackingServerUrlResponse>(
  "CreatePresignedMlflowTrackingServerUrlResponse",
)({ AuthorizedUrl: S.optional(S.String) }, ns) {}
export class CreatePresignedNotebookInstanceUrlOutput extends S.Class<CreatePresignedNotebookInstanceUrlOutput>(
  "CreatePresignedNotebookInstanceUrlOutput",
)({ AuthorizedUrl: S.optional(S.String) }, ns) {}
export class CreateStudioLifecycleConfigResponse extends S.Class<CreateStudioLifecycleConfigResponse>(
  "CreateStudioLifecycleConfigResponse",
)({ StudioLifecycleConfigArn: S.optional(S.String) }, ns) {}
export class CreateTrainingPlanResponse extends S.Class<CreateTrainingPlanResponse>(
  "CreateTrainingPlanResponse",
)({ TrainingPlanArn: S.String }, ns) {}
export class CreateTrialResponse extends S.Class<CreateTrialResponse>(
  "CreateTrialResponse",
)({ TrialArn: S.optional(S.String) }, ns) {}
export class CreateUserProfileResponse extends S.Class<CreateUserProfileResponse>(
  "CreateUserProfileResponse",
)({ UserProfileArn: S.optional(S.String) }, ns) {}
export class DeleteActionResponse extends S.Class<DeleteActionResponse>(
  "DeleteActionResponse",
)({ ActionArn: S.optional(S.String) }, ns) {}
export class DeleteArtifactResponse extends S.Class<DeleteArtifactResponse>(
  "DeleteArtifactResponse",
)({ ArtifactArn: S.optional(S.String) }, ns) {}
export class DeleteAssociationResponse extends S.Class<DeleteAssociationResponse>(
  "DeleteAssociationResponse",
)(
  { SourceArn: S.optional(S.String), DestinationArn: S.optional(S.String) },
  ns,
) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({ ClusterArn: S.String }, ns) {}
export class DeleteContextResponse extends S.Class<DeleteContextResponse>(
  "DeleteContextResponse",
)({ ContextArn: S.optional(S.String) }, ns) {}
export class DeleteDomainRequest extends S.Class<DeleteDomainRequest>(
  "DeleteDomainRequest",
)(
  { DomainId: S.String, RetentionPolicy: S.optional(RetentionPolicy) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDomainResponse extends S.Class<DeleteDomainResponse>(
  "DeleteDomainResponse",
)({}, ns) {}
export class DeleteExperimentResponse extends S.Class<DeleteExperimentResponse>(
  "DeleteExperimentResponse",
)({ ExperimentArn: S.optional(S.String) }, ns) {}
export class DeleteInferenceExperimentResponse extends S.Class<DeleteInferenceExperimentResponse>(
  "DeleteInferenceExperimentResponse",
)({ InferenceExperimentArn: S.String }, ns) {}
export class DeleteMlflowAppResponse extends S.Class<DeleteMlflowAppResponse>(
  "DeleteMlflowAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class DeleteMlflowTrackingServerResponse extends S.Class<DeleteMlflowTrackingServerResponse>(
  "DeleteMlflowTrackingServerResponse",
)({ TrackingServerArn: S.optional(S.String) }, ns) {}
export class DeletePartnerAppResponse extends S.Class<DeletePartnerAppResponse>(
  "DeletePartnerAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class DeletePipelineResponse extends S.Class<DeletePipelineResponse>(
  "DeletePipelineResponse",
)({ PipelineArn: S.optional(S.String) }, ns) {}
export class DeleteTrialResponse extends S.Class<DeleteTrialResponse>(
  "DeleteTrialResponse",
)({ TrialArn: S.optional(S.String) }, ns) {}
export class DeleteTrialComponentResponse extends S.Class<DeleteTrialComponentResponse>(
  "DeleteTrialComponentResponse",
)({ TrialComponentArn: S.optional(S.String) }, ns) {}
export class DeleteWorkteamResponse extends S.Class<DeleteWorkteamResponse>(
  "DeleteWorkteamResponse",
)({ Success: S.Boolean }, ns) {}
export class DescribeAppResponse extends S.Class<DescribeAppResponse>(
  "DescribeAppResponse",
)(
  {
    AppArn: S.optional(S.String),
    AppType: S.optional(S.String),
    AppName: S.optional(S.String),
    DomainId: S.optional(S.String),
    UserProfileName: S.optional(S.String),
    SpaceName: S.optional(S.String),
    Status: S.optional(S.String),
    EffectiveTrustedIdentityPropagationStatus: S.optional(S.String),
    RecoveryMode: S.optional(S.Boolean),
    LastHealthCheckTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUserActivityTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    ResourceSpec: S.optional(ResourceSpec),
    BuiltInLifecycleConfigArn: S.optional(S.String),
  },
  ns,
) {}
export class DescribeAppImageConfigResponse extends S.Class<DescribeAppImageConfigResponse>(
  "DescribeAppImageConfigResponse",
)(
  {
    AppImageConfigArn: S.optional(S.String),
    AppImageConfigName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    KernelGatewayImageConfig: S.optional(KernelGatewayImageConfig),
    JupyterLabAppImageConfig: S.optional(JupyterLabAppImageConfig),
    CodeEditorAppImageConfig: S.optional(CodeEditorAppImageConfig),
  },
  ns,
) {}
export class IamIdentity extends S.Class<IamIdentity>("IamIdentity")({
  Arn: S.optional(S.String),
  PrincipalId: S.optional(S.String),
  SourceIdentity: S.optional(S.String),
}) {}
export class UserContext extends S.Class<UserContext>("UserContext")({
  UserProfileArn: S.optional(S.String),
  UserProfileName: S.optional(S.String),
  DomainId: S.optional(S.String),
  IamIdentity: S.optional(IamIdentity),
}) {}
export class DescribeArtifactResponse extends S.Class<DescribeArtifactResponse>(
  "DescribeArtifactResponse",
)(
  {
    ArtifactName: S.optional(S.String),
    ArtifactArn: S.optional(S.String),
    Source: S.optional(ArtifactSource),
    ArtifactType: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    MetadataProperties: S.optional(MetadataProperties),
    LineageGroupArn: S.optional(S.String),
  },
  ns,
) {}
export class DescribeClusterSchedulerConfigResponse extends S.Class<DescribeClusterSchedulerConfigResponse>(
  "DescribeClusterSchedulerConfigResponse",
)(
  {
    ClusterSchedulerConfigArn: S.String,
    ClusterSchedulerConfigId: S.String,
    Name: S.String,
    ClusterSchedulerConfigVersion: S.Number,
    Status: S.String,
    FailureReason: S.optional(S.String),
    ClusterArn: S.optional(S.String),
    SchedulerConfig: S.optional(SchedulerConfig),
    Description: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export class DescribeCodeRepositoryOutput extends S.Class<DescribeCodeRepositoryOutput>(
  "DescribeCodeRepositoryOutput",
)(
  {
    CodeRepositoryName: S.String,
    CodeRepositoryArn: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    GitConfig: S.optional(GitConfig),
  },
  ns,
) {}
export class DescribeComputeQuotaResponse extends S.Class<DescribeComputeQuotaResponse>(
  "DescribeComputeQuotaResponse",
)(
  {
    ComputeQuotaArn: S.String,
    ComputeQuotaId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    ComputeQuotaVersion: S.Number,
    Status: S.String,
    FailureReason: S.optional(S.String),
    ClusterArn: S.optional(S.String),
    ComputeQuotaConfig: S.optional(ComputeQuotaConfig),
    ComputeQuotaTarget: ComputeQuotaTarget,
    ActivationState: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export class DescribeContextResponse extends S.Class<DescribeContextResponse>(
  "DescribeContextResponse",
)(
  {
    ContextName: S.optional(S.String),
    ContextArn: S.optional(S.String),
    Source: S.optional(ContextSource),
    ContextType: S.optional(S.String),
    Description: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    LineageGroupArn: S.optional(S.String),
  },
  ns,
) {}
export class DataQualityBaselineConfig extends S.Class<DataQualityBaselineConfig>(
  "DataQualityBaselineConfig",
)({
  BaseliningJobName: S.optional(S.String),
  ConstraintsResource: S.optional(MonitoringConstraintsResource),
  StatisticsResource: S.optional(MonitoringStatisticsResource),
}) {}
export class DataQualityAppSpecification extends S.Class<DataQualityAppSpecification>(
  "DataQualityAppSpecification",
)({
  ImageUri: S.String,
  ContainerEntrypoint: S.optional(ContainerEntrypoint),
  ContainerArguments: S.optional(MonitoringContainerArguments),
  RecordPreprocessorSourceUri: S.optional(S.String),
  PostAnalyticsProcessorSourceUri: S.optional(S.String),
  Environment: S.optional(MonitoringEnvironmentMap),
}) {}
export class DataQualityJobInput extends S.Class<DataQualityJobInput>(
  "DataQualityJobInput",
)({
  EndpointInput: S.optional(EndpointInput),
  BatchTransformInput: S.optional(BatchTransformInput),
}) {}
export class DescribeDataQualityJobDefinitionResponse extends S.Class<DescribeDataQualityJobDefinitionResponse>(
  "DescribeDataQualityJobDefinitionResponse",
)(
  {
    JobDefinitionArn: S.String,
    JobDefinitionName: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    DataQualityBaselineConfig: S.optional(DataQualityBaselineConfig),
    DataQualityAppSpecification: DataQualityAppSpecification,
    DataQualityJobInput: DataQualityJobInput,
    DataQualityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
  },
  ns,
) {}
export class DescribeDeviceFleetResponse extends S.Class<DescribeDeviceFleetResponse>(
  "DescribeDeviceFleetResponse",
)(
  {
    DeviceFleetName: S.String,
    DeviceFleetArn: S.String,
    OutputConfig: EdgeOutputConfig,
    Description: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RoleArn: S.optional(S.String),
    IotRoleAlias: S.optional(S.String),
  },
  ns,
) {}
export class RStudioServerProDomainSettings extends S.Class<RStudioServerProDomainSettings>(
  "RStudioServerProDomainSettings",
)({
  DomainExecutionRoleArn: S.String,
  RStudioConnectUrl: S.optional(S.String),
  RStudioPackageManagerUrl: S.optional(S.String),
  DefaultResourceSpec: S.optional(ResourceSpec),
}) {}
export class TrustedIdentityPropagationSettings extends S.Class<TrustedIdentityPropagationSettings>(
  "TrustedIdentityPropagationSettings",
)({ Status: S.String }) {}
export class DockerSettings extends S.Class<DockerSettings>("DockerSettings")({
  EnableDockerAccess: S.optional(S.String),
  VpcOnlyTrustedAccounts: S.optional(VpcOnlyTrustedAccounts),
  RootlessDocker: S.optional(S.String),
}) {}
export class AmazonQSettings extends S.Class<AmazonQSettings>(
  "AmazonQSettings",
)({ Status: S.optional(S.String), QProfileArn: S.optional(S.String) }) {}
export class UnifiedStudioSettings extends S.Class<UnifiedStudioSettings>(
  "UnifiedStudioSettings",
)({
  StudioWebPortalAccess: S.optional(S.String),
  DomainAccountId: S.optional(S.String),
  DomainRegion: S.optional(S.String),
  DomainId: S.optional(S.String),
  ProjectId: S.optional(S.String),
  EnvironmentId: S.optional(S.String),
  ProjectS3Path: S.optional(S.String),
  SingleSignOnApplicationArn: S.optional(S.String),
}) {}
export class DomainSettings extends S.Class<DomainSettings>("DomainSettings")({
  SecurityGroupIds: S.optional(DomainSecurityGroupIds),
  RStudioServerProDomainSettings: S.optional(RStudioServerProDomainSettings),
  ExecutionRoleIdentityConfig: S.optional(S.String),
  TrustedIdentityPropagationSettings: S.optional(
    TrustedIdentityPropagationSettings,
  ),
  DockerSettings: S.optional(DockerSettings),
  AmazonQSettings: S.optional(AmazonQSettings),
  UnifiedStudioSettings: S.optional(UnifiedStudioSettings),
  IpAddressType: S.optional(S.String),
}) {}
export class DescribeDomainResponse extends S.Class<DescribeDomainResponse>(
  "DescribeDomainResponse",
)(
  {
    DomainArn: S.optional(S.String),
    DomainId: S.optional(S.String),
    DomainName: S.optional(S.String),
    HomeEfsFileSystemId: S.optional(S.String),
    SingleSignOnManagedApplicationInstanceId: S.optional(S.String),
    SingleSignOnApplicationArn: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    FailureReason: S.optional(S.String),
    SecurityGroupIdForDomainBoundary: S.optional(S.String),
    AuthMode: S.optional(S.String),
    DefaultUserSettings: S.optional(UserSettings),
    DomainSettings: S.optional(DomainSettings),
    AppNetworkAccessType: S.optional(S.String),
    HomeEfsFileSystemKmsKeyId: S.optional(S.String),
    SubnetIds: S.optional(Subnets),
    Url: S.optional(S.String),
    VpcId: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    AppSecurityGroupManagement: S.optional(S.String),
    TagPropagation: S.optional(S.String),
    DefaultSpaceSettings: S.optional(DefaultSpaceSettings),
  },
  ns,
) {}
export class ProductionVariantCoreDumpConfig extends S.Class<ProductionVariantCoreDumpConfig>(
  "ProductionVariantCoreDumpConfig",
)({ DestinationS3Uri: S.String, KmsKeyId: S.optional(S.String) }) {}
export class ProductionVariantServerlessConfig extends S.Class<ProductionVariantServerlessConfig>(
  "ProductionVariantServerlessConfig",
)({
  MemorySizeInMB: S.Number,
  MaxConcurrency: S.Number,
  ProvisionedConcurrency: S.optional(S.Number),
}) {}
export class ProductionVariantManagedInstanceScaling extends S.Class<ProductionVariantManagedInstanceScaling>(
  "ProductionVariantManagedInstanceScaling",
)({
  Status: S.optional(S.String),
  MinInstanceCount: S.optional(S.Number),
  MaxInstanceCount: S.optional(S.Number),
}) {}
export class ProductionVariantRoutingConfig extends S.Class<ProductionVariantRoutingConfig>(
  "ProductionVariantRoutingConfig",
)({ RoutingStrategy: S.String }) {}
export class ProductionVariantCapacityReservationConfig extends S.Class<ProductionVariantCapacityReservationConfig>(
  "ProductionVariantCapacityReservationConfig",
)({
  CapacityReservationPreference: S.optional(S.String),
  MlReservationArn: S.optional(S.String),
}) {}
export class ProductionVariant extends S.Class<ProductionVariant>(
  "ProductionVariant",
)({
  VariantName: S.String,
  ModelName: S.optional(S.String),
  InitialInstanceCount: S.optional(S.Number),
  InstanceType: S.optional(S.String),
  InitialVariantWeight: S.optional(S.Number),
  AcceleratorType: S.optional(S.String),
  CoreDumpConfig: S.optional(ProductionVariantCoreDumpConfig),
  ServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  VolumeSizeInGB: S.optional(S.Number),
  ModelDataDownloadTimeoutInSeconds: S.optional(S.Number),
  ContainerStartupHealthCheckTimeoutInSeconds: S.optional(S.Number),
  EnableSSMAccess: S.optional(S.Boolean),
  ManagedInstanceScaling: S.optional(ProductionVariantManagedInstanceScaling),
  RoutingConfig: S.optional(ProductionVariantRoutingConfig),
  InferenceAmiVersion: S.optional(S.String),
  CapacityReservationConfig: S.optional(
    ProductionVariantCapacityReservationConfig,
  ),
}) {}
export const ProductionVariantList = S.Array(ProductionVariant);
export class CaptureOption extends S.Class<CaptureOption>("CaptureOption")({
  CaptureMode: S.String,
}) {}
export const CaptureOptionList = S.Array(CaptureOption);
export class DataCaptureConfig extends S.Class<DataCaptureConfig>(
  "DataCaptureConfig",
)({
  EnableCapture: S.optional(S.Boolean),
  InitialSamplingPercentage: S.Number,
  DestinationS3Uri: S.String,
  KmsKeyId: S.optional(S.String),
  CaptureOptions: CaptureOptionList,
  CaptureContentTypeHeader: S.optional(CaptureContentTypeHeader),
}) {}
export class AsyncInferenceClientConfig extends S.Class<AsyncInferenceClientConfig>(
  "AsyncInferenceClientConfig",
)({ MaxConcurrentInvocationsPerInstance: S.optional(S.Number) }) {}
export const AsyncNotificationTopicTypeList = S.Array(S.String);
export class AsyncInferenceNotificationConfig extends S.Class<AsyncInferenceNotificationConfig>(
  "AsyncInferenceNotificationConfig",
)({
  SuccessTopic: S.optional(S.String),
  ErrorTopic: S.optional(S.String),
  IncludeInferenceResponseIn: S.optional(AsyncNotificationTopicTypeList),
}) {}
export class AsyncInferenceOutputConfig extends S.Class<AsyncInferenceOutputConfig>(
  "AsyncInferenceOutputConfig",
)({
  KmsKeyId: S.optional(S.String),
  S3OutputPath: S.optional(S.String),
  NotificationConfig: S.optional(AsyncInferenceNotificationConfig),
  S3FailurePath: S.optional(S.String),
}) {}
export class AsyncInferenceConfig extends S.Class<AsyncInferenceConfig>(
  "AsyncInferenceConfig",
)({
  ClientConfig: S.optional(AsyncInferenceClientConfig),
  OutputConfig: AsyncInferenceOutputConfig,
}) {}
export const ClarifyLabelHeaders = S.Array(S.String);
export const ClarifyFeatureHeaders = S.Array(S.String);
export const ClarifyFeatureTypes = S.Array(S.String);
export class ClarifyInferenceConfig extends S.Class<ClarifyInferenceConfig>(
  "ClarifyInferenceConfig",
)({
  FeaturesAttribute: S.optional(S.String),
  ContentTemplate: S.optional(S.String),
  MaxRecordCount: S.optional(S.Number),
  MaxPayloadInMB: S.optional(S.Number),
  ProbabilityIndex: S.optional(S.Number),
  LabelIndex: S.optional(S.Number),
  ProbabilityAttribute: S.optional(S.String),
  LabelAttribute: S.optional(S.String),
  LabelHeaders: S.optional(ClarifyLabelHeaders),
  FeatureHeaders: S.optional(ClarifyFeatureHeaders),
  FeatureTypes: S.optional(ClarifyFeatureTypes),
}) {}
export class ClarifyShapBaselineConfig extends S.Class<ClarifyShapBaselineConfig>(
  "ClarifyShapBaselineConfig",
)({
  MimeType: S.optional(S.String),
  ShapBaseline: S.optional(S.String),
  ShapBaselineUri: S.optional(S.String),
}) {}
export class ClarifyTextConfig extends S.Class<ClarifyTextConfig>(
  "ClarifyTextConfig",
)({ Language: S.String, Granularity: S.String }) {}
export class ClarifyShapConfig extends S.Class<ClarifyShapConfig>(
  "ClarifyShapConfig",
)({
  ShapBaselineConfig: ClarifyShapBaselineConfig,
  NumberOfSamples: S.optional(S.Number),
  UseLogit: S.optional(S.Boolean),
  Seed: S.optional(S.Number),
  TextConfig: S.optional(ClarifyTextConfig),
}) {}
export class ClarifyExplainerConfig extends S.Class<ClarifyExplainerConfig>(
  "ClarifyExplainerConfig",
)({
  EnableExplanations: S.optional(S.String),
  InferenceConfig: S.optional(ClarifyInferenceConfig),
  ShapConfig: ClarifyShapConfig,
}) {}
export class ExplainerConfig extends S.Class<ExplainerConfig>(
  "ExplainerConfig",
)({ ClarifyExplainerConfig: S.optional(ClarifyExplainerConfig) }) {}
export class DescribeEndpointConfigOutput extends S.Class<DescribeEndpointConfigOutput>(
  "DescribeEndpointConfigOutput",
)(
  {
    EndpointConfigName: S.String,
    EndpointConfigArn: S.String,
    ProductionVariants: ProductionVariantList,
    DataCaptureConfig: S.optional(DataCaptureConfig),
    KmsKeyId: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    AsyncInferenceConfig: S.optional(AsyncInferenceConfig),
    ExplainerConfig: S.optional(ExplainerConfig),
    ShadowProductionVariants: S.optional(ProductionVariantList),
    ExecutionRoleArn: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    EnableNetworkIsolation: S.optional(S.Boolean),
    MetricsConfig: S.optional(MetricsConfig),
  },
  ns,
) {}
export class DescribeFeatureMetadataResponse extends S.Class<DescribeFeatureMetadataResponse>(
  "DescribeFeatureMetadataResponse",
)(
  {
    FeatureGroupArn: S.String,
    FeatureGroupName: S.String,
    FeatureName: S.String,
    FeatureType: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Description: S.optional(S.String),
    Parameters: S.optional(FeatureParameters),
  },
  ns,
) {}
export class HumanLoopActivationConditionsConfig extends S.Class<HumanLoopActivationConditionsConfig>(
  "HumanLoopActivationConditionsConfig",
)({ HumanLoopActivationConditions: S.String }) {}
export class HumanLoopActivationConfig extends S.Class<HumanLoopActivationConfig>(
  "HumanLoopActivationConfig",
)({
  HumanLoopActivationConditionsConfig: HumanLoopActivationConditionsConfig,
}) {}
export class USD extends S.Class<USD>("USD")({
  Dollars: S.optional(S.Number),
  Cents: S.optional(S.Number),
  TenthFractionsOfACent: S.optional(S.Number),
}) {}
export class PublicWorkforceTaskPrice extends S.Class<PublicWorkforceTaskPrice>(
  "PublicWorkforceTaskPrice",
)({ AmountInUsd: S.optional(USD) }) {}
export class HumanLoopConfig extends S.Class<HumanLoopConfig>(
  "HumanLoopConfig",
)({
  WorkteamArn: S.String,
  HumanTaskUiArn: S.String,
  TaskTitle: S.String,
  TaskDescription: S.String,
  TaskCount: S.Number,
  TaskAvailabilityLifetimeInSeconds: S.optional(S.Number),
  TaskTimeLimitInSeconds: S.optional(S.Number),
  TaskKeywords: S.optional(FlowDefinitionTaskKeywords),
  PublicWorkforceTaskPrice: S.optional(PublicWorkforceTaskPrice),
}) {}
export class DescribeFlowDefinitionResponse extends S.Class<DescribeFlowDefinitionResponse>(
  "DescribeFlowDefinitionResponse",
)(
  {
    FlowDefinitionArn: S.String,
    FlowDefinitionName: S.String,
    FlowDefinitionStatus: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    HumanLoopRequestSource: S.optional(HumanLoopRequestSource),
    HumanLoopActivationConfig: S.optional(HumanLoopActivationConfig),
    HumanLoopConfig: S.optional(HumanLoopConfig),
    OutputConfig: FlowDefinitionOutputConfig,
    RoleArn: S.String,
    FailureReason: S.optional(S.String),
  },
  ns,
) {}
export class DescribeHubResponse extends S.Class<DescribeHubResponse>(
  "DescribeHubResponse",
)(
  {
    HubName: S.String,
    HubArn: S.String,
    HubDisplayName: S.optional(S.String),
    HubDescription: S.optional(S.String),
    HubSearchKeywords: S.optional(HubSearchKeywordList),
    S3StorageConfig: S.optional(HubS3StorageConfig),
    HubStatus: S.String,
    FailureReason: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  ns,
) {}
export class DescribeImageResponse extends S.Class<DescribeImageResponse>(
  "DescribeImageResponse",
)(
  {
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    DisplayName: S.optional(S.String),
    FailureReason: S.optional(S.String),
    ImageArn: S.optional(S.String),
    ImageName: S.optional(S.String),
    ImageStatus: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RoleArn: S.optional(S.String),
  },
  ns,
) {}
export class DescribeImageVersionResponse extends S.Class<DescribeImageVersionResponse>(
  "DescribeImageVersionResponse",
)(
  {
    BaseImage: S.optional(S.String),
    ContainerImage: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    ImageArn: S.optional(S.String),
    ImageVersionArn: S.optional(S.String),
    ImageVersionStatus: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Version: S.optional(S.Number),
    VendorGuidance: S.optional(S.String),
    JobType: S.optional(S.String),
    MLFramework: S.optional(S.String),
    ProgrammingLang: S.optional(S.String),
    Processor: S.optional(S.String),
    Horovod: S.optional(S.Boolean),
    ReleaseNotes: S.optional(S.String),
  },
  ns,
) {}
export class DescribeLineageGroupResponse extends S.Class<DescribeLineageGroupResponse>(
  "DescribeLineageGroupResponse",
)(
  {
    LineageGroupName: S.optional(S.String),
    LineageGroupArn: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export class DescribeMlflowAppResponse extends S.Class<DescribeMlflowAppResponse>(
  "DescribeMlflowAppResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    ArtifactStoreUri: S.optional(S.String),
    MlflowVersion: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Status: S.optional(S.String),
    ModelRegistrationMode: S.optional(S.String),
    AccountDefaultStatus: S.optional(S.String),
    DefaultDomainIdList: S.optional(DefaultDomainIdList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    MaintenanceStatus: S.optional(S.String),
  },
  ns,
) {}
export class DescribeMlflowTrackingServerResponse extends S.Class<DescribeMlflowTrackingServerResponse>(
  "DescribeMlflowTrackingServerResponse",
)(
  {
    TrackingServerArn: S.optional(S.String),
    TrackingServerName: S.optional(S.String),
    ArtifactStoreUri: S.optional(S.String),
    TrackingServerSize: S.optional(S.String),
    MlflowVersion: S.optional(S.String),
    RoleArn: S.optional(S.String),
    TrackingServerStatus: S.optional(S.String),
    TrackingServerMaintenanceStatus: S.optional(S.String),
    IsActive: S.optional(S.String),
    TrackingServerUrl: S.optional(S.String),
    WeeklyMaintenanceWindowStart: S.optional(S.String),
    AutomaticModelRegistration: S.optional(S.Boolean),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export class ModelBiasJobInput extends S.Class<ModelBiasJobInput>(
  "ModelBiasJobInput",
)({
  EndpointInput: S.optional(EndpointInput),
  BatchTransformInput: S.optional(BatchTransformInput),
  GroundTruthS3Input: MonitoringGroundTruthS3Input,
}) {}
export class DescribeModelBiasJobDefinitionResponse extends S.Class<DescribeModelBiasJobDefinitionResponse>(
  "DescribeModelBiasJobDefinitionResponse",
)(
  {
    JobDefinitionArn: S.String,
    JobDefinitionName: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModelBiasBaselineConfig: S.optional(ModelBiasBaselineConfig),
    ModelBiasAppSpecification: ModelBiasAppSpecification,
    ModelBiasJobInput: ModelBiasJobInput,
    ModelBiasJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
  },
  ns,
) {}
export class DescribeModelCardResponse extends S.Class<DescribeModelCardResponse>(
  "DescribeModelCardResponse",
)(
  {
    ModelCardArn: S.String,
    ModelCardName: S.String,
    ModelCardVersion: S.Number,
    Content: S.String,
    ModelCardStatus: S.String,
    SecurityConfig: S.optional(ModelCardSecurityConfig),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreatedBy: UserContext,
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    ModelCardProcessingStatus: S.optional(S.String),
  },
  ns,
) {}
export class DescribeModelExplainabilityJobDefinitionResponse extends S.Class<DescribeModelExplainabilityJobDefinitionResponse>(
  "DescribeModelExplainabilityJobDefinitionResponse",
)(
  {
    JobDefinitionArn: S.String,
    JobDefinitionName: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModelExplainabilityBaselineConfig: S.optional(
      ModelExplainabilityBaselineConfig,
    ),
    ModelExplainabilityAppSpecification: ModelExplainabilityAppSpecification,
    ModelExplainabilityJobInput: ModelExplainabilityJobInput,
    ModelExplainabilityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
  },
  ns,
) {}
export class DescribeModelPackageGroupOutput extends S.Class<DescribeModelPackageGroupOutput>(
  "DescribeModelPackageGroupOutput",
)(
  {
    ModelPackageGroupName: S.String,
    ModelPackageGroupArn: S.String,
    ModelPackageGroupDescription: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CreatedBy: UserContext,
    ModelPackageGroupStatus: S.String,
  },
  ns,
) {}
export class DescribeModelQualityJobDefinitionResponse extends S.Class<DescribeModelQualityJobDefinitionResponse>(
  "DescribeModelQualityJobDefinitionResponse",
)(
  {
    JobDefinitionArn: S.String,
    JobDefinitionName: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModelQualityBaselineConfig: S.optional(ModelQualityBaselineConfig),
    ModelQualityAppSpecification: ModelQualityAppSpecification,
    ModelQualityJobInput: ModelQualityJobInput,
    ModelQualityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
  },
  ns,
) {}
export class DescribeNotebookInstanceOutput extends S.Class<DescribeNotebookInstanceOutput>(
  "DescribeNotebookInstanceOutput",
)(
  {
    NotebookInstanceArn: S.optional(S.String),
    NotebookInstanceName: S.optional(S.String),
    NotebookInstanceStatus: S.optional(S.String),
    FailureReason: S.optional(S.String),
    Url: S.optional(S.String),
    InstanceType: S.optional(S.String),
    IpAddressType: S.optional(S.String),
    SubnetId: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroupIds),
    RoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NotebookInstanceLifecycleConfigName: S.optional(S.String),
    DirectInternetAccess: S.optional(S.String),
    VolumeSizeInGB: S.optional(S.Number),
    AcceleratorTypes: S.optional(NotebookInstanceAcceleratorTypes),
    DefaultCodeRepository: S.optional(S.String),
    AdditionalCodeRepositories: S.optional(AdditionalCodeRepositoryNamesOrUrls),
    RootAccess: S.optional(S.String),
    PlatformIdentifier: S.optional(S.String),
    InstanceMetadataServiceConfiguration: S.optional(
      InstanceMetadataServiceConfiguration,
    ),
  },
  ns,
) {}
export class DescribeNotebookInstanceLifecycleConfigOutput extends S.Class<DescribeNotebookInstanceLifecycleConfigOutput>(
  "DescribeNotebookInstanceLifecycleConfigOutput",
)(
  {
    NotebookInstanceLifecycleConfigArn: S.optional(S.String),
    NotebookInstanceLifecycleConfigName: S.optional(S.String),
    OnCreate: S.optional(NotebookInstanceLifecycleConfigList),
    OnStart: S.optional(NotebookInstanceLifecycleConfigList),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class DescribePipelineResponse extends S.Class<DescribePipelineResponse>(
  "DescribePipelineResponse",
)(
  {
    PipelineArn: S.optional(S.String),
    PipelineName: S.optional(S.String),
    PipelineDisplayName: S.optional(S.String),
    PipelineDefinition: S.optional(S.String),
    PipelineDescription: S.optional(S.String),
    RoleArn: S.optional(S.String),
    PipelineStatus: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedBy: S.optional(UserContext),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
    PipelineVersionDisplayName: S.optional(S.String),
    PipelineVersionDescription: S.optional(S.String),
  },
  ns,
) {}
export class DescribePipelineDefinitionForExecutionResponse extends S.Class<DescribePipelineDefinitionForExecutionResponse>(
  "DescribePipelineDefinitionForExecutionResponse",
)(
  {
    PipelineDefinition: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class ProcessingS3Input extends S.Class<ProcessingS3Input>(
  "ProcessingS3Input",
)({
  S3Uri: S.String,
  LocalPath: S.optional(S.String),
  S3DataType: S.String,
  S3InputMode: S.optional(S.String),
  S3DataDistributionType: S.optional(S.String),
  S3CompressionType: S.optional(S.String),
}) {}
export class AthenaDatasetDefinition extends S.Class<AthenaDatasetDefinition>(
  "AthenaDatasetDefinition",
)({
  Catalog: S.String,
  Database: S.String,
  QueryString: S.String,
  WorkGroup: S.optional(S.String),
  OutputS3Uri: S.String,
  KmsKeyId: S.optional(S.String),
  OutputFormat: S.String,
  OutputCompression: S.optional(S.String),
}) {}
export class RedshiftDatasetDefinition extends S.Class<RedshiftDatasetDefinition>(
  "RedshiftDatasetDefinition",
)({
  ClusterId: S.String,
  Database: S.String,
  DbUser: S.String,
  QueryString: S.String,
  ClusterRoleArn: S.String,
  OutputS3Uri: S.String,
  KmsKeyId: S.optional(S.String),
  OutputFormat: S.String,
  OutputCompression: S.optional(S.String),
}) {}
export class DatasetDefinition extends S.Class<DatasetDefinition>(
  "DatasetDefinition",
)({
  AthenaDatasetDefinition: S.optional(AthenaDatasetDefinition),
  RedshiftDatasetDefinition: S.optional(RedshiftDatasetDefinition),
  LocalPath: S.optional(S.String),
  DataDistributionType: S.optional(S.String),
  InputMode: S.optional(S.String),
}) {}
export class ProcessingInput extends S.Class<ProcessingInput>(
  "ProcessingInput",
)({
  InputName: S.String,
  AppManaged: S.optional(S.Boolean),
  S3Input: S.optional(ProcessingS3Input),
  DatasetDefinition: S.optional(DatasetDefinition),
}) {}
export const ProcessingInputs = S.Array(ProcessingInput);
export class ProcessingS3Output extends S.Class<ProcessingS3Output>(
  "ProcessingS3Output",
)({
  S3Uri: S.String,
  LocalPath: S.optional(S.String),
  S3UploadMode: S.String,
}) {}
export class ProcessingFeatureStoreOutput extends S.Class<ProcessingFeatureStoreOutput>(
  "ProcessingFeatureStoreOutput",
)({ FeatureGroupName: S.String }) {}
export class ProcessingOutput extends S.Class<ProcessingOutput>(
  "ProcessingOutput",
)({
  OutputName: S.String,
  S3Output: S.optional(ProcessingS3Output),
  FeatureStoreOutput: S.optional(ProcessingFeatureStoreOutput),
  AppManaged: S.optional(S.Boolean),
}) {}
export const ProcessingOutputs = S.Array(ProcessingOutput);
export class ProcessingOutputConfig extends S.Class<ProcessingOutputConfig>(
  "ProcessingOutputConfig",
)({ Outputs: ProcessingOutputs, KmsKeyId: S.optional(S.String) }) {}
export class ProcessingClusterConfig extends S.Class<ProcessingClusterConfig>(
  "ProcessingClusterConfig",
)({
  InstanceCount: S.Number,
  InstanceType: S.String,
  VolumeSizeInGB: S.Number,
  VolumeKmsKeyId: S.optional(S.String),
}) {}
export class ProcessingResources extends S.Class<ProcessingResources>(
  "ProcessingResources",
)({ ClusterConfig: ProcessingClusterConfig }) {}
export class DescribeProcessingJobResponse extends S.Class<DescribeProcessingJobResponse>(
  "DescribeProcessingJobResponse",
)(
  {
    ProcessingInputs: S.optional(ProcessingInputs),
    ProcessingOutputConfig: S.optional(ProcessingOutputConfig),
    ProcessingJobName: S.String,
    ProcessingResources: ProcessingResources,
    StoppingCondition: S.optional(ProcessingStoppingCondition),
    AppSpecification: AppSpecification,
    Environment: S.optional(ProcessingEnvironmentMap),
    NetworkConfig: S.optional(NetworkConfig),
    RoleArn: S.optional(S.String),
    ExperimentConfig: S.optional(ExperimentConfig),
    ProcessingJobArn: S.String,
    ProcessingJobStatus: S.String,
    ExitMessage: S.optional(S.String),
    FailureReason: S.optional(S.String),
    ProcessingEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ProcessingStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MonitoringScheduleArn: S.optional(S.String),
    AutoMLJobArn: S.optional(S.String),
    TrainingJobArn: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSpaceResponse extends S.Class<DescribeSpaceResponse>(
  "DescribeSpaceResponse",
)(
  {
    DomainId: S.optional(S.String),
    SpaceArn: S.optional(S.String),
    SpaceName: S.optional(S.String),
    HomeEfsFileSystemUid: S.optional(S.String),
    Status: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    SpaceSettings: S.optional(SpaceSettings),
    OwnershipSettings: S.optional(OwnershipSettings),
    SpaceSharingSettings: S.optional(SpaceSharingSettings),
    SpaceDisplayName: S.optional(S.String),
    Url: S.optional(S.String),
  },
  ns,
) {}
export class DescribeStudioLifecycleConfigResponse extends S.Class<DescribeStudioLifecycleConfigResponse>(
  "DescribeStudioLifecycleConfigResponse",
)(
  {
    StudioLifecycleConfigArn: S.optional(S.String),
    StudioLifecycleConfigName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StudioLifecycleConfigContent: S.optional(S.String),
    StudioLifecycleConfigAppType: S.optional(S.String),
  },
  ns,
) {}
export class TransformS3DataSource extends S.Class<TransformS3DataSource>(
  "TransformS3DataSource",
)({ S3DataType: S.String, S3Uri: S.String }) {}
export class TransformDataSource extends S.Class<TransformDataSource>(
  "TransformDataSource",
)({ S3DataSource: TransformS3DataSource }) {}
export class TransformInput extends S.Class<TransformInput>("TransformInput")({
  DataSource: TransformDataSource,
  ContentType: S.optional(S.String),
  CompressionType: S.optional(S.String),
  SplitType: S.optional(S.String),
}) {}
export class DescribeTransformJobResponse extends S.Class<DescribeTransformJobResponse>(
  "DescribeTransformJobResponse",
)(
  {
    TransformJobName: S.String,
    TransformJobArn: S.String,
    TransformJobStatus: S.String,
    FailureReason: S.optional(S.String),
    ModelName: S.String,
    MaxConcurrentTransforms: S.optional(S.Number),
    ModelClientConfig: S.optional(ModelClientConfig),
    MaxPayloadInMB: S.optional(S.Number),
    BatchStrategy: S.optional(S.String),
    Environment: S.optional(TransformEnvironmentMap),
    TransformInput: TransformInput,
    TransformOutput: S.optional(TransformOutput),
    DataCaptureConfig: S.optional(BatchDataCaptureConfig),
    TransformResources: TransformResources,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TransformStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TransformEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LabelingJobArn: S.optional(S.String),
    AutoMLJobArn: S.optional(S.String),
    DataProcessing: S.optional(DataProcessing),
    ExperimentConfig: S.optional(ExperimentConfig),
  },
  ns,
) {}
export class DescribeUserProfileResponse extends S.Class<DescribeUserProfileResponse>(
  "DescribeUserProfileResponse",
)(
  {
    DomainId: S.optional(S.String),
    UserProfileArn: S.optional(S.String),
    UserProfileName: S.optional(S.String),
    HomeEfsFileSystemUid: S.optional(S.String),
    Status: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
    SingleSignOnUserIdentifier: S.optional(S.String),
    SingleSignOnUserValue: S.optional(S.String),
    UserSettings: S.optional(UserSettings),
  },
  ns,
) {}
export class DetachClusterNodeVolumeResponse extends S.Class<DetachClusterNodeVolumeResponse>(
  "DetachClusterNodeVolumeResponse",
)(
  {
    ClusterArn: S.String,
    NodeId: S.String,
    VolumeId: S.String,
    AttachTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Status: S.String,
    DeviceName: S.String,
  },
  ns,
) {}
export class DisassociateTrialComponentResponse extends S.Class<DisassociateTrialComponentResponse>(
  "DisassociateTrialComponentResponse",
)(
  { TrialComponentArn: S.optional(S.String), TrialArn: S.optional(S.String) },
  ns,
) {}
export class GetLineageGroupPolicyResponse extends S.Class<GetLineageGroupPolicyResponse>(
  "GetLineageGroupPolicyResponse",
)(
  {
    LineageGroupArn: S.optional(S.String),
    ResourcePolicy: S.optional(S.String),
  },
  ns,
) {}
export class GetModelPackageGroupPolicyOutput extends S.Class<GetModelPackageGroupPolicyOutput>(
  "GetModelPackageGroupPolicyOutput",
)({ ResourcePolicy: S.String }, ns) {}
export class GetScalingConfigurationRecommendationRequest extends S.Class<GetScalingConfigurationRecommendationRequest>(
  "GetScalingConfigurationRecommendationRequest",
)(
  {
    InferenceRecommendationsJobName: S.String,
    RecommendationId: S.optional(S.String),
    EndpointName: S.optional(S.String),
    TargetCpuUtilizationPerCore: S.optional(S.Number),
    ScalingPolicyObjective: S.optional(ScalingPolicyObjective),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportHubContentResponse extends S.Class<ImportHubContentResponse>(
  "ImportHubContentResponse",
)({ HubArn: S.String, HubContentArn: S.String }, ns) {}
export class ListAliasesResponse extends S.Class<ListAliasesResponse>(
  "ListAliasesResponse",
)(
  {
    SageMakerImageVersionAliases: S.optional(SageMakerImageVersionAliases),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListCandidatesForAutoMLJobResponse extends S.Class<ListCandidatesForAutoMLJobResponse>(
  "ListCandidatesForAutoMLJobResponse",
)({ Candidates: AutoMLCandidates, NextToken: S.optional(S.String) }, ns) {}
export class HubContentInfo extends S.Class<HubContentInfo>("HubContentInfo")({
  HubContentName: S.String,
  HubContentArn: S.String,
  SageMakerPublicHubContentArn: S.optional(S.String),
  HubContentVersion: S.String,
  HubContentType: S.String,
  DocumentSchemaVersion: S.String,
  HubContentDisplayName: S.optional(S.String),
  HubContentDescription: S.optional(S.String),
  SupportStatus: S.optional(S.String),
  HubContentSearchKeywords: S.optional(HubContentSearchKeywordList),
  HubContentStatus: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  OriginalCreationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const HubContentInfoList = S.Array(HubContentInfo);
export class ListHubContentVersionsResponse extends S.Class<ListHubContentVersionsResponse>(
  "ListHubContentVersionsResponse",
)(
  { HubContentSummaries: HubContentInfoList, NextToken: S.optional(S.String) },
  ns,
) {}
export class MonitoringJobDefinitionSummary extends S.Class<MonitoringJobDefinitionSummary>(
  "MonitoringJobDefinitionSummary",
)({
  MonitoringJobDefinitionName: S.String,
  MonitoringJobDefinitionArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndpointName: S.String,
}) {}
export const MonitoringJobDefinitionSummaryList = S.Array(
  MonitoringJobDefinitionSummary,
);
export class ListModelBiasJobDefinitionsResponse extends S.Class<ListModelBiasJobDefinitionsResponse>(
  "ListModelBiasJobDefinitionsResponse",
)(
  {
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelExplainabilityJobDefinitionsResponse extends S.Class<ListModelExplainabilityJobDefinitionsResponse>(
  "ListModelExplainabilityJobDefinitionsResponse",
)(
  {
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelQualityJobDefinitionsResponse extends S.Class<ListModelQualityJobDefinitionsResponse>(
  "ListModelQualityJobDefinitionsResponse",
)(
  {
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMonitoringExecutionsResponse extends S.Class<ListMonitoringExecutionsResponse>(
  "ListMonitoringExecutionsResponse",
)(
  {
    MonitoringExecutionSummaries: MonitoringExecutionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPipelineParametersForExecutionResponse extends S.Class<ListPipelineParametersForExecutionResponse>(
  "ListPipelineParametersForExecutionResponse",
)(
  {
    PipelineParameters: S.optional(ParameterList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSubscribedWorkteamsResponse extends S.Class<ListSubscribedWorkteamsResponse>(
  "ListSubscribedWorkteamsResponse",
)(
  { SubscribedWorkteams: SubscribedWorkteams, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListTagsOutput extends S.Class<ListTagsOutput>("ListTagsOutput")(
  { Tags: S.optional(TagList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListTrainingJobsForHyperParameterTuningJobResponse extends S.Class<ListTrainingJobsForHyperParameterTuningJobResponse>(
  "ListTrainingJobsForHyperParameterTuningJobResponse",
)(
  {
    TrainingJobSummaries: HyperParameterTrainingJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTrainingPlansRequest extends S.Class<ListTrainingPlansRequest>(
  "ListTrainingPlansRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StartTimeAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTimeBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    Filters: S.optional(TrainingPlanFilters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkforcesResponse extends S.Class<ListWorkforcesResponse>(
  "ListWorkforcesResponse",
)({ Workforces: Workforces, NextToken: S.optional(S.String) }, ns) {}
export class ListWorkteamsResponse extends S.Class<ListWorkteamsResponse>(
  "ListWorkteamsResponse",
)({ Workteams: Workteams, NextToken: S.optional(S.String) }, ns) {}
export class PutModelPackageGroupPolicyOutput extends S.Class<PutModelPackageGroupPolicyOutput>(
  "PutModelPackageGroupPolicyOutput",
)({ ModelPackageGroupArn: S.String }, ns) {}
export class RegisterDevicesRequest extends S.Class<RegisterDevicesRequest>(
  "RegisterDevicesRequest",
)(
  { DeviceFleetName: S.String, Devices: Devices, Tags: S.optional(TagList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterDevicesResponse extends S.Class<RegisterDevicesResponse>(
  "RegisterDevicesResponse",
)({}, ns) {}
export class RenderUiTemplateRequest extends S.Class<RenderUiTemplateRequest>(
  "RenderUiTemplateRequest",
)(
  {
    UiTemplate: S.optional(UiTemplate),
    Task: RenderableTask,
    RoleArn: S.String,
    HumanTaskUiArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetryPipelineExecutionResponse extends S.Class<RetryPipelineExecutionResponse>(
  "RetryPipelineExecutionResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class SendPipelineExecutionStepFailureResponse extends S.Class<SendPipelineExecutionStepFailureResponse>(
  "SendPipelineExecutionStepFailureResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class SendPipelineExecutionStepSuccessRequest extends S.Class<SendPipelineExecutionStepSuccessRequest>(
  "SendPipelineExecutionStepSuccessRequest",
)(
  {
    CallbackToken: S.String,
    OutputParameters: S.optional(OutputParameterList),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartInferenceExperimentResponse extends S.Class<StartInferenceExperimentResponse>(
  "StartInferenceExperimentResponse",
)({ InferenceExperimentArn: S.String }, ns) {}
export class StartMlflowTrackingServerResponse extends S.Class<StartMlflowTrackingServerResponse>(
  "StartMlflowTrackingServerResponse",
)({ TrackingServerArn: S.optional(S.String) }, ns) {}
export class StartSessionResponse extends S.Class<StartSessionResponse>(
  "StartSessionResponse",
)(
  {
    SessionId: S.optional(S.String),
    StreamUrl: S.optional(S.String),
    TokenValue: S.optional(S.String),
  },
  ns,
) {}
export class StopInferenceExperimentRequest extends S.Class<StopInferenceExperimentRequest>(
  "StopInferenceExperimentRequest",
)(
  {
    Name: S.String,
    ModelVariantActions: ModelVariantActionMap,
    DesiredModelVariants: S.optional(ModelVariantConfigList),
    DesiredState: S.optional(S.String),
    Reason: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopMlflowTrackingServerResponse extends S.Class<StopMlflowTrackingServerResponse>(
  "StopMlflowTrackingServerResponse",
)({ TrackingServerArn: S.optional(S.String) }, ns) {}
export class StopPipelineExecutionResponse extends S.Class<StopPipelineExecutionResponse>(
  "StopPipelineExecutionResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class UpdateActionResponse extends S.Class<UpdateActionResponse>(
  "UpdateActionResponse",
)({ ActionArn: S.optional(S.String) }, ns) {}
export class UpdateAppImageConfigResponse extends S.Class<UpdateAppImageConfigResponse>(
  "UpdateAppImageConfigResponse",
)({ AppImageConfigArn: S.optional(S.String) }, ns) {}
export class UpdateArtifactResponse extends S.Class<UpdateArtifactResponse>(
  "UpdateArtifactResponse",
)({ ArtifactArn: S.optional(S.String) }, ns) {}
export class UpdateClusterResponse extends S.Class<UpdateClusterResponse>(
  "UpdateClusterResponse",
)({ ClusterArn: S.String }, ns) {}
export class UpdateClusterSchedulerConfigResponse extends S.Class<UpdateClusterSchedulerConfigResponse>(
  "UpdateClusterSchedulerConfigResponse",
)(
  {
    ClusterSchedulerConfigArn: S.String,
    ClusterSchedulerConfigVersion: S.Number,
  },
  ns,
) {}
export class UpdateCodeRepositoryInput extends S.Class<UpdateCodeRepositoryInput>(
  "UpdateCodeRepositoryInput",
)(
  { CodeRepositoryName: S.String, GitConfig: S.optional(GitConfigForUpdate) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComputeQuotaResponse extends S.Class<UpdateComputeQuotaResponse>(
  "UpdateComputeQuotaResponse",
)({ ComputeQuotaArn: S.String, ComputeQuotaVersion: S.Number }, ns) {}
export class UpdateContextResponse extends S.Class<UpdateContextResponse>(
  "UpdateContextResponse",
)({ ContextArn: S.optional(S.String) }, ns) {}
export class CapacitySize extends S.Class<CapacitySize>("CapacitySize")({
  Type: S.String,
  Value: S.Number,
}) {}
export class TrafficRoutingConfig extends S.Class<TrafficRoutingConfig>(
  "TrafficRoutingConfig",
)({
  Type: S.String,
  WaitIntervalInSeconds: S.Number,
  CanarySize: S.optional(CapacitySize),
  LinearStepSize: S.optional(CapacitySize),
}) {}
export class BlueGreenUpdatePolicy extends S.Class<BlueGreenUpdatePolicy>(
  "BlueGreenUpdatePolicy",
)({
  TrafficRoutingConfiguration: TrafficRoutingConfig,
  TerminationWaitInSeconds: S.optional(S.Number),
  MaximumExecutionTimeoutInSeconds: S.optional(S.Number),
}) {}
export class RollingUpdatePolicy extends S.Class<RollingUpdatePolicy>(
  "RollingUpdatePolicy",
)({
  MaximumBatchSize: CapacitySize,
  WaitIntervalInSeconds: S.Number,
  MaximumExecutionTimeoutInSeconds: S.optional(S.Number),
  RollbackMaximumBatchSize: S.optional(CapacitySize),
}) {}
export class Alarm extends S.Class<Alarm>("Alarm")({
  AlarmName: S.optional(S.String),
}) {}
export const AlarmList = S.Array(Alarm);
export class AutoRollbackConfig extends S.Class<AutoRollbackConfig>(
  "AutoRollbackConfig",
)({ Alarms: S.optional(AlarmList) }) {}
export class DeploymentConfig extends S.Class<DeploymentConfig>(
  "DeploymentConfig",
)({
  BlueGreenUpdatePolicy: S.optional(BlueGreenUpdatePolicy),
  RollingUpdatePolicy: S.optional(RollingUpdatePolicy),
  AutoRollbackConfiguration: S.optional(AutoRollbackConfig),
}) {}
export class UpdateEndpointInput extends S.Class<UpdateEndpointInput>(
  "UpdateEndpointInput",
)(
  {
    EndpointName: S.String,
    EndpointConfigName: S.String,
    RetainAllVariantProperties: S.optional(S.Boolean),
    ExcludeRetainedVariantProperties: S.optional(VariantPropertyList),
    DeploymentConfig: S.optional(DeploymentConfig),
    RetainDeploymentConfig: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateExperimentResponse extends S.Class<UpdateExperimentResponse>(
  "UpdateExperimentResponse",
)({ ExperimentArn: S.optional(S.String) }, ns) {}
export class UpdateFeatureGroupRequest extends S.Class<UpdateFeatureGroupRequest>(
  "UpdateFeatureGroupRequest",
)(
  {
    FeatureGroupName: S.String,
    FeatureAdditions: S.optional(FeatureAdditions),
    OnlineStoreConfig: S.optional(OnlineStoreConfigUpdate),
    ThroughputConfig: S.optional(ThroughputConfigUpdate),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFeatureMetadataRequest extends S.Class<UpdateFeatureMetadataRequest>(
  "UpdateFeatureMetadataRequest",
)(
  {
    FeatureGroupName: S.String,
    FeatureName: S.String,
    Description: S.optional(S.String),
    ParameterAdditions: S.optional(FeatureParameterAdditions),
    ParameterRemovals: S.optional(FeatureParameterRemovals),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFeatureMetadataResponse extends S.Class<UpdateFeatureMetadataResponse>(
  "UpdateFeatureMetadataResponse",
)({}, ns) {}
export class UpdateHubResponse extends S.Class<UpdateHubResponse>(
  "UpdateHubResponse",
)({ HubArn: S.String }, ns) {}
export class UpdateHubContentResponse extends S.Class<UpdateHubContentResponse>(
  "UpdateHubContentResponse",
)({ HubArn: S.String, HubContentArn: S.String }, ns) {}
export class UpdateHubContentReferenceResponse extends S.Class<UpdateHubContentReferenceResponse>(
  "UpdateHubContentReferenceResponse",
)({ HubArn: S.String, HubContentArn: S.String }, ns) {}
export class UpdateImageResponse extends S.Class<UpdateImageResponse>(
  "UpdateImageResponse",
)({ ImageArn: S.optional(S.String) }, ns) {}
export class UpdateImageVersionResponse extends S.Class<UpdateImageVersionResponse>(
  "UpdateImageVersionResponse",
)({ ImageVersionArn: S.optional(S.String) }, ns) {}
export class UpdateInferenceComponentRuntimeConfigOutput extends S.Class<UpdateInferenceComponentRuntimeConfigOutput>(
  "UpdateInferenceComponentRuntimeConfigOutput",
)({ InferenceComponentArn: S.String }, ns) {}
export class UpdateInferenceExperimentResponse extends S.Class<UpdateInferenceExperimentResponse>(
  "UpdateInferenceExperimentResponse",
)({ InferenceExperimentArn: S.String }, ns) {}
export class UpdateMlflowAppResponse extends S.Class<UpdateMlflowAppResponse>(
  "UpdateMlflowAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class UpdateMlflowTrackingServerResponse extends S.Class<UpdateMlflowTrackingServerResponse>(
  "UpdateMlflowTrackingServerResponse",
)({ TrackingServerArn: S.optional(S.String) }, ns) {}
export class UpdateModelCardResponse extends S.Class<UpdateModelCardResponse>(
  "UpdateModelCardResponse",
)({ ModelCardArn: S.String }, ns) {}
export class UpdateModelPackageOutput extends S.Class<UpdateModelPackageOutput>(
  "UpdateModelPackageOutput",
)({ ModelPackageArn: S.String }, ns) {}
export class UpdateMonitoringAlertResponse extends S.Class<UpdateMonitoringAlertResponse>(
  "UpdateMonitoringAlertResponse",
)(
  {
    MonitoringScheduleArn: S.String,
    MonitoringAlertName: S.optional(S.String),
  },
  ns,
) {}
export class UpdateMonitoringScheduleResponse extends S.Class<UpdateMonitoringScheduleResponse>(
  "UpdateMonitoringScheduleResponse",
)({ MonitoringScheduleArn: S.String }, ns) {}
export class UpdatePartnerAppResponse extends S.Class<UpdatePartnerAppResponse>(
  "UpdatePartnerAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class UpdatePipelineResponse extends S.Class<UpdatePipelineResponse>(
  "UpdatePipelineResponse",
)(
  {
    PipelineArn: S.optional(S.String),
    PipelineVersionId: S.optional(S.Number),
  },
  ns,
) {}
export class UpdatePipelineExecutionResponse extends S.Class<UpdatePipelineExecutionResponse>(
  "UpdatePipelineExecutionResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class UpdatePipelineVersionResponse extends S.Class<UpdatePipelineVersionResponse>(
  "UpdatePipelineVersionResponse",
)(
  {
    PipelineArn: S.optional(S.String),
    PipelineVersionId: S.optional(S.Number),
  },
  ns,
) {}
export class UpdateSpaceResponse extends S.Class<UpdateSpaceResponse>(
  "UpdateSpaceResponse",
)({ SpaceArn: S.optional(S.String) }, ns) {}
export class UpdateTrainingJobRequest extends S.Class<UpdateTrainingJobRequest>(
  "UpdateTrainingJobRequest",
)(
  {
    TrainingJobName: S.String,
    ProfilerConfig: S.optional(ProfilerConfigForUpdate),
    ProfilerRuleConfigurations: S.optional(ProfilerRuleConfigurations),
    ResourceConfig: S.optional(ResourceConfigForUpdate),
    RemoteDebugConfig: S.optional(RemoteDebugConfigForUpdate),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTrialResponse extends S.Class<UpdateTrialResponse>(
  "UpdateTrialResponse",
)({ TrialArn: S.optional(S.String) }, ns) {}
export class UpdateTrialComponentResponse extends S.Class<UpdateTrialComponentResponse>(
  "UpdateTrialComponentResponse",
)({ TrialComponentArn: S.optional(S.String) }, ns) {}
export class UpdateUserProfileResponse extends S.Class<UpdateUserProfileResponse>(
  "UpdateUserProfileResponse",
)({ UserProfileArn: S.optional(S.String) }, ns) {}
export class UpdateWorkforceResponse extends S.Class<UpdateWorkforceResponse>(
  "UpdateWorkforceResponse",
)({ Workforce: Workforce }, ns) {}
export class UpdateWorkteamResponse extends S.Class<UpdateWorkteamResponse>(
  "UpdateWorkteamResponse",
)({ Workteam: Workteam }, ns) {}
export class ChannelSpecification extends S.Class<ChannelSpecification>(
  "ChannelSpecification",
)({
  Name: S.String,
  Description: S.optional(S.String),
  IsRequired: S.optional(S.Boolean),
  SupportedContentTypes: ContentTypes,
  SupportedCompressionTypes: S.optional(CompressionTypes),
  SupportedInputModes: InputModes,
}) {}
export const ChannelSpecifications = S.Array(ChannelSpecification);
export const HyperParameterTuningJobObjectives = S.Array(
  HyperParameterTuningJobObjective,
);
export class AutoMLJobCompletionCriteria extends S.Class<AutoMLJobCompletionCriteria>(
  "AutoMLJobCompletionCriteria",
)({
  MaxCandidates: S.optional(S.Number),
  MaxRuntimePerTrainingJobInSeconds: S.optional(S.Number),
  MaxAutoMLJobRuntimeInSeconds: S.optional(S.Number),
}) {}
export class ImageClassificationJobConfig extends S.Class<ImageClassificationJobConfig>(
  "ImageClassificationJobConfig",
)({ CompletionCriteria: S.optional(AutoMLJobCompletionCriteria) }) {}
export class TextClassificationJobConfig extends S.Class<TextClassificationJobConfig>(
  "TextClassificationJobConfig",
)({
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  ContentColumn: S.String,
  TargetLabelColumn: S.String,
}) {}
export const AutoMLAlgorithms = S.Array(S.String);
export class AutoMLAlgorithmConfig extends S.Class<AutoMLAlgorithmConfig>(
  "AutoMLAlgorithmConfig",
)({ AutoMLAlgorithms: AutoMLAlgorithms }) {}
export const AutoMLAlgorithmsConfig = S.Array(AutoMLAlgorithmConfig);
export class CandidateGenerationConfig extends S.Class<CandidateGenerationConfig>(
  "CandidateGenerationConfig",
)({ AlgorithmsConfig: S.optional(AutoMLAlgorithmsConfig) }) {}
export class TabularJobConfig extends S.Class<TabularJobConfig>(
  "TabularJobConfig",
)({
  CandidateGenerationConfig: S.optional(CandidateGenerationConfig),
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  FeatureSpecificationS3Uri: S.optional(S.String),
  Mode: S.optional(S.String),
  GenerateCandidateDefinitionsOnly: S.optional(S.Boolean),
  ProblemType: S.optional(S.String),
  TargetAttributeName: S.String,
  SampleWeightAttributeName: S.optional(S.String),
}) {}
export class EmrServerlessComputeConfig extends S.Class<EmrServerlessComputeConfig>(
  "EmrServerlessComputeConfig",
)({ ExecutionRoleARN: S.String }) {}
export class ClusterOrchestratorEksConfig extends S.Class<ClusterOrchestratorEksConfig>(
  "ClusterOrchestratorEksConfig",
)({ ClusterArn: S.String }) {}
export class TargetPlatform extends S.Class<TargetPlatform>("TargetPlatform")({
  Os: S.String,
  Arch: S.String,
  Accelerator: S.optional(S.String),
}) {}
export class OnlineStoreSecurityConfig extends S.Class<OnlineStoreSecurityConfig>(
  "OnlineStoreSecurityConfig",
)({ KmsKeyId: S.optional(S.String) }) {}
export class S3StorageConfig extends S.Class<S3StorageConfig>(
  "S3StorageConfig",
)({
  S3Uri: S.String,
  KmsKeyId: S.optional(S.String),
  ResolvedOutputS3Uri: S.optional(S.String),
}) {}
export class DataCatalogConfig extends S.Class<DataCatalogConfig>(
  "DataCatalogConfig",
)({ TableName: S.String, Catalog: S.String, Database: S.String }) {}
export class ResourceLimits extends S.Class<ResourceLimits>("ResourceLimits")({
  MaxNumberOfTrainingJobs: S.optional(S.Number),
  MaxParallelTrainingJobs: S.Number,
  MaxRuntimeInSeconds: S.optional(S.Number),
}) {}
export class ParentHyperParameterTuningJob extends S.Class<ParentHyperParameterTuningJob>(
  "ParentHyperParameterTuningJob",
)({ HyperParameterTuningJobName: S.optional(S.String) }) {}
export const ParentHyperParameterTuningJobs = S.Array(
  ParentHyperParameterTuningJob,
);
export class InferenceComponentContainerSpecification extends S.Class<InferenceComponentContainerSpecification>(
  "InferenceComponentContainerSpecification",
)({
  Image: S.optional(S.String),
  ArtifactUrl: S.optional(S.String),
  Environment: S.optional(EnvironmentMap),
}) {}
export class InferenceComponentStartupParameters extends S.Class<InferenceComponentStartupParameters>(
  "InferenceComponentStartupParameters",
)({
  ModelDataDownloadTimeoutInSeconds: S.optional(S.Number),
  ContainerStartupHealthCheckTimeoutInSeconds: S.optional(S.Number),
}) {}
export class InferenceComponentComputeResourceRequirements extends S.Class<InferenceComponentComputeResourceRequirements>(
  "InferenceComponentComputeResourceRequirements",
)({
  NumberOfCpuCoresRequired: S.optional(S.Number),
  NumberOfAcceleratorDevicesRequired: S.optional(S.Number),
  MinMemoryRequiredInMb: S.Number,
  MaxMemoryRequiredInMb: S.optional(S.Number),
}) {}
export class InferenceComponentDataCacheConfig extends S.Class<InferenceComponentDataCacheConfig>(
  "InferenceComponentDataCacheConfig",
)({ EnableCaching: S.Boolean }) {}
export class RecommendationJobResourceLimit extends S.Class<RecommendationJobResourceLimit>(
  "RecommendationJobResourceLimit",
)({
  MaxNumberOfTests: S.optional(S.Number),
  MaxParallelOfTests: S.optional(S.Number),
}) {}
export class EndpointInfo extends S.Class<EndpointInfo>("EndpointInfo")({
  EndpointName: S.optional(S.String),
}) {}
export const Endpoints = S.Array(EndpointInfo);
export class RecommendationJobVpcConfig extends S.Class<RecommendationJobVpcConfig>(
  "RecommendationJobVpcConfig",
)({
  SecurityGroupIds: RecommendationJobVpcSecurityGroupIds,
  Subnets: RecommendationJobVpcSubnets,
}) {}
export class ModelLatencyThreshold extends S.Class<ModelLatencyThreshold>(
  "ModelLatencyThreshold",
)({
  Percentile: S.optional(S.String),
  ValueInMilliseconds: S.optional(S.Number),
}) {}
export const ModelLatencyThresholds = S.Array(ModelLatencyThreshold);
export class RecommendationJobCompiledOutputConfig extends S.Class<RecommendationJobCompiledOutputConfig>(
  "RecommendationJobCompiledOutputConfig",
)({ S3OutputUri: S.optional(S.String) }) {}
export class LabelingJobDataAttributes extends S.Class<LabelingJobDataAttributes>(
  "LabelingJobDataAttributes",
)({ ContentClassifiers: S.optional(ContentClassifiers) }) {}
export class LabelingJobResourceConfig extends S.Class<LabelingJobResourceConfig>(
  "LabelingJobResourceConfig",
)({ VolumeKmsKeyId: S.optional(S.String), VpcConfig: S.optional(VpcConfig) }) {}
export class UiConfig extends S.Class<UiConfig>("UiConfig")({
  UiTemplateS3Uri: S.optional(S.String),
  HumanTaskUiArn: S.optional(S.String),
}) {}
export class AnnotationConsolidationConfig extends S.Class<AnnotationConsolidationConfig>(
  "AnnotationConsolidationConfig",
)({ AnnotationConsolidationLambdaArn: S.String }) {}
export class TransformJobDefinition extends S.Class<TransformJobDefinition>(
  "TransformJobDefinition",
)({
  MaxConcurrentTransforms: S.optional(S.Number),
  MaxPayloadInMB: S.optional(S.Number),
  BatchStrategy: S.optional(S.String),
  Environment: S.optional(TransformEnvironmentMap),
  TransformInput: TransformInput,
  TransformOutput: TransformOutput,
  TransformResources: TransformResources,
}) {}
export class ModelPackageValidationProfile extends S.Class<ModelPackageValidationProfile>(
  "ModelPackageValidationProfile",
)({ ProfileName: S.String, TransformJobDefinition: TransformJobDefinition }) {}
export const ModelPackageValidationProfiles = S.Array(
  ModelPackageValidationProfile,
);
export class SourceAlgorithm extends S.Class<SourceAlgorithm>(
  "SourceAlgorithm",
)({
  ModelDataUrl: S.optional(S.String),
  ModelDataSource: S.optional(ModelDataSource),
  ModelDataETag: S.optional(S.String),
  AlgorithmName: S.String,
}) {}
export const SourceAlgorithmList = S.Array(SourceAlgorithm);
export class MetricsSource extends S.Class<MetricsSource>("MetricsSource")({
  ContentType: S.String,
  ContentDigest: S.optional(S.String),
  S3Uri: S.String,
}) {}
export class ModelDataQuality extends S.Class<ModelDataQuality>(
  "ModelDataQuality",
)({
  Statistics: S.optional(MetricsSource),
  Constraints: S.optional(MetricsSource),
}) {}
export class Bias extends S.Class<Bias>("Bias")({
  Report: S.optional(MetricsSource),
  PreTrainingReport: S.optional(MetricsSource),
  PostTrainingReport: S.optional(MetricsSource),
}) {}
export class Explainability extends S.Class<Explainability>("Explainability")({
  Report: S.optional(MetricsSource),
}) {}
export class FileSource extends S.Class<FileSource>("FileSource")({
  ContentType: S.optional(S.String),
  ContentDigest: S.optional(S.String),
  S3Uri: S.String,
}) {}
export class DriftCheckExplainability extends S.Class<DriftCheckExplainability>(
  "DriftCheckExplainability",
)({
  Constraints: S.optional(MetricsSource),
  ConfigFile: S.optional(FileSource),
}) {}
export class DriftCheckModelQuality extends S.Class<DriftCheckModelQuality>(
  "DriftCheckModelQuality",
)({
  Statistics: S.optional(MetricsSource),
  Constraints: S.optional(MetricsSource),
}) {}
export class DriftCheckModelDataQuality extends S.Class<DriftCheckModelDataQuality>(
  "DriftCheckModelDataQuality",
)({
  Statistics: S.optional(MetricsSource),
  Constraints: S.optional(MetricsSource),
}) {}
export class ModelQuantizationConfig extends S.Class<ModelQuantizationConfig>(
  "ModelQuantizationConfig",
)({
  Image: S.optional(S.String),
  OverrideEnvironment: S.optional(OptimizationJobEnvironmentVariables),
}) {}
export class ModelCompilationConfig extends S.Class<ModelCompilationConfig>(
  "ModelCompilationConfig",
)({
  Image: S.optional(S.String),
  OverrideEnvironment: S.optional(OptimizationJobEnvironmentVariables),
}) {}
export class ModelShardingConfig extends S.Class<ModelShardingConfig>(
  "ModelShardingConfig",
)({
  Image: S.optional(S.String),
  OverrideEnvironment: S.optional(OptimizationJobEnvironmentVariables),
}) {}
export const HookParameters = S.Record({ key: S.String, value: S.String });
export const ReleaseNotesList = S.Array(S.String);
export class PropertyNameQuery extends S.Class<PropertyNameQuery>(
  "PropertyNameQuery",
)({ PropertyNameHint: S.String }) {}
export const TrainingPlanArns = S.Array(S.String);
export class ModelMetadataFilter extends S.Class<ModelMetadataFilter>(
  "ModelMetadataFilter",
)({ Name: S.String, Value: S.String }) {}
export const ModelMetadataFilters = S.Array(ModelMetadataFilter);
export const OptimizationTypes = S.Array(S.String);
export const QueryProperties = S.Record({ key: S.String, value: S.String });
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Operator: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const FilterList = S.Array(Filter);
export class NestedFilters extends S.Class<NestedFilters>("NestedFilters")({
  NestedPropertyName: S.String,
  Filters: FilterList,
}) {}
export const NestedFiltersList = S.Array(NestedFilters);
export class SelectedStep extends S.Class<SelectedStep>("SelectedStep")({
  StepName: S.String,
}) {}
export const SelectedStepList = S.Array(SelectedStep);
export class RStudioServerProDomainSettingsForUpdate extends S.Class<RStudioServerProDomainSettingsForUpdate>(
  "RStudioServerProDomainSettingsForUpdate",
)({
  DomainExecutionRoleArn: S.String,
  DefaultResourceSpec: S.optional(ResourceSpec),
  RStudioConnectUrl: S.optional(S.String),
  RStudioPackageManagerUrl: S.optional(S.String),
}) {}
export class ProductionVariantServerlessUpdateConfig extends S.Class<ProductionVariantServerlessUpdateConfig>(
  "ProductionVariantServerlessUpdateConfig",
)({
  MaxConcurrency: S.optional(S.Number),
  ProvisionedConcurrency: S.optional(S.Number),
}) {}
export const GroupingAttributeNames = S.Array(S.String);
export const RecommendationJobSupportedContentTypes = S.Array(S.String);
export class BatchDeleteClusterNodesError extends S.Class<BatchDeleteClusterNodesError>(
  "BatchDeleteClusterNodesError",
)({ Code: S.String, Message: S.String, NodeId: S.String }) {}
export const BatchDeleteClusterNodesErrorList = S.Array(
  BatchDeleteClusterNodesError,
);
export class BatchDeleteClusterNodeLogicalIdsError extends S.Class<BatchDeleteClusterNodeLogicalIdsError>(
  "BatchDeleteClusterNodeLogicalIdsError",
)({ Code: S.String, Message: S.String, NodeLogicalId: S.String }) {}
export const BatchDeleteClusterNodeLogicalIdsErrorList = S.Array(
  BatchDeleteClusterNodeLogicalIdsError,
);
export class BatchRebootClusterNodesError extends S.Class<BatchRebootClusterNodesError>(
  "BatchRebootClusterNodesError",
)({ NodeId: S.String, ErrorCode: S.String, Message: S.String }) {}
export const BatchRebootClusterNodesErrors = S.Array(
  BatchRebootClusterNodesError,
);
export class BatchRebootClusterNodeLogicalIdsError extends S.Class<BatchRebootClusterNodeLogicalIdsError>(
  "BatchRebootClusterNodeLogicalIdsError",
)({ NodeLogicalId: S.String, ErrorCode: S.String, Message: S.String }) {}
export const BatchRebootClusterNodeLogicalIdsErrors = S.Array(
  BatchRebootClusterNodeLogicalIdsError,
);
export class BatchReplaceClusterNodesError extends S.Class<BatchReplaceClusterNodesError>(
  "BatchReplaceClusterNodesError",
)({ NodeId: S.String, ErrorCode: S.String, Message: S.String }) {}
export const BatchReplaceClusterNodesErrors = S.Array(
  BatchReplaceClusterNodesError,
);
export class BatchReplaceClusterNodeLogicalIdsError extends S.Class<BatchReplaceClusterNodeLogicalIdsError>(
  "BatchReplaceClusterNodeLogicalIdsError",
)({ NodeLogicalId: S.String, ErrorCode: S.String, Message: S.String }) {}
export const BatchReplaceClusterNodeLogicalIdsErrors = S.Array(
  BatchReplaceClusterNodeLogicalIdsError,
);
export class AutoMLComputeConfig extends S.Class<AutoMLComputeConfig>(
  "AutoMLComputeConfig",
)({ EmrServerlessComputeConfig: S.optional(EmrServerlessComputeConfig) }) {}
export class ClusterOrchestrator extends S.Class<ClusterOrchestrator>(
  "ClusterOrchestrator",
)({ Eks: S.optional(ClusterOrchestratorEksConfig) }) {}
export class OutputConfig extends S.Class<OutputConfig>("OutputConfig")({
  S3OutputLocation: S.String,
  TargetDevice: S.optional(S.String),
  TargetPlatform: S.optional(TargetPlatform),
  CompilerOptions: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class OnlineStoreConfig extends S.Class<OnlineStoreConfig>(
  "OnlineStoreConfig",
)({
  SecurityConfig: S.optional(OnlineStoreSecurityConfig),
  EnableOnlineStore: S.optional(S.Boolean),
  TtlDuration: S.optional(TtlDuration),
  StorageType: S.optional(S.String),
}) {}
export class OfflineStoreConfig extends S.Class<OfflineStoreConfig>(
  "OfflineStoreConfig",
)({
  S3StorageConfig: S3StorageConfig,
  DisableGlueTableCreation: S.optional(S.Boolean),
  DataCatalogConfig: S.optional(DataCatalogConfig),
  TableFormat: S.optional(S.String),
}) {}
export class HyperParameterTuningJobWarmStartConfig extends S.Class<HyperParameterTuningJobWarmStartConfig>(
  "HyperParameterTuningJobWarmStartConfig",
)({
  ParentHyperParameterTuningJobs: ParentHyperParameterTuningJobs,
  WarmStartType: S.String,
}) {}
export class InferenceComponentSpecification extends S.Class<InferenceComponentSpecification>(
  "InferenceComponentSpecification",
)({
  ModelName: S.optional(S.String),
  Container: S.optional(InferenceComponentContainerSpecification),
  StartupParameters: S.optional(InferenceComponentStartupParameters),
  ComputeResourceRequirements: S.optional(
    InferenceComponentComputeResourceRequirements,
  ),
  BaseInferenceComponentName: S.optional(S.String),
  DataCacheConfig: S.optional(InferenceComponentDataCacheConfig),
}) {}
export class RecommendationJobStoppingConditions extends S.Class<RecommendationJobStoppingConditions>(
  "RecommendationJobStoppingConditions",
)({
  MaxInvocations: S.optional(S.Number),
  ModelLatencyThresholds: S.optional(ModelLatencyThresholds),
  FlatInvocations: S.optional(S.String),
}) {}
export class RecommendationJobOutputConfig extends S.Class<RecommendationJobOutputConfig>(
  "RecommendationJobOutputConfig",
)({
  KmsKeyId: S.optional(S.String),
  CompiledOutputConfig: S.optional(RecommendationJobCompiledOutputConfig),
}) {}
export class LabelingJobAlgorithmsConfig extends S.Class<LabelingJobAlgorithmsConfig>(
  "LabelingJobAlgorithmsConfig",
)({
  LabelingJobAlgorithmSpecificationArn: S.String,
  InitialActiveLearningModelArn: S.optional(S.String),
  LabelingJobResourceConfig: S.optional(LabelingJobResourceConfig),
}) {}
export class HumanTaskConfig extends S.Class<HumanTaskConfig>(
  "HumanTaskConfig",
)({
  WorkteamArn: S.String,
  UiConfig: UiConfig,
  PreHumanTaskLambdaArn: S.optional(S.String),
  TaskKeywords: S.optional(TaskKeywords),
  TaskTitle: S.String,
  TaskDescription: S.String,
  NumberOfHumanWorkersPerDataObject: S.Number,
  TaskTimeLimitInSeconds: S.Number,
  TaskAvailabilityLifetimeInSeconds: S.optional(S.Number),
  MaxConcurrentTaskCount: S.optional(S.Number),
  AnnotationConsolidationConfig: S.optional(AnnotationConsolidationConfig),
  PublicWorkforceTaskPrice: S.optional(PublicWorkforceTaskPrice),
}) {}
export class ModelPackageValidationSpecification extends S.Class<ModelPackageValidationSpecification>(
  "ModelPackageValidationSpecification",
)({
  ValidationRole: S.String,
  ValidationProfiles: ModelPackageValidationProfiles,
}) {}
export class SourceAlgorithmSpecification extends S.Class<SourceAlgorithmSpecification>(
  "SourceAlgorithmSpecification",
)({ SourceAlgorithms: SourceAlgorithmList }) {}
export class ServiceCatalogProvisioningDetails extends S.Class<ServiceCatalogProvisioningDetails>(
  "ServiceCatalogProvisioningDetails",
)({
  ProductId: S.String,
  ProvisioningArtifactId: S.optional(S.String),
  PathId: S.optional(S.String),
  ProvisioningParameters: S.optional(ProvisioningParameters),
}) {}
export class DebugRuleConfiguration extends S.Class<DebugRuleConfiguration>(
  "DebugRuleConfiguration",
)({
  RuleConfigurationName: S.String,
  LocalPath: S.optional(S.String),
  S3OutputPath: S.optional(S.String),
  RuleEvaluatorImage: S.String,
  InstanceType: S.optional(S.String),
  VolumeSizeInGB: S.optional(S.Number),
  RuleParameters: S.optional(RuleParameters),
}) {}
export const DebugRuleConfigurations = S.Array(DebugRuleConfiguration);
export class ProfilerConfig extends S.Class<ProfilerConfig>("ProfilerConfig")({
  S3OutputPath: S.optional(S.String),
  ProfilingIntervalInMilliseconds: S.optional(S.Number),
  ProfilingParameters: S.optional(ProfilingParameters),
  DisableProfiler: S.optional(S.Boolean),
}) {}
export class AutoMLPartialFailureReason extends S.Class<AutoMLPartialFailureReason>(
  "AutoMLPartialFailureReason",
)({ PartialFailureMessage: S.optional(S.String) }) {}
export const AutoMLPartialFailureReasons = S.Array(AutoMLPartialFailureReason);
export class AutoMLJobArtifacts extends S.Class<AutoMLJobArtifacts>(
  "AutoMLJobArtifacts",
)({
  CandidateDefinitionNotebookLocation: S.optional(S.String),
  DataExplorationNotebookLocation: S.optional(S.String),
}) {}
export class ResolvedAttributes extends S.Class<ResolvedAttributes>(
  "ResolvedAttributes",
)({
  AutoMLJobObjective: S.optional(AutoMLJobObjective),
  ProblemType: S.optional(S.String),
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
}) {}
export class ModelDeployResult extends S.Class<ModelDeployResult>(
  "ModelDeployResult",
)({ EndpointName: S.optional(S.String) }) {}
export class ClusterAutoScalingConfigOutput extends S.Class<ClusterAutoScalingConfigOutput>(
  "ClusterAutoScalingConfigOutput",
)({
  Mode: S.String,
  AutoScalerType: S.optional(S.String),
  Status: S.String,
  FailureMessage: S.optional(S.String),
}) {}
export class ModelArtifacts extends S.Class<ModelArtifacts>("ModelArtifacts")({
  S3ModelArtifacts: S.String,
}) {}
export class ModelDigests extends S.Class<ModelDigests>("ModelDigests")({
  ArtifactDigest: S.optional(S.String),
}) {}
export class DerivedInformation extends S.Class<DerivedInformation>(
  "DerivedInformation",
)({ DerivedDataInputConfig: S.optional(S.String) }) {}
export class EdgeModel extends S.Class<EdgeModel>("EdgeModel")({
  ModelName: S.String,
  ModelVersion: S.String,
  LatestSampleTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestInference: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EdgeModels = S.Array(EdgeModel);
export class EdgePresetDeploymentOutput extends S.Class<EdgePresetDeploymentOutput>(
  "EdgePresetDeploymentOutput",
)({
  Type: S.String,
  Artifact: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class DataCaptureConfigSummary extends S.Class<DataCaptureConfigSummary>(
  "DataCaptureConfigSummary",
)({
  EnableCapture: S.Boolean,
  CaptureStatus: S.String,
  CurrentSamplingPercentage: S.Number,
  DestinationS3Uri: S.String,
  KmsKeyId: S.String,
}) {}
export class ExperimentSource extends S.Class<ExperimentSource>(
  "ExperimentSource",
)({ SourceArn: S.String, SourceType: S.optional(S.String) }) {}
export class ThroughputConfigDescription extends S.Class<ThroughputConfigDescription>(
  "ThroughputConfigDescription",
)({
  ThroughputMode: S.String,
  ProvisionedReadCapacityUnits: S.optional(S.Number),
  ProvisionedWriteCapacityUnits: S.optional(S.Number),
}) {}
export class OfflineStoreStatus extends S.Class<OfflineStoreStatus>(
  "OfflineStoreStatus",
)({ Status: S.String, BlockedReason: S.optional(S.String) }) {}
export class LastUpdateStatus extends S.Class<LastUpdateStatus>(
  "LastUpdateStatus",
)({ Status: S.String, FailureReason: S.optional(S.String) }) {}
export class HubContentDependency extends S.Class<HubContentDependency>(
  "HubContentDependency",
)({
  DependencyOriginPath: S.optional(S.String),
  DependencyCopyPath: S.optional(S.String),
}) {}
export const HubContentDependencyList = S.Array(HubContentDependency);
export class UiTemplateInfo extends S.Class<UiTemplateInfo>("UiTemplateInfo")({
  Url: S.optional(S.String),
  ContentSha256: S.optional(S.String),
}) {}
export class TrainingJobStatusCounters extends S.Class<TrainingJobStatusCounters>(
  "TrainingJobStatusCounters",
)({
  Completed: S.optional(S.Number),
  InProgress: S.optional(S.Number),
  RetryableError: S.optional(S.Number),
  NonRetryableError: S.optional(S.Number),
  Stopped: S.optional(S.Number),
}) {}
export class ObjectiveStatusCounters extends S.Class<ObjectiveStatusCounters>(
  "ObjectiveStatusCounters",
)({
  Succeeded: S.optional(S.Number),
  Pending: S.optional(S.Number),
  Failed: S.optional(S.Number),
}) {}
export class HyperParameterTuningJobCompletionDetails extends S.Class<HyperParameterTuningJobCompletionDetails>(
  "HyperParameterTuningJobCompletionDetails",
)({
  NumberOfTrainingJobsObjectiveNotImproving: S.optional(S.Number),
  ConvergenceDetectedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class HyperParameterTuningJobConsumedResources extends S.Class<HyperParameterTuningJobConsumedResources>(
  "HyperParameterTuningJobConsumedResources",
)({ RuntimeInSeconds: S.optional(S.Number) }) {}
export class InferenceComponentRuntimeConfigSummary extends S.Class<InferenceComponentRuntimeConfigSummary>(
  "InferenceComponentRuntimeConfigSummary",
)({
  DesiredCopyCount: S.optional(S.Number),
  CurrentCopyCount: S.optional(S.Number),
}) {}
export class EndpointMetadata extends S.Class<EndpointMetadata>(
  "EndpointMetadata",
)({
  EndpointName: S.String,
  EndpointConfigName: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export class ModelVariantConfigSummary extends S.Class<ModelVariantConfigSummary>(
  "ModelVariantConfigSummary",
)({
  ModelName: S.String,
  VariantName: S.String,
  InfrastructureConfig: ModelInfrastructureConfig,
  Status: S.String,
}) {}
export const ModelVariantConfigSummaryList = S.Array(ModelVariantConfigSummary);
export class LabelCounters extends S.Class<LabelCounters>("LabelCounters")({
  TotalLabeled: S.optional(S.Number),
  HumanLabeled: S.optional(S.Number),
  MachineLabeled: S.optional(S.Number),
  FailedNonRetryableError: S.optional(S.Number),
  Unlabeled: S.optional(S.Number),
}) {}
export class LabelingJobOutput extends S.Class<LabelingJobOutput>(
  "LabelingJobOutput",
)({
  OutputDatasetS3Uri: S.String,
  FinalActiveLearningModelArn: S.optional(S.String),
}) {}
export class ModelCardExportArtifacts extends S.Class<ModelCardExportArtifacts>(
  "ModelCardExportArtifacts",
)({ S3ExportArtifacts: S.String }) {}
export class OptimizationOutput extends S.Class<OptimizationOutput>(
  "OptimizationOutput",
)({ RecommendedInferenceImage: S.optional(S.String) }) {}
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  Code: S.optional(S.String),
  Reason: S.optional(S.String),
}) {}
export class AvailableUpgrade extends S.Class<AvailableUpgrade>(
  "AvailableUpgrade",
)({
  Version: S.optional(S.String),
  ReleaseNotes: S.optional(ReleaseNotesList),
}) {}
export class PipelineExperimentConfig extends S.Class<PipelineExperimentConfig>(
  "PipelineExperimentConfig",
)({ ExperimentName: S.optional(S.String), TrialName: S.optional(S.String) }) {}
export class MLflowConfiguration extends S.Class<MLflowConfiguration>(
  "MLflowConfiguration",
)({
  MlflowResourceArn: S.optional(S.String),
  MlflowExperimentName: S.optional(S.String),
}) {}
export class ServiceCatalogProvisionedProductDetails extends S.Class<ServiceCatalogProvisionedProductDetails>(
  "ServiceCatalogProvisionedProductDetails",
)({
  ProvisionedProductId: S.optional(S.String),
  ProvisionedProductStatusMessage: S.optional(S.String),
}) {}
export class UltraServerSummary extends S.Class<UltraServerSummary>(
  "UltraServerSummary",
)({
  UltraServerType: S.String,
  InstanceType: S.String,
  UltraServerCount: S.optional(S.Number),
  AvailableSpareInstanceCount: S.optional(S.Number),
  UnhealthyInstanceCount: S.optional(S.Number),
}) {}
export class WarmPoolStatus extends S.Class<WarmPoolStatus>("WarmPoolStatus")({
  Status: S.String,
  ResourceRetainedBillableTimeInSeconds: S.optional(S.Number),
  ReusedByJob: S.optional(S.String),
}) {}
export class SecondaryStatusTransition extends S.Class<SecondaryStatusTransition>(
  "SecondaryStatusTransition",
)({
  Status: S.String,
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StatusMessage: S.optional(S.String),
}) {}
export const SecondaryStatusTransitions = S.Array(SecondaryStatusTransition);
export class MetricData extends S.Class<MetricData>("MetricData")({
  MetricName: S.optional(S.String),
  Value: S.optional(S.Number),
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const FinalMetricDataList = S.Array(MetricData);
export class DebugRuleEvaluationStatus extends S.Class<DebugRuleEvaluationStatus>(
  "DebugRuleEvaluationStatus",
)({
  RuleConfigurationName: S.optional(S.String),
  RuleEvaluationJobArn: S.optional(S.String),
  RuleEvaluationStatus: S.optional(S.String),
  StatusDetails: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DebugRuleEvaluationStatuses = S.Array(DebugRuleEvaluationStatus);
export class ProfilerRuleEvaluationStatus extends S.Class<ProfilerRuleEvaluationStatus>(
  "ProfilerRuleEvaluationStatus",
)({
  RuleConfigurationName: S.optional(S.String),
  RuleEvaluationJobArn: S.optional(S.String),
  RuleEvaluationStatus: S.optional(S.String),
  StatusDetails: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProfilerRuleEvaluationStatuses = S.Array(
  ProfilerRuleEvaluationStatus,
);
export class MlflowDetails extends S.Class<MlflowDetails>("MlflowDetails")({
  MlflowExperimentId: S.optional(S.String),
  MlflowRunId: S.optional(S.String),
}) {}
export class TrainingProgressInfo extends S.Class<TrainingProgressInfo>(
  "TrainingProgressInfo",
)({
  TotalStepCountPerEpoch: S.optional(S.Number),
  CurrentStep: S.optional(S.Number),
  CurrentEpoch: S.optional(S.Number),
  MaxEpoch: S.optional(S.Number),
}) {}
export class ReservedCapacitySummary extends S.Class<ReservedCapacitySummary>(
  "ReservedCapacitySummary",
)({
  ReservedCapacityArn: S.String,
  ReservedCapacityType: S.optional(S.String),
  UltraServerType: S.optional(S.String),
  UltraServerCount: S.optional(S.Number),
  InstanceType: S.String,
  TotalInstanceCount: S.Number,
  Status: S.String,
  AvailabilityZone: S.optional(S.String),
  DurationHours: S.optional(S.Number),
  DurationMinutes: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ReservedCapacitySummaries = S.Array(ReservedCapacitySummary);
export class TrialSource extends S.Class<TrialSource>("TrialSource")({
  SourceArn: S.String,
  SourceType: S.optional(S.String),
}) {}
export class TrialComponentMetricSummary extends S.Class<TrialComponentMetricSummary>(
  "TrialComponentMetricSummary",
)({
  MetricName: S.optional(S.String),
  SourceArn: S.optional(S.String),
  TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Max: S.optional(S.Number),
  Min: S.optional(S.Number),
  Last: S.optional(S.Number),
  Count: S.optional(S.Number),
  Avg: S.optional(S.Number),
  StdDev: S.optional(S.Number),
}) {}
export const TrialComponentMetricSummaries = S.Array(
  TrialComponentMetricSummary,
);
export class DeviceStats extends S.Class<DeviceStats>("DeviceStats")({
  ConnectedDeviceCount: S.Number,
  RegisteredDeviceCount: S.Number,
}) {}
export class AgentVersion extends S.Class<AgentVersion>("AgentVersion")({
  Version: S.String,
  AgentCount: S.Number,
}) {}
export const AgentVersions = S.Array(AgentVersion);
export class EdgeModelStat extends S.Class<EdgeModelStat>("EdgeModelStat")({
  ModelName: S.String,
  ModelVersion: S.String,
  OfflineDeviceCount: S.Number,
  ConnectedDeviceCount: S.Number,
  ActiveDeviceCount: S.Number,
  SamplingDeviceCount: S.Number,
}) {}
export const EdgeModelStats = S.Array(EdgeModelStat);
export class SuggestionQuery extends S.Class<SuggestionQuery>(
  "SuggestionQuery",
)({ PropertyNameQuery: S.optional(PropertyNameQuery) }) {}
export class ActionSummary extends S.Class<ActionSummary>("ActionSummary")({
  ActionArn: S.optional(S.String),
  ActionName: S.optional(S.String),
  Source: S.optional(ActionSource),
  ActionType: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ActionSummaries = S.Array(ActionSummary);
export class AlgorithmSummary extends S.Class<AlgorithmSummary>(
  "AlgorithmSummary",
)({
  AlgorithmName: S.String,
  AlgorithmArn: S.String,
  AlgorithmDescription: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AlgorithmStatus: S.String,
}) {}
export const AlgorithmSummaryList = S.Array(AlgorithmSummary);
export class AppImageConfigDetails extends S.Class<AppImageConfigDetails>(
  "AppImageConfigDetails",
)({
  AppImageConfigArn: S.optional(S.String),
  AppImageConfigName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  KernelGatewayImageConfig: S.optional(KernelGatewayImageConfig),
  JupyterLabAppImageConfig: S.optional(JupyterLabAppImageConfig),
  CodeEditorAppImageConfig: S.optional(CodeEditorAppImageConfig),
}) {}
export const AppImageConfigList = S.Array(AppImageConfigDetails);
export class AppDetails extends S.Class<AppDetails>("AppDetails")({
  DomainId: S.optional(S.String),
  UserProfileName: S.optional(S.String),
  SpaceName: S.optional(S.String),
  AppType: S.optional(S.String),
  AppName: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceSpec: S.optional(ResourceSpec),
}) {}
export const AppList = S.Array(AppDetails);
export class ArtifactSummary extends S.Class<ArtifactSummary>(
  "ArtifactSummary",
)({
  ArtifactArn: S.optional(S.String),
  ArtifactName: S.optional(S.String),
  Source: S.optional(ArtifactSource),
  ArtifactType: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ArtifactSummaries = S.Array(ArtifactSummary);
export class AssociationSummary extends S.Class<AssociationSummary>(
  "AssociationSummary",
)({
  SourceArn: S.optional(S.String),
  DestinationArn: S.optional(S.String),
  SourceType: S.optional(S.String),
  DestinationType: S.optional(S.String),
  AssociationType: S.optional(S.String),
  SourceName: S.optional(S.String),
  DestinationName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
}) {}
export const AssociationSummaries = S.Array(AssociationSummary);
export class AutoMLJobSummary extends S.Class<AutoMLJobSummary>(
  "AutoMLJobSummary",
)({
  AutoMLJobName: S.String,
  AutoMLJobArn: S.String,
  AutoMLJobStatus: S.String,
  AutoMLJobSecondaryStatus: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
  PartialFailureReasons: S.optional(AutoMLPartialFailureReasons),
}) {}
export const AutoMLJobSummaries = S.Array(AutoMLJobSummary);
export class ClusterEventSummary extends S.Class<ClusterEventSummary>(
  "ClusterEventSummary",
)({
  EventId: S.String,
  ClusterArn: S.String,
  ClusterName: S.String,
  InstanceGroupName: S.optional(S.String),
  InstanceId: S.optional(S.String),
  ResourceType: S.String,
  EventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
}) {}
export const ClusterEventSummaries = S.Array(ClusterEventSummary);
export class ClusterInstanceStatusDetails extends S.Class<ClusterInstanceStatusDetails>(
  "ClusterInstanceStatusDetails",
)({ Status: S.String, Message: S.optional(S.String) }) {}
export class UltraServerInfo extends S.Class<UltraServerInfo>(
  "UltraServerInfo",
)({ Id: S.optional(S.String) }) {}
export class ClusterNodeSummary extends S.Class<ClusterNodeSummary>(
  "ClusterNodeSummary",
)({
  InstanceGroupName: S.String,
  InstanceId: S.String,
  NodeLogicalId: S.optional(S.String),
  InstanceType: S.String,
  LaunchTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastSoftwareUpdateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InstanceStatus: ClusterInstanceStatusDetails,
  UltraServerInfo: S.optional(UltraServerInfo),
  PrivateDnsHostname: S.optional(S.String),
}) {}
export const ClusterNodeSummaries = S.Array(ClusterNodeSummary);
export class ClusterSummary extends S.Class<ClusterSummary>("ClusterSummary")({
  ClusterArn: S.String,
  ClusterName: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ClusterStatus: S.String,
  TrainingPlanArns: S.optional(TrainingPlanArns),
}) {}
export const ClusterSummaries = S.Array(ClusterSummary);
export class ClusterSchedulerConfigSummary extends S.Class<ClusterSchedulerConfigSummary>(
  "ClusterSchedulerConfigSummary",
)({
  ClusterSchedulerConfigArn: S.String,
  ClusterSchedulerConfigId: S.String,
  ClusterSchedulerConfigVersion: S.optional(S.Number),
  Name: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.String,
  ClusterArn: S.optional(S.String),
}) {}
export const ClusterSchedulerConfigSummaryList = S.Array(
  ClusterSchedulerConfigSummary,
);
export class CodeRepositorySummary extends S.Class<CodeRepositorySummary>(
  "CodeRepositorySummary",
)({
  CodeRepositoryName: S.String,
  CodeRepositoryArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  GitConfig: S.optional(GitConfig),
}) {}
export const CodeRepositorySummaryList = S.Array(CodeRepositorySummary);
export class CompilationJobSummary extends S.Class<CompilationJobSummary>(
  "CompilationJobSummary",
)({
  CompilationJobName: S.String,
  CompilationJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CompilationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompilationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompilationTargetDevice: S.optional(S.String),
  CompilationTargetPlatformOs: S.optional(S.String),
  CompilationTargetPlatformArch: S.optional(S.String),
  CompilationTargetPlatformAccelerator: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompilationJobStatus: S.String,
}) {}
export const CompilationJobSummaries = S.Array(CompilationJobSummary);
export class ComputeQuotaSummary extends S.Class<ComputeQuotaSummary>(
  "ComputeQuotaSummary",
)({
  ComputeQuotaArn: S.String,
  ComputeQuotaId: S.String,
  Name: S.String,
  ComputeQuotaVersion: S.optional(S.Number),
  Status: S.String,
  ClusterArn: S.optional(S.String),
  ComputeQuotaConfig: S.optional(ComputeQuotaConfig),
  ComputeQuotaTarget: ComputeQuotaTarget,
  ActivationState: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ComputeQuotaSummaryList = S.Array(ComputeQuotaSummary);
export class ContextSummary extends S.Class<ContextSummary>("ContextSummary")({
  ContextArn: S.optional(S.String),
  ContextName: S.optional(S.String),
  Source: S.optional(ContextSource),
  ContextType: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ContextSummaries = S.Array(ContextSummary);
export class DeviceFleetSummary extends S.Class<DeviceFleetSummary>(
  "DeviceFleetSummary",
)({
  DeviceFleetArn: S.String,
  DeviceFleetName: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DeviceFleetSummaries = S.Array(DeviceFleetSummary);
export class DomainDetails extends S.Class<DomainDetails>("DomainDetails")({
  DomainArn: S.optional(S.String),
  DomainId: S.optional(S.String),
  DomainName: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Url: S.optional(S.String),
}) {}
export const DomainList = S.Array(DomainDetails);
export class EdgeDeploymentPlanSummary extends S.Class<EdgeDeploymentPlanSummary>(
  "EdgeDeploymentPlanSummary",
)({
  EdgeDeploymentPlanArn: S.String,
  EdgeDeploymentPlanName: S.String,
  DeviceFleetName: S.String,
  EdgeDeploymentSuccess: S.Number,
  EdgeDeploymentPending: S.Number,
  EdgeDeploymentFailed: S.Number,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EdgeDeploymentPlanSummaries = S.Array(EdgeDeploymentPlanSummary);
export class EdgePackagingJobSummary extends S.Class<EdgePackagingJobSummary>(
  "EdgePackagingJobSummary",
)({
  EdgePackagingJobArn: S.String,
  EdgePackagingJobName: S.String,
  EdgePackagingJobStatus: S.String,
  CompilationJobName: S.optional(S.String),
  ModelName: S.optional(S.String),
  ModelVersion: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EdgePackagingJobSummaries = S.Array(EdgePackagingJobSummary);
export class EndpointConfigSummary extends S.Class<EndpointConfigSummary>(
  "EndpointConfigSummary",
)({
  EndpointConfigName: S.String,
  EndpointConfigArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const EndpointConfigSummaryList = S.Array(EndpointConfigSummary);
export class EndpointSummary extends S.Class<EndpointSummary>(
  "EndpointSummary",
)({
  EndpointName: S.String,
  EndpointArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndpointStatus: S.String,
}) {}
export const EndpointSummaryList = S.Array(EndpointSummary);
export class ExperimentSummary extends S.Class<ExperimentSummary>(
  "ExperimentSummary",
)({
  ExperimentArn: S.optional(S.String),
  ExperimentName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  ExperimentSource: S.optional(ExperimentSource),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ExperimentSummaries = S.Array(ExperimentSummary);
export class FeatureGroupSummary extends S.Class<FeatureGroupSummary>(
  "FeatureGroupSummary",
)({
  FeatureGroupName: S.String,
  FeatureGroupArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FeatureGroupStatus: S.optional(S.String),
  OfflineStoreStatus: S.optional(OfflineStoreStatus),
}) {}
export const FeatureGroupSummaries = S.Array(FeatureGroupSummary);
export class FlowDefinitionSummary extends S.Class<FlowDefinitionSummary>(
  "FlowDefinitionSummary",
)({
  FlowDefinitionName: S.String,
  FlowDefinitionArn: S.String,
  FlowDefinitionStatus: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
}) {}
export const FlowDefinitionSummaries = S.Array(FlowDefinitionSummary);
export class HubInfo extends S.Class<HubInfo>("HubInfo")({
  HubName: S.String,
  HubArn: S.String,
  HubDisplayName: S.optional(S.String),
  HubDescription: S.optional(S.String),
  HubSearchKeywords: S.optional(HubSearchKeywordList),
  HubStatus: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const HubInfoList = S.Array(HubInfo);
export class HumanTaskUiSummary extends S.Class<HumanTaskUiSummary>(
  "HumanTaskUiSummary",
)({
  HumanTaskUiName: S.String,
  HumanTaskUiArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const HumanTaskUiSummaries = S.Array(HumanTaskUiSummary);
export class HyperParameterTuningJobSummary extends S.Class<HyperParameterTuningJobSummary>(
  "HyperParameterTuningJobSummary",
)({
  HyperParameterTuningJobName: S.String,
  HyperParameterTuningJobArn: S.String,
  HyperParameterTuningJobStatus: S.String,
  Strategy: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  HyperParameterTuningEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingJobStatusCounters: TrainingJobStatusCounters,
  ObjectiveStatusCounters: ObjectiveStatusCounters,
  ResourceLimits: S.optional(ResourceLimits),
}) {}
export const HyperParameterTuningJobSummaries = S.Array(
  HyperParameterTuningJobSummary,
);
export class Image extends S.Class<Image>("Image")({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Description: S.optional(S.String),
  DisplayName: S.optional(S.String),
  FailureReason: S.optional(S.String),
  ImageArn: S.String,
  ImageName: S.String,
  ImageStatus: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Images = S.Array(Image);
export class ImageVersion extends S.Class<ImageVersion>("ImageVersion")({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
  ImageArn: S.String,
  ImageVersionArn: S.String,
  ImageVersionStatus: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Version: S.Number,
}) {}
export const ImageVersions = S.Array(ImageVersion);
export class InferenceComponentSummary extends S.Class<InferenceComponentSummary>(
  "InferenceComponentSummary",
)({
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  InferenceComponentArn: S.String,
  InferenceComponentName: S.String,
  EndpointArn: S.String,
  EndpointName: S.String,
  VariantName: S.String,
  InferenceComponentStatus: S.optional(S.String),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const InferenceComponentSummaryList = S.Array(InferenceComponentSummary);
export class InferenceExperimentSummary extends S.Class<InferenceExperimentSummary>(
  "InferenceExperimentSummary",
)({
  Name: S.String,
  Type: S.String,
  Schedule: S.optional(InferenceExperimentSchedule),
  Status: S.String,
  StatusReason: S.optional(S.String),
  Description: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RoleArn: S.optional(S.String),
}) {}
export const InferenceExperimentList = S.Array(InferenceExperimentSummary);
export class InferenceRecommendationsJob extends S.Class<InferenceRecommendationsJob>(
  "InferenceRecommendationsJob",
)({
  JobName: S.String,
  JobDescription: S.String,
  JobType: S.String,
  JobArn: S.String,
  Status: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RoleArn: S.String,
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  FailureReason: S.optional(S.String),
  ModelName: S.optional(S.String),
  SamplePayloadUrl: S.optional(S.String),
  ModelPackageVersionArn: S.optional(S.String),
}) {}
export const InferenceRecommendationsJobs = S.Array(
  InferenceRecommendationsJob,
);
export class LabelingJobS3DataSource extends S.Class<LabelingJobS3DataSource>(
  "LabelingJobS3DataSource",
)({ ManifestS3Uri: S.String }) {}
export class LabelingJobSnsDataSource extends S.Class<LabelingJobSnsDataSource>(
  "LabelingJobSnsDataSource",
)({ SnsTopicArn: S.String }) {}
export class LabelingJobDataSource extends S.Class<LabelingJobDataSource>(
  "LabelingJobDataSource",
)({
  S3DataSource: S.optional(LabelingJobS3DataSource),
  SnsDataSource: S.optional(LabelingJobSnsDataSource),
}) {}
export class LabelingJobInputConfig extends S.Class<LabelingJobInputConfig>(
  "LabelingJobInputConfig",
)({
  DataSource: LabelingJobDataSource,
  DataAttributes: S.optional(LabelingJobDataAttributes),
}) {}
export class LabelingJobSummary extends S.Class<LabelingJobSummary>(
  "LabelingJobSummary",
)({
  LabelingJobName: S.String,
  LabelingJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LabelingJobStatus: S.String,
  LabelCounters: LabelCounters,
  WorkteamArn: S.String,
  PreHumanTaskLambdaArn: S.optional(S.String),
  AnnotationConsolidationLambdaArn: S.optional(S.String),
  FailureReason: S.optional(S.String),
  LabelingJobOutput: S.optional(LabelingJobOutput),
  InputConfig: S.optional(LabelingJobInputConfig),
}) {}
export const LabelingJobSummaryList = S.Array(LabelingJobSummary);
export class LineageGroupSummary extends S.Class<LineageGroupSummary>(
  "LineageGroupSummary",
)({
  LineageGroupArn: S.optional(S.String),
  LineageGroupName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LineageGroupSummaries = S.Array(LineageGroupSummary);
export class MlflowAppSummary extends S.Class<MlflowAppSummary>(
  "MlflowAppSummary",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MlflowVersion: S.optional(S.String),
}) {}
export const MlflowAppSummaries = S.Array(MlflowAppSummary);
export class TrackingServerSummary extends S.Class<TrackingServerSummary>(
  "TrackingServerSummary",
)({
  TrackingServerArn: S.optional(S.String),
  TrackingServerName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrackingServerStatus: S.optional(S.String),
  IsActive: S.optional(S.String),
  MlflowVersion: S.optional(S.String),
}) {}
export const TrackingServerSummaryList = S.Array(TrackingServerSummary);
export class ModelCardExportJobSummary extends S.Class<ModelCardExportJobSummary>(
  "ModelCardExportJobSummary",
)({
  ModelCardExportJobName: S.String,
  ModelCardExportJobArn: S.String,
  Status: S.String,
  ModelCardName: S.String,
  ModelCardVersion: S.Number,
  CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ModelCardExportJobSummaryList = S.Array(ModelCardExportJobSummary);
export class ModelCardSummary extends S.Class<ModelCardSummary>(
  "ModelCardSummary",
)({
  ModelCardName: S.String,
  ModelCardArn: S.String,
  ModelCardStatus: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ModelCardSummaryList = S.Array(ModelCardSummary);
export class ModelCardVersionSummary extends S.Class<ModelCardVersionSummary>(
  "ModelCardVersionSummary",
)({
  ModelCardName: S.String,
  ModelCardArn: S.String,
  ModelCardStatus: S.String,
  ModelCardVersion: S.Number,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ModelCardVersionSummaryList = S.Array(ModelCardVersionSummary);
export class ModelMetadataSearchExpression extends S.Class<ModelMetadataSearchExpression>(
  "ModelMetadataSearchExpression",
)({ Filters: S.optional(ModelMetadataFilters) }) {}
export class ModelPackageGroupSummary extends S.Class<ModelPackageGroupSummary>(
  "ModelPackageGroupSummary",
)({
  ModelPackageGroupName: S.String,
  ModelPackageGroupArn: S.String,
  ModelPackageGroupDescription: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModelPackageGroupStatus: S.String,
}) {}
export const ModelPackageGroupSummaryList = S.Array(ModelPackageGroupSummary);
export class ModelPackageSummary extends S.Class<ModelPackageSummary>(
  "ModelPackageSummary",
)({
  ModelPackageName: S.optional(S.String),
  ModelPackageGroupName: S.optional(S.String),
  ModelPackageVersion: S.optional(S.Number),
  ModelPackageArn: S.String,
  ModelPackageDescription: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ModelPackageStatus: S.String,
  ModelApprovalStatus: S.optional(S.String),
  ModelLifeCycle: S.optional(ModelLifeCycle),
  ModelPackageRegistrationType: S.optional(S.String),
}) {}
export const ModelPackageSummaryList = S.Array(ModelPackageSummary);
export class ModelSummary extends S.Class<ModelSummary>("ModelSummary")({
  ModelName: S.String,
  ModelArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ModelSummaryList = S.Array(ModelSummary);
export class MonitoringAlertHistorySummary extends S.Class<MonitoringAlertHistorySummary>(
  "MonitoringAlertHistorySummary",
)({
  MonitoringScheduleName: S.String,
  MonitoringAlertName: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AlertStatus: S.String,
}) {}
export const MonitoringAlertHistoryList = S.Array(
  MonitoringAlertHistorySummary,
);
export class MonitoringScheduleSummary extends S.Class<MonitoringScheduleSummary>(
  "MonitoringScheduleSummary",
)({
  MonitoringScheduleName: S.String,
  MonitoringScheduleArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  MonitoringScheduleStatus: S.String,
  EndpointName: S.optional(S.String),
  MonitoringJobDefinitionName: S.optional(S.String),
  MonitoringType: S.optional(S.String),
}) {}
export const MonitoringScheduleSummaryList = S.Array(MonitoringScheduleSummary);
export class NotebookInstanceLifecycleConfigSummary extends S.Class<NotebookInstanceLifecycleConfigSummary>(
  "NotebookInstanceLifecycleConfigSummary",
)({
  NotebookInstanceLifecycleConfigName: S.String,
  NotebookInstanceLifecycleConfigArn: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const NotebookInstanceLifecycleConfigSummaryList = S.Array(
  NotebookInstanceLifecycleConfigSummary,
);
export class NotebookInstanceSummary extends S.Class<NotebookInstanceSummary>(
  "NotebookInstanceSummary",
)({
  NotebookInstanceName: S.String,
  NotebookInstanceArn: S.String,
  NotebookInstanceStatus: S.optional(S.String),
  Url: S.optional(S.String),
  InstanceType: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotebookInstanceLifecycleConfigName: S.optional(S.String),
  DefaultCodeRepository: S.optional(S.String),
  AdditionalCodeRepositories: S.optional(AdditionalCodeRepositoryNamesOrUrls),
}) {}
export const NotebookInstanceSummaryList = S.Array(NotebookInstanceSummary);
export class OptimizationJobSummary extends S.Class<OptimizationJobSummary>(
  "OptimizationJobSummary",
)({
  OptimizationJobName: S.String,
  OptimizationJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  OptimizationJobStatus: S.String,
  OptimizationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OptimizationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DeploymentInstanceType: S.String,
  MaxInstanceCount: S.optional(S.Number),
  OptimizationTypes: OptimizationTypes,
}) {}
export const OptimizationJobSummaries = S.Array(OptimizationJobSummary);
export class PartnerAppSummary extends S.Class<PartnerAppSummary>(
  "PartnerAppSummary",
)({
  Arn: S.optional(S.String),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PartnerAppSummaries = S.Array(PartnerAppSummary);
export class PipelineExecutionSummary extends S.Class<PipelineExecutionSummary>(
  "PipelineExecutionSummary",
)({
  PipelineExecutionArn: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PipelineExecutionStatus: S.optional(S.String),
  PipelineExecutionDescription: S.optional(S.String),
  PipelineExecutionDisplayName: S.optional(S.String),
  PipelineExecutionFailureReason: S.optional(S.String),
}) {}
export const PipelineExecutionSummaryList = S.Array(PipelineExecutionSummary);
export class PipelineSummary extends S.Class<PipelineSummary>(
  "PipelineSummary",
)({
  PipelineArn: S.optional(S.String),
  PipelineName: S.optional(S.String),
  PipelineDisplayName: S.optional(S.String),
  PipelineDescription: S.optional(S.String),
  RoleArn: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastExecutionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const PipelineSummaryList = S.Array(PipelineSummary);
export class PipelineVersionSummary extends S.Class<PipelineVersionSummary>(
  "PipelineVersionSummary",
)({
  PipelineArn: S.optional(S.String),
  PipelineVersionId: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  PipelineVersionDescription: S.optional(S.String),
  PipelineVersionDisplayName: S.optional(S.String),
  LastExecutionPipelineExecutionArn: S.optional(S.String),
}) {}
export const PipelineVersionSummaryList = S.Array(PipelineVersionSummary);
export class ProcessingJobSummary extends S.Class<ProcessingJobSummary>(
  "ProcessingJobSummary",
)({
  ProcessingJobName: S.String,
  ProcessingJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ProcessingEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ProcessingJobStatus: S.String,
  FailureReason: S.optional(S.String),
  ExitMessage: S.optional(S.String),
}) {}
export const ProcessingJobSummaries = S.Array(ProcessingJobSummary);
export class ProjectSummary extends S.Class<ProjectSummary>("ProjectSummary")({
  ProjectName: S.String,
  ProjectDescription: S.optional(S.String),
  ProjectArn: S.String,
  ProjectId: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ProjectStatus: S.String,
}) {}
export const ProjectSummaryList = S.Array(ProjectSummary);
export class ResourceCatalog extends S.Class<ResourceCatalog>(
  "ResourceCatalog",
)({
  ResourceCatalogArn: S.String,
  ResourceCatalogName: S.String,
  Description: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ResourceCatalogList = S.Array(ResourceCatalog);
export class DeviceDeploymentSummary extends S.Class<DeviceDeploymentSummary>(
  "DeviceDeploymentSummary",
)({
  EdgeDeploymentPlanArn: S.String,
  EdgeDeploymentPlanName: S.String,
  StageName: S.String,
  DeployedStageName: S.optional(S.String),
  DeviceFleetName: S.optional(S.String),
  DeviceName: S.String,
  DeviceArn: S.String,
  DeviceDeploymentStatus: S.optional(S.String),
  DeviceDeploymentStatusMessage: S.optional(S.String),
  Description: S.optional(S.String),
  DeploymentStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const DeviceDeploymentSummaries = S.Array(DeviceDeploymentSummary);
export class StudioLifecycleConfigDetails extends S.Class<StudioLifecycleConfigDetails>(
  "StudioLifecycleConfigDetails",
)({
  StudioLifecycleConfigArn: S.optional(S.String),
  StudioLifecycleConfigName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StudioLifecycleConfigAppType: S.optional(S.String),
}) {}
export const StudioLifecycleConfigsList = S.Array(StudioLifecycleConfigDetails);
export class TrainingJobSummary extends S.Class<TrainingJobSummary>(
  "TrainingJobSummary",
)({
  TrainingJobName: S.String,
  TrainingJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  TrainingEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingJobStatus: S.String,
  SecondaryStatus: S.optional(S.String),
  WarmPoolStatus: S.optional(WarmPoolStatus),
  TrainingPlanArn: S.optional(S.String),
}) {}
export const TrainingJobSummaries = S.Array(TrainingJobSummary);
export class TransformJobSummary extends S.Class<TransformJobSummary>(
  "TransformJobSummary",
)({
  TransformJobName: S.String,
  TransformJobArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  TransformEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TransformJobStatus: S.String,
  FailureReason: S.optional(S.String),
}) {}
export const TransformJobSummaries = S.Array(TransformJobSummary);
export class TrialComponentSummary extends S.Class<TrialComponentSummary>(
  "TrialComponentSummary",
)({
  TrialComponentName: S.optional(S.String),
  TrialComponentArn: S.optional(S.String),
  DisplayName: S.optional(S.String),
  TrialComponentSource: S.optional(TrialComponentSource),
  Status: S.optional(TrialComponentStatus),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
}) {}
export const TrialComponentSummaries = S.Array(TrialComponentSummary);
export class TrialSummary extends S.Class<TrialSummary>("TrialSummary")({
  TrialArn: S.optional(S.String),
  TrialName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  TrialSource: S.optional(TrialSource),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const TrialSummaries = S.Array(TrialSummary);
export class UltraServer extends S.Class<UltraServer>("UltraServer")({
  UltraServerId: S.String,
  UltraServerType: S.String,
  AvailabilityZone: S.String,
  InstanceType: S.String,
  TotalInstanceCount: S.Number,
  ConfiguredSpareInstanceCount: S.optional(S.Number),
  AvailableInstanceCount: S.optional(S.Number),
  InUseInstanceCount: S.optional(S.Number),
  AvailableSpareInstanceCount: S.optional(S.Number),
  UnhealthyInstanceCount: S.optional(S.Number),
  HealthStatus: S.optional(S.String),
}) {}
export const UltraServers = S.Array(UltraServer);
export class UserProfileDetails extends S.Class<UserProfileDetails>(
  "UserProfileDetails",
)({
  DomainId: S.optional(S.String),
  UserProfileName: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const UserProfileList = S.Array(UserProfileDetails);
export class QueryFilters extends S.Class<QueryFilters>("QueryFilters")({
  Types: S.optional(QueryTypes),
  LineageTypes: S.optional(QueryLineageTypes),
  CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModifiedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Properties: S.optional(QueryProperties),
}) {}
export class SearchExpression extends S.Class<SearchExpression>(
  "SearchExpression",
)({
  Filters: S.optional(FilterList),
  NestedFilters: S.optional(NestedFiltersList),
  SubExpressions: S.optional(S.suspend(() => SearchExpressionList)),
  Operator: S.optional(S.String),
}) {}
export class SelectiveExecutionConfig extends S.Class<SelectiveExecutionConfig>(
  "SelectiveExecutionConfig",
)({
  SourcePipelineExecutionArn: S.optional(S.String),
  SelectedSteps: SelectedStepList,
}) {}
export class DomainSettingsForUpdate extends S.Class<DomainSettingsForUpdate>(
  "DomainSettingsForUpdate",
)({
  RStudioServerProDomainSettingsForUpdate: S.optional(
    RStudioServerProDomainSettingsForUpdate,
  ),
  ExecutionRoleIdentityConfig: S.optional(S.String),
  SecurityGroupIds: S.optional(DomainSecurityGroupIds),
  TrustedIdentityPropagationSettings: S.optional(
    TrustedIdentityPropagationSettings,
  ),
  DockerSettings: S.optional(DockerSettings),
  AmazonQSettings: S.optional(AmazonQSettings),
  UnifiedStudioSettings: S.optional(UnifiedStudioSettings),
  IpAddressType: S.optional(S.String),
}) {}
export class DesiredWeightAndCapacity extends S.Class<DesiredWeightAndCapacity>(
  "DesiredWeightAndCapacity",
)({
  VariantName: S.String,
  DesiredWeight: S.optional(S.Number),
  DesiredInstanceCount: S.optional(S.Number),
  ServerlessUpdateConfig: S.optional(ProductionVariantServerlessUpdateConfig),
}) {}
export const DesiredWeightAndCapacityList = S.Array(DesiredWeightAndCapacity);
export class TrainingJobDefinition extends S.Class<TrainingJobDefinition>(
  "TrainingJobDefinition",
)({
  TrainingInputMode: S.String,
  HyperParameters: S.optional(HyperParameters),
  InputDataConfig: InputDataConfig,
  OutputDataConfig: OutputDataConfig,
  ResourceConfig: ResourceConfig,
  StoppingCondition: StoppingCondition,
}) {}
export class TimeSeriesConfig extends S.Class<TimeSeriesConfig>(
  "TimeSeriesConfig",
)({
  TargetAttributeName: S.String,
  TimestampAttributeName: S.String,
  ItemIdentifierAttributeName: S.String,
  GroupingAttributeNames: S.optional(GroupingAttributeNames),
}) {}
export class HolidayConfigAttributes extends S.Class<HolidayConfigAttributes>(
  "HolidayConfigAttributes",
)({ CountryCode: S.optional(S.String) }) {}
export const HolidayConfig = S.Array(HolidayConfigAttributes);
export const TextGenerationHyperParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class HyperbandStrategyConfig extends S.Class<HyperbandStrategyConfig>(
  "HyperbandStrategyConfig",
)({ MinResource: S.optional(S.Number), MaxResource: S.optional(S.Number) }) {}
export class BestObjectiveNotImproving extends S.Class<BestObjectiveNotImproving>(
  "BestObjectiveNotImproving",
)({ MaxNumberOfTrainingJobsNotImproving: S.optional(S.Number) }) {}
export class ConvergenceDetected extends S.Class<ConvergenceDetected>(
  "ConvergenceDetected",
)({ CompleteOnConvergence: S.optional(S.String) }) {}
export class Phase extends S.Class<Phase>("Phase")({
  InitialNumberOfUsers: S.optional(S.Number),
  SpawnRate: S.optional(S.Number),
  DurationInSeconds: S.optional(S.Number),
}) {}
export const Phases = S.Array(Phase);
export class Stairs extends S.Class<Stairs>("Stairs")({
  DurationInSeconds: S.optional(S.Number),
  NumberOfSteps: S.optional(S.Number),
  UsersPerStep: S.optional(S.Number),
}) {}
export class RecommendationJobPayloadConfig extends S.Class<RecommendationJobPayloadConfig>(
  "RecommendationJobPayloadConfig",
)({
  SamplePayloadUrl: S.optional(S.String),
  SupportedContentTypes: S.optional(RecommendationJobSupportedContentTypes),
}) {}
export class OptimizationModelAccessConfig extends S.Class<OptimizationModelAccessConfig>(
  "OptimizationModelAccessConfig",
)({ AcceptEula: S.Boolean }) {}
export class ModelSpeculativeDecodingTrainingDataSource extends S.Class<ModelSpeculativeDecodingTrainingDataSource>(
  "ModelSpeculativeDecodingTrainingDataSource",
)({ S3Uri: S.String, S3DataType: S.String }) {}
export class CfnStackCreateParameter extends S.Class<CfnStackCreateParameter>(
  "CfnStackCreateParameter",
)({ Key: S.String, Value: S.optional(S.String) }) {}
export const CfnStackCreateParameters = S.Array(CfnStackCreateParameter);
export class TrainingRepositoryAuthConfig extends S.Class<TrainingRepositoryAuthConfig>(
  "TrainingRepositoryAuthConfig",
)({ TrainingRepositoryCredentialsProviderArn: S.String }) {}
export const CollectionParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class InferenceComponentCapacitySize extends S.Class<InferenceComponentCapacitySize>(
  "InferenceComponentCapacitySize",
)({ Type: S.String, Value: S.Number }) {}
export class CfnStackUpdateParameter extends S.Class<CfnStackUpdateParameter>(
  "CfnStackUpdateParameter",
)({ Key: S.String, Value: S.optional(S.String) }) {}
export const CfnStackUpdateParameters = S.Array(CfnStackUpdateParameter);
export class AddTagsOutput extends S.Class<AddTagsOutput>("AddTagsOutput")(
  { Tags: S.optional(TagList) },
  ns,
) {}
export class BatchDeleteClusterNodesResponse extends S.Class<BatchDeleteClusterNodesResponse>(
  "BatchDeleteClusterNodesResponse",
)(
  {
    Failed: S.optional(BatchDeleteClusterNodesErrorList),
    Successful: S.optional(ClusterNodeIds),
    FailedNodeLogicalIds: S.optional(BatchDeleteClusterNodeLogicalIdsErrorList),
    SuccessfulNodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  ns,
) {}
export class BatchRebootClusterNodesResponse extends S.Class<BatchRebootClusterNodesResponse>(
  "BatchRebootClusterNodesResponse",
)(
  {
    Successful: S.optional(ClusterNodeIds),
    Failed: S.optional(BatchRebootClusterNodesErrors),
    FailedNodeLogicalIds: S.optional(BatchRebootClusterNodeLogicalIdsErrors),
    SuccessfulNodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  ns,
) {}
export class BatchReplaceClusterNodesResponse extends S.Class<BatchReplaceClusterNodesResponse>(
  "BatchReplaceClusterNodesResponse",
)(
  {
    Successful: S.optional(ClusterNodeIds),
    Failed: S.optional(BatchReplaceClusterNodesErrors),
    FailedNodeLogicalIds: S.optional(BatchReplaceClusterNodeLogicalIdsErrors),
    SuccessfulNodeLogicalIds: S.optional(ClusterNodeLogicalIdList),
  },
  ns,
) {}
export class CreateActionResponse extends S.Class<CreateActionResponse>(
  "CreateActionResponse",
)({ ActionArn: S.optional(S.String) }, ns) {}
export class CreateAppResponse extends S.Class<CreateAppResponse>(
  "CreateAppResponse",
)({ AppArn: S.optional(S.String) }, ns) {}
export class CreateArtifactRequest extends S.Class<CreateArtifactRequest>(
  "CreateArtifactRequest",
)(
  {
    ArtifactName: S.optional(S.String),
    Source: ArtifactSource,
    ArtifactType: S.String,
    Properties: S.optional(ArtifactProperties),
    MetadataProperties: S.optional(MetadataProperties),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSchedulerConfigRequest extends S.Class<CreateClusterSchedulerConfigRequest>(
  "CreateClusterSchedulerConfigRequest",
)(
  {
    Name: S.String,
    ClusterArn: S.String,
    SchedulerConfig: SchedulerConfig,
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCodeRepositoryOutput extends S.Class<CreateCodeRepositoryOutput>(
  "CreateCodeRepositoryOutput",
)({ CodeRepositoryArn: S.String }, ns) {}
export class CreateCompilationJobRequest extends S.Class<CreateCompilationJobRequest>(
  "CreateCompilationJobRequest",
)(
  {
    CompilationJobName: S.String,
    RoleArn: S.String,
    ModelPackageVersionArn: S.optional(S.String),
    InputConfig: S.optional(InputConfig),
    OutputConfig: OutputConfig,
    VpcConfig: S.optional(NeoVpcConfig),
    StoppingCondition: StoppingCondition,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateContextResponse extends S.Class<CreateContextResponse>(
  "CreateContextResponse",
)({ ContextArn: S.optional(S.String) }, ns) {}
export class CreateEdgeDeploymentPlanRequest extends S.Class<CreateEdgeDeploymentPlanRequest>(
  "CreateEdgeDeploymentPlanRequest",
)(
  {
    EdgeDeploymentPlanName: S.String,
    ModelConfigs: EdgeDeploymentModelConfigs,
    DeviceFleetName: S.String,
    Stages: S.optional(DeploymentStages),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHubResponse extends S.Class<CreateHubResponse>(
  "CreateHubResponse",
)({ HubArn: S.String }, ns) {}
export class CreateHumanTaskUiResponse extends S.Class<CreateHumanTaskUiResponse>(
  "CreateHumanTaskUiResponse",
)({ HumanTaskUiArn: S.String }, ns) {}
export class CreateInferenceComponentInput extends S.Class<CreateInferenceComponentInput>(
  "CreateInferenceComponentInput",
)(
  {
    InferenceComponentName: S.String,
    EndpointName: S.String,
    VariantName: S.optional(S.String),
    Specification: InferenceComponentSpecification,
    RuntimeConfig: S.optional(InferenceComponentRuntimeConfig),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CategoricalParameterRangeValues = S.Array(S.String);
export class CreateModelBiasJobDefinitionRequest extends S.Class<CreateModelBiasJobDefinitionRequest>(
  "CreateModelBiasJobDefinitionRequest",
)(
  {
    JobDefinitionName: S.String,
    ModelBiasBaselineConfig: S.optional(ModelBiasBaselineConfig),
    ModelBiasAppSpecification: ModelBiasAppSpecification,
    ModelBiasJobInput: ModelBiasJobInput,
    ModelBiasJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelCardResponse extends S.Class<CreateModelCardResponse>(
  "CreateModelCardResponse",
)({ ModelCardArn: S.String }, ns) {}
export class CreateModelCardExportJobResponse extends S.Class<CreateModelCardExportJobResponse>(
  "CreateModelCardExportJobResponse",
)({ ModelCardExportJobArn: S.String }, ns) {}
export class CreateModelExplainabilityJobDefinitionResponse extends S.Class<CreateModelExplainabilityJobDefinitionResponse>(
  "CreateModelExplainabilityJobDefinitionResponse",
)({ JobDefinitionArn: S.String }, ns) {}
export class CreateModelQualityJobDefinitionResponse extends S.Class<CreateModelQualityJobDefinitionResponse>(
  "CreateModelQualityJobDefinitionResponse",
)({ JobDefinitionArn: S.String }, ns) {}
export class CreateNotebookInstanceOutput extends S.Class<CreateNotebookInstanceOutput>(
  "CreateNotebookInstanceOutput",
)({ NotebookInstanceArn: S.optional(S.String) }, ns) {}
export class CreateNotebookInstanceLifecycleConfigOutput extends S.Class<CreateNotebookInstanceLifecycleConfigOutput>(
  "CreateNotebookInstanceLifecycleConfigOutput",
)({ NotebookInstanceLifecycleConfigArn: S.optional(S.String) }, ns) {}
export class CreatePartnerAppRequest extends S.Class<CreatePartnerAppRequest>(
  "CreatePartnerAppRequest",
)(
  {
    Name: S.String,
    Type: S.String,
    ExecutionRoleArn: S.String,
    KmsKeyId: S.optional(S.String),
    MaintenanceConfig: S.optional(PartnerAppMaintenanceConfig),
    Tier: S.String,
    ApplicationConfig: S.optional(PartnerAppConfig),
    AuthType: S.String,
    EnableIamSessionBasedIdentity: S.optional(S.Boolean),
    EnableAutoMinorVersionUpgrade: S.optional(S.Boolean),
    ClientToken: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePipelineResponse extends S.Class<CreatePipelineResponse>(
  "CreatePipelineResponse",
)({ PipelineArn: S.optional(S.String) }, ns) {}
export class CreateTrialComponentRequest extends S.Class<CreateTrialComponentRequest>(
  "CreateTrialComponentRequest",
)(
  {
    TrialComponentName: S.String,
    DisplayName: S.optional(S.String),
    Status: S.optional(TrialComponentStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Parameters: S.optional(TrialComponentParameters),
    InputArtifacts: S.optional(TrialComponentArtifacts),
    OutputArtifacts: S.optional(TrialComponentArtifacts),
    MetadataProperties: S.optional(MetadataProperties),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWorkforceRequest extends S.Class<CreateWorkforceRequest>(
  "CreateWorkforceRequest",
)(
  {
    CognitoConfig: S.optional(CognitoConfig),
    OidcConfig: S.optional(OidcConfig),
    SourceIpConfig: S.optional(SourceIpConfig),
    WorkforceName: S.String,
    Tags: S.optional(TagList),
    WorkforceVpcConfig: S.optional(WorkforceVpcConfigRequest),
    IpAddressType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCompilationJobResponse extends S.Class<DescribeCompilationJobResponse>(
  "DescribeCompilationJobResponse",
)(
  {
    CompilationJobName: S.String,
    CompilationJobArn: S.String,
    CompilationJobStatus: S.String,
    CompilationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompilationEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StoppingCondition: StoppingCondition,
    InferenceImage: S.optional(S.String),
    ModelPackageVersionArn: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.String,
    ModelArtifacts: ModelArtifacts,
    ModelDigests: S.optional(ModelDigests),
    RoleArn: S.String,
    InputConfig: InputConfig,
    OutputConfig: OutputConfig,
    VpcConfig: S.optional(NeoVpcConfig),
    DerivedInformation: S.optional(DerivedInformation),
  },
  ns,
) {}
export class DescribeDeviceResponse extends S.Class<DescribeDeviceResponse>(
  "DescribeDeviceResponse",
)(
  {
    DeviceArn: S.optional(S.String),
    DeviceName: S.String,
    Description: S.optional(S.String),
    DeviceFleetName: S.String,
    IotThingName: S.optional(S.String),
    RegistrationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LatestHeartbeat: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Models: S.optional(EdgeModels),
    MaxModels: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AgentVersion: S.optional(S.String),
  },
  ns,
) {}
export class DescribeEdgePackagingJobResponse extends S.Class<DescribeEdgePackagingJobResponse>(
  "DescribeEdgePackagingJobResponse",
)(
  {
    EdgePackagingJobArn: S.String,
    EdgePackagingJobName: S.String,
    CompilationJobName: S.optional(S.String),
    ModelName: S.optional(S.String),
    ModelVersion: S.optional(S.String),
    RoleArn: S.optional(S.String),
    OutputConfig: S.optional(EdgeOutputConfig),
    ResourceKey: S.optional(S.String),
    EdgePackagingJobStatus: S.String,
    EdgePackagingJobStatusMessage: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ModelArtifact: S.optional(S.String),
    ModelSignature: S.optional(S.String),
    PresetDeploymentOutput: S.optional(EdgePresetDeploymentOutput),
  },
  ns,
) {}
export class DescribeExperimentResponse extends S.Class<DescribeExperimentResponse>(
  "DescribeExperimentResponse",
)(
  {
    ExperimentName: S.optional(S.String),
    ExperimentArn: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Source: S.optional(ExperimentSource),
    Description: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export const FeatureDefinitions = S.Array(FeatureDefinition);
export class DescribeFeatureGroupResponse extends S.Class<DescribeFeatureGroupResponse>(
  "DescribeFeatureGroupResponse",
)(
  {
    FeatureGroupArn: S.String,
    FeatureGroupName: S.String,
    RecordIdentifierFeatureName: S.String,
    EventTimeFeatureName: S.String,
    FeatureDefinitions: FeatureDefinitions,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OnlineStoreConfig: S.optional(OnlineStoreConfig),
    OfflineStoreConfig: S.optional(OfflineStoreConfig),
    ThroughputConfig: S.optional(ThroughputConfigDescription),
    RoleArn: S.optional(S.String),
    FeatureGroupStatus: S.optional(S.String),
    OfflineStoreStatus: S.optional(OfflineStoreStatus),
    LastUpdateStatus: S.optional(LastUpdateStatus),
    FailureReason: S.optional(S.String),
    Description: S.optional(S.String),
    NextToken: S.String,
    OnlineStoreTotalSizeBytes: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeHubContentResponse extends S.Class<DescribeHubContentResponse>(
  "DescribeHubContentResponse",
)(
  {
    HubContentName: S.String,
    HubContentArn: S.String,
    HubContentVersion: S.String,
    HubContentType: S.String,
    DocumentSchemaVersion: S.String,
    HubName: S.String,
    HubArn: S.String,
    HubContentDisplayName: S.optional(S.String),
    HubContentDescription: S.optional(S.String),
    HubContentMarkdown: S.optional(S.String),
    HubContentDocument: S.String,
    SageMakerPublicHubContentArn: S.optional(S.String),
    ReferenceMinVersion: S.optional(S.String),
    SupportStatus: S.optional(S.String),
    HubContentSearchKeywords: S.optional(HubContentSearchKeywordList),
    HubContentDependencies: S.optional(HubContentDependencyList),
    HubContentStatus: S.String,
    FailureReason: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeHumanTaskUiResponse extends S.Class<DescribeHumanTaskUiResponse>(
  "DescribeHumanTaskUiResponse",
)(
  {
    HumanTaskUiArn: S.String,
    HumanTaskUiName: S.String,
    HumanTaskUiStatus: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    UiTemplate: UiTemplateInfo,
  },
  ns,
) {}
export class DescribeInferenceExperimentResponse extends S.Class<DescribeInferenceExperimentResponse>(
  "DescribeInferenceExperimentResponse",
)(
  {
    Arn: S.String,
    Name: S.String,
    Type: S.String,
    Schedule: S.optional(InferenceExperimentSchedule),
    Status: S.String,
    StatusReason: S.optional(S.String),
    Description: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    RoleArn: S.optional(S.String),
    EndpointMetadata: EndpointMetadata,
    ModelVariants: ModelVariantConfigSummaryList,
    DataStorageConfig: S.optional(InferenceExperimentDataStorageConfig),
    ShadowModeConfig: S.optional(ShadowModeConfig),
    KmsKey: S.optional(S.String),
  },
  ns,
) {}
export class DescribeLabelingJobResponse extends S.Class<DescribeLabelingJobResponse>(
  "DescribeLabelingJobResponse",
)(
  {
    LabelingJobStatus: S.String,
    LabelCounters: LabelCounters,
    FailureReason: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    JobReferenceCode: S.String,
    LabelingJobName: S.String,
    LabelingJobArn: S.String,
    LabelAttributeName: S.optional(S.String),
    InputConfig: LabelingJobInputConfig,
    OutputConfig: LabelingJobOutputConfig,
    RoleArn: S.String,
    LabelCategoryConfigS3Uri: S.optional(S.String),
    StoppingConditions: S.optional(LabelingJobStoppingConditions),
    LabelingJobAlgorithmsConfig: S.optional(LabelingJobAlgorithmsConfig),
    HumanTaskConfig: HumanTaskConfig,
    Tags: S.optional(TagList),
    LabelingJobOutput: S.optional(LabelingJobOutput),
  },
  ns,
) {}
export class DescribeModelCardExportJobResponse extends S.Class<DescribeModelCardExportJobResponse>(
  "DescribeModelCardExportJobResponse",
)(
  {
    ModelCardExportJobName: S.String,
    ModelCardExportJobArn: S.String,
    Status: S.String,
    ModelCardName: S.String,
    ModelCardVersion: S.Number,
    OutputConfig: ModelCardExportOutputConfig,
    CreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.optional(S.String),
    ExportArtifacts: S.optional(ModelCardExportArtifacts),
  },
  ns,
) {}
export class DescribeMonitoringScheduleResponse extends S.Class<DescribeMonitoringScheduleResponse>(
  "DescribeMonitoringScheduleResponse",
)(
  {
    MonitoringScheduleArn: S.String,
    MonitoringScheduleName: S.String,
    MonitoringScheduleStatus: S.String,
    MonitoringType: S.optional(S.String),
    FailureReason: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    MonitoringScheduleConfig: MonitoringScheduleConfig,
    EndpointName: S.optional(S.String),
    LastMonitoringExecutionSummary: S.optional(MonitoringExecutionSummary),
  },
  ns,
) {}
export class OptimizationJobModelSourceS3 extends S.Class<OptimizationJobModelSourceS3>(
  "OptimizationJobModelSourceS3",
)({
  S3Uri: S.optional(S.String),
  ModelAccessConfig: S.optional(OptimizationModelAccessConfig),
}) {}
export class OptimizationJobModelSource extends S.Class<OptimizationJobModelSource>(
  "OptimizationJobModelSource",
)({
  S3: S.optional(OptimizationJobModelSourceS3),
  SageMakerModel: S.optional(OptimizationSageMakerModel),
}) {}
export class ModelSpeculativeDecodingConfig extends S.Class<ModelSpeculativeDecodingConfig>(
  "ModelSpeculativeDecodingConfig",
)({
  Technique: S.String,
  TrainingDataSource: S.optional(ModelSpeculativeDecodingTrainingDataSource),
}) {}
export const OptimizationConfig = S.Union(
  S.Struct({ ModelQuantizationConfig: ModelQuantizationConfig }),
  S.Struct({ ModelCompilationConfig: ModelCompilationConfig }),
  S.Struct({ ModelShardingConfig: ModelShardingConfig }),
  S.Struct({ ModelSpeculativeDecodingConfig: ModelSpeculativeDecodingConfig }),
);
export const OptimizationConfigs = S.Array(OptimizationConfig);
export class DescribeOptimizationJobResponse extends S.Class<DescribeOptimizationJobResponse>(
  "DescribeOptimizationJobResponse",
)(
  {
    OptimizationJobArn: S.String,
    OptimizationJobStatus: S.String,
    OptimizationStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OptimizationEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.optional(S.String),
    OptimizationJobName: S.String,
    ModelSource: OptimizationJobModelSource,
    OptimizationEnvironment: S.optional(OptimizationJobEnvironmentVariables),
    DeploymentInstanceType: S.String,
    MaxInstanceCount: S.optional(S.Number),
    OptimizationConfigs: OptimizationConfigs,
    OutputConfig: OptimizationJobOutputConfig,
    OptimizationOutput: S.optional(OptimizationOutput),
    RoleArn: S.String,
    StoppingCondition: StoppingCondition,
    VpcConfig: S.optional(OptimizationVpcConfig),
  },
  ns,
) {}
export class DescribePartnerAppResponse extends S.Class<DescribePartnerAppResponse>(
  "DescribePartnerAppResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExecutionRoleArn: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    BaseUrl: S.optional(S.String),
    MaintenanceConfig: S.optional(PartnerAppMaintenanceConfig),
    Tier: S.optional(S.String),
    Version: S.optional(S.String),
    ApplicationConfig: S.optional(PartnerAppConfig),
    AuthType: S.optional(S.String),
    EnableIamSessionBasedIdentity: S.optional(S.Boolean),
    Error: S.optional(ErrorInfo),
    EnableAutoMinorVersionUpgrade: S.optional(S.Boolean),
    CurrentVersionEolDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AvailableUpgrade: S.optional(AvailableUpgrade),
  },
  ns,
) {}
export class DescribePipelineExecutionResponse extends S.Class<DescribePipelineExecutionResponse>(
  "DescribePipelineExecutionResponse",
)(
  {
    PipelineArn: S.optional(S.String),
    PipelineExecutionArn: S.optional(S.String),
    PipelineExecutionDisplayName: S.optional(S.String),
    PipelineExecutionStatus: S.optional(S.String),
    PipelineExecutionDescription: S.optional(S.String),
    PipelineExperimentConfig: S.optional(PipelineExperimentConfig),
    FailureReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreatedBy: S.optional(UserContext),
    LastModifiedBy: S.optional(UserContext),
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
    SelectiveExecutionConfig: S.optional(SelectiveExecutionConfig),
    PipelineVersionId: S.optional(S.Number),
    MLflowConfig: S.optional(MLflowConfiguration),
  },
  ns,
) {}
export class DescribeReservedCapacityResponse extends S.Class<DescribeReservedCapacityResponse>(
  "DescribeReservedCapacityResponse",
)(
  {
    ReservedCapacityArn: S.String,
    ReservedCapacityType: S.optional(S.String),
    Status: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    DurationHours: S.optional(S.Number),
    DurationMinutes: S.optional(S.Number),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InstanceType: S.String,
    TotalInstanceCount: S.Number,
    AvailableInstanceCount: S.optional(S.Number),
    InUseInstanceCount: S.optional(S.Number),
    UltraServerSummary: S.optional(UltraServerSummary),
  },
  ns,
) {}
export class DescribeSubscribedWorkteamResponse extends S.Class<DescribeSubscribedWorkteamResponse>(
  "DescribeSubscribedWorkteamResponse",
)({ SubscribedWorkteam: SubscribedWorkteam }, ns) {}
export class TrainingImageConfig extends S.Class<TrainingImageConfig>(
  "TrainingImageConfig",
)({
  TrainingRepositoryAccessMode: S.String,
  TrainingRepositoryAuthConfig: S.optional(TrainingRepositoryAuthConfig),
}) {}
export class AlgorithmSpecification extends S.Class<AlgorithmSpecification>(
  "AlgorithmSpecification",
)({
  TrainingImage: S.optional(S.String),
  AlgorithmName: S.optional(S.String),
  TrainingInputMode: S.String,
  MetricDefinitions: S.optional(MetricDefinitionList),
  EnableSageMakerMetricsTimeSeries: S.optional(S.Boolean),
  ContainerEntrypoint: S.optional(TrainingContainerEntrypoint),
  ContainerArguments: S.optional(TrainingContainerArguments),
  TrainingImageConfig: S.optional(TrainingImageConfig),
}) {}
export class CollectionConfiguration extends S.Class<CollectionConfiguration>(
  "CollectionConfiguration",
)({
  CollectionName: S.optional(S.String),
  CollectionParameters: S.optional(CollectionParameters),
}) {}
export const CollectionConfigurations = S.Array(CollectionConfiguration);
export class DebugHookConfig extends S.Class<DebugHookConfig>(
  "DebugHookConfig",
)({
  LocalPath: S.optional(S.String),
  S3OutputPath: S.String,
  HookParameters: S.optional(HookParameters),
  CollectionConfigurations: S.optional(CollectionConfigurations),
}) {}
export class DescribeTrainingJobResponse extends S.Class<DescribeTrainingJobResponse>(
  "DescribeTrainingJobResponse",
)(
  {
    TrainingJobName: S.String,
    TrainingJobArn: S.String,
    TuningJobArn: S.optional(S.String),
    LabelingJobArn: S.optional(S.String),
    AutoMLJobArn: S.optional(S.String),
    ModelArtifacts: ModelArtifacts,
    TrainingJobStatus: S.String,
    SecondaryStatus: S.String,
    FailureReason: S.optional(S.String),
    HyperParameters: S.optional(HyperParameters),
    AlgorithmSpecification: S.optional(AlgorithmSpecification),
    RoleArn: S.optional(S.String),
    InputDataConfig: S.optional(InputDataConfig),
    OutputDataConfig: S.optional(OutputDataConfig),
    ResourceConfig: S.optional(ResourceConfig),
    WarmPoolStatus: S.optional(WarmPoolStatus),
    VpcConfig: S.optional(VpcConfig),
    StoppingCondition: StoppingCondition,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TrainingStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    SecondaryStatusTransitions: S.optional(SecondaryStatusTransitions),
    FinalMetricDataList: S.optional(FinalMetricDataList),
    EnableNetworkIsolation: S.optional(S.Boolean),
    EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
    EnableManagedSpotTraining: S.optional(S.Boolean),
    CheckpointConfig: S.optional(CheckpointConfig),
    TrainingTimeInSeconds: S.optional(S.Number),
    BillableTimeInSeconds: S.optional(S.Number),
    BillableTokenCount: S.optional(S.Number),
    DebugHookConfig: S.optional(DebugHookConfig),
    ExperimentConfig: S.optional(ExperimentConfig),
    DebugRuleConfigurations: S.optional(DebugRuleConfigurations),
    TensorBoardOutputConfig: S.optional(TensorBoardOutputConfig),
    DebugRuleEvaluationStatuses: S.optional(DebugRuleEvaluationStatuses),
    ProfilerConfig: S.optional(ProfilerConfig),
    ProfilerRuleConfigurations: S.optional(ProfilerRuleConfigurations),
    ProfilerRuleEvaluationStatuses: S.optional(ProfilerRuleEvaluationStatuses),
    ProfilingStatus: S.optional(S.String),
    Environment: S.optional(TrainingEnvironmentMap),
    RetryStrategy: S.optional(RetryStrategy),
    RemoteDebugConfig: S.optional(RemoteDebugConfig),
    InfraCheckConfig: S.optional(InfraCheckConfig),
    ServerlessJobConfig: S.optional(ServerlessJobConfig),
    MlflowConfig: S.optional(MlflowConfig),
    ModelPackageConfig: S.optional(ModelPackageConfig),
    MlflowDetails: S.optional(MlflowDetails),
    ProgressInfo: S.optional(TrainingProgressInfo),
    OutputModelPackageArn: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTrainingPlanResponse extends S.Class<DescribeTrainingPlanResponse>(
  "DescribeTrainingPlanResponse",
)(
  {
    TrainingPlanArn: S.String,
    TrainingPlanName: S.String,
    Status: S.String,
    StatusMessage: S.optional(S.String),
    DurationHours: S.optional(S.Number),
    DurationMinutes: S.optional(S.Number),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpfrontFee: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    TotalInstanceCount: S.optional(S.Number),
    AvailableInstanceCount: S.optional(S.Number),
    InUseInstanceCount: S.optional(S.Number),
    UnhealthyInstanceCount: S.optional(S.Number),
    AvailableSpareInstanceCount: S.optional(S.Number),
    TotalUltraServerCount: S.optional(S.Number),
    TargetResources: S.optional(SageMakerResourceNames),
    ReservedCapacitySummaries: S.optional(ReservedCapacitySummaries),
  },
  ns,
) {}
export class DescribeTrialResponse extends S.Class<DescribeTrialResponse>(
  "DescribeTrialResponse",
)(
  {
    TrialName: S.optional(S.String),
    TrialArn: S.optional(S.String),
    DisplayName: S.optional(S.String),
    ExperimentName: S.optional(S.String),
    Source: S.optional(TrialSource),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    MetadataProperties: S.optional(MetadataProperties),
  },
  ns,
) {}
export class DescribeTrialComponentResponse extends S.Class<DescribeTrialComponentResponse>(
  "DescribeTrialComponentResponse",
)(
  {
    TrialComponentName: S.optional(S.String),
    TrialComponentArn: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Source: S.optional(TrialComponentSource),
    Status: S.optional(TrialComponentStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    Parameters: S.optional(TrialComponentParameters),
    InputArtifacts: S.optional(TrialComponentArtifacts),
    OutputArtifacts: S.optional(TrialComponentArtifacts),
    MetadataProperties: S.optional(MetadataProperties),
    Metrics: S.optional(TrialComponentMetricSummaries),
    LineageGroupArn: S.optional(S.String),
    Sources: S.optional(TrialComponentSources),
  },
  ns,
) {}
export class DescribeWorkteamResponse extends S.Class<DescribeWorkteamResponse>(
  "DescribeWorkteamResponse",
)({ Workteam: Workteam }, ns) {}
export class GetDeviceFleetReportResponse extends S.Class<GetDeviceFleetReportResponse>(
  "GetDeviceFleetReportResponse",
)(
  {
    DeviceFleetArn: S.String,
    DeviceFleetName: S.String,
    OutputConfig: S.optional(EdgeOutputConfig),
    Description: S.optional(S.String),
    ReportGenerated: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DeviceStats: S.optional(DeviceStats),
    AgentVersions: S.optional(AgentVersions),
    ModelStats: S.optional(EdgeModelStats),
  },
  ns,
) {}
export class GetSearchSuggestionsRequest extends S.Class<GetSearchSuggestionsRequest>(
  "GetSearchSuggestionsRequest",
)(
  { Resource: S.String, SuggestionQuery: S.optional(SuggestionQuery) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListActionsResponse extends S.Class<ListActionsResponse>(
  "ListActionsResponse",
)(
  {
    ActionSummaries: S.optional(ActionSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAlgorithmsOutput extends S.Class<ListAlgorithmsOutput>(
  "ListAlgorithmsOutput",
)(
  {
    AlgorithmSummaryList: AlgorithmSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAppImageConfigsResponse extends S.Class<ListAppImageConfigsResponse>(
  "ListAppImageConfigsResponse",
)(
  {
    NextToken: S.optional(S.String),
    AppImageConfigs: S.optional(AppImageConfigList),
  },
  ns,
) {}
export class ListAppsResponse extends S.Class<ListAppsResponse>(
  "ListAppsResponse",
)({ Apps: S.optional(AppList), NextToken: S.optional(S.String) }, ns) {}
export class ListArtifactsResponse extends S.Class<ListArtifactsResponse>(
  "ListArtifactsResponse",
)(
  {
    ArtifactSummaries: S.optional(ArtifactSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAssociationsResponse extends S.Class<ListAssociationsResponse>(
  "ListAssociationsResponse",
)(
  {
    AssociationSummaries: S.optional(AssociationSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAutoMLJobsResponse extends S.Class<ListAutoMLJobsResponse>(
  "ListAutoMLJobsResponse",
)(
  { AutoMLJobSummaries: AutoMLJobSummaries, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListClusterEventsResponse extends S.Class<ListClusterEventsResponse>(
  "ListClusterEventsResponse",
)(
  {
    NextToken: S.optional(S.String),
    Events: S.optional(ClusterEventSummaries),
  },
  ns,
) {}
export class ListClusterNodesResponse extends S.Class<ListClusterNodesResponse>(
  "ListClusterNodesResponse",
)(
  {
    NextToken: S.optional(S.String),
    ClusterNodeSummaries: ClusterNodeSummaries,
  },
  ns,
) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)(
  { NextToken: S.optional(S.String), ClusterSummaries: ClusterSummaries },
  ns,
) {}
export class ListClusterSchedulerConfigsResponse extends S.Class<ListClusterSchedulerConfigsResponse>(
  "ListClusterSchedulerConfigsResponse",
)(
  {
    ClusterSchedulerConfigSummaries: S.optional(
      ClusterSchedulerConfigSummaryList,
    ),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListCodeRepositoriesOutput extends S.Class<ListCodeRepositoriesOutput>(
  "ListCodeRepositoriesOutput",
)(
  {
    CodeRepositorySummaryList: CodeRepositorySummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListCompilationJobsResponse extends S.Class<ListCompilationJobsResponse>(
  "ListCompilationJobsResponse",
)(
  {
    CompilationJobSummaries: CompilationJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListComputeQuotasResponse extends S.Class<ListComputeQuotasResponse>(
  "ListComputeQuotasResponse",
)(
  {
    ComputeQuotaSummaries: S.optional(ComputeQuotaSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListContextsResponse extends S.Class<ListContextsResponse>(
  "ListContextsResponse",
)(
  {
    ContextSummaries: S.optional(ContextSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDataQualityJobDefinitionsResponse extends S.Class<ListDataQualityJobDefinitionsResponse>(
  "ListDataQualityJobDefinitionsResponse",
)(
  {
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDeviceFleetsResponse extends S.Class<ListDeviceFleetsResponse>(
  "ListDeviceFleetsResponse",
)(
  {
    DeviceFleetSummaries: DeviceFleetSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListDomainsResponse extends S.Class<ListDomainsResponse>(
  "ListDomainsResponse",
)({ Domains: S.optional(DomainList), NextToken: S.optional(S.String) }, ns) {}
export class ListEdgeDeploymentPlansResponse extends S.Class<ListEdgeDeploymentPlansResponse>(
  "ListEdgeDeploymentPlansResponse",
)(
  {
    EdgeDeploymentPlanSummaries: EdgeDeploymentPlanSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListEdgePackagingJobsResponse extends S.Class<ListEdgePackagingJobsResponse>(
  "ListEdgePackagingJobsResponse",
)(
  {
    EdgePackagingJobSummaries: EdgePackagingJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListEndpointConfigsOutput extends S.Class<ListEndpointConfigsOutput>(
  "ListEndpointConfigsOutput",
)(
  {
    EndpointConfigs: EndpointConfigSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListEndpointsOutput extends S.Class<ListEndpointsOutput>(
  "ListEndpointsOutput",
)({ Endpoints: EndpointSummaryList, NextToken: S.optional(S.String) }, ns) {}
export class ListExperimentsResponse extends S.Class<ListExperimentsResponse>(
  "ListExperimentsResponse",
)(
  {
    ExperimentSummaries: S.optional(ExperimentSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListFeatureGroupsResponse extends S.Class<ListFeatureGroupsResponse>(
  "ListFeatureGroupsResponse",
)(
  {
    FeatureGroupSummaries: FeatureGroupSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListFlowDefinitionsResponse extends S.Class<ListFlowDefinitionsResponse>(
  "ListFlowDefinitionsResponse",
)(
  {
    FlowDefinitionSummaries: FlowDefinitionSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListHubContentsResponse extends S.Class<ListHubContentsResponse>(
  "ListHubContentsResponse",
)(
  { HubContentSummaries: HubContentInfoList, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListHubsResponse extends S.Class<ListHubsResponse>(
  "ListHubsResponse",
)({ HubSummaries: HubInfoList, NextToken: S.optional(S.String) }, ns) {}
export class ListHumanTaskUisResponse extends S.Class<ListHumanTaskUisResponse>(
  "ListHumanTaskUisResponse",
)(
  {
    HumanTaskUiSummaries: HumanTaskUiSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListHyperParameterTuningJobsResponse extends S.Class<ListHyperParameterTuningJobsResponse>(
  "ListHyperParameterTuningJobsResponse",
)(
  {
    HyperParameterTuningJobSummaries: HyperParameterTuningJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListImagesResponse extends S.Class<ListImagesResponse>(
  "ListImagesResponse",
)({ Images: S.optional(Images), NextToken: S.optional(S.String) }, ns) {}
export class ListImageVersionsResponse extends S.Class<ListImageVersionsResponse>(
  "ListImageVersionsResponse",
)(
  { ImageVersions: S.optional(ImageVersions), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListInferenceComponentsOutput extends S.Class<ListInferenceComponentsOutput>(
  "ListInferenceComponentsOutput",
)(
  {
    InferenceComponents: InferenceComponentSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListInferenceExperimentsResponse extends S.Class<ListInferenceExperimentsResponse>(
  "ListInferenceExperimentsResponse",
)(
  {
    InferenceExperiments: S.optional(InferenceExperimentList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListInferenceRecommendationsJobsResponse extends S.Class<ListInferenceRecommendationsJobsResponse>(
  "ListInferenceRecommendationsJobsResponse",
)(
  {
    InferenceRecommendationsJobs: InferenceRecommendationsJobs,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLabelingJobsResponse extends S.Class<ListLabelingJobsResponse>(
  "ListLabelingJobsResponse",
)(
  {
    LabelingJobSummaryList: S.optional(LabelingJobSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLineageGroupsResponse extends S.Class<ListLineageGroupsResponse>(
  "ListLineageGroupsResponse",
)(
  {
    LineageGroupSummaries: S.optional(LineageGroupSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMlflowAppsResponse extends S.Class<ListMlflowAppsResponse>(
  "ListMlflowAppsResponse",
)(
  {
    Summaries: S.optional(MlflowAppSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMlflowTrackingServersResponse extends S.Class<ListMlflowTrackingServersResponse>(
  "ListMlflowTrackingServersResponse",
)(
  {
    TrackingServerSummaries: S.optional(TrackingServerSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelCardExportJobsResponse extends S.Class<ListModelCardExportJobsResponse>(
  "ListModelCardExportJobsResponse",
)(
  {
    ModelCardExportJobSummaries: ModelCardExportJobSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelCardsResponse extends S.Class<ListModelCardsResponse>(
  "ListModelCardsResponse",
)(
  { ModelCardSummaries: ModelCardSummaryList, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListModelCardVersionsResponse extends S.Class<ListModelCardVersionsResponse>(
  "ListModelCardVersionsResponse",
)(
  {
    ModelCardVersionSummaryList: ModelCardVersionSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelMetadataRequest extends S.Class<ListModelMetadataRequest>(
  "ListModelMetadataRequest",
)(
  {
    SearchExpression: S.optional(ModelMetadataSearchExpression),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListModelPackageGroupsOutput extends S.Class<ListModelPackageGroupsOutput>(
  "ListModelPackageGroupsOutput",
)(
  {
    ModelPackageGroupSummaryList: ModelPackageGroupSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelPackagesOutput extends S.Class<ListModelPackagesOutput>(
  "ListModelPackagesOutput",
)(
  {
    ModelPackageSummaryList: ModelPackageSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListModelsOutput extends S.Class<ListModelsOutput>(
  "ListModelsOutput",
)({ Models: ModelSummaryList, NextToken: S.optional(S.String) }, ns) {}
export class ListMonitoringAlertHistoryResponse extends S.Class<ListMonitoringAlertHistoryResponse>(
  "ListMonitoringAlertHistoryResponse",
)(
  {
    MonitoringAlertHistory: S.optional(MonitoringAlertHistoryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMonitoringSchedulesResponse extends S.Class<ListMonitoringSchedulesResponse>(
  "ListMonitoringSchedulesResponse",
)(
  {
    MonitoringScheduleSummaries: MonitoringScheduleSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListNotebookInstanceLifecycleConfigsOutput extends S.Class<ListNotebookInstanceLifecycleConfigsOutput>(
  "ListNotebookInstanceLifecycleConfigsOutput",
)(
  {
    NextToken: S.optional(S.String),
    NotebookInstanceLifecycleConfigs: S.optional(
      NotebookInstanceLifecycleConfigSummaryList,
    ),
  },
  ns,
) {}
export class ListNotebookInstancesOutput extends S.Class<ListNotebookInstancesOutput>(
  "ListNotebookInstancesOutput",
)(
  {
    NextToken: S.optional(S.String),
    NotebookInstances: S.optional(NotebookInstanceSummaryList),
  },
  ns,
) {}
export class ListOptimizationJobsResponse extends S.Class<ListOptimizationJobsResponse>(
  "ListOptimizationJobsResponse",
)(
  {
    OptimizationJobSummaries: OptimizationJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPartnerAppsResponse extends S.Class<ListPartnerAppsResponse>(
  "ListPartnerAppsResponse",
)(
  {
    Summaries: S.optional(PartnerAppSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPipelineExecutionsResponse extends S.Class<ListPipelineExecutionsResponse>(
  "ListPipelineExecutionsResponse",
)(
  {
    PipelineExecutionSummaries: S.optional(PipelineExecutionSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPipelinesResponse extends S.Class<ListPipelinesResponse>(
  "ListPipelinesResponse",
)(
  {
    PipelineSummaries: S.optional(PipelineSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPipelineVersionsResponse extends S.Class<ListPipelineVersionsResponse>(
  "ListPipelineVersionsResponse",
)(
  {
    PipelineVersionSummaries: S.optional(PipelineVersionSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListProcessingJobsResponse extends S.Class<ListProcessingJobsResponse>(
  "ListProcessingJobsResponse",
)(
  {
    ProcessingJobSummaries: ProcessingJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListProjectsOutput extends S.Class<ListProjectsOutput>(
  "ListProjectsOutput",
)(
  { ProjectSummaryList: ProjectSummaryList, NextToken: S.optional(S.String) },
  ns,
) {}
export class ListResourceCatalogsResponse extends S.Class<ListResourceCatalogsResponse>(
  "ListResourceCatalogsResponse",
)(
  {
    ResourceCatalogs: S.optional(ResourceCatalogList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStageDevicesResponse extends S.Class<ListStageDevicesResponse>(
  "ListStageDevicesResponse",
)(
  {
    DeviceDeploymentSummaries: DeviceDeploymentSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListStudioLifecycleConfigsResponse extends S.Class<ListStudioLifecycleConfigsResponse>(
  "ListStudioLifecycleConfigsResponse",
)(
  {
    NextToken: S.optional(S.String),
    StudioLifecycleConfigs: S.optional(StudioLifecycleConfigsList),
  },
  ns,
) {}
export class ListTrainingJobsResponse extends S.Class<ListTrainingJobsResponse>(
  "ListTrainingJobsResponse",
)(
  {
    TrainingJobSummaries: TrainingJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTransformJobsResponse extends S.Class<ListTransformJobsResponse>(
  "ListTransformJobsResponse",
)(
  {
    TransformJobSummaries: TransformJobSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTrialComponentsResponse extends S.Class<ListTrialComponentsResponse>(
  "ListTrialComponentsResponse",
)(
  {
    TrialComponentSummaries: S.optional(TrialComponentSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTrialsResponse extends S.Class<ListTrialsResponse>(
  "ListTrialsResponse",
)(
  {
    TrialSummaries: S.optional(TrialSummaries),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListUltraServersByReservedCapacityResponse extends S.Class<ListUltraServersByReservedCapacityResponse>(
  "ListUltraServersByReservedCapacityResponse",
)({ NextToken: S.optional(S.String), UltraServers: UltraServers }, ns) {}
export class ListUserProfilesResponse extends S.Class<ListUserProfilesResponse>(
  "ListUserProfilesResponse",
)(
  {
    UserProfiles: S.optional(UserProfileList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class QueryLineageRequest extends S.Class<QueryLineageRequest>(
  "QueryLineageRequest",
)(
  {
    StartArns: S.optional(QueryLineageStartArns),
    Direction: S.optional(S.String),
    IncludeEdges: S.optional(S.Boolean),
    Filters: S.optional(QueryFilters),
    MaxDepth: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SearchRequest extends S.Class<SearchRequest>("SearchRequest")(
  {
    Resource: S.String,
    SearchExpression: S.optional(SearchExpression),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    CrossAccountFilterOption: S.optional(S.String),
    VisibilityConditions: S.optional(VisibilityConditionsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendPipelineExecutionStepSuccessResponse extends S.Class<SendPipelineExecutionStepSuccessResponse>(
  "SendPipelineExecutionStepSuccessResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class StartPipelineExecutionRequest extends S.Class<StartPipelineExecutionRequest>(
  "StartPipelineExecutionRequest",
)(
  {
    PipelineName: S.String,
    PipelineExecutionDisplayName: S.optional(S.String),
    PipelineParameters: S.optional(ParameterList),
    PipelineExecutionDescription: S.optional(S.String),
    ClientRequestToken: S.String,
    ParallelismConfiguration: S.optional(ParallelismConfiguration),
    SelectiveExecutionConfig: S.optional(SelectiveExecutionConfig),
    PipelineVersionId: S.optional(S.Number),
    MlflowExperimentName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopInferenceExperimentResponse extends S.Class<StopInferenceExperimentResponse>(
  "StopInferenceExperimentResponse",
)({ InferenceExperimentArn: S.String }, ns) {}
export class UpdateCodeRepositoryOutput extends S.Class<UpdateCodeRepositoryOutput>(
  "UpdateCodeRepositoryOutput",
)({ CodeRepositoryArn: S.String }, ns) {}
export class UpdateDomainRequest extends S.Class<UpdateDomainRequest>(
  "UpdateDomainRequest",
)(
  {
    DomainId: S.String,
    DefaultUserSettings: S.optional(UserSettings),
    DomainSettingsForUpdate: S.optional(DomainSettingsForUpdate),
    AppSecurityGroupManagement: S.optional(S.String),
    DefaultSpaceSettings: S.optional(DefaultSpaceSettings),
    SubnetIds: S.optional(Subnets),
    AppNetworkAccessType: S.optional(S.String),
    TagPropagation: S.optional(S.String),
    VpcId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEndpointOutput extends S.Class<UpdateEndpointOutput>(
  "UpdateEndpointOutput",
)({ EndpointArn: S.String }, ns) {}
export class UpdateEndpointWeightsAndCapacitiesInput extends S.Class<UpdateEndpointWeightsAndCapacitiesInput>(
  "UpdateEndpointWeightsAndCapacitiesInput",
)(
  {
    EndpointName: S.String,
    DesiredWeightsAndCapacities: DesiredWeightAndCapacityList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFeatureGroupResponse extends S.Class<UpdateFeatureGroupResponse>(
  "UpdateFeatureGroupResponse",
)({ FeatureGroupArn: S.String }, ns) {}
export class UpdateTrainingJobResponse extends S.Class<UpdateTrainingJobResponse>(
  "UpdateTrainingJobResponse",
)({ TrainingJobArn: S.String }, ns) {}
export class BatchDescribeModelPackageSummary extends S.Class<BatchDescribeModelPackageSummary>(
  "BatchDescribeModelPackageSummary",
)({
  ModelPackageGroupName: S.String,
  ModelPackageVersion: S.optional(S.Number),
  ModelPackageArn: S.String,
  ModelPackageDescription: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  InferenceSpecification: InferenceSpecification,
  ModelPackageStatus: S.String,
  ModelApprovalStatus: S.optional(S.String),
  ModelPackageRegistrationType: S.optional(S.String),
}) {}
export class BatchDescribeModelPackageError extends S.Class<BatchDescribeModelPackageError>(
  "BatchDescribeModelPackageError",
)({ ErrorCode: S.String, ErrorResponse: S.String }) {}
export class AlgorithmValidationProfile extends S.Class<AlgorithmValidationProfile>(
  "AlgorithmValidationProfile",
)({
  ProfileName: S.String,
  TrainingJobDefinition: TrainingJobDefinition,
  TransformJobDefinition: S.optional(TransformJobDefinition),
}) {}
export const AlgorithmValidationProfiles = S.Array(AlgorithmValidationProfile);
export class AutoMLCandidateGenerationConfig extends S.Class<AutoMLCandidateGenerationConfig>(
  "AutoMLCandidateGenerationConfig",
)({
  FeatureSpecificationS3Uri: S.optional(S.String),
  AlgorithmsConfig: S.optional(AutoMLAlgorithmsConfig),
}) {}
export class TextGenerationJobConfig extends S.Class<TextGenerationJobConfig>(
  "TextGenerationJobConfig",
)({
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  BaseModelName: S.optional(S.String),
  TextGenerationHyperParameters: S.optional(TextGenerationHyperParameters),
  ModelAccessConfig: S.optional(ModelAccessConfig),
}) {}
export class HyperParameterTuningJobStrategyConfig extends S.Class<HyperParameterTuningJobStrategyConfig>(
  "HyperParameterTuningJobStrategyConfig",
)({ HyperbandStrategyConfig: S.optional(HyperbandStrategyConfig) }) {}
export class TuningJobCompletionCriteria extends S.Class<TuningJobCompletionCriteria>(
  "TuningJobCompletionCriteria",
)({
  TargetObjectiveMetricValue: S.optional(S.Number),
  BestObjectiveNotImproving: S.optional(BestObjectiveNotImproving),
  ConvergenceDetected: S.optional(ConvergenceDetected),
}) {}
export class TrafficPattern extends S.Class<TrafficPattern>("TrafficPattern")({
  TrafficType: S.optional(S.String),
  Phases: S.optional(Phases),
  Stairs: S.optional(Stairs),
}) {}
export class RecommendationJobContainerConfig extends S.Class<RecommendationJobContainerConfig>(
  "RecommendationJobContainerConfig",
)({
  Domain: S.optional(S.String),
  Task: S.optional(S.String),
  Framework: S.optional(S.String),
  FrameworkVersion: S.optional(S.String),
  PayloadConfig: S.optional(RecommendationJobPayloadConfig),
  NearestModelName: S.optional(S.String),
  SupportedInstanceTypes: S.optional(RecommendationJobSupportedInstanceTypes),
  SupportedEndpointType: S.optional(S.String),
  DataInputConfig: S.optional(S.String),
  SupportedResponseMIMETypes: S.optional(
    RecommendationJobSupportedResponseMIMETypes,
  ),
}) {}
export class ModelQuality extends S.Class<ModelQuality>("ModelQuality")({
  Statistics: S.optional(MetricsSource),
  Constraints: S.optional(MetricsSource),
}) {}
export class DriftCheckBias extends S.Class<DriftCheckBias>("DriftCheckBias")({
  ConfigFile: S.optional(FileSource),
  PreTrainingConstraints: S.optional(MetricsSource),
  PostTrainingConstraints: S.optional(MetricsSource),
}) {}
export class CfnCreateTemplateProvider extends S.Class<CfnCreateTemplateProvider>(
  "CfnCreateTemplateProvider",
)({
  TemplateName: S.String,
  TemplateURL: S.String,
  RoleARN: S.optional(S.String),
  Parameters: S.optional(CfnStackCreateParameters),
}) {}
export class AlgorithmStatusItem extends S.Class<AlgorithmStatusItem>(
  "AlgorithmStatusItem",
)({ Name: S.String, Status: S.String, FailureReason: S.optional(S.String) }) {}
export const AlgorithmStatusItemList = S.Array(AlgorithmStatusItem);
export const ActiveOperations = S.Record({ key: S.String, value: S.Number });
export class ClusterKubernetesConfigDetails extends S.Class<ClusterKubernetesConfigDetails>(
  "ClusterKubernetesConfigDetails",
)({
  CurrentLabels: S.optional(ClusterKubernetesLabels),
  DesiredLabels: S.optional(ClusterKubernetesLabels),
  CurrentTaints: S.optional(ClusterKubernetesTaints),
  DesiredTaints: S.optional(ClusterKubernetesTaints),
}) {}
export class EnvironmentConfigDetails extends S.Class<EnvironmentConfigDetails>(
  "EnvironmentConfigDetails",
)({
  FSxLustreConfig: S.optional(FSxLustreConfig),
  S3OutputPath: S.optional(S.String),
}) {}
export class ClusterInstancePlacement extends S.Class<ClusterInstancePlacement>(
  "ClusterInstancePlacement",
)({
  AvailabilityZone: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
}) {}
export class ClusterKubernetesConfigNodeDetails extends S.Class<ClusterKubernetesConfigNodeDetails>(
  "ClusterKubernetesConfigNodeDetails",
)({
  CurrentLabels: S.optional(ClusterKubernetesLabels),
  DesiredLabels: S.optional(ClusterKubernetesLabels),
  CurrentTaints: S.optional(ClusterKubernetesTaints),
  DesiredTaints: S.optional(ClusterKubernetesTaints),
}) {}
export class EdgeDeploymentStatus extends S.Class<EdgeDeploymentStatus>(
  "EdgeDeploymentStatus",
)({
  StageStatus: S.String,
  EdgeDeploymentSuccessInStage: S.Number,
  EdgeDeploymentPendingInStage: S.Number,
  EdgeDeploymentFailedInStage: S.Number,
  EdgeDeploymentStatusMessage: S.optional(S.String),
  EdgeDeploymentStageStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DeployedImage extends S.Class<DeployedImage>("DeployedImage")({
  SpecifiedImage: S.optional(S.String),
  ResolvedImage: S.optional(S.String),
  ResolutionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DeployedImages = S.Array(DeployedImage);
export class ProductionVariantStatus extends S.Class<ProductionVariantStatus>(
  "ProductionVariantStatus",
)({
  Status: S.String,
  StatusMessage: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProductionVariantStatusList = S.Array(ProductionVariantStatus);
export class PendingProductionVariantSummary extends S.Class<PendingProductionVariantSummary>(
  "PendingProductionVariantSummary",
)({
  VariantName: S.String,
  DeployedImages: S.optional(DeployedImages),
  CurrentWeight: S.optional(S.Number),
  DesiredWeight: S.optional(S.Number),
  CurrentInstanceCount: S.optional(S.Number),
  DesiredInstanceCount: S.optional(S.Number),
  InstanceType: S.optional(S.String),
  AcceleratorType: S.optional(S.String),
  VariantStatus: S.optional(ProductionVariantStatusList),
  CurrentServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  DesiredServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  ManagedInstanceScaling: S.optional(ProductionVariantManagedInstanceScaling),
  RoutingConfig: S.optional(ProductionVariantRoutingConfig),
}) {}
export const PendingProductionVariantSummaryList = S.Array(
  PendingProductionVariantSummary,
);
export class InferenceComponentContainerSpecificationSummary extends S.Class<InferenceComponentContainerSpecificationSummary>(
  "InferenceComponentContainerSpecificationSummary",
)({
  DeployedImage: S.optional(DeployedImage),
  ArtifactUrl: S.optional(S.String),
  Environment: S.optional(EnvironmentMap),
}) {}
export class InferenceComponentDataCacheConfigSummary extends S.Class<InferenceComponentDataCacheConfigSummary>(
  "InferenceComponentDataCacheConfigSummary",
)({ EnableCaching: S.Boolean }) {}
export class RecommendationMetrics extends S.Class<RecommendationMetrics>(
  "RecommendationMetrics",
)({
  CostPerHour: S.optional(S.Number),
  CostPerInference: S.optional(S.Number),
  MaxInvocations: S.optional(S.Number),
  ModelLatency: S.optional(S.Number),
  CpuUtilization: S.optional(S.Number),
  MemoryUtilization: S.optional(S.Number),
  ModelSetupTime: S.optional(S.Number),
}) {}
export class EndpointOutputConfiguration extends S.Class<EndpointOutputConfiguration>(
  "EndpointOutputConfiguration",
)({
  EndpointName: S.String,
  VariantName: S.String,
  InstanceType: S.optional(S.String),
  InitialInstanceCount: S.optional(S.Number),
  ServerlessConfig: S.optional(ProductionVariantServerlessConfig),
}) {}
export class InferenceMetrics extends S.Class<InferenceMetrics>(
  "InferenceMetrics",
)({ MaxInvocations: S.Number, ModelLatency: S.Number }) {}
export class RealTimeInferenceRecommendation extends S.Class<RealTimeInferenceRecommendation>(
  "RealTimeInferenceRecommendation",
)({
  RecommendationId: S.String,
  InstanceType: S.String,
  Environment: S.optional(EnvironmentMap),
}) {}
export const RealTimeInferenceRecommendations = S.Array(
  RealTimeInferenceRecommendation,
);
export class ModelPackageStatusItem extends S.Class<ModelPackageStatusItem>(
  "ModelPackageStatusItem",
)({ Name: S.String, Status: S.String, FailureReason: S.optional(S.String) }) {}
export const ModelPackageStatusItemList = S.Array(ModelPackageStatusItem);
export class EdgeModelSummary extends S.Class<EdgeModelSummary>(
  "EdgeModelSummary",
)({ ModelName: S.String, ModelVersion: S.String }) {}
export const EdgeModelSummaries = S.Array(EdgeModelSummary);
export class EnvironmentParameter extends S.Class<EnvironmentParameter>(
  "EnvironmentParameter",
)({ Key: S.String, ValueType: S.String, Value: S.String }) {}
export const EnvironmentParameters = S.Array(EnvironmentParameter);
export class ModelConfiguration extends S.Class<ModelConfiguration>(
  "ModelConfiguration",
)({
  InferenceSpecificationName: S.optional(S.String),
  EnvironmentParameters: S.optional(EnvironmentParameters),
  CompilationJobName: S.optional(S.String),
}) {}
export class RecommendationJobInferenceBenchmark extends S.Class<RecommendationJobInferenceBenchmark>(
  "RecommendationJobInferenceBenchmark",
)({
  Metrics: S.optional(RecommendationMetrics),
  EndpointMetrics: S.optional(InferenceMetrics),
  EndpointConfiguration: S.optional(EndpointOutputConfiguration),
  ModelConfiguration: ModelConfiguration,
  FailureReason: S.optional(S.String),
  InvocationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InvocationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class LabelCountersForWorkteam extends S.Class<LabelCountersForWorkteam>(
  "LabelCountersForWorkteam",
)({
  HumanLabeled: S.optional(S.Number),
  PendingHuman: S.optional(S.Number),
  Total: S.optional(S.Number),
}) {}
export class CacheHitResult extends S.Class<CacheHitResult>("CacheHitResult")({
  SourcePipelineExecutionArn: S.optional(S.String),
}) {}
export class SelectiveExecutionResult extends S.Class<SelectiveExecutionResult>(
  "SelectiveExecutionResult",
)({ SourcePipelineExecutionArn: S.optional(S.String) }) {}
export class SpaceSettingsSummary extends S.Class<SpaceSettingsSummary>(
  "SpaceSettingsSummary",
)({
  AppType: S.optional(S.String),
  RemoteAccess: S.optional(S.String),
  SpaceStorageSettings: S.optional(SpaceStorageSettings),
}) {}
export class SpaceSharingSettingsSummary extends S.Class<SpaceSharingSettingsSummary>(
  "SpaceSharingSettingsSummary",
)({ SharingType: S.optional(S.String) }) {}
export class OwnershipSettingsSummary extends S.Class<OwnershipSettingsSummary>(
  "OwnershipSettingsSummary",
)({ OwnerUserProfileName: S.optional(S.String) }) {}
export class ReservedCapacityOffering extends S.Class<ReservedCapacityOffering>(
  "ReservedCapacityOffering",
)({
  ReservedCapacityType: S.optional(S.String),
  UltraServerType: S.optional(S.String),
  UltraServerCount: S.optional(S.Number),
  InstanceType: S.String,
  InstanceCount: S.Number,
  AvailabilityZone: S.optional(S.String),
  DurationHours: S.optional(S.Number),
  DurationMinutes: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ReservedCapacityOfferings = S.Array(ReservedCapacityOffering);
export class InferenceComponentRollingUpdatePolicy extends S.Class<InferenceComponentRollingUpdatePolicy>(
  "InferenceComponentRollingUpdatePolicy",
)({
  MaximumBatchSize: InferenceComponentCapacitySize,
  WaitIntervalInSeconds: S.Number,
  MaximumExecutionTimeoutInSeconds: S.optional(S.Number),
  RollbackMaximumBatchSize: S.optional(InferenceComponentCapacitySize),
}) {}
export class CfnUpdateTemplateProvider extends S.Class<CfnUpdateTemplateProvider>(
  "CfnUpdateTemplateProvider",
)({
  TemplateName: S.String,
  TemplateURL: S.String,
  Parameters: S.optional(CfnStackUpdateParameters),
}) {}
export class IntegerParameterRangeSpecification extends S.Class<IntegerParameterRangeSpecification>(
  "IntegerParameterRangeSpecification",
)({ MinValue: S.String, MaxValue: S.String }) {}
export class ContinuousParameterRangeSpecification extends S.Class<ContinuousParameterRangeSpecification>(
  "ContinuousParameterRangeSpecification",
)({ MinValue: S.String, MaxValue: S.String }) {}
export class CategoricalParameterRangeSpecification extends S.Class<CategoricalParameterRangeSpecification>(
  "CategoricalParameterRangeSpecification",
)({ Values: ParameterValues }) {}
export const AggregationTransformations = S.Record({
  key: S.String,
  value: S.String,
});
export class CategoricalParameter extends S.Class<CategoricalParameter>(
  "CategoricalParameter",
)({ Name: S.String, Value: CategoricalParameterRangeValues }) {}
export const CategoricalParameters = S.Array(CategoricalParameter);
export class NodeAdditionResult extends S.Class<NodeAdditionResult>(
  "NodeAdditionResult",
)({ NodeLogicalId: S.String, InstanceGroupName: S.String, Status: S.String }) {}
export const NodeAdditionResultList = S.Array(NodeAdditionResult);
export class BatchAddClusterNodesError extends S.Class<BatchAddClusterNodesError>(
  "BatchAddClusterNodesError",
)({
  InstanceGroupName: S.String,
  ErrorCode: S.String,
  FailedCount: S.Number,
  Message: S.optional(S.String),
}) {}
export const BatchAddClusterNodesErrorList = S.Array(BatchAddClusterNodesError);
export const ModelPackageSummaries = S.Record({
  key: S.String,
  value: BatchDescribeModelPackageSummary,
});
export const BatchDescribeModelPackageErrorMap = S.Record({
  key: S.String,
  value: BatchDescribeModelPackageError,
});
export class AlgorithmValidationSpecification extends S.Class<AlgorithmValidationSpecification>(
  "AlgorithmValidationSpecification",
)({
  ValidationRole: S.String,
  ValidationProfiles: AlgorithmValidationProfiles,
}) {}
export class AutoMLChannel extends S.Class<AutoMLChannel>("AutoMLChannel")({
  DataSource: S.optional(AutoMLDataSource),
  CompressionType: S.optional(S.String),
  TargetAttributeName: S.String,
  ContentType: S.optional(S.String),
  ChannelType: S.optional(S.String),
  SampleWeightAttributeName: S.optional(S.String),
}) {}
export const AutoMLInputDataConfig = S.Array(AutoMLChannel);
export class AutoMLJobConfig extends S.Class<AutoMLJobConfig>(
  "AutoMLJobConfig",
)({
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  SecurityConfig: S.optional(AutoMLSecurityConfig),
  CandidateGenerationConfig: S.optional(AutoMLCandidateGenerationConfig),
  DataSplitConfig: S.optional(AutoMLDataSplitConfig),
  Mode: S.optional(S.String),
}) {}
export class AuthorizedUrl extends S.Class<AuthorizedUrl>("AuthorizedUrl")({
  Url: S.optional(S.String),
  LocalPath: S.optional(S.String),
}) {}
export const AuthorizedUrlConfigs = S.Array(AuthorizedUrl);
export class HyperParameterTuningJobConfig extends S.Class<HyperParameterTuningJobConfig>(
  "HyperParameterTuningJobConfig",
)({
  Strategy: S.String,
  StrategyConfig: S.optional(HyperParameterTuningJobStrategyConfig),
  HyperParameterTuningJobObjective: S.optional(
    HyperParameterTuningJobObjective,
  ),
  ResourceLimits: ResourceLimits,
  ParameterRanges: S.optional(ParameterRanges),
  TrainingJobEarlyStoppingType: S.optional(S.String),
  TuningJobCompletionCriteria: S.optional(TuningJobCompletionCriteria),
  RandomSeed: S.optional(S.Number),
}) {}
export class ModelMetrics extends S.Class<ModelMetrics>("ModelMetrics")({
  ModelQuality: S.optional(ModelQuality),
  ModelDataQuality: S.optional(ModelDataQuality),
  Bias: S.optional(Bias),
  Explainability: S.optional(Explainability),
}) {}
export class DriftCheckBaselines extends S.Class<DriftCheckBaselines>(
  "DriftCheckBaselines",
)({
  Bias: S.optional(DriftCheckBias),
  Explainability: S.optional(DriftCheckExplainability),
  ModelQuality: S.optional(DriftCheckModelQuality),
  ModelDataQuality: S.optional(DriftCheckModelDataQuality),
}) {}
export class CreateTemplateProvider extends S.Class<CreateTemplateProvider>(
  "CreateTemplateProvider",
)({ CfnTemplateProvider: S.optional(CfnCreateTemplateProvider) }) {}
export const CreateTemplateProviderList = S.Array(CreateTemplateProvider);
export class AlgorithmStatusDetails extends S.Class<AlgorithmStatusDetails>(
  "AlgorithmStatusDetails",
)({
  ValidationStatuses: S.optional(AlgorithmStatusItemList),
  ImageScanStatuses: S.optional(AlgorithmStatusItemList),
}) {}
export class ClusterInstanceGroupDetails extends S.Class<ClusterInstanceGroupDetails>(
  "ClusterInstanceGroupDetails",
)({
  CurrentCount: S.optional(S.Number),
  TargetCount: S.optional(S.Number),
  MinCount: S.optional(S.Number),
  InstanceGroupName: S.optional(S.String),
  InstanceType: S.optional(S.String),
  LifeCycleConfig: S.optional(ClusterLifeCycleConfig),
  ExecutionRole: S.optional(S.String),
  ThreadsPerCore: S.optional(S.Number),
  InstanceStorageConfigs: S.optional(ClusterInstanceStorageConfigs),
  OnStartDeepHealthChecks: S.optional(OnStartDeepHealthChecks),
  Status: S.optional(S.String),
  TrainingPlanArn: S.optional(S.String),
  TrainingPlanStatus: S.optional(S.String),
  OverrideVpcConfig: S.optional(VpcConfig),
  ScheduledUpdateConfig: S.optional(ScheduledUpdateConfig),
  CurrentImageId: S.optional(S.String),
  DesiredImageId: S.optional(S.String),
  ActiveOperations: S.optional(ActiveOperations),
  KubernetesConfig: S.optional(ClusterKubernetesConfigDetails),
  CapacityRequirements: S.optional(ClusterCapacityRequirements),
  TargetStateCount: S.optional(S.Number),
  SoftwareUpdateStatus: S.optional(S.String),
  ActiveSoftwareUpdateConfig: S.optional(DeploymentConfiguration),
}) {}
export const ClusterInstanceGroupDetailsList = S.Array(
  ClusterInstanceGroupDetails,
);
export class ClusterRestrictedInstanceGroupDetails extends S.Class<ClusterRestrictedInstanceGroupDetails>(
  "ClusterRestrictedInstanceGroupDetails",
)({
  CurrentCount: S.optional(S.Number),
  TargetCount: S.optional(S.Number),
  InstanceGroupName: S.optional(S.String),
  InstanceType: S.optional(S.String),
  ExecutionRole: S.optional(S.String),
  ThreadsPerCore: S.optional(S.Number),
  InstanceStorageConfigs: S.optional(ClusterInstanceStorageConfigs),
  OnStartDeepHealthChecks: S.optional(OnStartDeepHealthChecks),
  Status: S.optional(S.String),
  TrainingPlanArn: S.optional(S.String),
  TrainingPlanStatus: S.optional(S.String),
  OverrideVpcConfig: S.optional(VpcConfig),
  ScheduledUpdateConfig: S.optional(ScheduledUpdateConfig),
  EnvironmentConfig: S.optional(EnvironmentConfigDetails),
}) {}
export const ClusterRestrictedInstanceGroupDetailsList = S.Array(
  ClusterRestrictedInstanceGroupDetails,
);
export class ClusterNodeDetails extends S.Class<ClusterNodeDetails>(
  "ClusterNodeDetails",
)({
  InstanceGroupName: S.optional(S.String),
  InstanceId: S.optional(S.String),
  NodeLogicalId: S.optional(S.String),
  InstanceStatus: S.optional(ClusterInstanceStatusDetails),
  InstanceType: S.optional(S.String),
  LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastSoftwareUpdateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LifeCycleConfig: S.optional(ClusterLifeCycleConfig),
  OverrideVpcConfig: S.optional(VpcConfig),
  ThreadsPerCore: S.optional(S.Number),
  InstanceStorageConfigs: S.optional(ClusterInstanceStorageConfigs),
  PrivatePrimaryIp: S.optional(S.String),
  PrivatePrimaryIpv6: S.optional(S.String),
  PrivateDnsHostname: S.optional(S.String),
  Placement: S.optional(ClusterInstancePlacement),
  CurrentImageId: S.optional(S.String),
  DesiredImageId: S.optional(S.String),
  UltraServerInfo: S.optional(UltraServerInfo),
  KubernetesConfig: S.optional(ClusterKubernetesConfigNodeDetails),
  CapacityType: S.optional(S.String),
}) {}
export class DeploymentStageStatusSummary extends S.Class<DeploymentStageStatusSummary>(
  "DeploymentStageStatusSummary",
)({
  StageName: S.String,
  DeviceSelectionConfig: DeviceSelectionConfig,
  DeploymentConfig: EdgeDeploymentConfig,
  DeploymentStatus: EdgeDeploymentStatus,
}) {}
export const DeploymentStageStatusSummaries = S.Array(
  DeploymentStageStatusSummary,
);
export class PendingDeploymentSummary extends S.Class<PendingDeploymentSummary>(
  "PendingDeploymentSummary",
)({
  EndpointConfigName: S.String,
  ProductionVariants: S.optional(PendingProductionVariantSummaryList),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ShadowProductionVariants: S.optional(PendingProductionVariantSummaryList),
}) {}
export class InferenceComponentSpecificationSummary extends S.Class<InferenceComponentSpecificationSummary>(
  "InferenceComponentSpecificationSummary",
)({
  ModelName: S.optional(S.String),
  Container: S.optional(InferenceComponentContainerSpecificationSummary),
  StartupParameters: S.optional(InferenceComponentStartupParameters),
  ComputeResourceRequirements: S.optional(
    InferenceComponentComputeResourceRequirements,
  ),
  BaseInferenceComponentName: S.optional(S.String),
  DataCacheConfig: S.optional(InferenceComponentDataCacheConfigSummary),
}) {}
export class EndpointPerformance extends S.Class<EndpointPerformance>(
  "EndpointPerformance",
)({ Metrics: InferenceMetrics, EndpointInfo: EndpointInfo }) {}
export const EndpointPerformances = S.Array(EndpointPerformance);
export class DeploymentRecommendation extends S.Class<DeploymentRecommendation>(
  "DeploymentRecommendation",
)({
  RecommendationStatus: S.String,
  RealTimeInferenceRecommendations: S.optional(
    RealTimeInferenceRecommendations,
  ),
}) {}
export class ModelPackageStatusDetails extends S.Class<ModelPackageStatusDetails>(
  "ModelPackageStatusDetails",
)({
  ValidationStatuses: ModelPackageStatusItemList,
  ImageScanStatuses: S.optional(ModelPackageStatusItemList),
}) {}
export class ScalingPolicyMetric extends S.Class<ScalingPolicyMetric>(
  "ScalingPolicyMetric",
)({
  InvocationsPerInstance: S.optional(S.Number),
  ModelLatency: S.optional(S.Number),
}) {}
export class DeviceSummary extends S.Class<DeviceSummary>("DeviceSummary")({
  DeviceName: S.String,
  DeviceArn: S.String,
  Description: S.optional(S.String),
  DeviceFleetName: S.optional(S.String),
  IotThingName: S.optional(S.String),
  RegistrationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LatestHeartbeat: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Models: S.optional(EdgeModelSummaries),
  AgentVersion: S.optional(S.String),
}) {}
export const DeviceSummaries = S.Array(DeviceSummary);
export class InferenceRecommendationsJobStep extends S.Class<InferenceRecommendationsJobStep>(
  "InferenceRecommendationsJobStep",
)({
  StepType: S.String,
  JobName: S.String,
  Status: S.String,
  InferenceBenchmark: S.optional(RecommendationJobInferenceBenchmark),
}) {}
export const InferenceRecommendationsJobSteps = S.Array(
  InferenceRecommendationsJobStep,
);
export class LabelingJobForWorkteamSummary extends S.Class<LabelingJobForWorkteamSummary>(
  "LabelingJobForWorkteamSummary",
)({
  LabelingJobName: S.optional(S.String),
  JobReferenceCode: S.String,
  WorkRequesterAccountId: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LabelCounters: S.optional(LabelCountersForWorkteam),
  NumberOfHumanWorkersPerDataObject: S.optional(S.Number),
}) {}
export const LabelingJobForWorkteamSummaryList = S.Array(
  LabelingJobForWorkteamSummary,
);
export class SpaceDetails extends S.Class<SpaceDetails>("SpaceDetails")({
  DomainId: S.optional(S.String),
  SpaceName: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SpaceSettingsSummary: S.optional(SpaceSettingsSummary),
  SpaceSharingSettingsSummary: S.optional(SpaceSharingSettingsSummary),
  OwnershipSettingsSummary: S.optional(OwnershipSettingsSummary),
  SpaceDisplayName: S.optional(S.String),
}) {}
export const SpaceList = S.Array(SpaceDetails);
export class TrainingPlanSummary extends S.Class<TrainingPlanSummary>(
  "TrainingPlanSummary",
)({
  TrainingPlanArn: S.String,
  TrainingPlanName: S.String,
  Status: S.String,
  StatusMessage: S.optional(S.String),
  DurationHours: S.optional(S.Number),
  DurationMinutes: S.optional(S.Number),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpfrontFee: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  TotalInstanceCount: S.optional(S.Number),
  AvailableInstanceCount: S.optional(S.Number),
  InUseInstanceCount: S.optional(S.Number),
  TotalUltraServerCount: S.optional(S.Number),
  TargetResources: S.optional(SageMakerResourceNames),
  ReservedCapacitySummaries: S.optional(ReservedCapacitySummaries),
}) {}
export const TrainingPlanSummaries = S.Array(TrainingPlanSummary);
export class RenderingError extends S.Class<RenderingError>("RenderingError")({
  Code: S.String,
  Message: S.String,
}) {}
export const RenderingErrorList = S.Array(RenderingError);
export class TrainingPlanOffering extends S.Class<TrainingPlanOffering>(
  "TrainingPlanOffering",
)({
  TrainingPlanOfferingId: S.String,
  TargetResources: SageMakerResourceNames,
  RequestedStartTimeAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  RequestedEndTimeBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  DurationHours: S.optional(S.Number),
  DurationMinutes: S.optional(S.Number),
  UpfrontFee: S.optional(S.String),
  CurrencyCode: S.optional(S.String),
  ReservedCapacityOfferings: S.optional(ReservedCapacityOfferings),
}) {}
export const TrainingPlanOfferings = S.Array(TrainingPlanOffering);
export class InferenceComponentDeploymentConfig extends S.Class<InferenceComponentDeploymentConfig>(
  "InferenceComponentDeploymentConfig",
)({
  RollingUpdatePolicy: InferenceComponentRollingUpdatePolicy,
  AutoRollbackConfiguration: S.optional(AutoRollbackConfig),
}) {}
export class UpdateTemplateProvider extends S.Class<UpdateTemplateProvider>(
  "UpdateTemplateProvider",
)({ CfnTemplateProvider: S.optional(CfnUpdateTemplateProvider) }) {}
export const UpdateTemplateProviderList = S.Array(UpdateTemplateProvider);
export class ParameterRange extends S.Class<ParameterRange>("ParameterRange")({
  IntegerParameterRangeSpecification: S.optional(
    IntegerParameterRangeSpecification,
  ),
  ContinuousParameterRangeSpecification: S.optional(
    ContinuousParameterRangeSpecification,
  ),
  CategoricalParameterRangeSpecification: S.optional(
    CategoricalParameterRangeSpecification,
  ),
}) {}
export class EnvironmentParameterRanges extends S.Class<EnvironmentParameterRanges>(
  "EnvironmentParameterRanges",
)({ CategoricalParameterRanges: S.optional(CategoricalParameters) }) {}
export class TabularResolvedAttributes extends S.Class<TabularResolvedAttributes>(
  "TabularResolvedAttributes",
)({ ProblemType: S.optional(S.String) }) {}
export class TextGenerationResolvedAttributes extends S.Class<TextGenerationResolvedAttributes>(
  "TextGenerationResolvedAttributes",
)({ BaseModelName: S.optional(S.String) }) {}
export class Ec2CapacityReservation extends S.Class<Ec2CapacityReservation>(
  "Ec2CapacityReservation",
)({
  Ec2CapacityReservationId: S.optional(S.String),
  TotalInstanceCount: S.optional(S.Number),
  AvailableInstanceCount: S.optional(S.Number),
  UsedByCurrentEndpoint: S.optional(S.Number),
}) {}
export const Ec2CapacityReservationsList = S.Array(Ec2CapacityReservation);
export class CfnStackParameter extends S.Class<CfnStackParameter>(
  "CfnStackParameter",
)({ Key: S.String, Value: S.optional(S.String) }) {}
export const CfnStackParameters = S.Array(CfnStackParameter);
export class CfnStackDetail extends S.Class<CfnStackDetail>("CfnStackDetail")({
  Name: S.optional(S.String),
  Id: S.optional(S.String),
  StatusMessage: S.String,
}) {}
export class ModelDashboardIndicatorAction extends S.Class<ModelDashboardIndicatorAction>(
  "ModelDashboardIndicatorAction",
)({ Enabled: S.optional(S.Boolean) }) {}
export class TrainingJobStepMetadata extends S.Class<TrainingJobStepMetadata>(
  "TrainingJobStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class ProcessingJobStepMetadata extends S.Class<ProcessingJobStepMetadata>(
  "ProcessingJobStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class TransformJobStepMetadata extends S.Class<TransformJobStepMetadata>(
  "TransformJobStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class TuningJobStepMetaData extends S.Class<TuningJobStepMetaData>(
  "TuningJobStepMetaData",
)({ Arn: S.optional(S.String) }) {}
export class ModelStepMetadata extends S.Class<ModelStepMetadata>(
  "ModelStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class RegisterModelStepMetadata extends S.Class<RegisterModelStepMetadata>(
  "RegisterModelStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class ConditionStepMetadata extends S.Class<ConditionStepMetadata>(
  "ConditionStepMetadata",
)({ Outcome: S.optional(S.String) }) {}
export class CallbackStepMetadata extends S.Class<CallbackStepMetadata>(
  "CallbackStepMetadata",
)({
  CallbackToken: S.optional(S.String),
  SqsQueueUrl: S.optional(S.String),
  OutputParameters: S.optional(OutputParameterList),
}) {}
export class LambdaStepMetadata extends S.Class<LambdaStepMetadata>(
  "LambdaStepMetadata",
)({
  Arn: S.optional(S.String),
  OutputParameters: S.optional(OutputParameterList),
}) {}
export class EMRStepMetadata extends S.Class<EMRStepMetadata>(
  "EMRStepMetadata",
)({
  ClusterId: S.optional(S.String),
  StepId: S.optional(S.String),
  StepName: S.optional(S.String),
  LogFilePath: S.optional(S.String),
}) {}
export class QualityCheckStepMetadata extends S.Class<QualityCheckStepMetadata>(
  "QualityCheckStepMetadata",
)({
  CheckType: S.optional(S.String),
  BaselineUsedForDriftCheckStatistics: S.optional(S.String),
  BaselineUsedForDriftCheckConstraints: S.optional(S.String),
  CalculatedBaselineStatistics: S.optional(S.String),
  CalculatedBaselineConstraints: S.optional(S.String),
  ModelPackageGroupName: S.optional(S.String),
  ViolationReport: S.optional(S.String),
  CheckJobArn: S.optional(S.String),
  SkipCheck: S.optional(S.Boolean),
  RegisterNewBaseline: S.optional(S.Boolean),
}) {}
export class ClarifyCheckStepMetadata extends S.Class<ClarifyCheckStepMetadata>(
  "ClarifyCheckStepMetadata",
)({
  CheckType: S.optional(S.String),
  BaselineUsedForDriftCheckConstraints: S.optional(S.String),
  CalculatedBaselineConstraints: S.optional(S.String),
  ModelPackageGroupName: S.optional(S.String),
  ViolationReport: S.optional(S.String),
  CheckJobArn: S.optional(S.String),
  SkipCheck: S.optional(S.Boolean),
  RegisterNewBaseline: S.optional(S.Boolean),
}) {}
export class FailStepMetadata extends S.Class<FailStepMetadata>(
  "FailStepMetadata",
)({ ErrorMessage: S.optional(S.String) }) {}
export class AutoMLJobStepMetadata extends S.Class<AutoMLJobStepMetadata>(
  "AutoMLJobStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class EndpointStepMetadata extends S.Class<EndpointStepMetadata>(
  "EndpointStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class EndpointConfigStepMetadata extends S.Class<EndpointConfigStepMetadata>(
  "EndpointConfigStepMetadata",
)({ Arn: S.optional(S.String) }) {}
export class BedrockCustomModelMetadata extends S.Class<BedrockCustomModelMetadata>(
  "BedrockCustomModelMetadata",
)({ Arn: S.optional(S.String) }) {}
export class BedrockCustomModelDeploymentMetadata extends S.Class<BedrockCustomModelDeploymentMetadata>(
  "BedrockCustomModelDeploymentMetadata",
)({ Arn: S.optional(S.String) }) {}
export class BedrockProvisionedModelThroughputMetadata extends S.Class<BedrockProvisionedModelThroughputMetadata>(
  "BedrockProvisionedModelThroughputMetadata",
)({ Arn: S.optional(S.String) }) {}
export class BedrockModelImportMetadata extends S.Class<BedrockModelImportMetadata>(
  "BedrockModelImportMetadata",
)({ Arn: S.optional(S.String) }) {}
export class InferenceComponentMetadata extends S.Class<InferenceComponentMetadata>(
  "InferenceComponentMetadata",
)({ Arn: S.optional(S.String) }) {}
export class BatchAddClusterNodesResponse extends S.Class<BatchAddClusterNodesResponse>(
  "BatchAddClusterNodesResponse",
)(
  { Successful: NodeAdditionResultList, Failed: BatchAddClusterNodesErrorList },
  ns,
) {}
export class BatchDescribeModelPackageOutput extends S.Class<BatchDescribeModelPackageOutput>(
  "BatchDescribeModelPackageOutput",
)(
  {
    ModelPackageSummaries: S.optional(ModelPackageSummaries),
    BatchDescribeModelPackageErrorMap: S.optional(
      BatchDescribeModelPackageErrorMap,
    ),
  },
  ns,
) {}
export class CreateAppImageConfigRequest extends S.Class<CreateAppImageConfigRequest>(
  "CreateAppImageConfigRequest",
)(
  {
    AppImageConfigName: S.String,
    Tags: S.optional(TagList),
    KernelGatewayImageConfig: S.optional(KernelGatewayImageConfig),
    JupyterLabAppImageConfig: S.optional(JupyterLabAppImageConfig),
    CodeEditorAppImageConfig: S.optional(CodeEditorAppImageConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateArtifactResponse extends S.Class<CreateArtifactResponse>(
  "CreateArtifactResponse",
)({ ArtifactArn: S.optional(S.String) }, ns) {}
export class CreateAutoMLJobRequest extends S.Class<CreateAutoMLJobRequest>(
  "CreateAutoMLJobRequest",
)(
  {
    AutoMLJobName: S.String,
    InputDataConfig: AutoMLInputDataConfig,
    OutputDataConfig: AutoMLOutputDataConfig,
    ProblemType: S.optional(S.String),
    AutoMLJobObjective: S.optional(AutoMLJobObjective),
    AutoMLJobConfig: S.optional(AutoMLJobConfig),
    RoleArn: S.String,
    GenerateCandidateDefinitionsOnly: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ModelDeployConfig: S.optional(ModelDeployConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FillingTransformationMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    ClusterName: S.String,
    InstanceGroups: S.optional(ClusterInstanceGroupSpecifications),
    RestrictedInstanceGroups: S.optional(
      ClusterRestrictedInstanceGroupSpecifications,
    ),
    VpcConfig: S.optional(VpcConfig),
    Tags: S.optional(TagList),
    Orchestrator: S.optional(ClusterOrchestrator),
    NodeRecovery: S.optional(S.String),
    TieredStorageConfig: S.optional(ClusterTieredStorageConfig),
    NodeProvisioningMode: S.optional(S.String),
    ClusterRole: S.optional(S.String),
    AutoScaling: S.optional(ClusterAutoScalingConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterSchedulerConfigResponse extends S.Class<CreateClusterSchedulerConfigResponse>(
  "CreateClusterSchedulerConfigResponse",
)(
  { ClusterSchedulerConfigArn: S.String, ClusterSchedulerConfigId: S.String },
  ns,
) {}
export class CreateCompilationJobResponse extends S.Class<CreateCompilationJobResponse>(
  "CreateCompilationJobResponse",
)({ CompilationJobArn: S.String }, ns) {}
export class CreateComputeQuotaRequest extends S.Class<CreateComputeQuotaRequest>(
  "CreateComputeQuotaRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ClusterArn: S.String,
    ComputeQuotaConfig: ComputeQuotaConfig,
    ComputeQuotaTarget: ComputeQuotaTarget,
    ActivationState: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEdgeDeploymentPlanResponse extends S.Class<CreateEdgeDeploymentPlanResponse>(
  "CreateEdgeDeploymentPlanResponse",
)({ EdgeDeploymentPlanArn: S.String }, ns) {}
export class CreateEndpointInput extends S.Class<CreateEndpointInput>(
  "CreateEndpointInput",
)(
  {
    EndpointName: S.String,
    EndpointConfigName: S.String,
    DeploymentConfig: S.optional(DeploymentConfig),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFeatureGroupRequest extends S.Class<CreateFeatureGroupRequest>(
  "CreateFeatureGroupRequest",
)(
  {
    FeatureGroupName: S.String,
    RecordIdentifierFeatureName: S.String,
    EventTimeFeatureName: S.String,
    FeatureDefinitions: FeatureDefinitions,
    OnlineStoreConfig: S.optional(OnlineStoreConfig),
    OfflineStoreConfig: S.optional(OfflineStoreConfig),
    ThroughputConfig: S.optional(ThroughputConfig),
    RoleArn: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFlowDefinitionRequest extends S.Class<CreateFlowDefinitionRequest>(
  "CreateFlowDefinitionRequest",
)(
  {
    FlowDefinitionName: S.String,
    HumanLoopRequestSource: S.optional(HumanLoopRequestSource),
    HumanLoopActivationConfig: S.optional(HumanLoopActivationConfig),
    HumanLoopConfig: S.optional(HumanLoopConfig),
    OutputConfig: FlowDefinitionOutputConfig,
    RoleArn: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateHubContentPresignedUrlsResponse extends S.Class<CreateHubContentPresignedUrlsResponse>(
  "CreateHubContentPresignedUrlsResponse",
)(
  {
    AuthorizedUrlConfigs: AuthorizedUrlConfigs,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class CreateHyperParameterTuningJobRequest extends S.Class<CreateHyperParameterTuningJobRequest>(
  "CreateHyperParameterTuningJobRequest",
)(
  {
    HyperParameterTuningJobName: S.String,
    HyperParameterTuningJobConfig: HyperParameterTuningJobConfig,
    TrainingJobDefinition: S.optional(HyperParameterTrainingJobDefinition),
    TrainingJobDefinitions: S.optional(HyperParameterTrainingJobDefinitions),
    WarmStartConfig: S.optional(HyperParameterTuningJobWarmStartConfig),
    Tags: S.optional(TagList),
    Autotune: S.optional(Autotune),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateInferenceComponentOutput extends S.Class<CreateInferenceComponentOutput>(
  "CreateInferenceComponentOutput",
)({ InferenceComponentArn: S.String }, ns) {}
export class CreateInferenceExperimentRequest extends S.Class<CreateInferenceExperimentRequest>(
  "CreateInferenceExperimentRequest",
)(
  {
    Name: S.String,
    Type: S.String,
    Schedule: S.optional(InferenceExperimentSchedule),
    Description: S.optional(S.String),
    RoleArn: S.String,
    EndpointName: S.String,
    ModelVariants: ModelVariantConfigList,
    DataStorageConfig: S.optional(InferenceExperimentDataStorageConfig),
    ShadowModeConfig: ShadowModeConfig,
    KmsKey: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLabelingJobRequest extends S.Class<CreateLabelingJobRequest>(
  "CreateLabelingJobRequest",
)(
  {
    LabelingJobName: S.String,
    LabelAttributeName: S.String,
    InputConfig: LabelingJobInputConfig,
    OutputConfig: LabelingJobOutputConfig,
    RoleArn: S.String,
    LabelCategoryConfigS3Uri: S.optional(S.String),
    StoppingConditions: S.optional(LabelingJobStoppingConditions),
    LabelingJobAlgorithmsConfig: S.optional(LabelingJobAlgorithmsConfig),
    HumanTaskConfig: HumanTaskConfig,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelBiasJobDefinitionResponse extends S.Class<CreateModelBiasJobDefinitionResponse>(
  "CreateModelBiasJobDefinitionResponse",
)({ JobDefinitionArn: S.String }, ns) {}
export class CreateModelPackageInput extends S.Class<CreateModelPackageInput>(
  "CreateModelPackageInput",
)(
  {
    ModelPackageName: S.optional(S.String),
    ModelPackageGroupName: S.optional(S.String),
    ModelPackageDescription: S.optional(S.String),
    ModelPackageRegistrationType: S.optional(S.String),
    InferenceSpecification: S.optional(InferenceSpecification),
    ValidationSpecification: S.optional(ModelPackageValidationSpecification),
    SourceAlgorithmSpecification: S.optional(SourceAlgorithmSpecification),
    CertifyForMarketplace: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    ModelApprovalStatus: S.optional(S.String),
    MetadataProperties: S.optional(MetadataProperties),
    ModelMetrics: S.optional(ModelMetrics),
    ClientToken: S.optional(S.String),
    Domain: S.optional(S.String),
    Task: S.optional(S.String),
    SamplePayloadUrl: S.optional(S.String),
    CustomerMetadataProperties: S.optional(CustomerMetadataMap),
    DriftCheckBaselines: S.optional(DriftCheckBaselines),
    AdditionalInferenceSpecifications: S.optional(
      AdditionalInferenceSpecifications,
    ),
    SkipModelValidation: S.optional(S.String),
    SourceUri: S.optional(S.String),
    SecurityConfig: S.optional(ModelPackageSecurityConfig),
    ModelCard: S.optional(ModelPackageModelCard),
    ModelLifeCycle: S.optional(ModelLifeCycle),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMonitoringScheduleRequest extends S.Class<CreateMonitoringScheduleRequest>(
  "CreateMonitoringScheduleRequest",
)(
  {
    MonitoringScheduleName: S.String,
    MonitoringScheduleConfig: MonitoringScheduleConfig,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOptimizationJobRequest extends S.Class<CreateOptimizationJobRequest>(
  "CreateOptimizationJobRequest",
)(
  {
    OptimizationJobName: S.String,
    RoleArn: S.String,
    ModelSource: OptimizationJobModelSource,
    DeploymentInstanceType: S.String,
    MaxInstanceCount: S.optional(S.Number),
    OptimizationEnvironment: S.optional(OptimizationJobEnvironmentVariables),
    OptimizationConfigs: OptimizationConfigs,
    OutputConfig: OptimizationJobOutputConfig,
    StoppingCondition: StoppingCondition,
    Tags: S.optional(TagList),
    VpcConfig: S.optional(OptimizationVpcConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartnerAppResponse extends S.Class<CreatePartnerAppResponse>(
  "CreatePartnerAppResponse",
)({ Arn: S.optional(S.String) }, ns) {}
export class CreateProcessingJobRequest extends S.Class<CreateProcessingJobRequest>(
  "CreateProcessingJobRequest",
)(
  {
    ProcessingInputs: S.optional(ProcessingInputs),
    ProcessingOutputConfig: S.optional(ProcessingOutputConfig),
    ProcessingJobName: S.String,
    ProcessingResources: ProcessingResources,
    StoppingCondition: S.optional(ProcessingStoppingCondition),
    AppSpecification: AppSpecification,
    Environment: S.optional(ProcessingEnvironmentMap),
    NetworkConfig: S.optional(NetworkConfig),
    RoleArn: S.String,
    Tags: S.optional(TagList),
    ExperimentConfig: S.optional(ExperimentConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProjectInput extends S.Class<CreateProjectInput>(
  "CreateProjectInput",
)(
  {
    ProjectName: S.String,
    ProjectDescription: S.optional(S.String),
    ServiceCatalogProvisioningDetails: S.optional(
      ServiceCatalogProvisioningDetails,
    ),
    Tags: S.optional(TagList),
    TemplateProviders: S.optional(CreateTemplateProviderList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTransformJobRequest extends S.Class<CreateTransformJobRequest>(
  "CreateTransformJobRequest",
)(
  {
    TransformJobName: S.String,
    ModelName: S.String,
    MaxConcurrentTransforms: S.optional(S.Number),
    ModelClientConfig: S.optional(ModelClientConfig),
    MaxPayloadInMB: S.optional(S.Number),
    BatchStrategy: S.optional(S.String),
    Environment: S.optional(TransformEnvironmentMap),
    TransformInput: TransformInput,
    TransformOutput: TransformOutput,
    DataCaptureConfig: S.optional(BatchDataCaptureConfig),
    TransformResources: TransformResources,
    DataProcessing: S.optional(DataProcessing),
    Tags: S.optional(TagList),
    ExperimentConfig: S.optional(ExperimentConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTrialComponentResponse extends S.Class<CreateTrialComponentResponse>(
  "CreateTrialComponentResponse",
)({ TrialComponentArn: S.optional(S.String) }, ns) {}
export class CreateWorkforceResponse extends S.Class<CreateWorkforceResponse>(
  "CreateWorkforceResponse",
)({ WorkforceArn: S.String }, ns) {}
export class CreateWorkteamRequest extends S.Class<CreateWorkteamRequest>(
  "CreateWorkteamRequest",
)(
  {
    WorkteamName: S.String,
    WorkforceName: S.optional(S.String),
    MemberDefinitions: MemberDefinitions,
    Description: S.String,
    NotificationConfiguration: S.optional(NotificationConfiguration),
    WorkerAccessConfiguration: S.optional(WorkerAccessConfiguration),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeActionResponse extends S.Class<DescribeActionResponse>(
  "DescribeActionResponse",
)(
  {
    ActionName: S.optional(S.String),
    ActionArn: S.optional(S.String),
    Source: S.optional(ActionSource),
    ActionType: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    Properties: S.optional(LineageEntityParameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreatedBy: S.optional(UserContext),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    MetadataProperties: S.optional(MetadataProperties),
    LineageGroupArn: S.optional(S.String),
  },
  ns,
) {}
export class HyperParameterSpecification extends S.Class<HyperParameterSpecification>(
  "HyperParameterSpecification",
)({
  Name: S.String,
  Description: S.optional(S.String),
  Type: S.String,
  Range: S.optional(ParameterRange),
  IsTunable: S.optional(S.Boolean),
  IsRequired: S.optional(S.Boolean),
  DefaultValue: S.optional(S.String),
}) {}
export const HyperParameterSpecifications = S.Array(
  HyperParameterSpecification,
);
export class TrainingSpecification extends S.Class<TrainingSpecification>(
  "TrainingSpecification",
)({
  TrainingImage: S.String,
  TrainingImageDigest: S.optional(S.String),
  SupportedHyperParameters: S.optional(HyperParameterSpecifications),
  SupportedTrainingInstanceTypes: TrainingInstanceTypes,
  SupportsDistributedTraining: S.optional(S.Boolean),
  MetricDefinitions: S.optional(MetricDefinitionList),
  TrainingChannels: ChannelSpecifications,
  SupportedTuningJobObjectiveMetrics: S.optional(
    HyperParameterTuningJobObjectives,
  ),
  AdditionalS3DataSource: S.optional(AdditionalS3DataSource),
}) {}
export class DescribeAlgorithmOutput extends S.Class<DescribeAlgorithmOutput>(
  "DescribeAlgorithmOutput",
)(
  {
    AlgorithmName: S.String,
    AlgorithmArn: S.String,
    AlgorithmDescription: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    TrainingSpecification: TrainingSpecification,
    InferenceSpecification: S.optional(InferenceSpecification),
    ValidationSpecification: S.optional(AlgorithmValidationSpecification),
    AlgorithmStatus: S.String,
    AlgorithmStatusDetails: AlgorithmStatusDetails,
    ProductId: S.optional(S.String),
    CertifyForMarketplace: S.optional(S.Boolean),
  },
  ns,
) {}
export class DescribeClusterResponse extends S.Class<DescribeClusterResponse>(
  "DescribeClusterResponse",
)(
  {
    ClusterArn: S.String,
    ClusterName: S.optional(S.String),
    ClusterStatus: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureMessage: S.optional(S.String),
    InstanceGroups: ClusterInstanceGroupDetailsList,
    RestrictedInstanceGroups: S.optional(
      ClusterRestrictedInstanceGroupDetailsList,
    ),
    VpcConfig: S.optional(VpcConfig),
    Orchestrator: S.optional(ClusterOrchestrator),
    TieredStorageConfig: S.optional(ClusterTieredStorageConfig),
    NodeRecovery: S.optional(S.String),
    NodeProvisioningMode: S.optional(S.String),
    ClusterRole: S.optional(S.String),
    AutoScaling: S.optional(ClusterAutoScalingConfigOutput),
  },
  ns,
) {}
export const EksRoleAccessEntries = S.Array(S.String);
export class DescribeClusterNodeResponse extends S.Class<DescribeClusterNodeResponse>(
  "DescribeClusterNodeResponse",
)({ NodeDetails: ClusterNodeDetails }, ns) {}
export class DescribeEdgeDeploymentPlanResponse extends S.Class<DescribeEdgeDeploymentPlanResponse>(
  "DescribeEdgeDeploymentPlanResponse",
)(
  {
    EdgeDeploymentPlanArn: S.String,
    EdgeDeploymentPlanName: S.String,
    ModelConfigs: EdgeDeploymentModelConfigs,
    DeviceFleetName: S.String,
    EdgeDeploymentSuccess: S.optional(S.Number),
    EdgeDeploymentPending: S.optional(S.Number),
    EdgeDeploymentFailed: S.optional(S.Number),
    Stages: DeploymentStageStatusSummaries,
    NextToken: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeHyperParameterTuningJobResponse extends S.Class<DescribeHyperParameterTuningJobResponse>(
  "DescribeHyperParameterTuningJobResponse",
)(
  {
    HyperParameterTuningJobName: S.String,
    HyperParameterTuningJobArn: S.String,
    HyperParameterTuningJobConfig: HyperParameterTuningJobConfig,
    TrainingJobDefinition: S.optional(HyperParameterTrainingJobDefinition),
    TrainingJobDefinitions: S.optional(HyperParameterTrainingJobDefinitions),
    HyperParameterTuningJobStatus: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    HyperParameterTuningEndTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrainingJobStatusCounters: TrainingJobStatusCounters,
    ObjectiveStatusCounters: ObjectiveStatusCounters,
    BestTrainingJob: S.optional(HyperParameterTrainingJobSummary),
    OverallBestTrainingJob: S.optional(HyperParameterTrainingJobSummary),
    WarmStartConfig: S.optional(HyperParameterTuningJobWarmStartConfig),
    Autotune: S.optional(Autotune),
    FailureReason: S.optional(S.String),
    TuningJobCompletionDetails: S.optional(
      HyperParameterTuningJobCompletionDetails,
    ),
    ConsumedResources: S.optional(HyperParameterTuningJobConsumedResources),
  },
  ns,
) {}
export class DescribeInferenceComponentOutput extends S.Class<DescribeInferenceComponentOutput>(
  "DescribeInferenceComponentOutput",
)(
  {
    InferenceComponentName: S.String,
    InferenceComponentArn: S.String,
    EndpointName: S.String,
    EndpointArn: S.String,
    VariantName: S.optional(S.String),
    FailureReason: S.optional(S.String),
    Specification: S.optional(InferenceComponentSpecificationSummary),
    RuntimeConfig: S.optional(InferenceComponentRuntimeConfigSummary),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    InferenceComponentStatus: S.optional(S.String),
    LastDeploymentConfig: S.optional(InferenceComponentDeploymentConfig),
  },
  ns,
) {}
export class DescribeModelOutput extends S.Class<DescribeModelOutput>(
  "DescribeModelOutput",
)(
  {
    ModelName: S.String,
    PrimaryContainer: S.optional(ContainerDefinition),
    Containers: S.optional(ContainerDefinitionList),
    InferenceExecutionConfig: S.optional(InferenceExecutionConfig),
    ExecutionRoleArn: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ModelArn: S.String,
    EnableNetworkIsolation: S.optional(S.Boolean),
    DeploymentRecommendation: S.optional(DeploymentRecommendation),
  },
  ns,
) {}
export class DescribeModelPackageOutput extends S.Class<DescribeModelPackageOutput>(
  "DescribeModelPackageOutput",
)(
  {
    ModelPackageName: S.String,
    ModelPackageGroupName: S.optional(S.String),
    ModelPackageVersion: S.optional(S.Number),
    ModelPackageRegistrationType: S.optional(S.String),
    ModelPackageArn: S.String,
    ModelPackageDescription: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    InferenceSpecification: S.optional(InferenceSpecification),
    SourceAlgorithmSpecification: S.optional(SourceAlgorithmSpecification),
    ValidationSpecification: S.optional(ModelPackageValidationSpecification),
    ModelPackageStatus: S.String,
    ModelPackageStatusDetails: ModelPackageStatusDetails,
    CertifyForMarketplace: S.optional(S.Boolean),
    ModelApprovalStatus: S.optional(S.String),
    CreatedBy: S.optional(UserContext),
    MetadataProperties: S.optional(MetadataProperties),
    ModelMetrics: S.optional(ModelMetrics),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
    ApprovalDescription: S.optional(S.String),
    Domain: S.optional(S.String),
    Task: S.optional(S.String),
    SamplePayloadUrl: S.optional(S.String),
    CustomerMetadataProperties: S.optional(CustomerMetadataMap),
    DriftCheckBaselines: S.optional(DriftCheckBaselines),
    AdditionalInferenceSpecifications: S.optional(
      AdditionalInferenceSpecifications,
    ),
    SkipModelValidation: S.optional(S.String),
    SourceUri: S.optional(S.String),
    SecurityConfig: S.optional(ModelPackageSecurityConfig),
    ModelCard: S.optional(ModelPackageModelCard),
    ModelLifeCycle: S.optional(ModelLifeCycle),
  },
  ns,
) {}
export class DescribeWorkforceResponse extends S.Class<DescribeWorkforceResponse>(
  "DescribeWorkforceResponse",
)({ Workforce: Workforce }, ns) {}
export class ListDevicesResponse extends S.Class<ListDevicesResponse>(
  "ListDevicesResponse",
)({ DeviceSummaries: DeviceSummaries, NextToken: S.optional(S.String) }, ns) {}
export class ListInferenceRecommendationsJobStepsResponse extends S.Class<ListInferenceRecommendationsJobStepsResponse>(
  "ListInferenceRecommendationsJobStepsResponse",
)(
  {
    Steps: S.optional(InferenceRecommendationsJobSteps),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListLabelingJobsForWorkteamResponse extends S.Class<ListLabelingJobsForWorkteamResponse>(
  "ListLabelingJobsForWorkteamResponse",
)(
  {
    LabelingJobSummaryList: LabelingJobForWorkteamSummaryList,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSpacesResponse extends S.Class<ListSpacesResponse>(
  "ListSpacesResponse",
)({ Spaces: S.optional(SpaceList), NextToken: S.optional(S.String) }, ns) {}
export class ListTrainingPlansResponse extends S.Class<ListTrainingPlansResponse>(
  "ListTrainingPlansResponse",
)(
  {
    NextToken: S.optional(S.String),
    TrainingPlanSummaries: TrainingPlanSummaries,
  },
  ns,
) {}
export class RenderUiTemplateResponse extends S.Class<RenderUiTemplateResponse>(
  "RenderUiTemplateResponse",
)({ RenderedContent: S.String, Errors: RenderingErrorList }, ns) {}
export class SearchTrainingPlanOfferingsResponse extends S.Class<SearchTrainingPlanOfferingsResponse>(
  "SearchTrainingPlanOfferingsResponse",
)({ TrainingPlanOfferings: TrainingPlanOfferings }, ns) {}
export class StartPipelineExecutionResponse extends S.Class<StartPipelineExecutionResponse>(
  "StartPipelineExecutionResponse",
)({ PipelineExecutionArn: S.optional(S.String) }, ns) {}
export class UpdateClusterSoftwareRequest extends S.Class<UpdateClusterSoftwareRequest>(
  "UpdateClusterSoftwareRequest",
)(
  {
    ClusterName: S.String,
    InstanceGroups: S.optional(UpdateClusterSoftwareInstanceGroups),
    DeploymentConfig: S.optional(DeploymentConfiguration),
    ImageId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDomainResponse extends S.Class<UpdateDomainResponse>(
  "UpdateDomainResponse",
)({ DomainArn: S.optional(S.String) }, ns) {}
export class UpdateEndpointWeightsAndCapacitiesOutput extends S.Class<UpdateEndpointWeightsAndCapacitiesOutput>(
  "UpdateEndpointWeightsAndCapacitiesOutput",
)({ EndpointArn: S.String }, ns) {}
export class UpdateInferenceComponentInput extends S.Class<UpdateInferenceComponentInput>(
  "UpdateInferenceComponentInput",
)(
  {
    InferenceComponentName: S.String,
    Specification: S.optional(InferenceComponentSpecification),
    RuntimeConfig: S.optional(InferenceComponentRuntimeConfig),
    DeploymentConfig: S.optional(InferenceComponentDeploymentConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProjectInput extends S.Class<UpdateProjectInput>(
  "UpdateProjectInput",
)(
  {
    ProjectName: S.String,
    ProjectDescription: S.optional(S.String),
    ServiceCatalogProvisioningUpdateDetails: S.optional(
      ServiceCatalogProvisioningUpdateDetails,
    ),
    Tags: S.optional(TagList),
    TemplateProvidersToUpdate: S.optional(UpdateTemplateProviderList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EndpointInputConfiguration extends S.Class<EndpointInputConfiguration>(
  "EndpointInputConfiguration",
)({
  InstanceType: S.optional(S.String),
  ServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  InferenceSpecificationName: S.optional(S.String),
  EnvironmentParameterRanges: S.optional(EnvironmentParameterRanges),
}) {}
export const EndpointInputConfigurations = S.Array(EndpointInputConfiguration);
export const AutoMLProblemTypeResolvedAttributes = S.Union(
  S.Struct({ TabularResolvedAttributes: TabularResolvedAttributes }),
  S.Struct({
    TextGenerationResolvedAttributes: TextGenerationResolvedAttributes,
  }),
);
export class ProductionVariantCapacityReservationSummary extends S.Class<ProductionVariantCapacityReservationSummary>(
  "ProductionVariantCapacityReservationSummary",
)({
  MlReservationArn: S.optional(S.String),
  CapacityReservationPreference: S.optional(S.String),
  TotalInstanceCount: S.optional(S.Number),
  AvailableInstanceCount: S.optional(S.Number),
  UsedByCurrentEndpoint: S.optional(S.Number),
  Ec2CapacityReservations: S.optional(Ec2CapacityReservationsList),
}) {}
export class CfnTemplateProviderDetail extends S.Class<CfnTemplateProviderDetail>(
  "CfnTemplateProviderDetail",
)({
  TemplateName: S.String,
  TemplateURL: S.String,
  RoleARN: S.optional(S.String),
  Parameters: S.optional(CfnStackParameters),
  StackDetail: S.optional(CfnStackDetail),
}) {}
export class MonitoringAlertActions extends S.Class<MonitoringAlertActions>(
  "MonitoringAlertActions",
)({ ModelDashboardIndicator: S.optional(ModelDashboardIndicatorAction) }) {}
export const FillingTransformations = S.Record({
  key: S.String,
  value: FillingTransformationMap,
});
export class ClusterMetadata extends S.Class<ClusterMetadata>(
  "ClusterMetadata",
)({
  FailureMessage: S.optional(S.String),
  EksRoleAccessEntries: S.optional(EksRoleAccessEntries),
  SlrAccessEntry: S.optional(S.String),
}) {}
export class InstanceGroupScalingMetadata extends S.Class<InstanceGroupScalingMetadata>(
  "InstanceGroupScalingMetadata",
)({
  InstanceCount: S.optional(S.Number),
  TargetCount: S.optional(S.Number),
  MinCount: S.optional(S.Number),
  FailureMessage: S.optional(S.String),
}) {}
export const MapString2048 = S.Record({ key: S.String, value: S.String });
export class AssociationInfo extends S.Class<AssociationInfo>(
  "AssociationInfo",
)({ SourceArn: S.String, DestinationArn: S.String }) {}
export const AssociationInfoList = S.Array(AssociationInfo);
export class RecommendationJobInputConfig extends S.Class<RecommendationJobInputConfig>(
  "RecommendationJobInputConfig",
)({
  ModelPackageVersionArn: S.optional(S.String),
  ModelName: S.optional(S.String),
  JobDurationInSeconds: S.optional(S.Number),
  TrafficPattern: S.optional(TrafficPattern),
  ResourceLimit: S.optional(RecommendationJobResourceLimit),
  EndpointConfigurations: S.optional(EndpointInputConfigurations),
  VolumeKmsKeyId: S.optional(S.String),
  ContainerConfig: S.optional(RecommendationJobContainerConfig),
  Endpoints: S.optional(Endpoints),
  VpcConfig: S.optional(RecommendationJobVpcConfig),
}) {}
export class AutoMLResolvedAttributes extends S.Class<AutoMLResolvedAttributes>(
  "AutoMLResolvedAttributes",
)({
  AutoMLJobObjective: S.optional(AutoMLJobObjective),
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  AutoMLProblemTypeResolvedAttributes: S.optional(
    AutoMLProblemTypeResolvedAttributes,
  ),
}) {}
export const EfaEnis = S.Array(S.String);
export class ProductionVariantSummary extends S.Class<ProductionVariantSummary>(
  "ProductionVariantSummary",
)({
  VariantName: S.String,
  DeployedImages: S.optional(DeployedImages),
  CurrentWeight: S.optional(S.Number),
  DesiredWeight: S.optional(S.Number),
  CurrentInstanceCount: S.optional(S.Number),
  DesiredInstanceCount: S.optional(S.Number),
  VariantStatus: S.optional(ProductionVariantStatusList),
  CurrentServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  DesiredServerlessConfig: S.optional(ProductionVariantServerlessConfig),
  ManagedInstanceScaling: S.optional(ProductionVariantManagedInstanceScaling),
  RoutingConfig: S.optional(ProductionVariantRoutingConfig),
  CapacityReservationConfig: S.optional(
    ProductionVariantCapacityReservationSummary,
  ),
}) {}
export const ProductionVariantSummaryList = S.Array(ProductionVariantSummary);
export class InferenceRecommendation extends S.Class<InferenceRecommendation>(
  "InferenceRecommendation",
)({
  RecommendationId: S.optional(S.String),
  Metrics: S.optional(RecommendationMetrics),
  EndpointConfiguration: EndpointOutputConfiguration,
  ModelConfiguration: ModelConfiguration,
  InvocationEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InvocationStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const InferenceRecommendations = S.Array(InferenceRecommendation);
export class TemplateProviderDetail extends S.Class<TemplateProviderDetail>(
  "TemplateProviderDetail",
)({ CfnTemplateProviderDetail: S.optional(CfnTemplateProviderDetail) }) {}
export const TemplateProviderDetailList = S.Array(TemplateProviderDetail);
export class PropertyNameSuggestion extends S.Class<PropertyNameSuggestion>(
  "PropertyNameSuggestion",
)({ PropertyName: S.optional(S.String) }) {}
export const PropertyNameSuggestionList = S.Array(PropertyNameSuggestion);
export class ModelMetadataSummary extends S.Class<ModelMetadataSummary>(
  "ModelMetadataSummary",
)({
  Domain: S.String,
  Framework: S.String,
  Task: S.String,
  Model: S.String,
  FrameworkVersion: S.String,
}) {}
export const ModelMetadataSummaries = S.Array(ModelMetadataSummary);
export class MonitoringAlertSummary extends S.Class<MonitoringAlertSummary>(
  "MonitoringAlertSummary",
)({
  MonitoringAlertName: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  AlertStatus: S.String,
  DatapointsToAlert: S.Number,
  EvaluationPeriod: S.Number,
  Actions: MonitoringAlertActions,
}) {}
export const MonitoringAlertSummaryList = S.Array(MonitoringAlertSummary);
export class Vertex extends S.Class<Vertex>("Vertex")({
  Arn: S.optional(S.String),
  Type: S.optional(S.String),
  LineageType: S.optional(S.String),
}) {}
export const Vertices = S.Array(Vertex);
export class Edge extends S.Class<Edge>("Edge")({
  SourceArn: S.optional(S.String),
  DestinationArn: S.optional(S.String),
  AssociationType: S.optional(S.String),
}) {}
export const Edges = S.Array(Edge);
export class TotalHits extends S.Class<TotalHits>("TotalHits")({
  Value: S.optional(S.Number),
  Relation: S.optional(S.String),
}) {}
export class TimeSeriesTransformations extends S.Class<TimeSeriesTransformations>(
  "TimeSeriesTransformations",
)({
  Filling: S.optional(FillingTransformations),
  Aggregation: S.optional(AggregationTransformations),
}) {}
export class LineageMetadata extends S.Class<LineageMetadata>(
  "LineageMetadata",
)({
  ActionArns: S.optional(MapString2048),
  ArtifactArns: S.optional(MapString2048),
  ContextArns: S.optional(MapString2048),
  Associations: S.optional(AssociationInfoList),
}) {}
export class CreateAlgorithmInput extends S.Class<CreateAlgorithmInput>(
  "CreateAlgorithmInput",
)(
  {
    AlgorithmName: S.String,
    AlgorithmDescription: S.optional(S.String),
    TrainingSpecification: TrainingSpecification,
    InferenceSpecification: S.optional(InferenceSpecification),
    ValidationSpecification: S.optional(AlgorithmValidationSpecification),
    CertifyForMarketplace: S.optional(S.Boolean),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAppImageConfigResponse extends S.Class<CreateAppImageConfigResponse>(
  "CreateAppImageConfigResponse",
)({ AppImageConfigArn: S.optional(S.String) }, ns) {}
export class CreateAutoMLJobResponse extends S.Class<CreateAutoMLJobResponse>(
  "CreateAutoMLJobResponse",
)({ AutoMLJobArn: S.String }, ns) {}
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ ClusterArn: S.String }, ns) {}
export class CreateComputeQuotaResponse extends S.Class<CreateComputeQuotaResponse>(
  "CreateComputeQuotaResponse",
)({ ComputeQuotaArn: S.String, ComputeQuotaId: S.String }, ns) {}
export class CreateDataQualityJobDefinitionRequest extends S.Class<CreateDataQualityJobDefinitionRequest>(
  "CreateDataQualityJobDefinitionRequest",
)(
  {
    JobDefinitionName: S.String,
    DataQualityBaselineConfig: S.optional(DataQualityBaselineConfig),
    DataQualityAppSpecification: DataQualityAppSpecification,
    DataQualityJobInput: DataQualityJobInput,
    DataQualityJobOutputConfig: MonitoringOutputConfig,
    JobResources: MonitoringResources,
    NetworkConfig: S.optional(MonitoringNetworkConfig),
    RoleArn: S.String,
    StoppingCondition: S.optional(MonitoringStoppingCondition),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDomainRequest extends S.Class<CreateDomainRequest>(
  "CreateDomainRequest",
)(
  {
    DomainName: S.String,
    AuthMode: S.String,
    DefaultUserSettings: UserSettings,
    DomainSettings: S.optional(DomainSettings),
    SubnetIds: S.optional(Subnets),
    VpcId: S.optional(S.String),
    Tags: S.optional(TagList),
    AppNetworkAccessType: S.optional(S.String),
    HomeEfsFileSystemKmsKeyId: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    AppSecurityGroupManagement: S.optional(S.String),
    TagPropagation: S.optional(S.String),
    DefaultSpaceSettings: S.optional(DefaultSpaceSettings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointOutput extends S.Class<CreateEndpointOutput>(
  "CreateEndpointOutput",
)({ EndpointArn: S.String }, ns) {}
export class CreateEndpointConfigInput extends S.Class<CreateEndpointConfigInput>(
  "CreateEndpointConfigInput",
)(
  {
    EndpointConfigName: S.String,
    ProductionVariants: ProductionVariantList,
    DataCaptureConfig: S.optional(DataCaptureConfig),
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    AsyncInferenceConfig: S.optional(AsyncInferenceConfig),
    ExplainerConfig: S.optional(ExplainerConfig),
    ShadowProductionVariants: S.optional(ProductionVariantList),
    ExecutionRoleArn: S.optional(S.String),
    VpcConfig: S.optional(VpcConfig),
    EnableNetworkIsolation: S.optional(S.Boolean),
    MetricsConfig: S.optional(MetricsConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFeatureGroupResponse extends S.Class<CreateFeatureGroupResponse>(
  "CreateFeatureGroupResponse",
)({ FeatureGroupArn: S.String }, ns) {}
export class CreateFlowDefinitionResponse extends S.Class<CreateFlowDefinitionResponse>(
  "CreateFlowDefinitionResponse",
)({ FlowDefinitionArn: S.String }, ns) {}
export class CreateHyperParameterTuningJobResponse extends S.Class<CreateHyperParameterTuningJobResponse>(
  "CreateHyperParameterTuningJobResponse",
)({ HyperParameterTuningJobArn: S.String }, ns) {}
export class CreateInferenceExperimentResponse extends S.Class<CreateInferenceExperimentResponse>(
  "CreateInferenceExperimentResponse",
)({ InferenceExperimentArn: S.String }, ns) {}
export class CreateInferenceRecommendationsJobRequest extends S.Class<CreateInferenceRecommendationsJobRequest>(
  "CreateInferenceRecommendationsJobRequest",
)(
  {
    JobName: S.String,
    JobType: S.String,
    RoleArn: S.String,
    InputConfig: RecommendationJobInputConfig,
    JobDescription: S.optional(S.String),
    StoppingConditions: S.optional(RecommendationJobStoppingConditions),
    OutputConfig: S.optional(RecommendationJobOutputConfig),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLabelingJobResponse extends S.Class<CreateLabelingJobResponse>(
  "CreateLabelingJobResponse",
)({ LabelingJobArn: S.String }, ns) {}
export class CreateModelInput extends S.Class<CreateModelInput>(
  "CreateModelInput",
)(
  {
    ModelName: S.String,
    PrimaryContainer: S.optional(ContainerDefinition),
    Containers: S.optional(ContainerDefinitionList),
    InferenceExecutionConfig: S.optional(InferenceExecutionConfig),
    ExecutionRoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
    VpcConfig: S.optional(VpcConfig),
    EnableNetworkIsolation: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateModelPackageOutput extends S.Class<CreateModelPackageOutput>(
  "CreateModelPackageOutput",
)({ ModelPackageArn: S.String }, ns) {}
export class CreateMonitoringScheduleResponse extends S.Class<CreateMonitoringScheduleResponse>(
  "CreateMonitoringScheduleResponse",
)({ MonitoringScheduleArn: S.String }, ns) {}
export class CreateOptimizationJobResponse extends S.Class<CreateOptimizationJobResponse>(
  "CreateOptimizationJobResponse",
)({ OptimizationJobArn: S.String }, ns) {}
export class CreateProcessingJobResponse extends S.Class<CreateProcessingJobResponse>(
  "CreateProcessingJobResponse",
)({ ProcessingJobArn: S.String }, ns) {}
export class CreateProjectOutput extends S.Class<CreateProjectOutput>(
  "CreateProjectOutput",
)({ ProjectArn: S.String, ProjectId: S.String }, ns) {}
export class CreateSpaceRequest extends S.Class<CreateSpaceRequest>(
  "CreateSpaceRequest",
)(
  {
    DomainId: S.String,
    SpaceName: S.String,
    Tags: S.optional(TagList),
    SpaceSettings: S.optional(SpaceSettings),
    OwnershipSettings: S.optional(OwnershipSettings),
    SpaceSharingSettings: S.optional(SpaceSharingSettings),
    SpaceDisplayName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTrainingJobRequest extends S.Class<CreateTrainingJobRequest>(
  "CreateTrainingJobRequest",
)(
  {
    TrainingJobName: S.String,
    HyperParameters: S.optional(HyperParameters),
    AlgorithmSpecification: S.optional(AlgorithmSpecification),
    RoleArn: S.String,
    InputDataConfig: S.optional(InputDataConfig),
    OutputDataConfig: OutputDataConfig,
    ResourceConfig: S.optional(ResourceConfig),
    VpcConfig: S.optional(VpcConfig),
    StoppingCondition: S.optional(StoppingCondition),
    Tags: S.optional(TagList),
    EnableNetworkIsolation: S.optional(S.Boolean),
    EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
    EnableManagedSpotTraining: S.optional(S.Boolean),
    CheckpointConfig: S.optional(CheckpointConfig),
    DebugHookConfig: S.optional(DebugHookConfig),
    DebugRuleConfigurations: S.optional(DebugRuleConfigurations),
    TensorBoardOutputConfig: S.optional(TensorBoardOutputConfig),
    ExperimentConfig: S.optional(ExperimentConfig),
    ProfilerConfig: S.optional(ProfilerConfig),
    ProfilerRuleConfigurations: S.optional(ProfilerRuleConfigurations),
    Environment: S.optional(TrainingEnvironmentMap),
    RetryStrategy: S.optional(RetryStrategy),
    RemoteDebugConfig: S.optional(RemoteDebugConfig),
    InfraCheckConfig: S.optional(InfraCheckConfig),
    SessionChainingConfig: S.optional(SessionChainingConfig),
    ServerlessJobConfig: S.optional(ServerlessJobConfig),
    MlflowConfig: S.optional(MlflowConfig),
    ModelPackageConfig: S.optional(ModelPackageConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTransformJobResponse extends S.Class<CreateTransformJobResponse>(
  "CreateTransformJobResponse",
)({ TransformJobArn: S.String }, ns) {}
export class CreateWorkteamResponse extends S.Class<CreateWorkteamResponse>(
  "CreateWorkteamResponse",
)({ WorkteamArn: S.optional(S.String) }, ns) {}
export class DescribeAutoMLJobResponse extends S.Class<DescribeAutoMLJobResponse>(
  "DescribeAutoMLJobResponse",
)(
  {
    AutoMLJobName: S.String,
    AutoMLJobArn: S.String,
    InputDataConfig: AutoMLInputDataConfig,
    OutputDataConfig: AutoMLOutputDataConfig,
    RoleArn: S.String,
    AutoMLJobObjective: S.optional(AutoMLJobObjective),
    ProblemType: S.optional(S.String),
    AutoMLJobConfig: S.optional(AutoMLJobConfig),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.optional(S.String),
    PartialFailureReasons: S.optional(AutoMLPartialFailureReasons),
    BestCandidate: S.optional(AutoMLCandidate),
    AutoMLJobStatus: S.String,
    AutoMLJobSecondaryStatus: S.String,
    GenerateCandidateDefinitionsOnly: S.optional(S.Boolean),
    AutoMLJobArtifacts: S.optional(AutoMLJobArtifacts),
    ResolvedAttributes: S.optional(ResolvedAttributes),
    ModelDeployConfig: S.optional(ModelDeployConfig),
    ModelDeployResult: S.optional(ModelDeployResult),
  },
  ns,
) {}
export class TimeSeriesForecastingJobConfig extends S.Class<TimeSeriesForecastingJobConfig>(
  "TimeSeriesForecastingJobConfig",
)({
  FeatureSpecificationS3Uri: S.optional(S.String),
  CompletionCriteria: S.optional(AutoMLJobCompletionCriteria),
  ForecastFrequency: S.String,
  ForecastHorizon: S.Number,
  ForecastQuantiles: S.optional(ForecastQuantiles),
  Transformations: S.optional(TimeSeriesTransformations),
  TimeSeriesConfig: TimeSeriesConfig,
  HolidayConfig: S.optional(HolidayConfig),
  CandidateGenerationConfig: S.optional(CandidateGenerationConfig),
}) {}
export const AutoMLProblemTypeConfig = S.Union(
  S.Struct({ ImageClassificationJobConfig: ImageClassificationJobConfig }),
  S.Struct({ TextClassificationJobConfig: TextClassificationJobConfig }),
  S.Struct({ TimeSeriesForecastingJobConfig: TimeSeriesForecastingJobConfig }),
  S.Struct({ TabularJobConfig: TabularJobConfig }),
  S.Struct({ TextGenerationJobConfig: TextGenerationJobConfig }),
);
export class DescribeAutoMLJobV2Response extends S.Class<DescribeAutoMLJobV2Response>(
  "DescribeAutoMLJobV2Response",
)(
  {
    AutoMLJobName: S.String,
    AutoMLJobArn: S.String,
    AutoMLJobInputDataConfig: AutoMLJobInputDataConfig,
    OutputDataConfig: AutoMLOutputDataConfig,
    RoleArn: S.String,
    AutoMLJobObjective: S.optional(AutoMLJobObjective),
    AutoMLProblemTypeConfig: S.optional(AutoMLProblemTypeConfig),
    AutoMLProblemTypeConfigName: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.optional(S.String),
    PartialFailureReasons: S.optional(AutoMLPartialFailureReasons),
    BestCandidate: S.optional(AutoMLCandidate),
    AutoMLJobStatus: S.String,
    AutoMLJobSecondaryStatus: S.String,
    AutoMLJobArtifacts: S.optional(AutoMLJobArtifacts),
    ResolvedAttributes: S.optional(AutoMLResolvedAttributes),
    ModelDeployConfig: S.optional(ModelDeployConfig),
    ModelDeployResult: S.optional(ModelDeployResult),
    DataSplitConfig: S.optional(AutoMLDataSplitConfig),
    SecurityConfig: S.optional(AutoMLSecurityConfig),
    AutoMLComputeConfig: S.optional(AutoMLComputeConfig),
  },
  ns,
) {}
export class CapacityReservation extends S.Class<CapacityReservation>(
  "CapacityReservation",
)({ Arn: S.optional(S.String), Type: S.optional(S.String) }) {}
export class AdditionalEnis extends S.Class<AdditionalEnis>("AdditionalEnis")({
  EfaEnis: S.optional(EfaEnis),
}) {}
export class DescribeEndpointOutput extends S.Class<DescribeEndpointOutput>(
  "DescribeEndpointOutput",
)(
  {
    EndpointName: S.String,
    EndpointArn: S.String,
    EndpointConfigName: S.optional(S.String),
    ProductionVariants: S.optional(ProductionVariantSummaryList),
    DataCaptureConfig: S.optional(DataCaptureConfigSummary),
    EndpointStatus: S.String,
    FailureReason: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastDeploymentConfig: S.optional(DeploymentConfig),
    AsyncInferenceConfig: S.optional(AsyncInferenceConfig),
    PendingDeploymentSummary: S.optional(PendingDeploymentSummary),
    ExplainerConfig: S.optional(ExplainerConfig),
    ShadowProductionVariants: S.optional(ProductionVariantSummaryList),
    MetricsConfig: S.optional(MetricsConfig),
  },
  ns,
) {}
export class DescribeInferenceRecommendationsJobResponse extends S.Class<DescribeInferenceRecommendationsJobResponse>(
  "DescribeInferenceRecommendationsJobResponse",
)(
  {
    JobName: S.String,
    JobDescription: S.optional(S.String),
    JobType: S.String,
    JobArn: S.String,
    RoleArn: S.String,
    Status: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    FailureReason: S.optional(S.String),
    InputConfig: RecommendationJobInputConfig,
    StoppingConditions: S.optional(RecommendationJobStoppingConditions),
    InferenceRecommendations: S.optional(InferenceRecommendations),
    EndpointPerformances: S.optional(EndpointPerformances),
  },
  ns,
) {}
export class DescribeProjectOutput extends S.Class<DescribeProjectOutput>(
  "DescribeProjectOutput",
)(
  {
    ProjectArn: S.String,
    ProjectName: S.String,
    ProjectId: S.String,
    ProjectDescription: S.optional(S.String),
    ServiceCatalogProvisioningDetails: S.optional(
      ServiceCatalogProvisioningDetails,
    ),
    ServiceCatalogProvisionedProductDetails: S.optional(
      ServiceCatalogProvisionedProductDetails,
    ),
    ProjectStatus: S.String,
    TemplateProviderDetails: S.optional(TemplateProviderDetailList),
    CreatedBy: S.optional(UserContext),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedBy: S.optional(UserContext),
  },
  ns,
) {}
export class GetSearchSuggestionsResponse extends S.Class<GetSearchSuggestionsResponse>(
  "GetSearchSuggestionsResponse",
)({ PropertyNameSuggestions: S.optional(PropertyNameSuggestionList) }, ns) {}
export class ListModelMetadataResponse extends S.Class<ListModelMetadataResponse>(
  "ListModelMetadataResponse",
)(
  {
    ModelMetadataSummaries: ModelMetadataSummaries,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListMonitoringAlertsResponse extends S.Class<ListMonitoringAlertsResponse>(
  "ListMonitoringAlertsResponse",
)(
  {
    MonitoringAlertSummaries: S.optional(MonitoringAlertSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class QueryLineageResponse extends S.Class<QueryLineageResponse>(
  "QueryLineageResponse",
)(
  {
    Vertices: S.optional(Vertices),
    Edges: S.optional(Edges),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class UpdateClusterSoftwareResponse extends S.Class<UpdateClusterSoftwareResponse>(
  "UpdateClusterSoftwareResponse",
)({ ClusterArn: S.String }, ns) {}
export class UpdateInferenceComponentOutput extends S.Class<UpdateInferenceComponentOutput>(
  "UpdateInferenceComponentOutput",
)({ InferenceComponentArn: S.String }, ns) {}
export class UpdateProjectOutput extends S.Class<UpdateProjectOutput>(
  "UpdateProjectOutput",
)({ ProjectArn: S.String }, ns) {}
export class PipelineExecutionStepMetadata extends S.Class<PipelineExecutionStepMetadata>(
  "PipelineExecutionStepMetadata",
)({
  TrainingJob: S.optional(TrainingJobStepMetadata),
  ProcessingJob: S.optional(ProcessingJobStepMetadata),
  TransformJob: S.optional(TransformJobStepMetadata),
  TuningJob: S.optional(TuningJobStepMetaData),
  Model: S.optional(ModelStepMetadata),
  RegisterModel: S.optional(RegisterModelStepMetadata),
  Condition: S.optional(ConditionStepMetadata),
  Callback: S.optional(CallbackStepMetadata),
  Lambda: S.optional(LambdaStepMetadata),
  EMR: S.optional(EMRStepMetadata),
  QualityCheck: S.optional(QualityCheckStepMetadata),
  ClarifyCheck: S.optional(ClarifyCheckStepMetadata),
  Fail: S.optional(FailStepMetadata),
  AutoMLJob: S.optional(AutoMLJobStepMetadata),
  Endpoint: S.optional(EndpointStepMetadata),
  EndpointConfig: S.optional(EndpointConfigStepMetadata),
  BedrockCustomModel: S.optional(BedrockCustomModelMetadata),
  BedrockCustomModelDeployment: S.optional(
    BedrockCustomModelDeploymentMetadata,
  ),
  BedrockProvisionedModelThroughput: S.optional(
    BedrockProvisionedModelThroughputMetadata,
  ),
  BedrockModelImport: S.optional(BedrockModelImportMetadata),
  InferenceComponent: S.optional(InferenceComponentMetadata),
  Lineage: S.optional(LineageMetadata),
}) {}
export class TrainingJob extends S.Class<TrainingJob>("TrainingJob")({
  TrainingJobName: S.optional(S.String),
  TrainingJobArn: S.optional(S.String),
  TuningJobArn: S.optional(S.String),
  LabelingJobArn: S.optional(S.String),
  AutoMLJobArn: S.optional(S.String),
  ModelArtifacts: S.optional(ModelArtifacts),
  TrainingJobStatus: S.optional(S.String),
  SecondaryStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
  HyperParameters: S.optional(HyperParameters),
  AlgorithmSpecification: S.optional(AlgorithmSpecification),
  RoleArn: S.optional(S.String),
  InputDataConfig: S.optional(InputDataConfig),
  OutputDataConfig: S.optional(OutputDataConfig),
  ResourceConfig: S.optional(ResourceConfig),
  VpcConfig: S.optional(VpcConfig),
  StoppingCondition: S.optional(StoppingCondition),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TrainingEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  SecondaryStatusTransitions: S.optional(SecondaryStatusTransitions),
  FinalMetricDataList: S.optional(FinalMetricDataList),
  EnableNetworkIsolation: S.optional(S.Boolean),
  EnableInterContainerTrafficEncryption: S.optional(S.Boolean),
  EnableManagedSpotTraining: S.optional(S.Boolean),
  CheckpointConfig: S.optional(CheckpointConfig),
  TrainingTimeInSeconds: S.optional(S.Number),
  BillableTimeInSeconds: S.optional(S.Number),
  DebugHookConfig: S.optional(DebugHookConfig),
  ExperimentConfig: S.optional(ExperimentConfig),
  DebugRuleConfigurations: S.optional(DebugRuleConfigurations),
  TensorBoardOutputConfig: S.optional(TensorBoardOutputConfig),
  DebugRuleEvaluationStatuses: S.optional(DebugRuleEvaluationStatuses),
  OutputModelPackageArn: S.optional(S.String),
  ModelPackageConfig: S.optional(ModelPackageConfig),
  ProfilerConfig: S.optional(ProfilerConfig),
  Environment: S.optional(TrainingEnvironmentMap),
  RetryStrategy: S.optional(RetryStrategy),
  Tags: S.optional(TagList),
}) {}
export class Experiment extends S.Class<Experiment>("Experiment")({
  ExperimentName: S.optional(S.String),
  ExperimentArn: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Source: S.optional(ExperimentSource),
  Description: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  Tags: S.optional(TagList),
}) {}
export class ModelPackage extends S.Class<ModelPackage>("ModelPackage")({
  ModelPackageName: S.optional(S.String),
  ModelPackageGroupName: S.optional(S.String),
  ModelPackageVersion: S.optional(S.Number),
  ModelPackageRegistrationType: S.optional(S.String),
  ModelPackageArn: S.optional(S.String),
  ModelPackageDescription: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InferenceSpecification: S.optional(InferenceSpecification),
  SourceAlgorithmSpecification: S.optional(SourceAlgorithmSpecification),
  ValidationSpecification: S.optional(ModelPackageValidationSpecification),
  ModelPackageStatus: S.optional(S.String),
  ModelPackageStatusDetails: S.optional(ModelPackageStatusDetails),
  CertifyForMarketplace: S.optional(S.Boolean),
  ModelApprovalStatus: S.optional(S.String),
  CreatedBy: S.optional(UserContext),
  MetadataProperties: S.optional(MetadataProperties),
  ModelMetrics: S.optional(ModelMetrics),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  ApprovalDescription: S.optional(S.String),
  Domain: S.optional(S.String),
  Task: S.optional(S.String),
  SamplePayloadUrl: S.optional(S.String),
  AdditionalInferenceSpecifications: S.optional(
    AdditionalInferenceSpecifications,
  ),
  SourceUri: S.optional(S.String),
  SecurityConfig: S.optional(ModelPackageSecurityConfig),
  ModelCard: S.optional(ModelPackageModelCard),
  ModelLifeCycle: S.optional(ModelLifeCycle),
  Tags: S.optional(TagList),
  CustomerMetadataProperties: S.optional(CustomerMetadataMap),
  DriftCheckBaselines: S.optional(DriftCheckBaselines),
  SkipModelValidation: S.optional(S.String),
}) {}
export class ModelPackageGroup extends S.Class<ModelPackageGroup>(
  "ModelPackageGroup",
)({
  ModelPackageGroupName: S.optional(S.String),
  ModelPackageGroupArn: S.optional(S.String),
  ModelPackageGroupDescription: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  ModelPackageGroupStatus: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class Pipeline extends S.Class<Pipeline>("Pipeline")({
  PipelineArn: S.optional(S.String),
  PipelineName: S.optional(S.String),
  PipelineDisplayName: S.optional(S.String),
  PipelineDescription: S.optional(S.String),
  RoleArn: S.optional(S.String),
  PipelineStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastRunTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedBy: S.optional(UserContext),
  ParallelismConfiguration: S.optional(ParallelismConfiguration),
  Tags: S.optional(TagList),
}) {}
export class PipelineExecution extends S.Class<PipelineExecution>(
  "PipelineExecution",
)({
  PipelineArn: S.optional(S.String),
  PipelineExecutionArn: S.optional(S.String),
  PipelineExecutionDisplayName: S.optional(S.String),
  PipelineExecutionStatus: S.optional(S.String),
  PipelineExecutionDescription: S.optional(S.String),
  PipelineExperimentConfig: S.optional(PipelineExperimentConfig),
  FailureReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedBy: S.optional(UserContext),
  ParallelismConfiguration: S.optional(ParallelismConfiguration),
  SelectiveExecutionConfig: S.optional(SelectiveExecutionConfig),
  PipelineParameters: S.optional(ParameterList),
  PipelineVersionId: S.optional(S.Number),
  PipelineVersionDisplayName: S.optional(S.String),
}) {}
export class PipelineVersion extends S.Class<PipelineVersion>(
  "PipelineVersion",
)({
  PipelineArn: S.optional(S.String),
  PipelineVersionId: S.optional(S.Number),
  PipelineVersionDisplayName: S.optional(S.String),
  PipelineVersionDescription: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedBy: S.optional(UserContext),
  LastExecutedPipelineExecutionArn: S.optional(S.String),
  LastExecutedPipelineExecutionDisplayName: S.optional(S.String),
  LastExecutedPipelineExecutionStatus: S.optional(S.String),
}) {}
export class FeatureGroup extends S.Class<FeatureGroup>("FeatureGroup")({
  FeatureGroupArn: S.optional(S.String),
  FeatureGroupName: S.optional(S.String),
  RecordIdentifierFeatureName: S.optional(S.String),
  EventTimeFeatureName: S.optional(S.String),
  FeatureDefinitions: S.optional(FeatureDefinitions),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  OnlineStoreConfig: S.optional(OnlineStoreConfig),
  OfflineStoreConfig: S.optional(OfflineStoreConfig),
  RoleArn: S.optional(S.String),
  FeatureGroupStatus: S.optional(S.String),
  OfflineStoreStatus: S.optional(OfflineStoreStatus),
  LastUpdateStatus: S.optional(LastUpdateStatus),
  FailureReason: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class FeatureMetadata extends S.Class<FeatureMetadata>(
  "FeatureMetadata",
)({
  FeatureGroupArn: S.optional(S.String),
  FeatureGroupName: S.optional(S.String),
  FeatureName: S.optional(S.String),
  FeatureType: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Description: S.optional(S.String),
  Parameters: S.optional(FeatureParameters),
}) {}
export class Project extends S.Class<Project>("Project")({
  ProjectArn: S.optional(S.String),
  ProjectName: S.optional(S.String),
  ProjectId: S.optional(S.String),
  ProjectDescription: S.optional(S.String),
  ServiceCatalogProvisioningDetails: S.optional(
    ServiceCatalogProvisioningDetails,
  ),
  ServiceCatalogProvisionedProductDetails: S.optional(
    ServiceCatalogProvisionedProductDetails,
  ),
  ProjectStatus: S.optional(S.String),
  CreatedBy: S.optional(UserContext),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TemplateProviderDetails: S.optional(TemplateProviderDetailList),
  Tags: S.optional(TagList),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
}) {}
export class HyperParameterTuningJobSearchEntity extends S.Class<HyperParameterTuningJobSearchEntity>(
  "HyperParameterTuningJobSearchEntity",
)({
  HyperParameterTuningJobName: S.optional(S.String),
  HyperParameterTuningJobArn: S.optional(S.String),
  HyperParameterTuningJobConfig: S.optional(HyperParameterTuningJobConfig),
  TrainingJobDefinition: S.optional(HyperParameterTrainingJobDefinition),
  TrainingJobDefinitions: S.optional(HyperParameterTrainingJobDefinitions),
  HyperParameterTuningJobStatus: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  HyperParameterTuningEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TrainingJobStatusCounters: S.optional(TrainingJobStatusCounters),
  ObjectiveStatusCounters: S.optional(ObjectiveStatusCounters),
  BestTrainingJob: S.optional(HyperParameterTrainingJobSummary),
  OverallBestTrainingJob: S.optional(HyperParameterTrainingJobSummary),
  WarmStartConfig: S.optional(HyperParameterTuningJobWarmStartConfig),
  FailureReason: S.optional(S.String),
  TuningJobCompletionDetails: S.optional(
    HyperParameterTuningJobCompletionDetails,
  ),
  ConsumedResources: S.optional(HyperParameterTuningJobConsumedResources),
  Tags: S.optional(TagList),
}) {}
export class ModelCard extends S.Class<ModelCard>("ModelCard")({
  ModelCardArn: S.optional(S.String),
  ModelCardName: S.optional(S.String),
  ModelCardVersion: S.optional(S.Number),
  Content: S.optional(S.String),
  ModelCardStatus: S.optional(S.String),
  SecurityConfig: S.optional(ModelCardSecurityConfig),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  Tags: S.optional(TagList),
  ModelId: S.optional(S.String),
  RiskRating: S.optional(S.String),
  ModelPackageGroupName: S.optional(S.String),
}) {}
export class InstanceGroupMetadata extends S.Class<InstanceGroupMetadata>(
  "InstanceGroupMetadata",
)({
  FailureMessage: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  CapacityReservation: S.optional(CapacityReservation),
  SubnetId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIds),
  AmiOverride: S.optional(S.String),
}) {}
export class InstanceMetadata extends S.Class<InstanceMetadata>(
  "InstanceMetadata",
)({
  CustomerEni: S.optional(S.String),
  AdditionalEnis: S.optional(AdditionalEnis),
  CapacityReservation: S.optional(CapacityReservation),
  FailureMessage: S.optional(S.String),
  LcsExecutionState: S.optional(S.String),
  NodeLogicalId: S.optional(S.String),
}) {}
export class PipelineExecutionStep extends S.Class<PipelineExecutionStep>(
  "PipelineExecutionStep",
)({
  StepName: S.optional(S.String),
  StepDisplayName: S.optional(S.String),
  StepDescription: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StepStatus: S.optional(S.String),
  CacheHitResult: S.optional(CacheHitResult),
  FailureReason: S.optional(S.String),
  Metadata: S.optional(PipelineExecutionStepMetadata),
  AttemptCount: S.optional(S.Number),
  SelectiveExecutionResult: S.optional(SelectiveExecutionResult),
}) {}
export const PipelineExecutionStepList = S.Array(PipelineExecutionStep);
export const EventMetadata = S.Union(
  S.Struct({ Cluster: ClusterMetadata }),
  S.Struct({ InstanceGroup: InstanceGroupMetadata }),
  S.Struct({ InstanceGroupScaling: InstanceGroupScalingMetadata }),
  S.Struct({ Instance: InstanceMetadata }),
);
export class TrialComponentSimpleSummary extends S.Class<TrialComponentSimpleSummary>(
  "TrialComponentSimpleSummary",
)({
  TrialComponentName: S.optional(S.String),
  TrialComponentArn: S.optional(S.String),
  TrialComponentSource: S.optional(TrialComponentSource),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
}) {}
export const TrialComponentSimpleSummaries = S.Array(
  TrialComponentSimpleSummary,
);
export class Parent extends S.Class<Parent>("Parent")({
  TrialName: S.optional(S.String),
  ExperimentName: S.optional(S.String),
}) {}
export const Parents = S.Array(Parent);
export class MonitoringSchedule extends S.Class<MonitoringSchedule>(
  "MonitoringSchedule",
)({
  MonitoringScheduleArn: S.optional(S.String),
  MonitoringScheduleName: S.optional(S.String),
  MonitoringScheduleStatus: S.optional(S.String),
  MonitoringType: S.optional(S.String),
  FailureReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MonitoringScheduleConfig: S.optional(MonitoringScheduleConfig),
  EndpointName: S.optional(S.String),
  LastMonitoringExecutionSummary: S.optional(MonitoringExecutionSummary),
  Tags: S.optional(TagList),
}) {}
export const MonitoringScheduleList = S.Array(MonitoringSchedule);
export class Model extends S.Class<Model>("Model")({
  ModelName: S.optional(S.String),
  PrimaryContainer: S.optional(ContainerDefinition),
  Containers: S.optional(ContainerDefinitionList),
  InferenceExecutionConfig: S.optional(InferenceExecutionConfig),
  ExecutionRoleArn: S.optional(S.String),
  VpcConfig: S.optional(VpcConfig),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ModelArn: S.optional(S.String),
  EnableNetworkIsolation: S.optional(S.Boolean),
  Tags: S.optional(TagList),
  DeploymentRecommendation: S.optional(DeploymentRecommendation),
}) {}
export class ModelDashboardEndpoint extends S.Class<ModelDashboardEndpoint>(
  "ModelDashboardEndpoint",
)({
  EndpointName: S.String,
  EndpointArn: S.String,
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndpointStatus: S.String,
}) {}
export const ModelDashboardEndpoints = S.Array(ModelDashboardEndpoint);
export class TransformJob extends S.Class<TransformJob>("TransformJob")({
  TransformJobName: S.optional(S.String),
  TransformJobArn: S.optional(S.String),
  TransformJobStatus: S.optional(S.String),
  FailureReason: S.optional(S.String),
  ModelName: S.optional(S.String),
  MaxConcurrentTransforms: S.optional(S.Number),
  ModelClientConfig: S.optional(ModelClientConfig),
  MaxPayloadInMB: S.optional(S.Number),
  BatchStrategy: S.optional(S.String),
  Environment: S.optional(TransformEnvironmentMap),
  TransformInput: S.optional(TransformInput),
  TransformOutput: S.optional(TransformOutput),
  DataCaptureConfig: S.optional(BatchDataCaptureConfig),
  TransformResources: S.optional(TransformResources),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TransformStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TransformEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LabelingJobArn: S.optional(S.String),
  AutoMLJobArn: S.optional(S.String),
  DataProcessing: S.optional(DataProcessing),
  ExperimentConfig: S.optional(ExperimentConfig),
  Tags: S.optional(TagList),
}) {}
export class ModelDashboardMonitoringSchedule extends S.Class<ModelDashboardMonitoringSchedule>(
  "ModelDashboardMonitoringSchedule",
)({
  MonitoringScheduleArn: S.optional(S.String),
  MonitoringScheduleName: S.optional(S.String),
  MonitoringScheduleStatus: S.optional(S.String),
  MonitoringType: S.optional(S.String),
  FailureReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MonitoringScheduleConfig: S.optional(MonitoringScheduleConfig),
  EndpointName: S.optional(S.String),
  MonitoringAlertSummaries: S.optional(MonitoringAlertSummaryList),
  LastMonitoringExecutionSummary: S.optional(MonitoringExecutionSummary),
  BatchTransformInput: S.optional(BatchTransformInput),
}) {}
export const ModelDashboardMonitoringSchedules = S.Array(
  ModelDashboardMonitoringSchedule,
);
export class ModelDashboardModelCard extends S.Class<ModelDashboardModelCard>(
  "ModelDashboardModelCard",
)({
  ModelCardArn: S.optional(S.String),
  ModelCardName: S.optional(S.String),
  ModelCardVersion: S.optional(S.Number),
  ModelCardStatus: S.optional(S.String),
  SecurityConfig: S.optional(ModelCardSecurityConfig),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  Tags: S.optional(TagList),
  ModelId: S.optional(S.String),
  RiskRating: S.optional(S.String),
}) {}
export class CreateAlgorithmOutput extends S.Class<CreateAlgorithmOutput>(
  "CreateAlgorithmOutput",
)({ AlgorithmArn: S.String }, ns) {}
export class CreateAutoMLJobV2Request extends S.Class<CreateAutoMLJobV2Request>(
  "CreateAutoMLJobV2Request",
)(
  {
    AutoMLJobName: S.String,
    AutoMLJobInputDataConfig: AutoMLJobInputDataConfig,
    OutputDataConfig: AutoMLOutputDataConfig,
    AutoMLProblemTypeConfig: AutoMLProblemTypeConfig,
    RoleArn: S.String,
    Tags: S.optional(TagList),
    SecurityConfig: S.optional(AutoMLSecurityConfig),
    AutoMLJobObjective: S.optional(AutoMLJobObjective),
    ModelDeployConfig: S.optional(ModelDeployConfig),
    DataSplitConfig: S.optional(AutoMLDataSplitConfig),
    AutoMLComputeConfig: S.optional(AutoMLComputeConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDataQualityJobDefinitionResponse extends S.Class<CreateDataQualityJobDefinitionResponse>(
  "CreateDataQualityJobDefinitionResponse",
)({ JobDefinitionArn: S.String }, ns) {}
export class CreateDomainResponse extends S.Class<CreateDomainResponse>(
  "CreateDomainResponse",
)(
  {
    DomainArn: S.optional(S.String),
    DomainId: S.optional(S.String),
    Url: S.optional(S.String),
  },
  ns,
) {}
export class CreateEndpointConfigOutput extends S.Class<CreateEndpointConfigOutput>(
  "CreateEndpointConfigOutput",
)({ EndpointConfigArn: S.String }, ns) {}
export class CreateInferenceRecommendationsJobResponse extends S.Class<CreateInferenceRecommendationsJobResponse>(
  "CreateInferenceRecommendationsJobResponse",
)({ JobArn: S.String }, ns) {}
export class CreateModelOutput extends S.Class<CreateModelOutput>(
  "CreateModelOutput",
)({ ModelArn: S.String }, ns) {}
export class CreateSpaceResponse extends S.Class<CreateSpaceResponse>(
  "CreateSpaceResponse",
)({ SpaceArn: S.optional(S.String) }, ns) {}
export class CreateTrainingJobResponse extends S.Class<CreateTrainingJobResponse>(
  "CreateTrainingJobResponse",
)({ TrainingJobArn: S.String }, ns) {}
export class PredefinedMetricSpecification extends S.Class<PredefinedMetricSpecification>(
  "PredefinedMetricSpecification",
)({ PredefinedMetricType: S.optional(S.String) }) {}
export class CustomizedMetricSpecification extends S.Class<CustomizedMetricSpecification>(
  "CustomizedMetricSpecification",
)({
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
  Statistic: S.optional(S.String),
}) {}
export class ListPipelineExecutionStepsResponse extends S.Class<ListPipelineExecutionStepsResponse>(
  "ListPipelineExecutionStepsResponse",
)(
  {
    PipelineExecutionSteps: S.optional(PipelineExecutionStepList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class EventDetails extends S.Class<EventDetails>("EventDetails")({
  EventMetadata: S.optional(EventMetadata),
}) {}
export class Trial extends S.Class<Trial>("Trial")({
  TrialName: S.optional(S.String),
  TrialArn: S.optional(S.String),
  DisplayName: S.optional(S.String),
  ExperimentName: S.optional(S.String),
  Source: S.optional(TrialSource),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  MetadataProperties: S.optional(MetadataProperties),
  Tags: S.optional(TagList),
  TrialComponentSummaries: S.optional(TrialComponentSimpleSummaries),
}) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  EndpointName: S.String,
  EndpointArn: S.String,
  EndpointConfigName: S.String,
  ProductionVariants: S.optional(ProductionVariantSummaryList),
  DataCaptureConfig: S.optional(DataCaptureConfigSummary),
  EndpointStatus: S.String,
  FailureReason: S.optional(S.String),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  LastModifiedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  MonitoringSchedules: S.optional(MonitoringScheduleList),
  Tags: S.optional(TagList),
  ShadowProductionVariants: S.optional(ProductionVariantSummaryList),
}) {}
export class ModelDashboardModel extends S.Class<ModelDashboardModel>(
  "ModelDashboardModel",
)({
  Model: S.optional(Model),
  Endpoints: S.optional(ModelDashboardEndpoints),
  LastBatchTransformJob: S.optional(TransformJob),
  MonitoringSchedules: S.optional(ModelDashboardMonitoringSchedules),
  ModelCard: S.optional(ModelDashboardModelCard),
}) {}
export const MetricSpecification = S.Union(
  S.Struct({ Predefined: PredefinedMetricSpecification }),
  S.Struct({ Customized: CustomizedMetricSpecification }),
);
export class ProcessingJob extends S.Class<ProcessingJob>("ProcessingJob")({
  ProcessingInputs: S.optional(ProcessingInputs),
  ProcessingOutputConfig: S.optional(ProcessingOutputConfig),
  ProcessingJobName: S.optional(S.String),
  ProcessingResources: S.optional(ProcessingResources),
  StoppingCondition: S.optional(ProcessingStoppingCondition),
  AppSpecification: S.optional(AppSpecification),
  Environment: S.optional(ProcessingEnvironmentMap),
  NetworkConfig: S.optional(NetworkConfig),
  RoleArn: S.optional(S.String),
  ExperimentConfig: S.optional(ExperimentConfig),
  ProcessingJobArn: S.optional(S.String),
  ProcessingJobStatus: S.optional(S.String),
  ExitMessage: S.optional(S.String),
  FailureReason: S.optional(S.String),
  ProcessingEndTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ProcessingStartTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MonitoringScheduleArn: S.optional(S.String),
  AutoMLJobArn: S.optional(S.String),
  TrainingJobArn: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class ClusterEventDetail extends S.Class<ClusterEventDetail>(
  "ClusterEventDetail",
)({
  EventId: S.String,
  ClusterArn: S.String,
  ClusterName: S.String,
  InstanceGroupName: S.optional(S.String),
  InstanceId: S.optional(S.String),
  ResourceType: S.String,
  EventTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EventDetails: S.optional(EventDetails),
  Description: S.optional(S.String),
}) {}
export class TargetTrackingScalingPolicyConfiguration extends S.Class<TargetTrackingScalingPolicyConfiguration>(
  "TargetTrackingScalingPolicyConfiguration",
)({
  MetricSpecification: S.optional(MetricSpecification),
  TargetValue: S.optional(S.Number),
}) {}
export class TrialComponentSourceDetail extends S.Class<TrialComponentSourceDetail>(
  "TrialComponentSourceDetail",
)({
  SourceArn: S.optional(S.String),
  TrainingJob: S.optional(TrainingJob),
  ProcessingJob: S.optional(ProcessingJob),
  TransformJob: S.optional(TransformJob),
}) {}
export class CreateAutoMLJobV2Response extends S.Class<CreateAutoMLJobV2Response>(
  "CreateAutoMLJobV2Response",
)({ AutoMLJobArn: S.String }, ns) {}
export class DescribeClusterEventResponse extends S.Class<DescribeClusterEventResponse>(
  "DescribeClusterEventResponse",
)({ EventDetails: S.optional(ClusterEventDetail) }, ns) {}
export const ScalingPolicy = S.Union(
  S.Struct({ TargetTracking: TargetTrackingScalingPolicyConfiguration }),
);
export const ScalingPolicies = S.Array(ScalingPolicy);
export class TrialComponent extends S.Class<TrialComponent>("TrialComponent")({
  TrialComponentName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  TrialComponentArn: S.optional(S.String),
  Source: S.optional(TrialComponentSource),
  Status: S.optional(TrialComponentStatus),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedBy: S.optional(UserContext),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBy: S.optional(UserContext),
  Parameters: S.optional(TrialComponentParameters),
  InputArtifacts: S.optional(TrialComponentArtifacts),
  OutputArtifacts: S.optional(TrialComponentArtifacts),
  Metrics: S.optional(TrialComponentMetricSummaries),
  MetadataProperties: S.optional(MetadataProperties),
  SourceDetail: S.optional(TrialComponentSourceDetail),
  LineageGroupArn: S.optional(S.String),
  Tags: S.optional(TagList),
  Parents: S.optional(Parents),
  RunName: S.optional(S.String),
}) {}
export class DynamicScalingConfiguration extends S.Class<DynamicScalingConfiguration>(
  "DynamicScalingConfiguration",
)({
  MinCapacity: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  ScaleInCooldown: S.optional(S.Number),
  ScaleOutCooldown: S.optional(S.Number),
  ScalingPolicies: S.optional(ScalingPolicies),
}) {}
export class SearchRecord extends S.Class<SearchRecord>("SearchRecord")({
  TrainingJob: S.optional(TrainingJob),
  Experiment: S.optional(Experiment),
  Trial: S.optional(Trial),
  TrialComponent: S.optional(TrialComponent),
  Endpoint: S.optional(Endpoint),
  ModelPackage: S.optional(ModelPackage),
  ModelPackageGroup: S.optional(ModelPackageGroup),
  Pipeline: S.optional(Pipeline),
  PipelineExecution: S.optional(PipelineExecution),
  PipelineVersion: S.optional(PipelineVersion),
  FeatureGroup: S.optional(FeatureGroup),
  FeatureMetadata: S.optional(FeatureMetadata),
  Project: S.optional(Project),
  HyperParameterTuningJob: S.optional(HyperParameterTuningJobSearchEntity),
  ModelCard: S.optional(ModelCard),
  Model: S.optional(ModelDashboardModel),
}) {}
export const SearchResultsList = S.Array(SearchRecord);
export class GetScalingConfigurationRecommendationResponse extends S.Class<GetScalingConfigurationRecommendationResponse>(
  "GetScalingConfigurationRecommendationResponse",
)(
  {
    InferenceRecommendationsJobName: S.optional(S.String),
    RecommendationId: S.optional(S.String),
    EndpointName: S.optional(S.String),
    TargetCpuUtilizationPerCore: S.optional(S.Number),
    ScalingPolicyObjective: S.optional(ScalingPolicyObjective),
    Metric: S.optional(ScalingPolicyMetric),
    DynamicScalingConfiguration: S.optional(DynamicScalingConfiguration),
  },
  ns,
) {}
export class SearchResponse extends S.Class<SearchResponse>("SearchResponse")(
  {
    Results: S.optional(SearchResultsList),
    NextToken: S.optional(S.String),
    TotalHits: S.optional(TotalHits),
  },
  ns,
) {}

//# Errors
export class ResourceLimitExceeded extends S.TaggedError<ResourceLimitExceeded>()(
  "ResourceLimitExceeded",
  {},
) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  {},
) {}
export class ResourceInUse extends S.TaggedError<ResourceInUse>()(
  "ResourceInUse",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}

//# Operations
/**
 * Disables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
 */
export const disableSagemakerServicecatalogPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DisableSagemakerServicecatalogPortfolioInput,
    output: DisableSagemakerServicecatalogPortfolioOutput,
    errors: [],
  }));
/**
 * Enables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
 */
export const enableSagemakerServicecatalogPortfolio =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: EnableSagemakerServicecatalogPortfolioInput,
    output: EnableSagemakerServicecatalogPortfolioOutput,
    errors: [],
  }));
/**
 * Starts a SageMaker Edge Manager model packaging job. Edge Manager will use the model artifacts from the Amazon Simple Storage Service bucket that you specify. After the model has been packaged, Amazon SageMaker saves the resulting artifacts to an S3 bucket that you specify.
 */
export const createEdgePackagingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEdgePackagingJobRequest,
    output: CreateEdgePackagingJobResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Deletes the cluster policy of the cluster.
 */
export const deleteClusterSchedulerConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteClusterSchedulerConfigRequest,
    output: DeleteClusterSchedulerConfigResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Deletes the specified Git repository from your account.
 */
export const deleteCodeRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCodeRepositoryInput,
    output: DeleteCodeRepositoryResponse,
    errors: [],
  }),
);
/**
 * Deletes the specified compilation job. This action deletes only the compilation job resource in Amazon SageMaker AI. It doesn't delete other resources that are related to that job, such as the model artifacts that the job creates, the compilation logs in CloudWatch, the compiled model, or the IAM role.
 *
 * You can delete a compilation job only if its current status is `COMPLETED`, `FAILED`, or `STOPPED`. If the job status is `STARTING` or `INPROGRESS`, stop the job, and then delete it after its status becomes `STOPPED`.
 */
export const deleteCompilationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCompilationJobRequest,
    output: DeleteCompilationJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes the compute allocation from the cluster.
 */
export const deleteComputeQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComputeQuotaRequest,
  output: DeleteComputeQuotaResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes a data quality monitoring job definition.
 */
export const deleteDataQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteDataQualityJobDefinitionRequest,
    output: DeleteDataQualityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Deletes a fleet.
 */
export const deleteDeviceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeviceFleetRequest,
  output: DeleteDeviceFleetResponse,
  errors: [ResourceInUse],
}));
/**
 * Deletes an edge deployment plan if (and only if) all the stages in the plan are inactive or there are no stages in the plan.
 */
export const deleteEdgeDeploymentPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEdgeDeploymentPlanRequest,
    output: DeleteEdgeDeploymentPlanResponse,
    errors: [ResourceInUse],
  }),
);
/**
 * Delete a stage in an edge deployment plan if (and only if) the stage is inactive.
 */
export const deleteEdgeDeploymentStage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEdgeDeploymentStageRequest,
    output: DeleteEdgeDeploymentStageResponse,
    errors: [ResourceInUse],
  }),
);
/**
 * Deletes an endpoint. SageMaker frees up all of the resources that were deployed when the endpoint was created.
 *
 * SageMaker retires any custom KMS key grants associated with the endpoint, meaning you don't need to use the RevokeGrant API call.
 *
 * When you delete your endpoint, SageMaker asynchronously deletes associated endpoint resources such as KMS key grants. You might still see these resources in your account for a few minutes after deleting your endpoint. Do not delete or revoke the permissions for your ` ExecutionRoleArn `, otherwise SageMaker cannot delete these resources.
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointInput,
  output: DeleteEndpointResponse,
  errors: [],
}));
/**
 * Deletes an endpoint configuration. The `DeleteEndpointConfig` API deletes only the specified configuration. It does not delete endpoints created using the configuration.
 *
 * You must not delete an `EndpointConfig` in use by an endpoint that is live or while the `UpdateEndpoint` or `CreateEndpoint` operations are being performed on the endpoint. If you delete the `EndpointConfig` of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges.
 */
export const deleteEndpointConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEndpointConfigInput,
    output: DeleteEndpointConfigResponse,
    errors: [],
  }),
);
/**
 * Delete the `FeatureGroup` and any data that was written to the `OnlineStore` of the `FeatureGroup`. Data cannot be accessed from the `OnlineStore` immediately after `DeleteFeatureGroup` is called.
 *
 * Data written into the `OfflineStore` will not be deleted. The Amazon Web Services Glue database and tables that are automatically created for your `OfflineStore` are not deleted.
 *
 * Note that it can take approximately 10-15 minutes to delete an `OnlineStore` `FeatureGroup` with the `InMemory` `StorageType`.
 */
export const deleteFeatureGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFeatureGroupRequest,
  output: DeleteFeatureGroupResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes the specified flow definition.
 */
export const deleteFlowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteFlowDefinitionRequest,
    output: DeleteFlowDefinitionResponse,
    errors: [ResourceInUse, ResourceNotFound],
  }),
);
/**
 * Delete a hub.
 */
export const deleteHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHubRequest,
  output: DeleteHubResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Delete the contents of a hub.
 */
export const deleteHubContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHubContentRequest,
  output: DeleteHubContentResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Delete a hub content reference in order to remove a model from a private hub.
 */
export const deleteHubContentReference = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteHubContentReferenceRequest,
    output: DeleteHubContentReferenceResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Use this operation to delete a human task user interface (worker task template).
 *
 * To see a list of human task user interfaces (work task templates) in your account, use ListHumanTaskUis. When you delete a worker task template, it no longer appears when you call `ListHumanTaskUis`.
 */
export const deleteHumanTaskUi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHumanTaskUiRequest,
  output: DeleteHumanTaskUiResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes a hyperparameter tuning job. The `DeleteHyperParameterTuningJob` API deletes only the tuning job entry that was created in SageMaker when you called the `CreateHyperParameterTuningJob` API. It does not delete training jobs, artifacts, or the IAM role that you specified when creating the model.
 */
export const deleteHyperParameterTuningJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteHyperParameterTuningJobRequest,
    output: DeleteHyperParameterTuningJobResponse,
    errors: [],
  }));
/**
 * Deletes a SageMaker AI image and all versions of the image. The container images aren't deleted.
 */
export const deleteImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageRequest,
  output: DeleteImageResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes a version of a SageMaker AI image. The container image the version represents isn't deleted.
 */
export const deleteImageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteImageVersionRequest,
  output: DeleteImageVersionResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes an inference component.
 */
export const deleteInferenceComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInferenceComponentInput,
    output: DeleteInferenceComponentResponse,
    errors: [],
  }),
);
/**
 * Deletes a model. The `DeleteModel` API deletes only the model entry that was created in SageMaker when you called the `CreateModel` API. It does not delete model artifacts, inference code, or the IAM role that you specified when creating the model.
 */
export const deleteModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelInput,
  output: DeleteModelResponse,
  errors: [],
}));
/**
 * Deletes an Amazon SageMaker AI model bias job definition.
 */
export const deleteModelBiasJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteModelBiasJobDefinitionRequest,
    output: DeleteModelBiasJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Deletes an Amazon SageMaker Model Card.
 */
export const deleteModelCard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelCardRequest,
  output: DeleteModelCardResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Deletes an Amazon SageMaker AI model explainability job definition.
 */
export const deleteModelExplainabilityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteModelExplainabilityJobDefinitionRequest,
    output: DeleteModelExplainabilityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Deletes a model package.
 *
 * A model package is used to create SageMaker models or list on Amazon Web Services Marketplace. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in SageMaker.
 */
export const deleteModelPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteModelPackageInput,
  output: DeleteModelPackageResponse,
  errors: [ConflictException],
}));
/**
 * Deletes the specified model group.
 */
export const deleteModelPackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteModelPackageGroupInput,
    output: DeleteModelPackageGroupResponse,
    errors: [ConflictException],
  }),
);
/**
 * Deletes a model group resource policy.
 */
export const deleteModelPackageGroupPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteModelPackageGroupPolicyInput,
    output: DeleteModelPackageGroupPolicyResponse,
    errors: [],
  }));
/**
 * Deletes the secified model quality monitoring job definition.
 */
export const deleteModelQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteModelQualityJobDefinitionRequest,
    output: DeleteModelQualityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Deletes a monitoring schedule. Also stops the schedule had not already been stopped. This does not delete the job execution history of the monitoring schedule.
 */
export const deleteMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMonitoringScheduleRequest,
    output: DeleteMonitoringScheduleResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes an SageMaker AI notebook instance. Before you can delete a notebook instance, you must call the `StopNotebookInstance` API.
 *
 * When you delete a notebook instance, you lose all of your data. SageMaker AI removes the ML compute instance, and deletes the ML storage volume and the network interface associated with the notebook instance.
 */
export const deleteNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteNotebookInstanceInput,
    output: DeleteNotebookInstanceResponse,
    errors: [],
  }),
);
/**
 * Deletes a notebook instance lifecycle configuration.
 */
export const deleteNotebookInstanceLifecycleConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNotebookInstanceLifecycleConfigInput,
    output: DeleteNotebookInstanceLifecycleConfigResponse,
    errors: [],
  }));
/**
 * Deletes an optimization job.
 */
export const deleteOptimizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteOptimizationJobRequest,
    output: DeleteOptimizationJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes a processing job. After Amazon SageMaker deletes a processing job, all of the metadata for the processing job is lost. You can delete only processing jobs that are in a terminal state (`Stopped`, `Failed`, or `Completed`). You cannot delete a job that is in the `InProgress` or `Stopping` state. After deleting the job, you can reuse its name to create another processing job.
 */
export const deleteProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProcessingJobRequest,
  output: DeleteProcessingJobResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Delete the specified project.
 */
export const deleteProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectInput,
  output: DeleteProjectResponse,
  errors: [ConflictException],
}));
/**
 * Used to delete a space.
 */
export const deleteSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpaceRequest,
  output: DeleteSpaceResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes the Amazon SageMaker AI Studio Lifecycle Configuration. In order to delete the Lifecycle Configuration, there must be no running apps using the Lifecycle Configuration. You must also remove the Lifecycle Configuration from UserSettings in all Domains and UserProfiles.
 */
export const deleteStudioLifecycleConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStudioLifecycleConfigRequest,
    output: DeleteStudioLifecycleConfigResponse,
    errors: [ResourceInUse, ResourceNotFound],
  }),
);
/**
 * Deletes the specified tags from an SageMaker resource.
 *
 * To list a resource's tags, use the `ListTags` API.
 *
 * When you call this API to delete tags from a hyperparameter tuning job, the deleted tags are not removed from training jobs that the hyperparameter tuning job launched before you called this API.
 *
 * When you call this API to delete tags from a SageMaker Domain or User Profile, the deleted tags are not removed from Apps that the SageMaker Domain or User Profile launched before you called this API.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsInput,
  output: DeleteTagsOutput,
  errors: [],
}));
/**
 * Deletes a training job. After SageMaker deletes a training job, all of the metadata for the training job is lost. You can delete only training jobs that are in a terminal state (`Stopped`, `Failed`, or `Completed`) and don't retain an `Available` managed warm pool. You cannot delete a job that is in the `InProgress` or `Stopping` state. After deleting the job, you can reuse its name to create another training job.
 */
export const deleteTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrainingJobRequest,
  output: DeleteTrainingJobResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes a user profile. When a user profile is deleted, the user loses access to their EFS volume, including data, notebooks, and other artifacts.
 */
export const deleteUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserProfileRequest,
  output: DeleteUserProfileResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Use this operation to delete a workforce.
 *
 * If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use this operation to delete the existing workforce and then use CreateWorkforce to create a new workforce.
 *
 * If a private workforce contains one or more work teams, you must use the DeleteWorkteam operation to delete all work teams before you delete the workforce. If you try to delete a workforce that contains one or more work teams, you will receive a `ResourceInUse` error.
 */
export const deleteWorkforce = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkforceRequest,
  output: DeleteWorkforceResponse,
  errors: [],
}));
/**
 * Deregisters the specified devices. After you deregister a device, you will need to re-register the devices.
 */
export const deregisterDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterDevicesRequest,
  output: DeregisterDevicesResponse,
  errors: [],
}));
/**
 * Gets the status of Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
 */
export const getSagemakerServicecatalogPortfolioStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSagemakerServicecatalogPortfolioStatusInput,
    output: GetSagemakerServicecatalogPortfolioStatusOutput,
    errors: [],
  }));
/**
 * Starts a stage in an edge deployment plan.
 */
export const startEdgeDeploymentStage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartEdgeDeploymentStageRequest,
    output: StartEdgeDeploymentStageResponse,
    errors: [],
  }),
);
/**
 * Starts a previously stopped monitoring schedule.
 *
 * By default, when you successfully create a new schedule, the status of a monitoring schedule is `scheduled`.
 */
export const startMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMonitoringScheduleRequest,
    output: StartMonitoringScheduleResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Launches an ML compute instance with the latest version of the libraries and attaches your ML storage volume. After configuring the notebook instance, SageMaker AI sets the notebook instance status to `InService`. A notebook instance's status must be `InService` before you can connect to your Jupyter notebook.
 */
export const startNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartNotebookInstanceInput,
    output: StartNotebookInstanceResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * A method for forcing a running job to shut down.
 */
export const stopAutoMLJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAutoMLJobRequest,
  output: StopAutoMLJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a model compilation job.
 *
 * To stop a job, Amazon SageMaker AI sends the algorithm the SIGTERM signal. This gracefully shuts the job down. If the job hasn't stopped, it sends the SIGKILL signal.
 *
 * When it receives a `StopCompilationJob` request, Amazon SageMaker AI changes the `CompilationJobStatus` of the job to `Stopping`. After Amazon SageMaker stops the job, it sets the `CompilationJobStatus` to `Stopped`.
 */
export const stopCompilationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCompilationJobRequest,
  output: StopCompilationJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a stage in an edge deployment plan.
 */
export const stopEdgeDeploymentStage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEdgeDeploymentStageRequest,
    output: StopEdgeDeploymentStageResponse,
    errors: [],
  }),
);
/**
 * Request to stop an edge packaging job.
 */
export const stopEdgePackagingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopEdgePackagingJobRequest,
    output: StopEdgePackagingJobResponse,
    errors: [],
  }),
);
/**
 * Stops a running hyperparameter tuning job and all running training jobs that the tuning job launched.
 *
 * All model artifacts output from the training jobs are stored in Amazon Simple Storage Service (Amazon S3). All data that the training jobs write to Amazon CloudWatch Logs are still available in CloudWatch. After the tuning job moves to the `Stopped` state, it releases all reserved resources for the tuning job.
 */
export const stopHyperParameterTuningJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopHyperParameterTuningJobRequest,
    output: StopHyperParameterTuningJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Stops an Inference Recommender job.
 */
export const stopInferenceRecommendationsJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopInferenceRecommendationsJobRequest,
    output: StopInferenceRecommendationsJobResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Stops a running labeling job. A job that is stopped cannot be restarted. Any results obtained before the job is stopped are placed in the Amazon S3 output bucket.
 */
export const stopLabelingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopLabelingJobRequest,
  output: StopLabelingJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a previously started monitoring schedule.
 */
export const stopMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopMonitoringScheduleRequest,
    output: StopMonitoringScheduleResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Terminates the ML compute instance. Before terminating the instance, SageMaker AI disconnects the ML storage volume from it. SageMaker AI preserves the ML storage volume. SageMaker AI stops charging you for the ML compute instance when you call `StopNotebookInstance`.
 *
 * To access data on the ML storage volume for a notebook instance that has been terminated, call the `StartNotebookInstance` API. `StartNotebookInstance` launches another ML compute instance, configures it, and attaches the preserved ML storage volume so you can continue your work.
 */
export const stopNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopNotebookInstanceInput,
    output: StopNotebookInstanceResponse,
    errors: [],
  }),
);
/**
 * Ends a running inference optimization job.
 */
export const stopOptimizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopOptimizationJobRequest,
  output: StopOptimizationJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a processing job.
 */
export const stopProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopProcessingJobRequest,
  output: StopProcessingJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a training job. To stop a job, SageMaker sends the algorithm the `SIGTERM` signal, which delays job termination for 120 seconds. Algorithms might use this 120-second window to save the model artifacts, so the results of the training is not lost.
 *
 * When it receives a `StopTrainingJob` request, SageMaker changes the status of the job to `Stopping`. After SageMaker stops the job, it sets the status to `Stopped`.
 */
export const stopTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTrainingJobRequest,
  output: StopTrainingJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Stops a batch transform job.
 *
 * When Amazon SageMaker receives a `StopTransformJob` request, the status of the job changes to `Stopping`. After Amazon SageMaker stops the job, the status is set to `Stopped`. When you stop a batch transform job before it is completed, Amazon SageMaker doesn't store the job's output in Amazon S3.
 */
export const stopTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTransformJobRequest,
  output: StopTransformJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Updates a fleet of devices.
 */
export const updateDeviceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDeviceFleetRequest,
  output: UpdateDeviceFleetResponse,
  errors: [ResourceInUse],
}));
/**
 * Updates one or more devices in a fleet.
 */
export const updateDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDevicesRequest,
  output: UpdateDevicesResponse,
  errors: [],
}));
/**
 * Updates a notebook instance. NotebookInstance updates include upgrading or downgrading the ML compute instance used for your notebook instance to accommodate changes in your workload requirements.
 */
export const updateNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNotebookInstanceInput,
    output: UpdateNotebookInstanceOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Updates a notebook instance lifecycle configuration created with the CreateNotebookInstanceLifecycleConfig API.
 */
export const updateNotebookInstanceLifecycleConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateNotebookInstanceLifecycleConfigInput,
    output: UpdateNotebookInstanceLifecycleConfigOutput,
    errors: [ResourceLimitExceeded],
  }));
/**
 * Creates an *association* between the source and the destination. A source can be associated with multiple destinations, and a destination can be associated with multiple sources. An association is a lineage tracking entity. For more information, see Amazon SageMaker ML Lineage Tracking.
 */
export const addAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddAssociationRequest,
  output: AddAssociationResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Associates a trial component with a trial. A trial component can be associated with multiple trials. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
 */
export const associateTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateTrialComponentRequest,
    output: AssociateTrialComponentResponse,
    errors: [ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Attaches your Amazon Elastic Block Store (Amazon EBS) volume to a node in your EKS orchestrated HyperPod cluster.
 *
 * This API works with the Amazon Elastic Block Store (Amazon EBS) Container Storage Interface (CSI) driver to manage the lifecycle of persistent storage in your HyperPod EKS clusters.
 */
export const attachClusterNodeVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachClusterNodeVolumeRequest,
    output: AttachClusterNodeVolumeResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Creates a device fleet.
 */
export const createDeviceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeviceFleetRequest,
  output: CreateDeviceFleetResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates a new stage in an existing edge deployment plan.
 */
export const createEdgeDeploymentStage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEdgeDeploymentStageRequest,
    output: CreateEdgeDeploymentStageResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates a SageMaker *experiment*. An experiment is a collection of *trials* that are observed, compared and evaluated as a group. A trial is a set of steps, called *trial components*, that produce a machine learning model.
 *
 * In the Studio UI, trials are referred to as *run groups* and trial components are referred to as *runs*.
 *
 * The goal of an experiment is to determine the components that produce the best model. Multiple trials are performed, each one isolating and measuring the impact of a change to one or more inputs, while keeping the remaining inputs constant.
 *
 * When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK.
 *
 * You can add tags to experiments, trials, trial components and then use the Search API to search for the tags.
 *
 * To add a description to an experiment, specify the optional `Description` parameter. To add a description later, or to change the description, call the UpdateExperiment API.
 *
 * To get a list of all your experiments, call the ListExperiments API. To view an experiment's properties, call the DescribeExperiment API. To get a list of all the trials associated with an experiment, call the ListTrials API. To create a trial call the CreateTrial API.
 */
export const createExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExperimentRequest,
  output: CreateExperimentResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Create a hub content reference in order to add a model in the JumpStart public hub to a private hub.
 */
export const createHubContentReference = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateHubContentReferenceRequest,
    output: CreateHubContentReferenceResponse,
    errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Creates a custom SageMaker AI image. A SageMaker AI image is a set of image versions. Each image version represents a container image stored in Amazon ECR. For more information, see Bring your own SageMaker AI image.
 */
export const createImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageRequest,
  output: CreateImageResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates a version of the SageMaker AI image specified by `ImageName`. The version represents the Amazon ECR container image specified by `BaseImage`.
 */
export const createImageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateImageVersionRequest,
  output: CreateImageVersionResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Creates an MLflow Tracking Server using a general purpose Amazon S3 bucket as the artifact store.
 */
export const createMlflowApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMlflowAppRequest,
  output: CreateMlflowAppResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Creates an MLflow Tracking Server using a general purpose Amazon S3 bucket as the artifact store. For more information, see Create an MLflow Tracking Server.
 */
export const createMlflowTrackingServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMlflowTrackingServerRequest,
    output: CreateMlflowTrackingServerResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates a model group. A model group contains a group of model versions.
 */
export const createModelPackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateModelPackageGroupInput,
    output: CreateModelPackageGroupOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates a presigned URL to access an Amazon SageMaker Partner AI App.
 */
export const createPartnerAppPresignedUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePartnerAppPresignedUrlRequest,
    output: CreatePartnerAppPresignedUrlResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Creates a URL for a specified UserProfile in a Domain. When accessed in a web browser, the user will be automatically signed in to the domain, and granted access to all of the Apps and files associated with the Domain's Amazon Elastic File System volume. This operation can only be called when the authentication mode equals IAM.
 *
 * The IAM role or user passed to this API defines the permissions to access the app. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the app.
 *
 * You can restrict access to this API and to the URL that it returns to a list of IP addresses, Amazon VPCs or Amazon VPC Endpoints that you specify. For more information, see Connect to Amazon SageMaker AI Studio Through an Interface VPC Endpoint .
 *
 * - The URL that you get from a call to `CreatePresignedDomainUrl` has a default timeout of 5 minutes. You can configure this value using `ExpiresInSeconds`. If you try to use the URL after the timeout limit expires, you are directed to the Amazon Web Services console sign-in page.
 *
 * - The JupyterLab session default expiration time is 12 hours. You can configure this value using SessionExpirationDurationInSeconds.
 */
export const createPresignedDomainUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePresignedDomainUrlRequest,
    output: CreatePresignedDomainUrlResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns a presigned URL that you can use to connect to the MLflow UI attached to your MLflow App. For more information, see Launch the MLflow UI using a presigned URL.
 */
export const createPresignedMlflowAppUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePresignedMlflowAppUrlRequest,
    output: CreatePresignedMlflowAppUrlResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns a presigned URL that you can use to connect to the MLflow UI attached to your tracking server. For more information, see Launch the MLflow UI using a presigned URL.
 */
export const createPresignedMlflowTrackingServerUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePresignedMlflowTrackingServerUrlRequest,
    output: CreatePresignedMlflowTrackingServerUrlResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns a URL that you can use to connect to the Jupyter server from a notebook instance. In the SageMaker AI console, when you choose `Open` next to a notebook instance, SageMaker AI opens a new tab showing the Jupyter server home page from the notebook instance. The console uses this API to get the URL and show the page.
 *
 * The IAM role or user used to call this API defines the permissions to access the notebook instance. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the notebook instance.
 *
 * You can restrict access to this API and to the URL that it returns to a list of IP addresses that you specify. Use the `NotIpAddress` condition operator and the `aws:SourceIP` condition context key to specify the list of IP addresses that you want to have access to the notebook instance. For more information, see Limit Access to a Notebook Instance by IP Address.
 *
 * The URL that you get from a call to CreatePresignedNotebookInstanceUrl is valid only for 5 minutes. If you try to use the URL after the 5-minute limit expires, you are directed to the Amazon Web Services console sign-in page.
 */
export const createPresignedNotebookInstanceUrl =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePresignedNotebookInstanceUrlInput,
    output: CreatePresignedNotebookInstanceUrlOutput,
    errors: [],
  }));
/**
 * Creates a new Amazon SageMaker AI Studio Lifecycle Configuration.
 */
export const createStudioLifecycleConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStudioLifecycleConfigRequest,
    output: CreateStudioLifecycleConfigResponse,
    errors: [ResourceInUse],
  }),
);
/**
 * Creates a new training plan in SageMaker to reserve compute capacity.
 *
 * Amazon SageMaker Training Plan is a capability within SageMaker that allows customers to reserve and manage GPU capacity for large-scale AI model training. It provides a way to secure predictable access to computational resources within specific timelines and budgets, without the need to manage underlying infrastructure.
 *
 * **How it works**
 *
 * Plans can be created for specific resources such as SageMaker Training Jobs or SageMaker HyperPod clusters, automatically provisioning resources, setting up infrastructure, executing workloads, and handling infrastructure failures.
 *
 * **Plan creation workflow**
 *
 * - Users search for available plan offerings based on their requirements (e.g., instance type, count, start time, duration) using the ` SearchTrainingPlanOfferings ` API operation.
 *
 * - They create a plan that best matches their needs using the ID of the plan offering they want to use.
 *
 * - After successful upfront payment, the plan's status becomes `Scheduled`.
 *
 * - The plan can be used to:
 *
 * - Queue training jobs.
 *
 * - Allocate to an instance group of a SageMaker HyperPod cluster.
 *
 * - When the plan start date arrives, it becomes `Active`. Based on available reserved capacity:
 *
 * - Training jobs are launched.
 *
 * - Instance groups are provisioned.
 *
 * **Plan composition**
 *
 * A plan can consist of one or more Reserved Capacities, each defined by a specific instance type, quantity, Availability Zone, duration, and start and end times. For more information about Reserved Capacity, see ` ReservedCapacitySummary `.
 */
export const createTrainingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrainingPlanRequest,
  output: CreateTrainingPlanResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Creates an SageMaker *trial*. A trial is a set of steps called *trial components* that produce a machine learning model. A trial is part of a single SageMaker *experiment*.
 *
 * When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK.
 *
 * You can add tags to a trial and then use the Search API to search for the tags.
 *
 * To get a list of all your trials, call the ListTrials API. To view a trial's properties, call the DescribeTrial API. To create a trial component, call the CreateTrialComponent API.
 */
export const createTrial = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrialRequest,
  output: CreateTrialResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Creates a user profile. A user profile represents a single user within a domain, and is the main way to reference a "person" for the purposes of sharing, reporting, and other user-oriented features. This entity is created when a user onboards to a domain. If an administrator invites a person by email or imports them from IAM Identity Center, a user profile is automatically created. A user profile is the primary holder of settings for an individual user and has a reference to the user's private Amazon Elastic File System home directory.
 */
export const createUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserProfileRequest,
  output: CreateUserProfileResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Deletes an action.
 */
export const deleteAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteActionRequest,
  output: DeleteActionResponse,
  errors: [ResourceNotFound],
}));
/**
 * Removes the specified algorithm from your account.
 */
export const deleteAlgorithm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAlgorithmInput,
  output: DeleteAlgorithmResponse,
  errors: [ConflictException],
}));
/**
 * Used to stop and delete an app.
 */
export const deleteApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppRequest,
  output: DeleteAppResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes an AppImageConfig.
 */
export const deleteAppImageConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAppImageConfigRequest,
    output: DeleteAppImageConfigResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes an artifact. Either `ArtifactArn` or `Source` must be specified.
 */
export const deleteArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArtifactRequest,
  output: DeleteArtifactResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes an association.
 */
export const deleteAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAssociationRequest,
  output: DeleteAssociationResponse,
  errors: [ResourceNotFound],
}));
/**
 * Delete a SageMaker HyperPod cluster.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Deletes an context.
 */
export const deleteContext = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteContextRequest,
  output: DeleteContextResponse,
  errors: [ResourceNotFound],
}));
/**
 * Used to delete a domain. If you onboarded with IAM mode, you will need to delete your domain to onboard again using IAM Identity Center. Use with caution. All of the members of the domain will lose access to their EFS volume, including data, notebooks, and other artifacts.
 */
export const deleteDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainRequest,
  output: DeleteDomainResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Deletes an SageMaker experiment. All trials associated with the experiment must be deleted first. Use the ListTrials API to get a list of the trials associated with the experiment.
 */
export const deleteExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExperimentRequest,
  output: DeleteExperimentResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes an inference experiment.
 *
 * This operation does not delete your endpoint, variants, or any underlying resources. This operation only deletes the metadata of your experiment.
 */
export const deleteInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInferenceExperimentRequest,
    output: DeleteInferenceExperimentResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Deletes an MLflow App.
 */
export const deleteMlflowApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMlflowAppRequest,
  output: DeleteMlflowAppResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes an MLflow Tracking Server. For more information, see Clean up MLflow resources.
 */
export const deleteMlflowTrackingServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMlflowTrackingServerRequest,
    output: DeleteMlflowTrackingServerResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes a SageMaker Partner AI App.
 */
export const deletePartnerApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePartnerAppRequest,
  output: DeletePartnerAppResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Deletes a pipeline if there are no running instances of the pipeline. To delete a pipeline, you must stop all running instances of the pipeline using the `StopPipelineExecution` API. When you delete a pipeline, all instances of the pipeline are deleted.
 */
export const deletePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePipelineRequest,
  output: DeletePipelineResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Deletes the specified trial. All trial components that make up the trial must be deleted first. Use the DescribeTrialComponent API to get the list of trial components.
 */
export const deleteTrial = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrialRequest,
  output: DeleteTrialResponse,
  errors: [ResourceNotFound],
}));
/**
 * Deletes the specified trial component. A trial component must be disassociated from all trials before the trial component can be deleted. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
 */
export const deleteTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTrialComponentRequest,
    output: DeleteTrialComponentResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Deletes an existing work team. This operation can't be undone.
 */
export const deleteWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkteamRequest,
  output: DeleteWorkteamResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Describes the app.
 */
export const describeApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAppRequest,
  output: DescribeAppResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes an AppImageConfig.
 */
export const describeAppImageConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAppImageConfigRequest,
    output: DescribeAppImageConfigResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes an artifact.
 */
export const describeArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeArtifactRequest,
  output: DescribeArtifactResponse,
  errors: [ResourceNotFound],
}));
/**
 * Description of the cluster policy. This policy is used for task prioritization and fair-share allocation. This helps prioritize critical workloads and distributes idle compute across entities.
 */
export const describeClusterSchedulerConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeClusterSchedulerConfigRequest,
    output: DescribeClusterSchedulerConfigResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Gets details about the specified Git repository.
 */
export const describeCodeRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCodeRepositoryInput,
    output: DescribeCodeRepositoryOutput,
    errors: [],
  }),
);
/**
 * Description of the compute allocation definition.
 */
export const describeComputeQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeComputeQuotaRequest,
    output: DescribeComputeQuotaResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes a context.
 */
export const describeContext = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContextRequest,
  output: DescribeContextResponse,
  errors: [ResourceNotFound],
}));
/**
 * Gets the details of a data quality monitoring job definition.
 */
export const describeDataQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeDataQualityJobDefinitionRequest,
    output: DescribeDataQualityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * A description of the fleet the device belongs to.
 */
export const describeDeviceFleet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceFleetRequest,
  output: DescribeDeviceFleetResponse,
  errors: [ResourceNotFound],
}));
/**
 * The description of the domain.
 */
export const describeDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDomainRequest,
  output: DescribeDomainResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns the description of an endpoint configuration created using the `CreateEndpointConfig` API.
 */
export const describeEndpointConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEndpointConfigInput,
    output: DescribeEndpointConfigOutput,
    errors: [],
  }),
);
/**
 * Shows the metadata for a feature within a feature group.
 */
export const describeFeatureMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFeatureMetadataRequest,
    output: DescribeFeatureMetadataResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns information about the specified flow definition.
 */
export const describeFlowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFlowDefinitionRequest,
    output: DescribeFlowDefinitionResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes a hub.
 */
export const describeHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHubRequest,
  output: DescribeHubResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes a SageMaker AI image.
 */
export const describeImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeImageRequest,
  output: DescribeImageResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes a version of a SageMaker AI image.
 */
export const describeImageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeImageVersionRequest,
    output: DescribeImageVersionResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Provides a list of properties for the requested lineage group. For more information, see Cross-Account Lineage Tracking in the *Amazon SageMaker Developer Guide*.
 */
export const describeLineageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLineageGroupRequest,
    output: DescribeLineageGroupResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns information about an MLflow App.
 */
export const describeMlflowApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMlflowAppRequest,
  output: DescribeMlflowAppResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns information about an MLflow Tracking Server.
 */
export const describeMlflowTrackingServer =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMlflowTrackingServerRequest,
    output: DescribeMlflowTrackingServerResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns a description of a model bias job definition.
 */
export const describeModelBiasJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeModelBiasJobDefinitionRequest,
    output: DescribeModelBiasJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Describes the content, creation time, and security configuration of an Amazon SageMaker Model Card.
 */
export const describeModelCard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeModelCardRequest,
  output: DescribeModelCardResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns a description of a model explainability job definition.
 */
export const describeModelExplainabilityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeModelExplainabilityJobDefinitionRequest,
    output: DescribeModelExplainabilityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Gets a description for the specified model group.
 */
export const describeModelPackageGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeModelPackageGroupInput,
    output: DescribeModelPackageGroupOutput,
    errors: [],
  }),
);
/**
 * Returns a description of a model quality job definition.
 */
export const describeModelQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeModelQualityJobDefinitionRequest,
    output: DescribeModelQualityJobDefinitionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns information about a notebook instance.
 */
export const describeNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeNotebookInstanceInput,
    output: DescribeNotebookInstanceOutput,
    errors: [],
  }),
);
/**
 * Returns a description of a notebook instance lifecycle configuration.
 *
 * For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
 */
export const describeNotebookInstanceLifecycleConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeNotebookInstanceLifecycleConfigInput,
    output: DescribeNotebookInstanceLifecycleConfigOutput,
    errors: [],
  }));
/**
 * Describes the details of a pipeline.
 */
export const describePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePipelineRequest,
  output: DescribePipelineResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes the details of an execution's pipeline definition.
 */
export const describePipelineDefinitionForExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePipelineDefinitionForExecutionRequest,
    output: DescribePipelineDefinitionForExecutionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns a description of a processing job.
 */
export const describeProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeProcessingJobRequest,
    output: DescribeProcessingJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes the space.
 */
export const describeSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSpaceRequest,
  output: DescribeSpaceResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes the Amazon SageMaker AI Studio Lifecycle Configuration.
 */
export const describeStudioLifecycleConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeStudioLifecycleConfigRequest,
    output: DescribeStudioLifecycleConfigResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns information about a transform job.
 */
export const describeTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTransformJobRequest,
    output: DescribeTransformJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes a user profile. For more information, see `CreateUserProfile`.
 */
export const describeUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserProfileRequest,
  output: DescribeUserProfileResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Detaches your Amazon Elastic Block Store (Amazon EBS) volume from a node in your EKS orchestrated SageMaker HyperPod cluster.
 *
 * This API works with the Amazon Elastic Block Store (Amazon EBS) Container Storage Interface (CSI) driver to manage the lifecycle of persistent storage in your HyperPod EKS clusters.
 */
export const detachClusterNodeVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetachClusterNodeVolumeRequest,
    output: DetachClusterNodeVolumeResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Disassociates a trial component from a trial. This doesn't effect other trials the component is associated with. Before you can delete a component, you must disassociate the component from all trials it is associated with. To associate a trial component with a trial, call the AssociateTrialComponent API.
 *
 * To get a list of the trials a component is associated with, use the Search API. Specify `ExperimentTrialComponent` for the `Resource` parameter. The list appears in the response under `Results.TrialComponent.Parents`.
 */
export const disassociateTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateTrialComponentRequest,
    output: DisassociateTrialComponentResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * The resource policy for the lineage group.
 */
export const getLineageGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLineageGroupPolicyRequest,
    output: GetLineageGroupPolicyResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets a resource policy that manages access for a model group. For information about resource policies, see Identity-based policies and resource-based policies in the *Amazon Web Services Identity and Access Management User Guide.*.
 */
export const getModelPackageGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetModelPackageGroupPolicyInput,
    output: GetModelPackageGroupPolicyOutput,
    errors: [],
  }),
);
/**
 * Import hub content.
 */
export const importHubContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportHubContentRequest,
  output: ImportHubContentResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Lists the aliases of a specified image or image version.
 */
export const listAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAliasesRequest,
  output: ListAliasesResponse,
  errors: [ResourceNotFound],
}));
/**
 * List the candidates created for the job.
 */
export const listCandidatesForAutoMLJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCandidatesForAutoMLJobRequest,
    output: ListCandidatesForAutoMLJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * List hub content versions.
 */
export const listHubContentVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListHubContentVersionsRequest,
    output: ListHubContentVersionsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Lists model bias jobs definitions that satisfy various filters.
 */
export const listModelBiasJobDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListModelBiasJobDefinitionsRequest,
    output: ListModelBiasJobDefinitionsResponse,
    errors: [],
  }),
);
/**
 * Lists model explainability job definitions that satisfy various filters.
 */
export const listModelExplainabilityJobDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListModelExplainabilityJobDefinitionsRequest,
    output: ListModelExplainabilityJobDefinitionsResponse,
    errors: [],
  }));
/**
 * Gets a list of model quality monitoring job definitions in your account.
 */
export const listModelQualityJobDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListModelQualityJobDefinitionsRequest,
    output: ListModelQualityJobDefinitionsResponse,
    errors: [],
  }));
/**
 * Returns list of all monitoring job executions.
 */
export const listMonitoringExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMonitoringExecutionsRequest,
    output: ListMonitoringExecutionsResponse,
    errors: [],
  }),
);
/**
 * Gets a list of parameters for a pipeline execution.
 */
export const listPipelineParametersForExecution =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPipelineParametersForExecutionRequest,
    output: ListPipelineParametersForExecutionResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Gets a list of the work teams that you are subscribed to in the Amazon Web Services Marketplace. The list may be empty if no work team satisfies the filter specified in the `NameContains` parameter.
 */
export const listSubscribedWorkteams = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSubscribedWorkteamsRequest,
    output: ListSubscribedWorkteamsResponse,
    errors: [],
  }),
);
/**
 * Returns the tags for the specified SageMaker resource.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsInput,
  output: ListTagsOutput,
  errors: [],
}));
/**
 * Gets a list of TrainingJobSummary objects that describe the training jobs that a hyperparameter tuning job launched.
 */
export const listTrainingJobsForHyperParameterTuningJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTrainingJobsForHyperParameterTuningJobRequest,
    output: ListTrainingJobsForHyperParameterTuningJobResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Use this operation to list all private and vendor workforces in an Amazon Web Services Region. Note that you can only have one private workforce per Amazon Web Services Region.
 */
export const listWorkforces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkforcesRequest,
  output: ListWorkforcesResponse,
  errors: [],
}));
/**
 * Gets a list of private work teams that you have defined in a region. The list may be empty if no work team satisfies the filter specified in the `NameContains` parameter.
 */
export const listWorkteams = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkteamsRequest,
  output: ListWorkteamsResponse,
  errors: [],
}));
/**
 * Adds a resouce policy to control access to a model group. For information about resoure policies, see Identity-based policies and resource-based policies in the *Amazon Web Services Identity and Access Management User Guide.*.
 */
export const putModelPackageGroupPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutModelPackageGroupPolicyInput,
    output: PutModelPackageGroupPolicyOutput,
    errors: [ConflictException],
  }),
);
/**
 * Register devices.
 */
export const registerDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterDevicesRequest,
  output: RegisterDevicesResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Retry the execution of the pipeline.
 */
export const retryPipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetryPipelineExecutionRequest,
    output: RetryPipelineExecutionResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Notifies the pipeline that the execution of a callback step failed, along with a message describing why. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
 */
export const sendPipelineExecutionStepFailure =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SendPipelineExecutionStepFailureRequest,
    output: SendPipelineExecutionStepFailureResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }));
/**
 * Starts an inference experiment.
 */
export const startInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartInferenceExperimentRequest,
    output: StartInferenceExperimentResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Programmatically start an MLflow Tracking Server.
 */
export const startMlflowTrackingServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMlflowTrackingServerRequest,
    output: StartMlflowTrackingServerResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Initiates a remote connection session between a local integrated development environments (IDEs) and a remote SageMaker space.
 */
export const startSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSessionRequest,
  output: StartSessionResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Programmatically stop an MLflow Tracking Server.
 */
export const stopMlflowTrackingServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopMlflowTrackingServerRequest,
    output: StopMlflowTrackingServerResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Stops a pipeline execution.
 *
 * **Callback Step**
 *
 * A pipeline execution won't stop while a callback step is running. When you call `StopPipelineExecution` on a pipeline execution with a running callback step, SageMaker Pipelines sends an additional Amazon SQS message to the specified SQS queue. The body of the SQS message contains a "Status" field which is set to "Stopping".
 *
 * You should add logic to your Amazon SQS message consumer to take any needed action (for example, resource cleanup) upon receipt of the message followed by a call to `SendPipelineExecutionStepSuccess` or `SendPipelineExecutionStepFailure`.
 *
 * Only when SageMaker Pipelines receives one of these calls will it stop the pipeline execution.
 *
 * **Lambda Step**
 *
 * A pipeline execution can't be stopped while a lambda step is running because the Lambda function invoked by the lambda step can't be stopped. If you attempt to stop the execution while the Lambda function is running, the pipeline waits for the Lambda function to finish or until the timeout is hit, whichever occurs first, and then stops. If the Lambda function finishes, the pipeline execution status is `Stopped`. If the timeout is hit the pipeline execution status is `Failed`.
 */
export const stopPipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopPipelineExecutionRequest,
    output: StopPipelineExecutionResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates an action.
 */
export const updateAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateActionRequest,
  output: UpdateActionResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates the properties of an AppImageConfig.
 */
export const updateAppImageConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAppImageConfigRequest,
    output: UpdateAppImageConfigResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Updates an artifact.
 */
export const updateArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArtifactRequest,
  output: UpdateArtifactResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates a SageMaker HyperPod cluster.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Update the cluster policy configuration.
 */
export const updateClusterSchedulerConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateClusterSchedulerConfigRequest,
    output: UpdateClusterSchedulerConfigResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }));
/**
 * Update the compute allocation definition.
 */
export const updateComputeQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComputeQuotaRequest,
  output: UpdateComputeQuotaResponse,
  errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Updates a context.
 */
export const updateContext = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContextRequest,
  output: UpdateContextResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Adds, updates, or removes the description of an experiment. Updates the display name of an experiment.
 */
export const updateExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExperimentRequest,
  output: UpdateExperimentResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates the description and parameters of the feature group.
 */
export const updateFeatureMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFeatureMetadataRequest,
    output: UpdateFeatureMetadataResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Update a hub.
 */
export const updateHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHubRequest,
  output: UpdateHubResponse,
  errors: [ResourceNotFound],
}));
/**
 * Updates SageMaker hub content (either a `Model` or `Notebook` resource).
 *
 * You can update the metadata that describes the resource. In addition to the required request fields, specify at least one of the following fields to update:
 *
 * - `HubContentDescription`
 *
 * - `HubContentDisplayName`
 *
 * - `HubContentMarkdown`
 *
 * - `HubContentSearchKeywords`
 *
 * - `SupportStatus`
 *
 * For more information about hubs, see Private curated hubs for foundation model access control in JumpStart.
 *
 * If you want to update a `ModelReference` resource in your hub, use the `UpdateHubContentResource` API instead.
 */
export const updateHubContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHubContentRequest,
  output: UpdateHubContentResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Updates the contents of a SageMaker hub for a `ModelReference` resource. A `ModelReference` allows you to access public SageMaker JumpStart models from within your private hub.
 *
 * When using this API, you can update the `MinVersion` field for additional flexibility in the model version. You shouldn't update any additional fields when using this API, because the metadata in your private hub should match the public JumpStart model's metadata.
 *
 * If you want to update a `Model` or `Notebook` resource in your hub, use the `UpdateHubContent` API instead.
 *
 * For more information about adding model references to your hub, see Add models to a private hub.
 */
export const updateHubContentReference = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateHubContentReferenceRequest,
    output: UpdateHubContentReferenceResponse,
    errors: [ResourceInUse, ResourceNotFound],
  }),
);
/**
 * Updates the properties of a SageMaker AI image. To change the image's tags, use the AddTags and DeleteTags APIs.
 */
export const updateImage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImageRequest,
  output: UpdateImageResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Updates the properties of a SageMaker AI image version.
 */
export const updateImageVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateImageVersionRequest,
  output: UpdateImageVersionResponse,
  errors: [ResourceInUse, ResourceNotFound],
}));
/**
 * Runtime settings for a model that is deployed with an inference component.
 */
export const updateInferenceComponentRuntimeConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateInferenceComponentRuntimeConfigInput,
    output: UpdateInferenceComponentRuntimeConfigOutput,
    errors: [ResourceLimitExceeded],
  }));
/**
 * Updates an inference experiment that you created. The status of the inference experiment has to be either `Created`, `Running`. For more information on the status of an inference experiment, see DescribeInferenceExperiment.
 */
export const updateInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInferenceExperimentRequest,
    output: UpdateInferenceExperimentResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates an MLflow App.
 */
export const updateMlflowApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMlflowAppRequest,
  output: UpdateMlflowAppResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates properties of an existing MLflow Tracking Server.
 */
export const updateMlflowTrackingServer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMlflowTrackingServerRequest,
    output: UpdateMlflowTrackingServerResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Update an Amazon SageMaker Model Card.
 *
 * You cannot update both model card content and model card status in a single call.
 */
export const updateModelCard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelCardRequest,
  output: UpdateModelCardResponse,
  errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Updates a versioned model.
 */
export const updateModelPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateModelPackageInput,
  output: UpdateModelPackageOutput,
  errors: [ConflictException],
}));
/**
 * Update the parameters of a model monitor alert.
 */
export const updateMonitoringAlert = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMonitoringAlertRequest,
    output: UpdateMonitoringAlertResponse,
    errors: [ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Updates a previously created schedule.
 */
export const updateMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMonitoringScheduleRequest,
    output: UpdateMonitoringScheduleResponse,
    errors: [ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Updates all of the SageMaker Partner AI Apps in an account.
 */
export const updatePartnerApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePartnerAppRequest,
  output: UpdatePartnerAppResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates a pipeline.
 */
export const updatePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePipelineRequest,
  output: UpdatePipelineResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates a pipeline execution.
 */
export const updatePipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePipelineExecutionRequest,
    output: UpdatePipelineExecutionResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates a pipeline version.
 */
export const updatePipelineVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePipelineVersionRequest,
    output: UpdatePipelineVersionResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates the settings of a space.
 *
 * You can't edit the app type of a space in the `SpaceSettings`.
 */
export const updateSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpaceRequest,
  output: UpdateSpaceResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Updates the display name of a trial.
 */
export const updateTrial = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrialRequest,
  output: UpdateTrialResponse,
  errors: [ConflictException, ResourceNotFound],
}));
/**
 * Updates one or more properties of a trial component.
 */
export const updateTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTrialComponentRequest,
    output: UpdateTrialComponentResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates a user profile.
 */
export const updateUserProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserProfileRequest,
  output: UpdateUserProfileResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Use this operation to update your workforce. You can use this operation to require that workers use specific IP addresses to work on tasks and to update your OpenID Connect (OIDC) Identity Provider (IdP) workforce configuration.
 *
 * The worker portal is now supported in VPC and public internet.
 *
 * Use `SourceIpConfig` to restrict worker access to tasks to a specific range of IP addresses. You specify allowed IP addresses by creating a list of up to ten CIDRs. By default, a workforce isn't restricted to specific IP addresses. If you specify a range of IP addresses, workers who attempt to access tasks using any IP address outside the specified range are denied and get a `Not Found` error message on the worker portal.
 *
 * To restrict public internet access for all workers, configure the `SourceIpConfig` CIDR value. For example, when using `SourceIpConfig` with an `IpAddressType` of `IPv4`, you can restrict access to the IPv4 CIDR block "10.0.0.0/16". When using an `IpAddressType` of `dualstack`, you can specify both the IPv4 and IPv6 CIDR blocks, such as "10.0.0.0/16" for IPv4 only, "2001:db8:1234:1a00::/56" for IPv6 only, or "10.0.0.0/16" and "2001:db8:1234:1a00::/56" for dual stack.
 *
 * Amazon SageMaker does not support Source Ip restriction for worker portals in VPC.
 *
 * Use `OidcConfig` to update the configuration of a workforce created using your own OIDC IdP.
 *
 * You can only update your OIDC IdP configuration when there are no work teams associated with your workforce. You can delete work teams using the DeleteWorkteam operation.
 *
 * After restricting access to a range of IP addresses or updating your OIDC IdP configuration with this operation, you can view details about your update workforce using the DescribeWorkforce operation.
 *
 * This operation only applies to private workforces.
 */
export const updateWorkforce = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkforceRequest,
  output: UpdateWorkforceResponse,
  errors: [ConflictException],
}));
/**
 * Updates an existing work team with new member definitions or description.
 */
export const updateWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkteamRequest,
  output: UpdateWorkteamResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Adds or overwrites one or more tags for the specified SageMaker resource. You can add tags to notebook instances, training jobs, hyperparameter tuning jobs, batch transform jobs, models, labeling jobs, work teams, endpoint configurations, and endpoints.
 *
 * Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see For more information, see Amazon Web Services Tagging Strategies.
 *
 * Tags that you add to a hyperparameter tuning job by calling this API are also added to any training jobs that the hyperparameter tuning job launches after you call this API, but not to training jobs that the hyperparameter tuning job launched before you called this API. To make sure that the tags associated with a hyperparameter tuning job are also added to all training jobs that the hyperparameter tuning job launches, add the tags when you first create the tuning job by specifying them in the `Tags` parameter of CreateHyperParameterTuningJob
 *
 * Tags that you add to a SageMaker Domain or User Profile by calling this API are also added to any Apps that the Domain or User Profile launches after you call this API, but not to Apps that the Domain or User Profile launched before you called this API. To make sure that the tags associated with a Domain or User Profile are also added to all Apps that the Domain or User Profile launches, add the tags when you first create the Domain or User Profile by specifying them in the `Tags` parameter of CreateDomain or CreateUserProfile.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [],
}));
/**
 * Deletes specific nodes within a SageMaker HyperPod cluster. `BatchDeleteClusterNodes` accepts a cluster name and a list of node IDs.
 *
 * - To safeguard your work, back up your data to Amazon S3 or an FSx for Lustre file system before invoking the API on a worker node group. This will help prevent any potential data loss from the instance root volume. For more information about backup, see Use the backup script provided by SageMaker HyperPod.
 *
 * - If you want to invoke this API on an existing cluster, you'll first need to patch the cluster by running the UpdateClusterSoftware API. For more information about patching a cluster, see Update the SageMaker HyperPod platform software of a cluster.
 */
export const batchDeleteClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteClusterNodesRequest,
    output: BatchDeleteClusterNodesResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Reboots specific nodes within a SageMaker HyperPod cluster using a soft recovery mechanism. `BatchRebootClusterNodes` performs a graceful reboot of the specified nodes by calling the Amazon Elastic Compute Cloud `RebootInstances` API, which attempts to cleanly shut down the operating system before restarting the instance.
 *
 * This operation is useful for recovering from transient issues or applying certain configuration changes that require a restart.
 *
 * - Rebooting a node may cause temporary service interruption for workloads running on that node. Ensure your workloads can handle node restarts or use appropriate scheduling to minimize impact.
 *
 * - You can reboot up to 25 nodes in a single request.
 *
 * - For SageMaker HyperPod clusters using the Slurm workload manager, ensure rebooting nodes will not disrupt critical cluster operations.
 */
export const batchRebootClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchRebootClusterNodesRequest,
    output: BatchRebootClusterNodesResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Replaces specific nodes within a SageMaker HyperPod cluster with new hardware. `BatchReplaceClusterNodes` terminates the specified instances and provisions new replacement instances with the same configuration but fresh hardware. The Amazon Machine Image (AMI) and instance configuration remain the same.
 *
 * This operation is useful for recovering from hardware failures or persistent issues that cannot be resolved through a reboot.
 *
 * - **Data Loss Warning:** Replacing nodes destroys all instance volumes, including both root and secondary volumes. All data stored on these volumes will be permanently lost and cannot be recovered.
 *
 * - To safeguard your work, back up your data to Amazon S3 or an FSx for Lustre file system before invoking the API on a worker node group. This will help prevent any potential data loss from the instance root volume. For more information about backup, see Use the backup script provided by SageMaker HyperPod.
 *
 * - If you want to invoke this API on an existing cluster, you'll first need to patch the cluster by running the UpdateClusterSoftware API. For more information about patching a cluster, see Update the SageMaker HyperPod platform software of a cluster.
 *
 * - You can replace up to 25 nodes in a single request.
 */
export const batchReplaceClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchReplaceClusterNodesRequest,
    output: BatchReplaceClusterNodesResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Creates an *action*. An action is a lineage tracking entity that represents an action or activity. For example, a model deployment or an HPO job. Generally, an action involves at least one input or output artifact. For more information, see Amazon SageMaker ML Lineage Tracking.
 */
export const createAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateActionRequest,
  output: CreateActionResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Creates a running app for the specified UserProfile. This operation is automatically invoked by Amazon SageMaker AI upon access to the associated Domain, and when new kernel configurations are selected by the user. A user may have multiple Apps active simultaneously.
 */
export const createApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppRequest,
  output: CreateAppResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates a Git repository as a resource in your SageMaker AI account. You can associate the repository with notebook instances so that you can use Git source control for the notebooks you create. The Git repository is a resource in your SageMaker AI account, so it can be associated with more than one notebook instance, and it persists independently from the lifecycle of any notebook instances it is associated with.
 *
 * The repository can be hosted either in Amazon Web Services CodeCommit or in any other Git repository.
 */
export const createCodeRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCodeRepositoryInput,
    output: CreateCodeRepositoryOutput,
    errors: [],
  }),
);
/**
 * Creates a *context*. A context is a lineage tracking entity that represents a logical grouping of other tracking or experiment entities. Some examples are an endpoint and a model package. For more information, see Amazon SageMaker ML Lineage Tracking.
 */
export const createContext = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateContextRequest,
  output: CreateContextResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Create a hub.
 */
export const createHub = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHubRequest,
  output: CreateHubResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Defines the settings you will use for the human review workflow user interface. Reviewers will see a three-panel interface with an instruction area, the item to review, and an input area.
 */
export const createHumanTaskUi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHumanTaskUiRequest,
  output: CreateHumanTaskUiResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates an Amazon SageMaker Model Card.
 *
 * For information about how to use model cards, see Amazon SageMaker Model Card.
 */
export const createModelCard = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelCardRequest,
  output: CreateModelCardResponse,
  errors: [ConflictException, ResourceLimitExceeded],
}));
/**
 * Creates an Amazon SageMaker Model Card export job.
 */
export const createModelCardExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateModelCardExportJobRequest,
    output: CreateModelCardExportJobResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Creates the definition for a model explainability job.
 */
export const createModelExplainabilityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateModelExplainabilityJobDefinitionRequest,
    output: CreateModelExplainabilityJobDefinitionResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates a definition for a job that monitors model quality and drift. For information about model monitor, see Amazon SageMaker AI Model Monitor.
 */
export const createModelQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateModelQualityJobDefinitionRequest,
    output: CreateModelQualityJobDefinitionResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates an SageMaker AI notebook instance. A notebook instance is a machine learning (ML) compute instance running on a Jupyter notebook.
 *
 * In a `CreateNotebookInstance` request, specify the type of ML compute instance that you want to run. SageMaker AI launches the instance, installs common libraries that you can use to explore datasets for model training, and attaches an ML storage volume to the notebook instance.
 *
 * SageMaker AI also provides a set of example notebooks. Each notebook demonstrates how to use SageMaker AI with a specific algorithm or with a machine learning framework.
 *
 * After receiving the request, SageMaker AI does the following:
 *
 * - Creates a network interface in the SageMaker AI VPC.
 *
 * - (Option) If you specified `SubnetId`, SageMaker AI creates a network interface in your own VPC, which is inferred from the subnet ID that you provide in the input. When creating this network interface, SageMaker AI attaches the security group that you specified in the request to the network interface that it creates in your VPC.
 *
 * - Launches an EC2 instance of the type specified in the request in the SageMaker AI VPC. If you specified `SubnetId` of your VPC, SageMaker AI specifies both network interfaces when launching this instance. This enables inbound traffic from your own VPC to the notebook instance, assuming that the security groups allow it.
 *
 * After creating the notebook instance, SageMaker AI returns its Amazon Resource Name (ARN). You can't change the name of a notebook instance after you create it.
 *
 * After SageMaker AI creates the notebook instance, you can connect to the Jupyter server and work in Jupyter notebooks. For example, you can write code to explore a dataset that you can use for model training, train a model, host models by creating SageMaker AI endpoints, and validate hosted models.
 *
 * For more information, see How It Works.
 */
export const createNotebookInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateNotebookInstanceInput,
    output: CreateNotebookInstanceOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates a lifecycle configuration that you can associate with a notebook instance. A *lifecycle configuration* is a collection of shell scripts that run when you create or start a notebook instance.
 *
 * Each lifecycle configuration script has a limit of 16384 characters.
 *
 * The value of the `$PATH` environment variable that is available to both scripts is `/sbin:bin:/usr/sbin:/usr/bin`.
 *
 * View Amazon CloudWatch Logs for notebook instance lifecycle configurations in log group `/aws/sagemaker/NotebookInstances` in log stream `[notebook-instance-name]/[LifecycleConfigHook]`.
 *
 * Lifecycle configuration scripts cannot run for longer than 5 minutes. If a script runs for longer than 5 minutes, it fails and the notebook instance is not created or started.
 *
 * For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
 */
export const createNotebookInstanceLifecycleConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNotebookInstanceLifecycleConfigInput,
    output: CreateNotebookInstanceLifecycleConfigOutput,
    errors: [ResourceLimitExceeded],
  }));
/**
 * Creates a pipeline using a JSON pipeline definition.
 */
export const createPipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePipelineRequest,
  output: CreatePipelineResponse,
  errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Returns information about a model compilation job.
 *
 * To create a model compilation job, use CreateCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
 */
export const describeCompilationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCompilationJobRequest,
    output: DescribeCompilationJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes the device.
 */
export const describeDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceRequest,
  output: DescribeDeviceResponse,
  errors: [ResourceNotFound],
}));
/**
 * A description of edge packaging jobs.
 */
export const describeEdgePackagingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEdgePackagingJobRequest,
    output: DescribeEdgePackagingJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Provides a list of an experiment's properties.
 */
export const describeExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExperimentRequest,
  output: DescribeExperimentResponse,
  errors: [ResourceNotFound],
}));
/**
 * Use this operation to describe a `FeatureGroup`. The response includes information on the creation time, `FeatureGroup` name, the unique identifier for each `FeatureGroup`, and more.
 */
export const describeFeatureGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeFeatureGroupRequest,
    output: DescribeFeatureGroupResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describe the content of a hub.
 */
export const describeHubContent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHubContentRequest,
  output: DescribeHubContentResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns information about the requested human task user interface (worker task template).
 */
export const describeHumanTaskUi = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHumanTaskUiRequest,
  output: DescribeHumanTaskUiResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns details about an inference experiment.
 */
export const describeInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInferenceExperimentRequest,
    output: DescribeInferenceExperimentResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets information about a labeling job.
 */
export const describeLabelingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLabelingJobRequest,
  output: DescribeLabelingJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes an Amazon SageMaker Model Card export job.
 */
export const describeModelCardExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeModelCardExportJobRequest,
    output: DescribeModelCardExportJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Describes the schedule for a monitoring job.
 */
export const describeMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMonitoringScheduleRequest,
    output: DescribeMonitoringScheduleResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Provides the properties of the specified optimization job.
 */
export const describeOptimizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOptimizationJobRequest,
    output: DescribeOptimizationJobResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets information about a SageMaker Partner AI App.
 */
export const describePartnerApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePartnerAppRequest,
  output: DescribePartnerAppResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes the details of a pipeline execution.
 */
export const describePipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePipelineExecutionRequest,
    output: DescribePipelineExecutionResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Retrieves details about a reserved capacity.
 */
export const describeReservedCapacity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReservedCapacityRequest,
    output: DescribeReservedCapacityResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets information about a work team provided by a vendor. It returns details about the subscription with a vendor in the Amazon Web Services Marketplace.
 */
export const describeSubscribedWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSubscribedWorkteamRequest,
    output: DescribeSubscribedWorkteamResponse,
    errors: [],
  }),
);
/**
 * Returns information about a training job.
 *
 * Some of the attributes below only appear if the training job successfully starts. If the training job fails, `TrainingJobStatus` is `Failed` and, depending on the `FailureReason`, attributes like `TrainingStartTime`, `TrainingTimeInSeconds`, `TrainingEndTime`, and `BillableTimeInSeconds` may not be present in the response.
 */
export const describeTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrainingJobRequest,
  output: DescribeTrainingJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Retrieves detailed information about a specific training plan.
 */
export const describeTrainingPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTrainingPlanRequest,
    output: DescribeTrainingPlanResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Provides a list of a trial's properties.
 */
export const describeTrial = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTrialRequest,
  output: DescribeTrialResponse,
  errors: [ResourceNotFound],
}));
/**
 * Provides a list of a trials component's properties.
 */
export const describeTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTrialComponentRequest,
    output: DescribeTrialComponentResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets information about a specific work team. You can see information such as the creation date, the last updated date, membership information, and the work team's Amazon Resource Name (ARN).
 */
export const describeWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkteamRequest,
  output: DescribeWorkteamResponse,
  errors: [],
}));
/**
 * Describes a fleet.
 */
export const getDeviceFleetReport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDeviceFleetReportRequest,
    output: GetDeviceFleetReportResponse,
    errors: [],
  }),
);
/**
 * Lists the actions in your account and their properties.
 */
export const listActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActionsRequest,
  output: ListActionsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists the machine learning algorithms that have been created.
 */
export const listAlgorithms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAlgorithmsInput,
  output: ListAlgorithmsOutput,
  errors: [],
}));
/**
 * Lists the AppImageConfigs in your account and their properties. The list can be filtered by creation time or modified time, and whether the AppImageConfig name contains a specified string.
 */
export const listAppImageConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppImageConfigsRequest,
  output: ListAppImageConfigsResponse,
  errors: [],
}));
/**
 * Lists apps.
 */
export const listApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAppsRequest,
  output: ListAppsResponse,
  errors: [],
}));
/**
 * Lists the artifacts in your account and their properties.
 */
export const listArtifacts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArtifactsRequest,
  output: ListArtifactsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists the associations in your account and their properties.
 */
export const listAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAssociationsRequest,
  output: ListAssociationsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Request a list of jobs.
 */
export const listAutoMLJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAutoMLJobsRequest,
  output: ListAutoMLJobsResponse,
  errors: [],
}));
/**
 * Retrieves a list of event summaries for a specified HyperPod cluster. The operation supports filtering, sorting, and pagination of results. This functionality is only supported when the `NodeProvisioningMode` is set to `Continuous`.
 */
export const listClusterEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClusterEventsRequest,
  output: ListClusterEventsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Retrieves the list of instances (also called *nodes* interchangeably) in a SageMaker HyperPod cluster.
 */
export const listClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClusterNodesRequest,
  output: ListClusterNodesResponse,
  errors: [ResourceNotFound],
}));
/**
 * Retrieves the list of SageMaker HyperPod clusters.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [],
}));
/**
 * List the cluster policy configurations.
 */
export const listClusterSchedulerConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListClusterSchedulerConfigsRequest,
    output: ListClusterSchedulerConfigsResponse,
    errors: [],
  }),
);
/**
 * Gets a list of the Git repositories in your account.
 */
export const listCodeRepositories = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCodeRepositoriesInput,
    output: ListCodeRepositoriesOutput,
    errors: [],
  }),
);
/**
 * Lists model compilation jobs that satisfy various filters.
 *
 * To create a model compilation job, use CreateCompilationJob. To get information about a particular model compilation job you have created, use DescribeCompilationJob.
 */
export const listCompilationJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCompilationJobsRequest,
  output: ListCompilationJobsResponse,
  errors: [],
}));
/**
 * List the resource allocation definitions.
 */
export const listComputeQuotas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListComputeQuotasRequest,
  output: ListComputeQuotasResponse,
  errors: [],
}));
/**
 * Lists the contexts in your account and their properties.
 */
export const listContexts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListContextsRequest,
  output: ListContextsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists the data quality job definitions in your account.
 */
export const listDataQualityJobDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataQualityJobDefinitionsRequest,
    output: ListDataQualityJobDefinitionsResponse,
    errors: [],
  }));
/**
 * Returns a list of devices in the fleet.
 */
export const listDeviceFleets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDeviceFleetsRequest,
  output: ListDeviceFleetsResponse,
  errors: [],
}));
/**
 * Lists the domains.
 */
export const listDomains = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDomainsRequest,
  output: ListDomainsResponse,
  errors: [],
}));
/**
 * Lists all edge deployment plans.
 */
export const listEdgeDeploymentPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEdgeDeploymentPlansRequest,
    output: ListEdgeDeploymentPlansResponse,
    errors: [],
  }),
);
/**
 * Returns a list of edge packaging jobs.
 */
export const listEdgePackagingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEdgePackagingJobsRequest,
    output: ListEdgePackagingJobsResponse,
    errors: [],
  }),
);
/**
 * Lists endpoint configurations.
 */
export const listEndpointConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEndpointConfigsInput,
  output: ListEndpointConfigsOutput,
  errors: [],
}));
/**
 * Lists endpoints.
 */
export const listEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEndpointsInput,
  output: ListEndpointsOutput,
  errors: [],
}));
/**
 * Lists all the experiments in your account. The list can be filtered to show only experiments that were created in a specific time range. The list can be sorted by experiment name or creation time.
 */
export const listExperiments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExperimentsRequest,
  output: ListExperimentsResponse,
  errors: [],
}));
/**
 * List `FeatureGroup`s based on given filter and order.
 */
export const listFeatureGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFeatureGroupsRequest,
  output: ListFeatureGroupsResponse,
  errors: [],
}));
/**
 * Returns information about the flow definitions in your account.
 */
export const listFlowDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFlowDefinitionsRequest,
  output: ListFlowDefinitionsResponse,
  errors: [],
}));
/**
 * List the contents of a hub.
 */
export const listHubContents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHubContentsRequest,
  output: ListHubContentsResponse,
  errors: [ResourceNotFound],
}));
/**
 * List all existing hubs.
 */
export const listHubs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHubsRequest,
  output: ListHubsResponse,
  errors: [],
}));
/**
 * Returns information about the human task user interfaces in your account.
 */
export const listHumanTaskUis = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHumanTaskUisRequest,
  output: ListHumanTaskUisResponse,
  errors: [],
}));
/**
 * Gets a list of HyperParameterTuningJobSummary objects that describe the hyperparameter tuning jobs launched in your account.
 */
export const listHyperParameterTuningJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListHyperParameterTuningJobsRequest,
    output: ListHyperParameterTuningJobsResponse,
    errors: [],
  }));
/**
 * Lists the images in your account and their properties. The list can be filtered by creation time or modified time, and whether the image name contains a specified string.
 */
export const listImages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImagesRequest,
  output: ListImagesResponse,
  errors: [],
}));
/**
 * Lists the versions of a specified image and their properties. The list can be filtered by creation time or modified time.
 */
export const listImageVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImageVersionsRequest,
  output: ListImageVersionsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists the inference components in your account and their properties.
 */
export const listInferenceComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInferenceComponentsInput,
    output: ListInferenceComponentsOutput,
    errors: [],
  }),
);
/**
 * Returns the list of all inference experiments.
 */
export const listInferenceExperiments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInferenceExperimentsRequest,
    output: ListInferenceExperimentsResponse,
    errors: [],
  }),
);
/**
 * Lists recommendation jobs that satisfy various filters.
 */
export const listInferenceRecommendationsJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListInferenceRecommendationsJobsRequest,
    output: ListInferenceRecommendationsJobsResponse,
    errors: [],
  }));
/**
 * Gets a list of labeling jobs.
 */
export const listLabelingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLabelingJobsRequest,
  output: ListLabelingJobsResponse,
  errors: [],
}));
/**
 * A list of lineage groups shared with your Amazon Web Services account. For more information, see Cross-Account Lineage Tracking in the *Amazon SageMaker Developer Guide*.
 */
export const listLineageGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLineageGroupsRequest,
  output: ListLineageGroupsResponse,
  errors: [],
}));
/**
 * Lists all MLflow Apps
 */
export const listMlflowApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMlflowAppsRequest,
  output: ListMlflowAppsResponse,
  errors: [],
}));
/**
 * Lists all MLflow Tracking Servers.
 */
export const listMlflowTrackingServers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMlflowTrackingServersRequest,
    output: ListMlflowTrackingServersResponse,
    errors: [],
  }),
);
/**
 * List the export jobs for the Amazon SageMaker Model Card.
 */
export const listModelCardExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListModelCardExportJobsRequest,
    output: ListModelCardExportJobsResponse,
    errors: [],
  }),
);
/**
 * List existing model cards.
 */
export const listModelCards = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelCardsRequest,
  output: ListModelCardsResponse,
  errors: [],
}));
/**
 * List existing versions of an Amazon SageMaker Model Card.
 */
export const listModelCardVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListModelCardVersionsRequest,
    output: ListModelCardVersionsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets a list of the model groups in your Amazon Web Services account.
 */
export const listModelPackageGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListModelPackageGroupsInput,
    output: ListModelPackageGroupsOutput,
    errors: [],
  }),
);
/**
 * Lists the model packages that have been created.
 */
export const listModelPackages = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelPackagesInput,
  output: ListModelPackagesOutput,
  errors: [],
}));
/**
 * Lists models created with the `CreateModel` API.
 */
export const listModels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelsInput,
  output: ListModelsOutput,
  errors: [],
}));
/**
 * Gets a list of past alerts in a model monitoring schedule.
 */
export const listMonitoringAlertHistory = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMonitoringAlertHistoryRequest,
    output: ListMonitoringAlertHistoryResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns list of all monitoring schedules.
 */
export const listMonitoringSchedules = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMonitoringSchedulesRequest,
    output: ListMonitoringSchedulesResponse,
    errors: [],
  }),
);
/**
 * Lists notebook instance lifestyle configurations created with the CreateNotebookInstanceLifecycleConfig API.
 */
export const listNotebookInstanceLifecycleConfigs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListNotebookInstanceLifecycleConfigsInput,
    output: ListNotebookInstanceLifecycleConfigsOutput,
    errors: [],
  }));
/**
 * Returns a list of the SageMaker AI notebook instances in the requester's account in an Amazon Web Services Region.
 */
export const listNotebookInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNotebookInstancesInput,
    output: ListNotebookInstancesOutput,
    errors: [],
  }),
);
/**
 * Lists the optimization jobs in your account and their properties.
 */
export const listOptimizationJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListOptimizationJobsRequest,
    output: ListOptimizationJobsResponse,
    errors: [],
  }),
);
/**
 * Lists all of the SageMaker Partner AI Apps in an account.
 */
export const listPartnerApps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPartnerAppsRequest,
  output: ListPartnerAppsResponse,
  errors: [],
}));
/**
 * Gets a list of the pipeline executions.
 */
export const listPipelineExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPipelineExecutionsRequest,
    output: ListPipelineExecutionsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Gets a list of pipelines.
 */
export const listPipelines = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPipelinesRequest,
  output: ListPipelinesResponse,
  errors: [],
}));
/**
 * Gets a list of all versions of the pipeline.
 */
export const listPipelineVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPipelineVersionsRequest,
    output: ListPipelineVersionsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Lists processing jobs that satisfy various filters.
 */
export const listProcessingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProcessingJobsRequest,
  output: ListProcessingJobsResponse,
  errors: [],
}));
/**
 * Gets a list of the projects in an Amazon Web Services account.
 */
export const listProjects = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListProjectsInput,
  output: ListProjectsOutput,
  errors: [],
}));
/**
 * Lists Amazon SageMaker Catalogs based on given filters and orders. The maximum number of `ResourceCatalog`s viewable is 1000.
 */
export const listResourceCatalogs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListResourceCatalogsRequest,
    output: ListResourceCatalogsResponse,
    errors: [],
  }),
);
/**
 * Lists devices allocated to the stage, containing detailed device information and deployment status.
 */
export const listStageDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStageDevicesRequest,
  output: ListStageDevicesResponse,
  errors: [],
}));
/**
 * Lists the Amazon SageMaker AI Studio Lifecycle Configurations in your Amazon Web Services Account.
 */
export const listStudioLifecycleConfigs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListStudioLifecycleConfigsRequest,
    output: ListStudioLifecycleConfigsResponse,
    errors: [ResourceInUse],
  }),
);
/**
 * Lists training jobs.
 *
 * When `StatusEquals` and `MaxResults` are set at the same time, the `MaxResults` number of training jobs are first retrieved ignoring the `StatusEquals` parameter and then they are filtered by the `StatusEquals` parameter, which is returned as a response.
 *
 * For example, if `ListTrainingJobs` is invoked with the following parameters:
 *
 * `{ ... MaxResults: 100, StatusEquals: InProgress ... }`
 *
 * First, 100 trainings jobs with any status, including those other than `InProgress`, are selected (sorted according to the creation time, from the most current to the oldest). Next, those with a status of `InProgress` are returned.
 *
 * You can quickly test the API using the following Amazon Web Services CLI code.
 *
 * `aws sagemaker list-training-jobs --max-results 100 --status-equals InProgress`
 */
export const listTrainingJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrainingJobsRequest,
  output: ListTrainingJobsResponse,
  errors: [],
}));
/**
 * Lists transform jobs.
 */
export const listTransformJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTransformJobsRequest,
  output: ListTransformJobsResponse,
  errors: [],
}));
/**
 * Lists the trial components in your account. You can sort the list by trial component name or creation time. You can filter the list to show only components that were created in a specific time range. You can also filter on one of the following:
 *
 * - `ExperimentName`
 *
 * - `SourceArn`
 *
 * - `TrialName`
 */
export const listTrialComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrialComponentsRequest,
  output: ListTrialComponentsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists the trials in your account. Specify an experiment name to limit the list to the trials that are part of that experiment. Specify a trial component name to limit the list to the trials that associated with that trial component. The list can be filtered to show only trials that were created in a specific time range. The list can be sorted by trial name or creation time.
 */
export const listTrials = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrialsRequest,
  output: ListTrialsResponse,
  errors: [ResourceNotFound],
}));
/**
 * Lists all UltraServers that are part of a specified reserved capacity.
 */
export const listUltraServersByReservedCapacity =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListUltraServersByReservedCapacityRequest,
    output: ListUltraServersByReservedCapacityResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Lists user profiles.
 */
export const listUserProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUserProfilesRequest,
  output: ListUserProfilesResponse,
  errors: [],
}));
/**
 * Notifies the pipeline that the execution of a callback step succeeded and provides a list of the step's output parameters. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
 */
export const sendPipelineExecutionStepSuccess =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SendPipelineExecutionStepSuccessRequest,
    output: SendPipelineExecutionStepSuccessResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }));
/**
 * Stops an inference experiment.
 */
export const stopInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopInferenceExperimentRequest,
    output: StopInferenceExperimentResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates the specified Git repository with the specified values.
 */
export const updateCodeRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCodeRepositoryInput,
    output: UpdateCodeRepositoryOutput,
    errors: [ConflictException],
  }),
);
/**
 * Deploys the `EndpointConfig` specified in the request to a new fleet of instances. SageMaker shifts endpoint traffic to the new instances with the updated endpoint configuration and then deletes the old instances using the previous `EndpointConfig` (there is no availability loss). For more information about how to control the update and traffic shifting process, see Update models in production.
 *
 * When SageMaker receives the request, it sets the endpoint status to `Updating`. After updating the endpoint, it sets the status to `InService`. To check the status of an endpoint, use the DescribeEndpoint API.
 *
 * You must not delete an `EndpointConfig` in use by an endpoint that is live or while the `UpdateEndpoint` or `CreateEndpoint` operations are being performed on the endpoint. To update an endpoint, you must create a new `EndpointConfig`.
 *
 * If you delete the `EndpointConfig` of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges.
 */
export const updateEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointInput,
  output: UpdateEndpointOutput,
  errors: [ResourceLimitExceeded],
}));
/**
 * Updates the feature group by either adding features or updating the online store configuration. Use one of the following request parameters at a time while using the `UpdateFeatureGroup` API.
 *
 * You can add features for your feature group using the `FeatureAdditions` request parameter. Features cannot be removed from a feature group.
 *
 * You can update the online store configuration by using the `OnlineStoreConfig` request parameter. If a `TtlDuration` is specified, the default `TtlDuration` applies for all records added to the feature group *after the feature group is updated*. If a record level `TtlDuration` exists from using the `PutRecord` API, the record level `TtlDuration` applies to that record instead of the default `TtlDuration`. To remove the default `TtlDuration` from an existing feature group, use the `UpdateFeatureGroup` API and set the `TtlDuration` `Unit` and `Value` to `null`.
 */
export const updateFeatureGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFeatureGroupRequest,
  output: UpdateFeatureGroupResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Update a model training job to request a new Debugger profiling configuration or to change warm pool retention length.
 */
export const updateTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrainingJobRequest,
  output: UpdateTrainingJobResponse,
  errors: [ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Adds nodes to a HyperPod cluster by incrementing the target count for one or more instance groups. This operation returns a unique `NodeLogicalId` for each node being added, which can be used to track the provisioning status of the node. This API provides a safer alternative to `UpdateCluster` for scaling operations by avoiding unintended configuration changes.
 *
 * This API is only supported for clusters using `Continuous` as the `NodeProvisioningMode`.
 */
export const batchAddClusterNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchAddClusterNodesRequest,
    output: BatchAddClusterNodesResponse,
    errors: [ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * This action batch describes a list of versioned model packages
 */
export const batchDescribeModelPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDescribeModelPackageInput,
    output: BatchDescribeModelPackageOutput,
    errors: [],
  }),
);
/**
 * Creates an *artifact*. An artifact is a lineage tracking entity that represents a URI addressable object or data. Some examples are the S3 URI of a dataset and the ECR registry path of an image. For more information, see Amazon SageMaker ML Lineage Tracking.
 */
export const createArtifact = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateArtifactRequest,
  output: CreateArtifactResponse,
  errors: [ResourceLimitExceeded],
}));
/**
 * Create cluster policy configuration. This policy is used for task prioritization and fair-share allocation of idle compute. This helps prioritize critical workloads and distributes idle compute across entities.
 */
export const createClusterSchedulerConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateClusterSchedulerConfigRequest,
    output: CreateClusterSchedulerConfigResponse,
    errors: [ConflictException, ResourceLimitExceeded],
  }));
/**
 * Starts a model compilation job. After the model has been compiled, Amazon SageMaker AI saves the resulting model artifacts to an Amazon Simple Storage Service (Amazon S3) bucket that you specify.
 *
 * If you choose to host your model using Amazon SageMaker AI hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts with Amazon Web Services IoT Greengrass. In that case, deploy them as an ML resource.
 *
 * In the request body, you provide the following:
 *
 * - A name for the compilation job
 *
 * - Information about the input model artifacts
 *
 * - The output location for the compiled model and the device (target) that the model runs on
 *
 * - The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker AI assumes to perform the model compilation job.
 *
 * You can also provide a `Tag` to track the model compilation job's resource use and costs. The response body contains the `CompilationJobArn` for the compiled job.
 *
 * To stop a model compilation job, use StopCompilationJob. To get information about a particular model compilation job, use DescribeCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
 */
export const createCompilationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCompilationJobRequest,
    output: CreateCompilationJobResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }),
);
/**
 * Creates an edge deployment plan, consisting of multiple stages. Each stage may have a different deployment configuration and devices.
 */
export const createEdgeDeploymentPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEdgeDeploymentPlanRequest,
    output: CreateEdgeDeploymentPlanResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates presigned URLs for accessing hub content artifacts. This operation generates time-limited, secure URLs that allow direct download of model artifacts and associated files from Amazon SageMaker hub content, including gated models that require end-user license agreement acceptance.
 */
export const createHubContentPresignedUrls =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateHubContentPresignedUrlsRequest,
    output: CreateHubContentPresignedUrlsResponse,
    errors: [],
  }));
/**
 * Creates an inference component, which is a SageMaker AI hosting object that you can use to deploy a model to an endpoint. In the inference component settings, you specify the model, the endpoint, and how the model utilizes the resources that the endpoint hosts. You can optimize resource utilization by tailoring how the required CPU cores, accelerators, and memory are allocated. You can deploy multiple inference components to an endpoint, where each inference component contains one model and the resource utilization needs for that individual model. After you deploy an inference component, you can directly invoke the associated model when you use the InvokeEndpoint API action.
 */
export const createInferenceComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInferenceComponentInput,
    output: CreateInferenceComponentOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Creates the definition for a model bias job.
 */
export const createModelBiasJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateModelBiasJobDefinitionRequest,
    output: CreateModelBiasJobDefinitionResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates an Amazon SageMaker Partner AI App.
 */
export const createPartnerApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartnerAppRequest,
  output: CreatePartnerAppResponse,
  errors: [ConflictException, ResourceLimitExceeded],
}));
/**
 * Creates a *trial component*, which is a stage of a machine learning *trial*. A trial is composed of one or more trial components. A trial component can be used in multiple trials.
 *
 * Trial components include pre-processing jobs, training jobs, and batch transform jobs.
 *
 * When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK.
 *
 * You can add tags to a trial component and then use the Search API to search for the tags.
 */
export const createTrialComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTrialComponentRequest,
    output: CreateTrialComponentResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Use this operation to create a workforce. This operation will return an error if a workforce already exists in the Amazon Web Services Region that you specify. You can only create one workforce in each Amazon Web Services Region per Amazon Web Services account.
 *
 * If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use the DeleteWorkforce API operation to delete the existing workforce and then use `CreateWorkforce` to create a new workforce.
 *
 * To create a private workforce using Amazon Cognito, you must specify a Cognito user pool in `CognitoConfig`. You can also create an Amazon Cognito workforce using the Amazon SageMaker console. For more information, see Create a Private Workforce (Amazon Cognito).
 *
 * To create a private workforce using your own OIDC Identity Provider (IdP), specify your IdP configuration in `OidcConfig`. Your OIDC IdP must support *groups* because groups are used by Ground Truth and Amazon A2I to create work teams. For more information, see Create a Private Workforce (OIDC IdP).
 */
export const createWorkforce = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkforceRequest,
  output: CreateWorkforceResponse,
  errors: [],
}));
/**
 * Describes an action.
 */
export const describeAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeActionRequest,
  output: DescribeActionResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns a description of the specified algorithm that is in your account.
 */
export const describeAlgorithm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAlgorithmInput,
  output: DescribeAlgorithmOutput,
  errors: [],
}));
/**
 * Retrieves information of a SageMaker HyperPod cluster.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [ResourceNotFound],
}));
/**
 * Retrieves information of a node (also called a *instance* interchangeably) of a SageMaker HyperPod cluster.
 */
export const describeClusterNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterNodeRequest,
  output: DescribeClusterNodeResponse,
  errors: [ResourceNotFound],
}));
/**
 * Describes an edge deployment plan with deployment status per stage.
 */
export const describeEdgeDeploymentPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEdgeDeploymentPlanRequest,
    output: DescribeEdgeDeploymentPlanResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Returns a description of a hyperparameter tuning job, depending on the fields selected. These fields can include the name, Amazon Resource Name (ARN), job status of your tuning job and more.
 */
export const describeHyperParameterTuningJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeHyperParameterTuningJobRequest,
    output: DescribeHyperParameterTuningJobResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Returns information about an inference component.
 */
export const describeInferenceComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInferenceComponentInput,
    output: DescribeInferenceComponentOutput,
    errors: [],
  }),
);
/**
 * Describes a model that you created using the `CreateModel` API.
 */
export const describeModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeModelInput,
  output: DescribeModelOutput,
  errors: [],
}));
/**
 * Returns a description of the specified model package, which is used to create SageMaker models or list them on Amazon Web Services Marketplace.
 *
 * If you provided a KMS Key ID when you created your model package, you will see the KMS Decrypt API call in your CloudTrail logs when you use this API.
 *
 * To create models in SageMaker, buyers can subscribe to model packages listed on Amazon Web Services Marketplace.
 */
export const describeModelPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeModelPackageInput,
    output: DescribeModelPackageOutput,
    errors: [],
  }),
);
/**
 * Lists private workforce information, including workforce name, Amazon Resource Name (ARN), and, if applicable, allowed IP address ranges (CIDRs). Allowable IP address ranges are the IP addresses that workers can use to access tasks.
 *
 * This operation applies only to private workforces.
 */
export const describeWorkforce = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkforceRequest,
  output: DescribeWorkforceResponse,
  errors: [],
}));
/**
 * A list of devices.
 */
export const listDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevicesRequest,
  output: ListDevicesResponse,
  errors: [],
}));
/**
 * Returns a list of the subtasks for an Inference Recommender job.
 *
 * The supported subtasks are benchmarks, which evaluate the performance of your model on different instance types.
 */
export const listInferenceRecommendationsJobSteps =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListInferenceRecommendationsJobStepsRequest,
    output: ListInferenceRecommendationsJobStepsResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Gets a list of labeling jobs assigned to a specified work team.
 */
export const listLabelingJobsForWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListLabelingJobsForWorkteamRequest,
    output: ListLabelingJobsForWorkteamResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Lists spaces.
 */
export const listSpaces = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSpacesRequest,
  output: ListSpacesResponse,
  errors: [],
}));
/**
 * Retrieves a list of training plans for the current account.
 */
export const listTrainingPlans = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTrainingPlansRequest,
  output: ListTrainingPlansResponse,
  errors: [],
}));
/**
 * Renders the UI template so that you can preview the worker's experience.
 */
export const renderUiTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenderUiTemplateRequest,
  output: RenderUiTemplateResponse,
  errors: [ResourceNotFound],
}));
/**
 * Searches for available training plan offerings based on specified criteria.
 *
 * - Users search for available plan offerings based on their requirements (e.g., instance type, count, start time, duration).
 *
 * - And then, they create a plan that best matches their needs using the ID of the plan offering they want to use.
 *
 * For more information about how to reserve GPU capacity for your SageMaker training jobs or SageMaker HyperPod clusters using Amazon SageMaker Training Plan , see ` CreateTrainingPlan `.
 */
export const searchTrainingPlanOfferings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SearchTrainingPlanOfferingsRequest,
    output: SearchTrainingPlanOfferingsResponse,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Starts a pipeline execution.
 */
export const startPipelineExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartPipelineExecutionRequest,
    output: StartPipelineExecutionResponse,
    errors: [ConflictException, ResourceLimitExceeded, ResourceNotFound],
  }),
);
/**
 * Updates the default settings for new user profiles in the domain.
 */
export const updateDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainRequest,
  output: UpdateDomainResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Updates variant weight of one or more variants associated with an existing endpoint, or capacity of one variant associated with an existing endpoint. When it receives the request, SageMaker sets the endpoint status to `Updating`. After updating the endpoint, it sets the status to `InService`. To check the status of an endpoint, use the DescribeEndpoint API.
 */
export const updateEndpointWeightsAndCapacities =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEndpointWeightsAndCapacitiesInput,
    output: UpdateEndpointWeightsAndCapacitiesOutput,
    errors: [ResourceLimitExceeded],
  }));
/**
 * Creates a configuration for running a SageMaker AI image as a KernelGateway app. The configuration specifies the Amazon Elastic File System storage volume on the image, and a list of the kernels in the image.
 */
export const createAppImageConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAppImageConfigRequest,
    output: CreateAppImageConfigResponse,
    errors: [ResourceInUse],
  }),
);
/**
 * Creates an Autopilot job also referred to as Autopilot experiment or AutoML job.
 *
 * An AutoML job in SageMaker AI is a fully automated process that allows you to build machine learning models with minimal effort and machine learning expertise. When initiating an AutoML job, you provide your data and optionally specify parameters tailored to your use case. SageMaker AI then automates the entire model development lifecycle, including data preprocessing, model training, tuning, and evaluation. AutoML jobs are designed to simplify and accelerate the model building process by automating various tasks and exploring different combinations of machine learning algorithms, data preprocessing techniques, and hyperparameter values. The output of an AutoML job comprises one or more trained models ready for deployment and inference. Additionally, SageMaker AI AutoML jobs generate a candidate model leaderboard, allowing you to select the best-performing model for deployment.
 *
 * For more information about AutoML jobs, see https://docs.aws.amazon.com/sagemaker/latest/dg/autopilot-automate-model-development.html in the SageMaker AI developer guide.
 *
 * We recommend using the new versions CreateAutoMLJobV2 and DescribeAutoMLJobV2, which offer backward compatibility.
 *
 * `CreateAutoMLJobV2` can manage tabular problem types identical to those of its previous version `CreateAutoMLJob`, as well as time-series forecasting, non-tabular problem types such as image or text classification, and text generation (LLMs fine-tuning).
 *
 * Find guidelines about how to migrate a `CreateAutoMLJob` to `CreateAutoMLJobV2` in Migrate a CreateAutoMLJob to CreateAutoMLJobV2.
 *
 * You can find the best-performing model after you run an AutoML job by calling DescribeAutoMLJobV2 (recommended) or DescribeAutoMLJob.
 */
export const createAutoMLJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoMLJobRequest,
  output: CreateAutoMLJobResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates an Amazon SageMaker HyperPod cluster. SageMaker HyperPod is a capability of SageMaker for creating and managing persistent clusters for developing large machine learning models, such as large language models (LLMs) and diffusion models. To learn more, see Amazon SageMaker HyperPod in the *Amazon SageMaker Developer Guide*.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Create compute allocation definition. This defines how compute is allocated, shared, and borrowed for specified entities. Specifically, how to lend and borrow idle compute and assign a fair-share weight to the specified entities.
 */
export const createComputeQuota = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComputeQuotaRequest,
  output: CreateComputeQuotaResponse,
  errors: [ConflictException, ResourceLimitExceeded],
}));
/**
 * Creates an endpoint using the endpoint configuration specified in the request. SageMaker uses the endpoint to provision resources and deploy models. You create the endpoint configuration with the CreateEndpointConfig API.
 *
 * Use this API to deploy models using SageMaker hosting services.
 *
 * You must not delete an `EndpointConfig` that is in use by an endpoint that is live or while the `UpdateEndpoint` or `CreateEndpoint` operations are being performed on the endpoint. To update an endpoint, you must create a new `EndpointConfig`.
 *
 * The endpoint name must be unique within an Amazon Web Services Region in your Amazon Web Services account.
 *
 * When it receives the request, SageMaker creates the endpoint, launches the resources (ML compute instances), and deploys the model(s) on them.
 *
 * When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting `Eventually Consistent Reads` , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read.
 *
 * When SageMaker receives the request, it sets the endpoint status to `Creating`. After it creates the endpoint, it sets the status to `InService`. SageMaker can then process incoming requests for inferences. To check the status of an endpoint, use the DescribeEndpoint API.
 *
 * If any of the models hosted at this endpoint get model data from an Amazon S3 location, SageMaker uses Amazon Web Services Security Token Service to download model artifacts from the S3 path you provided. Amazon Web Services STS is activated in your Amazon Web Services account by default. If you previously deactivated Amazon Web Services STS for a region, you need to reactivate Amazon Web Services STS for that region. For more information, see Activating and Deactivating Amazon Web Services STS in an Amazon Web Services Region in the *Amazon Web Services Identity and Access Management User Guide*.
 *
 * To add the IAM role policies for using this API operation, go to the IAM console, and choose Roles in the left navigation pane. Search the IAM role that you want to grant access to use the CreateEndpoint and CreateEndpointConfig API operations, add the following policies to the role.
 *
 * - Option 1: For a full SageMaker access, search and attach the `AmazonSageMakerFullAccess` policy.
 *
 * - Option 2: For granting a limited access to an IAM role, paste the following Action elements manually into the JSON file of the IAM role:
 *
 * `"Action": ["sagemaker:CreateEndpoint", "sagemaker:CreateEndpointConfig"]`
 *
 * `"Resource": [`
 *
 * `"arn:aws:sagemaker:region:account-id:endpoint/endpointName"`
 *
 * `"arn:aws:sagemaker:region:account-id:endpoint-config/endpointConfigName"`
 *
 * `]`
 *
 * For more information, see SageMaker API Permissions: Actions, Permissions, and Resources Reference.
 */
export const createEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointInput,
  output: CreateEndpointOutput,
  errors: [ResourceLimitExceeded],
}));
/**
 * Create a new `FeatureGroup`. A `FeatureGroup` is a group of `Features` defined in the `FeatureStore` to describe a `Record`.
 *
 * The `FeatureGroup` defines the schema and features contained in the `FeatureGroup`. A `FeatureGroup` definition is composed of a list of `Features`, a `RecordIdentifierFeatureName`, an `EventTimeFeatureName` and configurations for its `OnlineStore` and `OfflineStore`. Check Amazon Web Services service quotas to see the `FeatureGroup`s quota for your Amazon Web Services account.
 *
 * Note that it can take approximately 10-15 minutes to provision an `OnlineStore` `FeatureGroup` with the `InMemory` `StorageType`.
 *
 * You must include at least one of `OnlineStoreConfig` and `OfflineStoreConfig` to create a `FeatureGroup`.
 */
export const createFeatureGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFeatureGroupRequest,
  output: CreateFeatureGroupResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates a flow definition.
 */
export const createFlowDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateFlowDefinitionRequest,
    output: CreateFlowDefinitionResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }),
);
/**
 * Starts a hyperparameter tuning job. A hyperparameter tuning job finds the best version of a model by running many training jobs on your dataset using the algorithm you choose and values for hyperparameters within ranges that you specify. It then chooses the hyperparameter values that result in a model that performs the best, as measured by an objective metric that you choose.
 *
 * A hyperparameter tuning job automatically creates Amazon SageMaker experiments, trials, and trial components for each training job that it runs. You can view these entities in Amazon SageMaker Studio. For more information, see View Experiments, Trials, and Trial Components.
 *
 * Do not include any security-sensitive information including account access IDs, secrets, or tokens in any hyperparameter fields. As part of the shared responsibility model, you are responsible for any potential exposure, unauthorized access, or compromise of your sensitive data if caused by any security-sensitive information included in the request hyperparameter variable or plain text fields..
 */
export const createHyperParameterTuningJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateHyperParameterTuningJobRequest,
    output: CreateHyperParameterTuningJobResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates an inference experiment using the configurations specified in the request.
 *
 * Use this API to setup and schedule an experiment to compare model variants on a Amazon SageMaker inference endpoint. For more information about inference experiments, see Shadow tests.
 *
 * Amazon SageMaker begins your experiment at the scheduled time and routes traffic to your endpoint's model variants based on your specified configuration.
 *
 * While the experiment is in progress or after it has concluded, you can view metrics that compare your model variants. For more information, see View, monitor, and edit shadow tests.
 */
export const createInferenceExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInferenceExperimentRequest,
    output: CreateInferenceExperimentResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }),
);
/**
 * Creates a job that uses workers to label the data objects in your input dataset. You can use the labeled data to train machine learning models.
 *
 * You can select your workforce from one of three providers:
 *
 * - A private workforce that you create. It can include employees, contractors, and outside experts. Use a private workforce when want the data to stay within your organization or when a specific set of skills is required.
 *
 * - One or more vendors that you select from the Amazon Web Services Marketplace. Vendors provide expertise in specific areas.
 *
 * - The Amazon Mechanical Turk workforce. This is the largest workforce, but it should only be used for public data or data that has been stripped of any personally identifiable information.
 *
 * You can also use *automated data labeling* to reduce the number of data objects that need to be labeled by a human. Automated data labeling uses *active learning* to determine if a data object can be labeled by machine or if it needs to be sent to a human worker. For more information, see Using Automated Data Labeling.
 *
 * The data objects to be labeled are contained in an Amazon S3 bucket. You create a *manifest file* that describes the location of each object. For more information, see Using Input and Output Data.
 *
 * The output can be used as the manifest file for another labeling job or as training data for your machine learning models.
 *
 * You can use this operation to create a static labeling job or a streaming labeling job. A static labeling job stops if all data objects in the input manifest file identified in `ManifestS3Uri` have been labeled. A streaming labeling job runs perpetually until it is manually stopped, or remains idle for 10 days. You can send new data objects to an active (`InProgress`) streaming labeling job in real time. To learn how to create a static labeling job, see Create a Labeling Job (API) in the Amazon SageMaker Developer Guide. To learn how to create a streaming labeling job, see Create a Streaming Labeling Job.
 */
export const createLabelingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLabelingJobRequest,
  output: CreateLabelingJobResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates a model package that you can use to create SageMaker models or list on Amazon Web Services Marketplace, or a versioned model that is part of a model group. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in SageMaker.
 *
 * To create a model package by specifying a Docker container that contains your inference code and the Amazon S3 location of your model artifacts, provide values for `InferenceSpecification`. To create a model from an algorithm resource that you created or subscribed to in Amazon Web Services Marketplace, provide a value for `SourceAlgorithmSpecification`.
 *
 * There are two types of model packages:
 *
 * - Versioned - a model that is part of a model group in the model registry.
 *
 * - Unversioned - a model package that is not part of a model group.
 */
export const createModelPackage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelPackageInput,
  output: CreateModelPackageOutput,
  errors: [ConflictException, ResourceLimitExceeded],
}));
/**
 * Creates a schedule that regularly starts Amazon SageMaker AI Processing Jobs to monitor the data captured for an Amazon SageMaker AI Endpoint.
 */
export const createMonitoringSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMonitoringScheduleRequest,
    output: CreateMonitoringScheduleResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }),
);
/**
 * Creates a job that optimizes a model for inference performance. To create the job, you provide the location of a source model, and you provide the settings for the optimization techniques that you want the job to apply. When the job completes successfully, SageMaker uploads the new optimized model to the output destination that you specify.
 *
 * For more information about how to use this action, and about the supported optimization techniques, see Optimize model inference with Amazon SageMaker.
 */
export const createOptimizationJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateOptimizationJobRequest,
    output: CreateOptimizationJobResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }),
);
/**
 * Creates a processing job.
 */
export const createProcessingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProcessingJobRequest,
  output: CreateProcessingJobResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Creates a machine learning (ML) project that can contain one or more templates that set up an ML pipeline from training to deploying an approved model.
 */
export const createProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectInput,
  output: CreateProjectOutput,
  errors: [ResourceLimitExceeded],
}));
/**
 * Starts a transform job. A transform job uses a trained model to get inferences on a dataset and saves these results to an Amazon S3 location that you specify.
 *
 * To perform batch transformations, you create a transform job and use the data that you have readily available.
 *
 * In the request body, you provide the following:
 *
 * - `TransformJobName` - Identifies the transform job. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account.
 *
 * - `ModelName` - Identifies the model to use. `ModelName` must be the name of an existing Amazon SageMaker model in the same Amazon Web Services Region and Amazon Web Services account. For information on creating a model, see CreateModel.
 *
 * - `TransformInput` - Describes the dataset to be transformed and the Amazon S3 location where it is stored.
 *
 * - `TransformOutput` - Identifies the Amazon S3 location where you want Amazon SageMaker to save the results from the transform job.
 *
 * - `TransformResources` - Identifies the ML compute instances and AMI image versions for the transform job.
 *
 * For more information about how batch transformation works, see Batch Transform.
 */
export const createTransformJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTransformJobRequest,
  output: CreateTransformJobResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Creates a new work team for labeling your data. A work team is defined by one or more Amazon Cognito user pools. You must first create the user pools before you can create a work team.
 *
 * You cannot create more than 25 work teams in an account and region.
 */
export const createWorkteam = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkteamRequest,
  output: CreateWorkteamResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Returns information about an AutoML job created by calling CreateAutoMLJob.
 *
 * AutoML jobs created by calling CreateAutoMLJobV2 cannot be described by `DescribeAutoMLJob`.
 */
export const describeAutoMLJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAutoMLJobRequest,
  output: DescribeAutoMLJobResponse,
  errors: [ResourceNotFound],
}));
/**
 * Returns information about an AutoML job created by calling CreateAutoMLJobV2 or CreateAutoMLJob.
 */
export const describeAutoMLJobV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAutoMLJobV2Request,
  output: DescribeAutoMLJobV2Response,
  errors: [ResourceNotFound],
}));
/**
 * Returns the description of an endpoint.
 */
export const describeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointInput,
  output: DescribeEndpointOutput,
  errors: [],
}));
/**
 * Provides the results of the Inference Recommender job. One or more recommendation jobs are returned.
 */
export const describeInferenceRecommendationsJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeInferenceRecommendationsJobRequest,
    output: DescribeInferenceRecommendationsJobResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Describes the details of a project.
 */
export const describeProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProjectInput,
  output: DescribeProjectOutput,
  errors: [],
}));
/**
 * An auto-complete API for the search functionality in the SageMaker console. It returns suggestions of possible matches for the property name to use in `Search` queries. Provides suggestions for `HyperParameters`, `Tags`, and `Metrics`.
 */
export const getSearchSuggestions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSearchSuggestionsRequest,
    output: GetSearchSuggestionsResponse,
    errors: [],
  }),
);
/**
 * Lists the domain, framework, task, and model name of standard machine learning models found in common model zoos.
 */
export const listModelMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListModelMetadataRequest,
  output: ListModelMetadataResponse,
  errors: [],
}));
/**
 * Gets the alerts for a single monitoring schedule.
 */
export const listMonitoringAlerts = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMonitoringAlertsRequest,
    output: ListMonitoringAlertsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Use this action to inspect your lineage and discover relationships between entities. For more information, see Querying Lineage Entities in the *Amazon SageMaker Developer Guide*.
 */
export const queryLineage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QueryLineageRequest,
  output: QueryLineageResponse,
  errors: [ResourceNotFound],
}));
/**
 * Updates the platform software of a SageMaker HyperPod cluster for security patching. To learn how to use this API, see Update the SageMaker HyperPod platform software of a cluster.
 *
 * The `UpgradeClusterSoftware` API call may impact your SageMaker HyperPod cluster uptime and availability. Plan accordingly to mitigate potential disruptions to your workloads.
 */
export const updateClusterSoftware = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClusterSoftwareRequest,
    output: UpdateClusterSoftwareResponse,
    errors: [ConflictException, ResourceNotFound],
  }),
);
/**
 * Updates an inference component.
 */
export const updateInferenceComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInferenceComponentInput,
    output: UpdateInferenceComponentOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Updates a machine learning (ML) project that is created from a template that sets up an ML pipeline from training to deploying an approved model.
 *
 * You must not update a project that is in use. If you update the `ServiceCatalogProvisioningUpdateDetails` of a project that is active or being created, or updated, you may lose resources already created by the project.
 */
export const updateProject = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectInput,
  output: UpdateProjectOutput,
  errors: [ConflictException],
}));
/**
 * Create a machine learning algorithm that you can use in SageMaker and list in the Amazon Web Services Marketplace.
 */
export const createAlgorithm = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAlgorithmInput,
  output: CreateAlgorithmOutput,
  errors: [],
}));
/**
 * Creates a definition for a job that monitors data quality and drift. For information about model monitor, see Amazon SageMaker AI Model Monitor.
 */
export const createDataQualityJobDefinition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataQualityJobDefinitionRequest,
    output: CreateDataQualityJobDefinitionResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates a `Domain`. A domain consists of an associated Amazon Elastic File System volume, a list of authorized users, and a variety of security, application, policy, and Amazon Virtual Private Cloud (VPC) configurations. Users within a domain can share notebook files and other artifacts with each other.
 *
 * **EFS storage**
 *
 * When a domain is created, an EFS volume is created for use by all of the users within the domain. Each user receives a private home directory within the EFS volume for notebooks, Git repositories, and data files.
 *
 * SageMaker AI uses the Amazon Web Services Key Management Service (Amazon Web Services KMS) to encrypt the EFS volume attached to the domain with an Amazon Web Services managed key by default. For more control, you can specify a customer managed key. For more information, see Protect Data at Rest Using Encryption.
 *
 * **VPC configuration**
 *
 * All traffic between the domain and the Amazon EFS volume is through the specified VPC and subnets. For other traffic, you can specify the `AppNetworkAccessType` parameter. `AppNetworkAccessType` corresponds to the network access type that you choose when you onboard to the domain. The following options are available:
 *
 * - `PublicInternetOnly` - Non-EFS traffic goes through a VPC managed by Amazon SageMaker AI, which allows internet access. This is the default value.
 *
 * - `VpcOnly` - All traffic is through the specified VPC and subnets. Internet access is disabled by default. To allow internet access, you must specify a NAT gateway.
 *
 * When internet access is disabled, you won't be able to run a Amazon SageMaker AI Studio notebook or to train or host models unless your VPC has an interface endpoint to the SageMaker AI API and runtime or a NAT gateway and your security groups allow outbound connections.
 *
 * NFS traffic over TCP on port 2049 needs to be allowed in both inbound and outbound rules in order to launch a Amazon SageMaker AI Studio app successfully.
 *
 * For more information, see Connect Amazon SageMaker AI Studio Notebooks to Resources in a VPC.
 */
export const createDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDomainRequest,
  output: CreateDomainResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Creates an endpoint configuration that SageMaker hosting services uses to deploy models. In the configuration, you identify one or more models, created using the `CreateModel` API, to deploy and the resources that you want SageMaker to provision. Then you call the CreateEndpoint API.
 *
 * Use this API if you want to use SageMaker hosting services to deploy models into production.
 *
 * In the request, you define a `ProductionVariant`, for each model that you want to deploy. Each `ProductionVariant` parameter also describes the resources that you want SageMaker to provision. This includes the number and type of ML compute instances to deploy.
 *
 * If you are hosting multiple models, you also assign a `VariantWeight` to specify how much traffic you want to allocate to each model. For example, suppose that you want to host two models, A and B, and you assign traffic weight 2 for model A and 1 for model B. SageMaker distributes two-thirds of the traffic to Model A, and one-third to model B.
 *
 * When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting `Eventually Consistent Reads` , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read.
 */
export const createEndpointConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEndpointConfigInput,
    output: CreateEndpointConfigOutput,
    errors: [ResourceLimitExceeded],
  }),
);
/**
 * Starts a recommendation job. You can create either an instance recommendation or load test job.
 */
export const createInferenceRecommendationsJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateInferenceRecommendationsJobRequest,
    output: CreateInferenceRecommendationsJobResponse,
    errors: [ResourceInUse, ResourceLimitExceeded],
  }));
/**
 * Creates a model in SageMaker. In the request, you name the model and describe a primary container. For the primary container, you specify the Docker image that contains inference code, artifacts (from prior training), and a custom environment map that the inference code uses when you deploy the model for predictions.
 *
 * Use this API to create a model if you want to use SageMaker hosting services or run a batch transform job.
 *
 * To host your model, you create an endpoint configuration with the `CreateEndpointConfig` API, and then create an endpoint with the `CreateEndpoint` API. SageMaker then deploys all of the containers that you defined for the model in the hosting environment.
 *
 * To run a batch transform using your model, you start a job with the `CreateTransformJob` API. SageMaker uses your model and your dataset to get inferences which are then saved to a specified S3 location.
 *
 * In the request, you also provide an IAM role that SageMaker can assume to access model artifacts and docker image for deployment on ML compute hosting instances or for batch transform jobs. In addition, you also use the IAM role to manage permissions the inference code needs. For example, if the inference code access any other Amazon Web Services resources, you grant necessary permissions via this role.
 */
export const createModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateModelInput,
  output: CreateModelOutput,
  errors: [ResourceLimitExceeded],
}));
/**
 * Creates a private space or a space used for real time collaboration in a domain.
 */
export const createSpace = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSpaceRequest,
  output: CreateSpaceResponse,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Starts a model training job. After training completes, SageMaker saves the resulting model artifacts to an Amazon S3 location that you specify.
 *
 * If you choose to host your model using SageMaker hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts in a machine learning service other than SageMaker, provided that you know how to use them for inference.
 *
 * In the request body, you provide the following:
 *
 * - `AlgorithmSpecification` - Identifies the training algorithm to use.
 *
 * - `HyperParameters` - Specify these algorithm-specific parameters to enable the estimation of model parameters during training. Hyperparameters can be tuned to optimize this learning process. For a list of hyperparameters for each training algorithm provided by SageMaker, see Algorithms.
 *
 * Do not include any security-sensitive information including account access IDs, secrets, or tokens in any hyperparameter fields. As part of the shared responsibility model, you are responsible for any potential exposure, unauthorized access, or compromise of your sensitive data if caused by security-sensitive information included in the request hyperparameter variable or plain text fields.
 *
 * - `InputDataConfig` - Describes the input required by the training job and the Amazon S3, EFS, or FSx location where it is stored.
 *
 * - `OutputDataConfig` - Identifies the Amazon S3 bucket where you want SageMaker to save the results of model training.
 *
 * - `ResourceConfig` - Identifies the resources, ML compute instances, and ML storage volumes to deploy for model training. In distributed training, you specify more than one instance.
 *
 * - `EnableManagedSpotTraining` - Optimize the cost of training machine learning models by up to 80% by using Amazon EC2 Spot instances. For more information, see Managed Spot Training.
 *
 * - `RoleArn` - The Amazon Resource Name (ARN) that SageMaker assumes to perform tasks on your behalf during model training. You must grant this role the necessary permissions so that SageMaker can successfully complete model training.
 *
 * - `StoppingCondition` - To help cap training costs, use `MaxRuntimeInSeconds` to set a time limit for training. Use `MaxWaitTimeInSeconds` to specify how long a managed spot training job has to complete.
 *
 * - `Environment` - The environment variables to set in the Docker container.
 *
 * Do not include any security-sensitive information including account access IDs, secrets, or tokens in any environment fields. As part of the shared responsibility model, you are responsible for any potential exposure, unauthorized access, or compromise of your sensitive data if caused by security-sensitive information included in the request environment variable or plain text fields.
 *
 * - `RetryStrategy` - The number of times to retry the job when the job fails due to an `InternalServerError`.
 *
 * For more information about SageMaker, see How It Works.
 */
export const createTrainingJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrainingJobRequest,
  output: CreateTrainingJobResponse,
  errors: [ResourceInUse, ResourceLimitExceeded, ResourceNotFound],
}));
/**
 * Gets a list of `PipeLineExecutionStep` objects.
 */
export const listPipelineExecutionSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPipelineExecutionStepsRequest,
    output: ListPipelineExecutionStepsResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Creates an Autopilot job also referred to as Autopilot experiment or AutoML job V2.
 *
 * An AutoML job in SageMaker AI is a fully automated process that allows you to build machine learning models with minimal effort and machine learning expertise. When initiating an AutoML job, you provide your data and optionally specify parameters tailored to your use case. SageMaker AI then automates the entire model development lifecycle, including data preprocessing, model training, tuning, and evaluation. AutoML jobs are designed to simplify and accelerate the model building process by automating various tasks and exploring different combinations of machine learning algorithms, data preprocessing techniques, and hyperparameter values. The output of an AutoML job comprises one or more trained models ready for deployment and inference. Additionally, SageMaker AI AutoML jobs generate a candidate model leaderboard, allowing you to select the best-performing model for deployment.
 *
 * For more information about AutoML jobs, see https://docs.aws.amazon.com/sagemaker/latest/dg/autopilot-automate-model-development.html in the SageMaker AI developer guide.
 *
 * AutoML jobs V2 support various problem types such as regression, binary, and multiclass classification with tabular data, text and image classification, time-series forecasting, and fine-tuning of large language models (LLMs) for text generation.
 *
 * CreateAutoMLJobV2 and DescribeAutoMLJobV2 are new versions of CreateAutoMLJob and DescribeAutoMLJob which offer backward compatibility.
 *
 * `CreateAutoMLJobV2` can manage tabular problem types identical to those of its previous version `CreateAutoMLJob`, as well as time-series forecasting, non-tabular problem types such as image or text classification, and text generation (LLMs fine-tuning).
 *
 * Find guidelines about how to migrate a `CreateAutoMLJob` to `CreateAutoMLJobV2` in Migrate a CreateAutoMLJob to CreateAutoMLJobV2.
 *
 * For the list of available problem types supported by `CreateAutoMLJobV2`, see AutoMLProblemTypeConfig.
 *
 * You can find the best-performing model after you run an AutoML job V2 by calling DescribeAutoMLJobV2.
 */
export const createAutoMLJobV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoMLJobV2Request,
  output: CreateAutoMLJobV2Response,
  errors: [ResourceInUse, ResourceLimitExceeded],
}));
/**
 * Retrieves detailed information about a specific event for a given HyperPod cluster. This functionality is only supported when the `NodeProvisioningMode` is set to `Continuous`.
 */
export const describeClusterEvent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeClusterEventRequest,
    output: DescribeClusterEventResponse,
    errors: [ResourceNotFound],
  }),
);
/**
 * Starts an Amazon SageMaker Inference Recommender autoscaling recommendation job. Returns recommendations for autoscaling policies that you can apply to your SageMaker endpoint.
 */
export const getScalingConfigurationRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetScalingConfigurationRecommendationRequest,
    output: GetScalingConfigurationRecommendationResponse,
    errors: [ResourceNotFound],
  }));
/**
 * Finds SageMaker resources that match a search query. Matching resources are returned as a list of `SearchRecord` objects in the response. You can sort the search results by any resource property in a ascending or descending order.
 *
 * You can query against the following value types: numeric, text, Boolean, and timestamp.
 *
 * The Search API may provide access to otherwise restricted data. See Amazon SageMaker API Permissions: Actions, Permissions, and Resources Reference for more information.
 */
export const search = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchRequest,
  output: SearchResponse,
  errors: [],
}));
