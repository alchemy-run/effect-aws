import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "EMR containers",
  serviceShapeName: "AwsChicagoWebService",
});
const auth = T.AwsAuthSigv4({ name: "emr-containers" });
const ver = T.ServiceVersion("2020-10-01");
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
                        url: "https://emr-containers-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://emr-containers.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://emr-containers.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://emr-containers-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://emr-containers.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://emr-containers.{Region}.{PartitionResult#dnsSuffix}",
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
export const JobRunStates = S.Array(S.String);
export const EndpointTypes = S.Array(S.String);
export const EndpointStates = S.Array(S.String);
export const VirtualClusterStates = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CancelJobRunRequest extends S.Class<CancelJobRunRequest>(
  "CancelJobRunRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    virtualClusterId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/virtualclusters/{virtualClusterId}/jobruns/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EksInfo extends S.Class<EksInfo>("EksInfo")({
  namespace: S.optional(S.String),
  nodeLabel: S.optional(S.String),
}) {}
export const ContainerInfo = S.Union(S.Struct({ eksInfo: EksInfo }));
export class ContainerProvider extends S.Class<ContainerProvider>(
  "ContainerProvider",
)({ type: S.String, id: S.String, info: S.optional(ContainerInfo) }) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateVirtualClusterRequest extends S.Class<CreateVirtualClusterRequest>(
  "CreateVirtualClusterRequest",
)(
  {
    name: S.String,
    containerProvider: ContainerProvider,
    clientToken: S.String,
    tags: S.optional(TagMap),
    securityConfigurationId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/virtualclusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobTemplateRequest extends S.Class<DeleteJobTemplateRequest>(
  "DeleteJobTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/jobtemplates/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteManagedEndpointRequest extends S.Class<DeleteManagedEndpointRequest>(
  "DeleteManagedEndpointRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    virtualClusterId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/virtualclusters/{virtualClusterId}/endpoints/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteVirtualClusterRequest extends S.Class<DeleteVirtualClusterRequest>(
  "DeleteVirtualClusterRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/virtualclusters/{id}" }),
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
  {
    id: S.String.pipe(T.HttpLabel()),
    virtualClusterId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/virtualclusters/{virtualClusterId}/jobruns/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobTemplateRequest extends S.Class<DescribeJobTemplateRequest>(
  "DescribeJobTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/jobtemplates/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeManagedEndpointRequest extends S.Class<DescribeManagedEndpointRequest>(
  "DescribeManagedEndpointRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    virtualClusterId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/virtualclusters/{virtualClusterId}/endpoints/{id}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSecurityConfigurationRequest extends S.Class<DescribeSecurityConfigurationRequest>(
  "DescribeSecurityConfigurationRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/securityconfigurations/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeVirtualClusterRequest extends S.Class<DescribeVirtualClusterRequest>(
  "DescribeVirtualClusterRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/virtualclusters/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetManagedEndpointSessionCredentialsRequest extends S.Class<GetManagedEndpointSessionCredentialsRequest>(
  "GetManagedEndpointSessionCredentialsRequest",
)(
  {
    endpointIdentifier: S.String.pipe(T.HttpLabel()),
    virtualClusterIdentifier: S.String.pipe(T.HttpLabel()),
    executionRoleArn: S.String,
    credentialType: S.String,
    durationInSeconds: S.optional(S.Number),
    logContext: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/virtualclusters/{virtualClusterIdentifier}/endpoints/{endpointIdentifier}/credentials",
    }),
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
    virtualClusterId: S.String.pipe(T.HttpLabel()),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
    states: S.optional(JobRunStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/virtualclusters/{virtualClusterId}/jobruns",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobTemplatesRequest extends S.Class<ListJobTemplatesRequest>(
  "ListJobTemplatesRequest",
)(
  {
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/jobtemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListManagedEndpointsRequest extends S.Class<ListManagedEndpointsRequest>(
  "ListManagedEndpointsRequest",
)(
  {
    virtualClusterId: S.String.pipe(T.HttpLabel()),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    types: S.optional(EndpointTypes).pipe(T.HttpQuery("types")),
    states: S.optional(EndpointStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/virtualclusters/{virtualClusterId}/endpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSecurityConfigurationsRequest extends S.Class<ListSecurityConfigurationsRequest>(
  "ListSecurityConfigurationsRequest",
)(
  {
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/securityconfigurations" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVirtualClustersRequest extends S.Class<ListVirtualClustersRequest>(
  "ListVirtualClustersRequest",
)(
  {
    containerProviderId: S.optional(S.String).pipe(
      T.HttpQuery("containerProviderId"),
    ),
    containerProviderType: S.optional(S.String).pipe(
      T.HttpQuery("containerProviderType"),
    ),
    createdAfter: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdAfter"),
    ),
    createdBefore: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
      T.HttpQuery("createdBefore"),
    ),
    states: S.optional(VirtualClusterStates).pipe(T.HttpQuery("states")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    eksAccessEntryIntegrated: S.optional(S.Boolean).pipe(
      T.HttpQuery("eksAccessEntryIntegrated"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/virtualclusters" }),
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
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagMap },
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
    resourceArn: S.String.pipe(T.HttpLabel()),
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
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration),
) as any as S.Schema<ConfigurationList>;
export class ManagedLogs extends S.Class<ManagedLogs>("ManagedLogs")({
  allowAWSToRetainLogs: S.optional(S.String),
  encryptionKeyArn: S.optional(S.String),
}) {}
export class CloudWatchMonitoringConfiguration extends S.Class<CloudWatchMonitoringConfiguration>(
  "CloudWatchMonitoringConfiguration",
)({ logGroupName: S.String, logStreamNamePrefix: S.optional(S.String) }) {}
export class S3MonitoringConfiguration extends S.Class<S3MonitoringConfiguration>(
  "S3MonitoringConfiguration",
)({ logUri: S.String }) {}
export class ContainerLogRotationConfiguration extends S.Class<ContainerLogRotationConfiguration>(
  "ContainerLogRotationConfiguration",
)({ rotationSize: S.String, maxFilesToKeep: S.Number }) {}
export class MonitoringConfiguration extends S.Class<MonitoringConfiguration>(
  "MonitoringConfiguration",
)({
  managedLogs: S.optional(ManagedLogs),
  persistentAppUI: S.optional(S.String),
  cloudWatchMonitoringConfiguration: S.optional(
    CloudWatchMonitoringConfiguration,
  ),
  s3MonitoringConfiguration: S.optional(S3MonitoringConfiguration),
  containerLogRotationConfiguration: S.optional(
    ContainerLogRotationConfiguration,
  ),
}) {}
export class ConfigurationOverrides extends S.Class<ConfigurationOverrides>(
  "ConfigurationOverrides",
)({
  applicationConfiguration: S.optional(ConfigurationList),
  monitoringConfiguration: S.optional(MonitoringConfiguration),
}) {}
export const EntryPointArguments = S.Array(S.String);
export class SparkSubmitJobDriver extends S.Class<SparkSubmitJobDriver>(
  "SparkSubmitJobDriver",
)({
  entryPoint: S.String,
  entryPointArguments: S.optional(EntryPointArguments),
  sparkSubmitParameters: S.optional(S.String),
}) {}
export class SparkSqlJobDriver extends S.Class<SparkSqlJobDriver>(
  "SparkSqlJobDriver",
)({
  entryPoint: S.optional(S.String),
  sparkSqlParameters: S.optional(S.String),
}) {}
export class JobDriver extends S.Class<JobDriver>("JobDriver")({
  sparkSubmitJobDriver: S.optional(SparkSubmitJobDriver),
  sparkSqlJobDriver: S.optional(SparkSqlJobDriver),
}) {}
export class RetryPolicyConfiguration extends S.Class<RetryPolicyConfiguration>(
  "RetryPolicyConfiguration",
)({ maxAttempts: S.Number }) {}
export class RetryPolicyExecution extends S.Class<RetryPolicyExecution>(
  "RetryPolicyExecution",
)({ currentAttemptCount: S.Number }) {}
export class JobRun extends S.Class<JobRun>("JobRun")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  virtualClusterId: S.optional(S.String),
  arn: S.optional(S.String),
  state: S.optional(S.String),
  clientToken: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  releaseLabel: S.optional(S.String),
  configurationOverrides: S.optional(ConfigurationOverrides),
  jobDriver: S.optional(JobDriver),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  stateDetails: S.optional(S.String),
  failureReason: S.optional(S.String),
  tags: S.optional(TagMap),
  retryPolicyConfiguration: S.optional(RetryPolicyConfiguration),
  retryPolicyExecution: S.optional(RetryPolicyExecution),
}) {}
export const JobRuns = S.Array(JobRun);
export class ParametricCloudWatchMonitoringConfiguration extends S.Class<ParametricCloudWatchMonitoringConfiguration>(
  "ParametricCloudWatchMonitoringConfiguration",
)({
  logGroupName: S.optional(S.String),
  logStreamNamePrefix: S.optional(S.String),
}) {}
export class ParametricS3MonitoringConfiguration extends S.Class<ParametricS3MonitoringConfiguration>(
  "ParametricS3MonitoringConfiguration",
)({ logUri: S.optional(S.String) }) {}
export class ParametricMonitoringConfiguration extends S.Class<ParametricMonitoringConfiguration>(
  "ParametricMonitoringConfiguration",
)({
  persistentAppUI: S.optional(S.String),
  cloudWatchMonitoringConfiguration: S.optional(
    ParametricCloudWatchMonitoringConfiguration,
  ),
  s3MonitoringConfiguration: S.optional(ParametricS3MonitoringConfiguration),
}) {}
export class ParametricConfigurationOverrides extends S.Class<ParametricConfigurationOverrides>(
  "ParametricConfigurationOverrides",
)({
  applicationConfiguration: S.optional(ConfigurationList),
  monitoringConfiguration: S.optional(ParametricMonitoringConfiguration),
}) {}
export class TemplateParameterConfiguration extends S.Class<TemplateParameterConfiguration>(
  "TemplateParameterConfiguration",
)({ type: S.optional(S.String), defaultValue: S.optional(S.String) }) {}
export const TemplateParameterConfigurationMap = S.Record({
  key: S.String,
  value: TemplateParameterConfiguration,
});
export class JobTemplateData extends S.Class<JobTemplateData>(
  "JobTemplateData",
)({
  executionRoleArn: S.String,
  releaseLabel: S.String,
  configurationOverrides: S.optional(ParametricConfigurationOverrides),
  jobDriver: JobDriver,
  parameterConfiguration: S.optional(TemplateParameterConfigurationMap),
  jobTags: S.optional(TagMap),
}) {}
export class JobTemplate extends S.Class<JobTemplate>("JobTemplate")({
  name: S.optional(S.String),
  id: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  tags: S.optional(TagMap),
  jobTemplateData: JobTemplateData,
  kmsKeyArn: S.optional(S.String),
  decryptionError: S.optional(S.String),
}) {}
export const JobTemplates = S.Array(JobTemplate);
export class Certificate extends S.Class<Certificate>("Certificate")({
  certificateArn: S.optional(S.String),
  certificateData: S.optional(S.String),
}) {}
export const SubnetIds = S.Array(S.String);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  virtualClusterId: S.optional(S.String),
  type: S.optional(S.String),
  state: S.optional(S.String),
  releaseLabel: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  certificateArn: S.optional(S.String),
  certificateAuthority: S.optional(Certificate),
  configurationOverrides: S.optional(ConfigurationOverrides),
  serverUrl: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  securityGroup: S.optional(S.String),
  subnetIds: S.optional(SubnetIds),
  stateDetails: S.optional(S.String),
  failureReason: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const Endpoints = S.Array(Endpoint);
export class SecureNamespaceInfo extends S.Class<SecureNamespaceInfo>(
  "SecureNamespaceInfo",
)({ clusterId: S.optional(S.String), namespace: S.optional(S.String) }) {}
export class LakeFormationConfiguration extends S.Class<LakeFormationConfiguration>(
  "LakeFormationConfiguration",
)({
  authorizedSessionTagValue: S.optional(S.String),
  secureNamespaceInfo: S.optional(SecureNamespaceInfo),
  queryEngineRoleArn: S.optional(S.String),
}) {}
export class TLSCertificateConfiguration extends S.Class<TLSCertificateConfiguration>(
  "TLSCertificateConfiguration",
)({
  certificateProviderType: S.optional(S.String),
  publicCertificateSecretArn: S.optional(S.String),
  privateCertificateSecretArn: S.optional(S.String),
}) {}
export class InTransitEncryptionConfiguration extends S.Class<InTransitEncryptionConfiguration>(
  "InTransitEncryptionConfiguration",
)({ tlsCertificateConfiguration: S.optional(TLSCertificateConfiguration) }) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({
  inTransitEncryptionConfiguration: S.optional(
    InTransitEncryptionConfiguration,
  ),
}) {}
export class AuthorizationConfiguration extends S.Class<AuthorizationConfiguration>(
  "AuthorizationConfiguration",
)({
  lakeFormationConfiguration: S.optional(LakeFormationConfiguration),
  encryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export class SecurityConfigurationData extends S.Class<SecurityConfigurationData>(
  "SecurityConfigurationData",
)({ authorizationConfiguration: S.optional(AuthorizationConfiguration) }) {}
export class SecurityConfiguration extends S.Class<SecurityConfiguration>(
  "SecurityConfiguration",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  securityConfigurationData: S.optional(SecurityConfigurationData),
  tags: S.optional(TagMap),
}) {}
export const SecurityConfigurations = S.Array(SecurityConfiguration);
export class VirtualCluster extends S.Class<VirtualCluster>("VirtualCluster")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  state: S.optional(S.String),
  containerProvider: S.optional(ContainerProvider),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagMap),
  securityConfigurationId: S.optional(S.String),
}) {}
export const VirtualClusters = S.Array(VirtualCluster);
export const TemplateParameterInputMap = S.Record({
  key: S.String,
  value: S.String,
});
export class CancelJobRunResponse extends S.Class<CancelJobRunResponse>(
  "CancelJobRunResponse",
)({ id: S.optional(S.String), virtualClusterId: S.optional(S.String) }) {}
export class CreateVirtualClusterResponse extends S.Class<CreateVirtualClusterResponse>(
  "CreateVirtualClusterResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export class DeleteJobTemplateResponse extends S.Class<DeleteJobTemplateResponse>(
  "DeleteJobTemplateResponse",
)({ id: S.optional(S.String) }) {}
export class DeleteManagedEndpointResponse extends S.Class<DeleteManagedEndpointResponse>(
  "DeleteManagedEndpointResponse",
)({ id: S.optional(S.String), virtualClusterId: S.optional(S.String) }) {}
export class DeleteVirtualClusterResponse extends S.Class<DeleteVirtualClusterResponse>(
  "DeleteVirtualClusterResponse",
)({ id: S.optional(S.String) }) {}
export class ListJobRunsResponse extends S.Class<ListJobRunsResponse>(
  "ListJobRunsResponse",
)({ jobRuns: S.optional(JobRuns), nextToken: S.optional(S.String) }) {}
export class ListJobTemplatesResponse extends S.Class<ListJobTemplatesResponse>(
  "ListJobTemplatesResponse",
)({ templates: S.optional(JobTemplates), nextToken: S.optional(S.String) }) {}
export class ListManagedEndpointsResponse extends S.Class<ListManagedEndpointsResponse>(
  "ListManagedEndpointsResponse",
)({ endpoints: S.optional(Endpoints), nextToken: S.optional(S.String) }) {}
export class ListSecurityConfigurationsResponse extends S.Class<ListSecurityConfigurationsResponse>(
  "ListSecurityConfigurationsResponse",
)({
  securityConfigurations: S.optional(SecurityConfigurations),
  nextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class ListVirtualClustersResponse extends S.Class<ListVirtualClustersResponse>(
  "ListVirtualClustersResponse",
)({
  virtualClusters: S.optional(VirtualClusters),
  nextToken: S.optional(S.String),
}) {}
export const Credentials = S.Union(S.Struct({ token: S.String }));
export const SensitivePropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class DescribeJobTemplateResponse extends S.Class<DescribeJobTemplateResponse>(
  "DescribeJobTemplateResponse",
)({ jobTemplate: S.optional(JobTemplate) }) {}
export class DescribeSecurityConfigurationResponse extends S.Class<DescribeSecurityConfigurationResponse>(
  "DescribeSecurityConfigurationResponse",
)({ securityConfiguration: S.optional(SecurityConfiguration) }) {}
export class DescribeVirtualClusterResponse extends S.Class<DescribeVirtualClusterResponse>(
  "DescribeVirtualClusterResponse",
)({ virtualCluster: S.optional(VirtualCluster) }) {}
export class GetManagedEndpointSessionCredentialsResponse extends S.Class<GetManagedEndpointSessionCredentialsResponse>(
  "GetManagedEndpointSessionCredentialsResponse",
)({
  id: S.optional(S.String),
  credentials: S.optional(Credentials),
  expiresAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class StartJobRunRequest extends S.Class<StartJobRunRequest>(
  "StartJobRunRequest",
)(
  {
    name: S.optional(S.String),
    virtualClusterId: S.String.pipe(T.HttpLabel()),
    clientToken: S.String,
    executionRoleArn: S.optional(S.String),
    releaseLabel: S.optional(S.String),
    jobDriver: S.optional(JobDriver),
    configurationOverrides: S.optional(ConfigurationOverrides),
    tags: S.optional(TagMap),
    jobTemplateId: S.optional(S.String),
    jobTemplateParameters: S.optional(TemplateParameterInputMap),
    retryPolicyConfiguration: S.optional(RetryPolicyConfiguration),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/virtualclusters/{virtualClusterId}/jobruns",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Configuration extends S.Class<Configuration>("Configuration")({
  classification: S.String,
  properties: S.optional(SensitivePropertiesMap),
  configurations: S.optional(S.suspend(() => ConfigurationList)),
}) {}
export class CreateManagedEndpointRequest extends S.Class<CreateManagedEndpointRequest>(
  "CreateManagedEndpointRequest",
)(
  {
    name: S.String,
    virtualClusterId: S.String.pipe(T.HttpLabel()),
    type: S.String,
    releaseLabel: S.String,
    executionRoleArn: S.String,
    certificateArn: S.optional(S.String),
    configurationOverrides: S.optional(ConfigurationOverrides),
    clientToken: S.String,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/virtualclusters/{virtualClusterId}/endpoints",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobRunResponse extends S.Class<DescribeJobRunResponse>(
  "DescribeJobRunResponse",
)({ jobRun: S.optional(JobRun) }) {}
export class DescribeManagedEndpointResponse extends S.Class<DescribeManagedEndpointResponse>(
  "DescribeManagedEndpointResponse",
)({ endpoint: S.optional(Endpoint) }) {}
export class StartJobRunResponse extends S.Class<StartJobRunResponse>(
  "StartJobRunResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  virtualClusterId: S.optional(S.String),
}) {}
export class CreateJobTemplateRequest extends S.Class<CreateJobTemplateRequest>(
  "CreateJobTemplateRequest",
)(
  {
    name: S.String,
    clientToken: S.String,
    jobTemplateData: JobTemplateData,
    tags: S.optional(TagMap),
    kmsKeyArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/jobtemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateManagedEndpointResponse extends S.Class<CreateManagedEndpointResponse>(
  "CreateManagedEndpointResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  virtualClusterId: S.optional(S.String),
}) {}
export class CreateJobTemplateResponse extends S.Class<CreateJobTemplateResponse>(
  "CreateJobTemplateResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class CreateSecurityConfigurationRequest extends S.Class<CreateSecurityConfigurationRequest>(
  "CreateSecurityConfigurationRequest",
)(
  {
    clientToken: S.String,
    name: S.String,
    containerProvider: S.optional(ContainerProvider),
    securityConfigurationData: SecurityConfigurationData,
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/securityconfigurations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSecurityConfigurationResponse extends S.Class<CreateSecurityConfigurationResponse>(
  "CreateSecurityConfigurationResponse",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
}) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class EKSRequestThrottledException extends S.TaggedError<EKSRequestThrottledException>()(
  "EKSRequestThrottledException",
  { message: S.optional(S.String) },
) {}
export class RequestThrottledException extends S.TaggedError<RequestThrottledException>()(
  "RequestThrottledException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a job template. Job template stores values of StartJobRun API request in a
 * template and can be used to start a job run. Job template allows two use cases: avoid
 * repeating recurring StartJobRun API request values, enforcing certain values in StartJobRun
 * API request.
 */
export const deleteJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobTemplateRequest,
  output: DeleteJobTemplateResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Deletes a managed endpoint. A managed endpoint is a gateway that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can
 * communicate with your virtual cluster.
 */
export const deleteManagedEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteManagedEndpointRequest,
    output: DeleteManagedEndpointResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Deletes a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any
 * additional resource in your system. A single virtual cluster maps to a single Kubernetes
 * namespace. Given this relationship, you can model virtual clusters the same way you model
 * Kubernetes namespaces to meet your requirements.
 */
export const deleteVirtualCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteVirtualClusterRequest,
    output: DeleteVirtualClusterResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Lists job runs based on a set of parameters. A job run is a unit of work, such as a
 * Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const listJobRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobRunsRequest,
  output: ListJobRunsResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists job templates based on a set of parameters. Job template stores values of
 * StartJobRun API request in a template and can be used to start a job run. Job template
 * allows two use cases: avoid repeating recurring StartJobRun API request values, enforcing
 * certain values in StartJobRun API request.
 */
export const listJobTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobTemplatesRequest,
  output: ListJobTemplatesResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Lists managed endpoints based on a set of parameters. A managed endpoint is a gateway
 * that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can communicate with your virtual cluster.
 */
export const listManagedEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListManagedEndpointsRequest,
    output: ListManagedEndpointsResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Lists security configurations based on a set of parameters. Security configurations in
 * Amazon EMR on EKS are templates for different security setups. You can use security
 * configurations to configure the Lake Formation integration setup. You can also
 * create a security configuration to re-use a security setup each time you create a virtual
 * cluster.
 */
export const listSecurityConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSecurityConfigurationsRequest,
    output: ListSecurityConfigurationsResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
/**
 * Lists the tags assigned to the resources.
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
 * Lists information about the specified virtual cluster. Virtual cluster is a managed
 * entity on Amazon EMR on EKS. You can create, describe, list and delete virtual
 * clusters. They do not consume any additional resource in your system. A single virtual
 * cluster maps to a single Kubernetes namespace. Given this relationship, you can model
 * virtual clusters the same way you model Kubernetes namespaces to meet your
 * requirements.
 */
export const listVirtualClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVirtualClustersRequest,
  output: ListVirtualClustersResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Assigns tags to resources. A tag is a label that you assign to an Amazon Web Services
 * resource. Each tag consists of a key and an optional value, both of which you define. Tags
 * enable you to categorize your Amazon Web Services resources by attributes such as purpose,
 * owner, or environment. When you have many resources of the same type, you can quickly
 * identify a specific resource based on the tags you've assigned to it. For example, you can
 * define a set of tags for your Amazon EMR on EKS clusters to help you track each
 * cluster's owner and stack level. We recommend that you devise a consistent set of tag keys
 * for each resource type. You can then search and filter the resources based on the tags that
 * you add.
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
 * Removes tags from resources.
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
 * Cancels a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or
 * SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const cancelJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRunRequest,
  output: CancelJobRunResponse,
  errors: [InternalServerException, ValidationException],
}));
/**
 * Creates a virtual cluster. Virtual cluster is a managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual clusters. They do not consume any
 * additional resource in your system. A single virtual cluster maps to a single Kubernetes
 * namespace. Given this relationship, you can model virtual clusters the same way you model
 * Kubernetes namespaces to meet your requirements.
 */
export const createVirtualCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateVirtualClusterRequest,
    output: CreateVirtualClusterResponse,
    errors: [
      EKSRequestThrottledException,
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Displays detailed information about a specified job template. Job template stores values
 * of StartJobRun API request in a template and can be used to start a job run. Job template
 * allows two use cases: avoid repeating recurring StartJobRun API request values, enforcing
 * certain values in StartJobRun API request.
 */
export const describeJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobTemplateRequest,
  output: DescribeJobTemplateResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a specified security configuration. Security
 * configurations in Amazon EMR on EKS are templates for different security setups. You
 * can use security configurations to configure the Lake Formation integration setup.
 * You can also create a security configuration to re-use a security setup each time you
 * create a virtual cluster.
 */
export const describeSecurityConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeSecurityConfigurationRequest,
    output: DescribeSecurityConfigurationResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Displays detailed information about a specified virtual cluster. Virtual cluster is a
 * managed entity on Amazon EMR on EKS. You can create, describe, list and delete virtual
 * clusters. They do not consume any additional resource in your system. A single virtual
 * cluster maps to a single Kubernetes namespace. Given this relationship, you can model
 * virtual clusters the same way you model Kubernetes namespaces to meet your
 * requirements.
 */
export const describeVirtualCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeVirtualClusterRequest,
    output: DescribeVirtualClusterResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Displays detailed information about a job run. A job run is a unit of work, such as a
 * Spark jar, PySpark script, or SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const describeJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobRunRequest,
  output: DescribeJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a managed endpoint. A managed endpoint is a gateway
 * that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can communicate with your virtual cluster.
 */
export const describeManagedEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeManagedEndpointRequest,
    output: DescribeManagedEndpointResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Generate a session token to connect to a managed endpoint.
 */
export const getManagedEndpointSessionCredentials =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetManagedEndpointSessionCredentialsRequest,
    output: GetManagedEndpointSessionCredentialsResponse,
    errors: [
      InternalServerException,
      RequestThrottledException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Starts a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or
 * SparkSQL query, that you submit to Amazon EMR on EKS.
 */
export const startJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRunRequest,
  output: StartJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a managed endpoint. A managed endpoint is a gateway that connects Amazon EMR Studio to Amazon EMR on EKS so that Amazon EMR Studio can
 * communicate with your virtual cluster.
 */
export const createManagedEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateManagedEndpointRequest,
    output: CreateManagedEndpointResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a job template. Job template stores values of StartJobRun API request in a
 * template and can be used to start a job run. Job template allows two use cases: avoid
 * repeating recurring StartJobRun API request values, enforcing certain values in StartJobRun
 * API request.
 */
export const createJobTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobTemplateRequest,
  output: CreateJobTemplateResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a security configuration. Security configurations in Amazon EMR on EKS are
 * templates for different security setups. You can use security configurations to configure
 * the Lake Formation integration setup. You can also create a security configuration
 * to re-use a security setup each time you create a virtual cluster.
 */
export const createSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityConfigurationRequest,
    output: CreateSecurityConfigurationResponse,
    errors: [InternalServerException, ValidationException],
  }),
);
