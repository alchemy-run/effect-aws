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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "ARC Region switch",
  serviceShapeName: "ArcRegionSwitch",
});
const auth = T.AwsAuthSigv4({ name: "arc-region-switch" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { UseFIPS = false, Endpoint, Region, UseControlPlaneEndpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingName: "arc-region-switch",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
  });
  {
    const PartitionResult = _.partition(Region);
    if (
      UseControlPlaneEndpoint != null &&
      UseControlPlaneEndpoint === true &&
      Region != null &&
      !(UseFIPS === true) &&
      !(Endpoint != null) &&
      PartitionResult != null &&
      PartitionResult !== false &&
      _.getAttr(PartitionResult, "name") === "aws-cn"
    ) {
      return e(
        `https://arc-region-switch-control-plane.cn-north-1.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        {
          authSchemes: [
            {
              name: "sigv4",
              signingName: "arc-region-switch",
              signingRegion: "cn-north-1",
            },
          ],
        },
        {},
      );
    }
  }
  {
    const PartitionResult = _.partition(Region);
    if (
      !(Endpoint != null) &&
      UseControlPlaneEndpoint != null &&
      UseControlPlaneEndpoint === true &&
      Region != null &&
      UseFIPS === true &&
      PartitionResult != null &&
      PartitionResult !== false
    ) {
      if (_.getAttr(PartitionResult, "name") === "aws-cn") {
        return err(
          "Invalid Configuration: FIPS is not supported in this partition",
        );
      }
      return e(
        `https://arc-region-switch-control-plane-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        _p0(PartitionResult),
        {},
      );
    }
  }
  {
    const PartitionResult = _.partition(Region);
    if (
      UseControlPlaneEndpoint != null &&
      UseControlPlaneEndpoint === true &&
      Region != null &&
      !(UseFIPS === true) &&
      !(Endpoint != null) &&
      PartitionResult != null &&
      PartitionResult !== false
    ) {
      return e(
        `https://arc-region-switch-control-plane.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        _p0(PartitionResult),
        {},
      );
    }
  }
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true) {
          return e(
            `https://arc-region-switch-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        return e(
          `https://arc-region-switch.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type PlanArn = string;
export type ExecutionId = string;
export type StepName = string;
export type ExecutionComment = string;
export type MaxResults = number;
export type NextToken = string;
export type GetPlanExecutionStepStatesMaxResults = number;
export type ListExecutionEventsMaxResults = number;
export type ListExecutionsMaxResults = number;
export type Route53HostedZoneId = string;
export type Route53RecordName = string;
export type IamRoleArn = string;
export type PlanName = string;
export type Region = string;
export type TagKey = string;
export type TagValue = string;
export type Duration = string;
export type ResourceArn = string;
export type AccountId = string;
export type Route53HealthCheckId = string;
export type RoleArn = string;
export type GlobalClusterIdentifier = string;
export type AuroraClusterArn = string;
export type DocumentDbGlobalClusterIdentifier = string;
export type DocumentDbClusterArn = string;
export type LambdaArn = string;
export type AsgArn = string;
export type EcsClusterArn = string;
export type EcsServiceArn = string;
export type EksClusterArn = string;
export type Route53ResourceRecordSetIdentifier = string;
export type RoutingControlArn = string;
export type KubernetesNamespace = string;

//# Schemas
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface ApprovePlanExecutionStepRequest {
  planArn: string;
  executionId: string;
  stepName: string;
  approval: string;
  comment?: string;
}
export const ApprovePlanExecutionStepRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    stepName: S.String,
    approval: S.String,
    comment: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ApprovePlanExecutionStepRequest",
}) as any as S.Schema<ApprovePlanExecutionStepRequest>;
export interface ApprovePlanExecutionStepResponse {}
export const ApprovePlanExecutionStepResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ApprovePlanExecutionStepResponse",
}) as any as S.Schema<ApprovePlanExecutionStepResponse>;
export interface CancelPlanExecutionRequest {
  planArn: string;
  executionId: string;
  comment?: string;
}
export const CancelPlanExecutionRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    comment: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelPlanExecutionRequest",
}) as any as S.Schema<CancelPlanExecutionRequest>;
export interface CancelPlanExecutionResponse {}
export const CancelPlanExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelPlanExecutionResponse",
}) as any as S.Schema<CancelPlanExecutionResponse>;
export interface GetPlanEvaluationStatusRequest {
  planArn: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetPlanEvaluationStatusRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPlanEvaluationStatusRequest",
}) as any as S.Schema<GetPlanEvaluationStatusRequest>;
export interface GetPlanExecutionRequest {
  planArn: string;
  executionId: string;
  maxResults?: number;
  nextToken?: string;
}
export const GetPlanExecutionRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPlanExecutionRequest",
}) as any as S.Schema<GetPlanExecutionRequest>;
export interface GetPlanInRegionRequest {
  arn: string;
}
export const GetPlanInRegionRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPlanInRegionRequest",
}) as any as S.Schema<GetPlanInRegionRequest>;
export interface ListPlanExecutionEventsRequest {
  planArn: string;
  executionId: string;
  maxResults?: number;
  nextToken?: string;
  name?: string;
}
export const ListPlanExecutionEventsRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    name: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPlanExecutionEventsRequest",
}) as any as S.Schema<ListPlanExecutionEventsRequest>;
export interface ListPlanExecutionsRequest {
  planArn: string;
  maxResults?: number;
  nextToken?: string;
  state?: string;
}
export const ListPlanExecutionsRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    state: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPlanExecutionsRequest",
}) as any as S.Schema<ListPlanExecutionsRequest>;
export interface ListPlansInRegionRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListPlansInRegionRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPlansInRegionRequest",
}) as any as S.Schema<ListPlansInRegionRequest>;
export interface ListRoute53HealthChecksRequest {
  arn: string;
  hostedZoneId?: string;
  recordName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListRoute53HealthChecksRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    hostedZoneId: S.optional(S.String),
    recordName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListRoute53HealthChecksRequest",
}) as any as S.Schema<ListRoute53HealthChecksRequest>;
export interface ListRoute53HealthChecksInRegionRequest {
  arn: string;
  hostedZoneId?: string;
  recordName?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListRoute53HealthChecksInRegionRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    hostedZoneId: S.optional(S.String),
    recordName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRoute53HealthChecksInRegionRequest",
}) as any as S.Schema<ListRoute53HealthChecksInRegionRequest>;
export interface StartPlanExecutionRequest {
  planArn: string;
  targetRegion: string;
  action: string;
  mode?: string;
  comment?: string;
  latestVersion?: string;
}
export const StartPlanExecutionRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    targetRegion: S.String,
    action: S.String,
    mode: S.optional(S.String),
    comment: S.optional(S.String),
    latestVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartPlanExecutionRequest",
}) as any as S.Schema<StartPlanExecutionRequest>;
export interface UpdatePlanExecutionRequest {
  planArn: string;
  executionId: string;
  action: string;
  comment?: string;
}
export const UpdatePlanExecutionRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    action: S.String,
    comment: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePlanExecutionRequest",
}) as any as S.Schema<UpdatePlanExecutionRequest>;
export interface UpdatePlanExecutionResponse {}
export const UpdatePlanExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePlanExecutionResponse",
}) as any as S.Schema<UpdatePlanExecutionResponse>;
export interface UpdatePlanExecutionStepRequest {
  planArn: string;
  executionId: string;
  comment: string;
  stepName: string;
  actionToTake: string;
}
export const UpdatePlanExecutionStepRequest = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    comment: S.String,
    stepName: S.String,
    actionToTake: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePlanExecutionStepRequest",
}) as any as S.Schema<UpdatePlanExecutionStepRequest>;
export interface UpdatePlanExecutionStepResponse {}
export const UpdatePlanExecutionStepResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePlanExecutionStepResponse",
}) as any as S.Schema<UpdatePlanExecutionStepResponse>;
export interface GetPlanRequest {
  arn: string;
}
export const GetPlanRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "GetPlanRequest",
}) as any as S.Schema<GetPlanRequest>;
export type Steps = Step[];
export const Steps = S.Array(
  S.suspend((): S.Schema<Step, any> => Step).annotations({
    identifier: "Step",
  }),
) as any as S.Schema<Steps>;
export interface Workflow {
  steps?: Steps;
  workflowTargetAction: string;
  workflowTargetRegion?: string;
  workflowDescription?: string;
}
export const Workflow = S.suspend(() =>
  S.Struct({
    steps: S.optional(Steps),
    workflowTargetAction: S.String,
    workflowTargetRegion: S.optional(S.String),
    workflowDescription: S.optional(S.String),
  }),
).annotations({ identifier: "Workflow" }) as any as S.Schema<Workflow>;
export type WorkflowList = Workflow[];
export const WorkflowList = S.Array(Workflow);
export interface AssociatedAlarm {
  crossAccountRole?: string;
  externalId?: string;
  resourceIdentifier: string;
  alarmType: string;
}
export const AssociatedAlarm = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    resourceIdentifier: S.String,
    alarmType: S.String,
  }),
).annotations({
  identifier: "AssociatedAlarm",
}) as any as S.Schema<AssociatedAlarm>;
export type AssociatedAlarmMap = { [key: string]: AssociatedAlarm };
export const AssociatedAlarmMap = S.Record({
  key: S.String,
  value: AssociatedAlarm,
});
export interface TriggerCondition {
  associatedAlarmName: string;
  condition: string;
}
export const TriggerCondition = S.suspend(() =>
  S.Struct({ associatedAlarmName: S.String, condition: S.String }),
).annotations({
  identifier: "TriggerCondition",
}) as any as S.Schema<TriggerCondition>;
export type TriggerConditionList = TriggerCondition[];
export const TriggerConditionList = S.Array(TriggerCondition);
export interface Trigger {
  description?: string;
  targetRegion: string;
  action: string;
  conditions: TriggerConditionList;
  minDelayMinutesBetweenExecutions: number;
}
export const Trigger = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    targetRegion: S.String,
    action: S.String,
    conditions: TriggerConditionList,
    minDelayMinutesBetweenExecutions: S.Number,
  }),
).annotations({ identifier: "Trigger" }) as any as S.Schema<Trigger>;
export type TriggerList = Trigger[];
export const TriggerList = S.Array(Trigger);
export interface S3ReportOutputConfiguration {
  bucketPath?: string;
  bucketOwner?: string;
}
export const S3ReportOutputConfiguration = S.suspend(() =>
  S.Struct({
    bucketPath: S.optional(S.String),
    bucketOwner: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ReportOutputConfiguration",
}) as any as S.Schema<S3ReportOutputConfiguration>;
export type ReportOutputConfiguration = {
  s3Configuration: S3ReportOutputConfiguration;
};
export const ReportOutputConfiguration = S.Union(
  S.Struct({ s3Configuration: S3ReportOutputConfiguration }),
);
export type ReportOutputList = (typeof ReportOutputConfiguration)["Type"][];
export const ReportOutputList = S.Array(ReportOutputConfiguration);
export interface ReportConfiguration {
  reportOutput?: ReportOutputList;
}
export const ReportConfiguration = S.suspend(() =>
  S.Struct({ reportOutput: S.optional(ReportOutputList) }),
).annotations({
  identifier: "ReportConfiguration",
}) as any as S.Schema<ReportConfiguration>;
export interface UpdatePlanRequest {
  arn: string;
  description?: string;
  workflows: WorkflowList;
  executionRole: string;
  recoveryTimeObjectiveMinutes?: number;
  associatedAlarms?: AssociatedAlarmMap;
  triggers?: TriggerList;
  reportConfiguration?: ReportConfiguration;
}
export const UpdatePlanRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    description: S.optional(S.String),
    workflows: WorkflowList,
    executionRole: S.String,
    recoveryTimeObjectiveMinutes: S.optional(S.Number),
    associatedAlarms: S.optional(AssociatedAlarmMap),
    triggers: S.optional(TriggerList),
    reportConfiguration: S.optional(ReportConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UpdatePlanRequest",
}) as any as S.Schema<UpdatePlanRequest>;
export interface DeletePlanRequest {
  arn: string;
}
export const DeletePlanRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "DeletePlanRequest",
}) as any as S.Schema<DeletePlanRequest>;
export interface DeletePlanResponse {}
export const DeletePlanResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeletePlanResponse",
}) as any as S.Schema<DeletePlanResponse>;
export interface ListPlansRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListPlansRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListPlansRequest",
}) as any as S.Schema<ListPlansRequest>;
export interface ListTagsForResourceRequest {
  arn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export type Tags = { [key: string]: string };
export const Tags = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  arn: string;
  tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String, tags: Tags }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
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
  arn: string;
  resourceTagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ arn: S.String, resourceTagKeys: TagKeys }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface Plan {
  arn: string;
  description?: string;
  workflows: WorkflowList;
  executionRole: string;
  recoveryTimeObjectiveMinutes?: number;
  associatedAlarms?: AssociatedAlarmMap;
  triggers?: TriggerList;
  reportConfiguration?: ReportConfiguration;
  name: string;
  regions: RegionList;
  recoveryApproach: string;
  primaryRegion?: string;
  owner: string;
  version?: string;
  updatedAt?: Date;
}
export const Plan = S.suspend(() =>
  S.Struct({
    arn: S.String,
    description: S.optional(S.String),
    workflows: WorkflowList,
    executionRole: S.String,
    recoveryTimeObjectiveMinutes: S.optional(S.Number),
    associatedAlarms: S.optional(AssociatedAlarmMap),
    triggers: S.optional(TriggerList),
    reportConfiguration: S.optional(ReportConfiguration),
    name: S.String,
    regions: RegionList,
    recoveryApproach: S.String,
    primaryRegion: S.optional(S.String),
    owner: S.String,
    version: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Plan" }) as any as S.Schema<Plan>;
export interface GetPlanInRegionResponse {
  plan?: Plan;
}
export const GetPlanInRegionResponse = S.suspend(() =>
  S.Struct({ plan: S.optional(Plan) }),
).annotations({
  identifier: "GetPlanInRegionResponse",
}) as any as S.Schema<GetPlanInRegionResponse>;
export interface Route53HealthCheck {
  hostedZoneId: string;
  recordName: string;
  healthCheckId?: string;
  status?: string;
  region: string;
}
export const Route53HealthCheck = S.suspend(() =>
  S.Struct({
    hostedZoneId: S.String,
    recordName: S.String,
    healthCheckId: S.optional(S.String),
    status: S.optional(S.String),
    region: S.String,
  }),
).annotations({
  identifier: "Route53HealthCheck",
}) as any as S.Schema<Route53HealthCheck>;
export type Route53HealthCheckList = Route53HealthCheck[];
export const Route53HealthCheckList = S.Array(Route53HealthCheck);
export interface ListRoute53HealthChecksInRegionResponse {
  healthChecks?: Route53HealthCheckList;
  nextToken?: string;
}
export const ListRoute53HealthChecksInRegionResponse = S.suspend(() =>
  S.Struct({
    healthChecks: S.optional(Route53HealthCheckList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRoute53HealthChecksInRegionResponse",
}) as any as S.Schema<ListRoute53HealthChecksInRegionResponse>;
export interface StartPlanExecutionResponse {
  executionId?: string;
  plan?: string;
  planVersion?: string;
  activateRegion?: string;
  deactivateRegion?: string;
}
export const StartPlanExecutionResponse = S.suspend(() =>
  S.Struct({
    executionId: S.optional(S.String),
    plan: S.optional(S.String),
    planVersion: S.optional(S.String),
    activateRegion: S.optional(S.String),
    deactivateRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "StartPlanExecutionResponse",
}) as any as S.Schema<StartPlanExecutionResponse>;
export interface GetPlanResponse {
  plan?: Plan;
}
export const GetPlanResponse = S.suspend(() =>
  S.Struct({ plan: S.optional(Plan) }),
).annotations({
  identifier: "GetPlanResponse",
}) as any as S.Schema<GetPlanResponse>;
export interface UpdatePlanResponse {
  plan?: Plan;
}
export const UpdatePlanResponse = S.suspend(() =>
  S.Struct({ plan: S.optional(Plan) }),
).annotations({
  identifier: "UpdatePlanResponse",
}) as any as S.Schema<UpdatePlanResponse>;
export interface AbbreviatedPlan {
  arn: string;
  owner: string;
  name: string;
  regions: RegionList;
  recoveryApproach: string;
  primaryRegion?: string;
  version?: string;
  updatedAt?: Date;
  description?: string;
  executionRole?: string;
  activePlanExecution?: string;
  recoveryTimeObjectiveMinutes?: number;
}
export const AbbreviatedPlan = S.suspend(() =>
  S.Struct({
    arn: S.String,
    owner: S.String,
    name: S.String,
    regions: RegionList,
    recoveryApproach: S.String,
    primaryRegion: S.optional(S.String),
    version: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    executionRole: S.optional(S.String),
    activePlanExecution: S.optional(S.String),
    recoveryTimeObjectiveMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "AbbreviatedPlan",
}) as any as S.Schema<AbbreviatedPlan>;
export type PlanList = AbbreviatedPlan[];
export const PlanList = S.Array(AbbreviatedPlan);
export interface ListPlansResponse {
  plans?: PlanList;
  nextToken?: string;
}
export const ListPlansResponse = S.suspend(() =>
  S.Struct({ plans: S.optional(PlanList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPlansResponse",
}) as any as S.Schema<ListPlansResponse>;
export interface ListTagsForResourceResponse {
  resourceTags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ resourceTags: S.optional(Tags) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type Resources = string[];
export const Resources = S.Array(S.String);
export interface StepState {
  name?: string;
  status?: string;
  startTime?: Date;
  endTime?: Date;
  stepMode?: string;
}
export const StepState = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stepMode: S.optional(S.String),
  }),
).annotations({ identifier: "StepState" }) as any as S.Schema<StepState>;
export type StepStates = StepState[];
export const StepStates = S.Array(StepState);
export interface ExecutionEvent {
  timestamp?: Date;
  type?: string;
  stepName?: string;
  executionBlockType?: string;
  resources?: Resources;
  error?: string;
  description?: string;
  eventId: string;
  previousEventId?: string;
}
export const ExecutionEvent = S.suspend(() =>
  S.Struct({
    timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    type: S.optional(S.String),
    stepName: S.optional(S.String),
    executionBlockType: S.optional(S.String),
    resources: S.optional(Resources),
    error: S.optional(S.String),
    description: S.optional(S.String),
    eventId: S.String,
    previousEventId: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionEvent",
}) as any as S.Schema<ExecutionEvent>;
export type ExecutionEventList = ExecutionEvent[];
export const ExecutionEventList = S.Array(ExecutionEvent);
export interface AbbreviatedExecution {
  planArn: string;
  executionId: string;
  version?: string;
  updatedAt?: Date;
  comment?: string;
  startTime: Date;
  endTime?: Date;
  mode: string;
  executionState: string;
  executionAction: string;
  executionRegion: string;
  actualRecoveryTime?: string;
}
export const AbbreviatedExecution = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    version: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    comment: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    mode: S.String,
    executionState: S.String,
    executionAction: S.String,
    executionRegion: S.String,
    actualRecoveryTime: S.optional(S.String),
  }),
).annotations({
  identifier: "AbbreviatedExecution",
}) as any as S.Schema<AbbreviatedExecution>;
export type AbbreviatedExecutionsList = AbbreviatedExecution[];
export const AbbreviatedExecutionsList = S.Array(AbbreviatedExecution);
export interface ListPlanExecutionEventsResponse {
  items?: ExecutionEventList;
  nextToken?: string;
}
export const ListPlanExecutionEventsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ExecutionEventList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPlanExecutionEventsResponse",
}) as any as S.Schema<ListPlanExecutionEventsResponse>;
export interface ListPlanExecutionsResponse {
  items?: AbbreviatedExecutionsList;
  nextToken?: string;
}
export const ListPlanExecutionsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(AbbreviatedExecutionsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPlanExecutionsResponse",
}) as any as S.Schema<ListPlanExecutionsResponse>;
export interface ListPlansInRegionResponse {
  plans?: PlanList;
  nextToken?: string;
}
export const ListPlansInRegionResponse = S.suspend(() =>
  S.Struct({ plans: S.optional(PlanList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListPlansInRegionResponse",
}) as any as S.Schema<ListPlansInRegionResponse>;
export interface ListRoute53HealthChecksResponse {
  healthChecks?: Route53HealthCheckList;
  nextToken?: string;
}
export const ListRoute53HealthChecksResponse = S.suspend(() =>
  S.Struct({
    healthChecks: S.optional(Route53HealthCheckList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRoute53HealthChecksResponse",
}) as any as S.Schema<ListRoute53HealthChecksResponse>;
export type AuroraClusterArns = string[];
export const AuroraClusterArns = S.Array(S.String);
export type DocumentDbClusterArns = string[];
export const DocumentDbClusterArns = S.Array(S.String);
export interface MinimalWorkflow {
  action?: string;
  name?: string;
}
export const MinimalWorkflow = S.suspend(() =>
  S.Struct({ action: S.optional(S.String), name: S.optional(S.String) }),
).annotations({
  identifier: "MinimalWorkflow",
}) as any as S.Schema<MinimalWorkflow>;
export interface ExecutionApprovalConfiguration {
  timeoutMinutes?: number;
  approvalRole: string;
}
export const ExecutionApprovalConfiguration = S.suspend(() =>
  S.Struct({ timeoutMinutes: S.optional(S.Number), approvalRole: S.String }),
).annotations({
  identifier: "ExecutionApprovalConfiguration",
}) as any as S.Schema<ExecutionApprovalConfiguration>;
export interface ParallelExecutionBlockConfiguration {
  steps: Steps;
}
export const ParallelExecutionBlockConfiguration = S.suspend(() =>
  S.Struct({
    steps: S.suspend(() => Steps).annotations({ identifier: "Steps" }),
  }),
).annotations({
  identifier: "ParallelExecutionBlockConfiguration",
}) as any as S.Schema<ParallelExecutionBlockConfiguration>;
export interface RegionSwitchPlanConfiguration {
  crossAccountRole?: string;
  externalId?: string;
  arn: string;
}
export const RegionSwitchPlanConfiguration = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    arn: S.String,
  }),
).annotations({
  identifier: "RegionSwitchPlanConfiguration",
}) as any as S.Schema<RegionSwitchPlanConfiguration>;
export interface ResourceWarning {
  workflow?: MinimalWorkflow;
  version: string;
  stepName?: string;
  resourceArn?: string;
  warningStatus: string;
  warningUpdatedTime: Date;
  warningMessage: string;
}
export const ResourceWarning = S.suspend(() =>
  S.Struct({
    workflow: S.optional(MinimalWorkflow),
    version: S.String,
    stepName: S.optional(S.String),
    resourceArn: S.optional(S.String),
    warningStatus: S.String,
    warningUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    warningMessage: S.String,
  }),
).annotations({
  identifier: "ResourceWarning",
}) as any as S.Schema<ResourceWarning>;
export type PlanWarnings = ResourceWarning[];
export const PlanWarnings = S.Array(ResourceWarning);
export interface S3ReportOutput {
  s3ObjectKey?: string;
}
export const S3ReportOutput = S.suspend(() =>
  S.Struct({ s3ObjectKey: S.optional(S.String) }),
).annotations({
  identifier: "S3ReportOutput",
}) as any as S.Schema<S3ReportOutput>;
export interface FailedReportOutput {
  errorCode?: string;
  errorMessage?: string;
}
export const FailedReportOutput = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedReportOutput",
}) as any as S.Schema<FailedReportOutput>;
export interface GetPlanEvaluationStatusResponse {
  planArn: string;
  lastEvaluationTime?: Date;
  lastEvaluatedVersion?: string;
  region?: string;
  evaluationState?: string;
  warnings?: PlanWarnings;
  nextToken?: string;
}
export const GetPlanEvaluationStatusResponse = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    lastEvaluationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastEvaluatedVersion: S.optional(S.String),
    region: S.optional(S.String),
    evaluationState: S.optional(S.String),
    warnings: S.optional(PlanWarnings),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPlanEvaluationStatusResponse",
}) as any as S.Schema<GetPlanEvaluationStatusResponse>;
export interface Lambdas {
  crossAccountRole?: string;
  externalId?: string;
  arn?: string;
}
export const Lambdas = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Lambdas" }) as any as S.Schema<Lambdas>;
export type LambdaList = Lambdas[];
export const LambdaList = S.Array(Lambdas);
export interface LambdaUngraceful {
  behavior?: string;
}
export const LambdaUngraceful = S.suspend(() =>
  S.Struct({ behavior: S.optional(S.String) }),
).annotations({
  identifier: "LambdaUngraceful",
}) as any as S.Schema<LambdaUngraceful>;
export interface Asg {
  crossAccountRole?: string;
  externalId?: string;
  arn?: string;
}
export const Asg = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    arn: S.optional(S.String),
  }),
).annotations({ identifier: "Asg" }) as any as S.Schema<Asg>;
export type AsgList = Asg[];
export const AsgList = S.Array(Asg);
export interface Ec2Ungraceful {
  minimumSuccessPercentage: number;
}
export const Ec2Ungraceful = S.suspend(() =>
  S.Struct({ minimumSuccessPercentage: S.Number }),
).annotations({
  identifier: "Ec2Ungraceful",
}) as any as S.Schema<Ec2Ungraceful>;
export interface GlobalAuroraUngraceful {
  ungraceful?: string;
}
export const GlobalAuroraUngraceful = S.suspend(() =>
  S.Struct({ ungraceful: S.optional(S.String) }),
).annotations({
  identifier: "GlobalAuroraUngraceful",
}) as any as S.Schema<GlobalAuroraUngraceful>;
export interface Service {
  crossAccountRole?: string;
  externalId?: string;
  clusterArn?: string;
  serviceArn?: string;
}
export const Service = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    clusterArn: S.optional(S.String),
    serviceArn: S.optional(S.String),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export type ServiceList = Service[];
export const ServiceList = S.Array(Service);
export interface EcsUngraceful {
  minimumSuccessPercentage: number;
}
export const EcsUngraceful = S.suspend(() =>
  S.Struct({ minimumSuccessPercentage: S.Number }),
).annotations({
  identifier: "EcsUngraceful",
}) as any as S.Schema<EcsUngraceful>;
export interface KubernetesResourceType {
  apiVersion: string;
  kind: string;
}
export const KubernetesResourceType = S.suspend(() =>
  S.Struct({ apiVersion: S.String, kind: S.String }),
).annotations({
  identifier: "KubernetesResourceType",
}) as any as S.Schema<KubernetesResourceType>;
export interface EksCluster {
  crossAccountRole?: string;
  externalId?: string;
  clusterArn: string;
}
export const EksCluster = S.suspend(() =>
  S.Struct({
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    clusterArn: S.String,
  }),
).annotations({ identifier: "EksCluster" }) as any as S.Schema<EksCluster>;
export type EksClusters = EksCluster[];
export const EksClusters = S.Array(EksCluster);
export interface EksResourceScalingUngraceful {
  minimumSuccessPercentage: number;
}
export const EksResourceScalingUngraceful = S.suspend(() =>
  S.Struct({ minimumSuccessPercentage: S.Number }),
).annotations({
  identifier: "EksResourceScalingUngraceful",
}) as any as S.Schema<EksResourceScalingUngraceful>;
export interface Route53ResourceRecordSet {
  recordSetIdentifier?: string;
  region?: string;
}
export const Route53ResourceRecordSet = S.suspend(() =>
  S.Struct({
    recordSetIdentifier: S.optional(S.String),
    region: S.optional(S.String),
  }),
).annotations({
  identifier: "Route53ResourceRecordSet",
}) as any as S.Schema<Route53ResourceRecordSet>;
export type Route53ResourceRecordSetList = Route53ResourceRecordSet[];
export const Route53ResourceRecordSetList = S.Array(Route53ResourceRecordSet);
export interface DocumentDbUngraceful {
  ungraceful?: string;
}
export const DocumentDbUngraceful = S.suspend(() =>
  S.Struct({ ungraceful: S.optional(S.String) }),
).annotations({
  identifier: "DocumentDbUngraceful",
}) as any as S.Schema<DocumentDbUngraceful>;
export type ReportOutput =
  | { s3ReportOutput: S3ReportOutput }
  | { failedReportOutput: FailedReportOutput };
export const ReportOutput = S.Union(
  S.Struct({ s3ReportOutput: S3ReportOutput }),
  S.Struct({ failedReportOutput: FailedReportOutput }),
);
export interface CustomActionLambdaConfiguration {
  timeoutMinutes?: number;
  lambdas: LambdaList;
  retryIntervalMinutes: number;
  regionToRun: string;
  ungraceful?: LambdaUngraceful;
}
export const CustomActionLambdaConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    lambdas: LambdaList,
    retryIntervalMinutes: S.Number,
    regionToRun: S.String,
    ungraceful: S.optional(LambdaUngraceful),
  }),
).annotations({
  identifier: "CustomActionLambdaConfiguration",
}) as any as S.Schema<CustomActionLambdaConfiguration>;
export interface Ec2AsgCapacityIncreaseConfiguration {
  timeoutMinutes?: number;
  asgs: AsgList;
  ungraceful?: Ec2Ungraceful;
  targetPercent?: number;
  capacityMonitoringApproach?: string;
}
export const Ec2AsgCapacityIncreaseConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    asgs: AsgList,
    ungraceful: S.optional(Ec2Ungraceful),
    targetPercent: S.optional(S.Number),
    capacityMonitoringApproach: S.optional(S.String),
  }),
).annotations({
  identifier: "Ec2AsgCapacityIncreaseConfiguration",
}) as any as S.Schema<Ec2AsgCapacityIncreaseConfiguration>;
export interface GlobalAuroraConfiguration {
  timeoutMinutes?: number;
  crossAccountRole?: string;
  externalId?: string;
  behavior: string;
  ungraceful?: GlobalAuroraUngraceful;
  globalClusterIdentifier: string;
  databaseClusterArns: AuroraClusterArns;
}
export const GlobalAuroraConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    behavior: S.String,
    ungraceful: S.optional(GlobalAuroraUngraceful),
    globalClusterIdentifier: S.String,
    databaseClusterArns: AuroraClusterArns,
  }),
).annotations({
  identifier: "GlobalAuroraConfiguration",
}) as any as S.Schema<GlobalAuroraConfiguration>;
export interface EcsCapacityIncreaseConfiguration {
  timeoutMinutes?: number;
  services: ServiceList;
  ungraceful?: EcsUngraceful;
  targetPercent?: number;
  capacityMonitoringApproach?: string;
}
export const EcsCapacityIncreaseConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    services: ServiceList,
    ungraceful: S.optional(EcsUngraceful),
    targetPercent: S.optional(S.Number),
    capacityMonitoringApproach: S.optional(S.String),
  }),
).annotations({
  identifier: "EcsCapacityIncreaseConfiguration",
}) as any as S.Schema<EcsCapacityIncreaseConfiguration>;
export interface Route53HealthCheckConfiguration {
  timeoutMinutes?: number;
  crossAccountRole?: string;
  externalId?: string;
  hostedZoneId: string;
  recordName: string;
  recordSets?: Route53ResourceRecordSetList;
}
export const Route53HealthCheckConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    hostedZoneId: S.String,
    recordName: S.String,
    recordSets: S.optional(Route53ResourceRecordSetList),
  }),
).annotations({
  identifier: "Route53HealthCheckConfiguration",
}) as any as S.Schema<Route53HealthCheckConfiguration>;
export interface DocumentDbConfiguration {
  timeoutMinutes?: number;
  crossAccountRole?: string;
  externalId?: string;
  behavior: string;
  ungraceful?: DocumentDbUngraceful;
  globalClusterIdentifier: string;
  databaseClusterArns: DocumentDbClusterArns;
}
export const DocumentDbConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    behavior: S.String,
    ungraceful: S.optional(DocumentDbUngraceful),
    globalClusterIdentifier: S.String,
    databaseClusterArns: DocumentDbClusterArns,
  }),
).annotations({
  identifier: "DocumentDbConfiguration",
}) as any as S.Schema<DocumentDbConfiguration>;
export interface GeneratedReport {
  reportGenerationTime?: Date;
  reportOutput?: (typeof ReportOutput)["Type"];
}
export const GeneratedReport = S.suspend(() =>
  S.Struct({
    reportGenerationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    reportOutput: S.optional(ReportOutput),
  }),
).annotations({
  identifier: "GeneratedReport",
}) as any as S.Schema<GeneratedReport>;
export type GeneratedReportDetails = GeneratedReport[];
export const GeneratedReportDetails = S.Array(GeneratedReport);
export interface ArcRoutingControlState {
  routingControlArn: string;
  state: string;
}
export const ArcRoutingControlState = S.suspend(() =>
  S.Struct({ routingControlArn: S.String, state: S.String }),
).annotations({
  identifier: "ArcRoutingControlState",
}) as any as S.Schema<ArcRoutingControlState>;
export type ArcRoutingControlStates = ArcRoutingControlState[];
export const ArcRoutingControlStates = S.Array(ArcRoutingControlState);
export interface GetPlanExecutionResponse {
  planArn: string;
  executionId: string;
  version?: string;
  updatedAt?: Date;
  comment?: string;
  startTime: Date;
  endTime?: Date;
  mode: string;
  executionState: string;
  executionAction: string;
  executionRegion: string;
  stepStates?: StepStates;
  plan?: Plan;
  actualRecoveryTime?: string;
  generatedReportDetails?: GeneratedReportDetails;
  nextToken?: string;
}
export const GetPlanExecutionResponse = S.suspend(() =>
  S.Struct({
    planArn: S.String,
    executionId: S.String,
    version: S.optional(S.String),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    comment: S.optional(S.String),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    mode: S.String,
    executionState: S.String,
    executionAction: S.String,
    executionRegion: S.String,
    stepStates: S.optional(StepStates),
    plan: S.optional(Plan),
    actualRecoveryTime: S.optional(S.String),
    generatedReportDetails: S.optional(GeneratedReportDetails),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPlanExecutionResponse",
}) as any as S.Schema<GetPlanExecutionResponse>;
export type RegionAndRoutingControls = {
  [key: string]: ArcRoutingControlStates;
};
export const RegionAndRoutingControls = S.Record({
  key: S.String,
  value: ArcRoutingControlStates,
});
export interface KubernetesScalingResource {
  namespace: string;
  name: string;
  hpaName?: string;
}
export const KubernetesScalingResource = S.suspend(() =>
  S.Struct({
    namespace: S.String,
    name: S.String,
    hpaName: S.optional(S.String),
  }),
).annotations({
  identifier: "KubernetesScalingResource",
}) as any as S.Schema<KubernetesScalingResource>;
export interface ArcRoutingControlConfiguration {
  timeoutMinutes?: number;
  crossAccountRole?: string;
  externalId?: string;
  regionAndRoutingControls: RegionAndRoutingControls;
}
export const ArcRoutingControlConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    crossAccountRole: S.optional(S.String),
    externalId: S.optional(S.String),
    regionAndRoutingControls: RegionAndRoutingControls,
  }),
).annotations({
  identifier: "ArcRoutingControlConfiguration",
}) as any as S.Schema<ArcRoutingControlConfiguration>;
export type RegionalScalingResource = {
  [key: string]: KubernetesScalingResource;
};
export const RegionalScalingResource = S.Record({
  key: S.String,
  value: KubernetesScalingResource,
});
export type KubernetesScalingApplication = {
  [key: string]: RegionalScalingResource;
};
export const KubernetesScalingApplication = S.Record({
  key: S.String,
  value: RegionalScalingResource,
});
export type KubernetesScalingApps = KubernetesScalingApplication[];
export const KubernetesScalingApps = S.Array(KubernetesScalingApplication);
export interface EksResourceScalingConfiguration {
  timeoutMinutes?: number;
  kubernetesResourceType: KubernetesResourceType;
  scalingResources?: KubernetesScalingApps;
  eksClusters?: EksClusters;
  ungraceful?: EksResourceScalingUngraceful;
  targetPercent?: number;
  capacityMonitoringApproach?: string;
}
export const EksResourceScalingConfiguration = S.suspend(() =>
  S.Struct({
    timeoutMinutes: S.optional(S.Number),
    kubernetesResourceType: KubernetesResourceType,
    scalingResources: S.optional(KubernetesScalingApps),
    eksClusters: S.optional(EksClusters),
    ungraceful: S.optional(EksResourceScalingUngraceful),
    targetPercent: S.optional(S.Number),
    capacityMonitoringApproach: S.optional(S.String),
  }),
).annotations({
  identifier: "EksResourceScalingConfiguration",
}) as any as S.Schema<EksResourceScalingConfiguration>;
export type ExecutionBlockConfiguration =
  | { customActionLambdaConfig: CustomActionLambdaConfiguration }
  | { ec2AsgCapacityIncreaseConfig: Ec2AsgCapacityIncreaseConfiguration }
  | { executionApprovalConfig: ExecutionApprovalConfiguration }
  | { arcRoutingControlConfig: ArcRoutingControlConfiguration }
  | { globalAuroraConfig: GlobalAuroraConfiguration }
  | { parallelConfig: ParallelExecutionBlockConfiguration }
  | { regionSwitchPlanConfig: RegionSwitchPlanConfiguration }
  | { ecsCapacityIncreaseConfig: EcsCapacityIncreaseConfiguration }
  | { eksResourceScalingConfig: EksResourceScalingConfiguration }
  | { route53HealthCheckConfig: Route53HealthCheckConfiguration }
  | { documentDbConfig: DocumentDbConfiguration };
export const ExecutionBlockConfiguration = S.Union(
  S.Struct({ customActionLambdaConfig: CustomActionLambdaConfiguration }),
  S.Struct({
    ec2AsgCapacityIncreaseConfig: Ec2AsgCapacityIncreaseConfiguration,
  }),
  S.Struct({ executionApprovalConfig: ExecutionApprovalConfiguration }),
  S.Struct({ arcRoutingControlConfig: ArcRoutingControlConfiguration }),
  S.Struct({ globalAuroraConfig: GlobalAuroraConfiguration }),
  S.Struct({
    parallelConfig: S.suspend(
      (): S.Schema<ParallelExecutionBlockConfiguration, any> =>
        ParallelExecutionBlockConfiguration,
    ).annotations({ identifier: "ParallelExecutionBlockConfiguration" }),
  }),
  S.Struct({ regionSwitchPlanConfig: RegionSwitchPlanConfiguration }),
  S.Struct({ ecsCapacityIncreaseConfig: EcsCapacityIncreaseConfiguration }),
  S.Struct({ eksResourceScalingConfig: EksResourceScalingConfiguration }),
  S.Struct({ route53HealthCheckConfig: Route53HealthCheckConfiguration }),
  S.Struct({ documentDbConfig: DocumentDbConfiguration }),
) as any as S.Schema<ExecutionBlockConfiguration>;
export interface Step {
  name: string;
  description?: string;
  executionBlockConfiguration: ExecutionBlockConfiguration;
  executionBlockType: string;
}
export const Step = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    executionBlockConfiguration: S.suspend(
      () => ExecutionBlockConfiguration,
    ).annotations({ identifier: "ExecutionBlockConfiguration" }),
    executionBlockType: S.String,
  }),
).annotations({ identifier: "Step" }) as any as S.Schema<Step>;
export interface CreatePlanRequest {
  description?: string;
  workflows: WorkflowList;
  executionRole: string;
  recoveryTimeObjectiveMinutes?: number;
  associatedAlarms?: AssociatedAlarmMap;
  triggers?: TriggerList;
  reportConfiguration?: ReportConfiguration;
  name: string;
  regions: RegionList;
  recoveryApproach: string;
  primaryRegion?: string;
  tags?: Tags;
}
export const CreatePlanRequest = S.suspend(() =>
  S.Struct({
    description: S.optional(S.String),
    workflows: WorkflowList,
    executionRole: S.String,
    recoveryTimeObjectiveMinutes: S.optional(S.Number),
    associatedAlarms: S.optional(AssociatedAlarmMap),
    triggers: S.optional(TriggerList),
    reportConfiguration: S.optional(ReportConfiguration),
    name: S.String,
    regions: RegionList,
    recoveryApproach: S.String,
    primaryRegion: S.optional(S.String),
    tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
      T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
    ),
  ),
).annotations({
  identifier: "CreatePlanRequest",
}) as any as S.Schema<CreatePlanRequest>;
export interface CreatePlanResponse {
  plan?: Plan;
}
export const CreatePlanResponse = S.suspend(() =>
  S.Struct({ plan: S.optional(Plan) }),
).annotations({
  identifier: "CreatePlanResponse",
}) as any as S.Schema<CreatePlanResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class IllegalStateException extends S.TaggedError<IllegalStateException>()(
  "IllegalStateException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists all Region switch plans in your Amazon Web Services account.
 */
export const listPlans: {
  (
    input: ListPlansRequest,
  ): Effect.Effect<
    ListPlansResponse,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlansRequest,
  ) => Stream.Stream<
    ListPlansResponse,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPlansRequest,
  ) => Stream.Stream<
    AbbreviatedPlan,
    CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlansRequest,
  output: ListPlansResponse,
  errors: [],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "plans",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Approves a step in a plan execution that requires manual approval. When you create a plan, you can include approval steps that require manual intervention before the execution can proceed. This operation allows you to provide that approval.
 *
 * You must specify the plan ARN, execution ID, step name, and approval status. You can also provide an optional comment explaining the approval decision.
 */
export const approvePlanExecutionStep: (
  input: ApprovePlanExecutionStepRequest,
) => Effect.Effect<
  ApprovePlanExecutionStepResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApprovePlanExecutionStepRequest,
  output: ApprovePlanExecutionStepResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Lists the events that occurred during a plan execution. These events provide a detailed timeline of the execution process.
 */
export const listPlanExecutionEvents: {
  (
    input: ListPlanExecutionEventsRequest,
  ): Effect.Effect<
    ListPlanExecutionEventsResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlanExecutionEventsRequest,
  ) => Stream.Stream<
    ListPlanExecutionEventsResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPlanExecutionEventsRequest,
  ) => Stream.Stream<
    ExecutionEvent,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlanExecutionEventsRequest,
  output: ListPlanExecutionEventsResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the executions of a Region switch plan. This operation returns information about both current and historical executions.
 */
export const listPlanExecutions: {
  (
    input: ListPlanExecutionsRequest,
  ): Effect.Effect<
    ListPlanExecutionsResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlanExecutionsRequest,
  ) => Stream.Stream<
    ListPlanExecutionsResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPlanExecutionsRequest,
  ) => Stream.Stream<
    AbbreviatedExecution,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlanExecutionsRequest,
  output: ListPlanExecutionsResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all Region switch plans in your Amazon Web Services account that are available in the current Amazon Web Services Region.
 */
export const listPlansInRegion: {
  (
    input: ListPlansInRegionRequest,
  ): Effect.Effect<
    ListPlansInRegionResponse,
    AccessDeniedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListPlansInRegionRequest,
  ) => Stream.Stream<
    ListPlansInRegionResponse,
    AccessDeniedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListPlansInRegionRequest,
  ) => Stream.Stream<
    AbbreviatedPlan,
    AccessDeniedException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPlansInRegionRequest,
  output: ListPlansInRegionResponse,
  errors: [AccessDeniedException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "plans",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the Amazon Route 53 health checks.
 */
export const listRoute53HealthChecks: {
  (
    input: ListRoute53HealthChecksRequest,
  ): Effect.Effect<
    ListRoute53HealthChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoute53HealthChecksRequest,
  ) => Stream.Stream<
    ListRoute53HealthChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRoute53HealthChecksRequest,
  ) => Stream.Stream<
    Route53HealthCheck,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoute53HealthChecksRequest,
  output: ListRoute53HealthChecksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "healthChecks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the Amazon Route 53 health checks in a specific Amazon Web Services Region.
 */
export const listRoute53HealthChecksInRegion: {
  (
    input: ListRoute53HealthChecksInRegionRequest,
  ): Effect.Effect<
    ListRoute53HealthChecksInRegionResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRoute53HealthChecksInRegionRequest,
  ) => Stream.Stream<
    ListRoute53HealthChecksInRegionResponse,
    | AccessDeniedException
    | IllegalArgumentException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRoute53HealthChecksInRegionRequest,
  ) => Stream.Stream<
    Route53HealthCheck,
    | AccessDeniedException
    | IllegalArgumentException
    | InternalServerException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRoute53HealthChecksInRegionRequest,
  output: ListRoute53HealthChecksInRegionResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    InternalServerException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "healthChecks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves information about a Region switch plan in a specific Amazon Web Services Region. This operation is useful for getting Region-specific information about a plan.
 */
export const getPlanInRegion: (
  input: GetPlanInRegionRequest,
) => Effect.Effect<
  GetPlanInRegionResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlanInRegionRequest,
  output: GetPlanInRegionResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Retrieves detailed information about a Region switch plan. You must specify the ARN of the plan.
 */
export const getPlan: (
  input: GetPlanRequest,
) => Effect.Effect<
  GetPlanResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlanRequest,
  output: GetPlanResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates an existing Region switch plan. You can modify the plan's description, workflows, execution role, recovery time objective, associated alarms, and triggers.
 */
export const updatePlan: (
  input: UpdatePlanRequest,
) => Effect.Effect<
  UpdatePlanResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePlanRequest,
  output: UpdatePlanResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a Region switch plan. You must specify the ARN of the plan to delete.
 *
 * You cannot delete a plan that has an active execution in progress.
 */
export const deletePlan: (
  input: DeletePlanRequest,
) => Effect.Effect<
  DeletePlanResponse,
  IllegalStateException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlanRequest,
  output: DeletePlanResponse,
  errors: [IllegalStateException, ResourceNotFoundException],
}));
/**
 * Adds or updates tags for a Region switch resource. You can assign metadata to your resources in the form of tags, which are key-value pairs.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Cancels an in-progress plan execution. This operation stops the execution of the plan and prevents any further steps from being processed.
 *
 * You must specify the plan ARN and execution ID. You can also provide an optional comment explaining why the execution was canceled.
 */
export const cancelPlanExecution: (
  input: CancelPlanExecutionRequest,
) => Effect.Effect<
  CancelPlanExecutionResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelPlanExecutionRequest,
  output: CancelPlanExecutionResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Updates an in-progress plan execution. This operation allows you to modify certain aspects of the execution, such as adding a comment or changing the action.
 */
export const updatePlanExecution: (
  input: UpdatePlanExecutionRequest,
) => Effect.Effect<
  UpdatePlanExecutionResponse,
  | AccessDeniedException
  | IllegalStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePlanExecutionRequest,
  output: UpdatePlanExecutionResponse,
  errors: [
    AccessDeniedException,
    IllegalStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a specific step in an in-progress plan execution. This operation allows you to modify the step's comment or action.
 */
export const updatePlanExecutionStep: (
  input: UpdatePlanExecutionStepRequest,
) => Effect.Effect<
  UpdatePlanExecutionStepResponse,
  AccessDeniedException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePlanExecutionStepRequest,
  output: UpdatePlanExecutionStepResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Removes tags from a Region switch resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Lists the tags attached to a Region switch resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  InternalServerException | ResourceNotFoundException | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Starts the execution of a Region switch plan. You can execute a plan in either PRACTICE or RECOVERY mode.
 *
 * In PRACTICE mode, the execution simulates the steps without making actual changes to your application's traffic routing. In RECOVERY mode, the execution performs actual changes to shift traffic between Regions.
 */
export const startPlanExecution: (
  input: StartPlanExecutionRequest,
) => Effect.Effect<
  StartPlanExecutionResponse,
  | AccessDeniedException
  | IllegalArgumentException
  | IllegalStateException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartPlanExecutionRequest,
  output: StartPlanExecutionResponse,
  errors: [
    AccessDeniedException,
    IllegalArgumentException,
    IllegalStateException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the evaluation status of a Region switch plan. The evaluation status provides information about the last time the plan was evaluated and any warnings or issues detected.
 */
export const getPlanEvaluationStatus: {
  (
    input: GetPlanEvaluationStatusRequest,
  ): Effect.Effect<
    GetPlanEvaluationStatusResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetPlanEvaluationStatusRequest,
  ) => Stream.Stream<
    GetPlanEvaluationStatusResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetPlanEvaluationStatusRequest,
  ) => Stream.Stream<
    ResourceWarning,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPlanEvaluationStatusRequest,
  output: GetPlanEvaluationStatusResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "warnings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves detailed information about a specific plan execution. You must specify the plan ARN and execution ID.
 */
export const getPlanExecution: {
  (
    input: GetPlanExecutionRequest,
  ): Effect.Effect<
    GetPlanExecutionResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetPlanExecutionRequest,
  ) => Stream.Stream<
    GetPlanExecutionResponse,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetPlanExecutionRequest,
  ) => Stream.Stream<
    StepState,
    AccessDeniedException | ResourceNotFoundException | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPlanExecutionRequest,
  output: GetPlanExecutionResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "stepStates",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new Region switch plan. A plan defines the steps required to shift traffic from one Amazon Web Services Region to another.
 *
 * You must specify a name for the plan, the primary Region, and at least one additional Region. You can also provide a description, execution role, recovery time objective, associated alarms, triggers, and workflows that define the steps to execute during a Region switch.
 */
export const createPlan: (
  input: CreatePlanRequest,
) => Effect.Effect<
  CreatePlanResponse,
  CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlanRequest,
  output: CreatePlanResponse,
  errors: [],
}));
