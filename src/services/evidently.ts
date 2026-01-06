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
const svc = T.AwsApiService({
  sdkId: "Evidently",
  serviceShapeName: "Evidently",
});
const auth = T.AwsAuthSigv4({ name: "evidently" });
const ver = T.ServiceVersion("2021-02-01");
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
                        url: "https://evidently-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://evidently-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://evidently.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://evidently.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type Arn = string;
export type SegmentPattern = string;
export type JsonValue = string;
export type TagKey = string;
export type ProjectName = string;
export type Description = string;
export type ProjectRef = string;
export type MaxProjects = number;
export type NextToken = string;
export type FeatureName = string;
export type EntityId = string;
export type ExperimentName = string;
export type RandomizationSalt = string;
export type SplitWeight = number;
export type SegmentRef = string;
export type MaxExperiments = number;
export type ExperimentStatus = string;
export type CwDimensionSafeName = string;
export type TreatmentName = string;
export type ExperimentBaseStat = string;
export type ExperimentResultRequestType = string;
export type ExperimentReportName = string;
export type ResultsPeriod = number;
export type ExperimentStopDesiredState = string;
export type FeatureEvaluationStrategy = string;
export type VariationName = string;
export type MaxFeatures = number;
export type LaunchName = string;
export type MaxLaunches = number;
export type LaunchStatus = string;
export type LaunchStopDesiredState = string;
export type SegmentName = string;
export type MaxSegments = number;
export type MaxReferences = number;
export type SegmentReferenceResourceType = string;
export type TagValue = string;
export type AppConfigResourceId = string;
export type EventType = string;
export type S3BucketSafeName = string;
export type S3PrefixSafeName = string;
export type CwLogGroupSafeName = string;
export type ChangeDirectionEnum = string;
export type GroupName = string;
export type JsonPath = string;
export type MetricUnitLabel = string;
export type ProjectArn = string;
export type ProjectStatus = string;
export type ExperimentArn = string;
export type SegmentArn = string;
export type ExperimentType = string;
export type ExperimentResultResponseType = string;
export type FeatureArn = string;
export type FeatureStatus = string;
export type VariationValueType = string;
export type LaunchArn = string;
export type LaunchType = string;
export type RuleName = string;
export type RuleType = string;
export type Uuid = string;
export type ErrorCodeEnum = string;
export type ErrorMessage = string;
export type ValidationExceptionReason = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type MetricNameList = string[];
export const MetricNameList = S.Array(S.String);
export type TreatmentNameList = string[];
export const TreatmentNameList = S.Array(S.String);
export type ExperimentResultRequestTypeList = string[];
export const ExperimentResultRequestTypeList = S.Array(S.String);
export type ExperimentReportNameList = string[];
export const ExperimentReportNameList = S.Array(S.String);
export type VariationNameList = string[];
export const VariationNameList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export interface TestSegmentPatternRequest {
  pattern: string;
  payload: string;
}
export const TestSegmentPatternRequest = S.suspend(() =>
  S.Struct({ pattern: S.String, payload: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/test-segment-pattern" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestSegmentPatternRequest",
}) as any as S.Schema<TestSegmentPatternRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetProjectRequest {
  project: string;
}
export const GetProjectRequest = S.suspend(() =>
  S.Struct({ project: S.String.pipe(T.HttpLabel("project")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetProjectRequest",
}) as any as S.Schema<GetProjectRequest>;
export interface DeleteProjectRequest {
  project: string;
}
export const DeleteProjectRequest = S.suspend(() =>
  S.Struct({ project: S.String.pipe(T.HttpLabel("project")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/projects/{project}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteProjectRequest",
}) as any as S.Schema<DeleteProjectRequest>;
export interface DeleteProjectResponse {}
export const DeleteProjectResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProjectResponse",
}) as any as S.Schema<DeleteProjectResponse>;
export interface ListProjectsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListProjectsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListProjectsRequest",
}) as any as S.Schema<ListProjectsRequest>;
export interface EvaluateFeatureRequest {
  project: string;
  feature: string;
  entityId: string;
  evaluationContext?: string;
}
export const EvaluateFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
    entityId: S.String,
    evaluationContext: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/evaluations/{feature}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EvaluateFeatureRequest",
}) as any as S.Schema<EvaluateFeatureRequest>;
export interface ProjectAppConfigResourceConfig {
  applicationId?: string;
  environmentId?: string;
}
export const ProjectAppConfigResourceConfig = S.suspend(() =>
  S.Struct({
    applicationId: S.optional(S.String),
    environmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "ProjectAppConfigResourceConfig",
}) as any as S.Schema<ProjectAppConfigResourceConfig>;
export interface UpdateProjectRequest {
  project: string;
  appConfigResource?: ProjectAppConfigResourceConfig;
  description?: string;
}
export const UpdateProjectRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    appConfigResource: S.optional(ProjectAppConfigResourceConfig),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/projects/{project}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectRequest",
}) as any as S.Schema<UpdateProjectRequest>;
export interface GetExperimentRequest {
  project: string;
  experiment: string;
}
export const GetExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/projects/{project}/experiments/{experiment}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExperimentRequest",
}) as any as S.Schema<GetExperimentRequest>;
export interface TreatmentConfig {
  name: string;
  description?: string;
  feature: string;
  variation: string;
}
export const TreatmentConfig = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    feature: S.String,
    variation: S.String,
  }),
).annotations({
  identifier: "TreatmentConfig",
}) as any as S.Schema<TreatmentConfig>;
export type TreatmentConfigList = TreatmentConfig[];
export const TreatmentConfigList = S.Array(TreatmentConfig);
export interface MetricDefinitionConfig {
  name: string;
  entityIdKey: string;
  valueKey: string;
  eventPattern?: string;
  unitLabel?: string;
}
export const MetricDefinitionConfig = S.suspend(() =>
  S.Struct({
    name: S.String,
    entityIdKey: S.String,
    valueKey: S.String,
    eventPattern: S.optional(S.String),
    unitLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDefinitionConfig",
}) as any as S.Schema<MetricDefinitionConfig>;
export interface MetricGoalConfig {
  metricDefinition: MetricDefinitionConfig;
  desiredChange?: string;
}
export const MetricGoalConfig = S.suspend(() =>
  S.Struct({
    metricDefinition: MetricDefinitionConfig,
    desiredChange: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricGoalConfig",
}) as any as S.Schema<MetricGoalConfig>;
export type MetricGoalConfigList = MetricGoalConfig[];
export const MetricGoalConfigList = S.Array(MetricGoalConfig);
export type TreatmentToWeightMap = { [key: string]: number };
export const TreatmentToWeightMap = S.Record({
  key: S.String,
  value: S.Number,
});
export interface OnlineAbConfig {
  controlTreatmentName?: string;
  treatmentWeights?: TreatmentToWeightMap;
}
export const OnlineAbConfig = S.suspend(() =>
  S.Struct({
    controlTreatmentName: S.optional(S.String),
    treatmentWeights: S.optional(TreatmentToWeightMap),
  }),
).annotations({
  identifier: "OnlineAbConfig",
}) as any as S.Schema<OnlineAbConfig>;
export interface UpdateExperimentRequest {
  project: string;
  experiment: string;
  description?: string;
  treatments?: TreatmentConfigList;
  metricGoals?: MetricGoalConfigList;
  randomizationSalt?: string;
  samplingRate?: number;
  segment?: string;
  removeSegment?: boolean;
  onlineAbConfig?: OnlineAbConfig;
}
export const UpdateExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    description: S.optional(S.String),
    treatments: S.optional(TreatmentConfigList),
    metricGoals: S.optional(MetricGoalConfigList),
    randomizationSalt: S.optional(S.String),
    samplingRate: S.optional(S.Number),
    segment: S.optional(S.String),
    removeSegment: S.optional(S.Boolean),
    onlineAbConfig: S.optional(OnlineAbConfig),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/projects/{project}/experiments/{experiment}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateExperimentRequest",
}) as any as S.Schema<UpdateExperimentRequest>;
export interface DeleteExperimentRequest {
  project: string;
  experiment: string;
}
export const DeleteExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/projects/{project}/experiments/{experiment}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteExperimentRequest",
}) as any as S.Schema<DeleteExperimentRequest>;
export interface DeleteExperimentResponse {}
export const DeleteExperimentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteExperimentResponse",
}) as any as S.Schema<DeleteExperimentResponse>;
export interface ListExperimentsRequest {
  project: string;
  maxResults?: number;
  nextToken?: string;
  status?: string;
}
export const ListExperimentsRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}/experiments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExperimentsRequest",
}) as any as S.Schema<ListExperimentsRequest>;
export interface GetExperimentResultsRequest {
  project: string;
  experiment: string;
  startTime?: Date;
  endTime?: Date;
  metricNames: MetricNameList;
  treatmentNames: TreatmentNameList;
  baseStat?: string;
  resultStats?: ExperimentResultRequestTypeList;
  reportNames?: ExperimentReportNameList;
  period?: number;
}
export const GetExperimentResultsRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    metricNames: MetricNameList,
    treatmentNames: TreatmentNameList,
    baseStat: S.optional(S.String),
    resultStats: S.optional(ExperimentResultRequestTypeList),
    reportNames: S.optional(ExperimentReportNameList),
    period: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/experiments/{experiment}/results",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetExperimentResultsRequest",
}) as any as S.Schema<GetExperimentResultsRequest>;
export interface StartExperimentRequest {
  project: string;
  experiment: string;
  analysisCompleteTime: Date;
}
export const StartExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    analysisCompleteTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/experiments/{experiment}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartExperimentRequest",
}) as any as S.Schema<StartExperimentRequest>;
export interface StopExperimentRequest {
  project: string;
  experiment: string;
  desiredState?: string;
  reason?: string;
}
export const StopExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    experiment: S.String.pipe(T.HttpLabel("experiment")),
    desiredState: S.optional(S.String),
    reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/experiments/{experiment}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopExperimentRequest",
}) as any as S.Schema<StopExperimentRequest>;
export interface GetFeatureRequest {
  project: string;
  feature: string;
}
export const GetFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}/features/{feature}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFeatureRequest",
}) as any as S.Schema<GetFeatureRequest>;
export type VariableValue =
  | { boolValue: boolean }
  | { stringValue: string }
  | { longValue: number }
  | { doubleValue: number };
