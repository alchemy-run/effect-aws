import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MigrationHubOrchestrator",
  serviceShapeName: "AWSMigrationHubOrchestrator",
});
const auth = T.AwsAuthSigv4({ name: "migrationhub-orchestrator" });
const ver = T.ServiceVersion("2021-08-28");
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://migrationhub-orchestrator-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://migrationhub-orchestrator-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://migrationhub-orchestrator.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://migrationhub-orchestrator.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const StringList = S.Array(S.String);
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
export class GetMigrationWorkflowRequest extends S.Class<GetMigrationWorkflowRequest>(
  "GetMigrationWorkflowRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/migrationworkflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export const StepInput = S.Union(
  S.Struct({ integerValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ listOfStringsValue: StringList }),
  S.Struct({ mapOfStringValue: StringMap }),
);
export const StepInputParameters = S.Record({
  key: S.String,
  value: StepInput,
});
export class UpdateMigrationWorkflowRequest extends S.Class<UpdateMigrationWorkflowRequest>(
  "UpdateMigrationWorkflowRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    inputParameters: S.optional(StepInputParameters),
    stepTargets: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/migrationworkflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMigrationWorkflowRequest extends S.Class<DeleteMigrationWorkflowRequest>(
  "DeleteMigrationWorkflowRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/migrationworkflow/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMigrationWorkflowsRequest extends S.Class<ListMigrationWorkflowsRequest>(
  "ListMigrationWorkflowsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.optional(S.String).pipe(T.HttpQuery("templateId")),
    adsApplicationConfigurationName: S.optional(S.String).pipe(
      T.HttpQuery("adsApplicationConfigurationName"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/migrationworkflows" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMigrationWorkflowRequest extends S.Class<StartMigrationWorkflowRequest>(
  "StartMigrationWorkflowRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/migrationworkflow/{id}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopMigrationWorkflowRequest extends S.Class<StopMigrationWorkflowRequest>(
  "StopMigrationWorkflowRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/migrationworkflow/{id}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMigrationWorkflowTemplateRequest extends S.Class<GetMigrationWorkflowTemplateRequest>(
  "GetMigrationWorkflowTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "GET", uri: "/migrationworkflowtemplate/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateRequest extends S.Class<UpdateTemplateRequest>(
  "UpdateTemplateRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    templateName: S.optional(S.String),
    templateDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/template/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateRequest extends S.Class<DeleteTemplateRequest>(
  "DeleteTemplateRequest",
)(
  { id: S.String.pipe(T.HttpLabel("id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/template/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTemplateResponse extends S.Class<DeleteTemplateResponse>(
  "DeleteTemplateResponse",
)({}) {}
export class ListMigrationWorkflowTemplatesRequest extends S.Class<ListMigrationWorkflowTemplatesRequest>(
  "ListMigrationWorkflowTemplatesRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/migrationworkflowtemplates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPluginsRequest extends S.Class<ListPluginsRequest>(
  "ListPluginsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/plugins" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateStepRequest extends S.Class<GetTemplateStepRequest>(
  "GetTemplateStepRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    templateId: S.String.pipe(T.HttpQuery("templateId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templatestep/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplateStepsRequest extends S.Class<ListTemplateStepsRequest>(
  "ListTemplateStepsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.String.pipe(T.HttpQuery("templateId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templatesteps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTemplateStepGroupRequest extends S.Class<GetTemplateStepGroupRequest>(
  "GetTemplateStepGroupRequest",
)(
  {
    templateId: S.String.pipe(T.HttpLabel("templateId")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templates/{templateId}/stepgroups/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTemplateStepGroupsRequest extends S.Class<ListTemplateStepGroupsRequest>(
  "ListTemplateStepGroupsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/templatestepgroups/{templateId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowStepRequest extends S.Class<GetWorkflowStepRequest>(
  "GetWorkflowStepRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflowstep/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PlatformScriptKey extends S.Class<PlatformScriptKey>(
  "PlatformScriptKey",
)({ linux: S.optional(S.String), windows: S.optional(S.String) }) {}
export class PlatformCommand extends S.Class<PlatformCommand>(
  "PlatformCommand",
)({ linux: S.optional(S.String), windows: S.optional(S.String) }) {}
export class WorkflowStepAutomationConfiguration extends S.Class<WorkflowStepAutomationConfiguration>(
  "WorkflowStepAutomationConfiguration",
)({
  scriptLocationS3Bucket: S.optional(S.String),
  scriptLocationS3Key: S.optional(PlatformScriptKey),
  command: S.optional(PlatformCommand),
  runEnvironment: S.optional(S.String),
  targetType: S.optional(S.String),
}) {}
export const MaxStringList = S.Array(S.String);
export const WorkflowStepOutputUnion = S.Union(
  S.Struct({ integerValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ listOfStringValue: MaxStringList }),
);
export class WorkflowStepOutput extends S.Class<WorkflowStepOutput>(
  "WorkflowStepOutput",
)({
  name: S.optional(S.String),
  dataType: S.optional(S.String),
  required: S.optional(S.Boolean),
  value: S.optional(WorkflowStepOutputUnion),
}) {}
export const WorkflowStepOutputList = S.Array(WorkflowStepOutput);
export class UpdateWorkflowStepRequest extends S.Class<UpdateWorkflowStepRequest>(
  "UpdateWorkflowStepRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    stepGroupId: S.String,
    workflowId: S.String,
    name: S.optional(S.String),
    description: S.optional(S.String),
    stepActionType: S.optional(S.String),
    workflowStepAutomationConfiguration: S.optional(
      WorkflowStepAutomationConfiguration,
    ),
    stepTarget: S.optional(StringList),
    outputs: S.optional(WorkflowStepOutputList),
    previous: S.optional(StringList),
    next: S.optional(StringList),
    status: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflowstep/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowStepRequest extends S.Class<DeleteWorkflowStepRequest>(
  "DeleteWorkflowStepRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workflowstep/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowStepResponse extends S.Class<DeleteWorkflowStepResponse>(
  "DeleteWorkflowStepResponse",
)({}) {}
export class ListWorkflowStepsRequest extends S.Class<ListWorkflowStepsRequest>(
  "ListWorkflowStepsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    stepGroupId: S.String.pipe(T.HttpLabel("stepGroupId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/workflow/{workflowId}/workflowstepgroups/{stepGroupId}/workflowsteps",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RetryWorkflowStepRequest extends S.Class<RetryWorkflowStepRequest>(
  "RetryWorkflowStepRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/retryworkflowstep/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWorkflowStepGroupRequest extends S.Class<CreateWorkflowStepGroupRequest>(
  "CreateWorkflowStepGroupRequest",
)(
  {
    workflowId: S.String,
    name: S.String,
    description: S.optional(S.String),
    next: S.optional(StringList),
    previous: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflowstepgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWorkflowStepGroupRequest extends S.Class<GetWorkflowStepGroupRequest>(
  "GetWorkflowStepGroupRequest",
)(
  {
    id: S.String.pipe(T.HttpLabel("id")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflowstepgroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWorkflowStepGroupRequest extends S.Class<UpdateWorkflowStepGroupRequest>(
  "UpdateWorkflowStepGroupRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    next: S.optional(StringList),
    previous: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflowstepgroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowStepGroupRequest extends S.Class<DeleteWorkflowStepGroupRequest>(
  "DeleteWorkflowStepGroupRequest",
)(
  {
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    id: S.String.pipe(T.HttpLabel("id")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/workflowstepgroup/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWorkflowStepGroupResponse extends S.Class<DeleteWorkflowStepGroupResponse>(
  "DeleteWorkflowStepGroupResponse",
)({}) {}
export class ListWorkflowStepGroupsRequest extends S.Class<ListWorkflowStepGroupsRequest>(
  "ListWorkflowStepGroupsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/workflowstepgroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export const TemplateSource = S.Union(S.Struct({ workflowId: S.String }));
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
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
export class UpdateMigrationWorkflowResponse extends S.Class<UpdateMigrationWorkflowResponse>(
  "UpdateMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  templateId: S.optional(S.String),
  adsApplicationConfigurationId: S.optional(S.String),
  workflowInputs: S.optional(StepInputParameters),
  stepTargets: S.optional(StringList),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(StringMap),
}) {}
export class DeleteMigrationWorkflowResponse extends S.Class<DeleteMigrationWorkflowResponse>(
  "DeleteMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class StartMigrationWorkflowResponse extends S.Class<StartMigrationWorkflowResponse>(
  "StartMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class StopMigrationWorkflowResponse extends S.Class<StopMigrationWorkflowResponse>(
  "StopMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  lastStopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateTemplateRequest extends S.Class<CreateTemplateRequest>(
  "CreateTemplateRequest",
)(
  {
    templateName: S.String,
    templateDescription: S.optional(S.String),
    templateSource: TemplateSource,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/template" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateTemplateResponse extends S.Class<UpdateTemplateResponse>(
  "UpdateTemplateResponse",
)({
  templateId: S.optional(S.String),
  templateArn: S.optional(S.String),
  tags: S.optional(StringMap),
}) {}
export class Tool extends S.Class<Tool>("Tool")({
  name: S.optional(S.String),
  url: S.optional(S.String),
}) {}
export const ToolsList = S.Array(Tool);
export class GetTemplateStepGroupResponse extends S.Class<GetTemplateStepGroupResponse>(
  "GetTemplateStepGroupResponse",
)({
  templateId: S.optional(S.String),
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tools: S.optional(ToolsList),
  previous: S.optional(StringList),
  next: S.optional(StringList),
}) {}
export class GetWorkflowStepResponse extends S.Class<GetWorkflowStepResponse>(
  "GetWorkflowStepResponse",
)({
  name: S.optional(S.String),
  stepGroupId: S.optional(S.String),
  workflowId: S.optional(S.String),
  stepId: S.optional(S.String),
  description: S.optional(S.String),
  stepActionType: S.optional(S.String),
  owner: S.optional(S.String),
  workflowStepAutomationConfiguration: S.optional(
    WorkflowStepAutomationConfiguration,
  ),
  stepTarget: S.optional(StringList),
  outputs: S.optional(WorkflowStepOutputList),
  previous: S.optional(StringList),
  next: S.optional(StringList),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  scriptOutputLocation: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  noOfSrvCompleted: S.optional(S.Number),
  noOfSrvFailed: S.optional(S.Number),
  totalNoOfSrv: S.optional(S.Number),
}) {}
export class UpdateWorkflowStepResponse extends S.Class<UpdateWorkflowStepResponse>(
  "UpdateWorkflowStepResponse",
)({
  id: S.optional(S.String),
  stepGroupId: S.optional(S.String),
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
}) {}
export class RetryWorkflowStepResponse extends S.Class<RetryWorkflowStepResponse>(
  "RetryWorkflowStepResponse",
)({
  stepGroupId: S.optional(S.String),
  workflowId: S.optional(S.String),
  id: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export class CreateWorkflowStepGroupResponse extends S.Class<CreateWorkflowStepGroupResponse>(
  "CreateWorkflowStepGroupResponse",
)({
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  tools: S.optional(ToolsList),
  next: S.optional(StringList),
  previous: S.optional(StringList),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetWorkflowStepGroupResponse extends S.Class<GetWorkflowStepGroupResponse>(
  "GetWorkflowStepGroupResponse",
)({
  id: S.optional(S.String),
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  status: S.optional(S.String),
  owner: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tools: S.optional(ToolsList),
  previous: S.optional(StringList),
  next: S.optional(StringList),
}) {}
export class UpdateWorkflowStepGroupResponse extends S.Class<UpdateWorkflowStepGroupResponse>(
  "UpdateWorkflowStepGroupResponse",
)({
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
  id: S.optional(S.String),
  description: S.optional(S.String),
  tools: S.optional(ToolsList),
  next: S.optional(StringList),
  previous: S.optional(StringList),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class MigrationWorkflowSummary extends S.Class<MigrationWorkflowSummary>(
  "MigrationWorkflowSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  templateId: S.optional(S.String),
  adsApplicationConfigurationName: S.optional(S.String),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusMessage: S.optional(S.String),
  completedSteps: S.optional(S.Number),
  totalSteps: S.optional(S.Number),
}) {}
export const MigrationWorkflowSummaryList = S.Array(MigrationWorkflowSummary);
export class TemplateInput extends S.Class<TemplateInput>("TemplateInput")({
  inputName: S.optional(S.String),
  dataType: S.optional(S.String),
  required: S.optional(S.Boolean),
}) {}
export const TemplateInputList = S.Array(TemplateInput);
export class TemplateSummary extends S.Class<TemplateSummary>(
  "TemplateSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  arn: S.optional(S.String),
  description: S.optional(S.String),
}) {}
export const TemplateSummaryList = S.Array(TemplateSummary);
export class PluginSummary extends S.Class<PluginSummary>("PluginSummary")({
  pluginId: S.optional(S.String),
  hostname: S.optional(S.String),
  status: S.optional(S.String),
  ipAddress: S.optional(S.String),
  version: S.optional(S.String),
  registeredTime: S.optional(S.String),
}) {}
export const PluginSummaries = S.Array(PluginSummary);
export class StepOutput extends S.Class<StepOutput>("StepOutput")({
  name: S.optional(S.String),
  dataType: S.optional(S.String),
  required: S.optional(S.Boolean),
}) {}
export const StepOutputList = S.Array(StepOutput);
export class StepAutomationConfiguration extends S.Class<StepAutomationConfiguration>(
  "StepAutomationConfiguration",
)({
  scriptLocationS3Bucket: S.optional(S.String),
  scriptLocationS3Key: S.optional(PlatformScriptKey),
  command: S.optional(PlatformCommand),
  runEnvironment: S.optional(S.String),
  targetType: S.optional(S.String),
}) {}
export class TemplateStepSummary extends S.Class<TemplateStepSummary>(
  "TemplateStepSummary",
)({
  id: S.optional(S.String),
  stepGroupId: S.optional(S.String),
  templateId: S.optional(S.String),
  name: S.optional(S.String),
  stepActionType: S.optional(S.String),
  targetType: S.optional(S.String),
  owner: S.optional(S.String),
  previous: S.optional(StringList),
  next: S.optional(StringList),
}) {}
export const TemplateStepSummaryList = S.Array(TemplateStepSummary);
export class TemplateStepGroupSummary extends S.Class<TemplateStepGroupSummary>(
  "TemplateStepGroupSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  previous: S.optional(StringList),
  next: S.optional(StringList),
}) {}
export const TemplateStepGroupSummaryList = S.Array(TemplateStepGroupSummary);
export class WorkflowStepSummary extends S.Class<WorkflowStepSummary>(
  "WorkflowStepSummary",
)({
  stepId: S.optional(S.String),
  name: S.optional(S.String),
  stepActionType: S.optional(S.String),
  owner: S.optional(S.String),
  previous: S.optional(StringList),
  next: S.optional(StringList),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  noOfSrvCompleted: S.optional(S.Number),
  noOfSrvFailed: S.optional(S.Number),
  totalNoOfSrv: S.optional(S.Number),
  description: S.optional(S.String),
  scriptLocation: S.optional(S.String),
}) {}
export const WorkflowStepsSummaryList = S.Array(WorkflowStepSummary);
export class WorkflowStepGroupSummary extends S.Class<WorkflowStepGroupSummary>(
  "WorkflowStepGroupSummary",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  owner: S.optional(S.String),
  status: S.optional(S.String),
  previous: S.optional(StringList),
  next: S.optional(StringList),
}) {}
export const WorkflowStepGroupsSummaryList = S.Array(WorkflowStepGroupSummary);
export class CreateMigrationWorkflowRequest extends S.Class<CreateMigrationWorkflowRequest>(
  "CreateMigrationWorkflowRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    templateId: S.String,
    applicationConfigurationId: S.optional(S.String),
    inputParameters: StepInputParameters,
    stepTargets: S.optional(StringList),
    tags: S.optional(StringMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/migrationworkflow/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetMigrationWorkflowResponse extends S.Class<GetMigrationWorkflowResponse>(
  "GetMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  templateId: S.optional(S.String),
  adsApplicationConfigurationId: S.optional(S.String),
  adsApplicationName: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastStopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tools: S.optional(ToolsList),
  totalSteps: S.optional(S.Number),
  completedSteps: S.optional(S.Number),
  workflowInputs: S.optional(StepInputParameters),
  tags: S.optional(StringMap),
  workflowBucket: S.optional(S.String),
}) {}
export class ListMigrationWorkflowsResponse extends S.Class<ListMigrationWorkflowsResponse>(
  "ListMigrationWorkflowsResponse",
)({
  nextToken: S.optional(S.String),
  migrationWorkflowSummary: MigrationWorkflowSummaryList,
}) {}
export class CreateTemplateResponse extends S.Class<CreateTemplateResponse>(
  "CreateTemplateResponse",
)({
  templateId: S.optional(S.String),
  templateArn: S.optional(S.String),
  tags: S.optional(StringMap),
}) {}
export class GetMigrationWorkflowTemplateResponse extends S.Class<GetMigrationWorkflowTemplateResponse>(
  "GetMigrationWorkflowTemplateResponse",
)({
  id: S.optional(S.String),
  templateArn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  inputs: S.optional(TemplateInputList),
  tools: S.optional(ToolsList),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  owner: S.optional(S.String),
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  templateClass: S.optional(S.String),
  tags: S.optional(StringMap),
}) {}
export class ListMigrationWorkflowTemplatesResponse extends S.Class<ListMigrationWorkflowTemplatesResponse>(
  "ListMigrationWorkflowTemplatesResponse",
)({ nextToken: S.optional(S.String), templateSummary: TemplateSummaryList }) {}
export class ListPluginsResponse extends S.Class<ListPluginsResponse>(
  "ListPluginsResponse",
)({ nextToken: S.optional(S.String), plugins: S.optional(PluginSummaries) }) {}
export class GetTemplateStepResponse extends S.Class<GetTemplateStepResponse>(
  "GetTemplateStepResponse",
)({
  id: S.optional(S.String),
  stepGroupId: S.optional(S.String),
  templateId: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  stepActionType: S.optional(S.String),
  creationTime: S.optional(S.String),
  previous: S.optional(StringList),
  next: S.optional(StringList),
  outputs: S.optional(StepOutputList),
  stepAutomationConfiguration: S.optional(StepAutomationConfiguration),
}) {}
export class ListTemplateStepsResponse extends S.Class<ListTemplateStepsResponse>(
  "ListTemplateStepsResponse",
)({
  nextToken: S.optional(S.String),
  templateStepSummaryList: S.optional(TemplateStepSummaryList),
}) {}
export class ListTemplateStepGroupsResponse extends S.Class<ListTemplateStepGroupsResponse>(
  "ListTemplateStepGroupsResponse",
)({
  nextToken: S.optional(S.String),
  templateStepGroupSummary: TemplateStepGroupSummaryList,
}) {}
export class CreateWorkflowStepRequest extends S.Class<CreateWorkflowStepRequest>(
  "CreateWorkflowStepRequest",
)(
  {
    name: S.String,
    stepGroupId: S.String,
    workflowId: S.String,
    stepActionType: S.String,
    description: S.optional(S.String),
    workflowStepAutomationConfiguration: S.optional(
      WorkflowStepAutomationConfiguration,
    ),
    stepTarget: S.optional(StringList),
    outputs: S.optional(WorkflowStepOutputList),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/workflowstep" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWorkflowStepsResponse extends S.Class<ListWorkflowStepsResponse>(
  "ListWorkflowStepsResponse",
)({
  nextToken: S.optional(S.String),
  workflowStepsSummary: WorkflowStepsSummaryList,
}) {}
export class ListWorkflowStepGroupsResponse extends S.Class<ListWorkflowStepGroupsResponse>(
  "ListWorkflowStepGroupsResponse",
)({
  nextToken: S.optional(S.String),
  workflowStepGroupsSummary: WorkflowStepGroupsSummaryList,
}) {}
export class CreateMigrationWorkflowResponse extends S.Class<CreateMigrationWorkflowResponse>(
  "CreateMigrationWorkflowResponse",
)({
  id: S.optional(S.String),
  arn: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  templateId: S.optional(S.String),
  adsApplicationConfigurationId: S.optional(S.String),
  workflowInputs: S.optional(StepInputParameters),
  stepTargets: S.optional(StringList),
  status: S.optional(S.String),
  creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(StringMap),
}) {}
export class CreateWorkflowStepResponse extends S.Class<CreateWorkflowStepResponse>(
  "CreateWorkflowStepResponse",
)({
  id: S.optional(S.String),
  stepGroupId: S.optional(S.String),
  workflowId: S.optional(S.String),
  name: S.optional(S.String),
}) {}

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
  T.Retryable(),
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
  T.Retryable(),
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
  T.Retryable(),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Deletes the tags for a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * List AWS Migration Hub Orchestrator plugins.
 */
export const listPlugins = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPluginsRequest,
    output: ListPluginsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "plugins",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List the tags added to a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Tag a resource by specifying its Amazon Resource Name (ARN).
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a migration workflow template.
 */
export const deleteTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTemplateRequest,
  output: DeleteTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create a step in the migration workflow.
 */
export const createWorkflowStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowStepRequest,
  output: CreateWorkflowStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the templates available in Migration Hub Orchestrator to create a migration workflow.
 */
export const listTemplates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMigrationWorkflowTemplatesRequest,
    output: ListMigrationWorkflowTemplatesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "templateSummary",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get a specific step in a template.
 */
export const getTemplateStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateStepRequest,
  output: GetTemplateStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the steps in a template.
 */
export const listTemplateSteps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTemplateStepsRequest,
    output: ListTemplateStepsResponse,
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
      items: "templateStepSummaryList",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List the step groups in a template.
 */
export const listTemplateStepGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTemplateStepGroupsRequest,
    output: ListTemplateStepGroupsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "templateStepGroupSummary",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List the steps in a workflow.
 */
export const listWorkflowSteps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowStepsRequest,
    output: ListWorkflowStepsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "workflowStepsSummary",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List the step groups in a migration workflow.
 */
export const listWorkflowStepGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListWorkflowStepGroupsRequest,
    output: ListWorkflowStepGroupsResponse,
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
      items: "workflowStepGroupsSummary",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get a step group in a template.
 */
export const getTemplateStepGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTemplateStepGroupRequest,
    output: GetTemplateStepGroupResponse,
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
 * Get a step in the migration workflow.
 */
export const getWorkflowStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowStepRequest,
  output: GetWorkflowStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Update a step in a migration workflow.
 */
export const updateWorkflowStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowStepRequest,
  output: UpdateWorkflowStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retry a failed step in a migration workflow.
 */
export const retryWorkflowStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryWorkflowStepRequest,
  output: RetryWorkflowStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Create a step group in a migration workflow.
 */
export const createWorkflowStepGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWorkflowStepGroupRequest,
    output: CreateWorkflowStepGroupResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get the step group of a migration workflow.
 */
export const getWorkflowStepGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkflowStepGroupRequest,
    output: GetWorkflowStepGroupResponse,
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
 * Update the step group in a migration workflow.
 */
export const updateWorkflowStepGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWorkflowStepGroupRequest,
    output: UpdateWorkflowStepGroupResponse,
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
 * Delete a step in a migration workflow. Pause the workflow to delete a running
 * step.
 */
export const deleteWorkflowStep = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowStepRequest,
  output: DeleteWorkflowStepResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a step group in a migration workflow.
 */
export const deleteWorkflowStepGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWorkflowStepGroupRequest,
    output: DeleteWorkflowStepGroupResponse,
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
 * Update a migration workflow.
 */
export const updateWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMigrationWorkflowRequest,
  output: UpdateMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a migration workflow. You must pause a running workflow in Migration Hub Orchestrator console to
 * delete it.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMigrationWorkflowRequest,
  output: DeleteMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Start a migration workflow.
 */
export const startWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMigrationWorkflowRequest,
  output: StartMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stop an ongoing migration workflow.
 */
export const stopWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMigrationWorkflowRequest,
  output: StopMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a migration workflow template.
 */
export const updateTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTemplateRequest,
  output: UpdateTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get migration workflow.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMigrationWorkflowRequest,
  output: GetMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List the migration workflows.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListMigrationWorkflowsRequest,
    output: ListMigrationWorkflowsResponse,
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
      items: "migrationWorkflowSummary",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get the template you want to use for creating a migration workflow.
 */
export const getTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMigrationWorkflowTemplateRequest,
  output: GetMigrationWorkflowTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Create a workflow to orchestrate your migrations.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMigrationWorkflowRequest,
  output: CreateMigrationWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a migration workflow template.
 */
export const createTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTemplateRequest,
  output: CreateTemplateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
