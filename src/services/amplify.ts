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
const ns = T.XmlNamespace("http://amplify.amazonaws.com");
const svc = T.AwsApiService({ sdkId: "Amplify", serviceShapeName: "Amplify" });
const auth = T.AwsAuthSigv4({ name: "amplify" });
const ver = T.ServiceVersion("2017-07-25");
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
              `https://amplify-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://amplify-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://amplify.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://amplify.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Name = string;
export type Description = string;
export type Repository = string;
export type ComputeRoleArn = string;
export type ServiceRoleArn = string;
export type OauthToken = string | redacted.Redacted<string>;
export type AccessToken = string | redacted.Redacted<string>;
export type EnableBranchAutoBuild = boolean;
export type EnableBranchAutoDeletion = boolean;
export type EnableBasicAuth = boolean;
export type BasicAuthCredentials = string | redacted.Redacted<string>;
export type BuildSpec = string | redacted.Redacted<string>;
export type CustomHeaders = string;
export type EnableAutoBranchCreation = boolean;
export type AutoBranchCreationPattern = string;
export type AppId = string;
export type EnvironmentName = string;
export type StackName = string;
export type DeploymentArtifacts = string;
export type BranchName = string;
export type Framework = string;
export type EnableNotification = boolean;
export type EnableAutoBuild = boolean;
export type EnableSkewProtection = boolean;
export type EnablePerformanceMode = boolean;
export type TTL = string;
export type DisplayName = string;
export type EnablePullRequestPreview = boolean;
export type PullRequestEnvironmentName = string;
export type BackendEnvironmentArn = string;
export type DomainName = string;
export type EnableAutoSubDomain = boolean;
export type AutoSubDomainCreationPattern = string;
export type AutoSubDomainIAMRole = string;
export type JobId = string;
export type WebhookId = string;
export type StartTime = Date;
export type EndTime = Date;
export type ArtifactId = string;
export type NextToken = string;
export type MaxResultsForListApps = number;
export type MaxResults = number;
export type ResourceArn = string;
export type SourceUrl = string;
export type JobReason = string;
export type CommitId = string;
export type CommitMessage = string;
export type CommitTime = Date;
export type TagKey = string;
export type EnvKey = string;
export type EnvValue = string;
export type Source = string;
export type Target = string;
export type Status = string;
export type Condition = string;
export type TagValue = string;
export type StackArn = string;
export type FileName = string;
export type MD5Hash = string;
export type DomainPrefix = string;
export type CertificateArn = string;
export type LogUrl = string;
export type ArtifactUrl = string;
export type ErrorMessage = string;
export type CreateTime = Date;
export type UpdateTime = Date;
export type WebhookArn = string;
export type WebhookUrl = string;
export type AppArn = string;
export type DefaultDomain = string;
export type WebhookCreateTime = Date;
export type BranchArn = string;
export type CustomDomain = string;
export type ActiveJobId = string;
export type TotalNumberOfJobs = string;
export type ThumbnailUrl = string;
export type AssociatedResource = string;
export type DomainAssociationArn = string;
export type StatusReason = string;
export type CertificateVerificationDNSRecord = string;
export type JobArn = string;
export type ArtifactFileName = string;
export type UploadUrl = string;
export type LastDeployTime = Date;
export type WebAclArn = string;
export type Verified = boolean;
export type DNSRecord = string;
export type StepName = string;
export type ArtifactsUrl = string;
export type TestArtifactsUrl = string;
export type TestConfigUrl = string;
export type Context = string;
export type ThumbnailName = string;
export type Code = string;

//# Schemas
export type Platform = "WEB" | "WEB_DYNAMIC" | "WEB_COMPUTE";
export const Platform = S.Literal("WEB", "WEB_DYNAMIC", "WEB_COMPUTE");
export type AutoBranchCreationPatterns = string[];
export const AutoBranchCreationPatterns = S.Array(S.String);
export type Stage =
  | "PRODUCTION"
  | "BETA"
  | "DEVELOPMENT"
  | "EXPERIMENTAL"
  | "PULL_REQUEST";
export const Stage = S.Literal(
  "PRODUCTION",
  "BETA",
  "DEVELOPMENT",
  "EXPERIMENTAL",
  "PULL_REQUEST",
);
export type AutoSubDomainCreationPatterns = string[];
export const AutoSubDomainCreationPatterns = S.Array(S.String);
export type SourceUrlType = "ZIP" | "BUCKET_PREFIX";
export const SourceUrlType = S.Literal("ZIP", "BUCKET_PREFIX");
export type JobType = "RELEASE" | "RETRY" | "MANUAL" | "WEB_HOOK";
export const JobType = S.Literal("RELEASE", "RETRY", "MANUAL", "WEB_HOOK");
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateBackendEnvironmentRequest {
  appId: string;
  environmentName: string;
  stackName?: string;
  deploymentArtifacts?: string;
}
export const CreateBackendEnvironmentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String,
    stackName: S.optional(S.String),
    deploymentArtifacts: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/backendenvironments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBackendEnvironmentRequest",
}) as any as S.Schema<CreateBackendEnvironmentRequest>;
export interface CreateWebhookRequest {
  appId: string;
  branchName: string;
  description?: string;
}
export const CreateWebhookRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String,
    description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/webhooks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWebhookRequest",
}) as any as S.Schema<CreateWebhookRequest>;
export interface DeleteAppRequest {
  appId: string;
}
export const DeleteAppRequest = S.suspend(() =>
  S.Struct({ appId: S.String.pipe(T.HttpLabel("appId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/apps/{appId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAppRequest",
}) as any as S.Schema<DeleteAppRequest>;
export interface DeleteBackendEnvironmentRequest {
  appId: string;
  environmentName: string;
}
export const DeleteBackendEnvironmentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteBackendEnvironmentRequest",
}) as any as S.Schema<DeleteBackendEnvironmentRequest>;
export interface DeleteBranchRequest {
  appId: string;
  branchName: string;
}
export const DeleteBranchRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/apps/{appId}/branches/{branchName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteBranchRequest",
}) as any as S.Schema<DeleteBranchRequest>;
export interface DeleteDomainAssociationRequest {
  appId: string;
  domainName: string;
}
export const DeleteDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/apps/{appId}/domains/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteDomainAssociationRequest",
}) as any as S.Schema<DeleteDomainAssociationRequest>;
export interface DeleteJobRequest {
  appId: string;
  branchName: string;
  jobId: string;
}
export const DeleteJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteJobRequest",
}) as any as S.Schema<DeleteJobRequest>;
export interface DeleteWebhookRequest {
  webhookId: string;
}
export const DeleteWebhookRequest = S.suspend(() =>
  S.Struct({ webhookId: S.String.pipe(T.HttpLabel("webhookId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "DELETE", uri: "/webhooks/{webhookId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWebhookRequest",
}) as any as S.Schema<DeleteWebhookRequest>;
export interface GenerateAccessLogsRequest {
  startTime?: Date;
  endTime?: Date;
  domainName: string;
  appId: string;
}
export const GenerateAccessLogsRequest = S.suspend(() =>
  S.Struct({
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    domainName: S.String,
    appId: S.String.pipe(T.HttpLabel("appId")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/accesslogs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GenerateAccessLogsRequest",
}) as any as S.Schema<GenerateAccessLogsRequest>;
export interface GetAppRequest {
  appId: string;
}
export const GetAppRequest = S.suspend(() =>
  S.Struct({ appId: S.String.pipe(T.HttpLabel("appId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAppRequest",
}) as any as S.Schema<GetAppRequest>;
export interface GetArtifactUrlRequest {
  artifactId: string;
}
export const GetArtifactUrlRequest = S.suspend(() =>
  S.Struct({ artifactId: S.String.pipe(T.HttpLabel("artifactId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/artifacts/{artifactId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetArtifactUrlRequest",
}) as any as S.Schema<GetArtifactUrlRequest>;
export interface GetBackendEnvironmentRequest {
  appId: string;
  environmentName: string;
}
export const GetBackendEnvironmentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.String.pipe(T.HttpLabel("environmentName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBackendEnvironmentRequest",
}) as any as S.Schema<GetBackendEnvironmentRequest>;
export interface GetBranchRequest {
  appId: string;
  branchName: string;
}
export const GetBranchRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/branches/{branchName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetBranchRequest",
}) as any as S.Schema<GetBranchRequest>;
export interface GetDomainAssociationRequest {
  appId: string;
  domainName: string;
}
export const GetDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/domains/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDomainAssociationRequest",
}) as any as S.Schema<GetDomainAssociationRequest>;
export interface GetJobRequest {
  appId: string;
  branchName: string;
  jobId: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface GetWebhookRequest {
  webhookId: string;
}
export const GetWebhookRequest = S.suspend(() =>
  S.Struct({ webhookId: S.String.pipe(T.HttpLabel("webhookId")) }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/webhooks/{webhookId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetWebhookRequest",
}) as any as S.Schema<GetWebhookRequest>;
export interface ListAppsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListAppsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAppsRequest",
}) as any as S.Schema<ListAppsRequest>;
export interface ListArtifactsRequest {
  appId: string;
  branchName: string;
  jobId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListArtifactsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListArtifactsRequest",
}) as any as S.Schema<ListArtifactsRequest>;
export interface ListBackendEnvironmentsRequest {
  appId: string;
  environmentName?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBackendEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    environmentName: S.optional(S.String).pipe(T.HttpQuery("environmentName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/backendenvironments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBackendEnvironmentsRequest",
}) as any as S.Schema<ListBackendEnvironmentsRequest>;
export interface ListBranchesRequest {
  appId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListBranchesRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/branches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListBranchesRequest",
}) as any as S.Schema<ListBranchesRequest>;
export interface ListDomainAssociationsRequest {
  appId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListDomainAssociationsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDomainAssociationsRequest",
}) as any as S.Schema<ListDomainAssociationsRequest>;
export interface ListJobsRequest {
  appId: string;
  branchName: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "GET",
        uri: "/apps/{appId}/branches/{branchName}/jobs",
      }),
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
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      ns,
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
export interface ListWebhooksRequest {
  appId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListWebhooksRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "GET", uri: "/apps/{appId}/webhooks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWebhooksRequest",
}) as any as S.Schema<ListWebhooksRequest>;
export interface StartDeploymentRequest {
  appId: string;
  branchName: string;
  jobId?: string;
  sourceUrl?: string;
  sourceUrlType?: SourceUrlType;
}
export const StartDeploymentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.optional(S.String),
    sourceUrl: S.optional(S.String),
    sourceUrlType: S.optional(SourceUrlType),
  }).pipe(
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
  ),
).annotations({
  identifier: "StartDeploymentRequest",
}) as any as S.Schema<StartDeploymentRequest>;
export interface StartJobRequest {
  appId: string;
  branchName: string;
  jobId?: string;
  jobType: JobType;
  jobReason?: string;
  commitId?: string;
  commitMessage?: string;
  commitTime?: Date;
}
export const StartJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.optional(S.String),
    jobType: JobType,
    jobReason: S.optional(S.String),
    commitId: S.optional(S.String),
    commitMessage: S.optional(S.String),
    commitTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(
      ns,
      T.Http({
        method: "POST",
        uri: "/apps/{appId}/branches/{branchName}/jobs",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobRequest",
}) as any as S.Schema<StartJobRequest>;
export interface StopJobRequest {
  appId: string;
  branchName: string;
  jobId: string;
}
export const StopJobRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    jobId: S.String.pipe(T.HttpLabel("jobId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "StopJobRequest",
}) as any as S.Schema<StopJobRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      ns,
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
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      ns,
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
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type EnvironmentVariables = { [key: string]: string };
export const EnvironmentVariables = S.Record({
  key: S.String,
  value: S.String,
});
export interface CustomRule {
  source: string;
  target: string;
  status?: string;
  condition?: string;
}
export const CustomRule = S.suspend(() =>
  S.Struct({
    source: S.String,
    target: S.String,
    status: S.optional(S.String),
    condition: S.optional(S.String),
  }),
).annotations({ identifier: "CustomRule" }) as any as S.Schema<CustomRule>;
export type CustomRules = CustomRule[];
export const CustomRules = S.Array(CustomRule);
export interface AutoBranchCreationConfig {
  stage?: Stage;
  framework?: string;
  enableAutoBuild?: boolean;
  environmentVariables?: { [key: string]: string };
  basicAuthCredentials?: string | redacted.Redacted<string>;
  enableBasicAuth?: boolean;
  enablePerformanceMode?: boolean;
  buildSpec?: string | redacted.Redacted<string>;
  enablePullRequestPreview?: boolean;
  pullRequestEnvironmentName?: string;
}
export const AutoBranchCreationConfig = S.suspend(() =>
  S.Struct({
    stage: S.optional(Stage),
    framework: S.optional(S.String),
    enableAutoBuild: S.optional(S.Boolean),
    environmentVariables: S.optional(EnvironmentVariables),
    basicAuthCredentials: S.optional(SensitiveString),
    enableBasicAuth: S.optional(S.Boolean),
    enablePerformanceMode: S.optional(S.Boolean),
    buildSpec: S.optional(SensitiveString),
    enablePullRequestPreview: S.optional(S.Boolean),
    pullRequestEnvironmentName: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoBranchCreationConfig",
}) as any as S.Schema<AutoBranchCreationConfig>;
export type BuildComputeType = "STANDARD_8GB" | "LARGE_16GB" | "XLARGE_72GB";
export const BuildComputeType = S.Literal(
  "STANDARD_8GB",
  "LARGE_16GB",
  "XLARGE_72GB",
);
export interface JobConfig {
  buildComputeType: BuildComputeType;
}
export const JobConfig = S.suspend(() =>
  S.Struct({ buildComputeType: BuildComputeType }),
).annotations({ identifier: "JobConfig" }) as any as S.Schema<JobConfig>;
export type CacheConfigType = "AMPLIFY_MANAGED" | "AMPLIFY_MANAGED_NO_COOKIES";
export const CacheConfigType = S.Literal(
  "AMPLIFY_MANAGED",
  "AMPLIFY_MANAGED_NO_COOKIES",
);
export interface CacheConfig {
  type: CacheConfigType;
}
export const CacheConfig = S.suspend(() =>
  S.Struct({ type: CacheConfigType }),
).annotations({ identifier: "CacheConfig" }) as any as S.Schema<CacheConfig>;
export interface UpdateAppRequest {
  appId: string;
  name?: string;
  description?: string;
  platform?: Platform;
  computeRoleArn?: string;
  iamServiceRoleArn?: string;
  environmentVariables?: { [key: string]: string };
  enableBranchAutoBuild?: boolean;
  enableBranchAutoDeletion?: boolean;
  enableBasicAuth?: boolean;
  basicAuthCredentials?: string | redacted.Redacted<string>;
  customRules?: CustomRule[];
  buildSpec?: string | redacted.Redacted<string>;
  customHeaders?: string;
  enableAutoBranchCreation?: boolean;
  autoBranchCreationPatterns?: string[];
  autoBranchCreationConfig?: AutoBranchCreationConfig;
  repository?: string;
  oauthToken?: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  jobConfig?: JobConfig;
  cacheConfig?: CacheConfig;
}
export const UpdateAppRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    name: S.optional(S.String),
    description: S.optional(S.String),
    platform: S.optional(Platform),
    computeRoleArn: S.optional(S.String),
    iamServiceRoleArn: S.optional(S.String),
    environmentVariables: S.optional(EnvironmentVariables),
    enableBranchAutoBuild: S.optional(S.Boolean),
    enableBranchAutoDeletion: S.optional(S.Boolean),
    enableBasicAuth: S.optional(S.Boolean),
    basicAuthCredentials: S.optional(SensitiveString),
    customRules: S.optional(CustomRules),
    buildSpec: S.optional(SensitiveString),
    customHeaders: S.optional(S.String),
    enableAutoBranchCreation: S.optional(S.Boolean),
    autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
    autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
    repository: S.optional(S.String),
    oauthToken: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    jobConfig: S.optional(JobConfig),
    cacheConfig: S.optional(CacheConfig),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAppRequest",
}) as any as S.Schema<UpdateAppRequest>;
export interface Backend {
  stackArn?: string;
}
export const Backend = S.suspend(() =>
  S.Struct({ stackArn: S.optional(S.String) }),
).annotations({ identifier: "Backend" }) as any as S.Schema<Backend>;
export interface UpdateBranchRequest {
  appId: string;
  branchName: string;
  description?: string;
  framework?: string;
  stage?: Stage;
  enableNotification?: boolean;
  enableAutoBuild?: boolean;
  enableSkewProtection?: boolean;
  environmentVariables?: { [key: string]: string };
  basicAuthCredentials?: string | redacted.Redacted<string>;
  enableBasicAuth?: boolean;
  enablePerformanceMode?: boolean;
  buildSpec?: string | redacted.Redacted<string>;
  ttl?: string;
  displayName?: string;
  enablePullRequestPreview?: boolean;
  pullRequestEnvironmentName?: string;
  backendEnvironmentArn?: string;
  backend?: Backend;
  computeRoleArn?: string;
}
export const UpdateBranchRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    description: S.optional(S.String),
    framework: S.optional(S.String),
    stage: S.optional(Stage),
    enableNotification: S.optional(S.Boolean),
    enableAutoBuild: S.optional(S.Boolean),
    enableSkewProtection: S.optional(S.Boolean),
    environmentVariables: S.optional(EnvironmentVariables),
    basicAuthCredentials: S.optional(SensitiveString),
    enableBasicAuth: S.optional(S.Boolean),
    enablePerformanceMode: S.optional(S.Boolean),
    buildSpec: S.optional(SensitiveString),
    ttl: S.optional(S.String),
    displayName: S.optional(S.String),
    enablePullRequestPreview: S.optional(S.Boolean),
    pullRequestEnvironmentName: S.optional(S.String),
    backendEnvironmentArn: S.optional(S.String),
    backend: S.optional(Backend),
    computeRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/branches/{branchName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateBranchRequest",
}) as any as S.Schema<UpdateBranchRequest>;
export interface SubDomainSetting {
  prefix: string;
  branchName: string;
}
export const SubDomainSetting = S.suspend(() =>
  S.Struct({ prefix: S.String, branchName: S.String }),
).annotations({
  identifier: "SubDomainSetting",
}) as any as S.Schema<SubDomainSetting>;
export type SubDomainSettings = SubDomainSetting[];
export const SubDomainSettings = S.Array(SubDomainSetting);
export type CertificateType = "AMPLIFY_MANAGED" | "CUSTOM";
export const CertificateType = S.Literal("AMPLIFY_MANAGED", "CUSTOM");
export interface CertificateSettings {
  type: CertificateType;
  customCertificateArn?: string;
}
export const CertificateSettings = S.suspend(() =>
  S.Struct({
    type: CertificateType,
    customCertificateArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateSettings",
}) as any as S.Schema<CertificateSettings>;
export interface UpdateDomainAssociationRequest {
  appId: string;
  domainName: string;
  enableAutoSubDomain?: boolean;
  subDomainSettings?: SubDomainSetting[];
  autoSubDomainCreationPatterns?: string[];
  autoSubDomainIAMRole?: string;
  certificateSettings?: CertificateSettings;
}
export const UpdateDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String.pipe(T.HttpLabel("domainName")),
    enableAutoSubDomain: S.optional(S.Boolean),
    subDomainSettings: S.optional(SubDomainSettings),
    autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
    autoSubDomainIAMRole: S.optional(S.String),
    certificateSettings: S.optional(CertificateSettings),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/domains/{domainName}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateDomainAssociationRequest",
}) as any as S.Schema<UpdateDomainAssociationRequest>;
export interface UpdateWebhookRequest {
  webhookId: string;
  branchName?: string;
  description?: string;
}
export const UpdateWebhookRequest = S.suspend(() =>
  S.Struct({
    webhookId: S.String.pipe(T.HttpLabel("webhookId")),
    branchName: S.optional(S.String),
    description: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/webhooks/{webhookId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWebhookRequest",
}) as any as S.Schema<UpdateWebhookRequest>;
export type FileMap = { [key: string]: string };
export const FileMap = S.Record({ key: S.String, value: S.String });
export interface ProductionBranch {
  lastDeployTime?: Date;
  status?: string;
  thumbnailUrl?: string;
  branchName?: string;
}
export const ProductionBranch = S.suspend(() =>
  S.Struct({
    lastDeployTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    status: S.optional(S.String),
    thumbnailUrl: S.optional(S.String),
    branchName: S.optional(S.String),
  }),
).annotations({
  identifier: "ProductionBranch",
}) as any as S.Schema<ProductionBranch>;
export type RepositoryCloneMethod = "SSH" | "TOKEN" | "SIGV4";
export const RepositoryCloneMethod = S.Literal("SSH", "TOKEN", "SIGV4");
export type WafStatus =
  | "ASSOCIATING"
  | "ASSOCIATION_FAILED"
  | "ASSOCIATION_SUCCESS"
  | "DISASSOCIATING"
  | "DISASSOCIATION_FAILED";
export const WafStatus = S.Literal(
  "ASSOCIATING",
  "ASSOCIATION_FAILED",
  "ASSOCIATION_SUCCESS",
  "DISASSOCIATING",
  "DISASSOCIATION_FAILED",
);
export interface WafConfiguration {
  webAclArn?: string;
  wafStatus?: WafStatus;
  statusReason?: string;
}
export const WafConfiguration = S.suspend(() =>
  S.Struct({
    webAclArn: S.optional(S.String),
    wafStatus: S.optional(WafStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "WafConfiguration",
}) as any as S.Schema<WafConfiguration>;
export interface App {
  appId: string;
  appArn: string;
  name: string;
  tags?: { [key: string]: string };
  description: string;
  repository: string;
  platform: Platform;
  createTime: Date;
  updateTime: Date;
  computeRoleArn?: string;
  iamServiceRoleArn?: string;
  environmentVariables: { [key: string]: string };
  defaultDomain: string;
  enableBranchAutoBuild: boolean;
  enableBranchAutoDeletion?: boolean;
  enableBasicAuth: boolean;
  basicAuthCredentials?: string | redacted.Redacted<string>;
  customRules?: CustomRule[];
  productionBranch?: ProductionBranch;
  buildSpec?: string | redacted.Redacted<string>;
  customHeaders?: string;
  enableAutoBranchCreation?: boolean;
  autoBranchCreationPatterns?: string[];
  autoBranchCreationConfig?: AutoBranchCreationConfig;
  repositoryCloneMethod?: RepositoryCloneMethod;
  cacheConfig?: CacheConfig;
  webhookCreateTime?: Date;
  wafConfiguration?: WafConfiguration;
  jobConfig?: JobConfig;
}
export const App = S.suspend(() =>
  S.Struct({
    appId: S.String,
    appArn: S.String,
    name: S.String,
    tags: S.optional(TagMap),
    description: S.String,
    repository: S.String,
    platform: Platform,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    computeRoleArn: S.optional(S.String),
    iamServiceRoleArn: S.optional(S.String),
    environmentVariables: EnvironmentVariables,
    defaultDomain: S.String,
    enableBranchAutoBuild: S.Boolean,
    enableBranchAutoDeletion: S.optional(S.Boolean),
    enableBasicAuth: S.Boolean,
    basicAuthCredentials: S.optional(SensitiveString),
    customRules: S.optional(CustomRules),
    productionBranch: S.optional(ProductionBranch),
    buildSpec: S.optional(SensitiveString),
    customHeaders: S.optional(S.String),
    enableAutoBranchCreation: S.optional(S.Boolean),
    autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
    autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
    repositoryCloneMethod: S.optional(RepositoryCloneMethod),
    cacheConfig: S.optional(CacheConfig),
    webhookCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    wafConfiguration: S.optional(WafConfiguration),
    jobConfig: S.optional(JobConfig),
  }),
).annotations({ identifier: "App" }) as any as S.Schema<App>;
export type Apps = App[];
export const Apps = S.Array(App);
export interface BackendEnvironment {
  backendEnvironmentArn: string;
  environmentName: string;
  stackName?: string;
  deploymentArtifacts?: string;
  createTime: Date;
  updateTime: Date;
}
export const BackendEnvironment = S.suspend(() =>
  S.Struct({
    backendEnvironmentArn: S.String,
    environmentName: S.String,
    stackName: S.optional(S.String),
    deploymentArtifacts: S.optional(S.String),
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "BackendEnvironment",
}) as any as S.Schema<BackendEnvironment>;
export type BackendEnvironments = BackendEnvironment[];
export const BackendEnvironments = S.Array(BackendEnvironment);
export type CustomDomains = string[];
export const CustomDomains = S.Array(S.String);
export type AssociatedResources = string[];
export const AssociatedResources = S.Array(S.String);
export interface Branch {
  branchArn: string;
  branchName: string;
  description: string;
  tags?: { [key: string]: string };
  stage: Stage;
  displayName: string;
  enableNotification: boolean;
  createTime: Date;
  updateTime: Date;
  environmentVariables: { [key: string]: string };
  enableAutoBuild: boolean;
  enableSkewProtection?: boolean;
  customDomains: string[];
  framework: string;
  activeJobId: string;
  totalNumberOfJobs: string;
  enableBasicAuth: boolean;
  enablePerformanceMode?: boolean;
  thumbnailUrl?: string;
  basicAuthCredentials?: string | redacted.Redacted<string>;
  buildSpec?: string | redacted.Redacted<string>;
  ttl: string;
  associatedResources?: string[];
  enablePullRequestPreview: boolean;
  pullRequestEnvironmentName?: string;
  destinationBranch?: string;
  sourceBranch?: string;
  backendEnvironmentArn?: string;
  backend?: Backend;
  computeRoleArn?: string;
}
export const Branch = S.suspend(() =>
  S.Struct({
    branchArn: S.String,
    branchName: S.String,
    description: S.String,
    tags: S.optional(TagMap),
    stage: Stage,
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
    basicAuthCredentials: S.optional(SensitiveString),
    buildSpec: S.optional(SensitiveString),
    ttl: S.String,
    associatedResources: S.optional(AssociatedResources),
    enablePullRequestPreview: S.Boolean,
    pullRequestEnvironmentName: S.optional(S.String),
    destinationBranch: S.optional(S.String),
    sourceBranch: S.optional(S.String),
    backendEnvironmentArn: S.optional(S.String),
    backend: S.optional(Backend),
    computeRoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "Branch" }) as any as S.Schema<Branch>;
export type Branches = Branch[];
export const Branches = S.Array(Branch);
export type DomainStatus =
  | "PENDING_VERIFICATION"
  | "IN_PROGRESS"
  | "AVAILABLE"
  | "IMPORTING_CUSTOM_CERTIFICATE"
  | "PENDING_DEPLOYMENT"
  | "AWAITING_APP_CNAME"
  | "FAILED"
  | "CREATING"
  | "REQUESTING_CERTIFICATE"
  | "UPDATING";
export const DomainStatus = S.Literal(
  "PENDING_VERIFICATION",
  "IN_PROGRESS",
  "AVAILABLE",
  "IMPORTING_CUSTOM_CERTIFICATE",
  "PENDING_DEPLOYMENT",
  "AWAITING_APP_CNAME",
  "FAILED",
  "CREATING",
  "REQUESTING_CERTIFICATE",
  "UPDATING",
);
export type UpdateStatus =
  | "REQUESTING_CERTIFICATE"
  | "PENDING_VERIFICATION"
  | "IMPORTING_CUSTOM_CERTIFICATE"
  | "PENDING_DEPLOYMENT"
  | "AWAITING_APP_CNAME"
  | "UPDATE_COMPLETE"
  | "UPDATE_FAILED";
export const UpdateStatus = S.Literal(
  "REQUESTING_CERTIFICATE",
  "PENDING_VERIFICATION",
  "IMPORTING_CUSTOM_CERTIFICATE",
  "PENDING_DEPLOYMENT",
  "AWAITING_APP_CNAME",
  "UPDATE_COMPLETE",
  "UPDATE_FAILED",
);
export interface SubDomain {
  subDomainSetting: SubDomainSetting;
  verified: boolean;
  dnsRecord: string;
}
export const SubDomain = S.suspend(() =>
  S.Struct({
    subDomainSetting: SubDomainSetting,
    verified: S.Boolean,
    dnsRecord: S.String,
  }),
).annotations({ identifier: "SubDomain" }) as any as S.Schema<SubDomain>;
export type SubDomains = SubDomain[];
export const SubDomains = S.Array(SubDomain);
export interface Certificate {
  type: CertificateType;
  customCertificateArn?: string;
  certificateVerificationDNSRecord?: string;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    type: CertificateType,
    customCertificateArn: S.optional(S.String),
    certificateVerificationDNSRecord: S.optional(S.String),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface DomainAssociation {
  domainAssociationArn: string;
  domainName: string;
  enableAutoSubDomain: boolean;
  autoSubDomainCreationPatterns?: string[];
  autoSubDomainIAMRole?: string;
  domainStatus: DomainStatus;
  updateStatus?: UpdateStatus;
  statusReason: string;
  certificateVerificationDNSRecord?: string;
  subDomains: SubDomain[];
  certificate?: Certificate;
}
export const DomainAssociation = S.suspend(() =>
  S.Struct({
    domainAssociationArn: S.String,
    domainName: S.String,
    enableAutoSubDomain: S.Boolean,
    autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
    autoSubDomainIAMRole: S.optional(S.String),
    domainStatus: DomainStatus,
    updateStatus: S.optional(UpdateStatus),
    statusReason: S.String,
    certificateVerificationDNSRecord: S.optional(S.String),
    subDomains: SubDomains,
    certificate: S.optional(Certificate),
  }),
).annotations({
  identifier: "DomainAssociation",
}) as any as S.Schema<DomainAssociation>;
export type DomainAssociations = DomainAssociation[];
export const DomainAssociations = S.Array(DomainAssociation);
export type JobStatus =
  | "CREATED"
  | "PENDING"
  | "PROVISIONING"
  | "RUNNING"
  | "FAILED"
  | "SUCCEED"
  | "CANCELLING"
  | "CANCELLED";
export const JobStatus = S.Literal(
  "CREATED",
  "PENDING",
  "PROVISIONING",
  "RUNNING",
  "FAILED",
  "SUCCEED",
  "CANCELLING",
  "CANCELLED",
);
export interface JobSummary {
  jobArn: string;
  jobId: string;
  commitId: string;
  commitMessage: string;
  commitTime: Date;
  startTime: Date;
  status: JobStatus;
  endTime?: Date;
  jobType: JobType;
  sourceUrl?: string;
  sourceUrlType?: SourceUrlType;
}
export const JobSummary = S.suspend(() =>
  S.Struct({
    jobArn: S.String,
    jobId: S.String,
    commitId: S.String,
    commitMessage: S.String,
    commitTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: JobStatus,
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    jobType: JobType,
    sourceUrl: S.optional(S.String),
    sourceUrlType: S.optional(SourceUrlType),
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaries = JobSummary[];
export const JobSummaries = S.Array(JobSummary);
export interface Webhook {
  webhookArn: string;
  webhookId: string;
  webhookUrl: string;
  appId?: string;
  branchName: string;
  description: string;
  createTime: Date;
  updateTime: Date;
}
export const Webhook = S.suspend(() =>
  S.Struct({
    webhookArn: S.String,
    webhookId: S.String,
    webhookUrl: S.String,
    appId: S.optional(S.String),
    branchName: S.String,
    description: S.String,
    createTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "Webhook" }) as any as S.Schema<Webhook>;
export type Webhooks = Webhook[];
export const Webhooks = S.Array(Webhook);
export interface CreateAppRequest {
  name: string;
  description?: string;
  repository?: string;
  platform?: Platform;
  computeRoleArn?: string;
  iamServiceRoleArn?: string;
  oauthToken?: string | redacted.Redacted<string>;
  accessToken?: string | redacted.Redacted<string>;
  environmentVariables?: { [key: string]: string };
  enableBranchAutoBuild?: boolean;
  enableBranchAutoDeletion?: boolean;
  enableBasicAuth?: boolean;
  basicAuthCredentials?: string | redacted.Redacted<string>;
  customRules?: CustomRule[];
  tags?: { [key: string]: string };
  buildSpec?: string | redacted.Redacted<string>;
  customHeaders?: string;
  enableAutoBranchCreation?: boolean;
  autoBranchCreationPatterns?: string[];
  autoBranchCreationConfig?: AutoBranchCreationConfig;
  jobConfig?: JobConfig;
  cacheConfig?: CacheConfig;
}
export const CreateAppRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    repository: S.optional(S.String),
    platform: S.optional(Platform),
    computeRoleArn: S.optional(S.String),
    iamServiceRoleArn: S.optional(S.String),
    oauthToken: S.optional(SensitiveString),
    accessToken: S.optional(SensitiveString),
    environmentVariables: S.optional(EnvironmentVariables),
    enableBranchAutoBuild: S.optional(S.Boolean),
    enableBranchAutoDeletion: S.optional(S.Boolean),
    enableBasicAuth: S.optional(S.Boolean),
    basicAuthCredentials: S.optional(SensitiveString),
    customRules: S.optional(CustomRules),
    tags: S.optional(TagMap),
    buildSpec: S.optional(SensitiveString),
    customHeaders: S.optional(S.String),
    enableAutoBranchCreation: S.optional(S.Boolean),
    autoBranchCreationPatterns: S.optional(AutoBranchCreationPatterns),
    autoBranchCreationConfig: S.optional(AutoBranchCreationConfig),
    jobConfig: S.optional(JobConfig),
    cacheConfig: S.optional(CacheConfig),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAppRequest",
}) as any as S.Schema<CreateAppRequest>;
export interface CreateBranchRequest {
  appId: string;
  branchName: string;
  description?: string;
  stage?: Stage;
  framework?: string;
  enableNotification?: boolean;
  enableAutoBuild?: boolean;
  enableSkewProtection?: boolean;
  environmentVariables?: { [key: string]: string };
  basicAuthCredentials?: string | redacted.Redacted<string>;
  enableBasicAuth?: boolean;
  enablePerformanceMode?: boolean;
  tags?: { [key: string]: string };
  buildSpec?: string | redacted.Redacted<string>;
  ttl?: string;
  displayName?: string;
  enablePullRequestPreview?: boolean;
  pullRequestEnvironmentName?: string;
  backendEnvironmentArn?: string;
  backend?: Backend;
  computeRoleArn?: string;
}
export const CreateBranchRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String,
    description: S.optional(S.String),
    stage: S.optional(Stage),
    framework: S.optional(S.String),
    enableNotification: S.optional(S.Boolean),
    enableAutoBuild: S.optional(S.Boolean),
    enableSkewProtection: S.optional(S.Boolean),
    environmentVariables: S.optional(EnvironmentVariables),
    basicAuthCredentials: S.optional(SensitiveString),
    enableBasicAuth: S.optional(S.Boolean),
    enablePerformanceMode: S.optional(S.Boolean),
    tags: S.optional(TagMap),
    buildSpec: S.optional(SensitiveString),
    ttl: S.optional(S.String),
    displayName: S.optional(S.String),
    enablePullRequestPreview: S.optional(S.Boolean),
    pullRequestEnvironmentName: S.optional(S.String),
    backendEnvironmentArn: S.optional(S.String),
    backend: S.optional(Backend),
    computeRoleArn: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/branches" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateBranchRequest",
}) as any as S.Schema<CreateBranchRequest>;
export interface CreateDeploymentRequest {
  appId: string;
  branchName: string;
  fileMap?: { [key: string]: string };
}
export const CreateDeploymentRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    branchName: S.String.pipe(T.HttpLabel("branchName")),
    fileMap: S.optional(FileMap),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDeploymentRequest",
}) as any as S.Schema<CreateDeploymentRequest>;
export interface CreateDomainAssociationRequest {
  appId: string;
  domainName: string;
  enableAutoSubDomain?: boolean;
  subDomainSettings: SubDomainSetting[];
  autoSubDomainCreationPatterns?: string[];
  autoSubDomainIAMRole?: string;
  certificateSettings?: CertificateSettings;
}
export const CreateDomainAssociationRequest = S.suspend(() =>
  S.Struct({
    appId: S.String.pipe(T.HttpLabel("appId")),
    domainName: S.String,
    enableAutoSubDomain: S.optional(S.Boolean),
    subDomainSettings: SubDomainSettings,
    autoSubDomainCreationPatterns: S.optional(AutoSubDomainCreationPatterns),
    autoSubDomainIAMRole: S.optional(S.String),
    certificateSettings: S.optional(CertificateSettings),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/apps/{appId}/domains" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateDomainAssociationRequest",
}) as any as S.Schema<CreateDomainAssociationRequest>;
export interface DeleteBackendEnvironmentResult {
  backendEnvironment: BackendEnvironment;
}
export const DeleteBackendEnvironmentResult = S.suspend(() =>
  S.Struct({ backendEnvironment: BackendEnvironment }).pipe(ns),
).annotations({
  identifier: "DeleteBackendEnvironmentResult",
}) as any as S.Schema<DeleteBackendEnvironmentResult>;
export interface DeleteWebhookResult {
  webhook: Webhook;
}
export const DeleteWebhookResult = S.suspend(() =>
  S.Struct({ webhook: Webhook }).pipe(ns),
).annotations({
  identifier: "DeleteWebhookResult",
}) as any as S.Schema<DeleteWebhookResult>;
export interface GenerateAccessLogsResult {
  logUrl?: string;
}
export const GenerateAccessLogsResult = S.suspend(() =>
  S.Struct({ logUrl: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "GenerateAccessLogsResult",
}) as any as S.Schema<GenerateAccessLogsResult>;
export interface GetAppResult {
  app: App;
}
export const GetAppResult = S.suspend(() =>
  S.Struct({ app: App }).pipe(ns),
).annotations({ identifier: "GetAppResult" }) as any as S.Schema<GetAppResult>;
export interface GetArtifactUrlResult {
  artifactId: string;
  artifactUrl: string;
}
export const GetArtifactUrlResult = S.suspend(() =>
  S.Struct({ artifactId: S.String, artifactUrl: S.String }).pipe(ns),
).annotations({
  identifier: "GetArtifactUrlResult",
}) as any as S.Schema<GetArtifactUrlResult>;
export interface GetBackendEnvironmentResult {
  backendEnvironment: BackendEnvironment;
}
export const GetBackendEnvironmentResult = S.suspend(() =>
  S.Struct({ backendEnvironment: BackendEnvironment }).pipe(ns),
).annotations({
  identifier: "GetBackendEnvironmentResult",
}) as any as S.Schema<GetBackendEnvironmentResult>;
export interface GetBranchResult {
  branch: Branch;
}
export const GetBranchResult = S.suspend(() =>
  S.Struct({ branch: Branch }).pipe(ns),
).annotations({
  identifier: "GetBranchResult",
}) as any as S.Schema<GetBranchResult>;
export interface GetDomainAssociationResult {
  domainAssociation: DomainAssociation;
}
export const GetDomainAssociationResult = S.suspend(() =>
  S.Struct({ domainAssociation: DomainAssociation }).pipe(ns),
).annotations({
  identifier: "GetDomainAssociationResult",
}) as any as S.Schema<GetDomainAssociationResult>;
export interface GetWebhookResult {
  webhook: Webhook;
}
export const GetWebhookResult = S.suspend(() =>
  S.Struct({ webhook: Webhook }).pipe(ns),
).annotations({
  identifier: "GetWebhookResult",
}) as any as S.Schema<GetWebhookResult>;
export interface ListAppsResult {
  apps: App[];
  nextToken?: string;
}
export const ListAppsResult = S.suspend(() =>
  S.Struct({ apps: Apps, nextToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ListAppsResult",
}) as any as S.Schema<ListAppsResult>;
export interface ListBackendEnvironmentsResult {
  backendEnvironments: BackendEnvironment[];
  nextToken?: string;
}
export const ListBackendEnvironmentsResult = S.suspend(() =>
  S.Struct({
    backendEnvironments: BackendEnvironments,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListBackendEnvironmentsResult",
}) as any as S.Schema<ListBackendEnvironmentsResult>;
export interface ListBranchesResult {
  branches: Branch[];
  nextToken?: string;
}
export const ListBranchesResult = S.suspend(() =>
  S.Struct({ branches: Branches, nextToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ListBranchesResult",
}) as any as S.Schema<ListBranchesResult>;
export interface ListDomainAssociationsResult {
  domainAssociations: DomainAssociation[];
  nextToken?: string;
}
export const ListDomainAssociationsResult = S.suspend(() =>
  S.Struct({
    domainAssociations: DomainAssociations,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListDomainAssociationsResult",
}) as any as S.Schema<ListDomainAssociationsResult>;
export interface ListJobsResult {
  jobSummaries: JobSummary[];
  nextToken?: string;
}
export const ListJobsResult = S.suspend(() =>
  S.Struct({
    jobSummaries: JobSummaries,
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListJobsResult",
}) as any as S.Schema<ListJobsResult>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListWebhooksResult {
  webhooks: Webhook[];
  nextToken?: string;
}
export const ListWebhooksResult = S.suspend(() =>
  S.Struct({ webhooks: Webhooks, nextToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ListWebhooksResult",
}) as any as S.Schema<ListWebhooksResult>;
export interface StartDeploymentResult {
  jobSummary: JobSummary;
}
export const StartDeploymentResult = S.suspend(() =>
  S.Struct({ jobSummary: JobSummary }).pipe(ns),
).annotations({
  identifier: "StartDeploymentResult",
}) as any as S.Schema<StartDeploymentResult>;
export interface StartJobResult {
  jobSummary: JobSummary;
}
export const StartJobResult = S.suspend(() =>
  S.Struct({ jobSummary: JobSummary }).pipe(ns),
).annotations({
  identifier: "StartJobResult",
}) as any as S.Schema<StartJobResult>;
export interface StopJobResult {
  jobSummary: JobSummary;
}
export const StopJobResult = S.suspend(() =>
  S.Struct({ jobSummary: JobSummary }).pipe(ns),
).annotations({
  identifier: "StopJobResult",
}) as any as S.Schema<StopJobResult>;
export interface UpdateAppResult {
  app: App;
}
export const UpdateAppResult = S.suspend(() =>
  S.Struct({ app: App }).pipe(ns),
).annotations({
  identifier: "UpdateAppResult",
}) as any as S.Schema<UpdateAppResult>;
export interface UpdateBranchResult {
  branch: Branch;
}
export const UpdateBranchResult = S.suspend(() =>
  S.Struct({ branch: Branch }).pipe(ns),
).annotations({
  identifier: "UpdateBranchResult",
}) as any as S.Schema<UpdateBranchResult>;
export interface UpdateDomainAssociationResult {
  domainAssociation: DomainAssociation;
}
export const UpdateDomainAssociationResult = S.suspend(() =>
  S.Struct({ domainAssociation: DomainAssociation }).pipe(ns),
).annotations({
  identifier: "UpdateDomainAssociationResult",
}) as any as S.Schema<UpdateDomainAssociationResult>;
export interface UpdateWebhookResult {
  webhook: Webhook;
}
export const UpdateWebhookResult = S.suspend(() =>
  S.Struct({ webhook: Webhook }).pipe(ns),
).annotations({
  identifier: "UpdateWebhookResult",
}) as any as S.Schema<UpdateWebhookResult>;
export interface Artifact {
  artifactFileName: string;
  artifactId: string;
}
export const Artifact = S.suspend(() =>
  S.Struct({ artifactFileName: S.String, artifactId: S.String }),
).annotations({ identifier: "Artifact" }) as any as S.Schema<Artifact>;
export type Artifacts = Artifact[];
export const Artifacts = S.Array(Artifact);
export interface CreateAppResult {
  app: App;
}
export const CreateAppResult = S.suspend(() =>
  S.Struct({ app: App }).pipe(ns),
).annotations({
  identifier: "CreateAppResult",
}) as any as S.Schema<CreateAppResult>;
export interface CreateBackendEnvironmentResult {
  backendEnvironment: BackendEnvironment;
}
export const CreateBackendEnvironmentResult = S.suspend(() =>
  S.Struct({ backendEnvironment: BackendEnvironment }).pipe(ns),
).annotations({
  identifier: "CreateBackendEnvironmentResult",
}) as any as S.Schema<CreateBackendEnvironmentResult>;
export interface CreateBranchResult {
  branch: Branch;
}
export const CreateBranchResult = S.suspend(() =>
  S.Struct({ branch: Branch }).pipe(ns),
).annotations({
  identifier: "CreateBranchResult",
}) as any as S.Schema<CreateBranchResult>;
export interface CreateDomainAssociationResult {
  domainAssociation: DomainAssociation;
}
export const CreateDomainAssociationResult = S.suspend(() =>
  S.Struct({ domainAssociation: DomainAssociation }).pipe(ns),
).annotations({
  identifier: "CreateDomainAssociationResult",
}) as any as S.Schema<CreateDomainAssociationResult>;
export interface CreateWebhookResult {
  webhook: Webhook;
}
export const CreateWebhookResult = S.suspend(() =>
  S.Struct({ webhook: Webhook }).pipe(ns),
).annotations({
  identifier: "CreateWebhookResult",
}) as any as S.Schema<CreateWebhookResult>;
export interface DeleteBranchResult {
  branch: Branch;
}
export const DeleteBranchResult = S.suspend(() =>
  S.Struct({ branch: Branch }).pipe(ns),
).annotations({
  identifier: "DeleteBranchResult",
}) as any as S.Schema<DeleteBranchResult>;
export interface DeleteJobResult {
  jobSummary: JobSummary;
}
export const DeleteJobResult = S.suspend(() =>
  S.Struct({ jobSummary: JobSummary }).pipe(ns),
).annotations({
  identifier: "DeleteJobResult",
}) as any as S.Schema<DeleteJobResult>;
export interface ListArtifactsResult {
  artifacts: Artifact[];
  nextToken?: string;
}
export const ListArtifactsResult = S.suspend(() =>
  S.Struct({ artifacts: Artifacts, nextToken: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ListArtifactsResult",
}) as any as S.Schema<ListArtifactsResult>;
export type FileUploadUrls = { [key: string]: string };
export const FileUploadUrls = S.Record({ key: S.String, value: S.String });
export type Screenshots = { [key: string]: string };
export const Screenshots = S.Record({ key: S.String, value: S.String });
export interface CreateDeploymentResult {
  jobId?: string;
  fileUploadUrls: { [key: string]: string };
  zipUploadUrl: string;
}
export const CreateDeploymentResult = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    fileUploadUrls: FileUploadUrls,
    zipUploadUrl: S.String,
  }).pipe(ns),
).annotations({
  identifier: "CreateDeploymentResult",
}) as any as S.Schema<CreateDeploymentResult>;
export interface DeleteAppResult {
  app: App;
}
export const DeleteAppResult = S.suspend(() =>
  S.Struct({ app: App }).pipe(ns),
).annotations({
  identifier: "DeleteAppResult",
}) as any as S.Schema<DeleteAppResult>;
export interface DeleteDomainAssociationResult {
  domainAssociation: DomainAssociation;
}
export const DeleteDomainAssociationResult = S.suspend(() =>
  S.Struct({ domainAssociation: DomainAssociation }).pipe(ns),
).annotations({
  identifier: "DeleteDomainAssociationResult",
}) as any as S.Schema<DeleteDomainAssociationResult>;
export interface Step {
  stepName: string;
  startTime: Date;
  status: JobStatus;
  endTime: Date;
  logUrl?: string;
  artifactsUrl?: string;
  testArtifactsUrl?: string;
  testConfigUrl?: string;
  screenshots?: { [key: string]: string };
  statusReason?: string;
  context?: string;
}
export const Step = S.suspend(() =>
  S.Struct({
    stepName: S.String,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    status: JobStatus,
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    logUrl: S.optional(S.String),
    artifactsUrl: S.optional(S.String),
    testArtifactsUrl: S.optional(S.String),
    testConfigUrl: S.optional(S.String),
    screenshots: S.optional(Screenshots),
    statusReason: S.optional(S.String),
    context: S.optional(S.String),
  }),
).annotations({ identifier: "Step" }) as any as S.Schema<Step>;
export type Steps = Step[];
export const Steps = S.Array(Step);
export interface Job {
  summary: JobSummary;
  steps: Step[];
}
export const Job = S.suspend(() =>
  S.Struct({ summary: JobSummary, steps: Steps }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export interface GetJobResult {
  job: Job;
}
export const GetJobResult = S.suspend(() =>
  S.Struct({ job: Job }).pipe(ns),
).annotations({ identifier: "GetJobResult" }) as any as S.Schema<GetJobResult>;

//# Errors
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalFailureException extends S.TaggedError<InternalFailureException>()(
  "InternalFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DependentServiceFailureException extends S.TaggedError<DependentServiceFailureException>()(
  "DependentServiceFailureException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { code: S.String, message: S.String },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class UnauthorizedException extends S.TaggedError<UnauthorizedException>()(
  "UnauthorizedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}

//# Operations
/**
 * Tags the resource with a tag key and value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | BadRequestException
  | InternalFailureException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApps: {
  (
    input: ListAppsRequest,
  ): effect.Effect<
    ListAppsResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAppsRequest,
  ) => stream.Stream<
    ListAppsResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAppsRequest,
  ) => stream.Stream<
    App,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | BadRequestException
  | InternalFailureException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | BadRequestException
  | InternalFailureException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApp: (
  input: UpdateAppRequest,
) => effect.Effect<
  UpdateAppResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const generateAccessLogs: (
  input: GenerateAccessLogsRequest,
) => effect.Effect<
  GenerateAccessLogsResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApp: (
  input: GetAppRequest,
) => effect.Effect<
  GetAppResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBackendEnvironment: (
  input: GetBackendEnvironmentRequest,
) => effect.Effect<
  GetBackendEnvironmentResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBackendEnvironmentRequest,
  output: GetBackendEnvironmentResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns a branch for an Amplify app.
 */
export const getBranch: (
  input: GetBranchRequest,
) => effect.Effect<
  GetBranchResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDomainAssociation: (
  input: GetDomainAssociationRequest,
) => effect.Effect<
  GetDomainAssociationResult,
  | BadRequestException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDomainAssociationRequest,
  output: GetDomainAssociationResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Creates a new domain association for an Amplify app.
 */
export const updateDomainAssociation: (
  input: UpdateDomainAssociationRequest,
) => effect.Effect<
  UpdateDomainAssociationResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDomainAssociationRequest,
  output: UpdateDomainAssociationResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Updates a webhook.
 */
export const updateWebhook: (
  input: UpdateWebhookRequest,
) => effect.Effect<
  UpdateWebhookResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBackendEnvironment: (
  input: DeleteBackendEnvironmentRequest,
) => effect.Effect<
  DeleteBackendEnvironmentResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackendEnvironmentRequest,
  output: DeleteBackendEnvironmentResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a branch for an Amplify app.
 */
export const deleteBranch: (
  input: DeleteBranchRequest,
) => effect.Effect<
  DeleteBranchResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteApp: (
  input: DeleteAppRequest,
) => effect.Effect<
  DeleteAppResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDomainAssociation: (
  input: DeleteDomainAssociationRequest,
) => effect.Effect<
  DeleteDomainAssociationResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDomainAssociationRequest,
  output: DeleteDomainAssociationResult,
  errors: [
    BadRequestException,
    DependentServiceFailureException,
    InternalFailureException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Returns the artifact info that corresponds to an artifact id.
 */
export const getArtifactUrl: (
  input: GetArtifactUrlRequest,
) => effect.Effect<
  GetArtifactUrlResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWebhook: (
  input: GetWebhookRequest,
) => effect.Effect<
  GetWebhookResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResult,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResult,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    JobSummary,
    | BadRequestException
    | InternalFailureException
    | LimitExceededException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWebhooks: (
  input: ListWebhooksRequest,
) => effect.Effect<
  ListWebhooksResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startDeployment: (
  input: StartDeploymentRequest,
) => effect.Effect<
  StartDeploymentResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startJob: (
  input: StartJobRequest,
) => effect.Effect<
  StartJobResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopJob: (
  input: StopJobRequest,
) => effect.Effect<
  StopJobResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBackendEnvironment: (
  input: CreateBackendEnvironmentRequest,
) => effect.Effect<
  CreateBackendEnvironmentResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackendEnvironmentRequest,
  output: CreateBackendEnvironmentResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    LimitExceededException,
    NotFoundException,
    UnauthorizedException,
  ],
}));
/**
 * Deletes a job for a branch of an Amplify app.
 */
export const deleteJob: (
  input: DeleteJobRequest,
) => effect.Effect<
  DeleteJobResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listArtifacts: (
  input: ListArtifactsRequest,
) => effect.Effect<
  ListArtifactsResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApp: (
  input: CreateAppRequest,
) => effect.Effect<
  CreateAppResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBranch: (
  input: CreateBranchRequest,
) => effect.Effect<
  CreateBranchResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDomainAssociation: (
  input: CreateDomainAssociationRequest,
) => effect.Effect<
  CreateDomainAssociationResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new webhook on an Amplify app.
 */
export const createWebhook: (
  input: CreateWebhookRequest,
) => effect.Effect<
  CreateWebhookResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDeployment: (
  input: CreateDeploymentRequest,
) => effect.Effect<
  CreateDeploymentResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBackendEnvironments: (
  input: ListBackendEnvironmentsRequest,
) => effect.Effect<
  ListBackendEnvironmentsResult,
  | BadRequestException
  | InternalFailureException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBackendEnvironmentsRequest,
  output: ListBackendEnvironmentsResult,
  errors: [
    BadRequestException,
    InternalFailureException,
    UnauthorizedException,
  ],
}));
/**
 * Lists the branches of an Amplify app.
 */
export const listBranches: {
  (
    input: ListBranchesRequest,
  ): effect.Effect<
    ListBranchesResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBranchesRequest,
  ) => stream.Stream<
    ListBranchesResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBranchesRequest,
  ) => stream.Stream<
    Branch,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the domain associations for an Amplify app.
 */
export const listDomainAssociations: {
  (
    input: ListDomainAssociationsRequest,
  ): effect.Effect<
    ListDomainAssociationsResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDomainAssociationsRequest,
  ) => stream.Stream<
    ListDomainAssociationsResult,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDomainAssociationsRequest,
  ) => stream.Stream<
    DomainAssociation,
    | BadRequestException
    | InternalFailureException
    | UnauthorizedException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateBranch: (
  input: UpdateBranchRequest,
) => effect.Effect<
  UpdateBranchResult,
  | BadRequestException
  | DependentServiceFailureException
  | InternalFailureException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWebhook: (
  input: DeleteWebhookRequest,
) => effect.Effect<
  DeleteWebhookResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJob: (
  input: GetJobRequest,
) => effect.Effect<
  GetJobResult,
  | BadRequestException
  | InternalFailureException
  | LimitExceededException
  | NotFoundException
  | UnauthorizedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
