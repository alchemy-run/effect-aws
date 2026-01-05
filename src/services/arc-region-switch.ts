import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ARC Region switch",
  serviceShapeName: "ArcRegionSwitch",
});
const auth = T.AwsAuthSigv4({ name: "arc-region-switch" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseControlPlaneEndpoint: {
      required: false,
      documentation:
        "Whether the operation is a control plane operation. Control plane operations are routed to a centralized endpoint in the partition leader.",
      type: "boolean",
    },
  },
  rules: [
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "UseControlPlaneEndpoint" }] },
        {
          fn: "booleanEquals",
          argv: [{ ref: "UseControlPlaneEndpoint" }, true],
        },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "not",
          argv: [{ fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] }],
        },
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "stringEquals",
          argv: [
            { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
            "aws-cn",
          ],
        },
      ],
      rules: [
        {
          conditions: [],
          endpoint: {
            url: "https://arc-region-switch-control-plane.cn-north-1.{PartitionResult#dualStackDnsSuffix}",
            properties: {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "arc-region-switch",
                  signingRegion: "cn-north-1",
                },
              ],
            },
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "isSet", argv: [{ ref: "UseControlPlaneEndpoint" }] },
        {
          fn: "booleanEquals",
          argv: [{ ref: "UseControlPlaneEndpoint" }, true],
        },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
      ],
      rules: [
        {
          conditions: [
            {
              fn: "stringEquals",
              argv: [
                { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
                "aws-cn",
              ],
            },
          ],
          error:
            "Invalid Configuration: FIPS is not supported in this partition",
          type: "error",
        },
        {
          conditions: [],
          rules: [
            {
              conditions: [],
              endpoint: {
                url: "https://arc-region-switch-control-plane-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                properties: {
                  authSchemes: [
                    {
                      name: "sigv4",
                      signingName: "arc-region-switch",
                      signingRegion: "{PartitionResult#implicitGlobalRegion}",
                    },
                  ],
                },
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
      conditions: [
        { fn: "isSet", argv: [{ ref: "UseControlPlaneEndpoint" }] },
        {
          fn: "booleanEquals",
          argv: [{ ref: "UseControlPlaneEndpoint" }, true],
        },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "not",
          argv: [{ fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] }],
        },
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
      ],
      rules: [
        {
          conditions: [],
          endpoint: {
            url: "https://arc-region-switch-control-plane.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
            properties: {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "arc-region-switch",
                  signingRegion: "{PartitionResult#implicitGlobalRegion}",
                },
              ],
            },
            headers: {},
          },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
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
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      rules: [
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
                  ],
                  endpoint: {
                    url: "https://arc-region-switch-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [],
                  endpoint: {
                    url: "https://arc-region-switch.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
      type: "tree",
    },
  ],
});

//# Schemas
export const RegionList = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class ApprovePlanExecutionStepRequest extends S.Class<ApprovePlanExecutionStepRequest>(
  "ApprovePlanExecutionStepRequest",
)(
  {
    planArn: S.String,
    executionId: S.String,
    stepName: S.String,
    approval: S.String,
    comment: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ApprovePlanExecutionStepResponse extends S.Class<ApprovePlanExecutionStepResponse>(
  "ApprovePlanExecutionStepResponse",
)({}) {}
export class CancelPlanExecutionRequest extends S.Class<CancelPlanExecutionRequest>(
  "CancelPlanExecutionRequest",
)(
  { planArn: S.String, executionId: S.String, comment: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelPlanExecutionResponse extends S.Class<CancelPlanExecutionResponse>(
  "CancelPlanExecutionResponse",
)({}) {}
export class GetPlanEvaluationStatusRequest extends S.Class<GetPlanEvaluationStatusRequest>(
  "GetPlanEvaluationStatusRequest",
)(
  {
    planArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPlanExecutionRequest extends S.Class<GetPlanExecutionRequest>(
  "GetPlanExecutionRequest",
)(
  {
    planArn: S.String,
    executionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPlanInRegionRequest extends S.Class<GetPlanInRegionRequest>(
  "GetPlanInRegionRequest",
)(
  { arn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPlanExecutionEventsRequest extends S.Class<ListPlanExecutionEventsRequest>(
  "ListPlanExecutionEventsRequest",
)(
  {
    planArn: S.String,
    executionId: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    name: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPlanExecutionsRequest extends S.Class<ListPlanExecutionsRequest>(
  "ListPlanExecutionsRequest",
)(
  {
    planArn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    state: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPlansInRegionRequest extends S.Class<ListPlansInRegionRequest>(
  "ListPlansInRegionRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRoute53HealthChecksRequest extends S.Class<ListRoute53HealthChecksRequest>(
  "ListRoute53HealthChecksRequest",
)(
  {
    arn: S.String,
    hostedZoneId: S.optional(S.String),
    recordName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class ListRoute53HealthChecksInRegionRequest extends S.Class<ListRoute53HealthChecksInRegionRequest>(
  "ListRoute53HealthChecksInRegionRequest",
)(
  {
    arn: S.String,
    hostedZoneId: S.optional(S.String),
    recordName: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartPlanExecutionRequest extends S.Class<StartPlanExecutionRequest>(
  "StartPlanExecutionRequest",
)(
  {
    planArn: S.String,
    targetRegion: S.String,
    action: S.String,
    mode: S.optional(S.String),
    comment: S.optional(S.String),
    latestVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePlanExecutionRequest extends S.Class<UpdatePlanExecutionRequest>(
  "UpdatePlanExecutionRequest",
)(
  {
    planArn: S.String,
    executionId: S.String,
    action: S.String,
    comment: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePlanExecutionResponse extends S.Class<UpdatePlanExecutionResponse>(
  "UpdatePlanExecutionResponse",
)({}) {}
export class UpdatePlanExecutionStepRequest extends S.Class<UpdatePlanExecutionStepRequest>(
  "UpdatePlanExecutionStepRequest",
)(
  {
    planArn: S.String,
    executionId: S.String,
    comment: S.String,
    stepName: S.String,
    actionToTake: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePlanExecutionStepResponse extends S.Class<UpdatePlanExecutionStepResponse>(
  "UpdatePlanExecutionStepResponse",
)({}) {}
export class GetPlanRequest extends S.Class<GetPlanRequest>("GetPlanRequest")(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export type Steps = Step[];
export const Steps = S.Array(
  S.suspend((): S.Schema<Step, any> => Step),
) as any as S.Schema<Steps>;
export class Workflow extends S.Class<Workflow>("Workflow")({
  steps: S.optional(Steps),
  workflowTargetAction: S.String,
  workflowTargetRegion: S.optional(S.String),
  workflowDescription: S.optional(S.String),
}) {}
export const WorkflowList = S.Array(Workflow);
export class AssociatedAlarm extends S.Class<AssociatedAlarm>(
  "AssociatedAlarm",
)({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  resourceIdentifier: S.String,
  alarmType: S.String,
}) {}
export const AssociatedAlarmMap = S.Record({
  key: S.String,
  value: AssociatedAlarm,
});
export class TriggerCondition extends S.Class<TriggerCondition>(
  "TriggerCondition",
)({ associatedAlarmName: S.String, condition: S.String }) {}
export const TriggerConditionList = S.Array(TriggerCondition);
export class Trigger extends S.Class<Trigger>("Trigger")({
  description: S.optional(S.String),
  targetRegion: S.String,
  action: S.String,
  conditions: TriggerConditionList,
  minDelayMinutesBetweenExecutions: S.Number,
}) {}
export const TriggerList = S.Array(Trigger);
export class S3ReportOutputConfiguration extends S.Class<S3ReportOutputConfiguration>(
  "S3ReportOutputConfiguration",
)({ bucketPath: S.optional(S.String), bucketOwner: S.optional(S.String) }) {}
export const ReportOutputConfiguration = S.Union(
  S.Struct({ s3Configuration: S3ReportOutputConfiguration }),
);
export const ReportOutputList = S.Array(ReportOutputConfiguration);
export class ReportConfiguration extends S.Class<ReportConfiguration>(
  "ReportConfiguration",
)({ reportOutput: S.optional(ReportOutputList) }) {}
export class UpdatePlanRequest extends S.Class<UpdatePlanRequest>(
  "UpdatePlanRequest",
)(
  {
    arn: S.String,
    description: S.optional(S.String),
    workflows: WorkflowList,
    executionRole: S.String,
    recoveryTimeObjectiveMinutes: S.optional(S.Number),
    associatedAlarms: S.optional(AssociatedAlarmMap),
    triggers: S.optional(TriggerList),
    reportConfiguration: S.optional(ReportConfiguration),
  },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class DeletePlanRequest extends S.Class<DeletePlanRequest>(
  "DeletePlanRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class DeletePlanResponse extends S.Class<DeletePlanResponse>(
  "DeletePlanResponse",
)({}) {}
export class ListPlansRequest extends S.Class<ListPlansRequest>(
  "ListPlansRequest",
)(
  { maxResults: S.optional(S.Number), nextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { arn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { arn: S.String, tags: Tags },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { arn: S.String, resourceTagKeys: TagKeys },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class Plan extends S.Class<Plan>("Plan")({
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
}) {}
export class GetPlanInRegionResponse extends S.Class<GetPlanInRegionResponse>(
  "GetPlanInRegionResponse",
)({ plan: S.optional(Plan) }) {}
export class Route53HealthCheck extends S.Class<Route53HealthCheck>(
  "Route53HealthCheck",
)({
  hostedZoneId: S.String,
  recordName: S.String,
  healthCheckId: S.optional(S.String),
  status: S.optional(S.String),
  region: S.String,
}) {}
export const Route53HealthCheckList = S.Array(Route53HealthCheck);
export class ListRoute53HealthChecksInRegionResponse extends S.Class<ListRoute53HealthChecksInRegionResponse>(
  "ListRoute53HealthChecksInRegionResponse",
)({
  healthChecks: S.optional(Route53HealthCheckList),
  nextToken: S.optional(S.String),
}) {}
export class StartPlanExecutionResponse extends S.Class<StartPlanExecutionResponse>(
  "StartPlanExecutionResponse",
)({
  executionId: S.optional(S.String),
  plan: S.optional(S.String),
  planVersion: S.optional(S.String),
  activateRegion: S.optional(S.String),
  deactivateRegion: S.optional(S.String),
}) {}
export class GetPlanResponse extends S.Class<GetPlanResponse>(
  "GetPlanResponse",
)({ plan: S.optional(Plan) }) {}
export class UpdatePlanResponse extends S.Class<UpdatePlanResponse>(
  "UpdatePlanResponse",
)({ plan: S.optional(Plan) }) {}
export class AbbreviatedPlan extends S.Class<AbbreviatedPlan>(
  "AbbreviatedPlan",
)({
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
}) {}
export const PlanList = S.Array(AbbreviatedPlan);
export class ListPlansResponse extends S.Class<ListPlansResponse>(
  "ListPlansResponse",
)({ plans: S.optional(PlanList), nextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ resourceTags: S.optional(Tags) }) {}
export const Resources = S.Array(S.String);
export class StepState extends S.Class<StepState>("StepState")({
  name: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stepMode: S.optional(S.String),
}) {}
export const StepStates = S.Array(StepState);
export class ExecutionEvent extends S.Class<ExecutionEvent>("ExecutionEvent")({
  timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  type: S.optional(S.String),
  stepName: S.optional(S.String),
  executionBlockType: S.optional(S.String),
  resources: S.optional(Resources),
  error: S.optional(S.String),
  description: S.optional(S.String),
  eventId: S.String,
  previousEventId: S.optional(S.String),
}) {}
export const ExecutionEventList = S.Array(ExecutionEvent);
export class AbbreviatedExecution extends S.Class<AbbreviatedExecution>(
  "AbbreviatedExecution",
)({
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
}) {}
export const AbbreviatedExecutionsList = S.Array(AbbreviatedExecution);
export class ListPlanExecutionEventsResponse extends S.Class<ListPlanExecutionEventsResponse>(
  "ListPlanExecutionEventsResponse",
)({ items: S.optional(ExecutionEventList), nextToken: S.optional(S.String) }) {}
export class ListPlanExecutionsResponse extends S.Class<ListPlanExecutionsResponse>(
  "ListPlanExecutionsResponse",
)({
  items: S.optional(AbbreviatedExecutionsList),
  nextToken: S.optional(S.String),
}) {}
export class ListPlansInRegionResponse extends S.Class<ListPlansInRegionResponse>(
  "ListPlansInRegionResponse",
)({ plans: S.optional(PlanList), nextToken: S.optional(S.String) }) {}
export class ListRoute53HealthChecksResponse extends S.Class<ListRoute53HealthChecksResponse>(
  "ListRoute53HealthChecksResponse",
)({
  healthChecks: S.optional(Route53HealthCheckList),
  nextToken: S.optional(S.String),
}) {}
export const AuroraClusterArns = S.Array(S.String);
export const DocumentDbClusterArns = S.Array(S.String);
export class MinimalWorkflow extends S.Class<MinimalWorkflow>(
  "MinimalWorkflow",
)({ action: S.optional(S.String), name: S.optional(S.String) }) {}
export class ExecutionApprovalConfiguration extends S.Class<ExecutionApprovalConfiguration>(
  "ExecutionApprovalConfiguration",
)({ timeoutMinutes: S.optional(S.Number), approvalRole: S.String }) {}
export class ParallelExecutionBlockConfiguration extends S.Class<ParallelExecutionBlockConfiguration>(
  "ParallelExecutionBlockConfiguration",
)({ steps: S.suspend(() => Steps) }) {}
export class RegionSwitchPlanConfiguration extends S.Class<RegionSwitchPlanConfiguration>(
  "RegionSwitchPlanConfiguration",
)({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  arn: S.String,
}) {}
export class ResourceWarning extends S.Class<ResourceWarning>(
  "ResourceWarning",
)({
  workflow: S.optional(MinimalWorkflow),
  version: S.String,
  stepName: S.optional(S.String),
  resourceArn: S.optional(S.String),
  warningStatus: S.String,
  warningUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  warningMessage: S.String,
}) {}
export const PlanWarnings = S.Array(ResourceWarning);
export class S3ReportOutput extends S.Class<S3ReportOutput>("S3ReportOutput")({
  s3ObjectKey: S.optional(S.String),
}) {}
export class FailedReportOutput extends S.Class<FailedReportOutput>(
  "FailedReportOutput",
)({ errorCode: S.optional(S.String), errorMessage: S.optional(S.String) }) {}
export class GetPlanEvaluationStatusResponse extends S.Class<GetPlanEvaluationStatusResponse>(
  "GetPlanEvaluationStatusResponse",
)({
  planArn: S.String,
  lastEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastEvaluatedVersion: S.optional(S.String),
  region: S.optional(S.String),
  evaluationState: S.optional(S.String),
  warnings: S.optional(PlanWarnings),
  nextToken: S.optional(S.String),
}) {}
export class Lambdas extends S.Class<Lambdas>("Lambdas")({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const LambdaList = S.Array(Lambdas);
export class LambdaUngraceful extends S.Class<LambdaUngraceful>(
  "LambdaUngraceful",
)({ behavior: S.optional(S.String) }) {}
export class Asg extends S.Class<Asg>("Asg")({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  arn: S.optional(S.String),
}) {}
export const AsgList = S.Array(Asg);
export class Ec2Ungraceful extends S.Class<Ec2Ungraceful>("Ec2Ungraceful")({
  minimumSuccessPercentage: S.Number,
}) {}
export class GlobalAuroraUngraceful extends S.Class<GlobalAuroraUngraceful>(
  "GlobalAuroraUngraceful",
)({ ungraceful: S.optional(S.String) }) {}
export class Service extends S.Class<Service>("Service")({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  clusterArn: S.optional(S.String),
  serviceArn: S.optional(S.String),
}) {}
export const ServiceList = S.Array(Service);
export class EcsUngraceful extends S.Class<EcsUngraceful>("EcsUngraceful")({
  minimumSuccessPercentage: S.Number,
}) {}
export class KubernetesResourceType extends S.Class<KubernetesResourceType>(
  "KubernetesResourceType",
)({ apiVersion: S.String, kind: S.String }) {}
export class EksCluster extends S.Class<EksCluster>("EksCluster")({
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  clusterArn: S.String,
}) {}
export const EksClusters = S.Array(EksCluster);
export class EksResourceScalingUngraceful extends S.Class<EksResourceScalingUngraceful>(
  "EksResourceScalingUngraceful",
)({ minimumSuccessPercentage: S.Number }) {}
export class Route53ResourceRecordSet extends S.Class<Route53ResourceRecordSet>(
  "Route53ResourceRecordSet",
)({
  recordSetIdentifier: S.optional(S.String),
  region: S.optional(S.String),
}) {}
export const Route53ResourceRecordSetList = S.Array(Route53ResourceRecordSet);
export class DocumentDbUngraceful extends S.Class<DocumentDbUngraceful>(
  "DocumentDbUngraceful",
)({ ungraceful: S.optional(S.String) }) {}
export const ReportOutput = S.Union(
  S.Struct({ s3ReportOutput: S3ReportOutput }),
  S.Struct({ failedReportOutput: FailedReportOutput }),
);
export class CustomActionLambdaConfiguration extends S.Class<CustomActionLambdaConfiguration>(
  "CustomActionLambdaConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  lambdas: LambdaList,
  retryIntervalMinutes: S.Number,
  regionToRun: S.String,
  ungraceful: S.optional(LambdaUngraceful),
}) {}
export class Ec2AsgCapacityIncreaseConfiguration extends S.Class<Ec2AsgCapacityIncreaseConfiguration>(
  "Ec2AsgCapacityIncreaseConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  asgs: AsgList,
  ungraceful: S.optional(Ec2Ungraceful),
  targetPercent: S.optional(S.Number),
  capacityMonitoringApproach: S.optional(S.String),
}) {}
export class GlobalAuroraConfiguration extends S.Class<GlobalAuroraConfiguration>(
  "GlobalAuroraConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  behavior: S.String,
  ungraceful: S.optional(GlobalAuroraUngraceful),
  globalClusterIdentifier: S.String,
  databaseClusterArns: AuroraClusterArns,
}) {}
export class EcsCapacityIncreaseConfiguration extends S.Class<EcsCapacityIncreaseConfiguration>(
  "EcsCapacityIncreaseConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  services: ServiceList,
  ungraceful: S.optional(EcsUngraceful),
  targetPercent: S.optional(S.Number),
  capacityMonitoringApproach: S.optional(S.String),
}) {}
export class Route53HealthCheckConfiguration extends S.Class<Route53HealthCheckConfiguration>(
  "Route53HealthCheckConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  hostedZoneId: S.String,
  recordName: S.String,
  recordSets: S.optional(Route53ResourceRecordSetList),
}) {}
export class DocumentDbConfiguration extends S.Class<DocumentDbConfiguration>(
  "DocumentDbConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  behavior: S.String,
  ungraceful: S.optional(DocumentDbUngraceful),
  globalClusterIdentifier: S.String,
  databaseClusterArns: DocumentDbClusterArns,
}) {}
export class GeneratedReport extends S.Class<GeneratedReport>(
  "GeneratedReport",
)({
  reportGenerationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  reportOutput: S.optional(ReportOutput),
}) {}
export const GeneratedReportDetails = S.Array(GeneratedReport);
export class ArcRoutingControlState extends S.Class<ArcRoutingControlState>(
  "ArcRoutingControlState",
)({ routingControlArn: S.String, state: S.String }) {}
export const ArcRoutingControlStates = S.Array(ArcRoutingControlState);
export class GetPlanExecutionResponse extends S.Class<GetPlanExecutionResponse>(
  "GetPlanExecutionResponse",
)({
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
}) {}
export const RegionAndRoutingControls = S.Record({
  key: S.String,
  value: ArcRoutingControlStates,
});
export class KubernetesScalingResource extends S.Class<KubernetesScalingResource>(
  "KubernetesScalingResource",
)({ namespace: S.String, name: S.String, hpaName: S.optional(S.String) }) {}
export class ArcRoutingControlConfiguration extends S.Class<ArcRoutingControlConfiguration>(
  "ArcRoutingControlConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  crossAccountRole: S.optional(S.String),
  externalId: S.optional(S.String),
  regionAndRoutingControls: RegionAndRoutingControls,
}) {}
export const RegionalScalingResource = S.Record({
  key: S.String,
  value: KubernetesScalingResource,
});
export const KubernetesScalingApplication = S.Record({
  key: S.String,
  value: RegionalScalingResource,
});
export const KubernetesScalingApps = S.Array(KubernetesScalingApplication);
export class EksResourceScalingConfiguration extends S.Class<EksResourceScalingConfiguration>(
  "EksResourceScalingConfiguration",
)({
  timeoutMinutes: S.optional(S.Number),
  kubernetesResourceType: KubernetesResourceType,
  scalingResources: S.optional(KubernetesScalingApps),
  eksClusters: S.optional(EksClusters),
  ungraceful: S.optional(EksResourceScalingUngraceful),
  targetPercent: S.optional(S.Number),
  capacityMonitoringApproach: S.optional(S.String),
}) {}
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
    ),
  }),
  S.Struct({ regionSwitchPlanConfig: RegionSwitchPlanConfiguration }),
  S.Struct({ ecsCapacityIncreaseConfig: EcsCapacityIncreaseConfiguration }),
  S.Struct({ eksResourceScalingConfig: EksResourceScalingConfiguration }),
  S.Struct({ route53HealthCheckConfig: Route53HealthCheckConfiguration }),
  S.Struct({ documentDbConfig: DocumentDbConfiguration }),
) as any as S.Schema<ExecutionBlockConfiguration>;
export class Step extends S.Class<Step>("Step")({
  name: S.String,
  description: S.optional(S.String),
  executionBlockConfiguration: S.suspend(() => ExecutionBlockConfiguration),
  executionBlockType: S.String,
}) {}
export class CreatePlanRequest extends S.Class<CreatePlanRequest>(
  "CreatePlanRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
    T.StaticContextParams({ UseControlPlaneEndpoint: { value: true } }),
  ),
) {}
export class CreatePlanResponse extends S.Class<CreatePlanResponse>(
  "CreatePlanResponse",
)({ plan: S.optional(Plan) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class IllegalStateException extends S.TaggedError<IllegalStateException>()(
  "IllegalStateException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class IllegalArgumentException extends S.TaggedError<IllegalArgumentException>()(
  "IllegalArgumentException",
  { message: S.String },
) {}

//# Operations
/**
 * Lists all Region switch plans in your Amazon Web Services account.
 */
export const listPlans = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const approvePlanExecutionStep = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ApprovePlanExecutionStepRequest,
    output: ApprovePlanExecutionStepResponse,
    errors: [AccessDeniedException, ResourceNotFoundException],
  }),
);
/**
 * Lists the events that occurred during a plan execution. These events provide a detailed timeline of the execution process.
 */
export const listPlanExecutionEvents =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listPlanExecutions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPlanExecutionsRequest,
    output: ListPlanExecutionsResponse,
    errors: [AccessDeniedException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "items",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all Region switch plans in your Amazon Web Services account that are available in the current Amazon Web Services Region.
 */
export const listPlansInRegion = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPlansInRegionRequest,
    output: ListPlansInRegionResponse,
    errors: [AccessDeniedException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "plans",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List the Amazon Route 53 health checks.
 */
export const listRoute53HealthChecks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRoute53HealthChecksInRegion =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getPlanInRegion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlanInRegionRequest,
  output: GetPlanInRegionResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Retrieves detailed information about a Region switch plan. You must specify the ARN of the plan.
 */
export const getPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlanRequest,
  output: GetPlanResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Updates an existing Region switch plan. You can modify the plan's description, workflows, execution role, recovery time objective, associated alarms, and triggers.
 */
export const updatePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePlanRequest,
  output: UpdatePlanResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes a Region switch plan. You must specify the ARN of the plan to delete.
 *
 * You cannot delete a plan that has an active execution in progress.
 */
export const deletePlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePlanRequest,
  output: DeletePlanResponse,
  errors: [IllegalStateException, ResourceNotFoundException],
}));
/**
 * Adds or updates tags for a Region switch resource. You can assign metadata to your resources in the form of tags, which are key-value pairs.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Cancels an in-progress plan execution. This operation stops the execution of the plan and prevents any further steps from being processed.
 *
 * You must specify the plan ARN and execution ID. You can also provide an optional comment explaining why the execution was canceled.
 */
export const cancelPlanExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelPlanExecutionRequest,
  output: CancelPlanExecutionResponse,
  errors: [AccessDeniedException, ResourceNotFoundException],
}));
/**
 * Updates an in-progress plan execution. This operation allows you to modify certain aspects of the execution, such as adding a comment or changing the action.
 */
export const updatePlanExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePlanExecutionStep = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePlanExecutionStepRequest,
    output: UpdatePlanExecutionStepResponse,
    errors: [AccessDeniedException, ResourceNotFoundException],
  }),
);
/**
 * Removes tags from a Region switch resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Lists the tags attached to a Region switch resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalServerException, ResourceNotFoundException],
}));
/**
 * Starts the execution of a Region switch plan. You can execute a plan in either PRACTICE or RECOVERY mode.
 *
 * In PRACTICE mode, the execution simulates the steps without making actual changes to your application's traffic routing. In RECOVERY mode, the execution performs actual changes to shift traffic between Regions.
 */
export const startPlanExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPlanEvaluationStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getPlanExecution = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetPlanExecutionRequest,
    output: GetPlanExecutionResponse,
    errors: [AccessDeniedException, ResourceNotFoundException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "stepStates",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a new Region switch plan. A plan defines the steps required to shift traffic from one Amazon Web Services Region to another.
 *
 * You must specify a name for the plan, the primary Region, and at least one additional Region. You can also provide a description, execution role, recovery time objective, associated alarms, triggers, and workflows that define the steps to execute during a Region switch.
 */
export const createPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePlanRequest,
  output: CreatePlanResponse,
  errors: [],
}));
