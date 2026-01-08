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
  sdkId: "MigrationHubOrchestrator",
  serviceShapeName: "AWSMigrationHubOrchestrator",
});
const auth = T.AwsAuthSigv4({ name: "migrationhub-orchestrator" });
const ver = T.ServiceVersion("2021-08-28");
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
              `https://migrationhub-orchestrator-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://migrationhub-orchestrator-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://migrationhub-orchestrator.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://migrationhub-orchestrator.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceArn = string;
export type TagKey = string;
export type StringListMember = string;
export type MigrationWorkflowId = string;
export type MaxResults = number;
export type NextToken = string;
export type TemplateId = string;
export type ApplicationConfigurationName = string;
export type MigrationWorkflowStatusEnum = string;
export type ClientToken = string;
export type TemplateName = string;
export type StepId = string;
export type StepGroupId = string;
export type MigrationWorkflowName = string;
export type StepActionType = string;
export type MigrationWorkflowDescription = string;
export type StepName = string;
export type StepDescription = string;
export type StepStatus = string;
export type StepGroupName = string;
export type StepGroupDescription = string;
export type TagValue = string;
export type StepInputParametersKey = string;
export type StringMapKey = string;
export type StringMapValue = string;
export type S3Bucket = string;
export type RunEnvironment = string;
export type TargetType = string;
export type WorkflowStepOutputName = string;
export type DataType = string;
export type TemplateStatus = string;
export type StepGroupStatus = string;
export type Owner = string;
export type StringValue = string;
export type S3Key = string;
export type MaxStringValue = string;
export type TemplateInputName = string;
export type PluginId = string;
export type PluginHealth = string;
export type IPAddress = string;
export type PluginVersion = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
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
export interface GetMigrationWorkflowRequest {
  id: string;
}
export const GetMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrationworkflow/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMigrationWorkflowRequest",
}) as any as S.Schema<GetMigrationWorkflowRequest>;
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export type StepInput =
  | { integerValue: number }
  | { stringValue: string }
  | { listOfStringsValue: StringList }
  | { mapOfStringValue: StringMap };
export const StepInput = S.Union(
  S.Struct({ integerValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ listOfStringsValue: StringList }),
  S.Struct({ mapOfStringValue: StringMap }),
);
export type StepInputParameters = { [key: string]: (typeof StepInput)["Type"] };
export const StepInputParameters = S.Record({
  key: S.String,
  value: StepInput,
});
export interface UpdateMigrationWorkflowRequest {
  id: string;
  name?: string;
  description?: string;
  inputParameters?: StepInputParameters;
  stepTargets?: StringList;
}
export const UpdateMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    inputParameters: S.optional(StepInputParameters),
    stepTargets: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/migrationworkflow/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateMigrationWorkflowRequest",
}) as any as S.Schema<UpdateMigrationWorkflowRequest>;
export interface DeleteMigrationWorkflowRequest {
  id: string;
}
export const DeleteMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/migrationworkflow/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMigrationWorkflowRequest",
}) as any as S.Schema<DeleteMigrationWorkflowRequest>;
export interface ListMigrationWorkflowsRequest {
  maxResults?: number;
  nextToken?: string;
  templateId?: string;
  adsApplicationConfigurationName?: string;
  status?: string;
  name?: string;
}
export const ListMigrationWorkflowsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.optional(S.String).pipe(T.HttpQuery("templateId")),
    adsApplicationConfigurationName: S.optional(S.String).pipe(
      T.HttpQuery("adsApplicationConfigurationName"),
    ),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrationworkflows" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMigrationWorkflowsRequest",
}) as any as S.Schema<ListMigrationWorkflowsRequest>;
export interface StartMigrationWorkflowRequest {
  id: string;
}
export const StartMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/migrationworkflow/{id}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMigrationWorkflowRequest",
}) as any as S.Schema<StartMigrationWorkflowRequest>;
export interface StopMigrationWorkflowRequest {
  id: string;
}
export const StopMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/migrationworkflow/{id}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopMigrationWorkflowRequest",
}) as any as S.Schema<StopMigrationWorkflowRequest>;
export interface GetMigrationWorkflowTemplateRequest {
  id: string;
}
export const GetMigrationWorkflowTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrationworkflowtemplate/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetMigrationWorkflowTemplateRequest",
}) as any as S.Schema<GetMigrationWorkflowTemplateRequest>;
export interface UpdateTemplateRequest {
  id: string;
  templateName?: string;
  templateDescription?: string;
  clientToken?: string;
}
export const UpdateTemplateRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    templateName: S.optional(S.String),
    templateDescription: S.optional(S.String),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/template/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateTemplateRequest",
}) as any as S.Schema<UpdateTemplateRequest>;
export interface DeleteTemplateRequest {
  id: string;
}
export const DeleteTemplateRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/template/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTemplateRequest",
}) as any as S.Schema<DeleteTemplateRequest>;
export interface DeleteTemplateResponse {}
export const DeleteTemplateResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteTemplateResponse" },
) as any as S.Schema<DeleteTemplateResponse>;
export interface ListMigrationWorkflowTemplatesRequest {
  maxResults?: number;
  nextToken?: string;
  name?: string;
}
export const ListMigrationWorkflowTemplatesRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    name: S.optional(S.String).pipe(T.HttpQuery("name")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/migrationworkflowtemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMigrationWorkflowTemplatesRequest",
}) as any as S.Schema<ListMigrationWorkflowTemplatesRequest>;
export interface ListPluginsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListPluginsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/plugins" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPluginsRequest",
}) as any as S.Schema<ListPluginsRequest>;
export interface GetTemplateStepRequest {
  id: string;
  templateId: string;
  stepGroupId: string;
}
export const GetTemplateStepRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    templateId: S.String.pipe(T.HttpQuery("templateId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templatestep/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemplateStepRequest",
}) as any as S.Schema<GetTemplateStepRequest>;
export interface ListTemplateStepsRequest {
  maxResults?: number;
  nextToken?: string;
  templateId: string;
  stepGroupId: string;
}
export const ListTemplateStepsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.String.pipe(T.HttpQuery("templateId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templatesteps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplateStepsRequest",
}) as any as S.Schema<ListTemplateStepsRequest>;
export interface GetTemplateStepGroupRequest {
  templateId: string;
  id: string;
}
export const GetTemplateStepGroupRequest = S.suspend(() =>
  S.Struct({
    templateId: S.String.pipe(T.HttpLabel("templateId")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templates/{templateId}/stepgroups/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTemplateStepGroupRequest",
}) as any as S.Schema<GetTemplateStepGroupRequest>;
export interface ListTemplateStepGroupsRequest {
  maxResults?: number;
  nextToken?: string;
  templateId: string;
}
export const ListTemplateStepGroupsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    templateId: S.String.pipe(T.HttpLabel("templateId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/templatestepgroups/{templateId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTemplateStepGroupsRequest",
}) as any as S.Schema<ListTemplateStepGroupsRequest>;
export interface GetWorkflowStepRequest {
  workflowId: string;
  stepGroupId: string;
  id: string;
}
export const GetWorkflowStepRequest = S.suspend(() =>
  S.Struct({
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflowstep/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkflowStepRequest",
}) as any as S.Schema<GetWorkflowStepRequest>;
export interface PlatformScriptKey {
  linux?: string;
  windows?: string;
}
export const PlatformScriptKey = S.suspend(() =>
  S.Struct({ linux: S.optional(S.String), windows: S.optional(S.String) }),
).annotations({
  identifier: "PlatformScriptKey",
}) as any as S.Schema<PlatformScriptKey>;
export interface PlatformCommand {
  linux?: string;
  windows?: string;
}
export const PlatformCommand = S.suspend(() =>
  S.Struct({ linux: S.optional(S.String), windows: S.optional(S.String) }),
).annotations({
  identifier: "PlatformCommand",
}) as any as S.Schema<PlatformCommand>;
export interface WorkflowStepAutomationConfiguration {
  scriptLocationS3Bucket?: string;
  scriptLocationS3Key?: PlatformScriptKey;
  command?: PlatformCommand;
  runEnvironment?: string;
  targetType?: string;
}
export const WorkflowStepAutomationConfiguration = S.suspend(() =>
  S.Struct({
    scriptLocationS3Bucket: S.optional(S.String),
    scriptLocationS3Key: S.optional(PlatformScriptKey),
    command: S.optional(PlatformCommand),
    runEnvironment: S.optional(S.String),
    targetType: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkflowStepAutomationConfiguration",
}) as any as S.Schema<WorkflowStepAutomationConfiguration>;
export type MaxStringList = string[];
export const MaxStringList = S.Array(S.String);
export type WorkflowStepOutputUnion =
  | { integerValue: number }
  | { stringValue: string }
  | { listOfStringValue: MaxStringList };
export const WorkflowStepOutputUnion = S.Union(
  S.Struct({ integerValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ listOfStringValue: MaxStringList }),
);
export interface WorkflowStepOutput {
  name?: string;
  dataType?: string;
  required?: boolean;
  value?: (typeof WorkflowStepOutputUnion)["Type"];
}
export const WorkflowStepOutput = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    dataType: S.optional(S.String),
    required: S.optional(S.Boolean),
    value: S.optional(WorkflowStepOutputUnion),
  }),
).annotations({
  identifier: "WorkflowStepOutput",
}) as any as S.Schema<WorkflowStepOutput>;
export type WorkflowStepOutputList = WorkflowStepOutput[];
export const WorkflowStepOutputList = S.Array(WorkflowStepOutput);
export interface UpdateWorkflowStepRequest {
  id: string;
  stepGroupId: string;
  workflowId: string;
  name?: string;
  description?: string;
  stepActionType?: string;
  workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
  stepTarget?: StringList;
  outputs?: WorkflowStepOutputList;
  previous?: StringList;
  next?: StringList;
  status?: string;
}
export const UpdateWorkflowStepRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflowstep/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkflowStepRequest",
}) as any as S.Schema<UpdateWorkflowStepRequest>;
export interface DeleteWorkflowStepRequest {
  id: string;
  stepGroupId: string;
  workflowId: string;
}
export const DeleteWorkflowStepRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/workflowstep/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkflowStepRequest",
}) as any as S.Schema<DeleteWorkflowStepRequest>;
export interface DeleteWorkflowStepResponse {}
export const DeleteWorkflowStepResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWorkflowStepResponse",
}) as any as S.Schema<DeleteWorkflowStepResponse>;
export interface ListWorkflowStepsRequest {
  nextToken?: string;
  maxResults?: number;
  workflowId: string;
  stepGroupId: string;
}
export const ListWorkflowStepsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workflowId: S.String.pipe(T.HttpLabel("workflowId")),
    stepGroupId: S.String.pipe(T.HttpLabel("stepGroupId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListWorkflowStepsRequest",
}) as any as S.Schema<ListWorkflowStepsRequest>;
export interface RetryWorkflowStepRequest {
  workflowId: string;
  stepGroupId: string;
  id: string;
}
export const RetryWorkflowStepRequest = S.suspend(() =>
  S.Struct({
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    stepGroupId: S.String.pipe(T.HttpQuery("stepGroupId")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/retryworkflowstep/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetryWorkflowStepRequest",
}) as any as S.Schema<RetryWorkflowStepRequest>;
export interface CreateWorkflowStepGroupRequest {
  workflowId: string;
  name: string;
  description?: string;
  next?: StringList;
  previous?: StringList;
}
export const CreateWorkflowStepGroupRequest = S.suspend(() =>
  S.Struct({
    workflowId: S.String,
    name: S.String,
    description: S.optional(S.String),
    next: S.optional(StringList),
    previous: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflowstepgroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkflowStepGroupRequest",
}) as any as S.Schema<CreateWorkflowStepGroupRequest>;
export interface GetWorkflowStepGroupRequest {
  id: string;
  workflowId: string;
}
export const GetWorkflowStepGroupRequest = S.suspend(() =>
  S.Struct({
    id: S.String.pipe(T.HttpLabel("id")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflowstepgroup/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWorkflowStepGroupRequest",
}) as any as S.Schema<GetWorkflowStepGroupRequest>;
export interface UpdateWorkflowStepGroupRequest {
  workflowId: string;
  id: string;
  name?: string;
  description?: string;
  next?: StringList;
  previous?: StringList;
}
export const UpdateWorkflowStepGroupRequest = S.suspend(() =>
  S.Struct({
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    id: S.String.pipe(T.HttpLabel("id")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    next: S.optional(StringList),
    previous: S.optional(StringList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflowstepgroup/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWorkflowStepGroupRequest",
}) as any as S.Schema<UpdateWorkflowStepGroupRequest>;
export interface DeleteWorkflowStepGroupRequest {
  workflowId: string;
  id: string;
}
export const DeleteWorkflowStepGroupRequest = S.suspend(() =>
  S.Struct({
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
    id: S.String.pipe(T.HttpLabel("id")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/workflowstepgroup/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWorkflowStepGroupRequest",
}) as any as S.Schema<DeleteWorkflowStepGroupRequest>;
export interface DeleteWorkflowStepGroupResponse {}
export const DeleteWorkflowStepGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWorkflowStepGroupResponse",
}) as any as S.Schema<DeleteWorkflowStepGroupResponse>;
export interface ListWorkflowStepGroupsRequest {
  nextToken?: string;
  maxResults?: number;
  workflowId: string;
}
export const ListWorkflowStepGroupsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    workflowId: S.String.pipe(T.HttpQuery("workflowId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/workflowstepgroups" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWorkflowStepGroupsRequest",
}) as any as S.Schema<ListWorkflowStepGroupsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type TemplateSource = { workflowId: string };
export const TemplateSource = S.Union(S.Struct({ workflowId: S.String }));
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
export interface UpdateMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  templateId?: string;
  adsApplicationConfigurationId?: string;
  workflowInputs?: StepInputParameters;
  stepTargets?: StringList;
  status?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
  tags?: StringMap;
}
export const UpdateMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
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
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(StringMap),
  }),
).annotations({
  identifier: "UpdateMigrationWorkflowResponse",
}) as any as S.Schema<UpdateMigrationWorkflowResponse>;
export interface DeleteMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  status?: string;
}
export const DeleteMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteMigrationWorkflowResponse",
}) as any as S.Schema<DeleteMigrationWorkflowResponse>;
export interface StartMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  status?: string;
  statusMessage?: string;
  lastStartTime?: Date;
}
export const StartMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    lastStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartMigrationWorkflowResponse",
}) as any as S.Schema<StartMigrationWorkflowResponse>;
export interface StopMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  status?: string;
  statusMessage?: string;
  lastStopTime?: Date;
}
export const StopMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    arn: S.optional(S.String),
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    lastStopTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StopMigrationWorkflowResponse",
}) as any as S.Schema<StopMigrationWorkflowResponse>;
export interface CreateTemplateRequest {
  templateName: string;
  templateDescription?: string;
  templateSource: (typeof TemplateSource)["Type"];
  clientToken?: string;
  tags?: TagMap;
}
export const CreateTemplateRequest = S.suspend(() =>
  S.Struct({
    templateName: S.String,
    templateDescription: S.optional(S.String),
    templateSource: TemplateSource,
    clientToken: S.optional(S.String),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/template" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTemplateRequest",
}) as any as S.Schema<CreateTemplateRequest>;
export interface UpdateTemplateResponse {
  templateId?: string;
  templateArn?: string;
  tags?: StringMap;
}
export const UpdateTemplateResponse = S.suspend(() =>
  S.Struct({
    templateId: S.optional(S.String),
    templateArn: S.optional(S.String),
    tags: S.optional(StringMap),
  }),
).annotations({
  identifier: "UpdateTemplateResponse",
}) as any as S.Schema<UpdateTemplateResponse>;
export interface Tool {
  name?: string;
  url?: string;
}
export const Tool = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), url: S.optional(S.String) }),
).annotations({ identifier: "Tool" }) as any as S.Schema<Tool>;
export type ToolsList = Tool[];
export const ToolsList = S.Array(Tool);
export interface GetTemplateStepGroupResponse {
  templateId?: string;
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
  tools?: ToolsList;
  previous?: StringList;
  next?: StringList;
}
export const GetTemplateStepGroupResponse = S.suspend(() =>
  S.Struct({
    templateId: S.optional(S.String),
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tools: S.optional(ToolsList),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  }),
).annotations({
  identifier: "GetTemplateStepGroupResponse",
}) as any as S.Schema<GetTemplateStepGroupResponse>;
export interface GetWorkflowStepResponse {
  name?: string;
  stepGroupId?: string;
  workflowId?: string;
  stepId?: string;
  description?: string;
  stepActionType?: string;
  owner?: string;
  workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
  stepTarget?: StringList;
  outputs?: WorkflowStepOutputList;
  previous?: StringList;
  next?: StringList;
  status?: string;
  statusMessage?: string;
  scriptOutputLocation?: string;
  creationTime?: Date;
  lastStartTime?: Date;
  endTime?: Date;
  noOfSrvCompleted?: number;
  noOfSrvFailed?: number;
  totalNoOfSrv?: number;
}
export const GetWorkflowStepResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetWorkflowStepResponse",
}) as any as S.Schema<GetWorkflowStepResponse>;
export interface UpdateWorkflowStepResponse {
  id?: string;
  stepGroupId?: string;
  workflowId?: string;
  name?: string;
}
export const UpdateWorkflowStepResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    stepGroupId: S.optional(S.String),
    workflowId: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateWorkflowStepResponse",
}) as any as S.Schema<UpdateWorkflowStepResponse>;
export interface RetryWorkflowStepResponse {
  stepGroupId?: string;
  workflowId?: string;
  id?: string;
  status?: string;
}
export const RetryWorkflowStepResponse = S.suspend(() =>
  S.Struct({
    stepGroupId: S.optional(S.String),
    workflowId: S.optional(S.String),
    id: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "RetryWorkflowStepResponse",
}) as any as S.Schema<RetryWorkflowStepResponse>;
export interface CreateWorkflowStepGroupResponse {
  workflowId?: string;
  name?: string;
  id?: string;
  description?: string;
  tools?: ToolsList;
  next?: StringList;
  previous?: StringList;
  creationTime?: Date;
}
export const CreateWorkflowStepGroupResponse = S.suspend(() =>
  S.Struct({
    workflowId: S.optional(S.String),
    name: S.optional(S.String),
    id: S.optional(S.String),
    description: S.optional(S.String),
    tools: S.optional(ToolsList),
    next: S.optional(StringList),
    previous: S.optional(StringList),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateWorkflowStepGroupResponse",
}) as any as S.Schema<CreateWorkflowStepGroupResponse>;
export interface GetWorkflowStepGroupResponse {
  id?: string;
  workflowId?: string;
  name?: string;
  description?: string;
  status?: string;
  owner?: string;
  creationTime?: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  tools?: ToolsList;
  previous?: StringList;
  next?: StringList;
}
export const GetWorkflowStepGroupResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    workflowId: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    status: S.optional(S.String),
    owner: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tools: S.optional(ToolsList),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  }),
).annotations({
  identifier: "GetWorkflowStepGroupResponse",
}) as any as S.Schema<GetWorkflowStepGroupResponse>;
export interface UpdateWorkflowStepGroupResponse {
  workflowId?: string;
  name?: string;
  id?: string;
  description?: string;
  tools?: ToolsList;
  next?: StringList;
  previous?: StringList;
  lastModifiedTime?: Date;
}
export const UpdateWorkflowStepGroupResponse = S.suspend(() =>
  S.Struct({
    workflowId: S.optional(S.String),
    name: S.optional(S.String),
    id: S.optional(S.String),
    description: S.optional(S.String),
    tools: S.optional(ToolsList),
    next: S.optional(StringList),
    previous: S.optional(StringList),
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateWorkflowStepGroupResponse",
}) as any as S.Schema<UpdateWorkflowStepGroupResponse>;
export interface MigrationWorkflowSummary {
  id?: string;
  name?: string;
  templateId?: string;
  adsApplicationConfigurationName?: string;
  status?: string;
  creationTime?: Date;
  endTime?: Date;
  statusMessage?: string;
  completedSteps?: number;
  totalSteps?: number;
}
export const MigrationWorkflowSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "MigrationWorkflowSummary",
}) as any as S.Schema<MigrationWorkflowSummary>;
export type MigrationWorkflowSummaryList = MigrationWorkflowSummary[];
export const MigrationWorkflowSummaryList = S.Array(MigrationWorkflowSummary);
export interface TemplateInput {
  inputName?: string;
  dataType?: string;
  required?: boolean;
}
export const TemplateInput = S.suspend(() =>
  S.Struct({
    inputName: S.optional(S.String),
    dataType: S.optional(S.String),
    required: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TemplateInput",
}) as any as S.Schema<TemplateInput>;
export type TemplateInputList = TemplateInput[];
export const TemplateInputList = S.Array(TemplateInput);
export interface TemplateSummary {
  id?: string;
  name?: string;
  arn?: string;
  description?: string;
}
export const TemplateSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    arn: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "TemplateSummary",
}) as any as S.Schema<TemplateSummary>;
export type TemplateSummaryList = TemplateSummary[];
export const TemplateSummaryList = S.Array(TemplateSummary);
export interface PluginSummary {
  pluginId?: string;
  hostname?: string;
  status?: string;
  ipAddress?: string;
  version?: string;
  registeredTime?: string;
}
export const PluginSummary = S.suspend(() =>
  S.Struct({
    pluginId: S.optional(S.String),
    hostname: S.optional(S.String),
    status: S.optional(S.String),
    ipAddress: S.optional(S.String),
    version: S.optional(S.String),
    registeredTime: S.optional(S.String),
  }),
).annotations({
  identifier: "PluginSummary",
}) as any as S.Schema<PluginSummary>;
export type PluginSummaries = PluginSummary[];
export const PluginSummaries = S.Array(PluginSummary);
export interface StepOutput {
  name?: string;
  dataType?: string;
  required?: boolean;
}
export const StepOutput = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    dataType: S.optional(S.String),
    required: S.optional(S.Boolean),
  }),
).annotations({ identifier: "StepOutput" }) as any as S.Schema<StepOutput>;
export type StepOutputList = StepOutput[];
export const StepOutputList = S.Array(StepOutput);
export interface StepAutomationConfiguration {
  scriptLocationS3Bucket?: string;
  scriptLocationS3Key?: PlatformScriptKey;
  command?: PlatformCommand;
  runEnvironment?: string;
  targetType?: string;
}
export const StepAutomationConfiguration = S.suspend(() =>
  S.Struct({
    scriptLocationS3Bucket: S.optional(S.String),
    scriptLocationS3Key: S.optional(PlatformScriptKey),
    command: S.optional(PlatformCommand),
    runEnvironment: S.optional(S.String),
    targetType: S.optional(S.String),
  }),
).annotations({
  identifier: "StepAutomationConfiguration",
}) as any as S.Schema<StepAutomationConfiguration>;
export interface TemplateStepSummary {
  id?: string;
  stepGroupId?: string;
  templateId?: string;
  name?: string;
  stepActionType?: string;
  targetType?: string;
  owner?: string;
  previous?: StringList;
  next?: StringList;
}
export const TemplateStepSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    stepGroupId: S.optional(S.String),
    templateId: S.optional(S.String),
    name: S.optional(S.String),
    stepActionType: S.optional(S.String),
    targetType: S.optional(S.String),
    owner: S.optional(S.String),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  }),
).annotations({
  identifier: "TemplateStepSummary",
}) as any as S.Schema<TemplateStepSummary>;
export type TemplateStepSummaryList = TemplateStepSummary[];
export const TemplateStepSummaryList = S.Array(TemplateStepSummary);
export interface TemplateStepGroupSummary {
  id?: string;
  name?: string;
  previous?: StringList;
  next?: StringList;
}
export const TemplateStepGroupSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  }),
).annotations({
  identifier: "TemplateStepGroupSummary",
}) as any as S.Schema<TemplateStepGroupSummary>;
export type TemplateStepGroupSummaryList = TemplateStepGroupSummary[];
export const TemplateStepGroupSummaryList = S.Array(TemplateStepGroupSummary);
export interface WorkflowStepSummary {
  stepId?: string;
  name?: string;
  stepActionType?: string;
  owner?: string;
  previous?: StringList;
  next?: StringList;
  status?: string;
  statusMessage?: string;
  noOfSrvCompleted?: number;
  noOfSrvFailed?: number;
  totalNoOfSrv?: number;
  description?: string;
  scriptLocation?: string;
}
export const WorkflowStepSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "WorkflowStepSummary",
}) as any as S.Schema<WorkflowStepSummary>;
export type WorkflowStepsSummaryList = WorkflowStepSummary[];
export const WorkflowStepsSummaryList = S.Array(WorkflowStepSummary);
export interface WorkflowStepGroupSummary {
  id?: string;
  name?: string;
  owner?: string;
  status?: string;
  previous?: StringList;
  next?: StringList;
}
export const WorkflowStepGroupSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    owner: S.optional(S.String),
    status: S.optional(S.String),
    previous: S.optional(StringList),
    next: S.optional(StringList),
  }),
).annotations({
  identifier: "WorkflowStepGroupSummary",
}) as any as S.Schema<WorkflowStepGroupSummary>;
export type WorkflowStepGroupsSummaryList = WorkflowStepGroupSummary[];
export const WorkflowStepGroupsSummaryList = S.Array(WorkflowStepGroupSummary);
export interface CreateMigrationWorkflowRequest {
  name: string;
  description?: string;
  templateId: string;
  applicationConfigurationId?: string;
  inputParameters: StepInputParameters;
  stepTargets?: StringList;
  tags?: StringMap;
}
export const CreateMigrationWorkflowRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    templateId: S.String,
    applicationConfigurationId: S.optional(S.String),
    inputParameters: StepInputParameters,
    stepTargets: S.optional(StringList),
    tags: S.optional(StringMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/migrationworkflow/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMigrationWorkflowRequest",
}) as any as S.Schema<CreateMigrationWorkflowRequest>;
export interface GetMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  templateId?: string;
  adsApplicationConfigurationId?: string;
  adsApplicationName?: string;
  status?: string;
  statusMessage?: string;
  creationTime?: Date;
  lastStartTime?: Date;
  lastStopTime?: Date;
  lastModifiedTime?: Date;
  endTime?: Date;
  tools?: ToolsList;
  totalSteps?: number;
  completedSteps?: number;
  workflowInputs?: StepInputParameters;
  tags?: StringMap;
  workflowBucket?: string;
}
export const GetMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
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
    lastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tools: S.optional(ToolsList),
    totalSteps: S.optional(S.Number),
    completedSteps: S.optional(S.Number),
    workflowInputs: S.optional(StepInputParameters),
    tags: S.optional(StringMap),
    workflowBucket: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMigrationWorkflowResponse",
}) as any as S.Schema<GetMigrationWorkflowResponse>;
export interface ListMigrationWorkflowsResponse {
  nextToken?: string;
  migrationWorkflowSummary: MigrationWorkflowSummaryList;
}
export const ListMigrationWorkflowsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    migrationWorkflowSummary: MigrationWorkflowSummaryList,
  }),
).annotations({
  identifier: "ListMigrationWorkflowsResponse",
}) as any as S.Schema<ListMigrationWorkflowsResponse>;
export interface CreateTemplateResponse {
  templateId?: string;
  templateArn?: string;
  tags?: StringMap;
}
export const CreateTemplateResponse = S.suspend(() =>
  S.Struct({
    templateId: S.optional(S.String),
    templateArn: S.optional(S.String),
    tags: S.optional(StringMap),
  }),
).annotations({
  identifier: "CreateTemplateResponse",
}) as any as S.Schema<CreateTemplateResponse>;
export interface GetMigrationWorkflowTemplateResponse {
  id?: string;
  templateArn?: string;
  name?: string;
  description?: string;
  inputs?: TemplateInputList;
  tools?: ToolsList;
  creationTime?: Date;
  owner?: string;
  status?: string;
  statusMessage?: string;
  templateClass?: string;
  tags?: StringMap;
}
export const GetMigrationWorkflowTemplateResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetMigrationWorkflowTemplateResponse",
}) as any as S.Schema<GetMigrationWorkflowTemplateResponse>;
export interface ListMigrationWorkflowTemplatesResponse {
  nextToken?: string;
  templateSummary: TemplateSummaryList;
}
export const ListMigrationWorkflowTemplatesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templateSummary: TemplateSummaryList,
  }),
).annotations({
  identifier: "ListMigrationWorkflowTemplatesResponse",
}) as any as S.Schema<ListMigrationWorkflowTemplatesResponse>;
export interface ListPluginsResponse {
  nextToken?: string;
  plugins?: PluginSummaries;
}
export const ListPluginsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    plugins: S.optional(PluginSummaries),
  }),
).annotations({
  identifier: "ListPluginsResponse",
}) as any as S.Schema<ListPluginsResponse>;
export interface GetTemplateStepResponse {
  id?: string;
  stepGroupId?: string;
  templateId?: string;
  name?: string;
  description?: string;
  stepActionType?: string;
  creationTime?: string;
  previous?: StringList;
  next?: StringList;
  outputs?: StepOutputList;
  stepAutomationConfiguration?: StepAutomationConfiguration;
}
export const GetTemplateStepResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetTemplateStepResponse",
}) as any as S.Schema<GetTemplateStepResponse>;
export interface ListTemplateStepsResponse {
  nextToken?: string;
  templateStepSummaryList?: TemplateStepSummaryList;
}
export const ListTemplateStepsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templateStepSummaryList: S.optional(TemplateStepSummaryList),
  }),
).annotations({
  identifier: "ListTemplateStepsResponse",
}) as any as S.Schema<ListTemplateStepsResponse>;
export interface ListTemplateStepGroupsResponse {
  nextToken?: string;
  templateStepGroupSummary: TemplateStepGroupSummaryList;
}
export const ListTemplateStepGroupsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    templateStepGroupSummary: TemplateStepGroupSummaryList,
  }),
).annotations({
  identifier: "ListTemplateStepGroupsResponse",
}) as any as S.Schema<ListTemplateStepGroupsResponse>;
export interface CreateWorkflowStepRequest {
  name: string;
  stepGroupId: string;
  workflowId: string;
  stepActionType: string;
  description?: string;
  workflowStepAutomationConfiguration?: WorkflowStepAutomationConfiguration;
  stepTarget?: StringList;
  outputs?: WorkflowStepOutputList;
  previous?: StringList;
  next?: StringList;
}
export const CreateWorkflowStepRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/workflowstep" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWorkflowStepRequest",
}) as any as S.Schema<CreateWorkflowStepRequest>;
export interface ListWorkflowStepsResponse {
  nextToken?: string;
  workflowStepsSummary: WorkflowStepsSummaryList;
}
export const ListWorkflowStepsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    workflowStepsSummary: WorkflowStepsSummaryList,
  }),
).annotations({
  identifier: "ListWorkflowStepsResponse",
}) as any as S.Schema<ListWorkflowStepsResponse>;
export interface ListWorkflowStepGroupsResponse {
  nextToken?: string;
  workflowStepGroupsSummary: WorkflowStepGroupsSummaryList;
}
export const ListWorkflowStepGroupsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    workflowStepGroupsSummary: WorkflowStepGroupsSummaryList,
  }),
).annotations({
  identifier: "ListWorkflowStepGroupsResponse",
}) as any as S.Schema<ListWorkflowStepGroupsResponse>;
export interface CreateMigrationWorkflowResponse {
  id?: string;
  arn?: string;
  name?: string;
  description?: string;
  templateId?: string;
  adsApplicationConfigurationId?: string;
  workflowInputs?: StepInputParameters;
  stepTargets?: StringList;
  status?: string;
  creationTime?: Date;
  tags?: StringMap;
}
export const CreateMigrationWorkflowResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "CreateMigrationWorkflowResponse",
}) as any as S.Schema<CreateMigrationWorkflowResponse>;
export interface CreateWorkflowStepResponse {
  id?: string;
  stepGroupId?: string;
  workflowId?: string;
  name?: string;
}
export const CreateWorkflowStepResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    stepGroupId: S.optional(S.String),
    workflowId: S.optional(S.String),
    name: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateWorkflowStepResponse",
}) as any as S.Schema<CreateWorkflowStepResponse>;

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withAuthError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withBadRequestError, C.withRetryableError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withConflictError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Deletes the tags for a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * List AWS Migration Hub Orchestrator plugins.
 */
export const listPlugins: {
  (
    input: ListPluginsRequest,
  ): Effect.Effect<
    ListPluginsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPluginsRequest,
  ) => Stream.Stream<
    ListPluginsResponse,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPluginsRequest,
  ) => Stream.Stream<
    PluginSummary,
    | AccessDeniedException
    | InternalServerException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPluginsRequest,
  output: ListPluginsResponse,
  errors: [AccessDeniedException, InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "plugins",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the tags added to a resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Tag a resource by specifying its Amazon Resource Name (ARN).
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Deletes a migration workflow template.
 */
export const deleteTemplate: (
  input: DeleteTemplateRequest,
) => Effect.Effect<
  DeleteTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkflowStep: (
  input: CreateWorkflowStepRequest,
) => Effect.Effect<
  CreateWorkflowStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTemplates: {
  (
    input: ListMigrationWorkflowTemplatesRequest,
  ): Effect.Effect<
    ListMigrationWorkflowTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMigrationWorkflowTemplatesRequest,
  ) => Stream.Stream<
    ListMigrationWorkflowTemplatesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMigrationWorkflowTemplatesRequest,
  ) => Stream.Stream<
    TemplateSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMigrationWorkflowTemplatesRequest,
  output: ListMigrationWorkflowTemplatesResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "templateSummary",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Get a specific step in a template.
 */
export const getTemplateStep: (
  input: GetTemplateStepRequest,
) => Effect.Effect<
  GetTemplateStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTemplateSteps: {
  (
    input: ListTemplateStepsRequest,
  ): Effect.Effect<
    ListTemplateStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTemplateStepsRequest,
  ) => Stream.Stream<
    ListTemplateStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTemplateStepsRequest,
  ) => Stream.Stream<
    TemplateStepSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * List the step groups in a template.
 */
export const listTemplateStepGroups: {
  (
    input: ListTemplateStepGroupsRequest,
  ): Effect.Effect<
    ListTemplateStepGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTemplateStepGroupsRequest,
  ) => Stream.Stream<
    ListTemplateStepGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTemplateStepGroupsRequest,
  ) => Stream.Stream<
    TemplateStepGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWorkflowSteps: {
  (
    input: ListWorkflowStepsRequest,
  ): Effect.Effect<
    ListWorkflowStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowStepsRequest,
  ) => Stream.Stream<
    ListWorkflowStepsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowStepsRequest,
  ) => Stream.Stream<
    WorkflowStepSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * List the step groups in a migration workflow.
 */
export const listWorkflowStepGroups: {
  (
    input: ListWorkflowStepGroupsRequest,
  ): Effect.Effect<
    ListWorkflowStepGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowStepGroupsRequest,
  ) => Stream.Stream<
    ListWorkflowStepGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowStepGroupsRequest,
  ) => Stream.Stream<
    WorkflowStepGroupSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getTemplateStepGroup: (
  input: GetTemplateStepGroupRequest,
) => Effect.Effect<
  GetTemplateStepGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTemplateStepGroupRequest,
  output: GetTemplateStepGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a step in the migration workflow.
 */
export const getWorkflowStep: (
  input: GetWorkflowStepRequest,
) => Effect.Effect<
  GetWorkflowStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWorkflowStep: (
  input: UpdateWorkflowStepRequest,
) => Effect.Effect<
  UpdateWorkflowStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const retryWorkflowStep: (
  input: RetryWorkflowStepRequest,
) => Effect.Effect<
  RetryWorkflowStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkflowStepGroup: (
  input: CreateWorkflowStepGroupRequest,
) => Effect.Effect<
  CreateWorkflowStepGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowStepGroupRequest,
  output: CreateWorkflowStepGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the step group of a migration workflow.
 */
export const getWorkflowStepGroup: (
  input: GetWorkflowStepGroupRequest,
) => Effect.Effect<
  GetWorkflowStepGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowStepGroupRequest,
  output: GetWorkflowStepGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update the step group in a migration workflow.
 */
export const updateWorkflowStepGroup: (
  input: UpdateWorkflowStepGroupRequest,
) => Effect.Effect<
  UpdateWorkflowStepGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowStepGroupRequest,
  output: UpdateWorkflowStepGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete a step in a migration workflow. Pause the workflow to delete a running
 * step.
 */
export const deleteWorkflowStep: (
  input: DeleteWorkflowStepRequest,
) => Effect.Effect<
  DeleteWorkflowStepResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkflowStepGroup: (
  input: DeleteWorkflowStepGroupRequest,
) => Effect.Effect<
  DeleteWorkflowStepGroupResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowStepGroupRequest,
  output: DeleteWorkflowStepGroupResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Update a migration workflow.
 */
export const updateWorkflow: (
  input: UpdateMigrationWorkflowRequest,
) => Effect.Effect<
  UpdateMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkflow: (
  input: DeleteMigrationWorkflowRequest,
) => Effect.Effect<
  DeleteMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startWorkflow: (
  input: StartMigrationWorkflowRequest,
) => Effect.Effect<
  StartMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopWorkflow: (
  input: StopMigrationWorkflowRequest,
) => Effect.Effect<
  StopMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTemplate: (
  input: UpdateTemplateRequest,
) => Effect.Effect<
  UpdateTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflow: (
  input: GetMigrationWorkflowRequest,
) => Effect.Effect<
  GetMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWorkflows: {
  (
    input: ListMigrationWorkflowsRequest,
  ): Effect.Effect<
    ListMigrationWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMigrationWorkflowsRequest,
  ) => Stream.Stream<
    ListMigrationWorkflowsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMigrationWorkflowsRequest,
  ) => Stream.Stream<
    MigrationWorkflowSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Get the template you want to use for creating a migration workflow.
 */
export const getTemplate: (
  input: GetMigrationWorkflowTemplateRequest,
) => Effect.Effect<
  GetMigrationWorkflowTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkflow: (
  input: CreateMigrationWorkflowRequest,
) => Effect.Effect<
  CreateMigrationWorkflowResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTemplate: (
  input: CreateTemplateRequest,
) => Effect.Effect<
  CreateTemplateResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