export const VariableValue = S.Union(
  S.Struct({ boolValue: S.Boolean }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
);
export interface VariationConfig {
  name: string;
  value: (typeof VariableValue)["Type"];
}
export const VariationConfig = S.suspend(() =>
  S.Struct({ name: S.String, value: VariableValue }),
).annotations({
  identifier: "VariationConfig",
}) as any as S.Schema<VariationConfig>;
export type VariationConfigsList = VariationConfig[];
export const VariationConfigsList = S.Array(VariationConfig);
export type EntityOverrideMap = { [key: string]: string };
export const EntityOverrideMap = S.Record({ key: S.String, value: S.String });
export interface UpdateFeatureRequest {
  project: string;
  feature: string;
  evaluationStrategy?: string;
  description?: string;
  addOrUpdateVariations?: VariationConfigsList;
  removeVariations?: VariationNameList;
  defaultVariation?: string;
  entityOverrides?: EntityOverrideMap;
}
export const UpdateFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
    evaluationStrategy: S.optional(S.String),
    description: S.optional(S.String),
    addOrUpdateVariations: S.optional(VariationConfigsList),
    removeVariations: S.optional(VariationNameList),
    defaultVariation: S.optional(S.String),
    entityOverrides: S.optional(EntityOverrideMap),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/projects/{project}/features/{feature}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFeatureRequest",
}) as any as S.Schema<UpdateFeatureRequest>;
export interface DeleteFeatureRequest {
  project: string;
  feature: string;
}
export const DeleteFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    feature: S.String.pipe(T.HttpLabel("feature")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/projects/{project}/features/{feature}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFeatureRequest",
}) as any as S.Schema<DeleteFeatureRequest>;
export interface DeleteFeatureResponse {}
export const DeleteFeatureResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteFeatureResponse",
}) as any as S.Schema<DeleteFeatureResponse>;
export interface ListFeaturesRequest {
  project: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListFeaturesRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}/features" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFeaturesRequest",
}) as any as S.Schema<ListFeaturesRequest>;
export interface GetLaunchRequest {
  project: string;
  launch: string;
}
export const GetLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}/launches/{launch}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLaunchRequest",
}) as any as S.Schema<GetLaunchRequest>;
export interface LaunchGroupConfig {
  name: string;
  description?: string;
  feature: string;
  variation: string;
}
export const LaunchGroupConfig = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    feature: S.String,
    variation: S.String,
  }),
).annotations({
  identifier: "LaunchGroupConfig",
}) as any as S.Schema<LaunchGroupConfig>;
export type LaunchGroupConfigList = LaunchGroupConfig[];
export const LaunchGroupConfigList = S.Array(LaunchGroupConfig);
export interface MetricMonitorConfig {
  metricDefinition: MetricDefinitionConfig;
}
export const MetricMonitorConfig = S.suspend(() =>
  S.Struct({ metricDefinition: MetricDefinitionConfig }),
).annotations({
  identifier: "MetricMonitorConfig",
}) as any as S.Schema<MetricMonitorConfig>;
export type MetricMonitorConfigList = MetricMonitorConfig[];
export const MetricMonitorConfigList = S.Array(MetricMonitorConfig);
export type GroupToWeightMap = { [key: string]: number };
export const GroupToWeightMap = S.Record({ key: S.String, value: S.Number });
export interface SegmentOverride {
  segment: string;
  evaluationOrder: number;
  weights: GroupToWeightMap;
}
export const SegmentOverride = S.suspend(() =>
  S.Struct({
    segment: S.String,
    evaluationOrder: S.Number,
    weights: GroupToWeightMap,
  }),
).annotations({
  identifier: "SegmentOverride",
}) as any as S.Schema<SegmentOverride>;
export type SegmentOverridesList = SegmentOverride[];
export const SegmentOverridesList = S.Array(SegmentOverride);
export interface ScheduledSplitConfig {
  startTime: Date;
  groupWeights: GroupToWeightMap;
  segmentOverrides?: SegmentOverridesList;
}
export const ScheduledSplitConfig = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groupWeights: GroupToWeightMap,
    segmentOverrides: S.optional(SegmentOverridesList),
  }),
).annotations({
  identifier: "ScheduledSplitConfig",
}) as any as S.Schema<ScheduledSplitConfig>;
export type ScheduledSplitConfigList = ScheduledSplitConfig[];
export const ScheduledSplitConfigList = S.Array(ScheduledSplitConfig);
export interface ScheduledSplitsLaunchConfig {
  steps: ScheduledSplitConfigList;
}
export const ScheduledSplitsLaunchConfig = S.suspend(() =>
  S.Struct({ steps: ScheduledSplitConfigList }),
).annotations({
  identifier: "ScheduledSplitsLaunchConfig",
}) as any as S.Schema<ScheduledSplitsLaunchConfig>;
export interface UpdateLaunchRequest {
  project: string;
  launch: string;
  description?: string;
  groups?: LaunchGroupConfigList;
  metricMonitors?: MetricMonitorConfigList;
  randomizationSalt?: string;
  scheduledSplitsConfig?: ScheduledSplitsLaunchConfig;
}
export const UpdateLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
    description: S.optional(S.String),
    groups: S.optional(LaunchGroupConfigList),
    metricMonitors: S.optional(MetricMonitorConfigList),
    randomizationSalt: S.optional(S.String),
    scheduledSplitsConfig: S.optional(ScheduledSplitsLaunchConfig),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/projects/{project}/launches/{launch}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLaunchRequest",
}) as any as S.Schema<UpdateLaunchRequest>;
export interface DeleteLaunchRequest {
  project: string;
  launch: string;
}
export const DeleteLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/projects/{project}/launches/{launch}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLaunchRequest",
}) as any as S.Schema<DeleteLaunchRequest>;
export interface DeleteLaunchResponse {}
export const DeleteLaunchResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteLaunchResponse",
}) as any as S.Schema<DeleteLaunchResponse>;
export interface ListLaunchesRequest {
  project: string;
  maxResults?: number;
  nextToken?: string;
  status?: string;
}
export const ListLaunchesRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/projects/{project}/launches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLaunchesRequest",
}) as any as S.Schema<ListLaunchesRequest>;
export interface StartLaunchRequest {
  project: string;
  launch: string;
}
export const StartLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/launches/{launch}/start",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartLaunchRequest",
}) as any as S.Schema<StartLaunchRequest>;
export interface StopLaunchRequest {
  project: string;
  launch: string;
  desiredState?: string;
  reason?: string;
}
export const StopLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    launch: S.String.pipe(T.HttpLabel("launch")),
    desiredState: S.optional(S.String),
    reason: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/projects/{project}/launches/{launch}/cancel",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopLaunchRequest",
}) as any as S.Schema<StopLaunchRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateSegmentRequest {
  name: string;
  pattern: string;
  description?: string;
  tags?: TagMap;
}
export const CreateSegmentRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    pattern: S.String,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/segments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSegmentRequest",
}) as any as S.Schema<CreateSegmentRequest>;
export interface GetSegmentRequest {
  segment: string;
}
export const GetSegmentRequest = S.suspend(() =>
  S.Struct({ segment: S.String.pipe(T.HttpLabel("segment")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/segments/{segment}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetSegmentRequest",
}) as any as S.Schema<GetSegmentRequest>;
export interface DeleteSegmentRequest {
  segment: string;
}
export const DeleteSegmentRequest = S.suspend(() =>
  S.Struct({ segment: S.String.pipe(T.HttpLabel("segment")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/segments/{segment}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSegmentRequest",
}) as any as S.Schema<DeleteSegmentRequest>;
export interface DeleteSegmentResponse {}
export const DeleteSegmentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteSegmentResponse",
}) as any as S.Schema<DeleteSegmentResponse>;
export interface ListSegmentsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListSegmentsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/segments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSegmentsRequest",
}) as any as S.Schema<ListSegmentsRequest>;
export interface ListSegmentReferencesRequest {
  segment: string;
  maxResults?: number;
  nextToken?: string;
  type: string;
}
export const ListSegmentReferencesRequest = S.suspend(() =>
  S.Struct({
    segment: S.String.pipe(T.HttpLabel("segment")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    type: S.String.pipe(T.HttpQuery("type")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/segments/{segment}/references" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListSegmentReferencesRequest",
}) as any as S.Schema<ListSegmentReferencesRequest>;
export interface S3DestinationConfig {
  bucket?: string;
  prefix?: string;
}
export const S3DestinationConfig = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "S3DestinationConfig",
}) as any as S.Schema<S3DestinationConfig>;
export interface CloudWatchLogsDestinationConfig {
  logGroup?: string;
}
export const CloudWatchLogsDestinationConfig = S.suspend(() =>
  S.Struct({ logGroup: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsDestinationConfig",
}) as any as S.Schema<CloudWatchLogsDestinationConfig>;
export interface ProjectDataDeliveryConfig {
  s3Destination?: S3DestinationConfig;
  cloudWatchLogs?: CloudWatchLogsDestinationConfig;
}
export const ProjectDataDeliveryConfig = S.suspend(() =>
  S.Struct({
    s3Destination: S.optional(S3DestinationConfig),
    cloudWatchLogs: S.optional(CloudWatchLogsDestinationConfig),
  }),
).annotations({
  identifier: "ProjectDataDeliveryConfig",
}) as any as S.Schema<ProjectDataDeliveryConfig>;
export interface EvaluationRequest {
  feature: string;
  entityId: string;
  evaluationContext?: string;
}
export const EvaluationRequest = S.suspend(() =>
  S.Struct({
    feature: S.String,
    entityId: S.String,
    evaluationContext: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationRequest",
}) as any as S.Schema<EvaluationRequest>;
export type EvaluationRequestsList = EvaluationRequest[];
export const EvaluationRequestsList = S.Array(EvaluationRequest);
export interface Event {
  timestamp: Date;
  type: string;
  data: string;
}
export const Event = S.suspend(() =>
  S.Struct({
    timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    type: S.String,
    data: S.String,
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(Event);
export interface ExperimentSchedule {
  analysisCompleteTime?: Date;
}
export const ExperimentSchedule = S.suspend(() =>
  S.Struct({
    analysisCompleteTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ExperimentSchedule",
}) as any as S.Schema<ExperimentSchedule>;
export interface ExperimentExecution {
  startedTime?: Date;
  endedTime?: Date;
}
export const ExperimentExecution = S.suspend(() =>
  S.Struct({
    startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ExperimentExecution",
}) as any as S.Schema<ExperimentExecution>;
export type FeatureToVariationMap = { [key: string]: string };
export const FeatureToVariationMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface Treatment {
  name: string;
  description?: string;
  featureVariations?: FeatureToVariationMap;
}
export const Treatment = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    featureVariations: S.optional(FeatureToVariationMap),
  }),
).annotations({ identifier: "Treatment" }) as any as S.Schema<Treatment>;
export type TreatmentList = Treatment[];
export const TreatmentList = S.Array(Treatment);
export interface MetricDefinition {
  name?: string;
  entityIdKey?: string;
  valueKey?: string;
  eventPattern?: string;
  unitLabel?: string;
}
export const MetricDefinition = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    entityIdKey: S.optional(S.String),
    valueKey: S.optional(S.String),
    eventPattern: S.optional(S.String),
    unitLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricDefinition",
}) as any as S.Schema<MetricDefinition>;
export interface MetricGoal {
  metricDefinition: MetricDefinition;
  desiredChange?: string;
}
export const MetricGoal = S.suspend(() =>
  S.Struct({
    metricDefinition: MetricDefinition,
    desiredChange: S.optional(S.String),
  }),
).annotations({ identifier: "MetricGoal" }) as any as S.Schema<MetricGoal>;
export type MetricGoalsList = MetricGoal[];
export const MetricGoalsList = S.Array(MetricGoal);
export interface OnlineAbDefinition {
  controlTreatmentName?: string;
  treatmentWeights?: TreatmentToWeightMap;
}
export const OnlineAbDefinition = S.suspend(() =>
  S.Struct({
    controlTreatmentName: S.optional(S.String),
    treatmentWeights: S.optional(TreatmentToWeightMap),
  }),
).annotations({
  identifier: "OnlineAbDefinition",
}) as any as S.Schema<OnlineAbDefinition>;
export interface Experiment {
  arn: string;
  name: string;
  project?: string;
  status: string;
  statusReason?: string;
  description?: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  schedule?: ExperimentSchedule;
  execution?: ExperimentExecution;
  treatments?: TreatmentList;
  metricGoals?: MetricGoalsList;
  randomizationSalt?: string;
  samplingRate?: number;
  segment?: string;
  type: string;
  onlineAbDefinition?: OnlineAbDefinition;
  tags?: TagMap;
}
export const Experiment = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    project: S.optional(S.String),
    status: S.String,
    statusReason: S.optional(S.String),
    description: S.optional(S.String),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    schedule: S.optional(ExperimentSchedule),
    execution: S.optional(ExperimentExecution),
    treatments: S.optional(TreatmentList),
    metricGoals: S.optional(MetricGoalsList),
    randomizationSalt: S.optional(S.String),
    samplingRate: S.optional(S.Number),
    segment: S.optional(S.String),
    type: S.String,
    onlineAbDefinition: S.optional(OnlineAbDefinition),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Experiment" }) as any as S.Schema<Experiment>;
export type ExperimentList = Experiment[];
export const ExperimentList = S.Array(Experiment);
export type TimestampList = Date[];
export const TimestampList = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export interface LaunchExecution {
  startedTime?: Date;
  endedTime?: Date;
}
export const LaunchExecution = S.suspend(() =>
  S.Struct({
    startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LaunchExecution",
}) as any as S.Schema<LaunchExecution>;
export interface LaunchGroup {
  name: string;
  description?: string;
  featureVariations: FeatureToVariationMap;
}
export const LaunchGroup = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    featureVariations: FeatureToVariationMap,
  }),
).annotations({ identifier: "LaunchGroup" }) as any as S.Schema<LaunchGroup>;
export type LaunchGroupList = LaunchGroup[];
export const LaunchGroupList = S.Array(LaunchGroup);
export interface MetricMonitor {
  metricDefinition: MetricDefinition;
}
export const MetricMonitor = S.suspend(() =>
  S.Struct({ metricDefinition: MetricDefinition }),
).annotations({
  identifier: "MetricMonitor",
}) as any as S.Schema<MetricMonitor>;
export type MetricMonitorList = MetricMonitor[];
export const MetricMonitorList = S.Array(MetricMonitor);
export interface ScheduledSplit {
  startTime: Date;
  groupWeights?: GroupToWeightMap;
  segmentOverrides?: SegmentOverridesList;
}
export const ScheduledSplit = S.suspend(() =>
  S.Struct({
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    groupWeights: S.optional(GroupToWeightMap),
    segmentOverrides: S.optional(SegmentOverridesList),
  }),
).annotations({
  identifier: "ScheduledSplit",
}) as any as S.Schema<ScheduledSplit>;
export type ScheduledStepList = ScheduledSplit[];
export const ScheduledStepList = S.Array(ScheduledSplit);
export interface ScheduledSplitsLaunchDefinition {
  steps?: ScheduledStepList;
}
export const ScheduledSplitsLaunchDefinition = S.suspend(() =>
  S.Struct({ steps: S.optional(ScheduledStepList) }),
).annotations({
  identifier: "ScheduledSplitsLaunchDefinition",
}) as any as S.Schema<ScheduledSplitsLaunchDefinition>;
export interface Launch {
  arn: string;
  name: string;
  project?: string;
  status: string;
  statusReason?: string;
  description?: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  execution?: LaunchExecution;
  groups?: LaunchGroupList;
  metricMonitors?: MetricMonitorList;
  randomizationSalt?: string;
  type: string;
  scheduledSplitsDefinition?: ScheduledSplitsLaunchDefinition;
  tags?: TagMap;
}
export const Launch = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    project: S.optional(S.String),
    status: S.String,
    statusReason: S.optional(S.String),
    description: S.optional(S.String),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    execution: S.optional(LaunchExecution),
    groups: S.optional(LaunchGroupList),
    metricMonitors: S.optional(MetricMonitorList),
    randomizationSalt: S.optional(S.String),
    type: S.String,
    scheduledSplitsDefinition: S.optional(ScheduledSplitsLaunchDefinition),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Launch" }) as any as S.Schema<Launch>;
export type LaunchesList = Launch[];
export const LaunchesList = S.Array(Launch);
export interface Segment {
  arn: string;
  name: string;
  pattern: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  description?: string;
  experimentCount?: number;
  launchCount?: number;
  tags?: TagMap;
}
export const Segment = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    pattern: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    experimentCount: S.optional(S.Number),
    launchCount: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Segment" }) as any as S.Schema<Segment>;
export type SegmentList = Segment[];
export const SegmentList = S.Array(Segment);
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestSegmentPatternResponse {
  match: boolean;
}
export const TestSegmentPatternResponse = S.suspend(() =>
  S.Struct({ match: S.Boolean }),
).annotations({
  identifier: "TestSegmentPatternResponse",
}) as any as S.Schema<TestSegmentPatternResponse>;
export interface CreateProjectRequest {
  name: string;
  description?: string;
  dataDelivery?: ProjectDataDeliveryConfig;
  appConfigResource?: ProjectAppConfigResourceConfig;
  tags?: TagMap;
}
export const CreateProjectRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    dataDelivery: S.optional(ProjectDataDeliveryConfig),
    appConfigResource: S.optional(ProjectAppConfigResourceConfig),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateProjectRequest",
}) as any as S.Schema<CreateProjectRequest>;
export interface BatchEvaluateFeatureRequest {
  project: string;
  requests: EvaluationRequestsList;
}
export const BatchEvaluateFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    requests: EvaluationRequestsList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects/{project}/evaluations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchEvaluateFeatureRequest",
}) as any as S.Schema<BatchEvaluateFeatureRequest>;
export interface EvaluateFeatureResponse {
  variation?: string;
  value?: (typeof VariableValue)["Type"];
  reason?: string;
  details?: string;
}
export const EvaluateFeatureResponse = S.suspend(() =>
  S.Struct({
    variation: S.optional(S.String),
    value: S.optional(VariableValue),
    reason: S.optional(S.String),
    details: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluateFeatureResponse",
}) as any as S.Schema<EvaluateFeatureResponse>;
export interface PutProjectEventsRequest {
  project: string;
  events: EventList;
}
export const PutProjectEventsRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    events: EventList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/events/projects/{project}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutProjectEventsRequest",
}) as any as S.Schema<PutProjectEventsRequest>;
export interface S3Destination {
  bucket?: string;
  prefix?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), prefix: S.optional(S.String) }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface CloudWatchLogsDestination {
  logGroup?: string;
}
export const CloudWatchLogsDestination = S.suspend(() =>
  S.Struct({ logGroup: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsDestination",
}) as any as S.Schema<CloudWatchLogsDestination>;
export interface ProjectDataDelivery {
  s3Destination?: S3Destination;
  cloudWatchLogs?: CloudWatchLogsDestination;
}
export const ProjectDataDelivery = S.suspend(() =>
  S.Struct({
    s3Destination: S.optional(S3Destination),
    cloudWatchLogs: S.optional(CloudWatchLogsDestination),
  }),
).annotations({
  identifier: "ProjectDataDelivery",
}) as any as S.Schema<ProjectDataDelivery>;
export interface ProjectAppConfigResource {
  applicationId: string;
  environmentId: string;
  configurationProfileId: string;
}
export const ProjectAppConfigResource = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    environmentId: S.String,
    configurationProfileId: S.String,
  }),
).annotations({
  identifier: "ProjectAppConfigResource",
}) as any as S.Schema<ProjectAppConfigResource>;
export interface Project {
  arn: string;
  name: string;
  status: string;
  description?: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  featureCount?: number;
  launchCount?: number;
  activeLaunchCount?: number;
  experimentCount?: number;
  activeExperimentCount?: number;
  dataDelivery?: ProjectDataDelivery;
  appConfigResource?: ProjectAppConfigResource;
  tags?: TagMap;
}
export const Project = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    status: S.String,
    description: S.optional(S.String),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    featureCount: S.optional(S.Number),
    launchCount: S.optional(S.Number),
    activeLaunchCount: S.optional(S.Number),
    experimentCount: S.optional(S.Number),
    activeExperimentCount: S.optional(S.Number),
    dataDelivery: S.optional(ProjectDataDelivery),
    appConfigResource: S.optional(ProjectAppConfigResource),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "Project" }) as any as S.Schema<Project>;
