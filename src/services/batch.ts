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
export type ClientRequestToken = string;
export type TagKey = string;
export type TagValue = string;
export type JobExecutionTimeoutMinutes = number;
export type ImageType = string;
export type ImageIdOverride = string;
export type KubernetesVersion = string;
export type Quantity = string;

//# Schemas
export type CEType = "MANAGED" | "UNMANAGED";
export const CEType = S.Literal("MANAGED", "UNMANAGED");
export type CEState = "ENABLED" | "DISABLED";
export const CEState = S.Literal("ENABLED", "DISABLED");
export type JQState = "ENABLED" | "DISABLED";
export const JQState = S.Literal("ENABLED", "DISABLED");
export type JobQueueType = "EKS" | "ECS" | "ECS_FARGATE" | "SAGEMAKER_TRAINING";
export const JobQueueType = S.Literal(
  "EKS",
  "ECS",
  "ECS_FARGATE",
  "SAGEMAKER_TRAINING",
);
export type ServiceEnvironmentType = "SAGEMAKER_TRAINING";
export const ServiceEnvironmentType = S.Literal("SAGEMAKER_TRAINING");
export type ServiceEnvironmentState = "ENABLED" | "DISABLED";
export const ServiceEnvironmentState = S.Literal("ENABLED", "DISABLED");
export type StringList = string[];
export const StringList = S.Array(S.String);
export type JobStatus =
  | "SUBMITTED"
  | "PENDING"
  | "RUNNABLE"
  | "STARTING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED";
