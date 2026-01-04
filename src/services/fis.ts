import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "fis",
  serviceShapeName: "FaultInjectionSimulator",
});
const auth = T.AwsAuthSigv4({ name: "fis" });
const ver = T.ServiceVersion("2020-12-01");
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
                        url: "https://fis-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://fis.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://fis-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://fis.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://fis.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class CreateTargetAccountConfigurationRequest extends S.Class<CreateTargetAccountConfigurationRequest>(
  "CreateTargetAccountConfigurationRequest",
)(
  {
    clientToken: S.optional(S.String),
    experimentTemplateId: S.String.pipe(T.HttpLabel()),
    accountId: S.String.pipe(T.HttpLabel()),
    roleArn: S.String,
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteExperimentTemplateRequest extends S.Class<DeleteExperimentTemplateRequest>(
  "DeleteExperimentTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/experimentTemplates/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTargetAccountConfigurationRequest extends S.Class<DeleteTargetAccountConfigurationRequest>(
  "DeleteTargetAccountConfigurationRequest",
)(
  {
    experimentTemplateId: S.String.pipe(T.HttpLabel()),
    accountId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetActionRequest extends S.Class<GetActionRequest>(
  "GetActionRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/actions/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentRequest extends S.Class<GetExperimentRequest>(
  "GetExperimentRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/experiments/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentTargetAccountConfigurationRequest extends S.Class<GetExperimentTargetAccountConfigurationRequest>(
  "GetExperimentTargetAccountConfigurationRequest",
)(
  {
    experimentId: S.String.pipe(T.HttpLabel()),
    accountId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/experiments/{experimentId}/targetAccountConfigurations/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetExperimentTemplateRequest extends S.Class<GetExperimentTemplateRequest>(
  "GetExperimentTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/experimentTemplates/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSafetyLeverRequest extends S.Class<GetSafetyLeverRequest>(
  "GetSafetyLeverRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/safetyLevers/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTargetAccountConfigurationRequest extends S.Class<GetTargetAccountConfigurationRequest>(
  "GetTargetAccountConfigurationRequest",
)(
  {
    experimentTemplateId: S.String.pipe(T.HttpLabel()),
    accountId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTargetResourceTypeRequest extends S.Class<GetTargetResourceTypeRequest>(
  "GetTargetResourceTypeRequest",
)(
  { resourceType: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/targetResourceTypes/{resourceType}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListActionsRequest extends S.Class<ListActionsRequest>(
  "ListActionsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/actions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExperimentResolvedTargetsRequest extends S.Class<ListExperimentResolvedTargetsRequest>(
  "ListExperimentResolvedTargetsRequest",
)(
  {
    experimentId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    targetName: S.optional(S.String).pipe(T.HttpQuery("targetName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/experiments/{experimentId}/resolvedTargets",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExperimentsRequest extends S.Class<ListExperimentsRequest>(
  "ListExperimentsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    experimentTemplateId: S.optional(S.String).pipe(
      T.HttpQuery("experimentTemplateId"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/experiments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExperimentTargetAccountConfigurationsRequest extends S.Class<ListExperimentTargetAccountConfigurationsRequest>(
  "ListExperimentTargetAccountConfigurationsRequest",
)(
  {
    experimentId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/experiments/{experimentId}/targetAccountConfigurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExperimentTemplatesRequest extends S.Class<ListExperimentTemplatesRequest>(
  "ListExperimentTemplatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/experimentTemplates" }),
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
export class ListTargetAccountConfigurationsRequest extends S.Class<ListTargetAccountConfigurationsRequest>(
  "ListTargetAccountConfigurationsRequest",
)(
  {
    experimentTemplateId: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTargetResourceTypesRequest extends S.Class<ListTargetResourceTypesRequest>(
  "ListTargetResourceTypesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/targetResourceTypes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopExperimentRequest extends S.Class<StopExperimentRequest>(
  "StopExperimentRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "DELETE", uri: "/experiments/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
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
    tagKeys: S.optional(TagKeyList).pipe(T.HttpQuery("tagKeys")),
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
export class UpdateTargetAccountConfigurationRequest extends S.Class<UpdateTargetAccountConfigurationRequest>(
  "UpdateTargetAccountConfigurationRequest",
)(
  {
    experimentTemplateId: S.String.pipe(T.HttpLabel()),
    accountId: S.String.pipe(T.HttpLabel()),
    roleArn: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/experimentTemplates/{experimentTemplateId}/targetAccountConfigurations/{accountId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateExperimentTemplateStopConditionInput extends S.Class<CreateExperimentTemplateStopConditionInput>(
  "CreateExperimentTemplateStopConditionInput",
)({ source: S.String, value: S.optional(S.String) }) {}
export const CreateExperimentTemplateStopConditionInputList = S.Array(
  CreateExperimentTemplateStopConditionInput,
);
export class CreateExperimentTemplateExperimentOptionsInput extends S.Class<CreateExperimentTemplateExperimentOptionsInput>(
  "CreateExperimentTemplateExperimentOptionsInput",
)({
  accountTargeting: S.optional(S.String),
  emptyTargetResolutionMode: S.optional(S.String),
}) {}
export class StartExperimentExperimentOptionsInput extends S.Class<StartExperimentExperimentOptionsInput>(
  "StartExperimentExperimentOptionsInput",
)({ actionsMode: S.optional(S.String) }) {}
export class UpdateExperimentTemplateStopConditionInput extends S.Class<UpdateExperimentTemplateStopConditionInput>(
  "UpdateExperimentTemplateStopConditionInput",
)({ source: S.String, value: S.optional(S.String) }) {}
export const UpdateExperimentTemplateStopConditionInputList = S.Array(
  UpdateExperimentTemplateStopConditionInput,
);
export class ExperimentTemplateCloudWatchLogsLogConfigurationInput extends S.Class<ExperimentTemplateCloudWatchLogsLogConfigurationInput>(
  "ExperimentTemplateCloudWatchLogsLogConfigurationInput",
)({ logGroupArn: S.String }) {}
export class ExperimentTemplateS3LogConfigurationInput extends S.Class<ExperimentTemplateS3LogConfigurationInput>(
  "ExperimentTemplateS3LogConfigurationInput",
)({ bucketName: S.String, prefix: S.optional(S.String) }) {}
export class UpdateExperimentTemplateLogConfigurationInput extends S.Class<UpdateExperimentTemplateLogConfigurationInput>(
  "UpdateExperimentTemplateLogConfigurationInput",
)({
  cloudWatchLogsConfiguration: S.optional(
    ExperimentTemplateCloudWatchLogsLogConfigurationInput,
  ),
  s3Configuration: S.optional(ExperimentTemplateS3LogConfigurationInput),
  logSchemaVersion: S.optional(S.Number),
}) {}
export class UpdateExperimentTemplateExperimentOptionsInput extends S.Class<UpdateExperimentTemplateExperimentOptionsInput>(
  "UpdateExperimentTemplateExperimentOptionsInput",
)({ emptyTargetResolutionMode: S.optional(S.String) }) {}
export class ReportConfigurationS3OutputInput extends S.Class<ReportConfigurationS3OutputInput>(
  "ReportConfigurationS3OutputInput",
)({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class ExperimentTemplateReportConfigurationOutputsInput extends S.Class<ExperimentTemplateReportConfigurationOutputsInput>(
  "ExperimentTemplateReportConfigurationOutputsInput",
)({ s3Configuration: S.optional(ReportConfigurationS3OutputInput) }) {}
export class ReportConfigurationCloudWatchDashboardInput extends S.Class<ReportConfigurationCloudWatchDashboardInput>(
  "ReportConfigurationCloudWatchDashboardInput",
)({ dashboardIdentifier: S.optional(S.String) }) {}
export const ReportConfigurationCloudWatchDashboardInputList = S.Array(
  ReportConfigurationCloudWatchDashboardInput,
);
export class ExperimentTemplateReportConfigurationDataSourcesInput extends S.Class<ExperimentTemplateReportConfigurationDataSourcesInput>(
  "ExperimentTemplateReportConfigurationDataSourcesInput",
)({
  cloudWatchDashboards: S.optional(
    ReportConfigurationCloudWatchDashboardInputList,
  ),
}) {}
export class UpdateExperimentTemplateReportConfigurationInput extends S.Class<UpdateExperimentTemplateReportConfigurationInput>(
  "UpdateExperimentTemplateReportConfigurationInput",
)({
  outputs: S.optional(ExperimentTemplateReportConfigurationOutputsInput),
  dataSources: S.optional(
    ExperimentTemplateReportConfigurationDataSourcesInput,
  ),
  preExperimentDuration: S.optional(S.String),
  postExperimentDuration: S.optional(S.String),
}) {}
export class UpdateSafetyLeverStateInput extends S.Class<UpdateSafetyLeverStateInput>(
  "UpdateSafetyLeverStateInput",
)({ status: S.String, reason: S.String }) {}
export const ResourceArnList = S.Array(S.String);
export const ExperimentTemplateActionStartAfterList = S.Array(S.String);
export class TargetAccountConfiguration extends S.Class<TargetAccountConfiguration>(
  "TargetAccountConfiguration",
)({
  roleArn: S.optional(S.String),
  accountId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class DeleteTargetAccountConfigurationResponse extends S.Class<DeleteTargetAccountConfigurationResponse>(
  "DeleteTargetAccountConfigurationResponse",
)({ targetAccountConfiguration: S.optional(TargetAccountConfiguration) }) {}
export const ExperimentTemplateTargetFilterValues = S.Array(S.String);
export class ExperimentTemplateTargetFilter extends S.Class<ExperimentTemplateTargetFilter>(
  "ExperimentTemplateTargetFilter",
)({
  path: S.optional(S.String),
  values: S.optional(ExperimentTemplateTargetFilterValues),
}) {}
export const ExperimentTemplateTargetFilterList = S.Array(
  ExperimentTemplateTargetFilter,
);
export const ExperimentTemplateTargetParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ExperimentTemplateTarget extends S.Class<ExperimentTemplateTarget>(
  "ExperimentTemplateTarget",
)({
  resourceType: S.optional(S.String),
  resourceArns: S.optional(ResourceArnList),
  resourceTags: S.optional(TagMap),
  filters: S.optional(ExperimentTemplateTargetFilterList),
  selectionMode: S.optional(S.String),
  parameters: S.optional(ExperimentTemplateTargetParameterMap),
}) {}
export const ExperimentTemplateTargetMap = S.Record({
  key: S.String,
  value: ExperimentTemplateTarget,
});
export const ExperimentTemplateActionParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export const ExperimentTemplateActionTargetMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ExperimentTemplateAction extends S.Class<ExperimentTemplateAction>(
  "ExperimentTemplateAction",
)({
  actionId: S.optional(S.String),
  description: S.optional(S.String),
  parameters: S.optional(ExperimentTemplateActionParameterMap),
  targets: S.optional(ExperimentTemplateActionTargetMap),
  startAfter: S.optional(ExperimentTemplateActionStartAfterList),
}) {}
export const ExperimentTemplateActionMap = S.Record({
  key: S.String,
  value: ExperimentTemplateAction,
});
export class ExperimentTemplateStopCondition extends S.Class<ExperimentTemplateStopCondition>(
  "ExperimentTemplateStopCondition",
)({ source: S.optional(S.String), value: S.optional(S.String) }) {}
export const ExperimentTemplateStopConditionList = S.Array(
  ExperimentTemplateStopCondition,
);
export class ExperimentTemplateCloudWatchLogsLogConfiguration extends S.Class<ExperimentTemplateCloudWatchLogsLogConfiguration>(
  "ExperimentTemplateCloudWatchLogsLogConfiguration",
)({ logGroupArn: S.optional(S.String) }) {}
export class ExperimentTemplateS3LogConfiguration extends S.Class<ExperimentTemplateS3LogConfiguration>(
  "ExperimentTemplateS3LogConfiguration",
)({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class ExperimentTemplateLogConfiguration extends S.Class<ExperimentTemplateLogConfiguration>(
  "ExperimentTemplateLogConfiguration",
)({
  cloudWatchLogsConfiguration: S.optional(
    ExperimentTemplateCloudWatchLogsLogConfiguration,
  ),
  s3Configuration: S.optional(ExperimentTemplateS3LogConfiguration),
  logSchemaVersion: S.optional(S.Number),
}) {}
export class ExperimentTemplateExperimentOptions extends S.Class<ExperimentTemplateExperimentOptions>(
  "ExperimentTemplateExperimentOptions",
)({
  accountTargeting: S.optional(S.String),
  emptyTargetResolutionMode: S.optional(S.String),
}) {}
export class ReportConfigurationS3Output extends S.Class<ReportConfigurationS3Output>(
  "ReportConfigurationS3Output",
)({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class ExperimentTemplateReportConfigurationOutputs extends S.Class<ExperimentTemplateReportConfigurationOutputs>(
  "ExperimentTemplateReportConfigurationOutputs",
)({ s3Configuration: S.optional(ReportConfigurationS3Output) }) {}
export class ExperimentTemplateReportConfigurationCloudWatchDashboard extends S.Class<ExperimentTemplateReportConfigurationCloudWatchDashboard>(
  "ExperimentTemplateReportConfigurationCloudWatchDashboard",
)({ dashboardIdentifier: S.optional(S.String) }) {}
export const ExperimentTemplateReportConfigurationCloudWatchDashboardList =
  S.Array(ExperimentTemplateReportConfigurationCloudWatchDashboard);
export class ExperimentTemplateReportConfigurationDataSources extends S.Class<ExperimentTemplateReportConfigurationDataSources>(
  "ExperimentTemplateReportConfigurationDataSources",
)({
  cloudWatchDashboards: S.optional(
    ExperimentTemplateReportConfigurationCloudWatchDashboardList,
  ),
}) {}
export class ExperimentTemplateReportConfiguration extends S.Class<ExperimentTemplateReportConfiguration>(
  "ExperimentTemplateReportConfiguration",
)({
  outputs: S.optional(ExperimentTemplateReportConfigurationOutputs),
  dataSources: S.optional(ExperimentTemplateReportConfigurationDataSources),
  preExperimentDuration: S.optional(S.String),
  postExperimentDuration: S.optional(S.String),
}) {}
export class ExperimentTemplate extends S.Class<ExperimentTemplate>(
  "ExperimentTemplate",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  targets: S.optional(ExperimentTemplateTargetMap),
  actions: S.optional(ExperimentTemplateActionMap),
  stopConditions: S.optional(ExperimentTemplateStopConditionList),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  roleArn: S.optional(S.String),
  tags: S.optional(TagMap),
  logConfiguration: S.optional(ExperimentTemplateLogConfiguration),
  experimentOptions: S.optional(ExperimentTemplateExperimentOptions),
  targetAccountConfigurationsCount: S.optional(S.Number),
  experimentReportConfiguration: S.optional(
    ExperimentTemplateReportConfiguration,
  ),
}) {}
export class GetExperimentTemplateResponse extends S.Class<GetExperimentTemplateResponse>(
  "GetExperimentTemplateResponse",
)({ experimentTemplate: S.optional(ExperimentTemplate) }) {}
export class GetTargetAccountConfigurationResponse extends S.Class<GetTargetAccountConfigurationResponse>(
  "GetTargetAccountConfigurationResponse",
)({ targetAccountConfiguration: S.optional(TargetAccountConfiguration) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class StartExperimentRequest extends S.Class<StartExperimentRequest>(
  "StartExperimentRequest",
)(
  {
    clientToken: S.String,
    experimentTemplateId: S.String,
    experimentOptions: S.optional(StartExperimentExperimentOptionsInput),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/experiments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExperimentError extends S.Class<ExperimentError>(
  "ExperimentError",
)({
  accountId: S.optional(S.String),
  code: S.optional(S.String),
  location: S.optional(S.String),
}) {}
export class ExperimentState extends S.Class<ExperimentState>(
  "ExperimentState",
)({
  status: S.optional(S.String),
  reason: S.optional(S.String),
  error: S.optional(ExperimentError),
}) {}
export const ExperimentTargetFilterValues = S.Array(S.String);
export class ExperimentTargetFilter extends S.Class<ExperimentTargetFilter>(
  "ExperimentTargetFilter",
)({
  path: S.optional(S.String),
  values: S.optional(ExperimentTargetFilterValues),
}) {}
export const ExperimentTargetFilterList = S.Array(ExperimentTargetFilter);
export const ExperimentTargetParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export class ExperimentTarget extends S.Class<ExperimentTarget>(
  "ExperimentTarget",
)({
  resourceType: S.optional(S.String),
  resourceArns: S.optional(ResourceArnList),
  resourceTags: S.optional(TagMap),
  filters: S.optional(ExperimentTargetFilterList),
  selectionMode: S.optional(S.String),
  parameters: S.optional(ExperimentTargetParameterMap),
}) {}
export const ExperimentTargetMap = S.Record({
  key: S.String,
  value: ExperimentTarget,
});
export const ExperimentActionParameterMap = S.Record({
  key: S.String,
  value: S.String,
});
export const ExperimentActionTargetMap = S.Record({
  key: S.String,
  value: S.String,
});
export const ExperimentActionStartAfterList = S.Array(S.String);
export class ExperimentActionState extends S.Class<ExperimentActionState>(
  "ExperimentActionState",
)({ status: S.optional(S.String), reason: S.optional(S.String) }) {}
export class ExperimentAction extends S.Class<ExperimentAction>(
  "ExperimentAction",
)({
  actionId: S.optional(S.String),
  description: S.optional(S.String),
  parameters: S.optional(ExperimentActionParameterMap),
  targets: S.optional(ExperimentActionTargetMap),
  startAfter: S.optional(ExperimentActionStartAfterList),
  state: S.optional(ExperimentActionState),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ExperimentActionMap = S.Record({
  key: S.String,
  value: ExperimentAction,
});
export class ExperimentStopCondition extends S.Class<ExperimentStopCondition>(
  "ExperimentStopCondition",
)({ source: S.optional(S.String), value: S.optional(S.String) }) {}
export const ExperimentStopConditionList = S.Array(ExperimentStopCondition);
export class ExperimentCloudWatchLogsLogConfiguration extends S.Class<ExperimentCloudWatchLogsLogConfiguration>(
  "ExperimentCloudWatchLogsLogConfiguration",
)({ logGroupArn: S.optional(S.String) }) {}
export class ExperimentS3LogConfiguration extends S.Class<ExperimentS3LogConfiguration>(
  "ExperimentS3LogConfiguration",
)({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class ExperimentLogConfiguration extends S.Class<ExperimentLogConfiguration>(
  "ExperimentLogConfiguration",
)({
  cloudWatchLogsConfiguration: S.optional(
    ExperimentCloudWatchLogsLogConfiguration,
  ),
  s3Configuration: S.optional(ExperimentS3LogConfiguration),
  logSchemaVersion: S.optional(S.Number),
}) {}
export class ExperimentOptions extends S.Class<ExperimentOptions>(
  "ExperimentOptions",
)({
  accountTargeting: S.optional(S.String),
  emptyTargetResolutionMode: S.optional(S.String),
  actionsMode: S.optional(S.String),
}) {}
export class ExperimentReportConfigurationOutputsS3Configuration extends S.Class<ExperimentReportConfigurationOutputsS3Configuration>(
  "ExperimentReportConfigurationOutputsS3Configuration",
)({ bucketName: S.optional(S.String), prefix: S.optional(S.String) }) {}
export class ExperimentReportConfigurationOutputs extends S.Class<ExperimentReportConfigurationOutputs>(
  "ExperimentReportConfigurationOutputs",
)({
  s3Configuration: S.optional(
    ExperimentReportConfigurationOutputsS3Configuration,
  ),
}) {}
export class ExperimentReportConfigurationCloudWatchDashboard extends S.Class<ExperimentReportConfigurationCloudWatchDashboard>(
  "ExperimentReportConfigurationCloudWatchDashboard",
)({ dashboardIdentifier: S.optional(S.String) }) {}
export const ExperimentReportConfigurationCloudWatchDashboardList = S.Array(
  ExperimentReportConfigurationCloudWatchDashboard,
);
export class ExperimentReportConfigurationDataSources extends S.Class<ExperimentReportConfigurationDataSources>(
  "ExperimentReportConfigurationDataSources",
)({
  cloudWatchDashboards: S.optional(
    ExperimentReportConfigurationCloudWatchDashboardList,
  ),
}) {}
export class ExperimentReportConfiguration extends S.Class<ExperimentReportConfiguration>(
  "ExperimentReportConfiguration",
)({
  outputs: S.optional(ExperimentReportConfigurationOutputs),
  dataSources: S.optional(ExperimentReportConfigurationDataSources),
  preExperimentDuration: S.optional(S.String),
  postExperimentDuration: S.optional(S.String),
}) {}
export class ExperimentReportError extends S.Class<ExperimentReportError>(
  "ExperimentReportError",
)({ code: S.optional(S.String) }) {}
export class ExperimentReportState extends S.Class<ExperimentReportState>(
  "ExperimentReportState",
)({
  status: S.optional(S.String),
  reason: S.optional(S.String),
  error: S.optional(ExperimentReportError),
}) {}
export class ExperimentReportS3Report extends S.Class<ExperimentReportS3Report>(
  "ExperimentReportS3Report",
)({ arn: S.optional(S.String), reportType: S.optional(S.String) }) {}
export const ExperimentReportS3ReportList = S.Array(ExperimentReportS3Report);
export class ExperimentReport extends S.Class<ExperimentReport>(
  "ExperimentReport",
)({
  state: S.optional(ExperimentReportState),
  s3Reports: S.optional(ExperimentReportS3ReportList),
}) {}
export class Experiment extends S.Class<Experiment>("Experiment")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  experimentTemplateId: S.optional(S.String),
  roleArn: S.optional(S.String),
  state: S.optional(ExperimentState),
  targets: S.optional(ExperimentTargetMap),
  actions: S.optional(ExperimentActionMap),
  stopConditions: S.optional(ExperimentStopConditionList),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  logConfiguration: S.optional(ExperimentLogConfiguration),
  experimentOptions: S.optional(ExperimentOptions),
  targetAccountConfigurationsCount: S.optional(S.Number),
  experimentReportConfiguration: S.optional(ExperimentReportConfiguration),
  experimentReport: S.optional(ExperimentReport),
}) {}
export class StopExperimentResponse extends S.Class<StopExperimentResponse>(
  "StopExperimentResponse",
)({ experiment: S.optional(Experiment) }) {}
export class UpdateSafetyLeverStateRequest extends S.Class<UpdateSafetyLeverStateRequest>(
  "UpdateSafetyLeverStateRequest",
)(
  { id: S.String.pipe(T.HttpLabel()), state: UpdateSafetyLeverStateInput },
  T.all(
    T.Http({ method: "PATCH", uri: "/safetyLevers/{id}/state" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTargetAccountConfigurationResponse extends S.Class<UpdateTargetAccountConfigurationResponse>(
  "UpdateTargetAccountConfigurationResponse",
)({ targetAccountConfiguration: S.optional(TargetAccountConfiguration) }) {}
export class ExperimentTemplateTargetInputFilter extends S.Class<ExperimentTemplateTargetInputFilter>(
  "ExperimentTemplateTargetInputFilter",
)({ path: S.String, values: ExperimentTemplateTargetFilterValues }) {}
export const ExperimentTemplateTargetFilterInputList = S.Array(
  ExperimentTemplateTargetInputFilter,
);
export class UpdateExperimentTemplateTargetInput extends S.Class<UpdateExperimentTemplateTargetInput>(
  "UpdateExperimentTemplateTargetInput",
)({
  resourceType: S.String,
  resourceArns: S.optional(ResourceArnList),
  resourceTags: S.optional(TagMap),
  filters: S.optional(ExperimentTemplateTargetFilterInputList),
  selectionMode: S.String,
  parameters: S.optional(ExperimentTemplateTargetParameterMap),
}) {}
export class UpdateExperimentTemplateActionInputItem extends S.Class<UpdateExperimentTemplateActionInputItem>(
  "UpdateExperimentTemplateActionInputItem",
)({
  actionId: S.optional(S.String),
  description: S.optional(S.String),
  parameters: S.optional(ExperimentTemplateActionParameterMap),
  targets: S.optional(ExperimentTemplateActionTargetMap),
  startAfter: S.optional(ExperimentTemplateActionStartAfterList),
}) {}
export class CreateExperimentTemplateLogConfigurationInput extends S.Class<CreateExperimentTemplateLogConfigurationInput>(
  "CreateExperimentTemplateLogConfigurationInput",
)({
  cloudWatchLogsConfiguration: S.optional(
    ExperimentTemplateCloudWatchLogsLogConfigurationInput,
  ),
  s3Configuration: S.optional(ExperimentTemplateS3LogConfigurationInput),
  logSchemaVersion: S.Number,
}) {}
export class ExperimentTargetAccountConfiguration extends S.Class<ExperimentTargetAccountConfiguration>(
  "ExperimentTargetAccountConfiguration",
)({
  roleArn: S.optional(S.String),
  accountId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export class ActionTarget extends S.Class<ActionTarget>("ActionTarget")({
  resourceType: S.optional(S.String),
}) {}
export const ActionTargetMap = S.Record({ key: S.String, value: ActionTarget });
export class ActionSummary extends S.Class<ActionSummary>("ActionSummary")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  targets: S.optional(ActionTargetMap),
  tags: S.optional(TagMap),
}) {}
export const ActionSummaryList = S.Array(ActionSummary);
export class ExperimentSummary extends S.Class<ExperimentSummary>(
  "ExperimentSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  experimentTemplateId: S.optional(S.String),
  state: S.optional(ExperimentState),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  experimentOptions: S.optional(ExperimentOptions),
}) {}
export const ExperimentSummaryList = S.Array(ExperimentSummary);
export class ExperimentTargetAccountConfigurationSummary extends S.Class<ExperimentTargetAccountConfigurationSummary>(
  "ExperimentTargetAccountConfigurationSummary",
)({
  roleArn: S.optional(S.String),
  accountId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const ExperimentTargetAccountConfigurationList = S.Array(
  ExperimentTargetAccountConfigurationSummary,
);
export class ExperimentTemplateSummary extends S.Class<ExperimentTemplateSummary>(
  "ExperimentTemplateSummary",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
}) {}
export const ExperimentTemplateSummaryList = S.Array(ExperimentTemplateSummary);
export class TargetAccountConfigurationSummary extends S.Class<TargetAccountConfigurationSummary>(
  "TargetAccountConfigurationSummary",
)({
  roleArn: S.optional(S.String),
  accountId: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const TargetAccountConfigurationList = S.Array(
  TargetAccountConfigurationSummary,
);
export class TargetResourceTypeSummary extends S.Class<TargetResourceTypeSummary>(
  "TargetResourceTypeSummary",
)({ resourceType: S.optional(S.String), description: S.optional(S.String) }) {}
export const TargetResourceTypeSummaryList = S.Array(TargetResourceTypeSummary);
export const UpdateExperimentTemplateTargetInputMap = S.Record({
  key: S.String,
  value: UpdateExperimentTemplateTargetInput,
});
export const UpdateExperimentTemplateActionInputMap = S.Record({
  key: S.String,
  value: UpdateExperimentTemplateActionInputItem,
});
export class CreateTargetAccountConfigurationResponse extends S.Class<CreateTargetAccountConfigurationResponse>(
  "CreateTargetAccountConfigurationResponse",
)({ targetAccountConfiguration: S.optional(TargetAccountConfiguration) }) {}
export class GetExperimentTargetAccountConfigurationResponse extends S.Class<GetExperimentTargetAccountConfigurationResponse>(
  "GetExperimentTargetAccountConfigurationResponse",
)({
  targetAccountConfiguration: S.optional(ExperimentTargetAccountConfiguration),
}) {}
export class ListActionsResponse extends S.Class<ListActionsResponse>(
  "ListActionsResponse",
)({
  actions: S.optional(ActionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListExperimentsResponse extends S.Class<ListExperimentsResponse>(
  "ListExperimentsResponse",
)({
  experiments: S.optional(ExperimentSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListExperimentTargetAccountConfigurationsResponse extends S.Class<ListExperimentTargetAccountConfigurationsResponse>(
  "ListExperimentTargetAccountConfigurationsResponse",
)({
  targetAccountConfigurations: S.optional(
    ExperimentTargetAccountConfigurationList,
  ),
  nextToken: S.optional(S.String),
}) {}
export class ListExperimentTemplatesResponse extends S.Class<ListExperimentTemplatesResponse>(
  "ListExperimentTemplatesResponse",
)({
  experimentTemplates: S.optional(ExperimentTemplateSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListTargetAccountConfigurationsResponse extends S.Class<ListTargetAccountConfigurationsResponse>(
  "ListTargetAccountConfigurationsResponse",
)({
  targetAccountConfigurations: S.optional(TargetAccountConfigurationList),
  nextToken: S.optional(S.String),
}) {}
export class ListTargetResourceTypesResponse extends S.Class<ListTargetResourceTypesResponse>(
  "ListTargetResourceTypesResponse",
)({
  targetResourceTypes: S.optional(TargetResourceTypeSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class StartExperimentResponse extends S.Class<StartExperimentResponse>(
  "StartExperimentResponse",
)({ experiment: S.optional(Experiment) }) {}
export class UpdateExperimentTemplateRequest extends S.Class<UpdateExperimentTemplateRequest>(
  "UpdateExperimentTemplateRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel()),
    description: S.optional(S.String),
    stopConditions: S.optional(UpdateExperimentTemplateStopConditionInputList),
    targets: S.optional(UpdateExperimentTemplateTargetInputMap),
    actions: S.optional(UpdateExperimentTemplateActionInputMap),
    roleArn: S.optional(S.String),
    logConfiguration: S.optional(UpdateExperimentTemplateLogConfigurationInput),
    experimentOptions: S.optional(
      UpdateExperimentTemplateExperimentOptionsInput,
    ),
    experimentReportConfiguration: S.optional(
      UpdateExperimentTemplateReportConfigurationInput,
    ),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/experimentTemplates/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SafetyLeverState extends S.Class<SafetyLeverState>(
  "SafetyLeverState",
)({ status: S.optional(S.String), reason: S.optional(S.String) }) {}
export class SafetyLever extends S.Class<SafetyLever>("SafetyLever")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  state: S.optional(SafetyLeverState),
}) {}
export class UpdateSafetyLeverStateResponse extends S.Class<UpdateSafetyLeverStateResponse>(
  "UpdateSafetyLeverStateResponse",
)({ safetyLever: S.optional(SafetyLever) }) {}
export class CreateExperimentTemplateTargetInput extends S.Class<CreateExperimentTemplateTargetInput>(
  "CreateExperimentTemplateTargetInput",
)({
  resourceType: S.String,
  resourceArns: S.optional(ResourceArnList),
  resourceTags: S.optional(TagMap),
  filters: S.optional(ExperimentTemplateTargetFilterInputList),
  selectionMode: S.String,
  parameters: S.optional(ExperimentTemplateTargetParameterMap),
}) {}
export class CreateExperimentTemplateActionInput extends S.Class<CreateExperimentTemplateActionInput>(
  "CreateExperimentTemplateActionInput",
)({
  actionId: S.String,
  description: S.optional(S.String),
  parameters: S.optional(ExperimentTemplateActionParameterMap),
  targets: S.optional(ExperimentTemplateActionTargetMap),
  startAfter: S.optional(ExperimentTemplateActionStartAfterList),
}) {}
export const TargetInformationMap = S.Record({
  key: S.String,
  value: S.String,
});
export const CreateExperimentTemplateTargetInputMap = S.Record({
  key: S.String,
  value: CreateExperimentTemplateTargetInput,
});
export const CreateExperimentTemplateActionInputMap = S.Record({
  key: S.String,
  value: CreateExperimentTemplateActionInput,
});
export class CreateExperimentTemplateReportConfigurationInput extends S.Class<CreateExperimentTemplateReportConfigurationInput>(
  "CreateExperimentTemplateReportConfigurationInput",
)({
  outputs: S.optional(ExperimentTemplateReportConfigurationOutputsInput),
  dataSources: S.optional(
    ExperimentTemplateReportConfigurationDataSourcesInput,
  ),
  preExperimentDuration: S.optional(S.String),
  postExperimentDuration: S.optional(S.String),
}) {}
export class ResolvedTarget extends S.Class<ResolvedTarget>("ResolvedTarget")({
  resourceType: S.optional(S.String),
  targetName: S.optional(S.String),
  targetInformation: S.optional(TargetInformationMap),
}) {}
export const ResolvedTargetList = S.Array(ResolvedTarget);
export class ActionParameter extends S.Class<ActionParameter>(
  "ActionParameter",
)({ description: S.optional(S.String), required: S.optional(S.Boolean) }) {}
export class TargetResourceTypeParameter extends S.Class<TargetResourceTypeParameter>(
  "TargetResourceTypeParameter",
)({ description: S.optional(S.String), required: S.optional(S.Boolean) }) {}
export class CreateExperimentTemplateRequest extends S.Class<CreateExperimentTemplateRequest>(
  "CreateExperimentTemplateRequest",
)(
  {
    clientToken: S.String,
    description: S.String,
    stopConditions: CreateExperimentTemplateStopConditionInputList,
    targets: S.optional(CreateExperimentTemplateTargetInputMap),
    actions: CreateExperimentTemplateActionInputMap,
    roleArn: S.String,
    tags: S.optional(TagMap),
    logConfiguration: S.optional(CreateExperimentTemplateLogConfigurationInput),
    experimentOptions: S.optional(
      CreateExperimentTemplateExperimentOptionsInput,
    ),
    experimentReportConfiguration: S.optional(
      CreateExperimentTemplateReportConfigurationInput,
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/experimentTemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSafetyLeverResponse extends S.Class<GetSafetyLeverResponse>(
  "GetSafetyLeverResponse",
)({ safetyLever: S.optional(SafetyLever) }) {}
export class ListExperimentResolvedTargetsResponse extends S.Class<ListExperimentResolvedTargetsResponse>(
  "ListExperimentResolvedTargetsResponse",
)({
  resolvedTargets: S.optional(ResolvedTargetList),
  nextToken: S.optional(S.String),
}) {}
export class UpdateExperimentTemplateResponse extends S.Class<UpdateExperimentTemplateResponse>(
  "UpdateExperimentTemplateResponse",
)({ experimentTemplate: S.optional(ExperimentTemplate) }) {}
export const ActionParameterMap = S.Record({
  key: S.String,
  value: ActionParameter,
});
export const TargetResourceTypeParameterMap = S.Record({
  key: S.String,
  value: TargetResourceTypeParameter,
});
export class Action extends S.Class<Action>("Action")({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
  parameters: S.optional(ActionParameterMap),
  targets: S.optional(ActionTargetMap),
  tags: S.optional(TagMap),
}) {}
export class TargetResourceType extends S.Class<TargetResourceType>(
  "TargetResourceType",
)({
  resourceType: S.optional(S.String),
  description: S.optional(S.String),
  parameters: S.optional(TargetResourceTypeParameterMap),
}) {}
export class CreateExperimentTemplateResponse extends S.Class<CreateExperimentTemplateResponse>(
  "CreateExperimentTemplateResponse",
)({ experimentTemplate: S.optional(ExperimentTemplate) }) {}
export class GetActionResponse extends S.Class<GetActionResponse>(
  "GetActionResponse",
)({ action: S.optional(Action) }) {}
export class GetTargetResourceTypeResponse extends S.Class<GetTargetResourceTypeResponse>(
  "GetTargetResourceTypeResponse",
)({ targetResourceType: S.optional(TargetResourceType) }) {}
export class DeleteExperimentTemplateResponse extends S.Class<DeleteExperimentTemplateResponse>(
  "DeleteExperimentTemplateResponse",
)({ experimentTemplate: S.optional(ExperimentTemplate) }) {}
export class GetExperimentResponse extends S.Class<GetExperimentResponse>(
  "GetExperimentResponse",
)({ experiment: S.optional(Experiment) }) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
  T.AwsQueryError({ code: "ConflictException", httpResponseCode: 409 }),
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
  T.AwsQueryError({
    code: "ServiceQuotaExceededException",
    httpResponseCode: 402,
  }),
) {}

//# Operations
/**
 * Applies the specified tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [],
}));
/**
 * Removes the specified tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [],
}));
/**
 * Gets information about the specified target account configuration of the experiment template.
 */
export const getTargetAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetTargetAccountConfigurationRequest,
    output: GetTargetAccountConfigurationResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [],
}));
/**
 * Stops the specified experiment.
 */
export const stopExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopExperimentRequest,
  output: StopExperimentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Updates the target account configuration for the specified experiment template.
 */
export const updateTargetAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateTargetAccountConfigurationRequest,
    output: UpdateTargetAccountConfigurationResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Deletes the specified target account configuration of the experiment template.
 */
export const deleteTargetAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteTargetAccountConfigurationRequest,
    output: DeleteTargetAccountConfigurationResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Gets information about the specified target account configuration of the experiment.
 */
export const getExperimentTargetAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetExperimentTargetAccountConfigurationRequest,
    output: GetExperimentTargetAccountConfigurationResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Gets information about the specified experiment template.
 */
export const getExperimentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetExperimentTemplateRequest,
    output: GetExperimentTemplateResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Lists the available FIS actions.
 */
export const listActions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListActionsRequest,
  output: ListActionsResponse,
  errors: [ValidationException],
}));
/**
 * Lists your experiments.
 */
export const listExperiments = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExperimentsRequest,
  output: ListExperimentsResponse,
  errors: [ValidationException],
}));
/**
 * Lists the target account configurations of the specified experiment.
 */
export const listExperimentTargetAccountConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListExperimentTargetAccountConfigurationsRequest,
    output: ListExperimentTargetAccountConfigurationsResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Lists your experiment templates.
 */
export const listExperimentTemplates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListExperimentTemplatesRequest,
    output: ListExperimentTemplatesResponse,
    errors: [ValidationException],
  }),
);
/**
 * Lists the target account configurations of the specified experiment template.
 */
export const listTargetAccountConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListTargetAccountConfigurationsRequest,
    output: ListTargetAccountConfigurationsResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Lists the target resource types.
 */
export const listTargetResourceTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTargetResourceTypesRequest,
    output: ListTargetResourceTypesResponse,
    errors: [ValidationException],
  }),
);
/**
 * Updates the specified safety lever state.
 */
export const updateSafetyLeverState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSafetyLeverStateRequest,
    output: UpdateSafetyLeverStateResponse,
    errors: [ConflictException, ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Creates a target account configuration for the experiment template. A target account configuration
 * is required when `accountTargeting` of `experimentOptions` is set to `multi-account`.
 * For more information, see experiment options
 * in the *Fault Injection Service User Guide*.
 */
export const createTargetAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateTargetAccountConfigurationRequest,
    output: CreateTargetAccountConfigurationResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }));
/**
 * Gets information about the specified safety lever.
 */
export const getSafetyLever = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSafetyLeverRequest,
  output: GetSafetyLeverResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Lists the resolved targets information of the specified experiment.
 */
export const listExperimentResolvedTargets =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListExperimentResolvedTargetsRequest,
    output: ListExperimentResolvedTargetsResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }));
/**
 * Starts running an experiment from the specified experiment template.
 */
export const startExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExperimentRequest,
  output: StartExperimentResponse,
  errors: [
    ConflictException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Updates the specified experiment template.
 */
export const updateExperimentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateExperimentTemplateRequest,
    output: UpdateExperimentTemplateResponse,
    errors: [
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Creates an experiment template.
 *
 * An experiment template includes the following components:
 *
 * - **Targets**: A target can be a specific resource in
 * your Amazon Web Services environment, or one or more resources that match criteria that you
 * specify, for example, resources that have specific tags.
 *
 * - **Actions**: The actions to carry out on the
 * target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.
 *
 * - **Stop conditions**: If a stop condition is
 * triggered while an experiment is running, the experiment is automatically
 * stopped. You can define a stop condition as a CloudWatch alarm.
 *
 * For more information, see experiment templates
 * in the *Fault Injection Service User Guide*.
 */
export const createExperimentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExperimentTemplateRequest,
    output: CreateExperimentTemplateResponse,
    errors: [
      ConflictException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about the specified FIS action.
 */
export const getAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetActionRequest,
  output: GetActionResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Gets information about the specified resource type.
 */
export const getTargetResourceType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTargetResourceTypeRequest,
    output: GetTargetResourceTypeResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Deletes the specified experiment template.
 */
export const deleteExperimentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteExperimentTemplateRequest,
    output: DeleteExperimentTemplateResponse,
    errors: [ResourceNotFoundException, ValidationException],
  }),
);
/**
 * Gets information about the specified experiment.
 */
export const getExperiment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExperimentRequest,
  output: GetExperimentResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