export interface UpdateProjectResponse {
  project: Project;
}
export const UpdateProjectResponse = S.suspend(() =>
  S.Struct({ project: Project }),
).annotations({
  identifier: "UpdateProjectResponse",
}) as any as S.Schema<UpdateProjectResponse>;
export interface UpdateProjectDataDeliveryRequest {
  project: string;
  s3Destination?: S3DestinationConfig;
  cloudWatchLogs?: CloudWatchLogsDestinationConfig;
}
export const UpdateProjectDataDeliveryRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    s3Destination: S.optional(S3DestinationConfig),
    cloudWatchLogs: S.optional(CloudWatchLogsDestinationConfig),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/projects/{project}/data-delivery" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateProjectDataDeliveryRequest",
}) as any as S.Schema<UpdateProjectDataDeliveryRequest>;
export interface UpdateExperimentResponse {
  experiment: Experiment;
}
export const UpdateExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: Experiment }),
).annotations({
  identifier: "UpdateExperimentResponse",
}) as any as S.Schema<UpdateExperimentResponse>;
export interface ListExperimentsResponse {
  experiments?: ExperimentList;
  nextToken?: string;
}
export const ListExperimentsResponse = S.suspend(() =>
  S.Struct({
    experiments: S.optional(ExperimentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExperimentsResponse",
}) as any as S.Schema<ListExperimentsResponse>;
export interface StartExperimentResponse {
  startedTime?: Date;
}
export const StartExperimentResponse = S.suspend(() =>
  S.Struct({
    startedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartExperimentResponse",
}) as any as S.Schema<StartExperimentResponse>;
export interface StopExperimentResponse {
  endedTime?: Date;
}
export const StopExperimentResponse = S.suspend(() =>
  S.Struct({
    endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StopExperimentResponse",
}) as any as S.Schema<StopExperimentResponse>;
export interface Variation {
  name?: string;
  value?: (typeof VariableValue)["Type"];
}
export const Variation = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(VariableValue) }),
).annotations({ identifier: "Variation" }) as any as S.Schema<Variation>;
export type VariationsList = Variation[];
export const VariationsList = S.Array(Variation);
export interface EvaluationRule {
  name?: string;
  type: string;
}
export const EvaluationRule = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), type: S.String }),
).annotations({
  identifier: "EvaluationRule",
}) as any as S.Schema<EvaluationRule>;
export type EvaluationRulesList = EvaluationRule[];
export const EvaluationRulesList = S.Array(EvaluationRule);
export interface Feature {
  arn: string;
  name: string;
  project?: string;
  status: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  description?: string;
  evaluationStrategy: string;
  valueType: string;
  variations: VariationsList;
  defaultVariation?: string;
  evaluationRules?: EvaluationRulesList;
  tags?: TagMap;
  entityOverrides?: EntityOverrideMap;
}
export const Feature = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    project: S.optional(S.String),
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    description: S.optional(S.String),
    evaluationStrategy: S.String,
    valueType: S.String,
    variations: VariationsList,
    defaultVariation: S.optional(S.String),
    evaluationRules: S.optional(EvaluationRulesList),
    tags: S.optional(TagMap),
    entityOverrides: S.optional(EntityOverrideMap),
  }),
).annotations({ identifier: "Feature" }) as any as S.Schema<Feature>;
export interface UpdateFeatureResponse {
  feature: Feature;
}
export const UpdateFeatureResponse = S.suspend(() =>
  S.Struct({ feature: Feature }),
).annotations({
  identifier: "UpdateFeatureResponse",
}) as any as S.Schema<UpdateFeatureResponse>;
export interface UpdateLaunchResponse {
  launch: Launch;
}
export const UpdateLaunchResponse = S.suspend(() =>
  S.Struct({ launch: Launch }),
).annotations({
  identifier: "UpdateLaunchResponse",
}) as any as S.Schema<UpdateLaunchResponse>;
export interface ListLaunchesResponse {
  launches?: LaunchesList;
  nextToken?: string;
}
export const ListLaunchesResponse = S.suspend(() =>
  S.Struct({
    launches: S.optional(LaunchesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLaunchesResponse",
}) as any as S.Schema<ListLaunchesResponse>;
export interface StartLaunchResponse {
  launch: Launch;
}
export const StartLaunchResponse = S.suspend(() =>
  S.Struct({ launch: Launch }),
).annotations({
  identifier: "StartLaunchResponse",
}) as any as S.Schema<StartLaunchResponse>;
export interface StopLaunchResponse {
  endedTime?: Date;
}
export const StopLaunchResponse = S.suspend(() =>
  S.Struct({
    endedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StopLaunchResponse",
}) as any as S.Schema<StopLaunchResponse>;
export interface GetSegmentResponse {
  segment: Segment;
}
export const GetSegmentResponse = S.suspend(() =>
  S.Struct({ segment: Segment }),
).annotations({
  identifier: "GetSegmentResponse",
}) as any as S.Schema<GetSegmentResponse>;
export interface ListSegmentsResponse {
  segments?: SegmentList;
  nextToken?: string;
}
export const ListSegmentsResponse = S.suspend(() =>
  S.Struct({
    segments: S.optional(SegmentList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSegmentsResponse",
}) as any as S.Schema<ListSegmentsResponse>;
export type DoubleValueList = number[];
export const DoubleValueList = S.Array(S.Number);
export interface ProjectSummary {
  arn: string;
  name: string;
  status: string;
  description?: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  featureCount?: number;
  launchCount?: number;
  activeLaunchCount?: number;
  experimentCount?: number;
  activeExperimentCount?: number;
  tags?: TagMap;
}
export const ProjectSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    status: S.String,
    description: S.optional(S.String),
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    featureCount: S.optional(S.Number),
    launchCount: S.optional(S.Number),
    activeLaunchCount: S.optional(S.Number),
    experimentCount: S.optional(S.Number),
    activeExperimentCount: S.optional(S.Number),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "ProjectSummary",
}) as any as S.Schema<ProjectSummary>;
export type ProjectSummariesList = ProjectSummary[];
export const ProjectSummariesList = S.Array(ProjectSummary);
export interface ExperimentResultsData {
  metricName?: string;
  treatmentName?: string;
  resultStat?: string;
  values?: DoubleValueList;
}
export const ExperimentResultsData = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    treatmentName: S.optional(S.String),
    resultStat: S.optional(S.String),
    values: S.optional(DoubleValueList),
  }),
).annotations({
  identifier: "ExperimentResultsData",
}) as any as S.Schema<ExperimentResultsData>;
export type ExperimentResultsDataList = ExperimentResultsData[];
export const ExperimentResultsDataList = S.Array(ExperimentResultsData);
export interface ExperimentReport {
  metricName?: string;
  treatmentName?: string;
  reportName?: string;
  content?: string;
}
export const ExperimentReport = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    treatmentName: S.optional(S.String),
    reportName: S.optional(S.String),
    content: S.optional(S.String),
  }),
).annotations({
  identifier: "ExperimentReport",
}) as any as S.Schema<ExperimentReport>;
export type ExperimentReportList = ExperimentReport[];
export const ExperimentReportList = S.Array(ExperimentReport);
export interface FeatureSummary {
  arn: string;
  name: string;
  project?: string;
  status: string;
  createdTime: Date;
  lastUpdatedTime: Date;
  evaluationStrategy: string;
  evaluationRules?: EvaluationRulesList;
  defaultVariation?: string;
  tags?: TagMap;
}
export const FeatureSummary = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.String,
    project: S.optional(S.String),
    status: S.String,
    createdTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdatedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    evaluationStrategy: S.String,
    evaluationRules: S.optional(EvaluationRulesList),
    defaultVariation: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "FeatureSummary",
}) as any as S.Schema<FeatureSummary>;
export type FeatureSummariesList = FeatureSummary[];
export const FeatureSummariesList = S.Array(FeatureSummary);
export interface RefResource {
  name: string;
  type: string;
  arn?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  lastUpdatedOn?: string;
}
export const RefResource = S.suspend(() =>
  S.Struct({
    name: S.String,
    type: S.String,
    arn: S.optional(S.String),
    status: S.optional(S.String),
    startTime: S.optional(S.String),
    endTime: S.optional(S.String),
    lastUpdatedOn: S.optional(S.String),
  }),
).annotations({ identifier: "RefResource" }) as any as S.Schema<RefResource>;
export type RefResourceList = RefResource[];
export const RefResourceList = S.Array(RefResource);
export interface CreateProjectResponse {
  project: Project;
}
export const CreateProjectResponse = S.suspend(() =>
  S.Struct({ project: Project }),
).annotations({
  identifier: "CreateProjectResponse",
}) as any as S.Schema<CreateProjectResponse>;
export interface ListProjectsResponse {
  projects?: ProjectSummariesList;
  nextToken?: string;
}
export const ListProjectsResponse = S.suspend(() =>
  S.Struct({
    projects: S.optional(ProjectSummariesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProjectsResponse",
}) as any as S.Schema<ListProjectsResponse>;
export interface UpdateProjectDataDeliveryResponse {
  project: Project;
}
export const UpdateProjectDataDeliveryResponse = S.suspend(() =>
  S.Struct({ project: Project }),
).annotations({
  identifier: "UpdateProjectDataDeliveryResponse",
}) as any as S.Schema<UpdateProjectDataDeliveryResponse>;
export interface CreateExperimentRequest {
  project: string;
  name: string;
  description?: string;
  treatments: TreatmentConfigList;
  metricGoals: MetricGoalConfigList;
  randomizationSalt?: string;
  samplingRate?: number;
  onlineAbConfig?: OnlineAbConfig;
  segment?: string;
  tags?: TagMap;
}
export const CreateExperimentRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    description: S.optional(S.String),
    treatments: TreatmentConfigList,
    metricGoals: MetricGoalConfigList,
    randomizationSalt: S.optional(S.String),
    samplingRate: S.optional(S.Number),
    onlineAbConfig: S.optional(OnlineAbConfig),
    segment: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects/{project}/experiments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateExperimentRequest",
}) as any as S.Schema<CreateExperimentRequest>;
export interface GetExperimentResultsResponse {
  resultsData?: ExperimentResultsDataList;
  reports?: ExperimentReportList;
  timestamps?: TimestampList;
  details?: string;
}
export const GetExperimentResultsResponse = S.suspend(() =>
  S.Struct({
    resultsData: S.optional(ExperimentResultsDataList),
    reports: S.optional(ExperimentReportList),
    timestamps: S.optional(TimestampList),
    details: S.optional(S.String),
  }),
).annotations({
  identifier: "GetExperimentResultsResponse",
}) as any as S.Schema<GetExperimentResultsResponse>;
export interface CreateFeatureRequest {
  project: string;
  name: string;
  evaluationStrategy?: string;
  description?: string;
  variations: VariationConfigsList;
  defaultVariation?: string;
  tags?: TagMap;
  entityOverrides?: EntityOverrideMap;
}
export const CreateFeatureRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    evaluationStrategy: S.optional(S.String),
    description: S.optional(S.String),
    variations: VariationConfigsList,
    defaultVariation: S.optional(S.String),
    tags: S.optional(TagMap),
    entityOverrides: S.optional(EntityOverrideMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects/{project}/features" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFeatureRequest",
}) as any as S.Schema<CreateFeatureRequest>;
export interface ListFeaturesResponse {
  features?: FeatureSummariesList;
  nextToken?: string;
}
export const ListFeaturesResponse = S.suspend(() =>
  S.Struct({
    features: S.optional(FeatureSummariesList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFeaturesResponse",
}) as any as S.Schema<ListFeaturesResponse>;
export interface CreateSegmentResponse {
  segment: Segment;
}
export const CreateSegmentResponse = S.suspend(() =>
  S.Struct({ segment: Segment }),
).annotations({
  identifier: "CreateSegmentResponse",
}) as any as S.Schema<CreateSegmentResponse>;
export interface ListSegmentReferencesResponse {
  referencedBy?: RefResourceList;
  nextToken?: string;
}
export const ListSegmentReferencesResponse = S.suspend(() =>
  S.Struct({
    referencedBy: S.optional(RefResourceList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSegmentReferencesResponse",
}) as any as S.Schema<ListSegmentReferencesResponse>;
export interface EvaluationResult {
  project?: string;
  feature: string;
  variation?: string;
  value?: (typeof VariableValue)["Type"];
  entityId: string;
  reason?: string;
  details?: string;
}
export const EvaluationResult = S.suspend(() =>
  S.Struct({
    project: S.optional(S.String),
    feature: S.String,
    variation: S.optional(S.String),
    value: S.optional(VariableValue),
    entityId: S.String,
    reason: S.optional(S.String),
    details: S.optional(S.String),
  }),
).annotations({
  identifier: "EvaluationResult",
}) as any as S.Schema<EvaluationResult>;
export type EvaluationResultsList = EvaluationResult[];
export const EvaluationResultsList = S.Array(EvaluationResult);
export interface PutProjectEventsResultEntry {
  eventId?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const PutProjectEventsResultEntry = S.suspend(() =>
  S.Struct({
    eventId: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "PutProjectEventsResultEntry",
}) as any as S.Schema<PutProjectEventsResultEntry>;
export type PutProjectEventsResultEntryList = PutProjectEventsResultEntry[];
export const PutProjectEventsResultEntryList = S.Array(
  PutProjectEventsResultEntry,
);
export interface BatchEvaluateFeatureResponse {
  results?: EvaluationResultsList;
}
export const BatchEvaluateFeatureResponse = S.suspend(() =>
  S.Struct({ results: S.optional(EvaluationResultsList) }),
).annotations({
  identifier: "BatchEvaluateFeatureResponse",
}) as any as S.Schema<BatchEvaluateFeatureResponse>;
export interface PutProjectEventsResponse {
  failedEventCount?: number;
  eventResults?: PutProjectEventsResultEntryList;
}
export const PutProjectEventsResponse = S.suspend(() =>
  S.Struct({
    failedEventCount: S.optional(S.Number),
    eventResults: S.optional(PutProjectEventsResultEntryList),
  }),
).annotations({
  identifier: "PutProjectEventsResponse",
}) as any as S.Schema<PutProjectEventsResponse>;
export interface CreateExperimentResponse {
  experiment: Experiment;
}
export const CreateExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: Experiment }),
).annotations({
  identifier: "CreateExperimentResponse",
}) as any as S.Schema<CreateExperimentResponse>;
export interface CreateFeatureResponse {
  feature?: Feature;
}
export const CreateFeatureResponse = S.suspend(() =>
  S.Struct({ feature: S.optional(Feature) }),
).annotations({
  identifier: "CreateFeatureResponse",
}) as any as S.Schema<CreateFeatureResponse>;
export interface GetFeatureResponse {
  feature: Feature;
}
export const GetFeatureResponse = S.suspend(() =>
  S.Struct({ feature: Feature }),
).annotations({
  identifier: "GetFeatureResponse",
}) as any as S.Schema<GetFeatureResponse>;
export interface CreateLaunchRequest {
  project: string;
  name: string;
  description?: string;
  scheduledSplitsConfig?: ScheduledSplitsLaunchConfig;
  metricMonitors?: MetricMonitorConfigList;
  groups: LaunchGroupConfigList;
  randomizationSalt?: string;
  tags?: TagMap;
}
export const CreateLaunchRequest = S.suspend(() =>
  S.Struct({
    project: S.String.pipe(T.HttpLabel("project")),
    name: S.String,
    description: S.optional(S.String),
    scheduledSplitsConfig: S.optional(ScheduledSplitsLaunchConfig),
    metricMonitors: S.optional(MetricMonitorConfigList),
    groups: LaunchGroupConfigList,
    randomizationSalt: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/projects/{project}/launches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLaunchRequest",
}) as any as S.Schema<CreateLaunchRequest>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface GetProjectResponse {
  project: Project;
}
export const GetProjectResponse = S.suspend(() =>
  S.Struct({ project: Project }),
).annotations({
  identifier: "GetProjectResponse",
}) as any as S.Schema<GetProjectResponse>;
export interface GetExperimentResponse {
  experiment?: Experiment;
}
export const GetExperimentResponse = S.suspend(() =>
  S.Struct({ experiment: S.optional(Experiment) }),
).annotations({
  identifier: "GetExperimentResponse",
}) as any as S.Schema<GetExperimentResponse>;
export interface CreateLaunchResponse {
  launch: Launch;
}
export const CreateLaunchResponse = S.suspend(() =>
  S.Struct({ launch: Launch }),
).annotations({
  identifier: "CreateLaunchResponse",
}) as any as S.Schema<CreateLaunchResponse>;
export interface GetLaunchResponse {
  launch?: Launch;
}
export const GetLaunchResponse = S.suspend(() =>
  S.Struct({ launch: S.optional(Launch) }),
).annotations({
  identifier: "GetLaunchResponse",
}) as any as S.Schema<GetLaunchResponse>;

//# Errors
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Returns the details about one launch. You must already know the
 * project name. To retrieve a list of projects in your account, use ListProjects.
 */
export const getProject: (
  input: GetProjectRequest,
) => Effect.Effect<
  GetProjectResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetProjectRequest,
  output: GetProjectResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one experiment. You must already know the
 * experiment name. To retrieve a list of experiments in your account, use ListExperiments.
 */
export const getExperiment: (
  input: GetExperimentRequest,
) => Effect.Effect<
  GetExperimentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentRequest,
  output: GetExperimentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a *launch* of a given feature. Before you create a launch, you
 * must create the feature to use for the launch.
 *
 * You can use a launch to safely validate new features by serving them to a specified
 * percentage of your users while you roll out the feature. You can monitor the performance of
 * the new feature to help you decide when to ramp up traffic to more users. This helps you
 * reduce risk and identify unintended consequences before you fully launch the feature.
 *
 * Don't use this operation to update an existing launch. Instead, use
 * UpdateLaunch.
 */
export const createLaunch: (
  input: CreateLaunchRequest,
) => Effect.Effect<
  CreateLaunchResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLaunchRequest,
  output: CreateLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one launch. You must already know the
 * launch name. To retrieve a list of launches in your account, use ListLaunches.
 */
export const getLaunch: (
  input: GetLaunchRequest,
) => Effect.Effect<
  GetLaunchResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLaunchRequest,
  output: GetLaunchResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns configuration details about all the launches in the specified project.
 */
export const listLaunches: {
  (
    input: ListLaunchesRequest,
  ): Effect.Effect<
    ListLaunchesResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLaunchesRequest,
  ) => Stream.Stream<
    ListLaunchesResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLaunchesRequest,
  ) => Stream.Stream<
    Launch,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLaunchesRequest,
  output: ListLaunchesResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "launches",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Use this operation to find which experiments or launches are using a specified segment.
 */
export const listSegmentReferences: {
  (
    input: ListSegmentReferencesRequest,
  ): Effect.Effect<
    ListSegmentReferencesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSegmentReferencesRequest,
  ) => Stream.Stream<
    ListSegmentReferencesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSegmentReferencesRequest,
  ) => Stream.Stream<
    RefResource,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSegmentReferencesRequest,
  output: ListSegmentReferencesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "referencedBy",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes an Evidently project. Before you can delete a project, you must delete all the
 * features that the project contains. To delete a feature, use DeleteFeature.
 */
export const deleteProject: (
  input: DeleteProjectRequest,
) => Effect.Effect<
  DeleteProjectResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProjectRequest,
  output: DeleteProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * This operation assigns a feature variation to one given user session. You pass in an
 * `entityID` that represents the user. Evidently then checks the evaluation rules
 * and assigns the variation.
 *
 * The first rules that are evaluated are the override rules. If the user's
 * `entityID` matches an override rule, the user is served the variation specified
 * by that rule.
 *
 * If there is a current launch with this feature that uses segment overrides, and
 * if the user session's `evaluationContext` matches a segment rule defined in a
 * segment override, the configuration in the segment overrides is used. For more information
 * about segments, see CreateSegment
 * and
 * Use segments to focus your
 * audience.
 *
 * If there is a launch with no segment overrides, the user might be assigned to a variation in
 * the launch. The chance of this depends on the percentage of users that are allocated to that
 * launch. If the user is enrolled in the launch, the variation they are served depends on the
 * allocation of the various feature variations used for the launch.
 *
 * If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might
 * be assigned to a variation in the experiment. The chance of this
 * depends on the percentage of users that are allocated to that experiment.
 *
 * If the experiment uses a segment, then only
 * user sessions with `evaluationContext` values that match the segment rule are used in the experiment.
 *
 * If the user is enrolled in the experiment,
 * the variation they are served depends on the allocation of the various feature variations used for the experiment.
 *
 * If the user is not assigned to a launch or experiment, they are served the default variation.
 */
export const evaluateFeature: (
  input: EvaluateFeatureRequest,
) => Effect.Effect<
  EvaluateFeatureResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvaluateFeatureRequest,
  output: EvaluateFeatureResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an Evidently experiment.
 *
 * Don't use this operation to update an experiment's tag. Instead, use
 * TagResource.
 */
export const updateExperiment: (
  input: UpdateExperimentRequest,
) => Effect.Effect<
  UpdateExperimentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExperimentRequest,
  output: UpdateExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Returns configuration details about all the experiments in the specified project.
 */
export const listExperiments: {
  (
    input: ListExperimentsRequest,
  ): Effect.Effect<
    ListExperimentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExperimentsRequest,
  ) => Stream.Stream<
    ListExperimentsResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExperimentsRequest,
  ) => Stream.Stream<
    Experiment,
    | AccessDeniedException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExperimentsRequest,
  output: ListExperimentsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "experiments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a launch of a given feature.
 *
 * Don't use this operation to update the tags of an existing launch. Instead, use
 * TagResource.
 */
export const updateLaunch: (
  input: UpdateLaunchRequest,
) => Effect.Effect<
  UpdateLaunchResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLaunchRequest,
  output: UpdateLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops a launch that is currently running. After you stop a launch, you will not be able to resume it or restart it.
 * Also, it
 * will not be evaluated as a rule for traffic allocation, and the traffic that was allocated to the launch
 * will instead be available to the feature's experiment, if there is one. Otherwise, all traffic
 * will be served the default variation after the launch is stopped.
 */
export const stopLaunch: (
  input: StopLaunchRequest,
) => Effect.Effect<
  StopLaunchResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopLaunchRequest,
  output: StopLaunchResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the specified segment. Specify the segment you want to view
 * by specifying its ARN.
 */
export const getSegment: (
  input: GetSegmentRequest,
) => Effect.Effect<
  GetSegmentResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSegmentRequest,
  output: GetSegmentResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Displays the tags associated with an Evidently resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified CloudWatch Evidently resource. Projects,
 * features, launches, and experiments can be tagged.
 *
 * Tags can help you organize and categorize your resources. You can also use them to scope user
 * permissions by granting a user
 * permission to access or change only resources with certain tag values.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags.
 * If you specify a new tag key for the resource,
 * this tag is appended to the list of tags associated
 * with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces
 * the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 *
 * For more information, see Tagging Amazon Web Services resources.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ConflictException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ConflictException, ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes an Evidently feature.
 */
export const deleteFeature: (
  input: DeleteFeatureRequest,
) => Effect.Effect<
  DeleteFeatureResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFeatureRequest,
  output: DeleteFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Evidently launch. The feature used for the launch is not deleted.
 *
 * To stop a launch without deleting it, use StopLaunch.
 */
export const deleteLaunch: (
  input: DeleteLaunchRequest,
) => Effect.Effect<
  DeleteLaunchResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchRequest,
  output: DeleteLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a segment. You can't delete a segment that is being used in a launch or experiment, even if that
 * launch or experiment is not currently running.
 */
export const deleteSegment: (
  input: DeleteSegmentRequest,
) => Effect.Effect<
  DeleteSegmentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSegmentRequest,
  output: DeleteSegmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of audience segments that you have created in your account in this Region.
 */
export const listSegments: {
  (
    input: ListSegmentsRequest,
  ): Effect.Effect<
    ListSegmentsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSegmentsRequest,
  ) => Stream.Stream<
    ListSegmentsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSegmentsRequest,
  ) => Stream.Stream<
    Segment,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSegmentsRequest,
  output: ListSegmentsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "segments",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Use this operation to test a rules pattern that you plan to use to create an audience segment.
 * For more information about segments, see CreateSegment.
 */