export const JobStatus = S.Literal(
  "SUBMITTED",
  "PENDING",
  "RUNNABLE",
  "STARTING",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
);
export interface KeyValuesPair {
  name?: string;
  values?: string[];
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
export type ServiceJobStatus =
  | "SUBMITTED"
  | "PENDING"
  | "RUNNABLE"
  | "SCHEDULED"
  | "STARTING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED";
export const ServiceJobStatus = S.Literal(
  "SUBMITTED",
  "PENDING",
  "RUNNABLE",
  "SCHEDULED",
  "STARTING",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
);
export type JobDefinitionType = "container" | "multinode";
export const JobDefinitionType = S.Literal("container", "multinode");
export type PlatformCapability = "EC2" | "FARGATE";
export const PlatformCapability = S.Literal("EC2", "FARGATE");
export type PlatformCapabilityList = PlatformCapability[];
export const PlatformCapabilityList = S.Array(PlatformCapability);
export type ServiceJobType = "SAGEMAKER_TRAINING";
export const ServiceJobType = S.Literal("SAGEMAKER_TRAINING");
export type TagKeysList = string[];
export const TagKeysList = S.Array(S.String);
export interface CancelJobRequest {
  jobId?: string;
  reason?: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String), reason: S.optional(S.String) }).pipe(
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
  consumableResourceName?: string;
  totalQuantity?: number;
  resourceType?: string;
  tags?: { [key: string]: string };
}
export const CreateConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.optional(S.String),
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
  computeEnvironment?: string;
}
export const DeleteComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({ computeEnvironment: S.optional(S.String) }).pipe(
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
  consumableResource?: string;
}
export const DeleteConsumableResourceRequest = S.suspend(() =>
  S.Struct({ consumableResource: S.optional(S.String) }).pipe(
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
  jobQueue?: string;
}
export const DeleteJobQueueRequest = S.suspend(() =>
  S.Struct({ jobQueue: S.optional(S.String) }).pipe(
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
  arn?: string;
}
export const DeleteSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }).pipe(
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
  serviceEnvironment?: string;
}
export const DeleteServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({ serviceEnvironment: S.optional(S.String) }).pipe(
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
  jobDefinition?: string;
}
export const DeregisterJobDefinitionRequest = S.suspend(() =>
  S.Struct({ jobDefinition: S.optional(S.String) }).pipe(
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
  computeEnvironments?: string[];
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
  consumableResource?: string;
}
export const DescribeConsumableResourceRequest = S.suspend(() =>
  S.Struct({ consumableResource: S.optional(S.String) }).pipe(
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
  jobDefinitions?: string[];
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
  jobQueues?: string[];
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
  jobs?: string[];
}
export const DescribeJobsRequest = S.suspend(() =>
  S.Struct({ jobs: S.optional(StringList) }).pipe(
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
  arns?: string[];
}
export const DescribeSchedulingPoliciesRequest = S.suspend(() =>
  S.Struct({ arns: S.optional(StringList) }).pipe(
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
  serviceEnvironments?: string[];
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
  jobId?: string;
}
export const DescribeServiceJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String) }).pipe(
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
  jobQueue?: string;
}
export const GetJobQueueSnapshotRequest = S.suspend(() =>
  S.Struct({ jobQueue: S.optional(S.String) }).pipe(
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
  jobStatus?: JobStatus;
  maxResults?: number;
  nextToken?: string;
  filters?: KeyValuesPair[];
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.optional(S.String),
    arrayJobId: S.optional(S.String),
    multiNodeJobId: S.optional(S.String),
    jobStatus: S.optional(JobStatus),
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
  consumableResource?: string;
  filters?: KeyValuesPair[];
  maxResults?: number;
  nextToken?: string;
}
export const ListJobsByConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResource: S.optional(S.String),
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
  jobStatus?: ServiceJobStatus;
  maxResults?: number;
  nextToken?: string;
  filters?: KeyValuesPair[];
}
export const ListServiceJobsRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.optional(S.String),
    jobStatus: S.optional(ServiceJobStatus),
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
  tags?: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: S.optional(TagrisTagsMap),
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
  jobId?: string;
  reason?: string;
}
export const TerminateJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String), reason: S.optional(S.String) }).pipe(
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
  jobId?: string;
  reason?: string;
}
export const TerminateServiceJobRequest = S.suspend(() =>
  S.Struct({ jobId: S.optional(S.String), reason: S.optional(S.String) }).pipe(
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
  tagKeys?: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: S.optional(TagKeysList).pipe(T.HttpQuery("tagKeys")),
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
  consumableResource?: string;
  operation?: string;
  quantity?: number;
  clientToken?: string;
}
export const UpdateConsumableResourceRequest = S.suspend(() =>
  S.Struct({
    consumableResource: S.optional(S.String),
    operation: S.optional(S.String),
    quantity: S.optional(S.Number),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
  order?: number;
  computeEnvironment?: string;
}
export const ComputeEnvironmentOrder = S.suspend(() =>
  S.Struct({
    order: S.optional(S.Number),
    computeEnvironment: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeEnvironmentOrder",
}) as any as S.Schema<ComputeEnvironmentOrder>;
export type ComputeEnvironmentOrders = ComputeEnvironmentOrder[];
export const ComputeEnvironmentOrders = S.Array(ComputeEnvironmentOrder);
export interface ServiceEnvironmentOrder {
  order?: number;
  serviceEnvironment?: string;
}
export const ServiceEnvironmentOrder = S.suspend(() =>
  S.Struct({
    order: S.optional(S.Number),
    serviceEnvironment: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceEnvironmentOrder",
}) as any as S.Schema<ServiceEnvironmentOrder>;
export type ServiceEnvironmentOrders = ServiceEnvironmentOrder[];
export const ServiceEnvironmentOrders = S.Array(ServiceEnvironmentOrder);
export type JobStateTimeLimitActionsState = "RUNNABLE";
export const JobStateTimeLimitActionsState = S.Literal("RUNNABLE");
export type JobStateTimeLimitActionsAction = "CANCEL" | "TERMINATE";
export const JobStateTimeLimitActionsAction = S.Literal("CANCEL", "TERMINATE");
export interface JobStateTimeLimitAction {
  reason?: string;
  state?: JobStateTimeLimitActionsState;
  maxTimeSeconds?: number;
  action?: JobStateTimeLimitActionsAction;
}
export const JobStateTimeLimitAction = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    state: S.optional(JobStateTimeLimitActionsState),
    maxTimeSeconds: S.optional(S.Number),
    action: S.optional(JobStateTimeLimitActionsAction),
  }),
).annotations({
  identifier: "JobStateTimeLimitAction",
}) as any as S.Schema<JobStateTimeLimitAction>;
export type JobStateTimeLimitActions = JobStateTimeLimitAction[];
export const JobStateTimeLimitActions = S.Array(JobStateTimeLimitAction);
export interface UpdateJobQueueRequest {
  jobQueue?: string;
  state?: JQState;
  schedulingPolicyArn?: string;
  priority?: number;
  computeEnvironmentOrder?: ComputeEnvironmentOrder[];
  serviceEnvironmentOrder?: ServiceEnvironmentOrder[];
  jobStateTimeLimitActions?: JobStateTimeLimitAction[];
}
export const UpdateJobQueueRequest = S.suspend(() =>
  S.Struct({
    jobQueue: S.optional(S.String),
    state: S.optional(JQState),
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
  shareIdentifier?: string;
  weightFactor?: number;
}
export const ShareAttributes = S.suspend(() =>
  S.Struct({
    shareIdentifier: S.optional(S.String),
    weightFactor: S.optional(S.Number),
  }),
).annotations({
  identifier: "ShareAttributes",
}) as any as S.Schema<ShareAttributes>;
export type ShareAttributesList = ShareAttributes[];
export const ShareAttributesList = S.Array(ShareAttributes);
export interface FairsharePolicy {
  shareDecaySeconds?: number;
  computeReservation?: number;
  shareDistribution?: ShareAttributes[];
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
  arn?: string;
  fairsharePolicy?: FairsharePolicy;
}
export const UpdateSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
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
  serviceEnvironment?: string;
  state?: ServiceEnvironmentState;
  capacityLimits?: CapacityLimit[];
}
export const UpdateServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({
    serviceEnvironment: S.optional(S.String),
    state: S.optional(ServiceEnvironmentState),
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
export type CRType = "EC2" | "SPOT" | "FARGATE" | "FARGATE_SPOT";
export const CRType = S.Literal("EC2", "SPOT", "FARGATE", "FARGATE_SPOT");
export type CRAllocationStrategy =
  | "BEST_FIT"
  | "BEST_FIT_PROGRESSIVE"
  | "SPOT_CAPACITY_OPTIMIZED"
  | "SPOT_PRICE_CAPACITY_OPTIMIZED";
export const CRAllocationStrategy = S.Literal(
  "BEST_FIT",
  "BEST_FIT_PROGRESSIVE",
  "SPOT_CAPACITY_OPTIMIZED",
  "SPOT_PRICE_CAPACITY_OPTIMIZED",
);
export type ArrayJobDependency = "N_TO_N" | "SEQUENTIAL";
export const ArrayJobDependency = S.Literal("N_TO_N", "SEQUENTIAL");
export type CRUpdateAllocationStrategy =
  | "BEST_FIT_PROGRESSIVE"
  | "SPOT_CAPACITY_OPTIMIZED"
  | "SPOT_PRICE_CAPACITY_OPTIMIZED";
export const CRUpdateAllocationStrategy = S.Literal(
  "BEST_FIT_PROGRESSIVE",
  "SPOT_CAPACITY_OPTIMIZED",
  "SPOT_PRICE_CAPACITY_OPTIMIZED",
);
export interface EksConfiguration {
  eksClusterArn?: string;
  kubernetesNamespace?: string;
}
export const EksConfiguration = S.suspend(() =>
  S.Struct({
    eksClusterArn: S.optional(S.String),
    kubernetesNamespace: S.optional(S.String),
  }),
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
  type?: ArrayJobDependency;
}
export const JobDependency = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    type: S.optional(ArrayJobDependency),
  }),
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
export type ResourceType = "GPU" | "VCPU" | "MEMORY";
export const ResourceType = S.Literal("GPU", "VCPU", "MEMORY");
export interface ResourceRequirement {
  value?: string;
  type?: ResourceType;
}
export const ResourceRequirement = S.suspend(() =>
  S.Struct({ value: S.optional(S.String), type: S.optional(ResourceType) }),
).annotations({
  identifier: "ResourceRequirement",
}) as any as S.Schema<ResourceRequirement>;
export type ResourceRequirements = ResourceRequirement[];
export const ResourceRequirements = S.Array(ResourceRequirement);
export interface ContainerOverrides {
  vcpus?: number;
  memory?: number;
  command?: string[];
  instanceType?: string;
  environment?: KeyValuePair[];
  resourceRequirements?: ResourceRequirement[];
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
export type UserdataType = "EKS_BOOTSTRAP_SH" | "EKS_NODEADM";
export const UserdataType = S.Literal("EKS_BOOTSTRAP_SH", "EKS_NODEADM");
export interface LaunchTemplateSpecificationOverride {
  launchTemplateId?: string;
  launchTemplateName?: string;
  version?: string;
  targetInstanceTypes?: string[];
  userdataType?: UserdataType;
}
export const LaunchTemplateSpecificationOverride = S.suspend(() =>
  S.Struct({
    launchTemplateId: S.optional(S.String),
    launchTemplateName: S.optional(S.String),
    version: S.optional(S.String),
    targetInstanceTypes: S.optional(StringList),
    userdataType: S.optional(UserdataType),
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
  overrides?: LaunchTemplateSpecificationOverride[];
  userdataType?: UserdataType;
}
export const LaunchTemplateSpecification = S.suspend(() =>
  S.Struct({
    launchTemplateId: S.optional(S.String),
    launchTemplateName: S.optional(S.String),
    version: S.optional(S.String),
    overrides: S.optional(LaunchTemplateSpecificationOverrideList),
    userdataType: S.optional(UserdataType),
  }),
).annotations({
  identifier: "LaunchTemplateSpecification",
}) as any as S.Schema<LaunchTemplateSpecification>;
export interface Ec2Configuration {
  imageType?: string;
  imageIdOverride?: string;
  imageKubernetesVersion?: string;
}
export const Ec2Configuration = S.suspend(() =>
  S.Struct({
    imageType: S.optional(S.String),
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
  subnets?: string[];
  securityGroupIds?: string[];
  allocationStrategy?: CRUpdateAllocationStrategy;
  instanceTypes?: string[];
  ec2KeyPair?: string;
  instanceRole?: string;
  tags?: { [key: string]: string };
  placementGroup?: string;
  bidPercentage?: number;
  launchTemplate?: LaunchTemplateSpecification;
  ec2Configuration?: Ec2Configuration[];
  updateToLatestImageVersion?: boolean;
  type?: CRType;
  imageId?: string;
}
export const ComputeResourceUpdate = S.suspend(() =>
  S.Struct({
    minvCpus: S.optional(S.Number),
    maxvCpus: S.optional(S.Number),
    desiredvCpus: S.optional(S.Number),
    subnets: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
    allocationStrategy: S.optional(CRUpdateAllocationStrategy),
    instanceTypes: S.optional(StringList),
    ec2KeyPair: S.optional(S.String),
    instanceRole: S.optional(S.String),
    tags: S.optional(TagsMap),
    placementGroup: S.optional(S.String),
    bidPercentage: S.optional(S.Number),
    launchTemplate: S.optional(LaunchTemplateSpecification),
    ec2Configuration: S.optional(Ec2ConfigurationList),
    updateToLatestImageVersion: S.optional(S.Boolean),
    type: S.optional(CRType),
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
export type LogDriver =
  | "json-file"
  | "syslog"
  | "journald"
  | "gelf"
  | "fluentd"
  | "awslogs"
  | "splunk"
  | "awsfirelens";
export const LogDriver = S.Literal(
  "json-file",
  "syslog",
  "journald",
  "gelf",
  "fluentd",
  "awslogs",
  "splunk",
  "awsfirelens",
);
export type AssignPublicIp = "ENABLED" | "DISABLED";
export const AssignPublicIp = S.Literal("ENABLED", "DISABLED");
export type RetryAction = "RETRY" | "EXIT";
export const RetryAction = S.Literal("RETRY", "EXIT");
export type ServiceJobRetryAction = "RETRY" | "EXIT";
export const ServiceJobRetryAction = S.Literal("RETRY", "EXIT");
export interface CreateConsumableResourceResponse {
  consumableResourceName: string;
  consumableResourceArn: string;
}
export const CreateConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.optional(S.String),
    consumableResourceArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateConsumableResourceResponse",
}) as any as S.Schema<CreateConsumableResourceResponse>;
export interface CreateJobQueueRequest {
  jobQueueName?: string;
  state?: JQState;
  schedulingPolicyArn?: string;
  priority?: number;
  computeEnvironmentOrder?: ComputeEnvironmentOrder[];
  serviceEnvironmentOrder?: ServiceEnvironmentOrder[];
  jobQueueType?: JobQueueType;
  tags?: { [key: string]: string };
  jobStateTimeLimitActions?: JobStateTimeLimitAction[];
}
export const CreateJobQueueRequest = S.suspend(() =>
  S.Struct({
    jobQueueName: S.optional(S.String),
    state: S.optional(JQState),
    schedulingPolicyArn: S.optional(S.String),
    priority: S.optional(S.Number),
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobQueueType: S.optional(JobQueueType),
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
  serviceEnvironmentName?: string;
  serviceEnvironmentType?: ServiceEnvironmentType;
  state?: ServiceEnvironmentState;
  capacityLimits?: CapacityLimit[];
  tags?: { [key: string]: string };
}
export const CreateServiceEnvironmentRequest = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.optional(S.String),
    serviceEnvironmentType: S.optional(ServiceEnvironmentType),
    state: S.optional(ServiceEnvironmentState),
    capacityLimits: S.optional(CapacityLimits),
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
  tags?: { [key: string]: string };
}
export const DescribeConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    consumableResourceName: S.optional(S.String),
    consumableResourceArn: S.optional(S.String),
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
  filters?: KeyValuesPair[];
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
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagrisTagsMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateComputeEnvironmentRequest {
  computeEnvironment?: string;
  state?: CEState;
  unmanagedvCpus?: number;
  computeResources?: ComputeResourceUpdate;
  serviceRole?: string;
  updatePolicy?: UpdatePolicy;
  context?: string;
}
export const UpdateComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({
    computeEnvironment: S.optional(S.String),
    state: S.optional(CEState),
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
    consumableResourceName: S.optional(S.String),
    consumableResourceArn: S.optional(S.String),
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
    serviceEnvironmentName: S.optional(S.String),
    serviceEnvironmentArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateServiceEnvironmentResponse",
}) as any as S.Schema<UpdateServiceEnvironmentResponse>;
export type CEStatus =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "DELETED"
  | "VALID"
  | "INVALID";
export const CEStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "DELETED",
  "VALID",
  "INVALID",
);
export type OrchestrationType = "ECS" | "EKS";
export const OrchestrationType = S.Literal("ECS", "EKS");
export type JQStatus =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "DELETED"
  | "VALID"
  | "INVALID";
export const JQStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "DELETED",
  "VALID",
  "INVALID",
);
export type ServiceEnvironmentStatus =
  | "CREATING"
  | "UPDATING"
  | "DELETING"
  | "DELETED"
  | "VALID"
  | "INVALID";
export const ServiceEnvironmentStatus = S.Literal(
  "CREATING",
  "UPDATING",
  "DELETING",
  "DELETED",
  "VALID",
  "INVALID",
);
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
  hardLimit?: number;
  name?: string;
  softLimit?: number;
}
export const Ulimit = S.suspend(() =>
  S.Struct({
    hardLimit: S.optional(S.Number),
    name: S.optional(S.String),
    softLimit: S.optional(S.Number),
  }),
).annotations({ identifier: "Ulimit" }) as any as S.Schema<Ulimit>;
export type Ulimits = Ulimit[];
export const Ulimits = S.Array(Ulimit);
export interface Secret {
  name?: string;
  valueFrom?: string;
}
export const Secret = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), valueFrom: S.optional(S.String) }),
).annotations({ identifier: "Secret" }) as any as S.Schema<Secret>;
export type SecretList = Secret[];
export const SecretList = S.Array(Secret);
export interface NetworkConfiguration {
  assignPublicIp?: AssignPublicIp;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ assignPublicIp: S.optional(AssignPublicIp) }),
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
  sizeInGiB?: number;
}
export const EphemeralStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.optional(S.Number) }),
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
  credentialsParameter?: string;
}
export const RepositoryCredentials = S.suspend(() =>
  S.Struct({ credentialsParameter: S.optional(S.String) }),
).annotations({
  identifier: "RepositoryCredentials",
}) as any as S.Schema<RepositoryCredentials>;
export interface Host {
  sourcePath?: string;
}
export const Host = S.suspend(() =>
  S.Struct({ sourcePath: S.optional(S.String) }),
).annotations({ identifier: "Host" }) as any as S.Schema<Host>;
export type EFSTransitEncryption = "ENABLED" | "DISABLED";
export const EFSTransitEncryption = S.Literal("ENABLED", "DISABLED");
export type EFSAuthorizationConfigIAM = "ENABLED" | "DISABLED";
export const EFSAuthorizationConfigIAM = S.Literal("ENABLED", "DISABLED");
export interface EFSAuthorizationConfig {
  accessPointId?: string;
  iam?: EFSAuthorizationConfigIAM;
}
export const EFSAuthorizationConfig = S.suspend(() =>
  S.Struct({
    accessPointId: S.optional(S.String),
    iam: S.optional(EFSAuthorizationConfigIAM),
  }),
).annotations({
  identifier: "EFSAuthorizationConfig",
}) as any as S.Schema<EFSAuthorizationConfig>;
export interface EFSVolumeConfiguration {
  fileSystemId?: string;
  rootDirectory?: string;
  transitEncryption?: EFSTransitEncryption;
  transitEncryptionPort?: number;
  authorizationConfig?: EFSAuthorizationConfig;
}
export const EFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.optional(S.String),
    rootDirectory: S.optional(S.String),
    transitEncryption: S.optional(EFSTransitEncryption),
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
export type DeviceCgroupPermission = "READ" | "WRITE" | "MKNOD";
export const DeviceCgroupPermission = S.Literal("READ", "WRITE", "MKNOD");
export type DeviceCgroupPermissions = DeviceCgroupPermission[];
export const DeviceCgroupPermissions = S.Array(DeviceCgroupPermission);
export interface Device {
  hostPath?: string;
  containerPath?: string;
  permissions?: DeviceCgroupPermission[];
}
export const Device = S.suspend(() =>
  S.Struct({
    hostPath: S.optional(S.String),
    containerPath: S.optional(S.String),
    permissions: S.optional(DeviceCgroupPermissions),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type DevicesList = Device[];
export const DevicesList = S.Array(Device);
export interface Tmpfs {
  containerPath?: string;
  size?: number;
  mountOptions?: string[];
}
export const Tmpfs = S.suspend(() =>
  S.Struct({
    containerPath: S.optional(S.String),
    size: S.optional(S.Number),
    mountOptions: S.optional(StringList),
  }),
).annotations({ identifier: "Tmpfs" }) as any as S.Schema<Tmpfs>;
export type TmpfsList = Tmpfs[];
export const TmpfsList = S.Array(Tmpfs);
export interface LinuxParameters {
  devices?: Device[];
  initProcessEnabled?: boolean;
  sharedMemorySize?: number;
  tmpfs?: Tmpfs[];
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
  logDriver?: LogDriver;
  options?: { [key: string]: string };
  secretOptions?: Secret[];
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({
    logDriver: S.optional(LogDriver),
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
  command?: string[];
  jobRoleArn?: string;
  executionRoleArn?: string;
  volumes?: Volume[];
  environment?: KeyValuePair[];
  mountPoints?: MountPoint[];
  readonlyRootFilesystem?: boolean;
  privileged?: boolean;
  ulimits?: Ulimit[];
  user?: string;
  instanceType?: string;
  resourceRequirements?: ResourceRequirement[];
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  secrets?: Secret[];
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
export type FirelensConfigurationType = "fluentd" | "fluentbit";
export const FirelensConfigurationType = S.Literal("fluentd", "fluentbit");
export type FirelensConfigurationOptionsMap = { [key: string]: string };
export const FirelensConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface FirelensConfiguration {
  type?: FirelensConfigurationType;
  options?: { [key: string]: string };
}
export const FirelensConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(FirelensConfigurationType),
    options: S.optional(FirelensConfigurationOptionsMap),
  }),
).annotations({
  identifier: "FirelensConfiguration",
}) as any as S.Schema<FirelensConfiguration>;
export interface TaskContainerProperties {
  command?: string[];
  dependsOn?: TaskContainerDependency[];
  environment?: KeyValuePair[];
  essential?: boolean;
  firelensConfiguration?: FirelensConfiguration;
  image?: string;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  mountPoints?: MountPoint[];
  name?: string;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  repositoryCredentials?: RepositoryCredentials;
  resourceRequirements?: ResourceRequirement[];
  secrets?: Secret[];
  ulimits?: Ulimit[];
  user?: string;
}
export const TaskContainerProperties = S.suspend(() =>
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
  }),
).annotations({
  identifier: "TaskContainerProperties",
}) as any as S.Schema<TaskContainerProperties>;
export type ListTaskContainerProperties = TaskContainerProperties[];
export const ListTaskContainerProperties = S.Array(TaskContainerProperties);
export interface EcsTaskProperties {
  containers?: TaskContainerProperties[];
  ephemeralStorage?: EphemeralStorage;
  executionRoleArn?: string;
  platformVersion?: string;
  ipcMode?: string;
  taskRoleArn?: string;
  pidMode?: string;
  networkConfiguration?: NetworkConfiguration;
  runtimePlatform?: RuntimePlatform;
  volumes?: Volume[];
  enableExecuteCommand?: boolean;
}
export const EcsTaskProperties = S.suspend(() =>
  S.Struct({
    containers: S.optional(ListTaskContainerProperties),
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
  taskProperties?: EcsTaskProperties[];
}
export const EcsProperties = S.suspend(() =>
  S.Struct({ taskProperties: S.optional(ListEcsTaskProperties) }),
).annotations({
  identifier: "EcsProperties",
}) as any as S.Schema<EcsProperties>;
export interface ImagePullSecret {
  name?: string;
}
export const ImagePullSecret = S.suspend(() =>
  S.Struct({ name: S.optional(S.String) }),
).annotations({
  identifier: "ImagePullSecret",
}) as any as S.Schema<ImagePullSecret>;
export type ImagePullSecrets = ImagePullSecret[];
export const ImagePullSecrets = S.Array(ImagePullSecret);
export interface EksContainerEnvironmentVariable {
  name?: string;
  value?: string;
}
export const EksContainerEnvironmentVariable = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
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
  limits?: { [key: string]: string };
  requests?: { [key: string]: string };
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
  image?: string;
  imagePullPolicy?: string;
  command?: string[];
  args?: string[];
  env?: EksContainerEnvironmentVariable[];
  resources?: EksContainerResourceRequirements;
  volumeMounts?: EksContainerVolumeMount[];
  securityContext?: EksContainerSecurityContext;
}
export const EksContainer = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    image: S.optional(S.String),
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
  secretName?: string;
  optional?: boolean;
}
export const EksSecret = S.suspend(() =>
  S.Struct({
    secretName: S.optional(S.String),
    optional: S.optional(S.Boolean),
  }),
).annotations({ identifier: "EksSecret" }) as any as S.Schema<EksSecret>;
export interface EksPersistentVolumeClaim {
  claimName?: string;
  readOnly?: boolean;
}
export const EksPersistentVolumeClaim = S.suspend(() =>
  S.Struct({
    claimName: S.optional(S.String),
    readOnly: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EksPersistentVolumeClaim",
}) as any as S.Schema<EksPersistentVolumeClaim>;
export interface EksVolume {
  name?: string;
  hostPath?: EksHostPath;
  emptyDir?: EksEmptyDir;
  secret?: EksSecret;
  persistentVolumeClaim?: EksPersistentVolumeClaim;
}
export const EksVolume = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
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
  imagePullSecrets?: ImagePullSecret[];
  containers?: EksContainer[];
  initContainers?: EksContainer[];
  volumes?: EksVolume[];
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
  consumableResourceList?: ConsumableResourceRequirement[];
}
export const ConsumableResourceProperties = S.suspend(() =>
  S.Struct({ consumableResourceList: S.optional(ConsumableResourceList) }),
).annotations({
  identifier: "ConsumableResourceProperties",
}) as any as S.Schema<ConsumableResourceProperties>;
export interface NodeRangeProperty {
  targetNodes?: string;
  container?: ContainerProperties;
  instanceTypes?: string[];
  ecsProperties?: EcsProperties;
  eksProperties?: EksProperties;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const NodeRangeProperty = S.suspend(() =>
  S.Struct({
    targetNodes: S.optional(S.String),
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
  action?: RetryAction;
}
export const EvaluateOnExit = S.suspend(() =>
  S.Struct({
    onStatusReason: S.optional(S.String),
    onReason: S.optional(S.String),
    onExitCode: S.optional(S.String),
    action: S.optional(RetryAction),
  }),
).annotations({
  identifier: "EvaluateOnExit",
}) as any as S.Schema<EvaluateOnExit>;
export type EvaluateOnExitList = EvaluateOnExit[];
export const EvaluateOnExitList = S.Array(EvaluateOnExit);
export interface TaskContainerOverrides {
  command?: string[];
  environment?: KeyValuePair[];
  name?: string;
  resourceRequirements?: ResourceRequirement[];
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
  containers?: TaskContainerOverrides[];
}
export const TaskPropertiesOverride = S.suspend(() =>
  S.Struct({ containers: S.optional(ListTaskContainerOverrides) }),
).annotations({
  identifier: "TaskPropertiesOverride",
}) as any as S.Schema<TaskPropertiesOverride>;
export type ListTaskPropertiesOverride = TaskPropertiesOverride[];
export const ListTaskPropertiesOverride = S.Array(TaskPropertiesOverride);
export interface EcsPropertiesOverride {
  taskProperties?: TaskPropertiesOverride[];
}
export const EcsPropertiesOverride = S.suspend(() =>
  S.Struct({ taskProperties: S.optional(ListTaskPropertiesOverride) }),
).annotations({
  identifier: "EcsPropertiesOverride",
}) as any as S.Schema<EcsPropertiesOverride>;
export interface EksContainerOverride {
  name?: string;
  image?: string;
  command?: string[];
  args?: string[];
  env?: EksContainerEnvironmentVariable[];
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
  containers?: EksContainerOverride[];
  initContainers?: EksContainerOverride[];
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
  targetNodes?: string;
  containerOverrides?: ContainerOverrides;
  ecsPropertiesOverride?: EcsPropertiesOverride;
  instanceTypes?: string[];
  eksPropertiesOverride?: EksPropertiesOverride;
  consumableResourcePropertiesOverride?: ConsumableResourceProperties;
}
export const NodePropertyOverride = S.suspend(() =>
  S.Struct({
    targetNodes: S.optional(S.String),
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
  action?: ServiceJobRetryAction;
  onStatusReason?: string;
}
export const ServiceJobEvaluateOnExit = S.suspend(() =>
  S.Struct({
    action: S.optional(ServiceJobRetryAction),
    onStatusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceJobEvaluateOnExit",
}) as any as S.Schema<ServiceJobEvaluateOnExit>;
export type ServiceJobEvaluateOnExitList = ServiceJobEvaluateOnExit[];
export const ServiceJobEvaluateOnExitList = S.Array(ServiceJobEvaluateOnExit);
export interface ComputeResource {
  type?: CRType;
  allocationStrategy?: CRAllocationStrategy;
  minvCpus?: number;
  maxvCpus?: number;
  desiredvCpus?: number;
  instanceTypes?: string[];
  imageId?: string;
  subnets?: string[];
  securityGroupIds?: string[];
  ec2KeyPair?: string;
  instanceRole?: string;
  tags?: { [key: string]: string };
  placementGroup?: string;
  bidPercentage?: number;
  spotIamFleetRole?: string;
  launchTemplate?: LaunchTemplateSpecification;
  ec2Configuration?: Ec2Configuration[];
}
export const ComputeResource = S.suspend(() =>
  S.Struct({
    type: S.optional(CRType),
    allocationStrategy: S.optional(CRAllocationStrategy),
    minvCpus: S.optional(S.Number),
    maxvCpus: S.optional(S.Number),
    desiredvCpus: S.optional(S.Number),
    instanceTypes: S.optional(StringList),
    imageId: S.optional(S.String),
    subnets: S.optional(StringList),
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
  computeEnvironmentName?: string;
  computeEnvironmentArn?: string;
  unmanagedvCpus?: number;
  ecsClusterArn?: string;
  tags?: { [key: string]: string };
  type?: CEType;
  state?: CEState;
  status?: CEStatus;
  statusReason?: string;
  computeResources?: ComputeResource;
  serviceRole?: string;
  updatePolicy?: UpdatePolicy;
  eksConfiguration?: EksConfiguration;
  containerOrchestrationType?: OrchestrationType;
  uuid?: string;
  context?: string;
}
export const ComputeEnvironmentDetail = S.suspend(() =>
  S.Struct({
    computeEnvironmentName: S.optional(S.String),
    computeEnvironmentArn: S.optional(S.String),
    unmanagedvCpus: S.optional(S.Number),
    ecsClusterArn: S.optional(S.String),
    tags: S.optional(TagrisTagsMap),
    type: S.optional(CEType),
    state: S.optional(CEState),
    status: S.optional(CEStatus),
    statusReason: S.optional(S.String),
    computeResources: S.optional(ComputeResource),
    serviceRole: S.optional(S.String),
    updatePolicy: S.optional(UpdatePolicy),
    eksConfiguration: S.optional(EksConfiguration),
    containerOrchestrationType: S.optional(OrchestrationType),
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
  evaluateOnExit?: EvaluateOnExit[];
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
  numNodes?: number;
  mainNode?: number;
  nodeRangeProperties?: NodeRangeProperty[];
}
export const NodeProperties = S.suspend(() =>
  S.Struct({
    numNodes: S.optional(S.Number),
    mainNode: S.optional(S.Number),
    nodeRangeProperties: S.optional(NodeRangeProperties),
  }),
).annotations({
  identifier: "NodeProperties",
}) as any as S.Schema<NodeProperties>;
export interface JobDefinition {
  jobDefinitionName?: string;
  jobDefinitionArn?: string;
  revision?: number;
  status?: string;
  type?: string;
  schedulingPriority?: number;
  parameters?: { [key: string]: string };
  retryStrategy?: RetryStrategy;
  containerProperties?: ContainerProperties;
  timeout?: JobTimeout;
  nodeProperties?: NodeProperties;
  tags?: { [key: string]: string };
  propagateTags?: boolean;
  platformCapabilities?: PlatformCapability[];
  ecsProperties?: EcsProperties;
  eksProperties?: EksProperties;
  containerOrchestrationType?: OrchestrationType;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const JobDefinition = S.suspend(() =>
  S.Struct({
    jobDefinitionName: S.optional(S.String),
    jobDefinitionArn: S.optional(S.String),
    revision: S.optional(S.Number),
    status: S.optional(S.String),
    type: S.optional(S.String),
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
    containerOrchestrationType: S.optional(OrchestrationType),
    consumableResourceProperties: S.optional(ConsumableResourceProperties),
  }),
).annotations({
  identifier: "JobDefinition",
}) as any as S.Schema<JobDefinition>;
export type JobDefinitionList = JobDefinition[];
export const JobDefinitionList = S.Array(JobDefinition);
export interface JobQueueDetail {
  jobQueueName?: string;
  jobQueueArn?: string;
  state?: JQState;
  schedulingPolicyArn?: string;
  status?: JQStatus;
  statusReason?: string;
  priority?: number;
  computeEnvironmentOrder?: ComputeEnvironmentOrder[];
  serviceEnvironmentOrder?: ServiceEnvironmentOrder[];
  jobQueueType?: JobQueueType;
  tags?: { [key: string]: string };
  jobStateTimeLimitActions?: JobStateTimeLimitAction[];
}
export const JobQueueDetail = S.suspend(() =>
  S.Struct({
    jobQueueName: S.optional(S.String),
    jobQueueArn: S.optional(S.String),
    state: S.optional(JQState),
    schedulingPolicyArn: S.optional(S.String),
    status: S.optional(JQStatus),
    statusReason: S.optional(S.String),
    priority: S.optional(S.Number),
    computeEnvironmentOrder: S.optional(ComputeEnvironmentOrders),
    serviceEnvironmentOrder: S.optional(ServiceEnvironmentOrders),
    jobQueueType: S.optional(JobQueueType),
    tags: S.optional(TagrisTagsMap),
    jobStateTimeLimitActions: S.optional(JobStateTimeLimitActions),
  }),
).annotations({
  identifier: "JobQueueDetail",
}) as any as S.Schema<JobQueueDetail>;
export type JobQueueDetailList = JobQueueDetail[];
export const JobQueueDetailList = S.Array(JobQueueDetail);
export interface SchedulingPolicyDetail {
  name?: string;
  arn?: string;
  fairsharePolicy?: FairsharePolicy;
  tags?: { [key: string]: string };
}
export const SchedulingPolicyDetail = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    fairsharePolicy: S.optional(FairsharePolicy),
    tags: S.optional(TagrisTagsMap),
  }),
).annotations({
  identifier: "SchedulingPolicyDetail",
}) as any as S.Schema<SchedulingPolicyDetail>;
export type SchedulingPolicyDetailList = SchedulingPolicyDetail[];
export const SchedulingPolicyDetailList = S.Array(SchedulingPolicyDetail);
export interface ServiceEnvironmentDetail {
  serviceEnvironmentName?: string;
  serviceEnvironmentArn?: string;
  serviceEnvironmentType?: ServiceEnvironmentType;
  state?: ServiceEnvironmentState;
  status?: ServiceEnvironmentStatus;
  capacityLimits?: CapacityLimit[];
  tags?: { [key: string]: string };
}
export const ServiceEnvironmentDetail = S.suspend(() =>
  S.Struct({
    serviceEnvironmentName: S.optional(S.String),
    serviceEnvironmentArn: S.optional(S.String),
    serviceEnvironmentType: S.optional(ServiceEnvironmentType),
    state: S.optional(ServiceEnvironmentState),
    status: S.optional(ServiceEnvironmentStatus),
    capacityLimits: S.optional(CapacityLimits),
    tags: S.optional(TagrisTagsMap),
  }),
).annotations({
  identifier: "ServiceEnvironmentDetail",
}) as any as S.Schema<ServiceEnvironmentDetail>;
export type ServiceEnvironmentDetailList = ServiceEnvironmentDetail[];
export const ServiceEnvironmentDetailList = S.Array(ServiceEnvironmentDetail);
export type ServiceResourceIdName = "TrainingJobArn";
export const ServiceResourceIdName = S.Literal("TrainingJobArn");
export interface ServiceResourceId {
  name?: ServiceResourceIdName;
  value?: string;
}
export const ServiceResourceId = S.suspend(() =>
  S.Struct({
    name: S.optional(ServiceResourceIdName),
    value: S.optional(S.String),
  }),
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
  jobArn?: string;
  jobQueueArn?: string;
  jobName?: string;
  jobDefinitionArn?: string;
  shareIdentifier?: string;
  jobStatus?: string;
  quantity?: number;
  statusReason?: string;
  startedAt?: number;
  createdAt?: number;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const ListJobsByConsumableResourceSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobQueueArn: S.optional(S.String),
    jobName: S.optional(S.String),
    jobDefinitionArn: S.optional(S.String),
    shareIdentifier: S.optional(S.String),
    jobStatus: S.optional(S.String),
    quantity: S.optional(S.Number),
    statusReason: S.optional(S.String),
    startedAt: S.optional(S.Number),
    createdAt: S.optional(S.Number),
    consumableResourceProperties: S.optional(ConsumableResourceProperties),
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
  arn?: string;
}
export const SchedulingPolicyListingDetail = S.suspend(() =>
  S.Struct({ arn: S.optional(S.String) }),
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
  jobId?: string;
  jobName?: string;
  serviceJobType?: ServiceJobType;
  shareIdentifier?: string;
  status?: ServiceJobStatus;
  statusReason?: string;
  startedAt?: number;
  stoppedAt?: number;
}
export const ServiceJobSummary = S.suspend(() =>
  S.Struct({
    latestAttempt: S.optional(LatestServiceJobAttempt),
    createdAt: S.optional(S.Number),
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    jobName: S.optional(S.String),
    serviceJobType: S.optional(ServiceJobType),
    shareIdentifier: S.optional(S.String),
    status: S.optional(ServiceJobStatus),
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
  nodePropertyOverrides?: NodePropertyOverride[];
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
  attempts?: number;
  evaluateOnExit?: ServiceJobEvaluateOnExit[];
}
export const ServiceJobRetryStrategy = S.suspend(() =>
  S.Struct({
    attempts: S.optional(S.Number),
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
  S.Struct({
    jobQueueName: S.optional(S.String),
    jobQueueArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateJobQueueResponse",
}) as any as S.Schema<CreateJobQueueResponse>;
export interface CreateSchedulingPolicyRequest {
  name?: string;
  fairsharePolicy?: FairsharePolicy;
  tags?: { [key: string]: string };
}
export const CreateSchedulingPolicyRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
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
    serviceEnvironmentName: S.optional(S.String),
    serviceEnvironmentArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateServiceEnvironmentResponse",
}) as any as S.Schema<CreateServiceEnvironmentResponse>;
export interface DescribeComputeEnvironmentsResponse {
  computeEnvironments?: (ComputeEnvironmentDetail & {
    computeEnvironmentName: string;
    computeEnvironmentArn: string;
    computeResources: ComputeResource & {
      type: CRType;
      maxvCpus: number;
      subnets: StringList;
      ec2Configuration: (Ec2Configuration & { imageType: ImageType })[];
    };
    eksConfiguration: EksConfiguration & {
      eksClusterArn: string;
      kubernetesNamespace: string;
    };
  })[];
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
  jobDefinitions?: (JobDefinition & {
    jobDefinitionName: string;
    jobDefinitionArn: string;
    revision: number;
    type: string;
    retryStrategy: RetryStrategy & {
      evaluateOnExit: (EvaluateOnExit & { action: RetryAction })[];
    };
    containerProperties: ContainerProperties & {
      volumes: (Volume & {
        efsVolumeConfiguration: EFSVolumeConfiguration & {
          fileSystemId: string;
        };
      })[];
      ulimits: (Ulimit & {
        hardLimit: number;
        name: string;
        softLimit: number;
      })[];
      resourceRequirements: (ResourceRequirement & {
        value: string;
        type: ResourceType;
      })[];
      linuxParameters: LinuxParameters & {
        devices: (Device & { hostPath: string })[];
        tmpfs: (Tmpfs & { containerPath: string; size: number })[];
      };
      logConfiguration: LogConfiguration & {
        logDriver: LogDriver;
        secretOptions: (Secret & { name: string; valueFrom: string })[];
      };
      secrets: (Secret & { name: string; valueFrom: string })[];
      ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
      repositoryCredentials: RepositoryCredentials & {
        credentialsParameter: string;
      };
    };
    nodeProperties: NodeProperties & {
      numNodes: number;
      mainNode: number;
      nodeRangeProperties: (NodeRangeProperty & {
        targetNodes: string;
        container: ContainerProperties & {
          volumes: (Volume & {
            efsVolumeConfiguration: EFSVolumeConfiguration & {
              fileSystemId: string;
            };
          })[];
          ulimits: (Ulimit & {
            hardLimit: number;
            name: string;
            softLimit: number;
          })[];
          resourceRequirements: (ResourceRequirement & {
            value: string;
            type: ResourceType;
          })[];
          linuxParameters: LinuxParameters & {
            devices: (Device & { hostPath: string })[];
            tmpfs: (Tmpfs & { containerPath: string; size: number })[];
          };
          logConfiguration: LogConfiguration & {
            logDriver: LogDriver;
            secretOptions: (Secret & { name: string; valueFrom: string })[];
          };
          secrets: (Secret & { name: string; valueFrom: string })[];
          ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
          repositoryCredentials: RepositoryCredentials & {
            credentialsParameter: string;
          };
        };
        ecsProperties: EcsProperties & {
          taskProperties: (EcsTaskProperties & {
            containers: (TaskContainerProperties & {
              image: string;
              firelensConfiguration: FirelensConfiguration & {
                type: FirelensConfigurationType;
              };
              linuxParameters: LinuxParameters & {
                devices: (Device & { hostPath: string })[];
                tmpfs: (Tmpfs & { containerPath: string; size: number })[];
              };
              logConfiguration: LogConfiguration & {
                logDriver: LogDriver;
                secretOptions: (Secret & { name: string; valueFrom: string })[];
              };
              repositoryCredentials: RepositoryCredentials & {
                credentialsParameter: string;
              };
              resourceRequirements: (ResourceRequirement & {
                value: string;
                type: ResourceType;
              })[];
              secrets: (Secret & { name: string; valueFrom: string })[];
              ulimits: (Ulimit & {
                hardLimit: number;
                name: string;
                softLimit: number;
              })[];
            })[];
            ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
            volumes: (Volume & {
              efsVolumeConfiguration: EFSVolumeConfiguration & {
                fileSystemId: string;
              };
            })[];
          })[];
        };
        eksProperties: EksProperties & {
          podProperties: EksPodProperties & {
            imagePullSecrets: (ImagePullSecret & { name: string })[];
            containers: (EksContainer & {
              image: string;
              env: (EksContainerEnvironmentVariable & { name: string })[];
            })[];
            initContainers: (EksContainer & {
              image: string;
              env: (EksContainerEnvironmentVariable & { name: string })[];
            })[];
            volumes: (EksVolume & {
              name: string;
              secret: EksSecret & { secretName: string };
              persistentVolumeClaim: EksPersistentVolumeClaim & {
                claimName: string;
              };
            })[];
          };
        };
      })[];
    };
    ecsProperties: EcsProperties & {
      taskProperties: (EcsTaskProperties & {
        containers: (TaskContainerProperties & {
          image: string;
          firelensConfiguration: FirelensConfiguration & {
            type: FirelensConfigurationType;
          };
          linuxParameters: LinuxParameters & {
            devices: (Device & { hostPath: string })[];
            tmpfs: (Tmpfs & { containerPath: string; size: number })[];
          };
          logConfiguration: LogConfiguration & {
            logDriver: LogDriver;
            secretOptions: (Secret & { name: string; valueFrom: string })[];
          };
          repositoryCredentials: RepositoryCredentials & {
            credentialsParameter: string;
          };
          resourceRequirements: (ResourceRequirement & {
            value: string;
            type: ResourceType;
          })[];
          secrets: (Secret & { name: string; valueFrom: string })[];
          ulimits: (Ulimit & {
            hardLimit: number;
            name: string;
            softLimit: number;
          })[];
        })[];
        ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
        volumes: (Volume & {
          efsVolumeConfiguration: EFSVolumeConfiguration & {
            fileSystemId: string;
          };
        })[];
      })[];
    };
    eksProperties: EksProperties & {
      podProperties: EksPodProperties & {
        imagePullSecrets: (ImagePullSecret & { name: string })[];
        containers: (EksContainer & {
          image: string;
          env: (EksContainerEnvironmentVariable & { name: string })[];
        })[];
        initContainers: (EksContainer & {
          image: string;
          env: (EksContainerEnvironmentVariable & { name: string })[];
        })[];
        volumes: (EksVolume & {
          name: string;
          secret: EksSecret & { secretName: string };
          persistentVolumeClaim: EksPersistentVolumeClaim & {
            claimName: string;
          };
        })[];
      };
    };
  })[];
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
  jobQueues?: (JobQueueDetail & {
    jobQueueName: string;
    jobQueueArn: string;
    state: JQState;
    priority: number;
    computeEnvironmentOrder: (ComputeEnvironmentOrder & {
      order: number;
      computeEnvironment: string;
    })[];
    serviceEnvironmentOrder: (ServiceEnvironmentOrder & {
      order: number;
      serviceEnvironment: string;
    })[];
    jobStateTimeLimitActions: (JobStateTimeLimitAction & {
      reason: string;
      state: JobStateTimeLimitActionsState;
      maxTimeSeconds: number;
      action: JobStateTimeLimitActionsAction;
    })[];
  })[];
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
  schedulingPolicies?: (SchedulingPolicyDetail & {
    name: string;
    arn: string;
    fairsharePolicy: FairsharePolicy & {
      shareDistribution: (ShareAttributes & { shareIdentifier: string })[];
    };
  })[];
}
export const DescribeSchedulingPoliciesResponse = S.suspend(() =>
  S.Struct({ schedulingPolicies: S.optional(SchedulingPolicyDetailList) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeSchedulingPoliciesResponse",
}) as any as S.Schema<DescribeSchedulingPoliciesResponse>;
export interface DescribeServiceEnvironmentsResponse {
  serviceEnvironments?: (ServiceEnvironmentDetail & {
    serviceEnvironmentName: string;
    serviceEnvironmentArn: string;
    serviceEnvironmentType: ServiceEnvironmentType;
    capacityLimits: CapacityLimits;
  })[];
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
  jobs: (ListJobsByConsumableResourceSummary & {
    jobArn: string;
    jobQueueArn: string;
    jobName: string;
    jobStatus: string;
    quantity: number;
    createdAt: number;
    consumableResourceProperties: ConsumableResourceProperties;
  })[];
  nextToken?: string;
}
export const ListJobsByConsumableResourceResponse = S.suspend(() =>
  S.Struct({
    jobs: S.optional(ListJobsByConsumableResourceSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsByConsumableResourceResponse",
}) as any as S.Schema<ListJobsByConsumableResourceResponse>;
export interface ListSchedulingPoliciesResponse {
  schedulingPolicies?: (SchedulingPolicyListingDetail & { arn: string })[];
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
  jobSummaryList: (ServiceJobSummary & {
    jobId: string;
    jobName: string;
    serviceJobType: ServiceJobType;
    latestAttempt: LatestServiceJobAttempt & {
      serviceResourceId: ServiceResourceId & {
        name: ServiceResourceIdName;
        value: string;
      };
    };
  })[];
  nextToken?: string;
}
export const ListServiceJobsResponse = S.suspend(() =>
  S.Struct({
    jobSummaryList: S.optional(ServiceJobSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServiceJobsResponse",
}) as any as S.Schema<ListServiceJobsResponse>;
export interface SubmitServiceJobRequest {
  jobName?: string;
  jobQueue?: string;
  retryStrategy?: ServiceJobRetryStrategy;
  schedulingPriority?: number;
  serviceRequestPayload?: string;
  serviceJobType?: ServiceJobType;
  shareIdentifier?: string;
  timeoutConfig?: ServiceJobTimeout;
  tags?: { [key: string]: string };
  clientToken?: string;
}
export const SubmitServiceJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    jobQueue: S.optional(S.String),
    retryStrategy: S.optional(ServiceJobRetryStrategy),
    schedulingPriority: S.optional(S.Number),
    serviceRequestPayload: S.optional(S.String),
    serviceJobType: S.optional(ServiceJobType),
    shareIdentifier: S.optional(S.String),
    timeoutConfig: S.optional(ServiceJobTimeout),
    tags: S.optional(TagrisTagsMap),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
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
  jobs?: FrontOfQueueJobSummary[];
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
  consumableResourceArn?: string;
  consumableResourceName?: string;
  totalQuantity?: number;
  inUseQuantity?: number;
  resourceType?: string;
}
export const ConsumableResourceSummary = S.suspend(() =>
  S.Struct({
    consumableResourceArn: S.optional(S.String),
    consumableResourceName: S.optional(S.String),
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
  jobId?: string;
  jobName?: string;
  createdAt?: number;
  status?: JobStatus;
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
    jobId: S.optional(S.String),
    jobName: S.optional(S.String),
    createdAt: S.optional(S.Number),
    status: S.optional(JobStatus),
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
  networkInterfaces?: NetworkInterface[];
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
  computeEnvironmentName?: string;
  type?: CEType;
  state?: CEState;
  unmanagedvCpus?: number;
  computeResources?: ComputeResource;
  serviceRole?: string;
  tags?: { [key: string]: string };
  eksConfiguration?: EksConfiguration;
  context?: string;
}
export const CreateComputeEnvironmentRequest = S.suspend(() =>
  S.Struct({
    computeEnvironmentName: S.optional(S.String),
    type: S.optional(CEType),
    state: S.optional(CEState),
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
  S.Struct({ name: S.optional(S.String), arn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateSchedulingPolicyResponse",
}) as any as S.Schema<CreateSchedulingPolicyResponse>;
export interface DescribeServiceJobResponse {
  attempts?: (ServiceJobAttemptDetail & {
    serviceResourceId: ServiceResourceId & {
      name: ServiceResourceIdName;
      value: string;
    };
  })[];
  createdAt?: number;
  isTerminated?: boolean;
  jobArn?: string;
  jobId: string;
  jobName: string;
  jobQueue: string;
  latestAttempt?: LatestServiceJobAttempt & {
    serviceResourceId: ServiceResourceId & {
      name: ServiceResourceIdName;
      value: string;
    };
  };
  retryStrategy?: ServiceJobRetryStrategy & { attempts: number };
  schedulingPriority?: number;
  serviceRequestPayload?: string;
  serviceJobType: ServiceJobType;
  shareIdentifier?: string;
  startedAt: number;
  status: ServiceJobStatus;
  statusReason?: string;
  stoppedAt?: number;
  tags?: { [key: string]: string };
  timeoutConfig?: ServiceJobTimeout;
}
export const DescribeServiceJobResponse = S.suspend(() =>
  S.Struct({
    attempts: S.optional(ServiceJobAttemptDetails),
    createdAt: S.optional(S.Number),
    isTerminated: S.optional(S.Boolean),
    jobArn: S.optional(S.String),
    jobId: S.optional(S.String),
    jobName: S.optional(S.String),
    jobQueue: S.optional(S.String),
    latestAttempt: S.optional(LatestServiceJobAttempt),
    retryStrategy: S.optional(ServiceJobRetryStrategy),
    schedulingPriority: S.optional(S.Number),
    serviceRequestPayload: S.optional(S.String),
    serviceJobType: S.optional(ServiceJobType),
    shareIdentifier: S.optional(S.String),
    startedAt: S.optional(S.Number),
    status: S.optional(ServiceJobStatus),
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
  consumableResources: (ConsumableResourceSummary & {
    consumableResourceArn: string;
    consumableResourceName: string;
  })[];
  nextToken?: string;
}
export const ListConsumableResourcesResponse = S.suspend(() =>
  S.Struct({
    consumableResources: S.optional(ConsumableResourceSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListConsumableResourcesResponse",
}) as any as S.Schema<ListConsumableResourcesResponse>;
export interface ListJobsResponse {
  jobSummaryList: (JobSummary & { jobId: string; jobName: string })[];
  nextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    jobSummaryList: S.optional(JobSummaryList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface SubmitJobRequest {
  jobName?: string;
  jobQueue?: string;
  shareIdentifier?: string;
  schedulingPriorityOverride?: number;
  arrayProperties?: ArrayProperties;
  dependsOn?: JobDependency[];
  jobDefinition?: string;
  parameters?: { [key: string]: string };
  containerOverrides?: ContainerOverrides;
  nodeOverrides?: NodeOverrides;
  retryStrategy?: RetryStrategy;
  propagateTags?: boolean;
  timeout?: JobTimeout;
  tags?: { [key: string]: string };
  eksPropertiesOverride?: EksPropertiesOverride;
  ecsPropertiesOverride?: EcsPropertiesOverride;
  consumableResourcePropertiesOverride?: ConsumableResourceProperties;
}
export const SubmitJobRequest = S.suspend(() =>
  S.Struct({
    jobName: S.optional(S.String),
    jobQueue: S.optional(S.String),
    shareIdentifier: S.optional(S.String),
    schedulingPriorityOverride: S.optional(S.Number),
    arrayProperties: S.optional(ArrayProperties),
    dependsOn: S.optional(JobDependencyList),
    jobDefinition: S.optional(S.String),
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
    jobName: S.optional(S.String),
    jobId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SubmitServiceJobResponse",
}) as any as S.Schema<SubmitServiceJobResponse>;
export interface ContainerDetail {
  image?: string;
  vcpus?: number;
  memory?: number;
  command?: string[];
  jobRoleArn?: string;
  executionRoleArn?: string;
  volumes?: Volume[];
  environment?: KeyValuePair[];
  mountPoints?: MountPoint[];
  readonlyRootFilesystem?: boolean;
  ulimits?: Ulimit[];
  privileged?: boolean;
  user?: string;
  exitCode?: number;
  reason?: string;
  containerInstanceArn?: string;
  taskArn?: string;
  logStreamName?: string;
  instanceType?: string;
  networkInterfaces?: NetworkInterface[];
  resourceRequirements?: ResourceRequirement[];
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  secrets?: Secret[];
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
  statusSummary?: { [key: string]: number };
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
  containers?: EksAttemptContainerDetail[];
  initContainers?: EksAttemptContainerDetail[];
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
  networkInterfaces?: NetworkInterface[];
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
  command?: string[];
  args?: string[];
  env?: EksContainerEnvironmentVariable[];
  resources?: EksContainerResourceRequirements;
  exitCode?: number;
  reason?: string;
  volumeMounts?: EksContainerVolumeMount[];
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
  command?: string[];
  dependsOn?: TaskContainerDependency[];
  environment?: KeyValuePair[];
  essential?: boolean;
  firelensConfiguration?: FirelensConfiguration;
  image?: string;
  linuxParameters?: LinuxParameters;
  logConfiguration?: LogConfiguration;
  mountPoints?: MountPoint[];
  name?: string;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  repositoryCredentials?: RepositoryCredentials;
  resourceRequirements?: ResourceRequirement[];
  secrets?: Secret[];
  ulimits?: Ulimit[];
  user?: string;
  exitCode?: number;
  reason?: string;
  logStreamName?: string;
  networkInterfaces?: NetworkInterface[];
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
  containers?: AttemptTaskContainerDetails[];
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
  imagePullSecrets?: ImagePullSecret[];
  containers?: EksContainerDetail[];
  initContainers?: EksContainerDetail[];
  volumes?: EksVolume[];
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
  containers?: TaskContainerDetails[];
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
  volumes?: Volume[];
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
    jobName: S.optional(S.String),
    jobId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "SubmitJobResponse",
}) as any as S.Schema<SubmitJobResponse>;
export interface AttemptDetail {
  container?: AttemptContainerDetail;
  startedAt?: number;
  stoppedAt?: number;
  statusReason?: string;
  taskProperties?: AttemptEcsTaskDetails[];
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
  taskProperties?: EcsTaskDetails[];
}
export const EcsPropertiesDetail = S.suspend(() =>
  S.Struct({ taskProperties: S.optional(ListEcsTaskDetails) }),
).annotations({
  identifier: "EcsPropertiesDetail",
}) as any as S.Schema<EcsPropertiesDetail>;
export interface JobDetail {
  jobArn?: string;
  jobName?: string;
  jobId?: string;
  jobQueue?: string;
  status?: JobStatus;
  shareIdentifier?: string;
  schedulingPriority?: number;
  attempts?: AttemptDetail[];
  statusReason?: string;
  createdAt?: number;
  retryStrategy?: RetryStrategy;
  startedAt?: number;
  stoppedAt?: number;
  dependsOn?: JobDependency[];
  jobDefinition?: string;
  parameters?: { [key: string]: string };
  container?: ContainerDetail;
  nodeDetails?: NodeDetails;
  nodeProperties?: NodeProperties;
  arrayProperties?: ArrayPropertiesDetail;
  timeout?: JobTimeout;
  tags?: { [key: string]: string };
  propagateTags?: boolean;
  platformCapabilities?: PlatformCapability[];
  eksProperties?: EksPropertiesDetail;
  eksAttempts?: EksAttemptDetail[];
  ecsProperties?: EcsPropertiesDetail;
  isCancelled?: boolean;
  isTerminated?: boolean;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const JobDetail = S.suspend(() =>
  S.Struct({
    jobArn: S.optional(S.String),
    jobName: S.optional(S.String),
    jobId: S.optional(S.String),
    jobQueue: S.optional(S.String),
    status: S.optional(JobStatus),
    shareIdentifier: S.optional(S.String),
    schedulingPriority: S.optional(S.Number),
    attempts: S.optional(AttemptDetails),
    statusReason: S.optional(S.String),
    createdAt: S.optional(S.Number),
    retryStrategy: S.optional(RetryStrategy),
    startedAt: S.optional(S.Number),
    stoppedAt: S.optional(S.Number),
    dependsOn: S.optional(JobDependencyList),
    jobDefinition: S.optional(S.String),
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
  jobs?: (JobDetail & {
    jobName: string;
    jobId: string;
    jobQueue: string;
    status: JobStatus;
    startedAt: number;
    jobDefinition: string;
    retryStrategy: RetryStrategy & {
      evaluateOnExit: (EvaluateOnExit & { action: RetryAction })[];
    };
    container: ContainerDetail & {
      volumes: (Volume & {
        efsVolumeConfiguration: EFSVolumeConfiguration & {
          fileSystemId: string;
        };
      })[];
      ulimits: (Ulimit & {
        hardLimit: number;
        name: string;
        softLimit: number;
      })[];
      resourceRequirements: (ResourceRequirement & {
        value: string;
        type: ResourceType;
      })[];
      linuxParameters: LinuxParameters & {
        devices: (Device & { hostPath: string })[];
        tmpfs: (Tmpfs & { containerPath: string; size: number })[];
      };
      logConfiguration: LogConfiguration & {
        logDriver: LogDriver;
        secretOptions: (Secret & { name: string; valueFrom: string })[];
      };
      secrets: (Secret & { name: string; valueFrom: string })[];
      ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
      repositoryCredentials: RepositoryCredentials & {
        credentialsParameter: string;
      };
    };
    nodeProperties: NodeProperties & {
      numNodes: number;
      mainNode: number;
      nodeRangeProperties: (NodeRangeProperty & {
        targetNodes: string;
        container: ContainerProperties & {
          volumes: (Volume & {
            efsVolumeConfiguration: EFSVolumeConfiguration & {
              fileSystemId: string;
            };
          })[];
          ulimits: (Ulimit & {
            hardLimit: number;
            name: string;
            softLimit: number;
          })[];
          resourceRequirements: (ResourceRequirement & {
            value: string;
            type: ResourceType;
          })[];
          linuxParameters: LinuxParameters & {
            devices: (Device & { hostPath: string })[];
            tmpfs: (Tmpfs & { containerPath: string; size: number })[];
          };
          logConfiguration: LogConfiguration & {
            logDriver: LogDriver;
            secretOptions: (Secret & { name: string; valueFrom: string })[];
          };
          secrets: (Secret & { name: string; valueFrom: string })[];
          ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
          repositoryCredentials: RepositoryCredentials & {
            credentialsParameter: string;
          };
        };
        ecsProperties: EcsProperties & {
          taskProperties: (EcsTaskProperties & {
            containers: (TaskContainerProperties & {
              image: string;
              firelensConfiguration: FirelensConfiguration & {
                type: FirelensConfigurationType;
              };
              linuxParameters: LinuxParameters & {
                devices: (Device & { hostPath: string })[];
                tmpfs: (Tmpfs & { containerPath: string; size: number })[];
              };
              logConfiguration: LogConfiguration & {
                logDriver: LogDriver;
                secretOptions: (Secret & { name: string; valueFrom: string })[];
              };
              repositoryCredentials: RepositoryCredentials & {
                credentialsParameter: string;
              };
              resourceRequirements: (ResourceRequirement & {
                value: string;
                type: ResourceType;
              })[];
              secrets: (Secret & { name: string; valueFrom: string })[];
              ulimits: (Ulimit & {
                hardLimit: number;
                name: string;
                softLimit: number;
              })[];
            })[];
            ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
            volumes: (Volume & {
              efsVolumeConfiguration: EFSVolumeConfiguration & {
                fileSystemId: string;
              };
            })[];
          })[];
        };
        eksProperties: EksProperties & {
          podProperties: EksPodProperties & {
            imagePullSecrets: (ImagePullSecret & { name: string })[];
            containers: (EksContainer & {
              image: string;
              env: (EksContainerEnvironmentVariable & { name: string })[];
            })[];
            initContainers: (EksContainer & {
              image: string;
              env: (EksContainerEnvironmentVariable & { name: string })[];
            })[];
            volumes: (EksVolume & {
              name: string;
              secret: EksSecret & { secretName: string };
              persistentVolumeClaim: EksPersistentVolumeClaim & {
                claimName: string;
              };
            })[];
          };
        };
      })[];
    };
    eksProperties: EksPropertiesDetail & {
      podProperties: EksPodPropertiesDetail & {
        imagePullSecrets: (ImagePullSecret & { name: string })[];
        containers: (EksContainerDetail & {
          env: (EksContainerEnvironmentVariable & { name: string })[];
        })[];
        initContainers: (EksContainerDetail & {
          env: (EksContainerEnvironmentVariable & { name: string })[];
        })[];
        volumes: (EksVolume & {
          name: string;
          secret: EksSecret & { secretName: string };
          persistentVolumeClaim: EksPersistentVolumeClaim & {
            claimName: string;
          };
        })[];
      };
    };
    ecsProperties: EcsPropertiesDetail & {
      taskProperties: (EcsTaskDetails & {
        containers: (TaskContainerDetails & {
          firelensConfiguration: FirelensConfiguration & {
            type: FirelensConfigurationType;
          };
          linuxParameters: LinuxParameters & {
            devices: (Device & { hostPath: string })[];
            tmpfs: (Tmpfs & { containerPath: string; size: number })[];
          };
          logConfiguration: LogConfiguration & {
            logDriver: LogDriver;
            secretOptions: (Secret & { name: string; valueFrom: string })[];
          };
          repositoryCredentials: RepositoryCredentials & {
            credentialsParameter: string;
          };
          resourceRequirements: (ResourceRequirement & {
            value: string;
            type: ResourceType;
          })[];
          secrets: (Secret & { name: string; valueFrom: string })[];
          ulimits: (Ulimit & {
            hardLimit: number;
            name: string;
            softLimit: number;
          })[];
        })[];
        ephemeralStorage: EphemeralStorage & { sizeInGiB: number };
        volumes: (Volume & {
          efsVolumeConfiguration: EFSVolumeConfiguration & {
            fileSystemId: string;
          };
        })[];
      })[];
    };
  })[];
}
export const DescribeJobsResponse = S.suspend(() =>
  S.Struct({ jobs: S.optional(JobDetailList) }).pipe(ns),
).annotations({
  identifier: "DescribeJobsResponse",
}) as any as S.Schema<DescribeJobsResponse>;
export interface RegisterJobDefinitionRequest {
  jobDefinitionName?: string;
  type?: JobDefinitionType;
  parameters?: { [key: string]: string };
  schedulingPriority?: number;
  containerProperties?: ContainerProperties;
  nodeProperties?: NodeProperties;
  retryStrategy?: RetryStrategy;
  propagateTags?: boolean;
  timeout?: JobTimeout;
  tags?: { [key: string]: string };
  platformCapabilities?: PlatformCapability[];
  eksProperties?: EksProperties;
  ecsProperties?: EcsProperties;
  consumableResourceProperties?: ConsumableResourceProperties;
}
export const RegisterJobDefinitionRequest = S.suspend(() =>
  S.Struct({
    jobDefinitionName: S.optional(S.String),
    type: S.optional(JobDefinitionType),
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
    jobDefinitionName: S.optional(S.String),
    jobDefinitionArn: S.optional(S.String),
    revision: S.optional(S.Number),
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
  ): effect.Effect<
    DescribeComputeEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeComputeEnvironmentsRequest,
  ) => stream.Stream<
    DescribeComputeEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeComputeEnvironmentsRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    DescribeJobDefinitionsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobDefinitionsRequest,
  ) => stream.Stream<
    DescribeJobDefinitionsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobDefinitionsRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    DescribeJobQueuesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobQueuesRequest,
  ) => stream.Stream<
    DescribeJobQueuesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobQueuesRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
  ): effect.Effect<
    DescribeServiceEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServiceEnvironmentsRequest,
  ) => stream.Stream<
    DescribeServiceEnvironmentsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServiceEnvironmentsRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListJobsByConsumableResourceResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsByConsumableResourceRequest,
  ) => stream.Stream<
    ListJobsByConsumableResourceResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsByConsumableResourceRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListSchedulingPoliciesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchedulingPoliciesRequest,
  ) => stream.Stream<
    ListSchedulingPoliciesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchedulingPoliciesRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListServiceJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServiceJobsRequest,
  ) => stream.Stream<
    ListServiceJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServiceJobsRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
  ): effect.Effect<
    ListConsumableResourcesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConsumableResourcesRequest,
  ) => stream.Stream<
    ListConsumableResourcesResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConsumableResourcesRequest,
  ) => stream.Stream<
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
  ): effect.Effect<
    ListJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResponse,
    ClientException | ServerException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
  RegisterJobDefinitionResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterJobDefinitionRequest,
  output: RegisterJobDefinitionResponse,
  errors: [ClientException, ServerException],
}));
