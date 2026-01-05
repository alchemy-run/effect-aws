import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Proton",
  serviceShapeName: "AwsProton20200720",
});
const auth = T.AwsAuthSigv4({ name: "proton" });
const ver = T.ServiceVersion("2020-07-20");
const proto = T.AwsProtocolsAwsJson1_0();
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
                        url: "https://proton-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://proton-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://proton.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://proton.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetResourcesSummaryInput extends S.Class<GetResourcesSummaryInput>(
  "GetResourcesSummaryInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccountSettingsInput extends S.Class<GetAccountSettingsInput>(
  "GetAccountSettingsInput",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export const EnvironmentAccountConnectionStatusList = S.Array(S.String);
export const ServiceTemplateSupportedComponentSourceInputList = S.Array(
  S.String,
);
export class CancelComponentDeploymentInput extends S.Class<CancelComponentDeploymentInput>(
  "CancelComponentDeploymentInput",
)(
  { componentName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelEnvironmentDeploymentInput extends S.Class<CancelEnvironmentDeploymentInput>(
  "CancelEnvironmentDeploymentInput",
)(
  { environmentName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelServiceInstanceDeploymentInput extends S.Class<CancelServiceInstanceDeploymentInput>(
  "CancelServiceInstanceDeploymentInput",
)(
  { serviceInstanceName: S.String, serviceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelServicePipelineDeploymentInput extends S.Class<CancelServicePipelineDeploymentInput>(
  "CancelServicePipelineDeploymentInput",
)(
  { serviceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositorySyncStatusInput extends S.Class<GetRepositorySyncStatusInput>(
  "GetRepositorySyncStatusInput",
)(
  {
    repositoryName: S.String,
    repositoryProvider: S.String,
    branch: S.String,
    syncType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceInstanceSyncStatusInput extends S.Class<GetServiceInstanceSyncStatusInput>(
  "GetServiceInstanceSyncStatusInput",
)(
  { serviceName: S.String, serviceInstanceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTemplateSyncStatusInput extends S.Class<GetTemplateSyncStatusInput>(
  "GetTemplateSyncStatusInput",
)(
  { templateName: S.String, templateType: S.String, templateVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositorySyncDefinitionsInput extends S.Class<ListRepositorySyncDefinitionsInput>(
  "ListRepositorySyncDefinitionsInput",
)(
  {
    repositoryName: S.String,
    repositoryProvider: S.String,
    syncType: S.String,
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  {
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
    tagKeys: TagKeyList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class ListComponentOutputsInput extends S.Class<ListComponentOutputsInput>(
  "ListComponentOutputsInput",
)(
  {
    componentName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComponentProvisionedResourcesInput extends S.Class<ListComponentProvisionedResourcesInput>(
  "ListComponentProvisionedResourcesInput",
)(
  { componentName: S.String, nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.String,
  value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class CreateComponentInput extends S.Class<CreateComponentInput>(
  "CreateComponentInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    environmentName: S.optional(S.String),
    templateFile: S.String,
    manifest: S.String,
    serviceSpec: S.optional(S.String),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetComponentInput extends S.Class<GetComponentInput>(
  "GetComponentInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComponentInput extends S.Class<UpdateComponentInput>(
  "UpdateComponentInput",
)(
  {
    name: S.String,
    deploymentType: S.String,
    description: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    serviceSpec: S.optional(S.String),
    templateFile: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteComponentInput extends S.Class<DeleteComponentInput>(
  "DeleteComponentInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComponentsInput extends S.Class<ListComponentsInput>(
  "ListComponentsInput",
)(
  {
    nextToken: S.optional(S.String),
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDeploymentInput extends S.Class<GetDeploymentInput>(
  "GetDeploymentInput",
)(
  {
    id: S.String,
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDeploymentInput extends S.Class<DeleteDeploymentInput>(
  "DeleteDeploymentInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDeploymentsInput extends S.Class<ListDeploymentsInput>(
  "ListDeploymentsInput",
)(
  {
    nextToken: S.optional(S.String),
    environmentName: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceInstanceName: S.optional(S.String),
    componentName: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEnvironmentAccountConnectionInput extends S.Class<CreateEnvironmentAccountConnectionInput>(
  "CreateEnvironmentAccountConnectionInput",
)(
  {
    clientToken: S.optional(S.String),
    managementAccountId: S.String,
    roleArn: S.optional(S.String),
    environmentName: S.String,
    tags: S.optional(TagList),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnvironmentAccountConnectionInput extends S.Class<GetEnvironmentAccountConnectionInput>(
  "GetEnvironmentAccountConnectionInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnvironmentAccountConnectionInput extends S.Class<UpdateEnvironmentAccountConnectionInput>(
  "UpdateEnvironmentAccountConnectionInput",
)(
  {
    id: S.String,
    roleArn: S.optional(S.String),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentAccountConnectionInput extends S.Class<DeleteEnvironmentAccountConnectionInput>(
  "DeleteEnvironmentAccountConnectionInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentAccountConnectionsInput extends S.Class<ListEnvironmentAccountConnectionsInput>(
  "ListEnvironmentAccountConnectionsInput",
)(
  {
    requestedBy: S.String,
    environmentName: S.optional(S.String),
    statuses: S.optional(EnvironmentAccountConnectionStatusList),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AcceptEnvironmentAccountConnectionInput extends S.Class<AcceptEnvironmentAccountConnectionInput>(
  "AcceptEnvironmentAccountConnectionInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RejectEnvironmentAccountConnectionInput extends S.Class<RejectEnvironmentAccountConnectionInput>(
  "RejectEnvironmentAccountConnectionInput",
)(
  { id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentOutputsInput extends S.Class<ListEnvironmentOutputsInput>(
  "ListEnvironmentOutputsInput",
)(
  {
    environmentName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentProvisionedResourcesInput extends S.Class<ListEnvironmentProvisionedResourcesInput>(
  "ListEnvironmentProvisionedResourcesInput",
)(
  { environmentName: S.String, nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RepositoryBranchInput extends S.Class<RepositoryBranchInput>(
  "RepositoryBranchInput",
)({ provider: S.String, name: S.String, branch: S.String }) {}
export class CreateEnvironmentInput extends S.Class<CreateEnvironmentInput>(
  "CreateEnvironmentInput",
)(
  {
    name: S.String,
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.optional(S.String),
    description: S.optional(S.String),
    spec: S.String,
    protonServiceRoleArn: S.optional(S.String),
    environmentAccountConnectionId: S.optional(S.String),
    tags: S.optional(TagList),
    provisioningRepository: S.optional(RepositoryBranchInput),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnvironmentInput extends S.Class<GetEnvironmentInput>(
  "GetEnvironmentInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnvironmentInput extends S.Class<UpdateEnvironmentInput>(
  "UpdateEnvironmentInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    spec: S.optional(S.String),
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    protonServiceRoleArn: S.optional(S.String),
    deploymentType: S.String,
    environmentAccountConnectionId: S.optional(S.String),
    provisioningRepository: S.optional(RepositoryBranchInput),
    componentRoleArn: S.optional(S.String),
    codebuildRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentInput extends S.Class<DeleteEnvironmentInput>(
  "DeleteEnvironmentInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEnvironmentTemplateInput extends S.Class<CreateEnvironmentTemplateInput>(
  "CreateEnvironmentTemplateInput",
)(
  {
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    encryptionKey: S.optional(S.String),
    provisioning: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnvironmentTemplateInput extends S.Class<GetEnvironmentTemplateInput>(
  "GetEnvironmentTemplateInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnvironmentTemplateInput extends S.Class<UpdateEnvironmentTemplateInput>(
  "UpdateEnvironmentTemplateInput",
)(
  {
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentTemplateInput extends S.Class<DeleteEnvironmentTemplateInput>(
  "DeleteEnvironmentTemplateInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentTemplatesInput extends S.Class<ListEnvironmentTemplatesInput>(
  "ListEnvironmentTemplatesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnvironmentTemplateVersionInput extends S.Class<GetEnvironmentTemplateVersionInput>(
  "GetEnvironmentTemplateVersionInput",
)(
  { templateName: S.String, majorVersion: S.String, minorVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnvironmentTemplateVersionInput extends S.Class<UpdateEnvironmentTemplateVersionInput>(
  "UpdateEnvironmentTemplateVersionInput",
)(
  {
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEnvironmentTemplateVersionInput extends S.Class<DeleteEnvironmentTemplateVersionInput>(
  "DeleteEnvironmentTemplateVersionInput",
)(
  { templateName: S.String, majorVersion: S.String, minorVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnvironmentTemplateVersionsInput extends S.Class<ListEnvironmentTemplateVersionsInput>(
  "ListEnvironmentTemplateVersionsInput",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    templateName: S.String,
    majorVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRepositoryInput extends S.Class<CreateRepositoryInput>(
  "CreateRepositoryInput",
)(
  {
    provider: S.String,
    name: S.String,
    connectionArn: S.String,
    encryptionKey: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRepositoryInput extends S.Class<GetRepositoryInput>(
  "GetRepositoryInput",
)(
  { provider: S.String, name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRepositoryInput extends S.Class<DeleteRepositoryInput>(
  "DeleteRepositoryInput",
)(
  { provider: S.String, name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRepositoriesInput extends S.Class<ListRepositoriesInput>(
  "ListRepositoriesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceInstanceOutputsInput extends S.Class<ListServiceInstanceOutputsInput>(
  "ListServiceInstanceOutputsInput",
)(
  {
    serviceInstanceName: S.String,
    serviceName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceInstanceProvisionedResourcesInput extends S.Class<ListServiceInstanceProvisionedResourcesInput>(
  "ListServiceInstanceProvisionedResourcesInput",
)(
  {
    serviceName: S.String,
    serviceInstanceName: S.String,
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceInstanceInput extends S.Class<CreateServiceInstanceInput>(
  "CreateServiceInstanceInput",
)(
  {
    name: S.String,
    serviceName: S.String,
    spec: S.String,
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    tags: S.optional(TagList),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceInstanceInput extends S.Class<GetServiceInstanceInput>(
  "GetServiceInstanceInput",
)(
  { name: S.String, serviceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceInstanceInput extends S.Class<UpdateServiceInstanceInput>(
  "UpdateServiceInstanceInput",
)(
  {
    name: S.String,
    serviceName: S.String,
    deploymentType: S.String,
    spec: S.optional(S.String),
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicePipelineOutputsInput extends S.Class<ListServicePipelineOutputsInput>(
  "ListServicePipelineOutputsInput",
)(
  {
    serviceName: S.String,
    nextToken: S.optional(S.String),
    deploymentId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicePipelineProvisionedResourcesInput extends S.Class<ListServicePipelineProvisionedResourcesInput>(
  "ListServicePipelineProvisionedResourcesInput",
)(
  { serviceName: S.String, nextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServicePipelineInput extends S.Class<UpdateServicePipelineInput>(
  "UpdateServicePipelineInput",
)(
  {
    serviceName: S.String,
    spec: S.String,
    deploymentType: S.String,
    templateMajorVersion: S.optional(S.String),
    templateMinorVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceInput extends S.Class<CreateServiceInput>(
  "CreateServiceInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    templateName: S.String,
    templateMajorVersion: S.String,
    templateMinorVersion: S.optional(S.String),
    spec: S.String,
    repositoryConnectionArn: S.optional(S.String),
    repositoryId: S.optional(S.String),
    branchName: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceInput extends S.Class<GetServiceInput>(
  "GetServiceInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceInput extends S.Class<UpdateServiceInput>(
  "UpdateServiceInput",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    spec: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceInput extends S.Class<DeleteServiceInput>(
  "DeleteServiceInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesInput extends S.Class<ListServicesInput>(
  "ListServicesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceSyncBlockerSummaryInput extends S.Class<GetServiceSyncBlockerSummaryInput>(
  "GetServiceSyncBlockerSummaryInput",
)(
  { serviceName: S.String, serviceInstanceName: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceSyncBlockerInput extends S.Class<UpdateServiceSyncBlockerInput>(
  "UpdateServiceSyncBlockerInput",
)(
  { id: S.String, resolvedReason: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceSyncConfigInput extends S.Class<CreateServiceSyncConfigInput>(
  "CreateServiceSyncConfigInput",
)(
  {
    serviceName: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    filePath: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceSyncConfigInput extends S.Class<GetServiceSyncConfigInput>(
  "GetServiceSyncConfigInput",
)(
  { serviceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceSyncConfigInput extends S.Class<UpdateServiceSyncConfigInput>(
  "UpdateServiceSyncConfigInput",
)(
  {
    serviceName: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    filePath: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceSyncConfigInput extends S.Class<DeleteServiceSyncConfigInput>(
  "DeleteServiceSyncConfigInput",
)(
  { serviceName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceTemplateInput extends S.Class<CreateServiceTemplateInput>(
  "CreateServiceTemplateInput",
)(
  {
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
    encryptionKey: S.optional(S.String),
    pipelineProvisioning: S.optional(S.String),
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceTemplateInput extends S.Class<GetServiceTemplateInput>(
  "GetServiceTemplateInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServiceTemplateInput extends S.Class<UpdateServiceTemplateInput>(
  "UpdateServiceTemplateInput",
)(
  {
    name: S.String,
    displayName: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceTemplateInput extends S.Class<DeleteServiceTemplateInput>(
  "DeleteServiceTemplateInput",
)(
  { name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceTemplatesInput extends S.Class<ListServiceTemplatesInput>(
  "ListServiceTemplatesInput",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetServiceTemplateVersionInput extends S.Class<GetServiceTemplateVersionInput>(
  "GetServiceTemplateVersionInput",
)(
  { templateName: S.String, majorVersion: S.String, minorVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompatibleEnvironmentTemplateInput extends S.Class<CompatibleEnvironmentTemplateInput>(
  "CompatibleEnvironmentTemplateInput",
)({ templateName: S.String, majorVersion: S.String }) {}
export const CompatibleEnvironmentTemplateInputList = S.Array(
  CompatibleEnvironmentTemplateInput,
);
export class UpdateServiceTemplateVersionInput extends S.Class<UpdateServiceTemplateVersionInput>(
  "UpdateServiceTemplateVersionInput",
)(
  {
    templateName: S.String,
    majorVersion: S.String,
    minorVersion: S.String,
    description: S.optional(S.String),
    status: S.optional(S.String),
    compatibleEnvironmentTemplates: S.optional(
      CompatibleEnvironmentTemplateInputList,
    ),
    supportedComponentSources: S.optional(
      ServiceTemplateSupportedComponentSourceInputList,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceTemplateVersionInput extends S.Class<DeleteServiceTemplateVersionInput>(
  "DeleteServiceTemplateVersionInput",
)(
  { templateName: S.String, majorVersion: S.String, minorVersion: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServiceTemplateVersionsInput extends S.Class<ListServiceTemplateVersionsInput>(
  "ListServiceTemplateVersionsInput",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    templateName: S.String,
    majorVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTemplateSyncConfigInput extends S.Class<CreateTemplateSyncConfigInput>(
  "CreateTemplateSyncConfigInput",
)(
  {
    templateName: S.String,
    templateType: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    subdirectory: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTemplateSyncConfigInput extends S.Class<GetTemplateSyncConfigInput>(
  "GetTemplateSyncConfigInput",
)(
  { templateName: S.String, templateType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTemplateSyncConfigInput extends S.Class<UpdateTemplateSyncConfigInput>(
  "UpdateTemplateSyncConfigInput",
)(
  {
    templateName: S.String,
    templateType: S.String,
    repositoryProvider: S.String,
    repositoryName: S.String,
    branch: S.String,
    subdirectory: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTemplateSyncConfigInput extends S.Class<DeleteTemplateSyncConfigInput>(
  "DeleteTemplateSyncConfigInput",
)(
  { templateName: S.String, templateType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Output extends S.Class<Output>("Output")({
  key: S.optional(S.String),
  valueString: S.optional(S.String),
}) {}
export const OutputsList = S.Array(Output);
export class EnvironmentTemplateFilter extends S.Class<EnvironmentTemplateFilter>(
  "EnvironmentTemplateFilter",
)({ templateName: S.String, majorVersion: S.String }) {}
export const EnvironmentTemplateFilterList = S.Array(EnvironmentTemplateFilter);
export class ListServiceInstancesFilter extends S.Class<ListServiceInstancesFilter>(
  "ListServiceInstancesFilter",
)({ key: S.optional(S.String), value: S.optional(S.String) }) {}
export const ListServiceInstancesFilterList = S.Array(
  ListServiceInstancesFilter,
);
export class Revision extends S.Class<Revision>("Revision")({
  repositoryName: S.String,
  repositoryProvider: S.String,
  sha: S.String,
  directory: S.String,
  branch: S.String,
}) {}
export class ResourceSyncEvent extends S.Class<ResourceSyncEvent>(
  "ResourceSyncEvent",
)({
  type: S.String,
  externalId: S.optional(S.String),
  time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  event: S.String,
}) {}
export const ResourceSyncEvents = S.Array(ResourceSyncEvent);
export class ResourceSyncAttempt extends S.Class<ResourceSyncAttempt>(
  "ResourceSyncAttempt",
)({
  initialRevision: Revision,
  targetRevision: Revision,
  target: S.String,
  startedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  events: ResourceSyncEvents,
}) {}
export class GetTemplateSyncStatusOutput extends S.Class<GetTemplateSyncStatusOutput>(
  "GetTemplateSyncStatusOutput",
)({
  latestSync: S.optional(ResourceSyncAttempt),
  latestSuccessfulSync: S.optional(ResourceSyncAttempt),
  desiredState: S.optional(Revision),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: TagList, nextToken: S.optional(S.String) }) {}
export class NotifyResourceDeploymentStatusChangeInput extends S.Class<NotifyResourceDeploymentStatusChangeInput>(
  "NotifyResourceDeploymentStatusChangeInput",
)(
  {
    resourceArn: S.String,
    status: S.optional(S.String),
    outputs: S.optional(OutputsList),
    deploymentId: S.optional(S.String),
    statusMessage: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyResourceDeploymentStatusChangeOutput extends S.Class<NotifyResourceDeploymentStatusChangeOutput>(
  "NotifyResourceDeploymentStatusChangeOutput",
)({}) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { resourceArn: S.String.pipe(T.HttpQuery("resourceArn")), tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class UpdateAccountSettingsInput extends S.Class<UpdateAccountSettingsInput>(
  "UpdateAccountSettingsInput",
)(
  {
    pipelineServiceRoleArn: S.optional(S.String),
    pipelineProvisioningRepository: S.optional(RepositoryBranchInput),
    deletePipelineProvisioningRepository: S.optional(S.Boolean),
    pipelineCodebuildRoleArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComponentOutputsOutput extends S.Class<ListComponentOutputsOutput>(
  "ListComponentOutputsOutput",
)({ nextToken: S.optional(S.String), outputs: OutputsList }) {}
export class Component extends S.Class<Component>("Component")({
  name: S.String,
  description: S.optional(S.String),
  arn: S.String,
  environmentName: S.String,
  serviceName: S.optional(S.String),
  serviceInstanceName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastDeploymentSucceededAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  serviceSpec: S.optional(S.String),
  lastClientRequestToken: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export class CreateComponentOutput extends S.Class<CreateComponentOutput>(
  "CreateComponentOutput",
)({ component: Component }) {}
export class GetComponentOutput extends S.Class<GetComponentOutput>(
  "GetComponentOutput",
)({ component: S.optional(Component) }) {}
export class UpdateComponentOutput extends S.Class<UpdateComponentOutput>(
  "UpdateComponentOutput",
)({ component: Component }) {}
export class DeleteComponentOutput extends S.Class<DeleteComponentOutput>(
  "DeleteComponentOutput",
)({ component: S.optional(Component) }) {}
export const ComponentDeploymentIdList = S.Array(S.String);
export class ServiceInstanceState extends S.Class<ServiceInstanceState>(
  "ServiceInstanceState",
)({
  spec: S.String,
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  lastSuccessfulComponentDeploymentIds: S.optional(ComponentDeploymentIdList),
  lastSuccessfulEnvironmentDeploymentId: S.optional(S.String),
  lastSuccessfulServicePipelineDeploymentId: S.optional(S.String),
}) {}
export class EnvironmentState extends S.Class<EnvironmentState>(
  "EnvironmentState",
)({
  spec: S.optional(S.String),
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
}) {}
export class ServicePipelineState extends S.Class<ServicePipelineState>(
  "ServicePipelineState",
)({
  spec: S.optional(S.String),
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
}) {}
export class ComponentState extends S.Class<ComponentState>("ComponentState")({
  serviceName: S.optional(S.String),
  serviceInstanceName: S.optional(S.String),
  serviceSpec: S.optional(S.String),
  templateFile: S.optional(S.String),
}) {}
export const DeploymentState = S.Union(
  S.Struct({ serviceInstance: ServiceInstanceState }),
  S.Struct({ environment: EnvironmentState }),
  S.Struct({ servicePipeline: ServicePipelineState }),
  S.Struct({ component: ComponentState }),
);
export class Deployment extends S.Class<Deployment>("Deployment")({
  id: S.String,
  arn: S.String,
  targetArn: S.String,
  targetResourceCreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  targetResourceType: S.String,
  environmentName: S.String,
  serviceName: S.optional(S.String),
  serviceInstanceName: S.optional(S.String),
  componentName: S.optional(S.String),
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
  initialState: S.optional(DeploymentState),
  targetState: S.optional(DeploymentState),
}) {}
export class DeleteDeploymentOutput extends S.Class<DeleteDeploymentOutput>(
  "DeleteDeploymentOutput",
)({ deployment: S.optional(Deployment) }) {}
export class EnvironmentAccountConnection extends S.Class<EnvironmentAccountConnection>(
  "EnvironmentAccountConnection",
)({
  id: S.String,
  arn: S.String,
  managementAccountId: S.String,
  environmentAccountId: S.String,
  roleArn: S.String,
  environmentName: S.String,
  requestedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  componentRoleArn: S.optional(S.String),
  codebuildRoleArn: S.optional(S.String),
}) {}
export class GetEnvironmentAccountConnectionOutput extends S.Class<GetEnvironmentAccountConnectionOutput>(
  "GetEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: EnvironmentAccountConnection }) {}
export class UpdateEnvironmentAccountConnectionOutput extends S.Class<UpdateEnvironmentAccountConnectionOutput>(
  "UpdateEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: EnvironmentAccountConnection }) {}
export class DeleteEnvironmentAccountConnectionOutput extends S.Class<DeleteEnvironmentAccountConnectionOutput>(
  "DeleteEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: S.optional(EnvironmentAccountConnection) }) {}
export class AcceptEnvironmentAccountConnectionOutput extends S.Class<AcceptEnvironmentAccountConnectionOutput>(
  "AcceptEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: EnvironmentAccountConnection }) {}
export class RejectEnvironmentAccountConnectionOutput extends S.Class<RejectEnvironmentAccountConnectionOutput>(
  "RejectEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: EnvironmentAccountConnection }) {}
export class ListEnvironmentOutputsOutput extends S.Class<ListEnvironmentOutputsOutput>(
  "ListEnvironmentOutputsOutput",
)({ nextToken: S.optional(S.String), outputs: OutputsList }) {}
export class ProvisionedResource extends S.Class<ProvisionedResource>(
  "ProvisionedResource",
)({
  name: S.optional(S.String),
  identifier: S.optional(S.String),
  provisioningEngine: S.optional(S.String),
}) {}
export const ProvisionedResourceList = S.Array(ProvisionedResource);
export class ListEnvironmentProvisionedResourcesOutput extends S.Class<ListEnvironmentProvisionedResourcesOutput>(
  "ListEnvironmentProvisionedResourcesOutput",
)({
  nextToken: S.optional(S.String),
  provisionedResources: ProvisionedResourceList,
}) {}
export class RepositoryBranch extends S.Class<RepositoryBranch>(
  "RepositoryBranch",
)({ arn: S.String, provider: S.String, name: S.String, branch: S.String }) {}
export class Environment extends S.Class<Environment>("Environment")({
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  arn: S.String,
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  protonServiceRoleArn: S.optional(S.String),
  environmentAccountConnectionId: S.optional(S.String),
  environmentAccountId: S.optional(S.String),
  spec: S.optional(S.String),
  provisioning: S.optional(S.String),
  provisioningRepository: S.optional(RepositoryBranch),
  componentRoleArn: S.optional(S.String),
  codebuildRoleArn: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export class CreateEnvironmentOutput extends S.Class<CreateEnvironmentOutput>(
  "CreateEnvironmentOutput",
)({ environment: Environment }) {}
export class GetEnvironmentOutput extends S.Class<GetEnvironmentOutput>(
  "GetEnvironmentOutput",
)({ environment: Environment }) {}
export class UpdateEnvironmentOutput extends S.Class<UpdateEnvironmentOutput>(
  "UpdateEnvironmentOutput",
)({ environment: Environment }) {}
export class DeleteEnvironmentOutput extends S.Class<DeleteEnvironmentOutput>(
  "DeleteEnvironmentOutput",
)({ environment: S.optional(Environment) }) {}
export class ListEnvironmentsInput extends S.Class<ListEnvironmentsInput>(
  "ListEnvironmentsInput",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    environmentTemplates: S.optional(EnvironmentTemplateFilterList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnvironmentTemplate extends S.Class<EnvironmentTemplate>(
  "EnvironmentTemplate",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  recommendedVersion: S.optional(S.String),
  encryptionKey: S.optional(S.String),
  provisioning: S.optional(S.String),
}) {}
export class GetEnvironmentTemplateOutput extends S.Class<GetEnvironmentTemplateOutput>(
  "GetEnvironmentTemplateOutput",
)({ environmentTemplate: EnvironmentTemplate }) {}
export class UpdateEnvironmentTemplateOutput extends S.Class<UpdateEnvironmentTemplateOutput>(
  "UpdateEnvironmentTemplateOutput",
)({ environmentTemplate: EnvironmentTemplate }) {}
export class DeleteEnvironmentTemplateOutput extends S.Class<DeleteEnvironmentTemplateOutput>(
  "DeleteEnvironmentTemplateOutput",
)({ environmentTemplate: S.optional(EnvironmentTemplate) }) {}
export class EnvironmentTemplateVersion extends S.Class<EnvironmentTemplateVersion>(
  "EnvironmentTemplateVersion",
)({
  templateName: S.String,
  majorVersion: S.String,
  minorVersion: S.String,
  recommendedMinorVersion: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  schema: S.optional(S.String),
}) {}
export class UpdateEnvironmentTemplateVersionOutput extends S.Class<UpdateEnvironmentTemplateVersionOutput>(
  "UpdateEnvironmentTemplateVersionOutput",
)({ environmentTemplateVersion: EnvironmentTemplateVersion }) {}
export class DeleteEnvironmentTemplateVersionOutput extends S.Class<DeleteEnvironmentTemplateVersionOutput>(
  "DeleteEnvironmentTemplateVersionOutput",
)({ environmentTemplateVersion: S.optional(EnvironmentTemplateVersion) }) {}
export class Repository extends S.Class<Repository>("Repository")({
  arn: S.String,
  provider: S.String,
  name: S.String,
  connectionArn: S.String,
  encryptionKey: S.optional(S.String),
}) {}
export class GetRepositoryOutput extends S.Class<GetRepositoryOutput>(
  "GetRepositoryOutput",
)({ repository: Repository }) {}
export class DeleteRepositoryOutput extends S.Class<DeleteRepositoryOutput>(
  "DeleteRepositoryOutput",
)({ repository: S.optional(Repository) }) {}
export class ListServiceInstanceOutputsOutput extends S.Class<ListServiceInstanceOutputsOutput>(
  "ListServiceInstanceOutputsOutput",
)({ nextToken: S.optional(S.String), outputs: OutputsList }) {}
export class ListServiceInstanceProvisionedResourcesOutput extends S.Class<ListServiceInstanceProvisionedResourcesOutput>(
  "ListServiceInstanceProvisionedResourcesOutput",
)({
  nextToken: S.optional(S.String),
  provisionedResources: ProvisionedResourceList,
}) {}
export class ServiceInstance extends S.Class<ServiceInstance>(
  "ServiceInstance",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  serviceName: S.String,
  environmentName: S.String,
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  spec: S.optional(S.String),
  lastClientRequestToken: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export class CreateServiceInstanceOutput extends S.Class<CreateServiceInstanceOutput>(
  "CreateServiceInstanceOutput",
)({ serviceInstance: ServiceInstance }) {}
export class GetServiceInstanceOutput extends S.Class<GetServiceInstanceOutput>(
  "GetServiceInstanceOutput",
)({ serviceInstance: ServiceInstance }) {}
export class UpdateServiceInstanceOutput extends S.Class<UpdateServiceInstanceOutput>(
  "UpdateServiceInstanceOutput",
)({ serviceInstance: ServiceInstance }) {}
export class ListServiceInstancesInput extends S.Class<ListServiceInstancesInput>(
  "ListServiceInstancesInput",
)(
  {
    serviceName: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ListServiceInstancesFilterList),
    sortBy: S.optional(S.String),
    sortOrder: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicePipelineOutputsOutput extends S.Class<ListServicePipelineOutputsOutput>(
  "ListServicePipelineOutputsOutput",
)({ nextToken: S.optional(S.String), outputs: OutputsList }) {}
export class ListServicePipelineProvisionedResourcesOutput extends S.Class<ListServicePipelineProvisionedResourcesOutput>(
  "ListServicePipelineProvisionedResourcesOutput",
)({
  nextToken: S.optional(S.String),
  provisionedResources: ProvisionedResourceList,
}) {}
export class ServicePipeline extends S.Class<ServicePipeline>(
  "ServicePipeline",
)({
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  spec: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export class UpdateServicePipelineOutput extends S.Class<UpdateServicePipelineOutput>(
  "UpdateServicePipelineOutput",
)({ pipeline: ServicePipeline }) {}
export class Service extends S.Class<Service>("Service")({
  name: S.String,
  description: S.optional(S.String),
  arn: S.String,
  templateName: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  statusMessage: S.optional(S.String),
  spec: S.String,
  pipeline: S.optional(ServicePipeline),
  repositoryConnectionArn: S.optional(S.String),
  repositoryId: S.optional(S.String),
  branchName: S.optional(S.String),
}) {}
export class GetServiceOutput extends S.Class<GetServiceOutput>(
  "GetServiceOutput",
)({ service: S.optional(Service) }) {}
export class UpdateServiceOutput extends S.Class<UpdateServiceOutput>(
  "UpdateServiceOutput",
)({ service: Service }) {}
export class DeleteServiceOutput extends S.Class<DeleteServiceOutput>(
  "DeleteServiceOutput",
)({ service: S.optional(Service) }) {}
export class ServiceSyncConfig extends S.Class<ServiceSyncConfig>(
  "ServiceSyncConfig",
)({
  serviceName: S.String,
  repositoryProvider: S.String,
  repositoryName: S.String,
  branch: S.String,
  filePath: S.String,
}) {}
export class GetServiceSyncConfigOutput extends S.Class<GetServiceSyncConfigOutput>(
  "GetServiceSyncConfigOutput",
)({ serviceSyncConfig: S.optional(ServiceSyncConfig) }) {}
export class UpdateServiceSyncConfigOutput extends S.Class<UpdateServiceSyncConfigOutput>(
  "UpdateServiceSyncConfigOutput",
)({ serviceSyncConfig: S.optional(ServiceSyncConfig) }) {}
export class DeleteServiceSyncConfigOutput extends S.Class<DeleteServiceSyncConfigOutput>(
  "DeleteServiceSyncConfigOutput",
)({ serviceSyncConfig: S.optional(ServiceSyncConfig) }) {}
export class ServiceTemplate extends S.Class<ServiceTemplate>(
  "ServiceTemplate",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  recommendedVersion: S.optional(S.String),
  encryptionKey: S.optional(S.String),
  pipelineProvisioning: S.optional(S.String),
}) {}
export class GetServiceTemplateOutput extends S.Class<GetServiceTemplateOutput>(
  "GetServiceTemplateOutput",
)({ serviceTemplate: ServiceTemplate }) {}
export class UpdateServiceTemplateOutput extends S.Class<UpdateServiceTemplateOutput>(
  "UpdateServiceTemplateOutput",
)({ serviceTemplate: ServiceTemplate }) {}
export class DeleteServiceTemplateOutput extends S.Class<DeleteServiceTemplateOutput>(
  "DeleteServiceTemplateOutput",
)({ serviceTemplate: S.optional(ServiceTemplate) }) {}
export class S3ObjectSource extends S.Class<S3ObjectSource>("S3ObjectSource")({
  bucket: S.String,
  key: S.String,
}) {}
export const TemplateVersionSourceInput = S.Union(
  S.Struct({ s3: S3ObjectSource }),
);
export class CreateServiceTemplateVersionInput extends S.Class<CreateServiceTemplateVersionInput>(
  "CreateServiceTemplateVersionInput",
)(
  {
    clientToken: S.optional(S.String),
    templateName: S.String,
    description: S.optional(S.String),
    majorVersion: S.optional(S.String),
    source: TemplateVersionSourceInput,
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateInputList,
    tags: S.optional(TagList),
    supportedComponentSources: S.optional(
      ServiceTemplateSupportedComponentSourceInputList,
    ),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompatibleEnvironmentTemplate extends S.Class<CompatibleEnvironmentTemplate>(
  "CompatibleEnvironmentTemplate",
)({ templateName: S.String, majorVersion: S.String }) {}
export const CompatibleEnvironmentTemplateList = S.Array(
  CompatibleEnvironmentTemplate,
);
export class ServiceTemplateVersion extends S.Class<ServiceTemplateVersion>(
  "ServiceTemplateVersion",
)({
  templateName: S.String,
  majorVersion: S.String,
  minorVersion: S.String,
  recommendedMinorVersion: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateList,
  schema: S.optional(S.String),
  supportedComponentSources: S.optional(
    ServiceTemplateSupportedComponentSourceInputList,
  ),
}) {}
export class UpdateServiceTemplateVersionOutput extends S.Class<UpdateServiceTemplateVersionOutput>(
  "UpdateServiceTemplateVersionOutput",
)({ serviceTemplateVersion: ServiceTemplateVersion }) {}
export class DeleteServiceTemplateVersionOutput extends S.Class<DeleteServiceTemplateVersionOutput>(
  "DeleteServiceTemplateVersionOutput",
)({ serviceTemplateVersion: S.optional(ServiceTemplateVersion) }) {}
export class TemplateSyncConfig extends S.Class<TemplateSyncConfig>(
  "TemplateSyncConfig",
)({
  templateName: S.String,
  templateType: S.String,
  repositoryProvider: S.String,
  repositoryName: S.String,
  branch: S.String,
  subdirectory: S.optional(S.String),
}) {}
export class GetTemplateSyncConfigOutput extends S.Class<GetTemplateSyncConfigOutput>(
  "GetTemplateSyncConfigOutput",
)({ templateSyncConfig: S.optional(TemplateSyncConfig) }) {}
export class UpdateTemplateSyncConfigOutput extends S.Class<UpdateTemplateSyncConfigOutput>(
  "UpdateTemplateSyncConfigOutput",
)({ templateSyncConfig: S.optional(TemplateSyncConfig) }) {}
export class DeleteTemplateSyncConfigOutput extends S.Class<DeleteTemplateSyncConfigOutput>(
  "DeleteTemplateSyncConfigOutput",
)({ templateSyncConfig: S.optional(TemplateSyncConfig) }) {}
export class ResourceCountsSummary extends S.Class<ResourceCountsSummary>(
  "ResourceCountsSummary",
)({
  total: S.Number,
  failed: S.optional(S.Number),
  upToDate: S.optional(S.Number),
  behindMajor: S.optional(S.Number),
  behindMinor: S.optional(S.Number),
}) {}
export class SyncBlockerContext extends S.Class<SyncBlockerContext>(
  "SyncBlockerContext",
)({ key: S.String, value: S.String }) {}
export const SyncBlockerContexts = S.Array(SyncBlockerContext);
export class SyncBlocker extends S.Class<SyncBlocker>("SyncBlocker")({
  id: S.String,
  type: S.String,
  status: S.String,
  createdReason: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  contexts: S.optional(SyncBlockerContexts),
  resolvedReason: S.optional(S.String),
  resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const LatestSyncBlockers = S.Array(SyncBlocker);
export class CountsSummary extends S.Class<CountsSummary>("CountsSummary")({
  components: S.optional(ResourceCountsSummary),
  environments: S.optional(ResourceCountsSummary),
  environmentTemplates: S.optional(ResourceCountsSummary),
  serviceInstances: S.optional(ResourceCountsSummary),
  services: S.optional(ResourceCountsSummary),
  serviceTemplates: S.optional(ResourceCountsSummary),
  pipelines: S.optional(ResourceCountsSummary),
}) {}
export class RepositorySyncDefinition extends S.Class<RepositorySyncDefinition>(
  "RepositorySyncDefinition",
)({
  target: S.String,
  parent: S.String,
  branch: S.String,
  directory: S.String,
}) {}
export const RepositorySyncDefinitionList = S.Array(RepositorySyncDefinition);
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({
  pipelineServiceRoleArn: S.optional(S.String),
  pipelineProvisioningRepository: S.optional(RepositoryBranch),
  pipelineCodebuildRoleArn: S.optional(S.String),
}) {}
export class ComponentSummary extends S.Class<ComponentSummary>(
  "ComponentSummary",
)({
  name: S.String,
  arn: S.String,
  environmentName: S.String,
  serviceName: S.optional(S.String),
  serviceInstanceName: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  lastDeploymentSucceededAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export const ComponentSummaryList = S.Array(ComponentSummary);
export class DeploymentSummary extends S.Class<DeploymentSummary>(
  "DeploymentSummary",
)({
  id: S.String,
  arn: S.String,
  targetArn: S.String,
  targetResourceCreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  targetResourceType: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  environmentName: S.String,
  serviceName: S.optional(S.String),
  serviceInstanceName: S.optional(S.String),
  componentName: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
  deploymentStatus: S.String,
}) {}
export const DeploymentSummaryList = S.Array(DeploymentSummary);
export class EnvironmentAccountConnectionSummary extends S.Class<EnvironmentAccountConnectionSummary>(
  "EnvironmentAccountConnectionSummary",
)({
  id: S.String,
  arn: S.String,
  managementAccountId: S.String,
  environmentAccountId: S.String,
  roleArn: S.String,
  environmentName: S.String,
  requestedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  componentRoleArn: S.optional(S.String),
}) {}
export const EnvironmentAccountConnectionSummaryList = S.Array(
  EnvironmentAccountConnectionSummary,
);
export class EnvironmentTemplateSummary extends S.Class<EnvironmentTemplateSummary>(
  "EnvironmentTemplateSummary",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  recommendedVersion: S.optional(S.String),
  provisioning: S.optional(S.String),
}) {}
export const EnvironmentTemplateSummaryList = S.Array(
  EnvironmentTemplateSummary,
);
export class EnvironmentTemplateVersionSummary extends S.Class<EnvironmentTemplateVersionSummary>(
  "EnvironmentTemplateVersionSummary",
)({
  templateName: S.String,
  majorVersion: S.String,
  minorVersion: S.String,
  recommendedMinorVersion: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const EnvironmentTemplateVersionSummaryList = S.Array(
  EnvironmentTemplateVersionSummary,
);
export class RepositorySummary extends S.Class<RepositorySummary>(
  "RepositorySummary",
)({
  arn: S.String,
  provider: S.String,
  name: S.String,
  connectionArn: S.String,
}) {}
export const RepositorySummaryList = S.Array(RepositorySummary);
export class ServiceSummary extends S.Class<ServiceSummary>("ServiceSummary")({
  name: S.String,
  description: S.optional(S.String),
  arn: S.String,
  templateName: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  statusMessage: S.optional(S.String),
}) {}
export const ServiceSummaryList = S.Array(ServiceSummary);
export class ServiceSyncBlockerSummary extends S.Class<ServiceSyncBlockerSummary>(
  "ServiceSyncBlockerSummary",
)({
  serviceName: S.String,
  serviceInstanceName: S.optional(S.String),
  latestBlockers: S.optional(LatestSyncBlockers),
}) {}
export class ServiceTemplateSummary extends S.Class<ServiceTemplateSummary>(
  "ServiceTemplateSummary",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  displayName: S.optional(S.String),
  description: S.optional(S.String),
  recommendedVersion: S.optional(S.String),
  pipelineProvisioning: S.optional(S.String),
}) {}
export const ServiceTemplateSummaryList = S.Array(ServiceTemplateSummary);
export class ServiceTemplateVersionSummary extends S.Class<ServiceTemplateVersionSummary>(
  "ServiceTemplateVersionSummary",
)({
  templateName: S.String,
  majorVersion: S.String,
  minorVersion: S.String,
  recommendedMinorVersion: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
  description: S.optional(S.String),
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastModifiedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ServiceTemplateVersionSummaryList = S.Array(
  ServiceTemplateVersionSummary,
);
export class CancelComponentDeploymentOutput extends S.Class<CancelComponentDeploymentOutput>(
  "CancelComponentDeploymentOutput",
)({ component: Component }) {}
export class CancelEnvironmentDeploymentOutput extends S.Class<CancelEnvironmentDeploymentOutput>(
  "CancelEnvironmentDeploymentOutput",
)({ environment: Environment }) {}
export class CancelServiceInstanceDeploymentOutput extends S.Class<CancelServiceInstanceDeploymentOutput>(
  "CancelServiceInstanceDeploymentOutput",
)({ serviceInstance: ServiceInstance }) {}
export class CancelServicePipelineDeploymentOutput extends S.Class<CancelServicePipelineDeploymentOutput>(
  "CancelServicePipelineDeploymentOutput",
)({ pipeline: ServicePipeline }) {}
export class GetResourcesSummaryOutput extends S.Class<GetResourcesSummaryOutput>(
  "GetResourcesSummaryOutput",
)({ counts: CountsSummary }) {}
export class ListRepositorySyncDefinitionsOutput extends S.Class<ListRepositorySyncDefinitionsOutput>(
  "ListRepositorySyncDefinitionsOutput",
)({
  nextToken: S.optional(S.String),
  syncDefinitions: RepositorySyncDefinitionList,
}) {}
export class GetAccountSettingsOutput extends S.Class<GetAccountSettingsOutput>(
  "GetAccountSettingsOutput",
)({ accountSettings: S.optional(AccountSettings) }) {}
export class UpdateAccountSettingsOutput extends S.Class<UpdateAccountSettingsOutput>(
  "UpdateAccountSettingsOutput",
)({ accountSettings: AccountSettings }) {}
export class ListComponentProvisionedResourcesOutput extends S.Class<ListComponentProvisionedResourcesOutput>(
  "ListComponentProvisionedResourcesOutput",
)({
  nextToken: S.optional(S.String),
  provisionedResources: ProvisionedResourceList,
}) {}
export class ListComponentsOutput extends S.Class<ListComponentsOutput>(
  "ListComponentsOutput",
)({ nextToken: S.optional(S.String), components: ComponentSummaryList }) {}
export class ListDeploymentsOutput extends S.Class<ListDeploymentsOutput>(
  "ListDeploymentsOutput",
)({ nextToken: S.optional(S.String), deployments: DeploymentSummaryList }) {}
export class CreateEnvironmentAccountConnectionOutput extends S.Class<CreateEnvironmentAccountConnectionOutput>(
  "CreateEnvironmentAccountConnectionOutput",
)({ environmentAccountConnection: EnvironmentAccountConnection }) {}
export class ListEnvironmentAccountConnectionsOutput extends S.Class<ListEnvironmentAccountConnectionsOutput>(
  "ListEnvironmentAccountConnectionsOutput",
)({
  environmentAccountConnections: EnvironmentAccountConnectionSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class CreateEnvironmentTemplateOutput extends S.Class<CreateEnvironmentTemplateOutput>(
  "CreateEnvironmentTemplateOutput",
)({ environmentTemplate: EnvironmentTemplate }) {}
export class ListEnvironmentTemplatesOutput extends S.Class<ListEnvironmentTemplatesOutput>(
  "ListEnvironmentTemplatesOutput",
)({
  nextToken: S.optional(S.String),
  templates: EnvironmentTemplateSummaryList,
}) {}
export class CreateEnvironmentTemplateVersionInput extends S.Class<CreateEnvironmentTemplateVersionInput>(
  "CreateEnvironmentTemplateVersionInput",
)(
  {
    clientToken: S.optional(S.String),
    templateName: S.String,
    description: S.optional(S.String),
    majorVersion: S.optional(S.String),
    source: TemplateVersionSourceInput,
    tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEnvironmentTemplateVersionOutput extends S.Class<GetEnvironmentTemplateVersionOutput>(
  "GetEnvironmentTemplateVersionOutput",
)({ environmentTemplateVersion: EnvironmentTemplateVersion }) {}
export class ListEnvironmentTemplateVersionsOutput extends S.Class<ListEnvironmentTemplateVersionsOutput>(
  "ListEnvironmentTemplateVersionsOutput",
)({
  nextToken: S.optional(S.String),
  templateVersions: EnvironmentTemplateVersionSummaryList,
}) {}
export class CreateRepositoryOutput extends S.Class<CreateRepositoryOutput>(
  "CreateRepositoryOutput",
)({ repository: Repository }) {}
export class ListRepositoriesOutput extends S.Class<ListRepositoriesOutput>(
  "ListRepositoriesOutput",
)({ nextToken: S.optional(S.String), repositories: RepositorySummaryList }) {}
export class CreateServiceOutput extends S.Class<CreateServiceOutput>(
  "CreateServiceOutput",
)({ service: Service }) {}
export class ListServicesOutput extends S.Class<ListServicesOutput>(
  "ListServicesOutput",
)({ nextToken: S.optional(S.String), services: ServiceSummaryList }) {}
export class GetServiceSyncBlockerSummaryOutput extends S.Class<GetServiceSyncBlockerSummaryOutput>(
  "GetServiceSyncBlockerSummaryOutput",
)({ serviceSyncBlockerSummary: S.optional(ServiceSyncBlockerSummary) }) {}
export class CreateServiceSyncConfigOutput extends S.Class<CreateServiceSyncConfigOutput>(
  "CreateServiceSyncConfigOutput",
)({ serviceSyncConfig: S.optional(ServiceSyncConfig) }) {}
export class CreateServiceTemplateOutput extends S.Class<CreateServiceTemplateOutput>(
  "CreateServiceTemplateOutput",
)({ serviceTemplate: ServiceTemplate }) {}
export class ListServiceTemplatesOutput extends S.Class<ListServiceTemplatesOutput>(
  "ListServiceTemplatesOutput",
)({ nextToken: S.optional(S.String), templates: ServiceTemplateSummaryList }) {}
export class CreateServiceTemplateVersionOutput extends S.Class<CreateServiceTemplateVersionOutput>(
  "CreateServiceTemplateVersionOutput",
)({ serviceTemplateVersion: ServiceTemplateVersion }) {}
export class ListServiceTemplateVersionsOutput extends S.Class<ListServiceTemplateVersionsOutput>(
  "ListServiceTemplateVersionsOutput",
)({
  nextToken: S.optional(S.String),
  templateVersions: ServiceTemplateVersionSummaryList,
}) {}
export class CreateTemplateSyncConfigOutput extends S.Class<CreateTemplateSyncConfigOutput>(
  "CreateTemplateSyncConfigOutput",
)({ templateSyncConfig: S.optional(TemplateSyncConfig) }) {}
export class RepositorySyncEvent extends S.Class<RepositorySyncEvent>(
  "RepositorySyncEvent",
)({
  type: S.String,
  externalId: S.optional(S.String),
  time: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  event: S.String,
}) {}
export const RepositorySyncEvents = S.Array(RepositorySyncEvent);
export class RepositorySyncAttempt extends S.Class<RepositorySyncAttempt>(
  "RepositorySyncAttempt",
)({
  startedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  events: RepositorySyncEvents,
}) {}
export class EnvironmentSummary extends S.Class<EnvironmentSummary>(
  "EnvironmentSummary",
)({
  name: S.String,
  description: S.optional(S.String),
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  arn: S.String,
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  protonServiceRoleArn: S.optional(S.String),
  environmentAccountConnectionId: S.optional(S.String),
  environmentAccountId: S.optional(S.String),
  provisioning: S.optional(S.String),
  componentRoleArn: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export class ServiceInstanceSummary extends S.Class<ServiceInstanceSummary>(
  "ServiceInstanceSummary",
)({
  name: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentAttemptedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  lastDeploymentSucceededAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  serviceName: S.String,
  environmentName: S.String,
  templateName: S.String,
  templateMajorVersion: S.String,
  templateMinorVersion: S.String,
  deploymentStatus: S.String,
  deploymentStatusMessage: S.optional(S.String),
  lastAttemptedDeploymentId: S.optional(S.String),
  lastSucceededDeploymentId: S.optional(S.String),
}) {}
export const ServiceInstanceSummaryList = S.Array(ServiceInstanceSummary);
export class GetRepositorySyncStatusOutput extends S.Class<GetRepositorySyncStatusOutput>(
  "GetRepositorySyncStatusOutput",
)({ latestSync: S.optional(RepositorySyncAttempt) }) {}
export class GetServiceInstanceSyncStatusOutput extends S.Class<GetServiceInstanceSyncStatusOutput>(
  "GetServiceInstanceSyncStatusOutput",
)({
  latestSync: S.optional(ResourceSyncAttempt),
  latestSuccessfulSync: S.optional(ResourceSyncAttempt),
  desiredState: S.optional(Revision),
}) {}
export class ListEnvironmentsOutput extends S.Class<ListEnvironmentsOutput>(
  "ListEnvironmentsOutput",
)({ nextToken: S.optional(S.String), environments: EnvironmentSummaryList }) {}
export class CreateEnvironmentTemplateVersionOutput extends S.Class<CreateEnvironmentTemplateVersionOutput>(
  "CreateEnvironmentTemplateVersionOutput",
)({ environmentTemplateVersion: EnvironmentTemplateVersion }) {}
export class ListServiceInstancesOutput extends S.Class<ListServiceInstancesOutput>(
  "ListServiceInstancesOutput",
)({
  nextToken: S.optional(S.String),
  serviceInstances: ServiceInstanceSummaryList,
}) {}
export class UpdateServiceSyncBlockerOutput extends S.Class<UpdateServiceSyncBlockerOutput>(
  "UpdateServiceSyncBlockerOutput",
)({
  serviceName: S.String,
  serviceInstanceName: S.optional(S.String),
  serviceSyncBlocker: SyncBlocker,
}) {}
export class GetServiceTemplateVersionOutput extends S.Class<GetServiceTemplateVersionOutput>(
  "GetServiceTemplateVersionOutput",
)({ serviceTemplateVersion: ServiceTemplateVersion }) {}
export class GetDeploymentOutput extends S.Class<GetDeploymentOutput>(
  "GetDeploymentOutput",
)({ deployment: S.optional(Deployment) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * List components with summary data. You can filter the result list by environment, service, or a single service instance.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListComponentsInput,
    output: ListComponentsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "components",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get detailed data for a deployment.
 */
export const getDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeploymentInput,
  output: GetDeploymentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment
 * account from a management account.
 *
 * An environment account connection is a secure bi-directional connection between a *management account* and an environment
 * account that maintains authorization and permissions. For more information, see Environment account connections in the Proton User
 * guide.
 */
export const createEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateEnvironmentAccountConnectionInput,
    output: CreateEnvironmentAccountConnectionOutput,
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
 * List environments with detail data summaries.
 */
export const listEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEnvironmentsInput,
    output: ListEnvironmentsOutput,
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
      items: "environments",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Create a new major or minor version of an environment template. A major version of an environment template is a version that
 * *isn't* backwards compatible. A minor version of an environment template is a version that's backwards compatible within its major
 * version.
 */
export const createEnvironmentTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateEnvironmentTemplateVersionInput,
    output: CreateEnvironmentTemplateVersionOutput,
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
 * List service instances with summary data. This action lists service instances of all
 * services in the Amazon Web Services account.
 */
export const listServiceInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceInstancesInput,
    output: ListServiceInstancesOutput,
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
      items: "serviceInstances",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Update the service sync blocker by resolving it.
 */
export const updateServiceSyncBlocker = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceSyncBlockerInput,
    output: UpdateServiceSyncBlockerOutput,
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
 * Get detailed data for a major or minor version of a service template.
 */
export const getServiceTemplateVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServiceTemplateVersionInput,
    output: GetServiceTemplateVersionOutput,
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
 * List provisioned resources for a component with details.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponentProvisionedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListComponentProvisionedResourcesInput,
    output: ListComponentProvisionedResourcesOutput,
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
      items: "provisionedResources",
    } as const,
  }));
/**
 * List deployments. You can filter the result list by environment, service, or a single service instance.
 */
export const listDeployments = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDeploymentsInput,
    output: ListDeploymentsOutput,
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
 * Get detailed data for a major or minor version of an environment template.
 */
export const getEnvironmentTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEnvironmentTemplateVersionInput,
    output: GetEnvironmentTemplateVersionOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List major or minor versions of an environment template with detail data.
 */
export const listEnvironmentTemplateVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentTemplateVersionsInput,
    output: ListEnvironmentTemplateVersionsOutput,
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
      items: "templateVersions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List linked repositories with detail data.
 */
export const listRepositories = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListRepositoriesInput,
    output: ListRepositoriesOutput,
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
      items: "repositories",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Create an Proton service. An Proton service is an instantiation of a service
 * template and often includes several service instances and pipeline. For more information, see
 * Services
 * in the *Proton User Guide*.
 */
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceInput,
  output: CreateServiceOutput,
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
 * Get detailed data for the service sync blocker summary.
 */
export const getServiceSyncBlockerSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceSyncBlockerSummaryInput,
    output: GetServiceSyncBlockerSummaryOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Create a new major or minor version of a service template. A major version of a service
 * template is a version that *isn't* backward compatible. A minor version of
 * a service template is a version that's backward compatible within its major version.
 */
export const createServiceTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateServiceTemplateVersionInput,
    output: CreateServiceTemplateVersionOutput,
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
 * List major or minor versions of a service template with detail data.
 */
export const listServiceTemplateVersions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceTemplateVersionsInput,
    output: ListServiceTemplateVersionsOutput,
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
      items: "templateVersions",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Create an Proton component. A component is an infrastructure extension for a service instance.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const createComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentInput,
  output: CreateComponentOutput,
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
 * Update a component.
 *
 * There are a few modes for updating a component. The `deploymentType` field defines the mode.
 *
 * You can't update a component while its deployment status, or the deployment status of a service instance attached to it, is
 * `IN_PROGRESS`.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentInput,
  output: UpdateComponentOutput,
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
 * Delete an Proton component resource.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const deleteComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentInput,
  output: DeleteComponentOutput,
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
 * In an environment account, update an environment account connection to use a new IAM role.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const updateEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEnvironmentAccountConnectionInput,
    output: UpdateEnvironmentAccountConnectionOutput,
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
 * In an environment account, delete an environment account connection.
 *
 * After you delete an environment account connection that’s in use by an Proton environment, Proton *can’t* manage the
 * environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're
 * responsible for cleaning up provisioned resources that remain without an environment connection.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const deleteEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEnvironmentAccountConnectionInput,
    output: DeleteEnvironmentAccountConnectionOutput,
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
 * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, Proton
 * can use the associated IAM role to provision environment infrastructure resources in the associated environment account.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const acceptEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AcceptEnvironmentAccountConnectionInput,
    output: AcceptEnvironmentAccountConnectionOutput,
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
 * In a management account, reject an environment account connection from another environment account.
 *
 * After you reject an environment account connection request, you *can't* accept or use the rejected environment account
 * connection.
 *
 * You *can’t* reject an environment account connection that's connected to an environment.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const rejectEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RejectEnvironmentAccountConnectionInput,
    output: RejectEnvironmentAccountConnectionOutput,
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
 * Deploy a new environment. An Proton environment is created from an environment template that defines infrastructure and resources that can be
 * shared across services.
 *
 * **You can provision environments using the following methods:**
 *
 * - Amazon Web Services-managed provisioning: Proton makes direct calls to provision your resources.
 *
 * - Self-managed provisioning: Proton makes pull requests on your repository to provide compiled infrastructure as code (IaC) files that your IaC
 * engine uses to provision resources.
 *
 * For more information, see Environments and Provisioning methods in the Proton User
 * Guide.
 */
export const createEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEnvironmentInput,
  output: CreateEnvironmentOutput,
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
 * Update an environment.
 *
 * If the environment is associated with an environment account connection, *don't* update or include the
 * `protonServiceRoleArn` and `provisioningRepository` parameter to update or connect to an environment account connection.
 *
 * You can only update to a new environment account connection if that connection was created in the same environment account that the current
 * environment account connection was created in. The account connection must also be associated with the current environment.
 *
 * If the environment *isn't* associated with an environment account connection, *don't* update or include the
 * `environmentAccountConnectionId` parameter. You *can't* update or connect the environment to an environment account
 * connection if it *isn't* already associated with an environment connection.
 *
 * You can update either the `environmentAccountConnectionId` or `protonServiceRoleArn` parameter and value. You can’t update
 * both.
 *
 * If the environment was configured for Amazon Web Services-managed provisioning, omit the `provisioningRepository` parameter.
 *
 * If the environment was configured for self-managed provisioning, specify the `provisioningRepository` parameter and omit the
 * `protonServiceRoleArn` and `environmentAccountConnectionId` parameters.
 *
 * For more information, see Environments and Provisioning methods in the Proton User
 * Guide.
 *
 * There are four modes for updating an environment. The `deploymentType` field defines the mode.
 *
 * `NONE`
 *
 * In this mode, a deployment *doesn't* occur. Only the requested metadata parameters are updated.
 *
 * `CURRENT_VERSION`
 *
 * In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated.
 * *Don’t* include minor or major version parameters when you use this `deployment-type`.
 *
 * `MINOR_VERSION`
 *
 * In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in
 * use, by default. You can also specify a different minor version of the current major version in use.
 *
 * `MAJOR_VERSION`
 *
 * In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template,
 * by default. You can also specify a different major version that's higher than the major version in use and a minor version.
 */
export const updateEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnvironmentInput,
  output: UpdateEnvironmentOutput,
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
 * Delete an environment.
 */
export const deleteEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEnvironmentInput,
  output: DeleteEnvironmentOutput,
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
 * Update an environment template.
 */
export const updateEnvironmentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnvironmentTemplateInput,
    output: UpdateEnvironmentTemplateOutput,
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
 * If no other major or minor versions of an environment template exist, delete the environment template.
 */
export const deleteEnvironmentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteEnvironmentTemplateInput,
    output: DeleteEnvironmentTemplateOutput,
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
 * Update a major or minor version of an environment template.
 */
export const updateEnvironmentTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEnvironmentTemplateVersionInput,
    output: UpdateEnvironmentTemplateVersionOutput,
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
 * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the
 * `Recommended` version. Delete the `Recommended` version of the environment template if no other major versions or minor versions
 * of the environment template exist. A major version of an environment template is a version that's not backward compatible.
 *
 * Delete a minor version of an environment template if it *isn't* the `Recommended` version. Delete a
 * `Recommended` minor version of the environment template if no other minor versions of the environment template exist. A minor version of an
 * environment template is a version that's backward compatible.
 */
export const deleteEnvironmentTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEnvironmentTemplateVersionInput,
    output: DeleteEnvironmentTemplateVersionOutput,
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
 * De-register and unlink your repository.
 */
export const deleteRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRepositoryInput,
  output: DeleteRepositoryOutput,
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
 * Create a service instance.
 */
export const createServiceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceInstanceInput,
    output: CreateServiceInstanceOutput,
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
 * Update a service instance.
 *
 * There are a few modes for updating a service instance. The `deploymentType`
 * field defines the mode.
 *
 * You can't update a service instance while its deployment status, or the deployment
 * status of a component attached to it, is `IN_PROGRESS`.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateServiceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceInstanceInput,
    output: UpdateServiceInstanceOutput,
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
 * Update the service pipeline.
 *
 * There are four modes for updating a service pipeline. The `deploymentType`
 * field defines the mode.
 *
 * `NONE`
 *
 * In this mode, a deployment *doesn't* occur. Only the requested
 * metadata parameters are updated.
 *
 * `CURRENT_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the new spec that
 * you provide. Only requested parameters are updated. *Don’t* include
 * major or minor version parameters when you use this `deployment-type`.
 *
 * `MINOR_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the published,
 * recommended (latest) minor version of the current major version in use, by default. You
 * can specify a different minor version of the current major version in use.
 *
 * `MAJOR_VERSION`
 *
 * In this mode, the service pipeline is deployed and updated with the published,
 * recommended (latest) major and minor version of the current template by default. You can
 * specify a different major version that's higher than the major version in use and a
 * minor version.
 */
export const updateServicePipeline = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServicePipelineInput,
    output: UpdateServicePipelineOutput,
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
 * Edit a service description or use a spec to add and delete service instances.
 *
 * Existing service instances and the service pipeline *can't* be edited
 * using this API. They can only be deleted.
 *
 * Use the `description` parameter to modify the description.
 *
 * Edit the `spec` parameter to add or delete instances.
 *
 * You can't delete a service instance (remove it from the spec) if it has an attached
 * component.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const updateService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceInput,
  output: UpdateServiceOutput,
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
 * Delete a service, with its instances and pipeline.
 *
 * You can't delete a service if it has any service instances that have components attached
 * to them.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceInput,
  output: DeleteServiceOutput,
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
 * Update the Proton Ops config file.
 */
export const updateServiceSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceSyncConfigInput,
    output: UpdateServiceSyncConfigOutput,
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
 * Delete the Proton Ops file.
 */
export const deleteServiceSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceSyncConfigInput,
    output: DeleteServiceSyncConfigOutput,
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
 * Update a service template.
 */
export const updateServiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceTemplateInput,
    output: UpdateServiceTemplateOutput,
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
 * If no other major or minor versions of the service template exist, delete the service
 * template.
 */
export const deleteServiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteServiceTemplateInput,
    output: DeleteServiceTemplateOutput,
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
 * Update a major or minor version of a service template.
 */
export const updateServiceTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateServiceTemplateVersionInput,
    output: UpdateServiceTemplateVersionOutput,
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
 * If no other minor versions of a service template exist, delete a major version of the
 * service template if it's not the `Recommended` version. Delete the
 * `Recommended` version of the service template if no other major versions or minor
 * versions of the service template exist. A major version of a service template is a version
 * that *isn't* backwards compatible.
 *
 * Delete a minor version of a service template if it's not the `Recommended`
 * version. Delete a `Recommended` minor version of the service template if no other
 * minor versions of the service template exist. A minor version of a service template is a
 * version that's backwards compatible.
 */
export const deleteServiceTemplateVersion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteServiceTemplateVersionInput,
    output: DeleteServiceTemplateVersionOutput,
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
 * Update template sync configuration parameters, except for the `templateName` and `templateType`. Repository details
 * (branch, name, and provider) should be of a linked repository. A linked repository is a repository that has been registered with Proton. For
 * more information, see CreateRepository.
 */
export const updateTemplateSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTemplateSyncConfigInput,
    output: UpdateTemplateSyncConfigOutput,
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
 * Delete a template sync configuration.
 */
export const deleteTemplateSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTemplateSyncConfigInput,
    output: DeleteTemplateSyncConfigOutput,
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
 * Notify Proton of status changes to a provisioned resource when you use self-managed provisioning.
 *
 * For more information, see Self-managed provisioning in the *Proton User Guide*.
 */
export const notifyResourceDeploymentStatusChange =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: NotifyResourceDeploymentStatusChangeInput,
    output: NotifyResourceDeploymentStatusChangeOutput,
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
 * Tag a resource. A tag is a key-value pair of metadata that you associate with an Proton resource.
 *
 * For more information, see Proton resources and tagging in
 * the *Proton User Guide*.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
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
 * Attempts to cancel a component deployment (for a component that is in the `IN_PROGRESS` deployment status).
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const cancelComponentDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelComponentDeploymentInput,
    output: CancelComponentDeploymentOutput,
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
 * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is `IN_PROGRESS`. For more
 * information, see Update an environment in the Proton
 * User guide.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is `FAILED`.
 *
 * - If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is
 * `SUCCEEDED` and the cancellation attempt has no effect.
 */
export const cancelEnvironmentDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelEnvironmentDeploymentInput,
    output: CancelEnvironmentDeploymentOutput,
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
 * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is `IN_PROGRESS`. For
 * more information, see Update a service instance
 * in the *Proton User guide*.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is
 * `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is
 * `FAILED`.
 *
 * - If the current UpdateServiceInstance action succeeds before the
 * cancellation attempt starts, the resulting deployment state is `SUCCEEDED` and
 * the cancellation attempt has no effect.
 */
export const cancelServiceInstanceDeployment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelServiceInstanceDeploymentInput,
    output: CancelServiceInstanceDeploymentOutput,
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
 * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is `IN_PROGRESS`. For
 * more information, see Update a service pipeline
 * in the *Proton User guide*.
 *
 * The following list includes potential cancellation scenarios.
 *
 * - If the cancellation attempt succeeds, the resulting deployment state is
 * `CANCELLED`.
 *
 * - If the cancellation attempt fails, the resulting deployment state is
 * `FAILED`.
 *
 * - If the current UpdateServicePipeline action succeeds before the
 * cancellation attempt starts, the resulting deployment state is `SUCCEEDED` and
 * the cancellation attempt has no effect.
 */
export const cancelServicePipelineDeployment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelServicePipelineDeploymentInput,
    output: CancelServicePipelineDeploymentOutput,
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
 * Get detailed data for a component.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const getComponent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComponentInput,
  output: GetComponentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete the deployment.
 */
export const deleteDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDeploymentInput,
  output: DeleteDeploymentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * In an environment account, get the detailed data for an environment account connection.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const getEnvironmentAccountConnection =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEnvironmentAccountConnectionInput,
    output: GetEnvironmentAccountConnectionOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List the infrastructure as code outputs for your environment.
 */
export const listEnvironmentOutputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentOutputsInput,
    output: ListEnvironmentOutputsOutput,
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
      items: "outputs",
    } as const,
  }));
/**
 * List the provisioned resources for your environment.
 */
export const listEnvironmentProvisionedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentProvisionedResourcesInput,
    output: ListEnvironmentProvisionedResourcesOutput,
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
      items: "provisionedResources",
    } as const,
  }));
/**
 * Get detailed data for an environment.
 */
export const getEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnvironmentInput,
  output: GetEnvironmentOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed data for an environment template.
 */
export const getEnvironmentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEnvironmentTemplateInput,
    output: GetEnvironmentTemplateOutput,
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
 * Get detail data for a linked repository.
 */
export const getRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRepositoryInput,
  output: GetRepositoryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list service of instance Infrastructure as Code (IaC) outputs.
 */
export const listServiceInstanceOutputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceInstanceOutputsInput,
    output: ListServiceInstanceOutputsOutput,
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
      items: "outputs",
    } as const,
  }));
/**
 * List provisioned resources for a service instance with details.
 */
export const listServiceInstanceProvisionedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceInstanceProvisionedResourcesInput,
    output: ListServiceInstanceProvisionedResourcesOutput,
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
      items: "provisionedResources",
    } as const,
  }));
/**
 * Get detailed data for a service instance. A service instance is an instantiation of
 * service template and it runs in a specific environment.
 */
export const getServiceInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInstanceInput,
  output: GetServiceInstanceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get a list of service pipeline Infrastructure as Code (IaC) outputs.
 */
export const listServicePipelineOutputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServicePipelineOutputsInput,
    output: ListServicePipelineOutputsOutput,
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
      items: "outputs",
    } as const,
  }));
/**
 * List provisioned resources for a service and pipeline with details.
 */
export const listServicePipelineProvisionedResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServicePipelineProvisionedResourcesInput,
    output: ListServicePipelineProvisionedResourcesOutput,
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
      items: "provisionedResources",
    } as const,
  }));
/**
 * Get detailed data for a service.
 */
export const getService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceInput,
  output: GetServiceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detailed information for the service sync configuration.
 */
export const getServiceSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetServiceSyncConfigInput,
    output: GetServiceSyncConfigOutput,
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
 * Get detailed data for a service template.
 */
export const getServiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServiceTemplateInput,
  output: GetServiceTemplateOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get detail data for a template sync configuration.
 */
export const getTemplateSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTemplateSyncConfigInput,
    output: GetTemplateSyncConfigOutput,
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
 * Get the status of a template sync.
 */
export const getTemplateSyncStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetTemplateSyncStatusInput,
    output: GetTemplateSyncStatusOutput,
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
 * List tags for a resource. For more information, see Proton
 * resources and tagging in the *Proton User Guide*.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceInput,
    output: ListTagsForResourceOutput,
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
      items: "tags",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Remove a customer tag from a resource. A tag is a key-value pair of metadata associated with an Proton resource.
 *
 * For more information, see Proton resources and tagging in
 * the *Proton User Guide*.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
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
 * Get detail data for Proton account-wide settings.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsInput,
  output: GetAccountSettingsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the sync status of a repository used for Proton template sync. For more information about template sync, see .
 *
 * A repository sync status isn't tied to the Proton Repository resource (or any other Proton resource). Therefore, tags on an Proton Repository resource
 * have no effect on this action. Specifically, you can't use these tags to control access to this action using Attribute-based access control
 * (ABAC).
 *
 * For more information about ABAC, see ABAC in the Proton User
 * Guide.
 */
export const getRepositorySyncStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetRepositorySyncStatusInput,
    output: GetRepositorySyncStatusOutput,
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
 * Get the status of the synced service instance.
 */
export const getServiceInstanceSyncStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetServiceInstanceSyncStatusInput,
    output: GetServiceInstanceSyncStatusOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * View a list of environment account connections.
 *
 * For more information, see Environment account
 * connections in the *Proton User guide*.
 */
export const listEnvironmentAccountConnections =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentAccountConnectionsInput,
    output: ListEnvironmentAccountConnectionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "environmentAccountConnections",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List environment templates.
 */
export const listEnvironmentTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListEnvironmentTemplatesInput,
    output: ListEnvironmentTemplatesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "templates",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List services with summaries of detail data.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServicesInput,
    output: ListServicesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "services",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List service templates with detail data.
 */
export const listServiceTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListServiceTemplatesInput,
    output: ListServiceTemplatesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "templates",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Get counts of Proton resources.
 *
 * For infrastructure-provisioning resources (environments, services, service instances, pipelines), the action returns staleness counts. A
 * resource is stale when it's behind the recommended version of the Proton template that it uses and it needs an update to become current.
 *
 * The action returns staleness counts (counts of resources that are up-to-date, behind a template major version, or behind a template minor
 * version), the total number of resources, and the number of resources that are in a failed state, grouped by resource type. Components,
 * environments, and service templates return less information - see the `components`, `environments`, and
 * `serviceTemplates` field descriptions.
 *
 * For context, the action also returns the total number of each type of Proton template in the Amazon Web Services account.
 *
 * For more information, see Proton dashboard in the
 * *Proton User Guide*.
 */
export const getResourcesSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcesSummaryInput,
  output: GetResourcesSummaryOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List repository sync definitions with detail data.
 */
export const listRepositorySyncDefinitions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRepositorySyncDefinitionsInput,
    output: ListRepositorySyncDefinitionsOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "syncDefinitions",
    } as const,
  }));
/**
 * Update Proton settings that are used for multiple services in the Amazon Web Services account.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsInput,
    output: UpdateAccountSettingsOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Get a list of component Infrastructure as Code (IaC) outputs.
 *
 * For more information about components, see
 * Proton components in the
 * *Proton User Guide*.
 */
export const listComponentOutputs =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListComponentOutputsInput,
    output: ListComponentOutputsOutput,
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
      items: "outputs",
    } as const,
  }));
/**
 * Create an environment template for Proton. For more information, see Environment Templates in the *Proton User Guide*.
 *
 * You can create an environment template in one of the two following ways:
 *
 * - Register and publish a *standard* environment template that instructs Proton to deploy and manage environment
 * infrastructure.
 *
 * - Register and publish a *customer managed* environment template that connects Proton to your existing provisioned
 * infrastructure that you manage. Proton *doesn't* manage your existing provisioned infrastructure. To create an environment
 * template for customer provisioned and managed infrastructure, include the `provisioning` parameter and set the value to
 * `CUSTOMER_MANAGED`. For more information, see Register
 * and publish an environment template in the *Proton User Guide*.
 */
export const createEnvironmentTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateEnvironmentTemplateInput,
    output: CreateEnvironmentTemplateOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Create and register a link to a repository. Proton uses the link to repeatedly access the repository, to either push to it (self-managed
 * provisioning) or pull from it (template sync). You can share a linked repository across multiple resources (like environments using self-managed
 * provisioning, or synced templates). When you create a repository link, Proton creates a service-linked role for you.
 *
 * For more information, see Self-managed provisioning, Template bundles, and
 * Template sync configurations in the Proton
 * User Guide.
 */
export const createRepository = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRepositoryInput,
  output: CreateRepositoryOutput,
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
 * Create the Proton Ops configuration file.
 */
export const createServiceSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceSyncConfigInput,
    output: CreateServiceSyncConfigOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Create a service template. The administrator creates a service template to define
 * standardized infrastructure and an optional CI/CD service pipeline. Developers, in turn,
 * select the service template from Proton. If the selected service template includes a
 * service pipeline definition, they provide a link to their source code repository. Proton
 * then deploys and manages the infrastructure defined by the selected service template. For more
 * information, see Proton templates in the *Proton User Guide*.
 */
export const createServiceTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateServiceTemplateInput,
    output: CreateServiceTemplateOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Set up a template to create new template versions automatically by tracking a linked repository. A linked repository is a repository that has
 * been registered with Proton. For more information, see CreateRepository.
 *
 * When a commit is pushed to your linked repository, Proton checks for changes to your repository template bundles. If it detects a template
 * bundle change, a new major or minor version of its template is created, if the version doesn’t already exist. For more information, see Template sync configurations in the Proton
 * User Guide.
 */
export const createTemplateSyncConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTemplateSyncConfigInput,
    output: CreateTemplateSyncConfigOutput,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