export const testSegmentPattern: (
  input: TestSegmentPatternRequest,
) => Effect.Effect<
  TestSegmentPatternResponse,
  | AccessDeniedException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestSegmentPatternRequest,
  output: TestSegmentPatternResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
}));
/**
 * Returns configuration details about all the projects in the current Region in your
 * account.
 */
export const listProjects: {
  (
    input: ListProjectsRequest,
  ): Effect.Effect<
    ListProjectsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ListProjectsResponse,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProjectsRequest,
  ) => Stream.Stream<
    ProjectSummary,
    | AccessDeniedException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProjectsRequest,
  output: ListProjectsResponse,
  errors: [AccessDeniedException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "projects",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the results of a running or completed experiment. No results are available until
 * there have been 100 events for each variation and at least 10 minutes have passed since the start of the experiment.
 * To increase the statistical power, Evidently performs an additional offline p-value analysis at the end of the experiment.
 * Offline p-value analysis can detect statistical significance in some cases where the anytime p-values used during
 * the experiment do not find statistical significance.
 *
 * Experiment
 * results are available up to 63 days after the start of the experiment. They are not available after that because
 * of CloudWatch data retention policies.
 */
export const getExperimentResults: (
  input: GetExperimentResultsRequest,
) => Effect.Effect<
  GetExperimentResultsResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentResultsRequest,
  output: GetExperimentResultsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns configuration details about all the features in the specified project.
 */
export const listFeatures: {
  (
    input: ListFeaturesRequest,
  ): Effect.Effect<
    ListFeaturesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFeaturesRequest,
  ) => Stream.Stream<
    ListFeaturesResponse,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFeaturesRequest,
  ) => Stream.Stream<
    FeatureSummary,
    | AccessDeniedException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFeaturesRequest,
  output: ListFeaturesResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "features",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a project, which is the logical object in Evidently that can contain features, launches, and
 * experiments. Use projects to group similar features together.
 *
 * To update an existing project, use UpdateProject.
 */
