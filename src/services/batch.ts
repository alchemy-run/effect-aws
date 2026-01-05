import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://batch.amazonaws.com/doc/2016-08-10/");
const svc = T.AwsApiService({
  sdkId: "Batch",
  serviceShapeName: "AWSBatchV20160810",
});
const auth = T.AwsAuthSigv4({ name: "batch" });
const ver = T.ServiceVersion("2016-08-10");
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
                        url: "https://batch-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://fips.batch.{Region}.amazonaws.com",
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
                        url: "https://batch.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://batch-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://batch.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://batch.{Region}.{PartitionResult#dnsSuffix}",
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
export const StringList = S.Array(S.String);
export class KeyValuesPair extends S.Class<KeyValuesPair>("KeyValuesPair")({
  name: S.optional(S.String),
  values: S.optional(StringList),
}) {}
export const ListJobsFilterList = S.Array(KeyValuesPair);
export const ListJobsByConsumableResourceFilterList = S.Array(KeyValuesPair);
export const PlatformCapabilityList = S.Array(S.String);
export const TagKeysList = S.Array(S.String);
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  { jobId: S.String, reason: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/canceljob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobResponse extends S.Class<CancelJobResponse>(
  "CancelJobResponse",
)({}, ns) {}
export const TagrisTagsMap = S.Record({ key: S.String, value: S.String });
export class CreateConsumableResourceRequest extends S.Class<CreateConsumableResourceRequest>(
  "CreateConsumableResourceRequest",
)(
  {
    consumableResourceName: S.String,
    totalQuantity: S.optional(S.Number),
    resourceType: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/createconsumableresource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComputeEnvironmentRequest extends S.Class<DeleteComputeEnvironmentRequest>(
  "DeleteComputeEnvironmentRequest",
)(
  { computeEnvironment: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deletecomputeenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteComputeEnvironmentResponse extends S.Class<DeleteComputeEnvironmentResponse>(
  "DeleteComputeEnvironmentResponse",
)({}, ns) {}
export class DeleteConsumableResourceRequest extends S.Class<DeleteConsumableResourceRequest>(
  "DeleteConsumableResourceRequest",
)(
  { consumableResource: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deleteconsumableresource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteConsumableResourceResponse extends S.Class<DeleteConsumableResourceResponse>(
  "DeleteConsumableResourceResponse",
)({}, ns) {}
export class DeleteJobQueueRequest extends S.Class<DeleteJobQueueRequest>(
  "DeleteJobQueueRequest",
)(
  { jobQueue: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deletejobqueue" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobQueueResponse extends S.Class<DeleteJobQueueResponse>(
  "DeleteJobQueueResponse",
)({}, ns) {}
export class DeleteSchedulingPolicyRequest extends S.Class<DeleteSchedulingPolicyRequest>(
  "DeleteSchedulingPolicyRequest",
)(
  { arn: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deleteschedulingpolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSchedulingPolicyResponse extends S.Class<DeleteSchedulingPolicyResponse>(
  "DeleteSchedulingPolicyResponse",
)({}, ns) {}
export class DeleteServiceEnvironmentRequest extends S.Class<DeleteServiceEnvironmentRequest>(
  "DeleteServiceEnvironmentRequest",
)(
  { serviceEnvironment: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deleteserviceenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteServiceEnvironmentResponse extends S.Class<DeleteServiceEnvironmentResponse>(
  "DeleteServiceEnvironmentResponse",
)({}, ns) {}
export class DeregisterJobDefinitionRequest extends S.Class<DeregisterJobDefinitionRequest>(
  "DeregisterJobDefinitionRequest",
)(
  { jobDefinition: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/deregisterjobdefinition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeregisterJobDefinitionResponse extends S.Class<DeregisterJobDefinitionResponse>(
  "DeregisterJobDefinitionResponse",
)({}, ns) {}
export class DescribeComputeEnvironmentsRequest extends S.Class<DescribeComputeEnvironmentsRequest>(
  "DescribeComputeEnvironmentsRequest",
)(
  {
    computeEnvironments: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describecomputeenvironments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConsumableResourceRequest extends S.Class<DescribeConsumableResourceRequest>(
  "DescribeConsumableResourceRequest",
)(
  { consumableResource: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describeconsumableresource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobDefinitionsRequest extends S.Class<DescribeJobDefinitionsRequest>(
  "DescribeJobDefinitionsRequest",
)(
  {
    jobDefinitions: S.optional(StringList),
    maxResults: S.optional(S.Number),
    jobDefinitionName: S.optional(S.String),
    status: S.optional(S.String),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describejobdefinitions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobQueuesRequest extends S.Class<DescribeJobQueuesRequest>(
  "DescribeJobQueuesRequest",
)(
  {
    jobQueues: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describejobqueues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeJobsRequest extends S.Class<DescribeJobsRequest>(
  "DescribeJobsRequest",
)(
  { jobs: StringList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describejobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSchedulingPoliciesRequest extends S.Class<DescribeSchedulingPoliciesRequest>(
  "DescribeSchedulingPoliciesRequest",
)(
  { arns: StringList },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describeschedulingpolicies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeServiceEnvironmentsRequest extends S.Class<DescribeServiceEnvironmentsRequest>(
  "DescribeServiceEnvironmentsRequest",
)(
  {
    serviceEnvironments: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describeserviceenvironments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeServiceJobRequest extends S.Class<DescribeServiceJobRequest>(
  "DescribeServiceJobRequest",
)(
  { jobId: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/describeservicejob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobQueueSnapshotRequest extends S.Class<GetJobQueueSnapshotRequest>(
  "GetJobQueueSnapshotRequest",
)(
  { jobQueue: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/getjobqueuesnapshot" }),
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
    jobQueue: S.optional(S.String),
    arrayJobId: S.optional(S.String),
    multiNodeJobId: S.optional(S.String),
    jobStatus: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(ListJobsFilterList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/listjobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsByConsumableResourceRequest extends S.Class<ListJobsByConsumableResourceRequest>(
  "ListJobsByConsumableResourceRequest",
)(
  {
    consumableResource: S.String,
    filters: S.optional(ListJobsByConsumableResourceFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/listjobsbyconsumableresource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSchedulingPoliciesRequest extends S.Class<ListSchedulingPoliciesRequest>(
  "ListSchedulingPoliciesRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/listschedulingpolicies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServiceJobsRequest extends S.Class<ListServiceJobsRequest>(
  "ListServiceJobsRequest",
)(
  {
    jobQueue: S.optional(S.String),
    jobStatus: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(ListJobsFilterList),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/listservicejobs" }),
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
    ns,
    T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
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
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagrisTagsMap,
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TerminateJobRequest extends S.Class<TerminateJobRequest>(
  "TerminateJobRequest",
)(
  { jobId: S.String, reason: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/terminatejob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TerminateJobResponse extends S.Class<TerminateJobResponse>(
  "TerminateJobResponse",
)({}, ns) {}
export class TerminateServiceJobRequest extends S.Class<TerminateServiceJobRequest>(
  "TerminateServiceJobRequest",
)(
  { jobId: S.String, reason: S.String },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/terminateservicejob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TerminateServiceJobResponse extends S.Class<TerminateServiceJobResponse>(
  "TerminateServiceJobResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeysList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateConsumableResourceRequest extends S.Class<UpdateConsumableResourceRequest>(
  "UpdateConsumableResourceRequest",
)(
  {
    consumableResource: S.String,
    operation: S.optional(S.String),
    quantity: S.optional(S.Number),
    clientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/updateconsumableresource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ComputeEnvironmentOrder extends S.Class<ComputeEnvironmentOrder>(
  "ComputeEnvironmentOrder",
)({ order: S.Number, computeEnvironment: S.String }) {}
export const ComputeEnvironmentOrders = S.Array(ComputeEnvironmentOrder);
export class ServiceEnvironmentOrder extends S.Class<ServiceEnvironmentOrder>(
  "ServiceEnvironmentOrder",
)({ order: S.Number, serviceEnvironment: S.String }) {}
export const ServiceEnvironmentOrders = S.Array(ServiceEnvironmentOrder);
export class JobStateTimeLimitAction extends S.Class<JobStateTimeLimitAction>(
  "JobStateTimeLimitAction",
)({
  reason: S.String,
  state: S.String,
  maxTimeSeconds: S.Number,
  action: S.String,
}) {}
export const JobStateTimeLimitActions = S.Array(JobStateTimeLimitAction);
export class UpdateJobQueueRequest extends S.Class<UpdateJobQueueRequest>(
  "UpdateJobQueueRequest",
)(
  {
    jobQueue: S.String,
    state: S.optional(S.String),
    schedulingPolicyArn: S.optional(S.String),
    priority: S.optional(S.Number),
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/updatejobqueue" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ShareAttributes extends S.Class<ShareAttributes>(
  "ShareAttributes",
)({ shareIdentifier: S.String, weightFactor: S.optional(S.Number) }) {}
export const ShareAttributesList = S.Array(ShareAttributes);
export class FairsharePolicy extends S.Class<FairsharePolicy>(
  "FairsharePolicy",
)({
  shareDecaySeconds: S.optional(S.Number),
  computeReservation: S.optional(S.Number),
  shareDistribution: S.optional(ShareAttributesList),
}) {}
export class UpdateSchedulingPolicyRequest extends S.Class<UpdateSchedulingPolicyRequest>(
  "UpdateSchedulingPolicyRequest",
)(
  { arn: S.String, fairsharePolicy: S.optional(FairsharePolicy) },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/updateschedulingpolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSchedulingPolicyResponse extends S.Class<UpdateSchedulingPolicyResponse>(
  "UpdateSchedulingPolicyResponse",
)({}, ns) {}
export class CapacityLimit extends S.Class<CapacityLimit>("CapacityLimit")({
  maxCapacity: S.optional(S.Number),
  capacityUnit: S.optional(S.String),
}) {}
export const CapacityLimits = S.Array(CapacityLimit);
export class UpdateServiceEnvironmentRequest extends S.Class<UpdateServiceEnvironmentRequest>(
  "UpdateServiceEnvironmentRequest",
)(
  {
    serviceEnvironment: S.String,
    state: S.optional(S.String),
    capacityLimits: S.optional(CapacityLimits),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/updateserviceenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EksConfiguration extends S.Class<EksConfiguration>(
  "EksConfiguration",
)({ eksClusterArn: S.String, kubernetesNamespace: S.String }) {}
export const ListConsumableResourcesFilterList = S.Array(KeyValuesPair);
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export class JobTimeout extends S.Class<JobTimeout>("JobTimeout")({
  attemptDurationSeconds: S.optional(S.Number),
}) {}
export class ArrayProperties extends S.Class<ArrayProperties>(
  "ArrayProperties",
)({ size: S.optional(S.Number) }) {}
export class JobDependency extends S.Class<JobDependency>("JobDependency")({
  jobId: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const JobDependencyList = S.Array(JobDependency);
export class KeyValuePair extends S.Class<KeyValuePair>("KeyValuePair")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const EnvironmentVariables = S.Array(KeyValuePair);
export class ResourceRequirement extends S.Class<ResourceRequirement>(
  "ResourceRequirement",
)({ value: S.String, type: S.String }) {}
export const ResourceRequirements = S.Array(ResourceRequirement);
export class ContainerOverrides extends S.Class<ContainerOverrides>(
  "ContainerOverrides",
)({
  vcpus: S.optional(S.Number),
  memory: S.optional(S.Number),
  command: S.optional(StringList),
  instanceType: S.optional(S.String),
  environment: S.optional(EnvironmentVariables),
  resourceRequirements: S.optional(ResourceRequirements),
}) {}
export class ServiceJobTimeout extends S.Class<ServiceJobTimeout>(
  "ServiceJobTimeout",
)({ attemptDurationSeconds: S.optional(S.Number) }) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class LaunchTemplateSpecificationOverride extends S.Class<LaunchTemplateSpecificationOverride>(
  "LaunchTemplateSpecificationOverride",
)({
  launchTemplateId: S.optional(S.String),
  launchTemplateName: S.optional(S.String),
  version: S.optional(S.String),
  targetInstanceTypes: S.optional(StringList),
  userdataType: S.optional(S.String),
}) {}
export const LaunchTemplateSpecificationOverrideList = S.Array(
  LaunchTemplateSpecificationOverride,
);
export class LaunchTemplateSpecification extends S.Class<LaunchTemplateSpecification>(
  "LaunchTemplateSpecification",
)({
  launchTemplateId: S.optional(S.String),
  launchTemplateName: S.optional(S.String),
  version: S.optional(S.String),
  overrides: S.optional(LaunchTemplateSpecificationOverrideList),
  userdataType: S.optional(S.String),
}) {}
export class Ec2Configuration extends S.Class<Ec2Configuration>(
  "Ec2Configuration",
)({
  imageType: S.String,
  imageIdOverride: S.optional(S.String),
  imageKubernetesVersion: S.optional(S.String),
}) {}
export const Ec2ConfigurationList = S.Array(Ec2Configuration);
export class ComputeResourceUpdate extends S.Class<ComputeResourceUpdate>(
  "ComputeResourceUpdate",
)({
  minvCpus: S.optional(S.Number),
  maxvCpus: S.optional(S.Number),
  desiredvCpus: S.optional(S.Number),
  subnets: S.optional(StringList),
  securityGroupIds: S.optional(StringList),
  allocationStrategy: S.optional(S.String),
  instanceTypes: S.optional(StringList),
  ec2KeyPair: S.optional(S.String),
  instanceRole: S.optional(S.String),
  tags: S.optional(TagsMap),
  placementGroup: S.optional(S.String),
  bidPercentage: S.optional(S.Number),
  launchTemplate: S.optional(LaunchTemplateSpecification),
  ec2Configuration: S.optional(Ec2ConfigurationList),
  updateToLatestImageVersion: S.optional(S.Boolean),
  type: S.optional(S.String),
  imageId: S.optional(S.String),
}) {}
export class UpdatePolicy extends S.Class<UpdatePolicy>("UpdatePolicy")({
  terminateJobsOnUpdate: S.optional(S.Boolean),
  jobExecutionTimeoutMinutes: S.optional(S.Number),
}) {}
export class CreateConsumableResourceResponse extends S.Class<CreateConsumableResourceResponse>(
  "CreateConsumableResourceResponse",
)({ consumableResourceName: S.String, consumableResourceArn: S.String }, ns) {}
export class CreateJobQueueRequest extends S.Class<CreateJobQueueRequest>(
  "CreateJobQueueRequest",
)(
  {
    jobQueueName: S.String,
    state: S.optional(S.String),
    schedulingPolicyArn: S.optional(S.String),
    priority: S.Number,
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobQueueType: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
    jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/createjobqueue" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceEnvironmentRequest extends S.Class<CreateServiceEnvironmentRequest>(
  "CreateServiceEnvironmentRequest",
)(
  {
    serviceEnvironmentName: S.String,
    serviceEnvironmentType: S.String,
    state: S.optional(S.String),
    capacityLimits: CapacityLimits,
    tags: S.optional(TagrisTagsMap),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/createserviceenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeConsumableResourceResponse extends S.Class<DescribeConsumableResourceResponse>(
  "DescribeConsumableResourceResponse",
)(
  {
    consumableResourceName: S.String,
    consumableResourceArn: S.String,
    totalQuantity: S.optional(S.Number),
    inUseQuantity: S.optional(S.Number),
    availableQuantity: S.optional(S.Number),
    resourceType: S.optional(S.String),
    createdAt: S.optional(S.Number),
    tags: S.optional(TagrisTagsMap),
  },
  ns,
) {}
export class ListConsumableResourcesRequest extends S.Class<ListConsumableResourcesRequest>(
  "ListConsumableResourcesRequest",
)(
  {
    filters: S.optional(ListConsumableResourcesFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/listconsumableresources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagrisTagsMap) }, ns) {}
export class UpdateComputeEnvironmentRequest extends S.Class<UpdateComputeEnvironmentRequest>(
  "UpdateComputeEnvironmentRequest",
)(
  {
    computeEnvironment: S.String,
    state: S.optional(S.String),
    unmanagedvCpus: S.optional(S.Number),
    computeResources: S.optional(ComputeResourceUpdate),
    serviceRole: S.optional(S.String),
    updatePolicy: S.optional(UpdatePolicy),
    context: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/updatecomputeenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateConsumableResourceResponse extends S.Class<UpdateConsumableResourceResponse>(
  "UpdateConsumableResourceResponse",
)(
  {
    consumableResourceName: S.String,
    consumableResourceArn: S.String,
    totalQuantity: S.optional(S.Number),
  },
  ns,
) {}
export class UpdateJobQueueResponse extends S.Class<UpdateJobQueueResponse>(
  "UpdateJobQueueResponse",
)(
  { jobQueueName: S.optional(S.String), jobQueueArn: S.optional(S.String) },
  ns,
) {}
export class UpdateServiceEnvironmentResponse extends S.Class<UpdateServiceEnvironmentResponse>(
  "UpdateServiceEnvironmentResponse",
)({ serviceEnvironmentName: S.String, serviceEnvironmentArn: S.String }, ns) {}
export class MountPoint extends S.Class<MountPoint>("MountPoint")({
  containerPath: S.optional(S.String),
  readOnly: S.optional(S.Boolean),
  sourceVolume: S.optional(S.String),
}) {}
export const MountPoints = S.Array(MountPoint);
export class Ulimit extends S.Class<Ulimit>("Ulimit")({
  hardLimit: S.Number,
  name: S.String,
  softLimit: S.Number,
}) {}
export const Ulimits = S.Array(Ulimit);
export class Secret extends S.Class<Secret>("Secret")({
  name: S.String,
  valueFrom: S.String,
}) {}
export const SecretList = S.Array(Secret);
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ assignPublicIp: S.optional(S.String) }) {}
export class FargatePlatformConfiguration extends S.Class<FargatePlatformConfiguration>(
  "FargatePlatformConfiguration",
)({ platformVersion: S.optional(S.String) }) {}
export class EphemeralStorage extends S.Class<EphemeralStorage>(
  "EphemeralStorage",
)({ sizeInGiB: S.Number }) {}
export class RuntimePlatform extends S.Class<RuntimePlatform>(
  "RuntimePlatform",
)({
  operatingSystemFamily: S.optional(S.String),
  cpuArchitecture: S.optional(S.String),
}) {}
export class RepositoryCredentials extends S.Class<RepositoryCredentials>(
  "RepositoryCredentials",
)({ credentialsParameter: S.String }) {}
export class Host extends S.Class<Host>("Host")({
  sourcePath: S.optional(S.String),
}) {}
export class EFSAuthorizationConfig extends S.Class<EFSAuthorizationConfig>(
  "EFSAuthorizationConfig",
)({ accessPointId: S.optional(S.String), iam: S.optional(S.String) }) {}
export class EFSVolumeConfiguration extends S.Class<EFSVolumeConfiguration>(
  "EFSVolumeConfiguration",
)({
  fileSystemId: S.String,
  rootDirectory: S.optional(S.String),
  transitEncryption: S.optional(S.String),
  transitEncryptionPort: S.optional(S.Number),
  authorizationConfig: S.optional(EFSAuthorizationConfig),
}) {}
export class Volume extends S.Class<Volume>("Volume")({
  host: S.optional(Host),
  name: S.optional(S.String),
  efsVolumeConfiguration: S.optional(EFSVolumeConfiguration),
}) {}
export const Volumes = S.Array(Volume);
export const DeviceCgroupPermissions = S.Array(S.String);
export class Device extends S.Class<Device>("Device")({
  hostPath: S.String,
  containerPath: S.optional(S.String),
  permissions: S.optional(DeviceCgroupPermissions),
}) {}
export const DevicesList = S.Array(Device);
export class Tmpfs extends S.Class<Tmpfs>("Tmpfs")({
  containerPath: S.String,
  size: S.Number,
  mountOptions: S.optional(StringList),
}) {}
export const TmpfsList = S.Array(Tmpfs);
export class LinuxParameters extends S.Class<LinuxParameters>(
  "LinuxParameters",
)({
  devices: S.optional(DevicesList),
  initProcessEnabled: S.optional(S.Boolean),
  sharedMemorySize: S.optional(S.Number),
  tmpfs: S.optional(TmpfsList),
  maxSwap: S.optional(S.Number),
  swappiness: S.optional(S.Number),
}) {}
export const LogConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({
  logDriver: S.String,
  options: S.optional(LogConfigurationOptionsMap),
  secretOptions: S.optional(SecretList),
}) {}
export class ContainerProperties extends S.Class<ContainerProperties>(
  "ContainerProperties",
)({
  image: S.optional(S.String),
  vcpus: S.optional(S.Number),
  memory: S.optional(S.Number),
  command: S.optional(StringList),
  jobRoleArn: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  volumes: S.optional(Volumes),
  environment: S.optional(EnvironmentVariables),
  mountPoints: S.optional(MountPoints),
  readonlyRootFilesystem: S.optional(S.Boolean),
  privileged: S.optional(S.Boolean),
  ulimits: S.optional(Ulimits),
  user: S.optional(S.String),
  instanceType: S.optional(S.String),
  resourceRequirements: S.optional(ResourceRequirements),
  linuxParameters: S.optional(LinuxParameters),
  logConfiguration: S.optional(LogConfiguration),
  secrets: S.optional(SecretList),
  networkConfiguration: S.optional(NetworkConfiguration),
  fargatePlatformConfiguration: S.optional(FargatePlatformConfiguration),
  enableExecuteCommand: S.optional(S.Boolean),
  ephemeralStorage: S.optional(EphemeralStorage),
  runtimePlatform: S.optional(RuntimePlatform),
  repositoryCredentials: S.optional(RepositoryCredentials),
}) {}
export class TaskContainerDependency extends S.Class<TaskContainerDependency>(
  "TaskContainerDependency",
)({ containerName: S.optional(S.String), condition: S.optional(S.String) }) {}
export const TaskContainerDependencyList = S.Array(TaskContainerDependency);
export const FirelensConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class FirelensConfiguration extends S.Class<FirelensConfiguration>(
  "FirelensConfiguration",
)({ type: S.String, options: S.optional(FirelensConfigurationOptionsMap) }) {}
export class TaskContainerProperties extends S.Class<TaskContainerProperties>(
  "TaskContainerProperties",
)({
  command: S.optional(StringList),
  dependsOn: S.optional(TaskContainerDependencyList),
  environment: S.optional(EnvironmentVariables),
  essential: S.optional(S.Boolean),
  firelensConfiguration: S.optional(FirelensConfiguration),
  image: S.String,
  linuxParameters: S.optional(LinuxParameters),
  logConfiguration: S.optional(LogConfiguration),
  mountPoints: S.optional(MountPoints),
  name: S.optional(S.String),
  privileged: S.optional(S.Boolean),
  readonlyRootFilesystem: S.optional(S.Boolean),
  repositoryCredentials: S.optional(RepositoryCredentials),
  resourceRequirements: S.optional(ResourceRequirements),
  secrets: S.optional(SecretList),
  ulimits: S.optional(Ulimits),
  user: S.optional(S.String),
}) {}
export const ListTaskContainerProperties = S.Array(TaskContainerProperties);
export class EcsTaskProperties extends S.Class<EcsTaskProperties>(
  "EcsTaskProperties",
)({
  containers: ListTaskContainerProperties,
  ephemeralStorage: S.optional(EphemeralStorage),
  executionRoleArn: S.optional(S.String),
  platformVersion: S.optional(S.String),
  ipcMode: S.optional(S.String),
  taskRoleArn: S.optional(S.String),
  pidMode: S.optional(S.String),
  networkConfiguration: S.optional(NetworkConfiguration),
  runtimePlatform: S.optional(RuntimePlatform),
  volumes: S.optional(Volumes),
  enableExecuteCommand: S.optional(S.Boolean),
}) {}
export const ListEcsTaskProperties = S.Array(EcsTaskProperties);
export class EcsProperties extends S.Class<EcsProperties>("EcsProperties")({
  taskProperties: ListEcsTaskProperties,
}) {}
export class ImagePullSecret extends S.Class<ImagePullSecret>(
  "ImagePullSecret",
)({ name: S.String }) {}
export const ImagePullSecrets = S.Array(ImagePullSecret);
export class EksContainerEnvironmentVariable extends S.Class<EksContainerEnvironmentVariable>(
  "EksContainerEnvironmentVariable",
)({ name: S.String, value: S.optional(S.String) }) {}
export const EksContainerEnvironmentVariables = S.Array(
  EksContainerEnvironmentVariable,
);
export const EksLimits = S.Record({ key: S.String, value: S.String });
export const EksRequests = S.Record({ key: S.String, value: S.String });
export class EksContainerResourceRequirements extends S.Class<EksContainerResourceRequirements>(
  "EksContainerResourceRequirements",
)({ limits: S.optional(EksLimits), requests: S.optional(EksRequests) }) {}
export class EksContainerVolumeMount extends S.Class<EksContainerVolumeMount>(
  "EksContainerVolumeMount",
)({
  name: S.optional(S.String),
  mountPath: S.optional(S.String),
  subPath: S.optional(S.String),
  readOnly: S.optional(S.Boolean),
}) {}
export const EksContainerVolumeMounts = S.Array(EksContainerVolumeMount);
export class EksContainerSecurityContext extends S.Class<EksContainerSecurityContext>(
  "EksContainerSecurityContext",
)({
  runAsUser: S.optional(S.Number),
  runAsGroup: S.optional(S.Number),
  privileged: S.optional(S.Boolean),
  allowPrivilegeEscalation: S.optional(S.Boolean),
  readOnlyRootFilesystem: S.optional(S.Boolean),
  runAsNonRoot: S.optional(S.Boolean),
}) {}
export class EksContainer extends S.Class<EksContainer>("EksContainer")({
  name: S.optional(S.String),
  image: S.String,
  imagePullPolicy: S.optional(S.String),
  command: S.optional(StringList),
  args: S.optional(StringList),
  env: S.optional(EksContainerEnvironmentVariables),
  resources: S.optional(EksContainerResourceRequirements),
  volumeMounts: S.optional(EksContainerVolumeMounts),
  securityContext: S.optional(EksContainerSecurityContext),
}) {}
export const EksContainers = S.Array(EksContainer);
export class EksHostPath extends S.Class<EksHostPath>("EksHostPath")({
  path: S.optional(S.String),
}) {}
export class EksEmptyDir extends S.Class<EksEmptyDir>("EksEmptyDir")({
  medium: S.optional(S.String),
  sizeLimit: S.optional(S.String),
}) {}
export class EksSecret extends S.Class<EksSecret>("EksSecret")({
  secretName: S.String,
  optional: S.optional(S.Boolean),
}) {}
export class EksPersistentVolumeClaim extends S.Class<EksPersistentVolumeClaim>(
  "EksPersistentVolumeClaim",
)({ claimName: S.String, readOnly: S.optional(S.Boolean) }) {}
export class EksVolume extends S.Class<EksVolume>("EksVolume")({
  name: S.String,
  hostPath: S.optional(EksHostPath),
  emptyDir: S.optional(EksEmptyDir),
  secret: S.optional(EksSecret),
  persistentVolumeClaim: S.optional(EksPersistentVolumeClaim),
}) {}
export const EksVolumes = S.Array(EksVolume);
export const EksLabelsMap = S.Record({ key: S.String, value: S.String });
export const EksAnnotationsMap = S.Record({ key: S.String, value: S.String });
export class EksMetadata extends S.Class<EksMetadata>("EksMetadata")({
  labels: S.optional(EksLabelsMap),
  annotations: S.optional(EksAnnotationsMap),
  namespace: S.optional(S.String),
}) {}
export class EksPodProperties extends S.Class<EksPodProperties>(
  "EksPodProperties",
)({
  serviceAccountName: S.optional(S.String),
  hostNetwork: S.optional(S.Boolean),
  dnsPolicy: S.optional(S.String),
  imagePullSecrets: S.optional(ImagePullSecrets),
  containers: S.optional(EksContainers),
  initContainers: S.optional(EksContainers),
  volumes: S.optional(EksVolumes),
  metadata: S.optional(EksMetadata),
  shareProcessNamespace: S.optional(S.Boolean),
}) {}
export class EksProperties extends S.Class<EksProperties>("EksProperties")({
  podProperties: S.optional(EksPodProperties),
}) {}
export class ConsumableResourceRequirement extends S.Class<ConsumableResourceRequirement>(
  "ConsumableResourceRequirement",
)({
  consumableResource: S.optional(S.String),
  quantity: S.optional(S.Number),
}) {}
export const ConsumableResourceList = S.Array(ConsumableResourceRequirement);
export class ConsumableResourceProperties extends S.Class<ConsumableResourceProperties>(
  "ConsumableResourceProperties",
)({ consumableResourceList: S.optional(ConsumableResourceList) }) {}
export class NodeRangeProperty extends S.Class<NodeRangeProperty>(
  "NodeRangeProperty",
)({
  targetNodes: S.String,
  container: S.optional(ContainerProperties),
  instanceTypes: S.optional(StringList),
  ecsProperties: S.optional(EcsProperties),
  eksProperties: S.optional(EksProperties),
  consumableResourceProperties: S.optional(ConsumableResourceProperties),
}) {}
export const NodeRangeProperties = S.Array(NodeRangeProperty);
export class EvaluateOnExit extends S.Class<EvaluateOnExit>("EvaluateOnExit")({
  onStatusReason: S.optional(S.String),
  onReason: S.optional(S.String),
  onExitCode: S.optional(S.String),
  action: S.String,
}) {}
export const EvaluateOnExitList = S.Array(EvaluateOnExit);
export class TaskContainerOverrides extends S.Class<TaskContainerOverrides>(
  "TaskContainerOverrides",
)({
  command: S.optional(StringList),
  environment: S.optional(EnvironmentVariables),
  name: S.optional(S.String),
  resourceRequirements: S.optional(ResourceRequirements),
}) {}
export const ListTaskContainerOverrides = S.Array(TaskContainerOverrides);
export class TaskPropertiesOverride extends S.Class<TaskPropertiesOverride>(
  "TaskPropertiesOverride",
)({ containers: S.optional(ListTaskContainerOverrides) }) {}
export const ListTaskPropertiesOverride = S.Array(TaskPropertiesOverride);
export class EcsPropertiesOverride extends S.Class<EcsPropertiesOverride>(
  "EcsPropertiesOverride",
)({ taskProperties: S.optional(ListTaskPropertiesOverride) }) {}
export class EksContainerOverride extends S.Class<EksContainerOverride>(
  "EksContainerOverride",
)({
  name: S.optional(S.String),
  image: S.optional(S.String),
  command: S.optional(StringList),
  args: S.optional(StringList),
  env: S.optional(EksContainerEnvironmentVariables),
  resources: S.optional(EksContainerResourceRequirements),
}) {}
export const EksContainerOverrideList = S.Array(EksContainerOverride);
export class EksPodPropertiesOverride extends S.Class<EksPodPropertiesOverride>(
  "EksPodPropertiesOverride",
)({
  containers: S.optional(EksContainerOverrideList),
  initContainers: S.optional(EksContainerOverrideList),
  metadata: S.optional(EksMetadata),
}) {}
export class EksPropertiesOverride extends S.Class<EksPropertiesOverride>(
  "EksPropertiesOverride",
)({ podProperties: S.optional(EksPodPropertiesOverride) }) {}
export class NodePropertyOverride extends S.Class<NodePropertyOverride>(
  "NodePropertyOverride",
)({
  targetNodes: S.String,
  containerOverrides: S.optional(ContainerOverrides),
  ecsPropertiesOverride: S.optional(EcsPropertiesOverride),
  instanceTypes: S.optional(StringList),
  eksPropertiesOverride: S.optional(EksPropertiesOverride),
  consumableResourcePropertiesOverride: S.optional(
    ConsumableResourceProperties,
  ),
}) {}
export const NodePropertyOverrides = S.Array(NodePropertyOverride);
export class ServiceJobEvaluateOnExit extends S.Class<ServiceJobEvaluateOnExit>(
  "ServiceJobEvaluateOnExit",
)({ action: S.optional(S.String), onStatusReason: S.optional(S.String) }) {}
export const ServiceJobEvaluateOnExitList = S.Array(ServiceJobEvaluateOnExit);
export class ComputeResource extends S.Class<ComputeResource>(
  "ComputeResource",
)({
  type: S.String,
  allocationStrategy: S.optional(S.String),
  minvCpus: S.optional(S.Number),
  maxvCpus: S.Number,
  desiredvCpus: S.optional(S.Number),
  instanceTypes: S.optional(StringList),
  imageId: S.optional(S.String),
  subnets: StringList,
  securityGroupIds: S.optional(StringList),
  ec2KeyPair: S.optional(S.String),
  instanceRole: S.optional(S.String),
  tags: S.optional(TagsMap),
  placementGroup: S.optional(S.String),
  bidPercentage: S.optional(S.Number),
  spotIamFleetRole: S.optional(S.String),
  launchTemplate: S.optional(LaunchTemplateSpecification),
  ec2Configuration: S.optional(Ec2ConfigurationList),
}) {}
export class ComputeEnvironmentDetail extends S.Class<ComputeEnvironmentDetail>(
  "ComputeEnvironmentDetail",
)({
  computeEnvironmentName: S.String,
  computeEnvironmentArn: S.String,
  unmanagedvCpus: S.optional(S.Number),
  ecsClusterArn: S.optional(S.String),
  tags: S.optional(TagrisTagsMap),
  type: S.optional(S.String),
  state: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  computeResources: S.optional(ComputeResource),
  serviceRole: S.optional(S.String),
  updatePolicy: S.optional(UpdatePolicy),
  eksConfiguration: S.optional(EksConfiguration),
  containerOrchestrationType: S.optional(S.String),
  uuid: S.optional(S.String),
  context: S.optional(S.String),
}) {}
export const ComputeEnvironmentDetailList = S.Array(ComputeEnvironmentDetail);
export class RetryStrategy extends S.Class<RetryStrategy>("RetryStrategy")({
  attempts: S.optional(S.Number),
  evaluateOnExit: S.optional(EvaluateOnExitList),
}) {}
export class NodeProperties extends S.Class<NodeProperties>("NodeProperties")({
  numNodes: S.Number,
  mainNode: S.Number,
  nodeRangeProperties: NodeRangeProperties,
}) {}
export class JobDefinition extends S.Class<JobDefinition>("JobDefinition")({
  jobDefinitionName: S.String,
  jobDefinitionArn: S.String,
  revision: S.Number,
  status: S.optional(S.String),
  type: S.String,
  schedulingPriority: S.optional(S.Number),
  parameters: S.optional(ParametersMap),
  retryStrategy: S.optional(RetryStrategy),
  containerProperties: S.optional(ContainerProperties),
  timeout: S.optional(JobTimeout),
  nodeProperties: S.optional(NodeProperties),
  tags: S.optional(TagrisTagsMap),
  propagateTags: S.optional(S.Boolean),
  platformCapabilities: S.optional(PlatformCapabilityList),
  ecsProperties: S.optional(EcsProperties),
  eksProperties: S.optional(EksProperties),
  containerOrchestrationType: S.optional(S.String),
  consumableResourceProperties: S.optional(ConsumableResourceProperties),
}) {}
export const JobDefinitionList = S.Array(JobDefinition);
export class JobQueueDetail extends S.Class<JobQueueDetail>("JobQueueDetail")({
  jobQueueName: S.String,
  jobQueueArn: S.String,
  state: S.String,
  schedulingPolicyArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  priority: S.Number,
  computeEnvironmentOrder: ComputeEnvironmentOrders,
  serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
  jobQueueType: S.optional(S.String),
  tags: S.optional(TagrisTagsMap),
  jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
}) {}
export const JobQueueDetailList = S.Array(JobQueueDetail);
export class SchedulingPolicyDetail extends S.Class<SchedulingPolicyDetail>(
  "SchedulingPolicyDetail",
)({
  name: S.String,
  arn: S.String,
  fairsharePolicy: S.optional(FairsharePolicy),
  tags: S.optional(TagrisTagsMap),
}) {}
export const SchedulingPolicyDetailList = S.Array(SchedulingPolicyDetail);
export class ServiceEnvironmentDetail extends S.Class<ServiceEnvironmentDetail>(
  "ServiceEnvironmentDetail",
)({
  serviceEnvironmentName: S.String,
  serviceEnvironmentArn: S.String,
  serviceEnvironmentType: S.String,
  state: S.optional(S.String),
  status: S.optional(S.String),
  capacityLimits: CapacityLimits,
  tags: S.optional(TagrisTagsMap),
}) {}
export const ServiceEnvironmentDetailList = S.Array(ServiceEnvironmentDetail);
export class ServiceResourceId extends S.Class<ServiceResourceId>(
  "ServiceResourceId",
)({ name: S.String, value: S.String }) {}
export class LatestServiceJobAttempt extends S.Class<LatestServiceJobAttempt>(
  "LatestServiceJobAttempt",
)({ serviceResourceId: S.optional(ServiceResourceId) }) {}
export class ListJobsByConsumableResourceSummary extends S.Class<ListJobsByConsumableResourceSummary>(
  "ListJobsByConsumableResourceSummary",
)({
  jobArn: S.String,
  jobQueueArn: S.String,
  jobName: S.String,
  jobDefinitionArn: S.optional(S.String),
  shareIdentifier: S.optional(S.String),
  jobStatus: S.String,
  quantity: S.Number,
  statusReason: S.optional(S.String),
  startedAt: S.optional(S.Number),
  createdAt: S.Number,
  consumableResourceProperties: ConsumableResourceProperties,
}) {}
export const ListJobsByConsumableResourceSummaryList = S.Array(
  ListJobsByConsumableResourceSummary,
);
export class SchedulingPolicyListingDetail extends S.Class<SchedulingPolicyListingDetail>(
  "SchedulingPolicyListingDetail",
)({ arn: S.String }) {}
export const SchedulingPolicyListingDetailList = S.Array(
  SchedulingPolicyListingDetail,
);
export class ServiceJobSummary extends S.Class<ServiceJobSummary>(
  "ServiceJobSummary",
)({
  latestAttempt: S.optional(LatestServiceJobAttempt),
  createdAt: S.optional(S.Number),
  jobArn: S.optional(S.String),
  jobId: S.String,
  jobName: S.String,
  serviceJobType: S.String,
  shareIdentifier: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  startedAt: S.optional(S.Number),
  stoppedAt: S.optional(S.Number),
}) {}
export const ServiceJobSummaryList = S.Array(ServiceJobSummary);
export class NodeOverrides extends S.Class<NodeOverrides>("NodeOverrides")({
  numNodes: S.optional(S.Number),
  nodePropertyOverrides: S.optional(NodePropertyOverrides),
}) {}
export class ServiceJobRetryStrategy extends S.Class<ServiceJobRetryStrategy>(
  "ServiceJobRetryStrategy",
)({
  attempts: S.Number,
  evaluateOnExit: S.optional(ServiceJobEvaluateOnExitList),
}) {}
export class CreateJobQueueResponse extends S.Class<CreateJobQueueResponse>(
  "CreateJobQueueResponse",
)({ jobQueueName: S.String, jobQueueArn: S.String }, ns) {}
export class CreateSchedulingPolicyRequest extends S.Class<CreateSchedulingPolicyRequest>(
  "CreateSchedulingPolicyRequest",
)(
  {
    name: S.String,
    fairsharePolicy: S.optional(FairsharePolicy),
    tags: S.optional(TagrisTagsMap),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/createschedulingpolicy" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateServiceEnvironmentResponse extends S.Class<CreateServiceEnvironmentResponse>(
  "CreateServiceEnvironmentResponse",
)({ serviceEnvironmentName: S.String, serviceEnvironmentArn: S.String }, ns) {}
export class DescribeComputeEnvironmentsResponse extends S.Class<DescribeComputeEnvironmentsResponse>(
  "DescribeComputeEnvironmentsResponse",
)(
  {
    computeEnvironments: S.optional(ComputeEnvironmentDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeJobDefinitionsResponse extends S.Class<DescribeJobDefinitionsResponse>(
  "DescribeJobDefinitionsResponse",
)(
  {
    jobDefinitions: S.optional(JobDefinitionList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeJobQueuesResponse extends S.Class<DescribeJobQueuesResponse>(
  "DescribeJobQueuesResponse",
)(
  {
    jobQueues: S.optional(JobQueueDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeSchedulingPoliciesResponse extends S.Class<DescribeSchedulingPoliciesResponse>(
  "DescribeSchedulingPoliciesResponse",
)({ schedulingPolicies: S.optional(SchedulingPolicyDetailList) }, ns) {}
export class DescribeServiceEnvironmentsResponse extends S.Class<DescribeServiceEnvironmentsResponse>(
  "DescribeServiceEnvironmentsResponse",
)(
  {
    serviceEnvironments: S.optional(ServiceEnvironmentDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListJobsByConsumableResourceResponse extends S.Class<ListJobsByConsumableResourceResponse>(
  "ListJobsByConsumableResourceResponse",
)(
  {
    jobs: ListJobsByConsumableResourceSummaryList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListSchedulingPoliciesResponse extends S.Class<ListSchedulingPoliciesResponse>(
  "ListSchedulingPoliciesResponse",
)(
  {
    schedulingPolicies: S.optional(SchedulingPolicyListingDetailList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListServiceJobsResponse extends S.Class<ListServiceJobsResponse>(
  "ListServiceJobsResponse",
)(
  { jobSummaryList: ServiceJobSummaryList, nextToken: S.optional(S.String) },
  ns,
) {}
export class SubmitServiceJobRequest extends S.Class<SubmitServiceJobRequest>(
  "SubmitServiceJobRequest",
)(
  {
    jobName: S.String,
    jobQueue: S.String,
    retryStrategy: S.optional(ServiceJobRetryStrategy),
    schedulingPriority: S.optional(S.Number),
    serviceRequestPayload: S.String,
    serviceJobType: S.String,
    shareIdentifier: S.optional(S.String),
    timeoutConfig: S.optional(ServiceJobTimeout),
    tags: S.optional(TagrisTagsMap),
    clientToken: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/submitservicejob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateComputeEnvironmentResponse extends S.Class<UpdateComputeEnvironmentResponse>(
  "UpdateComputeEnvironmentResponse",
)(
  {
    computeEnvironmentName: S.optional(S.String),
    computeEnvironmentArn: S.optional(S.String),
  },
  ns,
) {}
export class NodeDetails extends S.Class<NodeDetails>("NodeDetails")({
  nodeIndex: S.optional(S.Number),
  isMainNode: S.optional(S.Boolean),
}) {}
export class FrontOfQueueJobSummary extends S.Class<FrontOfQueueJobSummary>(
  "FrontOfQueueJobSummary",
)({
  jobArn: S.optional(S.String),
  earliestTimeAtPosition: S.optional(S.Number),
}) {}
export const FrontOfQueueJobSummaryList = S.Array(FrontOfQueueJobSummary);
export class ContainerSummary extends S.Class<ContainerSummary>(
  "ContainerSummary",
)({ exitCode: S.optional(S.Number), reason: S.optional(S.String) }) {}
export class ArrayPropertiesSummary extends S.Class<ArrayPropertiesSummary>(
  "ArrayPropertiesSummary",
)({ size: S.optional(S.Number), index: S.optional(S.Number) }) {}
export class NodePropertiesSummary extends S.Class<NodePropertiesSummary>(
  "NodePropertiesSummary",
)({
  isMainNode: S.optional(S.Boolean),
  numNodes: S.optional(S.Number),
  nodeIndex: S.optional(S.Number),
}) {}
export class ServiceJobAttemptDetail extends S.Class<ServiceJobAttemptDetail>(
  "ServiceJobAttemptDetail",
)({
  serviceResourceId: S.optional(ServiceResourceId),
  startedAt: S.optional(S.Number),
  stoppedAt: S.optional(S.Number),
  statusReason: S.optional(S.String),
}) {}
export const ServiceJobAttemptDetails = S.Array(ServiceJobAttemptDetail);
export class FrontOfQueueDetail extends S.Class<FrontOfQueueDetail>(
  "FrontOfQueueDetail",
)({
  jobs: S.optional(FrontOfQueueJobSummaryList),
  lastUpdatedAt: S.optional(S.Number),
}) {}
export class ConsumableResourceSummary extends S.Class<ConsumableResourceSummary>(
  "ConsumableResourceSummary",
)({
  consumableResourceArn: S.String,
  consumableResourceName: S.String,
  totalQuantity: S.optional(S.Number),
  inUseQuantity: S.optional(S.Number),
  resourceType: S.optional(S.String),
}) {}
export const ConsumableResourceSummaryList = S.Array(ConsumableResourceSummary);
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  jobArn: S.optional(S.String),
  jobId: S.String,
  jobName: S.String,
  createdAt: S.optional(S.Number),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  startedAt: S.optional(S.Number),
  stoppedAt: S.optional(S.Number),
  container: S.optional(ContainerSummary),
  arrayProperties: S.optional(ArrayPropertiesSummary),
  nodeProperties: S.optional(NodePropertiesSummary),
  jobDefinition: S.optional(S.String),
}) {}
export const JobSummaryList = S.Array(JobSummary);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  attachmentId: S.optional(S.String),
  ipv6Address: S.optional(S.String),
  privateIpv4Address: S.optional(S.String),
}) {}
export const NetworkInterfaceList = S.Array(NetworkInterface);
export class AttemptContainerDetail extends S.Class<AttemptContainerDetail>(
  "AttemptContainerDetail",
)({
  containerInstanceArn: S.optional(S.String),
  taskArn: S.optional(S.String),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
  logStreamName: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export const ArrayJobStatusSummary = S.Record({
  key: S.String,
  value: S.Number,
});
export class EksAttemptContainerDetail extends S.Class<EksAttemptContainerDetail>(
  "EksAttemptContainerDetail",
)({
  name: S.optional(S.String),
  containerID: S.optional(S.String),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
}) {}
export const EksAttemptContainerDetails = S.Array(EksAttemptContainerDetail);
export class CreateComputeEnvironmentRequest extends S.Class<CreateComputeEnvironmentRequest>(
  "CreateComputeEnvironmentRequest",
)(
  {
    computeEnvironmentName: S.String,
    type: S.String,
    state: S.optional(S.String),
    unmanagedvCpus: S.optional(S.Number),
    computeResources: S.optional(ComputeResource),
    serviceRole: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
    eksConfiguration: S.optional(EksConfiguration),
    context: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/createcomputeenvironment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSchedulingPolicyResponse extends S.Class<CreateSchedulingPolicyResponse>(
  "CreateSchedulingPolicyResponse",
)({ name: S.String, arn: S.String }, ns) {}
export class DescribeServiceJobResponse extends S.Class<DescribeServiceJobResponse>(
  "DescribeServiceJobResponse",
)(
  {
    attempts: S.optional(ServiceJobAttemptDetails),
    createdAt: S.optional(S.Number),
    isTerminated: S.optional(S.Boolean),
    jobArn: S.optional(S.String),
    jobId: S.String,
    jobName: S.String,
    jobQueue: S.String,
    latestAttempt: S.optional(LatestServiceJobAttempt),
    retryStrategy: S.optional(ServiceJobRetryStrategy),
    schedulingPriority: S.optional(S.Number),
    serviceRequestPayload: S.optional(S.String),
    serviceJobType: S.String,
    shareIdentifier: S.optional(S.String),
    startedAt: S.Number,
    status: S.String,
    statusReason: S.optional(S.String),
    stoppedAt: S.optional(S.Number),
    tags: S.optional(TagrisTagsMap),
    timeoutConfig: S.optional(ServiceJobTimeout),
  },
  ns,
) {}
export class GetJobQueueSnapshotResponse extends S.Class<GetJobQueueSnapshotResponse>(
  "GetJobQueueSnapshotResponse",
)({ frontOfQueue: S.optional(FrontOfQueueDetail) }, ns) {}
export class ListConsumableResourcesResponse extends S.Class<ListConsumableResourcesResponse>(
  "ListConsumableResourcesResponse",
)(
  {
    consumableResources: ConsumableResourceSummaryList,
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ jobSummaryList: JobSummaryList, nextToken: S.optional(S.String) }, ns) {}
export class SubmitJobRequest extends S.Class<SubmitJobRequest>(
  "SubmitJobRequest",
)(
  {
    jobName: S.String,
    jobQueue: S.String,
    shareIdentifier: S.optional(S.String),
    schedulingPriorityOverride: S.optional(S.Number),
    arrayProperties: S.optional(ArrayProperties),
    dependsOn: S.optional(JobDependencyList),
    jobDefinition: S.String,
    parameters: S.optional(ParametersMap),
    containerOverrides: S.optional(ContainerOverrides),
    nodeOverrides: S.optional(NodeOverrides),
    retryStrategy: S.optional(RetryStrategy),
    propagateTags: S.optional(S.Boolean),
    timeout: S.optional(JobTimeout),
    tags: S.optional(TagrisTagsMap),
    eksPropertiesOverride: S.optional(EksPropertiesOverride),
    ecsPropertiesOverride: S.optional(EcsPropertiesOverride),
    consumableResourcePropertiesOverride: S.optional(
      ConsumableResourceProperties,
    ),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/submitjob" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubmitServiceJobResponse extends S.Class<SubmitServiceJobResponse>(
  "SubmitServiceJobResponse",
)({ jobArn: S.optional(S.String), jobName: S.String, jobId: S.String }, ns) {}
export class ContainerDetail extends S.Class<ContainerDetail>(
  "ContainerDetail",
)({
  image: S.optional(S.String),
  vcpus: S.optional(S.Number),
  memory: S.optional(S.Number),
  command: S.optional(StringList),
  jobRoleArn: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  volumes: S.optional(Volumes),
  environment: S.optional(EnvironmentVariables),
  mountPoints: S.optional(MountPoints),
  readonlyRootFilesystem: S.optional(S.Boolean),
  ulimits: S.optional(Ulimits),
  privileged: S.optional(S.Boolean),
  user: S.optional(S.String),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
  containerInstanceArn: S.optional(S.String),
  taskArn: S.optional(S.String),
  logStreamName: S.optional(S.String),
  instanceType: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
  resourceRequirements: S.optional(ResourceRequirements),
  linuxParameters: S.optional(LinuxParameters),
  logConfiguration: S.optional(LogConfiguration),
  secrets: S.optional(SecretList),
  networkConfiguration: S.optional(NetworkConfiguration),
  fargatePlatformConfiguration: S.optional(FargatePlatformConfiguration),
  ephemeralStorage: S.optional(EphemeralStorage),
  runtimePlatform: S.optional(RuntimePlatform),
  repositoryCredentials: S.optional(RepositoryCredentials),
  enableExecuteCommand: S.optional(S.Boolean),
}) {}
export class ArrayPropertiesDetail extends S.Class<ArrayPropertiesDetail>(
  "ArrayPropertiesDetail",
)({
  statusSummary: S.optional(ArrayJobStatusSummary),
  size: S.optional(S.Number),
  index: S.optional(S.Number),
}) {}
export class EksAttemptDetail extends S.Class<EksAttemptDetail>(
  "EksAttemptDetail",
)({
  containers: S.optional(EksAttemptContainerDetails),
  initContainers: S.optional(EksAttemptContainerDetails),
  eksClusterArn: S.optional(S.String),
  podName: S.optional(S.String),
  podNamespace: S.optional(S.String),
  nodeName: S.optional(S.String),
  startedAt: S.optional(S.Number),
  stoppedAt: S.optional(S.Number),
  statusReason: S.optional(S.String),
}) {}
export const EksAttemptDetails = S.Array(EksAttemptDetail);
export class AttemptTaskContainerDetails extends S.Class<AttemptTaskContainerDetails>(
  "AttemptTaskContainerDetails",
)({
  exitCode: S.optional(S.Number),
  name: S.optional(S.String),
  reason: S.optional(S.String),
  logStreamName: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export const ListAttemptTaskContainerDetails = S.Array(
  AttemptTaskContainerDetails,
);
export class EksContainerDetail extends S.Class<EksContainerDetail>(
  "EksContainerDetail",
)({
  name: S.optional(S.String),
  image: S.optional(S.String),
  imagePullPolicy: S.optional(S.String),
  command: S.optional(StringList),
  args: S.optional(StringList),
  env: S.optional(EksContainerEnvironmentVariables),
  resources: S.optional(EksContainerResourceRequirements),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
  volumeMounts: S.optional(EksContainerVolumeMounts),
  securityContext: S.optional(EksContainerSecurityContext),
}) {}
export const EksContainerDetails = S.Array(EksContainerDetail);
export class TaskContainerDetails extends S.Class<TaskContainerDetails>(
  "TaskContainerDetails",
)({
  command: S.optional(StringList),
  dependsOn: S.optional(TaskContainerDependencyList),
  environment: S.optional(EnvironmentVariables),
  essential: S.optional(S.Boolean),
  firelensConfiguration: S.optional(FirelensConfiguration),
  image: S.optional(S.String),
  linuxParameters: S.optional(LinuxParameters),
  logConfiguration: S.optional(LogConfiguration),
  mountPoints: S.optional(MountPoints),
  name: S.optional(S.String),
  privileged: S.optional(S.Boolean),
  readonlyRootFilesystem: S.optional(S.Boolean),
  repositoryCredentials: S.optional(RepositoryCredentials),
  resourceRequirements: S.optional(ResourceRequirements),
  secrets: S.optional(SecretList),
  ulimits: S.optional(Ulimits),
  user: S.optional(S.String),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
  logStreamName: S.optional(S.String),
  networkInterfaces: S.optional(NetworkInterfaceList),
}) {}
export const ListTaskContainerDetails = S.Array(TaskContainerDetails);
export class AttemptEcsTaskDetails extends S.Class<AttemptEcsTaskDetails>(
  "AttemptEcsTaskDetails",
)({
  containerInstanceArn: S.optional(S.String),
  taskArn: S.optional(S.String),
  containers: S.optional(ListAttemptTaskContainerDetails),
}) {}
export const ListAttemptEcsTaskDetails = S.Array(AttemptEcsTaskDetails);
export class EksPodPropertiesDetail extends S.Class<EksPodPropertiesDetail>(
  "EksPodPropertiesDetail",
)({
  serviceAccountName: S.optional(S.String),
  hostNetwork: S.optional(S.Boolean),
  dnsPolicy: S.optional(S.String),
  imagePullSecrets: S.optional(ImagePullSecrets),
  containers: S.optional(EksContainerDetails),
  initContainers: S.optional(EksContainerDetails),
  volumes: S.optional(EksVolumes),
  podName: S.optional(S.String),
  nodeName: S.optional(S.String),
  metadata: S.optional(EksMetadata),
  shareProcessNamespace: S.optional(S.Boolean),
}) {}
export class EcsTaskDetails extends S.Class<EcsTaskDetails>("EcsTaskDetails")({
  containers: S.optional(ListTaskContainerDetails),
  containerInstanceArn: S.optional(S.String),
  taskArn: S.optional(S.String),
  ephemeralStorage: S.optional(EphemeralStorage),
  executionRoleArn: S.optional(S.String),
  platformVersion: S.optional(S.String),
  ipcMode: S.optional(S.String),
  taskRoleArn: S.optional(S.String),
  pidMode: S.optional(S.String),
  networkConfiguration: S.optional(NetworkConfiguration),
  runtimePlatform: S.optional(RuntimePlatform),
  volumes: S.optional(Volumes),
  enableExecuteCommand: S.optional(S.Boolean),
}) {}
export const ListEcsTaskDetails = S.Array(EcsTaskDetails);
export class CreateComputeEnvironmentResponse extends S.Class<CreateComputeEnvironmentResponse>(
  "CreateComputeEnvironmentResponse",
)(
  {
    computeEnvironmentName: S.optional(S.String),
    computeEnvironmentArn: S.optional(S.String),
  },
  ns,
) {}
export class SubmitJobResponse extends S.Class<SubmitJobResponse>(
  "SubmitJobResponse",
)({ jobArn: S.optional(S.String), jobName: S.String, jobId: S.String }, ns) {}
export class AttemptDetail extends S.Class<AttemptDetail>("AttemptDetail")({
  container: S.optional(AttemptContainerDetail),
  startedAt: S.optional(S.Number),
  stoppedAt: S.optional(S.Number),
  statusReason: S.optional(S.String),
  taskProperties: S.optional(ListAttemptEcsTaskDetails),
}) {}
export const AttemptDetails = S.Array(AttemptDetail);
export class EksPropertiesDetail extends S.Class<EksPropertiesDetail>(
  "EksPropertiesDetail",
)({ podProperties: S.optional(EksPodPropertiesDetail) }) {}
export class EcsPropertiesDetail extends S.Class<EcsPropertiesDetail>(
  "EcsPropertiesDetail",
)({ taskProperties: S.optional(ListEcsTaskDetails) }) {}
export class JobDetail extends S.Class<JobDetail>("JobDetail")({
  jobArn: S.optional(S.String),
  jobName: S.String,
  jobId: S.String,
  jobQueue: S.String,
  status: S.String,
  shareIdentifier: S.optional(S.String),
  schedulingPriority: S.optional(S.Number),
  attempts: S.optional(AttemptDetails),
  statusReason: S.optional(S.String),
  createdAt: S.optional(S.Number),
  retryStrategy: S.optional(RetryStrategy),
  startedAt: S.Number,
  stoppedAt: S.optional(S.Number),
  dependsOn: S.optional(JobDependencyList),
  jobDefinition: S.String,
  parameters: S.optional(ParametersMap),
  container: S.optional(ContainerDetail),
  nodeDetails: S.optional(NodeDetails),
  nodeProperties: S.optional(NodeProperties),
  arrayProperties: S.optional(ArrayPropertiesDetail),
  timeout: S.optional(JobTimeout),
  tags: S.optional(TagrisTagsMap),
  propagateTags: S.optional(S.Boolean),
  platformCapabilities: S.optional(PlatformCapabilityList),
  eksProperties: S.optional(EksPropertiesDetail),
  eksAttempts: S.optional(EksAttemptDetails),
  ecsProperties: S.optional(EcsPropertiesDetail),
  isCancelled: S.optional(S.Boolean),
  isTerminated: S.optional(S.Boolean),
  consumableResourceProperties: S.optional(ConsumableResourceProperties),
}) {}
export const JobDetailList = S.Array(JobDetail);
export class DescribeJobsResponse extends S.Class<DescribeJobsResponse>(
  "DescribeJobsResponse",
)({ jobs: S.optional(JobDetailList) }, ns) {}
export class RegisterJobDefinitionRequest extends S.Class<RegisterJobDefinitionRequest>(
  "RegisterJobDefinitionRequest",
)(
  {
    jobDefinitionName: S.String,
    type: S.String,
    parameters: S.optional(ParametersMap),
    schedulingPriority: S.optional(S.Number),
    containerProperties: S.optional(ContainerProperties),
    nodeProperties: S.optional(NodeProperties),
    retryStrategy: S.optional(RetryStrategy),
    propagateTags: S.optional(S.Boolean),
    timeout: S.optional(JobTimeout),
    tags: S.optional(TagrisTagsMap),
    platformCapabilities: S.optional(PlatformCapabilityList),
    eksProperties: S.optional(EksProperties),
    ecsProperties: S.optional(EcsProperties),
    consumableResourceProperties: S.optional(ConsumableResourceProperties),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/v1/registerjobdefinition" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RegisterJobDefinitionResponse extends S.Class<RegisterJobDefinitionResponse>(
  "RegisterJobDefinitionResponse",
)(
  {
    jobDefinitionName: S.String,
    jobDefinitionArn: S.String,
    revision: S.Number,
  },
  ns,
) {}

//# Errors
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  { message: S.optional(S.String) },
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}

//# Operations
/**
 * Cancels a job in an Batch job queue. Jobs that are in a `SUBMITTED`, `PENDING`, or `RUNNABLE` state are cancelled and the job status is updated to `FAILED`.
 *
 * A `PENDING` job is canceled after all dependency jobs are completed.
 * Therefore, it may take longer than expected to cancel a job in `PENDING`
 * status.
 *
 * When you try to cancel an array parent job in `PENDING`, Batch attempts to
 * cancel all child jobs. The array parent job is canceled when all child jobs are
 * completed.
 *
 * Jobs that progressed to the `STARTING` or
 * `RUNNING` state aren't canceled. However, the API operation still succeeds, even
 * if no job is canceled. These jobs must be terminated with the TerminateJob
 * operation.
 */
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates an Batch job queue. When you create a job queue, you associate one or more
 * compute environments to the queue and assign an order of preference for the compute
 * environments.
 *
 * You also set a priority to the job queue that determines the order that the Batch
 * scheduler places jobs onto its associated compute environments. For example, if a compute
 * environment is associated with more than one job queue, the job queue with a higher priority
 * is given preference for scheduling jobs to that compute environment.
 */
export const createJobQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobQueueRequest,
  output: CreateJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates a service environment for running service jobs. Service environments define capacity limits for specific service types such as SageMaker Training jobs.
 */
export const createServiceEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceEnvironmentRequest,
    output: CreateServiceEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Describes one or more of your compute environments.
 *
 * If you're using an unmanaged compute environment, you can use the
 * `DescribeComputeEnvironment` operation to determine the
 * `ecsClusterArn` that you launch your Amazon ECS container instances into.
 */
export const describeComputeEnvironments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeComputeEnvironmentsRequest,
    output: DescribeComputeEnvironmentsResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "computeEnvironments",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Describes a list of job definitions. You can specify a `status` (such as
 * `ACTIVE`) to only return job definitions that match that status.
 */
export const describeJobDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeJobDefinitionsRequest,
    output: DescribeJobDefinitionsResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobDefinitions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Describes one or more of your job queues.
 */
export const describeJobQueues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeJobQueuesRequest,
    output: DescribeJobQueuesResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobQueues",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Describes one or more of your scheduling policies.
 */
export const describeSchedulingPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSchedulingPoliciesRequest,
    output: DescribeSchedulingPoliciesResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Describes one or more of your service environments.
 */
export const describeServiceEnvironments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeServiceEnvironmentsRequest,
    output: DescribeServiceEnvironmentsResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "serviceEnvironments",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of Batch jobs that require a specific consumable resource.
 */
export const listJobsByConsumableResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListJobsByConsumableResourceRequest,
    output: ListJobsByConsumableResourceResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobs",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of Batch scheduling policies.
 */
export const listSchedulingPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSchedulingPoliciesRequest,
    output: ListSchedulingPoliciesResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "schedulingPolicies",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of service jobs for a specified job queue.
 */
export const listServiceJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServiceJobsRequest,
    output: ListServiceJobsResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Updates an Batch compute environment.
 */
export const updateComputeEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateComputeEnvironmentRequest,
    output: UpdateComputeEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Creates an Batch consumable resource.
 */
export const createConsumableResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateConsumableResourceRequest,
    output: CreateConsumableResourceResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Returns a description of the specified consumable resource.
 */
export const describeConsumableResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConsumableResourceRequest,
    output: DescribeConsumableResourceResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, job queues,
 * and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a consumable resource.
 */
export const updateConsumableResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateConsumableResourceRequest,
    output: UpdateConsumableResourceResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Updates a job queue.
 */
export const updateJobQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobQueueRequest,
  output: UpdateJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a service environment. You can update the state of a service environment from `ENABLED` to `DISABLED` to prevent new service jobs from being placed in the service environment.
 */
export const updateServiceEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceEnvironmentRequest,
    output: UpdateServiceEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Deletes an Batch compute environment.
 *
 * Before you can delete a compute environment, you must set its state to
 * `DISABLED` with the UpdateComputeEnvironment API operation and
 * disassociate it from any job queues with the UpdateJobQueue API operation.
 * Compute environments that use Fargate resources must terminate all active jobs on that
 * compute environment before deleting the compute environment. If this isn't done, the compute
 * environment enters an invalid state.
 */
export const deleteComputeEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteComputeEnvironmentRequest,
    output: DeleteComputeEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Deletes the specified consumable resource.
 */
export const deleteConsumableResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteConsumableResourceRequest,
    output: DeleteConsumableResourceResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Deletes the specified job queue. You must first disable submissions for a queue with the
 * UpdateJobQueue operation. All jobs in the queue are eventually terminated
 * when you delete a job queue. The jobs are terminated at a rate of about 16 jobs each
 * second.
 *
 * It's not necessary to disassociate compute environments from a queue before submitting a
 * `DeleteJobQueue` request.
 */
export const deleteJobQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobQueueRequest,
  output: DeleteJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes the specified scheduling policy.
 *
 * You can't delete a scheduling policy that's used in any job queues.
 */
export const deleteSchedulingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSchedulingPolicyRequest,
    output: DeleteSchedulingPolicyResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Deletes a Service environment. Before you can delete a service environment, you must first set its state to `DISABLED` with the `UpdateServiceEnvironment` API operation and disassociate it from any job queues with the `UpdateJobQueue` API operation.
 */
export const deleteServiceEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceEnvironmentRequest,
    output: DeleteServiceEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Deregisters an Batch job definition. Job definitions are permanently deleted after 180
 * days.
 */
export const deregisterJobDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterJobDefinitionRequest,
    output: DeregisterJobDefinitionResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource aren't specified in the request parameters, they aren't
 * changed. When a resource is deleted, the tags that are associated with that resource are
 * deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, job queues,
 * and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Terminates a job in a job queue. Jobs that are in the `STARTING` or
 * `RUNNING` state are terminated, which causes them to transition to
 * `FAILED`. Jobs that have not progressed to the `STARTING` state are
 * cancelled.
 */
export const terminateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateJobRequest,
  output: TerminateJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Terminates a service job in a job queue.
 */
export const terminateServiceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateServiceJobRequest,
  output: TerminateServiceJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes specified tags from an Batch resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a scheduling policy.
 */
export const updateSchedulingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSchedulingPolicyRequest,
    output: UpdateSchedulingPolicyResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Creates an Batch scheduling policy.
 */
export const createSchedulingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSchedulingPolicyRequest,
    output: CreateSchedulingPolicyResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * The details of a service job.
 */
export const describeServiceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceJobRequest,
  output: DescribeServiceJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Provides a list of the first 100 `RUNNABLE` jobs associated to a single job queue.
 */
export const getJobQueueSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobQueueSnapshotRequest,
  output: GetJobQueueSnapshotResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Returns a list of Batch consumable resources.
 */
export const listConsumableResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListConsumableResourcesRequest,
    output: ListConsumableResourcesResponse,
    errors: [ClientException, ServerException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "consumableResources",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of Batch jobs.
 *
 * You must specify only one of the following items:
 *
 * - A job queue ID to return a list of jobs in that job queue
 *
 * - A multi-node parallel job ID to return a list of nodes for that job
 *
 * - An array job ID to return a list of the children for that job
 *
 * You can filter the results by job status with the `jobStatus` parameter. If you
 * don't specify a status, only `RUNNING` jobs are returned.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [ClientException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Submits a service job to a specified job queue to run on SageMaker AI. A service job is a unit of work that you submit to Batch for execution on SageMaker AI.
 */
export const submitServiceJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitServiceJobRequest,
  output: SubmitServiceJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates an Batch compute environment. You can create `MANAGED` or
 * `UNMANAGED` compute environments. `MANAGED` compute environments can
 * use Amazon EC2 or Fargate resources. `UNMANAGED` compute environments can only use
 * EC2 resources.
 *
 * In a managed compute environment, Batch manages the capacity and instance types of the
 * compute resources within the environment. This is based on the compute resource specification
 * that you define or the launch template that you
 * specify when you create the compute environment. Either, you can choose to use EC2 On-Demand
 * Instances and EC2 Spot Instances. Or, you can use Fargate and Fargate Spot capacity in
 * your managed compute environment. You can optionally set a maximum price so that Spot
 * Instances only launch when the Spot Instance price is less than a specified percentage of the
 * On-Demand price.
 *
 * In an unmanaged compute environment, you can manage your own EC2 compute resources and
 * have flexibility with how you configure your compute resources. For example, you can use
 * custom AMIs. However, you must verify that each of your AMIs meet the Amazon ECS container instance
 * AMI specification. For more information, see container instance AMIs in the
 * *Amazon Elastic Container Service Developer Guide*. After you created your unmanaged compute environment,
 * you can use the DescribeComputeEnvironments operation to find the Amazon ECS
 * cluster that's associated with it. Then, launch your container instances into that Amazon ECS
 * cluster. For more information, see Launching an Amazon ECS container
 * instance in the *Amazon Elastic Container Service Developer Guide*.
 *
 * Batch doesn't automatically upgrade the AMIs in a compute environment after it's
 * created. For more information on how to update a compute environment's AMI, see Updating compute environments in the *Batch User Guide*.
 */
export const createComputeEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateComputeEnvironmentRequest,
    output: CreateComputeEnvironmentResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Submits an Batch job from a job definition. Parameters that are specified during SubmitJob override parameters defined in the job definition. vCPU and memory
 * requirements that are specified in the `resourceRequirements` objects in the job
 * definition are the exception. They can't be overridden this way using the `memory`
 * and `vcpus` parameters. Rather, you must specify updates to job definition
 * parameters in a `resourceRequirements` object that's included in the
 * `containerOverrides` parameter.
 *
 * Job queues with a scheduling policy are limited to 500 active share identifiers at
 * a time.
 *
 * Jobs that run on Fargate resources can't be guaranteed to run for more than 14 days.
 * This is because, after 14 days, Fargate resources might become unavailable and job might be
 * terminated.
 */
export const submitJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitJobRequest,
  output: SubmitJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Describes a list of Batch jobs.
 */
export const describeJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobsRequest,
  output: DescribeJobsResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Registers an Batch job definition.
 */
export const registerJobDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterJobDefinitionRequest,
    output: RegisterJobDefinitionResponse,
    errors: [ClientException, ServerException],
  }),
);
