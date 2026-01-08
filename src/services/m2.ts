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
  sdkId: "m2",
  serviceShapeName: "AwsSupernovaControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "m2" });
const ver = T.ServiceVersion("2021-04-28");
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
              `https://m2-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://m2-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://m2.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://m2.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type EngineType = string;
export type NextToken = string;
export type MaxResults = number;
export type Arn = string;
export type TagKey = string;
export type EntityName = string;
export type EntityDescription = string;
export type ClientToken = string;
export type Identifier = string;
export type Version = number;
export type AuthSecretsManagerArn = string;
export type KMSKeyId = string;
export type String200 = string;
export type String100 = string;
export type BatchJobExecutionStatus = string;
export type String20 = string;
export type EngineVersion = string;
export type String50 = string;
export type NetworkType = string;
export type CapacityValue = number;
export type TagValue = string;
export type String2000 = string;
export type StringFree65000 = string;
export type BatchParamKey = string;
export type BatchParamValue = string;
export type ApplicationLifecycle = string;
export type Integer = number;
export type ApplicationVersionLifecycle = string;
export type BatchJobType = string;
export type DataSetTaskLifecycle = string;
export type DeploymentLifecycle = string;
export type EnvironmentLifecycle = string;
export type LogGroupIdentifier = string;
export type ApplicationDeploymentLifecycle = string;
export type ValidationExceptionReason = string;

//# Schemas
export interface GetSignedBluinsightsUrlRequest {}
export const GetSignedBluinsightsUrlRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSignedBluinsightsUrlRequest",
}) as any as S.Schema<GetSignedBluinsightsUrlRequest>;
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type EntityNameList = string[];
export const EntityNameList = S.Array(S.String);
export type IdentifierList = string[];
export const IdentifierList = S.Array(S.String);
export type String50List = string[];
export const String50List = S.Array(S.String);
export interface GetSignedBluinsightsUrlResponse {
  signedBiUrl: string;
}
export const GetSignedBluinsightsUrlResponse = S.suspend(() =>
  S.Struct({ signedBiUrl: S.String }),
).annotations({
  identifier: "GetSignedBluinsightsUrlResponse",
}) as any as S.Schema<GetSignedBluinsightsUrlResponse>;
export interface ListEngineVersionsRequest {
  engineType?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEngineVersionsRequest = S.suspend(() =>
  S.Struct({
    engineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/engine-versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEngineVersionsRequest",
}) as any as S.Schema<ListEngineVersionsRequest>;
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
export interface GetApplicationRequest {
  applicationId: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export type Definition = { s3Location: string } | { content: string };
export const Definition = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ content: S.String }),
);
export interface UpdateApplicationRequest {
  applicationId: string;
  description?: string;
  currentApplicationVersion: number;
  definition?: (typeof Definition)["Type"];
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    description: S.optional(S.String),
    currentApplicationVersion: S.Number,
    definition: S.optional(Definition),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface DeleteApplicationRequest {
  applicationId: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface ListApplicationsRequest {
  nextToken?: string;
  maxResults?: number;
  names?: EntityNameList;
  environmentId?: string;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    names: S.optional(EntityNameList).pipe(T.HttpQuery("names")),
    environmentId: S.optional(S.String).pipe(T.HttpQuery("environmentId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface CancelBatchJobExecutionRequest {
  applicationId: string;
  executionId: string;
  authSecretsManagerArn?: string;
}
export const CancelBatchJobExecutionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    authSecretsManagerArn: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CancelBatchJobExecutionRequest",
}) as any as S.Schema<CancelBatchJobExecutionRequest>;
export interface CancelBatchJobExecutionResponse {}
export const CancelBatchJobExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelBatchJobExecutionResponse",
}) as any as S.Schema<CancelBatchJobExecutionResponse>;
export interface CreateDeploymentRequest {
  environmentId: string;
  applicationId: string;
  applicationVersion: number;
  clientToken?: string;
}
export const CreateDeploymentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String,
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    applicationVersion: S.Number,
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDeploymentRequest",
}) as any as S.Schema<CreateDeploymentRequest>;
export interface DeleteApplicationFromEnvironmentRequest {
  applicationId: string;
  environmentId: string;
}
export const DeleteApplicationFromEnvironmentRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DeleteApplicationFromEnvironmentRequest",
}) as any as S.Schema<DeleteApplicationFromEnvironmentRequest>;
export interface DeleteApplicationFromEnvironmentResponse {}
export const DeleteApplicationFromEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationFromEnvironmentResponse",
}) as any as S.Schema<DeleteApplicationFromEnvironmentResponse>;
export interface GetApplicationVersionRequest {
  applicationId: string;
  applicationVersion: number;
}
export const GetApplicationVersionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    applicationVersion: S.Number.pipe(T.HttpLabel("applicationVersion")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetApplicationVersionRequest",
}) as any as S.Schema<GetApplicationVersionRequest>;
export interface GetBatchJobExecutionRequest {
  applicationId: string;
  executionId: string;
}
export const GetBatchJobExecutionRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetBatchJobExecutionRequest",
}) as any as S.Schema<GetBatchJobExecutionRequest>;
export interface GetDataSetDetailsRequest {
  applicationId: string;
  dataSetName: string;
}
export const GetDataSetDetailsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    dataSetName: S.String.pipe(T.HttpLabel("dataSetName")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataSetDetailsRequest",
}) as any as S.Schema<GetDataSetDetailsRequest>;
export interface GetDataSetExportTaskRequest {
  applicationId: string;
  taskId: string;
}
export const GetDataSetExportTaskRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataSetExportTaskRequest",
}) as any as S.Schema<GetDataSetExportTaskRequest>;
export interface GetDataSetImportTaskRequest {
  applicationId: string;
  taskId: string;
}
export const GetDataSetImportTaskRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    taskId: S.String.pipe(T.HttpLabel("taskId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDataSetImportTaskRequest",
}) as any as S.Schema<GetDataSetImportTaskRequest>;
export interface GetDeploymentRequest {
  deploymentId: string;
  applicationId: string;
}
export const GetDeploymentRequest = S.suspend(() =>
  S.Struct({
    deploymentId: S.String.pipe(T.HttpLabel("deploymentId")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetDeploymentRequest",
}) as any as S.Schema<GetDeploymentRequest>;
export interface ListApplicationVersionsRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
}
export const ListApplicationVersionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/versions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationVersionsRequest",
}) as any as S.Schema<ListApplicationVersionsRequest>;
export interface ListBatchJobDefinitionsRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
  prefix?: string;
}
export const ListBatchJobDefinitionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListBatchJobDefinitionsRequest",
}) as any as S.Schema<ListBatchJobDefinitionsRequest>;
export interface ListBatchJobExecutionsRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
  executionIds?: IdentifierList;
  jobName?: string;
  status?: string;
  startedAfter?: Date;
  startedBefore?: Date;
}
export const ListBatchJobExecutionsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "ListBatchJobExecutionsRequest",
}) as any as S.Schema<ListBatchJobExecutionsRequest>;
export interface ListBatchJobRestartPointsRequest {
  applicationId: string;
  executionId: string;
  authSecretsManagerArn?: string;
}
export const ListBatchJobRestartPointsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    executionId: S.String.pipe(T.HttpLabel("executionId")),
    authSecretsManagerArn: S.optional(S.String).pipe(
      T.HttpQuery("authSecretsManagerArn"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListBatchJobRestartPointsRequest",
}) as any as S.Schema<ListBatchJobRestartPointsRequest>;
export interface ListDataSetExportHistoryRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
}
export const ListDataSetExportHistoryRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataSetExportHistoryRequest",
}) as any as S.Schema<ListDataSetExportHistoryRequest>;
export interface ListDataSetImportHistoryRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
}
export const ListDataSetImportHistoryRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDataSetImportHistoryRequest",
}) as any as S.Schema<ListDataSetImportHistoryRequest>;
export interface ListDataSetsRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
  prefix?: string;
  nameFilter?: string;
}
export const ListDataSetsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    prefix: S.optional(S.String).pipe(T.HttpQuery("prefix")),
    nameFilter: S.optional(S.String).pipe(T.HttpQuery("nameFilter")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/datasets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDataSetsRequest",
}) as any as S.Schema<ListDataSetsRequest>;
export interface ListDeploymentsRequest {
  nextToken?: string;
  maxResults?: number;
  applicationId: string;
}
export const ListDeploymentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/deployments",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDeploymentsRequest",
}) as any as S.Schema<ListDeploymentsRequest>;
export interface StartApplicationRequest {
  applicationId: string;
}
export const StartApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartApplicationRequest",
}) as any as S.Schema<StartApplicationRequest>;
export interface StartApplicationResponse {}
export const StartApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartApplicationResponse",
}) as any as S.Schema<StartApplicationResponse>;
export interface StopApplicationRequest {
  applicationId: string;
  forceStop?: boolean;
}
export const StopApplicationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    forceStop: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopApplicationRequest",
}) as any as S.Schema<StopApplicationRequest>;
export interface StopApplicationResponse {}
export const StopApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopApplicationResponse",
}) as any as S.Schema<StopApplicationResponse>;
export interface GetEnvironmentRequest {
  environmentId: string;
}
export const GetEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetEnvironmentRequest",
}) as any as S.Schema<GetEnvironmentRequest>;
export interface UpdateEnvironmentRequest {
  environmentId: string;
  desiredCapacity?: number;
  instanceType?: string;
  engineVersion?: string;
  preferredMaintenanceWindow?: string;
  applyDuringMaintenanceWindow?: boolean;
  forceUpdate?: boolean;
}
export const UpdateEnvironmentRequest = S.suspend(() =>
  S.Struct({
    environmentId: S.String.pipe(T.HttpLabel("environmentId")),
    desiredCapacity: S.optional(S.Number),
    instanceType: S.optional(S.String),
    engineVersion: S.optional(S.String),
    preferredMaintenanceWindow: S.optional(S.String),
    applyDuringMaintenanceWindow: S.optional(S.Boolean),
    forceUpdate: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEnvironmentRequest",
}) as any as S.Schema<UpdateEnvironmentRequest>;
export interface DeleteEnvironmentRequest {
  environmentId: string;
}
export const DeleteEnvironmentRequest = S.suspend(() =>
  S.Struct({ environmentId: S.String.pipe(T.HttpLabel("environmentId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/environments/{environmentId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteEnvironmentRequest",
}) as any as S.Schema<DeleteEnvironmentRequest>;
export interface DeleteEnvironmentResponse {}
export const DeleteEnvironmentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteEnvironmentResponse",
}) as any as S.Schema<DeleteEnvironmentResponse>;
export interface ListEnvironmentsRequest {
  nextToken?: string;
  maxResults?: number;
  names?: EntityNameList;
  engineType?: string;
}
export const ListEnvironmentsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    names: S.optional(EntityNameList).pipe(T.HttpQuery("names")),
    engineType: S.optional(S.String).pipe(T.HttpQuery("engineType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEnvironmentsRequest",
}) as any as S.Schema<ListEnvironmentsRequest>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type ArnList = string[];
export const ArnList = S.Array(S.String);
export type PortList = number[];
export const PortList = S.Array(S.Number);
export interface ApplicationVersionSummary {
  applicationVersion: number;
  status: string;
  statusReason?: string;
  creationTime: Date;
}
export const ApplicationVersionSummary = S.suspend(() =>
  S.Struct({
    applicationVersion: S.Number,
    status: S.String,
    statusReason: S.optional(S.String),
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ApplicationVersionSummary",
}) as any as S.Schema<ApplicationVersionSummary>;
export type ApplicationVersionSummaryList = ApplicationVersionSummary[];
export const ApplicationVersionSummaryList = S.Array(ApplicationVersionSummary);
export type BatchJobParametersMap = { [key: string]: string };
export const BatchJobParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface HighAvailabilityConfig {
  desiredCapacity: number;
}
export const HighAvailabilityConfig = S.suspend(() =>
  S.Struct({ desiredCapacity: S.Number }),
).annotations({
  identifier: "HighAvailabilityConfig",
}) as any as S.Schema<HighAvailabilityConfig>;
export interface ListTagsForResourceResponse {
  tags: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: TagMap }),
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
export interface CreateApplicationRequest {
  name: string;
  description?: string;
  engineType: string;
  definition: (typeof Definition)["Type"];
  tags?: TagMap;
  clientToken?: string;
  kmsKeyId?: string;
  roleArn?: string;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    description: S.optional(S.String),
    engineType: S.String,
    definition: Definition,
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
    roleArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface UpdateApplicationResponse {
  applicationVersion: number;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({ applicationVersion: S.Number }),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface CreateDeploymentResponse {
  deploymentId: string;
}
export const CreateDeploymentResponse = S.suspend(() =>
  S.Struct({ deploymentId: S.String }),
).annotations({
  identifier: "CreateDeploymentResponse",
}) as any as S.Schema<CreateDeploymentResponse>;
export interface GetApplicationVersionResponse {
  name: string;
  applicationVersion: number;
  description?: string;
  definitionContent: string;
  status: string;
  creationTime: Date;
  statusReason?: string;
}
export const GetApplicationVersionResponse = S.suspend(() =>
  S.Struct({
    name: S.String,
    applicationVersion: S.Number,
    description: S.optional(S.String),
    definitionContent: S.String,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetApplicationVersionResponse",
}) as any as S.Schema<GetApplicationVersionResponse>;
export interface GetDeploymentResponse {
  deploymentId: string;
  applicationId: string;
  environmentId: string;
  applicationVersion: number;
  status: string;
  creationTime: Date;
  statusReason?: string;
}
export const GetDeploymentResponse = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    applicationId: S.String,
    environmentId: S.String,
    applicationVersion: S.Number,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDeploymentResponse",
}) as any as S.Schema<GetDeploymentResponse>;
export interface ListApplicationVersionsResponse {
  applicationVersions: ApplicationVersionSummaryList;
  nextToken?: string;
}
export const ListApplicationVersionsResponse = S.suspend(() =>
  S.Struct({
    applicationVersions: ApplicationVersionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationVersionsResponse",
}) as any as S.Schema<ListApplicationVersionsResponse>;
export interface UpdateEnvironmentResponse {
  environmentId: string;
}
export const UpdateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "UpdateEnvironmentResponse",
}) as any as S.Schema<UpdateEnvironmentResponse>;
export interface FileBatchJobIdentifier {
  fileName: string;
  folderPath?: string;
}
export const FileBatchJobIdentifier = S.suspend(() =>
  S.Struct({ fileName: S.String, folderPath: S.optional(S.String) }),
).annotations({
  identifier: "FileBatchJobIdentifier",
}) as any as S.Schema<FileBatchJobIdentifier>;
export interface ScriptBatchJobIdentifier {
  scriptName: string;
}
export const ScriptBatchJobIdentifier = S.suspend(() =>
  S.Struct({ scriptName: S.String }),
).annotations({
  identifier: "ScriptBatchJobIdentifier",
}) as any as S.Schema<ScriptBatchJobIdentifier>;
export interface JobStepRestartMarker {
  fromStep: string;
  fromProcStep?: string;
  toStep?: string;
  toProcStep?: string;
  stepCheckpoint?: number;
  skip?: boolean;
}
export const JobStepRestartMarker = S.suspend(() =>
  S.Struct({
    fromStep: S.String,
    fromProcStep: S.optional(S.String),
    toStep: S.optional(S.String),
    toProcStep: S.optional(S.String),
    stepCheckpoint: S.optional(S.Number),
    skip: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "JobStepRestartMarker",
}) as any as S.Schema<JobStepRestartMarker>;
export interface RestartBatchJobIdentifier {
  executionId: string;
  jobStepRestartMarker: JobStepRestartMarker;
}
export const RestartBatchJobIdentifier = S.suspend(() =>
  S.Struct({
    executionId: S.String,
    jobStepRestartMarker: JobStepRestartMarker,
  }),
).annotations({
  identifier: "RestartBatchJobIdentifier",
}) as any as S.Schema<RestartBatchJobIdentifier>;
export interface EfsStorageConfiguration {
  fileSystemId: string;
  mountPoint: string;
}
export const EfsStorageConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.String.pipe(T.JsonName("file-system-id")),
    mountPoint: S.String.pipe(T.JsonName("mount-point")),
  }),
).annotations({
  identifier: "EfsStorageConfiguration",
}) as any as S.Schema<EfsStorageConfiguration>;
export interface FsxStorageConfiguration {
  fileSystemId: string;
  mountPoint: string;
}
export const FsxStorageConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.String.pipe(T.JsonName("file-system-id")),
    mountPoint: S.String.pipe(T.JsonName("mount-point")),
  }),
).annotations({
  identifier: "FsxStorageConfiguration",
}) as any as S.Schema<FsxStorageConfiguration>;
export interface EngineVersionsSummary {
  engineType: string;
  engineVersion: string;
}
export const EngineVersionsSummary = S.suspend(() =>
  S.Struct({ engineType: S.String, engineVersion: S.String }),
).annotations({
  identifier: "EngineVersionsSummary",
}) as any as S.Schema<EngineVersionsSummary>;
export type EngineVersionsSummaryList = EngineVersionsSummary[];
export const EngineVersionsSummaryList = S.Array(EngineVersionsSummary);
export interface DeployedVersionSummary {
  applicationVersion: number;
  status: string;
  statusReason?: string;
}
export const DeployedVersionSummary = S.suspend(() =>
  S.Struct({
    applicationVersion: S.Number,
    status: S.String,
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DeployedVersionSummary",
}) as any as S.Schema<DeployedVersionSummary>;
export interface LogGroupSummary {
  logType: string;
  logGroupName: string;
}
export const LogGroupSummary = S.suspend(() =>
  S.Struct({ logType: S.String, logGroupName: S.String }),
).annotations({
  identifier: "LogGroupSummary",
}) as any as S.Schema<LogGroupSummary>;
export type LogGroupSummaries = LogGroupSummary[];
export const LogGroupSummaries = S.Array(LogGroupSummary);
export interface ApplicationSummary {
  name: string;
  description?: string;
  applicationId: string;
  applicationArn: string;
  applicationVersion: number;
  status: string;
  engineType: string;
  creationTime: Date;
  environmentId?: string;
  lastStartTime?: Date;
  versionStatus?: string;
  deploymentStatus?: string;
  roleArn?: string;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationSummaryList = ApplicationSummary[];
export const ApplicationSummaryList = S.Array(ApplicationSummary);
export interface DataSetExportSummary {
  total: number;
  succeeded: number;
  failed: number;
  pending: number;
  inProgress: number;
}
export const DataSetExportSummary = S.suspend(() =>
  S.Struct({
    total: S.Number,
    succeeded: S.Number,
    failed: S.Number,
    pending: S.Number,
    inProgress: S.Number,
  }),
).annotations({
  identifier: "DataSetExportSummary",
}) as any as S.Schema<DataSetExportSummary>;
export interface DataSetImportSummary {
  total: number;
  succeeded: number;
  failed: number;
  pending: number;
  inProgress: number;
}
export const DataSetImportSummary = S.suspend(() =>
  S.Struct({
    total: S.Number,
    succeeded: S.Number,
    failed: S.Number,
    pending: S.Number,
    inProgress: S.Number,
  }),
).annotations({
  identifier: "DataSetImportSummary",
}) as any as S.Schema<DataSetImportSummary>;
export type JobIdentifier = { fileName: string } | { scriptName: string };
export const JobIdentifier = S.Union(
  S.Struct({ fileName: S.String }),
  S.Struct({ scriptName: S.String }),
);
export interface S3BatchJobIdentifier {
  bucket: string;
  keyPrefix?: string;
  identifier: (typeof JobIdentifier)["Type"];
}
export const S3BatchJobIdentifier = S.suspend(() =>
  S.Struct({
    bucket: S.String,
    keyPrefix: S.optional(S.String),
    identifier: JobIdentifier,
  }),
).annotations({
  identifier: "S3BatchJobIdentifier",
}) as any as S.Schema<S3BatchJobIdentifier>;
export type BatchJobIdentifier =
  | { fileBatchJobIdentifier: FileBatchJobIdentifier }
  | { scriptBatchJobIdentifier: ScriptBatchJobIdentifier }
  | { s3BatchJobIdentifier: S3BatchJobIdentifier }
  | { restartBatchJobIdentifier: RestartBatchJobIdentifier };
export const BatchJobIdentifier = S.Union(
  S.Struct({ fileBatchJobIdentifier: FileBatchJobIdentifier }),
  S.Struct({ scriptBatchJobIdentifier: ScriptBatchJobIdentifier }),
  S.Struct({ s3BatchJobIdentifier: S3BatchJobIdentifier }),
  S.Struct({ restartBatchJobIdentifier: RestartBatchJobIdentifier }),
);
export interface BatchJobExecutionSummary {
  executionId: string;
  applicationId: string;
  jobId?: string;
  jobName?: string;
  jobType?: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  returnCode?: string;
  batchJobIdentifier?: (typeof BatchJobIdentifier)["Type"];
}
export const BatchJobExecutionSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "BatchJobExecutionSummary",
}) as any as S.Schema<BatchJobExecutionSummary>;
export type BatchJobExecutionSummaryList = BatchJobExecutionSummary[];
export const BatchJobExecutionSummaryList = S.Array(BatchJobExecutionSummary);
export interface JobStep {
  stepNumber?: number;
  stepName?: string;
  procStepNumber?: number;
  procStepName?: string;
  stepCondCode?: string;
  stepRestartable?: boolean;
  stepCheckpoint?: number;
  stepCheckpointStatus?: string;
  stepCheckpointTime?: Date;
}
export const JobStep = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "JobStep" }) as any as S.Schema<JobStep>;
export type BatchJobStepList = JobStep[];
export const BatchJobStepList = S.Array(JobStep);
export interface DataSetExportTask {
  taskId: string;
  status: string;
  summary: DataSetExportSummary;
  statusReason?: string;
}
export const DataSetExportTask = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    status: S.String,
    summary: DataSetExportSummary,
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSetExportTask",
}) as any as S.Schema<DataSetExportTask>;
export type DataSetExportTaskList = DataSetExportTask[];
export const DataSetExportTaskList = S.Array(DataSetExportTask);
export interface DataSetImportTask {
  taskId: string;
  status: string;
  summary: DataSetImportSummary;
  statusReason?: string;
}
export const DataSetImportTask = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    status: S.String,
    summary: DataSetImportSummary,
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DataSetImportTask",
}) as any as S.Schema<DataSetImportTask>;
export type DataSetImportTaskList = DataSetImportTask[];
export const DataSetImportTaskList = S.Array(DataSetImportTask);
export interface DataSetSummary {
  dataSetName: string;
  dataSetOrg?: string;
  format?: string;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  lastReferencedTime?: Date;
}
export const DataSetSummary = S.suspend(() =>
  S.Struct({
    dataSetName: S.String,
    dataSetOrg: S.optional(S.String),
    format: S.optional(S.String),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastReferencedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DataSetSummary",
}) as any as S.Schema<DataSetSummary>;
export type DataSetsSummaryList = DataSetSummary[];
export const DataSetsSummaryList = S.Array(DataSetSummary);
export interface DeploymentSummary {
  deploymentId: string;
  applicationId: string;
  environmentId: string;
  applicationVersion: number;
  status: string;
  creationTime: Date;
  statusReason?: string;
}
export const DeploymentSummary = S.suspend(() =>
  S.Struct({
    deploymentId: S.String,
    applicationId: S.String,
    environmentId: S.String,
    applicationVersion: S.Number,
    status: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "DeploymentSummary",
}) as any as S.Schema<DeploymentSummary>;
export type DeploymentList = DeploymentSummary[];
export const DeploymentList = S.Array(DeploymentSummary);
export type StorageConfiguration =
  | { efs: EfsStorageConfiguration }
  | { fsx: FsxStorageConfiguration };
export const StorageConfiguration = S.Union(
  S.Struct({ efs: EfsStorageConfiguration }),
  S.Struct({ fsx: FsxStorageConfiguration }),
);
export type StorageConfigurationList = (typeof StorageConfiguration)["Type"][];
export const StorageConfigurationList = S.Array(StorageConfiguration);
export interface EnvironmentSummary {
  name: string;
  environmentArn: string;
  environmentId: string;
  instanceType: string;
  status: string;
  engineType: string;
  engineVersion: string;
  creationTime: Date;
  networkType?: string;
}
export const EnvironmentSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    environmentArn: S.String,
    environmentId: S.String,
    instanceType: S.String,
    status: S.String,
    engineType: S.String,
    engineVersion: S.String,
    creationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    networkType: S.optional(S.String),
  }),
).annotations({
  identifier: "EnvironmentSummary",
}) as any as S.Schema<EnvironmentSummary>;
export type EnvironmentSummaryList = EnvironmentSummary[];
export const EnvironmentSummaryList = S.Array(EnvironmentSummary);
export type ExternalLocation = { s3Location: string };
export const ExternalLocation = S.Union(S.Struct({ s3Location: S.String }));
export interface ListEngineVersionsResponse {
  engineVersions: EngineVersionsSummaryList;
  nextToken?: string;
}
export const ListEngineVersionsResponse = S.suspend(() =>
  S.Struct({
    engineVersions: EngineVersionsSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngineVersionsResponse",
}) as any as S.Schema<ListEngineVersionsResponse>;
export interface CreateApplicationResponse {
  applicationArn: string;
  applicationId: string;
  applicationVersion: number;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({
    applicationArn: S.String,
    applicationId: S.String,
    applicationVersion: S.Number,
  }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface GetApplicationResponse {
  name: string;
  description?: string;
  applicationId: string;
  applicationArn: string;
  status: string;
  latestVersion: ApplicationVersionSummary;
  deployedVersion?: DeployedVersionSummary;
  engineType: string;
  logGroups?: LogGroupSummaries;
  creationTime: Date;
  lastStartTime?: Date;
  tags?: TagMap;
  environmentId?: string;
  targetGroupArns?: ArnList;
  listenerArns?: ArnList;
  listenerPorts?: PortList;
  loadBalancerDnsName?: string;
  statusReason?: string;
  kmsKeyId?: string;
  roleArn?: string;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;
export interface ListApplicationsResponse {
  applications: ApplicationSummaryList;
  nextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    applications: ApplicationSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface GetBatchJobExecutionResponse {
  executionId: string;
  applicationId: string;
  jobId?: string;
  jobName?: string;
  jobUser?: string;
  jobType?: string;
  status: string;
  startTime: Date;
  endTime?: Date;
  statusReason?: string;
  returnCode?: string;
  batchJobIdentifier?: (typeof BatchJobIdentifier)["Type"];
  jobStepRestartMarker?: JobStepRestartMarker;
}
export const GetBatchJobExecutionResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetBatchJobExecutionResponse",
}) as any as S.Schema<GetBatchJobExecutionResponse>;
export interface GetDataSetExportTaskResponse {
  taskId: string;
  status: string;
  summary?: DataSetExportSummary;
  statusReason?: string;
  kmsKeyArn?: string;
}
export const GetDataSetExportTaskResponse = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    status: S.String,
    summary: S.optional(DataSetExportSummary),
    statusReason: S.optional(S.String),
    kmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataSetExportTaskResponse",
}) as any as S.Schema<GetDataSetExportTaskResponse>;
export interface GetDataSetImportTaskResponse {
  taskId: string;
  status: string;
  summary?: DataSetImportSummary;
}
export const GetDataSetImportTaskResponse = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    status: S.String,
    summary: S.optional(DataSetImportSummary),
  }),
).annotations({
  identifier: "GetDataSetImportTaskResponse",
}) as any as S.Schema<GetDataSetImportTaskResponse>;
export interface ListBatchJobExecutionsResponse {
  batchJobExecutions: BatchJobExecutionSummaryList;
  nextToken?: string;
}
export const ListBatchJobExecutionsResponse = S.suspend(() =>
  S.Struct({
    batchJobExecutions: BatchJobExecutionSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBatchJobExecutionsResponse",
}) as any as S.Schema<ListBatchJobExecutionsResponse>;
export interface ListBatchJobRestartPointsResponse {
  batchJobSteps?: BatchJobStepList;
}
export const ListBatchJobRestartPointsResponse = S.suspend(() =>
  S.Struct({ batchJobSteps: S.optional(BatchJobStepList) }),
).annotations({
  identifier: "ListBatchJobRestartPointsResponse",
}) as any as S.Schema<ListBatchJobRestartPointsResponse>;
export interface ListDataSetExportHistoryResponse {
  dataSetExportTasks: DataSetExportTaskList;
  nextToken?: string;
}
export const ListDataSetExportHistoryResponse = S.suspend(() =>
  S.Struct({
    dataSetExportTasks: DataSetExportTaskList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSetExportHistoryResponse",
}) as any as S.Schema<ListDataSetExportHistoryResponse>;
export interface ListDataSetImportHistoryResponse {
  dataSetImportTasks: DataSetImportTaskList;
  nextToken?: string;
}
export const ListDataSetImportHistoryResponse = S.suspend(() =>
  S.Struct({
    dataSetImportTasks: DataSetImportTaskList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataSetImportHistoryResponse",
}) as any as S.Schema<ListDataSetImportHistoryResponse>;
export interface ListDataSetsResponse {
  dataSets: DataSetsSummaryList;
  nextToken?: string;
}
export const ListDataSetsResponse = S.suspend(() =>
  S.Struct({ dataSets: DataSetsSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDataSetsResponse",
}) as any as S.Schema<ListDataSetsResponse>;
export interface ListDeploymentsResponse {
  deployments: DeploymentList;
  nextToken?: string;
}
export const ListDeploymentsResponse = S.suspend(() =>
  S.Struct({ deployments: DeploymentList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListDeploymentsResponse",
}) as any as S.Schema<ListDeploymentsResponse>;
export interface CreateEnvironmentRequest {
  name: string;
  instanceType: string;
  description?: string;
  engineType: string;
  engineVersion?: string;
  subnetIds?: String50List;
  securityGroupIds?: String50List;
  storageConfigurations?: StorageConfigurationList;
  publiclyAccessible?: boolean;
  highAvailabilityConfig?: HighAvailabilityConfig;
  tags?: TagMap;
  preferredMaintenanceWindow?: string;
  networkType?: string;
  clientToken?: string;
  kmsKeyId?: string;
}
export const CreateEnvironmentRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/environments" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateEnvironmentRequest",
}) as any as S.Schema<CreateEnvironmentRequest>;
export interface ListEnvironmentsResponse {
  environments: EnvironmentSummaryList;
  nextToken?: string;
}
export const ListEnvironmentsResponse = S.suspend(() =>
  S.Struct({
    environments: EnvironmentSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnvironmentsResponse",
}) as any as S.Schema<ListEnvironmentsResponse>;
export interface DataSetExportItem {
  datasetName: string;
  externalLocation: (typeof ExternalLocation)["Type"];
}
export const DataSetExportItem = S.suspend(() =>
  S.Struct({ datasetName: S.String, externalLocation: ExternalLocation }),
).annotations({
  identifier: "DataSetExportItem",
}) as any as S.Schema<DataSetExportItem>;
export type DataSetExportList = DataSetExportItem[];
export const DataSetExportList = S.Array(DataSetExportItem);
export interface GdgDetailAttributes {
  limit?: number;
  rollDisposition?: string;
}
export const GdgDetailAttributes = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number),
    rollDisposition: S.optional(S.String),
  }),
).annotations({
  identifier: "GdgDetailAttributes",
}) as any as S.Schema<GdgDetailAttributes>;
export interface PoDetailAttributes {
  format: string;
  encoding: string;
}
export const PoDetailAttributes = S.suspend(() =>
  S.Struct({ format: S.String, encoding: S.String }),
).annotations({
  identifier: "PoDetailAttributes",
}) as any as S.Schema<PoDetailAttributes>;
export interface PsDetailAttributes {
  format: string;
  encoding: string;
}
export const PsDetailAttributes = S.suspend(() =>
  S.Struct({ format: S.String, encoding: S.String }),
).annotations({
  identifier: "PsDetailAttributes",
}) as any as S.Schema<PsDetailAttributes>;
export interface FileBatchJobDefinition {
  fileName: string;
  folderPath?: string;
}
export const FileBatchJobDefinition = S.suspend(() =>
  S.Struct({ fileName: S.String, folderPath: S.optional(S.String) }),
).annotations({
  identifier: "FileBatchJobDefinition",
}) as any as S.Schema<FileBatchJobDefinition>;
export interface ScriptBatchJobDefinition {
  scriptName: string;
}
export const ScriptBatchJobDefinition = S.suspend(() =>
  S.Struct({ scriptName: S.String }),
).annotations({
  identifier: "ScriptBatchJobDefinition",
}) as any as S.Schema<ScriptBatchJobDefinition>;
export interface MaintenanceSchedule {
  startTime?: Date;
  endTime?: Date;
}
export const MaintenanceSchedule = S.suspend(() =>
  S.Struct({
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "MaintenanceSchedule",
}) as any as S.Schema<MaintenanceSchedule>;
export interface RecordLength {
  min: number;
  max: number;
}
export const RecordLength = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.Number }),
).annotations({ identifier: "RecordLength" }) as any as S.Schema<RecordLength>;
export type DataSetExportConfig =
  | { s3Location: string }
  | { dataSets: DataSetExportList };
export const DataSetExportConfig = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ dataSets: DataSetExportList }),
);
export type String20List = string[];
export const String20List = S.Array(S.String);
export type BatchJobDefinition =
  | { fileBatchJobDefinition: FileBatchJobDefinition }
  | { scriptBatchJobDefinition: ScriptBatchJobDefinition };
export const BatchJobDefinition = S.Union(
  S.Struct({ fileBatchJobDefinition: FileBatchJobDefinition }),
  S.Struct({ scriptBatchJobDefinition: ScriptBatchJobDefinition }),
);
export type BatchJobDefinitions = (typeof BatchJobDefinition)["Type"][];
export const BatchJobDefinitions = S.Array(BatchJobDefinition);
export interface PendingMaintenance {
  schedule?: MaintenanceSchedule;
  engineVersion?: string;
}
export const PendingMaintenance = S.suspend(() =>
  S.Struct({
    schedule: S.optional(MaintenanceSchedule),
    engineVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingMaintenance",
}) as any as S.Schema<PendingMaintenance>;
export interface PrimaryKey {
  name?: string;
  offset: number;
  length: number;
}
export const PrimaryKey = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), offset: S.Number, length: S.Number }),
).annotations({ identifier: "PrimaryKey" }) as any as S.Schema<PrimaryKey>;
export interface AlternateKey {
  name?: string;
  offset: number;
  length: number;
  allowDuplicates?: boolean;
}
export const AlternateKey = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    offset: S.Number,
    length: S.Number,
    allowDuplicates: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AlternateKey" }) as any as S.Schema<AlternateKey>;
export type AlternateKeyList = AlternateKey[];
export const AlternateKeyList = S.Array(AlternateKey);
export interface CreateDataSetExportTaskRequest {
  applicationId: string;
  exportConfig: (typeof DataSetExportConfig)["Type"];
  clientToken?: string;
  kmsKeyId?: string;
}
export const CreateDataSetExportTaskRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    exportConfig: DataSetExportConfig,
    clientToken: S.optional(S.String),
    kmsKeyId: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataSetExportTaskRequest",
}) as any as S.Schema<CreateDataSetExportTaskRequest>;
export interface VsamAttributes {
  format: string;
  encoding?: string;
  compressed?: boolean;
  primaryKey?: PrimaryKey;
  alternateKeys?: AlternateKeyList;
}
export const VsamAttributes = S.suspend(() =>
  S.Struct({
    format: S.String,
    encoding: S.optional(S.String),
    compressed: S.optional(S.Boolean),
    primaryKey: S.optional(PrimaryKey),
    alternateKeys: S.optional(AlternateKeyList),
  }),
).annotations({
  identifier: "VsamAttributes",
}) as any as S.Schema<VsamAttributes>;
export interface GdgAttributes {
  limit?: number;
  rollDisposition?: string;
}
export const GdgAttributes = S.suspend(() =>
  S.Struct({
    limit: S.optional(S.Number),
    rollDisposition: S.optional(S.String),
  }),
).annotations({
  identifier: "GdgAttributes",
}) as any as S.Schema<GdgAttributes>;
export interface PoAttributes {
  format: string;
  encoding?: string;
  memberFileExtensions: String20List;
}
export const PoAttributes = S.suspend(() =>
  S.Struct({
    format: S.String,
    encoding: S.optional(S.String),
    memberFileExtensions: String20List,
  }),
).annotations({ identifier: "PoAttributes" }) as any as S.Schema<PoAttributes>;
export interface PsAttributes {
  format: string;
  encoding?: string;
}
export const PsAttributes = S.suspend(() =>
  S.Struct({ format: S.String, encoding: S.optional(S.String) }),
).annotations({ identifier: "PsAttributes" }) as any as S.Schema<PsAttributes>;
export interface ListBatchJobDefinitionsResponse {
  batchJobDefinitions: BatchJobDefinitions;
  nextToken?: string;
}
export const ListBatchJobDefinitionsResponse = S.suspend(() =>
  S.Struct({
    batchJobDefinitions: BatchJobDefinitions,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBatchJobDefinitionsResponse",
}) as any as S.Schema<ListBatchJobDefinitionsResponse>;
export interface StartBatchJobRequest {
  applicationId: string;
  batchJobIdentifier: (typeof BatchJobIdentifier)["Type"];
  jobParams?: BatchJobParametersMap;
  authSecretsManagerArn?: string;
}
export const StartBatchJobRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    batchJobIdentifier: BatchJobIdentifier,
    jobParams: S.optional(BatchJobParametersMap),
    authSecretsManagerArn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/applications/{applicationId}/batch-job",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartBatchJobRequest",
}) as any as S.Schema<StartBatchJobRequest>;
export interface CreateEnvironmentResponse {
  environmentId: string;
}
export const CreateEnvironmentResponse = S.suspend(() =>
  S.Struct({ environmentId: S.String }),
).annotations({
  identifier: "CreateEnvironmentResponse",
}) as any as S.Schema<CreateEnvironmentResponse>;
export interface GetEnvironmentResponse {
  name: string;
  description?: string;
  environmentArn: string;
  environmentId: string;
  instanceType: string;
  status: string;
  engineType: string;
  engineVersion: string;
  vpcId: string;
  subnetIds: String50List;
  securityGroupIds: String50List;
  creationTime: Date;
  storageConfigurations?: StorageConfigurationList;
  tags?: TagMap;
  highAvailabilityConfig?: HighAvailabilityConfig;
  publiclyAccessible?: boolean;
  actualCapacity?: number;
  loadBalancerArn?: string;
  statusReason?: string;
  preferredMaintenanceWindow?: string;
  pendingMaintenance?: PendingMaintenance;
  kmsKeyId?: string;
  networkType?: string;
}
export const GetEnvironmentResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetEnvironmentResponse",
}) as any as S.Schema<GetEnvironmentResponse>;
export interface VsamDetailAttributes {
  encoding?: string;
  recordFormat?: string;
  compressed?: boolean;
  cacheAtStartup?: boolean;
  primaryKey?: PrimaryKey;
  alternateKeys?: AlternateKeyList;
}
export const VsamDetailAttributes = S.suspend(() =>
  S.Struct({
    encoding: S.optional(S.String),
    recordFormat: S.optional(S.String),
    compressed: S.optional(S.Boolean),
    cacheAtStartup: S.optional(S.Boolean),
    primaryKey: S.optional(PrimaryKey),
    alternateKeys: S.optional(AlternateKeyList),
  }),
).annotations({
  identifier: "VsamDetailAttributes",
}) as any as S.Schema<VsamDetailAttributes>;
export type DatasetOrgAttributes =
  | { vsam: VsamAttributes }
  | { gdg: GdgAttributes }
  | { po: PoAttributes }
  | { ps: PsAttributes };
export const DatasetOrgAttributes = S.Union(
  S.Struct({ vsam: VsamAttributes }),
  S.Struct({ gdg: GdgAttributes }),
  S.Struct({ po: PoAttributes }),
  S.Struct({ ps: PsAttributes }),
);
export type DatasetDetailOrgAttributes =
  | { vsam: VsamDetailAttributes }
  | { gdg: GdgDetailAttributes }
  | { po: PoDetailAttributes }
  | { ps: PsDetailAttributes };
export const DatasetDetailOrgAttributes = S.Union(
  S.Struct({ vsam: VsamDetailAttributes }),
  S.Struct({ gdg: GdgDetailAttributes }),
  S.Struct({ po: PoDetailAttributes }),
  S.Struct({ ps: PsDetailAttributes }),
);
export interface DataSet {
  storageType?: string;
  datasetName: string;
  datasetOrg: (typeof DatasetOrgAttributes)["Type"];
  relativePath?: string;
  recordLength: RecordLength;
}
export const DataSet = S.suspend(() =>
  S.Struct({
    storageType: S.optional(S.String),
    datasetName: S.String,
    datasetOrg: DatasetOrgAttributes,
    relativePath: S.optional(S.String),
    recordLength: RecordLength,
  }),
).annotations({ identifier: "DataSet" }) as any as S.Schema<DataSet>;
export interface CreateDataSetExportTaskResponse {
  taskId: string;
}
export const CreateDataSetExportTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.String }),
).annotations({
  identifier: "CreateDataSetExportTaskResponse",
}) as any as S.Schema<CreateDataSetExportTaskResponse>;
export interface GetDataSetDetailsResponse {
  dataSetName: string;
  dataSetOrg?: (typeof DatasetDetailOrgAttributes)["Type"];
  recordLength?: number;
  location?: string;
  blocksize?: number;
  creationTime?: Date;
  lastUpdatedTime?: Date;
  lastReferencedTime?: Date;
  fileSize?: number;
}
export const GetDataSetDetailsResponse = S.suspend(() =>
  S.Struct({
    dataSetName: S.String,
    dataSetOrg: S.optional(DatasetDetailOrgAttributes),
    recordLength: S.optional(S.Number),
    location: S.optional(S.String),
    blocksize: S.optional(S.Number),
    creationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastReferencedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    fileSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetDataSetDetailsResponse",
}) as any as S.Schema<GetDataSetDetailsResponse>;
export interface StartBatchJobResponse {
  executionId: string;
}
export const StartBatchJobResponse = S.suspend(() =>
  S.Struct({ executionId: S.String }),
).annotations({
  identifier: "StartBatchJobResponse",
}) as any as S.Schema<StartBatchJobResponse>;
export interface DataSetImportItem {
  dataSet: DataSet;
  externalLocation: (typeof ExternalLocation)["Type"];
}
export const DataSetImportItem = S.suspend(() =>
  S.Struct({ dataSet: DataSet, externalLocation: ExternalLocation }),
).annotations({
  identifier: "DataSetImportItem",
}) as any as S.Schema<DataSetImportItem>;
export type DataSetImportList = DataSetImportItem[];
export const DataSetImportList = S.Array(DataSetImportItem);
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
export type DataSetImportConfig =
  | { s3Location: string }
  | { dataSets: DataSetImportList };
export const DataSetImportConfig = S.Union(
  S.Struct({ s3Location: S.String }),
  S.Struct({ dataSets: DataSetImportList }),
);
export interface CreateDataSetImportTaskRequest {
  applicationId: string;
  importConfig: (typeof DataSetImportConfig)["Type"];
  clientToken?: string;
}
export const CreateDataSetImportTaskRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    importConfig: DataSetImportConfig,
    clientToken: S.optional(S.String),
  }).pipe(
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
  ),
).annotations({
  identifier: "CreateDataSetImportTaskRequest",
}) as any as S.Schema<CreateDataSetImportTaskRequest>;
export interface CreateDataSetImportTaskResponse {
  taskId: string;
}
export const CreateDataSetImportTaskResponse = S.suspend(() =>
  S.Struct({ taskId: S.String }),
).annotations({
  identifier: "CreateDataSetImportTaskResponse",
}) as any as S.Schema<CreateDataSetImportTaskResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ExecutionTimeoutException extends S.TaggedError<ExecutionTimeoutException>()(
  "ExecutionTimeoutException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withTimeoutError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Gets a single sign-on URL that can be used to connect to AWS Blu Insights.
 */
export const getSignedBluinsightsUrl: (
  input: GetSignedBluinsightsUrlRequest,
) => Effect.Effect<
  GetSignedBluinsightsUrlResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSignedBluinsightsUrlRequest,
  output: GetSignedBluinsightsUrlResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Describes the details of a specific application.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => Effect.Effect<
  GetApplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listBatchJobDefinitions: {
  (
    input: ListBatchJobDefinitionsRequest,
  ): Effect.Effect<
    ListBatchJobDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBatchJobDefinitionsRequest,
  ) => Stream.Stream<
    ListBatchJobDefinitionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBatchJobDefinitionsRequest,
  ) => Stream.Stream<
    BatchJobDefinition,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getEnvironment: (
  input: GetEnvironmentRequest,
) => Effect.Effect<
  GetEnvironmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEngineVersions: {
  (
    input: ListEngineVersionsRequest,
  ): Effect.Effect<
    ListEngineVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngineVersionsRequest,
  ) => Stream.Stream<
    ListEngineVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngineVersionsRequest,
  ) => Stream.Stream<
    EngineVersionsSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the applications associated with a specific Amazon Web Services account. You can provide the
 * unique identifier of a specific runtime environment in a query parameter to see all
 * applications associated with that environment.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): Effect.Effect<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ListApplicationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ApplicationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the runtime environments.
 */
export const listEnvironments: {
  (
    input: ListEnvironmentsRequest,
  ): Effect.Effect<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnvironmentsRequest,
  ) => Stream.Stream<
    ListEnvironmentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnvironmentsRequest,
  ) => Stream.Stream<
    EnvironmentSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Deletes a specific application. You cannot delete a running application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteEnvironment: (
  input: DeleteEnvironmentRequest,
) => Effect.Effect<
  DeleteEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBatchJobExecution: (
  input: GetBatchJobExecutionRequest,
) => Effect.Effect<
  GetBatchJobExecutionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBatchJobExecutionRequest,
  output: GetBatchJobExecutionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the status of a data set import task initiated with the CreateDataSetExportTask operation.
 */
export const getDataSetExportTask: (
  input: GetDataSetExportTaskRequest,
) => Effect.Effect<
  GetDataSetExportTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSetExportTaskRequest,
  output: GetDataSetExportTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets the status of a data set import task initiated with the CreateDataSetImportTask operation.
 */
export const getDataSetImportTask: (
  input: GetDataSetImportTaskRequest,
) => Effect.Effect<
  GetDataSetImportTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSetImportTaskRequest,
  output: GetDataSetImportTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists historical, current, and scheduled batch job executions for a specific
 * application.
 */
export const listBatchJobExecutions: {
  (
    input: ListBatchJobExecutionsRequest,
  ): Effect.Effect<
    ListBatchJobExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBatchJobExecutionsRequest,
  ) => Stream.Stream<
    ListBatchJobExecutionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBatchJobExecutionsRequest,
  ) => Stream.Stream<
    BatchJobExecutionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listBatchJobRestartPoints: (
  input: ListBatchJobRestartPointsRequest,
) => Effect.Effect<
  ListBatchJobRestartPointsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the data set exports for the specified application.
 */
export const listDataSetExportHistory: {
  (
    input: ListDataSetExportHistoryRequest,
  ): Effect.Effect<
    ListDataSetExportHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSetExportHistoryRequest,
  ) => Stream.Stream<
    ListDataSetExportHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSetExportHistoryRequest,
  ) => Stream.Stream<
    DataSetExportTask,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDataSetImportHistory: {
  (
    input: ListDataSetImportHistoryRequest,
  ): Effect.Effect<
    ListDataSetImportHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSetImportHistoryRequest,
  ) => Stream.Stream<
    ListDataSetImportHistoryResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSetImportHistoryRequest,
  ) => Stream.Stream<
    DataSetImportTask,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listDeployments: {
  (
    input: ListDeploymentsRequest,
  ): Effect.Effect<
    ListDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeploymentsRequest,
  ) => Stream.Stream<
    ListDeploymentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeploymentsRequest,
  ) => Stream.Stream<
    DeploymentSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the tags for the specified resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApplicationVersion: (
  input: GetApplicationVersionRequest,
) => Effect.Effect<
  GetApplicationVersionResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationVersionRequest,
  output: GetApplicationVersionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets details of a specific deployment with a given deployment identifier.
 */
export const getDeployment: (
  input: GetDeploymentRequest,
) => Effect.Effect<
  GetDeploymentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApplicationVersions: {
  (
    input: ListApplicationVersionsRequest,
  ): Effect.Effect<
    ListApplicationVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationVersionsRequest,
  ) => Stream.Stream<
    ListApplicationVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationVersionsRequest,
  ) => Stream.Stream<
    ApplicationVersionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelBatchJobExecution: (
  input: CancelBatchJobExecutionRequest,
) => Effect.Effect<
  CancelBatchJobExecutionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a specific application from the specific runtime environment where it was
 * previously deployed. You cannot delete a runtime environment using DeleteEnvironment if any
 * application has ever been deployed to it. This API removes the association of the
 * application with the runtime environment so you can delete the environment smoothly.
 */
export const deleteApplicationFromEnvironment: (
  input: DeleteApplicationFromEnvironmentRequest,
) => Effect.Effect<
  DeleteApplicationFromEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startApplication: (
  input: StartApplicationRequest,
) => Effect.Effect<
  StartApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopApplication: (
  input: StopApplicationRequest,
) => Effect.Effect<
  StopApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createEnvironment: (
  input: CreateEnvironmentRequest,
) => Effect.Effect<
  CreateEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDeployment: (
  input: CreateDeploymentRequest,
) => Effect.Effect<
  CreateDeploymentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateEnvironment: (
  input: UpdateEnvironmentRequest,
) => Effect.Effect<
  UpdateEnvironmentResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataSetExportTask: (
  input: CreateDataSetExportTaskRequest,
) => Effect.Effect<
  CreateDataSetExportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Lists the data sets imported for a specific application. In Amazon Web Services Mainframe Modernization, data sets are
 * associated with applications deployed on runtime environments. This is known as importing
 * data sets. Currently, Amazon Web Services Mainframe Modernization can import data sets into catalogs using CreateDataSetImportTask.
 */
export const listDataSets: {
  (
    input: ListDataSetsRequest,
  ): Effect.Effect<
    ListDataSetsResponse,
    | AccessDeniedException
    | ConflictException
    | ExecutionTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataSetsRequest,
  ) => Stream.Stream<
    ListDataSetsResponse,
    | AccessDeniedException
    | ConflictException
    | ExecutionTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataSetsRequest,
  ) => Stream.Stream<
    DataSetSummary,
    | AccessDeniedException
    | ConflictException
    | ExecutionTimeoutException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Starts a batch job and returns the unique identifier of this execution of the batch job.
 * The associated application must be running in order to start the batch job.
 */
export const startBatchJob: (
  input: StartBatchJobRequest,
) => Effect.Effect<
  StartBatchJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataSetDetails: (
  input: GetDataSetDetailsRequest,
) => Effect.Effect<
  GetDataSetDetailsResponse,
  | AccessDeniedException
  | ConflictException
  | ExecutionTimeoutException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataSetImportTask: (
  input: CreateDataSetImportTaskRequest,
) => Effect.Effect<
  CreateDataSetImportTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