export const createProject: (
  input: CreateProjectRequest,
) => Effect.Effect<
  CreateProjectResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProjectRequest,
  output: CreateProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * This operation assigns feature variation to user sessions. For each user session, you pass
 * in an `entityID` that represents the user. Evidently then checks the evaluation
 * rules and assigns the variation.
 *
 * The first rules that are evaluated are the override rules. If the user's
 * `entityID` matches an override rule, the user is served the variation specified
 * by that rule.
 *
 * Next, if there is a launch of the feature, the user might be assigned to a variation in
 * the launch. The chance of this depends on the percentage of users that are allocated to that
 * launch. If the user is enrolled in the launch, the variation they are served depends on the
 * allocation of the various feature variations used for the launch.
 *
 * If the user is not assigned to a launch, and there is an ongoing experiment for this feature, the user might
 * be assigned to a variation in the experiment. The chance of this
 * depends on the percentage of users that are allocated to that experiment. If the user is enrolled in the experiment,
 * the variation they are served depends on the allocation of the various feature variations used for the experiment.
 *
 * If the user is not assigned to a launch or experiment, they are served the default variation.
 */
export const batchEvaluateFeature: (
  input: BatchEvaluateFeatureRequest,
) => Effect.Effect<
  BatchEvaluateFeatureResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchEvaluateFeatureRequest,
  output: BatchEvaluateFeatureResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Sends performance events to Evidently. These events can be used to evaluate a launch or
 * an experiment.
 */
