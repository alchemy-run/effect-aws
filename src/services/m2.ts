import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "m2",
  serviceShapeName: "AwsSupernovaControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "m2" });
const ver = T.ServiceVersion("2021-04-28");
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
                        url: "https://m2-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://m2-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://m2.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://m2.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetSignedBluinsightsUrlRequest extends S.Class<GetSignedBluinsightsUrlRequest>(
  "GetSignedBluinsightsUrlRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export const EntityNameList = S.Array(S.String);
export const IdentifierList = S.Array(S.String);
export const String50List = S.Array(S.String);
export class GetSignedBluinsightsUrlResponse extends S.Class<GetSignedBluinsightsUrlResponse>(
  "GetSignedBluinsightsUrlResponse",
)({ signedBiUrl: S.String }) {}
export class ListEngineVersionsRequest extends S.Class<ListEngineVersionsRequest>(
  "ListEngineVersionsRequest",
)(
  {
    engineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/engine-versions" }),
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
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const Definition = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ content: S.String }),
);
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    description: S.optional(S.String),
    currentApplicationVersion: S.Number,
    definition: S.optional(Definition),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    names: S.optional(EntityNameList).pipe(T.HttpQuery("names")),
    environmentId: S.optional(S.String).pipe(T.HttpQuery("environmentId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelBatchJobExecutionRequest extends S.Class<CancelBatchJobExecutionRequest>(
  "CancelBatchJobExecutionRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    authSecretsManagerArn: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{applicationId}/batch-job-executions/{executionId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelBatchJobExecutionResponse extends S.Class<CancelBatchJobExecutionResponse>(
  "CancelBatchJobExecutionResponse",
)({}) {}
export class CreateDeploymentRequest extends S.Class<CreateDeploymentRequest>(
  "CreateDeploymentRequest",
)(
  {
    environmentId: S.String,
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    applicationVersion: S.Number,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{applicationId}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationFromEnvironmentRequest extends S.Class<DeleteApplicationFromEnvironmentRequest>(
  "DeleteApplicationFromEnvironmentRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/applications/{applicationId}/environment/{environmentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationFromEnvironmentResponse extends S.Class<DeleteApplicationFromEnvironmentResponse>(
  "DeleteApplicationFromEnvironmentResponse",
)({}) {}
export class GetApplicationVersionRequest extends S.Class<GetApplicationVersionRequest>(
  "GetApplicationVersionRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    applicationVersion: S.Number.pipe(T.HttpLabel("applicationVersion")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/versions/{applicationVersion}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBatchJobExecutionRequest extends S.Class<GetBatchJobExecutionRequest>(
  "GetBatchJobExecutionRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/batch-job-executions/{executionId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSetDetailsRequest extends S.Class<GetDataSetDetailsRequest>(
  "GetDataSetDetailsRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    dataSetName: S.String.pipe(T.HttpLabel("dataSetName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/datasets/{dataSetName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSetExportTaskRequest extends S.Class<GetDataSetExportTaskRequest>(
  "GetDataSetExportTaskRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/dataset-export-tasks/{taskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDataSetImportTaskRequest extends S.Class<GetDataSetImportTaskRequest>(
  "GetDataSetImportTaskRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/dataset-import-tasks/{taskId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDeploymentRequest extends S.Class<GetDeploymentRequest>(
  "GetDeploymentRequest",
)(
  {
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/deployments/{deploymentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListApplicationVersionsRequest extends S.Class<ListApplicationVersionsRequest>(
  "ListApplicationVersionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBatchJobDefinitionsRequest extends S.Class<ListBatchJobDefinitionsRequest>(
  "ListBatchJobDefinitionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/batch-job-definitions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBatchJobExecutionsRequest extends S.Class<ListBatchJobExecutionsRequest>(
  "ListBatchJobExecutionsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionIds: S.optional(IdentifierList).pipe(T.HttpQuery("executionIds")),
    jobName: S.optional(S.String).pipe(T.HttpQuery("jobName")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    startedAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("startedAfter")),
    startedBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("startedBefore")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/batch-job-executions",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBatchJobRestartPointsRequest extends S.Class<ListBatchJobRestartPointsRequest>(
  "ListBatchJobRestartPointsRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    authSecretsManagerArn: S.optional(S.String).pipe(
      T.HttpQuery("authSecretsManagerArn"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/batch-job-executions/{executionId}/steps",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetExportHistoryRequest extends S.Class<ListDataSetExportHistoryRequest>(
  "ListDataSetExportHistoryRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/dataset-export-tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetImportHistoryRequest extends S.Class<ListDataSetImportHistoryRequest>(
  "ListDataSetImportHistoryRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/applications/{applicationId}/dataset-import-tasks",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDataSetsRequest extends S.Class<ListDataSetsRequest>(
  "ListDataSetsRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    nameFilter: S.optional(S.String).pipe(T.HttpQuery("nameFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}/datasets" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeploymentsRequest extends S.Class<ListDeploymentsRequest>(
  "ListDeploymentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}/deployments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationRequest extends S.Class<StartApplicationRequest>(
  "StartApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationResponse extends S.Class<StartApplicationResponse>(
  "StartApplicationResponse",
)({}) {}
export class StopApplicationRequest extends S.Class<StopApplicationRequest>(
  "StopApplicationRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    forceStop: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopApplicationResponse extends S.Class<StopApplicationResponse>(
  "StopApplicationResponse",
)({}) {}
export class GetEnvironmentRequest extends S.Class<GetEnvironmentRequest>(
  "GetEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(
    T.Http({ method: "GET", uri: "/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEnvironmentRequest extends S.Class<UpdateEnvironmentRequest>(
  "UpdateEnvironmentRequest",
)(
  {
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    desiredCapacity: S.optional(S.Number),
    instanceType: S.optional(S.String),
    engineVersion: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    applyDuringMaintenanceWindow: S.optional(S.Boolean),
    forceUpdate: S.optional(S.Boolean),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentRequest extends S.Class<DeleteEnvironmentRequest>(
  "DeleteEnvironmentRequest",
)(
  { environmentId: S.String.pipe(T.HttpLabel("environmentId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/environments/{environmentId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEnvironmentResponse extends S.Class<DeleteEnvironmentResponse>(
  "DeleteEnvironmentResponse",
)({}) {}
export class ListEnvironmentsRequest extends S.Class<ListEnvironmentsRequest>(
  "ListEnvironmentsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    names: S.optional(EntityNameList).pipe(T.HttpQuery("names")),
    engineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export const ArnList = S.Array(S.String);
export const PortList = S.Array(S.Number);
export class ApplicationVersionSummary extends S.Class<ApplicationVersionSummary>(
  "ApplicationVersionSummary",
)({
  applicationVersion: S.Number,
  status: S.String,
  statusReason: S.optional(S.String),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ApplicationVersionSummaryList = S.Array(ApplicationVersionSummary);
export const BatchJobParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class HighAvailabilityConfig extends S.Class<HighAvailabilityConfig>(
  "HighAvailabilityConfig",
)({ desiredCapacity: S.Number }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: TagMap }) {}
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
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    engineType: S.String,
    definition: Definition,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    roleArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({ applicationVersion: S.Number }) {}
export class CreateDeploymentResponse extends S.Class<CreateDeploymentResponse>(
  "CreateDeploymentResponse",
)({ deploymentId: S.String }) {}
export class GetApplicationVersionResponse extends S.Class<GetApplicationVersionResponse>(
  "GetApplicationVersionResponse",
)({
  name: S.String,
  applicationVersion: S.Number,
  description: S.optional(S.String),
  definitionContent: S.String,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  statusReason: S.optional(S.String),
}) {}
export class GetDeploymentResponse extends S.Class<GetDeploymentResponse>(
  "GetDeploymentResponse",
)({
  deploymentId: S.String,
  applicationId: S.String,
  environmentId: S.String,
  applicationVersion: S.Number,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  statusReason: S.optional(S.String),
}) {}
export class ListApplicationVersionsResponse extends S.Class<ListApplicationVersionsResponse>(
  "ListApplicationVersionsResponse",
)({
  applicationVersions: ApplicationVersionSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class UpdateEnvironmentResponse extends S.Class<UpdateEnvironmentResponse>(
  "UpdateEnvironmentResponse",
)({ environmentId: S.String }) {}
export class FileBatchJobIdentifier extends S.Class<FileBatchJobIdentifier>(
  "FileBatchJobIdentifier",
)({ fileName: S.String, folderPath: S.optional(S.String) }) {}
export class ScriptBatchJobIdentifier extends S.Class<ScriptBatchJobIdentifier>(
  "ScriptBatchJobIdentifier",
)({ scriptName: S.String }) {}
export class JobStepRestartMarker extends S.Class<JobStepRestartMarker>(
  "JobStepRestartMarker",
)({
  fromStep: S.String,
  fromProcStep: S.optional(S.String),
  toStep: S.optional(S.String),
  toProcStep: S.optional(S.String),
  stepCheckpoint: S.optional(S.Number),
  skip: S.optional(S.Boolean),
}) {}
export class RestartBatchJobIdentifier extends S.Class<RestartBatchJobIdentifier>(
  "RestartBatchJobIdentifier",
)({ executionId: S.String, jobStepRestartMarker: JobStepRestartMarker }) {}
export class EfsStorageConfiguration extends S.Class<EfsStorageConfiguration>(
  "EfsStorageConfiguration",
)({
  fileSystemId: S.String.pipe(T.JsonName("file-system-id")),
  mountPoint: S.String.pipe(T.JsonName("mount-point")),
}) {}
export class FsxStorageConfiguration extends S.Class<FsxStorageConfiguration>(
  "FsxStorageConfiguration",
)({
  fileSystemId: S.String.pipe(T.JsonName("file-system-id")),
  mountPoint: S.String.pipe(T.JsonName("mount-point")),
}) {}
export class EngineVersionsSummary extends S.Class<EngineVersionsSummary>(
  "EngineVersionsSummary",
)({ engineType: S.String, engineVersion: S.String }) {}
export const EngineVersionsSummaryList = S.Array(EngineVersionsSummary);
export class DeployedVersionSummary extends S.Class<DeployedVersionSummary>(
  "DeployedVersionSummary",
)({
  applicationVersion: S.Number,
  status: S.String,
  statusReason: S.optional(S.String),
}) {}
export class LogGroupSummary extends S.Class<LogGroupSummary>(
  "LogGroupSummary",
)({ logType: S.String, logGroupName: S.String }) {}
export const LogGroupSummaries = S.Array(LogGroupSummary);
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
  name: S.String,
  description: S.optional(S.String),
  applicationId: S.String,
  applicationArn: S.String,
  applicationVersion: S.Number,
  status: S.String,
  engineType: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentId: S.optional(S.String),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  versionStatus: S.optional(S.String),
  deploymentStatus: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export const ApplicationSummaryList = S.Array(ApplicationSummary);
export class DataSetExportSummary extends S.Class<DataSetExportSummary>(
  "DataSetExportSummary",
)({
  total: S.Number,
  succeeded: S.Number,
  failed: S.Number,
  pending: S.Number,
  inProgress: S.Number,
}) {}
export class DataSetImportSummary extends S.Class<DataSetImportSummary>(
  "DataSetImportSummary",
)({
  total: S.Number,
  succeeded: S.Number,
  failed: S.Number,
  pending: S.Number,
  inProgress: S.Number,
}) {}
export const JobIdentifier = S.Union(
  S.Struct({ fileName: S.String }),
  S.Struct({ scriptName: S.String }),
);
export class S3BatchJobIdentifier extends S.Class<S3BatchJobIdentifier>(
  "S3BatchJobIdentifier",
)({
  bucket: S.String,
  keyPrefix: S.optional(S.String),
  identifier: JobIdentifier,
}) {}
export const BatchJobIdentifier = S.Union(
  S.Struct({ fileBatchJobIdentifier: FileBatchJobIdentifier }),
  S.Struct({ scriptBatchJobIdentifier: ScriptBatchJobIdentifier }),
  S.Struct({ s3BatchJobIdentifier: S3BatchJobIdentifier }),
  S.Struct({ restartBatchJobIdentifier: RestartBatchJobIdentifier }),
);
export class BatchJobExecutionSummary extends S.Class<BatchJobExecutionSummary>(
  "BatchJobExecutionSummary",
)({
  executionId: S.String,
  applicationId: S.String,
  jobId: S.optional(S.String),
  jobName: S.optional(S.String),
  jobType: S.optional(S.String),
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  returnCode: S.optional(S.String),
  batchJobIdentifier: S.optional(BatchJobIdentifier),
}) {}
export const BatchJobExecutionSummaryList = S.Array(BatchJobExecutionSummary);
export class JobStep extends S.Class<JobStep>("JobStep")({
  stepNumber: S.optional(S.Number),
  stepName: S.optional(S.String),
  procStepNumber: S.optional(S.Number),
  procStepName: S.optional(S.String),
  stepCondCode: S.optional(S.String),
  stepRestartable: S.optional(S.Boolean),
  stepCheckpoint: S.optional(S.Number),
  stepCheckpointStatus: S.optional(S.String),
  stepCheckpointTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const BatchJobStepList = S.Array(JobStep);
export class DataSetExportTask extends S.Class<DataSetExportTask>(
  "DataSetExportTask",
)({
  taskId: S.String,
  status: S.String,
  summary: DataSetExportSummary,
  statusReason: S.optional(S.String),
}) {}
export const DataSetExportTaskList = S.Array(DataSetExportTask);
export class DataSetImportTask extends S.Class<DataSetImportTask>(
  "DataSetImportTask",
)({
  taskId: S.String,
  status: S.String,
  summary: DataSetImportSummary,
  statusReason: S.optional(S.String),
}) {}
export const DataSetImportTaskList = S.Array(DataSetImportTask);
export class DataSetSummary extends S.Class<DataSetSummary>("DataSetSummary")({
  dataSetName: S.String,
  dataSetOrg: S.optional(S.String),
  format: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastReferencedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const DataSetsSummaryList = S.Array(DataSetSummary);
export class DeploymentSummary extends S.Class<DeploymentSummary>(
  "DeploymentSummary",
)({
  deploymentId: S.String,
  applicationId: S.String,
  environmentId: S.String,
  applicationVersion: S.Number,
  status: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  statusReason: S.optional(S.String),
}) {}
export const DeploymentList = S.Array(DeploymentSummary);
export const StorageConfiguration = S.Union(
  S.Struct({ efs: EfsStorageConfiguration }),
  S.Struct({ fsx: FsxStorageConfiguration }),
);
export const StorageConfigurationList = S.Array(StorageConfiguration);
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
  name: S.String,
  environmentArn: S.String,
  environmentId: S.String,
  instanceType: S.String,
  status: S.String,
  engineType: S.String,
  engineVersion: S.String,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  networkType: S.optional(S.String),
}) {}
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export const ExternalLocation = S.Union(S.Struct({ s3Location: S.String }));
export class ListEngineVersionsResponse extends S.Class<ListEngineVersionsResponse>(
  "ListEngineVersionsResponse",
)({
  engineVersions: EngineVersionsSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({
  applicationArn: S.String,
  applicationId: S.String,
  applicationVersion: S.Number,
}) {}
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  applicationId: S.String,
  applicationArn: S.String,
  status: S.String,
  latestVersion: ApplicationVersionSummary,
  deployedVersion: S.optional(DeployedVersionSummary),
  engineType: S.String,
  logGroups: S.optional(LogGroupSummaries),
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  environmentId: S.optional(S.String),
  targetGroupArns: S.optional(ArnList),
  listenerArns: S.optional(ArnList),
  listenerPorts: S.optional(PortList),
  loadBalancerDnsName: S.optional(S.String),
  statusReason: S.optional(S.String),
  kmsKeyId: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({ applications: ApplicationSummaryList, nextToken: S.optional(S.String) }) {}
export class GetBatchJobExecutionResponse extends S.Class<GetBatchJobExecutionResponse>(
  "GetBatchJobExecutionResponse",
)({
  executionId: S.String,
  applicationId: S.String,
  jobId: S.optional(S.String),
  jobName: S.optional(S.String),
  jobUser: S.optional(S.String),
  jobType: S.optional(S.String),
  status: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusReason: S.optional(S.String),
  returnCode: S.optional(S.String),
  batchJobIdentifier: S.optional(BatchJobIdentifier),
  jobStepRestartMarker: S.optional(JobStepRestartMarker),
}) {}
export class GetDataSetExportTaskResponse extends S.Class<GetDataSetExportTaskResponse>(
  "GetDataSetExportTaskResponse",
)({
  taskId: S.String,
  status: S.String,
  summary: S.optional(DataSetExportSummary),
  statusReason: S.optional(S.String),
  kmsKeyArn: S.optional(S.String),
}) {}
export class GetDataSetImportTaskResponse extends S.Class<GetDataSetImportTaskResponse>(
  "GetDataSetImportTaskResponse",
)({
  taskId: S.String,
  status: S.String,
  summary: S.optional(DataSetImportSummary),
}) {}
export class ListBatchJobExecutionsResponse extends S.Class<ListBatchJobExecutionsResponse>(
  "ListBatchJobExecutionsResponse",
)({
  batchJobExecutions: BatchJobExecutionSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListBatchJobRestartPointsResponse extends S.Class<ListBatchJobRestartPointsResponse>(
  "ListBatchJobRestartPointsResponse",
)({ batchJobSteps: S.optional(BatchJobStepList) }) {}
export class ListDataSetExportHistoryResponse extends S.Class<ListDataSetExportHistoryResponse>(
  "ListDataSetExportHistoryResponse",
)({
  dataSetExportTasks: DataSetExportTaskList,
  nextToken: S.optional(S.String),
}) {}
export class ListDataSetImportHistoryResponse extends S.Class<ListDataSetImportHistoryResponse>(
  "ListDataSetImportHistoryResponse",
)({
  dataSetImportTasks: DataSetImportTaskList,
  nextToken: S.optional(S.String),
}) {}
export class ListDataSetsResponse extends S.Class<ListDataSetsResponse>(
  "ListDataSetsResponse",
)({ dataSets: DataSetsSummaryList, nextToken: S.optional(S.String) }) {}
export class ListDeploymentsResponse extends S.Class<ListDeploymentsResponse>(
  "ListDeploymentsResponse",
)({ deployments: DeploymentList, nextToken: S.optional(S.String) }) {}
export class CreateEnvironmentRequest extends S.Class<CreateEnvironmentRequest>(
  "CreateEnvironmentRequest",
)(
  {
    name: S.String,
    instanceType: S.String,
    description: S.optional(S.String),
    engineType: S.String,
    engineVersion: S.optional(S.String),
    subnetIds: S.optional(String50List),
    securityGroupIds: S.optional(String50List),
    storageConfigurations: S.optional(StorageConfigurationList),
    publiclyAccessible: S.optional(S.Boolean),
    highAvailabilityConfig: S.optional(HighAvailabilityConfig),
    tags: S.optional(TagMap),
    preferredMaintenanceWindow: S.optional(S.String),
    networkType: S.optional(S.String),
    clientToken: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/environments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEnvironmentsResponse extends S.Class<ListEnvironmentsResponse>(
  "ListEnvironmentsResponse",
)({ environments: EnvironmentSummaryList, nextToken: S.optional(S.String) }) {}
export class DataSetExportItem extends S.Class<DataSetExportItem>(
  "DataSetExportItem",
)({ datasetName: S.String, externalLocation: ExternalLocation }) {}
export const DataSetExportList = S.Array(DataSetExportItem);
export class GdgDetailAttributes extends S.Class<GdgDetailAttributes>(
  "GdgDetailAttributes",
)({ limit: S.optional(S.Number), rollDisposition: S.optional(S.String) }) {}
export class PoDetailAttributes extends S.Class<PoDetailAttributes>(
  "PoDetailAttributes",
)({ format: S.String, encoding: S.String }) {}
export class PsDetailAttributes extends S.Class<PsDetailAttributes>(
  "PsDetailAttributes",
)({ format: S.String, encoding: S.String }) {}
export class FileBatchJobDefinition extends S.Class<FileBatchJobDefinition>(
  "FileBatchJobDefinition",
)({ fileName: S.String, folderPath: S.optional(S.String) }) {}
export class ScriptBatchJobDefinition extends S.Class<ScriptBatchJobDefinition>(
  "ScriptBatchJobDefinition",
)({ scriptName: S.String }) {}
export class MaintenanceSchedule extends S.Class<MaintenanceSchedule>(
  "MaintenanceSchedule",
)({
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RecordLength extends S.Class<RecordLength>("RecordLength")({
  min: S.Number,
  max: S.Number,
}) {}
export const DataSetExportConfig = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ dataSets: DataSetExportList }),
);
export const String20List = S.Array(S.String);
export const BatchJobDefinition = S.Union(
  S.Struct({ fileBatchJobDefinition: FileBatchJobDefinition }),
  S.Struct({ scriptBatchJobDefinition: ScriptBatchJobDefinition }),
);
export const BatchJobDefinitions = S.Array(BatchJobDefinition);
export class PendingMaintenance extends S.Class<PendingMaintenance>(
  "PendingMaintenance",
)({
  schedule: S.optional(MaintenanceSchedule),
  engineVersion: S.optional(S.String),
}) {}
export class PrimaryKey extends S.Class<PrimaryKey>("PrimaryKey")({
  name: S.optional(S.String),
  offset: S.Number,
  length: S.Number,
}) {}
export class AlternateKey extends S.Class<AlternateKey>("AlternateKey")({
  name: S.optional(S.String),
  offset: S.Number,
  length: S.Number,
  allowDuplicates: S.optional(S.Boolean),
}) {}
export const AlternateKeyList = S.Array(AlternateKey);
export class CreateDataSetExportTaskRequest extends S.Class<CreateDataSetExportTaskRequest>(
  "CreateDataSetExportTaskRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    exportConfig: DataSetExportConfig,
    clientToken: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{applicationId}/dataset-export-task",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class VsamAttributes extends S.Class<VsamAttributes>("VsamAttributes")({
  format: S.String,
  encoding: S.optional(S.String),
  compressed: S.optional(S.Boolean),
  primaryKey: S.optional(PrimaryKey),
  alternateKeys: S.optional(AlternateKeyList),
}) {}
export class GdgAttributes extends S.Class<GdgAttributes>("GdgAttributes")({
  limit: S.optional(S.Number),
  rollDisposition: S.optional(S.String),
}) {}
export class PoAttributes extends S.Class<PoAttributes>("PoAttributes")({
  format: S.String,
  encoding: S.optional(S.String),
  memberFileExtensions: String20List,
}) {}
export class PsAttributes extends S.Class<PsAttributes>("PsAttributes")({
  format: S.String,
  encoding: S.optional(S.String),
}) {}
export class ListBatchJobDefinitionsResponse extends S.Class<ListBatchJobDefinitionsResponse>(
  "ListBatchJobDefinitionsResponse",
)({
  batchJobDefinitions: BatchJobDefinitions,
  nextToken: S.optional(S.String),
}) {}
export class StartBatchJobRequest extends S.Class<StartBatchJobRequest>(
  "StartBatchJobRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    batchJobIdentifier: BatchJobIdentifier,
    jobParams: S.optional(BatchJobParametersMap),
    authSecretsManagerArn: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/batch-job" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEnvironmentResponse extends S.Class<CreateEnvironmentResponse>(
  "CreateEnvironmentResponse",
)({ environmentId: S.String }) {}
export class GetEnvironmentResponse extends S.Class<GetEnvironmentResponse>(
  "GetEnvironmentResponse",
)({
  name: S.String,
  description: S.optional(S.String),
  environmentArn: S.String,
  environmentId: S.String,
  instanceType: S.String,
  status: S.String,
  engineType: S.String,
  engineVersion: S.String,
  vpcId: S.String,
  subnetIds: String50List,
  securityGroupIds: String50List,
  creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  storageConfigurations: S.optional(StorageConfigurationList),
  tags: S.optional(TagMap),
  highAvailabilityConfig: S.optional(HighAvailabilityConfig),
  publiclyAccessible: S.optional(S.Boolean),
  actualCapacity: S.optional(S.Number),
  loadBalancerArn: S.optional(S.String),
  statusReason: S.optional(S.String),
  preferredMaintenanceWindow: S.optional(S.String),
  pendingMaintenance: S.optional(PendingMaintenance),
  kmsKeyId: S.optional(S.String),
  networkType: S.optional(S.String),
}) {}
export class VsamDetailAttributes extends S.Class<VsamDetailAttributes>(
  "VsamDetailAttributes",
)({
  encoding: S.optional(S.String),
  recordFormat: S.optional(S.String),
  compressed: S.optional(S.Boolean),
  cacheAtStartup: S.optional(S.Boolean),
  primaryKey: S.optional(PrimaryKey),
  alternateKeys: S.optional(AlternateKeyList),
}) {}
export const DatasetOrgAttributes = S.Union(
  S.Struct({ vsam: VsamAttributes }),
  S.Struct({ gdg: GdgAttributes }),
  S.Struct({ po: PoAttributes }),
  S.Struct({ ps: PsAttributes }),
);
export const DatasetDetailOrgAttributes = S.Union(
  S.Struct({ vsam: VsamDetailAttributes }),
  S.Struct({ gdg: GdgDetailAttributes }),
  S.Struct({ po: PoDetailAttributes }),
  S.Struct({ ps: PsDetailAttributes }),
);
export class DataSet extends S.Class<DataSet>("DataSet")({
  storageType: S.optional(S.String),
  datasetName: S.String,
  datasetOrg: DatasetOrgAttributes,
  relativePath: S.optional(S.String),
  recordLength: RecordLength,
}) {}
export class CreateDataSetExportTaskResponse extends S.Class<CreateDataSetExportTaskResponse>(
  "CreateDataSetExportTaskResponse",
)({ taskId: S.String }) {}
export class GetDataSetDetailsResponse extends S.Class<GetDataSetDetailsResponse>(
  "GetDataSetDetailsResponse",
)({
  dataSetName: S.String,
  dataSetOrg: S.optional(DatasetDetailOrgAttributes),
  recordLength: S.optional(S.Number),
  location: S.optional(S.String),
  blocksize: S.optional(S.Number),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastReferencedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  fileSize: S.optional(S.Number),
}) {}
export class StartBatchJobResponse extends S.Class<StartBatchJobResponse>(
  "StartBatchJobResponse",
)({ executionId: S.String }) {}
export class DataSetImportItem extends S.Class<DataSetImportItem>(
  "DataSetImportItem",
)({ dataSet: DataSet, externalLocation: ExternalLocation }) {}
export const DataSetImportList = S.Array(DataSetImportItem);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export const DataSetImportConfig = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ dataSets: DataSetImportList }),
);
export class CreateDataSetImportTaskRequest extends S.Class<CreateDataSetImportTaskRequest>(
  "CreateDataSetImportTaskRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    importConfig: DataSetImportConfig,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/applications/{applicationId}/dataset-import-task",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDataSetImportTaskResponse extends S.Class<CreateDataSetImportTaskResponse>(
  "CreateDataSetImportTaskResponse",
)({ taskId: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
) {}
export class ExecutionTimeoutException extends S.TaggedError<ExecutionTimeoutException>()(
  "ExecutionTimeoutException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Gets a single sign-on URL that can be used to connect to AWS Blu Insights.
 */
export const getSignedBluinsightsUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSignedBluinsightsUrlRequest,
    output: GetSignedBluinsightsUrlResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the details of a specific application.
 */
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all the available batch job definitions based on the batch job resources uploaded
 * during the application creation. You can use the batch job definitions in the list to start
 * a batch job.
 */
export const listBatchJobDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBatchJobDefinitionsRequest,
    output: ListBatchJobDefinitionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "batchJobDefinitions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Describes a specific runtime environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentRequest,
  output: GetEnvironmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the available engine versions.
 */
export const listEngineVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEngineVersionsRequest,
    output: ListEngineVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "engineVersions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the applications associated with a specific Amazon Web Services account. You can provide the
 * unique identifier of a specific runtime environment in a query parameter to see all
 * applications associated with that environment.
 */
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: ListApplicationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "applications",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the runtime environments.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsRequest,
    output: ListEnvironmentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Deletes a specific application. You cannot delete a running application.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a specific runtime environment. The environment cannot contain deployed
 * applications. If it does, you must delete those applications before you delete the
 * environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentRequest,
  output: DeleteEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an application and creates a new version.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a specific batch job execution for a specific application.
 */
export const getBatchJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBatchJobExecutionRequest,
    output: GetBatchJobExecutionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the status of a data set import task initiated with the CreateDataSetExportTask operation.
 */
export const getDataSetExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataSetExportTaskRequest,
    output: GetDataSetExportTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets the status of a data set import task initiated with the CreateDataSetImportTask operation.
 */
export const getDataSetImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataSetImportTaskRequest,
    output: GetDataSetImportTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists historical, current, and scheduled batch job executions for a specific
 * application.
 */
export const listBatchJobExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListBatchJobExecutionsRequest,
    output: ListBatchJobExecutionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "batchJobExecutions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists all the job steps for a JCL file to restart a batch job. This is only applicable for Micro Focus engine with versions 8.0.6 and above.
 */
export const listBatchJobRestartPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBatchJobRestartPointsRequest,
    output: ListBatchJobRestartPointsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the data set exports for the specified application.
 */
export const listDataSetExportHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataSetExportHistoryRequest,
    output: ListDataSetExportHistoryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dataSetExportTasks",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Lists the data set imports for the specified application.
 */
export const listDataSetImportHistory =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDataSetImportHistoryRequest,
    output: ListDataSetImportHistoryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dataSetImportTasks",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Returns a list of all deployments of a specific application. A deployment is a
 * combination of a specific application and a specific version of that application. Each
 * deployment is mapped to a particular application version.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDeploymentsRequest,
    output: ListDeploymentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "deployments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns details about a specific version of a specific application.
 */
export const getApplicationVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetApplicationVersionRequest,
    output: GetApplicationVersionResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets details of a specific deployment with a given deployment identifier.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentRequest,
  output: GetDeploymentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the application versions for a specific application.
 */
export const listApplicationVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListApplicationVersionsRequest,
    output: ListApplicationVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "applicationVersions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Removes one or more tags from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels the running of a specific batch job execution.
 */
export const cancelBatchJobExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelBatchJobExecutionRequest,
    output: CancelBatchJobExecutionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a specific application from the specific runtime environment where it was
 * previously deployed. You cannot delete a runtime environment using DeleteEnvironment if any
 * application has ever been deployed to it. This API removes the association of the
 * application with the runtime environment so you can delete the environment smoothly.
 */
export const deleteApplicationFromEnvironment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteApplicationFromEnvironmentRequest,
    output: DeleteApplicationFromEnvironmentResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Starts an application that is currently stopped.
 */
export const startApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationRequest,
  output: StartApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops a running application.
 */
export const stopApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationRequest,
  output: StopApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new application with given parameters. Requires an existing runtime
 * environment and application definition file.
 */
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a runtime environment for a given runtime engine.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentRequest,
  output: CreateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds one or more tags to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates and starts a deployment to deploy an application into a runtime
 * environment.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: CreateDeploymentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration details for a specific runtime environment.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentRequest,
  output: UpdateEnvironmentResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a data set export task for a specific application.
 */
export const createDataSetExportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataSetExportTaskRequest,
    output: CreateDataSetExportTaskResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists the data sets imported for a specific application. In Amazon Web Services Mainframe Modernization, data sets are
 * associated with applications deployed on runtime environments. This is known as importing
 * data sets. Currently, Amazon Web Services Mainframe Modernization can import data sets into catalogs using CreateDataSetImportTask.
 */
export const listDataSets = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDataSetsRequest,
    output: ListDataSetsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ExecutionTimeoutException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "dataSets",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Starts a batch job and returns the unique identifier of this execution of the batch job.
 * The associated application must be running in order to start the batch job.
 */
export const startBatchJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBatchJobRequest,
  output: StartBatchJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the details of a specific data set.
 */
export const getDataSetDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSetDetailsRequest,
  output: GetDataSetDetailsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    ExecutionTimeoutException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a data set import task for a specific application.
 */
export const createDataSetImportTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataSetImportTaskRequest,
    output: CreateDataSetImportTaskResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
