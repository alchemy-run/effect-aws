import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://amplify.amazonaws.com");
const svc = T.AwsApiService({ sdkId: "Amplify", serviceShapeName: "Amplify" });
const auth = T.AwsAuthSigv4({ name: "amplify" });
const ver = T.ServiceVersion("2017-07-25");
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
                        url: "https://amplify-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://amplify-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://amplify.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://amplify.{Region}.{PartitionResult#dnsSuffix}",
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
export const AutoBranchCreationPatterns = S.Array(S.String);
export const AutoSubDomainCreationPatterns = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CreateBackendEnvironmentRequest extends S.Class<CreateBackendEnvironmentRequest>(
  "CreateBackendEnvironmentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String,
    stackName: S.optional(S.String),
    deploymentArtifacts: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/backendenvironments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateWebhookRequest extends S.Class<CreateWebhookRequest>(
  "CreateWebhookRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String,
    description: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/webhooks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteAppRequest extends S.Class<DeleteAppRequest>(
  "DeleteAppRequest",
)(
  { appId: S.String.pipe(T.HttpLabel("appId")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/apps/{appId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackendEnvironmentRequest extends S.Class<DeleteBackendEnvironmentRequest>(
  "DeleteBackendEnvironmentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/apps/{appId}/backendenvironments/{environmentName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBranchRequest extends S.Class<DeleteBranchRequest>(
  "DeleteBranchRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/apps/{appId}/branches/{branchName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteDomainAssociationRequest extends S.Class<DeleteDomainAssociationRequest>(
  "DeleteDomainAssociationRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
  },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/apps/{appId}/domains/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/apps/{appId}/branches/{branchName}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWebhookRequest extends S.Class<DeleteWebhookRequest>(
  "DeleteWebhookRequest",
)(
  { webhookId: S.String.pipe(T.HttpLabel("webhookId")) },
  T.all(
    ns,
    T.Http({ method: "DELETE", uri: "/webhooks/{webhookId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateAccessLogsRequest extends S.Class<GenerateAccessLogsRequest>(
  "GenerateAccessLogsRequest",
)(
  {
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    domainName: S.String,
    appId: S.String.pipe(T.HttpLabel("appId")),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/accesslogs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAppRequest extends S.Class<GetAppRequest>("GetAppRequest")(
  { appId: S.String.pipe(T.HttpLabel("appId")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetArtifactUrlRequest extends S.Class<GetArtifactUrlRequest>(
  "GetArtifactUrlRequest",
)(
  { artifactId: S.String.pipe(T.HttpLabel("artifactId")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/artifacts/{artifactId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBackendEnvironmentRequest extends S.Class<GetBackendEnvironmentRequest>(
  "GetBackendEnvironmentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/apps/{appId}/backendenvironments/{environmentName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetBranchRequest extends S.Class<GetBranchRequest>(
  "GetBranchRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/branches/{branchName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDomainAssociationRequest extends S.Class<GetDomainAssociationRequest>(
  "GetDomainAssociationRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/domains/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/apps/{appId}/branches/{branchName}/jobs/{jobId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetWebhookRequest extends S.Class<GetWebhookRequest>(
  "GetWebhookRequest",
)(
  { webhookId: S.String.pipe(T.HttpLabel("webhookId")) },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/webhooks/{webhookId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAppsRequest extends S.Class<ListAppsRequest>(
  "ListAppsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListArtifactsRequest extends S.Class<ListArtifactsRequest>(
  "ListArtifactsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({
      method: "GET",
      uri: "/apps/{appId}/branches/{branchName}/jobs/{jobId}/artifacts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBackendEnvironmentsRequest extends S.Class<ListBackendEnvironmentsRequest>(
  "ListBackendEnvironmentsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.optional(S.String).pipe(T.HttpQuery("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/backendenvironments" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListBranchesRequest extends S.Class<ListBranchesRequest>(
  "ListBranchesRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/branches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDomainAssociationsRequest extends S.Class<ListDomainAssociationsRequest>(
  "ListDomainAssociationsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/branches/{branchName}/jobs" }),
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
    ns,
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWebhooksRequest extends S.Class<ListWebhooksRequest>(
  "ListWebhooksRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    ns,
    T.Http({ method: "GET", uri: "/apps/{appId}/webhooks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDeploymentRequest extends S.Class<StartDeploymentRequest>(
  "StartDeploymentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.optional(S.String),
    sourceUrl: S.optional(S.String),
    sourceUrlType: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/apps/{appId}/branches/{branchName}/deployments/start",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartJobRequest extends S.Class<StartJobRequest>(
  "StartJobRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.optional(S.String),
    jobType: S.String,
    jobReason: S.optional(S.String),
    commitId: S.optional(S.String),
    commitMessage: S.optional(S.String),
    commitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/branches/{branchName}/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopJobRequest extends S.Class<StopJobRequest>("StopJobRequest")(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  },
  T.all(
    ns,
    T.Http({
      method: "DELETE",
      uri: "/apps/{appId}/branches/{branchName}/jobs/{jobId}/stop",
    }),
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
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    ns,
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
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    ns,
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
)({}, ns) {}
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export class CustomRule extends S.Class<CustomRule>("CustomRule")({
  source: S.String,
  target: S.String,
  status: S.optional(S.String),
  condition: S.optional(S.String),
}) {}
export const CustomRules = S.Array(CustomRule);
export class AutoBranchCreationConfig extends S.Class<AutoBranchCreationConfig>(
  "AutoBranchCreationConfig",
)({
  stage: S.optional(S.String),
  framework: S.optional(S.String),
  enableAutoBuild: S.optional(S.Boolean),
  environmentVariables: S.optional(EnvironmentVariables),
  basicAuthCredentials: S.optional(S.String),
  enableBasicAuth: S.optional(S.Boolean),
  enablePerformanceMode: S.optional(S.Boolean),
  buildSpec: S.optional(S.String),
  enablePullRequestPreview: S.optional(S.Boolean),
  pullRequestEnvironmentName: S.optional(S.String),
}) {}
export class JobConfig extends S.Class<JobConfig>("JobConfig")({
  buildComputeType: S.String,
}) {}
export class CacheConfig extends S.Class<CacheConfig>("CacheConfig")({
  type: S.String,
}) {}
export class UpdateAppRequest extends S.Class<UpdateAppRequest>(
  "UpdateAppRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    platform: S.optional(S.String),
    computeRoleArn: S.optional(S.String),
    iamServiceRoleArn: S.optional(S.String),
    environmentVariables: S.optional(EnvironmentVariables),
    enableBranchAutoBuild: S.optional(S.Boolean),
    enableBranchAutoDeletion: S.optional(S.Boolean),
    enableBasicAuth: S.optional(S.Boolean),
    basicAuthCredentials: S.optional(S.String),
    customRules: S.optional(CustomRules),
    buildSpec: S.optional(S.String),
    customHeaders: S.optional(S.String),
    enableAutoBranchCreation: S.optional(S.Boolean),
    autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
    autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
    repository: S.optional(S.String),
    oauthToken: S.optional(S.String),
    accessToken: S.optional(S.String),
    jobConfig: S.optional(JobConfig),
    cacheConfig: S.optional(CacheConfig),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Backend extends S.Class<Backend>("Backend")({
  stackArn: S.optional(S.String),
}) {}
export class UpdateBranchRequest extends S.Class<UpdateBranchRequest>(
  "UpdateBranchRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    description: S.optional(S.String),
    framework: S.optional(S.String),
    stage: S.optional(S.String),
    enableNotification: S.optional(S.Boolean),
    enableAutoBuild: S.optional(S.Boolean),
    enableSkewProtection: S.optional(S.Boolean),
    environmentVariables: S.optional(EnvironmentVariables),
    basicAuthCredentials: S.optional(S.String),
    enableBasicAuth: S.optional(S.Boolean),
    enablePerformanceMode: S.optional(S.Boolean),
    buildSpec: S.optional(S.String),
    ttl: S.optional(S.String),
    displayName: S.optional(S.String),
    enablePullRequestPreview: S.optional(S.Boolean),
    pullRequestEnvironmentName: S.optional(S.String),
    backendEnvironmentArn: S.optional(S.String),
    backend: S.optional(Backend),
    computeRoleArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/branches/{branchName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SubDomainSetting extends S.Class<SubDomainSetting>(
  "SubDomainSetting",
)({ prefix: S.String, branchName: S.String }) {}
export const SubDomainSettings = S.Array(SubDomainSetting);
export class CertificateSettings extends S.Class<CertificateSettings>(
  "CertificateSettings",
)({ type: S.String, customCertificateArn: S.optional(S.String) }) {}
export class UpdateDomainAssociationRequest extends S.Class<UpdateDomainAssociationRequest>(
  "UpdateDomainAssociationRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    enableAutoSubDomain: S.optional(S.Boolean),
    subDomainSettings: S.optional(SubDomainSettings),
    autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
    autoSubDomainIAMRole: S.optional(S.String),
    certificateSettings: S.optional(CertificateSettings),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/domains/{domainName}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWebhookRequest extends S.Class<UpdateWebhookRequest>(
  "UpdateWebhookRequest",
)(
  {
    webhookId: S.String.pipe(T.HttpLabel("webhookId")),
    branchName: S.optional(S.String),
    description: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/webhooks/{webhookId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const FileMap = S.Record({ key: S.String, value: S.String });
export class ProductionBranch extends S.Class<ProductionBranch>(
  "ProductionBranch",
)({
  lastDeployTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  status: S.optional(S.String),
  thumbnailUrl: S.optional(S.String),
  branchName: S.optional(S.String),
}) {}
export class WafConfiguration extends S.Class<WafConfiguration>(
  "WafConfiguration",
)({
  webAclArn: S.optional(S.String),
  wafStatus: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export class App extends S.Class<App>("App")({
  appId: S.String,
  appArn: S.String,
  name: S.String,
  tags: S.optional(TagMap),
  description: S.String,
  repository: S.String,
  platform: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  computeRoleArn: S.optional(S.String),
  iamServiceRoleArn: S.optional(S.String),
  environmentVariables: EnvironmentVariables,
  defaultDomain: S.String,
  enableBranchAutoBuild: S.Boolean,
  enableBranchAutoDeletion: S.optional(S.Boolean),
  enableBasicAuth: S.Boolean,
  basicAuthCredentials: S.optional(S.String),
  customRules: S.optional(CustomRules),
  productionBranch: S.optional(ProductionBranch),
  buildSpec: S.optional(S.String),
  customHeaders: S.optional(S.String),
  enableAutoBranchCreation: S.optional(S.Boolean),
  autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
  autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
  repositoryCloneMethod: S.optional(S.String),
  cacheConfig: S.optional(CacheConfig),
  webhookCreateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  wafConfiguration: S.optional(WafConfiguration),
  jobConfig: S.optional(JobConfig),
}) {}
export const Apps = S.Array(App);
export class BackendEnvironment extends S.Class<BackendEnvironment>(
  "BackendEnvironment",
)({
  backendEnvironmentArn: S.String,
  environmentName: S.String,
  stackName: S.optional(S.String),
  deploymentArtifacts: S.optional(S.String),
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const BackendEnvironments = S.Array(BackendEnvironment);
export const CustomDomains = S.Array(S.String);
export const AssociatedResources = S.Array(S.String);
export class Branch extends S.Class<Branch>("Branch")({
  branchArn: S.String,
  branchName: S.String,
  description: S.String,
  tags: S.optional(TagMap),
  stage: S.String,
  displayName: S.String,
  enableNotification: S.Boolean,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  environmentVariables: EnvironmentVariables,
  enableAutoBuild: S.Boolean,
  enableSkewProtection: S.optional(S.Boolean),
  customDomains: CustomDomains,
  framework: S.String,
  activeJobId: S.String,
  totalNumberOfJobs: S.String,
  enableBasicAuth: S.Boolean,
  enablePerformanceMode: S.optional(S.Boolean),
  thumbnailUrl: S.optional(S.String),
  basicAuthCredentials: S.optional(S.String),
  buildSpec: S.optional(S.String),
  ttl: S.String,
  associatedResources: S.optional(AssociatedResources),
  enablePullRequestPreview: S.Boolean,
  pullRequestEnvironmentName: S.optional(S.String),
  destinationBranch: S.optional(S.String),
  sourceBranch: S.optional(S.String),
  backendEnvironmentArn: S.optional(S.String),
  backend: S.optional(Backend),
  computeRoleArn: S.optional(S.String),
}) {}
export const Branches = S.Array(Branch);
export class SubDomain extends S.Class<SubDomain>("SubDomain")({
  subDomainSetting: SubDomainSetting,
  verified: S.Boolean,
  dnsRecord: S.String,
}) {}
export const SubDomains = S.Array(SubDomain);
export class Certificate extends S.Class<Certificate>("Certificate")({
  type: S.String,
  customCertificateArn: S.optional(S.String),
  certificateVerificationDNSRecord: S.optional(S.String),
}) {}
export class DomainAssociation extends S.Class<DomainAssociation>(
  "DomainAssociation",
)({
  domainAssociationArn: S.String,
  domainName: S.String,
  enableAutoSubDomain: S.Boolean,
  autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
  autoSubDomainIAMRole: S.optional(S.String),
  domainStatus: S.String,
  updateStatus: S.optional(S.String),
  statusReason: S.String,
  certificateVerificationDNSRecord: S.optional(S.String),
  subDomains: SubDomains,
  certificate: S.optional(Certificate),
}) {}
export const DomainAssociations = S.Array(DomainAssociation);
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  jobArn: S.String,
  jobId: S.String,
  commitId: S.String,
  commitMessage: S.String,
  commitTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  jobType: S.String,
  sourceUrl: S.optional(S.String),
  sourceUrlType: S.optional(S.String),
}) {}
export const JobSummaries = S.Array(JobSummary);
export class Webhook extends S.Class<Webhook>("Webhook")({
  webhookArn: S.String,
  webhookId: S.String,
  webhookUrl: S.String,
  appId: S.optional(S.String),
  branchName: S.String,
  description: S.String,
  createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const Webhooks = S.Array(Webhook);
export class CreateAppRequest extends S.Class<CreateAppRequest>(
  "CreateAppRequest",
)(
  {
    name: S.String,
    description: S.optional(S.String),
    repository: S.optional(S.String),
    platform: S.optional(S.String),
    computeRoleArn: S.optional(S.String),
    iamServiceRoleArn: S.optional(S.String),
    oauthToken: S.optional(S.String),
    accessToken: S.optional(S.String),
    environmentVariables: S.optional(EnvironmentVariables),
    enableBranchAutoBuild: S.optional(S.Boolean),
    enableBranchAutoDeletion: S.optional(S.Boolean),
    enableBasicAuth: S.optional(S.Boolean),
    basicAuthCredentials: S.optional(S.String),
    customRules: S.optional(CustomRules),
    tags: S.optional(TagMap),
    buildSpec: S.optional(S.String),
    customHeaders: S.optional(S.String),
    enableAutoBranchCreation: S.optional(S.Boolean),
    autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
    autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
    jobConfig: S.optional(JobConfig),
    cacheConfig: S.optional(CacheConfig),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateBranchRequest extends S.Class<CreateBranchRequest>(
  "CreateBranchRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String,
    description: S.optional(S.String),
    stage: S.optional(S.String),
    framework: S.optional(S.String),
    enableNotification: S.optional(S.Boolean),
    enableAutoBuild: S.optional(S.Boolean),
    enableSkewProtection: S.optional(S.Boolean),
    environmentVariables: S.optional(EnvironmentVariables),
    basicAuthCredentials: S.optional(S.String),
    enableBasicAuth: S.optional(S.Boolean),
    enablePerformanceMode: S.optional(S.Boolean),
    tags: S.optional(TagMap),
    buildSpec: S.optional(S.String),
    ttl: S.optional(S.String),
    displayName: S.optional(S.String),
    enablePullRequestPreview: S.optional(S.Boolean),
    pullRequestEnvironmentName: S.optional(S.String),
    backendEnvironmentArn: S.optional(S.String),
    backend: S.optional(Backend),
    computeRoleArn: S.optional(S.String),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/branches" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDeploymentRequest extends S.Class<CreateDeploymentRequest>(
  "CreateDeploymentRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    fileMap: S.optional(FileMap),
  },
  T.all(
    ns,
    T.Http({
      method: "POST",
      uri: "/apps/{appId}/branches/{branchName}/deployments",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateDomainAssociationRequest extends S.Class<CreateDomainAssociationRequest>(
  "CreateDomainAssociationRequest",
)(
  {
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String,
    enableAutoSubDomain: S.optional(S.Boolean),
    subDomainSettings: SubDomainSettings,
    autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
    autoSubDomainIAMRole: S.optional(S.String),
    certificateSettings: S.optional(CertificateSettings),
  },
  T.all(
    ns,
    T.Http({ method: "POST", uri: "/apps/{appId}/domains" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteBackendEnvironmentResult extends S.Class<DeleteBackendEnvironmentResult>(
  "DeleteBackendEnvironmentResult",
)({ backendEnvironment: BackendEnvironment }, ns) {}
export class DeleteWebhookResult extends S.Class<DeleteWebhookResult>(
  "DeleteWebhookResult",
)({ webhook: Webhook }, ns) {}
export class GenerateAccessLogsResult extends S.Class<GenerateAccessLogsResult>(
  "GenerateAccessLogsResult",
)({ logUrl: S.optional(S.String) }, ns) {}
export class GetAppResult extends S.Class<GetAppResult>("GetAppResult")(
  { app: App },
  ns,
) {}
export class GetArtifactUrlResult extends S.Class<GetArtifactUrlResult>(
  "GetArtifactUrlResult",
)({ artifactId: S.String, artifactUrl: S.String }, ns) {}
export class GetBackendEnvironmentResult extends S.Class<GetBackendEnvironmentResult>(
  "GetBackendEnvironmentResult",
)({ backendEnvironment: BackendEnvironment }, ns) {}
export class GetBranchResult extends S.Class<GetBranchResult>(
  "GetBranchResult",
)({ branch: Branch }, ns) {}
export class GetDomainAssociationResult extends S.Class<GetDomainAssociationResult>(
  "GetDomainAssociationResult",
)({ domainAssociation: DomainAssociation }, ns) {}
export class GetWebhookResult extends S.Class<GetWebhookResult>(
  "GetWebhookResult",
)({ webhook: Webhook }, ns) {}
export class ListAppsResult extends S.Class<ListAppsResult>("ListAppsResult")(
  { apps: Apps, nextToken: S.optional(S.String) },
  ns,
) {}
export class ListBackendEnvironmentsResult extends S.Class<ListBackendEnvironmentsResult>(
  "ListBackendEnvironmentsResult",
)(
  { backendEnvironments: BackendEnvironments, nextToken: S.optional(S.String) },
  ns,
) {}
export class ListBranchesResult extends S.Class<ListBranchesResult>(
  "ListBranchesResult",
)({ branches: Branches, nextToken: S.optional(S.String) }, ns) {}
export class ListDomainAssociationsResult extends S.Class<ListDomainAssociationsResult>(
  "ListDomainAssociationsResult",
)(
  { domainAssociations: DomainAssociations, nextToken: S.optional(S.String) },
  ns,
) {}
export class ListJobsResult extends S.Class<ListJobsResult>("ListJobsResult")(
  { jobSummaries: JobSummaries, nextToken: S.optional(S.String) },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }, ns) {}
export class ListWebhooksResult extends S.Class<ListWebhooksResult>(
  "ListWebhooksResult",
)({ webhooks: Webhooks, nextToken: S.optional(S.String) }, ns) {}
export class StartDeploymentResult extends S.Class<StartDeploymentResult>(
  "StartDeploymentResult",
)({ jobSummary: JobSummary }, ns) {}
export class StartJobResult extends S.Class<StartJobResult>("StartJobResult")(
  { jobSummary: JobSummary },
  ns,
) {}
export class StopJobResult extends S.Class<StopJobResult>("StopJobResult")(
  { jobSummary: JobSummary },
  ns,
) {}
export class UpdateAppResult extends S.Class<UpdateAppResult>(
  "UpdateAppResult",
)({ app: App }, ns) {}
export class UpdateBranchResult extends S.Class<UpdateBranchResult>(
  "UpdateBranchResult",
)({ branch: Branch }, ns) {}
export class UpdateDomainAssociationResult extends S.Class<UpdateDomainAssociationResult>(
  "UpdateDomainAssociationResult",
)({ domainAssociation: DomainAssociation }, ns) {}
export class UpdateWebhookResult extends S.Class<UpdateWebhookResult>(
  "UpdateWebhookResult",
)({ webhook: Webhook }, ns) {}
export class Artifact extends S.Class<Artifact>("Artifact")({
  artifactFileName: S.String,
  artifactId: S.String,
}) {}
export const Artifacts = S.Array(Artifact);
export class CreateAppResult extends S.Class<CreateAppResult>(
  "CreateAppResult",
)({ app: App }, ns) {}
export class CreateBackendEnvironmentResult extends S.Class<CreateBackendEnvironmentResult>(
  "CreateBackendEnvironmentResult",
)({ backendEnvironment: BackendEnvironment }, ns) {}
export class CreateBranchResult extends S.Class<CreateBranchResult>(
  "CreateBranchResult",
)({ branch: Branch }, ns) {}
export class CreateDomainAssociationResult extends S.Class<CreateDomainAssociationResult>(
  "CreateDomainAssociationResult",
)({ domainAssociation: DomainAssociation }, ns) {}
export class CreateWebhookResult extends S.Class<CreateWebhookResult>(
  "CreateWebhookResult",
)({ webhook: Webhook }, ns) {}
export class DeleteBranchResult extends S.Class<DeleteBranchResult>(
  "DeleteBranchResult",
)({ branch: Branch }, ns) {}
export class DeleteJobResult extends S.Class<DeleteJobResult>(
  "DeleteJobResult",
)({ jobSummary: JobSummary }, ns) {}
export class ListArtifactsResult extends S.Class<ListArtifactsResult>(
  "ListArtifactsResult",
)({ artifacts: Artifacts, nextToken: S.optional(S.String) }, ns) {}
export const FileUploadUrls = S.Record({ key: S.String, value: S.String });
export const Screenshots = S.Record({ key: S.String, value: S.String });
export class CreateDeploymentResult extends S.Class<CreateDeploymentResult>(
  "CreateDeploymentResult",
)(
  {
    jobId: S.optional(S.String),
    fileUploadUrls: FileUploadUrls,
    zipUploadUrl: S.String,
  },
  ns,
) {}
export class DeleteAppResult extends S.Class<DeleteAppResult>(
  "DeleteAppResult",
)({ app: App }, ns) {}
export class DeleteDomainAssociationResult extends S.Class<DeleteDomainAssociationResult>(
  "DeleteDomainAssociationResult",
)({ domainAssociation: DomainAssociation }, ns) {}
export class Step extends S.Class<Step>("Step")({
  stepName: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  status: S.String,
  endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  logUrl: S.optional(S.String),
  artifactsUrl: S.optional(S.String),
  testArtifactsUrl: S.optional(S.String),
  testConfigUrl: S.optional(S.String),
  screenshots: S.optional(Screenshots),
  statusReason: S.optional(S.String),
  context: S.optional(S.String),
}) {}
export const Steps = S.Array(Step);
export class Job extends S.Class<Job>("Job")({
  summary: JobSummary,
  steps: Steps,
}) {}
export class GetJobResult extends S.Class<GetJobResult>("GetJobResult")(
  { job: Job },
  ns,
) {}

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class DependentServiceFailureException extends S.TaggedError<DependentServiceFailureException>()(
  "DependentServiceFailureException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { code: S.String, message: S.String },
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Tags the resource with a tag key and value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of the existing Amplify apps.
 */
export const listApps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAppsRequest,
  output: ListAppsResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "apps",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Untags a resource with a specified Amazon Resource Name (ARN).
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a list of tags for a specified Amazon Resource Name (ARN).
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    InternalFailureException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing Amplify app.
 */
export const updateApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAppRequest,
  output: UpdateAppResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the website access logs for a specific time range using a presigned URL.
 */
export const generateAccessLogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GenerateAccessLogsRequest,
  output: GenerateAccessLogsResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns an existing Amplify app specified by an app ID.
 */
export const getApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAppRequest,
  output: GetAppResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a backend environment for an Amplify app.
 *
 * This API is available only to Amplify Gen 1 applications where the
 * backend is created using Amplify Studio or the Amplify
 * command line interface (CLI). This API isn’t available to Amplify Gen 2
 * applications. When you deploy an application with Amplify Gen 2, you provision the app's
 * backend infrastructure using Typescript code.
 */
export const getBackendEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetBackendEnvironmentRequest,
    output: GetBackendEnvironmentResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns a branch for an Amplify app.
 */
export const getBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBranchRequest,
  output: GetBranchResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the domain information for an Amplify app.
 */
export const getDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDomainAssociationRequest,
    output: GetDomainAssociationResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a new domain association for an Amplify app.
 */
export const updateDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDomainAssociationRequest,
    output: UpdateDomainAssociationResult,
    errors: [
      BadRequestException,
      DependentServiceFailureException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Updates a webhook.
 */
export const updateWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebhookRequest,
  output: UpdateWebhookResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a backend environment for an Amplify app.
 *
 * This API is available only to Amplify Gen 1 applications where the
 * backend is created using Amplify Studio or the Amplify
 * command line interface (CLI). This API isn’t available to Amplify Gen 2
 * applications. When you deploy an application with Amplify Gen 2, you provision the app's
 * backend infrastructure using Typescript code.
 */
export const deleteBackendEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBackendEnvironmentRequest,
    output: DeleteBackendEnvironmentResult,
    errors: [
      BadRequestException,
      DependentServiceFailureException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a branch for an Amplify app.
 */
export const deleteBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBranchRequest,
  output: DeleteBranchResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes an existing Amplify app specified by an app ID.
 */
export const deleteApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAppRequest,
  output: DeleteAppResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a domain association for an Amplify app.
 */
export const deleteDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDomainAssociationRequest,
    output: DeleteDomainAssociationResult,
    errors: [
      BadRequestException,
      DependentServiceFailureException,
      InternalFailureException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Returns the artifact info that corresponds to an artifact id.
 */
export const getArtifactUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetArtifactUrlRequest,
  output: GetArtifactUrlResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the webhook information that corresponds to a specified webhook ID.
 */
export const getWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWebhookRequest,
  output: GetWebhookResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the jobs for a branch of an Amplify app.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of webhooks for an Amplify app.
 */
export const listWebhooks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWebhooksRequest,
  output: ListWebhooksResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Starts a deployment for a manually deployed app. Manually deployed apps are not
 * connected to a Git repository.
 *
 * The maximum duration between the `CreateDeployment` call and the
 * `StartDeployment` call cannot exceed 8 hours. If the duration exceeds 8
 * hours, the `StartDeployment` call and the associated `Job` will
 * fail.
 */
export const startDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDeploymentRequest,
  output: StartDeploymentResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Starts a new job for a branch of an Amplify app.
 */
export const startJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRequest,
  output: StartJobResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Stops a job that is in progress for a branch of an Amplify app.
 */
export const stopJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopJobRequest,
  output: StopJobResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new backend environment for an Amplify app.
 *
 * This API is available only to Amplify Gen 1 applications where the
 * backend is created using Amplify Studio or the Amplify
 * command line interface (CLI). This API isn’t available to Amplify Gen 2
 * applications. When you deploy an application with Amplify Gen 2, you provision the app's
 * backend infrastructure using Typescript code.
 */
export const createBackendEnvironment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBackendEnvironmentRequest,
    output: CreateBackendEnvironmentResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Deletes a job for a branch of an Amplify app.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a list of end-to-end testing artifacts for a specified app, branch, and
 * job.
 *
 * To return the build artifacts, use the GetJob API.
 *
 * For more information about Amplify testing support, see Setting up
 * end-to-end Cypress tests for your Amplify application in the
 * *Amplify Hosting User Guide*.
 */
export const listArtifacts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArtifactsRequest,
  output: ListArtifactsResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new Amplify app.
 */
export const createApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAppRequest,
  output: CreateAppResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new branch for an Amplify app.
 */
export const createBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBranchRequest,
  output: CreateBranchResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new domain association for an Amplify app. This action associates a custom
 * domain with the Amplify app
 */
export const createDomainAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDomainAssociationRequest,
    output: CreateDomainAssociationResult,
    errors: [
      BadRequestException,
      DependentServiceFailureException,
      InternalFailureException,
      LimitExceededException,
      NotFoundException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Creates a new webhook on an Amplify app.
 */
export const createWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebhookRequest,
  output: CreateWebhookResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a deployment for a manually deployed Amplify app. Manually deployed apps are
 * not connected to a Git repository.
 *
 * The maximum duration between the `CreateDeployment` call and the
 * `StartDeployment` call cannot exceed 8 hours. If the duration exceeds 8
 * hours, the `StartDeployment` call and the associated `Job` will
 * fail.
 */
export const createDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDeploymentRequest,
  output: CreateDeploymentResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the backend environments for an Amplify app.
 *
 * This API is available only to Amplify Gen 1 applications where the
 * backend is created using Amplify Studio or the Amplify
 * command line interface (CLI). This API isn’t available to Amplify Gen 2
 * applications. When you deploy an application with Amplify Gen 2, you provision the app's
 * backend infrastructure using Typescript code.
 */
export const listBackendEnvironments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListBackendEnvironmentsRequest,
    output: ListBackendEnvironmentsResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      UnauthorizedException,
    ],
  }),
);
/**
 * Lists the branches of an Amplify app.
 */
export const listBranches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBranchesRequest,
    output: ListBranchesResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      UnauthorizedException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "branches",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Returns the domain associations for an Amplify app.
 */
export const listDomainAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDomainAssociationsRequest,
    output: ListDomainAssociationsResult,
    errors: [
      BadRequestException,
      InternalFailureException,
      UnauthorizedException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "domainAssociations",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Updates a branch for an Amplify app.
 */
export const updateBranch = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBranchRequest,
  output: UpdateBranchResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a webhook.
 */
export const deleteWebhook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebhookRequest,
  output: DeleteWebhookResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a job for a branch of an Amplify app.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