export const putProjectEvents: (
  input: PutProjectEventsRequest,
) => Effect.Effect<
  PutProjectEventsResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutProjectEventsRequest,
  output: PutProjectEventsResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Evidently *experiment*. Before you create an experiment,
 * you must create the feature to use for the experiment.
 *
 * An experiment helps you make feature design
 * decisions based on evidence and data. An experiment can test as
 * many as five variations at once. Evidently collects experiment data and analyzes it by statistical methods, and provides
 * clear recommendations about which variations perform better.
 *
 * You can optionally specify a `segment` to have the experiment consider only certain audience
 * types in the experiment, such as using only user sessions from a certain location or who use a certain internet browser.
 *
 * Don't use this operation to update an existing experiment. Instead, use
 * UpdateExperiment.
 */
export const createExperiment: (
  input: CreateExperimentRequest,
) => Effect.Effect<
  CreateExperimentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExperimentRequest,
  output: CreateExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Creates an Evidently *feature* that you want to launch or test. You can define up to
 * five variations of a feature, and use these variations in your launches and experiments. A feature must be created in
 * a project. For information about creating a project, see CreateProject.
 *
 * Don't use this operation to update an existing feature. Instead, use
 * UpdateFeature.
 */
export const createFeature: (
  input: CreateFeatureRequest,
) => Effect.Effect<
  CreateFeatureResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFeatureRequest,
  output: CreateFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Returns the details about one feature. You must already know the feature name. To
 * retrieve a list of features in your account, use ListFeatures.
 */
