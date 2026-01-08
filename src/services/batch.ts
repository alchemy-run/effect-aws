import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://batch.amazonaws.com/doc/2016-08-10/");
const svc = T.AwsApiService({
  sdkId: "Batch",
  serviceShapeName: "AWSBatchV20160810",
});
const auth = T.AwsAuthSigv4({ name: "batch" });
const ver = T.ServiceVersion("2016-08-10");
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
              `https://batch-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws") {
              return e(`https://fips.batch.${Region}.amazonaws.com`);
            }
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://batch.${Region}.amazonaws.com`);
            }
            return e(
              `https://batch-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://batch.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://batch.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Integer = number;
export type Long = number;
export type ClientRequestToken = string;
export type TagKey = string;
export type TagValue = string;
export type JobExecutionTimeoutMinutes = number;
export type ImageType = string;
export type ImageIdOverride = string;
export type KubernetesVersion = string;
export type Float = number;
export type Quantity = string;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface KeyValuesPair {
  name?: string;
  values?: StringList;
}
export const KeyValuesPair = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(StringList) }),
).annotations({
  identifier: "KeyValuesPair",
}) as any as S.Schema<KeyValuesPair>;
export type ListJobsFilterList = KeyValuesPair[];
export const ListJobsFilterList = S.Array(KeyValuesPair);
export type ListJobsByConsumableResourceFilterList = KeyValuesPair[];
export const ListJobsByConsumableResourceFilterList = S.Array(KeyValuesPair);
export type PlatformCapabilityList = string[];
export const PlatformCapabilityList = S.Array(S.String);
export type TagKeysList = string[];
export const TagKeysList = S.Array(S.String);
export interface CancelJobRequest {
  jobId: string;
  reason: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String, reason: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/canceljob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface CancelJobResponse {}
export const CancelJobResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelJobResponse",
}) as any as S.Schema<CancelJobResponse>;
export type TagrisTagsMap = { [key: string]: string };
export const TagrisTagsMap = S.Record({ key: S.String, value: S.String });
export interface CreateConsumableResourceRequest {
  consumableResourceName: string;
  totalQuantity?: number;
  resourceType?: string;
  tags?: TagrisTagsMap;
}
export const CreateConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.String,
    totalQuantity: S.optional(S.Number),
    resourceType: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/createconsumableresource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateConsumableResourceRequest",
}) as any as S.Schema<CreateConsumableResourceRequest>;
export interface DeleteComputeEnvironmentRequest {
  computeEnvironment: string;
}
export const DeleteComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({ computeEnvironment: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deletecomputeenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteComputeEnvironmentRequest",
}) as any as S.Schema<DeleteComputeEnvironmentRequest>;
export interface DeleteComputeEnvironmentResponse {}
export const DeleteComputeEnvironmentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteComputeEnvironmentResponse",
}) as any as S.Schema<DeleteComputeEnvironmentResponse>;
export interface DeleteConsumableResourceRequest {
  consumableResource: string;
}
export const DeleteConsumableResourceRequest = S.suspend(() =>
  S.Struct({ consumableResource: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deleteconsumableresource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteConsumableResourceRequest",
}) as any as S.Schema<DeleteConsumableResourceRequest>;
export interface DeleteConsumableResourceResponse {}
export const DeleteConsumableResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConsumableResourceResponse",
}) as any as S.Schema<DeleteConsumableResourceResponse>;
export interface DeleteJobQueueRequest {
  jobQueue: string;
}
export const DeleteJobQueueRequest = S.suspend(() =>
  S.Struct({ jobQueue: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deletejobqueue" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobQueueRequest",
}) as any as S.Schema<DeleteJobQueueRequest>;
export interface DeleteJobQueueResponse {}
export const DeleteJobQueueResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteJobQueueResponse",
}) as any as S.Schema<DeleteJobQueueResponse>;
export interface DeleteSchedulingPolicyRequest {
  arn: string;
}
export const DeleteSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deleteschedulingpolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSchedulingPolicyRequest",
}) as any as S.Schema<DeleteSchedulingPolicyRequest>;
export interface DeleteSchedulingPolicyResponse {}
export const DeleteSchedulingPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteSchedulingPolicyResponse",
}) as any as S.Schema<DeleteSchedulingPolicyResponse>;
export interface DeleteServiceEnvironmentRequest {
  serviceEnvironment: string;
}
export const DeleteServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({ serviceEnvironment: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deleteserviceenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServiceEnvironmentRequest",
}) as any as S.Schema<DeleteServiceEnvironmentRequest>;
export interface DeleteServiceEnvironmentResponse {}
export const DeleteServiceEnvironmentResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteServiceEnvironmentResponse",
}) as any as S.Schema<DeleteServiceEnvironmentResponse>;
export interface DeregisterJobDefinitionRequest {
  jobDefinition: string;
}
export const DeregisterJobDefinitionRequest = S.suspend(() =>
  S.Struct({ jobDefinition: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/deregisterjobdefinition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeregisterJobDefinitionRequest",
}) as any as S.Schema<DeregisterJobDefinitionRequest>;
export interface DeregisterJobDefinitionResponse {}
export const DeregisterJobDefinitionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterJobDefinitionResponse",
}) as any as S.Schema<DeregisterJobDefinitionResponse>;
export interface DescribeComputeEnvironmentsRequest {
  computeEnvironments?: StringList;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeComputeEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    computeEnvironments: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describecomputeenvironments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeComputeEnvironmentsRequest",
}) as any as S.Schema<DescribeComputeEnvironmentsRequest>;
export interface DescribeConsumableResourceRequest {
  consumableResource: string;
}
export const DescribeConsumableResourceRequest = S.suspend(() =>
  S.Struct({ consumableResource: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describeconsumableresource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeConsumableResourceRequest",
}) as any as S.Schema<DescribeConsumableResourceRequest>;
export interface DescribeJobDefinitionsRequest {
  jobDefinitions?: StringList;
  maxResults?: number;
  jobDefinitionName?: string;
  status?: string;
  nextToken?: string;
}
export const DescribeJobDefinitionsRequest = S.suspend(() =>
  S.Struct({
    jobDefinitions: S.optional(StringList),
    maxResults: S.optional(S.Number),
    jobDefinitionName: S.optional(S.String),
    status: S.optional(S.String),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describejobdefinitions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobDefinitionsRequest",
}) as any as S.Schema<DescribeJobDefinitionsRequest>;
export interface DescribeJobQueuesRequest {
  jobQueues?: StringList;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeJobQueuesRequest = S.suspend(() =>
  S.Struct({
    jobQueues: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describejobqueues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobQueuesRequest",
}) as any as S.Schema<DescribeJobQueuesRequest>;
export interface DescribeJobsRequest {
  jobs: StringList;
}
export const DescribeJobsRequest = S.suspend(() =>
  S.Struct({ jobs: StringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describejobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobsRequest",
}) as any as S.Schema<DescribeJobsRequest>;
export interface DescribeSchedulingPoliciesRequest {
  arns: StringList;
}
export const DescribeSchedulingPoliciesRequest = S.suspend(() =>
  S.Struct({ arns: StringList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describeschedulingpolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSchedulingPoliciesRequest",
}) as any as S.Schema<DescribeSchedulingPoliciesRequest>;
export interface DescribeServiceEnvironmentsRequest {
  serviceEnvironments?: StringList;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeServiceEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    serviceEnvironments: S.optional(StringList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describeserviceenvironments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServiceEnvironmentsRequest",
}) as any as S.Schema<DescribeServiceEnvironmentsRequest>;
export interface DescribeServiceJobRequest {
  jobId: string;
}
export const DescribeServiceJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/describeservicejob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServiceJobRequest",
}) as any as S.Schema<DescribeServiceJobRequest>;
export interface GetJobQueueSnapshotRequest {
  jobQueue: string;
}
export const GetJobQueueSnapshotRequest = S.suspend(() =>
  S.Struct({ jobQueue: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/getjobqueuesnapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobQueueSnapshotRequest",
}) as any as S.Schema<GetJobQueueSnapshotRequest>;
export interface ListJobsRequest {
  jobQueue?: string;
  arrayJobId?: string;
  multiNodeJobId?: string;
  jobStatus?: string;
  maxResults?: number;
  nextToken?: string;
  filters?: ListJobsFilterList;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.optional(S.String),
    arrayJobId: S.optional(S.String),
    multiNodeJobId: S.optional(S.String),
    jobStatus: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(ListJobsFilterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/listjobs" }),
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
export interface ListJobsByConsumableResourceRequest {
  consumableResource: string;
  filters?: ListJobsByConsumableResourceFilterList;
  maxResults?: number;
  nextToken?: string;
}
export const ListJobsByConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResource: S.String,
    filters: S.optional(ListJobsByConsumableResourceFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/listjobsbyconsumableresource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobsByConsumableResourceRequest",
}) as any as S.Schema<ListJobsByConsumableResourceRequest>;
export interface ListSchedulingPoliciesRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSchedulingPoliciesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/listschedulingpolicies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSchedulingPoliciesRequest",
}) as any as S.Schema<ListSchedulingPoliciesRequest>;
export interface ListServiceJobsRequest {
  jobQueue?: string;
  jobStatus?: string;
  maxResults?: number;
  nextToken?: string;
  filters?: ListJobsFilterList;
}
export const ListServiceJobsRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.optional(S.String),
    jobStatus: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    filters: S.optional(ListJobsFilterList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/listservicejobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServiceJobsRequest",
}) as any as S.Schema<ListServiceJobsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/v1/tags/{resourceArn}" }),
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
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagrisTagsMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagrisTagsMap,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/tags/{resourceArn}" }),
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TerminateJobRequest {
  jobId: string;
  reason: string;
}
export const TerminateJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String, reason: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/terminatejob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateJobRequest",
}) as any as S.Schema<TerminateJobRequest>;
export interface TerminateJobResponse {}
export const TerminateJobResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TerminateJobResponse",
}) as any as S.Schema<TerminateJobResponse>;
export interface TerminateServiceJobRequest {
  jobId: string;
  reason: string;
}
export const TerminateServiceJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.String, reason: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/terminateservicejob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateServiceJobRequest",
}) as any as S.Schema<TerminateServiceJobRequest>;
export interface TerminateServiceJobResponse {}
export const TerminateServiceJobResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TerminateServiceJobResponse",
}) as any as S.Schema<TerminateServiceJobResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeysList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeysList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/v1/tags/{resourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateConsumableResourceRequest {
  consumableResource: string;
  operation?: string;
  quantity?: number;
  clientToken?: string;
}
export const UpdateConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResource: S.String,
    operation: S.optional(S.String),
    quantity: S.optional(S.Number),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/updateconsumableresource" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateConsumableResourceRequest",
}) as any as S.Schema<UpdateConsumableResourceRequest>;
export interface ComputeEnvironmentOrder {
  order: number;
  computeEnvironment: string;
}
export const ComputeEnvironmentOrder = S.suspend(() =>
  S.Struct({ order: S.Number, computeEnvironment: S.String }),
).annotations({
  identifier: "ComputeEnvironmentOrder",
}) as any as S.Schema<ComputeEnvironmentOrder>;
export type ComputeEnvironmentOrders = ComputeEnvironmentOrder[];
export const ComputeEnvironmentOrders = S.Array(ComputeEnvironmentOrder);
export interface ServiceEnvironmentOrder {
  order: number;
  serviceEnvironment: string;
}
export const ServiceEnvironmentOrder = S.suspend(() =>
  S.Struct({ order: S.Number, serviceEnvironment: S.String }),
).annotations({
  identifier: "ServiceEnvironmentOrder",
}) as any as S.Schema<ServiceEnvironmentOrder>;
export type ServiceEnvironmentOrders = ServiceEnvironmentOrder[];
export const ServiceEnvironmentOrders = S.Array(ServiceEnvironmentOrder);
export interface JobStateTimeLimitAction {
  reason: string;
  state: string;
  maxTimeSeconds: number;
  action: string;
}
export const JobStateTimeLimitAction = S.suspend(() =>
  S.Struct({
    reason: S.String,
    state: S.String,
    maxTimeSeconds: S.Number,
    action: S.String,
  }),
).annotations({
  identifier: "JobStateTimeLimitAction",
}) as any as S.Schema<JobStateTimeLimitAction>;
export type JobStateTimeLimitActions = JobStateTimeLimitAction[];
export const JobStateTimeLimitActions = S.Array(JobStateTimeLimitAction);
export interface UpdateJobQueueRequest {
  jobQueue: string;
  state?: string;
  schedulingPolicyArn?: string;
  priority?: number;
  computeEnvironmentOrder?: ComputeEnvironmentOrders;
  serviceEnvironmentOrder?: ServiceEnvironmentOrders;
  jobStateTimeLimitActions?: JobStateTimeLimitActions;
}
export const UpdateJobQueueRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.String,
    state: S.optional(S.String),
    schedulingPolicyArn: S.optional(S.String),
    priority: S.optional(S.Number),
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/updatejobqueue" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateJobQueueRequest",
}) as any as S.Schema<UpdateJobQueueRequest>;
export interface ShareAttributes {
  shareIdentifier: string;
  weightFactor?: number;
}
export const ShareAttributes = S.suspend(() =>
  S.Struct({ shareIdentifier: S.String, weightFactor: S.optional(S.Number) }),
).annotations({
  identifier: "ShareAttributes",
}) as any as S.Schema<ShareAttributes>;
export type ShareAttributesList = ShareAttributes[];
export const ShareAttributesList = S.Array(ShareAttributes);
export interface FairsharePolicy {
  shareDecaySeconds?: number;
  computeReservation?: number;
  shareDistribution?: ShareAttributesList;
}
export const FairsharePolicy = S.suspend(() =>
  S.Struct({
    shareDecaySeconds: S.optional(S.Number),
    computeReservation: S.optional(S.Number),
    shareDistribution: S.optional(ShareAttributesList),
  }),
).annotations({
  identifier: "FairsharePolicy",
}) as any as S.Schema<FairsharePolicy>;
export interface UpdateSchedulingPolicyRequest {
  arn: string;
  fairsharePolicy?: FairsharePolicy;
}
export const UpdateSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    fairsharePolicy: S.optional(FairsharePolicy),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/updateschedulingpolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSchedulingPolicyRequest",
}) as any as S.Schema<UpdateSchedulingPolicyRequest>;
export interface UpdateSchedulingPolicyResponse {}
export const UpdateSchedulingPolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateSchedulingPolicyResponse",
}) as any as S.Schema<UpdateSchedulingPolicyResponse>;
export interface CapacityLimit {
  maxCapacity?: number;
  capacityUnit?: string;
}
export const CapacityLimit = S.suspend(() =>
  S.Struct({
    maxCapacity: S.optional(S.Number),
    capacityUnit: S.optional(S.String),
  }),
).annotations({
  identifier: "CapacityLimit",
}) as any as S.Schema<CapacityLimit>;
export type CapacityLimits = CapacityLimit[];
export const CapacityLimits = S.Array(CapacityLimit);
export interface UpdateServiceEnvironmentRequest {
  serviceEnvironment: string;
  state?: string;
  capacityLimits?: CapacityLimits;
}
export const UpdateServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({
    serviceEnvironment: S.String,
    state: S.optional(S.String),
    capacityLimits: S.optional(CapacityLimits),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/updateserviceenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceEnvironmentRequest",
}) as any as S.Schema<UpdateServiceEnvironmentRequest>;
export interface EksConfiguration {
  eksClusterArn: string;
  kubernetesNamespace: string;
}
export const EksConfiguration = S.suspend(() =>
  S.Struct({ eksClusterArn: S.String, kubernetesNamespace: S.String }),
).annotations({
  identifier: "EksConfiguration",
}) as any as S.Schema<EksConfiguration>;
export type ListConsumableResourcesFilterList = KeyValuesPair[];
export const ListConsumableResourcesFilterList = S.Array(KeyValuesPair);
export type ParametersMap = { [key: string]: string };
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export interface JobTimeout {
  attemptDurationSeconds?: number;
}
export const JobTimeout = S.suspend(() =>
  S.Struct({ attemptDurationSeconds: S.optional(S.Number) }),
).annotations({ identifier: "JobTimeout" }) as any as S.Schema<JobTimeout>;
export interface ArrayProperties {
  size?: number;
}
export const ArrayProperties = S.suspend(() =>
  S.Struct({ size: S.optional(S.Number) }),
).annotations({
  identifier: "ArrayProperties",
}) as any as S.Schema<ArrayProperties>;
export interface JobDependency {
  jobId?: string;
  type?: string;
}
export const JobDependency = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "JobDependency",
}) as any as S.Schema<JobDependency>;
export type JobDependencyList = JobDependency[];
export const JobDependencyList = S.Array(JobDependency);
export interface KeyValuePair {
  name?: string;
  value?: string;
}
export const KeyValuePair = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "KeyValuePair" }) as any as S.Schema<KeyValuePair>;
export type EnvironmentVariables = KeyValuePair[];
export const EnvironmentVariables = S.Array(KeyValuePair);
export interface ResourceRequirement {
  value: string;
  type: string;
}
export const ResourceRequirement = S.suspend(() =>
  S.Struct({ value: S.String, type: S.String }),
).annotations({
  identifier: "ResourceRequirement",
}) as any as S.Schema<ResourceRequirement>;
export type ResourceRequirements = ResourceRequirement[];
export const ResourceRequirements = S.Array(ResourceRequirement);
export interface ContainerOverrides {
  vcpus?: number;
  memory?: number;
  command?: StringList;
  instanceType?: string;
  environment?: EnvironmentVariables;
  resourceRequirements?: ResourceRequirements;
}
export const ContainerOverrides = S.suspend(() =>
  S.Struct({
    vcpus: S.optional(S.Number),
    memory: S.optional(S.Number),
    command: S.optional(StringList),
    instanceType: S.optional(S.String),
    environment: S.optional(EnvironmentVariables),
    resourceRequirements: S.optional(ResourceRequirements),
  }),
).annotations({
  identifier: "ContainerOverrides",
}) as any as S.Schema<ContainerOverrides>;
export interface ServiceJobTimeout {
  attemptDurationSeconds?: number;
}
export const ServiceJobTimeout = S.suspend(() =>
  S.Struct({ attemptDurationSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "ServiceJobTimeout",
}) as any as S.Schema<ServiceJobTimeout>;
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface LaunchTemplateSpecificationOverride {
  launchTemplateId?: string;
  launchTemplateName?: string;
  version?: string;
  targetInstanceTypes?: StringList;
  userdataType?: string;
}
export const LaunchTemplateSpecificationOverride = S.suspend(() =>
  S.Struct({
    launchTemplateId: S.optional(S.String),
    launchTemplateName: S.optional(S.String),
    version: S.optional(S.String),
    targetInstanceTypes: S.optional(StringList),
    userdataType: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchTemplateSpecificationOverride",
}) as any as S.Schema<LaunchTemplateSpecificationOverride>;
export type LaunchTemplateSpecificationOverrideList =
  LaunchTemplateSpecificationOverride[];
export const LaunchTemplateSpecificationOverrideList = S.Array(
  LaunchTemplateSpecificationOverride,
);
export interface LaunchTemplateSpecification {
  launchTemplateId?: string;
  launchTemplateName?: string;
  version?: string;
  overrides?: LaunchTemplateSpecificationOverrideList;
  userdataType?: string;
}
export const LaunchTemplateSpecification = S.suspend(() =>
  S.Struct({
    launchTemplateId: S.optional(S.String),
    launchTemplateName: S.optional(S.String),
    version: S.optional(S.String),
    overrides: S.optional(LaunchTemplateSpecificationOverrideList),
    userdataType: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchTemplateSpecification",
}) as any as S.Schema<LaunchTemplateSpecification>;
export interface Ec2Configuration {
  imageType: string;
  imageIdOverride?: string;
  imageKubernetesVersion?: string;
}
export const Ec2Configuration = S.suspend(() =>
  S.Struct({
    imageType: S.String,
    imageIdOverride: S.optional(S.String),
    imageKubernetesVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "Ec2Configuration",
}) as any as S.Schema<Ec2Configuration>;
export type Ec2ConfigurationList = Ec2Configuration[];
export const Ec2ConfigurationList = S.Array(Ec2Configuration);
export interface ComputeResourceUpdate {
  minvCpus?: number;
  maxvCpus?: number;
  desiredvCpus?: number;
  subnets?: StringList;
  securityGroupIds?: StringList;
  allocationStrategy?: string;
  instanceTypes?: StringList;
  ec2KeyPair?: string;
  instanceRole?: string;
  tags?: TagsMap;
  placementGroup?: string;
  bidPercentage?: number;
  launchTemplate?: LaunchTemplateSpecification;
  ec2Configuration?: Ec2ConfigurationList;
  updateToLatestImageVersion?: boolean;
  type?: string;
  imageId?: string;
}
export const ComputeResourceUpdate = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ComputeResourceUpdate",
}) as any as S.Schema<ComputeResourceUpdate>;
export interface UpdatePolicy {
  terminateJobsOnUpdate?: boolean;
  jobExecutionTimeoutMinutes?: number;
}
export const UpdatePolicy = S.suspend(() =>
  S.Struct({
    terminateJobsOnUpdate: S.optional(S.Boolean),
    jobExecutionTimeoutMinutes: S.optional(S.Number),
  }),
).annotations({ identifier: "UpdatePolicy" }) as any as S.Schema<UpdatePolicy>;
export interface CreateConsumableResourceResponse {
  consumableResourceName: string;
  consumableResourceArn: string;
}
export const CreateConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.String,
    consumableResourceArn: S.String,
  }).pipe(ns),
).annotations({
  identifier: "CreateConsumableResourceResponse",
}) as any as S.Schema<CreateConsumableResourceResponse>;
export interface CreateJobQueueRequest {
  jobQueueName: string;
  state?: string;
  schedulingPolicyArn?: string;
  priority: number;
  computeEnvironmentOrder?: ComputeEnvironmentOrders;
  serviceEnvironmentOrder?: ServiceEnvironmentOrders;
  jobQueueType?: string;
  tags?: TagrisTagsMap;
  jobStateTimeLimitActions?: JobStateTimeLimitActions;
}
export const CreateJobQueueRequest = S.suspend(() =>
  S.Struct({
    jobQueueName: S.String,
    state: S.optional(S.String),
    schedulingPolicyArn: S.optional(S.String),
    priority: S.Number,
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobQueueType: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
    jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/createjobqueue" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobQueueRequest",
}) as any as S.Schema<CreateJobQueueRequest>;
export interface CreateServiceEnvironmentRequest {
  serviceEnvironmentName: string;
  serviceEnvironmentType: string;
  state?: string;
  capacityLimits: CapacityLimits;
  tags?: TagrisTagsMap;
}
export const CreateServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.String,
    serviceEnvironmentType: S.String,
    state: S.optional(S.String),
    capacityLimits: CapacityLimits,
    tags: S.optional(TagrisTagsMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/createserviceenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServiceEnvironmentRequest",
}) as any as S.Schema<CreateServiceEnvironmentRequest>;
export interface DescribeConsumableResourceResponse {
  consumableResourceName: string;
  consumableResourceArn: string;
  totalQuantity?: number;
  inUseQuantity?: number;
  availableQuantity?: number;
  resourceType?: string;
  createdAt?: number;
  tags?: TagrisTagsMap;
}
export const DescribeConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.String,
    consumableResourceArn: S.String,
    totalQuantity: S.optional(S.Number),
    inUseQuantity: S.optional(S.Number),
    availableQuantity: S.optional(S.Number),
    resourceType: S.optional(S.String),
    createdAt: S.optional(S.Number),
    tags: S.optional(TagrisTagsMap),
  }).pipe(ns),
).annotations({
  identifier: "DescribeConsumableResourceResponse",
}) as any as S.Schema<DescribeConsumableResourceResponse>;
export interface ListConsumableResourcesRequest {
  filters?: ListConsumableResourcesFilterList;
  maxResults?: number;
  nextToken?: string;
}
export const ListConsumableResourcesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(ListConsumableResourcesFilterList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/listconsumableresources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListConsumableResourcesRequest",
}) as any as S.Schema<ListConsumableResourcesRequest>;
export interface ListTagsForResourceResponse {
  tags?: TagrisTagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagrisTagsMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateComputeEnvironmentRequest {
  computeEnvironment: string;
  state?: string;
  unmanagedvCpus?: number;
  computeResources?: ComputeResourceUpdate;
  serviceRole?: string;
  updatePolicy?: UpdatePolicy;
  context?: string;
}
export const UpdateComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({
    computeEnvironment: S.String,
    state: S.optional(S.String),
    unmanagedvCpus: S.optional(S.Number),
    computeResources: S.optional(ComputeResourceUpdate),
    serviceRole: S.optional(S.String),
    updatePolicy: S.optional(UpdatePolicy),
    context: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/updatecomputeenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateComputeEnvironmentRequest",
}) as any as S.Schema<UpdateComputeEnvironmentRequest>;
export interface UpdateConsumableResourceResponse {
  consumableResourceName: string;
  consumableResourceArn: string;
  totalQuantity?: number;
}
export const UpdateConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.String,
    consumableResourceArn: S.String,
    totalQuantity: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "UpdateConsumableResourceResponse",
}) as any as S.Schema<UpdateConsumableResourceResponse>;
export interface UpdateJobQueueResponse {
  jobQueueName?: string;
  jobQueueArn?: string;
}
export const UpdateJobQueueResponse = S.suspend(() =>
  S.Struct({
    jobQueueName: S.optional(S.String),
    jobQueueArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateJobQueueResponse",
}) as any as S.Schema<UpdateJobQueueResponse>;
export interface UpdateServiceEnvironmentResponse {
  serviceEnvironmentName: string;
  serviceEnvironmentArn: string;
}
export const UpdateServiceEnvironmentResponse = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.String,
    serviceEnvironmentArn: S.String,
  }).pipe(ns),
).annotations({
  identifier: "UpdateServiceEnvironmentResponse",
}) as any as S.Schema<UpdateServiceEnvironmentResponse>;
export interface MountPoint {
  containerPath?: string;
  readOnly?: boolean;
  sourceVolume?: string;
}
export const MountPoint = S.suspend(() =>
  S.Struct({
    containerPath: S.optional(S.String),
    readOnly: S.optional(S.Boolean),
    sourceVolume: S.optional(S.String),
  }),
).annotations({ identifier: "MountPoint" }) as any as S.Schema<MountPoint>;
export type MountPoints = MountPoint[];
export const MountPoints = S.Array(MountPoint);
export interface Ulimit {
  hardLimit: number;
  name: string;
  softLimit: number;
}
export const Ulimit = S.suspend(() =>
  S.Struct({ hardLimit: S.Number, name: S.String, softLimit: S.Number }),
).annotations({ identifier: "Ulimit" }) as any as S.Schema<Ulimit>;
export type Ulimits = Ulimit[];
export const Ulimits = S.Array(Ulimit);
export interface Secret {
  name: string;
  valueFrom: string;
}
export const Secret = S.suspend(() =>
  S.Struct({ name: S.String, valueFrom: S.String }),
).annotations({ identifier: "Secret" }) as any as S.Schema<Secret>;
export type SecretList = Secret[];
export const SecretList = S.Array(Secret);
export interface NetworkConfiguration {
  assignPublicIp?: string;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ assignPublicIp: S.optional(S.String) }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface FargatePlatformConfiguration {
  platformVersion?: string;
}
export const FargatePlatformConfiguration = S.suspend(() =>
  S.Struct({ platformVersion: S.optional(S.String) }),
).annotations({
  identifier: "FargatePlatformConfiguration",
}) as any as S.Schema<FargatePlatformConfiguration>;
export interface EphemeralStorage {
  sizeInGiB: number;
}
export const EphemeralStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.Number }),
).annotations({
  identifier: "EphemeralStorage",
}) as any as S.Schema<EphemeralStorage>;
export interface RuntimePlatform {
  operatingSystemFamily?: string;
  cpuArchitecture?: string;
}
export const RuntimePlatform = S.suspend(() =>
  S.Struct({
    operatingSystemFamily: S.optional(S.String),
    cpuArchitecture: S.optional(S.String),
  }),
).annotations({
  identifier: "RuntimePlatform",
}) as any as S.Schema<RuntimePlatform>;
export interface RepositoryCredentials {
  credentialsParameter: string;
}
export const RepositoryCredentials = S.suspend(() =>
  S.Struct({ credentialsParameter: S.String }),
).annotations({
  identifier: "RepositoryCredentials",
}) as any as S.Schema<RepositoryCredentials>;
export interface Host {
  sourcePath?: string;
}
export const Host = S.suspend(() =>
  S.Struct({ sourcePath: S.optional(S.String) }),
).annotations({ identifier: "Host" }) as any as S.Schema<Host>;
export interface EFSAuthorizationConfig {
  accessPointId?: string;
  iam?: string;
}
export const EFSAuthorizationConfig = S.suspend(() =>
  S.Struct({ accessPointId: S.optional(S.String), iam: S.optional(S.String) }),
).annotations({
  identifier: "EFSAuthorizationConfig",
}) as any as S.Schema<EFSAuthorizationConfig>;
export interface EFSVolumeConfiguration {
  fileSystemId: string;
  rootDirectory?: string;
  transitEncryption?: string;
  transitEncryptionPort?: number;
  authorizationConfig?: EFSAuthorizationConfig;
}
export const EFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.String,
    rootDirectory: S.optional(S.String),
    transitEncryption: S.optional(S.String),
    transitEncryptionPort: S.optional(S.Number),
    authorizationConfig: S.optional(EFSAuthorizationConfig),
  }),
).annotations({
  identifier: "EFSVolumeConfiguration",
}) as any as S.Schema<EFSVolumeConfiguration>;
export interface Volume {
  host?: Host;
  name?: string;
  efsVolumeConfiguration?: EFSVolumeConfiguration;
}
export const Volume = S.suspend(() =>
  S.Struct({
    host: S.optional(Host),
    name: S.optional(S.String),
    efsVolumeConfiguration: S.optional(EFSVolumeConfiguration),
  }),
).annotations({ identifier: "Volume" }) as any as S.Schema<Volume>;
export type Volumes = Volume[];
export const Volumes = S.Array(Volume);
export type DeviceCgroupPermissions = string[];
export const DeviceCgroupPermissions = S.Array(S.String);
export interface Device {
  hostPath: string;
  containerPath?: string;
  permissions?: DeviceCgroupPermissions;
}
export const Device = S.suspend(() =>
  S.Struct({
    hostPath: S.String,
    containerPath: S.optional(S.String),
    permissions: S.optional(DeviceCgroupPermissions),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type DevicesList = Device[];
export const DevicesList = S.Array(Device);
export interface Tmpfs {
  containerPath: string;
  size: number;
  mountOptions?: StringList;
}
export const Tmpfs = S.suspend(() =>
  S.Struct({
    containerPath: S.String,
    size: S.Number,
    mountOptions: S.optional(StringList),
  }),
).annotations({ identifier: "Tmpfs" }) as any as S.Schema<Tmpfs>;
export type TmpfsList = Tmpfs[];
export const TmpfsList = S.Array(Tmpfs);
export interface LinuxParameters {
  devices?: DevicesList;
  initProcessEnabled?: boolean;
  sharedMemorySize?: number;
  tmpfs?: TmpfsList;
  maxSwap?: number;
  swappiness?: number;
}
export const LinuxParameters = S.suspend(() =>
  S.Struct({
    devices: S.optional(DevicesList),
    initProcessEnabled: S.optional(S.Boolean),
    sharedMemorySize: S.optional(S.Number),
    tmpfs: S.optional(TmpfsList),
    maxSwap: S.optional(S.Number),
    swappiness: S.optional(S.Number),
  }),
).annotations({
  identifier: "LinuxParameters",
}) as any as S.Schema<LinuxParameters>;
export type LogConfigurationOptionsMap = { [key: string]: string };
export const LogConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface LogConfiguration {
  logDriver: string;
  options?: LogConfigurationOptionsMap;
  secretOptions?: SecretList;
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({
    logDriver: S.String,
    options: S.optional(LogConfigurationOptionsMap),
    secretOptions: S.optional(SecretList),
  }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export interface ContainerProperties {
  image?: string;
  vcpus?: number;
  memory?: number;
  command?: StringList;
  jobRoleArn?: string;
  executionRoleArn?: string;
  volumes?: Volumes;
  environment?: EnvironmentVariables;
  mountPoints?: MountPoints;
  readonlyRootFilesystem?: boolean;
  privileged?: boolean;
  ulimits?: Ulimits;
  user?: string;
  instanceType?: string;
  resourceRequirements?: ResourceRequirements;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  secrets?: SecretList;
  networkConfiguration?: NetworkConfiguration;
  fargatePlatformConfiguration?: FargatePlatformConfiguration;
  enableExecuteCommand?: boolean;
  ephemeralStorage?: EphemeralStorage;
  runtimePlatform?: RuntimePlatform;
  repositoryCredentials?: RepositoryCredentials;
}
export const ContainerProperties = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ContainerProperties",
}) as any as S.Schema<ContainerProperties>;
export interface TaskContainerDependency {
  containerName?: string;
  condition?: string;
}
export const TaskContainerDependency = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    condition: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskContainerDependency",
}) as any as S.Schema<TaskContainerDependency>;
export type TaskContainerDependencyList = TaskContainerDependency[];
export const TaskContainerDependencyList = S.Array(TaskContainerDependency);
export type FirelensConfigurationOptionsMap = { [key: string]: string };
export const FirelensConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface FirelensConfiguration {
  type: string;
  options?: FirelensConfigurationOptionsMap;
}
export const FirelensConfiguration = S.suspend(() =>
  S.Struct({
    type: S.String,
    options: S.optional(FirelensConfigurationOptionsMap),
  }),
).annotations({
  identifier: "FirelensConfiguration",
}) as any as S.Schema<FirelensConfiguration>;
export interface TaskContainerProperties {
  command?: StringList;
  dependsOn?: TaskContainerDependencyList;
  environment?: EnvironmentVariables;
  essential?: boolean;
  firelensConfiguration?: FirelensConfiguration;
  image: string;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  mountPoints?: MountPoints;
  name?: string;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  repositoryCredentials?: RepositoryCredentials;
  resourceRequirements?: ResourceRequirements;
  secrets?: SecretList;
  ulimits?: Ulimits;
  user?: string;
}
export const TaskContainerProperties = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TaskContainerProperties",
}) as any as S.Schema<TaskContainerProperties>;
export type ListTaskContainerProperties = TaskContainerProperties[];
export const ListTaskContainerProperties = S.Array(TaskContainerProperties);
export interface EcsTaskProperties {
  containers: ListTaskContainerProperties;
  ephemeralStorage?: EphemeralStorage;
  executionRoleArn?: string;
  platformVersion?: string;
  ipcMode?: string;
  taskRoleArn?: string;
  pidMode?: string;
  networkConfiguration?: NetworkConfiguration;
  runtimePlatform?: RuntimePlatform;
  volumes?: Volumes;
  enableExecuteCommand?: boolean;
}
export const EcsTaskProperties = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EcsTaskProperties",
}) as any as S.Schema<EcsTaskProperties>;
export type ListEcsTaskProperties = EcsTaskProperties[];
export const ListEcsTaskProperties = S.Array(EcsTaskProperties);
export interface EcsProperties {
  taskProperties: ListEcsTaskProperties;
}
export const EcsProperties = S.suspend(() =>
  S.Struct({ taskProperties: ListEcsTaskProperties }),
).annotations({
  identifier: "EcsProperties",
}) as any as S.Schema<EcsProperties>;
export interface ImagePullSecret {
  name: string;
}
export const ImagePullSecret = S.suspend(() =>
  S.Struct({ name: S.String }),
).annotations({
  identifier: "ImagePullSecret",
}) as any as S.Schema<ImagePullSecret>;
export type ImagePullSecrets = ImagePullSecret[];
export const ImagePullSecrets = S.Array(ImagePullSecret);
export interface EksContainerEnvironmentVariable {
  name: string;
  value?: string;
}
export const EksContainerEnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.String, value: S.optional(S.String) }),
).annotations({
  identifier: "EksContainerEnvironmentVariable",
}) as any as S.Schema<EksContainerEnvironmentVariable>;
export type EksContainerEnvironmentVariables =
  EksContainerEnvironmentVariable[];
export const EksContainerEnvironmentVariables = S.Array(
  EksContainerEnvironmentVariable,
);
export type EksLimits = { [key: string]: string };
export const EksLimits = S.Record({ key: S.String, value: S.String });
export type EksRequests = { [key: string]: string };
export const EksRequests = S.Record({ key: S.String, value: S.String });
export interface EksContainerResourceRequirements {
  limits?: EksLimits;
  requests?: EksRequests;
}
export const EksContainerResourceRequirements = S.suspend(() =>
  S.Struct({
    limits: S.optional(EksLimits),
    requests: S.optional(EksRequests),
  }),
).annotations({
  identifier: "EksContainerResourceRequirements",
}) as any as S.Schema<EksContainerResourceRequirements>;
export interface EksContainerVolumeMount {
  name?: string;
  mountPath?: string;
  subPath?: string;
  readOnly?: boolean;
}
export const EksContainerVolumeMount = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    mountPath: S.optional(S.String),
    subPath: S.optional(S.String),
    readOnly: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EksContainerVolumeMount",
}) as any as S.Schema<EksContainerVolumeMount>;
export type EksContainerVolumeMounts = EksContainerVolumeMount[];
export const EksContainerVolumeMounts = S.Array(EksContainerVolumeMount);
export interface EksContainerSecurityContext {
  runAsUser?: number;
  runAsGroup?: number;
  privileged?: boolean;
  allowPrivilegeEscalation?: boolean;
  readOnlyRootFilesystem?: boolean;
  runAsNonRoot?: boolean;
}
export const EksContainerSecurityContext = S.suspend(() =>
  S.Struct({
    runAsUser: S.optional(S.Number),
    runAsGroup: S.optional(S.Number),
    privileged: S.optional(S.Boolean),
    allowPrivilegeEscalation: S.optional(S.Boolean),
    readOnlyRootFilesystem: S.optional(S.Boolean),
    runAsNonRoot: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EksContainerSecurityContext",
}) as any as S.Schema<EksContainerSecurityContext>;
export interface EksContainer {
  name?: string;
  image: string;
  imagePullPolicy?: string;
  command?: StringList;
  args?: StringList;
  env?: EksContainerEnvironmentVariables;
  resources?: EksContainerResourceRequirements;
  volumeMounts?: EksContainerVolumeMounts;
  securityContext?: EksContainerSecurityContext;
}
export const EksContainer = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    image: S.String,
    imagePullPolicy: S.optional(S.String),
    command: S.optional(StringList),
    args: S.optional(StringList),
    env: S.optional(EksContainerEnvironmentVariables),
    resources: S.optional(EksContainerResourceRequirements),
    volumeMounts: S.optional(EksContainerVolumeMounts),
    securityContext: S.optional(EksContainerSecurityContext),
  }),
).annotations({ identifier: "EksContainer" }) as any as S.Schema<EksContainer>;
export type EksContainers = EksContainer[];
export const EksContainers = S.Array(EksContainer);
export interface EksHostPath {
  path?: string;
}
export const EksHostPath = S.suspend(() =>
  S.Struct({ path: S.optional(S.String) }),
).annotations({ identifier: "EksHostPath" }) as any as S.Schema<EksHostPath>;
export interface EksEmptyDir {
  medium?: string;
  sizeLimit?: string;
}
export const EksEmptyDir = S.suspend(() =>
  S.Struct({ medium: S.optional(S.String), sizeLimit: S.optional(S.String) }),
).annotations({ identifier: "EksEmptyDir" }) as any as S.Schema<EksEmptyDir>;
export interface EksSecret {
  secretName: string;
  optional?: boolean;
}
export const EksSecret = S.suspend(() =>
  S.Struct({ secretName: S.String, optional: S.optional(S.Boolean) }),
).annotations({ identifier: "EksSecret" }) as any as S.Schema<EksSecret>;
export interface EksPersistentVolumeClaim {
  claimName: string;
  readOnly?: boolean;
}
export const EksPersistentVolumeClaim = S.suspend(() =>
  S.Struct({ claimName: S.String, readOnly: S.optional(S.Boolean) }),
).annotations({
  identifier: "EksPersistentVolumeClaim",
}) as any as S.Schema<EksPersistentVolumeClaim>;
export interface EksVolume {
  name: string;
  hostPath?: EksHostPath;
  emptyDir?: EksEmptyDir;
  secret?: EksSecret;
  persistentVolumeClaim?: EksPersistentVolumeClaim;
}
export const EksVolume = S.suspend(() =>
  S.Struct({
    name: S.String,
    hostPath: S.optional(EksHostPath),
    emptyDir: S.optional(EksEmptyDir),
    secret: S.optional(EksSecret),
    persistentVolumeClaim: S.optional(EksPersistentVolumeClaim),
  }),
).annotations({ identifier: "EksVolume" }) as any as S.Schema<EksVolume>;
export type EksVolumes = EksVolume[];
export const EksVolumes = S.Array(EksVolume);
export type EksLabelsMap = { [key: string]: string };
export const EksLabelsMap = S.Record({ key: S.String, value: S.String });
export type EksAnnotationsMap = { [key: string]: string };
export const EksAnnotationsMap = S.Record({ key: S.String, value: S.String });
export interface EksMetadata {
  labels?: EksLabelsMap;
  annotations?: EksAnnotationsMap;
  namespace?: string;
}
export const EksMetadata = S.suspend(() =>
  S.Struct({
    labels: S.optional(EksLabelsMap),
    annotations: S.optional(EksAnnotationsMap),
    namespace: S.optional(S.String),
  }),
).annotations({ identifier: "EksMetadata" }) as any as S.Schema<EksMetadata>;
export interface EksPodProperties {
  serviceAccountName?: string;
  hostNetwork?: boolean;
  dnsPolicy?: string;
  imagePullSecrets?: ImagePullSecrets;
  containers?: EksContainers;
  initContainers?: EksContainers;
  volumes?: EksVolumes;
  metadata?: EksMetadata;
  shareProcessNamespace?: boolean;
}
export const EksPodProperties = S.suspend(() =>
  S.Struct({
    serviceAccountName: S.optional(S.String),
    hostNetwork: S.optional(S.Boolean),
    dnsPolicy: S.optional(S.String),
    imagePullSecrets: S.optional(ImagePullSecrets),
    containers: S.optional(EksContainers),
    initContainers: S.optional(EksContainers),
    volumes: S.optional(EksVolumes),
    metadata: S.optional(EksMetadata),
    shareProcessNamespace: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EksPodProperties",
}) as any as S.Schema<EksPodProperties>;
export interface EksProperties {
  podProperties?: EksPodProperties;
}
export const EksProperties = S.suspend(() =>
  S.Struct({ podProperties: S.optional(EksPodProperties) }),
).annotations({
  identifier: "EksProperties",
}) as any as S.Schema<EksProperties>;
export interface ConsumableResourceRequirement {
  consumableResource?: string;
  quantity?: number;
}
export const ConsumableResourceRequirement = S.suspend(() =>
  S.Struct({
    consumableResource: S.optional(S.String),
    quantity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConsumableResourceRequirement",
}) as any as S.Schema<ConsumableResourceRequirement>;
export type ConsumableResourceList = ConsumableResourceRequirement[];
export const ConsumableResourceList = S.Array(ConsumableResourceRequirement);
export interface ConsumableResourceProperties {
  consumableResourceList?: ConsumableResourceList;
}
export const ConsumableResourceProperties = S.suspend(() =>
  S.Struct({ consumableResourceList: S.optional(ConsumableResourceList) }),
).annotations({
  identifier: "ConsumableResourceProperties",
}) as any as S.Schema<ConsumableResourceProperties>;
export interface NodeRangeProperty {
  targetNodes: string;
  container?: ContainerProperties;
  instanceTypes?: StringList;
  ecsProperties?: EcsProperties;
  eksProperties?: EksProperties;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const NodeRangeProperty = S.suspend(() =>
  S.Struct({
    targetNodes: S.String,
    container: S.optional(ContainerProperties),
    instanceTypes: S.optional(StringList),
    ecsProperties: S.optional(EcsProperties),
    eksProperties: S.optional(EksProperties),
    consumableResourceProperties: S.optional(ConsumableResourceProperties),
  }),
).annotations({
  identifier: "NodeRangeProperty",
}) as any as S.Schema<NodeRangeProperty>;
export type NodeRangeProperties = NodeRangeProperty[];
export const NodeRangeProperties = S.Array(NodeRangeProperty);
export interface EvaluateOnExit {
  onStatusReason?: string;
  onReason?: string;
  onExitCode?: string;
  action: string;
}
export const EvaluateOnExit = S.suspend(() =>
  S.Struct({
    onStatusReason: S.optional(S.String),
    onReason: S.optional(S.String),
    onExitCode: S.optional(S.String),
    action: S.String,
  }),
).annotations({
  identifier: "EvaluateOnExit",
}) as any as S.Schema<EvaluateOnExit>;
export type EvaluateOnExitList = EvaluateOnExit[];
export const EvaluateOnExitList = S.Array(EvaluateOnExit);
export interface TaskContainerOverrides {
  command?: StringList;
  environment?: EnvironmentVariables;
  name?: string;
  resourceRequirements?: ResourceRequirements;
}
export const TaskContainerOverrides = S.suspend(() =>
  S.Struct({
    command: S.optional(StringList),
    environment: S.optional(EnvironmentVariables),
    name: S.optional(S.String),
    resourceRequirements: S.optional(ResourceRequirements),
  }),
).annotations({
  identifier: "TaskContainerOverrides",
}) as any as S.Schema<TaskContainerOverrides>;
export type ListTaskContainerOverrides = TaskContainerOverrides[];
export const ListTaskContainerOverrides = S.Array(TaskContainerOverrides);
export interface TaskPropertiesOverride {
  containers?: ListTaskContainerOverrides;
}
export const TaskPropertiesOverride = S.suspend(() =>
  S.Struct({ containers: S.optional(ListTaskContainerOverrides) }),
).annotations({
  identifier: "TaskPropertiesOverride",
}) as any as S.Schema<TaskPropertiesOverride>;
export type ListTaskPropertiesOverride = TaskPropertiesOverride[];
export const ListTaskPropertiesOverride = S.Array(TaskPropertiesOverride);
export interface EcsPropertiesOverride {
  taskProperties?: ListTaskPropertiesOverride;
}
export const EcsPropertiesOverride = S.suspend(() =>
  S.Struct({ taskProperties: S.optional(ListTaskPropertiesOverride) }),
).annotations({
  identifier: "EcsPropertiesOverride",
}) as any as S.Schema<EcsPropertiesOverride>;
export interface EksContainerOverride {
  name?: string;
  image?: string;
  command?: StringList;
  args?: StringList;
  env?: EksContainerEnvironmentVariables;
  resources?: EksContainerResourceRequirements;
}
export const EksContainerOverride = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    image: S.optional(S.String),
    command: S.optional(StringList),
    args: S.optional(StringList),
    env: S.optional(EksContainerEnvironmentVariables),
    resources: S.optional(EksContainerResourceRequirements),
  }),
).annotations({
  identifier: "EksContainerOverride",
}) as any as S.Schema<EksContainerOverride>;
export type EksContainerOverrideList = EksContainerOverride[];
export const EksContainerOverrideList = S.Array(EksContainerOverride);
export interface EksPodPropertiesOverride {
  containers?: EksContainerOverrideList;
  initContainers?: EksContainerOverrideList;
  metadata?: EksMetadata;
}
export const EksPodPropertiesOverride = S.suspend(() =>
  S.Struct({
    containers: S.optional(EksContainerOverrideList),
    initContainers: S.optional(EksContainerOverrideList),
    metadata: S.optional(EksMetadata),
  }),
).annotations({
  identifier: "EksPodPropertiesOverride",
}) as any as S.Schema<EksPodPropertiesOverride>;
export interface EksPropertiesOverride {
  podProperties?: EksPodPropertiesOverride;
}
export const EksPropertiesOverride = S.suspend(() =>
  S.Struct({ podProperties: S.optional(EksPodPropertiesOverride) }),
).annotations({
  identifier: "EksPropertiesOverride",
}) as any as S.Schema<EksPropertiesOverride>;
export interface NodePropertyOverride {
  targetNodes: string;
  containerOverrides?: ContainerOverrides;
  ecsPropertiesOverride?: EcsPropertiesOverride;
  instanceTypes?: StringList;
  eksPropertiesOverride?: EksPropertiesOverride;
  consumableResourcePropertiesOverride?: ConsumableResourceProperties;
}
export const NodePropertyOverride = S.suspend(() =>
  S.Struct({
    targetNodes: S.String,
    containerOverrides: S.optional(ContainerOverrides),
    ecsPropertiesOverride: S.optional(EcsPropertiesOverride),
    instanceTypes: S.optional(StringList),
    eksPropertiesOverride: S.optional(EksPropertiesOverride),
    consumableResourcePropertiesOverride: S.optional(
      ConsumableResourceProperties,
    ),
  }),
).annotations({
  identifier: "NodePropertyOverride",
}) as any as S.Schema<NodePropertyOverride>;
export type NodePropertyOverrides = NodePropertyOverride[];
export const NodePropertyOverrides = S.Array(NodePropertyOverride);
export interface ServiceJobEvaluateOnExit {
  action?: string;
  onStatusReason?: string;
}
export const ServiceJobEvaluateOnExit = S.suspend(() =>
  S.Struct({
    action: S.optional(S.String),
    onStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceJobEvaluateOnExit",
}) as any as S.Schema<ServiceJobEvaluateOnExit>;
export type ServiceJobEvaluateOnExitList = ServiceJobEvaluateOnExit[];
export const ServiceJobEvaluateOnExitList = S.Array(ServiceJobEvaluateOnExit);
export interface ComputeResource {
  type: string;
  allocationStrategy?: string;
  minvCpus?: number;
  maxvCpus: number;
  desiredvCpus?: number;
  instanceTypes?: StringList;
  imageId?: string;
  subnets: StringList;
  securityGroupIds?: StringList;
  ec2KeyPair?: string;
  instanceRole?: string;
  tags?: TagsMap;
  placementGroup?: string;
  bidPercentage?: number;
  spotIamFleetRole?: string;
  launchTemplate?: LaunchTemplateSpecification;
  ec2Configuration?: Ec2ConfigurationList;
}
export const ComputeResource = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ComputeResource",
}) as any as S.Schema<ComputeResource>;
export interface ComputeEnvironmentDetail {
  computeEnvironmentName: string;
  computeEnvironmentArn: string;
  unmanagedvCpus?: number;
  ecsClusterArn?: string;
  tags?: TagrisTagsMap;
  type?: string;
  state?: string;
  status?: string;
  statusReason?: string;
  computeResources?: ComputeResource;
  serviceRole?: string;
  updatePolicy?: UpdatePolicy;
  eksConfiguration?: EksConfiguration;
  containerOrchestrationType?: string;
  uuid?: string;
  context?: string;
}
export const ComputeEnvironmentDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ComputeEnvironmentDetail",
}) as any as S.Schema<ComputeEnvironmentDetail>;
export type ComputeEnvironmentDetailList = ComputeEnvironmentDetail[];
export const ComputeEnvironmentDetailList = S.Array(ComputeEnvironmentDetail);
export interface RetryStrategy {
  attempts?: number;
  evaluateOnExit?: EvaluateOnExitList;
}
export const RetryStrategy = S.suspend(() =>
  S.Struct({
    attempts: S.optional(S.Number),
    evaluateOnExit: S.optional(EvaluateOnExitList),
  }),
).annotations({
  identifier: "RetryStrategy",
}) as any as S.Schema<RetryStrategy>;
export interface NodeProperties {
  numNodes: number;
  mainNode: number;
  nodeRangeProperties: NodeRangeProperties;
}
export const NodeProperties = S.suspend(() =>
  S.Struct({
    numNodes: S.Number,
    mainNode: S.Number,
    nodeRangeProperties: NodeRangeProperties,
  }),
).annotations({
  identifier: "NodeProperties",
}) as any as S.Schema<NodeProperties>;
export interface JobDefinition {
  jobDefinitionName: string;
  jobDefinitionArn: string;
  revision: number;
  status?: string;
  type: string;
  schedulingPriority?: number;
  parameters?: ParametersMap;
  retryStrategy?: RetryStrategy;
  containerProperties?: ContainerProperties;
  timeout?: JobTimeout;
  nodeProperties?: NodeProperties;
  tags?: TagrisTagsMap;
  propagateTags?: boolean;
  platformCapabilities?: PlatformCapabilityList;
  ecsProperties?: EcsProperties;
  eksProperties?: EksProperties;
  containerOrchestrationType?: string;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const JobDefinition = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "JobDefinition",
}) as any as S.Schema<JobDefinition>;
export type JobDefinitionList = JobDefinition[];
export const JobDefinitionList = S.Array(JobDefinition);
export interface JobQueueDetail {
  jobQueueName: string;
  jobQueueArn: string;
  state: string;
  schedulingPolicyArn?: string;
  status?: string;
  statusReason?: string;
  priority: number;
  computeEnvironmentOrder: ComputeEnvironmentOrders;
  serviceEnvironmentOrder?: ServiceEnvironmentOrders;
  jobQueueType?: string;
  tags?: TagrisTagsMap;
  jobStateTimeLimitActions?: JobStateTimeLimitActions;
}
export const JobQueueDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "JobQueueDetail",
}) as any as S.Schema<JobQueueDetail>;
export type JobQueueDetailList = JobQueueDetail[];
export const JobQueueDetailList = S.Array(JobQueueDetail);
export interface SchedulingPolicyDetail {
  name: string;
  arn: string;
  fairsharePolicy?: FairsharePolicy;
  tags?: TagrisTagsMap;
}
export const SchedulingPolicyDetail = S.suspend(() =>
  S.Struct({
    name: S.String,
    arn: S.String,
    fairsharePolicy: S.optional(FairsharePolicy),
    tags: S.optional(TagrisTagsMap),
  }),
).annotations({
  identifier: "SchedulingPolicyDetail",
}) as any as S.Schema<SchedulingPolicyDetail>;
export type SchedulingPolicyDetailList = SchedulingPolicyDetail[];
export const SchedulingPolicyDetailList = S.Array(SchedulingPolicyDetail);
export interface ServiceEnvironmentDetail {
  serviceEnvironmentName: string;
  serviceEnvironmentArn: string;
  serviceEnvironmentType: string;
  state?: string;
  status?: string;
  capacityLimits: CapacityLimits;
  tags?: TagrisTagsMap;
}
export const ServiceEnvironmentDetail = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.String,
    serviceEnvironmentArn: S.String,
    serviceEnvironmentType: S.String,
    state: S.optional(S.String),
    status: S.optional(S.String),
    capacityLimits: CapacityLimits,
    tags: S.optional(TagrisTagsMap),
  }),
).annotations({
  identifier: "ServiceEnvironmentDetail",
}) as any as S.Schema<ServiceEnvironmentDetail>;
export type ServiceEnvironmentDetailList = ServiceEnvironmentDetail[];
export const ServiceEnvironmentDetailList = S.Array(ServiceEnvironmentDetail);
export interface ServiceResourceId {
  name: string;
  value: string;
}
export const ServiceResourceId = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({
  identifier: "ServiceResourceId",
}) as any as S.Schema<ServiceResourceId>;
export interface LatestServiceJobAttempt {
  serviceResourceId?: ServiceResourceId;
}
export const LatestServiceJobAttempt = S.suspend(() =>
  S.Struct({ serviceResourceId: S.optional(ServiceResourceId) }),
).annotations({
  identifier: "LatestServiceJobAttempt",
}) as any as S.Schema<LatestServiceJobAttempt>;
export interface ListJobsByConsumableResourceSummary {
  jobArn: string;
  jobQueueArn: string;
  jobName: string;
  jobDefinitionArn?: string;
  shareIdentifier?: string;
  jobStatus: string;
  quantity: number;
  statusReason?: string;
  startedAt?: number;
  createdAt: number;
  consumableResourceProperties: ConsumableResourceProperties;
}
export const ListJobsByConsumableResourceSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ListJobsByConsumableResourceSummary",
}) as any as S.Schema<ListJobsByConsumableResourceSummary>;
export type ListJobsByConsumableResourceSummaryList =
  ListJobsByConsumableResourceSummary[];
export const ListJobsByConsumableResourceSummaryList = S.Array(
  ListJobsByConsumableResourceSummary,
);
export interface SchedulingPolicyListingDetail {
  arn: string;
}
export const SchedulingPolicyListingDetail = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "SchedulingPolicyListingDetail",
}) as any as S.Schema<SchedulingPolicyListingDetail>;
export type SchedulingPolicyListingDetailList = SchedulingPolicyListingDetail[];
export const SchedulingPolicyListingDetailList = S.Array(
  SchedulingPolicyListingDetail,
);
export interface ServiceJobSummary {
  latestAttempt?: LatestServiceJobAttempt;
  createdAt?: number;
  jobArn?: string;
  jobId: string;
  jobName: string;
  serviceJobType: string;
  shareIdentifier?: string;
  status?: string;
  statusReason?: string;
  startedAt?: number;
  stoppedAt?: number;
}
export const ServiceJobSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ServiceJobSummary",
}) as any as S.Schema<ServiceJobSummary>;
export type ServiceJobSummaryList = ServiceJobSummary[];
export const ServiceJobSummaryList = S.Array(ServiceJobSummary);
export interface NodeOverrides {
  numNodes?: number;
  nodePropertyOverrides?: NodePropertyOverrides;
}
export const NodeOverrides = S.suspend(() =>
  S.Struct({
    numNodes: S.optional(S.Number),
    nodePropertyOverrides: S.optional(NodePropertyOverrides),
  }),
).annotations({
  identifier: "NodeOverrides",
}) as any as S.Schema<NodeOverrides>;
export interface ServiceJobRetryStrategy {
  attempts: number;
  evaluateOnExit?: ServiceJobEvaluateOnExitList;
}
export const ServiceJobRetryStrategy = S.suspend(() =>
  S.Struct({
    attempts: S.Number,
    evaluateOnExit: S.optional(ServiceJobEvaluateOnExitList),
  }),
).annotations({
  identifier: "ServiceJobRetryStrategy",
}) as any as S.Schema<ServiceJobRetryStrategy>;
export interface CreateJobQueueResponse {
  jobQueueName: string;
  jobQueueArn: string;
}
export const CreateJobQueueResponse = S.suspend(() =>
  S.Struct({ jobQueueName: S.String, jobQueueArn: S.String }).pipe(ns),
).annotations({
  identifier: "CreateJobQueueResponse",
}) as any as S.Schema<CreateJobQueueResponse>;
export interface CreateSchedulingPolicyRequest {
  name: string;
  fairsharePolicy?: FairsharePolicy;
  tags?: TagrisTagsMap;
}
export const CreateSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    fairsharePolicy: S.optional(FairsharePolicy),
    tags: S.optional(TagrisTagsMap),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/createschedulingpolicy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSchedulingPolicyRequest",
}) as any as S.Schema<CreateSchedulingPolicyRequest>;
export interface CreateServiceEnvironmentResponse {
  serviceEnvironmentName: string;
  serviceEnvironmentArn: string;
}
export const CreateServiceEnvironmentResponse = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.String,
    serviceEnvironmentArn: S.String,
  }).pipe(ns),
).annotations({
  identifier: "CreateServiceEnvironmentResponse",
}) as any as S.Schema<CreateServiceEnvironmentResponse>;
export interface DescribeComputeEnvironmentsResponse {
  computeEnvironments?: ComputeEnvironmentDetailList;
  nextToken?: string;
}
export const DescribeComputeEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    computeEnvironments: S.optional(ComputeEnvironmentDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeComputeEnvironmentsResponse",
}) as any as S.Schema<DescribeComputeEnvironmentsResponse>;
export interface DescribeJobDefinitionsResponse {
  jobDefinitions?: JobDefinitionList;
  nextToken?: string;
}
export const DescribeJobDefinitionsResponse = S.suspend(() =>
  S.Struct({
    jobDefinitions: S.optional(JobDefinitionList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeJobDefinitionsResponse",
}) as any as S.Schema<DescribeJobDefinitionsResponse>;
export interface DescribeJobQueuesResponse {
  jobQueues?: JobQueueDetailList;
  nextToken?: string;
}
export const DescribeJobQueuesResponse = S.suspend(() =>
  S.Struct({
    jobQueues: S.optional(JobQueueDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeJobQueuesResponse",
}) as any as S.Schema<DescribeJobQueuesResponse>;
export interface DescribeSchedulingPoliciesResponse {
  schedulingPolicies?: SchedulingPolicyDetailList;
}
export const DescribeSchedulingPoliciesResponse = S.suspend(() =>
  S.Struct({ schedulingPolicies: S.optional(SchedulingPolicyDetailList) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeSchedulingPoliciesResponse",
}) as any as S.Schema<DescribeSchedulingPoliciesResponse>;
export interface DescribeServiceEnvironmentsResponse {
  serviceEnvironments?: ServiceEnvironmentDetailList;
  nextToken?: string;
}
export const DescribeServiceEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    serviceEnvironments: S.optional(ServiceEnvironmentDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServiceEnvironmentsResponse",
}) as any as S.Schema<DescribeServiceEnvironmentsResponse>;
export interface ListJobsByConsumableResourceResponse {
  jobs: ListJobsByConsumableResourceSummaryList;
  nextToken?: string;
}
export const ListJobsByConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    jobs: ListJobsByConsumableResourceSummaryList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsByConsumableResourceResponse",
}) as any as S.Schema<ListJobsByConsumableResourceResponse>;
export interface ListSchedulingPoliciesResponse {
  schedulingPolicies?: SchedulingPolicyListingDetailList;
  nextToken?: string;
}
export const ListSchedulingPoliciesResponse = S.suspend(() =>
  S.Struct({
    schedulingPolicies: S.optional(SchedulingPolicyListingDetailList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSchedulingPoliciesResponse",
}) as any as S.Schema<ListSchedulingPoliciesResponse>;
export interface ListServiceJobsResponse {
  jobSummaryList: ServiceJobSummaryList;
  nextToken?: string;
}
export const ListServiceJobsResponse = S.suspend(() =>
  S.Struct({
    jobSummaryList: ServiceJobSummaryList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServiceJobsResponse",
}) as any as S.Schema<ListServiceJobsResponse>;
export interface SubmitServiceJobRequest {
  jobName: string;
  jobQueue: string;
  retryStrategy?: ServiceJobRetryStrategy;
  schedulingPriority?: number;
  serviceRequestPayload: string;
  serviceJobType: string;
  shareIdentifier?: string;
  timeoutConfig?: ServiceJobTimeout;
  tags?: TagrisTagsMap;
  clientToken?: string;
}
export const SubmitServiceJobRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/submitservicejob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubmitServiceJobRequest",
}) as any as S.Schema<SubmitServiceJobRequest>;
export interface UpdateComputeEnvironmentResponse {
  computeEnvironmentName?: string;
  computeEnvironmentArn?: string;
}
export const UpdateComputeEnvironmentResponse = S.suspend(() =>
  S.Struct({
    computeEnvironmentName: S.optional(S.String),
    computeEnvironmentArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateComputeEnvironmentResponse",
}) as any as S.Schema<UpdateComputeEnvironmentResponse>;
export interface NodeDetails {
  nodeIndex?: number;
  isMainNode?: boolean;
}
export const NodeDetails = S.suspend(() =>
  S.Struct({
    nodeIndex: S.optional(S.Number),
    isMainNode: S.optional(S.Boolean),
  }),
).annotations({ identifier: "NodeDetails" }) as any as S.Schema<NodeDetails>;
export interface FrontOfQueueJobSummary {
  jobArn?: string;
  earliestTimeAtPosition?: number;
}
export const FrontOfQueueJobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    earliestTimeAtPosition: S.optional(S.Number),
  }),
).annotations({
  identifier: "FrontOfQueueJobSummary",
}) as any as S.Schema<FrontOfQueueJobSummary>;
export type FrontOfQueueJobSummaryList = FrontOfQueueJobSummary[];
export const FrontOfQueueJobSummaryList = S.Array(FrontOfQueueJobSummary);
export interface ContainerSummary {
  exitCode?: number;
  reason?: string;
}
export const ContainerSummary = S.suspend(() =>
  S.Struct({ exitCode: S.optional(S.Number), reason: S.optional(S.String) }),
).annotations({
  identifier: "ContainerSummary",
}) as any as S.Schema<ContainerSummary>;
export interface ArrayPropertiesSummary {
  size?: number;
  index?: number;
}
export const ArrayPropertiesSummary = S.suspend(() =>
  S.Struct({ size: S.optional(S.Number), index: S.optional(S.Number) }),
).annotations({
  identifier: "ArrayPropertiesSummary",
}) as any as S.Schema<ArrayPropertiesSummary>;
export interface NodePropertiesSummary {
  isMainNode?: boolean;
  numNodes?: number;
  nodeIndex?: number;
}
export const NodePropertiesSummary = S.suspend(() =>
  S.Struct({
    isMainNode: S.optional(S.Boolean),
    numNodes: S.optional(S.Number),
    nodeIndex: S.optional(S.Number),
  }),
).annotations({
  identifier: "NodePropertiesSummary",
}) as any as S.Schema<NodePropertiesSummary>;
export interface ServiceJobAttemptDetail {
  serviceResourceId?: ServiceResourceId;
  startedAt?: number;
  stoppedAt?: number;
  statusReason?: string;
}
export const ServiceJobAttemptDetail = S.suspend(() =>
  S.Struct({
    serviceResourceId: S.optional(ServiceResourceId),
    startedAt: S.optional(S.Number),
    stoppedAt: S.optional(S.Number),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceJobAttemptDetail",
}) as any as S.Schema<ServiceJobAttemptDetail>;
export type ServiceJobAttemptDetails = ServiceJobAttemptDetail[];
export const ServiceJobAttemptDetails = S.Array(ServiceJobAttemptDetail);
export interface FrontOfQueueDetail {
  jobs?: FrontOfQueueJobSummaryList;
  lastUpdatedAt?: number;
}
export const FrontOfQueueDetail = S.suspend(() =>
  S.Struct({
    jobs: S.optional(FrontOfQueueJobSummaryList),
    lastUpdatedAt: S.optional(S.Number),
  }),
).annotations({
  identifier: "FrontOfQueueDetail",
}) as any as S.Schema<FrontOfQueueDetail>;
export interface ConsumableResourceSummary {
  consumableResourceArn: string;
  consumableResourceName: string;
  totalQuantity?: number;
  inUseQuantity?: number;
  resourceType?: string;
}
export const ConsumableResourceSummary = S.suspend(() =>
  S.Struct({
    consumableResourceArn: S.String,
    consumableResourceName: S.String,
    totalQuantity: S.optional(S.Number),
    inUseQuantity: S.optional(S.Number),
    resourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "ConsumableResourceSummary",
}) as any as S.Schema<ConsumableResourceSummary>;
export type ConsumableResourceSummaryList = ConsumableResourceSummary[];
export const ConsumableResourceSummaryList = S.Array(ConsumableResourceSummary);
export interface JobSummary {
  jobArn?: string;
  jobId: string;
  jobName: string;
  createdAt?: number;
  status?: string;
  statusReason?: string;
  startedAt?: number;
  stoppedAt?: number;
  container?: ContainerSummary;
  arrayProperties?: ArrayPropertiesSummary;
  nodeProperties?: NodePropertiesSummary;
  jobDefinition?: string;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaryList = JobSummary[];
export const JobSummaryList = S.Array(JobSummary);
export interface NetworkInterface {
  attachmentId?: string;
  ipv6Address?: string;
  privateIpv4Address?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    attachmentId: S.optional(S.String),
    ipv6Address: S.optional(S.String),
    privateIpv4Address: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaceList = NetworkInterface[];
export const NetworkInterfaceList = S.Array(NetworkInterface);
export interface AttemptContainerDetail {
  containerInstanceArn?: string;
  taskArn?: string;
  exitCode?: number;
  reason?: string;
  logStreamName?: string;
  networkInterfaces?: NetworkInterfaceList;
}
export const AttemptContainerDetail = S.suspend(() =>
  S.Struct({
    containerInstanceArn: S.optional(S.String),
    taskArn: S.optional(S.String),
    exitCode: S.optional(S.Number),
    reason: S.optional(S.String),
    logStreamName: S.optional(S.String),
    networkInterfaces: S.optional(NetworkInterfaceList),
  }),
).annotations({
  identifier: "AttemptContainerDetail",
}) as any as S.Schema<AttemptContainerDetail>;
export type ArrayJobStatusSummary = { [key: string]: number };
export const ArrayJobStatusSummary = S.Record({
  key: S.String,
  value: S.Number,
});
export interface EksAttemptContainerDetail {
  name?: string;
  containerID?: string;
  exitCode?: number;
  reason?: string;
}
export const EksAttemptContainerDetail = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    containerID: S.optional(S.String),
    exitCode: S.optional(S.Number),
    reason: S.optional(S.String),
  }),
).annotations({
  identifier: "EksAttemptContainerDetail",
}) as any as S.Schema<EksAttemptContainerDetail>;
export type EksAttemptContainerDetails = EksAttemptContainerDetail[];
export const EksAttemptContainerDetails = S.Array(EksAttemptContainerDetail);
export interface CreateComputeEnvironmentRequest {
  computeEnvironmentName: string;
  type: string;
  state?: string;
  unmanagedvCpus?: number;
  computeResources?: ComputeResource;
  serviceRole?: string;
  tags?: TagrisTagsMap;
  eksConfiguration?: EksConfiguration;
  context?: string;
}
export const CreateComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({
    computeEnvironmentName: S.String,
    type: S.String,
    state: S.optional(S.String),
    unmanagedvCpus: S.optional(S.Number),
    computeResources: S.optional(ComputeResource),
    serviceRole: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
    eksConfiguration: S.optional(EksConfiguration),
    context: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/createcomputeenvironment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateComputeEnvironmentRequest",
}) as any as S.Schema<CreateComputeEnvironmentRequest>;
export interface CreateSchedulingPolicyResponse {
  name: string;
  arn: string;
}
export const CreateSchedulingPolicyResponse = S.suspend(() =>
  S.Struct({ name: S.String, arn: S.String }).pipe(ns),
).annotations({
  identifier: "CreateSchedulingPolicyResponse",
}) as any as S.Schema<CreateSchedulingPolicyResponse>;
export interface DescribeServiceJobResponse {
  attempts?: ServiceJobAttemptDetails;
  createdAt?: number;
  isTerminated?: boolean;
  jobArn?: string;
  jobId: string;
  jobName: string;
  jobQueue: string;
  latestAttempt?: LatestServiceJobAttempt;
  retryStrategy?: ServiceJobRetryStrategy;
  schedulingPriority?: number;
  serviceRequestPayload?: string;
  serviceJobType: string;
  shareIdentifier?: string;
  startedAt: number;
  status: string;
  statusReason?: string;
  stoppedAt?: number;
  tags?: TagrisTagsMap;
  timeoutConfig?: ServiceJobTimeout;
}
export const DescribeServiceJobResponse = S.suspend(() =>
  S.Struct({
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
  }).pipe(ns),
).annotations({
  identifier: "DescribeServiceJobResponse",
}) as any as S.Schema<DescribeServiceJobResponse>;
export interface GetJobQueueSnapshotResponse {
  frontOfQueue?: FrontOfQueueDetail;
}
export const GetJobQueueSnapshotResponse = S.suspend(() =>
  S.Struct({ frontOfQueue: S.optional(FrontOfQueueDetail) }).pipe(ns),
).annotations({
  identifier: "GetJobQueueSnapshotResponse",
}) as any as S.Schema<GetJobQueueSnapshotResponse>;
export interface ListConsumableResourcesResponse {
  consumableResources: ConsumableResourceSummaryList;
  nextToken?: string;
}
export const ListConsumableResourcesResponse = S.suspend(() =>
  S.Struct({
    consumableResources: ConsumableResourceSummaryList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConsumableResourcesResponse",
}) as any as S.Schema<ListConsumableResourcesResponse>;
export interface ListJobsResponse {
  jobSummaryList: JobSummaryList;
  nextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    jobSummaryList: JobSummaryList,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface SubmitJobRequest {
  jobName: string;
  jobQueue: string;
  shareIdentifier?: string;
  schedulingPriorityOverride?: number;
  arrayProperties?: ArrayProperties;
  dependsOn?: JobDependencyList;
  jobDefinition: string;
  parameters?: ParametersMap;
  containerOverrides?: ContainerOverrides;
  nodeOverrides?: NodeOverrides;
  retryStrategy?: RetryStrategy;
  propagateTags?: boolean;
  timeout?: JobTimeout;
  tags?: TagrisTagsMap;
  eksPropertiesOverride?: EksPropertiesOverride;
  ecsPropertiesOverride?: EcsPropertiesOverride;
  consumableResourcePropertiesOverride?: ConsumableResourceProperties;
}
export const SubmitJobRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/submitjob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SubmitJobRequest",
}) as any as S.Schema<SubmitJobRequest>;
export interface SubmitServiceJobResponse {
  jobArn?: string;
  jobName: string;
  jobId: string;
}
export const SubmitServiceJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobName: S.String,
    jobId: S.String,
  }).pipe(ns),
).annotations({
  identifier: "SubmitServiceJobResponse",
}) as any as S.Schema<SubmitServiceJobResponse>;
export interface ContainerDetail {
  image?: string;
  vcpus?: number;
  memory?: number;
  command?: StringList;
  jobRoleArn?: string;
  executionRoleArn?: string;
  volumes?: Volumes;
  environment?: EnvironmentVariables;
  mountPoints?: MountPoints;
  readonlyRootFilesystem?: boolean;
  ulimits?: Ulimits;
  privileged?: boolean;
  user?: string;
  exitCode?: number;
  reason?: string;
  containerInstanceArn?: string;
  taskArn?: string;
  logStreamName?: string;
  instanceType?: string;
  networkInterfaces?: NetworkInterfaceList;
  resourceRequirements?: ResourceRequirements;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  secrets?: SecretList;
  networkConfiguration?: NetworkConfiguration;
  fargatePlatformConfiguration?: FargatePlatformConfiguration;
  ephemeralStorage?: EphemeralStorage;
  runtimePlatform?: RuntimePlatform;
  repositoryCredentials?: RepositoryCredentials;
  enableExecuteCommand?: boolean;
}
export const ContainerDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ContainerDetail",
}) as any as S.Schema<ContainerDetail>;
export interface ArrayPropertiesDetail {
  statusSummary?: ArrayJobStatusSummary;
  size?: number;
  index?: number;
}
export const ArrayPropertiesDetail = S.suspend(() =>
  S.Struct({
    statusSummary: S.optional(ArrayJobStatusSummary),
    size: S.optional(S.Number),
    index: S.optional(S.Number),
  }),
).annotations({
  identifier: "ArrayPropertiesDetail",
}) as any as S.Schema<ArrayPropertiesDetail>;
export interface EksAttemptDetail {
  containers?: EksAttemptContainerDetails;
  initContainers?: EksAttemptContainerDetails;
  eksClusterArn?: string;
  podName?: string;
  podNamespace?: string;
  nodeName?: string;
  startedAt?: number;
  stoppedAt?: number;
  statusReason?: string;
}
export const EksAttemptDetail = S.suspend(() =>
  S.Struct({
    containers: S.optional(EksAttemptContainerDetails),
    initContainers: S.optional(EksAttemptContainerDetails),
    eksClusterArn: S.optional(S.String),
    podName: S.optional(S.String),
    podNamespace: S.optional(S.String),
    nodeName: S.optional(S.String),
    startedAt: S.optional(S.Number),
    stoppedAt: S.optional(S.Number),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "EksAttemptDetail",
}) as any as S.Schema<EksAttemptDetail>;
export type EksAttemptDetails = EksAttemptDetail[];
export const EksAttemptDetails = S.Array(EksAttemptDetail);
export interface AttemptTaskContainerDetails {
  exitCode?: number;
  name?: string;
  reason?: string;
  logStreamName?: string;
  networkInterfaces?: NetworkInterfaceList;
}
export const AttemptTaskContainerDetails = S.suspend(() =>
  S.Struct({
    exitCode: S.optional(S.Number),
    name: S.optional(S.String),
    reason: S.optional(S.String),
    logStreamName: S.optional(S.String),
    networkInterfaces: S.optional(NetworkInterfaceList),
  }),
).annotations({
  identifier: "AttemptTaskContainerDetails",
}) as any as S.Schema<AttemptTaskContainerDetails>;
export type ListAttemptTaskContainerDetails = AttemptTaskContainerDetails[];
export const ListAttemptTaskContainerDetails = S.Array(
  AttemptTaskContainerDetails,
);
export interface EksContainerDetail {
  name?: string;
  image?: string;
  imagePullPolicy?: string;
  command?: StringList;
  args?: StringList;
  env?: EksContainerEnvironmentVariables;
  resources?: EksContainerResourceRequirements;
  exitCode?: number;
  reason?: string;
  volumeMounts?: EksContainerVolumeMounts;
  securityContext?: EksContainerSecurityContext;
}
export const EksContainerDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EksContainerDetail",
}) as any as S.Schema<EksContainerDetail>;
export type EksContainerDetails = EksContainerDetail[];
export const EksContainerDetails = S.Array(EksContainerDetail);
export interface TaskContainerDetails {
  command?: StringList;
  dependsOn?: TaskContainerDependencyList;
  environment?: EnvironmentVariables;
  essential?: boolean;
  firelensConfiguration?: FirelensConfiguration;
  image?: string;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  mountPoints?: MountPoints;
  name?: string;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  repositoryCredentials?: RepositoryCredentials;
  resourceRequirements?: ResourceRequirements;
  secrets?: SecretList;
  ulimits?: Ulimits;
  user?: string;
  exitCode?: number;
  reason?: string;
  logStreamName?: string;
  networkInterfaces?: NetworkInterfaceList;
}
export const TaskContainerDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "TaskContainerDetails",
}) as any as S.Schema<TaskContainerDetails>;
export type ListTaskContainerDetails = TaskContainerDetails[];
export const ListTaskContainerDetails = S.Array(TaskContainerDetails);
export interface AttemptEcsTaskDetails {
  containerInstanceArn?: string;
  taskArn?: string;
  containers?: ListAttemptTaskContainerDetails;
}
export const AttemptEcsTaskDetails = S.suspend(() =>
  S.Struct({
    containerInstanceArn: S.optional(S.String),
    taskArn: S.optional(S.String),
    containers: S.optional(ListAttemptTaskContainerDetails),
  }),
).annotations({
  identifier: "AttemptEcsTaskDetails",
}) as any as S.Schema<AttemptEcsTaskDetails>;
export type ListAttemptEcsTaskDetails = AttemptEcsTaskDetails[];
export const ListAttemptEcsTaskDetails = S.Array(AttemptEcsTaskDetails);
export interface EksPodPropertiesDetail {
  serviceAccountName?: string;
  hostNetwork?: boolean;
  dnsPolicy?: string;
  imagePullSecrets?: ImagePullSecrets;
  containers?: EksContainerDetails;
  initContainers?: EksContainerDetails;
  volumes?: EksVolumes;
  podName?: string;
  nodeName?: string;
  metadata?: EksMetadata;
  shareProcessNamespace?: boolean;
}
export const EksPodPropertiesDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EksPodPropertiesDetail",
}) as any as S.Schema<EksPodPropertiesDetail>;
export interface EcsTaskDetails {
  containers?: ListTaskContainerDetails;
  containerInstanceArn?: string;
  taskArn?: string;
  ephemeralStorage?: EphemeralStorage;
  executionRoleArn?: string;
  platformVersion?: string;
  ipcMode?: string;
  taskRoleArn?: string;
  pidMode?: string;
  networkConfiguration?: NetworkConfiguration;
  runtimePlatform?: RuntimePlatform;
  volumes?: Volumes;
  enableExecuteCommand?: boolean;
}
export const EcsTaskDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "EcsTaskDetails",
}) as any as S.Schema<EcsTaskDetails>;
export type ListEcsTaskDetails = EcsTaskDetails[];
export const ListEcsTaskDetails = S.Array(EcsTaskDetails);
export interface CreateComputeEnvironmentResponse {
  computeEnvironmentName?: string;
  computeEnvironmentArn?: string;
}
export const CreateComputeEnvironmentResponse = S.suspend(() =>
  S.Struct({
    computeEnvironmentName: S.optional(S.String),
    computeEnvironmentArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateComputeEnvironmentResponse",
}) as any as S.Schema<CreateComputeEnvironmentResponse>;
export interface SubmitJobResponse {
  jobArn?: string;
  jobName: string;
  jobId: string;
}
export const SubmitJobResponse = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobName: S.String,
    jobId: S.String,
  }).pipe(ns),
).annotations({
  identifier: "SubmitJobResponse",
}) as any as S.Schema<SubmitJobResponse>;
export interface AttemptDetail {
  container?: AttemptContainerDetail;
  startedAt?: number;
  stoppedAt?: number;
  statusReason?: string;
  taskProperties?: ListAttemptEcsTaskDetails;
}
export const AttemptDetail = S.suspend(() =>
  S.Struct({
    container: S.optional(AttemptContainerDetail),
    startedAt: S.optional(S.Number),
    stoppedAt: S.optional(S.Number),
    statusReason: S.optional(S.String),
    taskProperties: S.optional(ListAttemptEcsTaskDetails),
  }),
).annotations({
  identifier: "AttemptDetail",
}) as any as S.Schema<AttemptDetail>;
export type AttemptDetails = AttemptDetail[];
export const AttemptDetails = S.Array(AttemptDetail);
export interface EksPropertiesDetail {
  podProperties?: EksPodPropertiesDetail;
}
export const EksPropertiesDetail = S.suspend(() =>
  S.Struct({ podProperties: S.optional(EksPodPropertiesDetail) }),
).annotations({
  identifier: "EksPropertiesDetail",
}) as any as S.Schema<EksPropertiesDetail>;
export interface EcsPropertiesDetail {
  taskProperties?: ListEcsTaskDetails;
}
export const EcsPropertiesDetail = S.suspend(() =>
  S.Struct({ taskProperties: S.optional(ListEcsTaskDetails) }),
).annotations({
  identifier: "EcsPropertiesDetail",
}) as any as S.Schema<EcsPropertiesDetail>;
export interface JobDetail {
  jobArn?: string;
  jobName: string;
  jobId: string;
  jobQueue: string;
  status: string;
  shareIdentifier?: string;
  schedulingPriority?: number;
  attempts?: AttemptDetails;
  statusReason?: string;
  createdAt?: number;
  retryStrategy?: RetryStrategy;
  startedAt: number;
  stoppedAt?: number;
  dependsOn?: JobDependencyList;
  jobDefinition: string;
  parameters?: ParametersMap;
  container?: ContainerDetail;
  nodeDetails?: NodeDetails;
  nodeProperties?: NodeProperties;
  arrayProperties?: ArrayPropertiesDetail;
  timeout?: JobTimeout;
  tags?: TagrisTagsMap;
  propagateTags?: boolean;
  platformCapabilities?: PlatformCapabilityList;
  eksProperties?: EksPropertiesDetail;
  eksAttempts?: EksAttemptDetails;
  ecsProperties?: EcsPropertiesDetail;
  isCancelled?: boolean;
  isTerminated?: boolean;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const JobDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "JobDetail" }) as any as S.Schema<JobDetail>;
export type JobDetailList = JobDetail[];
export const JobDetailList = S.Array(JobDetail);
export interface DescribeJobsResponse {
  jobs?: JobDetailList;
}
export const DescribeJobsResponse = S.suspend(() =>
  S.Struct({ jobs: S.optional(JobDetailList) }).pipe(ns),
).annotations({
  identifier: "DescribeJobsResponse",
}) as any as S.Schema<DescribeJobsResponse>;
export interface RegisterJobDefinitionRequest {
  jobDefinitionName: string;
  type: string;
  parameters?: ParametersMap;
  schedulingPriority?: number;
  containerProperties?: ContainerProperties;
  nodeProperties?: NodeProperties;
  retryStrategy?: RetryStrategy;
  propagateTags?: boolean;
  timeout?: JobTimeout;
  tags?: TagrisTagsMap;
  platformCapabilities?: PlatformCapabilityList;
  eksProperties?: EksProperties;
  ecsProperties?: EcsProperties;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const RegisterJobDefinitionRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/v1/registerjobdefinition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RegisterJobDefinitionRequest",
}) as any as S.Schema<RegisterJobDefinitionRequest>;
export interface RegisterJobDefinitionResponse {
  jobDefinitionName: string;
  jobDefinitionArn: string;
  revision: number;
}
export const RegisterJobDefinitionResponse = S.suspend(() =>
  S.Struct({
    jobDefinitionName: S.String,
    jobDefinitionArn: S.String,
    revision: S.Number,
  }).pipe(ns),
).annotations({
  identifier: "RegisterJobDefinitionResponse",
}) as any as S.Schema<RegisterJobDefinitionResponse>;

//# Errors
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}

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
export const cancelJob: (
  input: CancelJobRequest,
) => Effect.Effect<
  CancelJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJobQueue: (
  input: CreateJobQueueRequest,
) => Effect.Effect<
  CreateJobQueueResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobQueueRequest,
  output: CreateJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates a service environment for running service jobs. Service environments define capacity limits for specific service types such as SageMaker Training jobs.
 */
export const createServiceEnvironment: (
  input: CreateServiceEnvironmentRequest,
) => Effect.Effect<
  CreateServiceEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceEnvironmentRequest,
  output: CreateServiceEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Describes one or more of your compute environments.
 *
 * If you're using an unmanaged compute environment, you can use the
 * `DescribeComputeEnvironment` operation to determine the
 * `ecsClusterArn` that you launch your Amazon ECS container instances into.
 */
export const describeComputeEnvironments: {
  (
    input: DescribeComputeEnvironmentsRequest,
  ): Effect.Effect<
    DescribeComputeEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeComputeEnvironmentsRequest,
  ) => Stream.Stream<
    DescribeComputeEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeComputeEnvironmentsRequest,
  ) => Stream.Stream<
    ComputeEnvironmentDetail,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeJobDefinitions: {
  (
    input: DescribeJobDefinitionsRequest,
  ): Effect.Effect<
    DescribeJobDefinitionsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobDefinitionsRequest,
  ) => Stream.Stream<
    DescribeJobDefinitionsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobDefinitionsRequest,
  ) => Stream.Stream<
    JobDefinition,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeJobQueues: {
  (
    input: DescribeJobQueuesRequest,
  ): Effect.Effect<
    DescribeJobQueuesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobQueuesRequest,
  ) => Stream.Stream<
    DescribeJobQueuesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobQueuesRequest,
  ) => Stream.Stream<
    JobQueueDetail,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeJobQueuesRequest,
  output: DescribeJobQueuesResponse,
  errors: [ClientException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobQueues",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Describes one or more of your scheduling policies.
 */
export const describeSchedulingPolicies: (
  input: DescribeSchedulingPoliciesRequest,
) => Effect.Effect<
  DescribeSchedulingPoliciesResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSchedulingPoliciesRequest,
  output: DescribeSchedulingPoliciesResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Describes one or more of your service environments.
 */
export const describeServiceEnvironments: {
  (
    input: DescribeServiceEnvironmentsRequest,
  ): Effect.Effect<
    DescribeServiceEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServiceEnvironmentsRequest,
  ) => Stream.Stream<
    DescribeServiceEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServiceEnvironmentsRequest,
  ) => Stream.Stream<
    ServiceEnvironmentDetail,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listJobsByConsumableResource: {
  (
    input: ListJobsByConsumableResourceRequest,
  ): Effect.Effect<
    ListJobsByConsumableResourceResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsByConsumableResourceRequest,
  ) => Stream.Stream<
    ListJobsByConsumableResourceResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsByConsumableResourceRequest,
  ) => Stream.Stream<
    ListJobsByConsumableResourceSummary,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listSchedulingPolicies: {
  (
    input: ListSchedulingPoliciesRequest,
  ): Effect.Effect<
    ListSchedulingPoliciesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchedulingPoliciesRequest,
  ) => Stream.Stream<
    ListSchedulingPoliciesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchedulingPoliciesRequest,
  ) => Stream.Stream<
    SchedulingPolicyListingDetail,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listServiceJobs: {
  (
    input: ListServiceJobsRequest,
  ): Effect.Effect<
    ListServiceJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceJobsRequest,
  ) => Stream.Stream<
    ListServiceJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceJobsRequest,
  ) => Stream.Stream<
    ServiceJobSummary,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServiceJobsRequest,
  output: ListServiceJobsResponse,
  errors: [ClientException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaryList",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an Batch compute environment.
 */
export const updateComputeEnvironment: (
  input: UpdateComputeEnvironmentRequest,
) => Effect.Effect<
  UpdateComputeEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComputeEnvironmentRequest,
  output: UpdateComputeEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates an Batch consumable resource.
 */
export const createConsumableResource: (
  input: CreateConsumableResourceRequest,
) => Effect.Effect<
  CreateConsumableResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConsumableResourceRequest,
  output: CreateConsumableResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Returns a description of the specified consumable resource.
 */
export const describeConsumableResource: (
  input: DescribeConsumableResourceRequest,
) => Effect.Effect<
  DescribeConsumableResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConsumableResourceRequest,
  output: DescribeConsumableResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Lists the tags for an Batch resource. Batch resources that support tags are compute environments, jobs, job definitions, job queues,
 * and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a consumable resource.
 */
export const updateConsumableResource: (
  input: UpdateConsumableResourceRequest,
) => Effect.Effect<
  UpdateConsumableResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConsumableResourceRequest,
  output: UpdateConsumableResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a job queue.
 */
export const updateJobQueue: (
  input: UpdateJobQueueRequest,
) => Effect.Effect<
  UpdateJobQueueResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobQueueRequest,
  output: UpdateJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a service environment. You can update the state of a service environment from `ENABLED` to `DISABLED` to prevent new service jobs from being placed in the service environment.
 */
export const updateServiceEnvironment: (
  input: UpdateServiceEnvironmentRequest,
) => Effect.Effect<
  UpdateServiceEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceEnvironmentRequest,
  output: UpdateServiceEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
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
export const deleteComputeEnvironment: (
  input: DeleteComputeEnvironmentRequest,
) => Effect.Effect<
  DeleteComputeEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComputeEnvironmentRequest,
  output: DeleteComputeEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes the specified consumable resource.
 */
export const deleteConsumableResource: (
  input: DeleteConsumableResourceRequest,
) => Effect.Effect<
  DeleteConsumableResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConsumableResourceRequest,
  output: DeleteConsumableResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes the specified job queue. You must first disable submissions for a queue with the
 * UpdateJobQueue operation. All jobs in the queue are eventually terminated
 * when you delete a job queue. The jobs are terminated at a rate of about 16 jobs each
 * second.
 *
 * It's not necessary to disassociate compute environments from a queue before submitting a
 * `DeleteJobQueue` request.
 */
export const deleteJobQueue: (
  input: DeleteJobQueueRequest,
) => Effect.Effect<
  DeleteJobQueueResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobQueueRequest,
  output: DeleteJobQueueResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes the specified scheduling policy.
 *
 * You can't delete a scheduling policy that's used in any job queues.
 */
export const deleteSchedulingPolicy: (
  input: DeleteSchedulingPolicyRequest,
) => Effect.Effect<
  DeleteSchedulingPolicyResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchedulingPolicyRequest,
  output: DeleteSchedulingPolicyResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes a Service environment. Before you can delete a service environment, you must first set its state to `DISABLED` with the `UpdateServiceEnvironment` API operation and disassociate it from any job queues with the `UpdateJobQueue` API operation.
 */
export const deleteServiceEnvironment: (
  input: DeleteServiceEnvironmentRequest,
) => Effect.Effect<
  DeleteServiceEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceEnvironmentRequest,
  output: DeleteServiceEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deregisters an Batch job definition. Job definitions are permanently deleted after 180
 * days.
 */
export const deregisterJobDefinition: (
  input: DeregisterJobDefinitionRequest,
) => Effect.Effect<
  DeregisterJobDefinitionResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterJobDefinitionRequest,
  output: DeregisterJobDefinitionResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource aren't specified in the request parameters, they aren't
 * changed. When a resource is deleted, the tags that are associated with that resource are
 * deleted as well. Batch resources that support tags are compute environments, jobs, job definitions, job queues,
 * and scheduling policies. ARNs for child jobs of array and multi-node parallel (MNP) jobs aren't supported.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const terminateJob: (
  input: TerminateJobRequest,
) => Effect.Effect<
  TerminateJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateJobRequest,
  output: TerminateJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Terminates a service job in a job queue.
 */
export const terminateServiceJob: (
  input: TerminateServiceJobRequest,
) => Effect.Effect<
  TerminateServiceJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateServiceJobRequest,
  output: TerminateServiceJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Deletes specified tags from an Batch resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Updates a scheduling policy.
 */
export const updateSchedulingPolicy: (
  input: UpdateSchedulingPolicyRequest,
) => Effect.Effect<
  UpdateSchedulingPolicyResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchedulingPolicyRequest,
  output: UpdateSchedulingPolicyResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Creates an Batch scheduling policy.
 */
export const createSchedulingPolicy: (
  input: CreateSchedulingPolicyRequest,
) => Effect.Effect<
  CreateSchedulingPolicyResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchedulingPolicyRequest,
  output: CreateSchedulingPolicyResponse,
  errors: [ClientException, ServerException],
}));
/**
 * The details of a service job.
 */
export const describeServiceJob: (
  input: DescribeServiceJobRequest,
) => Effect.Effect<
  DescribeServiceJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceJobRequest,
  output: DescribeServiceJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Provides a list of the first 100 `RUNNABLE` jobs associated to a single job queue.
 */
export const getJobQueueSnapshot: (
  input: GetJobQueueSnapshotRequest,
) => Effect.Effect<
  GetJobQueueSnapshotResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobQueueSnapshotRequest,
  output: GetJobQueueSnapshotResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Returns a list of Batch consumable resources.
 */
export const listConsumableResources: {
  (
    input: ListConsumableResourcesRequest,
  ): Effect.Effect<
    ListConsumableResourcesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConsumableResourcesRequest,
  ) => Stream.Stream<
    ListConsumableResourcesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConsumableResourcesRequest,
  ) => Stream.Stream<
    ConsumableResourceSummary,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listJobs: {
  (
    input: ListJobsRequest,
  ): Effect.Effect<
    ListJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    ListJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => Stream.Stream<
    JobSummary,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const submitServiceJob: (
  input: SubmitServiceJobRequest,
) => Effect.Effect<
  SubmitServiceJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createComputeEnvironment: (
  input: CreateComputeEnvironmentRequest,
) => Effect.Effect<
  CreateComputeEnvironmentResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComputeEnvironmentRequest,
  output: CreateComputeEnvironmentResponse,
  errors: [ClientException, ServerException],
}));
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
export const submitJob: (
  input: SubmitJobRequest,
) => Effect.Effect<
  SubmitJobResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitJobRequest,
  output: SubmitJobResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Describes a list of Batch jobs.
 */
export const describeJobs: (
  input: DescribeJobsRequest,
) => Effect.Effect<
  DescribeJobsResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeJobsRequest,
  output: DescribeJobsResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Registers an Batch job definition.
 */
export const registerJobDefinition: (
  input: RegisterJobDefinitionRequest,
) => Effect.Effect<
  RegisterJobDefinitionResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterJobDefinitionRequest,
  output: RegisterJobDefinitionResponse,
  errors: [ClientException, ServerException],
}));