export const getFeature: (
  input: GetFeatureRequest,
) => Effect.Effect<
  GetFeatureResponse,
  | AccessDeniedException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFeatureRequest,
  output: GetFeatureResponse,
  errors: [
    AccessDeniedException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the data storage options for this project. If you store evaluation events, you an
 * keep them and analyze them on your own. If you choose not to store evaluation events,
 * Evidently deletes them after using them to produce metrics and other experiment results that
 * you can view.
 *
 * You can't specify both `cloudWatchLogs` and `s3Destination` in the same operation.
 */
export const updateProjectDataDelivery: (
  input: UpdateProjectDataDeliveryRequest,
) => Effect.Effect<
  UpdateProjectDataDeliveryResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectDataDeliveryRequest,
  output: UpdateProjectDataDeliveryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Use this operation to define a *segment* of your audience. A segment
 * is a portion of your audience that share one or more characteristics. Examples could be Chrome browser users,
 * users in Europe, or Firefox browser users in Europe who also fit other criteria that your application collects,
 * such as age.
 *
 * Using a segment in an experiment limits that experiment to evaluate only the users who match the segment
 * criteria. Using one or more segments in a launch allows you to define different traffic splits for the different
 * audience segments.
 *
 * For more information about segment pattern syntax, see
 *
 * Segment rule pattern syntax.
 *
 * The pattern that you define for a segment is matched against the value of `evaluationContext`, which
 * is passed into Evidently in the EvaluateFeature operation,
 * when Evidently assigns a feature variation to a user.
 */
export const createSegment: (
  input: CreateSegmentRequest,
) => Effect.Effect<
  CreateSegmentResponse,
  | AccessDeniedException
  | ConflictException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSegmentRequest,
  output: CreateSegmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the description of an existing project.
 *
 * To create a new project, use CreateProject.
 *
 * Don't use this operation to update the data storage options of a project. Instead, use
 * UpdateProjectDataDelivery.
 *
 * Don't use this operation to update the tags of a project. Instead, use
 * TagResource.
 */
export const updateProject: (
  input: UpdateProjectRequest,
) => Effect.Effect<
  UpdateProjectResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProjectRequest,
  output: UpdateProjectResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts an existing experiment. To create an experiment,
 * use CreateExperiment.
 */
export const startExperiment: (
  input: StartExperimentRequest,
) => Effect.Effect<
  StartExperimentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExperimentRequest,
  output: StartExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops an experiment that is currently running. If you stop an experiment, you can't
 * resume it or restart it.
 */
export const stopExperiment: (
  input: StopExperimentRequest,
) => Effect.Effect<
  StopExperimentResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopExperimentRequest,
  output: StopExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing feature.
 *
 * You can't use this operation to update the tags of an existing feature. Instead, use
 * TagResource.
 */
export const updateFeature: (
  input: UpdateFeatureRequest,
) => Effect.Effect<
  UpdateFeatureResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFeatureRequest,
  output: UpdateFeatureResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Starts an existing launch. To create a launch,
 * use CreateLaunch.
 */
export const startLaunch: (
  input: StartLaunchRequest,
) => Effect.Effect<
  StartLaunchResponse,
  | AccessDeniedException
  | ConflictException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartLaunchRequest,
  output: StartLaunchResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an Evidently experiment. The feature used for the experiment is not deleted.
 *
 * To stop an experiment without deleting it, use StopExperiment.
 */
export const deleteExperiment: (
  input: DeleteExperimentRequest,
) => Effect.Effect<
  DeleteExperimentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExperimentRequest,
  output: DeleteExperimentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ValidationException,
  ],
}));
